
import React from 'react';
import { EnergyCircle } from './EnergyCircle';
import { CosmicButton } from './CosmicButton';
import { Pact } from '@/types';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';

interface ActivePactDisplayProps {
  pact: Pact | null;
  onCompleteDayClick: () => void;
  getAscesisPrefix: () => string;
  formatRejection: (text: string) => string;
}

export const ActivePactDisplay: React.FC<ActivePactDisplayProps> = ({
  pact,
  onCompleteDayClick,
  getAscesisPrefix,
  formatRejection
}) => {
  const { t } = useTranslations();
  
  if (!pact) return null;
  
  const activeDaysCompleted = pact.days.filter(day => day.completed).length;
  const progress = Math.round((activeDaysCompleted / pact.duration) * 100);
  
  return (
    <>
      <h1 className="text-xl text-center uppercase font-serif text-white mb-1">
        {`${getAscesisPrefix()} ${formatRejection(pact.title || '')}`}
      </h1>
      
      <EnergyCircle progress={progress} size="lg">
        <div className="text-center p-4">
          <p className="text-4xl font-bold font-serif text-white">
            {activeDaysCompleted}/{pact.duration}
          </p>
          <p className="text-lg text-cosmic-accent mt-2">{t.main?.days || "days"}</p>
        </div>
      </EnergyCircle>
      
      <CosmicButton 
        className="mt-8" 
        onClick={onCompleteDayClick}
      >
        {t.main?.todayCompleted || "Complete today"}
      </CosmicButton>
    </>
  );
};
