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
import { UserLevelDisplay } from '@/components/achievements/UserLevelDisplay';
import { useUserProgress } from '@/hooks/useUserProgress';
import { supabase } from '@/lib/supabase';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleAsyncError } = useErrorHandler();
  const logger = createLogger('MainPage');

  // Get app store state
  const {
    pacts = [],
    syncPactsWithCurrentDate,
    loadPacts,
    language,
    user,
    loadUserProfile,
    userProfile,
    setActiveScreen,
  } = useAppStore();

  // Local state
  const [currentPactIndex, setCurrentPactIndex] = useState(0);
  const [showEnergyEffect, setShowEnergyEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hook calls
  const { formatRejection, getAscesisPrefix } = useMainPageUtils();
  const { stats } = useUserProgress();

  // Debug function to force reload pacts
  const handleRefreshData = async () => {
    console.log('MainPage: Force refreshing pacts data');
    setIsLoading(true);
    try {
      await loadPacts();
      console.log('MainPage: Force refresh completed');
    } catch (error) {
      console.error('MainPage: Force refresh failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is logged in and load user profile if needed
  useEffect(() => {
    const initializeUserData = async () => {
      logger.debug('Initializing user data');
      setIsLoading(true);

      try {
        // Check real Supabase session first
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.session?.user) {
          console.log('MainPage: No valid Supabase session, redirecting to login');
          navigate('/login');
          return;
        }

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
        console.log('MainPage: Syncing pacts with current date');
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
    navigate,
  ]);

  // Get all pacts (including failed ones for the slider)
  const allPacts = pacts || [];
  const activePacts = pacts?.filter(p => p.status === 'active') || [];

  // Get current pact from all pacts for slider
  const currentPact = allPacts[currentPactIndex] || null;

  // Debug logging for pacts state
  useEffect(() => {
    console.log('MainPage - Pacts state:', {
      totalPacts: allPacts.length,
      activePacts: activePacts.length,
      pactsData: allPacts.map(p => ({ id: p.id, title: p.title, status: p.status, days_total: p.days_total, days_completed: p.days_completed })),
      currentPactIndex,
      currentPact: currentPact ? { id: currentPact.id, title: currentPact.title } : null,
      isLoading,
      user: !!user,
    });
  }, [allPacts, activePacts, currentPactIndex, currentPact, isLoading, user]);

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

      {/* Debug refresh button - remove in production */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleRefreshData}
          className="bg-primary/20 hover:bg-primary/30 text-primary px-3 py-1 rounded-md text-sm"
        >
          Обновить данные
        </button>
      </div>

      {/* Main content */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full mx-auto"></div>
              <p className="text-muted-foreground">Загрузка аскез...</p>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Mission Reminder */}
      <MissionReminder />

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MainPage;
