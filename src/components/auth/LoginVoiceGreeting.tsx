import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useOptimizedTextToSpeech } from '@/hooks/useOptimizedTextToSpeech';
import { createLogger } from '@/utils/loggerUtils';
import { useTranslations } from '@/hooks/useTranslations';

export interface LoginVoiceGreetingRef {
  playGreeting: () => void;
}

export const LoginVoiceGreeting = forwardRef<LoginVoiceGreetingRef>(
  (props, ref) => {
    const logger = createLogger('LoginVoiceGreeting');
    const { generateAndPlaySpeech, stopSpeech, isGenerating, isPlaying } =
      useOptimizedTextToSpeech();
    const [userInteracted, setUserInteracted] = useState(false);
    const { t } = useTranslations();

    const greetingText = t.auth.voiceGreeting;

    // Expose playGreeting method through ref
    useImperativeHandle(ref, () => ({
      playGreeting: async () => {
        logger.info('Playing greeting on login button click');
        try {
          await generateAndPlaySpeech(greetingText, {
            voice: 'Custom',
            model: 'eleven_multilingual_v2',
          });
          logger.info('Login greeting played successfully');
        } catch (error) {
          logger.error('Error playing login greeting', error);
        }
      },
    }));

    // Отслеживаем взаимодействие пользователя со страницей
    useEffect(() => {
      const handleUserInteraction = () => {
        logger.debug('User interaction detected on login page');
        setUserInteracted(true);
      };

      // Добавляем слушатели для различных типов взаимодействия
      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('keydown', handleUserInteraction, {
        once: true,
      });
      document.addEventListener('touchstart', handleUserInteraction, {
        once: true,
      });

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
      logger.debug('Manual toggle clicked on login page', {
        isPlaying,
        isGenerating,
      });

      // Отмечаем взаимодействие пользователя при клике
      if (!userInteracted) {
        setUserInteracted(true);
      }

      if (isPlaying) {
        logger.debug('Stopping current audio playback on login');
        stopSpeech();
      } else {
        try {
          logger.debug('Starting manual greeting playback on login', {
            greetingText,
          });
          const result = await generateAndPlaySpeech(greetingText, {
            voice: 'Custom',
            model: 'eleven_multilingual_v2',
          });
          logger.debug('Manual playback result on login', { result });
        } catch (error) {
          logger.error('Error in manual greeting playback on login', error);
        }
      }
    };

    logger.debug('LoginVoiceGreeting render', {
      isGenerating,
      isPlaying,
      userInteracted,
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
              ? t.auth.clickForAudio
              : isPlaying
                ? t.auth.stop
                : t.auth.playGreeting
          }
        >
          {isGenerating ? (
            <Loader2 size={20} className="text-cosmic-accent animate-spin" />
          ) : isPlaying ? (
            <VolumeX size={20} className="text-cosmic-accent" />
          ) : (
            <Volume2
              size={20}
              className={`text-cosmic-accent ${!userInteracted ? 'animate-bounce' : ''}`}
            />
          )}
        </button>
      </div>
    );
  }
);

LoginVoiceGreeting.displayName = 'LoginVoiceGreeting';
