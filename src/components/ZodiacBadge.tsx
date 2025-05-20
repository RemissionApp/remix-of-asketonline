
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ZodiacSign, getZodiacSign, zodiacData } from '@/utils/zodiac';
import { useTranslations } from '@/hooks/useTranslations';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ZodiacBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const ZodiacBadge: React.FC<ZodiacBadgeProps> = ({ 
  size = 'md', 
  showTooltip = true 
}) => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  
  const birthDate = userProfile?.birthDate;
  const zodiacSign = birthDate ? getZodiacSign(new Date(birthDate)) : null;
  
  if (!zodiacSign) return null;
  
  const zodiacInfo = zodiacData[zodiacSign];
  const zodiacName = zodiacInfo.name[language as keyof typeof zodiacInfo.name] || zodiacInfo.name.en;
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-6 w-6 text-lg';
      case 'lg':
        return 'h-10 w-10 text-2xl';
      case 'md':
      default:
        return 'h-8 w-8 text-xl';
    }
  };
  
  const badge = (
    <div 
      className={`flex items-center justify-center ${getSizeClasses()} rounded-full bg-cosmic-accent/10 backdrop-blur-sm border border-cosmic-accent/30`}
      data-zodiac={zodiacSign}
    >
      <span className="text-cosmic-accent">{zodiacInfo.symbol}</span>
    </div>
  );
  
  if (!showTooltip) return badge;
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent className="bg-cosmic-accent/10 backdrop-blur-sm border-cosmic-accent/30 text-white">
          <div className="text-center">
            <div className="text-cosmic-accent font-medium">{zodiacName}</div>
            <div className="text-xs text-cosmic-secondary">{zodiacInfo.element} • {zodiacInfo.dates}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
