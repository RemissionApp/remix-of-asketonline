import { Achievement, Mission, Pact, SpiritualRank, UniverseQuestion, UserProfile } from '@/types';

export type AppLanguage = 'en' | 'ru' | 'es';

export type ActiveScreen = 'welcome' | 'language' | 'login' | 'profile-setup' | 'onboarding' | 'main' | 'pact' | 'universe' | 'profile' | 'meditation' | 'detailedHoroscope';

export interface AppState {
  pacts: Pact[];
  activeQuestions: UniverseQuestion[];
  dailyQuote: string;
  userProfile: UserProfile;
  user: any | null;
  loading: boolean;
  
  addPact: (pact: Omit<Pact, 'id' | 'createdAt' | 'days'>) => Promise<void>;
  markDayComplete: (pactId: string) => Promise<void>;
  askUniverse: (question: string) => Promise<UniverseQuestion>;
  setActiveScreen: (screen: ActiveScreen) => void;
  activeScreen: ActiveScreen;
  onboardingComplete: boolean;
  setOnboardingComplete: (completed: boolean) => void;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  syncPactsWithCurrentDate: () => Promise<void>;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  
  // Data loading methods
  loadUserProfile: () => Promise<void>;
  loadPacts: () => Promise<void>;
  loadUniverseQuestions: () => Promise<void>;
  
  // Functions for gamification
  addEnergyPoints: (points: number) => Promise<void>;
  checkRankProgress: () => SpiritualRank;
  unlockAchievement: (achievementId: string) => Promise<void>;
  assignMission: () => Promise<void>;
  completeMission: () => Promise<void>;
  
  // PRO features functions
  upgradeToPro: () => Promise<void>;
  cancelProSubscription: () => Promise<void>;
}
