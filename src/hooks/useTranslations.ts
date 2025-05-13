
import { useAppStore } from '@/store/useAppStore';
import translations from '@/i18n/translations';

export const useTranslations = () => {
  const { language } = useAppStore();
  
  return {
    t: translations[language]
  };
};
