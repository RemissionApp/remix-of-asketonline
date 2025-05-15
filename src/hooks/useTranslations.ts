
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
      askButton: language === 'ru' ? 'Задать вопрос' :
                language === 'es' ? 'Hacer una pregunta' :
                'Ask a question',
      proMessage: language === 'ru' ? 'Разблокируй PRO чтобы вести диалог со Вселенной' :
                 language === 'es' ? 'Desbloquea PRO para dialogar con el Universo' :
                 'Unlock PRO to have a dialog with the Universe',
      proTitle: language === 'ru' ? 'Диалог со Вселенной' :
               language === 'es' ? 'Diálogo con el Universo' :
               'Dialog with the Universe',
      learnMore: language === 'ru' ? 'Подробнее' :
                language === 'es' ? 'Más información' :
                'Learn more',
      question: language === 'ru' ? 'Задайте вопрос Вселенной' :
               language === 'es' ? 'Haz una pregunta al Universo' :
               'Ask the Universe a question',
      answer: language === 'ru' ? 'Ответ' :
             language === 'es' ? 'Respuesta' :
             'Answer',
      questionPlaceholder: language === 'ru' ? 'Введите ваш вопрос...' :
                          language === 'es' ? 'Ingresa tu pregunta...' :
                          'Enter your question...',
      answerPlaceholder: language === 'ru' ? 'Здесь появится ответ Вселенной...' :
                        language === 'es' ? 'La respuesta del Universo aparecerá aquí...' :
                        'The Universe\'s answer will appear here...',
      yourQuestion: language === 'ru' ? 'Ваш вопрос' :
                   language === 'es' ? 'Tu pregunta' :
                   'Your question',
      universeAnswer: language === 'ru' ? 'Ответ Вселенной' :
                     language === 'es' ? 'Respuesta del Universo' :
                     'Universe answer',
      newQuestion: language === 'ru' ? 'Новый вопрос' :
                  language === 'es' ? 'Nueva pregunta' :
                  'New question',
      thinking: language === 'ru' ? 'Вселенная размышляет...' :
               language === 'es' ? 'El Universo está pensando...' :
               'The Universe is thinking...',
      previousQuestions: language === 'ru' ? 'Предыдущие вопросы' :
                         language === 'es' ? 'Preguntas anteriores' :
                         'Previous questions',
      chatTitle: language === 'ru' ? 'Чат со Вселенной' :
                language === 'es' ? 'Chat con el Universo' :
                'Chat with the Universe',
      chatDescription: language === 'ru' ? 'Задавай вопросы и получай ответы от Вселенной в режиме реального времени' :
                      language === 'es' ? 'Haz preguntas y recibe respuestas del Universo en tiempo real' :
                      'Ask questions and get answers from the Universe in real time',
      enterChat: language === 'ru' ? 'Войти в чат' :
                language === 'es' ? 'Entrar al chat' :
                'Enter chat',
      chatProTitle: language === 'ru' ? 'Чат со Вселенной' :
                   language === 'es' ? 'Chat con el Universo' :
                   'Chat with the Universe',
      chatProMessage: language === 'ru' ? 'Разблокируй PRO чтобы вести диалог со Вселенной' :
                     language === 'es' ? 'Desbloquea PRO para dialogar con el Universo' :
                     'Unlock PRO to have a dialog with the Universe'
    },
    numerology: {
      title: language === 'ru' ? 'Нумерология' :
             language === 'es' ? 'Numerología' :
             'Numerology',
      description: language === 'ru' ? 'Узнайте свой нумерологический профиль и получите глубокое понимание своей личности' :
                   language === 'es' ? 'Descubre tu perfil numerológico y obtén una comprensión profunda de tu personalidad' :
                   'Discover your numerological profile and gain a deep understanding of your personality',
      learnMore: language === 'ru' ? 'Подробнее' :
                language === 'es' ? 'Más información' :
                'Learn more',
      proTitle: language === 'ru' ? 'Нумерологический анализ' :
               language === 'es' ? 'Análisis numerológico' :
               'Numerological Analysis',
      proMessage: language === 'ru' ? 'Разблокируй PRO чтобы получить полный нумерологический разбор' :
                 language === 'es' ? 'Desbloquea PRO para obtener un análisis numerológico completo' :
                 'Unlock PRO to get a complete numerological analysis'
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
        askButton: language === 'ru' ? 'Задать вопрос' :
                  language === 'es' ? 'Hacer una pregunta' :
                  'Ask a question',
        proMessage: language === 'ru' ? 'Разблокируй PRO чтобы вести диалог со Вселенной' :
                   language === 'es' ? 'Desbloquea PRO para dialogar con el Universo' :
                   'Unlock PRO to have a dialog with the Universe',
        proTitle: language === 'ru' ? 'Диалог со Вселенной' :
                 language === 'es' ? 'Diálogo con el Universo' :
                 'Dialog with the Universe',
        learnMore: language === 'ru' ? 'Подробнее' :
                  language === 'es' ? 'Más información' :
                  'Learn more',
        question: language === 'ru' ? 'Задайте вопрос Вселенной' :
                 language === 'es' ? 'Haz una pregunta al Universo' :
                 'Ask the Universe a question',
        answer: language === 'ru' ? 'Ответ' :
               language === 'es' ? 'Respuesta' :
               'Answer',
        questionPlaceholder: language === 'ru' ? 'Введите ваш вопрос...' :
                            language === 'es' ? 'Ingresa tu pregunta...' :
                            'Enter your question...',
        answerPlaceholder: language === 'ru' ? 'Здесь появится ответ Вселенной...' :
                          language === 'es' ? 'La respuesta del Universo aparecerá aquí...' :
                          'The Universe\'s answer will appear here...',
        yourQuestion: language === 'ru' ? 'Ваш вопрос' :
                     language === 'es' ? 'Tu pregunta' :
                     'Your question',
        universeAnswer: language === 'ru' ? 'Ответ Вселенной' :
                       language === 'es' ? 'Respuesta del Universo' :
                       'Universe answer',
        newQuestion: language === 'ru' ? 'Новый вопрос' :
                    language === 'es' ? 'Nueva pregunta' :
                    'New question',
        thinking: language === 'ru' ? 'Вселенная размышляет...' :
                 language === 'es' ? 'El Universo está pensando...' :
                 'The Universe is thinking...',
        previousQuestions: language === 'ru' ? 'Предыдущие вопросы' :
                           language === 'es' ? 'Preguntas anteriores' :
                           'Previous questions',
        chatTitle: language === 'ru' ? 'Чат со Вселенной' :
                  language === 'es' ? 'Chat con el Universo' :
                  'Chat with the Universe',
        chatDescription: language === 'ru' ? 'Задавай вопросы и получай ответы от Вселенной в режиме реального времени' :
                        language === 'es' ? 'Haz preguntas y recibe respuestas del Universo en tiempo real' :
                        'Ask questions and get answers from the Universe in real time',
        enterChat: language === 'ru' ? 'Войти в чат' :
                  language === 'es' ? 'Entrar al chat' :
                  'Enter chat',
        chatProTitle: language === 'ru' ? 'Чат со Вселенной' :
                     language === 'es' ? 'Chat con el Universo' :
                     'Chat with the Universe',
        chatProMessage: language === 'ru' ? 'Разблокируй PRO чтобы вести диалог со Вселенной' :
                       language === 'es' ? 'Desbloquea PRO para dialogar con el Universo' :
                       'Unlock PRO to have a dialog with the Universe'
      },
      numerology: {
        title: language === 'ru' ? 'Нумерология' :
               language === 'es' ? 'Numerología' :
               'Numerology',
        description: language === 'ru' ? 'Узнайте свой нумерологический профиль и получите глубокое понимание своей личности' :
                     language === 'es' ? 'Descubre tu perfil numerológico y obtén una comprensión profunda de tu personalidad' :
                     'Discover your numerological profile and gain a deep understanding of your personality',
        learnMore: language === 'ru' ? 'Подробнее' :
                  language === 'es' ? 'Más información' :
                  'Learn more',
        proTitle: language === 'ru' ? 'Нумерологический анализ' :
                 language === 'es' ? 'Análisis numerológico' :
                 'Numerological Analysis',
        proMessage: language === 'ru' ? 'Разблокируй PRO чтобы получить полный нумерологический разбор' :
                   language === 'es' ? 'Desbloquea PRO para obtener un análisis numerológico completo' :
                   'Unlock PRO to get a complete numerological analysis'
      }
    });
  }, [language]);

  return { 
    t,
    getYearWord 
  };
};
