import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { usePWAFeatures } from '@/hooks/usePWAFeatures';

interface HapticButtonProps extends ButtonProps {
  hapticType?:
    | 'tap'
    | 'success'
    | 'error'
    | 'notification'
    | 'warning'
    | 'energyBoost';
  children: React.ReactNode;
}

export const HapticButton: React.FC<HapticButtonProps> = ({
  hapticType = 'tap',
  onClick,
  children,
  ...props
}) => {
  const { haptic } = usePWAFeatures();

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Выполняем haptic feedback
    switch (hapticType) {
      case 'tap':
        await haptic.buttonTap();
        break;
      case 'success':
        await haptic.success();
        break;
      case 'error':
        await haptic.error();
        break;
      case 'notification':
        await haptic.notification();
        break;
      case 'warning':
        await haptic.warning();
        break;
      case 'energyBoost':
        await haptic.energyBoost();
        break;
      default:
        await haptic.buttonTap();
    }

    // Вызываем оригинальный onClick если он есть
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
};
