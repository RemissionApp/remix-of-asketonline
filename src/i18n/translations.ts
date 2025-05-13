
export type SupportedLanguage = 'ru' | 'en' | 'es';

interface Translations {
  welcome: {
    title: string;
    subtitle: string;
    startButton: string;
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
    signInWithEmail: string;
    signInWithGoogle: string;
    signInWithGithub: string;
    signInSuccess: string;
    signInError: string;
    signUpSuccess: string;
    signUpError: string;
    signOutSuccess: string;
    passwordsDoNotMatch: string;
    emailRequired: string;
    passwordRequired: string;
    passwordLength: string;
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
    age: string;
    yearSingular: string;
    yearPlural: string;
    currentDate: string;
    languageLabel: string;
    back: string;
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
    profile: string;
  };
  createPact: {
    title: string;
    subtitleAscesis: string;
    subtitleReward: string;
    fromWhat: string;
    whatTitle: string;
    whatPlaceholder: string;
    whatRequired: string;
    durationTitle: string;
    durationDays: string;
    rewardTitle: string;
    rewardPlaceholder: string;
    createButton: string;
    addCustom: string;
  };
  universe: {
    title: string;
    placeholder: string;
    askButton: string;
    thinking: string;
    emptyState: string;
  };
  meditation: {
    pageTitle: string;
    subtitle: string;
    proFeatures: string;
    basic: string;
    pro: string;
    duration: string;
    play: string;
    comingSoon: string;
  };
}

export const translations: Record<SupportedLanguage, Translations> = {
  ru: {
    welcome: {
      title: 'Аскеза',
      subtitle: 'Путь к внутренней силе',
      startButton: 'Начать путь',
    },
    auth: {
      signIn: 'Войти',
      signUp: 'Регистрация',
      signOut: 'Выйти',
      email: 'Email',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      forgotPassword: 'Забыли пароль?',
      backToSignIn: 'Назад к входу',
      createAccount: 'Создать аккаунт',
      alreadyHaveAccount: 'Уже есть аккаунт?',
      signInWithEmail: 'Войти через Email',
      signInWithGoogle: 'Войти через Google',
      signInWithGithub: 'Войти через Github',
      signInSuccess: 'Успешный вход!',
      signInError: 'Ошибка входа. Пожалуйста, попробуйте снова.',
      signUpSuccess: 'Аккаунт успешно создан!',
      signUpError: 'Ошибка при создании аккаунта. Пожалуйста, попробуйте снова.',
      signOutSuccess: 'Вы успешно вышли из системы.',
      passwordsDoNotMatch: 'Пароли не совпадают',
      emailRequired: 'Email обязателен',
      passwordRequired: 'Пароль обязателен',
      passwordLength: 'Пароль должен быть не менее 8 символов',
    },
    userProfile: {
      title: 'О тебе',
      nameLabel: 'Как тебя зовут',
      namePlaceholder: 'Введите ваше имя',
      nameRequired: 'Имя обязательно',
      birthDateLabel: 'Дата рождения',
      birthDatePlaceholder: 'Выберите дату рождения',
      birthDateRequired: 'Укажите дату рождения',
      continueButton: 'Продолжить',
      age: 'Возраст',
      yearSingular: 'год',
      yearPlural: 'лет',
      currentDate: 'Текущая дата',
      languageLabel: 'Язык приложения',
      back: 'Назад',
    },
    main: {
      days: 'дней',
      todayCompleted: 'Отметить сегодня выполненным',
      askUniverse: 'Спросить у вселенной',
      noPacts: 'У вас пока нет активных аскез',
      createPact: 'Создать аскезу',
      nav: {
        path: 'Путь',
        ascesis: 'Аскеза',
        universe: 'Вселенная',
        profile: 'Профиль',
      },
      profile: 'Мой профиль',
    },
    createPact: {
      title: 'Создание аскезы',
      subtitleAscesis: 'От чего вы хотите отказаться?',
      subtitleReward: 'Что будет вашей наградой?',
      fromWhat: 'От чего',
      whatTitle: 'От чего вы отказываетесь?',
      whatPlaceholder: 'Например: от сахара, от телефона после 22:00',
      whatRequired: 'Укажите, от чего вы отказываетесь',
      durationTitle: 'Продолжительность',
      durationDays: 'дней',
      rewardTitle: 'Награда',
      rewardPlaceholder: 'Что вы себе позволите, когда выполните аскезу?',
      createButton: 'Создать аскезу',
      addCustom: 'Добавить своё',
    },
    universe: {
      title: 'Спросите у Вселенной',
      placeholder: 'Что вы хотите узнать у вселенной?',
      askButton: 'Спросить',
      thinking: 'Вселенная размышляет...',
      emptyState: 'Задайте вопрос, и вселенная даст ответ',
    },
    meditation: {
      pageTitle: 'Медитации',
      subtitle: 'Используйте медитации для углубления своей практики',
      proFeatures: 'Pro-функции',
      basic: 'Базовый',
      pro: 'Pro',
      duration: 'мин',
      play: 'Играть',
      comingSoon: 'Скоро',
    }
  },
  en: {
    welcome: {
      title: 'Ascesis',
      subtitle: 'Path to inner strength',
      startButton: 'Begin the path',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      backToSignIn: 'Back to Sign In',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      signInWithEmail: 'Sign In with Email',
      signInWithGoogle: 'Sign In with Google',
      signInWithGithub: 'Sign In with Github',
      signInSuccess: 'Signed in successfully!',
      signInError: 'Error signing in. Please try again.',
      signUpSuccess: 'Account created successfully!',
      signUpError: 'Error creating account. Please try again.',
      signOutSuccess: 'You have been signed out.',
      passwordsDoNotMatch: 'Passwords do not match',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      passwordLength: 'Password must be at least 8 characters',
    },
    userProfile: {
      title: 'About you',
      nameLabel: 'What is your name',
      namePlaceholder: 'Enter your name',
      nameRequired: 'Name is required',
      birthDateLabel: 'Date of birth',
      birthDatePlaceholder: 'Select your date of birth',
      birthDateRequired: 'Birth date is required',
      continueButton: 'Continue',
      age: 'Age',
      yearSingular: 'year',
      yearPlural: 'years',
      currentDate: 'Current date',
      languageLabel: 'App language',
      back: 'Back',
    },
    main: {
      days: 'days',
      todayCompleted: 'Mark today as complete',
      askUniverse: 'Ask the universe',
      noPacts: 'You don\'t have any active ascesis yet',
      createPact: 'Create ascesis',
      nav: {
        path: 'Path',
        ascesis: 'Ascesis',
        universe: 'Universe',
        profile: 'Profile',
      },
      profile: 'My profile',
    },
    createPact: {
      title: 'Create Ascesis',
      subtitleAscesis: 'What do you want to reject?',
      subtitleReward: 'What will be your reward?',
      fromWhat: 'From what',
      whatTitle: 'What are you rejecting?',
      whatPlaceholder: 'For example: sugar, phone after 10 PM',
      whatRequired: 'Specify what you are rejecting',
      durationTitle: 'Duration',
      durationDays: 'days',
      rewardTitle: 'Reward',
      rewardPlaceholder: 'What will you allow yourself when you complete the ascesis?',
      createButton: 'Create ascesis',
      addCustom: 'Add custom',
    },
    universe: {
      title: 'Ask the Universe',
      placeholder: 'What do you want to know from the universe?',
      askButton: 'Ask',
      thinking: 'The universe is contemplating...',
      emptyState: 'Ask a question, and the universe will provide an answer',
    },
    meditation: {
      pageTitle: 'Meditations',
      subtitle: 'Use meditations to deepen your practice',
      proFeatures: 'Pro features',
      basic: 'Basic',
      pro: 'Pro',
      duration: 'min',
      play: 'Play',
      comingSoon: 'Coming Soon',
    }
  },
  es: {
    welcome: {
      title: 'Ascesis',
      subtitle: 'Camino a la fuerza interior',
      startButton: 'Comenzar el camino',
    },
    auth: {
      signIn: 'Iniciar sesión',
      signUp: 'Registrarse',
      signOut: 'Cerrar sesión',
      email: 'Correo electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      forgotPassword: '¿Olvidó su contraseña?',
      backToSignIn: 'Volver a iniciar sesión',
      createAccount: 'Crear cuenta',
      alreadyHaveAccount: '¿Ya tiene una cuenta?',
      signInWithEmail: 'Iniciar sesión con correo electrónico',
      signInWithGoogle: 'Iniciar sesión con Google',
      signInWithGithub: 'Iniciar sesión con Github',
      signInSuccess: '¡Sesión iniciada correctamente!',
      signInError: 'Error al iniciar sesión. Por favor, inténtelo de nuevo.',
      signUpSuccess: '¡Cuenta creada correctamente!',
      signUpError: 'Error al crear la cuenta. Por favor, inténtelo de nuevo.',
      signOutSuccess: 'Ha cerrado sesión.',
      passwordsDoNotMatch: 'Las contraseñas no coinciden',
      emailRequired: 'El correo electrónico es obligatorio',
      passwordRequired: 'La contraseña es obligatoria',
      passwordLength: 'La contraseña debe tener al menos 8 caracteres',
    },
    userProfile: {
      title: 'Sobre ti',
      nameLabel: '¿Cómo te llamas?',
      namePlaceholder: 'Introduce tu nombre',
      nameRequired: 'El nombre es obligatorio',
      birthDateLabel: 'Fecha de nacimiento',
      birthDatePlaceholder: 'Selecciona tu fecha de nacimiento',
      birthDateRequired: 'La fecha de nacimiento es obligatoria',
      continueButton: 'Continuar',
      age: 'Edad',
      yearSingular: 'año',
      yearPlural: 'años',
      currentDate: 'Fecha actual',
      languageLabel: 'Idioma de la aplicación',
      back: 'Atrás',
    },
    main: {
      days: 'días',
      todayCompleted: 'Marcar hoy como completado',
      askUniverse: 'Preguntar al universo',
      noPacts: 'Aún no tienes ninguna ascesis activa',
      createPact: 'Crear ascesis',
      nav: {
        path: 'Camino',
        ascesis: 'Ascesis',
        universe: 'Universo',
        profile: 'Perfil',
      },
      profile: 'Mi perfil',
    },
    createPact: {
      title: 'Crear Ascesis',
      subtitleAscesis: '¿A qué quieres renunciar?',
      subtitleReward: '¿Cuál será tu recompensa?',
      fromWhat: 'De qué',
      whatTitle: '¿A qué renuncias?',
      whatPlaceholder: 'Por ejemplo: azúcar, teléfono después de las 22:00',
      whatRequired: 'Especifica a qué renuncias',
      durationTitle: 'Duración',
      durationDays: 'días',
      rewardTitle: 'Recompensa',
      rewardPlaceholder: '¿Qué te permitirás cuando completes la ascesis?',
      createButton: 'Crear ascesis',
      addCustom: 'Añadir personalizado',
    },
    universe: {
      title: 'Pregunta al Universo',
      placeholder: '¿Qué quieres saber del universo?',
      askButton: 'Preguntar',
      thinking: 'El universo está contemplando...',
      emptyState: 'Haz una pregunta, y el universo te dará una respuesta',
    },
    meditation: {
      pageTitle: 'Meditaciones',
      subtitle: 'Utiliza las meditaciones para profundizar en tu práctica',
      proFeatures: 'Funciones Pro',
      basic: 'Básico',
      pro: 'Pro',
      duration: 'min',
      play: 'Reproducir',
      comingSoon: 'Próximamente',
    }
  },
};
