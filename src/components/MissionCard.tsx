
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
    daysCompleted,
    totalDays,
    toggleRequirement,
    handleCompleteMission,
    handleAcceptMission
  } = useMissionCard(mission, onComplete);
  
  // Определим, является ли это "Космический челлендж тишины"
  const isSilenceChallenge = mission.title.includes('тишины') || 
                            mission.title.includes('silence') || 
                            mission.title.includes('silencio');
  
  const backgroundStyle = isSilenceChallenge ? {
    backgroundImage: "url('https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//slse.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  } as React.CSSProperties : {};
  
  return (
    <div 
      className={cn(
        'p-4 rounded-lg',
        isSilenceChallenge && 'relative overflow-hidden',
        className
      )}
      style={backgroundStyle}
    >
      {isSilenceChallenge && (
        <div className="absolute inset-0 bg-gradient-to-r from-cosmic-dark/60 to-cosmic-indigo/40"></div>
      )}
      
      <div className={cn("relative z-10", isSilenceChallenge && "animate-fade-in")}>
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
          daysCompleted={daysCompleted}
          totalDays={totalDays}
        />
        
        {acceptedMission && (
          <MissionProgress
            progress={progress}
            lastCompletedDate={lastCompletedDate}
            missionType={mission.type}
            daysCompleted={daysCompleted}
            totalDays={totalDays}
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
    </div>
  );
};
