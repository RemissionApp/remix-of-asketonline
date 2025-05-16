
import { Meditation } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';

export const useFreeMeditations = (): Meditation[] => {
  // Free meditations data
  return [
    {
      id: 'morning-free-1',
      title: 'Утренняя медитация',
      description: 'Начните свой день с этой простой 5-минутной медитации',
      duration: '5 мин',
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
      duration: '7 мин',
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
      duration: '3 мин',
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
      duration: '10 мин',
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
      duration: '15 мин',
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
      duration: '12 мин',
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
      duration: '8 мин',
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
      duration: '15 мин',
      category: 'visualization',
      image: '/meditation/visualization1.jpg',
      audioSrc: '/meditations/visualization-pro-1.mp3',
      locked: !isPro,
      requiresPro: true
    }
  ];
};
