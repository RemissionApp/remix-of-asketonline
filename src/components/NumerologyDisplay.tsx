
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useTranslations } from '@/hooks/useTranslations';
import { calculateLifePathNumber, getNumerologyMeaning, calculateExpressionNumber, calculatePersonalityNumber } from '@/utils/numerologyUtils';
import { NumerologyContent } from './numerology/NumerologyContent';
import { Calculator } from 'lucide-react';

export const NumerologyDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  
  console.log("NumerologyDisplay rendering, userProfile:", userProfile);
  
  // Only display if user has a birthdate
  if (!userProfile?.birthDate) {
    console.log("No birthdate found, not showing numerology");
    return null;
  }
  
  // Calculate the life path number using our utility function
  const lifePathNumber = calculateLifePathNumber(String(userProfile.birthDate));
  
  // Calculate additional numerology numbers
  const expressionNumber = calculateExpressionNumber(userProfile.name || '');
  const personalityNumber = calculatePersonalityNumber(userProfile.name || '');
  
  // Get the numerology meaning for the life path number
  const numerologyMeaning = getNumerologyMeaning(lifePathNumber, language);
  
  // Extract title and description based on language
  const title = numerologyMeaning.title[language as keyof typeof numerologyMeaning.title] || numerologyMeaning.title.en;
  const description = numerologyMeaning.description[language as keyof typeof numerologyMeaning.description] || numerologyMeaning.description.en;
  
  // Get appropriate text for "Numerology" and "Life Path" based on language
  const numerologyText = language === 'ru' ? 'Нумерология' : language === 'es' ? 'Numerología' : 'Numerology';
  const lifePathText = language === 'ru' ? 'Путь жизни' : language === 'es' ? 'Sendero de vida' : 'Life Path';
  const expressionText = language === 'ru' ? 'Число выражения' : language === 'es' ? 'Número de expresión' : 'Expression Number';
  const personalityText = language === 'ru' ? 'Число личности' : language === 'es' ? 'Número de personalidad' : 'Personality Number';
  const moreDetailsText = language === 'ru' ? 'Подробнее' : language === 'es' ? 'Más detalles' : 'More details';
  
  // Create the numerology content component
  const numerologyContent = (
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6 w-full">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3">
            <Calculator size={20} className="text-cosmic-accent" />
          </div>
          <div>
            <h3 className={language === 'en' ? "font-serif font-medium" : "font-sans font-medium"}>
              {numerologyText}
            </h3>
          </div>
        </div>
        <NumerologyContent
          lifePathNumber={lifePathNumber}
          expressionNumber={expressionNumber}
          personalityNumber={personalityNumber}
          title={title}
          description={description}
          lifePathText={lifePathText}
          expressionText={expressionText}
          personalityText={personalityText}
          moreDetailsText={moreDetailsText}
        />
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
        title={numerologyText}
        message={language === 'ru' 
          ? 'Разблокируй PRO чтобы получить полный доступ к нумерологии' 
          : language === 'es' 
            ? 'Desbloquea PRO para obtener acceso completo a la numerología' 
            : 'Unlock PRO to get full access to numerology'}
        className="mb-6 w-full"
        navigateTo="/comparison"
        showUnlockPrompt={true}
        unlockText={proUnlockText}
      >
        {numerologyContent}
      </ProFeatureOverlay>
    );
  }
  
  return numerologyContent;
};
