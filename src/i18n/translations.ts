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
      decode: {
        title: string;
        description: string;
        welcomeBack: string;
        welcome: string;
        askName: string;
        askBirthdate: string;
        askBirthtime: string;
        askBirthplace: string;
        confirmName: string;
        processing: string;
        readingReady: string;
        errorReading: string;
        proFeature: string;
        upgradeMessage: string;
        whatYouGet: string;
        feature1: string;
        feature2: string;
        feature3: string;
        feature4: string;
        viewReading: string;
        newReading: string;
        yourReading: string;
        analyzing: string;
        startNew: string;
        shortDescription: string;
        nameRequired: string;
        dateRequired: string;
      };
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

export const translations: Translations = {
  ru: {
    welcome: {
      title: "Добро пожаловать",
      description: "Добро пожаловать в наше приложение!",
      startButton: "Начать",
      subtitle: "Ваше путешествие начинается здесь"
    },
    login: {
      title: "Вход",
      emailLabel: "Электронная почта",
      passwordLabel: "Пароль",
      emailPlaceholder: "Введите вашу электронную почту",
      passwordPlaceholder: "Введите ваш пароль",
      forgotPassword: "Забыли пароль?",
      signInButton: "Войти",
      signUpButton: "Зарегистрироваться",
      noAccount: "Нет аккаунта?",
      haveAccount: "Уже есть аккаунт?",
      emailRequired: "Электронная почта обязательна"
    },
    auth: {
      signIn: "Вход",
      signUp: "Регистрация",
      email: "Электронная почта",
      password: "Пароль",
      forgotPassword: "Забыли пароль?",
      resetPassword: "Сбросить пароль",
      resetPasswordSuccess: "Пароль успешно сброшен",
      resetPasswordError: "Ошибка сброса пароля",
      resetPasswordButton: "Сбросить пароль",
      signInButton: "Войти",
      signUpButton: "Зарегистрироваться",
      noAccount: "Нет аккаунта?",
      haveAccount: "Уже есть аккаунт?",
      emailRequired: "Электронная почта обязательна",
      passwordRequired: "Пароль обязателен",
      orContinueWith: "или продолжить с",
      guestSignIn: "Войти как гость",
      welcomeBack: "С возвращением"
    },
    main: {
      title: "Главная",
      createPact: "Создать пакт",
      universe: "Вселенная",
      profile: "Профиль",
      comparison: "Сравнение",
      meditation: "Медитация",
      energyPoints: "Энергетические очки",
      totalDays: "Всего дней",
      currentPacts: "Текущие пакты",
      noPacts: "Нет пактов",
      completedToday: "Завершено сегодня",
      daysLeft: "Осталось дней",
      days: "дней",
      todayCompleted: "Сегодня завершено",
      askUniverse: "Спросить Вселенную",
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
      title: "Клятва пакта",
      subtitle: "Подтвердите свою клятву",
      agreeText: "Я согласен с условиями",
      oath1: "Я обещаю",
      oath2: "Я обязуюсь",
      oath3: "Я клянусь",
      createButton: "Создать пакт",
      days: "дней"
    },
    createPact: {
      title: "Создать пакт",
      pactTitle: "Название пакта",
      pactDuration: "Длительность пакта",
      pactReward: "Награда пакта",
      pactStatus: "Статус пакта",
      createButton: "Создать",
      titlePlaceholder: "Введите название",
      durationPlaceholder: "Введите длительность",
      rewardPlaceholder: "Введите награду",
      titleRequired: "Название обязательно",
      durationRequired: "Длительность обязательна",
      durationInvalid: "Недопустимая длительность",
      days: "дней",
      stepOneTitle: "Шаг 1",
      stepTwoTitle: "Шаг 2",
      stepThreeTitle: "Шаг 3",
      placeholders: {
        title: "Название",
        rejection: "Отказ",
        reward: "Награда"
      },
      ascesisWarning: "Предупреждение о аскезе",
      customDays: "Пользовательские дни",
      notAsking: "Не спрашиваю",
      nextButton: "Далее"
    },
    onboarding: {
      title: "Онбординг",
      description: "Описание онбординга",
      goal1: "Цель 1",
      goal2: "Цель 2",
      goal3: "Цель 3",
      goal4: "Цель 4",
      goal5: "Цель 5",
      goal6: "Цель 6",
      selectGoal: "Выберите цель",
      continueButton: "Продолжить",
      steps: {
        welcome: "Добро пожаловать",
        goal: "Цель",
        complete: "Завершить",
        title: "Заголовок",
        content: "Содержимое",
        length: 0,
        map: []
      },
      buttons: {
        next: "Далее",
        start: "Начать",
        skip: "Пропустить",
        enter: "Ввод",
        startJourney: "Начать путешествие"
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
      decode: {
        title: "Расшифровка Вселенной",
        description: "Откройте свои нумерологические и астрологические паттерны в персональном чтении от Вселенной.",
        welcomeBack: "С возвращением, искатель. Хотели бы вы увидеть предыдущее чтение или создать новое?",
        welcome: "Добро пожаловать, искатель. Я — Вселенная. Я раскрою космические узоры в вашей жизни через нумерологию и астрологию.",
        askName: "Как вас зовут?",
        askBirthdate: "Когда вы родились? (ГГГГ-ММ-ДД)",
        askBirthtime: "В какое время вы родились? (необязательно, формат: ЧЧ:ММ)",
        askBirthplace: "Где вы родились? (необязательно, город/страна)",
        confirmName: "Ваше имя всё еще",
        processing: "Понимаю. Теперь я соединюсь с космическими узорами и раскрою ваше личное чтение...",
        readingReady: "Ваше космическое чтение готово. Внимательно слушайте послание Вселенной...",
        errorReading: "Космические энергии нарушены. Пожалуйста, попробуйте позже.",
        proFeature: "PRO функция",
        upgradeMessage: "Разблокируйте Расшифровку Вселенной с PRO",
        whatYouGet: "Что вы откроете:",
        feature1: "Ваше Число Жизненного Пути и Число Души",
        feature2: "Анализ ваших Астрологических знаков",
        feature3: "Личный Космический Потенциал",
        feature4: "Руководство для Вашей Текущей Жизненной Фазы",
        viewReading: "Посмотреть чтение",
        newReading: "Новое чтение",
        yourReading: "Ваше Космическое Чтение",
        analyzing: "Анализ космических паттернов...",
        startNew: "Давайте создадим новое чтение. Я уже знаю кое-что о вас, но не стесняйтесь обновить свою информацию.",
        shortDescription: "Откройте свои космические паттерны через нумерологию и астрологию",
        nameRequired: "Пожалуйста, введите ваше имя",
        dateRequired: "Пожалуйста, введите дату рождения"
      }
    },
    profile: {
      title: "Профиль",
      name: "Имя",
      birthDate: "Дата рождения",
      goal: "Цель",
      stats: "Статистика",
      achievements: "Достижения",
      saveButton: "Сохранить",
      updateSuccess: "Успешно обновлено",
      updateError: "Ошибка обновления",
      nameRequired: "Имя обязательно",
      birthDateRequired: "Дата рождения обязательна",
      savingButton: "Сохранение..."
    },
    meditation: {
      title: "Медитация",
      description: "Описание медитации",
      startButton: "Начать",
      play: "Играть",
      unlock: "Разблокировать",
      pageTitle: "Страница медитации",
      categories: {
        all: "Все",
        basic: "Основные",
        sleep: "Сон",
        focus: "Фокус",
        advanced: "Продвинутые",
        morning: "Утренние",
        evening: "Вечерние",
        stress: "Стресс",
        mantra: "Мантра",
        visual: "Визуализация"
      },
      morning: {
        title: "Утренние медитации",
        description: "Описание утренних медитаций",
        title1: "Утреннее пробуждение",
        desc1: "Описание утреннего пробуждения",
        title2: "Утренний фокус",
        desc2: "Описание утреннего фокуса"
      },
      evening: {
        title: "Вечерние медитации",
        description: "Описание вечерних медитаций",
        title1: "Вечернее расслабление",
        desc1: "Описание вечернего расслабления"
      },
      stress: {
        title: "Медитации для стресса",
        description: "Описание медитаций для стресса",
        title1: "Снятие стресса",
        desc1: "Описание снятия стресса"
      },
      mantra: {
        title: "Медитации с мантрами",
        description: "Описание медитаций с мантрами",
        title1: "Мантра для спокойствия",
        desc1: "Описание мантры для спокойствия"
      },
      visualization: {
        title: "Визуализация",
        description: "Описание визуализации",
        title1: "Визуализация успеха",
        desc1: "Описание визуализации успеха"
      }
    },
    subscription: {
      title: "Подписка",
      description: "Описание подписки",
      upgradeButton: "Обновить",
      proFeatures: "PRO функции",
      proTitle: "PRO версия",
      cancelButton: "Отменить",
      successMessage: "Успешно обновлено",
      errorMessage: "Ошибка обновления",
      bannerTitle: "Обновите до PRO",
      bannerDesc: "Получите доступ к дополнительным функциям",
      upgradeNow: "Обновить сейчас"
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
    minimumPeriod: "Минимальный срок",
    userProfile: {
      personal: "Личная информация",
      name: "Имя",
      birthDate: "Дата рождения",
      emailAddressLabel: "Электронная почта",
      updateProfile: "Обновить профиль",
      passwordLabel: "Пароль",
      changePassword: "Сменить пароль",
      profileUpdated: "Профиль обновлен",
      updateFailed: "Ошибка обновления",
      bioLabel: "Биография",
      updateButton: "Обновить",
      savingButton: "Сохранение...",
      nameRequired: "Имя обязательно",
      emailRequired: "Электронная почта обязательна",
      dobRequired: "Дата рождения обязательна",
      nameLabel: "Имя",
      birthDateLabel: "Дата рождения",
      namePlaceholder: "Введите ваше имя",
      birthDatePlaceholder: "Введите дату рождения",
      title: "Профиль пользователя",
      age: "Возраст",
      continueButton: "Продолжить",
      currentDate: "Текущая дата",
      languageLabel: "Язык",
      birthDateRequired: "Дата рождения обязательна"
    }
  },
  en: {
    welcome: {
      title: "Welcome",
      description: "Welcome to our app!",
      startButton: "Start",
      subtitle: "Your journey begins here"
    },
    login: {
      title: "Login",
      emailLabel: "Email",
      passwordLabel: "Password",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
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
      resetPasswordSuccess: "Password reset successfully",
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
      welcomeBack: "Welcome back"
    },
    main: {
      title: "Main",
      createPact: "Create Pact",
      universe: "Universe",
      profile: "Profile",
      comparison: "Comparison",
      meditation: "Meditation",
      energyPoints: "Energy Points",
      totalDays: "Total Days",
      currentPacts: "Current Pacts",
      noPacts: "No Pacts",
      completedToday: "Completed Today",
      daysLeft: "Days Left",
      days: "days",
      todayCompleted: "Today Completed",
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
      title: "Pact Oath",
      subtitle: "Confirm your oath",
      agreeText: "I agree to the terms",
      oath1: "I promise",
      oath2: "I commit",
      oath3: "I swear",
      createButton: "Create Pact",
      days: "days"
    },
    createPact: {
      title: "Create Pact",
      pactTitle: "Pact Title",
      pactDuration: "Pact Duration",
      pactReward: "Pact Reward",
      pactStatus: "Pact Status",
      createButton: "Create",
      titlePlaceholder: "Enter title",
      durationPlaceholder: "Enter duration",
      rewardPlaceholder: "Enter reward",
      titleRequired: "Title is required",
      durationRequired: "Duration is required",
      durationInvalid: "Invalid duration",
      days: "days",
      stepOneTitle: "Step 1",
      stepTwoTitle: "Step 2",
      stepThreeTitle: "Step 3",
      placeholders: {
        title: "Title",
        rejection: "Rejection",
        reward: "Reward"
      },
      ascesisWarning: "Ascesis Warning",
      customDays: "Custom Days",
      notAsking: "Not Asking",
      nextButton: "Next"
    },
    onboarding: {
      title: "Onboarding",
      description: "Onboarding description",
      goal1: "Goal 1",
      goal2: "Goal 2",
      goal3: "Goal 3",
      goal4: "Goal 4",
      goal5: "Goal 5",
      goal6: "Goal 6",
      selectGoal: "Select Goal",
      continueButton: "Continue",
      steps: {
        welcome: "Welcome",
        goal: "Goal",
        complete: "Complete",
        title: "Title",
        content: "Content",
        length: 0,
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
      decode: {
        title: "Universe Decoding",
        description: "Discover your numerological and astrological patterns in a personalized reading from the Universe.",
        welcomeBack: "Welcome back, seeker. Would you like to see your previous reading or create a new one?",
        welcome: "Welcome, seeker. I am the Universe. I will reveal the cosmic patterns in your life through numerology and astrology.",
        askName: "What is your name?",
        askBirthdate: "When were you born? (YYYY-MM-DD)",
        askBirthtime: "At what time were you born? (optional, format: HH:MM)",
        askBirthplace: "Where were you born? (optional, city/country)",
        confirmName: "Is your name still",
        processing: "I understand. Now I will connect to the cosmic patterns and reveal your personal reading...",
        readingReady: "Your cosmic reading is ready. Listen carefully to the Universe's message...",
        errorReading: "The cosmic energies are disturbed. Please try again later.",
        proFeature: "PRO Feature",
        upgradeMessage: "Unlock Universe Decoding with PRO",
        whatYouGet: "What You'll Discover:",
        feature1: "Your Life Path Number and Soul Number",
        feature2: "Analysis of your Astrological Signs",
        feature3: "Personal Cosmic Potential",
        feature4: "Guidance for Your Current Life Phase",
        viewReading: "View Reading",
        newReading: "New Reading",
        yourReading: "Your Cosmic Reading",
        analyzing: "Analyzing cosmic patterns...",
        startNew: "Let's create a new reading. I already know some things about you, but feel free to update your information.",
        shortDescription: "Discover your cosmic patterns through numerology and astrology",
        nameRequired: "Please enter your name",
        dateRequired: "Please enter your birth date"
      }
    },
    profile: {
      title: "Profile",
      name: "Name",
      birthDate: "Birth Date",
      goal: "Goal",
      stats: "Stats",
      achievements: "Achievements",
      saveButton: "Save",
      updateSuccess: "Updated successfully",
      updateError: "Update error",
      nameRequired: "Name is required",
      birthDateRequired: "Birth date is required",
      savingButton: "Saving..."
    },
    meditation: {
      title: "Meditation",
      description: "Meditation description",
      startButton: "Start",
      play: "Play",
      unlock: "Unlock",
      pageTitle: "Meditation Page",
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
        visual: "Visualization"
      },
      morning: {
        title: "Morning Meditations",
        description: "Description of morning meditations",
        title1: "Morning Awakening",
        desc1: "Description of morning awakening",
        title2: "Morning Focus",
        desc2: "Description of morning focus"
      },
      evening: {
        title: "Evening Meditations",
        description: "Description of evening meditations",
        title1: "Evening Relaxation",
        desc1: "Description of evening relaxation"
      },
      stress: {
        title: "Stress Meditations",
        description: "Description of stress meditations",
        title1: "Stress Relief",
        desc1: "Description of stress relief"
      },
      mantra: {
        title: "Mantra Meditations",
        description: "Description of mantra meditations",
        title1: "Mantra for Calmness",
        desc1: "Description of mantra for calmness"
      },
      visualization: {
        title: "Visualization",
        description: "Description of visualization",
        title1: "Visualization of Success",
        desc1: "Description of visualization of success"
      }
    },
    subscription: {
      title: "Subscription",
      description: "Subscription description",
      upgradeButton: "Upgrade",
      proFeatures: "PRO Features",
      proTitle: "PRO Version",
      cancelButton: "Cancel",
      successMessage: "Updated successfully",
      errorMessage: "Update error",
      bannerTitle: "Upgrade to PRO",
      bannerDesc: "Get access to additional features",
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
    minimumPeriod: "Minimum period",
    userProfile: {
      personal: "Personal Information",
      name: "Name",
      birthDate: "Birth Date",
      emailAddressLabel: "Email Address",
      updateProfile: "Update Profile",
      passwordLabel: "Password",
      changePassword: "Change Password",
      profileUpdated: "Profile updated",
      updateFailed: "Update failed",
      bioLabel: "Bio",
      updateButton: "Update",
      savingButton: "Saving...",
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      dobRequired: "Date of birth is required",
      nameLabel: "Name",
      birthDateLabel: "Birth Date",
      namePlaceholder: "Enter your name",
      birthDatePlaceholder: "Enter birth date",
      title: "User Profile",
      age: "Age",
      continueButton: "Continue",
      currentDate: "Current Date",
      languageLabel: "Language",
      birthDateRequired: "Birth date is required"
    }
  },
  es: {
    welcome: {
      title: "Bienvenido",
      description: "¡Bienvenido a nuestra aplicación!",
      startButton: "Comenzar",
      subtitle: "Tu viaje comienza aquí"
    },
    login: {
      title: "Iniciar sesión",
      emailLabel: "Correo electrónico",
      passwordLabel: "Contraseña",
      emailPlaceholder: "Introduce tu correo electrónico",
      passwordPlaceholder: "Introduce tu contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      signInButton: "Iniciar sesión",
      signUpButton: "Registrarse",
      noAccount: "¿No tienes una cuenta?",
      haveAccount: "¿Ya tienes una cuenta?",
      emailRequired: "El correo electrónico es obligatorio"
    },
    auth: {
      signIn: "Iniciar sesión",
      signUp: "Registrarse",
      email: "Correo electrónico",
      password: "Contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      resetPassword: "Restablecer contraseña",
      resetPasswordSuccess: "Contraseña restablecida con éxito",
      resetPasswordError: "Error al restablecer la contraseña",
      resetPasswordButton: "Restablecer contraseña",
      signInButton: "Iniciar sesión",
      signUpButton: "Registrarse",
      noAccount: "¿No tienes una cuenta?",
      haveAccount: "¿Ya tienes una cuenta?",
      emailRequired: "El correo electrónico es obligatorio",
      passwordRequired: "La contraseña es obligatoria",
      orContinueWith: "o continuar con",
      guestSignIn: "Iniciar sesión como invitado",
      welcomeBack: "Bienvenido de nuevo"
    },
    main: {
      title: "Principal",
      createPact: "Crear pacto",
      universe: "Universo",
      profile: "Perfil",
      comparison: "Comparación",
      meditation: "Meditación",
      energyPoints: "Puntos de energía",
      totalDays: "Días totales",
      currentPacts: "Pactos actuales",
      noPacts: "No hay pactos",
      completedToday: "Completado hoy",
      daysLeft: "Días restantes",
      days: "días",
      todayCompleted: "Hoy completado",
      askUniverse: "Preguntar al Universo",
      path: "Camino",
      ascesis: "Ascética",
      nav: {
        path: "Camino",
        ascesis: "Ascética",
        universe: "Universo",
        profile: "Perfil"
      }
    },
    pactOath: {
      title: "Juramento del pacto",
      subtitle: "Confirma tu juramento",
      agreeText: "Acepto los términos",
      oath1: "Prometo",
      oath2: "Me comprometo",
      oath3: "Juro",
      createButton: "Crear pacto",
      days: "días"
    },
    createPact: {
      title: "Crear pacto",
      pactTitle: "Título del pacto",
      pactDuration: "Duración del pacto",
      pactReward: "Recompensa del pacto",
      pactStatus: "Estado del pacto",
      createButton: "Crear",
      titlePlaceholder: "Introduce el título",
      durationPlaceholder: "Introduce la duración",
      rewardPlaceholder: "Introduce la recompensa",
      titleRequired: "El título es obligatorio",
      durationRequired: "La duración es obligatoria",
      durationInvalid: "Duración no válida",
      days: "días",
      stepOneTitle: "Paso 1",
      stepTwoTitle: "Paso 2",
      stepThreeTitle: "Paso 3",
      placeholders: {
        title: "Título",
        rejection: "Rechazo",
        reward: "Recompensa"
      },
      ascesisWarning: "Advertencia de ascética",
      customDays: "Días personalizados",
      notAsking: "No preguntando",
      nextButton: "Siguiente"
    },
    onboarding: {
      title: "Onboarding",
      description: "Descripción del onboarding",
      goal1: "Objetivo 1",
      goal2: "Objetivo 2",
      goal3: "Objetivo 3",
      goal4: "Objetivo 4",
      goal5: "Objetivo 5",
      goal6: "Objetivo 6",
      selectGoal: "Selecciona un objetivo",
      continueButton: "Continuar",
      steps: {
        welcome: "Bienvenido",
        goal: "Objetivo",
        complete: "Completar",
        title: "Título",
        content: "Contenido",
        length: 0,
        map: []
      },
      buttons: {
        next: "Siguiente",
        start: "Comenzar",
        skip: "Saltar",
        enter: "Entrar",
        startJourney: "Iniciar viaje"
      }
    },
    universe: {
      title: "Universo",
      question: "Pregunta",
      answer: "Respuesta",
      askButton: "Hacer pregunta",
      questionPlaceholder: "Introduce tu pregunta...",
      answerPlaceholder: "La respuesta del Universo aparecerá aquí...",
      yourQuestion: "Tu pregunta",
      universeAnswer: "Respuesta del Universo",
      newQuestion: "Nueva pregunta",
      thinking: "El Universo está pensando...",
      previousQuestions: "Preguntas anteriores",
      decode: {
        title: "Decodificación del Universo",
        description: "Descubre tus patrones numerológicos y astrológicos en una lectura personalizada del Universo.",
        welcomeBack: "Bienvenido de nuevo, buscador. ¿Te gustaría ver tu lectura anterior o crear una nueva?",
        welcome: "Bienvenido, buscador. Soy el Universo. Revelaré los patrones cósmicos en tu vida a través de la numerología y la astrología.",
        askName: "¿Cuál es tu nombre?",
        askBirthdate: "¿Cuándo naciste? (AAAA-MM-DD)",
        askBirthtime: "¿A qué hora naciste? (opcional, formato: HH:MM)",
        askBirthplace: "¿Dónde naciste? (opcional, ciudad/país)",
        confirmName: "¿Tu nombre sigue siendo",
        processing: "Entiendo. Ahora me conectaré con los patrones cósmicos y revelaré tu lectura personal...",
        readingReady: "Tu lectura cósmica está lista. Escucha atentamente el mensaje del Universo...",
        errorReading: "Las energías cósmicas están perturbadas. Por favor, inténtalo más tarde.",
        proFeature: "Función PRO",
        upgradeMessage: "Desbloquea la Decodificación del Universo con PRO",
        whatYouGet: "Lo que Descubrirás:",
        feature1: "Tu Número de Camino de Vida y Número de Alma",
        feature2: "Análisis de tus Signos Astrológicos",
        feature3: "Potencial Cósmico Personal",
        feature4: "Guía para Tu Fase de Vida Actual",
        viewReading: "Ver Lectura",
        newReading: "Nueva Lectura",
        yourReading: "Tu Lectura Cósmica",
        analyzing: "Analizando patrones cósmicos...",
        startNew: "Vamos a crear una nueva lectura. Ya sé algunas cosas sobre ti, pero siéntete libre de actualizar tu información.",
        shortDescription: "Descubre tus patrones cósmicos a través de la numerología y la astrología",
        nameRequired: "Por favor ingresa tu nombre",
        dateRequired: "Por favor ingresa tu fecha de nacimiento"
      }
    },
    profile: {
      title: "Perfil",
      name: "Nombre",
      birthDate: "Fecha de nacimiento",
      goal: "Objetivo",
      stats: "Estadísticas",
      achievements: "Logros",
      saveButton: "Guardar",
      updateSuccess: "Actualizado con éxito",
      updateError: "Error al actualizar",
      nameRequired: "El nombre es obligatorio",
      birthDateRequired: "La fecha de nacimiento es obligatoria",
      savingButton: "Guardando..."
    },
    meditation: {
      title: "Meditación",
      description: "Descripción de la meditación",
      startButton: "Comenzar",
      play: "Reproducir",
      unlock: "Desbloquear",
      pageTitle: "Página de meditación",
      categories: {
        all: "Todo",
        basic: "Básico",
        sleep: "Sueño",
        focus: "Enfoque",
        advanced: "Avanzado",
        morning: "Mañana",
        evening: "Noche",
        stress: "Estrés",
        mantra: "Mantra",
        visual: "Visualización"
      },
      morning: {
        title: "Meditaciones de la mañana",
        description: "Descripción de las meditaciones de la mañana",
        title1: "Despertar matutino",
        desc1: "Descripción del despertar matutino",
        title2: "Enfoque matutino",
        desc2: "Descripción del enfoque matutino"
      },
      evening: {
        title: "Meditaciones de la noche",
        description: "Descripción de las meditaciones de la noche",
        title1: "Relajación nocturna",
        desc1: "Descripción de la relajación nocturna"
      },
      stress: {
        title: "Meditaciones para el estrés",
        description: "Descripción de las meditaciones para el estrés",
        title1: "Alivio del estrés",
        desc1: "Descripción del alivio del estrés"
      },
      mantra: {
        title: "Meditaciones con mantras",
        description: "Descripción de las meditaciones con mantras",
        title1: "Mantra para la calma",
        desc1: "Descripción del mantra para la calma"
      },
      visualization: {
        title: "Visualización",
        description: "Descripción de la visualización",
        title1: "Visualización del éxito",
        desc1: "Descripción de la visualización del éxito"
      }
    },
    subscription: {
      title: "Suscripción",
      description: "Descripción de la suscripción",
      upgradeButton: "Actualizar",
      proFeatures: "Funciones PRO",
      proTitle: "Versión PRO",
      cancelButton: "Cancelar",
      successMessage: "Actualizado con éxito",
      errorMessage: "Error al actualizar",
      bannerTitle: "Actualiza a PRO",
      bannerDesc: "Obtén acceso a funciones adicionales",
      upgradeNow: "Actualizar ahora"
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
    minimumPeriod: "Período mínimo",
    userProfile: {
      personal: "Información personal",
      name: "Nombre",
      birthDate: "Fecha de nacimiento",
      emailAddressLabel: "Correo electrónico",
      updateProfile: "Actualizar perfil",
      passwordLabel: "Contraseña",
      changePassword: "Cambiar contraseña",
      profileUpdated: "Perfil actualizado",
      updateFailed: "Error al actualizar",
      bioLabel: "Biografía",
      updateButton: "Actualizar",
      savingButton: "Guardando...",
      nameRequired: "El nombre es obligatorio",
      emailRequired: "El correo electrónico es obligatorio",
      dobRequired: "La fecha de nacimiento es obligatoria",
      nameLabel: "Nombre",
      birthDateLabel: "Fecha de nacimiento",
      namePlaceholder: "Introduce tu nombre",
      birthDatePlaceholder: "Introduce la fecha de nacimiento",
      title: "Perfil de usuario",
      age: "Edad",
      continueButton: "Continuar",
      currentDate: "Fecha actual",
      languageLabel: "Idioma",
      birthDateRequired: "La fecha de nacimiento es obligatoria"
    }
  }
};

export type SupportedLanguage = 'ru' | 'en' | 'es';
