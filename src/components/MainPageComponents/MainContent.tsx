
import React from 'react';
import { PactDisplay } from './PactDisplay';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { ZodiacBadgeDisplay } from '@/components/ZodiacBadgeDisplay';
import { ActionButtonsSection } from './ActionButtonsSection';
import { NoPactsView } from '@/components/NoPactsView';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Pact } from '@/types';

interface MainContentProps {
  activePacts: Pact[];
  currentPactIndex: number;
  currentPact: Pact | null;
  dailyQuote: string;
  showEnergyEffect: boolean;
  handlePrevPact: () => void;
  handleNextPact: () => void;
  handleCompleteDayWithEffect: () => void;
  getAscesisPrefix: () => string;
  formatRejection: (text: string) => string;
}

export const MainContent: React.FC<MainContentProps> = ({
  activePacts,
  currentPactIndex,
  currentPact,
  dailyQuote,
  handlePrevPact,
  handleNextPact,
  handleCompleteDayWithEffect,
  getAscesisPrefix,
  formatRejection
}) => {
  return (
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 mt-16">
      {activePacts.length > 0 ? (
        <>
          <PactDisplay
            activePacts={activePacts}
            currentPactIndex={currentPactIndex}
            currentPact={currentPact}
            handlePrevPact={handlePrevPact}
            handleNextPact={handleNextPact}
            handleCompleteDayWithEffect={handleCompleteDayWithEffect}
            getAscesisPrefix={getAscesisPrefix}
            formatRejection={formatRejection}
          />
          
          {/* Countdown timer for current pact */}
          {currentPact && <CountdownTimer />}
          
          {/* Quote display */}
          <QuoteDisplay quote={dailyQuote} className="mt-12" />
          
          {/* Zodiac badge display */}
          <ZodiacBadgeDisplay />
          
          {/* Action buttons */}
          <ActionButtonsSection />
        </>
      ) : (
        <NoPactsView />
      )}
    </div>
  );
};
