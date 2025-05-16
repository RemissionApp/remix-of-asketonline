
export type SpiritualRank = 'seeker' | 'pilgrim' | 'warrior' | 'master' | 'enlightened';

export interface UserProfile {
  name: string;
  birthDate?: Date;
  totalDays: number;
  energyPoints: number;
  goal: string;
  isPro: boolean;
  rank: SpiritualRank;
  avatar_url?: string; // Added avatar_url field to UserProfile type
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
  requirements: MissionRequirement;
  reward: MissionReward;
  completed: boolean;
}

export interface MissionRequirement {
  type: 'days' | 'pacts' | 'universe';
  count: number;
}

export interface MissionReward {
  type: 'energy' | 'rank';
  value: number | SpiritualRank;
}
