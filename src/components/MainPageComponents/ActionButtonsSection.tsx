
import React from 'react';
import { Headphones } from 'lucide-react';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';

export const ActionButtonsSection: React.FC = () => {
  const { setActiveScreen, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleUniverseClick = () => {
    setActiveScreen('universe');
    navigate('/universe');
  };
  
  const handleMeditationClick = () => {
    setActiveScreen('meditation');
    navigate('/meditation');
  };
  
  const meditationText = language === 'ru' ? 'Медитации' : 
                        language === 'es' ? 'Meditaciones' : 'Meditations';
  
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      <CosmicButton 
        variant="outline" 
        onClick={handleUniverseClick}
      >
        {t.main.askUniverse}
      </CosmicButton>
      
      <CosmicButton 
        variant="outline"
        onClick={handleMeditationClick}
      >
        <Headphones className="mr-2" size={18} />
        {meditationText}
      </CosmicButton>
    </div>
  );
};
