
import { useState, useEffect } from 'react';
import { translations } from '@/i18n/translations';
import { useAppStore } from '@/store/useAppStore';

export const useTranslations = () => {
  const { language } = useAppStore();
  const [t, setT] = useState(translations[language]);

  useEffect(() => {
    setT(translations[language]);
  }, [language]);

  return { t };
};
