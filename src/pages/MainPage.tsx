
import React, { useEffect, useState } from 'react';
import { BreakAscesisDialog } from '@/components/BreakAscesisDialog';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { EnergyEffect } from '@/components/EnergyEffect';
import { useNavigate } from 'react-router-dom';
import { MainContent } from '@/components/MainPageComponents/MainContent';
import { useMainPageUtils } from '@/components/MainPageComponents/mainPageUtils';
import { useToast } from '@/hooks/use-toast';
import { CountdownTimer } from '@/components/CountdownTimer';
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
    // Get the breakAscesis function from the store
    breakAscesis
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
      logger.debug("Initializing user data");
      setIsLoading(true);
      
      try {
        // If user is logged in but we don't have profile data yet, load it
        if (user && !userProfile) {
          logger.debug("Loading user profile");
          await handleAsyncError(
            () => loadUserProfile(),
            { component: 'MainPage', action: 'loadUserProfile' }
          );
        }
        
        // Then sync pacts with current date
        logger.debug("Syncing pacts with current date");
        syncPactsWithCurrentDate();
      } catch (error) {
        logger.error("Failed to initialize user data", error);
      } finally {
        setIsLoading(false);
        logger.debug("User data initialization complete");
      }
    };
    
    initializeUserData();
  }, [user, userProfile, loadUserProfile, syncPactsWithCurrentDate, handleAsyncError]);
  
  // Filter active pacts
  const activePacts = pacts?.filter(p => p.status === 'active') || [];
  
  // Get current pact
  const currentPact = activePacts[currentPactIndex] || null;
  
  // Change handlers for the carousel
  const handlePrevPact = () => {
    if (currentPactIndex > 0) {
      setCurrentPactIndex(currentPactIndex - 1);
    } else {
      setCurrentPactIndex(activePacts.length - 1);
    }
  };
  
  const handleNextPact = () => {
    if (currentPactIndex < activePacts.length - 1) {
      setCurrentPactIndex(currentPactIndex + 1);
    } else {
      setCurrentPactIndex(0);
    }
  };
  
  // Handler for breaking ascesis
  const [breakDialogOpen, setBreakDialogOpen] = React.useState(false);
  
  const handleBreakAscesis = () => {
    if (currentPact) {
      setBreakDialogOpen(true);
    }
  };

  const confirmBreakAscesis = async (reason?: string) => {
    if (currentPact) {
      await breakAscesis(currentPact.id, reason);
      
      // If this was the only pact, reset the index
      if (activePacts.length === 1) {
        setCurrentPactIndex(0);
      }
      // If we're at the last pact and it's being removed, go back one
      else if (currentPactIndex === activePacts.length - 1) {
        setCurrentPactIndex(currentPactIndex - 1);
      }
    }
  };
  
  // Empty string for dailyQuote since we're removing QuoteDisplay
  const dailyQuote = '';
  
  // Log visibility information in development
  logger.debug("MainPage render state", {
    hasUserProfile: !!userProfile,
    hasBirthDate: !!userProfile?.birthDate,
    isPro: userProfile?.isPro,
    activePacts: activePacts.length,
    isLoading
  });
  
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      {/* Use the TopBar component */}
      <TopBar />
      
      {/* Always show the countdown timer when there's an active pact - fixed at top */}
      {activePacts.length > 0 && 
        <div className="sticky top-16 z-20 w-full bg-cosmic-dark/70 backdrop-blur-md shadow-md">
          <CountdownTimer pactId={currentPact?.id} />
        </div>
      }
      
      {/* Energy effect animation */}
      <EnergyEffect show={showEnergyEffect} />
      
      {/* Main content */}
      <MainContent
        activePacts={activePacts}
        currentPactIndex={currentPactIndex}
        currentPact={currentPact}
        dailyQuote={dailyQuote}
        isLoading={isLoading}
        showEnergyEffect={showEnergyEffect}
        handlePrevPact={handlePrevPact}
        handleNextPact={handleNextPact}
        handleBreakAscesis={handleBreakAscesis}
        getAscesisPrefix={getAscesisPrefix}
        formatRejection={formatRejection}
      />
      
      {/* Mission Reminder */}
      <MissionReminder />
      
      {/* Break Ascesis Dialog */}
      {currentPact && (
        <BreakAscesisDialog
          pact={currentPact}
          isOpen={breakDialogOpen}
          onClose={() => setBreakDialogOpen(false)}
          onConfirm={confirmBreakAscesis}
        />
      )}
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MainPage;
