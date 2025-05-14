
import { useState, useEffect } from 'react';
import { translations } from '@/i18n/translations';
import { useAppStore } from '@/store/useAppStore';

export type SupportedLanguage = 'ru' | 'en' | 'es';

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

export const useTranslations = () => {
  const { language } = useAppStore();
  const [t, setT] = useState(translations[language]);

  useEffect(() => {
    setT(translations[language]);
  }, [language]);

  return { 
    t,
    getYearWord 
  };
};
