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
    <div className="glass-card glass-shimmer mb-4 sm:mb-6 relative">
      {/* Background image with reflection effect */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
        style={{
          backgroundImage: `url(https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//affirmation.png)`,
          filter: 'brightness(1.4) contrast(1.1)',
          transform: 'scaleX(-1)', // This creates the reflection effect (mirror)
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,6,30,0.25) 0%, rgba(10,6,30,0.55) 100%)',
        }}
      />

      <div className="w-full p-3 sm:p-4 relative z-10">
        <div className="flex items-center mb-3 sm:mb-4">
          <div className="glass-icon-wrap">
            <TextCursor size={20} className="text-cosmic-accent" />
          </div>

          <h3 className={`text-base sm:text-xl ${headingFontClass} font-medium text-white`}>
            {affirmationsTitle}
          </h3>
        </div>

        <p className="text-white mb-3 sm:mb-4 text-sm sm:text-base text-shadow text-center">
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
          className="w-full bg-gradient-to-r from-purple-500/60 to-indigo-500/50 hover:from-purple-500/70 hover:to-indigo-500/60 backdrop-blur-md border border-white/20"
        >
          {language === 'ru'
            ? 'Открыть аффирмации'
            : language === 'es'
              ? 'Abrir afirmaciones'
              : 'Open affirmations'}
        </CosmicButton>
      </div>
    </div>
  );
};
