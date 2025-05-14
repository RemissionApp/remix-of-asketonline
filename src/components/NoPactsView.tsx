
import React from 'react';
import { CosmicButton } from './CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

interface NoPactsViewProps {
  onCreatePactClick?: () => void;
}

export const NoPactsView: React.FC<NoPactsViewProps> = ({ onCreatePactClick }) => {
  const { language } = useAppStore();
  const { t } = useTranslations();
  
  return (
    <div className="text-center">
      <h1 className="text-2xl font-serif text-white mb-4">
        {t.main.noPacts}
      </h1>
      
      <CosmicButton 
        onClick={onCreatePactClick}
        className="mt-4"
      >
        {language === 'ru' ? 'Заключить договор' : 
         language === 'es' ? 'Hacer un pacto' : 'Make a covenant'}
      </CosmicButton>
    </div>
  );
};
