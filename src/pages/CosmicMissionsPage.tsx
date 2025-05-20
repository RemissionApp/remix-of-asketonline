
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { MissionCard } from '@/components/MissionCard';
import { Mission } from '@/types';
import { Flag, Star, CheckCircle } from 'lucide-react';

const CosmicMissionsPage: React.FC = () => {
  const { language, userProfile } = useAppStore();
  const { t } = useTranslations();
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

  const getPageTitle = () => {
    switch(language) {
      case 'ru': return 'Космические миссии';
      case 'es': return 'Misiones cósmicas';
      default: return 'Cosmic missions';
    }
  };

  const getTabText = (tab: 'all' | 'active' | 'completed') => {
    if (tab === 'all') {
      return language === 'ru' ? 'Все' : language === 'es' ? 'Todos' : 'All';
    } else if (tab === 'active') {
      return language === 'ru' ? 'Активные' : language === 'es' ? 'Activos' : 'Active';
    } else {
      return language === 'ru' ? 'Завершённые' : language === 'es' ? 'Completados' : 'Completed';
    }
  };

  // Filter missions based on active tab
  const filteredMissions = missions.filter(mission => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return !mission.completed;
    if (activeTab === 'completed') return mission.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      <TopBar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className={`text-2xl ${language === 'en' ? 'font-serif' : ''} mb-6 text-cosmic-gold`}>
          {getPageTitle()}
        </h1>
        
        {/* Tabs for filtering missions */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              className={`px-3 py-2 rounded-md text-sm whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-cosmic-gold/20 text-cosmic-gold border border-cosmic-gold/30'
                  : 'bg-cosmic-dark/30 text-cosmic-secondary border border-cosmic-accent/10'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {getTabText(tab)}
            </button>
          ))}
        </div>
        
        <div className="space-y-6">
          {filteredMissions.length > 0 ? (
            filteredMissions.map(mission => (
              <div key={mission.id} className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg overflow-hidden relative">
                {/* Background with slight gradient overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
                  style={{ 
                    backgroundImage: "url('https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//mission-banner.jpg')",
                    filter: 'brightness(1.3) contrast(1.2)',
                  }}
                />
                
                <div className="relative z-10">
                  <MissionCard 
                    mission={mission}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-cosmic-secondary">
              {language === 'ru' ? 'Нет доступных миссий' : 
               language === 'es' ? 'No hay misiones disponibles' : 
               'No missions available'}
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CosmicMissionsPage;
