
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

// Creating the store with all the slices
export const useAppStore = create<AppState>()((set, get, api) => ({
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
  
  // Combine all slices
  ...createUISlice(set, get, api),
  ...createPactsSlice(set, get, api),
  ...createUniverseSlice(set, get, api),
  ...createGamificationSlice(set, get, api),
  ...createProFeaturesSlice(set, get, api),
  ...createAuthSlice(set, get, api)
}));
