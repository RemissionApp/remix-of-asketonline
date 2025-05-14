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
