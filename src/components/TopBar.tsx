
import React from 'react';
import { CircleDot } from 'lucide-react';
import { RankBadge } from './RankBadge';
import { useAppStore } from '@/store/useAppStore';
import { ProBadge } from './ProBadge';
import { ZodiacBadge } from './ZodiacBadge';
import { UserAvatar } from './UserAvatar';
import { SoundToggleButton } from './SoundToggleButton';
import { useNavigate } from 'react-router-dom';

export const TopBar: React.FC = () => {
  const { userProfile } = useAppStore();
  const navigate = useNavigate();
  
  const handleZodiacClick = () => {
    if (userProfile?.isPro && userProfile?.birthDate) {
      navigate('/full-horoscope');
    }
  };
  
  return (
    <>
      {/* Energy points, Sound toggle and Zodiac badges group */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        {/* Sound toggle button */}
        <SoundToggleButton size="sm" variant="ghost" />
        
        {/* Zodiac badge - now positioned to the left of energy points */}
        <div onClick={handleZodiacClick} className={userProfile?.isPro && userProfile?.birthDate ? "cursor-pointer" : ""}>
          <ZodiacBadge size="sm" />
        </div>
        
        {/* Energy points display */}
        <div className="flex items-center px-3 py-1.5 bg-cosmic-dark/70 backdrop-blur-sm rounded-full border border-cosmic-gold/20">
          <CircleDot size={16} className="text-cosmic-gold mr-1.5" />
          <span className="text-cosmic-gold font-medium">{userProfile?.energyPoints || 0}</span>
        </div>
      </div>
      
      {/* Pro badge if user has pro subscription */}
      {userProfile?.isPro && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <ProBadge size="sm" />
        </div>
      )}
      
      {/* User avatar and rank badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
        <UserAvatar size="sm" showZodiacBadge={false} />
        <RankBadge size="sm" />
      </div>
    </>
  );
};
