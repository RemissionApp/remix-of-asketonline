
import { Tables } from './types/supabase';

export type SpiritualRank = 'seeker' | 'pilgrim' | 'warrior' | 'master' | 'enlightened';

export interface PactDay {
  id: string;
  date: Date | string;
  completed: boolean;
}

export interface Pact {
  id: string;
  title: string;
  duration: number;
  reward: string | null;
  status: 'active' | 'completed' | 'failed';
  days: PactDay[];
}

export interface UserProfile {
  name: string;
  birthDate: Date | null;
  totalDays: number;
  energyPoints: number;
  goal: string | null;
  rank: SpiritualRank;
  isPro: boolean;
  avatar_url: string | null;
}

export interface UniverseQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  requirements: any;
  reward: any;
  completed: boolean;
}

export const mapDbProfileToUserProfile = (dbProfile: Tables<'profiles'>, isPro: boolean = false): UserProfile => {
  return {
    name: dbProfile.name,
    birthDate: dbProfile.birth_date ? new Date(dbProfile.birth_date) : null,
    totalDays: dbProfile.total_days,
    energyPoints: dbProfile.energy_points,
    goal: dbProfile.goal,
    rank: dbProfile.rank as SpiritualRank,
    isPro,
    avatar_url: dbProfile.avatar_url
  };
};
