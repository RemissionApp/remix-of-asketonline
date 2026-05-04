import React from 'react';
import ZodiacInfo from '@/components/ZodiacInfo';
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

  logger.debug('Component rendering', {
    hasUserProfile: !!userProfile,
    hasBirthDate: !!userProfile?.birthDate,
    isPro: true,
  });

  // Only display if user has a birthdate
  if (!userProfile?.birthDate) {
    logger.debug('No birthdate found, not showing zodiac badge');
    return null;
  }

  const handleZodiacClick = async () => {
    navigate('/full-horoscope');

    const horoscopePhrase = getHoroscopePhrase();
    try {
      generateAndPlaySpeech(horoscopePhrase, {
        voice: 'Custom',
        model: 'eleven_multilingual_v2',
      });
    } catch (error) {
      console.error('Error playing horoscope phrase:', error);
    }
  };

  const getHoroscopePhrase = () => {
    switch (language) {
      case 'ru':
        return 'Переходим к полному гороскопу. Узнайте что говорят звезды о вашем будущем.';
      case 'es':
        return 'Vamos al horóscopo completo. Descubre lo que las estrellas dicen sobre tu futuro.';
      default:
        return 'Let us go to the full horoscope. Discover what the stars say about your future.';
    }
  };

  const zodiacContent = (
    <div
      className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-indigo/30 via-cosmic-dark/60 to-cosmic-accent/25 p-5 shadow-lg shadow-cosmic-accent/15 cursor-pointer"
      onClick={handleZodiacClick}
    >
      <div className="flex items-start gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-accent/80 to-cosmic-indigo/70 shadow-[0_0_30px_rgba(139,92,246,0.25)]">
          <div className="text-white">
            <ZodiacBadge size="md" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-white">
              {language === 'ru'
                ? 'Гороскоп'
                : language === 'es'
                  ? 'Horóscopo'
                  : 'Horoscope'}
            </h3>
            <p className="mt-0.5 text-xs text-cosmic-secondary">
              {language === 'ru'
                ? 'Звёздная карта и прогноз по вашему пути'
                : language === 'es'
                  ? 'Mapa estelar y pronóstico para tu camino'
                  : 'Star map and guidance for your path'}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
            <div className="text-cosmic-accent">
              <ZodiacInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return zodiacContent;
};
