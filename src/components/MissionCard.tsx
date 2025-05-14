
import React from 'react';
import { Card } from '@/components/ui/card';
import { CosmicButton } from '@/components/CosmicButton';
import { Mission } from '@/types';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';
import { useMissions } from '@/hooks/useMissions';

interface MissionCardProps {
  mission: Mission;
  className?: string;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, className }) => {
  const { completeMission } = useMissions();
  const { t } = useTranslations();
  
  const handleCompleteMission = () => {
    completeMission();
  };
  
  return (
    <Card className={cn("cosmic-card p-4", className)}>
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-serif text-cosmic-gold mb-2">{mission.title}</h3>
        <p className="text-cosmic-text mb-4">{mission.description}</p>
        
        <div className="mb-4 flex-grow">
          <h4 className="text-sm text-cosmic-accent mb-2">{t.missions.requirements}</h4>
          <ul className="list-disc pl-5 space-y-1">
            {mission.requirements.map((req, index) => (
              <li key={index} className="text-cosmic-text text-sm">{req}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-cosmic-accent">{t.missions.reward}</span>
            <span className="text-cosmic-gold font-bold">+{mission.reward.energyPoints} {t.missions.energy}</span>
          </div>
          
          <CosmicButton 
            onClick={handleCompleteMission}
            disabled={mission.completed}
            className="w-full"
          >
            {mission.completed ? (
              <span className="flex items-center justify-center">
                <CheckCircle2 className="mr-2 h-4 w-4" /> {t.missions.completed}
              </span>
            ) : (
              t.missions.complete
            )}
          </CosmicButton>
        </div>
      </div>
    </Card>
  );
};
