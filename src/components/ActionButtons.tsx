
import React from 'react';
import { Headphones } from 'lucide-react';
import { CosmicButton } from './CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

export const ActionButtons: React.FC = () => {
  const { setActiveScreen, language } = useAppStore();
  const { t } = useTranslations();
  
  const meditationText = language === 'ru' ? 'Медитации' : 
                        language === 'es' ? 'Meditaciones' : 'Meditations';
  
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      <CosmicButton 
        variant="outline" 
        onClick={() => setActiveScreen('universe')}
      >
        {t.main.askUniverse}
      </CosmicButton>
      
      <CosmicButton 
        variant="outline"
        onClick={() => setActiveScreen('meditation')}
      >
        <Headphones className="mr-2" size={18} />
        {meditationText}
      </CosmicButton>
    </div>
  );
};
