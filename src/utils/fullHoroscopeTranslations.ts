// Translations for Full Horoscope Page
export const getFullHoroscopeUIText = (
  language: string,
  currentYear: number
) => {
  if (language === 'ru') {
    return {
      pageTitle: `Полный анализ на ${currentYear} год`,
      backButton: 'Назад',
      setBirthDateTitle: 'Укажите дату рождения',
      setBirthDateDescription:
        'Чтобы сгенерировать полный анализ гороскопа, пожалуйста, добавьте дату рождения в вашем профиле.',
      goToProfileButton: 'Перейти в профиль',
      errorTitle: 'Ошибка',
      tryAgainButton: 'Попробовать снова',
      generateDescription:
        'Сгенерируйте ваш полный космический профиль с анализом вашей личности, отношений, карьерного пути и многого другого, основанный на вашем знаке зодиака.',
      generateButton: `Сгенерировать полный гороскоп на ${currentYear}г`,
      loadingTitle:
        'Консультация со звездами и планетами для вашего полного космического профиля...',
      loadingDescription:
        'Это может занять некоторое время, пока мы анализируем ваши космические закономерности',
      regenerateButton: 'Пересоздать гороскоп',
      // User zodiac info
      personalizedReading: 'Персональный космический анализ',
      // Daily horoscope
      dailyTitle: 'Гороскоп на сегодня',
      dailyDescription: 'Краткий прогноз на текущий день',
      generateDailyButton: 'Получить гороскоп на сегодня',
      loadingDaily: 'Консультация со звездами для вашего дня...',
      // Monthly horoscope
      monthlyTitle: 'Гороскоп на месяц',
      monthlyDescription: 'Детальный прогноз на текущий месяц',
      generateMonthlyButton: 'Получить гороскоп на месяц',
      loadingMonthly: 'Анализ планетарных влияний на месяц...',
      generalForecast: 'Общий прогноз',
      careerFinance: 'Карьера и финансы',
      loveRelationships: 'Любовь и отношения',
      healthWellbeing: 'Здоровье и благополучие',
      // Yearly horoscope
      yearlyTitle: 'Полный гороскоп на',
      yearlyDescription: 'Подробный анализ всех сфер жизни на весь год',
    };
  } else if (language === 'es') {
    return {
      pageTitle: `Análisis completo para el año ${currentYear}`,
      backButton: 'Atrás',
      setBirthDateTitle: 'Establece tu fecha de nacimiento',
      setBirthDateDescription:
        'Para generar tu análisis completo del horóscopo, por favor agrega tu fecha de nacimiento en tu perfil.',
      goToProfileButton: 'Ir al perfil',
      errorTitle: 'Error',
      tryAgainButton: 'Intentar de nuevo',
      generateDescription:
        'Genera tu perfil cósmico completo con información sobre tu personalidad, relaciones, trayectoria profesional y más basado en tu signo zodiacal.',
      generateButton: `Generar horóscopo completo para ${currentYear}`,
      loadingTitle:
        'Consultando a las estrellas y planetas para tu perfil cósmico completo...',
      loadingDescription:
        'Esto puede tardar un momento mientras analizamos tus patrones celestiales',
      regenerateButton: 'Regenerar horóscopo',
      // User zodiac info
      personalizedReading: 'Lectura cósmica personalizada',
      // Daily horoscope
      dailyTitle: 'Horóscopo de hoy',
      dailyDescription: 'Predicción breve para el día actual',
      generateDailyButton: 'Obtener horóscopo de hoy',
      loadingDaily: 'Consultando las estrellas para tu día...',
      // Monthly horoscope
      monthlyTitle: 'Horóscopo del mes',
      monthlyDescription: 'Predicción detallada para el mes actual',
      generateMonthlyButton: 'Obtener horóscopo del mes',
      loadingMonthly: 'Analizando influencias planetarias del mes...',
      generalForecast: 'Pronóstico General',
      careerFinance: 'Carrera y Finanzas',
      loveRelationships: 'Amor y Relaciones',
      healthWellbeing: 'Salud y Bienestar',
      // Yearly horoscope
      yearlyTitle: 'Horóscopo completo para',
      yearlyDescription: 'Análisis detallado de todas las áreas de la vida para todo el año',
    };
  } else {
    return {
      pageTitle: `Full Analysis for ${currentYear}`,
      backButton: 'Back',
      setBirthDateTitle: 'Set Your Birth Date',
      setBirthDateDescription:
        'To generate your full horoscope analysis, please add your birth date in your profile.',
      goToProfileButton: 'Go to Profile',
      errorTitle: 'Error',
      tryAgainButton: 'Try Again',
      generateDescription:
        'Generate your complete cosmic profile with insights into your personality, relationships, career path, and more based on your zodiac sign.',
      generateButton: `Generate Full Horoscope for ${currentYear}`,
      loadingTitle:
        'Consulting the stars and planets for your complete cosmic profile...',
      loadingDescription:
        'This may take a moment as we analyze your celestial patterns',
      regenerateButton: 'Regenerate Horoscope',
      // User zodiac info
      personalizedReading: 'Personalized cosmic reading',
      // Daily horoscope
      dailyTitle: 'Today\'s Horoscope',
      dailyDescription: 'Brief forecast for the current day',
      generateDailyButton: 'Get Today\'s Horoscope',
      loadingDaily: 'Consulting the stars for your day...',
      // Monthly horoscope
      monthlyTitle: 'Monthly Horoscope',
      monthlyDescription: 'Detailed forecast for the current month',
      generateMonthlyButton: 'Get Monthly Horoscope',
      loadingMonthly: 'Analyzing planetary influences for the month...',
      generalForecast: 'General Forecast',
      careerFinance: 'Career and Finance',
      loveRelationships: 'Love and Relationships',
      healthWellbeing: 'Health and Wellbeing',
      // Yearly horoscope
      yearlyTitle: 'Full Horoscope for',
      yearlyDescription: 'Detailed analysis of all life areas for the entire year',
    };
  }
};
