import React from 'react';
import { ArrowLeft, Crown, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProBadge } from '@/components/ProBadge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MeditationHeaderProps {
  isPro?: boolean;
  onBackClick: () => void;
  showProButton?: boolean;
  onProButtonClick?: () => void;
}

export const MeditationHeader: React.FC<MeditationHeaderProps> = ({
  isPro,
  onBackClick,
  showProButton,
  onProButtonClick,
}) => {
  const { userProfile } = useAppStore();

  return (
    <div className="relative z-10">
      {/* User Info Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-cosmic-dark/60 backdrop-blur-md border-b border-cosmic-accent/10">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={userProfile.avatar_url || ''} />
            <AvatarFallback className="bg-cosmic-accent/20 text-cosmic-accent text-sm">
              {userProfile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="text-white text-sm font-medium">
              {userProfile.name}
            </span>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-cosmic-gold" />
              <span className="text-cosmic-gold text-xs">
                {userProfile.energyPoints} энергии
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-cosmic-accent/20 px-2 py-1 rounded-full">
            <span className="text-cosmic-accent text-xs capitalize">
              {userProfile.rank}
            </span>
          </div>
          {userProfile.isPro && <ProBadge size="sm" />}
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between px-4 pt-4">
        <button onClick={onBackClick} className="p-2 text-cosmic-accent">
          <ArrowLeft size={24} />
        </button>

        {showProButton ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-cosmic-gold bg-cosmic-dark/60 hover:bg-cosmic-accent/20"
                onClick={onProButtonClick}
              >
                <Crown size={18} className="text-cosmic-gold" />
                <span>PRO медитации</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Перейти к PRO медитациям</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          isPro && <ProBadge size="md" />
        )}
      </div>
    </div>
  );
};
