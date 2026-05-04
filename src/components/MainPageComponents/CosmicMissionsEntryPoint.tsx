import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { GlassCard } from '@/components/ui/GlassCard';

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

  return (
    <div className="w-full max-w-lg mx-auto">
      <GlassCard
        icon={Star}
        variant="blue"
        title={getTitle()}
        subtitle={getDescription()}
        onClick={handleViewMissions}
      />
    </div>
  );
};
