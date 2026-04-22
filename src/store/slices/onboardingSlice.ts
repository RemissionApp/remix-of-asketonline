import { StateCreator } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingState, OnboardingActions, OnboardingStep } from '../types/onboarding';
import { AppState } from '../types';
import { logger } from '@/utils/logger';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

export interface OnboardingSlice extends OnboardingState, OnboardingActions {
  loading: boolean;
  error: string | null;
}

export const createOnboardingSlice: StateCreator<
  AppState,
  [],
  [],
  OnboardingSlice
> = (set, get) => ({
  // Initial state
  currentStep: 'profile',
  profileStepCompleted: false,
  onboardingStepCompleted: false,
  preferencesStepCompleted: false,
  completedAt: null,
  lastSyncedAt: null,
  loading: false,
  error: null,

  // Load onboarding state with caching
  loadOnboardingState: async () => {
    const { user } = get();
    if (!user) {
      logger.warn('No user found when loading onboarding state');
      return;
    }

    // Check cache first
    const now = Date.now();
    const { lastSyncedAt } = get();
    if (lastSyncedAt && (now - lastSyncedAt.getTime()) < CACHE_TTL) {
      logger.debug('Using cached onboarding state');
      return;
    }

    set({ loading: true, error: null });

    try {
      // Batch fetch both profile and onboarding state
      const [profileResult, onboardingResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*, profile_step_completed')
          .eq('id', user.id)
          .single(),
        supabase
          .from('user_onboarding_state')
          .select('*')
          .eq('user_id', user.id)
          .single()
      ]);

      if (profileResult.error && profileResult.error.code !== 'PGRST116') {
        throw profileResult.error;
      }

      // Create onboarding state if it doesn't exist
      let onboardingData = onboardingResult.data;
      if (onboardingResult.error && onboardingResult.error.code === 'PGRST116') {
        const { data: newOnboarding, error: createError } = await supabase
          .from('user_onboarding_state')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (createError) throw createError;
        onboardingData = newOnboarding;
      }

      // Update state with fetched data - prioritize profiles table for profile_step_completed
      const profileData = profileResult.data;
      const profileCompleted = profileData?.profile_step_completed || false;
      
      set({
        currentStep: (onboardingData?.current_step || 'profile') as 'profile' | 'preferences' | 'tour' | 'complete',
        profileStepCompleted: profileCompleted,
        onboardingStepCompleted: onboardingData?.onboarding_step_completed || false,
        preferencesStepCompleted: onboardingData?.preferences_step_completed || false,
        completedAt: onboardingData?.completed_at ? new Date(onboardingData.completed_at) : null,
        lastSyncedAt: new Date(),
        loading: false,
        error: null,
      });

      logger.debug('Onboarding state loaded successfully', onboardingData);
    } catch (error) {
      logger.error('Failed to load onboarding state:', error);
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to load onboarding state' 
      });
    }
  },

  // Update onboarding step with optimistic updates
  updateOnboardingStep: async (step: OnboardingStep, completed = true) => {
    const { user } = get();
    if (!user) return;

    // Optimistic update
    const updates: any = { currentStep: step };
    
    if (step !== 'complete') {
      const stepKey = `${step}StepCompleted`;
      updates[stepKey] = completed;
    }

    if (completed && step === 'preferences') {
      updates.completedAt = new Date();
    }

    set(updates);

    try {
      // profile_step_completed lives in profiles table now (single source of truth)
      // Here we only persist onboarding-specific flags (preferences/onboarding/tour).
      const updateData: any = { current_step: step, user_id: user.id };

      if (step !== 'complete' && step !== 'profile') {
        updateData[`${step}_step_completed`] = completed;
      }

      if (completed && step === 'preferences') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('user_onboarding_state')
        .upsert(updateData, { onConflict: 'user_id' });

      if (error) throw error;

      set({ lastSyncedAt: new Date() });
      logger.debug('Onboarding step updated:', { step, completed });
    } catch (error) {
      logger.error('Failed to update onboarding step:', error);
      // Revert optimistic update on error
      get().loadOnboardingState();
    }
  },

  // Complete a specific step
  completeStep: async (step: Exclude<OnboardingStep, 'complete'>) => {
    await get().updateOnboardingStep(step, true);
    
    // Auto-advance to next step
    const nextSteps: Record<string, OnboardingStep> = {
      profile: 'preferences',
      preferences: 'tour',
      tour: 'complete'
    };

    const nextStep = nextSteps[step];
    if (nextStep) {
      await get().updateOnboardingStep(nextStep, false);
    }
  },

  // Reset onboarding (for testing/debugging)
  resetOnboarding: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_onboarding_state')
        .update({
          current_step: 'profile',
          onboarding_step_completed: false,
          preferences_step_completed: false,
          completed_at: null,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      set({
        currentStep: 'profile',
        profileStepCompleted: false,
        onboardingStepCompleted: false,
        preferencesStepCompleted: false,
        completedAt: null,
        lastSyncedAt: new Date(),
      });

      logger.debug('Onboarding reset successfully');
    } catch (error) {
      logger.error('Failed to reset onboarding:', error);
    }
  },

  // Check if a step is completed
  isStepCompleted: (step: OnboardingStep) => {
    const state = get();
    switch (step) {
      case 'profile':
        return state.profileStepCompleted;
      case 'preferences':
        return state.preferencesStepCompleted;
      case 'tour':
        return state.onboardingStepCompleted;
      case 'complete':
        return state.completedAt !== null;
      default:
        return false;
    }
  },

  // Check if user can proceed to a specific step
  canProceedToStep: (step: OnboardingStep) => {
    const state = get();
    switch (step) {
      case 'profile':
        return true; // Always can start with profile
      case 'preferences':
        return state.profileStepCompleted;
      case 'tour':
        return state.profileStepCompleted && state.preferencesStepCompleted;
      case 'complete':
        return state.profileStepCompleted && state.preferencesStepCompleted && state.onboardingStepCompleted;
      default:
        return false;
    }
  },
});