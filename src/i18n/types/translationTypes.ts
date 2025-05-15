export type SupportedLanguage = 'en' | 'ru' | 'es';

export interface Translations {
  welcome: {
    title: string;
    description: string;
    startButton: string;
    subtitle: string;
  };
  login: {
    title: string;
    emailLabel: string;
    passwordLabel: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    forgotPassword: string;
    signInButton: string;
    signUpButton: string;
    noAccount: string;
    haveAccount: string;
    emailRequired: string;
  };
  auth: {
    signIn: string;
    signUp: string;
    email: string;
    password: string;
    forgotPassword: string;
    resetPassword: string;
    resetPasswordSuccess: string;
    resetPasswordError: string;
    resetPasswordButton: string;
    signInButton: string;
    signUpButton: string;
    noAccount: string;
    haveAccount: string;
    emailRequired: string;
    passwordRequired: string;
    orContinueWith: string;
    guestSignIn: string;
    welcomeBack: string;
  };
  main: {
    title: string;
    createPact: string;
    universe: string;
    profile: string;
    comparison: string;
    meditation: string;
    energyPoints: string;
    totalDays: string;
    currentPacts: string;
    noPacts: string;
    completedToday: string;
    daysLeft: string;
    days: string;
    todayCompleted: string;
    askUniverse: string;
    path: string;
    ascesis: string;
    nav: {
      path: string;
      ascesis: string;
      universe: string;
      profile: string;
    };
  };
  pactOath: {
    title: string;
    subtitle: string;
    agreeText: string;
    oath1: string;
    oath2: string;
    oath3: string;
    createButton: string;
    days: string;
  };
  createPact: {
    title: string;
    pactTitle: string;
    pactDuration: string;
    pactReward: string;
    pactStatus: string;
    createButton: string;
    titlePlaceholder: string;
    durationPlaceholder: string;
    rewardPlaceholder: string;
    titleRequired: string;
    durationRequired: string;
    durationInvalid: string;
    days: string;
    stepOneTitle: string;
    stepTwoTitle: string;
    stepThreeTitle: string;
    placeholders: {
      title: string;
      rejection: string;
      reward: string;
    };
    ascesisWarning: string;
    customDays: string;
    notAsking: string;
    nextButton: string;
  };
  onboarding: {
    title: string;
    description: string;
    goal1: string;
    goal2: string;
    goal3: string;
    goal4: string;
    goal5: string;
    goal6: string;
    selectGoal: string;
    continueButton: string;
    steps: {
      welcome: string;
      features: string;
      proFeatures: string;
      complete: string;
      length: number;
      map: string[];
    };
    freeFeatures: string[];
    proFeatures: string[];
    buttons: {
      next: string;
      start: string;
      skip: string;
      enter: string;
      startJourney: string;
    };
  };
  universe: {
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
    description: string; // Main universe page description
    proMessage: string;
    proTitle: string;
    learnMore: string;
    chatTitle: string;      // Title for the chat preview card
    chatDescription: string; // Description for the chat preview card
    enterChat: string;       // Button text to enter chat
    chatProTitle: string;    // Pro overlay title for chat
    chatProMessage: string;  // Pro overlay message for chat
  };
  profile: {
    title: string;
    name: string;
    birthDate: string;
    goal: string;
    stats: string;
    achievements: string;
    saveButton: string;
    updateSuccess: string;
    updateError: string;
    nameRequired: string;
    birthDateRequired: string;
    savingButton: string;
  };
  meditation: {
    title: string;
    description: string;
    startButton: string;
    play: string;
    unlock: string;
    pageTitle: string;
    categories: {
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
    };
    morning: {
      title: string;
      description: string;
      title1: string;
      desc1: string;
      title2: string;
      desc2: string;
    };
    evening: {
      title: string;
      description: string;
      title1: string;
      desc1: string;
    };
    stress: {
      title: string;
      description: string;
      title1: string;
      desc1: string;
    };
    mantra: {
      title: string;
      description: string;
      title1: string;
      desc1: string;
    };
    visualization: {
      title: string;
      description: string;
      title1: string;
      desc1: string;
    };
  };
  subscription: {
    title: string;
    description: string;
    upgradeButton: string;
    proFeatures: string;
    proTitle: string;
    cancelButton: string;
    successMessage: string;
    errorMessage: string;
    bannerTitle: string;
    bannerDesc: string;
    upgradeNow: string;
  };
  nav: {
    home: string;
    universe: string;
    profile: string;
    comparison: string;
  };
  calendar: {
    today: string;
    month: string;
    year: string;
  };
  minimumPeriod: string;
  userProfile: {
    personal: string;
    name: string;
    birthDate: string;
    emailAddressLabel: string;
    updateProfile: string;
    passwordLabel: string;
    changePassword: string;
    profileUpdated: string;
    updateFailed: string;
    bioLabel: string;
    updateButton: string;
    savingButton: string;
    nameRequired: string;
    emailRequired: string;
    dobRequired: string;
    nameLabel: string;
    birthDateLabel: string;
    namePlaceholder: string;
    birthDatePlaceholder: string;
    title: string;
    age: string;
    continueButton: string;
    currentDate: string;
    languageLabel: string;
    birthDateRequired: string;
  };
  zodiac: {
    yourZodiacSign: string;
    element: string;
    ruler: string;
    traits: string;
    editBirthDate: string;
    saveBirthDate: string;
    cancelBirthDate: string;
  };
  numerology: {
    title: string;
    description: string;
    learnMore: string;
    proTitle: string;
    proMessage: string;
  };
}
