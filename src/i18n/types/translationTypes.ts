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
  universeChat: string; // Added for PRO users
  profile: string;
}

export interface AffirmationCategoriesTranslations {
  all: string;
  success: string;
  confidence: string;
  wellbeing: string;
  love: string;
  abundance: string;
}

export interface AffirmationPracticeTranslations {
  title: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  complete: string;
  duration: string;
}

export interface AffirmationsTranslations {
  title: string;
  description: string;
  categories: AffirmationCategoriesTranslations;
  instructions: string;
  practiceButton: string;
  favoriteButton: string;
  unfavoriteButton: string;
  showDetails: string;
  hideDetails: string;
  instruction: string;
  action: string;
  daily: string;
  practice: AffirmationPracticeTranslations;
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
  errorSendingMessage: string;
  welcomeMessage: string;
  defaultWelcomeMessage: string;
  newChatCreated: string;
  errorCreatingChat: string;
}

export interface LegalTranslations {
  title: string;
  privacyPolicy: string;
  privacyPolicyTitle: string;
  termsOfUse: string;
  lastUpdated: string;
  currentDate: string;
  may: string;
  introduction: string;
  introText: string;
  dataCollected: string;
  dataCollectedText: string;
  directData: string;
  automaticData: string;
  registrationData: string;
  registrationDataText: string;
  profileData: string;
  profileDataText: string;
  usageData: string;
  usageDataText: string;
  paymentData: string;
  paymentDataText: string;
  voiceData: string;
  voiceDataText: string;
  deviceData: string;
  deviceDataText: string;
  usageStats: string;
  usageStatsText: string;
  locationData: string;
  locationDataText: string;
  profileInfo: string;
  technicalData: string;
  dataUse: string;
  dataUseText: string;
  provideServices: string;
  provideServicesText: string;
  personalization: string;
  personalizationText: string;
  voiceProcessing: string;
  voiceProcessingText: string;
  personalizeExperience: string;
  communication: string;
  communicationText: string;
  improvement: string;
  improvementText: string;
  security: string;
  securityText: string;
  analytics: string;
  dataSharing: string;
  dataSharingText: string;
  serviceProviders: string;
  serviceProvidersText: string;
  consent: string;
  consentText: string;
  legal: string;
  legalText: string;
  protection: string;
  protectionText: string;
  dataSecurity: string;
  dataSecurityText: string;
  voiceSecurity: string;
  userRights: string;
  userRightsText: string;
  accessRight: string;
  accessRightText: string;
  correctionRight: string;
  correctionRightText: string;
  deletionRight: string;
  deletionRightText: string;
  restrictionRight: string;
  restrictionRightText: string;
  objectionRight: string;
  objectionRightText: string;
  portabilityRight: string;
  portabilityRightText: string;
  contactRights: string;
  policyChanges: string;
  policyChangesText: string;
  contact: string;
  contactText: string;
  acceptance: string;
  acceptanceText: string;
  serviceDescription: string;
  serviceDescriptionText: string;
  userAccounts: string;
  userAccountsText: string;
  userContent: string;
  userContentText: string;
  prohibitedBehavior: string;
  prohibitedBehaviorText: string;
  violatesLaws: string;
  threatening: string;
  maliciousCode: string;
  interferes: string;
  disclaimers: string;
  disclaimersText: string;
  termsChanges: string;
  termsChangesText: string;
  termination: string;
  terminationText: string;
}

export interface HoroscopeTranslations {
  workFinance: string;
  loveRelationships: string;
  healthWellbeing: string;
  dailyAdvice: string;
  luckyNumber: string;
  luckyTime: string;
  colorOfDay: string;
  mood: string;
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
  freeMeditations: string;
  exploreProCollection: string;
  goToPro: string;
  categories: MeditationCategoriesTranslations;
  morning: MeditationTypeTranslations;
  evening: MeditationTypeTranslations;
  stress: MeditationTypeTranslations;
  mantra: MeditationTypeTranslations;
  visualization: MeditationTypeTranslations;
}

export interface EmailOtpTranslations {
  subject: string;
  title: string;
  subtitle: string;
  codeLabel: string;
  validTime: string;
  instructionsTitle: string;
  instructions: string;
  footerNote: string;
}

export interface DeleteAccountTranslations {
  title: string;
  warning: string;
  description: string;
  confirmationText: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  deleteButton: string;
  deleting: string;
  fillAllFields: string;
  accountDeleted: string;
  deleteError: string;
}

export interface NumerologyTranslations {
  title: string;
  description: string;
  learnMore: string;
  proTitle: string;
  proMessage: string;
  lifePath: string;
  analysis: string;
  viewModes: {
    full: string;
    simple: string;
    data: string;
  };
  numbers: {
    lifePath: string;
    destiny: string;
    soul: string;
    personality: string;
    expression: string;
  };
  descriptions: {
    lifePath: string;
    destiny: string;
    soul: string;
    personality: string;
    expression: string;
  };
  lifePeriods: {
    title: string;
    forming: string;
    productive: string;
    wisdom: string;
  };
  enterBirthDateInProfile: string;
}

export interface NotFoundTranslations {
  title: string;
  message: string;
  returnHome: string;
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
  numerology?: NumerologyTranslations;
  legal?: LegalTranslations;
  common?: CommonTranslations;
  horoscope?: HoroscopeTranslations;
  affirmations?: AffirmationsTranslations;
  emailOtp?: EmailOtpTranslations;
  deleteAccount?: DeleteAccountTranslations;
  notFound?: NotFoundTranslations;
  dataExport?: Record<string, string>;
}
