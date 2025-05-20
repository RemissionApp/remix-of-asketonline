
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Mission } from '@/types';
import { Badge } from './ui/badge';
import { Flag, ArrowRight, Award, CheckCircle } from 'lucide-react';
import { CosmicButton } from './CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';

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
  const { language, completeMission, userProfile } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [acceptedMission, setAcceptedMission] = useState(userProfile?.activeMission?.id === mission?.id);
  const [requirementStatus, setRequirementStatus] = useState<boolean[]>([]);
  
  if (!mission) return null;
  
  const handleCompleteMission = () => {
    toast.success(
      language === 'ru' ? 'Миссия выполнена! Вы получили награду.' : 
      language === 'es' ? '¡Misión completada! Has recibido tu recompensa.' : 
      'Mission completed! You received your reward.'
    );
    completeMission();
    if (onComplete) onComplete();
  };
  
  const handleAcceptMission = () => {
    setAcceptedMission(true);
    toast.success(
      language === 'ru' ? 'Вы приняли новую миссию!' : 
      language === 'es' ? '¡Has aceptado una nueva misión!' : 
      'You accepted a new mission!'
    );
    // Initialize requirement status array with false values
    setRequirementStatus(new Array(mission.requirements.length).fill(false));
  };
  
  const toggleRequirement = (index: number) => {
    const newStatus = [...requirementStatus];
    newStatus[index] = !newStatus[index];
    setRequirementStatus(newStatus);
    
    // Calculate progress
    const completedCount = newStatus.filter(status => status).length;
    const newProgress = Math.floor((completedCount / mission.requirements.length) * 100);
    setProgress(newProgress);
  };
  
  const getTitle = () => {
    switch(language) {
      case 'ru': return 'Космическая миссия';
      case 'es': return 'Misión cósmica';
      default: return 'Cosmic mission';
    }
  };
  
  const allCompleted = requirementStatus.length > 0 && requirementStatus.every(status => status);
  
  return (
    <div className={cn(
      'p-4 rounded-lg border border-cosmic-gold/30 bg-gradient-to-br from-cosmic-dark to-cosmic-accent/5',
      className
    )}>
      <div className="flex items-center mb-3">
        <Flag className="w-5 h-5 text-cosmic-gold mr-2" />
        <h3 className={language === 'en' ? "font-serif text-lg text-white" : "font-sans text-lg text-white"}>
          {getTitle()}
        </h3>
      </div>
      
      <h4 className={cn(
        "font-medium mb-1", 
        language === 'en' ? "font-serif text-cosmic-gold" : "text-cosmic-gold"
      )}>
        {mission.title}
      </h4>
      
      <p className={cn(
        "text-sm mb-4",
        language === 'en' ? "font-serif text-cosmic-secondary" : "text-cosmic-secondary"
      )}>
        {mission.description}
      </p>
      
      {acceptedMission ? (
        <>
          <ul className="space-y-3 mb-4">
            {mission.requirements.map((req, i) => (
              <li key={i} className="flex items-start">
                <div className="flex items-center h-5 mr-2">
                  <Checkbox
                    id={`req-${i}`}
                    checked={requirementStatus[i] || false}
                    onCheckedChange={() => toggleRequirement(i)}
                    className="border-cosmic-gold data-[state=checked]:bg-cosmic-gold data-[state=checked]:text-cosmic-dark"
                  />
                </div>
                <label 
                  htmlFor={`req-${i}`}
                  className={cn(
                    "text-sm text-white cursor-pointer",
                    requirementStatus[i] && "line-through opacity-70"
                  )}
                >
                  {req}
                </label>
              </li>
            ))}
          </ul>
          
          <div className="mb-4">
            <div className="flex justify-between text-xs text-cosmic-gold mb-1">
              <span>
                {language === 'ru' ? 'Прогресс' : 
                 language === 'es' ? 'Progreso' : 
                 'Progress'}
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </>
      ) : (
        <ul className="space-y-2 mb-4">
          {mission.requirements.map((req, i) => (
            <li key={i} className="flex items-start">
              <ArrowRight className="w-4 h-4 text-cosmic-gold mr-2 mt-0.5" />
              <span className="text-sm text-white">{req}</span>
            </li>
          ))}
        </ul>
      )}
      
      <div className="border-t border-cosmic-gold/20 pt-3 mb-3">
        <div className="flex items-center">
          <Award className="w-4 h-4 text-cosmic-gold mr-2" />
          <span className={cn(
            "text-sm text-cosmic-gold",
            language === 'en' ? "font-serif" : ""
          )}>
            {language === 'ru' ? 'Награда' : language === 'es' ? 'Recompensa' : 'Reward'}:
          </span>
        </div>
        <div className="flex items-center mt-2">
          <Badge variant="outline" className="bg-cosmic-gold/10 text-cosmic-gold border-cosmic-gold/30">
            +{mission.reward.energyPoints} {language === 'ru' ? 'очков' : language === 'es' ? 'puntos' : 'points'}
          </Badge>
          
          {mission.reward.achievement && (
            <Badge variant="outline" className="ml-2 bg-cosmic-accent/10 text-cosmic-accent border-cosmic-accent/30">
              {language === 'ru' ? 'Достижение' : language === 'es' ? 'Logro' : 'Achievement'}
            </Badge>
          )}
        </div>
      </div>
      
      {acceptedMission ? (
        <CosmicButton 
          className="w-full mt-2" 
          onClick={handleCompleteMission}
          disabled={!allCompleted}
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          {language === 'ru' ? 'Завершить миссию' : language === 'es' ? 'Completar misión' : 'Complete mission'}
        </CosmicButton>
      ) : (
        <CosmicButton 
          className="w-full mt-2" 
          onClick={handleAcceptMission}
        >
          {language === 'ru' ? 'Принять миссию' : language === 'es' ? 'Aceptar misión' : 'Accept mission'}
        </CosmicButton>
      )}
    </div>
  );
};
