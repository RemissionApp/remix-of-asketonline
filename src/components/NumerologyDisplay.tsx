
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useTranslations } from '@/hooks/useTranslations';
import { calculateLifePathNumber, getNumerologyMeaning } from '@/utils/numerologyUtils';
import { NumerologyContent } from './numerology/NumerologyContent';

export const NumerologyDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  
  // Only display if user has a birthdate
  if (!userProfile?.birthDate) {
    return null;
  }
  
  // Calculate the life path number using our utility function
  const lifePathNumber = calculateLifePathNumber(userProfile.birthDate);
  
  // Get the numerology meaning for the life path number
  const numerologyMeaning = getNumerologyMeaning(lifePathNumber, language);
  
  // Extract title and description based on language
  const title = numerologyMeaning.title[language as keyof typeof numerologyMeaning.title] || numerologyMeaning.title.en;
  const description = numerologyMeaning.description[language as keyof typeof numerologyMeaning.description] || numerologyMeaning.description.en;
  
  // Get appropriate text for "Numerology" and "Life Path" based on language
  const numerologyText = language === 'ru' ? 'Нумерология' : language === 'es' ? 'Numerología' : 'Numerology';
  const lifePathText = language === 'ru' ? 'Путь жизни' : language === 'es' ? 'Sendero de vida' : 'Life Path';
  const moreDetailsText = language === 'ru' ? 'Подробнее' : language === 'es' ? 'Más detalles' : 'More details';
  
  // Create the numerology content component
  const numerologyContent = (
    <NumerologyContent
      lifePathNumber={lifePathNumber}
      title={title}
      description={description}
      moreDetailsText={moreDetailsText}
    />
  );
  
  // If user is not PRO, wrap with ProFeatureOverlay
  if (!userProfile?.isPro) {
    const titleText = numerologyText;
    const messageText = language === 'ru' 
      ? 'Разблокируй PRO чтобы получить полный доступ к нумерологии' 
      : language === 'es' 
        ? 'Desbloquea PRO para obtener acceso completo a la numerología' 
        : 'Unlock PRO to get full access to numerology';
        
    return (
      <ProFeatureOverlay 
        title={titleText}
        message={messageText}
        className="mb-6 w-full max-w-lg mx-auto"
      >
        {numerologyContent}
      </ProFeatureOverlay>
    );
  }
  
  return numerologyContent;
};
