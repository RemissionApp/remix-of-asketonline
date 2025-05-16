
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
    es: 'Para recibir tu horóscopo personalizado, por favor configura tu fecha de nacimiento en tu perfil.'
  };
  
  return defaultMessages[language] || defaultMessages.en;
}

// Generate fallback horoscope data when the API call fails
export function generateFallbackHoroscope(sign: string, language: string, translations: any): DetailedHoroscope {
  // Default messages based on language
  const defaultMessages = {
    ru: {
      work: '💼 Сегодня благоприятный день для профессиональных начинаний. Ваша продуктивность будет высокой, если вы сосредоточитесь на приоритетных задачах.',
      love: '❤️ В личной жизни возможны приятные сюрпризы. Открытое общение поможет укрепить существующие отношения.',
      health: '🌿 Уделите внимание своему физическому и эмоциональному здоровью. Небольшая прогулка на свежем воздухе поможет восстановить силы.',
      advice: '✨ Совет дня: слушайте свою интуицию, она укажет верное направление.'
    },
    en: {
      work: '💼 Today is a favorable day for professional endeavors. Your productivity will be high if you focus on priority tasks.',
      love: '❤️ In your personal life, pleasant surprises are possible. Open communication will help strengthen existing relationships.',
      health: '🌿 Pay attention to your physical and emotional health. A short walk in fresh air will help restore your energy.',
      advice: '✨ Daily advice: listen to your intuition, it will point you in the right direction.'
    },
    es: {
      work: '💼 Hoy es un día favorable para los esfuerzos profesionales. Tu productividad será alta si te concentras en tareas prioritarias.',
      love: '❤️ En tu vida personal, son posibles sorpresas agradables. La comunicación abierta ayudará a fortalecer las relaciones existentes.',
      health: '🌿 Presta atención a tu salud física y emocional. Un breve paseo al aire libre te ayudará a restaurar tu energía.',
      advice: '✨ Consejo del día: escucha tu intuición, te señalará la dirección correcta.'
    }
  };

  // Get the messages for the current language
  const messages = defaultMessages[language] || defaultMessages.en;

  return {
    description: `${messages.work}\n\n${messages.love}\n\n${messages.health}\n\n${messages.advice}`,
    sections: {
      work_finance: messages.work,
      love_relationships: messages.love,
      health_wellbeing: messages.health,
      daily_advice: messages.advice
    },
    lucky_number: Math.floor(Math.random() * 100).toString(),
    lucky_time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    color: language === 'ru' ? 'синий' : language === 'es' ? 'azul' : 'blue',
    mood: language === 'ru' ? 'спокойный' : language === 'es' ? 'tranquilo' : 'peaceful'
  };
}

// Get translations for horoscope components
export function getHoroscopeTranslations(language: string, userName?: string): any {
  return {
    title: {
      ru: 'Ваш персональный гороскоп',
      en: 'Your Personal Horoscope',
      es: 'Tu Horóscopo Personal'
    },
    backButton: {
      ru: 'Назад',
      en: 'Back',
      es: 'Atrás'
    },
    loading: {
      ru: 'Соединение со звездами...',
      en: 'Connecting with the stars...',
      es: 'Conectando con las estrellas...'
    },
    luckyNumber: {
      ru: 'Счастливое число',
      en: 'Lucky Number',
      es: 'Número de la Suerte'
    },
    luckyTime: {
      ru: 'Счастливое время',
      en: 'Lucky Time',
      es: 'Hora de la Suerte'
    },
    color: {
      ru: 'Цвет дня',
      en: 'Color',
      es: 'Color'
    },
    mood: {
      ru: 'Настроение',
      en: 'Mood',
      es: 'Estado de Ánimo'
    },
    workFinance: {
      ru: 'Работа и финансы',
      en: 'Work & Finance',
      es: 'Trabajo y Finanzas'
    },
    loveRelationships: {
      ru: 'Любовь и отношения',
      en: 'Love & Relationships',
      es: 'Amor y Relaciones'
    },
    healthWellbeing: {
      ru: 'Здоровье и самочувствие',
      en: 'Health & Wellbeing',
      es: 'Salud y Bienestar'
    },
    dailyAdvice: {
      ru: 'Совет дня',
      en: 'Daily Advice',
      es: 'Consejo del Día'
    },
    proTitle: {
      ru: 'Подробный гороскоп',
      en: 'Detailed Horoscope',
      es: 'Horóscopo Detallado'
    },
    proMessage: {
      ru: 'Получите PRO-аккаунт для доступа к расширенному гороскопу с детальным анализом.',
      en: 'Get PRO account for access to extended horoscope with detailed analysis.',
      es: 'Obtenga una cuenta PRO para acceder a un horóscopo ampliado con análisis detallado.'
    },
    generateButton: {
      ru: 'Что меня ждет сегодня?',
      en: 'What awaits me today?',
      es: '¿Qué me espera hoy?'
    },
    universeThinking: {
      ru: 'Вселенная думает...',
      en: 'The universe is thinking...',
      es: 'El universo está pensando...'
    },
    findOutToday: {
      ru: 'Узнайте, что вас ждет сегодня!',
      en: 'Find out what awaits you today!',
      es: '¡Descubre qué te espera hoy!'
    }
  };
}
