
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { CosmicButton } from './CosmicButton';
import { Slider } from './ui/slider';
import { cn } from '@/lib/utils';

interface MeditationPlayerProps {
  audioSrc: string;
  title: string;
  coverImage: string;
  onFinish?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

export const MeditationPlayer: React.FC<MeditationPlayerProps> = ({
  audioSrc,
  title,
  coverImage,
  onFinish,
  onNext,
  onPrevious,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      
      // If meditation has finished
      if (audioRef.current.currentTime >= audioRef.current.duration) {
        setIsPlaying(false);
        setCurrentTime(0);
        if (onFinish) onFinish();
      }
    }
  };

  // Handle loaded metadata (duration)
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle seek
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    
    // If volume is set to 0, mute. Otherwise, unmute
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      setIsMuted(newMuteState);
      audioRef.current.muted = newMuteState;
    }
  };

  // Format time in MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Effect to set audio volume when component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  return (
    <div className={cn("bg-cosmic-dark/70 backdrop-blur-md border border-cosmic-accent/20 rounded-lg p-4", className)}>
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        hidden
      />
      
      <div className="flex flex-col items-center mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cosmic-accent/30 mb-3">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-lg font-serif text-white text-center">{title}</h3>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-cosmic-secondary">{formatTime(currentTime)}</span>
          <Slider 
            value={[currentTime]} 
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="text-xs text-cosmic-secondary">{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <button 
            onClick={toggleMute}
            className="text-cosmic-secondary hover:text-cosmic-accent"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <Slider 
            value={[volume]} 
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-20"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <CosmicButton 
            onClick={onPrevious} 
            variant="subtle" 
            size="sm"
            className="rounded-full px-2"
          >
            <SkipBack size={18} />
          </CosmicButton>
          
          <CosmicButton 
            onClick={togglePlayPause} 
            variant="default" 
            size="md"
            className="rounded-full w-12 h-12 flex items-center justify-center"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </CosmicButton>
          
          <CosmicButton 
            onClick={onNext} 
            variant="subtle" 
            size="sm"
            className="rounded-full px-2"
          >
            <SkipForward size={18} />
          </CosmicButton>
        </div>
        
        <div className="w-24" />
      </div>
    </div>
  );
};
