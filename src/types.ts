export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  age: number | null;
  rank: string;
  energyPoints: number;
  zodiacSign: string;
  isPro: boolean;
  birthDate?: Date | null;
  avatar_url?: string | null;
  goal?: string;
  totalDays?: number;
  achievements?: Achievement[];
  activeMission?: Mission;
}

export interface User {
  id: string;
  email: string;
  user_metadata: {
    name: string;
  };
}

export interface ZodiacSign {
  name: string;
  dates: string;
  element: string;
  quality: string;
  traits: string[];
  symbol: string;
}

export interface Horoscope {
  date: string;
  horoscope: string;
  zodiacSign: string;
}

export interface Pact {
  id: string;
  title: string;
  description: string;
  created_at: string;
  start_date: string;
  end_date: string;
  days_total: number;
  days_completed: number;
  last_completed_date?: string;
  rejection: string;
  penalty?: string;
  status: 'active' | 'completed' | 'failed' | 'planned';
  type?: string;
  targetDate?: string;
  duration: number;
  reward?: string;
  days: Array<{
    id: string;
    date: string;
    completed: boolean;
  }>;
}

export interface UniverseQuestion {
  id: string;
  question: string;
  created_at: string;
  answer?: string;
  answered_at?: string;
  date?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface MissionRequirement {
  type: string;
  count: number;
}

export interface MissionReward {
  energyPoints?: number;
  achievement?: string;
}

export interface MissionProgress {
  day: number;
  completed: boolean;
  date: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  requirements: MissionRequirement[] | string[];
  reward: MissionReward;
  completed: boolean;
  completedDate?: string;
  type?: 'single' | 'multi-day' | 'chain';
  progress?: MissionProgress[];
}

export interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  image: string;
  audioSrc?: string;
  locked?: boolean;
  requiresPro?: boolean;
}

export type SpiritualRank = 'seeker' | 'pilgrim' | 'warrior' | 'master' | 'enlightened';
