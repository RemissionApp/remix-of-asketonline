import { StateCreator } from 'zustand';
import { AppState, ActiveScreen, AppLanguage } from '../types';

export interface OptimizedUISlice {
  activeScreen: ActiveScreen;
  onboardingComplete: boolean;
  loading: boolean;
  language: AppLanguage;
  dailyQuote: string;

  setActiveScreen: (screen: ActiveScreen) => void;
  setOnboardingComplete: (completed: boolean) => void;
  setLanguage: (language: AppLanguage) => void;
  setDailyQuote: (quote: string) => void;
}

export const createOptimizedUISlice: StateCreator<
  AppState,
  [],
  [],
  OptimizedUISlice
> = (set, get) => ({
  activeScreen: 'welcome',
  onboardingComplete: false,
  loading: false,
  language: 'ru',
  dailyQuote: '',

  setLanguage: language => {
    set({ language });
    localStorage.setItem('app-language', language);
  },

  setOnboardingComplete: completed => {
    set({ onboardingComplete: completed });
    localStorage.setItem('onboarded', String(completed));
  },

  setActiveScreen: screen => set({ activeScreen: screen }),
  setDailyQuote: quote => set({ dailyQuote: quote }),

  // Removed duplicate checkOnboardingStatus - using the one from authSlice
});
