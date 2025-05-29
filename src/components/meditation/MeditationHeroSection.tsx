
import React from 'react';
import { Clock, Volume2, Heart } from 'lucide-react';

interface MeditationHeroProps {
  backgroundImage?: string;
  duration: number;
  audioType: 'voice+music' | 'music-only' | 'voice-only';
  emotion: string;
}

export const MeditationHeroSection: React.FC<MeditationHeroProps> = ({
  backgroundImage = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
  duration,
  audioType,
  emotion
}) => {
  const getAudioTypeText = () => {
    switch (audioType) {
      case 'voice+music': return 'Голос + музыка';
      case 'music-only': return 'Только музыка';
      case 'voice-only': return 'Только голос';
      default: return 'Голос + музыка';
    }
  };

  return (
    <div className="relative h-64 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-dark/30 to-cosmic-dark/80" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        <div className="bg-cosmic-dark/60 backdrop-blur-md rounded-lg p-4 border border-cosmic-accent/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Clock className="text-cosmic-accent mb-1" size={20} />
              <span className="text-white text-sm font-medium">{duration} минут</span>
              <span className="text-cosmic-secondary text-xs">Длительность</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Volume2 className="text-cosmic-accent mb-1" size={20} />
              <span className="text-white text-sm font-medium">{getAudioTypeText()}</span>
              <span className="text-cosmic-secondary text-xs">Звук</span>
            </div>
            
            <div className="flex flex-col items-center">
              <Heart className="text-cosmic-accent mb-1" size={20} />
              <span className="text-white text-sm font-medium">{emotion}</span>
              <span className="text-cosmic-secondary text-xs">Эмоция</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
