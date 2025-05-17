
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useTranslations } from '@/hooks/useTranslations';
import { calculateLifePathNumber, getNumerologyMeaning } from '@/utils/numerologyUtils';
import { NumerologyContent } from './numerology/NumerologyContent';
import { Calculator } from 'lucide-react';

export const NumerologyDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  
  // Only display if user has a birthdate
  if (!userProfile?.birthDate) {
    return null;
  }
  
  // Calculate the life path number using our utility function
  // Make sure to pass birthDate as a string
  const lifePathNumber = calculateLifePathNumber(String(userProfile.birthDate));
  
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
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6 w-full max-w-lg mx-auto">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3">
            <Calculator size={20} className="text-cosmic-accent" />
          </div>
          <div>
            <h3 className="font-sans font-medium">{numerologyText}</h3>
          </div>
        </div>
        <NumerologyContent
          lifePathNumber={lifePathNumber}
          title={title}
          description={description}
          moreDetailsText={moreDetailsText}
        />
      </div>
    </div>
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
