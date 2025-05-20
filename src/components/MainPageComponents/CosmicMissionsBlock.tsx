
import React, { useState } from 'react';
import { Flag, Star, Infinity, Award } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { MissionCard } from '@/components/MissionCard';
import { Mission } from '@/types';

export const CosmicMissionsBlock: React.FC = () => {
  const { language, userProfile } = useAppStore();
  const { t } = useTranslations();
  const [showAll, setShowAll] = useState(false);
  
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
      completed: false
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
      completed: false
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
      completed: false
    }
  ];

  // Show only active mission if exists, or first available mission
  const displayedMissions = showAll 
    ? missions 
    : userProfile?.activeMission 
      ? [userProfile.activeMission]
      : [missions[0]];

  return (
    <div className="w-full max-w-lg mx-auto mb-6">
      <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-4">
        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3">
              <Star size={20} className="text-cosmic-gold" />
            </div>
            <h3 className="font-medium">
              {language === 'ru' ? 'Космические миссии' : 
               language === 'es' ? 'Misiones cósmicas' : 
               'Cosmic missions'}
            </h3>
          </div>
          
          <div className="space-y-4">
            {displayedMissions.map((mission) => (
              <MissionCard 
                key={mission.id} 
                mission={mission}
                className="mb-4"
              />
            ))}
          </div>
          
          {missions.length > 1 && (
            <button 
              onClick={() => setShowAll(!showAll)} 
              className="mt-2 text-cosmic-accent text-sm flex items-center hover:underline"
            >
              {showAll 
                ? (language === 'ru' ? 'Показать меньше' : 
                   language === 'es' ? 'Mostrar menos' : 
                   'Show less') 
                : (language === 'ru' ? 'Показать все миссии' : 
                   language === 'es' ? 'Mostrar todas las misiones' : 
                   'Show all missions')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
