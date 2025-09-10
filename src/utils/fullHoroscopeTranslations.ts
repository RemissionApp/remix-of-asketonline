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
    };
  }
};
