
import { useAppStore } from '@/store/useAppStore';
import translations from '@/i18n/translations';

export type SupportedLanguage = 'ru' | 'en' | 'es';

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
      months: [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ],
      weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      today: 'Сегодня',
      month: 'Месяц',
      week: 'Неделя',
      day: 'День',
      previousMonth: 'Предыдущий месяц',
      nextMonth: 'Следующий месяц',
      previousWeek: 'Предыдущая неделя',
      nextWeek: 'Следующая неделя',
      previousDay: 'Предыдущий день',
      nextDay: 'Следующий день',
      selectMonth: 'Выбрать месяц',
      selectYear: 'Выбрать год',
      selectDate: 'Выбрать дату',
      selectTime: 'Выбрать время',
      selectDateTime: 'Выбрать дату и время',
      cancel: 'Отмена',
      save: 'Сохранить',
      clear: 'Очистить',
      now: 'Сейчас',
      am: 'AM',
      pm: 'PM',
      year: 'Год' // Added missing property
    },
    welcome: {
      title: 'АСКЕТ',
      subtitle: 'Путь к внутренней силе',
      startButton: 'Начать путешествие'
    },
    auth: {
      signIn: 'Войти',
      signUp: 'Зарегистрироваться',
      signOut: 'Выйти',
      email: 'Email',
      emailPlaceholder: 'user@example.com',
      emailInvalid: 'Неверный формат email',
      password: 'Пароль',
      passwordPlaceholder: '••••••••',
      confirmPassword: 'Подтвердите пароль',
      forgotPassword: 'Забыли пароль?',
      backToSignIn: 'Назад к входу',
      createAccount: 'Создать аккаунт',
      alreadyHaveAccount: 'Уже есть аккаунт?',
      continueAsGuest: 'Гость',
      processing: 'Обработка...',
      welcomeBack: 'С возвращением',
      signInSubtitle: 'Войдите, чтобы продолжить',
      signInButton: 'Войти',
      createAccountTitle: 'Создать аккаунт',
      signUpSubtitle: 'Зарегистрируйтесь, чтобы начать',
      signUpButton: 'Создать аккаунт',
      noAccount: 'Нет аккаунта?',
      haveAccount: 'Уже есть аккаунт?',
      orContinueWith: 'Или продолжить как',
      passwordMatch: 'Пароли не совпадают',
      passwordLength: 'Пароль должен быть не менее 6 символов',
    },
    userProfile: {
      title: 'О тебе',
      nameLabel: 'Как тебя зовут',
      namePlaceholder: 'Введите ваше имя',
      nameRequired: 'Имя обязательно',
      birthDateLabel: 'Дата рождения',
      birthDatePlaceholder: 'Выберите дату рождения',
      birthDateRequired: 'Укажите дату рождения',
      languageLabel: 'Язык приложения',
      currentDate: 'Текущая дата',
      continueButton: 'Продолжить',
      age: 'Возраст'
    },
    onboarding: {
      steps: [
        {
          title: 'Добро пожаловать, Искатель',
          content: 'Ты стоишь на пороге пути к внутренней силе.\n\nАскет — это практика внутренней работы над собой, основанная на древних учениях и современных научных методиках.\n\nНажми "Войти", чтобы начать свое путешествие.'
        },
        {
          title: 'Цели и смысл пути',
          content: 'Аскет помогает:\n\n• Обрести спокойствие и ясность ума\n• Развить волю и дисциплину\n• Освободиться от зависимостей\n• Найти внутреннюю опору\n• Раскрыть свой потенциал'
        },
        {
          title: 'Твой путь начинается',
          content: 'Каждый день тебя будут ждать практики и испытания.\n\nТы сам выбираешь свой темп и ритм.\n\nГлавное — регулярность и искренность.\n\nГотов ли ты принять вызов?'
        }
      ],
      buttons: {
        enter: 'Войти',
        next: 'Далее',
        startJourney: 'Начать путь'
      }
    },
    main: {
      days: 'День',
      todayCompleted: 'Сегодня выполнено',
      askUniverse: 'Спросить Вселенную',
      noPacts: 'У вас пока нет пактов',
      createPact: 'Создать пакт',
      nav: {
        path: 'Путь',
        ascesis: 'Аскеза',
        universe: 'Вселенная',
        profile: 'Профиль'
      },
      profile: 'Профиль'
    },
    universe: {
      title: 'Спросить Вселенную',
      placeholder: 'Введите ваш вопрос...',
      askButton: 'Спросить',
      thinking: 'Вселенная размышляет...',
      emptyState: 'Задай свой вопрос Вселенной',
      yourQuestion: 'Твой вопрос',
      universeAnswer: 'Ответ Вселенной',
      newQuestion: 'Новый вопрос',
      question: 'Вопрос',
      previousQuestions: 'Прошлые вопросы'
    },
    compareVersions: {
      title: 'Сравнение версий',
      subtitle: 'Выберите две версии для сравнения',
      compare: 'Сравнить',
      version: 'Версия',
      noVersions: 'Нет доступных версий',
      differences: 'Различия',
      noDifferences: 'Различий не найдено',
      added: 'Добавлено',
      removed: 'Удалено',
      changed: 'Изменено',
      back: 'Назад'
    },
    meditation: {
      title: 'Медитация',
      pageTitle: 'Медитации',
      subtitle: 'Выберите тип медитации',
      start: 'Начать',
      pause: 'Пауза',
      resume: 'Продолжить',
      stop: 'Остановить',
      duration: 'Длительность',
      minutes: 'мин',
      play: 'Слушать',
      unlock: 'Открыть PRO',
      breathe: {
        in: 'Вдох',
        hold: 'Задержка',
        out: 'Выдох',
        rest: 'Отдых'
      },
      types: {
        breathing: 'Дыхательная',
        mindfulness: 'Осознанность',
        loving: 'Любящая доброта',
        body: 'Сканирование тела'
      }
    },
    createPact: {
      title: 'Создать пакт',
      subtitle: 'Определите условия вашего пакта',
      stepOneTitle: 'От чего ты отказываешься?',
      stepTwoTitle: 'Срок испытания',
      stepThreeTitle: 'Что ты хочешь получить?',
      name: 'Название',
      namePlaceholder: 'Введите название пакта',
      description: 'Описание',
      descriptionPlaceholder: 'Опишите ваш пакт',
      duration: 'Длительность',
      durationDays: 'дней',
      difficulty: 'Сложность',
      difficultyLevels: {
        easy: 'Легкая',
        medium: 'Средняя',
        hard: 'Сложная'
      },
      create: 'Создать',
      cancel: 'Отмена',
      whatRejecting: 'От чего ты отказываешься?',
      examples: [
        'Сахар', 
        'Телефон после 22:00', 
        'Сигареты', 
        'Прокрастинация', 
        'Социальные сети'
      ],
      trialPeriod: 'Срок испытания',
      customDays: 'Или укажите своё количество дней:',
      days: 'дней',
      whatWant: 'Что ты хочешь получить?',
      notAsking: 'Ты не просишь. Ты настраиваешь реальность.',
      nextButton: 'Далее',
      startPathButton: 'Начать путь',
      placeholders: {
        rejection: 'Например: Сахар, Соцсети, Алкоголь...',
        reward: 'Например: Крепкое здоровье, Ясность мышления, Финансовую стабильность...'
      },
      ascesisWarning: 'Вы должны понимать, что Аскеза — серьёзная практика и отнестись к ней необходимо максимально ответственно. Вы даёте слово Вселенной о выполнении обязательств с Вашей стороны и просите взамен исполнения желания / решения какого-то вопроса. Если Вы дадите не справиться и не сдержите Ваше слово, то Вселенная не будет воспринимать Вас всерьёз и есть риск выпасть из потока...'
    },
    subscription: {
      title: 'АСКЕТ PRO',
      subtitle: 'Разблокируйте полный потенциал',
      bannerTitle: 'Раскройте свой потенциал с ASKET PRO',
      bannerDesc: 'Доступ к медитациям, расширенным практикам и многому другому',
      upgradeNow: 'Улучшить сейчас',
      features: [
        'Доступ ко всем практикам',
        'Персональные рекомендации',
        'Расширенная аналитика',
        'Без рекламы'
      ],
      monthly: 'Ежемесячно',
      yearly: 'Ежегодно',
      lifetime: 'Навсегда',
      subscribe: 'Подписаться',
      price: {
        monthly: '299 ₽/мес',
        yearly: '2 990 ₽/год',
        lifetime: '7 990 ₽'
      },
      current: 'Текущий план',
      upgrade: 'Улучшить',
      manage: 'Управление'
    },
    pactOath: {
      title: 'Моя Аскеза',
      subtitle: 'Я даю обет',
      iPromise: 'Я обещаю отказаться от',
      duration: 'на срок',
      days: 'дней',
      inReturn: 'Взамен я притягиваю в свою жизнь',
      confirmButton: 'Подтверждаю Договор'
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
