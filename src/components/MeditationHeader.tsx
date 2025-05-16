
import React from 'react';
import { ArrowLeft, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProBadge } from '@/components/ProBadge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  onProButtonClick
}) => {
  return (
    <div className="relative z-10 flex items-center justify-between px-4 pt-4">
      <button onClick={onBackClick} className="p-2 text-cosmic-accent">
        <ArrowLeft size={24} />
      </button>
      
      {showProButton ? (
        <TooltipProvider>
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
        </TooltipProvider>
      ) : isPro && <ProBadge size="md" />}
    </div>
  );
};
