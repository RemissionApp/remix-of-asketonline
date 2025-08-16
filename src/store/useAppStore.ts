import { create } from 'zustand';
import { quotes } from './data/constants';
import { AppState } from './types';
import { createOptimizedUISlice } from './slices/optimizedUISlice';
import { createPactsSlice } from './slices/pactsSlice';
import { createUniverseSlice } from './slices/universeSlice';
import { createGamificationSlice } from './slices/gamificationSlice';
import { createProFeaturesSlice } from './slices/proFeaturesSlice';
import { createAuthSlice } from './slices/authSlice';
import { defaultAchievements } from './data/constants';

// Создание хранилища со всеми срезами
export const useAppStore = create<AppState>()((set, get, api) => ({
  // Начальное состояние
  pacts: [],
  activeQuestions: [],
  dailyQuote: quotes[Math.floor(Math.random() * quotes.length)],
  userProfile: {
    name: 'Искатель',
    email: '',
    age: null,
    energyPoints: 0,
    goal: 'Познать свою истинную силу',
    isPro: false,
    rank: 'seeker',
    zodiacSign: '',
    totalDays: 0,
    achievements: [...defaultAchievements],
    birthDate: null,
    avatar_url: null,
    activeMission: undefined,
  },
  user: null,
  loading: false,
  emailConfirmed: false,

  // Добавляем новый метод для установки пользователя
  setUser: user => set({ user }),

  // Состояние чата
  chatSessions: [],
  isLoadingChatSessions: false,
  currentChatSession: null,
  chatMessages: [],
  isLoadingChat: false,
  isSendingMessage: false,
  isUniverseTyping: false,

  // Комбинируем все срезы
  ...createOptimizedUISlice(set, get, api),
  ...createPactsSlice(set, get, api),
  ...createUniverseSlice(set, get, api),
  ...createGamificationSlice(set, get, api),
  ...createProFeaturesSlice(set, get, api),
  ...createAuthSlice(set, get, api),

  // Audio settings
  soundEnabled: true,
  soundVolume: 0.8,

  setSoundEnabled: enabled => {
    set({ soundEnabled: enabled });
    localStorage.setItem('soundEnabled', String(enabled));
  },

  setSoundVolume: volume => {
    set({ soundVolume: volume });
    localStorage.setItem('soundVolume', String(volume));
  },

  loadSoundSettings: () => {
    const storedEnabled = localStorage.getItem('soundEnabled');
    const storedVolume = localStorage.getItem('soundVolume');

    if (storedEnabled !== null) {
      set({ soundEnabled: storedEnabled === 'true' });
    }

    if (storedVolume !== null) {
      const volume = parseFloat(storedVolume);
      if (!isNaN(volume) && volume >= 0 && volume <= 1) {
        set({ soundVolume: volume });
      }
    }
  },

  // Initialize settings from localStorage
  initializeSettings: () => {
    // Load language
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && ['ru', 'en', 'es'].includes(storedLanguage)) {
      set({ language: storedLanguage as any });
    }

    // Load sound settings
    const storedEnabled = localStorage.getItem('soundEnabled');
    const storedVolume = localStorage.getItem('soundVolume');

    if (storedEnabled !== null) {
      set({ soundEnabled: storedEnabled === 'true' });
    }

    if (storedVolume !== null) {
      const volume = parseFloat(storedVolume);
      if (!isNaN(volume) && volume >= 0 && volume <= 1) {
        set({ soundVolume: volume });
      }
    }
  },
}));
