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
    <div className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-indigo/30 via-cosmic-dark/60 to-cosmic-accent/20 p-5 shadow-lg shadow-cosmic-accent/10">
      <div className="flex items-start gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-accent/80 to-cosmic-indigo/70 shadow-[0_0_30px_rgba(139,92,246,0.25)]">
          <Star size={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-base sm:text-xl ${headingFontClass} font-medium text-white`}>
            {getTitle()}
          </h3>
          <p className="mt-1 mb-3 text-sm sm:text-base text-white/90">
          {getDescription()}
          </p>

          <CosmicButton
            onClick={handleViewMissions}
            size="md"
            variant="default"
            className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 text-white"
          >
            {getButtonText()}
          </CosmicButton>
        </div>
      </div>
    </div>
  );
};
