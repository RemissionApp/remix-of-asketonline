
import { Translations } from '../types/translationTypes';

export const ruTranslations: Translations = {
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
    title: "Добро пожаловать в Asket",
    description: "Ваш проводник к осознанной жизни через духовные практики и аскезу",
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
      features: "Бесплатные функции",
      proFeatures: "Премиум функции",
      complete: "Готово",
      length: 3,
      map: []
    },
    freeFeatures: [
      "Создание и отслеживание духовных практик и аскез",
      "Ежедневные упражнения медитации",
      "Базовые гороскопы",
      "Задать один вопрос Вселенной",
      "Отслеживание духовного прогресса"
    ],
    proFeatures: [
      "Неограниченные беседы со Вселенной",
      "Полный нумерологический анализ",
      "Расширенные астрологические чтения",
      "Премиум-контент для медитации",
      "Продвинутая аналитика духовного прогресса"
    ],
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
  },
  zodiac: {
    yourZodiacSign: "Ваш знак зодиака",
    element: "Стихия",
    ruler: "Управитель",
    traits: "Характеристики",
    editBirthDate: "Изменить дату рождения",
    saveBirthDate: "Сохранить",
    cancelBirthDate: "Отмена"
  },
  numerology: {
    title: "Нумерология",
    description: "Узнайте свой нумерологический профиль и получите глубокое понимание своей личности",
    learnMore: "Подробнее",
    proTitle: "Нумерологический анализ",
    proMessage: "Разблокируй PRO чтобы получить полный нумерологический разбор"
  }
};
