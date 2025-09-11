import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface MeditationAudioPlayerProps {
  isPlaying: boolean;
  volume?: number;
}

export const MeditationAudioPlayer: React.FC<MeditationAudioPlayerProps> = ({
  isPlaying,
  volume = 0.3,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { soundEnabled } = useAppStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.loop = true;

    if (isPlaying && soundEnabled) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [isPlaying, soundEnabled, volume]);

  return (
    <audio
      ref={audioRef}
      preload="auto"
      src="https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/meditation/OM.mp3"
    />
  );
};