import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  showZodiacBadge = true,
}) => {
  const logger = createLogger('UserAvatar');
  const { userProfile, user } = useAppStore();
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);

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

  // Get avatar URL from userProfile if available
  // Reset error state when userProfile.avatar_url changes
  useEffect(() => {
    setImageLoadError(false);
    setImageLoaded(false);
  }, [userProfile.avatar_url]);

  // Listen for avatar updates to force re-render
  useEffect(() => {
    const handleAvatarUpdate = (event: any) => {
      logger.debug('Avatar update event received', event.detail);
      setImageLoadError(false);
      setImageLoaded(false);
      setAvatarKey(prev => prev + 1);
      
      // Force immediate state refresh
      setTimeout(() => {
        setImageLoadError(false);
        setImageLoaded(false);
      }, 50);
    };

    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => window.removeEventListener('avatarUpdated', handleAvatarUpdate);
  }, []);

  // Force re-render when userProfile.avatar_url changes
  useEffect(() => {
    logger.debug('UserProfile avatar_url changed', { avatar_url: userProfile?.avatar_url });
    setImageLoadError(false);
    setImageLoaded(false);
    setAvatarKey(prev => prev + 1);
  }, [userProfile?.avatar_url]);

  const getAvatarUrl = (): string => {
    logger.debug('Getting avatar URL', { 
      hasAvatar: !!userProfile?.avatar_url, 
      imageLoadError, 
      rank: userProfile?.rank 
    });
    
    // Check if userProfile has an avatar_url
    if (userProfile?.avatar_url && !imageLoadError) {
      // Use timestamp from localStorage for cache-busting when available
      const uploadTimestamp = localStorage.getItem('avatar-upload-timestamp');
      const cacheBuster = uploadTimestamp ? uploadTimestamp : Date.now();
      const finalUrl = userProfile.avatar_url.includes('supabase') 
        ? `${userProfile.avatar_url}?t=${cacheBuster}&v=${avatarKey}` 
        : userProfile.avatar_url;
      
      logger.debug('Using custom avatar', { finalUrl, cacheBuster, avatarKey });
      return finalUrl;
    }

    // If no custom avatar or error, use rank-based default avatar
    const defaultUrl = getAvatarImagePath(userProfile?.rank as SpiritualRank);
    logger.debug('Using default avatar', { defaultUrl, rank: userProfile?.rank });
    return defaultUrl;
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
      <Avatar
        className={cn(
          sizeClasses[size],
          borderClass,
          'animate-pulse-slow',
          className
        )}
        key={avatarKey}
      >
        <AvatarImage 
          src={getAvatarUrl()} 
          alt={`${userProfile?.name || 'User'} avatar`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoadError(true)}
          className="object-cover"
        />
        <AvatarFallback className="bg-cosmic-accent/20 text-cosmic-primary font-bold">
          {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
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
