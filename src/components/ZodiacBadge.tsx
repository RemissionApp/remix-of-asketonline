import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ZodiacSign, getZodiacSign, zodiacData } from '@/utils/zodiac';
import { useTranslations } from '@/hooks/useTranslations';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ZodiacBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const ZodiacBadge: React.FC<ZodiacBadgeProps> = ({
  size = 'md',
  showTooltip = true,
}) => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();

  const birthDate = userProfile?.birthDate;
  const zodiacSign = getZodiacSign(birthDate || null);

  if (!zodiacSign) return null;

  const zodiacInfo = zodiacData[zodiacSign];
  const zodiacName =
    zodiacInfo.name[language as keyof typeof zodiacInfo.name] ||
    zodiacInfo.name.en;

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

  // Временно отключаем tooltip для отладки
  return badge;
};
