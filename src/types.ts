
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

export interface UserProfile {
  name: string;
  birthDate?: Date;
  totalDays: number;
  energyPoints: number;
  goal: string;
  isPro: boolean;
}
