import { Translations } from '../types/translationTypes';
import { enLegalTranslations } from './en-legal';

export const enTranslations: Translations = {
  welcome: {
    title: 'Asceta',
    description: 'Platform for spiritual growth through ascesis',
    startButton: 'Start',
    subtitle: 'Your path to spiritual power',
  },
  login: {
    title: 'Login',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    emailPlaceholder: 'example@email.com',
    passwordPlaceholder: '••••••••',
    forgotPassword: 'Forgot password?',
    signInButton: 'Sign In',
    signUpButton: 'Sign Up',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    emailRequired: 'Email is required',
  },
  auth: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    resetPassword: 'Reset Password',
    resetPasswordSuccess:
      'Password reset instructions have been sent to your email',
    resetPasswordError: 'Error resetting password',
    resetPasswordButton: 'Reset Password',
    signInButton: 'Sign In',
    signUpButton: 'Sign Up',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    orContinueWith: 'or continue with',
    guestSignIn: 'Sign in as guest',
    welcomeBack: 'Welcome back!',
    // OTP translations
    enterOtpCode: 'Enter verification code',
    otpCodeLabel: 'Verification code',
    otpSentMessage: 'We sent a 6-digit code to',
    verifyButton: 'Verify',
    resendCode: 'Resend code',
    // Toast messages
    error: 'Error',
    codeSent: 'Code sent',
    codeValidated: 'Email verified',
    loginSuccess: 'Login successful',
    checkEmailAndEnterCode: 'Check your email and enter the verification code',
    failedToSendCode: 'Failed to send verification code',
    failedToVerifyCode: 'Failed to verify code',
    invalidCode: 'Invalid code',
    checkCodeCorrectness: 'Check the correctness of the entered code',
    emailVerifiedSuccess: 'Your email has been successfully verified',
    welcomeToAsceta: 'Welcome to Asceta!',
    emailVerifiedSignIn: 'Your email has been successfully verified. Now sign in with your credentials.',
    verificationError: 'An error occurred while verifying the code',
    // Voice greeting
    voiceGreeting: 'Welcome to Asceta',
    clickForAudio: 'Click to activate sound',
    stop: 'Stop',
    playGreeting: 'Play greeting',
    // Loading states
    processing: 'Processing...',
    signingIn: 'Signing in...',
    checkingAuth: 'Checking authorization...',
    confirmEmail: 'Confirm email',
    checkYourEmail: 'Check your email',
    emailConfirmationSent: 'An email with confirmation has been sent to your email address. Please check your email and click the link to activate your account.',
    returnToLogin: 'Return to login form',
    backToSignup: '← Back to registration',
    enterEmailForReset: 'Please enter email for password recovery',
    // Default user names
    defaultUserName: 'Seeker',
    // LoginPage extras
    enterEmailAndPassword: 'Please enter your email and password',
    weakPasswordTitle: 'Weak password',
    weakPasswordDescription: 'Password must be at least 8 characters and include an uppercase letter and a digit',
    passwordsDontMatchTitle: "Passwords don't match",
    passwordsDontMatchDescription: 'Enter the same password in both fields',
    passwordsDontMatchHint: "Passwords don't match",
    repeatPassword: 'Repeat password',
    enter6DigitCode: 'Enter the 6-digit code',
    enter6DigitCodeFromEmail: 'Enter the 6-digit code from the email',
    signingUp: 'Signing up...',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
  },
  main: {
    title: 'Main',
    createPact: 'Create Ascesis',
    universe: 'Universe',
    profile: 'Profile',
    comparison: 'Comparison',
    meditation: 'Meditation',
    energyPoints: 'Energy Points',
    totalDays: 'Total Days',
    currentPacts: 'Current Asceses',
    noPacts: "You don't have active asceses yet",
    completedToday: 'Completed Today',
    daysLeft: 'Days Left',
    days: 'Days',
    todayCompleted: 'Completed today',
    askUniverse: 'Ask the Universe',
    path: 'Path',
    ascesis: 'Ascesis',
    nav: {
      path: 'Path',
      ascesis: 'Ascesis',
      universe: 'Universe',
      universeChat: 'Chat',
      profile: 'Profile',
    },
    failed: 'Broken',
    completed: 'Completed',
  },
  pactOath: {
    title: 'Contract with the Universe',
    subtitle: 'Before you begin, take an oath',
    agreeText: 'I agree to the terms of the contract',
    oath1:
      'I take full responsibility for my choice and commit to following it until the end of the ascesis period.',
    oath2:
      'I understand that breaking the contract will weaken my connection with higher powers and hinder my spiritual growth.',
    oath3:
      'I will be honest with myself and the Universe in following the terms of this contract.',
    createButton: 'Create Contract',
    days: 'days',
  },
  createPact: {
    title: 'Create Ascesis',
    pactTitle: 'Ascesis Title',
    pactDuration: 'Duration (days)',
    pactReward: 'Reward',
    pactStatus: 'Status',
    createButton: 'Create',
    titlePlaceholder: 'Enter title...',
    durationPlaceholder: 'Enter number of days...',
    rewardPlaceholder: 'What you will get in return...',
    titleRequired: 'Title is required',
    durationRequired: 'Duration is required',
    durationInvalid: 'Duration must be a number',
    days: 'days',
    stepOneTitle: 'Choose ascesis type',
    stepTwoTitle: 'Choose duration',
    stepThreeTitle: 'Create contract',
    placeholders: {
      title: 'Example: Rejecting sugar',
      rejection: "Select or enter what you're giving up",
      reward: 'What you will get in return...',
    },
    ascesisWarning:
      'Ascesis is not just abstinence, but a tool for spiritual growth and self-improvement.',
    customDays: 'Set custom days',
    notAsking: "I'm not asking for anything in return",
    nextButton: 'Next',
  },
  onboarding: {
    title: 'Welcome to Asceta',
    description:
      'Your guide to a mindful life through spiritual practices and ascesis',
    goal1: 'Achieve inner harmony',
    goal2: 'Unlock spiritual potential',
    goal3: 'Clear mind of negative thoughts',
    goal4: 'Strengthen spiritual power',
    goal5: 'Find your path',
    goal6: "Know the true 'Self'",
    selectGoal: 'Select goal',
    continueButton: 'Continue',
    steps: {
      welcome: 'Welcome',
      features: 'Free Features',
      proFeatures: 'Premium Features',
      complete: 'Complete',
      length: 3,
      map: [],
    },
    freeFeatures: [
      'Create and track spiritual practices & ascesis',
      'Daily meditation exercises',
      'Basic horoscope readings',
      'Ask the Universe a question',
      'Track your spiritual progress',
    ],
    proFeatures: [
      'Unlimited conversations with the Universe',
      'Full numerological analysis',
      'Advanced astrology readings',
      'Premium meditation content',
      'Advanced spiritual progress analytics',
    ],
    buttons: {
      next: 'Next',
      start: 'Start',
      skip: 'Skip',
      enter: 'Enter',
      startJourney: 'Start Journey',
    },
    stepLabel: 'Step',
    stepCounter: 'Step {{current}} of {{total}}',
    stepAriaLabel: 'Step {{n}}',
    freeAfterSignup: 'Available right after sign up',
    proWithSubscription: 'Unlocked with Pro subscription',
    completeFailed: 'Failed to complete onboarding',
  },

  universe: {
    title: 'Universe',
    question: 'Ask the Universe',
    answer: "Universe's answer",
    askButton: 'Ask',
    questionPlaceholder: 'Type a message...',
    answerPlaceholder: "Universe's answer will appear here",
    yourQuestion: 'Your question',
    universeAnswer: "Universe's answer",
    newQuestion: 'New question',
    thinking: 'Thinking...',
    previousQuestions: 'Previous questions',
    description: 'Ask the Universe a question and receive a wise answer',
    proMessage: 'Unlock the ability to ask the Universe',
    proTitle: 'Question to the Universe',
    learnMore: 'Learn more',
    chatTitle: 'Chat with Lyra',
    chatDescription: 'Ask the Universe a question',
    enterChat: 'Enter chat',
    chatProTitle: 'Chat with Lyra',
    chatProMessage: 'Unlock PRO to chat with Lyra',
    yourConversations: 'Your conversations',
    newChat: 'New conversation',
    noChatsYet: "You don't have any conversations yet",
    startNewChat: 'Start a new conversation',
    conversations: 'Conversations',
    currentChat: 'Current conversation',
    startConversation: 'Start the conversation with a question',
    newChatTitle: 'New conversation',
    chatTitleLabel: 'Conversation title',
    chatTitlePlaceholder: 'Enter conversation title...',
    errorSendingMessage: 'Failed to send message',
    welcomeMessage:
      'The silence of stars surrounds you. In this space, answers are born to questions you have not yet asked.',
    defaultWelcomeMessage: 'Hello! I\'m ready to help you find answers to your questions. What would you like to talk about today?',
    newChatCreated: 'New chat created',
    errorCreatingChat: 'Error creating new chat',
  },

  profile: {
    title: 'Profile',
    name: 'Name',
    birthDate: 'Date of Birth',
    goal: 'Goal',
    stats: 'Stats',
    achievements: 'Achievements',
    saveButton: 'Save',
    updateSuccess: 'Profile successfully updated',
    updateError: 'Error updating profile',
    nameRequired: 'Name is required',
    birthDateRequired: 'Date of birth is required',
    savingButton: 'Saving...',
  },
  meditation: {
    title: 'Meditation',
    description: 'Choose meditation',
    startButton: 'Start',
    play: 'Play',
    unlock: 'Unlock',
    pageTitle: 'Meditations',
    freeMeditations: 'Free meditations',
    exploreProCollection: 'Explore our PRO meditation collection for deeper practices',
    goToPro: 'Go to PRO meditations',
    categories: {
      all: 'All',
      basic: 'Basic',
      sleep: 'Sleep',
      focus: 'Focus',
      advanced: 'Advanced',
      morning: 'Morning',
      evening: 'Evening',
      stress: 'Stress',
      mantra: 'Mantra',
      visual: 'Visual',
    },
    morning: {
      title: 'Morning Meditation',
      description: 'Start your day with calmness and clarity',
      title1: 'Morning Meditation',
      desc1: 'Start your day with calmness and clarity',
      title2: 'Morning Awakening',
      desc2: 'Energize yourself for the day ahead',
    },
    evening: {
      title: 'Evening Meditation',
      description: 'Relax and restore energy after the day',
      title1: 'Evening Meditation',
      desc1: 'Relax and restore energy after the day',
    },
    stress: {
      title: 'Anti-stress',
      description: 'Release tension and anxiety',
      title1: 'Anti-stress',
      desc1: 'Release tension and anxiety',
    },
    mantra: {
      title: 'Mantra Meditation',
      description: 'Use the power of sound for deep immersion',
      title1: 'Mantra Meditation',
      desc1: 'Use the power of sound for deep immersion',
    },
    visualization: {
      title: 'Visualization',
      description: 'Create mental images to achieve goals',
      title1: 'Visualization',
      desc1: 'Create mental images to achieve goals',
    },
  },
  subscription: {
    title: 'PRO Subscription',
    description: 'Unlock the full potential of the app with PRO subscription',
    upgradeButton: 'Activate PRO',
    proFeatures: 'PRO Features',
    proTitle: 'PRO',
    cancelButton: 'Cancel Subscription',
    successMessage: 'Subscription successfully activated',
    errorMessage: 'Error activating subscription',
    bannerTitle: 'Elevate Your Spiritual Experience',
    bannerDesc: 'Unlock full access to all meditations and features',
    upgradeNow: 'Upgrade Now',
  },
  nav: {
    home: 'Home',
    universe: 'Universe',
    profile: 'Profile',
    comparison: 'Comparison',
  },
  calendar: {
    today: 'Today',
    month: 'Month',
    year: 'Year',
  },
  minimumPeriod: 'Minimum ascesis period is 30 days',
  userProfile: {
    personal: 'Personal Information',
    name: 'Name',
    birthDate: 'Date of Birth',
    emailAddressLabel: 'Email Address',
    updateProfile: 'Update Profile',
    passwordLabel: 'Password',
    changePassword: 'Change Password',
    profileUpdated: 'Profile successfully updated',
    updateFailed: 'Failed to update profile',
    bioLabel: 'Bio',
    updateButton: 'Update',
    savingButton: 'Saving...',
    nameRequired: 'Name is required',
    emailRequired: 'Email is required',
    dobRequired: 'Date of birth is required',
    nameLabel: 'Your Name',
    birthDateLabel: 'Date of Birth',
    namePlaceholder: 'Enter your name',
    deleteData: 'Clear All Data',
    deleteDataConfirm: 'Data deletion functionality will be implemented',
    birthDatePlaceholder: 'Choose your date of birth',
    title: 'About You',
    age: 'Age',
    continueButton: 'Continue',
    currentDate: 'Current date',
    languageLabel: 'Language',
    birthDateRequired: 'Date of birth is required',
    logout: 'Logout',
    deleteAccount: 'Delete account data',
    accountSettings: 'Account Settings',
    notifications: 'Notifications',
    developerMode: 'Developer Mode',
    dataDeleteImplementation: 'Data deletion feature will be implemented',
  },
  zodiac: {
    yourZodiacSign: 'Your zodiac sign',
    element: 'Element',
    ruler: 'Ruler',
    traits: 'Traits',
    editBirthDate: 'Edit birth date',
    saveBirthDate: 'Save',
    cancelBirthDate: 'Cancel',
  },
  numerology: {
    title: 'Numerology',
    description:
      'Discover your numerological profile and gain a deep understanding of your personality',
    learnMore: 'Learn more',
    proTitle: 'Numerological Analysis',
    proMessage: 'Unlock PRO to get a complete numerological analysis',
    lifePath: 'Life Path',
    analysis: 'Numerological Analysis',
    viewModes: {
      full: 'Full',
      simple: 'Simple',
      data: 'Data'
    },
    numbers: {
      lifePath: 'Life Path',
      destiny: 'Destiny Number',
      soul: 'Soul Number',
      personality: 'Personality Number',
      expression: 'Expression Number'
    },
    descriptions: {
      lifePath: 'The Life Path Number is your most important number. It describes the natural inclination of your being and influences all aspects of your existence.',
      destiny: 'The Destiny Number determines the purpose of your life, what you strive for, what talents and abilities will help you, what lessons you need to learn.',
      soul: 'The Soul Number shows deep desires and aspirations, our true motives for actions and decisions, everything that is deep inside us.',
      personality: 'The Personality Number shows how others perceive you, what impression you make on others at first meeting.',
      expression: 'The Expression Number describes your talents, abilities and tools that will help you follow your Life Path.'
    },
    lifePeriods: {
      title: 'Life Periods',
      forming: 'Forming Period',
      productive: 'Productive Period',
      wisdom: 'Wisdom Period'
    },
    enterBirthDateInProfile: 'Please enter birth date in profile'
  },
  common: {
    cancel: 'Cancel',
    create: 'Create',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    loading: 'Loading...',
  },

  legal: enLegalTranslations,

  affirmations: {
    title: 'Affirmations',
    description: 'Daily positive statements to transform your mindset',
    categories: {
      all: 'All',
      success: 'Success',
      confidence: 'Confidence',
      wellbeing: 'Well-being',
      love: 'Love',
      abundance: 'Abundance',
    },
    instructions:
      'Choose an affirmation, meditate on it, and repeat it daily for transformative effect.',
    practiceButton: 'Practice',
    favoriteButton: 'Add to favorites',
    unfavoriteButton: 'Remove from favorites',
    showDetails: 'Show details',
    hideDetails: 'Hide details',
    instruction: 'Instruction',
    action: 'Action',
    daily: "Today's Affirmation",
    practice: {
      title: 'Practice Affirmation',
      step1: "Find a quiet space where you won't be disturbed",
      step2: 'Take three deep breaths to center yourself',
      step3: 'Repeat the affirmation aloud three times',
      step4: 'Close your eyes and repeat it mentally three more times',
      step5: 'Visualize the affirmation as already true in your life',
      complete: 'Complete Practice',
      duration: 'Recommended practice time: 2-5 minutes',
    },
  },
  emailOtp: {
    subject: 'Your verification code | Asceta',
    title: 'Verification Code',
    subtitle: 'Spiritual development and self-knowledge',
    codeLabel: 'Your verification code',
    validTime: 'Code valid for 5 minutes',
    instructionsTitle: 'Instructions',
    instructions: 'Enter this code in the Asceta app to verify your email address. The code is valid for 5 minutes.',
    footerNote: 'If you didn\'t sign up for Asceta, please ignore this email.',
  },
  deleteAccount: {
    title: 'Delete Account',
    warning: 'This action is irreversible!',
    description: 'All your data including pacts, achievements, and profile information will be permanently deleted.',
    confirmationText: 'I understand that this action is irreversible and all my data will be permanently deleted',
    passwordLabel: 'Enter your password to confirm',
    passwordPlaceholder: 'Your password',
    deleteButton: 'Delete Account Permanently',
    deleting: 'Deleting...',
    fillAllFields: 'Please fill all fields',
    accountDeleted: 'Account deleted successfully',
    deleteError: 'Error deleting account',
  },
  notFound: {
    title: '404',
    message: 'Oops! Page not found',
    returnHome: 'Return to Home',
  },
  
  missions: {
    'synchronicity-hunter': {
      title: 'Synchronicity Hunter',
      description: 'Explore mystical coincidences in your life and learn to read the signs of the Universe',
      requirements: [
        'Keep a synchronicity journal',
        'Analyze patterns',
        'Create a coincidence map'
      ],
      dailyQuestions: {
        1: 'What unusual coincidences did you notice today?',
        3: 'Rate the strength of today\'s synchronicities from 1 to 10',
        5: 'Photograph or describe the most vivid coincidence',
        7: 'What patterns have you discovered during the week of observations?'
      },
      choiceEvents: {
        'sync-path-choice': {
          title: 'Path of exploration',
          description: 'Choose how you want to develop your ability to notice synchronicities',
          choices: {
            'intuitive-path': 'Rely on intuition and feelings',
            'analytical-path': 'Analyze and record everything in detail'
          }
        }
      },
      milestoneRewards: {
        3: 'Your perception is sharpening! 🔮',
        7: 'You received a mystical artifact! ✨'
      }
    },
    'energy-detox-21': {
      title: 'Energy Detox',
      description: 'Comprehensive transformation of the energy field through liberation from toxic habits and cleansing practices',
      requirements: [
        'Get rid of energy vampires',
        'Practice cleansing techniques',
        'Create a new energy regime'
      ],
      dailyQuestions: {
        1: 'What drains your energy the most?',
        7: 'Rate your energy level compared to the beginning',
        14: 'Which new practices have brought the most benefit?',
        21: 'Photograph a symbol of your renewed energy'
      },
      choiceEvents: {
        'detox-method': {
          title: 'Cleansing method',
          description: 'Choose the main approach to energy detox',
          choices: {
            'gentle-cleansing': 'Gentle gradual cleansing',
            'intensive-purge': 'Intensive radical cleansing'
          }
        },
        'energy-source': {
          title: 'Source of power',
          description: 'Determine what will be your main source of energy',
          choices: {
            'nature-connection': 'Connection with nature and elements',
            'inner-fire': 'Inner fire and self-discipline',
            'cosmic-flow': 'Flow of cosmic energy'
          }
        }
      },
      milestoneRewards: {
        7: 'Your energy is beginning to purify! 🌟',
        14: 'You feel a surge of strength! ⚡',
        21: 'Energy transformation completed! 🔥'
      }
    },
    'dream-explorer': {
      title: 'Dream Explorer',
      description: 'Dive into the world of lucid dreams and reveal the secrets of your subconscious',
      requirements: [
        'Keep a detailed dream journal',
        'Practice mindfulness techniques',
        'Create a dream world map'
      ],
      dailyQuestions: {
        1: 'Describe the most vivid dream you remember',
        5: 'How clearly do you remember dreams (1-10)?',
        10: 'Have you had lucid dreams?',
        14: 'Draw or describe a symbol from your dreams'
      },
      choiceEvents: {
        'dream-technique': {
          title: 'Awareness technique',
          description: 'Choose a method for developing lucid dreaming',
          choices: {
            'reality-checks': 'Reality checks during the day',
            'wake-back-to-bed': 'WBTB technique (wake up and go back to sleep)',
            'mnemonic-induction': 'Mnemonic induction (MILD)'
          }
        }
      },
      milestoneRewards: {
        7: 'Your dreams are becoming brighter! 🌙',
        14: 'You\'ve mastered the art of dreams! ✨'
      }
    },
    'gratitude-alchemist': {
      title: 'Gratitude Alchemist',
      description: 'Transform any life situations into sources of gratitude and strength',
      requirements: [
        'Find blessings in difficulties',
        'Create a gratitude ritual',
        'Share gratitude with the world'
      ],
      dailyQuestions: {
        1: 'What are you especially grateful for today?',
        5: 'Find a hidden blessing in a recent difficulty',
        8: 'To whom did you express gratitude today?',
        10: 'Photograph something that symbolizes your gratitude'
      },
      choiceEvents: {
        'gratitude-style': {
          title: 'Gratitude style',
          description: 'How do you prefer to express gratitude?',
          choices: {
            'inner-gratitude': 'Inner meditations and reflections',
            'creative-gratitude': 'Creative expression (letters, art)',
            'active-gratitude': 'Active deeds and helping others'
          }
        }
      },
      milestoneRewards: {
        5: 'Your heart is filling with warmth! 💖',
        10: 'Gratitude transforms your life! 🌈'
      }
    },
    'time-alchemist': {
      title: 'Time Alchemist',
      description: 'Change your perception of time and learn to control its flow',
      requirements: [
        'Explore different states of time',
        'Practice time expansion techniques',
        'Create a personal time ritual'
      ],
      dailyQuestions: {
        1: 'How do you feel the flow of time in different situations?',
        7: 'Rate how slow time was today (1-10)',
        14: 'Describe your ideal life rhythm'
      },
      choiceEvents: {
        'time-approach': {
          title: 'Approach to time',
          description: 'Choose the main philosophy of working with time',
          choices: {
            'flow-state': 'Immersion in a flow state',
            'mindful-presence': 'Mindful presence in the moment',
            'time-expansion': 'Time expansion techniques'
          }
        }
      },
      milestoneRewards: {
        7: 'Time begins to slow under your control! ⏳',
        14: 'You\'ve become the master of your time! 🕰️'
      }
    }
  },
  pactCompletion: {
    title: 'Congratulations on completing your ascesis!',
    completedDays: 'You completed the ascesis for {days} days in a row',
    goalTitle: 'Your goal:',
    universeMessage: '✨ The Universe has heard every step you took on this path. If you performed the ascesis honestly and with full dedication, the energy of the Cosmos is already working to fulfill your desire. Trust the process - what you truly need will come at the right time. ✨',
    energyEarned: 'Energy Earned',
    totalDays: 'Total Days',
    shareButton: 'Share',
    newPactButton: 'New Ascesis',
    closeButton: 'Continue',
    shareTitle: 'Completed ascesis in Asceta!',
    shareText: 'I completed the ascesis "{title}" for {days} days and earned {energy} energy! Join spiritual development in Asceta.',
  },
  lyra: {
    voiceGuide: 'Lyra',
    callButton: 'Call Lyra',
    callScreen: "Lyra's Call",
    callHistory: 'Past sessions with Lyra',
    callSubtitle: 'Your cosmic guide, always listening',
    callSubtitleShort: 'Connect with cosmic wisdom',
    callTitle: "Lyra's Call",
    callButtonShort: 'Call Lyra',
    online: 'online',
    callTip: "Press the call button to connect with Lyra and the cosmic wisdom of the Universe",
    connectionErrorTitle: 'Connection error',
    minutesLeft: '{{count}} min remaining this month',
    limitReachedCta: 'Monthly limit reached — upgrade to continue',
    hearFromGuide: 'Hear from Lyra',
    errorMicDenied: 'Please allow microphone access to talk to Lyra.',
    errorAgentUnavailable: 'Lyra is temporarily unreachable. Please try again shortly.',
    errorLimit: "You've used all your minutes this month. Subscribe to keep talking.",
    errorAuth: 'Please sign in to start a call.',
    errorNetwork: 'No connection. Check your internet and try again.',
  },
};
