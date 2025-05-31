
import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export const LoginVoiceGreeting: React.FC = () => {
  const { generateAndPlaySpeech, stopSpeech, isGenerating, isPlaying } = useTextToSpeech();
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const greetingText = "Приветствую тебя в Asket";

  // Отслеживаем взаимодействие пользователя со страницей
  useEffect(() => {
    const handleUserInteraction = () => {
      console.log('User interaction detected on login page');
      setUserInteracted(true);
    };

    // Добавляем слушатели для различных типов взаимодействия
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Останавливаем воспроизведение при размонтировании компонента
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  // Автозапуск приветствия после взаимодействия пользователя
  useEffect(() => {
    console.log('LoginVoiceGreeting useEffect triggered:', { 
      hasAutoPlayed, 
      userInteracted, 
      isPlaying, 
      isGenerating 
    });
    
    if (!hasAutoPlayed && userInteracted) {
      const timer = setTimeout(async () => {
        console.log('Timer fired for login greeting, checking conditions:', { isPlaying, isGenerating });
        
        if (!isPlaying && !isGenerating) {
          console.log('Starting auto-play greeting for login page');
          
          try {
            const result = await generateAndPlaySpeech(greetingText, { 
              voice: 'Custom', 
              model: 'eleven_multilingual_v2' 
            });
            console.log('generateAndPlaySpeech result for login:', result);
            console.log('Login greeting auto-play initiated successfully');
            setHasAutoPlayed(true);
          } catch (error) {
            console.error('Error during auto-play greeting on login:', error);
            console.error('Error details:', error.message, error.stack);
          }
        } else {
          console.log('Skipping auto-play due to conditions:', { isPlaying, isGenerating });
        }
      }, 1000); // Задержка 1 секунда после взаимодействия
      
      return () => {
        console.log('Clearing auto-play timer for login');
        clearTimeout(timer);
      };
    }
  }, [hasAutoPlayed, userInteracted, generateAndPlaySpeech, isPlaying, isGenerating, greetingText]);

  const handleToggleAudio = async () => {
    console.log('Manual toggle clicked on login page:', { isPlaying, isGenerating });
    
    // Отмечаем взаимодействие пользователя при клике
    if (!userInteracted) {
      setUserInteracted(true);
    }
    
    if (isPlaying) {
      console.log('Stopping current audio playback on login');
      stopSpeech();
    } else {
      try {
        console.log('Starting manual greeting playback on login with text:', greetingText);
        const result = await generateAndPlaySpeech(greetingText, { 
          voice: 'Custom', 
          model: 'eleven_multilingual_v2' 
        });
        console.log('Manual playback result on login:', result);
        setHasAutoPlayed(true);
      } catch (error) {
        console.error('Error in manual greeting playback on login:', error);
        console.error('Manual playback error details:', error.message, error.stack);
      }
    }
  };

  console.log('LoginVoiceGreeting render:', { 
    isGenerating, 
    isPlaying, 
    hasAutoPlayed, 
    userInteracted 
  });

  return (
    <div className="absolute top-4 right-4 z-20">
      <button
        onClick={handleToggleAudio}
        disabled={isGenerating}
        className={`p-2 rounded-full transition-colors border border-cosmic-accent/30 ${
          userInteracted 
            ? 'bg-cosmic-accent/20 hover:bg-cosmic-accent/30' 
            : 'bg-cosmic-accent/10 hover:bg-cosmic-accent/20 animate-pulse'
        }`}
        title={
          !userInteracted 
            ? 'Нажмите для активации звука'
            : isPlaying 
              ? 'Остановить' 
              : 'Воспроизвести приветствие'
        }
      >
        {isGenerating ? (
          <Loader2 size={20} className="text-cosmic-accent animate-spin" />
        ) : isPlaying ? (
          <VolumeX size={20} className="text-cosmic-accent" />
        ) : (
          <Volume2 size={20} className={`text-cosmic-accent ${!userInteracted ? 'animate-bounce' : ''}`} />
        )}
      </button>
    </div>
  );
};
