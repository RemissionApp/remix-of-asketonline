
import React from 'react';
import { Book, Calculator, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { CosmicButton } from '@/components/CosmicButton';
import { calculateLifePathNumber, getNumerologyMeaning } from '@/utils/numerologyUtils';

export const NumerologyPreview: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleViewNumerology = () => {
    navigate('/numerology');
  };
  
  // Если у пользователя есть дата рождения, показываем его число пути
  const getLifePathNumber = () => {
    if (!userProfile?.birthDate) return null;
    
    const lifePathNumber = calculateLifePathNumber(String(userProfile.birthDate));
    const meaning = getNumerologyMeaning(lifePathNumber, language);
    
    return {
      number: lifePathNumber,
      title: meaning.title[language as keyof typeof meaning.title] || meaning.title.en
    };
  };
  
  const lifePathData = getLifePathNumber();
  
  const getTitleText = () => {
    if (language === 'ru') {
      return 'Нумерологический разбор';
    } else if (language === 'es') {
      return 'Análisis numerológico';
    }
    return 'Numerological analysis';
  };
  
  const getDescriptionText = () => {
    if (language === 'ru') {
      return lifePathData 
        ? `Ваше число пути: ${lifePathData.number}. ${lifePathData.title}` 
        : 'Узнайте свой нумерологический портрет и скрытый потенциал';
    } else if (language === 'es') {
      return lifePathData 
        ? `Su número de camino: ${lifePathData.number}. ${lifePathData.title}` 
        : 'Descubra su perfil numerológico y potencial oculto';
    }
    return lifePathData 
      ? `Your path number: ${lifePathData.number}. ${lifePathData.title}` 
      : 'Discover your numerological profile and hidden potential';
  };
  
  const getButtonText = () => {
    if (language === 'ru') {
      return 'Подробнее';
    } else if (language === 'es') {
      return 'Más detalles';
    }
    return 'Learn more';
  };
  
  const getProTitleText = () => {
    if (language === 'ru') {
      return 'Нумерологический разбор';
    } else if (language === 'es') {
      return 'Análisis numerológico';
    }
    return 'Numerological analysis';
  };
  
  const getProMessageText = () => {
    if (language === 'ru') {
      return 'Разблокируй PRO чтобы узнать свой нумерологический портрет';
    } else if (language === 'es') {
      return 'Desbloquea PRO para conocer tu perfil numerológico';
    }
    return 'Unlock PRO to discover your numerological profile';
  };
  
  const numerologyPreviewContent = (
    <Card className="bg-cosmic-dark/50 border-cosmic-accent/30 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-4">
            <Calculator size={28} className="text-cosmic-accent" />
          </div>
          <h3 className="text-xl font-serif text-cosmic-accent mb-2">
            {getTitleText()}
          </h3>
          <p className="text-cosmic-secondary mb-4 text-sm">
            {getDescriptionText()}
          </p>
          <CosmicButton 
            onClick={handleViewNumerology} 
            className="mt-2"
          >
            <Book size={16} className="mr-2" />
            {getButtonText()}
            <ArrowRight size={16} className="ml-2" />
          </CosmicButton>
        </div>
      </CardContent>
    </Card>
  );
  
  // Если пользователь не имеет PRO-подписки, оборачиваем в ProFeatureOverlay
  if (!userProfile?.isPro) {
    return (
      <ProFeatureOverlay 
        title={getProTitleText()}
        message={getProMessageText()}
      >
        {numerologyPreviewContent}
      </ProFeatureOverlay>
    );
  }
  
  return numerologyPreviewContent;
};
