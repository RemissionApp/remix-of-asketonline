import { Quote } from "@/components/QuoteDisplay";

export type SupportedLanguage = 'ru' | 'en' | 'es';

export const translations = {
  en: {
    main: {
      title: "Cosmic Ascesis",
      subtitle: "Embrace the journey within",
      noPacts: "No ascesis yet. Create one to start your journey.",
      createPact: "Create Ascesis",
      todayCompleted: "Today's Ascesis Completed",
      days: "Days",
      askUniverse: "Ask the Universe",
      profile: "Profile",
      nav: {
        path: "Path",
        ascesis: "Ascesis",
        universe: "Universe",
        profile: "Profile"
      }
    },
    calendar: {
      year: "Year",
      month: "Month",
      today: "Today",
      selectDate: "Select date",
      previousMonth: "Previous month",
      nextMonth: "Next month",
      days: {
        monday: "Mon",
        tuesday: "Tue",
        wednesday: "Wed",
        thursday: "Thu",
        friday: "Fri",
        saturday: "Sat",
        sunday: "Sun"
      }
    },
    welcome: {
      title: "Welcome to Cosmic Ascesis",
      subtitle: "Embark on a transformative journey of self-improvement and spiritual growth.",
      startButton: "Get Started"
    },
    language: {
      title: "Choose Your Language",
      selectLanguage: "Select Language"
    },
    onboarding: {
      title: "Welcome!",
      steps: [
        {
          title: "Set Your Intention",
          content: "Define what you wish to abstain from. Be specific and honest with yourself."
        },
        {
          title: "Commit to a Duration",
          content: "Choose how long you'll maintain your ascesis. Start small for greater success."
        },
        {
          title: "Reflect and Grow",
          content: "Use this journey to understand yourself better. Track your progress and celebrate milestones."
        }
      ],
      buttons: {
        enter: "Enter",
        next: "Next",
        startJourney: "Begin Your Journey"
      },
      step1: {
        title: "Set Your Intention",
        description: "Define what you wish to abstain from. Be specific and honest with yourself."
      },
      step2: {
        title: "Commit to a Duration",
        description: "Choose how long you'll maintain your ascesis. Start small for greater success."
      },
      step3: {
        title: "Reflect and Grow",
        description: "Use this journey to understand yourself better. Track your progress and celebrate milestones."
      },
      startButton: "Begin Your Journey"
    },
    createPact: {
      title: "Create Your Ascesis",
      intention: "My Intention",
      duration: "Duration (days)",
      createButton: "Create Ascesis",
      rejectionExamples: "e.g., sugar, phone after 22:00, cigarettes",
      durationExamples: "e.g., 7, 14, 30",
      successMessage: "Ascesis created successfully!",
      errorMessage: "Failed to create ascesis. Please try again.",
      stepOneTitle: "What will you abstain from?",
      stepTwoTitle: "For how long?",
      stepThreeTitle: "What do you wish to receive in return?",
      notAsking: "This is not asking for material goods but for spiritual guidance and fulfillment",
      customDays: "Custom duration",
      nextButton: "Next",
      placeholders: {
        rejection: "I will abstain from...",
        reward: "I wish to receive..."
      },
      ascesisWarning: "Choose what you're willing to give up. This covenant represents your commitment to personal growth through conscious sacrifice."
    },
    minimumPeriod: "Minimum 30 days required",
    universe: {
      title: "Ask the Cosmic Universe",
      question: "What would you like to ask the universe?",
      questionPlaceholder: "Ask your question...",
      submitButton: "Ask",
      responseTitle: "The Universe Says:",
      errorMessage: "Failed to get an answer. Please try again.",
      yourQuestion: "Your Question",
      universeAnswer: "The Universe Answers",
      newQuestion: "Ask Another Question",
      thinking: "The universe is contemplating your question...",
      askButton: "Ask the Universe",
      previousQuestions: "Previous Questions"
    },
    profile: {
      title: "My Profile",
      energyPoints: "Energy Points",
      level: "Level",
      editProfile: "Edit Profile",
      signOut: "Sign Out",
      deleteAccount: "Delete Account",
      areYouSureDeleteAccount: "Are you sure you want to delete your account?",
      deleteAccountWarning: "This action cannot be undone.",
      cancel: "Cancel",
      confirmDelete: "Delete Account",
      signOutConfirmation: "Are you sure you want to sign out?",
      confirmSignOut: "Sign Out",
    },
    comparison: {
      title: "Cosmic Ascesis PRO",
      subtitle: "Unlock premium features and elevate your journey.",
      feature1: "Unlimited Ascesis Creation",
      feature2: "Advanced Analytics",
      feature3: "Personalized Guidance",
      feature4: "Ad-Free Experience",
      upgradeButton: "Upgrade to PRO",
      restoreButton: "Restore Purchase",
      successMessage: "Upgrade successful!",
      errorMessage: "Failed to upgrade. Please try again."
    },
    subscription: {
      bannerTitle: "Unlock Full Potential",
      bannerDesc: "Upgrade to PRO for unlimited features",
      upgradeNow: "Upgrade Now"
    },
    pactOath: {
      title: "Ascesis Oath",
      subtitle: "Make your covenant with the Universe",
      days: "days",
      readAloud: "Read Aloud",
      confirmReading: "I have read aloud and confirm",
      signContract: "Sign Contract",
      instructions: "Read your ascesis vow aloud. By speaking these words, you are making a sacred covenant with the Universe."
    },
    userProfile: {
      title: "About You",
      age: "Age",
      nameLabel: "Your Name",
      namePlaceholder: "Enter your name",
      nameRequired: "Name is required",
      birthDateLabel: "Birth Date",
      birthDatePlaceholder: "Select your birth date",
      birthDateRequired: "Birth date is required",
      languageLabel: "App Language",
      continueButton: "Continue",
      currentDate: "Current date"
    },
    meditation: {
      title: "Meditation",
      pageTitle: "Meditations",
      subtitle: "Find your inner peace",
      start: "Start",
      pause: "Pause",
      resume: "Resume",
      stop: "Stop",
      duration: "Duration",
      minutes: "minutes",
      play: "Play",
      unlock: "Unlock",
      breathe: {
        in: "Breathe In",
        hold: "Hold",
        out: "Breathe Out",
        rest: "Rest"
      },
      types: {
        guided: "Guided",
        breathing: "Breathing",
        silent: "Silent"
      },
      categories: {
        morning: "Morning",
        evening: "Evening",
        stress: "Stress",
        mantra: "Mantra",
        visual: "Visual"
      },
      morning: {
        title1: "Morning Clarity",
        desc1: "Start your day with clarity and purpose",
        title2: "Sunrise Energy",
        desc2: "Energize your body and mind for the day ahead"
      },
      evening: {
        title1: "Evening Unwind",
        desc1: "Release the tension of the day and prepare for rest"
      },
      stress: {
        title1: "Stress Release",
        desc1: "Find calm in moments of tension and anxiety"
      },
      mantra: {
        title1: "Power Mantras",
        desc1: "Ancient phrases to focus and center your energy"
      },
      visualization: {
        title1: "Cosmic Journey",
        desc1: "Travel through the cosmos in your mind"
      }
    },
    auth: {
      signIn: "Sign In",
      signInButton: "Sign In",
      signUp: "Sign Up", 
      signUpButton: "Sign Up",
      signInSuccess: "Sign in successful!",
      welcomeBack: "Welcome back to Cosmic Ascesis",
      signInError: "Sign in error",
      signUpSuccess: "Sign up successful!",
      accountCreated: "Your account has been created",
      signUpError: "Sign up error",
      tryAgain: "Please try again",
      enterCredentials: "Enter your credentials to continue",
      email: "Email",
      password: "Password",
      name: "Name",
      namePlaceholder: "Enter your name",
      confirmPassword: "Confirm Password",
      processing: "Processing...",
      noAccount: "Don't have an account?",
      signUpNow: "Sign up now",
      alreadyHaveAccount: "Already have an account?",
      signInNow: "Sign in now",
      createAccountPrompt: "Create your account to begin your journey"
    }
  },
  ru: {
    main: {
      title: "Космический Аскетизм",
      subtitle: "Прими путешествие внутрь себя",
      noPacts: "Пока нет аскез. Создайте, чтобы начать свой путь.",
      createPact: "Создать Аскезу",
      todayCompleted: "Аскеза на сегодня выполнена",
      days: "Дней",
      askUniverse: "Спросить у Вселенной",
      profile: "Профиль",
      nav: {
        path: "Путь",
        ascesis: "Аскеза",
        universe: "Вселенная",
        profile: "Профиль"
      }
    },
    calendar: {
      year: "Год",
      month: "Месяц",
      today: "Сегодня",
      selectDate: "Выберите дату",
      previousMonth: "Предыдущий месяц",
      nextMonth: "Следующий месяц",
      days: {
        monday: "Пн",
        tuesday: "Вт",
        wednesday: "Ср",
        thursday: "Чт",
        friday: "Пт",
        saturday: "Сб",
        sunday: "Вс"
      }
    },
    welcome: {
      title: "Добро пожаловать в Cosmic Ascesis",
      subtitle: "Отправьтесь в преобразующее путешествие самосовершенствования и духовного роста.",
      startButton: "Начать"
    },
    language: {
      title: "Выберите Язык",
      selectLanguage: "Выберите Язык"
    },
    onboarding: {
      title: "Добро пожаловать!",
      steps: [
        {
          title: "Установите Свое Намерение",
          content: "Определите, от чего вы хотите воздержаться. Будьте конкретны и честны с собой."
        },
        {
          title: "Определите Продолжительность",
          content: "Выберите, как долго вы будете поддерживать свою аскезу. Начните с малого для большего успеха."
        },
        {
          title: "Размышляйте и Растите",
          content: "Используйте это путешествие, чтобы лучше понять себя. Отслеживайте свой прогресс и отмечайте вехи."
        }
      ],
      buttons: {
        enter: "Войти",
        next: "Далее",
        startJourney: "Начать Путь"
      },
      step1: {
        title: "Установите Свое Намерение",
        description: "Определите, от чего вы хотите воздержаться. Будьте конкретны и честны с собой."
      },
      step2: {
        title: "Определите Продолжительность",
        description: "Выберите, как долго вы будете поддерживать свою аскезу. Начните с малого для большего успеха."
      },
      step3: {
        title: "Размышляйте и Растите",
        description: "Используйте это путешествие, чтобы лучше понять себя. Отслеживайте свой прогресс и отмечайте вехи."
      },
      startButton: "Начните Свой Путь"
    },
    createPact: {
      title: "Создайте Свою Аскезу",
      intention: "Мое Намерение",
      duration: "Продолжительность (дни)",
      createButton: "Создать Аскезу",
      rejectionExamples: "например, сахар, телефон после 22:00, сигареты",
      durationExamples: "например, 7, 14, 30",
      successMessage: "Аскеза успешно создана!",
      errorMessage: "Не удалось создать аскезу. Пожалуйста, попробуйте еще раз.",
      stepOneTitle: "От чего вы откажетесь?",
      stepTwoTitle: "На какой срок?",
      stepThreeTitle: "Что вы хотите получить взамен?",
      notAsking: "Мы не просим материальных благ, а духовного руководства и исполнения",
      customDays: "Своя продолжительность",
      nextButton: "Далее",
      placeholders: {
        rejection: "Я воздержусь от...",
        reward: "Я хочу получить..."
      },
      ascesisWarning: "Выберите то, от чего вы готовы отказаться. Этот договор представляет ваше обязательство к личностному росту через осознанную жертву."
    },
    minimumPeriod: "Минимум 30 дней",
    universe: {
      title: "Спросите у Космической Вселенной",
      question: "Что бы вы хотели спросить у вселенной?",
      questionPlaceholder: "Задайте свой вопрос...",
      submitButton: "Спросить",
      responseTitle: "Вселенная Говорит:",
      errorMessage: "Не удалось получить ответ. Пожалуйста, попробуйте еще раз.",
      yourQuestion: "Ваш Вопрос",
      universeAnswer: "Ответ Вселенной",
      newQuestion: "Задать Другой Вопрос",
      thinking: "Вселенная обдумывает ваш вопрос...",
      askButton: "Спросить Вселенную",
      previousQuestions: "Предыдущие Вопросы"
    },
    profile: {
      title: "Мой Профиль",
      energyPoints: "Очки Энергии",
      level: "Уровень",
      editProfile: "Редактировать Профиль",
      signOut: "Выйти",
      deleteAccount: "Удалить Аккаунт",
      areYouSureDeleteAccount: "Вы уверены, что хотите удалить свой аккаунт?",
      deleteAccountWarning: "Это действие нельзя отменить.",
      cancel: "Отмена",
      confirmDelete: "Удалить Аккаунт",
      signOutConfirmation: "Вы уверены, что хотите выйти?",
      confirmSignOut: "Выйти",
    },
    comparison: {
      title: "Cosmic Ascesis PRO",
      subtitle: "Откройте премиум-функции и улучшите свое путешествие.",
      feature1: "Неограниченное Создание Аскез",
      feature2: "Расширенная Аналитика",
      feature3: "Персонализированное Руководство",
      feature4: "Без Рекламы",
      upgradeButton: "Перейти на PRO",
      restoreButton: "Восстановить Покупку",
      successMessage: "Обновление прошло успешно!",
      errorMessage: "Не удалось обновить. Пожалуйста, попробуйте еще раз."
    },
    subscription: {
      bannerTitle: "Раскройте Полный Потенциал",
      bannerDesc: "Перейдите на PRO для неограниченных возможностей",
      upgradeNow: "Обновить Сейчас"
    },
    pactOath: {
      title: "Клятва Аскезы",
      subtitle: "Заключите договор со Вселенной",
      days: "дней",
      readAloud: "Прочитать вслух",
      confirmReading: "Я прочитал(а) вслух и подтверждаю",
      signContract: "Подписать договор",
      instructions: "Прочтите свой обет аскезы вслух. Произнося эти слова, вы заключаете священный договор с Вселенной."
    },
    userProfile: {
      title: "О тебе",
      age: "Возраст",
      nameLabel: "Как тебя зовут",
      namePlaceholder: "Введите ваше имя",
      nameRequired: "Имя обязательно",
      birthDateLabel: "Дата рождения",
      birthDatePlaceholder: "Выберите дату рождения",
      birthDateRequired: "Укажите дату рождения",
      languageLabel: "Язык приложения",
      continueButton: "Продолжить",
      currentDate: "Текущая дата"
    },
    meditation: {
      title: "Медитация",
      pageTitle: "Медитации",
      subtitle: "Найди свой внутренний покой",
      start: "Начать",
      pause: "Пауза",
      resume: "Продолжить",
      stop: "Стоп",
      duration: "Длительность",
      minutes: "минут",
      play: "Слушать",
      unlock: "Разблокировать",
      breathe: {
        in: "Вдох",
        hold: "Задержка",
        out: "Выдох",
        rest: "Отдых"
      },
      types: {
        guided: "С гидом",
        breathing: "Дыхательная",
        silent: "Тишина"
      },
      categories: {
        morning: "Утро",
        evening: "Вечер",
        stress: "Стресс",
        mantra: "Мантра",
        visual: "Визуализация"
      },
      morning: {
        title1: "Утренняя ясность",
        desc1: "Начни свой день с ясности и цели",
        title2: "Энергия рассвета",
        desc2: "Зарядись энергией на весь день"
      },
      evening: {
        title1: "Вечернее расслабление",
        desc1: "Отпусти напряжение дня и подготовься к отдыху"
      },
      stress: {
        title1: "Снятие стресса",
        desc1: "Найди спокойствие в моменты напряжения"
      },
      mantra: {
        title1: "Сильные мантры",
        desc1: "Древние фразы для фокусировки энергии"
      },
      visualization: {
        title1: "Космическое путешествие",
        desc1: "Путешествие через космос в твоём сознании"
      }
    },
    auth: {
      signIn: "Войти",
      signInButton: "Войти",
      signUp: "Регистрация",
      signUpButton: "Зарегистрироваться",
      signInSuccess: "Вход выполнен успешно!",
      welcomeBack: "Добро пожаловать обратно в Космический Аскетизм",
      signInError: "Ошибка входа",
      signUpSuccess: "Регистрация прошла успешно!",
      accountCreated: "Ваш аккаунт создан",
      signUpError: "Ошибка регистрации",
      tryAgain: "Пожалуйста, попробуйте снова",
      enterCredentials: "Введите свои данные для продолжения",
      email: "Электронная почта",
      password: "Пароль",
      name: "Имя",
      namePlaceholder: "Ваше имя",
      confirmPassword: "Подтвердите пароль",
      processing: "Обработка...",
      noAccount: "Нет аккаунта?",
      signUpNow: "Зарегистрируйтесь сейчас",
      alreadyHaveAccount: "Уже есть аккаунт?",
      signInNow: "Войти сейчас",
      createAccountPrompt: "Создайте аккаунт, чтобы начать свое путешествие"
    }
  },
  es: {
    main: {
      title: "Ascesis Cósmica",
      subtitle: "Abraza el viaje interior",
      noPacts: "Aún no hay ascesis. Crea uno para comenzar tu viaje.",
      createPact: "Crear Ascesis",
      todayCompleted: "Ascesis de Hoy Completada",
      days: "Días",
      askUniverse: "Preguntar al Universo",
      profile: "Perfil",
      nav: {
        path: "Camino",
        ascesis: "Ascesis",
        universe: "Universo",
        profile: "Perfil"
      }
    },
    calendar: {
      year: "Año",
      month: "Mes",
      today: "Hoy",
      selectDate: "Seleccionar fecha",
      previousMonth: "Mes anterior",
      nextMonth: "Mes siguiente",
      days: {
        monday: "Lun",
        tuesday: "Mar",
        wednesday: "Mié",
        thursday: "Jue",
        friday: "Vie",
        saturday: "Sáb",
        sunday: "Dom"
      }
    },
    welcome: {
      title: "Bienvenido a Ascesis Cósmica",
      subtitle: "Embárcate en un viaje transformador de superación personal y crecimiento espiritual.",
      startButton: "Comenzar"
    },
    language: {
      title: "Elige Tu Idioma",
      selectLanguage: "Seleccionar Idioma"
    },
    onboarding: {
      title: "¡Bienvenido!",
      steps: [
        {
          title: "Establece Tu Intención",
          content: "Define de qué deseas abstenerte. Sé específico y honesto contigo mismo."
        },
        {
          title: "Comprométete a una Duración",
          content: "Elige cuánto tiempo mantendrás tu ascesis. Comienza poco a poco para un mayor éxito."
        },
        {
          title: "Reflexiona y Crece",
          content: "Utiliza este viaje para comprenderte mejor. Realiza un seguimiento de tu progreso y celebra los hitos."
        }
      ],
      buttons: {
        enter: "Entrar",
        next: "Siguiente",
        startJourney: "Comenzar Viaje"
      },
      step1: {
        title: "Establece Tu Intención",
        description: "Define de qué deseas abstenerte. Sé específico y honesto contigo mismo."
      },
      step2: {
        title: "Comprométete a una Duración",
        description: "Elige cuánto tiempo mantendrás tu ascesis. Comienza poco a poco para un mayor éxito."
      },
      step3: {
        title: "Reflexiona y Crece",
        description: "Utiliza este viaje para comprenderte mejor. Realiza un seguimiento de tu progreso y celebra los hitos."
      },
      startButton: "Comienza Tu Viaje"
    },
    createPact: {
      title: "Crea Tu Ascesis",
      intention: "Mi Intención",
      duration: "Duración (días)",
      createButton: "Crear Ascesis",
      rejectionExamples: "ej., azúcar, teléfono después de las 22:00, cigarrillos",
      durationExamples: "ej., 7, 14, 30",
      successMessage: "¡Ascesis creada con éxito!",
      errorMessage: "No se pudo crear la ascesis. Por favor, inténtalo de nuevo.",
      stepOneTitle: "¿De qué te abstendrás?",
      stepTwoTitle: "¿Por cuánto tiempo?",
      stepThreeTitle: "¿Qué deseas recibir a cambio?",
      notAsking: "Esto no pide bienes materiales sino guía espiritual y plenitud",
      customDays: "Duración personalizada",
      nextButton: "Siguiente",
      placeholders: {
        rejection: "Me abstendré de...",
        reward: "Deseo recibir..."
      },
      ascesisWarning: "Elige aquello a lo que estás dispuesto a renunciar. Este pacto representa tu compromiso con el crecimiento personal a través del sacrificio consciente."
    },
    minimumPeriod: "Se requiere un mínimo de 30 días",
    universe: {
      title: "Pregunta al Universo Cósmico",
      question: "¿Qué te gustaría preguntarle al universo?",
      questionPlaceholder: "Haz tu pregunta...",
      submitButton: "Preguntar",
      responseTitle: "El Universo Dice:",
      errorMessage: "No se pudo obtener una respuesta. Por favor, inténtalo de nuevo.",
      yourQuestion: "Tu Pregunta",
      universeAnswer: "El Universo Responde",
      newQuestion: "Hacer Otra Pregunta",
      thinking: "El universo está contemplando tu pregunta...",
      askButton: "Preguntar al Universo",
      previousQuestions: "Preguntas Anteriores"
    },
    profile: {
      title: "Mi Perfil",
      energyPoints: "Puntos de Energía",
      level: "Nivel",
      editProfile: "Editar Perfil",
      signOut: "Cerrar Sesión",
      deleteAccount: "Eliminar Cuenta",
      areYouSureDeleteAccount: "¿Estás seguro de que quieres eliminar tu cuenta?",
      deleteAccountWarning: "Esta acción no se puede deshacer.",
      cancel: "Cancelar",
      confirmDelete: "Eliminar Cuenta",
      signOutConfirmation: "¿Estás seguro de que quieres cerrar sesión?",
      confirmSignOut: "Cerrar Sesión",
    },
    comparison: {
      title: "Cosmic Ascesis PRO",
      subtitle: "Desbloquea funciones premium y eleva tu viaje.",
      feature1: "Creación Ilimitada de Ascesis",
      feature2: "Análisis Avanzado",
      feature3: "Guía Personalizada",
      feature4: "Experiencia Sin Anuncios",
      upgradeButton: "Actualizar a PRO",
      restoreButton: "Restaurar Compra",
      successMessage: "¡Actualización exitosa!",
      errorMessage: "No se pudo actualizar. Por favor, inténtalo de nuevo."
    },
    subscription: {
      bannerTitle: "Desbloquea Todo el Potencial",
      bannerDesc: "Actualiza a PRO para funciones ilimitadas",
      upgradeNow: "Actualizar Ahora"
    },
    pactOath: {
      title: "Juramento de Ascesis",
      subtitle: "Haz tu pacto con el Universo",
      days: "días",
      readAloud: "Leer en voz alta",
      confirmReading: "He leído en voz alta y confirmo",
      signContract: "Firmar contrato",
      instructions: "Lee tu voto de ascesis en voz alta. Al pronunciar estas palabras, estás haciendo un pacto sagrado con el Universo."
    },
    userProfile: {
      title: "Sobre ti",
      age: "Edad",
      nameLabel: "Tu Nombre",
      namePlaceholder: "Ingresa tu nombre",
      nameRequired: "El nombre es requerido",
      birthDateLabel: "Fecha de Nacimiento",
      birthDatePlaceholder: "Selecciona tu fecha de nacimiento",
      birthDateRequired: "La fecha de nacimiento es requerida",
      languageLabel: "Idioma de la aplicación",
      continueButton: "Continuar",
      currentDate: "Fecha actual"
    },
    meditation: {
      title: "Meditación",
      pageTitle: "Meditaciones",
      subtitle: "Encuentra tu paz interior",
      start: "Comenzar",
      pause: "Pausar",
      resume: "Continuar",
      stop: "Detener",
      duration: "Duración",
      minutes: "minutos",
      play: "Reproducir",
      unlock: "Desbloquear",
      breathe: {
        in: "Inhala",
        hold: "Mantén",
        out: "Exhala",
        rest: "Descansa"
      },
      types: {
        guided: "Guiada",
        breathing: "Respiración",
        silent: "Silenciosa"
      },
      categories: {
        morning: "Mañana",
        evening: "Noche",
        stress: "Estrés",
        mantra: "Mantra",
        visual: "Visual"
      },
      morning: {
        title1: "Claridad Matutina",
        desc1: "Comienza tu día con claridad y propósito",
        title2: "Energía del Amanecer",
        desc2: "Llénate de energía para el día"
      },
      evening: {
        title1: "Relajación Nocturna",
        desc1: "Libera la tensión del día y prepárate para descansar"
      },
      stress: {
        title1: "Liberación de Estrés",
        desc1: "Encuentra calma en momentos de tensión"
      },
      mantra: {
        title1: "Mantras Poderosos",
        desc1: "Frases antiguas para enfocar tu energía"
      },
      visualization: {
        title1: "Viaje Cósmico",
        desc1: "Viaja a través del cosmos en tu mente"
      }
    },
    auth: {
      signIn: "Iniciar Sesión",
      signInButton: "Iniciar Sesión",
      signUp: "Registrarse",
      signUpButton: "Registrarse",
      signInSuccess: "¡Inicio de sesión exitoso!",
      welcomeBack: "Bienvenido de nuevo a Ascesis Cósmica",
      signInError: "Error al iniciar sesión",
      signUpSuccess: "¡Registro exitoso!",
      accountCreated: "Tu cuenta ha sido creada",
      signUpError: "Error al registrarse",
      tryAgain: "Por favor, inténtalo de nuevo",
      enterCredentials: "Ingresa tus credenciales para continuar",
      email: "Correo electrónico",
      password: "Contraseña",
      name: "Nombre",
      namePlaceholder: "Tu nombre",
      confirmPassword: "Confirmar contraseña",
      processing: "Procesando...",
      noAccount: "¿No tienes cuenta?",
      signUpNow: "Regístrate ahora",
      alreadyHaveAccount: "¿Ya tienes cuenta?",
      signInNow: "Inicia sesión ahora",
      createAccountPrompt: "Crea tu cuenta para comenzar tu viaje"
    }
  },
};
