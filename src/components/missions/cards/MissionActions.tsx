
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
        variant="default"
      >
        {language === 'ru' ? 'Завершить миссию' : language === 'es' ? 'Completar misión' : 'Complete mission'}
      </CosmicButton>
    );
  }
  
  return (
    <CosmicButton 
      className="w-full mt-2 bg-gradient-to-r from-cosmic-accent/60 to-cosmic-indigo/50 hover:from-cosmic-accent/70 hover:to-cosmic-indigo/60 backdrop-blur-md border border-white/20 opacity-20 hover:opacity-100 transition-opacity" 
      onClick={onAccept}
      variant="default"
    >
      {language === 'ru' ? 'Принять миссию' : language === 'es' ? 'Aceptar misión' : 'Accept mission'}
    </CosmicButton>
  );
};
