
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SoundToggleButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
}

export const SoundToggleButton: React.FC<SoundToggleButtonProps> = ({ 
  size = 'sm', 
  variant = 'ghost' 
}) => {
  const { soundEnabled, setSoundEnabled, language } = useAppStore();

  const handleToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  const getTooltipText = () => {
    if (language === 'ru') {
      return soundEnabled ? 'Отключить звук' : 'Включить звук';
    } else if (language === 'es') {
      return soundEnabled ? 'Silenciar sonido' : 'Activar sonido';
    } else {
      return soundEnabled ? 'Mute sound' : 'Enable sound';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size === 'sm' ? 'icon' : 'default'}
            onClick={handleToggle}
            className={`${soundEnabled ? 'text-cosmic-accent' : 'text-cosmic-secondary'} hover:text-cosmic-accent transition-colors`}
          >
            {soundEnabled ? (
              <Volume2 size={size === 'sm' ? 18 : 20} />
            ) : (
              <VolumeX size={size === 'sm' ? 18 : 20} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
