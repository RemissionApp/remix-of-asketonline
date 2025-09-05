import { useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { OnboardingStep } from '@/store/types/onboarding';
import { logger } from '@/utils/logger';

export const useOptimizedOnboarding = () => {
  const {
    currentStep,
    profileStepCompleted,
    preferencesStepCompleted,
    onboardingStepCompleted,
    loading,
    error,
    loadOnboardingState,
    updateOnboardingStep,
    completeStep,
    isStepCompleted,
    canProceedToStep,
    user,
    userProfile,
    isProfileComplete,
  } = useAppStore();

  // Load onboarding state when user is available
  useEffect(() => {
    if (user && !loading) {
      loadOnboardingState();
    }
  }, [user, loadOnboardingState, loading]);

  // Smart profile completion check
  const checkProfileCompletion = useCallback(async () => {
    if (!user) return false;

    const isComplete = isProfileComplete();
    
    if (isComplete && !profileStepCompleted) {
      logger.debug('Profile completed, updating onboarding state');
      await completeStep('profile');
      return true;
    }
    
    return isComplete;
  }, [user, isProfileComplete, profileStepCompleted, completeStep]);

  // Navigate to next step
  const proceedToStep = useCallback(async (step: OnboardingStep) => {
    if (!canProceedToStep(step)) {
      logger.warn(`Cannot proceed to step ${step} - requirements not met`);
      return false;
    }

    await updateOnboardingStep(step, false);
    return true;
  }, [canProceedToStep, updateOnboardingStep]);

  // Get current onboarding progress
  const getProgress = useCallback(() => {
    const steps = ['profile', 'preferences', 'tour'] as const;
    const completedSteps = steps.filter(step => isStepCompleted(step));
    
    return {
      currentStep,
      totalSteps: steps.length,
      completedSteps: completedSteps.length,
      progress: (completedSteps.length / steps.length) * 100,
      isComplete: completedSteps.length === steps.length,
    };
  }, [currentStep, isStepCompleted]);

  // Determine where user should be redirected
  const getRedirectPath = useCallback(() => {
    const progress = getProgress();
    
    if (!user) return '/auth';
    
    if (progress.isComplete || currentStep === 'complete') {
      return '/dashboard';
    }
    
    switch (currentStep) {
      case 'profile':
        return '/profile-setup';
      case 'preferences':
        return '/onboarding';
      case 'tour':
        return '/welcome';
      default:
        return '/profile-setup';
    }
  }, [user, currentStep, getProgress]);

  return {
    // State
    currentStep,
    loading,
    error,
    
    // Progress tracking
    progress: getProgress(),
    
    // Step completion status
    isProfileComplete: profileStepCompleted,
    isPreferencesComplete: preferencesStepCompleted,
    isOnboardingComplete: onboardingStepCompleted,
    
    // Actions
    checkProfileCompletion,
    proceedToStep,
    completeStep,
    updateOnboardingStep,
    
    // Navigation
    getRedirectPath,
    canProceedToStep,
    
    // Utilities
    refresh: loadOnboardingState,
  };
};