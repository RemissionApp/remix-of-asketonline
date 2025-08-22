import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  isRecording,
  isProcessing,
  isSupported,
  onClick,
  disabled = false,
  className,
  size = 'md',
  variant = 'outline',
}) => {
  const isDisabled = disabled || !isSupported || isProcessing;

  const getIcon = () => {
    if (isProcessing) {
      return <Loader2 className="animate-spin" />;
    }
    if (isRecording) {
      return <MicOff />;
    }
    return <Mic />;
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-10 w-10';
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'rounded-full transition-all duration-200',
        getButtonSize(),
        isRecording && 'animate-pulse bg-red-500/20 border-red-500/50',
        isProcessing && 'cursor-wait',
        className
      )}
      title={
        isProcessing
          ? 'Обработка...'
          : isRecording
            ? 'Остановить запись'
            : 'Начать голосовой ввод'
      }
    >
      {React.cloneElement(getIcon(), { 
        size: getIconSize(),
        className: cn(
          'transition-colors',
          isRecording ? 'text-red-400' : 'text-cosmic-accent',
          isProcessing && 'text-cosmic-secondary'
        )
      })}
    </Button>
  );
};