
import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { SpiritualRank } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

interface RankBadgeProps {
  rank?: SpiritualRank;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RankBadge: React.FC<RankBadgeProps> = ({ 
  rank, 
  showIcon = true, 
  className,
  size = 'md'
}) => {
  const { userProfile, language } = useAppStore();
  const currentRank = rank || userProfile.rank as SpiritualRank;
  
  const getRankName = (rank: SpiritualRank) => {
    if (language === 'ru') {
      switch(rank) {
        case 'seeker': return 'Искатель';
        case 'apprentice': return 'Ученик';
        case 'adept': return 'Адепт';
        case 'master': return 'Мастер';
        case 'grandmaster': return 'Грандмастер';
        case 'pilgrim': return 'Пилигрим';
        case 'warrior': return 'Воин Света';
        case 'enlightened': return 'Просветлённый';
      }
    } else if (language === 'es') {
      switch(rank) {
        case 'seeker': return 'Buscador';
        case 'apprentice': return 'Aprendiz';
        case 'adept': return 'Adepto';
        case 'master': return 'Maestro';
        case 'grandmaster': return 'Gran Maestro';
        case 'pilgrim': return 'Peregrino';
        case 'warrior': return 'Guerrero de Luz';
        case 'enlightened': return 'Iluminado';
      }
    } else {
      switch(rank) {
        case 'seeker': return 'Seeker';
        case 'apprentice': return 'Apprentice';
        case 'adept': return 'Adept';
        case 'master': return 'Master';
        case 'grandmaster': return 'Grandmaster';
        case 'pilgrim': return 'Pilgrim';
        case 'warrior': return 'Light Warrior';
        case 'enlightened': return 'Enlightened';
      }
    }
  };
  
  const getRankColor = (rank: SpiritualRank) => {
    switch(rank) {
      case 'seeker': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'apprentice': return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'adept': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'master': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'grandmaster': return 'bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/40';
      case 'pilgrim': return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'warrior': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'enlightened': return 'bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/40';
    }
  };
  
  const sizeClasses = {
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-sm py-1 px-2',
    lg: 'text-base py-1 px-3'
  };
  
  return (
    <Badge 
      className={cn(
        'rounded-md border',
        getRankColor(currentRank),
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Star className="w-3 h-3 mr-1" />}
      {getRankName(currentRank)}
    </Badge>
  );
};
