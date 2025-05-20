
import { Meditation } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';

export const useFreeMeditations = (): Meditation[] => {
  // Free meditations data
  return [
    {
      id: 'morning-free-1',
      title: 'Утренняя медитация',
      description: 'Начните свой день с этой простой 5-минутной медитации',
      duration: 5, // Changed from '5 мин' to 5
      category: 'morning',
      image: '/meditation/morning1.jpg',
      audioSrc: '/meditations/morning-free.mp3',
      locked: false,
      requiresPro: false
    },
    {
      id: 'evening-free-1',
      title: 'Вечернее расслабление',
      description: 'Подготовьтесь ко сну с этой успокаивающей медитацией',
      duration: 7, // Changed from '7 мин' to 7
      category: 'evening',
      image: '/meditation/evening1.jpg',
      audioSrc: '/meditations/evening-free.mp3',
      locked: false,
      requiresPro: false
    },
    {
      id: 'stress-free-1',
      title: 'Снятие стресса',
      description: 'Быстрая медитация для снятия напряжения',
      duration: 3, // Changed from '3 мин' to 3
      category: 'stress',
      image: '/meditation/stress1.jpg',
      audioSrc: '/meditations/stress-free.mp3',
      locked: false,
      requiresPro: false
    },
  ];
};

export const useProMeditations = (isPro: boolean): Meditation[] => {
  const { t } = useTranslations();
  
  // PRO meditations data
  return [
    {
      id: 'morning-pro-1',
      title: t.meditation.morning.title1,
      description: t.meditation.morning.desc1,
      duration: 10, // Changed from '10 мин' to 10
      category: 'morning',
      image: '/meditation/morning2.jpg',
      audioSrc: '/meditations/morning-pro-1.mp3',
      locked: !isPro,
      requiresPro: true
    },
    {
      id: 'morning-pro-2',
      title: t.meditation.morning.title2 || 'Утренняя энергия',
      description: t.meditation.morning.desc2 || 'Зарядитесь энергией на весь день',
      duration: 15, // Changed from '15 мин' to 15
      category: 'morning',
      image: '/meditation/morning3.jpg',
      audioSrc: '/meditations/morning-pro-2.mp3',
      locked: !isPro,
      requiresPro: true
    },
    {
      id: 'evening-pro-1',
      title: t.meditation.evening.title1,
      description: t.meditation.evening.desc1,
      duration: 12, // Changed from '12 мин' to 12
      category: 'evening',
      image: '/meditation/evening2.jpg',
      audioSrc: '/meditations/evening-pro-1.mp3',
      locked: !isPro,
      requiresPro: true
    },
    {
      id: 'stress-pro-1',
      title: t.meditation.stress.title1,
      description: t.meditation.stress.desc1,
      duration: 8, // Changed from '8 мин' to 8
      category: 'stress',
      image: '/meditation/stress2.jpg',
      audioSrc: '/meditations/stress-pro-1.mp3',
      locked: !isPro,
      requiresPro: true
    },
    {
      id: 'visualization-pro-1',
      title: t.meditation.visualization.title1,
      description: t.meditation.visualization.desc1,
      duration: 15, // Changed from '15 мин' to 15
      category: 'visualization',
      image: '/meditation/visualization1.jpg',
      audioSrc: '/meditations/visualization-pro-1.mp3',
      locked: !isPro,
      requiresPro: true
    }
  ];
};
