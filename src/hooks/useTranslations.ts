
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
      }
    });
  }, [language]);

  return { 
    t,
    getYearWord 
  };
};
