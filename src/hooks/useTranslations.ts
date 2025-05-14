
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
                   language === 'es' ? 'Preguntar al Universo' : 'Ask Universe'
    },
    universe: {
      title: language === 'ru' ? 'Вселенная' :
            language === 'es' ? 'Universo' : 'Universe',
      yourQuestion: language === 'ru' ? 'Ваш вопрос' :
                   language === 'es' ? 'Tu pregunta' : 'Your question',
      universeAnswer: language === 'ru' ? 'Ответ Вселенной' :
                     language === 'es' ? 'Respuesta del Universo' : 'Universe Answer',
      newQuestion: language === 'ru' ? 'Новый вопрос' :
                  language === 'es' ? 'Nueva pregunta' : 'New Question',
      thinking: language === 'ru' ? 'Вселенная размышляет...' :
               language === 'es' ? 'El Universo está pensando...' : 'Universe is thinking...',
      question: language === 'ru' ? 'О чём вы хотите спросить Вселенную?' :
                language === 'es' ? '¿Qué quieres preguntar al Universo?' : 'What do you want to ask the Universe?',
      questionPlaceholder: language === 'ru' ? 'Введите свой вопрос здесь...' :
                          language === 'es' ? 'Escribe tu pregunta aquí...' : 'Type your question here...',
      askButton: language === 'ru' ? 'Спросить' :
                 language === 'es' ? 'Preguntar' : 'Ask',
      previousQuestions: language === 'ru' ? 'Предыдущие вопросы' :
                          language === 'es' ? 'Preguntas anteriores' : 'Previous questions',
      questionTooShort: language === 'ru' ? 'Вопрос слишком короткий' :
                        language === 'es' ? 'La pregunta es demasiado corta' : 'Question too short',
      errorMessage: language === 'ru' ? 'Вселенная молчит. Попробуйте позже.' :
                    language === 'es' ? 'El Universo está en silencio. Intenta más tarde.' : 'The Universe is silent. Try again later.'
    },
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
    }
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
                     language === 'es' ? 'Preguntar al Universo' : 'Ask Universe'
      },
      universe: {
        title: language === 'ru' ? 'Вселенная' :
              language === 'es' ? 'Universo' : 'Universe',
        yourQuestion: language === 'ru' ? 'Ваш вопрос' :
                     language === 'es' ? 'Tu pregunta' : 'Your question',
        universeAnswer: language === 'ru' ? 'Ответ Вселенной' :
                       language === 'es' ? 'Respuesta del Universo' : 'Universe Answer',
        newQuestion: language === 'ru' ? 'Новый вопрос' :
                    language === 'es' ? 'Nueva pregunta' : 'New Question',
        thinking: language === 'ru' ? 'Вселенная размышляет...' :
                 language === 'es' ? 'El Universo está pensando...' : 'Universe is thinking...',
        question: language === 'ru' ? 'О чём вы хотите спросить Вселенную?' :
                  language === 'es' ? '¿Qué quieres preguntar al Universo?' : 'What do you want to ask the Universe?',
        questionPlaceholder: language === 'ru' ? 'Введите свой вопрос здесь...' :
                            language === 'es' ? 'Escribe tu pregunta aquí...' : 'Type your question here...',
        askButton: language === 'ru' ? 'Спросить' :
                   language === 'es' ? 'Preguntar' : 'Ask',
        previousQuestions: language === 'ru' ? 'Предыдущие вопросы' :
                            language === 'es' ? 'Preguntas anteriores' : 'Previous questions',
        questionTooShort: language === 'ru' ? 'Вопрос слишком короткий' :
                          language === 'es' ? 'La pregunta es demasiado corta' : 'Question too short',
        errorMessage: language === 'ru' ? 'Вселенная молчит. Попробуйте позже.' :
                      language === 'es' ? 'El Universo está en silencio. Intenta más tarde.' : 'The Universe is silent. Try again later.'
      },
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
      }
    });
  }, [language]);

  return { 
    t,
    getYearWord 
  };
};
