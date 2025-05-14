
import { create } from 'zustand';
import { Achievement, AppSettings, DailyQuote, DailyReflection, MeditationSession, Pact, PactItem, SpiritualRank, UniverseQuestion, UserProfile, Mission } from '@/types';
import { persist } from 'zustand/middleware';

// Default user profile
const defaultUserProfile: UserProfile = {
  id: '', 
  name: 'Искатель',
  email: '',
  avatar_url: null,
  rank: 'seeker',
  level: 1,
  experience: 0,
  isPro: false, 
  birthDate: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  totalDays: 0,
  energyPoints: 0,
  goal: '',
  achievements: [],
  activeMission: null
};

// Sample daily quote
const defaultDailyQuote: DailyQuote = {
  text: "Чем больше вы отказываетесь от мирских удовольствий, тем ближе вы к истинной гармонии.",
  author: "Древняя мудрость"
};

// Default achievements
const defaultAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Первый медитация',
    description: 'Завершите свою первую медитацию',
    icon: '🧘‍♂️',
    achievementType: 'meditation',
    unlockedAt: null,
    unlocked: false
  },
  {
    id: '2',
    title: 'Первый пакт',
    description: 'Создайте свой первый пакт',
    icon: '🤝',
    achievementType: 'pact',
    unlockedAt: null,
    unlocked: false
  },
  {
    id: '3',
    title: 'Первый вопрос вселенной',
    description: 'Задайте свой первый вопрос вселенной',
    icon: '❓',
    achievementType: 'universeQuestion',
    unlockedAt: null,
    unlocked: false
  },
  {
    id: '4',
    title: 'Первый дневник',
    description: 'Заполните свой первый дневник',
    icon: '✍️',
    achievementType: 'dailyReflection',
    unlockedAt: null,
    unlocked: false
  }
];

// Default app settings
const defaultAppSettings: AppSettings = {
  darkMode: false,
  notifications: true,
  language: 'ru',
  soundEnabled: true
};

// Define the AppStore interface
interface AppStore {
  user: any;
  userProfile: UserProfile;
  achievements: Achievement[];
  universeQuestions: UniverseQuestion[];
  activeQuestions: UniverseQuestion[];
  pacts: Pact[];
  pactItems: PactItem[];
  meditationSessions: MeditationSession[];
  dailyReflections: DailyReflection[];
  notifications: AppNotification[];
  settings: AppSettings;
  activeScreen: string;
  language: string;
  loading: boolean;
  error: any;
  dailyQuote: DailyQuote;
  onboardingComplete: boolean;

  // Basic setters
  setUser: (user: any) => void;
  setLanguage: (language: string) => void;
  setActiveScreen: (screen: string) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setUserProfile: (profile: UserProfile) => void;
  setPacts: (pacts: Pact[]) => void;
  setActiveQuestions: (questions: UniverseQuestion[]) => void;
  setUniverseQuestions: (questions: UniverseQuestion[]) => void;
  
  // Utility functions required by various components
  // These are implemented in the separate hooks
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  addPact: (pact: { title: string, duration: number, reward: string, status: string }) => void;
  markDayComplete: (pactId: string) => void;
  syncPactsWithCurrentDate: () => void;
  askUniverse: (question: string) => Promise<UniverseQuestion>;
  completeMission: () => boolean;
}

// Create the store
export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      userProfile: defaultUserProfile,
      achievements: defaultAchievements,
      universeQuestions: [],
      activeQuestions: [],
      pacts: [],
      pactItems: [],
      meditationSessions: [],
      dailyReflections: [],
      notifications: [],
      settings: defaultAppSettings,
      activeScreen: 'main',
      language: defaultAppSettings.language,
      loading: false,
      error: null,
      dailyQuote: defaultDailyQuote,
      onboardingComplete: false,

      // Basic setters
      setUser: (user) => set({ user }),
      setLanguage: (language) => set({ language }),
      setActiveScreen: (screen) => set({ activeScreen: screen }),
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setPacts: (pacts) => set({ pacts }),
      setActiveQuestions: (questions) => set({ activeQuestions: questions }),
      setUniverseQuestions: (questions) => set({ universeQuestions: questions }),
      
      // These are implemented in separate hooks but need to be accessible via the store
      // We'll use the hooks implementations when these methods are called
      signIn: async () => false, // Implemented in useAuth.ts
      signUp: async () => false, // Implemented in useAuth.ts
      addPact: () => {}, // Implemented in usePacts.ts
      markDayComplete: () => {}, // Implemented in usePacts.ts
      syncPactsWithCurrentDate: () => {}, // Implemented in usePacts.ts
      askUniverse: async () => ({ 
        id: '', 
        question: '', 
        answer: '', 
        createdAt: '', 
        date: '' 
      }), // Implemented in useUniverseQuestions.ts
      completeMission: () => false, // Implemented in useMissions.ts
    }),
    {
      name: 'app-storage',
      // Fix the storage to properly conform to PersistStorage type
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
