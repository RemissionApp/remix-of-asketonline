import React, { memo } from 'react';
import { CircleDot } from 'lucide-react';
import { RankBadge } from './RankBadge';
import { useAppStore } from '@/store/useAppStore';
import { ProBadge } from './ProBadge';
import { ZodiacBadge } from './ZodiacBadge';
import { UserAvatar } from './UserAvatar';
import { useOptimizedTextToSpeech } from '@/hooks/useOptimizedTextToSpeech';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export const TopBar: React.FC = memo(() => {
  const { userProfile } = useAppStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleZodiacClick = () => {
    if (userProfile?.isPro && userProfile?.birthDate) {
      navigate('/full-horoscope');
    }
  };

  return (
    <div
      className="w-full bg-cosmic-dark/80 backdrop-blur-sm border-b border-cosmic-accent/20 h-16"
      style={{ marginTop: 'calc(env(safe-area-inset-top) + 0rem)' }}
    >
      {/* Energy points and controls group - responsive spacing */}
      <div
        className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} z-10 flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}
      >
        {/* Sound toggle */}
        <SoundToggle />

        {/* Zodiac badge - hide on very small screens or show conditionally */}
        {(!isMobile || userProfile?.isPro) && (
          <div
            onClick={handleZodiacClick}
            className={
              userProfile?.isPro && userProfile?.birthDate
                ? 'cursor-pointer'
                : ''
            }
          >
            <ZodiacBadge size="sm" />
          </div>
        )}

        {/* Energy points display - more compact on mobile */}
        <div
          className={`flex items-center ${isMobile ? 'px-2 py-1' : 'px-3 py-1.5'} bg-cosmic-dark/70 backdrop-blur-sm rounded-full border border-cosmic-gold/20 min-w-0`}
        >
          <CircleDot
            size={isMobile ? 14 : 16}
            className="text-cosmic-gold mr-1.5 shrink-0"
          />
          <span className="text-cosmic-gold font-medium text-sm truncate">
            {userProfile?.energyPoints || 0}
          </span>
        </div>
      </div>

      {/* Pro badge - repositioned on mobile to avoid overlaps */}
      {userProfile?.isPro && (
        <div
          className={`absolute z-10 ${
            isMobile
              ? 'top-2 left-1/2 -translate-x-1/2'
              : 'top-4 left-1/2 -translate-x-1/2'
          }`}
        >
          <ProBadge size="sm" />
        </div>
      )}

      {/* User avatar and rank badge - responsive positioning */}
      <div
        className={`absolute ${isMobile ? 'top-2 left-2' : 'top-4 left-4'} z-10 flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'} min-w-0`}
      >
        <UserAvatar size="sm" showZodiacBadge={false} />
        <RankBadge size="sm" />
      </div>
    </div>
  );
});
