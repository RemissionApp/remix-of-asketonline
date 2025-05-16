
export type SpiritualRank = 'seeker' | 'pilgrim' | 'warrior' | 'master' | 'enlightened';

export interface UserProfile {
  name: string;
  birthDate?: Date;
  totalDays: number;
  energyPoints: number;
  goal: string;
  isPro: boolean;
  rank: SpiritualRank;
  avatar_url?: string;
  achievements?: Achievement[];
  activeMission?: Mission;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
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

export interface MissionRequirement {
  type: 'days' | 'pacts' | 'universe';
  count: number;
}

export interface MissionReward {
  type: 'energy' | 'rank';
  value: number | SpiritualRank;
  energyPoints?: number;
  achievement?: string;
}

export interface Pact {
  id: string;
  title: string;
  duration: number;
  reward?: string;
  status: 'active' | 'completed' | 'broken';
  createdAt?: string;
  days: PactDay[];
}

export interface PactDay {
  date: string;
  completed: boolean;
}

export interface UniverseQuestion {
  id?: string;
  question: string;
  answer: string;
  createdAt?: string;
  date?: string; // Adding this field to fix TypeScript errors
}
