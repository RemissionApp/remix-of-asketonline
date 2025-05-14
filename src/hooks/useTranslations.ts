
import { useAppStore } from '@/store/useAppStore';
import translations, { SupportedLanguage } from '@/i18n/translations';

// Helper to get the correct word for the year based on the number in different languages
const getYearWordByLanguage = (age: number, language: SupportedLanguage) => {
  if (language === 'ru') {
    // Russian has complex pluralization rules
    if (age % 10 === 1 && age % 100 !== 11) {
      return 'год';
    } else if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100)) {
      return 'года';
    } else {
      return 'лет';
    }
  } else if (language === 'es') {
    // Spanish uses año for 1 and años for everything else
    return age === 1 ? 'año' : 'años';
  } else {
    // English simply uses "year" or "years"
    return age === 1 ? 'year' : 'years';
  }
};

// Define our UserProfileTranslations interface
export interface UserProfileTranslations {
  title: string;
  nameLabel: string;
  namePlaceholder: string;
  nameRequired: string;
  birthDateLabel: string;
  birthDatePlaceholder: string;
  birthDateRequired: string;
  continueButton: string;
  savingButton: string;
  age: string;
  yearSingular: string;
  yearPlural: string;
  currentDate: string;
  languageLabel: string;
  back: string;
}

export const useTranslations = () => {
  const { language } = useAppStore();
  
  // Helper function for year words based on number
  const getYearWord = (age: number) => {
    return getYearWordByLanguage(age, language);
  };
  
  // Define our translations with proper typing
  const defaultTranslations = {
    welcome: {
      title: language === 'ru' ? 'Добро пожаловать' : language === 'es' ? 'Bienvenido' : 'Welcome',
      description: language === 'ru' ? 'Погрузитесь в мир самопознания и духовного роста' : language === 'es' ? 'Sumérgete en un mundo de autodescubrimiento y crecimiento espiritual' : 'Dive into a world of self-discovery and spiritual growth',
      startButton: language === 'ru' ? 'Начать' : language === 'es' ? 'Comenzar' : 'Start',
    },
    login: {
      title: language === 'ru' ? 'Войти' : language === 'es' ? 'Iniciar sesión' : 'Login',
      emailLabel: language === 'ru' ? 'Электронная почта' : language === 'es' ? 'Correo electrónico' : 'Email',
      passwordLabel: language === 'ru' ? 'Пароль' : language === 'es' ? 'Contraseña' : 'Password',
      emailPlaceholder: language === 'ru' ? 'example@email.com' : language === 'es' ? 'ejemplo@email.com' : 'example@email.com',
      passwordPlaceholder: language === 'ru' ? 'Ваш пароль' : language === 'es' ? 'Tu contraseña' : 'Your password',
      loginButton: language === 'ru' ? 'Войти' : language === 'es' ? 'Iniciar sesión' : 'Login',
      registerButton: language === 'ru' ? 'Зарегистрироваться' : language === 'es' ? 'Registrarse' : 'Register',
      forgotPassword: language === 'ru' ? 'Забыли пароль?' : language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?',
      noAccount: language === 'ru' ? 'Нет аккаунта?' : language === 'es' ? '¿No tienes una cuenta?' : 'No account?',
      invalidEmail: language === 'ru' ? 'Неверный формат email' : language === 'es' ? 'Formato de email inválido' : 'Invalid email format',
      passwordRequired: language === 'ru' ? 'Пароль обязателен' : language === 'es' ? 'La contraseña es obligatoria' : 'Password is required',
      emailRequired: language === 'ru' ? 'Email обязателен' : language === 'es' ? 'El email es obligatorio' : 'Email is required',
    },
    
    userProfile: {
      title: language === 'ru' ? 'О тебе' : language === 'es' ? 'Acerca de ti' : 'About you',
      nameLabel: language === 'ru' ? 'Как тебя зовут' : language === 'es' ? 'Tu nombre' : 'Your name',
      namePlaceholder: language === 'ru' ? 'Введите ваше имя' : language === 'es' ? 'Ingresa tu nombre' : 'Enter your name',
      nameRequired: language === 'ru' ? 'Имя обязательно' : language === 'es' ? 'El nombre es obligatorio' : 'Name is required',
      birthDateLabel: language === 'ru' ? 'Дата рождения' : language === 'es' ? 'Fecha de nacimiento' : 'Birth date',
      birthDatePlaceholder: language === 'ru' ? 'Выберите дату рождения' : language === 'es' ? 'Selecciona tu fecha de nacimiento' : 'Select birth date',
      birthDateRequired: language === 'ru' ? 'Укажите дату рождения' : language === 'es' ? 'La fecha de nacimiento es obligatoria' : 'Birth date is required',
      continueButton: language === 'ru' ? 'Продолжить' : language === 'es' ? 'Continuar' : 'Continue',
      savingButton: language === 'ru' ? 'Сохранение...' : language === 'es' ? 'Guardando...' : 'Saving...',
      age: language === 'ru' ? 'Возраст' : language === 'es' ? 'Edad' : 'Age',
      yearSingular: language === 'ru' ? 'год' : language === 'es' ? 'año' : 'year',
      yearPlural: language === 'ru' ? 'лет' : language === 'es' ? 'años' : 'years',
      currentDate: language === 'ru' ? 'Текущая дата' : language === 'es' ? 'Fecha actual' : 'Current date',
      languageLabel: language === 'ru' ? 'Язык приложения' : language === 'es' ? 'Idioma de la aplicación' : 'App language',
      back: language === 'ru' ? 'Назад' : language === 'es' ? 'Atrás' : 'Back'
    } as UserProfileTranslations,
    
    onboarding: {
      title: language === 'ru' ? 'Твои цели' : language === 'es' ? 'Tus objetivos' : 'Your goals',
      description: language === 'ru' ? 'Определите свои цели, чтобы начать свой путь' : language === 'es' ? 'Define tus objetivos para comenzar tu camino' : 'Define your goals to start your journey',
      goal1: language === 'ru' ? 'Улучшить здоровье' : language === 'es' ? 'Mejorar la salud' : 'Improve health',
      goal2: language === 'ru' ? 'Улучшить отношения' : language === 'es' ? 'Mejorar las relaciones' : 'Improve relationships',
      goal3: language === 'ru' ? 'Улучшить карьеру' : language === 'es' ? 'Mejorar la carrera' : 'Improve career',
      goal4: language === 'ru' ? 'Улучшить финансы' : language === 'es' ? 'Mejorar las finanzas' : 'Improve finances',
      goal5: language === 'ru' ? 'Улучшить духовность' : language === 'es' ? 'Mejorar la espiritualidad' : 'Improve spirituality',
      goal6: language === 'ru' ? 'Улучшить навыки' : language === 'es' ? 'Mejorar las habilidades' : 'Improve skills',
      selectGoal: language === 'ru' ? 'Выберите свою цель' : language === 'es' ? 'Selecciona tu objetivo' : 'Select your goal',
      continueButton: language === 'ru' ? 'Продолжить' : language === 'es' ? 'Continuar' : 'Continue',
    },
    achievements: {
      title: language === 'ru' ? 'Достижения' : language === 'es' ? 'Logros' : 'Achievements',
      description: language === 'ru' ? 'Отслеживайте свои успехи и получайте награды' : language === 'es' ? 'Sigue tu progreso y obtén recompensas' : 'Track your progress and get rewards',
      firstPactTitle: language === 'ru' ? 'Первый пакт' : language === 'es' ? 'Primer pacto' : 'First pact',
      firstPactDescription: language === 'ru' ? 'Создайте свой первый пакт' : language === 'es' ? 'Crea tu primer pacto' : 'Create your first pact',
      tenDaysTitle: language === 'ru' ? '10 дней' : language === 'es' ? '10 días' : '10 days',
      tenDaysDescription: language === 'ru' ? 'Соблюдайте свои пакты в течение 10 дней' : language === 'es' ? 'Cumple tus pactos durante 10 días' : 'Keep your pacts for 10 days',
      thirtyDaysTitle: language === 'ru' ? '30 дней' : language === 'es' ? '30 días' : '30 days',
      thirtyDaysDescription: language === 'ru' ? 'Соблюдайте свои пакты в течение 30 дней' : language === 'es' ? 'Cumple tus pactos durante 30 días' : 'Keep your pacts for 30 days',
    },
    main: {
      title: language === 'ru' ? 'Главная' : language === 'es' ? 'Principal' : 'Main',
      createPact: language === 'ru' ? 'Создать пакт' : language === 'es' ? 'Crear pacto' : 'Create pact',
      universe: language === 'ru' ? 'Вселенная' : language === 'es' ? 'Universo' : 'Universe',
      profile: language === 'ru' ? 'Профиль' : language === 'es' ? 'Perfil' : 'Profile',
      comparison: language === 'ru' ? 'Сравнение' : language === 'es' ? 'Comparación' : 'Comparison',
      meditation: language === 'ru' ? 'Медитация' : language === 'es' ? 'Meditación' : 'Meditation',
      energyPoints: language === 'ru' ? 'Очки энергии' : language === 'es' ? 'Puntos de energía' : 'Energy points',
      totalDays: language === 'ru' ? 'Всего дней' : language === 'es' ? 'Total de días' : 'Total days',
      currentPacts: language === 'ru' ? 'Текущие пакты' : language === 'es' ? 'Pactos actuales' : 'Current pacts',
      noPacts: language === 'ru' ? 'У вас нет активных пактов' : language === 'es' ? 'No tienes pactos activos' : 'You have no active pacts',
      completedToday: language === 'ru' ? 'Выполнено сегодня' : language === 'es' ? 'Completado hoy' : 'Completed today',
      daysLeft: language === 'ru' ? 'Дней осталось' : language === 'es' ? 'Días restantes' : 'Days left',
      days: language === 'ru' ? 'дней' : language === 'es' ? 'días' : 'days',
      todayCompleted: language === 'ru' ? 'Сегодня я выдержал' : language === 'es' ? 'Hoy resistí' : 'Today I endured',
      askUniverse: language === 'ru' ? 'Спросить Вселенну' : language === 'es' ? 'Preguntar al Universo' : 'Ask the Universe',
      nav: {
        path: language === 'ru' ? 'Путь' : language === 'es' ? 'Camino' : 'Path',
        ascesis: language === 'ru' ? 'Аскезы' : language === 'es' ? 'Ascesis' : 'Ascesis',
        universe: language === 'ru' ? 'Вселенная' : language === 'es' ? 'Universo' : 'Universe',
        profile: language === 'ru' ? 'Профиль' : language === 'es' ? 'Perfil' : 'Profile'
      }
    },
    createPact: {
      title: language === 'ru' ? 'Создать новый пакт' : language === 'es' ? 'Crear nuevo pacto' : 'Create new pact',
      pactTitle: language === 'ru' ? 'Название пакта' : language === 'es' ? 'Título del pacto' : 'Pact title',
      pactDuration: language === 'ru' ? 'Длительность пакта (в днях)' : language === 'es' ? 'Duración del pacto (en días)' : 'Pact duration (in days)',
      pactReward: language === 'ru' ? 'Награда (необязательно)' : language === 'es' ? 'Recompensa (opcional)' : 'Reward (optional)',
      pactStatus: language === 'ru' ? 'Статус пакта' : language === 'es' ? 'Estado del pacto' : 'Pact status',
      createButton: language === 'ru' ? 'Создать' : language === 'es' ? 'Crear' : 'Create',
      titlePlaceholder: language === 'ru' ? 'Название вашего пакта' : language === 'es' ? 'Título de tu pacto' : 'Your pact title',
      durationPlaceholder: language === 'ru' ? 'Количество дней' : language === 'es' ? 'Número de días' : 'Number of days',
      rewardPlaceholder: language === 'ru' ? 'Награда за выполнение' : language === 'es' ? 'Recompensa por completar' : 'Reward for completing',
      titleRequired: language === 'ru' ? 'Название обязательно' : language === 'es' ? 'El título es obligatorio' : 'Title is required',
      durationRequired: language === 'ru' ? 'Длительность обязательна' : language === 'es' ? 'La duración es obligatoria' : 'Duration is required',
      durationInvalid: language === 'ru' ? 'Длительность должна быть числом' : language === 'es' ? 'La duración debe ser un número' : 'Duration must be a number',
      stepOneTitle: language === 'ru' ? 'От чего ты отказываешься?' : language === 'es' ? '¿A qué renuncias?' : 'What are you giving up?',
      placeholders: {
        rejection: language === 'ru' ? 'Например: Сахар, Соцсети, Алкоголь...' : language === 'es' ? 'Por ejemplo: Azúcar, Redes Sociales, Alcohol...' : 'For example: Sugar, Social Media, Alcohol...',
        reward: language === 'ru' ? 'Например: Крепкое здоровье, Ясность мышления, Финансовую стабильность...' : language === 'es' ? 'Por ejemplo: Salud fuerte, Claridad mental, Estabilidad financiera...' : 'For example: Strong health, Mental clarity, Financial stability...'
      },
      days: language === 'ru' ? 'дней' : language === 'es' ? 'días' : 'days',
    },
    universe: {
      title: language === 'ru' ? 'Вселенная' : language === 'es' ? 'Universo' : 'Universe',
      question: language === 'ru' ? 'Ваш вопрос' : language === 'es' ? 'Tu pregunta' : 'Your question',
      answer: language === 'ru' ? 'Ответ' : language === 'es' ? 'Respuesta' : 'Answer',
      askButton: language === 'ru' ? 'Спросить' : language === 'es' ? 'Preguntar' : 'Ask',
      questionPlaceholder: language === 'ru' ? 'Введите свой вопрос' : language === 'es' ? 'Escribe tu pregunta' : 'Enter your question',
      answerPlaceholder: language === 'ru' ? 'Здесь будет ответ' : language === 'es' ? 'Aquí estará la respuesta' : 'The answer will be here',
    },
    comparison: {
      title: language === 'ru' ? 'Сравнение' : language === 'es' ? 'Comparación' : 'Comparison',
      description: language === 'ru' ? 'Сравните себя с другими пользователями' : language === 'es' ? 'Compárate con otros usuarios' : 'Compare yourself with other users',
      energyPoints: language === 'ru' ? 'Очки энергии' : language === 'es' ? 'Puntos de energía' : 'Energy points',
      totalDays: language === 'ru' ? 'Всего дней' : language === 'es' ? 'Total de días' : 'Total days',
      rank: language === 'ru' ? 'Ранг' : language === 'es' ? 'Rango' : 'Rank',
    },
    meditation: {
      title: language === 'ru' ? 'Медитация' : language === 'es' ? 'Meditación' : 'Meditation',
      description: language === 'ru' ? 'Найдите свой внутренний покой' : language === 'es' ? 'Encuentra tu paz interior' : 'Find your inner peace',
      startButton: language === 'ru' ? 'Начать медитацию' : language === 'es' ? 'Comenzar meditación' : 'Start meditation',
      play: language === 'ru' ? 'Слушать' : language === 'es' ? 'Escuchar' : 'Listen',
      unlock: language === 'ru' ? 'Открыть PRO' : language === 'es' ? 'Desbloquear PRO' : 'Unlock PRO',
    },
    pactOath: {
      title: language === 'ru' ? 'Моя Аскеза' : language === 'es' ? 'Mi Ascesis' : 'My Ascesis',
      subtitle: language === 'ru' ? 'Я даю обет' : language === 'es' ? 'Hago un voto' : 'I take a vow',
      iPromise: language === 'ru' ? 'Я обещаю отказаться от' : language === 'es' ? 'Prometo renunciar a' : 'I promise to give up',
      duration: language === 'ru' ? 'на срок' : language === 'es' ? 'por un período de' : 'for a period of',
      days: language === 'ru' ? 'дней' : language === 'es' ? 'días' : 'days',
      inReturn: language === 'ru' ? 'Взамен я притягиваю в свою жизнь' : language === 'es' ? 'A cambio atraigo a mi vida' : 'In return I attract into my life',
      confirmButton: language === 'ru' ? 'Подтверждаю Договор' : language === 'es' ? 'Confirmar Pacto' : 'Confirm Covenant',
    },
    subscription: {
      bannerTitle: language === 'ru' ? 'Раскройте свой потенциал с ASKET PRO' : language === 'es' ? 'Desbloquea tu potencial con ASKET PRO' : 'Unlock your potential with ASKET PRO',
      bannerDesc: language === 'ru' ? 'Доступ к медитациям, расширенным практикам и многому другому' : language === 'es' ? 'Acceso a meditaciones, prácticas avanzadas y mucho más' : 'Access to meditations, advanced practices and much more',
      upgradeNow: language === 'ru' ? 'Улучшить сейчас' : language === 'es' ? 'Mejorar ahora' : 'Upgrade Now',
    },
    calendar: {
      year: language === 'ru' ? 'Год' : language === 'es' ? 'Año' : 'Year',
      month: language === 'ru' ? 'Месяц' : language === 'es' ? 'Mes' : 'Month',
    }
  };

  return {
    t: defaultTranslations,
    getYearWord
  };
};
