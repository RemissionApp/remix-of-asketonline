
import React from 'react';
import { Calculator, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const NumerologyPreview: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleViewNumerology = () => {
    console.log("Navigating to numerology page from preview");
    navigate('/numerology');
  };
  
  // Get appropriate text based on language
  const numerologyText = language === 'ru' ? 'Нумерология' : language === 'es' ? 'Numerología' : 'Numerology';
  const descriptionText = language === 'ru' 
    ? 'Узнай свой нумерологический портрет и скрытый потенциал личности' 
    : language === 'es'
      ? 'Descubre tu perfil numerológico y el potencial oculto de tu personalidad'
      : 'Discover your numerological profile and the hidden potential of your personality';
  const moreDetailsText = language === 'ru' ? 'Подробнее' : language === 'es' ? 'Más detalles' : 'More details';
  const proMessageText = language === 'ru' 
    ? 'Разблокируй PRO чтобы получить полный доступ к нумерологии' 
    : language === 'es'
      ? 'Desbloquea PRO para obtener acceso completo a la numerología'
      : 'Unlock PRO to get full access to numerology';
  
  const numerologyPreviewContent = (
    <Card className="bg-cosmic-dark/50 border-cosmic-accent/30 backdrop-blur-sm p-4">
      <CardContent className="p-0">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-4">
            <Calculator size={28} className="text-cosmic-accent" />
          </div>
          <h3 className="text-xl font-serif text-cosmic-accent mb-2">
            {numerologyText}
          </h3>
          <p className="text-cosmic-secondary mb-4 text-sm">
            {descriptionText}
          </p>
          <Button 
            onClick={handleViewNumerology} 
            className="bg-cosmic-accent/20 border border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/30"
          >
            {moreDetailsText}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  
  // If user is not PRO, wrap with ProFeatureOverlay
  if (!userProfile?.isPro) {
    return (
      <ProFeatureOverlay 
        title={numerologyText}
        message={proMessageText}
      >
        {numerologyPreviewContent}
      </ProFeatureOverlay>
    );
  }
  
  return numerologyPreviewContent;
};
