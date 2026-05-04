import React from 'react';
import { Quote } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { GlassCard } from '@/components/ui/GlassCard';

export const AffirmationsBlock: React.FC = () => {
  const { language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const { generateAndPlaySpeech } = useTextToSpeech();

  const handleAffirmationsClick = async () => {
    // Переходим сразу
    navigate('/affirmations');

    // Воспроизводим фразу в фоновом режиме
    const affirmationPhrase = getAffirmationPhrase();
    try {
      generateAndPlaySpeech(affirmationPhrase, {
        voice: 'Custom',
        model: 'eleven_multilingual_v2',
      });
    } catch (error) {
      console.error('Error playing affirmation phrase:', error);
    }
  };

  const getAffirmationPhrase = () => {
    switch (language) {
      case 'ru':
        return 'Переходим к аффирмациям. Позитивные утверждения для вдохновения и личностного роста.';
      case 'es':
        return 'Vamos a las afirmaciones. Afirmaciones positivas para inspiración y crecimiento personal.';
      default:
        return 'Let us go to affirmations. Positive affirmations for inspiration and personal growth.';
    }
  };

  const affirmationsTitle =
    language === 'ru'
      ? 'Аффирмации'
      : language === 'es'
        ? 'Afirmaciones'
        : 'Affirmations';

  const subtitle =
    language === 'ru'
      ? 'Позитивные утверждения для вдохновения и роста'
      : language === 'es'
        ? 'Afirmaciones positivas para inspiración y crecimiento'
        : 'Positive affirmations for inspiration and growth';

  return (
    <div className="w-full max-w-lg mx-auto">
      <GlassCard
        icon={Quote}
        variant="green"
        title={affirmationsTitle}
        subtitle={subtitle}
        onClick={handleAffirmationsClick}
      />
    </div>
  );
};
