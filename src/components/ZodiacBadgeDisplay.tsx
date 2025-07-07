
import React from 'react';
import ZodiacInfo from '@/components/ZodiacInfo';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useTranslations } from '@/hooks/useTranslations';
import { ZodiacBadge } from '@/components/ZodiacBadge';
import { useNavigate } from 'react-router-dom';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { createLogger } from '@/utils/loggerUtils';

export const ZodiacBadgeDisplay: React.FC = () => {
  const logger = createLogger('ZodiacBadgeDisplay');
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const { generateAndPlaySpeech } = useTextToSpeech();
  
  logger.debug("Component rendering", { 
    hasUserProfile: !!userProfile,
    hasBirthDate: !!userProfile?.birthDate,
    isPro: userProfile?.isPro 
  });
  
  // Only display if user has a birthdate
  if (!userProfile?.birthDate) {
    logger.debug("No birthdate found, not showing zodiac badge");
    return null;
  }
  
  const handleZodiacClick = async () => {
    if (userProfile?.isPro) {
      // Переходим сразу
      navigate('/full-horoscope');
      
      // Воспроизводим фразу в фоновом режиме
      const horoscopePhrase = getHoroscopePhrase();
      try {
        generateAndPlaySpeech(horoscopePhrase, { 
          voice: 'Custom', 
          model: 'eleven_multilingual_v2' 
        });
      } catch (error) {
        console.error('Error playing horoscope phrase:', error);
      }
    }
  };

  const getHoroscopePhrase = () => {
    switch(language) {
      case 'ru': return 'Переходим к полному гороскопу. Узнайте что говорят звезды о вашем будущем.';
      case 'es': return 'Vamos al horóscopo completo. Descubre lo que las estrellas dicen sobre tu futuro.';
      default: return 'Let us go to the full horoscope. Discover what the stars say about your future.';
    }
  };
  
  const zodiacContent = (
    <div 
      className={`cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6 w-full ${userProfile?.isPro ? 'cursor-pointer hover:border-cosmic-accent/60 transition-all' : ''}`}
      onClick={handleZodiacClick}
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3">
            <div className="text-cosmic-accent">
              <ZodiacBadge size="md" />
            </div>
          </div>
          <div>
            <h3 className={language === 'en' ? "font-serif font-medium" : "font-sans font-medium"}>
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
  if (!userProfile?.isPro) {
    const proUnlockText = language === 'ru' 
      ? 'Открой функции PRO' 
      : language === 'es' 
        ? 'Desbloquea funciones PRO' 
        : 'Unlock PRO functions';
        
    return (
      <ProFeatureOverlay 
        title={language === 'ru' ? 'Гороскоп' : language === 'es' ? 'Horóscopo' : 'Horoscope'}
        message={language === 'ru' ? 'Разблокируй PRO чтобы получить полный доступ к гороскопу' : 
                language === 'es' ? 'Desbloquea PRO para acceso completo al horóscopo' : 
                'Unlock PRO to get full access to horoscope'}
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
