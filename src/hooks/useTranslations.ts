import { useAppStore } from '@/store/useAppStore';
import translations from '@/i18n/translations';

/**
 * Returns correct Russian declension for years
 * @param age The age number
 * @returns Appropriate Russian word form for "year"
 */
const getRussianYearDeclension = (age: number): string => {
  // Handle exceptions (11-14 use "лет")
  if (age % 100 >= 11 && age % 100 <= 14) {
    return 'лет';
  }
  
  // Check the last digit
  const lastDigit = age % 10;
  
  if (lastDigit === 1) {
    return 'год';
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return 'года';
  } else {
    return 'лет';
  }
};

export const useTranslations = () => {
  const { language } = useAppStore();
  
  const getYearWord = (age: number): string => {
    if (language === 'ru') {
      return getRussianYearDeclension(age);
    } else if (language === 'es') {
      return age === 1 ? 'año' : 'años';
    } else {
      return age === 1 ? 'year' : 'years';
    }
  };
  
  const defaultTranslations = {
    calendar: {
      year: language === 'ru' ? 'Год' : language === 'es' ? 'Año' : 'Year',
      month: language === 'ru' ? 'Месяц' : language === 'es' ? 'Mes' : 'Month'
    },
    minimumPeriod: language === 'ru' ? 'Минимальный срок аскезы - 30 дней' : 
                   language === 'es' ? 'Período mínimo de ascesis - 30 días' : 
                   'Minimum ascesis period - 30 days',
    comparison: {
      title: language === 'ru' ? 'ASKET vs ASKET PRO' : language === 'es' ? 'ASKET vs ASKET PRO' : 'ASKET vs ASKET PRO',
      freePlan: language === 'ru' ? 'Бесплатно' : language === 'es' ? 'Gratis' : 'Free',
      proPlan: language === 'ru' ? 'Платная подписка' : language === 'es' ? 'Suscripción de pago' : 'Paid subscription',
      free: language === 'ru' ? 'Бесплатно' : language === 'es' ? 'Gratis' : 'Free',
      pricing: language === 'ru' ? '$4.99/мес или $29.99/год' : language === 'es' ? '$4.99/mes o $29.99/año' : '$4.99/month or $29.99/year',
      upgradeButton: language === 'ru' ? 'Открыть силу PRO ✨' : language === 'es' ? 'Desbloquear el poder PRO ✨' : 'Unlock PRO power ✨',
      features: [
        {
          name: language === 'ru' ? 'Количество активных аскез' : language === 'es' ? 'Número de ascesis activas' : 'Active ascesis count',
          free: true,
          pro: true,
          freeDescription: language === 'ru' ? '1 одновременно' : language === 'es' ? '1 simultáneamente' : '1 simultaneously',
          proDescription: language === 'ru' ? 'До 5 одновременно' : language === 'es' ? 'Hasta 5 simultáneamente' : 'Up to 5 simultaneously'
        }
      ]
    },
    meditation: {
      pageTitle: language === 'ru' ? 'Медитации силы' : language === 'es' ? 'Meditaciones de poder' : 'Power Meditations',
      play: language === 'ru' ? 'Слушать' : language === 'es' ? 'Escuchar' : 'Listen',
      unlock: language === 'ru' ? 'Открыть PRO' : language === 'es' ? 'Desbloquear PRO' : 'Unlock PRO',
      categories: {
        morning: language === 'ru' ? 'Утренние' : language === 'es' ? 'Mañana' : 'Morning',
        evening: language === 'ru' ? 'Вечерние' : language === 'es' ? 'Noche' : 'Evening',
        stress: language === 'ru' ? 'Антистресс' : language === 'es' ? 'Antiestrés' : 'Anti-stress',
        mantra: language === 'ru' ? 'Мантры' : language === 'es' ? 'Mantras' : 'Mantras',
        visual: language === 'ru' ? 'Визуализации' : language === 'es' ? 'Visualización' : 'Visualization'
      },
      morning: {
        title1: language === 'ru' ? 'Настрой на день' : language === 'es' ? 'Preparación para el día' : 'Day Setup',
        desc1: language === 'ru' ? 'Зарядись энергией на весь день' : language === 'es' ? 'Cárgate de energía para todo el día' : 'Charge with energy for the whole day',
        title2: language === 'ru' ? 'Благодарность' : language === 'es' ? 'Gratitud' : 'Gratitude',
        desc2: language === 'ru' ? 'Практика благодарности Вселенной' : language === 'es' ? 'Práctica de gratitud al Universo' : 'Practice of gratitude to the Universe'
      },
      evening: {
        title1: language === 'ru' ? 'Прощение' : language === 'es' ? 'Perdón' : 'Forgiveness',
        desc1: language === 'ru' ? 'Отпусти прошлое с легкостью' : language === 'es' ? 'Deja ir el pasado con facilidad' : 'Let go of the past with ease'
      },
      stress: {
        title1: language === 'ru' ? 'Заземление' : language === 'es' ? 'Conexión a tierra' : 'Grounding',
        desc1: language === 'ru' ? 'Восстановление внутреннего равновесия' : language === 'es' ? 'Restauración del equilibrio interior' : 'Restoring inner balance'
      },
      mantra: {
        title1: language === 'ru' ? 'Голос наставника' : language === 'es' ? 'Voz del guía' : 'Guide\'s Voice',
        desc1: language === 'ru' ? 'Интеграция высшей энергии' : language === 'es' ? 'Integración de energía superior' : 'Integration of higher energy'
      },
      visualization: {
        title1: language === 'ru' ? 'Космический полёт' : language === 'es' ? 'Vuelo cósmico' : 'Cosmic Flight',
        desc1: language === 'ru' ? 'Путешествие сквозь звёзды' : language === 'es' ? 'Viaje a través de las estrellas' : 'Journey through the stars'
      }
    },
    subscription: {
      bannerTitle: language === 'ru' ? 'Раскройте свой потенциал с ASKET PRO' : 
                   language === 'es' ? 'Desbloquea tu potencial con ASKET PRO' : 
                   'Unlock your potential with ASKET PRO',
      bannerDesc: language === 'ru' ? 'Доступ к медитациям, расширенным практикам и многому другому' : 
                  language === 'es' ? 'Acceso a meditaciones, prácticas avanzadas y mucho más' : 
                  'Access to meditations, advanced practices and much more',
      upgradeNow: language === 'ru' ? 'Улучшить сейчас' : language === 'es' ? 'Mejorar ahora' : 'Upgrade Now'
    },
    main: {
      path: language === 'ru' ? 'Путь' : language === 'es' ? 'Camino' : 'Path',
      ascesis: language === 'ru' ? 'Аскеза' : language === 'es' ? 'Ascesis' : 'Ascesis',
      universe: language === 'ru' ? 'Вселенная' : language === 'es' ? 'Universo' : 'Universe',
      profile: language === 'ru' ? 'Профиль' : language === 'es' ? 'Perfil' : 'Profile',
      days: language === 'ru' ? 'дней' : language === 'es' ? 'días' : 'days',
      todayCompleted: language === 'ru' ? 'Сегодня завершено' : language === 'es' ? 'Hoy completado' : 'Today Completed',
      askUniverse: language === 'ru' ? 'Спросить Вселенную' : language === 'es' ? 'Preguntar al Universo' : 'Ask the Universe',
      noPacts: language === 'ru' ? 'Нет активных аскез' : language === 'es' ? 'No hay ascesis activas' : 'No active ascesis',
      createPact: language === 'ru' ? 'Создать аскезу' : language === 'es' ? 'Crear ascesis' : 'Create Ascesis',
      meditation: language === 'ru' ? 'Медитации' : language === 'es' ? 'Meditaciones' : 'Meditations',
      nav: {
        path: language === 'ru' ? 'Путь' : language === 'es' ? 'Camino' : 'Path',
        ascesis: language === 'ru' ? 'Аскеза' : language === 'es' ? 'Ascesis' : 'Ascesis',
        universe: language === 'ru' ? 'Вселенная' : language === 'es' ? 'Universo' : 'Universe',
        profile: language === 'ru' ? 'Профиль' : language === 'es' ? 'Perfil' : 'Profile'
      }
    },
    userProfile: {
      title: language === 'ru' ? 'О тебе' : language === 'es' ? 'Sobre ti' : 'About You',
      nameLabel: language === 'ru' ? 'Как тебя зовут' : language === 'es' ? '¿Cómo te llamas?' : 'What\'s your name',
      namePlaceholder: language === 'ru' ? 'Введите ваше имя' : language === 'es' ? 'Ingresa tu nombre' : 'Enter your name',
      nameRequired: language === 'ru' ? 'Имя обязательно' : language === 'es' ? 'El nombre es obligatorio' : 'Name is required',
      birthDateLabel: language === 'ru' ? 'Дата рождения' : language === 'es' ? 'Fecha de nacimiento' : 'Date of birth',
      birthDatePlaceholder: language === 'ru' ? 'Выберите дату рождения' : language === 'es' ? 'Selecciona tu fecha de nacimiento' : 'Select your date of birth',
      birthDateRequired: language === 'ru' ? 'Укажите дату рождения' : language === 'es' ? 'La fecha de nacimiento es obligatoria' : 'Date of birth is required',
      continueButton: language === 'ru' ? 'Продолжить' : language === 'es' ? 'Continuar' : 'Continue',
      age: language === 'ru' ? 'Возраст' : language === 'es' ? 'Edad' : 'Age',
      yearSingular: language === 'ru' ? 'год' : language === 'es' ? 'año' : 'year',
      yearPlural: language === 'ru' ? 'лет' : language === 'es' ? 'años' : 'years',
      currentDate: language === 'ru' ? 'Текущая дата' : language === 'es' ? 'Fecha actual' : 'Current date',
      languageLabel: language === 'ru' ? 'Язык приложения' : language === 'es' ? 'Idioma de la aplicación' : 'App language',
      back: language === 'ru' ? 'Назад' : language === 'es' ? 'Atrás' : 'Back'
    },
    onboarding: {
      steps: [
        // This will be filled from i18n/translations.ts, but we need to define the type
      ],
      buttons: {
        next: language === 'ru' ? 'Далее' : language === 'es' ? 'Siguiente' : 'Next',
        enter: language === 'ru' ? 'Войти' : language === 'es' ? 'Entrar' : 'Enter',
        startJourney: language === 'ru' ? 'Начать путь' : language === 'es' ? 'Comenzar el camino' : 'Start Journey',
        skip: language === 'ru' ? 'Пропустить' : language === 'es' ? 'Omitir' : 'Skip'
      }
    },
    auth: {
      signIn: language === 'ru' ? 'Вход' : language === 'es' ? 'Iniciar sesión' : 'Sign In',
      signUp: language === 'ru' ? 'Регистрация' : language === 'es' ? 'Registrarse' : 'Sign Up',
      signOut: language === 'ru' ? 'Выход' : language === 'es' ? 'Cerrar sesión' : 'Sign Out',
      email: language === 'ru' ? 'Email' : language === 'es' ? 'Correo electrónico' : 'Email',
      password: language === 'ru' ? 'Пароль' : language === 'es' ? 'Contraseña' : 'Password',
      confirmPassword: language === 'ru' ? 'Подтвердите пароль' : language === 'es' ? 'Confirmar contraseña' : 'Confirm Password',
      forgotPassword: language === 'ru' ? 'Забыли пароль?' : language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?',
      backToSignIn: language === 'ru' ? 'Вернуться к входу' : language === 'es' ? 'Volver a iniciar sesión' : 'Back to Sign In',
      createAccount: language === 'ru' ? 'Создать аккаунт' : language === 'es' ? 'Crear cuenta' : 'Create Account',
      alreadyHaveAccount: language === 'ru' ? 'Уже есть аккаунт?' : language === 'es' ? '¿Ya tienes una cuenta?' : 'Already have an account?',
      resetPassword: language === 'ru' ? 'Сбросить пароль' : language === 'es' ? 'Restablecer contraseña' : 'Reset Password',
      resetPasswordButton: language === 'ru' ? 'Пожалуйста, введите email для восстановления пароля' : language === 'es' ? 'Por favor, introduce tu correo electrónico para restablecer la contraseña' : 'Please enter your email to reset your password',
      resetPasswordSuccess: language === 'ru' ? 'Проверьте вашу электронную почту для инструкций по сбросу пароля' : language === 'es' ? 'Revisa tu correo para restablecer tu contraseña' : 'Check your email to reset your password',
      resetPasswordError: language === 'ru' ? 'Ошибка' : language === 'es' ? 'Error' : 'Error',
      signInError: language === 'ru' ? 'Ошибка при входе' : language === 'es' ? 'Error al iniciar sesión' : 'Error signing in',
      signUpError: language === 'ru' ? 'Ошибка при регистрации' : language === 'es' ? 'Error al registrarse' : 'Error signing up',
      passwordMismatch: language === 'ru' ? 'Пароли не совпадают' : language === 'es' ? 'Las contraseñas no coinciden' : 'Passwords do not match',
      welcomeBack: language === 'ru' ? 'Гостевой режим' : language === 'es' ? 'Modo invitado' : 'Guest mode',
      noAccount: language === 'ru' ? 'Нет аккаунта?' : language === 'es' ? '¿No tienes una cuenta?' : 'Don\'t have an account?',
      orContinueWith: language === 'ru' ? 'или' : language === 'es' ? 'o' : 'or',
      signInButton: language === 'ru' ? 'Внимание: прогресс пользователя не будет сохранен' : language === 'es' ? 'Atención: el progreso del usuario no se guardará' : 'Warning: user progress will not be saved',
      signUpButton: language === 'ru' ? 'Создать аккаунт' : language === 'es' ? 'Registrarse' : 'Sign Up',
      haveAccount: language === 'ru' ? 'Уже есть аккаунт?' : language === 'es' ? '¿Ya tienes una cuenta?' : 'Already have an account?',
      passwordLength: language === 'ru' ? 'Пароль должен содержать минимум 6 символов' : language === 'es' ? 'La contraseña debe tener al menos 6 caracteres' : 'Password must be at least 6 characters',
      guestSignIn: language === 'ru' ? 'Войти как гость' : language === 'es' ? 'Entrar como invitado' : 'Sign in as guest'
    },
    subscription: {
      bannerTitle: language === 'ru' ? 'Раскройте свой потенциал с ASKET PRO' : 
                   language === 'es' ? 'Desbloquea tu potencial con ASKET PRO' : 
                   'Unlock your potential with ASKET PRO',
      bannerDesc: language === 'ru' ? 'Доступ к медитациям, расширенным практикам и многому другому' : 
                  language === 'es' ? 'Acceso a meditaciones, prácticas avanzadas y mucho más' : 
                  'Access to meditations, advanced practices and much more',
      upgradeNow: language === 'ru' ? 'Улучшить сейчас' : language === 'es' ? 'Mejorar ahora' : 'Upgrade Now'
    }
  };
  
  return {
    t: {
      ...defaultTranslations,
      ...translations[language]
    },
    getYearWord
  };
};
