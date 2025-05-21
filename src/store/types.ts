
import { User } from '@supabase/supabase-js';
import { Achievement, Mission, Pact, UniverseQuestion, UserProfile } from '@/types';
import type Language from '@/types/Language';

// Interface for UI state
export interface UIState {
  onboardingCompleted: boolean;
  activeScreen: string;
  language: Language;
  isDeveloperMode: boolean;
  checkOnboardingStatus: () => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setActiveScreen: (screen: string) => void;
  setLanguage: (language: Language) => void;
  setDeveloperMode: (enabled: boolean) => void;
}

// The complete app state
export interface AppState extends UIState {
  pacts: Pact[];
  missions: Mission[];
  activeQuestions: UniverseQuestion[];
  dailyQuote: string;
  userProfile: UserProfile;
  user: User | null;
  loading: boolean;
  emailConfirmed: boolean;
  translations: any;
  
  // Методы установки данных
  setUser: (user: User | null) => void;
  setPacts: (pacts: Pact[]) => void;
  setUserProfile: (userProfile: UserProfile) => void;
  setMissions: (missions: Mission[]) => void;
  setUniverseQuestions: (questions: UniverseQuestion[]) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setTranslations: (translations: any) => void;
  
  // Загрузка миссий
  loadMissions: () => Promise<void>;
  
  // Чат
  chatSessions: any[];
  isLoadingChatSessions: boolean;
  currentChatSession: any;
  chatMessages: any[];
  isLoadingChat: boolean;
  isSendingMessage: boolean;
  isUniverseTyping: boolean;
  
  // Методы из срезов
  loadUserProfile: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  
  // Методы для работы с пактами
  loadPacts: () => Promise<void>;
  addPact: (pact: any) => void;
  markDayComplete: (pactId: string, date: string) => Promise<void>;
  breakAscesis: (pactId: string) => Promise<void>;
}
