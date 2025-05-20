
import React from 'react';
import { cn } from '@/lib/utils';
import { Circle, Award, Calendar, MessageSquare, ScrollText } from 'lucide-react';
import { Achievement } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { formatDateLong } from '@/utils/dateFormatUtils';

interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ 
  achievement,
  className
}) => {
  const { language } = useAppStore();
  
  const getIcon = () => {
    switch(achievement.icon) {
      case 'award': return <Award className="w-5 h-5" />;
      case 'calendar': return <Calendar className="w-5 h-5" />;
      case 'message-square': return <MessageSquare className="w-5 h-5" />;
      case 'scroll': return <ScrollText className="w-5 h-5" />;
      default: return <Circle className="w-5 h-5" />;
    }
  };
  
  return (
    <div className={cn(
      'p-4 rounded-lg border transition-all',
      achievement.unlocked 
        ? 'bg-cosmic-accent/10 border-cosmic-accent/30' 
        : 'bg-cosmic-dark/40 border-cosmic-secondary/20 opacity-50',
      className
    )}>
      <div className="flex items-center">
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center mr-3',
          achievement.unlocked ? 'bg-cosmic-accent/20 text-cosmic-accent' : 'bg-cosmic-secondary/10 text-cosmic-secondary'
        )}>
          {getIcon()}
        </div>
        <div>
          <h3 className="text-white font-medium">{achievement.title}</h3>
          <p className="text-sm text-cosmic-secondary">{achievement.description}</p>
        </div>
      </div>
      
      {achievement.unlocked && achievement.unlockedDate && (
        <div className="mt-2 text-right">
          <span className="text-xs text-cosmic-secondary">
            {language === 'ru' ? 'Получено: ' : language === 'es' ? 'Recibido: ' : 'Received: '}
            {formatDateLong(new Date(achievement.unlockedDate), language)}
          </span>
        </div>
      )}
    </div>
  );
};
