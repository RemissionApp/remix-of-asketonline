
import React from 'react';
import ZodiacInfo from '@/components/ZodiacInfo';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useTranslations } from '@/hooks/useTranslations';
import { ZodiacBadge } from '@/components/ZodiacBadge';

export const ZodiacBadgeDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  
  console.log("ZodiacBadgeDisplay rendering, userProfile:", userProfile);
  
  // Only display if user has a birthdate
  if (!userProfile?.birthDate) {
    console.log("No birthdate found, not showing zodiac badge");
    return null;
  }
  
  const zodiacContent = (
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6 w-full">
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
