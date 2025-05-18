
import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useTranslations } from '@/hooks/useTranslations';
import { calculateLifePathNumber, getNumerologyMeaning, calculateExpressionNumber, calculatePersonalityNumber } from '@/utils/numerologyUtils';
import { NumerologyContent } from './numerology/NumerologyContent';
import { Calculator, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

export const NumerologyDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Log when component mounts for debugging
    console.log("NumerologyDisplay mounted with:", {
      userProfile,
      birthDateExists: !!userProfile?.birthDate,
      isPro: userProfile?.isPro,
      language
    });
    
    return () => {
      console.log("NumerologyDisplay unmounted");
    };
  }, [userProfile, language]);
  
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
  
  const handleNavigateToNumerology = () => {
    console.log("Navigating to numerology page from NumerologyDisplay");
    navigate('/numerology');
  };
  
  // Create the numerology content component with enhanced visibility
  const numerologyContent = (
    <div className="cosmic-block backdrop-blur-sm border-2 border-cosmic-accent/40 rounded-lg mb-6 w-full hover:border-cosmic-accent/60 transition-all">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3">
            <Calculator size={24} className="text-cosmic-accent animate-pulse-slow" />
          </div>
          <div>
            <h3 className={`text-xl ${language === 'en' ? "font-serif" : "font-sans"} font-medium text-cosmic-accent`}>
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
        <Button
          onClick={handleNavigateToNumerology}
          variant="outline"
          className="w-full mt-3 bg-cosmic-dark/50 border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/20 hover:text-white transition-colors"
        >
          {moreDetailsText}
          <ArrowRight size={16} className="ml-2" />
        </Button>
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
        
    console.log("Rendering NumerologyDisplay with PRO overlay");
    return (
      <ProFeatureOverlay 
        title={titleText}
        message={messageText}
        className="mb-6 w-full"
      >
        {numerologyContent}
      </ProFeatureOverlay>
    );
  }
  
  console.log("Rendering NumerologyDisplay without PRO overlay");
  return numerologyContent;
};
