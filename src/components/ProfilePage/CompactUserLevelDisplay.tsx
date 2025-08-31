import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Crown, Zap, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface CompactUserLevelDisplayProps {
  level: number;
  experiencePoints: number;
  experienceToNextLevel: number;
  totalEnergyEarned: number;
  className?: string;
}

export const CompactUserLevelDisplay: React.FC<CompactUserLevelDisplayProps> = ({
  level,
  experiencePoints,
  experienceToNextLevel,
  totalEnergyEarned,
  className
}) => {
  const { language } = useAppStore();

  const getText = (key: string) => {
    const texts = {
      ru: { level: 'Уровень', xp: 'XP', energy: 'Энергия' },
      es: { level: 'Nivel', xp: 'XP', energy: 'Energía' },
      en: { level: 'Level', xp: 'XP', energy: 'Energy' }
    };
    return texts[language]?.[key] || texts.en[key] || key;
  };

  const getLevelTitle = (level: number) => {
    const titles = {
      ru: { 1: 'Новичок', 5: 'Искатель', 10: 'Хранитель', 15: 'Мастер', 20: 'Мудрец', 25: 'Магистр', 30: 'Легенда' },
      es: { 1: 'Novato', 5: 'Buscador', 10: 'Guardián', 15: 'Maestro', 20: 'Sabio', 25: 'Magistral', 30: 'Leyenda' },
      en: { 1: 'Novice', 5: 'Seeker', 10: 'Keeper', 15: 'Master', 20: 'Sage', 25: 'Magister', 30: 'Legend' }
    };

    const langTitles = titles[language] || titles.en;
    const titleLevels = Object.keys(langTitles).map(Number).sort((a, b) => b - a);
    
    for (const titleLevel of titleLevels) {
      if (level >= titleLevel) {
        return langTitles[titleLevel];
      }
    }
    return langTitles[1];
  };

  const getLevelColor = (level: number) => {
    if (level >= 30) return 'text-cosmic-gold'; // Legendary
    if (level >= 20) return 'text-cosmic-accent'; // Epic
    if (level >= 10) return 'text-cosmic-silver'; // Rare
    return 'text-cosmic-text/70'; // Common
  };

  const progressPercentage = experienceToNextLevel > 0 
    ? ((experiencePoints - (experiencePoints - experienceToNextLevel)) / experienceToNextLevel) * 100
    : 100;

  return (
    <div className={cn('cosmic-block rounded-lg p-space-md mb-space-lg', className)}>
      <div className="flex items-center justify-between mb-space-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cosmic-accent/20 animate-pulse-soft">
            <Crown className={cn('w-5 h-5', getLevelColor(level))} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn('text-xl font-bold', getLevelColor(level))}>
                {level}
              </span>
              <span className="text-cosmic-text/70 text-sm">
                {getText('level')}
              </span>
            </div>
            <div className="text-cosmic-gold text-xs font-medium">
              {getLevelTitle(level)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-space-sm text-xs">
          <div className="flex items-center gap-1 text-cosmic-accent">
            <Zap className="w-3 h-3" />
            <span>{totalEnergyEarned}</span>
          </div>
          <div className="flex items-center gap-1 text-cosmic-silver">
            <TrendingUp className="w-3 h-3" />
            <span>{experiencePoints} {getText('xp')}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Progress 
          value={progressPercentage} 
          className="h-1.5 bg-cosmic-accent/20"
        />
        <div className="flex justify-between text-xs text-cosmic-text/50">
          <span>{getText('xp')}</span>
          <span>{experienceToNextLevel} до след. ур.</span>
        </div>
      </div>
    </div>
  );
};