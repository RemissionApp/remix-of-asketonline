
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
}

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (set) => ({
  activeScreen: 'welcome',
  onboardingComplete: false,
  loading: false,
  language: 'ru',
  dailyQuote: "",
  
  setLanguage: (language) => set({ language }),
  setOnboardingComplete: (completed) => set({ onboardingComplete: completed }),
  setActiveScreen: (screen) => set({ activeScreen: screen })
});
