import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WaveVisualization } from './WaveVisualization';
import { UniverseAvatar } from './UniverseAvatar';
import { CallStatus } from './CallStatus';
import { UniverseCaptions } from './UniverseCaptions';
import { SwipeGestureHandler } from './SwipeGestureHandler';
import { useElevenLabsConversation } from '@/hooks/useElevenLabsConversation';
import { useToast } from '@/components/ui/use-toast';
import { useAppStore } from '@/store/useAppStore';
import { useCallMinutes } from '@/hooks/useCallMinutes';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';

export const VoiceCallInterface: React.FC = () => {
  const { language } = useAppStore();
  const { toast } = useToast();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const [callDuration, setCallDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { minutesLeft, limitReached, addMinutes, refresh: refreshMinutes } = useCallMinutes();

  const {
    startConversation,
    endConversation,
    isConnected,
    isSpeaking,
    lastAgentMessage,
    lastUserMessage,
  } = useElevenLabsConversation();

  // Tick call duration; auto-hangup at minute boundary if limit reached
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => {
          const next = prev + 1;
          // Every 30s, persist accrued minutes and re-check limit
          if (next > 0 && next % 30 === 0) {
            void (async () => {
              try {
                await addMinutes(30);
                await refreshMinutes();
              } catch (_) {}
            })();
          }
          return next;
        });
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isConnected, addMinutes, refreshMinutes]);

  // Force hangup when monthly limit reached during a live call
  useEffect(() => {
    if (isConnected && limitReached) {
      void endConversation();
    }
  }, [isConnected, limitReached, endConversation]);

  // Persist remaining seconds on tab close
  useEffect(() => {
    const handler = () => {
      const accrued = callDuration % 30;
      if (isConnected && accrued > 0) {
        // Best effort; may not complete on unload
        void addMinutes(accrued);
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isConnected, callDuration, addMinutes]);

  const handleStartCall = async () => {
    setIsLoading(true);

    try {
      await startConversation();

      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch (error) {
      console.error('Failed to start call:', error);

      const lyra: any = (t as any).lyra || {};
      const code = error instanceof Error ? error.message : '';
      let errorMessage: string;
      switch (code) {
        case 'MIC_PERMISSION_DENIED':
          errorMessage =
            lyra.errorMicDenied ||
            (language === 'ru'
              ? 'Разрешите доступ к микрофону.'
              : language === 'es'
                ? 'Permite el acceso al micrófono.'
                : 'Please allow microphone access.');
          break;
        case 'MINUTES_LIMIT_REACHED':
          errorMessage =
            lyra.errorLimit ||
            (language === 'ru'
              ? 'Месячный лимит исчерпан.'
              : language === 'es'
                ? 'Límite mensual alcanzado.'
                : 'Monthly limit reached.');
          await refreshMinutes();
          break;
        case 'AGENT_UNAVAILABLE':
          errorMessage =
            lyra.errorAgentUnavailable ||
            (language === 'ru'
              ? 'Голос Вселенной временно недоступен.'
              : language === 'es'
                ? 'La voz no está disponible.'
                : 'The Universe is temporarily unreachable.');
          break;
        case 'AUTH_REQUIRED':
          errorMessage =
            lyra.errorAuth ||
            (language === 'ru'
              ? 'Войдите в аккаунт, чтобы позвонить.'
              : language === 'es'
                ? 'Inicia sesión para llamar.'
                : 'Please sign in to start a call.');
          break;
        default:
          errorMessage =
            lyra.errorNetwork ||
            (language === 'ru'
              ? 'Не удалось соединиться с Вселенной.'
              : language === 'es'
                ? 'No se pudo conectar con el Universo.'
                : 'Failed to connect to the Universe.');
      }

      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }

      toast({
        title:
          language === 'ru'
            ? 'Ошибка соединения'
            : language === 'es'
              ? 'Error de conexión'
              : 'Connection error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndCall = async () => {
    try {
      await endConversation();
      // Add only the trailing seconds not yet posted by the 30s tick
      const trailing = callDuration % 30;
      if (trailing > 0) {
        await addMinutes(trailing);
      }
      setCallDuration(0);
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTitle = () => {
    switch (language) {
      case 'ru':
        return 'Звонок Вселенной';
      case 'es':
        return 'Llamada al Universo';
      default:
        return 'Universe Call';
    }
  };

  const getSubtitle = () => {
    switch (language) {
      case 'ru':
        return 'Соединитесь с космической мудростью';
      case 'es':
        return 'Conéctate con la sabiduría cósmica';
      default:
        return 'Connect with cosmic wisdom';
    }
  };

  const getTipText = () => {
    switch (language) {
      case 'ru':
        return 'Нажмите на кнопку звонка, чтобы соединиться с космической мудростью Вселенной';
      case 'es':
        return 'Presiona el botón de llamada para conectarte con la sabiduría cósmica del Universo';
      default:
        return 'Press the call button to connect with the cosmic wisdom of the Universe';
    }
  };

  return (
    <SwipeGestureHandler>
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="bg-transparent p-4 text-center space-y-5">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-serif text-white mb-1">
              {getTitle()}
            </h1>
            <p className="text-cosmic-secondary text-xs">{getSubtitle()}</p>
          </div>

          {/* Universe Avatar */}
          <div className="flex justify-center pt-2">
            <UniverseAvatar isActive={isConnected} isSpeaking={isSpeaking} />
          </div>

          {/* Status */}
          <CallStatus
            isConnected={isConnected}
            isConnecting={isLoading}
            duration={formatDuration(callDuration)}
          />

          {/* Wave when speaking */}
          {isConnected && (
            <div className={`flex justify-center transition-opacity duration-300 ${isSpeaking ? 'opacity-100' : 'opacity-30'}`}>
              <WaveVisualization isActive={true} intensity={isSpeaking ? 0.8 : 0.3} />
            </div>
          )}

          {/* Live captions */}
          <UniverseCaptions
            agentMessage={lastAgentMessage}
            userMessage={lastUserMessage}
            isSpeaking={isSpeaking}
            isConnected={isConnected}
          />

          {/* Single action button */}
          <div className="flex justify-center pt-2">
            {!isConnected ? (
              limitReached ? (
                <Button
                  onClick={() => navigate('/profile')}
                  size="lg"
                  className="rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-indigo text-white px-6 py-6"
                >
                  {(t as any).lyra?.limitReachedCta || 'Limit reached — subscribe'}
                </Button>
              ) : (
              <Button
                onClick={handleStartCall}
                disabled={isLoading}
                size="lg"
                className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 border-2 border-green-400/50 shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 relative overflow-hidden"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                ) : (
                  <Phone className="w-10 h-10" />
                )}
                {!isLoading && (
                  <div className="absolute inset-0 rounded-full bg-green-400/30 animate-ping" />
                )}
              </Button>
              )
            ) : (
              <Button
                onClick={handleEndCall}
                size="lg"
                className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 border-2 border-red-400/50 shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <PhoneOff className="w-10 h-10" />
              </Button>
            )}
          </div>

          {!isConnected && !limitReached && (
            <p className="text-xs text-cosmic-secondary/90">
              {((t as any).lyra?.minutesLeft || 'Minutes left: {{count}}').replace('{{count}}', String(minutesLeft))}
            </p>
          )}

          {!isConnected && (
            <p className="text-xs text-cosmic-secondary/80 leading-relaxed px-4">
              ✨ {getTipText()}
            </p>
          )}
        </div>
      </div>
    </SwipeGestureHandler>
  );
};
