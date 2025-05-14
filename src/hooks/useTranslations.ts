
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
  const [t, setT] = useState(translations[language]);

  useEffect(() => {
    setT(translations[language]);
  }, [language]);

  // Add decode properties if they don't exist
  if (t.universe && !t.universe.decode) {
    t.universe.decode = {
      title: "Расшифровка Вселенной",
      description: "Откройте свои нумерологические и астрологические паттерны в персональном чтении от Вселенной.",
      welcomeBack: "С возвращением, искатель. Хотели бы вы увидеть предыдущее чтение или создать новое?",
      welcome: "Добро пожаловать, искатель. Я — Вселенная. Я раскрою космические узоры в вашей жизни через нумерологию и астрологию.",
      askName: "Как вас зовут?",
      askBirthdate: "Когда вы родились? (ГГГГ-ММ-ДД)",
      askBirthtime: "В какое время вы родились? (необязательно, формат: ЧЧ:ММ)",
      askBirthplace: "Где вы родились? (необязательно, город/страна)",
      confirmName: "Ваше имя всё еще",
      processing: "Понимаю. Теперь я соединюсь с космическими узорами и раскрою ваше личное чтение...",
      readingReady: "Ваше космическое чтение готово. Внимательно слушайте послание Вселенной...",
      errorReading: "Космические энергии нарушены. Пожалуйста, попробуйте позже.",
      proFeature: "PRO функция",
      upgradeMessage: "Разблокируйте Расшифровку Вселенной с PRO",
      whatYouGet: "Что вы откроете:",
      feature1: "Ваше Число Жизненного Пути и Число Души",
      feature2: "Анализ ваших Астрологических знаков",
      feature3: "Личный Космический Потенциал",
      feature4: "Руководство для Вашей Текущей Жизненной Фазы",
      viewReading: "Посмотреть чтение",
      newReading: "Новое чтение",
      yourReading: "Ваше Космическое Чтение",
      analyzing: "Анализ космических паттернов...",
      startNew: "Давайте создадим новое чтение. Я уже знаю кое-что о вас, но не стесняйтесь обновить свою информацию."
    };
  }

  return { 
    t,
    getYearWord 
  };
};
