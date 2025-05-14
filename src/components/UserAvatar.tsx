
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { SpiritualRank } from '@/types';
import { useAppStore } from '@/store/useAppStore';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showRankBorder?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  size = 'md', 
  className,
  showRankBorder = true
}) => {
  const { userProfile } = useAppStore();
  
  // Определяем размер аватара
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };
  
  // Определяем цвет обводки в зависимости от ранга
  const rankBorderColor = {
    'seeker': 'border-amber-400',
    'pilgrim': 'border-emerald-400',
    'warrior': 'border-indigo-400',
    'master': 'border-purple-500',
    'enlightened': 'border-cosmic-gold'
  };
  
  // Получаем путь к изображению аватара в зависимости от ранга
  const getAvatarImagePath = (rank: SpiritualRank): string => {
    switch (rank) {
      case 'seeker':
        return '/avatars/seeker.png';
      case 'pilgrim':
        return '/avatars/pilgrim.png';
      case 'warrior':
        return '/avatars/warrior.png';
      case 'master':
        return '/avatars/master.png';
      case 'enlightened':
        return '/avatars/enlightened.png';
      default:
        return '/avatars/seeker.png';
    }
  };
  
  const borderClass = showRankBorder 
    ? `border-2 ${rankBorderColor[userProfile.rank]}` 
    : '';
  
  return (
    <Avatar className={cn(
      sizeClasses[size], 
      borderClass,
      'animate-pulse-slow',
      className
    )}>
      <AvatarImage 
        src={getAvatarImagePath(userProfile.rank)} 
        alt={`${userProfile.rank} avatar`} 
      />
      <AvatarFallback className="bg-cosmic-dark text-cosmic-accent">
        {userProfile.name.substring(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
