
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
                      'Cancel',
      // Add translations for zodiac elements
      elementFire: language === 'ru' ? 'Огонь' :
                  language === 'es' ? 'Fuego' :
                  'Fire',
      elementEarth: language === 'ru' ? 'Земля' :
                   language === 'es' ? 'Tierra' :
                   'Earth',
      elementAir: language === 'ru' ? 'Воздух' :
                 language === 'es' ? 'Aire' :
                 'Air',
      elementWater: language === 'ru' ? 'Вода' :
                   language === 'es' ? 'Agua' :
                   'Water',
      // Add translations for zodiac traits
      traitCourageous: language === 'ru' ? 'Смелый' :
                       language === 'es' ? 'Valiente' :
                       'Courageous',
      traitDetermined: language === 'ru' ? 'Решительный' :
                      language === 'es' ? 'Determinado' :
                      'Determined',
      traitPassionate: language === 'ru' ? 'Страстный' :
                      language === 'es' ? 'Apasionado' :
                      'Passionate',
      traitConfident: language === 'ru' ? 'Уверенный' :
                     language === 'es' ? 'Seguro' :
                     'Confident',
      traitReliable: language === 'ru' ? 'Надежный' :
                    language === 'es' ? 'Confiable' :
                    'Reliable',
      traitPatient: language === 'ru' ? 'Терпеливый' :
                   language === 'es' ? 'Paciente' :
                   'Patient',
      traitPractical: language === 'ru' ? 'Практичный' :
                     language === 'es' ? 'Práctico' :
                     'Practical',
      traitDevoted: language === 'ru' ? 'Преданный' :
                   language === 'es' ? 'Leal' :
                   'Devoted',
      traitAdaptable: language === 'ru' ? 'Адаптивный' :
                     language === 'es' ? 'Adaptable' :
                     'Adaptable',
      traitOutgoing: language === 'ru' ? 'Общительный' :
                    language === 'es' ? 'Extrovertido' :
                    'Outgoing',
      traitCurious: language === 'ru' ? 'Любопытный' :
                   language === 'es' ? 'Curioso' :
                   'Curious',
      traitIntelligent: language === 'ru' ? 'Умный' :
                       language === 'es' ? 'Inteligente' :
                       'Intelligent',
      traitEmpathetic: language === 'ru' ? 'Сопереживающий' :
                      language === 'es' ? 'Empático' :
                      'Empathetic',
      traitNurturing: language === 'ru' ? 'Заботливый' :
                     language === 'es' ? 'Cuidadoso' :
                     'Nurturing',
      traitIntuitive: language === 'ru' ? 'Интуитивный' :
                     language === 'es' ? 'Intuitivo' :
                     'Intuitive',
      traitProtective: language === 'ru' ? 'Защищающий' :
                      language === 'es' ? 'Protector' :
                      'Protective',
      traitCreative: language === 'ru' ? 'Творческий' :
                    language === 'es' ? 'Creativo' :
                    'Creative',
      traitGenerous: language === 'ru' ? 'Щедрый' :
                    language === 'es' ? 'Generoso' :
                    'Generous',
      traitCharismatic: language === 'ru' ? 'Харизматичный' :
                       language === 'es' ? 'Carismático' :
                       'Charismatic',
      traitAnalytical: language === 'ru' ? 'Аналитический' :
                      language === 'es' ? 'Analítico' :
                      'Analytical',
      traitDiligent: language === 'ru' ? 'Усердный' :
                    language === 'es' ? 'Diligente' :
                    'Diligent',
      traitDetailOriented: language === 'ru' ? 'Внимательный к деталям' :
                          language === 'es' ? 'Detallista' :
                          'Detail-oriented',
      traitDiplomatic: language === 'ru' ? 'Дипломатичный' :
                      language === 'es' ? 'Diplomático' :
                      'Diplomatic',
      traitFairMinded: language === 'ru' ? 'Справедливый' :
                      language === 'es' ? 'Justo' :
                      'Fair-minded',
      traitHarmonious: language === 'ru' ? 'Гармоничный' :
                      language === 'es' ? 'Armonioso' :
                      'Harmonious',
      traitSocial: language === 'ru' ? 'Общительный' :
                  language === 'es' ? 'Social' :
                  'Social',
      traitResourceful: language === 'ru' ? 'Находчивый' :
                       language === 'es' ? 'Ingenioso' :
                       'Resourceful',
      traitIntense: language === 'ru' ? 'Интенсивный' :
                   language === 'es' ? 'Intenso' :
                   'Intense',
      traitOptimistic: language === 'ru' ? 'Оптимистичный' :
                      language === 'es' ? 'Optimista' :
                      'Optimistic',
      traitFreedomLoving: language === 'ru' ? 'Свободолюбивый' :
                         language === 'es' ? 'Amante de la libertad' :
                         'Freedom-loving',
      traitAdventurous: language === 'ru' ? 'Авантюрный' :
                       language === 'es' ? 'Aventurero' :
                       'Adventurous',
      traitPhilosophical: language === 'ru' ? 'Философский' :
                         language === 'es' ? 'Filosófico' :
                         'Philosophical',
      traitDisciplined: language === 'ru' ? 'Дисциплинированный' :
                       language === 'es' ? 'Disciplinado' :
                       'Disciplined',
      traitResponsible: language === 'ru' ? 'Ответственный' :
                       language === 'es' ? 'Responsable' :
                       'Responsible',
      traitSelfControlled: language === 'ru' ? 'Самоконтролируемый' :
                          language === 'es' ? 'Auto-controlado' :
                          'Self-controlled',
      traitAmbitious: language === 'ru' ? 'Амбициозный' :
                     language === 'es' ? 'Ambicioso' :
                     'Ambitious',
      traitProgressive: language === 'ru' ? 'Прогрессивный' :
                       language === 'es' ? 'Progresivo' :
                       'Progressive',
      traitOriginal: language === 'ru' ? 'Оригинальный' :
                    language === 'es' ? 'Original' :
                    'Original',
      traitIndependent: language === 'ru' ? 'Независимый' :
                       language === 'es' ? 'Independiente' :
                       'Independent',
      traitHumanitarian: language === 'ru' ? 'Гуманитарный' :
                        language === 'es' ? 'Humanitario' :
                        'Humanitarian',
      traitCompassionate: language === 'ru' ? 'Сострадательный' :
                         language === 'es' ? 'Compasivo' :
                         'Compassionate',
      traitGentle: language === 'ru' ? 'Нежный' :
                  language === 'es' ? 'Suave' :
                  'Gentle',
      traitArtistic: language === 'ru' ? 'Артистичный' :
                    language === 'es' ? 'Artístico' :
                    'Artistic'
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
                        'Cancel',
        // Add translations for zodiac elements
        elementFire: language === 'ru' ? 'Огонь' :
                    language === 'es' ? 'Fuego' :
                    'Fire',
        elementEarth: language === 'ru' ? 'Земля' :
                     language === 'es' ? 'Tierra' :
                     'Earth',
        elementAir: language === 'ru' ? 'Воздух' :
                   language === 'es' ? 'Aire' :
                   'Air',
        elementWater: language === 'ru' ? 'Вода' :
                     language === 'es' ? 'Agua' :
                     'Water',
        // Add translations for zodiac traits - same as above
        traitCourageous: language === 'ru' ? 'Смелый' :
                         language === 'es' ? 'Valiente' :
                         'Courageous',
        traitDetermined: language === 'ru' ? 'Решительный' :
                        language === 'es' ? 'Determinado' :
                        'Determined',
        traitPassionate: language === 'ru' ? 'Страстный' :
                        language === 'es' ? 'Apasionado' :
                        'Passionate',
        traitConfident: language === 'ru' ? 'Уверенный' :
                       language === 'es' ? 'Seguro' :
                       'Confident',
        traitReliable: language === 'ru' ? 'Надежный' :
                      language === 'es' ? 'Confiable' :
                      'Reliable',
        traitPatient: language === 'ru' ? 'Терпеливый' :
                     language === 'es' ? 'Paciente' :
                     'Patient',
        traitPractical: language === 'ru' ? 'Практичный' :
                       language === 'es' ? 'Práctico' :
                       'Practical',
        traitDevoted: language === 'ru' ? 'Преданный' :
                     language === 'es' ? 'Leal' :
                     'Devoted',
        traitAdaptable: language === 'ru' ? 'Адаптивный' :
                       language === 'es' ? 'Adaptable' :
                       'Adaptable',
        traitOutgoing: language === 'ru' ? 'Общительный' :
                      language === 'es' ? 'Extrovertido' :
                      'Outgoing',
        traitCurious: language === 'ru' ? 'Любопытный' :
                     language === 'es' ? 'Curioso' :
                     'Curious',
        traitIntelligent: language === 'ru' ? 'Умный' :
                         language === 'es' ? 'Inteligente' :
                         'Intelligent',
        traitEmpathetic: language === 'ru' ? 'Сопереживающий' :
                        language === 'es' ? 'Empático' :
                        'Empathetic',
        traitNurturing: language === 'ru' ? 'Заботливый' :
                       language === 'es' ? 'Cuidadoso' :
                       'Nurturing',
        traitIntuitive: language === 'ru' ? 'Интуитивный' :
                       language === 'es' ? 'Intuitivo' :
                       'Intuitive',
        traitProtective: language === 'ru' ? 'Защищающий' :
                        language === 'es' ? 'Protector' :
                        'Protective',
        traitCreative: language === 'ru' ? 'Творческий' :
                      language === 'es' ? 'Creativo' :
                      'Creative',
        traitGenerous: language === 'ru' ? 'Щедрый' :
                      language === 'es' ? 'Generoso' :
                      'Generous',
        traitCharismatic: language === 'ru' ? 'Харизматичный' :
                         language === 'es' ? 'Carismático' :
                         'Charismatic',
        traitAnalytical: language === 'ru' ? 'Аналитический' :
                        language === 'es' ? 'Analítico' :
                        'Analytical',
        traitDiligent: language === 'ru' ? 'Усердный' :
                      language === 'es' ? 'Diligente' :
                      'Diligent',
        traitDetailOriented: language === 'ru' ? 'Внимательный к деталям' :
                            language === 'es' ? 'Detallista' :
                            'Detail-oriented',
        traitDiplomatic: language === 'ru' ? 'Дипломатичный' :
                        language === 'es' ? 'Diplomático' :
                        'Diplomatic',
        traitFairMinded: language === 'ru' ? 'Справедливый' :
                        language === 'es' ? 'Justo' :
                        'Fair-minded',
        traitHarmonious: language === 'ru' ? 'Гармоничный' :
                        language === 'es' ? 'Armonioso' :
                        'Harmonious',
        traitSocial: language === 'ru' ? 'Общительный' :
                    language === 'es' ? 'Social' :
                    'Social',
        traitResourceful: language === 'ru' ? 'Находчивый' :
                         language === 'es' ? 'Ingenioso' :
                         'Resourceful',
        traitIntense: language === 'ru' ? 'Интенсивный' :
                     language === 'es' ? 'Intenso' :
                     'Intense',
        traitOptimistic: language === 'ru' ? 'Оптимистичный' :
                        language === 'es' ? 'Optimista' :
                        'Optimistic',
        traitFreedomLoving: language === 'ru' ? 'Свободолюбивый' :
                           language === 'es' ? 'Amante de la libertad' :
                           'Freedom-loving',
        traitAdventurous: language === 'ru' ? 'Авантюрный' :
                         language === 'es' ? 'Aventurero' :
                         'Adventurous',
        traitPhilosophical: language === 'ru' ? 'Философский' :
                           language === 'es' ? 'Filosófico' :
                           'Philosophical',
        traitDisciplined: language === 'ru' ? 'Дисциплинированный' :
                         language === 'es' ? 'Disciplinado' :
                         'Disciplined',
        traitResponsible: language === 'ru' ? 'Ответственный' :
                         language === 'es' ? 'Responsable' :
                         'Responsible',
        traitSelfControlled: language === 'ru' ? 'Самоконтролируемый' :
                            language === 'es' ? 'Auto-controlado' :
                            'Self-controlled',
        traitAmbitious: language === 'ru' ? 'Амбициозный' :
                       language === 'es' ? 'Ambicioso' :
                       'Ambitious',
        traitProgressive: language === 'ru' ? 'Прогрессивный' :
                         language === 'es' ? 'Progresivo' :
                         'Progressive',
        traitOriginal: language === 'ru' ? 'Оригинальный' :
                      language === 'es' ? 'Original' :
                      'Original',
        traitIndependent: language === 'ru' ? 'Независимый' :
                         language === 'es' ? 'Independiente' :
                         'Independent',
        traitHumanitarian: language === 'ru' ? 'Гуманитарный' :
                          language === 'es' ? 'Humanitario' :
                          'Humanitarian',
        traitCompassionate: language === 'ru' ? 'Сострадательный' :
                           language === 'es' ? 'Compasivo' :
                           'Compassionate',
        traitGentle: language === 'ru' ? 'Нежный' :
                    language === 'es' ? 'Suave' :
                    'Gentle',
        traitArtistic: language === 'ru' ? 'Артистичный' :
                      language === 'es' ? 'Artístico' :
                      'Artistic'
      }
    });
  }, [language]);

  return { 
    t,
    getYearWord 
  };
};
