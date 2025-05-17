
import React from 'react';
import { DailyAdviceDisplay } from '@/components/DailyAdviceDisplay';
import { NoPactsView } from '@/components/NoPactsView';
import { PactDisplay } from '@/components/MainPageComponents/PactDisplay';
import { Pact } from '@/types';
import { ActionButtonsSection } from '@/components/MainPageComponents/ActionButtonsSection';
import { ZodiacBadgeDisplay } from '@/components/ZodiacBadgeDisplay';
import { NumerologyDisplay } from '@/components/NumerologyDisplay';
import { UniverseChatBlock } from '@/components/UniverseChatBlock';
import { MeditationBlock } from '@/components/MainPageComponents/MeditationBlock';
import { AffirmationsBlock } from '@/components/MainPageComponents/AffirmationsBlock';

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
      {/* 1. PactDisplay - First */}
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
      
      {/* 2. Greeting is inside DailyAdviceDisplay component - Second */}
      {/* 3. Daily Advice - Third */}
      <DailyAdviceDisplay />
      
      {/* 4. Zodiac Badge Display - Fourth */}
      <ZodiacBadgeDisplay />
      
      {/* 5. Numerology Display - Fifth */}
      <NumerologyDisplay />
      
      {/* 6. Affirmations Block - Sixth (New) */}
      <AffirmationsBlock />
      
      {/* 7. Meditation Block - Seventh */}
      <MeditationBlock />
      
      {/* 8. Universe Chat Block - Eighth */}
      <UniverseChatBlock />
      
      {/* Action Buttons - Remains at the bottom but now empty */}
      <div className="mt-auto">
        <ActionButtonsSection />
      </div>
    </main>
  );
};
