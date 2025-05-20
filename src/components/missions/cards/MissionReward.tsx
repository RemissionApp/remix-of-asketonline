
import React from 'react';
import { cn } from '@/lib/utils';
import { Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MissionReward as RewardType } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface MissionRewardProps {
  reward: RewardType;
}

export const MissionReward: React.FC<MissionRewardProps> = ({ reward }) => {
  const { language } = useAppStore();
  
  return (
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
          +{reward.energyPoints} {language === 'ru' ? 'очков' : language === 'es' ? 'puntos' : 'points'}
        </Badge>
        
        {reward.achievement && (
          <Badge variant="outline" className="ml-2 bg-cosmic-accent/10 text-cosmic-accent border-cosmic-accent/30">
            {language === 'ru' ? 'Достижение' : language === 'es' ? 'Logro' : 'Achievement'}
          </Badge>
        )}
      </div>
    </div>
  );
};
