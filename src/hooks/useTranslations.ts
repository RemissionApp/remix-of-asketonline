
import { useState, useEffect } from 'react';
import { translations, SupportedLanguage } from '@/i18n/translations';
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
    universe: {
      title: language === 'ru' ? 'Диалог со Вселенной' :
             language === 'es' ? 'Diálogo con el Universo' :
             'Dialog with the Universe',
      description: language === 'ru' ? 'Задавай любые вопросы и получай мудрые ответы напрямую от Вселенной' :
                   language === 'es' ? 'Haz cualquier pregunta y recibe respuestas sabias directamente del Universo' :
                   'Ask any questions and get wise answers directly from the Universe',
      askButton: language === 'ru' ? 'Войти в чат' :
                language === 'es' ? 'Entrar al chat' :
                'Enter chat',
      proMessage: language === 'ru' ? 'Разблокируй PRO чтобы вести диалог со Вселенной' :
                 language === 'es' ? 'Desbloquea PRO para dialogar con el Universo' :
                 'Unlock PRO to have a dialog with the Universe',
      proTitle: language === 'ru' ? 'Диалог со Вселенной' :
               language === 'es' ? 'Diálogo con el Universo' :
               'Dialog with the Universe',
      learnMore: language === 'ru' ? 'Подробнее' :
                language === 'es' ? 'Más información' :
                'Learn more'
    }
  });

  useEffect(() => {
    setT({
      ...translations[language],
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
      universe: {
        title: language === 'ru' ? 'Диалог со Вселенной' :
               language === 'es' ? 'Diálogo con el Universo' :
               'Dialog with the Universe',
        description: language === 'ru' ? 'Задавай любые вопросы и получай мудрые ответы напрямую от Вселенной' :
                     language === 'es' ? 'Haz cualquier pregunta y recibe respuestas sabias directamente del Universo' :
                     'Ask any questions and get wise answers directly from the Universe',
        askButton: language === 'ru' ? 'Войти в чат' :
                  language === 'es' ? 'Entrar al chat' :
                  'Enter chat',
        proMessage: language === 'ru' ? 'Разблокируй PRO чтобы вести диалог со Вселенной' :
                   language === 'es' ? 'Desbloquea PRO para dialogar con el Universo' :
                   'Unlock PRO to have a dialog with the Universe',
        proTitle: language === 'ru' ? 'Диалог со Вселенной' :
                 language === 'es' ? 'Diálogo con el Universo' :
                 'Dialog with the Universe',
        learnMore: language === 'ru' ? 'Подробнее' :
                  language === 'es' ? 'Más información' :
                  'Learn more'
      }
    });
  }, [language]);

  return { 
    t,
    getYearWord 
  };
};
