
// Update or extend the existing types file with any needed fixes
// Only add what's necessary to fix the current errors

import { Database } from './types/supabase';

// Add or update type definitions as necessary
export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  achievementType: string;
  unlockedAt: string | null;
  // Compatibility field for existing components
  unlocked?: boolean;
};

export type UniverseQuestion = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  // Compatibility field for existing components
  date?: string;
};

export type SpiritualRank = 'seeker' | 'pilgrim' | 'warrior' | 'master' | 'enlightened';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  rank: SpiritualRank;
  level: number;
  experience: number;
  isPro: boolean;
  birthDate: Date | null;
  createdAt: string;
  updatedAt: string;
  
  // Additional properties needed by existing components
  totalDays?: number;
  energyPoints?: number;
  goal?: string;
  achievements?: Achievement[];
  activeMission?: Mission | null;
}

export interface PactItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MeditationSession {
  id: string;
  duration: number;
  type: string;
  completedAt: string;
}

export interface DailyReflection {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  notes: string;
  gratitude: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'reminder' | 'system';
  read: boolean;
  createdAt: string;
}

export interface UserStats {
  meditationMinutes: number;
  completedPacts: number;
  streakDays: number;
  reflectionCount: number;
}

export interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  language: string;
  soundEnabled: boolean;
}

// Add missing Pact and Mission types
export interface Pact {
  id: string;
  title: string;
  duration: number;
  reward: string;
  status: 'active' | 'completed' | 'broken';
  createdAt: string;
  days: { date: string; completed: boolean }[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  reward: {
    energyPoints: number;
    achievement?: string;
  };
  completed: boolean;
}

export interface DailyQuote {
  text: string;
  author: string;
}

export interface AuthFunctions {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
}

