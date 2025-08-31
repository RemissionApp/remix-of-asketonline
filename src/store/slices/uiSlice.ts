import { StateCreator } from 'zustand';
import { AppState, ActiveScreen, AppLanguage } from '../types';

export interface UISlice {
  activeScreen: ActiveScreen;
  onboardingComplete: boolean;
  loading: boolean;
  language: AppLanguage;
  dailyQuote: string;

  setActiveScreen: (screen: ActiveScreen) => void;
  setOnboardingComplete: (completed: boolean) => void;
  setLanguage: (language: AppLanguage) => void;
  setDailyQuote: (quote: string) => void;
  checkOnboardingStatus: () => boolean;
}

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (
  set,
  get
) => ({
  activeScreen: 'welcome',
  onboardingComplete: false,
  loading: false,
  language: 'ru',
  dailyQuote: '',

  setLanguage: language => {
    set({ language });
    localStorage.setItem('language', language);
  },
  setOnboardingComplete: completed => set({ onboardingComplete: completed }),
  setActiveScreen: screen => set({ activeScreen: screen }),
  setDailyQuote: quote => set({ dailyQuote: quote }),

  // Check if onboarding is complete from localStorage
  checkOnboardingStatus: () => {
    const storedValue = localStorage.getItem('onboarded');
    const isComplete = storedValue === 'true';
    set({ onboardingComplete: isComplete });
    return isComplete;
  },
});
