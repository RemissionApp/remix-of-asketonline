
export type PactStatus = 'active' | 'completed' | 'broken';

export interface PactDay {
  date: string;
  completed: boolean;
}

export interface Pact {
  id: string;
  title: string;
  duration: number;
  days: PactDay[];
  reward: string;
  status: PactStatus;
  createdAt: string;
}

export interface UniverseQuestion {
  id: string;
  question: string;
  answer: string;
  date: string;
}

export type SpiritualRank = 'seeker' | 'pilgrim' | 'warrior' | 'master' | 'enlightened';

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

export interface UserProfile {
  name: string;
  birthDate?: Date;
  totalDays: number;
  energyPoints: number;
  goal: string;
  isPro: boolean;
  rank: SpiritualRank;
  achievements: Achievement[];
  activeMission?: Mission;
  avatar_url?: string;
}
