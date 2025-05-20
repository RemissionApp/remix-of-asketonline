import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { Mission } from '@/types';
import { MissionsTabBar } from '@/components/missions/MissionsTabBar';
import { MissionsList } from '@/components/missions/MissionsList';
import { getPageTitle, filterMissions } from '@/components/missions/MissionsUtils';
import { Flag, Star, CheckCircle } from 'lucide-react';

const CosmicMissionsPage: React.FC = () => {
  const { language, userProfile } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  
  // Example missions data - in a real app, this would come from the store/backend
  const missions: Mission[] = [
    {
      id: 'ritual-1',
      title: language === 'ru' ? 'Утренний ритуал осознанности' : 
             language === 'es' ? 'Ritual matutino de atención plena' : 
             'Morning mindfulness ritual',
      description: language === 'ru' ? 'Практикуйте 5-минутную медитацию каждое утро в течение 7 дней' : 
                   language === 'es' ? 'Practica 5 minutos de meditación cada mañana durante 7 días' : 
                   'Practice 5-minute meditation every morning for 7 days',
      requirements: [
        language === 'ru' ? 'Медитируйте 5 минут каждое утро' : 
        language === 'es' ? 'Medita 5 minutos cada mañana' : 
        'Meditate for 5 minutes each morning',
        
        language === 'ru' ? 'Завершите цикл в 7 дней' : 
        language === 'es' ? 'Completa un ciclo de 7 días' : 
        'Complete a 7-day cycle'
      ],
      reward: {
        energyPoints: 40
      },
      completed: false,
      type: 'multi-day',
      progress: Array(7).fill(0).map((_, i) => ({
        day: i + 1,
        completed: false,
        date: ''
      }))
    },
    {
      id: 'challenge-1',
      title: language === 'ru' ? 'Космический челлендж тишины' : 
             language === 'es' ? 'Desafío cósmico del silencio' : 
             'Cosmic silence challenge',
      description: language === 'ru' ? 'Проведите один час в полной тишине каждый день в течение 3 дней' : 
                   language === 'es' ? 'Pasa una hora en silencio completo cada día durante 3 días' : 
                   'Spend one hour in complete silence every day for 3 days',
      requirements: [
        language === 'ru' ? 'Один час без разговоров и гаджетов' : 
        language === 'es' ? 'Una hora sin hablar ni usar dispositivos' : 
        'One hour without talking or using devices',
        
        language === 'ru' ? 'Повторите 3 дня подряд' : 
        language === 'es' ? 'Repite durante 3 días consecutivos' : 
        'Repeat for 3 consecutive days'
      ],
      reward: {
        energyPoints: 25,
        achievement: 'inner-silence'
      },
      completed: false,
      type: 'multi-day',
      progress: Array(3).fill(0).map((_, i) => ({
        day: i + 1,
        completed: false,
        date: ''
      }))
    },
    {
      id: 'chain-1',
      title: language === 'ru' ? 'Цепочка благодарности' : 
             language === 'es' ? 'Cadena de gratitud' : 
             'Gratitude chain',
      description: language === 'ru' ? 'Запишите три вещи, за которые вы благодарны, каждый день в течение 10 дней' : 
                   language === 'es' ? 'Escribe tres cosas por las que estés agradecido cada día durante 10 días' : 
                   'Write down three things you are grateful for every day for 10 days',
      requirements: [
        language === 'ru' ? 'Запишите 3 благодарности ежедневно' : 
        language === 'es' ? 'Escribe 3 gratitudes diariamente' : 
        'Write 3 gratitudes daily',
        
        language === 'ru' ? 'Завершите цикл в 10 дней' : 
        language === 'es' ? 'Completa un ciclo de 10 días' : 
        'Complete a 10-day cycle'
      ],
      reward: {
        energyPoints: 50,
        achievement: 'gratitude-master'
      },
      completed: false,
      type: 'multi-day',
      progress: Array(10).fill(0).map((_, i) => ({
        day: i + 1,
        completed: false,
        date: ''
      }))
    },
    {
      id: 'single-1',
      title: language === 'ru' ? 'Ритуал очищения пространства' : 
             language === 'es' ? 'Ritual de limpieza de espacio' : 
             'Space cleansing ritual',
      description: language === 'ru' ? 'Очистите свое жизненное пространство с помощью энергетического ритуала' : 
                   language === 'es' ? 'Limpia tu espacio vital con un ritual energético' : 
                   'Cleanse your living space with an energy ritual',
      requirements: [
        language === 'ru' ? 'Удалите ненужные предметы' : 
        language === 'es' ? 'Elimina objetos innecesarios' : 
        'Remove unnecessary items',
        
        language === 'ru' ? 'Проведите энергетическую очистку' : 
        language === 'es' ? 'Realiza una limpieza energética' : 
        'Perform an energy cleanse'
      ],
      reward: {
        energyPoints: 15
      },
      completed: false,
      type: 'single'
    }
  ];

  // Filter missions based on active tab
  const filteredMissions = filterMissions(missions, activeTab);

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      <TopBar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className={`text-2xl ${language === 'en' ? 'font-serif' : ''} mb-6 text-cosmic-gold`}>
          {getPageTitle(language)}
        </h1>
        
        {/* Tabs for filtering missions */}
        <MissionsTabBar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        {/* Missions list */}
        <MissionsList missions={filteredMissions} />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CosmicMissionsPage;
