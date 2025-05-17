
import React from 'react';
import { CosmicButton } from './CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';

interface NoPactsViewProps {
  onCreatePactClick?: () => void;
}

export const NoPactsView: React.FC<NoPactsViewProps> = ({ onCreatePactClick }) => {
  const { language, setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleCreatePact = () => {
    // Use the provided handler if it exists
    if (onCreatePactClick) {
      onCreatePactClick();
      return;
    }
    
    // Otherwise handle navigation directly from this component
    setActiveScreen('create-pact');
    navigate('/create-pact');
  };
  
  return (
    <div className="text-center py-8">
      <h1 className="text-2xl font-serif text-white mb-8">
        {t.main.noPacts}
      </h1>
      
      <CosmicButton 
        onClick={handleCreatePact}
        className="mt-4 mb-5"
        variant="white"
      >
        {language === 'ru' ? 'Заключить договор' : 
         language === 'es' ? 'Hacer un pacto' : 'Make a covenant'}
      </CosmicButton>
      
      <p className="text-cosmic-secondary text-sm mt-2">
        {language === 'ru' ? 'Нет действующих договоров со вселенной' : 
         language === 'es' ? 'No hay pactos activos con el universo' : 
         'No active covenants with the universe'}
      </p>
    </div>
  );
};
