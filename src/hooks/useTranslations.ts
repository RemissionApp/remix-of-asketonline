
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
        }
      ]
    },
    meditation: {
      pageTitle: language === 'ru' ? 'Медитации силы' : language === 'es' ? 'Meditaciones de poder' : 'Power Meditations',
      play: language === 'ru' ? 'Слушать' : language === 'es' ? 'Escuchar' : 'Listen',
      unlock: language === 'ru' ? 'Открыть PRO' : language === 'es' ? 'Desbloquear PRO' : 'Unlock PRO',
      categories: {
        morning: language === 'ru' ? 'Утренние' : language === 'es' ? 'Mañana' : 'Morning',
        evening: language === 'ru' ? 'Вечерние' : language === 'es' ? 'Noche' : 'Evening',
        stress: language === 'ru' ? 'Антистресс' : language === 'es' ? 'Antiestrés' : 'Anti-stress',
        mantra: language === 'ru' ? 'Мантры' : language === 'es' ? 'Mantras' : 'Mantras',
        visual: language === 'ru' ? 'Визуализации' : language === 'es' ? 'Visualización' : 'Visualization'
      },
      morning: {
        title1: language === 'ru' ? 'Настрой на день' : language === 'es' ? 'Preparación para el día' : 'Day Setup',
        desc1: language === 'ru' ? 'Зарядись энергией на весь день' : language === 'es' ? 'Cárgate de energía para todo el día' : 'Charge with energy for the whole day',
        title2: language === 'ru' ? 'Благодарность' : language === 'es' ? 'Gratitud' : 'Gratitude',
        desc2: language === 'ru' ? 'Практика благодарности Вселенной' : language === 'es' ? 'Práctica de gratitud al Universo' : 'Practice of gratitude to the Universe'
      },
      evening: {
        title1: language === 'ru' ? 'Прощение' : language === 'es' ? 'Perdón' : 'Forgiveness',
        desc1: language === 'ru' ? 'Отпусти прошлое с легкостью' : language === 'es' ? 'Deja ir el pasado con facilidad' : 'Let go of the past with ease'
      },
      stress: {
        title1: language === 'ru' ? 'Заземление' : language === 'es' ? 'Conexión a tierra' : 'Grounding',
        desc1: language === 'ru' ? 'Восстановление внутреннего равновесия' : language === 'es' ? 'Restauración del equilibrio interior' : 'Restoring inner balance'
      },
      mantra: {
        title1: language === 'ru' ? 'Голос наставника' : language === 'es' ? 'Voz del guía' : 'Guide\'s Voice',
        desc1: language === 'ru' ? 'Интеграция высшей энергии' : language === 'es' ? 'Integración de energía superior' : 'Integration of higher energy'
      },
      visualization: {
        title1: language === 'ru' ? 'Космический полёт' : language === 'es' ? 'Vuelo cósmico' : 'Cosmic Flight',
        desc1: language === 'ru' ? 'Путешествие сквозь звёзды' : language === 'es' ? 'Viaje a través de las estrellas' : 'Journey through the stars'
      }
    },
    subscription: {
      bannerTitle: language === 'ru' ? 'Раскройте свой потенциал с ASKET PRO' : 
                   language === 'es' ? 'Desbloquea tu potencial con ASKET PRO' : 
                   'Unlock your potential with ASKET PRO',
      bannerDesc: language === 'ru' ? 'Доступ к медитациям, расширенным практикам и многому другому' : 
                  language === 'es' ? 'Acceso a meditaciones, prácticas avanzadas y mucho más' : 
                  'Access to meditations, advanced practices and much more',
      upgradeNow: language === 'ru' ? 'Улучшить сейчас' : language === 'es' ? 'Mejorar ahora' : 'Upgrade Now'
    },
    main: {
      path: language === 'ru' ? 'Путь' : language === 'es' ? 'Camino' : 'Path',
      ascesis: language === 'ru' ? 'Аскеза' : language === 'es' ? 'Ascesis' : 'Ascesis',
      universe: language === 'ru' ? 'Вселенная' : language === 'es' ? 'Universo' : 'Universe',
      profile: language === 'ru' ? 'Профиль' : language === 'es' ? 'Perfil' : 'Profile',
      days: language === 'ru' ? 'дней' : language === 'es' ? 'días' : 'days',
      todayCompleted: language === 'ru' ? 'Сегодня завершено' : language === 'es' ? 'Hoy completado' : 'Today Completed',
      askUniverse: language === 'ru' ? 'Спросить Вселенную' : language === 'es' ? 'Preguntar al Universo' : 'Ask the Universe',
      noPacts: language === 'ru' ? 'Нет активных аскез' : language === 'es' ? 'No hay ascesis activas' : 'No active ascesis',
      createPact: language === 'ru' ? 'Создать аскезу' : language === 'es' ? 'Crear ascesis' : 'Create Ascesis',
      meditation: language === 'ru' ? 'Медитации' : language === 'es' ? 'Meditaciones' : 'Meditations',
      nav: {
        path: language === 'ru' ? 'Путь' : language === 'es' ? 'Camino' : 'Path',
        ascesis: language === 'ru' ? 'Аскеза' : language === 'es' ? 'Ascesis' : 'Ascesis',
        universe: language === 'ru' ? 'Вселенная' : language === 'es' ? 'Universo' : 'Universe',
        profile: language === 'ru' ? 'Профиль' : language === 'es' ? 'Perfil' : 'Profile'
      }
    },
    userProfile: {
      title: language === 'ru' ? 'О тебе' : language === 'es' ? 'Sobre ti' : 'About You',
      nameLabel: language === 'ru' ? 'Как тебя зовут' : language === 'es' ? '¿Cómo te llamas?' : 'What\'s your name',
      namePlaceholder: language === 'ru' ? 'Введите ваше имя' : language === 'es' ? 'Ingresa tu nombre' : 'Enter your name',
      nameRequired: language === 'ru' ? 'Имя обязательно' : language === 'es' ? 'El nombre es obligatorio' : 'Name is required',
      birthDateLabel: language === 'ru' ? 'Дата рождения' : language === 'es' ? 'Fecha de nacimiento' : 'Date of birth',
      birthDatePlaceholder: language === 'ru' ? 'Выберите дату рождения' : language === 'es' ? 'Selecciona tu fecha de nacimiento' : 'Select your date of birth',
      birthDateRequired: language === 'ru' ? 'Укажите дату рождения' : language === 'es' ? 'La fecha de nacimiento es obligatoria' : 'Date of birth is required',
      continueButton: language === 'ru' ? 'Продолжить' : language === 'es' ? 'Continuar' : 'Continue',
      age: language === 'ru' ? 'Возраст' : language === 'es' ? 'Edad' : 'Age',
      yearSingular: language === 'ru' ? 'год' : language === 'es' ? 'año' : 'year',
      yearPlural: language === 'ru' ? 'лет' : language === 'es' ? 'años' : 'years',
      currentDate: language === 'ru' ? 'Текущая дата' : language === 'es' ? 'Fecha actual' : 'Current date',
      languageLabel: language === 'ru' ? 'Язык приложения' : language === 'es' ? 'Idioma de la aplicación' : 'App language',
      back: language === 'ru' ? 'Назад' : language === 'es' ? 'Atrás' : 'Back'
    }
  };
  
  return {
    t: {
      ...defaultTranslations,
      ...translations[language]
    }
  };
};
