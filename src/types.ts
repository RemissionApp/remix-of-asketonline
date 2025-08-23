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
  email?: string;
  user_metadata?: {
    name?: string;
  };
  created_at?: string;
  updated_at?: string;
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

// NEW TYPES FOR ENHANCED MISSION SYSTEM
export interface ChoiceEvent {
  id: string;
  day: number;
  title: string;
  description: string;
  choices: Choice[];
  triggerCondition?: string;
}

export interface Choice {
  id: string;
  text: string;
  consequences: Consequence[];
  energyModifier?: number;
}

export interface Consequence {
  type: 'energy' | 'unlock' | 'message' | 'bonus';
  value: any;
}

export interface DailyQuestion {
  day: number;
  question: string;
  type: 'reflection' | 'photo' | 'scale' | 'text';
  required: boolean;
}

export interface MilestoneReward {
  day: number;
  reward: EnhancedReward;
  celebrationMessage: string;
}

export interface EnhancedReward {
  energyPoints?: number;
  achievement?: string;
  cosmicArtifact?: CosmicArtifact;
  exclusiveContent?: ExclusiveContent;
  rankBonus?: number;
  socialBadge?: SocialBadge;
  mysticalInsight?: MysticalInsight;
}

export interface CosmicArtifact {
  id: string;
  name: string;
  description: string;
  type: 'crystal' | 'amulet' | 'mantra';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effects: string[];
}

export interface ExclusiveContent {
  type: 'meditation' | 'practice' | 'insight';
  content: string;
  duration?: number;
}

export interface SocialBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface MysticalInsight {
  title: string;
  content: string;
  category: 'synchronicity' | 'intuition' | 'dream' | 'energy';
}

export interface UnlockCondition {
  type: 'rank' | 'mission' | 'energy' | 'time';
  value: any;
}

export interface ZodiacBonus {
  signs: string[];
  multiplier: number;
  description: string;
}

export interface AdaptiveSettings {
  difficultyAdjustment: boolean;
  personalizedContent: boolean;
  aiRecommendations: boolean;
}

export interface ProgressMetrics {
  startDate: string;
  expectedEndDate: string;
  actualProgress: number;
  predictedCompletion: number;
  engagementScore: number;
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
  
  // NEW ENHANCED FIELDS
  difficulty: 'novice' | 'explorer' | 'master' | 'cosmic-warrior';
  category: 'ritual' | 'research' | 'social' | 'mystical' | 'challenge';
  unlockConditions?: UnlockCondition[];
  duration: number; // days
  minRank?: SpiritualRank;
  maxRetries?: number;
  seasonalAvailable?: boolean;
  prerequisiteMissions?: string[];
  
  // Interactive elements
  dailyQuestions?: DailyQuestion[];
  choiceEvents?: ChoiceEvent[];
  milestoneRewards?: MilestoneReward[];
  
  // Personalization
  zodiacBonus?: ZodiacBonus[];
  adaptiveSettings?: AdaptiveSettings;
  
  // Progress and analytics
  progressTracking?: ProgressMetrics;
  completionRate?: number;
  averageRating?: number;
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

export type SpiritualRank =
  | 'seeker'
  | 'pilgrim'
  | 'warrior'
  | 'master'
  | 'enlightened';
