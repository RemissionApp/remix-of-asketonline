import { create } from 'zustand';
import { Achievement, AppSettings, DailyQuote, DailyReflection, MeditationSession, Pact, PactItem, SpiritualRank, UniverseQuestion, UserProfile, Mission } from '@/types';
import { persist, PersistStorage, StorageValue } from 'zustand/middleware';

// Define AppNotification type that was missing
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'reminder' | 'system';
  read: boolean;
  createdAt: string;
}

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
}

// Create a custom storage object that properly conforms to PersistStorage type
const customStorage: PersistStorage<AppStore> = {
  getItem: (name): StorageValue<AppStore> | null => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    return JSON.parse(str);
  },
  setItem: (name, value): void => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name): void => {
    localStorage.removeItem(name);
  },
};

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
    }),
    {
      name: 'app-storage',
      storage: customStorage,
    }
  )
);
