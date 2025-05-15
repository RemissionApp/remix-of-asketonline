
import React from 'react';
import ZodiacInfo from '@/components/ZodiacInfo';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useTranslations } from '@/hooks/useTranslations';

export const ZodiacBadgeDisplay: React.FC = () => {
  const { userProfile } = useAppStore();
  const { t } = useTranslations();
  
  // Only display if user has a birthdate
  if (!userProfile?.birthDate) {
    return null;
  }
  
  const zodiacContent = (
    <div className="cosmic-block bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6 w-full max-w-lg mx-auto">
      <ZodiacInfo />
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
