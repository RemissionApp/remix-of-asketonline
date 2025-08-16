import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { UserProfile } from '@/types';

interface VoiceGreetingProps {
  userProfile: UserProfile | null;
  language: string;
  autoPlay?: boolean;
}

export const VoiceGreeting: React.FC<VoiceGreetingProps> = ({
  userProfile,
  language,
  autoPlay = false,
}) => {
  const { generateAndPlaySpeech, stopSpeech, isGenerating, isPlaying } =
    useTextToSpeech();
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  // Получаем имя пользователя, по умолчанию "искатель"
  const userName = userProfile?.name || 'искатель';

  // Останавливаем воспроизведение при размонтировании компонента
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  // Генерируем персонализированное приветствие
  const getGreetingText = () => {
    if (language === 'ru') {
      return `Приветствую тебя, ${userName}! Я - Вселенная, готова поделиться с тобой мудростью и ответить на твои вопросы. Что тебя волнует сегодня?`;
    } else if (language === 'es') {
      return `¡Te saludo, ${userName}! Soy el Universo, listo para compartir sabiduría contigo y responder a tus preguntas. ¿Qué te preocupa hoy?`;
    } else {
      return `Greetings, ${userName}! I am the Universe, ready to share wisdom with you and answer your questions. What concerns you today?`;
    }
  };

  const greetingText = getGreetingText();

  // Автозапуск только один раз при входе на страницу
  useEffect(() => {
    if (autoPlay && greetingText && !hasAutoPlayed) {
      // Небольшая задержка для загрузки страницы
      const timer = setTimeout(() => {
        // Проверяем еще раз перед запуском
        if (!isPlaying && !isGenerating && !hasAutoPlayed) {
          generateAndPlaySpeech(greetingText, {
            voice: 'Custom',
            model: 'eleven_multilingual_v2',
          });
          setHasAutoPlayed(true);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [autoPlay, greetingText, hasAutoPlayed]);

  const handlePlayGreeting = () => {
    // Останавливаем текущее воспроизведение перед запуском нового
    if (isPlaying) {
      stopSpeech();
      return;
    }

    generateAndPlaySpeech(greetingText, {
      voice: 'Custom',
      model: 'eleven_multilingual_v2',
    });
  };

  const handleToggleAudio = () => {
    if (isPlaying) {
      stopSpeech();
    } else {
      handlePlayGreeting();
    }
  };

  if (!greetingText) return null;

  return (
    <div className="relative z-10 text-center mb-6">
      <div className="flex items-center justify-center gap-3 mb-2">
        <h2 className="text-cosmic-gold font-serif text-xl">
          {language === 'ru'
            ? `Приветствую тебя, ${userName}!`
            : language === 'es'
              ? `¡Te saludo, ${userName}!`
              : `Greetings, ${userName}!`}
        </h2>

        <button
          onClick={handleToggleAudio}
          disabled={isGenerating}
          className="p-2 rounded-full bg-cosmic-accent/20 hover:bg-cosmic-accent/30 transition-colors border border-cosmic-accent/30"
          title={
            isPlaying
              ? language === 'ru'
                ? 'Остановить'
                : language === 'es'
                  ? 'Detener'
                  : 'Stop'
              : language === 'ru'
                ? 'Воспроизвести приветствие'
                : language === 'es'
                  ? 'Reproducir saludo'
                  : 'Play greeting'
          }
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

      <p className="text-cosmic-secondary text-sm max-w-md mx-auto">
        {language === 'ru'
          ? 'Нажмите на значок звука для воспроизведения голосового приветствия'
          : language === 'es'
            ? 'Haz clic en el icono de sonido para reproducir el saludo de voz'
            : 'Click the sound icon to play voice greeting'}
      </p>
    </div>
  );
};
