
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
  
  // Определим специальные миссии с фоновыми изображениями
  const isSilenceChallenge = mission.title.includes('тишины') || 
                            mission.title.includes('silence') || 
                            mission.title.includes('silencio');
                            
  const isGratitudeChain = mission.title.includes('благодарности') || 
                          mission.title.includes('gratitude') || 
                          mission.title.includes('gratitud');
                          
  const isMorningRitual = mission.title.includes('Утренний ритуал') || 
                         mission.title.includes('Morning mindfulness') || 
                         mission.title.includes('Ritual matutino');
  
  // Выбор фонового изображения в зависимости от миссии
  let backgroundStyle = {} as React.CSSProperties;
  
  if (isSilenceChallenge) {
    backgroundStyle = {
      backgroundImage: "url('https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//slse.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    };
  } else if (isGratitudeChain) {
    backgroundStyle = {
      backgroundImage: "url('https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//Thanks.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    };
  } else if (isMorningRitual) {
    backgroundStyle = {
      backgroundImage: "url('https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//morning.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    };
  }
  
  // Определение, нужен ли градиент поверх фона
  const needsOverlay = isSilenceChallenge || isGratitudeChain || isMorningRitual;
  
  return (
    <div 
      className={cn(
        'p-4 rounded-lg',
        needsOverlay && 'relative overflow-hidden',
        className
      )}
      style={backgroundStyle}
    >
      {needsOverlay && (
        <div className="absolute inset-0 bg-gradient-to-r from-cosmic-dark/40 to-cosmic-indigo/30"></div>
      )}
      
      <div className={cn("relative z-10", needsOverlay && "animate-fade-in")}>
        <MissionHeader 
          title={mission.title}
          description={mission.description}
          language={language}
          hasBackground={needsOverlay}
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
