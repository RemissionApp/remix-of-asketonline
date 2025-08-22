import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { EnergyEffect } from '@/components/EnergyEffect';
import { useNavigate } from 'react-router-dom';
import { MainContent } from '@/components/MainPageComponents/MainContent';
import { useMainPageUtils } from '@/components/MainPageComponents/mainPageUtils';
import { useToast } from '@/hooks/use-toast';
import { MissionReminder } from '@/components/missions/MissionReminder';
import { createLogger } from '@/utils/logger';
import { useErrorHandler } from '@/hooks/useErrorHandler';

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

  // Get all pacts (including failed ones for the slider)
  const allPacts = pacts || [];
  const activePacts = pacts?.filter(p => p.status === 'active') || [];

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
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />

      {/* Fixed TopBar at the top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopBar />
      </div>

      {/* Energy effect animation */}
      <EnergyEffect show={showEnergyEffect} />

      {/* Main content */}
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

      {/* Mission Reminder */}
      <MissionReminder />

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MainPage;
