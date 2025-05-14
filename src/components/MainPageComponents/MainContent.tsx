
import React from 'react';
import { PactDisplay } from './PactDisplay';
import { DailyQuoteDisplay } from './DailyQuoteDisplay';
import { ZodiacDisplay } from './ZodiacDisplay';
import { ActionButtonsSection } from './ActionButtonsSection';
import { NoPactsView } from '@/components/NoPactsView';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Pact } from '@/types';
import { HoroscopeDisplay } from './HoroscopeDisplay';

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
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 mt-16 max-w-lg mx-auto">
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
          
          {/* Horoscope display */}
          <HoroscopeDisplay />
          
          {/* Quote display */}
          <DailyQuoteDisplay quote={dailyQuote} className="mt-2" />
          
          {/* Zodiac badge display */}
          <ZodiacDisplay />
          
          {/* Action buttons */}
          <ActionButtonsSection />
        </>
      ) : (
        <NoPactsView />
      )}
    </div>
  );
};
