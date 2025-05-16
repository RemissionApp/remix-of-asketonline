
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useBriefHoroscope } from '@/hooks/useBriefHoroscope';
import { BriefHoroscopeContent } from './sections/BriefHoroscopeContent';
import { BriefHoroscopeLoading } from './sections/BriefHoroscopeLoading';

export const BriefHoroscopeDisplay: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const navigate = useNavigate();
  
  // Check if user is PRO
  const isPro = userProfile?.isPro || false;
  
  // Get translated button text based on language
  const seeMoreText = {
    ru: 'Подробнее',
    en: 'See More',
    es: 'Ver Más',
  }[language] || 'See More';
  
  // Use our custom hook to handle horoscope data and loading state
  const { horoscope, loading, displayedText, isTyping } = useBriefHoroscope();

  const handleSeeMore = () => {
    // Navigate to detailed horoscope page
    navigate('/detailed-horoscope');
  };
  
  // Signature based on language
  const signature = language === 'ru' ? '— Послание Вселенной' : 
                   language === 'es' ? '— Mensaje del Universo' : 
                   '— Message from the Universe';
  
  const horoscopeContent = (
    <div className="w-full max-w-lg mx-auto text-center">
      {loading ? (
        <BriefHoroscopeLoading language={language} />
      ) : (
        <BriefHoroscopeContent 
          displayedText={displayedText} 
          isTyping={isTyping}
          horoscopeDescription={horoscope?.description}
          signature={signature}
          language={language}
          seeMoreText={seeMoreText}
          onSeeMore={handleSeeMore}
        />
      )}
    </div>
  );
  
  // For non-PRO users, wrap with ProFeatureOverlay if showing detailed content
  if (!isPro && !loading) {
    return (
      <div className="cosmic-block bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6 w-full max-w-lg mx-auto">
        {horoscopeContent}
      </div>
    );
  }
  
  return (
    <div className="cosmic-block bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6 w-full max-w-lg mx-auto">
      {horoscopeContent}
    </div>
  );
};
