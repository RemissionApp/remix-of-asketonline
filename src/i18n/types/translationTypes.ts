
export type SupportedLanguage = 'en' | 'ru' | 'es';

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
  // Add new chat translations
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

export interface Translations {
  welcome?: Record<string, string>;
  login?: Record<string, string>;
  auth?: Record<string, string>;
  main?: Record<string, string>;
  universe?: UniverseTranslations;
  profile?: Record<string, string>;
  meditation?: Record<string, string>;
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
