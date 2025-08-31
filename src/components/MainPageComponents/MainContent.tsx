import React from 'react';
import { DailyAdviceDisplay } from '@/components/DailyAdviceDisplay';
import { NoPactsView } from '@/components/NoPactsView';
import { PactDisplay } from '@/components/MainPageComponents/PactDisplay';
import { Pact } from '@/types';
import { ZodiacBadgeDisplay } from '@/components/ZodiacBadgeDisplay';
import { NumerologyDisplay } from '@/components/NumerologyDisplay';
import { UniverseMessageBlock } from '@/components/universe/UniverseMessageBlock';
import { MeditationBlock } from '@/components/MainPageComponents/MeditationBlock';
import { AffirmationsBlock } from '@/components/MainPageComponents/AffirmationsBlock';
import { UserGreetingSection } from '@/components/MainPageComponents/UserGreetingSection';
import { CosmicMissionsEntryPoint } from '@/components/MainPageComponents/CosmicMissionsEntryPoint';
import { ActiveMissionWidget } from '@/components/MainPageComponents/ActiveMissionWidget';
import { UserLevelDisplay } from '@/components/achievements/UserLevelDisplay';
import { useUserProgress } from '@/hooks/useUserProgress';

interface MainContentProps {
  activePacts: Pact[];
  allPacts: Pact[];
  currentPactIndex: number;
  currentPact: Pact | null;
  dailyQuote: string;
  isLoading: boolean;
  showEnergyEffect: boolean;
  handlePrevPact: () => void;
  handleNextPact: () => void;
  getAscesisPrefix: () => string;
  formatRejection: (text: string) => string;
}

export const MainContent: React.FC<MainContentProps> = ({
  activePacts,
  allPacts,
  currentPactIndex,
  currentPact,
  dailyQuote,
  isLoading,
  showEnergyEffect,
  handlePrevPact,
  handleNextPact,
  getAscesisPrefix,
  formatRejection,
}) => {
  const { stats } = useUserProgress();
  return (
    <main className="flex-1 container mx-auto px-4 py-6 pt-20 flex flex-col items-center">
      {/* 1. User Greeting Section - First */}
      <UserGreetingSection />

      {/* 2. PactDisplay */}
      <div
        className={`w-full relative z-50 ${showEnergyEffect ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      >
        {allPacts.length > 0 && currentPact ? (
          <PactDisplay
            activePacts={activePacts}
            allPacts={allPacts}
            currentPactIndex={currentPactIndex}
            currentPact={currentPact}
            handlePrevPact={handlePrevPact}
            handleNextPact={handleNextPact}
            getAscesisPrefix={getAscesisPrefix}
            formatRejection={formatRejection}
          />
        ) : !isLoading ? (
          <NoPactsView />
        ) : null}
      </div>

      {/* 3. Daily Advice */}
      <DailyAdviceDisplay />

      {/* 3.1. User Level Display */}
      <UserLevelDisplay
        level={stats?.level || 1}
        experiencePoints={stats?.experiencePoints || 0}
        experienceToNextLevel={stats?.experienceToNextLevel || 100}
        totalEnergyEarned={stats?.totalEnergyEarned || 0}
        className="w-full max-w-lg mx-auto"
      />

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
    </main>
  );
};
