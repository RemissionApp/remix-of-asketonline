import React from 'react';
import { Trophy, Zap, Star } from 'lucide-react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface CompactUserProgressProps {
  className?: string;
}

export const CompactUserProgress: React.FC<CompactUserProgressProps> = ({ className }) => {
  const { stats, isLoading } = useUserProgress();
  const { language } = useAppStore();

  const getText = (key: 'level' | 'energy' | 'missions') => {
    const texts = {
      ru: {
        level: 'Ур.',
        energy: 'Энергия',
        missions: 'Миссий'
      },
      es: {
        level: 'Niv.',
        energy: 'Energía',
        missions: 'Misiones'
      },
      en: {
        level: 'Lvl',
        energy: 'Energy',
        missions: 'Missions'
      }
    };
    return texts[language][key];
  };

  if (isLoading) {
    return (
      <div className={cn(
        "flex items-center gap-3 animate-pulse",
        className
      )}>
        <div className="h-6 w-16 bg-cosmic-dark/60 rounded"></div>
        <div className="h-6 w-16 bg-cosmic-dark/60 rounded"></div>
        <div className="h-6 w-16 bg-cosmic-dark/60 rounded"></div>
      </div>
    );
  }

  const progressPercent = stats.experienceToNextLevel > 0 
    ? ((stats.experiencePoints % 100) / 100) * 100 
    : 0;

  return (
    <div className={cn(
      "flex items-center gap-3 text-sm",
      className
    )}>
      {/* Level Display */}
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <Star className="w-4 h-4 text-cosmic-gold" />
          <div 
            className="absolute inset-0 bg-cosmic-gold rounded-full animate-glow-pulse" 
            style={{ 
              width: `${Math.min(progressPercent, 100)}%`,
              opacity: 0.3 
            }}
          />
        </div>
        <span className="text-cosmic-gold font-semibold">
          {getText('level')} {stats.level}
        </span>
      </div>

      {/* Energy Display */}
      <div className="flex items-center gap-1.5">
        <Zap className="w-4 h-4 text-cosmic-accent" />
        <span className="text-cosmic-accent font-medium">
          {stats.totalEnergyEarned}
        </span>
      </div>

      {/* Missions Display */}
      <div className="flex items-center gap-1.5">
        <Trophy className="w-4 h-4 text-cosmic-secondary" />
        <span className="text-cosmic-secondary font-medium">
          {stats.missionsCompleted}
        </span>
      </div>
    </div>
  );
};