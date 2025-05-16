export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  age: number | null;
  rank: string;
  energyPoints: number;
  zodiacSign: string;
  isPro: boolean;
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
}

export interface UniverseQuestion {
  id: string;
  question: string;
  created_at: string;
  answer?: string;
  answered_at?: string;
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

export interface Mission {
  id: string;
  title: string;
  description: string;
  requirements: MissionRequirement[] | string[];
  reward: MissionReward;
  completed: boolean;
  completedDate?: string;
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
