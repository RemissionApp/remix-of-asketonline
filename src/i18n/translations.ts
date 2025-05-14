
export type SupportedLanguage = 'ru' | 'en' | 'es';

type TranslationKeys = {
  welcome: {
    title: string;
    subtitle: string;
    startButton: string;
  };
  onboarding: {
    steps: {
      title: string;
      content: string;
    }[];
    buttons: {
      next: string;
      enter: string;
      startJourney: string;
    };
  };
  main: {
    days: string;
    todayCompleted: string;
    askUniverse: string;
    noPacts: string;
    createPact: string;
    nav: {
      path: string;
      ascesis: string;
      universe: string;
      profile: string;
    };
  };
  createPact: {
    title: string;
    stepOneTitle: string;
    stepTwoTitle: string;
    stepThreeTitle: string;
    whatRejecting: string;
    examples: string[];
    trialPeriod: string;
    customDays: string;
    days: string;
    whatWant: string;
    notAsking: string;
    nextButton: string;
    startPathButton: string;
    placeholders: {
      rejection: string;
      reward: string;
    };
    ascesisWarning: string;
  };
  universe: {
    title: string;
    question: string;
    placeholder: string;
    askButton: string;
    thinking: string;
    yourQuestion: string;
    universeAnswer: string;
    newQuestion: string;
    previousQuestions: string;
    emptyState: string;
  };
  profile: {
    title: string;
    daysOfAscesis: string;
    energy: string;
    settings: string;
    settingsItems: string[];
    proFeatures: string[];
    proTitle: string;
    proDescription: string;
    proButton: string;
    achievements: {
      title: string;
      unlocked: string;
      locked: string;
      empty: string;
    };
    missions: {
      title: string;
      current: string;
      empty: string;
      get: string;
      about: string;
      description: string;
      rewards: string;
    };
    ranks: {
      next: string;
      progress: string;
      seeker: string;
      pilgrim: string;
      warrior: string;
      master: string;
      enlightened: string;
    };
  };
  pactOath: {
    title: string;
    subtitle: string;
    iPromise: string;
    duration: string;
    days: string;
    inReturn: string;
    confirmButton: string;
  };
  userProfile: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    nameRequired: string;
    birthDateLabel: string;
    birthDatePlaceholder: string;
    birthDateRequired: string;
    continueButton: string;
  };
  gamification: {
    energyPoints: string;
    levelUp: string;
    newAchievement: string;
    newMission: string;
    missionCompleted: string;
    rankTitle: string;
    pointsEarned: string;
    rewards: string;
  };
  calendar: {
    year: string;
    month: string;
  };
  minimumPeriod: string;
  comparison: {
    title: string;
    freePlan: string;
    proPlan: string;
    free: string;
    pricing: string;
    upgradeButton: string;
    features: {
      name: string;
      free: boolean;
      pro: boolean;
      freeDescription: string;
      proDescription?: string;
    }[];
  };
  meditation: {
    pageTitle: string;
    subtitle: string;
    proFeatures: string;
    basic: string;
    pro: string;
    duration: string;
    play: string;
    unlock: string;
    comingSoon: string;
    categories: {
      morning: string;
      evening: string;
      stress: string;
      mantra: string;
      visual: string;
    };
    morning: {
      title1: string;
      desc1: string;
      title2: string;
      desc2: string;
    };
    evening: {
      title1: string;
      desc1: string;
    };
    stress: {
      title1: string;
      desc1: string;
    };
    mantra: {
      title1: string;
      desc1: string;
    };
    visualization: {
      title1: string;
      desc1: string;
    };
  };
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    backToSignIn: string;
    createAccount: string;
    alreadyHaveAccount: string;
    resetPassword: string;
    resetPasswordButton: string;
    resetPasswordSuccess: string;
    resetPasswordError: string;
    signInError: string;
    signUpError: string;
    passwordMismatch: string;
    welcomeBack: string;
    noAccount: string;
    orContinueWith: string;
    signInButton: string;
    signUpButton: string;
    haveAccount: string;
    passwordLength: string;
  };
  subscription: {
    bannerTitle: string;
    bannerDesc: string;
    upgradeNow: string;
  };
};

const translations: Record<SupportedLanguage, TranslationKeys> = {
  ru: {
    welcome: {
      title: "ASKET",
      subtitle: "Путь к внутренней силе",
      startButton: "Начать путешествие",
    },
    onboarding: {
      steps: [
        {
          title: "Добро пожаловать",
          content: "Что-то внутри тебя просится наружу.\nЭто не тревога. Это — пробуждение.\n\nТы на пороге новой версии себя."
        },
        {
          title: "Что такое Аскеза",
          content: "Аскеза — это священный договор с Вселенной. Каждый день отказа от чего-то низкого повышает твою вибрацию и раскрывает внутреннюю силу."
        },
        {
          title: "Почему она работает",
          content: "Отказываясь от искушения, ты усиливаешь свою волю и настраиваешься на высшие энергии. Вселенная видит твои усилия и отвечает взаимностью."
        },
        {
          title: "Кем ты станешь",
          content: "Человеком, чьи желания подчинены воле. Тем, кто способен формировать реальность через осознанный отказ и притяжение высшего. Властелином своей судьбы."
        }
      ],
      buttons: {
        next: "Далее",
        enter: "Войти",
        startJourney: "Начать путь"
      }
    },
    main: {
      days: "дней",
      todayCompleted: "Сегодня я выдержал",
      askUniverse: "Спросить Вселенну",
      noPacts: "У тебя пока нет активных аскез",
      createPact: "Заключить договор",
      nav: {
        path: "Путь",
        ascesis: "Аскезы",
        universe: "Вселенная",
        profile: "Профиль"
      }
    },
    createPact: {
      title: "Создание Аскезы",
      stepOneTitle: "От чего ты отказываешься?",
      stepTwoTitle: "Срок испытания",
      stepThreeTitle: "Что ты хочешь получить?",
      whatRejecting: "От чего ты отказываешься?",
      examples: [
        "Сахар", 
        "Телефон после 22:00", 
        "Сигареты", 
        "Прокрастинация", 
        "Социальные сети"
      ],
      trialPeriod: "Срок испытания",
      customDays: "Или укажите своё количество дней:",
      days: "дней",
      whatWant: "Что ты хочешь получить?",
      notAsking: "Ты не просишь. Ты настраиваешь реальность.",
      nextButton: "Далее",
      startPathButton: "Начать путь",
      placeholders: {
        rejection: "Например: Сахар, Соцсети, Алкоголь...",
        reward: "Например: Крепкое здоровье, Ясность мышления, Финансовую стабильность..."
      },
      ascesisWarning: "Вы должны понимать, что Аскеза — серьёзная практика и отнестись к ней необходимо максимально ответственно. Вы даёте слово Вселенной о выполнении обязательств с Вашей стороны и просите взамен исполнения желания / решения какого-то вопроса. Если Вы дадите не справиться и не сдержите Ваше слово, то Вселенная не будет воспринимать Вас всерьёз и есть риск выпасть из потока..."
    },
    universe: {
      title: "Врата Вселенной",
      question: "Что ты хочешь спросить у Вселенной?",
      placeholder: "Напиши свой вопрос здесь...",
      askButton: "Отправить вопрос",
      thinking: "Вселенная обдумывает ответ...",
      yourQuestion: "Твой вопрос",
      universeAnswer: "Ответ Вселенной",
      newQuestion: "Задать новый вопрос",
      previousQuestions: "Предыдущие вопросы",
      emptyState: "У тебя еще нет вопросов к Вселенной"
    },
    profile: {
      title: "Профиль",
      daysOfAscesis: "Дней аскезы",
      energy: "Энергии",
      settings: "Настройки",
      settingsItems: ['Уведомления', 'Темы оформления', 'Звук', 'Язык'],
      proFeatures: [
        'До 5 аскез одновременно',
        'Доступ к премиум-медитациям',
        'Визуальные темы оформления',
        'Дополнительные вопросы к Вселенной',
        'Ритуалы силы и прорывные практики'
      ],
      proTitle: "ASKET PRO",
      proDescription: "Разблокируй дополнительные возможности и усиль свой путь",
      proButton: "Открыть силу PRO ✨",
      achievements: {
        title: "Достижения",
        unlocked: "Разблокированные достижения",
        locked: "Предстоящие достижения",
        empty: "У вас пока нет разблокированных достижений"
      },
      missions: {
        title: "Миссии",
        current: "Текущая миссия",
        empty: "У вас нет активных миссий",
        get: "Получить миссию",
        about: "О космических миссиях",
        description: "Космические миссии — это специальные задания от Вселенной, которые помогут вам укрепить вашу силу духа и получить дополнительные награды. Завершайте миссии и получайте энергетические очки и достижения.",
        rewards: "Эксклюзивные награды"
      },
      ranks: {
        next: "до ранга",
        progress: "прогресс",
        seeker: "Искатель",
        pilgrim: "Пилигрим",
        warrior: "Воин Света",
        master: "Мастер",
        enlightened: "Просветлённый"
      }
    },
    pactOath: {
      title: "Моя Аскеза",
      subtitle: "Я даю обет",
      iPromise: "Я обещаю отказаться от",
      duration: "на срок",
      days: "дней",
      inReturn: "Взамен я притягиваю в свою жизнь",
      confirmButton: "Подтверждаю Договор"
    },
    userProfile: {
      title: "О тебе",
      nameLabel: "Как тебя зовут",
      namePlaceholder: "Введите ваше имя",
      nameRequired: "Имя обязательно",
      birthDateLabel: "Дата рождения",
      birthDatePlaceholder: "Выберите дату рождения",
      birthDateRequired: "Укажите дату рождения",
      continueButton: "Продолжить"
    },
    gamification: {
      energyPoints: "Очки энергии",
      levelUp: "Повышение ранга!",
      newAchievement: "Новое достижение!",
      newMission: "Новая миссия!",
      missionCompleted: "Миссия выполнена!",
      rankTitle: "Ваш ранг:",
      pointsEarned: "Получено очков:",
      rewards: "Награды:"
    },
    calendar: {
      year: 'Год',
      month: 'Месяц'
    },
    minimumPeriod: 'Минимальный срок аскезы - 30 дней',
    comparison: {
      title: "ASKET vs ASKET PRO",
      freePlan: "Бесплатно",
      proPlan: "Платная подписка",
      free: "Бесплатно",
      pricing: "$4.99/мес или $29.99/год",
      upgradeButton: "Открыть силу PRO ✨",
      features: [
        {
          name: "Количество активных аскез",
          free: true,
          pro: true,
          freeDescription: "1 одновременно",
          proDescription: "До 5 одновременно"
        },
        {
          name: "Категории отказа",
          free: true,
          pro: true,
          freeDescription: "Все категории доступны"
        },
        {
          name: "Вопросы Вселенной",
          free: true,
          pro: true,
          freeDescription: "1 текстовый вопрос в день",
          proDescription: "До 3 в день, включая голосовой вопрос"
        },
        {
          name: "Ответы Вселенной",
          free: true,
          pro: true,
          freeDescription: "Текстовые ответы",
          proDescription: "Голосовые + расширенные текстовые (AI)"
        },
        {
          name: "Круг Энергии",
          free: true,
          pro: true,
          freeDescription: "Базовый круг с прогрессом",
          proDescription: "Энергетический круг с анимацией силы"
        },
        {
          name: "Темы оформления",
          free: true,
          pro: true,
          freeDescription: "Тёмная тема",
          proDescription: "Космические темы, музыка, фоны"
        },
        {
          name: "Цитаты и мудрость",
          free: true,
          pro: true,
          freeDescription: "Случайные цитаты",
          proDescription: "Случайные цитаты + персональные духовные послания"
        },
        {
          name: "Медитации",
          free: false,
          pro: true,
          freeDescription: "Недоступно",
          proDescription: "Аудиомедитации, визуализации, голосовые практики"
        },
        {
          name: "Космические миссии",
          free: false,
          pro: true,
          freeDescription: "Недоступно",
          proDescription: "Ритуалы, челленджи, многодневные цепочки"
        },
        {
          name: "Рекомендация на день",
          free: false,
          pro: true,
          freeDescription: "Недоступно",
          proDescription: "Персональный совет от Вселенной"
        },
        {
          name: "Разбор личности",
          free: false,
          pro: true,
          freeDescription: "Недоступно",
          proDescription: "Анализ личности, архетип, рекомендация"
        },
        {
          name: "Ритуалы силы",
          free: true,
          pro: true,
          freeDescription: "Базовые (текст + визуал)",
          proDescription: "Аудио/видео-ритуалы с озвучкой"
        },
        {
          name: "Сообщество",
          free: true,
          pro: true,
          freeDescription: "Просмотр прогресса других",
          proDescription: "Создание групп, энергия поддержки"
        }
      ]
    },
    meditation: {
      pageTitle: "Медитации силы",
      subtitle: "Откройте доступ к медитациям с ASKET PRO",
      proFeatures: "Особенности PRO медитаций",
      basic: "Базовая версия",
      pro: "PRO версия",
      duration: "Длительность",
      play: "Слушать",
      unlock: "Открыть PRO",
      comingSoon: "Скоро будет доступно",
      categories: {
        morning: "Утренние",
        evening: "Вечерние",
        stress: "Антистресс",
        mantra: "Мантры",
        visual: "Визуализации"
      },
      morning: {
        title1: "Настрой на день",
        desc1: "Зарядись энергией на весь день",
        title2: "Благодарность",
        desc2: "Практика благодарности Вселенной"
      },
      evening: {
        title1: "Прощение",
        desc1: "Отпусти прошлое с легкостью"
      },
      stress: {
        title1: "Заземление",
        desc1: "Восстановление внутреннего равновесия"
      },
      mantra: {
        title1: "Голос наставника",
        desc1: "Интеграция высшей энергии"
      },
      visualization: {
        title1: "Космический полёт",
        desc1: "Путешествие сквозь звёзды"
      }
    },
    auth: {
      signIn: "Вход",
      signUp: "Регистрация",
      signOut: "Выход",
      email: "Email",
      password: "Пароль",
      confirmPassword: "Подтвердите пароль",
      forgotPassword: "Забыли пароль?",
      backToSignIn: "Вернуться к входу",
      createAccount: "Создать аккаунт",
      alreadyHaveAccount: "Уже есть аккаунт?",
      resetPassword: "Сбросить пароль",
      resetPasswordButton: "Отправить ссылку для сброса",
      resetPasswordSuccess: "Проверьте вашу почту для сброса пароля",
      resetPasswordError: "Ошибка сброса пароля",
      signInError: "Ошибка при входе",
      signUpError: "Ошибка при регистрации",
      passwordMismatch: "Пароли не совпадают",
      welcomeBack: "С возвращением",
      noAccount: "Нет аккаунта?",
      orContinueWith: "Или продолжить с",
      signInButton: "Войти",
      signUpButton: "Зарегистрироваться",
      haveAccount: "Уже есть аккаунт?",
      passwordLength: "Пароль должен содержать минимум 6 символов"
    },
    subscription: {
      bannerTitle: "Раскройте свой потенциал с ASKET PRO",
      bannerDesc: "Доступ к медитациям, расширенным практикам и многому другому",
      upgradeNow: "Улучшить сейчас"
    }
  },
  en: {
    welcome: {
      title: "ASKET",
      subtitle: "The path to inner strength",
      startButton: "Begin the journey",
    },
    onboarding: {
      steps: [
        {
          title: "Welcome",
          content: "Something inside you is asking to come out.\nThis is not anxiety. This is awakening.\n\nYou are on the threshold of a new version of yourself."
        },
        {
          title: "What is Ascesis",
          content: "Ascesis is a sacred contract with the Universe. Each day of rejecting something lower raises your vibration and reveals inner strength."
        },
        {
          title: "Why it works",
          content: "By rejecting temptation, you strengthen your will and tune into higher energies. The Universe sees your efforts and responds in kind."
        },
        {
          title: "Who you will become",
          content: "A person whose desires are subject to will. One who is able to shape reality through conscious rejection and attraction of the higher. The master of your destiny."
        }
      ],
      buttons: {
        next: "Next",
        enter: "Enter",
        startJourney: "Start the path"
      }
    },
    main: {
      days: "days",
      todayCompleted: "Today I endured",
      askUniverse: "Ask the Universe",
      noPacts: "You don't have any active ascesis yet",
      createPact: "Create covenant",
      nav: {
        path: "Path",
        ascesis: "Ascesis",
        universe: "Universe",
        profile: "Profile"
      }
    },
    createPact: {
      title: "Create Ascesis",
      stepOneTitle: "What are you giving up?",
      stepTwoTitle: "Trial period",
      stepThreeTitle: "What do you want to receive?",
      whatRejecting: "What are you giving up?",
      examples: [
        "Sugar", 
        "Phone after 10 PM", 
        "Cigarettes", 
        "Procrastination", 
        "Social media"
      ],
      trialPeriod: "Trial period",
      customDays: "Or specify your number of days:",
      days: "days",
      whatWant: "What do you want to receive?",
      notAsking: "You are not asking. You are configuring reality.",
      nextButton: "Next",
      startPathButton: "Start the path",
      placeholders: {
        rejection: "For example: Sugar, Social Media, Alcohol...",
        reward: "For example: Strong health, Mental clarity, Financial stability..."
      },
      ascesisWarning: "You must understand that Ascesis is a serious practice and must be treated with the utmost responsibility. You give your word to the Universe to fulfill your obligations and ask in return for the fulfillment of a desire / the solution of some issue. If you fail and do not keep your word, the Universe will not take you seriously and there is a risk of falling out of the flow..."
    },
    universe: {
      title: "Gates of the Universe",
      question: "What do you want to ask the Universe?",
      placeholder: "Write your question here...",
      askButton: "Send question",
      thinking: "The Universe is contemplating the answer...",
      yourQuestion: "Your question",
      universeAnswer: "Universe's answer",
      newQuestion: "Ask a new question",
      previousQuestions: "Previous questions",
      emptyState: "You haven't asked any questions yet"
    },
    profile: {
      title: "Profile",
      daysOfAscesis: "Days of ascesis",
      energy: "Energy",
      settings: "Settings",
      settingsItems: ['Notifications', 'Themes', 'Sound', 'Language'],
      proFeatures: [
        'Up to 5 ascesis simultaneously',
        'Access to premium meditations',
        'Visual themes',
        'Additional questions to the Universe',
        'Power rituals and breakthrough practices'
      ],
      proTitle: "ASKET PRO",
      proDescription: "Unlock additional capabilities and enhance your path",
      proButton: "Unlock PRO power ✨",
      achievements: {
        title: "Achievements",
        unlocked: "Unlocked achievements",
        locked: "Upcoming achievements",
        empty: "You have no unlocked achievements yet"
      },
      missions: {
        title: "Missions",
        current: "Current mission",
        empty: "You have no active missions",
        get: "Get mission",
        about: "About cosmic missions",
        description: "Cosmic missions are special tasks from the Universe that will help you strengthen your spirit and earn additional rewards. Complete missions to earn energy points and achievements.",
        rewards: "Exclusive rewards"
      },
      ranks: {
        next: "until rank",
        progress: "progress",
        seeker: "Seeker",
        pilgrim: "Pilgrim",
        warrior: "Light Warrior",
        master: "Master",
        enlightened: "Enlightened"
      }
    },
    pactOath: {
      title: "My Ascesis",
      subtitle: "I take a vow",
      iPromise: "I promise to give up",
      duration: "for a period of",
      days: "days",
      inReturn: "In return I attract into my life",
      confirmButton: "Confirm Covenant"
    },
    userProfile: {
      title: "About you",
      nameLabel: "What's your name",
      namePlaceholder: "Enter your name",
      nameRequired: "Name is required",
      birthDateLabel: "Date of birth",
      birthDatePlaceholder: "Select your date of birth",
      birthDateRequired: "Date of birth is required",
      continueButton: "Continue"
    },
    gamification: {
      energyPoints: "Energy Points",
      levelUp: "Rank Up!",
      newAchievement: "New Achievement!",
      newMission: "New Mission!",
      missionCompleted: "Mission Completed!",
      rankTitle: "Your rank:",
      pointsEarned: "Points earned:",
      rewards: "Rewards:"
    },
    calendar: {
      year: 'Year',
      month: 'Month'
    },
    minimumPeriod: 'Minimum ascesis period - 30 days',
    comparison: {
      title: "ASKET vs ASKET PRO",
      freePlan: "Free",
      proPlan: "Paid subscription",
      free: "Free",
      pricing: "$4.99/month or $29.99/year",
      upgradeButton: "Unlock PRO power ✨",
      features: [
        {
          name: "Active ascesis count",
          free: true,
          pro: true,
          freeDescription: "1 simultaneously",
          proDescription: "Up to 5 simultaneously"
        },
        {
          name: "Rejection categories",
          free: true,
          pro: true,
          freeDescription: "All categories available"
        },
        {
          name: "Universe Questions",
          free: true,
          pro: true,
          freeDescription: "1 text question per day",
          proDescription: "Up to 3 per day, including voice questions"
        },
        {
          name: "Universe Answers",
          free: true,
          pro: true,
          freeDescription: "Text answers",
          proDescription: "Voice + extended text answers (AI)"
        },
        {
          name: "Energy Circle",
          free: true,
          pro: true,
          freeDescription: "Basic circle with progress",
          proDescription: "Energy circle with power animation"
        },
        {
          name: "Themes",
          free: true,
          pro: true,
          freeDescription: "Dark theme",
          proDescription: "Cosmic themes, music, backgrounds"
        },
        {
          name: "Quotes and wisdom",
          free: true,
          pro: true,
          freeDescription: "Random quotes",
          proDescription: "Random quotes + personal spiritual messages"
        },
        {
          name: "Meditations",
          free: false,
          pro: true,
          freeDescription: "Unavailable",
          proDescription: "Audio meditations, visualizations, voice practices"
        },
        {
          name: "Cosmic missions",
          free: false,
          pro: true,
          freeDescription: "Unavailable",
          proDescription: "Rituals, challenges, multi-day chains"
        },
        {
          name: "Daily recommendation",
          free: false,
          pro: true,
          freeDescription: "Unavailable",
          proDescription: "Personal advice from the Universe"
        },
        {
          name: "Personality analysis",
          free: false,
          pro: true,
          freeDescription: "Unavailable",
          proDescription: "Personality analysis, archetype, recommendation"
        },
        {
          name: "Power rituals",
          free: true,
          pro: true,
          freeDescription: "Basic (text + visual)",
          proDescription: "Audio/video rituals with voiceover"
        },
        {
          name: "Community",
          free: true,
          pro: true,
          freeDescription: "View others' progress",
          proDescription: "Create groups, support energy"
        }
      ]
    },
    meditation: {
      pageTitle: "Power Meditations",
      subtitle: "Get access to meditations with ASKET PRO",
      proFeatures: "PRO meditation features",
      basic: "Basic version",
      pro: "PRO version",
      duration: "Duration",
      play: "Listen",
      unlock: "Unlock PRO",
      comingSoon: "Coming soon",
      categories: {
        morning: "Morning",
        evening: "Evening",
        stress: "Anti-stress",
        mantra: "Mantras",
        visual: "Visualization"
      },
      morning: {
        title1: "Day Setup",
        desc1: "Charge with energy for the whole day",
        title2: "Gratitude",
        desc2: "Practice of gratitude to the Universe"
      },
      evening: {
        title1: "Forgiveness",
        desc1: "Let go of the past with ease"
      },
      stress: {
        title1: "Grounding",
        desc1: "Restoring inner balance"
      },
      mantra: {
        title1: "Guide's Voice",
        desc1: "Integration of higher energy"
      },
      visualization: {
        title1: "Cosmic Flight",
        desc1: "Journey through the stars"
      }
    },
    auth: {
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot password?",
      backToSignIn: "Back to Sign In",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      resetPassword: "Reset Password",
      resetPasswordButton: "Send Reset Link",
      resetPasswordSuccess: "Check your email to reset your password",
      resetPasswordError: "Error resetting password",
      signInError: "Error signing in",
      signUpError: "Error signing up",
      passwordMismatch: "Passwords do not match",
      welcomeBack: "Welcome back",
      noAccount: "Don't have an account?",
      orContinueWith: "Or continue with",
      signInButton: "Sign In",
      signUpButton: "Sign Up",
      haveAccount: "Already have an account?",
      passwordLength: "Password must be at least 6 characters"
    },
    subscription: {
      bannerTitle: "Unlock your potential with ASKET PRO",
      bannerDesc: "Access to meditations, advanced practices and much more",
      upgradeNow: "Upgrade Now"
    }
  },
  es: {
    welcome: {
      title: "ASKET",
      subtitle: "El camino hacia la fuerza interior",
      startButton: "Comenzar el viaje",
    },
    onboarding: {
      steps: [
        {
          title: "Bienvenido",
          content: "Algo dentro de ti pide salir.\nNo es ansiedad. Es despertar.\n\nEstás en el umbral de una nueva versión de ti mismo."
        },
        {
          title: "Qué es la Ascesis",
          content: "La ascesis es un contrato sagrado con el Universo. Cada día de rechazo a algo inferior eleva tu vibración y revela tu fuerza interior."
        },
        {
          title: "Por qué funciona",
          content: "Al rechazar la tentación, fortaleces tu voluntad y te sintonizas con energías superiores. El Universo ve tus esfuerzos y responde de la misma manera."
        },
        {
          title: "En quién te convertirás",
          content: "Una persona cuyos deseos están sujetos a la voluntad. Alguien capaz de dar forma a la realidad a través del rechazo consciente y la atracción de lo superior. El maestro de tu destino."
        }
      ],
      buttons: {
        next: "Siguiente",
        enter: "Entrar",
        startJourney: "Iniciar el camino"
      }
    },
    main: {
      days: "días",
      todayCompleted: "Hoy resistí",
      askUniverse: "Preguntar al Universo",
      noPacts: "Aún no tienes ascesis activas",
      createPact: "Crear pacto",
      nav: {
        path: "Camino",
        ascesis: "Ascesis",
        universe: "Universo",
        profile: "Perfil"
      }
    },
    createPact: {
      title: "Crear Ascesis",
      stepOneTitle: "¿A qué renuncias?",
      stepTwoTitle: "Período de prueba",
      stepThreeTitle: "¿Qué deseas recibir?",
      whatRejecting: "¿A qué renuncias?",
      examples: [
        "Azúcar", 
        "Teléfono después de las 22:00", 
        "Cigarrillos", 
        "Procrastinación", 
        "Redes sociales"
      ],
      trialPeriod: "Período de prueba",
      customDays: "O especifica tu número de días:",
      days: "días",
      whatWant: "¿Qué deseas recibir?",
      notAsking: "No estás pidiendo. Estás configurando la realidad.",
      nextButton: "Siguiente",
      startPathButton: "Iniciar el camino",
      placeholders: {
        rejection: "Por ejemplo: Azúcar, Redes Sociales, Alcohol...",
        reward: "Por ejemplo: Salud fuerte, Claridad mental, Estabilidad financiera..."
      },
      ascesisWarning: "Debes entender que la Ascesis es una práctica seria y debe ser tratada con la máxima responsabilidad. Das tu palabra al Universo de cumplir con tus obligaciones y pides a cambio el cumplimiento de un deseo o la solución de algún problema. Si fracasas y no mantienes tu palabra, el Universo no te tomará en serio y existe el riesgo de caer fuera del flujo..."
    },
    universe: {
      title: "Puertas del Universo",
      question: "¿Qué quieres preguntar al Universo?",
      placeholder: "Escribe tu pregunta aquí...",
      askButton: "Enviar pregunta",
      thinking: "El Universo está contemplando la respuesta...",
      yourQuestion: "Tu pregunta",
      universeAnswer: "Respuesta del Universo",
      newQuestion: "Hacer una nueva pregunta",
      previousQuestions: "Preguntas anteriores",
      emptyState: "Aún no has hecho preguntas al Universo"
    },
    profile: {
      title: "Perfil",
      daysOfAscesis: "Días de ascesis",
      energy: "Energía",
      settings: "Configuración",
      settingsItems: ['Notificaciones', 'Temas', 'Sonido', 'Idioma'],
      proFeatures: [
        'Hasta 5 ascesis simultáneamente',
        'Acceso a meditaciones premium',
        'Temas visuales',
        'Preguntas adicionales al Universo',
        'Rituales de poder y prácticas de avance'
      ],
      proTitle: "ASKET PRO",
      proDescription: "Desbloquea capacidades adicionales y mejora tu camino",
      proButton: "Desbloquear el poder PRO ✨",
      achievements: {
        title: "Logros",
        unlocked: "Logros desbloqueados",
        locked: "Próximos logros",
        empty: "Aún no tienes logros desbloqueados"
      },
      missions: {
        title: "Misiones",
        current: "Misión actual",
        empty: "No tienes misiones activas",
        get: "Obtener misión",
        about: "Sobre misiones cósmicas",
        description: "Las misiones cósmicas son tareas especiales del Universo que te ayudarán a fortalecer tu espíritu y obtener recompensas adicionales. Completa misiones y obtén puntos de energía y logros.",
        rewards: "Recompensas exclusivas"
      },
      ranks: {
        next: "hasta el rango de",
        progress: "progreso",
        seeker: "Buscador",
        pilgrim: "Peregrino",
        warrior: "Guerrero de Luz",
        master: "Maestro",
        enlightened: "Iluminado"
      }
    },
    pactOath: {
      title: "Mi Ascesis",
      subtitle: "Hago un voto",
      iPromise: "Prometo renunciar a",
      duration: "por un período de",
      days: "días",
      inReturn: "A cambio atraigo a mi vida",
      confirmButton: "Confirmar Pacto"
    },
    userProfile: {
      title: "Acerca de ti",
      nameLabel: "¿Cómo te llamas",
      namePlaceholder: "Introduce tu nombre",
      nameRequired: "El nombre es obligatorio",
      birthDateLabel: "Fecha de nacimiento",
      birthDatePlaceholder: "Selecciona tu fecha de nacimiento",
      birthDateRequired: "La fecha de nacimiento es obligatoria",
      continueButton: "Continuar"
    },
    gamification: {
      energyPoints: "Puntos de Energía",
      levelUp: "¡Subida de Rango!",
      newAchievement: "¡Nuevo Logro!",
      newMission: "¡Nueva Misión!",
      missionCompleted: "¡Misión Completada!",
      rankTitle: "Tu rango:",
      pointsEarned: "Puntos ganados:",
      rewards: "Recompensas:"
    },
    calendar: {
      year: 'Año',
      month: 'Mes'
    },
    minimumPeriod: 'Período mínimo de ascesis - 30 días',
    comparison: {
      title: "ASKET vs ASKET PRO",
      freePlan: "Gratis",
      proPlan: "Suscripción de pago",
      free: "Gratis",
      pricing: "$4.99/mes o $29.99/año",
      upgradeButton: "Desbloquear el poder PRO ✨",
      features: [
        {
          name: "Número de ascesis activas",
          free: true,
          pro: true,
          freeDescription: "1 simultáneamente",
          proDescription: "Hasta 5 simultáneamente"
        },
        {
          name: "Categorías de rechazo",
          free: true,
          pro: true,
          freeDescription: "Todas las categorías disponibles"
        },
        {
          name: "Preguntas al Universo",
          free: true,
          pro: true,
          freeDescription: "1 pregunta de texto por día",
          proDescription: "Hasta 3 por día, incluyendo preguntas por voz"
        },
        {
          name: "Respuestas del Universo",
          free: true,
          pro: true,
          freeDescription: "Respuestas de texto",
          proDescription: "Respuestas por voz + texto extendido (IA)"
        },
        {
          name: "Círculo de Energía",
          free: true,
          pro: true,
          freeDescription: "Círculo básico con progreso",
          proDescription: "Círculo energético con animación de poder"
        },
        {
          name: "Temas",
          free: true,
          pro: true,
          freeDescription: "Tema oscuro",
          proDescription: "Temas cósmicos, música, fondos"
        },
        {
          name: "Citas y sabiduría",
          free: true,
          pro: true,
          freeDescription: "Citas aleatorias",
          proDescription: "Citas aleatorias + mensajes espirituales personales"
        },
        {
          name: "Meditaciones",
          free: false,
          pro: true,
          freeDescription: "No disponible",
          proDescription: "Meditaciones de audio, visualizaciones, prácticas de voz"
        },
        {
          name: "Misiones cósmicas",
          free: false,
          pro: true,
          freeDescription: "No disponible",
          proDescription: "Rituales, desafíos, cadenas de varios días"
        },
        {
          name: "Recomendación diaria",
          free: false,
          pro: true,
          freeDescription: "No disponible",
          proDescription: "Consejo personal del Universo"
        },
        {
          name: "Análisis de personalidad",
          free: false,
          pro: true,
          freeDescription: "No disponible",
          proDescription: "Análisis de personalidad, arquetipo, recomendación"
        },
        {
          name: "Rituales de poder",
          free: true,
          pro: true,
          freeDescription: "Básicos (texto + visual)",
          proDescription: "Rituales de audio/vídeo con voz en off"
        },
        {
          name: "Comunidad",
          free: true,
          pro: true,
          freeDescription: "Ver progreso de otros",
          proDescription: "Crear grupos, energía de apoyo"
        }
      ]
    },
    meditation: {
      pageTitle: "Meditaciones de poder",
      subtitle: "Obtén acceso a meditaciones con ASKET PRO",
      proFeatures: "Características de meditaciones PRO",
      basic: "Versión básica",
      pro: "Versión PRO",
      duration: "Duración",
      play: "Escuchar",
      unlock: "Desbloquear PRO",
      comingSoon: "Próximamente",
      categories: {
        morning: "Mañana",
        evening: "Noche",
        stress: "Antiestrés",
        mantra: "Mantras",
        visual: "Visualización"
      },
      morning: {
        title1: "Preparación para el día",
        desc1: "Cárgate de energía para todo el día",
        title2: "Gratitud",
        desc2: "Práctica de gratitud al Universo"
      },
      evening: {
        title1: "Perdón",
        desc1: "Deja ir el pasado con facilidad"
      },
      stress: {
        title1: "Conexión a tierra",
        desc1: "Restauración del equilibrio interior"
      },
      mantra: {
        title1: "Voz del guía",
        desc1: "Integración de energía superior"
      },
      visualization: {
        title1: "Vuelo cósmico",
        desc1: "Viaje a través de las estrellas"
      }
    },
    auth: {
      signIn: "Iniciar sesión",
      signUp: "Registrarse",
      signOut: "Cerrar sesión",
      email: "Correo electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      backToSignIn: "Volver a iniciar sesión",
      createAccount: "Crear cuenta",
      alreadyHaveAccount: "¿Ya tienes una cuenta?",
      resetPassword: "Restablecer contraseña",
      resetPasswordButton: "Enviar enlace de restablecimiento",
      resetPasswordSuccess: "Revisa tu correo para restablecer tu contraseña",
      resetPasswordError: "Error al restablecer la contraseña",
      signInError: "Error al iniciar sesión",
      signUpError: "Error al registrarse",
      passwordMismatch: "Las contraseñas no coinciden",
      welcomeBack: "Bienvenido de nuevo",
      noAccount: "¿No tienes una cuenta?",
      orContinueWith: "O continuar con",
      signInButton: "Iniciar sesión",
      signUpButton: "Registrarse",
      haveAccount: "¿Ya tienes una cuenta?",
      passwordLength: "La contraseña debe tener al menos 6 caracteres"
    },
    subscription: {
      bannerTitle: "Desbloquea tu potencial con ASKET PRO",
      bannerDesc: "Acceso a meditaciones, prácticas avanzadas y mucho más",
      upgradeNow: "Mejorar ahora"
    }
  }
};

export default translations;
