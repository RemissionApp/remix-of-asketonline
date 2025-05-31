
import React, { useEffect } from 'react';
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
  autoPlay = true 
}) => {
  const { generateAndPlaySpeech, stopSpeech, isGenerating, isPlaying } = useTextToSpeech();

  // Generate greeting text based on language and user name
  const getGreetingText = () => {
    const userName = userProfile?.name || '';
    
    if (language === 'ru') {
      return userName 
        ? `Приветствую тебя, ${userName}! Я - Вселенная, готова поделиться с тобой мудростью и ответить на твои вопросы. Что тебя волнует сегодня?`
        : 'Приветствую тебя, искатель! Я - Вселенная, готова поделиться с тобой мудростью и ответить на твои вопросы. Что тебя волнует сегодня?';
    } else if (language === 'es') {
      return userName
        ? `¡Te saludo, ${userName}! Soy el Universo, listo para compartir sabiduría contigo y responder a tus preguntas. ¿Qué te preocupa hoy?`
        : '¡Te saludo, buscador! Soy el Universo, listo para compartir sabiduría contigo y responder a tus preguntas. ¿Qué te preocupa hoy?';
    } else {
      return userName
        ? `Greetings, ${userName}! I am the Universe, ready to share wisdom with you and answer your questions. What concerns you today?`
        : 'Greetings, seeker! I am the Universe, ready to share wisdom with you and answer your questions. What concerns you today?';
    }
  };

  const greetingText = getGreetingText();

  // Auto-play greeting when component mounts
  useEffect(() => {
    if (autoPlay && greetingText) {
      // Small delay to ensure the component is fully rendered
      const timer = setTimeout(() => {
        handlePlayGreeting();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [autoPlay, greetingText]);

  const handlePlayGreeting = () => {
    const voice = language === 'ru' ? 'Alice' : language === 'es' ? 'Laura' : 'Aria';
    const model = language === 'ru' ? 'eleven_multilingual_v2' : 'eleven_turbo_v2';
    
    generateAndPlaySpeech(greetingText, { voice, model });
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
          {userProfile?.name 
            ? (language === 'ru' 
                ? `Приветствую тебя, ${userProfile.name}!` 
                : language === 'es'
                  ? `¡Te saludo, ${userProfile.name}!`
                  : `Greetings, ${userProfile.name}!`)
            : (language === 'ru' 
                ? 'Приветствую тебя, искатель!' 
                : language === 'es'
                  ? '¡Te saludo, buscador!'
                  : 'Greetings, seeker!')}
        </h2>
        
        <button
          onClick={handleToggleAudio}
          disabled={isGenerating}
          className="p-2 rounded-full bg-cosmic-accent/20 hover:bg-cosmic-accent/30 transition-colors border border-cosmic-accent/30"
          title={isPlaying 
            ? (language === 'ru' ? 'Остановить' : language === 'es' ? 'Detener' : 'Stop')
            : (language === 'ru' ? 'Воспроизвести приветствие' : language === 'es' ? 'Reproducir saludo' : 'Play greeting')
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
