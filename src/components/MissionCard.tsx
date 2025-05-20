
import React from 'react';
import { cn } from '@/lib/utils';
import { Mission } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { MissionHeader } from './missions/cards/MissionHeader';
import { MissionRequirements } from './missions/cards/MissionRequirements';
import { MissionProgress } from './missions/cards/MissionProgress';
import { MissionReward } from './missions/cards/MissionReward';
import { MissionActions } from './missions/cards/MissionActions';
import { useMissionCard } from './missions/cards/useMissionCard';

interface MissionCardProps {
  mission?: Mission;
  className?: string;
  onComplete?: () => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ 
  mission,
  className,
  onComplete
}) => {
  const { language } = useAppStore();
  
  if (!mission) return null;
  
  const {
    progress,
    acceptedMission,
    requirementStatus,
    lastCompletedDate,
    canCompleteToday,
    allCompleted,
    toggleRequirement,
    handleCompleteMission,
    handleAcceptMission
  } = useMissionCard(mission, onComplete);
  
  return (
    <div className={cn(
      'p-4 rounded-lg',
      className
    )}>
      <MissionHeader 
        title={mission.title}
        description={mission.description}
        language={language}
      />
      
      <MissionRequirements
        requirements={mission.requirements}
        requirementStatus={requirementStatus}
        toggleRequirement={toggleRequirement}
        acceptedMission={acceptedMission}
        missionType={mission.type}
        canCompleteToday={canCompleteToday}
      />
      
      {acceptedMission && (
        <MissionProgress
          progress={progress}
          lastCompletedDate={lastCompletedDate}
          missionType={mission.type}
        />
      )}
      
      <MissionReward reward={mission.reward} />
      
      <MissionActions
        acceptedMission={acceptedMission}
        allCompleted={allCompleted}
        onComplete={handleCompleteMission}
        onAccept={handleAcceptMission}
      />
    </div>
  );
};
