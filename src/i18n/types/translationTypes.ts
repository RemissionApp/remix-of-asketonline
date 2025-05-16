
export type SupportedLanguage = 'en' | 'ru' | 'es';

export interface MeditationCategoriesTranslations {
  all: string;
  basic: string;
  sleep: string;
  focus: string;
  advanced: string;
  morning: string;
  evening: string;
  stress: string;
  mantra: string;
  visual: string;
}

export interface MeditationTypeTranslations {
  title: string;
  description: string;
  title1: string;
  desc1: string;
  title2?: string;
  desc2?: string;
}

export interface MainNavTranslations {
  path: string;
  ascesis: string;
  universe: string;
  profile: string;
}

export interface UniverseTranslations {
  title: string;
  question: string;
  answer: string;
  askButton: string;
  questionPlaceholder: string;
  answerPlaceholder: string;
  yourQuestion: string;
  universeAnswer: string;
  newQuestion: string;
  thinking: string;
  previousQuestions: string;
  description: string;
  proMessage: string;
  proTitle: string;
  learnMore: string;
  chatTitle: string;
  chatDescription: string;
  enterChat: string;
  chatProTitle: string;
  chatProMessage: string;
  // Chat translations
  yourConversations: string;
  newChat: string;
  noChatsYet: string;
  startNewChat: string;
  conversations: string;
  currentChat: string;
  startConversation: string;
  newChatTitle: string;
  chatTitleLabel: string;
  chatTitlePlaceholder: string;
}

export interface CommonTranslations {
  cancel: string;
  create: string;
  save: string;
  delete: string;
  edit: string;
  back: string;
  next: string;
  submit: string;
}

export interface MeditationTranslations {
  title: string;
  description: string;
  startButton: string;
  play: string;
  unlock: string;
  pageTitle: string;
  categories: MeditationCategoriesTranslations;
  morning: MeditationTypeTranslations;
  evening: MeditationTypeTranslations;
  stress: MeditationTypeTranslations;
  mantra: MeditationTypeTranslations;
  visualization: MeditationTypeTranslations;
}

export interface Translations {
  welcome?: Record<string, string>;
  login?: Record<string, string>;
  auth?: Record<string, string>;
  main?: Record<string, any>;
  universe?: UniverseTranslations;
  profile?: Record<string, string>;
  meditation?: MeditationTranslations;
  createPact?: Record<string, any>;
  pactOath?: Record<string, string>;
  onboarding?: Record<string, any>;
  subscription?: Record<string, string>;
  nav?: Record<string, string>;
  calendar?: Record<string, string>;
  minimumPeriod?: string;
  userProfile?: Record<string, string>;
  zodiac?: Record<string, string>;
  numerology?: Record<string, string>;
  common?: CommonTranslations;
}
