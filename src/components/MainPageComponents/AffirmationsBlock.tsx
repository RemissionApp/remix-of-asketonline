import React from 'react';
import { TextCursor } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { CosmicButton } from '@/components/CosmicButton';
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

  // Determine the correct font class based on language - matching other headings in the app
  const headingFontClass = language === 'en' ? 'font-serif' : 'font-display';

  // Translation for the title
  const affirmationsTitle =
    language === 'ru'
      ? 'Аффирмации'
      : language === 'es'
        ? 'Afirmaciones'
        : 'Affirmations';

  return (
    <div className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-accent/20 via-cosmic-dark/60 to-cosmic-indigo/25 p-5 shadow-lg shadow-cosmic-accent/10">
      <div className="flex items-start gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-accent/80 to-cosmic-indigo/70 shadow-[0_0_30px_rgba(139,92,246,0.25)]">
          <TextCursor size={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-base sm:text-xl ${headingFontClass} font-medium text-white`}>
            {affirmationsTitle}
          </h3>
          <p className="mt-1 mb-3 text-sm sm:text-base text-white/90">
          {language === 'ru'
            ? 'Позитивные утверждения для вдохновения и личностного роста.'
            : language === 'es'
              ? 'Afirmaciones positivas para inspiración y crecimiento personal.'
              : 'Positive affirmations for inspiration and personal growth.'}
          </p>

          <CosmicButton
            onClick={handleAffirmationsClick}
            size="md"
            variant="default"
            className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 text-white"
          >
            {language === 'ru'
              ? 'Открыть аффирмации'
              : language === 'es'
                ? 'Abrir afirmaciones'
                : 'Open affirmations'}
          </CosmicButton>
        </div>
      </div>
    </div>
  );
};
