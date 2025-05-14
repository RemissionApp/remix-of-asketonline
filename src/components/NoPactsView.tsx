
import React from 'react';
import { CosmicButton } from './CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

export const NoPactsView: React.FC = () => {
  const { setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  
  return (
    <div className="text-center">
      <h1 className="text-2xl font-serif text-white mb-4">
        {t.main.noPacts}
      </h1>
      
      <CosmicButton 
        onClick={() => setActiveScreen('create-pact')}
        className="mt-4"
      >
        {t.main.createPact}
      </CosmicButton>
    </div>
  );
};
