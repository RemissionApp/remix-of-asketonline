
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
                   'Minimum ascesis period - 30 days',
    comparison: {
      title: language === 'ru' ? 'ASKET vs ASKET PRO' : language === 'es' ? 'ASKET vs ASKET PRO' : 'ASKET vs ASKET PRO',
      freePlan: language === 'ru' ? 'Бесплатно' : language === 'es' ? 'Gratis' : 'Free',
      proPlan: language === 'ru' ? 'Платная подписка' : language === 'es' ? 'Suscripción de pago' : 'Paid subscription',
      free: language === 'ru' ? 'Бесплатно' : language === 'es' ? 'Gratis' : 'Free',
      pricing: language === 'ru' ? '$4.99/мес или $29.99/год' : language === 'es' ? '$4.99/mes o $29.99/año' : '$4.99/month or $29.99/year',
      upgradeButton: language === 'ru' ? 'Открыть силу PRO ✨' : language === 'es' ? 'Desbloquear el poder PRO ✨' : 'Unlock PRO power ✨',
      features: [
        {
          name: language === 'ru' ? 'Количество активных аскез' : language === 'es' ? 'Número de ascesis activas' : 'Active ascesis count',
          free: true,
          pro: true,
          freeDescription: language === 'ru' ? '1 одновременно' : language === 'es' ? '1 simultáneamente' : '1 simultaneously',
          proDescription: language === 'ru' ? 'До 5 одновременно' : language === 'es' ? 'Hasta 5 simultáneamente' : 'Up to 5 simultaneously'
        },
        // More feature translations would follow here...
        // For brevity, I'm not including all features in the default translations
      ]
    }
  };
  
  return {
    t: {
      ...defaultTranslations,
      ...translations[language]
    }
  };
};
