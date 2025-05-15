
import React from 'react';
import { Book, ListNumbers, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { CosmicButton } from '@/components/CosmicButton';

export const NumerologyPreview: React.FC = () => {
  const { userProfile } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleViewNumerology = () => {
    navigate('/numerology');
  };
  
  const numerologyPreviewContent = (
    <Card className="bg-cosmic-dark/50 border-cosmic-accent/30 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-4">
            <ListNumbers size={28} className="text-cosmic-accent" />
          </div>
          <h3 className="text-xl font-serif text-cosmic-accent mb-2">
            {t.numerology?.title || "Нумерологический разбор"}
          </h3>
          <p className="text-cosmic-secondary mb-4 text-sm">
            {t.numerology?.description || "Узнай свой нумерологический портрет и скрытый потенциал личности"}
          </p>
          <CosmicButton 
            onClick={handleViewNumerology} 
            className="mt-2"
          >
            <Book size={16} className="mr-2" />
            {t.numerology?.learnMore || "Подробнее"}
            <ArrowRight size={16} className="ml-2" />
          </CosmicButton>
        </div>
      </CardContent>
    </Card>
  );
  
  // If user is not PRO, wrap with ProFeatureOverlay
  if (!userProfile?.isPro) {
    return (
      <ProFeatureOverlay 
        title={t.numerology?.proTitle || "Нумерологический разбор"}
        message={t.numerology?.proMessage || "Разблокируй PRO чтобы узнать свой нумерологический портрет"}
      >
        {numerologyPreviewContent}
      </ProFeatureOverlay>
    );
  }
  
  return numerologyPreviewContent;
};
