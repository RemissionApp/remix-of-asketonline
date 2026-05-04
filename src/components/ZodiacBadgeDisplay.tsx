import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ZodiacBadge } from '@/components/ZodiacBadge';
import { useNavigate } from 'react-router-dom';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { createLogger } from '@/utils/logger';

export const ZodiacBadgeDisplay: React.FC = () => {
  const logger = createLogger('ZodiacBadgeDisplay');
  const { userProfile, language } = useAppStore();
  const navigate = useNavigate();
  const { generateAndPlaySpeech } = useTextToSpeech();

  if (!userProfile?.birthDate) {
    logger.debug('No birthdate found, not showing zodiac badge');
    return null;
  }

  const handleZodiacClick = async () => {
    navigate('/full-horoscope');
    const phrase =
      language === 'ru'
        ? 'Переходим к полному гороскопу. Узнайте что говорят звезды о вашем будущем.'
        : language === 'es'
          ? 'Vamos al horóscopo completo. Descubre lo que las estrellas dicen sobre tu futuro.'
          : 'Let us go to the full horoscope. Discover what the stars say about your future.';
    try {
      generateAndPlaySpeech(phrase, { voice: 'Custom', model: 'eleven_multilingual_v2' });
    } catch (error) {
      console.error('Error playing horoscope phrase:', error);
    }
  };

  return (
    <button
      onClick={handleZodiacClick}
      className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-cosmic-indigo/25 bg-gradient-to-br from-cosmic-indigo/35 via-cosmic-dark/60 to-cosmic-indigo/15 p-5 text-left shadow-lg shadow-cosmic-indigo/30 transition-transform active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-indigo to-cosmic-accent/70 shadow-[0_0_30px_rgba(99,102,241,0.55)]">
          <div className="text-white">
            <ZodiacBadge size="md" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-white">
            {language === 'ru' ? 'Гороскоп' : language === 'es' ? 'Horóscopo' : 'Horoscope'}
          </div>
          <div className="mt-0.5 text-xs text-cosmic-secondary">
            {language === 'ru'
              ? 'Звёздная карта и прогноз по вашему пути'
              : language === 'es'
                ? 'Mapa estelar y pronóstico para tu camino'
                : 'Star map and guidance for your path'}
          </div>
        </div>
      </div>
    </button>
  );
};
