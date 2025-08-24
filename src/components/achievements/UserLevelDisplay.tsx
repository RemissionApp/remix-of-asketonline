import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface UserLevelDisplayProps {
  level: number;
  experiencePoints: number;
  experienceToNextLevel: number;
  totalEnergyEarned: number;
  className?: string;
}

export const UserLevelDisplay: React.FC<UserLevelDisplayProps> = ({
  level,
  experiencePoints,
  experienceToNextLevel,
  totalEnergyEarned,
  className
}) => {
  const { language } = useAppStore();

  const getText = (key: string) => {
    const texts = {
      ru: {
        level: 'Уровень',
        experience: 'Опыт',
        nextLevel: 'До следующего уровня',
        totalEnergy: 'Всего энергии',
        points: 'очков'
      },
      es: {
        level: 'Nivel',
        experience: 'Experiencia',
        nextLevel: 'Al siguiente nivel',
        totalEnergy: 'Energía total',
        points: 'puntos'
      },
      en: {
        level: 'Level',
        experience: 'Experience',
        nextLevel: 'To next level',
        totalEnergy: 'Total energy',
        points: 'points'
      }
    };
    return texts[language]?.[key] || texts.en[key] || key;
  };

  const getLevelTitle = (level: number) => {
    const titles = {
      ru: {
        1: 'Новичок',
        5: 'Искатель',
        10: 'Хранитель',
        15: 'Мастер',
        20: 'Мудрец',
        25: 'Магистр',
        30: 'Легенда'
      },
      es: {
        1: 'Novato',
        5: 'Buscador',
        10: 'Guardián',
        15: 'Maestro',
        20: 'Sabio',
        25: 'Magistral',
        30: 'Leyenda'
      },
      en: {
        1: 'Novice',
        5: 'Seeker',
        10: 'Keeper',
        15: 'Master',
        20: 'Sage',
        25: 'Magister',
        30: 'Legend'
      }
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
    if (level >= 30) return 'text-yellow-400'; // Legendary
    if (level >= 20) return 'text-purple-400'; // Epic
    if (level >= 10) return 'text-blue-400';   // Rare
    return 'text-gray-400'; // Common
  };

  const progressPercentage = experienceToNextLevel > 0 
    ? ((experiencePoints - (experiencePoints - experienceToNextLevel)) / experienceToNextLevel) * 100
    : 100;

  return (
    <div className={cn('cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6', className)}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cosmic-accent/20">
              <Crown className={cn('w-6 h-6', getLevelColor(level))} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={cn('text-2xl font-bold', getLevelColor(level))}>
                  {level}
                </span>
                <span className="text-cosmic-silver text-sm">
                  {getText('level')}
                </span>
              </div>
              <div className="text-cosmic-gold text-sm font-medium">
                {getLevelTitle(level)}
              </div>
            </div>
          </div>

          <Badge 
            variant="outline" 
            className="bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/30"
          >
            <Zap className="w-3 h-3 mr-1" />
            {totalEnergyEarned} {getText('points')}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-cosmic-silver">
              {getText('experience')}
            </span>
            <span className="text-cosmic-gold">
              {experiencePoints} XP
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2"
          />
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-cosmic-silver/70">
              {getText('nextLevel')}
            </span>
            <span className="text-cosmic-silver/70">
              {experienceToNextLevel} XP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-cosmic-silver/70">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>{getText('totalEnergy')}: {totalEnergyEarned}</span>
          </div>
        </div>
      </div>
    </div>
  );
};