
// Utility functions for horoscope operations

// Create a helper function to get today's date as a string
export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

// Check if the horoscope is from today
export const isHoroscopeFromToday = (storedDate: string) => {
  return storedDate === getTodayDateString();
};

// Generate horoscope translations based on language and user name
export const getHoroscopeTranslations = (language: string, userName?: string) => {
  const name = userName || 'Seeker';

  return {
    title: {
      ru: `${name}, это твой день!`,
      en: `${name}, this is your day!`,
      es: `${name}, ¡este es tu día!`
    },
    backButton: {
      ru: 'Назад',
      en: 'Back',
      es: 'Atrás'
    },
    loading: {
      ru: 'Раскрываем тайны звезд...',
      en: 'Revealing the mysteries of the stars...',
      es: 'Revelando los misterios de las estrellas...'
    },
    luckyNumber: {
      ru: 'Счастливое число',
      en: 'Lucky Number',
      es: 'Número de la Suerte'
    },
    luckyTime: {
      ru: 'Удачное время',
      en: 'Lucky Time',
      es: 'Hora de la Suerte'
    },
    color: {
      ru: 'Цвет дня',
      en: 'Color of the Day',
      es: 'Color del Día'
    },
    mood: {
      ru: 'Настроение',
      en: 'Mood',
      es: 'Estado de Ánimo'
    },
    workFinance: {
      ru: 'Работа и финансы',
      en: 'Work and Finance',
      es: 'Trabajo y Finanzas'
    },
    loveRelationships: {
      ru: 'Любовь и отношения',
      en: 'Love and Relationships',
      es: 'Amor y Relaciones'
    },
    healthWellbeing: {
      ru: 'Здоровье и самочувствие', 
      en: 'Health and Wellbeing',
      es: 'Salud y Bienestar'
    },
    dailyAdvice: {
      ru: 'Совет дня',
      en: 'Daily Advice',
      es: 'Consejo del Día'
    },
    proTitle: {
      ru: `${name}, это твой день!`,
      en: `${name}, this is your day!`,
      es: `${name}, ¡este es tu día!`
    },
    proMessage: {
      ru: 'Узнайте, что звезды приготовили для вас сегодня в полной версии',
      en: 'Discover what the stars have prepared for you today in the full version',
      es: 'Descubre lo que las estrellas han preparado para ti hoy en la versión completa'
    }
  };
};

// Generate fallback horoscope data
export const generateFallbackHoroscope = (zodiacSign: string | null, language: string, translations: any) => {
  const generateHoroscopeText = (sign: string, lang: string): string => {
    const texts = {
      ru: {
        aries: 'Сегодня ваша энергия и решительность на пике. Используйте этот день для важных начинаний и активных действий. Доверьтесь своей интуиции в принятии решений. В личных отношениях проявите больше терпения и понимания. Финансовые вложения сегодня могут оказаться особенно удачными. Вечер лучше провести в спокойной обстановке, восстанавливая силы.',
        taurus: 'День благоприятен для материальных вопросов. Ваша практичность поможет решить финансовые проблемы. В работе возможны новые интересные предложения. Уделите внимание здоровью и правильному питанию. В личной жизни наступает период гармонии и понимания. Вечер хорош для общения с близкими людьми и создания уютной атмосферы.',
        gemini: 'Сегодня вам стоит сосредоточиться на общении и новых знакомствах. Возможно получение важной информации, которая изменит ваши планы. В работе проявите гибкость и адаптивность. Финансовое положение стабильно, но крупные траты лучше отложить. В личной жизни возможны приятные сюрпризы. Вечер подходит для интеллектуальных развлечений.',
        cancer: 'День подходит для домашних дел и заботы о близких. Ваша эмоциональная интуиция сейчас особенно сильна. В работе возможны небольшие трудности, но вы справитесь с ними с помощью коллег. Финансовое положение требует внимания и планирования. В личных отношениях проявите больше открытости. Вечер хорош для семейного ужина.',
        leo: 'Сегодня ваша харизма и лидерские качества особенно заметны. Используйте это для продвижения своих идей. В работе возможно признание ваших заслуг. Финансовое положение улучшается. В личной жизни вас ждут яркие эмоции и приятные моменты. Вечер подходит для творческой самореализации и развлечений.',
        virgo: 'День благоприятен для анализа и планирования. Ваше внимание к деталям поможет избежать ошибок. В работе сосредоточьтесь на завершении начатых проектов. Финансовое положение стабильно, но требует внимательного учета. В личной жизни возможны небольшие недопонимания. Вечер подходит для самообразования и чтения.',
        libra: 'Сегодня вам особенно важно поддерживать баланс во всех сферах жизни. В работе возможны интересные партнерские предложения. Финансовое положение улучшается благодаря вашей дипломатии. В личной жизни гармония и взаимопонимание. Вечер хорош для культурных м��роприятий и общения с друзьями.',
        scorpio: 'День наполнен глубокими эмоциями и интуитивными озарениями. В работе вы можете раскрыть тайны или найти скрытые возможности. Финансовое положение требует осторожности в инвестициях. В личной жизни возможны страстные проявления чувств. Вечер подходит для медитации и самопознания.',
        sagittarius: 'Сегодня ваш оптимизм и энтузиазм заразительны. Используйте это для расширения своих горизонтов. В работе возможны новые перспективы и путешествия. Финансовое положение стабильно, но требует планирования. В личной жизни приключения и новые впечатления. Вечер хорош для философских бесед и планирования будущего.',
        capricorn: 'День благоприятен для карьерных достижений и профессионального роста. Ваша дисциплина и ответственность приносят плоды. Финансовое положение улучшается благодаря правильным решениям. В личной жизни стабильность и поддержка. Вечер подходит для планирования долгосрочных целей.',
        aquarius: 'Сегодня ваша оригинальность и нестандартное мышление особенно ценны. В работе возможны инновационные решения и неожиданные повороты. Финансовое положение связано с коллективными проектами. В личной жизни стремление к свободе и независимости. Вечер хорош для общения с единомышленниками и планирования будущего.',
        pisces: 'День наполнен творческим вдохновением и эмпатией. В работе используйте свою интуицию для решения сложных задач. Финансовое положение нестабильно, требует внимания. В личной жизни глубокая эмоциональная связь с близкими. Вечер подходит для искусства, музыки и духовных практик.'
      },
      en: { /* ... keep existing code (English translations) */ },
      es: { /* ... keep existing code (Spanish translations) */ }
    };

    const baseText = sign && lang in texts && sign in texts[lang] 
        ? texts[lang][sign]
        : 'Звезды сегодня особенно благосклонны к вам. Воспользуйтесь этой энергией для достижения своих целей и мечтаний.';
    
    return baseText;
  };

  const baseText = generateHoroscopeText(zodiacSign || 'aries', language);
  
  return {
    description: baseText,
    sections: {
      work_finance: `💼 ${translations.workFinance[language] || translations.workFinance.en}: Сегодня благоприятный день для профессиональных начинаний. Доверяйте своей интуиции в финансовых вопросах.`,
      love_relationships: `❤️ ${translations.loveRelationships[language] || translations.loveRelationships.en}: Проявите больше внимания к партнеру. Одиноким звезды сулят интересное знакомство.`,
      health_wellbeing: `🌿 ${translations.healthWellbeing[language] || translations.healthWellbeing.en}: Уделите время своему физическому и эмоциональному благополучию. Прогулка на природе принесет вдохновение.`,
      daily_advice: `✨ ${translations.dailyAdvice[language] || translations.dailyAdvice.en}: Доверьтесь потоку. То, что кажется препятствием, может оказаться дверью к новым возможностям.`,
    },
    lucky_number: Math.floor(Math.random() * 100).toString(),
    lucky_time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    color: ['красный', 'синий', 'зеленый', 'фиолетовый', 'оранжевый', 'розовый', 'золотой'][Math.floor(Math.random() * 7)],
    mood: ['радостный', 'задумчивый', 'спокойный', 'энергичный', 'вдохновленный'][Math.floor(Math.random() * 5)]
  };
};
