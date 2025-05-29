
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Star, RotateCcw, Volume2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

interface AdvancedMeditationPlayerProps {
  audioSrc: string;
  title: string;
  selectedMusic?: string;
  onFinish?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

export const AdvancedMeditationPlayer: React.FC<AdvancedMeditationPlayerProps> = ({
  audioSrc,
  title,
  selectedMusic = 'Лес',
  onFinish,
  onNext,
  onPrevious,
  className
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [voiceVolume, setVoiceVolume] = useState(0.7);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [isFavorite, setIsFavorite] = useState(false);
  const [remindTomorrow, setRemindTomorrow] = useState(false);
  const voiceAudioRef = useRef<HTMLAudioElement>(null);
  const musicAudioRef = useRef<HTMLAudioElement>(null);

  const musicUrls: { [key: string]: string } = {
    'Лес': 'https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/meditation/Forest.mp3',
    'Дождь': '',
    'Тибетские чаши': '',
    'Океан': '',
    'Тишина': ''
  };

  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        // Останавливаем все аудио
        if (voiceAudioRef.current) {
          voiceAudioRef.current.pause();
        }
        if (musicAudioRef.current) {
          musicAudioRef.current.pause();
        }
        setIsPlaying(false);
      } else {
        // Запускаем аудио
        if (voiceAudioRef.current) {
          await voiceAudioRef.current.play();
        }
        
        // Запускаем фоновую музыку если выбрана
        if (selectedMusic !== 'Тишина' && musicUrls[selectedMusic]) {
          if (musicAudioRef.current) {
            musicAudioRef.current.src = musicUrls[selectedMusic];
            musicAudioRef.current.volume = musicVolume;
            musicAudioRef.current.loop = true;
            await musicAudioRef.current.play();
          }
        }
        
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Ошибка воспроизведения:', error);
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (voiceAudioRef.current) {
      setCurrentTime(voiceAudioRef.current.currentTime);
      if (voiceAudioRef.current.currentTime >= voiceAudioRef.current.duration) {
        setIsPlaying(false);
        setCurrentTime(0);
        if (musicAudioRef.current) {
          musicAudioRef.current.pause();
        }
        if (onFinish) onFinish();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (voiceAudioRef.current) {
      setDuration(voiceAudioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (voiceAudioRef.current) {
      const newTime = value[0];
      voiceAudioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVoiceVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVoiceVolume(newVolume);
    if (voiceAudioRef.current) {
      voiceAudioRef.current.volume = newVolume;
    }
  };

  const handleMusicVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setMusicVolume(newVolume);
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Синхронизируем громкость при изменении
  useEffect(() => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.volume = voiceVolume;
    }
  }, [voiceVolume]);

  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  return (
    <div className="bg-cosmic-dark/80 backdrop-blur-md border border-cosmic-accent/20 rounded-lg p-6 mx-4">
      {/* Основное аудио (голос) */}
      <audio
        ref={voiceAudioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        hidden
      />
      
      {/* Фоновая музыка */}
      <audio
        ref={musicAudioRef}
        hidden
        loop
      />
      
      {/* Progress Bar with Breathing Wave Effect */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-cosmic-secondary mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="relative">
          <Progress value={progressPercentage} className="h-2" />
          <div 
            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-cosmic-accent to-cosmic-gold rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <Slider 
          value={[currentTime]} 
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="mt-2"
        />
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          className="text-cosmic-secondary hover:text-cosmic-accent"
        >
          <SkipBack size={20} />
        </Button>

        <Button
          onClick={togglePlayPause}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-gold hover:from-cosmic-accent/80 hover:to-cosmic-gold/80"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          className="text-cosmic-secondary hover:text-cosmic-accent"
        >
          <SkipForward size={20} />
        </Button>
      </div>

      {/* Volume Controls */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-cosmic-accent" />
            <span className="text-sm text-white">Голос</span>
          </div>
          <Slider
            value={[voiceVolume]}
            max={1}
            step={0.01}
            onValueChange={handleVoiceVolumeChange}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Music size={16} className="text-cosmic-accent" />
            <span className="text-sm text-white">Музыка</span>
          </div>
          <Slider
            value={[musicVolume]}
            max={1}
            step={0.01}
            onValueChange={handleMusicVolumeChange}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFavorite(!isFavorite)}
          className={`${isFavorite ? 'text-cosmic-gold' : 'text-cosmic-secondary'} hover:text-cosmic-accent`}
        >
          <Star size={16} className="mr-1" fill={isFavorite ? 'currentColor' : 'none'} />
          Избранное
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setRemindTomorrow(!remindTomorrow)}
          className={`${remindTomorrow ? 'text-cosmic-gold' : 'text-cosmic-secondary'} hover:text-cosmic-accent`}
        >
          <RotateCcw size={16} className="mr-1" />
          Напомнить завтра
        </Button>
      </div>
    </div>
  );
};
