
import React from 'react';
import { DailyAdviceDisplay } from '@/components/DailyAdviceDisplay';
import { NoPactsView } from '@/components/NoPactsView';
import { PactDisplay } from '@/components/MainPageComponents/PactDisplay';
import { Pact } from '@/types';
import { ActionButtonsSection } from '@/components/MainPageComponents/ActionButtonsSection';
import { ZodiacBadgeDisplay } from '@/components/ZodiacBadgeDisplay';

interface MainContentProps {
  activePacts: Pact[];
  currentPactIndex: number;
  currentPact: Pact | null;
  dailyQuote: string;
  isLoading: boolean;
  showEnergyEffect: boolean;
  handlePrevPact: () => void;
  handleNextPact: () => void;
  handleBreakAscesis: () => void;
  getAscesisPrefix: () => string;
  formatRejection: (text: string) => string;
}

export const MainContent: React.FC<MainContentProps> = ({
  activePacts,
  currentPactIndex,
  currentPact,
  dailyQuote,
  isLoading,
  showEnergyEffect,
  handlePrevPact,
  handleNextPact,
  handleBreakAscesis,
  getAscesisPrefix,
  formatRejection
}) => {
  return (
    <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center">
      {/* Pact or No-Pacts View - Now first */}
      <div className={`w-full ${showEnergyEffect ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
        {activePacts.length > 0 && currentPact ? (
          <PactDisplay
            activePacts={activePacts}
            currentPactIndex={currentPactIndex}
            currentPact={currentPact}
            handlePrevPact={handlePrevPact}
            handleNextPact={handleNextPact}
            handleBreakAscesis={handleBreakAscesis}
            getAscesisPrefix={getAscesisPrefix}
            formatRejection={formatRejection}
          />
        ) : !isLoading ? (
          <NoPactsView />
        ) : null}
      </div>
      
      {/* Daily Advice Display - Now second */}
      <DailyAdviceDisplay />
      
      {/* Zodiac Badge Display - Now third */}
      <ZodiacBadgeDisplay />
      
      {/* Action Buttons - Remains at the bottom */}
      <div className="mt-auto">
        <ActionButtonsSection />
      </div>
    </main>
  );
};
