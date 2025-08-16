
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Pact } from '@/types';
import { EnergyCircle } from '@/components/EnergyCircle';
import { CosmicButton } from '@/components/CosmicButton';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { PactNavigation } from '@/components/PactNavigation';
import { CountdownTimer } from '@/components/CountdownTimer';
import { BreakAscesisDialog } from '@/components/BreakAscesisDialog';

interface PactDisplayProps {
  activePacts: Pact[];
  currentPactIndex: number;
  currentPact: Pact | null;
  handlePrevPact: () => void;
  handleNextPact: () => void;
  getAscesisPrefix: () => string;
  formatRejection: (text: string) => string;
}

export const PactDisplay: React.FC<PactDisplayProps> = ({
  activePacts,
  currentPactIndex,
  currentPact,
  handlePrevPact,
  handleNextPact,
  getAscesisPrefix,
  formatRejection
}) => {
  const { t } = useTranslations();
  const { language, breakAscesis } = useAppStore();
  const [showBreakDialog, setShowBreakDialog] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  
  const handleBreakAscesis = async (reason?: string) => {
    if (!currentPact || isBreaking) {
      console.log('Cannot break ascesis:', { currentPact: !!currentPact, isBreaking });
      return;
    }
    
    console.log('Breaking ascesis:', { pactId: currentPact.id, reason });
    setIsBreaking(true);
    
    try {
      if (!breakAscesis) {
        throw new Error('breakAscesis function not available');
      }
      await breakAscesis(currentPact.id, reason);
      setShowBreakDialog(false);
    } catch (error) {
      console.error('Failed to break ascesis:', error);
    } finally {
      setIsBreaking(false);
    }
  };

  if (!currentPact) return null;
  
  const activeDaysCompleted = currentPact.days?.filter(day => day.completed).length || 0;
  const progress = Math.round((activeDaysCompleted / (currentPact.duration || 1)) * 100);
  
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Countdown timer moved here to scroll with content */}
      <div className="w-full bg-cosmic-dark/60 backdrop-blur-sm rounded-lg mb-1">
        <CountdownTimer pactId={currentPact.id} />
      </div>
      
      {/* Use PactNavigation component instead of inline navigation */}
      {activePacts.length > 1 && (
        <PactNavigation 
          currentIndex={currentPactIndex}
          totalPacts={activePacts.length}
          pacts={activePacts}
          onPrevious={handlePrevPact}
          onNext={handleNextPact}
        />
      )}
      
      <h1 className="text-xl text-center uppercase font-serif text-white mb-1">
        {`${getAscesisPrefix()} ${formatRejection(currentPact.title || '')}`}
      </h1>
      
      {/* Display pact type if available */}
      {currentPact.type && (
        <div className="text-sm text-cosmic-accent/80 text-center mb-2 uppercase tracking-wider">
          {currentPact.type}
        </div>
      )}
      
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
            disabled={isBreaking}
            onClick={() => {
              console.log('Break ascesis button clicked', { isBreaking, showBreakDialog });
              if (!isBreaking) {
                setShowBreakDialog(true);
              }
            }}
          >
            {isBreaking 
              ? (language === 'ru' ? 'Прерывание...' : language === 'es' ? 'Rompiendo...' : 'Breaking...')
              : (language === 'ru' ? 'Прервать аскезу' : language === 'es' ? 'Romper ascesis' : 'Break asceticism')
            }
          </CosmicButton>
        </div>
      </EnergyCircle>
      
      {/* Break Ascesis Dialog */}
      <div className="relative z-[300]">
        <BreakAscesisDialog
          pact={currentPact}
          isOpen={showBreakDialog}
          onClose={() => setShowBreakDialog(false)}
          onConfirm={handleBreakAscesis}
        />
      </div>
    </div>
  );
};
