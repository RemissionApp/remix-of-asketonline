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
    // ... keep existing code (other Russian translations)
  },
  en: {
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
    // ... keep existing code (other English translations)
  },
  es: {
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
    // ... keep existing code (other Spanish translations)
  }
};

export type SupportedLanguage = 'ru' | 'en' | 'es';
