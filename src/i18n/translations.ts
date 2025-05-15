// Define the types for all translations
interface Translations {
  [key: string]: {
    welcome: {
      title: string;
      description: string;
      startButton: string;
      subtitle?: string;
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
        goal: string;
        complete: string;
        title?: string;
        content?: string;
        length?: number;
        map?: any[];
      };
      buttons: {
        next: string;
        start: string;
        skip: string;
        enter?: string;
        startJourney?: string;
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
      description?: string;
      proMessage?: string;
      proTitle?: string;
      learnMore?: string;
      chatTitle?: string;
      chatDescription?: string;
      enterChat?: string;
      chatProTitle?: string;
      chatProMessage?: string;
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
  };
}

// Define the actual translations
export const translations: Translations = {
  ru: {
    welcome: {
      title: "Аскет",
      description: "Платформа для духовного роста через аскезу",
      startButton: "Начать",
      subtitle: "Ваш путь к духовной силе"
    },
    login: {
      title: "Вход",
      emailLabel: "Email",
      passwordLabel: "Пароль",
      emailPlaceholder: "example@email.com",
      passwordPlaceholder: "••••••••",
      forgotPassword: "Забыли пароль?",
      signInButton: "Войти",
      signUpButton: "Зарегистрироваться",
      noAccount: "Еще нет аккаунта?",
      haveAccount: "Уже есть аккаунт?",
      emailRequired: "Email обязателен"
    },
    auth: {
      signIn: "Вход",
      signUp: "Регистрация",
      email: "Email",
      password: "Пароль",
      forgotPassword: "Забыли пароль?",
      resetPassword: "Сброс пароля",
      resetPasswordSuccess: "На вашу почту отправлена инструкция для сброса пароля",
      resetPasswordError: "Ошибка сброса пароля",
      resetPasswordButton: "Сбросить пароль",
      signInButton: "Войти",
      signUpButton: "Зарегистрироваться",
      noAccount: "Еще нет аккаунта?",
      haveAccount: "Уже есть аккаунт?",
      emailRequired: "Email обязателен",
      passwordRequired: "Пароль обязателен",
      orContinueWith: "или продолжить с",
      guestSignIn: "Войти как гость",
      welcomeBack: "С возвращением!"
    },
    main: {
      title: "Главная",
      createPact: "Создать аскезу",
      universe: "Вселенная",
      profile: "Профиль",
      comparison: "Сравнение",
      meditation: "Медитация",
      energyPoints: "Энергетические очки",
      totalDays: "Всего дней",
      currentPacts: "Текущие аскезы",
      noPacts: "У вас пока нет активных аскез",
      completedToday: "Выполнено сегодня",
      daysLeft: "Осталось дней",
      days: "Дней",
      todayCompleted: "Сегодня выполнено",
      askUniverse: "Задать вопрос Вселенной",
      path: "Путь",
      ascesis: "Аскеза",
      nav: {
        path: "Путь",
        ascesis: "Аскеза",
        universe: "Вселенная",
        profile: "Профиль"
      }
    },
    pactOath: {
      title: "Договор с Вселенной",
      subtitle: "Прежде чем начать, дайте клятву",
      agreeText: "Я соглашаюсь с условиями договора",
      oath1: "Я принимаю полную ответственность за свой выбор и обязуюсь следовать ему до конца срока аскезы.",
      oath2: "Я понимаю, что нарушение договора ослабит мою связь с высшими силами и помешает моему духовному росту.",
      oath3: "Я буду честен перед собой и Вселенной в соблюдении условий этого договора.",
      createButton: "Создать договор",
      days: "дней"
    },
    createPact: {
      title: "Создание аскезы",
      pactTitle: "Название аскезы",
      pactDuration: "Длительность (дней)",
      pactReward: "Награда",
      pactStatus: "Статус",
      createButton: "Создать",
      titlePlaceholder: "Введите название...",
      durationPlaceholder: "Введите число дней...",
      rewardPlaceholder: "Что вы получите взамен...",
      titleRequired: "Название обязательно",
      durationRequired: "Длительность обязательна",
      durationInvalid: "Длительность должна быть числом",
      days: "дней",
      stepOneTitle: "Выберите тип аскезы",
      stepTwoTitle: "Выберите длительность",
      stepThreeTitle: "Создайте договор",
      placeholders: {
        title: "Например: Отказ от сахара",
        rejection: "Выберите или введите от чего вы отказываетесь",
        reward: "Что вы получите взамен..."
      },
      ascesisWarning: "Вы должны понимать, что Аскеза — серьёзная практика и отнестись к ней необходимо максимально ответственно. Вы даёте слово Вселенной о выполнении обязательств с Вашей стороны и просите взамен исполнения желания / решения какого-то вопроса. Если Вы дадите не справиться и не сдержите Ваше слово, то Вселенная не будет воспринимать Вас всерьёз и есть риск выпасть из потока...",
      customDays: "Уставновить количество дней",
      notAsking: "Я не прошу ничего взамен",
      nextButton: "Далее"
    },
    onboarding: {
      title: "Добро пожаловать в Аскет",
      description: "Выберите свою духовную цель",
      goal1: "Достичь внутренней гармонии",
      goal2: "Раскрыть духовный потенциал",
      goal3: "Очистить разум от негативных мыслей",
      goal4: "Укрепить духовную силу",
      goal5: "Найти свой путь",
      goal6: "Познать истинное 'Я'",
      selectGoal: "Выберите цель",
      continueButton: "Продолжить",
      steps: {
        welcome: "Добро пожаловать",
        goal: "Выбор цели",
        complete: "Готово",
        length: 3,
        map: []
      },
      buttons: {
        next: "Далее",
        start: "Начать",
        skip: "Пропустить",
        enter: "Войти",
        startJourney: "Начать путь"
      }
    },
    universe: {
      title: "Вселенная",
      question: "Вопрос",
      answer: "Ответ",
      askButton: "Задать вопрос",
      questionPlaceholder: "Введите ваш вопрос...",
      answerPlaceholder: "Здесь появится ответ Вселенной...",
      yourQuestion: "Ваш вопрос",
      universeAnswer: "Ответ Вселенной",
      newQuestion: "Новый вопрос",
      thinking: "Вселенная размышляет...",
      previousQuestions: "Предыдущие вопросы",
      description: "Задавай любые вопросы и получай мудрые ответы напрямую от Вселенной",
      proMessage: "Разблокируй PRO чтобы вести диалог со Вселенной",
      proTitle: "Диалог со Вселенной",
      learnMore: "Подробнее",
      chatTitle: "Чат со Вселенной",
      chatDescription: "Задавай вопросы и получай ответы от Вселенной в режиме реального времени",
      enterChat: "Войти в чат",
      chatProTitle: "Чат со Вселенной",
      chatProMessage: "Разблокируй PRO чтобы вести диалог со Вселенной"
    },
    profile: {
      title: "Профиль",
      name: "Имя",
      birthDate: "Дата рождения",
      goal: "Цель",
      stats: "Статистика",
      achievements: "Достижения",
      saveButton: "Сохранить",
      updateSuccess: "Профиль успешно обновлен",
      updateError: "Ошибка при обновлении профиля",
      nameRequired: "Имя обязательно",
      birthDateRequired: "Дата рождения обязательна",
      savingButton: "Сохранение..."
    },
    meditation: {
      title: "Медитация",
      description: "Выберите медитацию",
      startButton: "Начать",
      play: "Включить",
      unlock: "Разблокировать",
      pageTitle: "Медитации",
      categories: {
        all: "Все",
        basic: "Базовые",
        sleep: "Сон",
        focus: "Фокус",
        advanced: "Продвинутые",
        morning: "Утренние",
        evening: "Вечерние",
        stress: "Антистресс",
        mantra: "Мантры",
        visual: "Визуализация"
      },
      morning: {
        title: "Утренняя медитация",
        description: "Начните день со спокойствия и ясности",
        title1: "Утренняя медитация",
        desc1: "Начните день со спокойствия и ясности",
        title2: "Утреннее пробуждение",
        desc2: "Зарядитесь энергией на весь день"
      },
      evening: {
        title: "Вечерняя медитация",
        description: "Расслабьтесь и восстановите энергию после дня",
        title1: "Вечерняя медитация",
        desc1: "Расслабьтесь и восстановите энергию после дня"
      },
      stress: {
        title: "Антистресс",
        description: "Освободитесь от напряжения и беспокойства",
        title1: "Антистресс",
        desc1: "Освободитесь от напряжения и беспокойства"
      },
      mantra: {
        title: "Мантра-медитация",
        description: "Используйте силу звука для глубокого погружения",
        title1: "Мантра-медитация",
        desc1: "Используйте силу звука для глубокого погружения"
      },
      visualization: {
        title: "Визуализация",
        description: "Создайте мысленные образы для достижения целей",
        title1: "Визуализация",
        desc1: "Создайте мысленные образы для достижения целей"
      }
    },
    subscription: {
      title: "PRO Подписка",
      description: "Откройте полный потенциал приложения с PRO-подпиской",
      upgradeButton: "Активировать PRO",
      proFeatures: "Особенности PRO",
      proTitle: "PRO",
      cancelButton: "Отменить подписку",
      successMessage: "Подписка успешно активирована",
      errorMessage: "Ошибка активации подписки",
      bannerTitle: "Повысьте свой духовный опыт",
      bannerDesc: "Откройте полный доступ ко всем медитациям и функциям",
      upgradeNow: "Повысить сейчас"
    },
    nav: {
      home: "Главная",
      universe: "Вселенная",
      profile: "Профиль",
      comparison: "Сравнение"
    },
    calendar: {
      today: "Сегодня",
      month: "Месяц",
      year: "Год"
    },
    minimumPeriod: "Минимальный период аскезы - 30 дней",
    userProfile: {
      personal: "Личная информация",
      name: "Имя",
      birthDate: "Дата рождения",
      emailAddressLabel: "Email адрес",
      updateProfile: "Обновить профиль",
      passwordLabel: "Пароль",
      changePassword: "Изменить пароль",
      profileUpdated: "Профиль успешно обновлен",
      updateFailed: "Ошибка обновления профиля",
      bioLabel: "О себе",
      updateButton: "Обновить",
      savingButton: "Сохранение...",
      nameRequired: "Имя обязательно",
      emailRequired: "Email обязателен",
      dobRequired: "Дата рождения обязательна",
      nameLabel: "Как тебя зовут",
      birthDateLabel: "Дата рождения",
      namePlaceholder: "Введите ваше имя",
      birthDatePlaceholder: "Выберите дату рождения",
      title: "О тебе",
      age: "Возраст",
      continueButton: "Продолжить",
      currentDate: "Текущая дата",
      languageLabel: "Язык",
      birthDateRequired: "Дата рождения обязательна"
    }
  },
  en: {
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
      description: "Choose your spiritual goal",
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
        goal: "Choose goal",
        complete: "Complete",
        length: 3,
        map: []
      },
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
    }
  },
  es: {
    welcome: {
      title: "Asket",
      description: "Plataforma para el crecimiento espiritual a través de la ascesis",
      startButton: "Comenzar",
      subtitle: "Tu camino hacia el poder espiritual"
    },
    login: {
      title: "Iniciar sesión",
      emailLabel: "Email",
      passwordLabel: "Contraseña",
      emailPlaceholder: "ejemplo@email.com",
      passwordPlaceholder: "••••••••",
      forgotPassword: "¿Olvidaste tu contraseña?",
      signInButton: "Iniciar sesión",
      signUpButton: "Registrarse",
      noAccount: "¿No tienes una cuenta?",
      haveAccount: "¿Ya tienes una cuenta?",
      emailRequired: "El email es obligatorio"
    },
    auth: {
      signIn: "Iniciar sesión",
      signUp: "Registrarse",
      email: "Email",
      password: "Contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      resetPassword: "Restablecer contraseña",
      resetPasswordSuccess: "Se ha enviado instrucciones para restablecer la contraseña a tu email",
      resetPasswordError: "Error al restablecer la contraseña",
      resetPasswordButton: "Restablecer contraseña",
      signInButton: "Iniciar sesión",
      signUpButton: "Registrarse",
      noAccount: "¿No tienes una cuenta?",
      haveAccount: "¿Ya tienes una cuenta?",
      emailRequired: "El email es obligatorio",
      passwordRequired: "La contraseña es obligatoria",
      orContinueWith: "o continuar con",
      guestSignIn: "Ingresar como invitado",
      welcomeBack: "¡Bienvenido de nuevo!"
    },
    main: {
      title: "Principal",
      createPact: "Crear Ascesis",
      universe: "Universo",
      profile: "Perfil",
      comparison: "Comparación",
      meditation: "Meditación",
      energyPoints: "Puntos de Energía",
      totalDays: "Días Totales",
      currentPacts: "Ascesis Actuales",
      noPacts: "Aún no tienes ascesis activas",
      completedToday: "Completado Hoy",
      daysLeft: "Días Restantes",
      days: "Días",
      todayCompleted: "Completado hoy",
      askUniverse: "Preguntar al Universo",
      path: "Camino",
      ascesis: "Ascesis",
      nav: {
        path: "Camino",
        ascesis: "Ascesis",
        universe: "Universo",
        profile: "Perfil"
      }
    },
    pactOath: {
      title: "Contrato con el Universo",
      subtitle: "Antes de comenzar, haz un juramento",
      agreeText: "Estoy de acuerdo con los términos del contrato",
      oath1: "Asumo plena responsabilidad por mi elección y me comprometo a seguirla hasta el final del período de ascesis.",
      oath2: "Entiendo que romper el contrato debilitará mi conexión con los poderes superiores y obstaculizará mi crecimiento espiritual.",
      oath3: "Seré honesto conmigo mismo y con el Universo al seguir los términos de este contrato.",
      createButton: "Crear Contrato",
      days: "días"
    },
    createPact: {
      title: "Crear Ascesis",
      pactTitle: "Título de Ascesis",
      pactDuration: "Duración (días)",
      pactReward: "Recompensa",
      pactStatus: "Estado",
      createButton: "Crear",
      titlePlaceholder: "Ingrese título...",
      durationPlaceholder: "Ingrese número de días...",
      rewardPlaceholder: "Lo que obtendrás a cambio...",
      titleRequired: "El título es obligatorio",
      durationRequired: "La duración es obligatoria",
      durationInvalid: "La duración debe ser un número",
      days: "días",
      stepOneTitle: "Elegir tipo de ascesis",
      stepTwoTitle: "Elegir duración",
      stepThreeTitle: "Crear contrato",
      placeholders: {
        title: "Ejemplo: Rechazar azúcar",
        rejection: "Selecciona o ingresa a qué renuncias",
        reward: "Lo que obtendrás a cambio..."
      },
      ascesisWarning: "La ascesis no es solo abstinencia, sino una herramienta para el crecimiento espiritual y la superación personal.",
      customDays: "Establecer días personalizados",
      notAsking: "No pido nada a cambio",
      nextButton: "Siguiente"
    },
    onboarding: {
      title: "Bienvenido a Asket",
      description: "Elige tu meta espiritual",
      goal1: "Lograr armonía interior",
      goal2: "Desbloquear el potencial espiritual",
      goal3: "Limpiar la mente de pensamientos negativos",
      goal4: "Fortalecer el poder espiritual",
      goal5: "Encontrar tu camino",
      goal6: "Conocer el verdadero 'Yo'",
      selectGoal: "Seleccionar meta",
      continueButton: "Continuar",
      steps: {
        welcome: "Bienvenida",
        goal: "Elegir meta",
        complete: "Completado",
        length: 3,
        map: []
      },
      buttons: {
        next: "Siguiente",
        start: "Comenzar",
        skip: "Omitir",
        enter: "Entrar",
        startJourney: "Iniciar Camino"
      }
    },
    universe: {
      title: "Universo",
      question: "Pregunta",
      answer: "Respuesta",
      askButton: "Hacer Pregunta",
      questionPlaceholder: "Ingresa tu pregunta...",
      answerPlaceholder: "La respuesta del Universo aparecerá aquí...",
      yourQuestion: "Tu pregunta",
      universeAnswer: "Respuesta del Universo",
      newQuestion: "Nueva pregunta",
      thinking: "El Universo está pensando...",
      previousQuestions: "Preguntas anteriores",
      description: "Haz cualquier pregunta y recibe respuestas sabias directamente del Universo",
      proMessage: "Desbloquea PRO para dialogar con el Universo",
      proTitle: "Diálogo con el Universo",
      learnMore: "Más información",
      chatTitle: "Chat con el Universo",
      chatDescription: "Haz preguntas y recibe respuestas del Universo en tiempo real",
      enterChat: "Entrar al chat",
      chatProTitle: "Chat con el Universo",
      chatProMessage: "Desbloquea PRO para dialogar con el Universo"
    },
    profile: {
      title: "Perfil",
      name: "Nombre",
      birthDate: "Fecha de Nacimiento",
      goal: "Meta",
      stats: "Estadísticas",
      achievements: "Logros",
      saveButton: "Guardar",
      updateSuccess: "Perfil actualizado con éxito",
      updateError: "Error al actualizar el perfil",
      nameRequired: "El nombre es obligatorio",
      birthDateRequired: "La fecha de nacimiento es obligatoria",
      savingButton: "Guardando..."
    },
    meditation: {
      title: "Meditación",
      description: "Elige meditación",
      startButton: "Comenzar",
      play: "Reproducir",
      unlock: "Desbloquear",
      pageTitle: "Meditaciones",
      categories: {
        all: "Todas",
        basic: "Básicas",
        sleep: "Sueño",
        focus: "Enfoque",
        advanced: "Avanzadas",
        morning: "Mañana",
        evening: "Noche",
        stress: "Estrés",
        mantra: "Mantra",
        visual: "Visual"
      },
      morning: {
        title: "Meditación Matutina",
        description: "Comienza tu día con calma y claridad",
        title1: "Meditación Matutina",
        desc1: "Comienza tu día con calma y claridad",
        title2: "Despertar Matutino",
        desc2: "Cárgate de energía para el día"
      },
      evening: {
        title: "Meditación Nocturna",
        description: "Relájate y restaura energía después del día",
        title1: "Meditación Nocturna",
        desc1: "Relájate y restaura energía después del día"
      },
      stress: {
        title: "Anti-estrés",
        description: "Libera tensión y ansiedad",
        title1: "Anti-estrés",
        desc1: "Libera tensión y ansiedad"
      },
      mantra: {
        title: "Meditación con Mantras",
        description: "Usa el poder del sonido para una inmersión profunda",
        title1: "Meditación con Mantras",
        desc1: "Usa el poder del sonido para una inmersión profunda"
      },
      visualization: {
        title: "Visualización",
        description: "Crea imágenes mentales para lograr objetivos",
        title1: "Visualización",
        desc1: "Crea imágenes mentales para lograr objetivos"
      }
    },
    subscription: {
      title: "Suscripción PRO",
      description: "Desbloquea todo el potencial de la aplicación con la suscripción PRO",
      upgradeButton: "Activar PRO",
      proFeatures: "Características PRO",
      proTitle: "PRO",
      cancelButton: "Cancelar Suscripción",
      successMessage: "Suscripción activada con éxito",
      errorMessage: "Error al activar la suscripción",
      bannerTitle: "Eleva Tu Experiencia Espiritual",
      bannerDesc: "Desbloquea acceso completo a todas las meditaciones y funciones",
      upgradeNow: "Mejorar Ahora"
    },
    nav: {
      home: "Inicio",
      universe: "Universo",
      profile: "Perfil",
      comparison: "Comparación"
    },
    calendar: {
      today: "Hoy",
      month: "Mes",
      year: "Año"
    },
    minimumPeriod: "El período mínimo de ascesis es de 30 días",
    userProfile: {
      personal: "Información Personal",
      name: "Nombre",
      birthDate: "Fecha de Nacimiento",
      emailAddressLabel: "Correo Electrónico",
      updateProfile: "Actualizar Perfil",
      passwordLabel: "Contraseña",
      changePassword: "Cambiar Contraseña",
      profileUpdated: "Perfil actualizado con éxito",
      updateFailed: "Error al actualizar el perfil",
      bioLabel: "Biografía",
      updateButton: "Actualizar",
      savingButton: "Guardando...",
      nameRequired: "El nombre es obligatorio",
      emailRequired: "El correo electrónico es obligatorio",
      dobRequired: "La fecha de nacimiento es obligatoria",
      nameLabel: "Nombre",
      birthDateLabel: "Fecha de Nacimiento",
      namePlaceholder: "Ingrese su nombre",
      birthDatePlaceholder: "Elija su fecha de nacimiento",
      title: "Perfil de Usuario",
      age: "Edad",
      continueButton: "Continuar",
      currentDate: "Fecha actual",
      languageLabel: "Idioma",
      birthDateRequired: "La fecha de nacimiento es obligatoria"
    }
  }
};

// Add SupportedLanguage type export
export type SupportedLanguage = 'ru' | 'en' | 'es';
