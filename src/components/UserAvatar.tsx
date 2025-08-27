import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { SpiritualRank } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { useOptimizedProfileCache } from '@/hooks/useOptimizedProfileCache';
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
  showZodiacBadge = true,
}) => {
  const logger = createLogger('UserAvatar');
  const { userProfile, user } = useAppStore();
  
  // Use optimized profile cache to get latest data
  const { profile: cachedProfile, refreshProfile } = useOptimizedProfileCache(user as any);
  
  // Use cached profile if available, fallback to store
  const currentProfile = cachedProfile || userProfile;

  // Listen for avatar updates and force refresh
  React.useEffect(() => {
    const handleAvatarUpdate = () => {
      logger.debug('Avatar update event received, refreshing profile');
      refreshProfile();
      // Force component rerender by triggering state change
      setForceRefresh(prev => prev + 1);
    };

    window.addEventListener('avatar-updated', handleAvatarUpdate);
    return () => {
      window.removeEventListener('avatar-updated', handleAvatarUpdate);
    };
  }, [refreshProfile]);

  // Force refresh state to trigger rerenders
  const [forceRefresh, setForceRefresh] = React.useState(0);

  // Define size classes
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  // Define border color based on rank
  const rankBorderColor = {
    seeker: 'border-amber-400',
    pilgrim: 'border-emerald-400',
    warrior: 'border-indigo-400',
    master: 'border-purple-500',
    enlightened: 'border-cosmic-gold',
  };

  // Get avatar URL from current profile (cached or store) with cache busting
  const getAvatarUrl = (): string => {
    // Check if current profile has an avatar_url
    if (currentProfile?.avatar_url) {
      // Add cache busting timestamp to force image refresh
      const cacheBustingUrl = `${currentProfile.avatar_url}?v=${Date.now()}`;
      logger.debug('Using avatar from profile with cache busting', {
        original_url: currentProfile.avatar_url,
        cache_busted_url: cacheBustingUrl,
        source: cachedProfile ? 'cache' : 'store'
      });
      return cacheBustingUrl;
    }

    // If no custom avatar, use rank-based default avatar
    logger.debug('Using default avatar based on rank', {
      rank: currentProfile?.rank,
      source: cachedProfile ? 'cache' : 'store'
    });
    return getAvatarImagePath(currentProfile?.rank as SpiritualRank || 'seeker');
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
    ? `border-2 ${rankBorderColor[currentProfile?.rank as keyof typeof rankBorderColor] || 'border-amber-400'}`
    : '';

  const hasZodiac = !!currentProfile?.birthDate;

  return (
    <div className="relative">
      <Avatar
        key={`avatar-${forceRefresh}-${currentProfile?.avatar_url || 'default'}`}
        className={cn(
          sizeClasses[size],
          borderClass,
          'animate-pulse-slow',
          className
        )}
      >
        <AvatarImage 
          src={getAvatarUrl()} 
          alt={`${currentProfile?.name || 'User'} avatar`}
          onLoad={() => logger.debug('Avatar image loaded successfully')}
          onError={() => logger.warn('Avatar image failed to load')}
        />
        <AvatarFallback className="bg-cosmic-dark text-cosmic-accent">
          {(currentProfile?.name || 'US').substring(0, 2).toUpperCase()}
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
