
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
import { CosmicMissionsEntryPoint } from '@/components/MainPageComponents/CosmicMissionsEntryPoint';
import { ActiveMissionWidget } from '@/components/MainPageComponents/ActiveMissionWidget';
import { createLogger } from '@/utils/loggerUtils';

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
  const logger = createLogger('MainContent');
  
  logger.debug("MainContent rendering", { activePactsCount: activePacts.length, isLoading });
  
  return (
    <main className="flex-1 container mx-auto px-4 py-6 pt-20 flex flex-col items-center">
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
      
      {/* 2. Daily Advice with User Greeting */}
      <DailyAdviceDisplay />
      
      {/* 3. Active Mission Widget (if available) */}
      <ActiveMissionWidget />
      
      {/* 4. Cosmic Missions Entry Point */}
      <CosmicMissionsEntryPoint />
      
      {/* 5. Universe Message Block */}
      <div className="w-full max-w-lg mx-auto">
        <UniverseMessageBlock />
      </div>
      
      {/* 6. Zodiac Badge Display */}
      <div className="w-full max-w-lg mx-auto">
        <ZodiacBadgeDisplay />
      </div>
      
      {/* 7. Meditation Block */}
      <div className="w-full max-w-lg mx-auto">
        <MeditationBlock />
      </div>
      
      {/* 8. Numerology Display */}
      <div className="w-full max-w-lg mx-auto">
        <NumerologyDisplay />
      </div>
      
      {/* 9. Affirmations Block */}
      <div className="w-full max-w-lg mx-auto">
        <AffirmationsBlock />
      </div>
      
      {/* Action Buttons - Remains at the bottom */}
      <div className="mt-auto">
        <ActionButtonsSection />
      </div>
    </main>
  );
};
