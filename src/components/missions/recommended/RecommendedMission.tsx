import React from 'react';
import { InteractiveMissionCard } from '../interactive/InteractiveMissionCard';
import { useMissionManager } from '@/hooks/useMissionManager';
import { useMissionActions } from '@/hooks/useMissionActions';
import { useAppStore } from '@/store/useAppStore';
import { Mission } from '@/types';

export const RecommendedMission: React.FC = () => {
  const { language } = useAppStore();
  const { getAllSuitableMissions } = useMissionManager();
  const { startMission, isLoading } = useMissionActions();
  
  const suitableMissions = getAllSuitableMissions();

  if (!suitableMissions || suitableMissions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-cosmic-silver">
          {language === 'ru' 
            ? 'Нет доступных миссий в данный момент'
            : language === 'es'
            ? 'No hay misiones disponibles en este momento'
            : 'No missions available at the moment'
          }
        </p>
      </div>
    );
  }

  const handleStartMission = async (mission: Mission) => {
    const success = await startMission(mission);
    if (success) {
      console.log(`Mission ${mission.id} started successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-cosmic-gold">
        {language === 'ru' 
          ? '🌟 Доступные миссии'
          : language === 'es'
          ? '🌟 Misiones disponibles'
          : '🌟 Available Missions'
        }
      </h3>
      
      <div className="grid gap-4">
        {suitableMissions.map((mission) => (
          <InteractiveMissionCard
            key={mission.id}
            mission={mission}
            onStart={() => handleStartMission(mission)}
            className={isLoading ? 'opacity-75 pointer-events-none' : ''}
          />
        ))}
      </div>
    </div>
  );
};