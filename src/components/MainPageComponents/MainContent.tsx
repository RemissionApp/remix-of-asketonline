
import React from 'react';
import { DailyAdviceDisplay } from '@/components/DailyAdviceDisplay';
import { NoPactsView } from '@/components/NoPactsView';
import { PactDisplay } from '@/components/MainPageComponents/PactDisplay';
import { Pact } from '@/types';
import { ActionButtonsSection } from '@/components/MainPageComponents/ActionButtonsSection';
import { ZodiacBadgeDisplay } from '@/components/ZodiacBadgeDisplay';
import { NumerologyDisplay } from '@/components/NumerologyDisplay';
import { UniverseMessageBlock } from '@/components/universe/UniverseMessageBlock';
import { MeditationBlock } from '@/components/MainPageComponents/MeditationBlock';
import { AffirmationsBlock } from '@/components/MainPageComponents/AffirmationsBlock';
import { UserGreetingSection } from '@/components/MainPageComponents/UserGreetingSection';

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
      {/* Always show the user greeting section */}
      <UserGreetingSection />
      
      <div className={`w-full ${showEnergyEffect ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
        {activePacts.length > 0 && currentPact ? (
          <>
            {/* When pacts exist, show the pact display */}
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
            
            {/* Also show these components only when pacts exist */}
            <DailyAdviceDisplay />
            <div className="w-full max-w-lg mx-auto">
              <UniverseMessageBlock />
            </div>
            <div className="w-full max-w-lg mx-auto">
              <ZodiacBadgeDisplay />
            </div>
            <div className="w-full max-w-lg mx-auto">
              <MeditationBlock />
            </div>
            <div className="w-full max-w-lg mx-auto">
              <NumerologyDisplay />
            </div>
            <div className="w-full max-w-lg mx-auto">
              <AffirmationsBlock />
            </div>
          </>
        ) : !isLoading ? (
          /* When no pacts exist, only show the NoPactsView */
          <NoPactsView />
        ) : null}
      </div>
      
      {/* Action Buttons - Only show when pacts exist */}
      {activePacts.length > 0 && (
        <div className="mt-auto">
          <ActionButtonsSection />
        </div>
      )}
    </main>
  );
};
