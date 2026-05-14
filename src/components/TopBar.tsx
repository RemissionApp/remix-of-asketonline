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
import { isAndroid } from '@/utils/platform';
import { useEntitlement } from '@/hooks/useEntitlement';

export const TopBar: React.FC = memo(() => {
  const { userProfile } = useAppStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isUnlocked, isPro } = useEntitlement();

  const handleZodiacClick = () => {
    if (isUnlocked && userProfile?.birthDate) {
      navigate('/full-horoscope');
    }
  };

  return (
    <div
      className="pointer-events-none w-full"
      style={{
        paddingTop: isAndroid()
          ? `calc(env(safe-area-inset-top) + 0.6rem)`
          : `calc(env(safe-area-inset-top) + 0.4rem)`,
        paddingLeft: 'calc(env(safe-area-inset-left) + 0.75rem)',
        paddingRight: 'calc(env(safe-area-inset-right) + 0.75rem)',
      }}
    >
      <div className="glass-strong glass-shimmer pointer-events-auto relative flex items-center justify-between flex-row-reverse rounded-2xl px-3 py-2 min-h-14 overflow-hidden">
      {/* Energy points and controls group - responsive spacing */}
      <div className="flex items-center space-x-1.5 relative z-10">
        {/* Sound toggle */}
        <SoundToggle />

        {/* Zodiac badge - hide on very small screens or show conditionally */}
        {(!isMobile || isUnlocked) && (
          <div
            onClick={handleZodiacClick}
            className={
              isUnlocked && userProfile?.birthDate
                ? 'cursor-pointer'
                : ''
            }
          >
            <ZodiacBadge size="sm" />
          </div>
        )}

        {/* Energy points display - glass pill */}
        <div className="flex items-center px-2.5 py-1.5 rounded-full backdrop-blur-md border border-cosmic-gold/30 min-w-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(232,193,108,0.15) 0%, rgba(232,193,108,0.05) 100%)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.3)',
          }}
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
      {isPro && (
        <div className="absolute z-20 top-1 left-1/2 -translate-x-1/2">
          <ProBadge size="sm" />
        </div>
      )}

      {/* User avatar and rank badge - responsive positioning */}
      <div className="flex items-center space-x-1.5 min-w-0 relative z-10">
        <UserAvatar size="sm" showZodiacBadge={false} />
        <RankBadge size="sm" />
      </div>
      </div>
    </div>
  );
});
