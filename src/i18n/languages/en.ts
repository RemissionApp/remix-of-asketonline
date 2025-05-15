import { Translations } from '../types/translationTypes';

export const enTranslations: Translations = {
  welcome: {
    title: "Asket",
    description: "Platform for spiritual growth through ascesis",
    startButton: "Start",
    subtitle: "Your path to spiritual power"
  },
  login: {
    title: "Login",
    emailLabel: "Email",
    passwordLabel: "Password",
    emailPlaceholder: "example@email.com",
    passwordPlaceholder: "••••••••",
    forgotPassword: "Forgot password?",
    signInButton: "Sign In",
    signUpButton: "Sign Up",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    emailRequired: "Email is required"
  },
  auth: {
    signIn: "Sign In",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    resetPassword: "Reset Password",
    resetPasswordSuccess: "Password reset instructions have been sent to your email",
    resetPasswordError: "Error resetting password",
    resetPasswordButton: "Reset Password",
    signInButton: "Sign In",
    signUpButton: "Sign Up",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    orContinueWith: "or continue with",
    guestSignIn: "Sign in as guest",
    welcomeBack: "Welcome back!"
  },
  main: {
    title: "Main",
    createPact: "Create Ascesis",
    universe: "Universe",
    profile: "Profile",
    comparison: "Comparison",
    meditation: "Meditation",
    energyPoints: "Energy Points",
    totalDays: "Total Days",
    currentPacts: "Current Asceses",
    noPacts: "You don't have active asceses yet",
    completedToday: "Completed Today",
    daysLeft: "Days Left",
    days: "Days",
    todayCompleted: "Completed today",
    askUniverse: "Ask the Universe",
    path: "Path",
    ascesis: "Ascesis",
    nav: {
      path: "Path",
      ascesis: "Ascesis",
      universe: "Universe",
      profile: "Profile"
    }
  },
  pactOath: {
    title: "Contract with the Universe",
    subtitle: "Before you begin, take an oath",
    agreeText: "I agree to the terms of the contract",
    oath1: "I take full responsibility for my choice and commit to following it until the end of the ascesis period.",
    oath2: "I understand that breaking the contract will weaken my connection with higher powers and hinder my spiritual growth.",
    oath3: "I will be honest with myself and the Universe in following the terms of this contract.",
    createButton: "Create Contract",
    days: "days"
  },
  createPact: {
    title: "Create Ascesis",
    pactTitle: "Ascesis Title",
    pactDuration: "Duration (days)",
    pactReward: "Reward",
    pactStatus: "Status",
    createButton: "Create",
    titlePlaceholder: "Enter title...",
    durationPlaceholder: "Enter number of days...",
    rewardPlaceholder: "What you will get in return...",
    titleRequired: "Title is required",
    durationRequired: "Duration is required",
    durationInvalid: "Duration must be a number",
    days: "days",
    stepOneTitle: "Choose ascesis type",
    stepTwoTitle: "Choose duration",
    stepThreeTitle: "Create contract",
    placeholders: {
      title: "Example: Rejecting sugar",
      rejection: "Select or enter what you're giving up",
      reward: "What you will get in return..."
    },
    ascesisWarning: "Ascesis is not just abstinence, but a tool for spiritual growth and self-improvement.",
    customDays: "Set custom days",
    notAsking: "I'm not asking for anything in return",
    nextButton: "Next"
  },
  onboarding: {
    title: "Welcome to Asket",
    description: "Your guide to a mindful life through spiritual practices and ascesis",
    goal1: "Achieve inner harmony",
    goal2: "Unlock spiritual potential",
    goal3: "Clear mind of negative thoughts",
    goal4: "Strengthen spiritual power",
    goal5: "Find your path",
    goal6: "Know the true 'Self'",
    selectGoal: "Select goal",
    continueButton: "Continue",
    steps: {
      welcome: "Welcome",
      features: "Free Features",
      proFeatures: "Premium Features",
      complete: "Complete",
      length: 3,
      map: []
    },
    freeFeatures: [
      "Create and track spiritual practices & ascesis",
      "Daily meditation exercises",
      "Basic horoscope readings",
      "Ask the Universe a question",
      "Track your spiritual progress"
    ],
    proFeatures: [
      "Unlimited conversations with the Universe",
      "Full numerological analysis",
      "Advanced astrology readings",
      "Premium meditation content",
      "Advanced spiritual progress analytics"
    ],
    buttons: {
      next: "Next",
      start: "Start",
      skip: "Skip",
      enter: "Enter",
      startJourney: "Start Journey"
    }
  },
  
  universe: {
    title: "Universe",
    question: "Question",
    answer: "Answer",
    askButton: "Ask Question",
    questionPlaceholder: "Enter your question...",
    answerPlaceholder: "The Universe's answer will appear here...",
    yourQuestion: "Your question",
    universeAnswer: "Universe answer",
    newQuestion: "New question",
    thinking: "The Universe is thinking...",
    previousQuestions: "Previous questions",
    description: "Ask any questions and get wise answers directly from the Universe",
    proMessage: "Unlock PRO to have a dialog with the Universe",
    proTitle: "Dialog with the Universe",
    learnMore: "Learn more",
    chatTitle: "Chat with the Universe",
    chatDescription: "Ask questions and get answers from the Universe in real time",
    enterChat: "Enter chat",
    chatProTitle: "Chat with the Universe",
    chatProMessage: "Unlock PRO to have a dialog with the Universe"
  },
  
  profile: {
    title: "Profile",
    name: "Name",
    birthDate: "Date of Birth",
    goal: "Goal",
    stats: "Stats",
    achievements: "Achievements",
    saveButton: "Save",
    updateSuccess: "Profile successfully updated",
    updateError: "Error updating profile",
    nameRequired: "Name is required",
    birthDateRequired: "Date of birth is required",
    savingButton: "Saving..."
  },
  meditation: {
    title: "Meditation",
    description: "Choose meditation",
    startButton: "Start",
    play: "Play",
    unlock: "Unlock",
    pageTitle: "Meditations",
    categories: {
      all: "All",
      basic: "Basic",
      sleep: "Sleep",
      focus: "Focus",
      advanced: "Advanced",
      morning: "Morning",
      evening: "Evening",
      stress: "Stress",
      mantra: "Mantra",
      visual: "Visual"
    },
    morning: {
      title: "Morning Meditation",
      description: "Start your day with calmness and clarity",
      title1: "Morning Meditation",
      desc1: "Start your day with calmness and clarity",
      title2: "Morning Awakening",
      desc2: "Energize yourself for the day ahead"
    },
    evening: {
      title: "Evening Meditation",
      description: "Relax and restore energy after the day",
      title1: "Evening Meditation",
      desc1: "Relax and restore energy after the day"
    },
    stress: {
      title: "Anti-stress",
      description: "Release tension and anxiety",
      title1: "Anti-stress",
      desc1: "Release tension and anxiety"
    },
    mantra: {
      title: "Mantra Meditation",
      description: "Use the power of sound for deep immersion",
      title1: "Mantra Meditation",
      desc1: "Use the power of sound for deep immersion"
    },
    visualization: {
      title: "Visualization",
      description: "Create mental images to achieve goals",
      title1: "Visualization",
      desc1: "Create mental images to achieve goals"
    }
  },
  subscription: {
    title: "PRO Subscription",
    description: "Unlock the full potential of the app with PRO subscription",
    upgradeButton: "Activate PRO",
    proFeatures: "PRO Features",
    proTitle: "PRO",
    cancelButton: "Cancel Subscription",
    successMessage: "Subscription successfully activated",
    errorMessage: "Error activating subscription",
    bannerTitle: "Elevate Your Spiritual Experience",
    bannerDesc: "Unlock full access to all meditations and features",
    upgradeNow: "Upgrade Now"
  },
  nav: {
    home: "Home",
    universe: "Universe",
    profile: "Profile",
    comparison: "Comparison"
  },
  calendar: {
    today: "Today",
    month: "Month",
    year: "Year"
  },
  minimumPeriod: "Minimum ascesis period is 30 days",
  userProfile: {
    personal: "Personal Information",
    name: "Name",
    birthDate: "Date of Birth",
    emailAddressLabel: "Email Address",
    updateProfile: "Update Profile",
    passwordLabel: "Password",
    changePassword: "Change Password",
    profileUpdated: "Profile successfully updated",
    updateFailed: "Failed to update profile",
    bioLabel: "Bio",
    updateButton: "Update",
    savingButton: "Saving...",
    nameRequired: "Name is required",
    emailRequired: "Email is required",
    dobRequired: "Date of birth is required",
    nameLabel: "Your Name",
    birthDateLabel: "Date of Birth",
    namePlaceholder: "Enter your name",
    birthDatePlaceholder: "Choose your date of birth",
    title: "About You",
    age: "Age",
    continueButton: "Continue",
    currentDate: "Current date",
    languageLabel: "Language",
    birthDateRequired: "Date of birth is required"
  },
  zodiac: {
    yourZodiacSign: "Your zodiac sign",
    element: "Element",
    ruler: "Ruler",
    traits: "Traits",
    editBirthDate: "Edit birth date",
    saveBirthDate: "Save",
    cancelBirthDate: "Cancel"
  },
  numerology: {
    title: "Numerology",
    description: "Discover your numerological profile and gain a deep understanding of your personality",
    learnMore: "Learn more",
    proTitle: "Numerological Analysis",
    proMessage: "Unlock PRO to get a complete numerological analysis"
  }
};
