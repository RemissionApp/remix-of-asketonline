
import { useState, useEffect } from 'react';
import { translations, namespacedTranslations, SupportedLanguage } from '@/i18n/translations';
import { useAppStore } from '@/store/useAppStore';

// Helper function for pluralization in Russian
export const getYearWord = (age: number): string => {
  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;
  
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return 'год';
  } else if (
    [2, 3, 4].includes(lastDigit) && 
    ![12, 13, 14].includes(lastTwoDigits)
  ) {
    return 'года';
  } else {
    return 'лет';
  }
};

// Re-export the type correctly
export type { SupportedLanguage };

export const useTranslations = () => {
  const { language } = useAppStore();
  const [t, setT] = useState({
    ...translations[language],
    main: {
      path: language === 'ru' ? 'Путь' :
            language === 'es' ? 'Camino' : 'Path',
      ascesis: language === 'ru' ? 'Аскеза' :
              language === 'es' ? 'Ascesis' : 'Ascesis',
      universe: language === 'ru' ? 'Вселенная' :
                language === 'es' ? 'Universo' : 'Universe',
      profile: language === 'ru' ? 'Профиль' :
               language === 'es' ? 'Perfil' : 'Profile',
      days: language === 'ru' ? 'дней' :
            language === 'es' ? 'días' : 'days',
      todayCompleted: language === 'ru' ? 'Завершить день' :
                      language === 'es' ? 'Completar hoy' : 'Complete today',
      askUniverse: language === 'ru' ? 'Спросить Вселенную' :
                   language === 'es' ? 'Preguntar al Universo' : 'Ask Universe',
      noPacts: language === 'ru' ? 'Нет активных пактов. Создайте один, чтобы начать свое путешествие!' :
               language === 'es' ? '¡No hay pactos activos. Crea uno para comenzar tu viaje!' : 
               'No active pacts. Create one to start your journey!'
    },
    universe: namespacedTranslations.universe[language],
    profile: {
      title: language === 'ru' ? 'Профиль' :
             language === 'es' ? 'Perfil' : 'Profile'
    },
    zodiac: {
      yourZodiacSign: language === 'ru' ? 'Ваш знак зодиака' : 
                      language === 'es' ? 'Tu signo zodiacal' : 
                      'Your zodiac sign',
      element: language === 'ru' ? 'Стихия' :
              language === 'es' ? 'Elemento' : 
              'Element',
      ruler: language === 'ru' ? 'Управитель' :
            language === 'es' ? 'Regente' : 
            'Ruler',
      traits: language === 'ru' ? 'Характеристики' :
             language === 'es' ? 'Rasgos' : 
             'Traits',
      editBirthDate: language === 'ru' ? 'Изменить дату рождения' :
                    language === 'es' ? 'Editar fecha de nacimiento' :
                    'Edit birth date',
      saveBirthDate: language === 'ru' ? 'Сохранить' :
                    language === 'es' ? 'Guardar' :
                    'Save',
      cancelBirthDate: language === 'ru' ? 'Отмена' :
                      language === 'es' ? 'Cancelar' :
                      'Cancel'
    },
    // Add namespaced translations
    calendar: namespacedTranslations.calendar[language],
    meditation: namespacedTranslations.meditation[language],
    pactOath: namespacedTranslations.pactOath[language],
    subscription: namespacedTranslations.subscription[language],
    userProfile: namespacedTranslations.userProfile[language],
    createPact: namespacedTranslations.createPact[language]
  });

  useEffect(() => {
    setT({
      ...translations[language],
      main: {
        path: language === 'ru' ? 'Путь' :
              language === 'es' ? 'Camino' : 'Path',
        ascesis: language === 'ru' ? 'Аскеза' :
                language === 'es' ? 'Ascesis' : 'Ascesis',
        universe: language === 'ru' ? 'Вселенная' :
                  language === 'es' ? 'Universo' : 'Universe',
        profile: language === 'ru' ? 'Профиль' :
                 language === 'es' ? 'Perfil' : 'Profile',
        days: language === 'ru' ? 'дней' :
              language === 'es' ? 'días' : 'days',
        todayCompleted: language === 'ru' ? 'Завершить день' :
                        language === 'es' ? 'Completar hoy' : 'Complete today',
        askUniverse: language === 'ru' ? 'Спросить Вселенную' :
                     language === 'es' ? 'Preguntar al Universo' : 'Ask Universe',
        noPacts: language === 'ru' ? 'Нет активных пактов. Создайте один, чтобы начать свое путешествие!' :
                 language === 'es' ? '¡No hay pactos activos. Crea uno para comenzar tu viaje!' : 
                 'No active pacts. Create one to start your journey!'
      },
      universe: namespacedTranslations.universe[language],
      profile: {
        title: language === 'ru' ? 'Профиль' :
               language === 'es' ? 'Perfil' : 'Profile'
      },
      zodiac: {
        yourZodiacSign: language === 'ru' ? 'Ваш знак зодиака' : 
                        language === 'es' ? 'Tu signo zodiacal' : 
                        'Your zodiac sign',
        element: language === 'ru' ? 'Стихия' :
                language === 'es' ? 'Elemento' : 
                'Element',
        ruler: language === 'ru' ? 'Управитель' :
              language === 'es' ? 'Regente' : 
              'Ruler',
        traits: language === 'ru' ? 'Характеристики' :
               language === 'es' ? 'Rasgos' : 
               'Traits',
        editBirthDate: language === 'ru' ? 'Изменить дату рождения' :
                      language === 'es' ? 'Editar fecha de nacimiento' :
                      'Edit birth date',
        saveBirthDate: language === 'ru' ? 'Сохранить' :
                      language === 'es' ? 'Guardar' :
                      'Save',
        cancelBirthDate: language === 'ru' ? 'Отмена' :
                        language === 'es' ? 'Cancelar' :
                        'Cancel'
      },
      // Update namespaced translations in useEffect
      calendar: namespacedTranslations.calendar[language],
      meditation: namespacedTranslations.meditation[language],
      pactOath: namespacedTranslations.pactOath[language],
      subscription: namespacedTranslations.subscription[language],
      userProfile: namespacedTranslations.userProfile[language],
      createPact: namespacedTranslations.createPact[language]
    });
  }, [language]);

  return { 
    t,
    getYearWord 
  };
};
