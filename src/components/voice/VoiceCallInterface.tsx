import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WaveVisualization } from './WaveVisualization';
import { UniverseAvatar } from './UniverseAvatar';
import { CallStatus } from './CallStatus';
import { CallStatusIndicator } from './CallStatusIndicator';
import { SwipeGestureHandler } from './SwipeGestureHandler';
import { useElevenLabsConversation } from '@/hooks/useElevenLabsConversation';
import { useToast } from '@/components/ui/use-toast';
import { useAppStore } from '@/store/useAppStore';

export const VoiceCallInterface: React.FC = () => {
  const { language } = useAppStore();
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const {
    startConversation,
    endConversation,
    setVolume,
    isConnected,
    isSpeaking,
    status
  } = useElevenLabsConversation();

  // Simulate call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Update volume when speaker state changes
  useEffect(() => {
    if (isConnected) {
      setVolume(isSpeakerOn ? 0.8 : 0);
    }
  }, [isSpeakerOn, isConnected, setVolume]);

  const handleStartCall = async () => {
    setIsLoading(true);
    setConnectionError(null);
    
    try {
      await startConversation();
      
      // Haptic feedback for successful connection
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      
      toast({
        title: language === 'ru' ? "Соединение установлено" : 
               language === 'es' ? "Conexión establecida" : "Connection established",
        description: language === 'ru' ? "Вы соединились с Вселенной" :
                    language === 'es' ? "Estás conectado con el Universo" : "You are connected to the Universe"
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      
      const errorMessage = language === 'ru' ? "Не удалось соединиться с Вселенной" :
                          language === 'es' ? "No se pudo conectar con el Universo" : "Failed to connect to the Universe";
      
      setConnectionError(errorMessage);
      
      // Haptic feedback for error
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      
      toast({
        title: language === 'ru' ? "Ошибка соединения" :
               language === 'es' ? "Error de conexión" : "Connection error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndCall = async () => {
    try {
      await endConversation();
      setCallDuration(0);
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const toggleMute = async () => {
    if (!isConnected) return;
    
    try {
      // Для PWA нужно проверить доступность микрофона
      if (!isMuted) {
        // Отключаем микрофон через ElevenLabs API если доступно
        setIsMuted(true);
      } else {
        // Включаем микрофон - запрашиваем доступ для PWA
        if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        setIsMuted(false);
      }
    } catch (error) {
      console.error('Error toggling microphone:', error);
      toast({
        title: language === 'ru' ? "Ошибка микрофона" :
               language === 'es' ? "Error de micrófono" : "Microphone error",  
        description: language === 'ru' ? "Не удалось переключить микрофон" :
                    language === 'es' ? "No se pudo alternar el micrófono" : "Failed to toggle microphone",
        variant: "destructive"
      });
    }
  };

  const toggleSpeaker = async () => {
    if (!isConnected) return;
    
    try {
      const newSpeakerState = !isSpeakerOn;
      setIsSpeakerOn(newSpeakerState);
      
      // Устанавливаем громкость через ElevenLabs
      await setVolume(newSpeakerState ? 0.8 : 0);
      
    } catch (error) {
      console.error('Error toggling speaker:', error);
      toast({
        title: language === 'ru' ? "Ошибка динамика" :
               language === 'es' ? "Error de altavoz" : "Speaker error",
        description: language === 'ru' ? "Не удалось переключить динамик" :
                    language === 'es' ? "No se pudo alternar el altavoz" : "Failed to toggle speaker", 
        variant: "destructive"
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTitle = () => {
    switch (language) {
      case 'ru': return 'Звонок Вселенной';
      case 'es': return 'Llamada al Universo';
      default: return 'Universe Call';
    }
  };

  const getSubtitle = () => {
    switch (language) {
      case 'ru': return 'Соединитесь с космической мудростью';
      case 'es': return 'Conéctate con la sabiduría cósmica';
      default: return 'Connect with cosmic wisdom';
    }
  };

  const getTipText = () => {
    switch (language) {
      case 'ru': return 'Нажмите на кнопку звонка, чтобы соединиться с космической мудростью Вселенной';
      case 'es': return 'Presiona el botón de llamada para conectarte con la sabiduría cósmica del Universo';
      default: return 'Press the call button to connect with the cosmic wisdom of the Universe';
    }
  };

  return (
    <SwipeGestureHandler>
      <div className="w-full max-w-sm mx-auto px-4">
        <div className="bg-transparent p-4 text-center space-y-6">
        
        {/* Universe Avatar */}
        <div className="flex justify-center">
          <UniverseAvatar isActive={isConnected} isSpeaking={isSpeaking} />
        </div>

        {/* Call Title */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-serif text-white mb-2">
            {getTitle()}
          </h1>
          <p className="text-cosmic-secondary text-sm">
            {getSubtitle()}
          </p>
        </div>

        {/* Call Status */}
        <div className="flex justify-center">
          <CallStatus 
            isConnected={isConnected} 
            duration={formatDuration(callDuration)}
            isListening={isConnected && !isSpeaking}
            isSpeaking={isSpeaking}
          />
        </div>

        {/* Status Indicator */}
        <div className="flex justify-center">
          <CallStatusIndicator 
            isConnected={isConnected}
            isLoading={isLoading}
            error={connectionError}
          />
        </div>

        {/* Wave Visualization */}
        {isConnected && (
          <div className="flex justify-center">
            <WaveVisualization 
              isActive={isSpeaking || (isConnected && !isSpeaking)} 
              intensity={isSpeaking ? 0.8 : 0.4}
            />
          </div>
        )}

        {/* Main Call Button - Larger for mobile */}
        <div className="flex justify-center">
          {!isConnected ? (
            <Button
              onClick={handleStartCall}
              disabled={isLoading}
              size="lg"
              className="w-24 h-24 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 border-2 border-green-400/50 shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:shadow-green-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              ) : (
                <Phone className="w-10 h-10 sm:w-8 sm:h-8" />
              )}
              {isLoading && (
                <div className="absolute inset-0 bg-green-500/20 animate-pulse rounded-full"></div>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleEndCall}
              size="lg"
              className="w-24 h-24 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 border-2 border-red-400/50 shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-red-500/50 active:scale-95"
            >
              <PhoneOff className="w-10 h-10 sm:w-8 sm:h-8" />
            </Button>
          )}
        </div>

        {/* Control Buttons - Larger for mobile */}
        {isConnected && (
          <div className="flex justify-center gap-6">
            <Button
              onClick={toggleMute}
              variant="outline"
              size="sm"
              className={`w-14 h-14 sm:w-12 sm:h-12 rounded-full border-cosmic-accent/30 ${
                isMuted 
                  ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                  : 'bg-cosmic-accent/10 text-cosmic-accent hover:bg-cosmic-accent/20'
              } transition-all duration-300 active:scale-95`}
            >
              {isMuted ? <MicOff className="w-6 h-6 sm:w-5 sm:h-5" /> : <Mic className="w-6 h-6 sm:w-5 sm:h-5" />}
            </Button>

            <Button
              onClick={toggleSpeaker}
              variant="outline"
              size="sm"
              className={`w-14 h-14 sm:w-12 sm:h-12 rounded-full border-cosmic-accent/30 ${
                !isSpeakerOn 
                  ? 'bg-gray-500/20 border-gray-500/50 text-gray-400' 
                  : 'bg-cosmic-accent/10 text-cosmic-accent hover:bg-cosmic-accent/20'
              } transition-all duration-300 active:scale-95`}
            >
              {isSpeakerOn ? <Volume2 className="w-6 h-6 sm:w-5 sm:h-5" /> : <VolumeX className="w-6 h-6 sm:w-5 sm:h-5" />}
            </Button>
          </div>
        )}

        {/* Tips - Hidden on very small screens */}
        {!isConnected && (
          <div className="p-3 bg-cosmic-accent/10 border border-cosmic-accent/20 rounded-lg">
            <p className="text-xs text-cosmic-secondary leading-relaxed">
              ✨ {getTipText()}
            </p>
          </div>
        )}
        </div>
      </div>
    </SwipeGestureHandler>
  );
};