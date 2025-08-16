import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export const SoundToggle: React.FC = () => {
  const { soundEnabled, setSoundEnabled } = useAppStore();

  return (
    <button
      onClick={() => setSoundEnabled(!soundEnabled)}
      className="p-2 rounded-full bg-cosmic-dark/70 backdrop-blur-sm border border-cosmic-accent/20 hover:bg-cosmic-accent/20 transition-colors"
      title={soundEnabled ? 'Отключить звук' : 'Включить звук'}
    >
      {soundEnabled ? (
        <Volume2 size={20} className="text-cosmic-accent" />
      ) : (
        <VolumeX size={20} className="text-cosmic-secondary" />
      )}
    </button>
  );
};
