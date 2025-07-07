import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WaveVisualization } from './WaveVisualization';
import { UniverseAvatar } from './UniverseAvatar';
import { CallStatus } from './CallStatus';
import { useElevenLabsConversation } from '@/hooks/useElevenLabsConversation';
import { useToast } from '@/components/ui/use-toast';
import { useAppStore } from '@/store/useAppStore';

export const VoiceCallInterface: React.FC = () => {
  const { language } = useAppStore();
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

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
    try {
      await startConversation();
      toast({
        title: language === 'ru' ? "Соединение установлено" : 
               language === 'es' ? "Conexión establecida" : "Connection established",
        description: language === 'ru' ? "Вы соединились с Вселенной" :
                    language === 'es' ? "Estás conectado con el Universo" : "You are connected to the Universe"
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      toast({
        title: language === 'ru' ? "Ошибка соединения" :
               language === 'es' ? "Error de conexión" : "Connection error",
        description: language === 'ru' ? "Не удалось соединиться с Вселенной" :
                    language === 'es' ? "No se pudo conectar con el Universo" : "Failed to connect to the Universe",
        variant: "destructive"
      });
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Note: ElevenLabs muting would need to be implemented based on their API
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
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
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-gradient-to-br from-cosmic-dark/30 via-purple-900/20 to-cosmic-dark/30 border-cosmic-accent/30 backdrop-blur-lg p-8 text-center">
        
        {/* Universe Avatar */}
        <div className="mb-6">
          <UniverseAvatar isActive={isConnected} isSpeaking={isSpeaking} />
        </div>

        {/* Call Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-serif text-white mb-2">
            {getTitle()}
          </h1>
          <p className="text-cosmic-muted text-sm">
            {getSubtitle()}
          </p>
        </div>

        {/* Call Status */}
        <div className="mb-6">
          <CallStatus 
            isConnected={isConnected} 
            duration={formatDuration(callDuration)}
            isListening={isConnected && !isSpeaking}
            isSpeaking={isSpeaking}
          />
        </div>

        {/* Wave Visualization */}
        {isConnected && (
          <div className="mb-6">
            <WaveVisualization 
              isActive={isSpeaking || (isConnected && !isSpeaking)} 
              intensity={isSpeaking ? 0.8 : 0.4}
            />
          </div>
        )}

        {/* Main Call Button */}
        <div className="mb-6">
          {!isConnected ? (
            <Button
              onClick={handleStartCall}
              size="lg"
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 border-2 border-green-400/50 shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:shadow-green-500/50"
            >
              <Phone className="w-8 h-8" />
            </Button>
          ) : (
            <Button
              onClick={handleEndCall}
              size="lg"
              className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 border-2 border-red-400/50 shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-red-500/50"
            >
              <PhoneOff className="w-8 h-8" />
            </Button>
          )}
        </div>

        {/* Control Buttons */}
        {isConnected && (
          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleMute}
              variant="outline"
              size="sm"
              className={`w-12 h-12 rounded-full border-cosmic-accent/30 ${
                isMuted 
                  ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                  : 'bg-cosmic-accent/10 text-cosmic-accent hover:bg-cosmic-accent/20'
              } transition-all duration-300`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            <Button
              onClick={toggleSpeaker}
              variant="outline"
              size="sm"
              className={`w-12 h-12 rounded-full border-cosmic-accent/30 ${
                !isSpeakerOn 
                  ? 'bg-gray-500/20 border-gray-500/50 text-gray-400' 
                  : 'bg-cosmic-accent/10 text-cosmic-accent hover:bg-cosmic-accent/20'
              } transition-all duration-300`}
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>
        )}

        {/* Tips */}
        {!isConnected && (
          <div className="mt-6 p-4 bg-cosmic-accent/10 border border-cosmic-accent/20 rounded-lg">
            <p className="text-xs text-cosmic-muted">
              ✨ {getTipText()}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};