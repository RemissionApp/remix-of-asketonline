
import React from 'react';
import ZodiacInfo from '@/components/ZodiacInfo';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useTranslations } from '@/hooks/useTranslations';

export const ZodiacBadgeDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  
  // Only display if user has a birthdate
  if (!userProfile?.birthDate) {
    return null;
  }
  
  const zodiacContent = (
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6 w-full max-w-lg mx-auto">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3">
            <div className="text-cosmic-accent">♈</div>
          </div>
          <div>
            <h3 className={language === 'en' ? "font-serif font-medium" : "font-sans font-medium"}>
              {t.zodiac?.title || "Гороскоп"}
            </h3>
          </div>
        </div>
        <ZodiacInfo />
      </div>
    </div>
  );
  
  // If user is not PRO, wrap with ProFeatureOverlay
  if (!userProfile?.isPro) {
    return (
      <ProFeatureOverlay 
        title="Гороскоп"
        message="Разблокируй PRO чтобы получить полный доступ к гороскопу"
        className="mb-6 w-full max-w-lg mx-auto"
      >
        {zodiacContent}
      </ProFeatureOverlay>
    );
  }
  
  return zodiacContent;
};
