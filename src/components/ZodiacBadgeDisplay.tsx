import React from 'react';
import ZodiacInfo from '@/components/ZodiacInfo';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useTranslations } from '@/hooks/useTranslations';
import { ZodiacBadge } from '@/components/ZodiacBadge';
import { useNavigate } from 'react-router-dom';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { createLogger } from '@/utils/logger';

export const ZodiacBadgeDisplay: React.FC = () => {
  const logger = createLogger('ZodiacBadgeDisplay');
  const { userProfile, language, user } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const { generateAndPlaySpeech } = useTextToSpeech();
  const { hasActiveSubscription } = useRevenueCat(user?.id);

  logger.debug('Component rendering', {
    hasUserProfile: !!userProfile,
    hasBirthDate: !!userProfile?.birthDate,
    isPro: hasActiveSubscription,
  });

  // Only display if user has a birthdate
  if (!userProfile?.birthDate) {
    logger.debug('No birthdate found, not showing zodiac badge');
    return null;
  }

  const handleZodiacClick = async () => {
    if (hasActiveSubscription) {
      // Переходим сразу
      navigate('/full-horoscope');

      // Воспроизводим фразу в фоновом режиме
      const horoscopePhrase = getHoroscopePhrase();
      try {
        generateAndPlaySpeech(horoscopePhrase, {
          voice: 'Custom',
          model: 'eleven_multilingual_v2',
        });
      } catch (error) {
        console.error('Error playing horoscope phrase:', error);
      }
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
      className={`glass-card mb-4 sm:mb-6 w-full ${hasActiveSubscription ? 'cursor-pointer' : ''}`}
      onClick={handleZodiacClick}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-center mb-2 sm:mb-3">
          <div className="glass-icon-wrap !p-1.5 sm:!p-2 !mr-2 sm:!mr-3">
            <div className="text-cosmic-accent">
              <ZodiacBadge size="md" />
            </div>
          </div>
          <div>
            <h3
              className={`text-base sm:text-xl font-medium ${
                language === 'en' ? 'font-serif' : 'font-display'
              }`}
            >
              {language === 'ru'
                ? 'Гороскоп'
                : language === 'es'
                  ? 'Horóscopo'
                  : 'Horoscope'}
            </h3>
          </div>
        </div>
        <ZodiacInfo />
      </div>
    </div>
  );

  // If user is not PRO, wrap with ProFeatureOverlay
  if (!hasActiveSubscription) {
    const proUnlockText =
      language === 'ru'
        ? 'Открой функции PRO'
        : language === 'es'
          ? 'Desbloquea funciones PRO'
          : 'Unlock PRO functions';

    return (
      <ProFeatureOverlay
        title={
          language === 'ru'
            ? 'Гороскоп'
            : language === 'es'
              ? 'Horóscopo'
              : 'Horoscope'
        }
        message={
          language === 'ru'
            ? 'Разблокируй PRO чтобы получить полный доступ к гороскопу'
            : language === 'es'
              ? 'Desbloquea PRO para acceso completo al horóscopo'
              : 'Unlock PRO to get full access to horoscope'
        }
        className="mb-6 w-full"
        navigateTo="/comparison"
        showUnlockPrompt={true}
        unlockText={proUnlockText}
      >
        {zodiacContent}
      </ProFeatureOverlay>
    );
  }

  return zodiacContent;
};
