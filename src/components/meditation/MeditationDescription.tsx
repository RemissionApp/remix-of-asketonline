
import React, { useState, useRef } from 'react';
import { Music, User, Leaf, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MeditationDescriptionProps {
  description: string;
  backgroundMusic: string[];
  voiceOptions: string[];
  onMusicChange: (music: string) => void;
  onVoiceChange: (voice: string) => void;
}

export const MeditationDescription: React.FC<MeditationDescriptionProps> = ({
  description,
  backgroundMusic,
  voiceOptions,
  onMusicChange,
  onVoiceChange
}) => {
  const [selectedMusic, setSelectedMusic] = useState(backgroundMusic[0]);
  const [selectedVoice, setSelectedVoice] = useState(voiceOptions[0]);
  const [feelings, setFeelings] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingMusic, setPlayingMusic] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const musicUrls: { [key: string]: string } = {
    'Лес': 'https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/meditation/Forest.mp3'
  };

  const handleMusicPreview = async (music: string) => {
    if (audioRef.current) {
      if (playingMusic === music && isPlaying) {
        // Останавливаем воспроизведение
        audioRef.current.pause();
        setIsPlaying(false);
        setPlayingMusic(null);
      } else {
        // Начинаем воспроизведение
        const audioUrl = musicUrls[music];
        if (audioUrl) {
          try {
            audioRef.current.src = audioUrl;
            audioRef.current.volume = 0.5; // Устанавливаем громкость на 50%
            await audioRef.current.play();
            setIsPlaying(true);
            setPlayingMusic(music);
          } catch (error) {
            console.error('Ошибка воспроизведения аудио:', error);
            setIsPlaying(false);
            setPlayingMusic(null);
          }
        }
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlayingMusic(null);
  };

  const handleAudioError = () => {
    console.error('Ошибка загрузки аудиофайла');
    setIsPlaying(false);
    setPlayingMusic(null);
  };

  return (
    <div className="p-6 space-y-6">
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onError={handleAudioError}
        preload="none"
      />

      {/* Curator Message */}
      <div className="bg-cosmic-dark/40 backdrop-blur-sm border border-cosmic-accent/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-cosmic-accent/20 flex items-center justify-center flex-shrink-0">
            <Leaf size={16} className="text-cosmic-accent" />
          </div>
          <div>
            <p className="text-white font-medium mb-2">Сообщение от куратора:</p>
            <p className="text-cosmic-secondary leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Background Music Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Music size={20} className="text-cosmic-accent" />
          <h3 className="text-white font-medium">Фоновая музыка</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {backgroundMusic.map((music) => (
            <div key={music} className="flex items-center gap-2">
              <Button
                variant={selectedMusic === music ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedMusic(music);
                  onMusicChange(music);
                }}
                className={`flex-1 ${selectedMusic === music 
                  ? "bg-cosmic-accent/20 border-cosmic-accent text-cosmic-accent" 
                  : "border-cosmic-accent/40 text-cosmic-secondary hover:text-cosmic-accent"
                }`}
              >
                {music}
              </Button>
              {musicUrls[music] && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMusicPreview(music)}
                  className="w-8 h-8 text-cosmic-accent hover:bg-cosmic-accent/20"
                  disabled={!musicUrls[music]}
                >
                  {playingMusic === music && isPlaying ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} />
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Voice Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <User size={20} className="text-cosmic-accent" />
          <h3 className="text-white font-medium">Голос</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {voiceOptions.map((voice) => (
            <Button
              key={voice}
              variant={selectedVoice === voice ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedVoice(voice);
                onVoiceChange(voice);
              }}
              className={selectedVoice === voice 
                ? "bg-cosmic-accent/20 border-cosmic-accent text-cosmic-accent" 
                : "border-cosmic-accent/40 text-cosmic-secondary hover:text-cosmic-accent"
              }
            >
              {voice}
            </Button>
          ))}
        </div>
      </div>

      {/* Feelings Journal */}
      <div className="space-y-3">
        <h3 className="text-white font-medium">Записать ощущения</h3>
        <Textarea
          placeholder="Как вы себя чувствуете? Что приходит в голову?"
          value={feelings}
          onChange={(e) => setFeelings(e.target.value)}
          className="bg-cosmic-dark/40 border-cosmic-accent/20 text-white placeholder:text-cosmic-secondary"
          rows={4}
        />
        <Button 
          size="sm" 
          className="bg-cosmic-accent/20 hover:bg-cosmic-accent/30 text-cosmic-accent border border-cosmic-accent/40"
        >
          Сохранить запись
        </Button>
      </div>
    </div>
  );
};
