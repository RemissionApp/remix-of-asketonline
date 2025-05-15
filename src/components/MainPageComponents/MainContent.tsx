
import React from 'react';
import { PactDisplay } from './PactDisplay';
import { ZodiacBadgeDisplay } from '@/components/ZodiacBadgeDisplay';
import { ActionButtonsSection } from './ActionButtonsSection';
import { NoPactsView } from '@/components/NoPactsView';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Pact } from '@/types';
import { HoroscopeDisplay } from '@/components/HoroscopeDisplay';
import { Loader } from 'lucide-react';
import { UniverseChatBlock } from '@/components/UniverseChatBlock';

interface MainContentProps {
  activePacts: Pact[];
  currentPactIndex: number;
  currentPact: Pact | null;
  dailyQuote: string;
  showEnergyEffect: boolean;
  isLoading: boolean;
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
  isLoading,
  handlePrevPact,
  handleNextPact,
  handleCompleteDayWithEffect,
  getAscesisPrefix,
  formatRejection
}) => {
  // Show loading indicator while data is being fetched
  if (isLoading) {
    return (
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 mt-16">
        <div className="flex flex-col items-center justify-center p-8">
          <Loader className="h-12 w-12 text-cosmic-accent animate-spin mb-4" />
          <p className="text-cosmic-accent text-lg">Загрузка данных...</p>
        </div>
      </div>
    );
  }
  
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
          
          {/* Horoscope display */}
          <HoroscopeDisplay />
          
          {/* Make sure ZodiacBadgeDisplay is shown */}
          <ZodiacBadgeDisplay />
          
          {/* Universe Chat block with similar design to ZodiacBadgeDisplay */}
          <UniverseChatBlock />
          
          {/* Action buttons */}
          <ActionButtonsSection />
        </>
      ) : (
        <NoPactsView />
      )}
    </div>
  );
};
