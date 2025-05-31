
import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export const LoginVoiceGreeting: React.FC = () => {
  const { generateAndPlaySpeech, stopSpeech, isGenerating, isPlaying } = useTextToSpeech();
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  const greetingText = "Приветствую тебя в Asket";

  // Останавливаем воспроизведение при размонтировании компонента
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  // Автозапуск приветствия при загрузке страницы
  useEffect(() => {
    if (!hasAutoPlayed) {
      const timer = setTimeout(() => {
        if (!isPlaying && !isGenerating) {
          generateAndPlaySpeech(greetingText, { 
            voice: 'Custom', 
            model: 'eleven_multilingual_v2' 
          });
          setHasAutoPlayed(true);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [hasAutoPlayed, generateAndPlaySpeech, isPlaying, isGenerating, greetingText]);

  const handleToggleAudio = () => {
    if (isPlaying) {
      stopSpeech();
    } else {
      generateAndPlaySpeech(greetingText, { 
        voice: 'Custom', 
        model: 'eleven_multilingual_v2' 
      });
    }
  };

  return (
    <div className="absolute top-4 right-4 z-20">
      <button
        onClick={handleToggleAudio}
        disabled={isGenerating}
        className="p-2 rounded-full bg-cosmic-accent/20 hover:bg-cosmic-accent/30 transition-colors border border-cosmic-accent/30"
        title={isPlaying ? 'Остановить' : 'Воспроизвести приветствие'}
      >
        {isGenerating ? (
          <Loader2 size={20} className="text-cosmic-accent animate-spin" />
        ) : isPlaying ? (
          <VolumeX size={20} className="text-cosmic-accent" />
        ) : (
          <Volume2 size={20} className="text-cosmic-accent" />
        )}
      </button>
    </div>
  );
};
