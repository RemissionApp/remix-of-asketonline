
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SpiritualRank =
  | 'seeker'
  | 'apprentice'
  | 'adept'
  | 'master'
  | 'grandmaster'
  | 'pilgrim'  // Added missing ranks
  | 'warrior'
  | 'enlightened';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;  // Added missing property
};

export type Pact = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  duration: number;
  reward: string | null;
  status: string;
  created_at: string;
  start_date: string;
  end_date: string;
  days: PactDay[];
  days_total: number;
  days_completed: number;
  last_completed_date: string | null;
  rejection: string | null;
};

export type PactDay = {
  id: string;
  pact_id: string;
  date: string;
  completed: boolean;
  created_at: string;
};

export type UniverseQuestion = {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  created_at: string;
};

export type MissionRequirement = {
  type: string;
  description?: string;
};

export interface MissionProgress {
  day: number;
  completed: boolean;
  date: string | null;
}

export type Mission = {
  id: string;
  title: string;
  description: string;
  requirements: string[] | MissionRequirement[];
  reward: {
    energyPoints: number;
    achievement?: string;
  };
  completed: boolean;
  type?: 'single' | 'multi-day' | 'chain';
  progress?: MissionProgress[];
};

export interface UserProfile {
  name: string;
  email: string;
  age: number | null;
  energyPoints: number;
  goal: string;
  isPro: boolean;
  rank: SpiritualRank;
  zodiacSign: string;
  totalDays: number;
  achievements: Achievement[];
  birthDate: Date | string | null;  // Allow both Date and string
  avatar_url: string | null;
  activeMission?: Mission | null;
  id?: string;
}

// Добавим интерфейс для медитаций
export interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: string; // Длительность в виде строки, напр. "5 мин"
  category: string;
  image: string;
  audioSrc?: string;
  locked: boolean;
  requiresPro: boolean;
}

// Добавим интерфейс для настроек уведомлений
export interface NotificationSettings {
  meditationReminders: boolean;
  meditationReminderTime: { hours: number; minutes: number };
  ascesisReminders: boolean;
  achievementNotifications: boolean;
}

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform: () => boolean;
      getPlatform: () => 'android' | 'ios' | 'web';
    };
  }
}
