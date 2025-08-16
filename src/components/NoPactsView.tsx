import React from 'react';
import { CosmicButton } from './CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';

interface NoPactsViewProps {
  onCreatePactClick?: () => void;
}

export const NoPactsView: React.FC<NoPactsViewProps> = ({
  onCreatePactClick,
}) => {
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
    <div className="text-center">
      <h1 className="text-2xl font-serif text-white mb-4">{t.main.noPacts}</h1>

      <CosmicButton
        onClick={handleCreatePact}
        className="mt-4"
        variant="outline"
      >
        {language === 'ru'
          ? 'Заключить договор'
          : language === 'es'
            ? 'Hacer un pacto'
            : 'Make a covenant'}
      </CosmicButton>
    </div>
  );
};
