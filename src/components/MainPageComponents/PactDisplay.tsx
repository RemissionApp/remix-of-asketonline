
import React from 'react';
import { cn } from '@/lib/utils';
import { Pact } from '@/types';
import { EnergyCircle } from '@/components/EnergyCircle';
import { CosmicButton } from '@/components/CosmicButton';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { PactNavigation } from '@/components/PactNavigation';

interface PactDisplayProps {
  activePacts: Pact[];
  currentPactIndex: number;
  currentPact: Pact | null;
  handlePrevPact: () => void;
  handleNextPact: () => void;
  handleBreakAscesis: () => void;
  getAscesisPrefix: () => string;
  formatRejection: (text: string) => string;
}

export const PactDisplay: React.FC<PactDisplayProps> = ({
  activePacts,
  currentPactIndex,
  currentPact,
  handlePrevPact,
  handleNextPact,
  handleBreakAscesis,
  getAscesisPrefix,
  formatRejection
}) => {
  const { t } = useTranslations();
  const { language } = useAppStore();
  
  if (!currentPact) return null;
  
  const activeDaysCompleted = currentPact.days?.filter(day => day.completed).length || 0;
  const progress = Math.round((activeDaysCompleted / (currentPact.duration || 1)) * 100);
  
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Use PactNavigation component instead of inline navigation */}
      {activePacts.length > 1 && (
        <PactNavigation 
          currentIndex={currentPactIndex}
          totalPacts={activePacts.length}
          onPrevious={handlePrevPact}
          onNext={handleNextPact}
        />
      )}
      
      <h1 className="text-xl text-center uppercase font-serif text-white mb-1">
        {`${getAscesisPrefix()} ${formatRejection(currentPact.title || '')}`}
      </h1>
      
      <EnergyCircle progress={progress} size="lg">
        <div className="text-center p-4 flex flex-col items-center">
          <p className="text-4xl font-bold font-serif text-white">
            {activeDaysCompleted}/{currentPact.duration}
          </p>
          <p className="text-lg text-cosmic-accent mt-2">{t.main.days}</p>
          
          {/* Break Ascesis button moved inside the circle */}
          <CosmicButton 
            className="mt-4" 
            variant="destructive"
            size="sm"
            onClick={handleBreakAscesis}
          >
            {language === 'ru' ? 'Прервать аскезу' : language === 'es' ? 'Romper ascesis' : 'Break asceticism'}
          </CosmicButton>
        </div>
      </EnergyCircle>
    </div>
  );
};
