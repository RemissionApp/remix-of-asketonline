
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
  };
  universe: {
    title: string;
    question: string;
    askButton: string;
    thinking: string;
    yourQuestion: string;
    universeAnswer: string;
    newQuestion: string;
    previousQuestions: string;
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
      askUniverse: "Спросить Вселенную",
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
      }
    },
    universe: {
      title: "Врата Вселенной",
      question: "Что ты хочешь спросить у Вселенной?",
      askButton: "Отправить вопрос",
      thinking: "Вселенная обдумывает ответ...",
      yourQuestion: "Твой вопрос",
      universeAnswer: "Ответ Вселенной",
      newQuestion: "Задать новый вопрос",
      previousQuestions: "Предыдущие вопросы"
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
      proButton: "Открыть силу PRO ✨"
    },
    pactOath: {
      title: "Священный Договор",
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
      }
    },
    universe: {
      title: "Gates of the Universe",
      question: "What do you want to ask the Universe?",
      askButton: "Send question",
      thinking: "The Universe is contemplating the answer...",
      yourQuestion: "Your question",
      universeAnswer: "Universe's answer",
      newQuestion: "Ask a new question",
      previousQuestions: "Previous questions"
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
      proButton: "Unlock PRO power ✨"
    },
    pactOath: {
      title: "Sacred Covenant",
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
      }
    },
    universe: {
      title: "Puertas del Universo",
      question: "¿Qué quieres preguntar al Universo?",
      askButton: "Enviar pregunta",
      thinking: "El Universo está contemplando la respuesta...",
      yourQuestion: "Tu pregunta",
      universeAnswer: "Respuesta del Universo",
      newQuestion: "Hacer una nueva pregunta",
      previousQuestions: "Preguntas anteriores"
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
      proButton: "Desbloquear el poder PRO ✨"
    },
    pactOath: {
      title: "Pacto Sagrado",
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
    }
  }
};

export default translations;
