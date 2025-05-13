
import React from 'react';
import { cn } from '@/lib/utils';
import { Mission } from '@/types';
import { Badge } from './ui/badge';
import { Flag, ArrowRight, Award } from 'lucide-react';
import { CosmicButton } from './CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

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
  const { language, completeMission } = useAppStore();
  
  if (!mission) return null;
  
  const handleCompleteMission = () => {
    completeMission(mission.id);
    if (onComplete) onComplete();
  };
  
  const getTitle = () => {
    switch(language) {
      case 'ru': return 'Космическая миссия';
      case 'es': return 'Misión cósmica';
      default: return 'Cosmic mission';
    }
  };
  
  return (
    <div className={cn(
      'p-4 rounded-lg border border-cosmic-gold/30 bg-gradient-to-br from-cosmic-dark to-cosmic-accent/5',
      className
    )}>
      <div className="flex items-center mb-3">
        <Flag className="w-5 h-5 text-cosmic-gold mr-2" />
        <h3 className="text-lg text-white font-serif">{getTitle()}</h3>
      </div>
      
      <h4 className="text-cosmic-gold font-medium mb-1">{mission.title}</h4>
      <p className="text-sm text-cosmic-secondary mb-4">{mission.description}</p>
      
      <ul className="space-y-2 mb-4">
        {mission.requirements.map((req, i) => (
          <li key={i} className="flex items-start">
            <ArrowRight className="w-4 h-4 text-cosmic-gold mr-2 mt-0.5" />
            <span className="text-sm text-white">{req}</span>
          </li>
        ))}
      </ul>
      
      <div className="border-t border-cosmic-gold/20 pt-3 mb-3">
        <div className="flex items-center">
          <Award className="w-4 h-4 text-cosmic-gold mr-2" />
          <span className="text-sm text-cosmic-gold">
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
      
      <CosmicButton 
        className="w-full mt-2" 
        onClick={handleCompleteMission}
      >
        {language === 'ru' ? 'Завершить миссию' : language === 'es' ? 'Completar misión' : 'Complete mission'}
      </CosmicButton>
    </div>
  );
};
