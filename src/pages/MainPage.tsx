import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { EnergyEffect } from '@/components/EnergyEffect';
import { useNavigate } from 'react-router-dom';
import { MainContent } from '@/components/MainPageComponents/MainContent';
import { TrialBanner } from '@/components/TrialBanner';
import { useMainPageUtils } from '@/components/MainPageComponents/mainPageUtils';
import { useToast } from '@/hooks/use-toast';
import { MissionReminder } from '@/components/missions/MissionReminder';
import { createLogger } from '@/utils/logger';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { UserLevelDisplay } from '@/components/achievements/UserLevelDisplay';
import { useUserProgress } from '@/hooks/useUserProgress';
import { DailyUsageStats } from '@/components/DailyUsageStats';
import { PactCompletionDialog } from '@/components/PactCompletionDialog';
import { usePactCompletion } from '@/hooks/usePactCompletion';
import { DesktopMainExtras } from '@/components/desktop/DesktopMainExtras';

const MainPage: React.FC = () => {
  const {
    pacts = [],
    syncPactsWithCurrentDate,
    language,
    user,
    loadUserProfile,
    userProfile,
    setActiveScreen,
  } = useAppStore();
  const [currentPactIndex, setCurrentPactIndex] = useState(0);
  const [showEnergyEffect, setShowEnergyEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatRejection, getAscesisPrefix } = useMainPageUtils();
  const { handleAsyncError } = useErrorHandler();
  const { stats } = useUserProgress();
  const { dialogOpen, currentCompletedPact, handleDialogClose } =
    usePactCompletion();

  const logger = createLogger('MainPage');

  // Check if user is logged in and load user profile if needed
  useEffect(() => {
    const initializeUserData = async () => {
      logger.debug('Initializing user data');
      setIsLoading(true);

      try {
        // If user is logged in but we don't have profile data yet, load it
        if (user && !userProfile) {
          logger.debug('Loading user profile');
          await handleAsyncError(() => loadUserProfile(), {
            component: 'MainPage',
            action: 'loadUserProfile',
          });
        }

        // Then sync pacts with current date
        logger.debug('Syncing pacts with current date');
        syncPactsWithCurrentDate();
      } catch (error) {
        logger.error('Failed to initialize user data', error);
      } finally {
        setIsLoading(false);
        logger.debug('User data initialization complete');
      }
    };

    initializeUserData();
  }, [
    user,
    userProfile,
    loadUserProfile,
    syncPactsWithCurrentDate,
    handleAsyncError,
  ]);

  // Get all pacts (including failed ones for the slider) - sorted to prioritize active pacts
  const allPacts = (pacts || []).sort((a, b) => {
    // Sort by status priority: active > completed > failed
    const statusPriority = { active: 3, completed: 2, failed: 1 };
    const aPriority =
      statusPriority[a.status as keyof typeof statusPriority] || 0;
    const bPriority =
      statusPriority[b.status as keyof typeof statusPriority] || 0;

    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority first
    }

    // Within same status, sort by creation date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  const activePacts = pacts?.filter(p => p.status === 'active') || [];

  // Auto-select the first active pact or most recent pact when pacts change
  useEffect(() => {
    if (allPacts.length > 0) {
      const firstActivePactIndex = allPacts.findIndex(
        p => p.status === 'active'
      );
      const targetIndex = firstActivePactIndex >= 0 ? firstActivePactIndex : 0;

      if (currentPactIndex !== targetIndex) {
        setCurrentPactIndex(targetIndex);
      }
    }
  }, [allPacts.length, allPacts]);

  // Get current pact from all pacts for slider
  const currentPact = allPacts[currentPactIndex] || null;

  // Change handlers for the carousel - now works with all pacts
  const handlePrevPact = () => {
    if (currentPactIndex > 0) {
      setCurrentPactIndex(currentPactIndex - 1);
    } else {
      setCurrentPactIndex(allPacts.length - 1);
    }
  };

  const handleNextPact = () => {
    if (currentPactIndex < allPacts.length - 1) {
      setCurrentPactIndex(currentPactIndex + 1);
    } else {
      setCurrentPactIndex(0);
    }
  };

  // Empty string for dailyQuote since we're removing QuoteDisplay
  const dailyQuote = '';

  // Log visibility information in development
  logger.debug('MainPage render state', {
    hasUserProfile: !!userProfile,
    hasBirthDate: !!userProfile?.birthDate,
    isPro: userProfile?.isPro,
    activePacts: activePacts.length,
    isLoading,
  });

  return (
    <div className="min-h-screen flex flex-col relative pb-32 lg:pb-12">
      <StarField starCount={100} />

      {/* Fixed TopBar at the top */}
      <div className="fixed top-0 left-0 right-0 z-[100] lg:hidden">
        <TopBar />
      </div>

      {/* Energy effect animation */}
      <EnergyEffect show={showEnergyEffect} />

      {/* Main content */}
      <div>
        <div className="pt-16 lg:pt-0">
          <TrialBanner />
        </div>
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6 lg:items-start lg:max-w-6xl lg:mx-auto lg:px-4">
          <MainContent
            activePacts={activePacts}
            allPacts={allPacts}
            currentPactIndex={currentPactIndex}
            currentPact={currentPact}
            dailyQuote={dailyQuote}
            isLoading={isLoading}
            showEnergyEffect={showEnergyEffect}
            handlePrevPact={handlePrevPact}
            handleNextPact={handleNextPact}
            getAscesisPrefix={getAscesisPrefix}
            formatRejection={formatRejection}
          />
          <div className="lg:sticky lg:top-20 lg:pt-10">
            <DesktopMainExtras />
          </div>
        </div>
      </div>

      {/* Mission Reminder */}
      <MissionReminder />

      {/* Bottom navigation */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>

      {/* Pact completion dialog */}
      {currentCompletedPact && (
        <PactCompletionDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          pact={currentCompletedPact}
          energyEarned={currentCompletedPact.energyEarned}
          totalDays={currentCompletedPact.totalDays}
          onShareSuccess={() => {
            console.log('Shared pact completion');
          }}
          onCreateNewPact={() => {
            handleDialogClose(false);
            navigate('/create-pact');
          }}
        />
      )}
    </div>
  );
};

export default MainPage;
