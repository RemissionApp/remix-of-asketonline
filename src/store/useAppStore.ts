
import { create } from 'zustand';
import { quotes } from './data/constants';
import { AppState } from './types';
import { createUISlice } from './slices/uiSlice';
import { createPactsSlice } from './slices/pactsSlice';
import { createUniverseSlice } from './slices/universeSlice';
import { createGamificationSlice } from './slices/gamificationSlice';
import { createProFeaturesSlice } from './slices/proFeaturesSlice';
import { createAuthSlice } from './slices/authSlice';
import { defaultAchievements } from './data/constants';
import { supabase } from '@/lib/supabase';

// Creating the store with all the slices and initializing auth
export const useAppStore = create<AppState>((set, get, api) => {
  // Initialize auth state
  const initializeAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        set({ user: data.session.user });
        // Initial load of user profile after authentication
        const loadProfileFn = get().loadUserProfile;
        if (typeof loadProfileFn === 'function') {
          setTimeout(() => loadProfileFn(), 0);
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth state:", error);
    }
  };

  // Call initialization
  initializeAuth();

  // Listen for auth state changes
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state change:", event, session?.user?.id);
    
    if (event === 'SIGNED_IN' && session?.user) {
      set({ user: session.user });
      
      // Load user data after auth state change, but defer to prevent deadlock
      const loadProfileFn = get().loadUserProfile;
      if (typeof loadProfileFn === 'function') {
        setTimeout(() => loadProfileFn(), 0);
      }
    } else if (event === 'SIGNED_OUT') {
      set({ user: null });
    }
  });

  return {
    // Initial state
    pacts: [],
    activeQuestions: [],
    dailyQuote: quotes[Math.floor(Math.random() * quotes.length)],
    userProfile: {
      name: 'Искатель',
      totalDays: 0,
      energyPoints: 0,
      goal: 'Познать свою истинную силу',
      isPro: false,
      rank: 'seeker',
      achievements: [...defaultAchievements]
    },
    user: null,
    loading: false,
    language: 'ru',
    
    // Combine all slices
    ...createUISlice(set, get, api),
    ...createPactsSlice(set, get, api),
    ...createUniverseSlice(set, get, api),
    ...createGamificationSlice(set, get, api),
    ...createProFeaturesSlice(set, get, api),
    ...createAuthSlice(set, get, api)
  };
});
