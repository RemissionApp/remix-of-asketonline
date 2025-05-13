
import { useAppStore } from '@/store/useAppStore';
import translations from '@/i18n/translations';

export const useTranslations = () => {
  const { language } = useAppStore();
  
  const defaultTranslations = {
    calendar: {
      year: language === 'ru' ? 'Год' : language === 'es' ? 'Año' : 'Year',
      month: language === 'ru' ? 'Месяц' : language === 'es' ? 'Mes' : 'Month'
    }
  };
  
  return {
    t: {
      ...defaultTranslations,
      ...translations[language]
    }
  };
};
