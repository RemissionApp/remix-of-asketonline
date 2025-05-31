
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

  // Автозапуск приветствия при загрузке страницы с детальным логированием
  useEffect(() => {
    console.log('LoginVoiceGreeting useEffect triggered:', { hasAutoPlayed, isPlaying, isGenerating });
    
    if (!hasAutoPlayed) {
      const timer = setTimeout(async () => {
        console.log('Timer fired, checking conditions:', { isPlaying, isGenerating });
        
        if (!isPlaying && !isGenerating) {
          console.log('Starting auto-play greeting for login page');
          
          try {
            const result = await generateAndPlaySpeech(greetingText, { 
              voice: 'Custom', 
              model: 'eleven_multilingual_v2' 
            });
            console.log('generateAndPlaySpeech result:', result);
            console.log('Login greeting auto-play initiated successfully');
            setHasAutoPlayed(true);
          } catch (error) {
            console.error('Error during auto-play greeting:', error);
            console.error('Error details:', error.message, error.stack);
          }
        } else {
          console.log('Skipping auto-play due to conditions:', { isPlaying, isGenerating });
        }
      }, 1500); // Увеличил задержку до 1.5 секунд
      
      return () => {
        console.log('Clearing auto-play timer');
        clearTimeout(timer);
      };
    }
  }, [hasAutoPlayed, generateAndPlaySpeech, isPlaying, isGenerating, greetingText]);

  const handleToggleAudio = async () => {
    console.log('Manual toggle clicked:', { isPlaying, isGenerating });
    
    if (isPlaying) {
      console.log('Stopping current audio playback');
      stopSpeech();
    } else {
      try {
        console.log('Starting manual greeting playback with text:', greetingText);
        const result = await generateAndPlaySpeech(greetingText, { 
          voice: 'Custom', 
          model: 'eleven_multilingual_v2' 
        });
        console.log('Manual playback result:', result);
      } catch (error) {
        console.error('Error in manual greeting playback:', error);
        console.error('Manual playback error details:', error.message, error.stack);
      }
    }
  };

  console.log('LoginVoiceGreeting render:', { isGenerating, isPlaying, hasAutoPlayed });

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
