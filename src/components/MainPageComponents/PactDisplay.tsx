import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Pact } from '@/types';
import { EnergyCircle } from '@/components/EnergyCircle';
import { CosmicButton } from '@/components/CosmicButton';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { PactSlider } from '@/components/PactSlider';
import { CountdownTimer } from '@/components/CountdownTimer';
import { BreakAscesisDialog } from '@/components/BreakAscesisDialog';

interface PactDisplayProps {
  activePacts: Pact[];
  allPacts: Pact[];
  currentPactIndex: number;
  currentPact: Pact | null;
  handlePrevPact: () => void;
  handleNextPact: () => void;
  getAscesisPrefix: () => string;
  formatRejection: (text: string) => string;
}

export const PactDisplay: React.FC<PactDisplayProps> = ({
  activePacts,
  allPacts,
  currentPactIndex,
  currentPact,
  handlePrevPact,
  handleNextPact,
  getAscesisPrefix,
  formatRejection,
}) => {
  const { t } = useTranslations();
  const { language, breakAscesis } = useAppStore();
  const [showBreakDialog, setShowBreakDialog] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);

  // Handle slider index change
  const handleSliderIndexChange = (newIndex: number) => {
    // Use existing navigation handlers to change pact
    const diff = newIndex - currentPactIndex;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        handleNextPact();
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        handlePrevPact();
      }
    }
  };

  const handleBreakAscesis = async (reason?: string) => {
    if (!currentPact || isBreaking) {
      console.log('Cannot break ascesis:', {
        currentPact: !!currentPact,
        isBreaking,
      });
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

  const activeDaysCompleted =
    currentPact.days?.filter(day => day.completed).length || 0;
  const progress = Math.round(
    (activeDaysCompleted / (currentPact.duration || 1)) * 100
  );

  // Pact type display
  const getPactTypeDisplay = () => {
    const type = currentPact.type || 'spiritual';
    switch (type) {
      case 'spiritual':
        return language === 'ru' ? 'Духовная' : language === 'es' ? 'Espiritual' : 'Spiritual';
      case 'physical':
        return language === 'ru' ? 'Физическая' : language === 'es' ? 'Física' : 'Physical';
      case 'mental':
        return language === 'ru' ? 'Ментальная' : language === 'es' ? 'Mental' : 'Mental';
      default:
        return language === 'ru' ? 'Аскеза' : language === 'es' ? 'Ascesis' : 'Asceticism';
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Countdown timer */}
      <div className="w-full bg-cosmic-dark/60 backdrop-blur-sm rounded-lg mb-6">
        <CountdownTimer pactId={currentPact.id} />
      </div>

      {/* Pact Slider */}
      {allPacts.length > 1 && (
        <PactSlider
          allPacts={allPacts}
          currentIndex={currentPactIndex}
          onIndexChange={handleSliderIndexChange}
          className="mb-6"
        />
      )}

      {/* Pact type display */}
      <div className="text-center mb-2">
        <span className="text-sm text-cosmic-secondary font-medium">
          {getPactTypeDisplay()}
        </span>
      </div>

      <h1 className="text-xl text-center uppercase font-serif text-white mb-4">
        {`${getAscesisPrefix()} ${formatRejection(currentPact.title || '')}`}
      </h1>

      <EnergyCircle 
        progress={progress} 
        size="lg"
        className={cn(
          currentPact.status === 'failed' && 'opacity-60 saturate-50',
          currentPact.status === 'failed' && 'ring-2 ring-red-500/30'
        )}
        style={currentPact.status === 'failed' ? {
          background: `conic-gradient(rgba(239, 68, 68, 0.4) ${progress}%, rgba(239, 68, 68, 0.1) 0%)`
        } : undefined}
      >
        <div className="text-center p-4">
          <p className={cn(
            "text-4xl font-bold font-serif",
            currentPact.status === 'failed' ? 'text-red-300' : 'text-white'
          )}>
            {activeDaysCompleted}/{currentPact.duration}
          </p>
          <p className={cn(
            "text-lg mt-2",
            currentPact.status === 'failed' ? 'text-red-400' : 'text-cosmic-accent'
          )}>
            {t.main.days}
          </p>
        </div>
      </EnergyCircle>

      {/* Break Ascesis button - only show for active pacts */}
      {currentPact.status === 'active' && (
        <CosmicButton
          className="mt-6 mb-4"
          variant="destructive"
          size="sm"
          disabled={isBreaking}
          onClick={() => {
            console.log('Break ascesis button clicked', {
              isBreaking,
              showBreakDialog,
            });
            if (!isBreaking) {
              setShowBreakDialog(true);
            }
          }}
        >
          {isBreaking
            ? language === 'ru'
              ? 'Прерывание...'
              : language === 'es'
                ? 'Rompiendo...'
                : 'Breaking...'
            : language === 'ru'
              ? 'Прервать аскезу'
              : language === 'es'
                ? 'Romper ascesis'
                : 'Break asceticism'}
        </CosmicButton>
      )}

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