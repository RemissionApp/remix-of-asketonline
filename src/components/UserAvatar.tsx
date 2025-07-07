
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { SpiritualRank } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { ZodiacBadge } from './ZodiacBadge';
import { getZodiacSign } from '@/utils/zodiac';
import { supabase } from '@/lib/supabase';
import { createLogger } from '@/utils/logger';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showRankBorder?: boolean;
  showZodiacBadge?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  size = 'md', 
  className,
  showRankBorder = true,
  showZodiacBadge = true
}) => {
  const logger = createLogger('UserAvatar');
  const { userProfile, user } = useAppStore();
  
  // Define size classes
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };
  
  // Define border color based on rank
  const rankBorderColor = {
    'seeker': 'border-amber-400',
    'pilgrim': 'border-emerald-400',
    'warrior': 'border-indigo-400',
    'master': 'border-purple-500',
    'enlightened': 'border-cosmic-gold'
  };
  
  // Get avatar URL from userProfile if available
  const getAvatarUrl = (): string => {
    // Check if userProfile has an avatar_url
    if (userProfile?.avatar_url) {
      logger.debug("Using avatar from userProfile", { avatar_url: userProfile.avatar_url });
      return userProfile.avatar_url;
    }
    
    // If no custom avatar, use rank-based default avatar
    logger.debug("Using default avatar based on rank", { rank: userProfile?.rank });
    return getAvatarImagePath(userProfile.rank as SpiritualRank);
  };
  
  // Get path to avatar image based on rank
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
    ? `border-2 ${rankBorderColor[userProfile.rank as keyof typeof rankBorderColor] || 'border-amber-400'}` 
    : '';

  const hasZodiac = !!userProfile?.birthDate;
    
  return (
    <div className="relative">
      <Avatar className={cn(
        sizeClasses[size], 
        borderClass,
        'animate-pulse-slow',
        className
      )}>
        <AvatarImage 
          src={getAvatarUrl()} 
          alt={`${userProfile.name} avatar`} 
        />
        <AvatarFallback className="bg-cosmic-dark text-cosmic-accent">
          {userProfile.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      {showZodiacBadge && hasZodiac && (
        <div className="absolute -bottom-1 -right-1">
          <ZodiacBadge size="sm" showTooltip={true} />
        </div>
      )}
    </div>
  );
};
