
import { User } from '@supabase/supabase-js';
import { Achievement, Mission, Pact, UniverseQuestion, UserProfile, Meditation, SpiritualRank } from '@/types';
import type Language from '@/types/Language';

// Interface for UI state
export interface UISlice {
  activeScreen: string;
  onboardingComplete: boolean;
  loading: boolean;
  language: Language;
  dailyQuote: string;
  isDeveloperMode: boolean;
  
  checkOnboardingStatus: () => boolean;
  setOnboardingCompleted: (completed: boolean) => void;
  setActiveScreen: (screen: string) => void;
  setLanguage: (language: Language) => void;
  setDeveloperMode: (enabled: boolean) => void;
  setDailyQuote: (quote: string) => void;
}

// ChatSlice interface for chat functionality
export interface ChatSlice {
  chatSessions: any[];
  isLoadingChatSessions: boolean;
  currentChatSession: any;
  chatMessages: any[];
  isLoadingChat: boolean;
  isSendingMessage: boolean;
  isUniverseTyping: boolean;
}

// ProFeaturesSlice interface for pro features
export interface ProFeaturesSlice {
  upgradeToPro: () => Promise<void>;
  cancelProSubscription: () => Promise<void>;
}

// AuthSlice interface for authentication functionality
export interface AuthSlice {
  user: User | null;
  emailConfirmed: boolean;
  signOut: () => Promise<void>;
  checkEmailConfirmation: () => Promise<boolean>;
  setUser: (user: User | null) => void;
}

// GamificationSlice interface for achievements and missions
export interface GamificationSlice {
  completeMission: (missionId: string) => Promise<void>;
  setMissions: (missions: Mission[]) => void;
  loadMissions: () => Promise<void>;
  setAchievements: (achievements: Achievement[]) => void;
}

// UniverseSlice interface for universe questions
export interface UniverseSlice {
  activeQuestions: UniverseQuestion[];
  setUniverseQuestions: (questions: UniverseQuestion[]) => void;
  loadUniverseQuestions: () => Promise<void>;
}

// The complete app state
export interface AppState extends 
  UISlice,
  ChatSlice,
  ProFeaturesSlice,
  AuthSlice,
  GamificationSlice,
  UniverseSlice {
  
  pacts: Pact[];
  missions: Mission[];
  dailyQuote: string;
  userProfile: UserProfile;
  loading: boolean;
  translations: any;
  
  setPacts: (pacts: Pact[]) => void;
  setUserProfile: (userProfile: UserProfile) => void;
  setTranslations: (translations: any) => void;
  
  // User profile methods
  loadUserProfile: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  
  // Pact methods
  loadPacts: () => Promise<void>;
  addPact: (pact: any) => void;
  markDayComplete: (pactId: string, date: string) => Promise<void>;
  breakAscesis: (pactId: string) => Promise<void>;
}
