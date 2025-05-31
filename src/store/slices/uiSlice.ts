
import { StateCreator } from 'zustand';
import { AppState, ActiveScreen, AppLanguage } from '../types';

export interface UISlice {
  activeScreen: ActiveScreen;
  onboardingComplete: boolean;
  loading: boolean;
  language: AppLanguage;
  dailyQuote: string;
  
  // Настройки звука
  soundEnabled: boolean;
  soundVolume: number;
  
  setActiveScreen: (screen: ActiveScreen) => void;
  setOnboardingComplete: (completed: boolean) => void;
  setLanguage: (language: AppLanguage) => void;
  setDailyQuote: (quote: string) => void;
  checkOnboardingStatus: () => boolean;
  
  // Методы для управления звуком
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  loadSoundSettings: () => void;
}

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (set, get) => ({
  activeScreen: 'welcome',
  onboardingComplete: false,
  loading: false,
  language: 'ru',
  dailyQuote: "",
  soundEnabled: true,
  soundVolume: 0.7,
  
  setLanguage: (language) => set({ language }),
  setOnboardingComplete: (completed) => set({ onboardingComplete: completed }),
  setActiveScreen: (screen) => set({ activeScreen: screen }),
  setDailyQuote: (quote) => set({ dailyQuote: quote }),
  
  setSoundEnabled: (enabled) => {
    set({ soundEnabled: enabled });
    localStorage.setItem('soundEnabled', JSON.stringify(enabled));
  },
  
  setSoundVolume: (volume) => {
    set({ soundVolume: volume });
    localStorage.setItem('soundVolume', JSON.stringify(volume));
  },
  
  loadSoundSettings: () => {
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    const savedSoundVolume = localStorage.getItem('soundVolume');
    
    if (savedSoundEnabled !== null) {
      set({ soundEnabled: JSON.parse(savedSoundEnabled) });
    }
    
    if (savedSoundVolume !== null) {
      set({ soundVolume: JSON.parse(savedSoundVolume) });
    }
  },
  
  // Check if onboarding is complete from localStorage
  checkOnboardingStatus: () => {
    const storedValue = localStorage.getItem('onboarded');
    const isComplete = storedValue === 'true';
    set({ onboardingComplete: isComplete });
    return isComplete;
  }
});
