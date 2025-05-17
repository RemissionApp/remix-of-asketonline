
import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Pact } from '@/types';
import { EnergyCircle } from '@/components/EnergyCircle';
import { CosmicButton } from '@/components/CosmicButton';
import { useTranslations } from '@/hooks/useTranslations';

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
  
  if (!currentPact) return null;
  
  const activeDaysCompleted = currentPact.days?.filter(day => day.completed).length || 0;
  const progress = Math.round((activeDaysCompleted / (currentPact.duration || 1)) * 100);
  
  return (
    <>
      {/* Pact navigation controls */}
      {activePacts.length > 1 && (
        <div className="mb-4 flex items-center justify-center">
          <button 
            onClick={handlePrevPact} 
            className="text-cosmic-accent p-1 mr-2"
            aria-label="Previous pact"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex space-x-1">
            {activePacts.map((_, index) => (
              <div 
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full",
                  index === currentPactIndex 
                    ? "bg-cosmic-accent" 
                    : "bg-cosmic-accent/30"
                )}
              />
            ))}
          </div>
          <button 
            onClick={handleNextPact} 
            className="text-cosmic-accent p-1 ml-2"
            aria-label="Next pact"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
      
      <h1 className="text-xl text-center uppercase font-serif text-white mb-1">
        {`${getAscesisPrefix()} ${formatRejection(currentPact.title || '')}`}
      </h1>
      
      <EnergyCircle progress={progress} size="lg">
        <div className="text-center p-4">
          <p className="text-4xl font-bold font-serif text-white">
            {activeDaysCompleted}/{currentPact.duration}
          </p>
          <p className="text-lg text-cosmic-accent mt-2">{t.main.days}</p>
        </div>
      </EnergyCircle>
      
      <CosmicButton 
        className="mt-8" 
        variant="destructive"
        onClick={handleBreakAscesis}
      >
        <X size={16} />
        {language === 'ru' ? 'Прервать аскезу' : language === 'es' ? 'Romper ascesis' : 'Break asceticism'}
      </CosmicButton>
    </>
  );
};
