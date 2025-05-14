
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SupportedLanguage } from '@/i18n/translations';

// Define types
export interface UserProfile {
  name: string;
  birthDate: Date | null;
  rank: 'seeker' | 'pilgrim' | 'warrior' | 'master' | 'enlightened';
  level: number;
  experience: number;
  isPro: boolean;
}

interface AppState {
  // Navigation
  activeScreen: 'welcome' | 'language' | 'signin' | 'signup' | 'onboarding' | 'main' | 'create-pact' | 'universe' | 'profile' | 'comparison' | 'meditation';
  setActiveScreen: (screen: AppState['activeScreen']) => void;
  
  // Onboarding
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
  
  // Language
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  upgradeToPro: () => void;
  cancelProSubscription: () => void;
}

// Create store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Navigation
      activeScreen: 'welcome',
      setActiveScreen: (screen) => set({ activeScreen: screen }),
      
      // Onboarding
      onboardingComplete: false,
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
      
      // Language
      language: 'ru', // Default language
      setLanguage: (language) => set({ language }),
      
      // User Profile
      userProfile: {
        name: 'Искатель',
        birthDate: null,
        rank: 'seeker',
        level: 1,
        experience: 0,
        isPro: false,
      },
      updateUserProfile: (updates) => set((state) => ({
        userProfile: { ...state.userProfile, ...updates }
      })),
      upgradeToPro: () => set((state) => ({
        userProfile: { ...state.userProfile, isPro: true }
      })),
      cancelProSubscription: () => set((state) => ({
        userProfile: { ...state.userProfile, isPro: false }
      })),
    }),
    {
      name: 'asket-storage', // Name for localStorage
    }
  )
);
