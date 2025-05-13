
import { useAppStore } from '@/store/useAppStore';
import translations from '@/i18n/translations';

export const useTranslations = () => {
  const { language } = useAppStore();
  
  const defaultTranslations = {
    calendar: {
      year: language === 'ru' ? 'Год' : language === 'es' ? 'Año' : 'Year',
      month: language === 'ru' ? 'Месяц' : language === 'es' ? 'Mes' : 'Month'
    },
    minimumPeriod: language === 'ru' ? 'Минимальный срок аскезы - 30 дней' : 
                  language === 'es' ? 'Período mínimo de ascesis - 30 días' : 
                  'Minimum ascesis period - 30 days'
  };
  
  return {
    t: {
      ...defaultTranslations,
      ...translations[language]
    }
  };
};
