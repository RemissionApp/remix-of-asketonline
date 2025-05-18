
import { Achievement, Mission, Pact, SpiritualRank, UniverseQuestion, UserProfile } from '@/types';
import { UniverseChatMessage, UniverseChatSession } from '@/utils/universeChat/types';

export type AppLanguage = 'ru' | 'en' | 'es';

// Define the available screens in the application
export type ActiveScreen = 
  | 'welcome' 
  | 'language' 
  | 'onboarding' 
  | 'main' 
  | 'create-pact' 
  | 'universe' 
  | 'profile' 
  | 'comparison' 
  | 'meditation'
  | 'login'
  | 'signup'
  | 'universe-chat'
  | 'full-horoscope'
  | 'numerology';

export interface AppState {
  pacts: Pact[];
  activeQuestions: UniverseQuestion[];
  dailyQuote: string;
  userProfile: UserProfile;
  user: any | null;
  loading: boolean;
  emailConfirmed: boolean;
  
  addPact: (pact: Omit<Pact, 'id' | 'created_at' | 'days' | 'description' | 'start_date' | 'end_date' | 'days_total' | 'days_completed' | 'last_completed_date' | 'rejection'>) => Promise<void>;
  markDayComplete: (pactId: string) => Promise<void>;
  breakAscesis: (pactId: string) => Promise<void>;
  askUniverse: (question: string) => Promise<UniverseQuestion>;
  setActiveScreen: (screen: ActiveScreen) => void;
  activeScreen: ActiveScreen;
  onboardingComplete: boolean;
  setOnboardingComplete: (completed: boolean) => void;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  syncPactsWithCurrentDate: () => Promise<void>;
  checkOnboardingStatus: () => boolean;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkEmailConfirmation: () => Promise<boolean>;
  setUser: (user: any) => void;
  
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
  
  // Additional methods needed
  saveUniverseQuestion: (question: UniverseQuestion) => Promise<void>;
  
  // Chat related state and methods
  chatSessions: UniverseChatSession[];
  isLoadingChatSessions: boolean; 
  currentChatSession: string | null;
  chatMessages: UniverseChatMessage[];
  isLoadingChat: boolean;
  isSendingMessage: boolean;
  isUniverseTyping: boolean;
  loadChatSessions: () => Promise<void>;
  createChatSession: (title: string) => Promise<string | null>;
  setCurrentChatSession: (sessionId: string | null) => Promise<void>;
  loadChatMessages: (sessionId: string) => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  subscribeToChatMessages: (sessionId: string) => Promise<() => void>;
  handleNewChatMessage: (payload: any) => void;
}
