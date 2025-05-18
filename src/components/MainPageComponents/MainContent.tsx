
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
  // Log component rendering to help debug
  console.log("MainContent rendering with blocks");
  
  return (
    <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center">
      {/* 1. PactDisplay section - Shows active pacts or NoPactsView if none */}
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
      
      {/* 2. User Greeting and Daily Advice Display */}
      <DailyAdviceDisplay />
      
      {/* 3. Universe Chat Block */}
      <div className="w-full max-w-lg mx-auto">
        <UniverseMessageBlock />
      </div>
      
      {/* 4. Zodiac Badge Display */}
      <div className="w-full max-w-lg mx-auto">
        <ZodiacBadgeDisplay />
      </div>
      
      {/* 5. Numerology Display - with increased visibility */}
      <div className="w-full max-w-lg mx-auto mt-6">
        <NumerologyDisplay />
      </div>
      
      {/* 6. Meditation Block */}
      <div className="w-full max-w-lg mx-auto">
        <MeditationBlock />
      </div>
      
      {/* 7. Affirmations Block */}
      <div className="w-full max-w-lg mx-auto">
        <AffirmationsBlock />
      </div>
      
      {/* Action Buttons - at the bottom */}
      <div className="mt-auto">
        <ActionButtonsSection />
      </div>
    </main>
  );
};
