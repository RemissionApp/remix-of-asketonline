
import React from 'react';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';

interface MissionActionsProps {
  acceptedMission: boolean;
  allCompleted: boolean;
  onComplete: () => void;
  onAccept: () => void;
}

export const MissionActions: React.FC<MissionActionsProps> = ({
  acceptedMission,
  allCompleted,
  onComplete,
  onAccept
}) => {
  const { language } = useAppStore();
  
  if (acceptedMission) {
    return (
      <CosmicButton 
        className="w-full mt-2 opacity-20 hover:opacity-100 transition-opacity" 
        onClick={onComplete}
        disabled={!allCompleted}
      >
        {language === 'ru' ? 'Завершить миссию' : language === 'es' ? 'Completar misión' : 'Complete mission'}
      </CosmicButton>
    );
  }
  
  return (
    <CosmicButton 
      className="w-full mt-2 opacity-20 hover:opacity-100 transition-opacity" 
      onClick={onAccept}
    >
      {language === 'ru' ? 'Принять миссию' : language === 'es' ? 'Aceptar misión' : 'Accept mission'}
    </CosmicButton>
  );
};
