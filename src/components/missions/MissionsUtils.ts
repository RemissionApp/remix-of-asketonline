import { Mission } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';

export const filterMissions = (
  missions: Mission[],
  filter: 'all' | 'active' | 'completed'
): Mission[] => {
  if (filter === 'all') return missions;
  if (filter === 'active')
    return missions.filter(mission => !mission.completed);
  if (filter === 'completed')
    return missions.filter(mission => mission.completed);
  return missions;
};

export const getPageTitle = (language: 'en' | 'ru' | 'es') => {
  const { t } = useTranslations();
  switch (language) {
    case 'ru':
      return 'Космические миссии';
    case 'es':
      return 'Misiones cósmicas';
    default:
      return 'Cosmic missions';
  }
};
