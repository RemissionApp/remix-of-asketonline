
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
  | 'pilgrim'
  | 'warrior'
  | 'enlightened';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
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
  reward: MissionReward;
  completed: boolean;
  type?: 'single' | 'multi-day' | 'chain';
  progress?: MissionProgress[];
};

export interface MissionReward {
  energyPoints: number;
  achievement?: string;
}

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
  birthDate: Date | string | null;
  avatar_url: string | null;
  activeMission?: Mission | null;
  id?: string;
}
