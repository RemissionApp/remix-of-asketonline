
import React from 'react';
import { CircleDot } from 'lucide-react';
import { RankBadge } from './RankBadge';
import { useAppStore } from '@/store/useAppStore';
import { ProBadge } from './ProBadge';
import { ZodiacBadge } from './ZodiacBadge';

export const TopBar: React.FC = () => {
  const { userProfile } = useAppStore();
  
  return (
    <>
      {/* Energy points display */}
      <div className="absolute top-4 right-4 z-20 flex items-center px-3 py-1.5 bg-cosmic-dark/70 backdrop-blur-sm rounded-full border border-cosmic-gold/20">
        <CircleDot size={16} className="text-cosmic-gold mr-1.5" />
        <span className="text-cosmic-gold font-medium">{userProfile?.energyPoints || 0}</span>
      </div>
      
      {/* Zodiac badge */}
      <div className="absolute top-4 right-16 z-20">
        <ZodiacBadge size="sm" />
      </div>
      
      {/* Pro badge if user has pro subscription */}
      {userProfile?.isPro && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <ProBadge size="sm" />
        </div>
      )}
      
      {/* Rank badge */}
      <div className="absolute top-4 left-4 z-20">
        <RankBadge size="sm" />
      </div>
    </>
  );
};
