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
      className="pointer-events-none w-full"
      style={{
        paddingTop: isAndroid()
          ? `calc(env(safe-area-inset-top) + 0.6rem)`
          : `calc(env(safe-area-inset-top) + 0.4rem)`,
        paddingLeft: 'calc(env(safe-area-inset-left) + 0.75rem)',
        paddingRight: 'calc(env(safe-area-inset-right) + 0.75rem)',
      }}
    >
      <div className="pointer-events-auto flex items-center justify-between gap-2">
        {/* Left: avatar pill */}
        <div className="glass-medium glass-shine relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
          <UserAvatar size="sm" showZodiacBadge={false} />
        </div>

        {/* Center: rank + Pro */}
        <div className="glass glass-shine relative rounded-full px-3 py-1.5 flex items-center gap-2 overflow-hidden">
          <RankBadge size="sm" />
          {userProfile?.isPro && <ProBadge size="sm" />}
        </div>

        {/* Right group */}
        <div className="flex items-center gap-2">
          {(!isMobile || userProfile?.isPro) && (
            <div
              onClick={handleZodiacClick}
              className={`glass glass-shine relative rounded-full px-2 py-1 overflow-hidden ${
                userProfile?.isPro && userProfile?.birthDate ? 'cursor-pointer' : ''
              }`}
            >
              <ZodiacBadge size="sm" />
            </div>
          )}
          <div className="glass glass-shine relative rounded-full px-3 py-1.5 flex items-center gap-1.5 overflow-hidden">
            <CircleDot size={isMobile ? 12 : 14} className="text-cosmic-gold shrink-0" />
            <span className="text-xs text-white/85 truncate">{userProfile?.energyPoints || 0}</span>
          </div>
          <div className="glass glass-shine relative rounded-full overflow-hidden">
            <SoundToggle />
          </div>
        </div>
      </div>
    </div>
  );
});
