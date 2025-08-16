import { DetailedHoroscope } from '@/types/horoscope';
import { getZodiacSign } from './zodiac';

// Get today's date in the format YYYY-MM-DD
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

// Check if the stored horoscope date is from today
export function isHoroscopeFromToday(storedDate: string): boolean {
  return storedDate === getTodayDateString();
}

// Get default message when horoscope is not available
export function getDefaultMessage(language: string): string {
  const defaultMessages = {
    ru: 'Для получения вашего персонального гороскопа, пожалуйста, укажите дату рождения в профиле.',
    en: 'To receive your personalized horoscope, please set your birth date in your profile.',
    es: 'Para recibir tu horóscopo personalizado, por favor configura tu fecha de nacimiento en tu perfil.',
  };

  return defaultMessages[language] || defaultMessages.en;
}

// Generate fallback horoscope data when the API call fails
export function generateFallbackHoroscope(
  sign: string,
  language: string,
  translations: any
): DetailedHoroscope {
  // Default messages based on language
  const defaultMessages = {
    ru: {
      general:
        'Сегодня день будет наполнен возможностями для личностного роста и самопознания. Влияние планет способствует ясности мышления и принятию взвешенных решений. Внешние обстоятельства будут складываться в вашу пользу, особенно в первой половине дня. Вечером возможен небольшой эмоциональный спад, который легко преодолеть с помощью любимого хобби. Постарайтесь быть открытыми к новому опыту.',
      work: 'Сегодня благоприятный день для профессиональных начинаний. Ваша продуктивность будет высокой, если вы сосредоточитесь на приоритетных задачах. Возможны новые деловые предложения или финансовые поступления, которые положительно повлияют на ваше будущее. Доверяйте своей интуиции в рабочих вопросах. Избегайте конфликтов с коллегами, они могут негативно сказаться на общем настроении.',
      love: 'В личной жизни возможны приятные сюрпризы. Открытое общение поможет укрепить существующие отношения. Если вы одиноки, сегодня подходящий день для новых знакомств. Доверяйте своей интуиции при общении с людьми. Будьте искренни в выражении своих чувств, это важно для поддержания гармонии.',
      health:
        'Уделите внимание своему физическому и эмоциональному здоровью. Небольшая прогулка на свежем воздухе поможет восстановить силы. Сегодня хороший день для начала новой программы упражнений или изменения режима питания. Обратите внимание на качество сна, это важно для вашего самочувствия. Постарайтесь избегать стрессовых ситуаций в течение дня.',
      advice:
        'Слушайте свою интуицию, она укажет верное направление. Не торопитесь с принятием важных решений, но и не откладывайте их на неопределенный срок. Золотая середина поможет вам достичь гармонии. Запишите свои мысли и идеи, они могут пригодиться в будущем. Уделите время саморазвитию, это важная инвестиция в себя.',
    },
    en: {
      general:
        'Today will be filled with opportunities for personal growth and self-knowledge. Planetary influences contribute to clarity of thinking and making balanced decisions. External circumstances will work in your favor, especially in the first half of the day. In the evening, you may experience a slight emotional decline, which can be easily overcome with a favorite hobby. Try to be open to new experiences.',
      work: 'Today is a favorable day for professional endeavors. Your productivity will be high if you focus on priority tasks. New business offers or financial inflows may positively impact your future. Trust your intuition in work matters. Avoid conflicts with colleagues, they can negatively affect the overall mood.',
      love: 'In your personal life, pleasant surprises are possible. Open communication will help strengthen existing relationships. If you are single, today is a suitable day for new acquaintances. Trust your intuition when interacting with people. Be sincere in expressing your feelings, this is important for maintaining harmony.',
      health:
        'Pay attention to your physical and emotional health. A short walk in fresh air will help restore your energy. Today is a good day to start a new exercise program or change your diet. Pay attention to sleep quality, this is important for your well-being. Try to avoid stressful situations during the day.',
      advice:
        "Listen to your intuition, it will point you in the right direction. Don't rush important decisions, but don't postpone them indefinitely either. The golden middle will help you achieve harmony. Write down your thoughts and ideas, they may be useful in the future. Take time for self-development, it's an important investment in yourself.",
    },
    es: {
      general:
        'Hoy estará lleno de oportunidades para el crecimiento personal y el autoconocimiento. Las influencias planetarias contribuyen a la claridad de pensamiento y a tomar decisiones equilibradas. Las circunstancias externas trabajarán a tu favor, especialmente en la primera mitad del día. Por la noche, puedes experimentar un ligero declive emocional, que se puede superar fácilmente con un pasatiempo favorito. Trata de estar abierto a nuevas experiencias.',
      work: 'Hoy es un día favorable para los esfuerzos profesionales. Tu productividad será alta si te concentras en tareas prioritarias. Nuevas ofertas comerciales o entradas financieras pueden impactar positivamente tu futuro. Confía en tu intuición en asuntos laborales. Evita conflictos con colegas, pueden afectar negativamente el estado de ánimo general.',
      love: 'En tu vida personal, son posibles sorpresas agradables. La comunicación abierta ayudará a fortalecer las relaciones existentes. Si estás soltero, hoy es un día adecuado para nuevos conocidos. Confía en tu intuición al interactuar con personas. Sé sincero al expresar tus sentimientos, esto es importante para mantener la armonía.',
      health:
        'Presta atención a tu salud física y emocional. Un breve paseo al aire libre te ayudará a restaurar tu energía. Hoy es un buen día para comenzar un nuevo programa de ejercicios o cambiar tu dieta. Presta atención a la calidad del sueño, esto es importante para tu bienestar. Trata de evitar situaciones estresantes durante el día.',
      advice:
        'Escucha tu intuición, te señalará la dirección correcta. No apresures decisiones importantes, pero tampoco las pospongas indefinidamente. El punto medio dorado te ayudará a lograr la armonía. Anota tus pensamientos e ideas, pueden ser útiles en el futuro. Tómate tiempo para el autodesarrollo, es una inversión importante en ti mismo.',
    },
  };

  // Get the messages for the current language
  const messages = defaultMessages[language] || defaultMessages.en;

  return {
    description: `${messages.general}\n\n${messages.work}\n\n${messages.love}\n\n${messages.health}\n\n${messages.advice}`,
    sections: {
      general_atmosphere: messages.general,
      work_finance: messages.work,
      love_relationships: messages.love,
      health_wellbeing: messages.health,
      daily_advice: messages.advice,
    },
  };
}

// Get translations for horoscope components
export function getHoroscopeTranslations(
  language: string,
  userName?: string
): any {
  return {
    title: {
      ru: 'Ваш персональный гороскоп',
      en: 'Your Personal Horoscope',
      es: 'Tu Horóscopo Personal',
    },
    backButton: {
      ru: 'Назад',
      en: 'Back',
      es: 'Atrás',
    },
    loading: {
      ru: 'Соединение со звездами...',
      en: 'Connecting with the stars...',
      es: 'Conectando con las estrellas...',
    },
    luckyNumber: {
      ru: 'Счастливое число',
      en: 'Lucky Number',
      es: 'Número de la Suerte',
    },
    luckyTime: {
      ru: 'Счастливое время',
      en: 'Lucky Time',
      es: 'Hora de la Suerte',
    },
    color: {
      ru: 'Цвет дня',
      en: 'Color',
      es: 'Color',
    },
    mood: {
      ru: 'Настроение',
      en: 'Mood',
      es: 'Estado de Ánimo',
    },
    workFinance: {
      ru: 'Работа и финансы',
      en: 'Work & Finance',
      es: 'Trabajo y Finanzas',
    },
    loveRelationships: {
      ru: 'Любовь и отношения',
      en: 'Love & Relationships',
      es: 'Amor y Relaciones',
    },
    healthWellbeing: {
      ru: 'Здоровье и самочувствие',
      en: 'Health & Wellbeing',
      es: 'Salud y Bienestar',
    },
    dailyAdvice: {
      ru: 'Совет дня',
      en: 'Daily Advice',
      es: 'Consejo del Día',
    },
    proTitle: {
      ru: 'Подробный гороскоп',
      en: 'Detailed Horoscope',
      es: 'Horóscopo Detallado',
    },
    proMessage: {
      ru: 'Получите PRO-аккаунт для доступа к расширенному гороскопу с детальным анализом.',
      en: 'Get PRO account for access to extended horoscope with detailed analysis.',
      es: 'Obtenga una cuenta PRO para acceder a un horóscopo ampliado con análisis detallado.',
    },
    generateButton: {
      ru: 'Что меня ждет сегодня?',
      en: 'What awaits me today?',
      es: '¿Qué me espera hoy?',
    },
    universeThinking: {
      ru: 'Вселенная думает...',
      en: 'The universe is thinking...',
      es: 'El universo está pensando...',
    },
    findOutToday: {
      ru: 'Узнайте, что вас ждет сегодня!',
      en: 'Find out what awaits you today!',
      es: '¡Descubre qué te espera hoy!',
    },
  };
}
