import React from 'react';
import { InteractiveMissionCard } from '../interactive/InteractiveMissionCard';
import { useMissionManager } from '@/hooks/useMissionManager';
import { useMissionActions } from '@/hooks/useMissionActions';
import { useAppStore } from '@/store/useAppStore';

export const RecommendedMission: React.FC = () => {
  const { language } = useAppStore();
  const { getRecommendedMission } = useMissionManager();
  const { startMission, isLoading } = useMissionActions();
  
  const recommendedMission = getRecommendedMission();

  if (!recommendedMission) {
    return (
      <div className="text-center py-8">
        <p className="text-cosmic-silver">
          {language === 'ru' 
            ? 'Нет доступных рекомендованных миссий в данный момент'
            : language === 'es'
            ? 'No hay misiones recomendadas disponibles en este momento'
            : 'No recommended missions available at the moment'
          }
        </p>
      </div>
    );
  }

  const handleStartMission = async () => {
    await startMission(recommendedMission);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-cosmic-gold">
        {language === 'ru' 
          ? '🌟 Рекомендованная миссия'
          : language === 'es'
          ? '🌟 Misión recomendada'
          : '🌟 Recommended Mission'
        }
      </h3>
      
      <InteractiveMissionCard
        mission={recommendedMission}
        onStart={handleStartMission}
        className={isLoading ? 'opacity-75 pointer-events-none' : ''}
      />
    </div>
  );
};