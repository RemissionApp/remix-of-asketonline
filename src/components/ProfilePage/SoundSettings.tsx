
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX } from 'lucide-react';

export const SoundSettings: React.FC = () => {
  const { 
    soundEnabled, 
    soundVolume, 
    setSoundEnabled, 
    setSoundVolume, 
    language 
  } = useAppStore();
  const { t } = useTranslations();

  const handleVolumeChange = (values: number[]) => {
    setSoundVolume(values[0]);
  };

  const getSoundEnabledLabel = () => {
    if (language === 'ru') return 'Голосовое сопровождение';
    if (language === 'es') return 'Acompañamiento de voz';
    return 'Voice guidance';
  };

  const getVolumeLabel = () => {
    if (language === 'ru') return 'Громкость';
    if (language === 'es') return 'Volumen';
    return 'Volume';
  };

  const getSoundDescription = () => {
    if (language === 'ru') return 'Включает голосовые подсказки и озвучивание текста';
    if (language === 'es') return 'Habilita las indicaciones de voz y la narración de texto';
    return 'Enables voice prompts and text narration';
  };

  return (
    <div className="space-y-6">
      {/* Переключатель звука */}
      <div className="flex items-center justify-between p-4 cosmic-card">
        <div className="flex items-center space-x-3">
          {soundEnabled ? (
            <Volume2 size={20} className="text-cosmic-accent" />
          ) : (
            <VolumeX size={20} className="text-cosmic-secondary" />
          )}
          <div>
            <h3 className="text-white font-medium">{getSoundEnabledLabel()}</h3>
            <p className="text-cosmic-secondary text-sm">{getSoundDescription()}</p>
          </div>
        </div>
        <Switch
          checked={soundEnabled}
          onCheckedChange={setSoundEnabled}
        />
      </div>

      {/* Слайдер громкости */}
      {soundEnabled && (
        <div className="p-4 cosmic-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">{getVolumeLabel()}</h3>
            <span className="text-cosmic-accent text-sm">
              {Math.round(soundVolume * 100)}%
            </span>
          </div>
          <Slider
            value={[soundVolume]}
            onValueChange={handleVolumeChange}
            max={1}
            min={0}
            step={0.1}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
