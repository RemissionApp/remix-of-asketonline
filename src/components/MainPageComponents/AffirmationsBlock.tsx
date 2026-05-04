import React from 'react';
import { Quote } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

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
    <button
      onClick={handleAffirmationsClick}
      className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-cosmic-accent2/25 bg-gradient-to-br from-cosmic-accent2/30 via-cosmic-dark/60 to-cosmic-accent2/10 p-5 text-left shadow-lg shadow-cosmic-accent2/30 transition-transform active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-accent2 to-cosmic-accent/60 shadow-[0_0_30px_rgba(217,70,239,0.55)]">
          <Quote size={26} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-white">{affirmationsTitle}</div>
          <div className="mt-0.5 text-xs text-cosmic-secondary">{subtitle}</div>
        </div>
      </div>
    </button>
  );
};
