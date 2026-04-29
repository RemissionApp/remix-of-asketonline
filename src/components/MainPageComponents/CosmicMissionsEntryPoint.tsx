import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { CosmicButton } from '@/components/CosmicButton';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export const CosmicMissionsEntryPoint: React.FC = () => {
  const { language } = useAppStore();
  const navigate = useNavigate();
  const { generateAndPlaySpeech } = useTextToSpeech();

  const handleViewMissions = async () => {
    // Переходим сразу
    navigate('/cosmic-missions');

    // Воспроизводим фразу в фоновом режиме
    const missionPhrase = getMissionPhrase();
    try {
      generateAndPlaySpeech(missionPhrase, {
        voice: 'Custom',
        model: 'eleven_multilingual_v2',
      });
    } catch (error) {
      console.error('Error playing mission phrase:', error);
    }
  };

  const getMissionPhrase = () => {
    switch (language) {
      case 'ru':
        return 'Отправляемся исследовать космические миссии! Выполняй ритуалы и челленджи для получения энергетических очков.';
      case 'es':
        return 'Vamos a explorar las misiones cósmicas. Completa rituales y desafíos para ganar puntos de energía.';
      default:
        return 'Let us explore the cosmic missions! Complete rituals and challenges to earn energy points.';
    }
  };

  const getTitle = () => {
    switch (language) {
      case 'ru':
        return 'Космические миссии';
      case 'es':
        return 'Misiones cósmicas';
      default:
        return 'Cosmic missions';
    }
  };

  const getButtonText = () => {
    switch (language) {
      case 'ru':
        return 'Открыть миссии';
      case 'es':
        return 'Ver misiones';
      default:
        return 'View missions';
    }
  };

  const getDescription = () => {
    switch (language) {
      case 'ru':
        return 'Выполняйте ритуалы, челленджи и цепочки заданий для получения наград';
      case 'es':
        return 'Completa rituales, desafíos y cadenas para ganar recompensas';
      default:
        return 'Complete rituals, challenges and chains to earn rewards';
    }
  };

  // Determine the correct font class based on language - matching other headings in the app
  const headingFontClass = language === 'en' ? 'font-serif' : 'font-display';

  return (
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-4 sm:mb-6 relative overflow-hidden">
      {/* Background image with reflection and brightness effect */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70 z-0 animate-image-brighten"
        style={{
          backgroundImage:
            "url('https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//un1.jpeg')",
          filter: 'brightness(1.6) contrast(1.2)',
          transform: 'scaleX(-1)', // This creates the reflection effect (mirror)
        }}
      />

      <div className="w-full p-3 sm:p-4 rounded-lg backdrop-blur-sm bg-transparent relative z-10">
        <div className="flex items-center mb-3 sm:mb-4">
          <div className="cosmic-block-icon-wrapper bg-cosmic-dark/60">
            <Star size={20} className="text-cosmic-accent" />
          </div>

          <h3 className={`text-base sm:text-xl ${headingFontClass} font-medium text-white`}>
            {getTitle()}
          </h3>
        </div>

        <p className="text-white mb-3 sm:mb-4 text-sm sm:text-base text-shadow text-center">
          {getDescription()}
        </p>

        <CosmicButton
          onClick={handleViewMissions}
          size="md"
          variant="default"
          className="w-full bg-gradient-to-r from-cosmic-accent/40 to-cosmic-indigo/30 hover:from-cosmic-accent/50 hover:to-cosmic-indigo/40 backdrop-blur-md border border-white/10"
        >
          {getButtonText()}
        </CosmicButton>
      </div>
    </div>
  );
};
