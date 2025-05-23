
import { StateCreator } from 'zustand';
import { UISlice, AppState } from '../types';
import type Language from '@/types/Language';

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (set, get) => ({
  activeScreen: 'welcome' as const,
  onboardingComplete: false,
  loading: false,
  language: 'en' as Language,
  dailyQuote: '',
  isDeveloperMode: false,
  
  checkOnboardingStatus: () => {
    const state = get();
    return state.onboardingComplete;
  },
  
  setOnboardingCompleted: (completed: boolean) => set({ onboardingComplete: completed }),
  setOnboardingComplete: (completed: boolean) => set({ onboardingComplete: completed }),
  setActiveScreen: (screen: string) => set({ activeScreen: screen }),
  setLanguage: (language: Language) => set({ language }),
  setDeveloperMode: (enabled: boolean) => set({ isDeveloperMode: enabled }),
  setDailyQuote: (quote: string) => set({ dailyQuote: quote })
});
