
import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useOptimizedTextToSpeech } from '@/hooks/useOptimizedTextToSpeech';

export interface LoginVoiceGreetingRef {
  playGreeting: () => void;
}

export const LoginVoiceGreeting = forwardRef<LoginVoiceGreetingRef>((props, ref) => {
  const { generateAndPlaySpeech, stopSpeech, isGenerating, isPlaying } = useOptimizedTextToSpeech();
  const [userInteracted, setUserInteracted] = useState(false);

  const greetingText = "Приветствую тебя в Asket";

  // Expose playGreeting method through ref
  useImperativeHandle(ref, () => ({
    playGreeting: async () => {
      console.log('Playing greeting on login button click');
      try {
        await generateAndPlaySpeech(greetingText, { 
          voice: 'Custom', 
          model: 'eleven_multilingual_v2' 
        });
        console.log('Login greeting played successfully');
      } catch (error) {
        console.error('Error playing login greeting:', error);
      }
    }
  }));

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
      } catch (error) {
        console.error('Error in manual greeting playback on login:', error);
        console.error('Manual playback error details:', error.message, error.stack);
      }
    }
  };

  console.log('LoginVoiceGreeting render:', { 
    isGenerating, 
    isPlaying, 
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
});

LoginVoiceGreeting.displayName = 'LoginVoiceGreeting';
