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
import { AuthLoadingIndicator } from '@/components/LoadingStates/AuthLoadingIndicator';

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
  const [hasValidSession, setHasValidSession] = useState(false);
  
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

  // Check if user is logged in and load user data
  useEffect(() => {
    const initializeUserData = async () => {
      logger.debug('Starting MainPage initialization');
      setIsLoading(true);

      try {
        // First, verify we have a valid Supabase session
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        
        logger.debug('Session check in MainPage', {
          hasSession: !!session?.session,
          hasUser: !!session?.session?.user,
          userId: session?.session?.user?.id,
          sessionError: sessionError?.message
        });
        
        if (sessionError || !session?.session?.user) {
          logger.warn('No valid Supabase session in MainPage, redirecting to login');
          setHasValidSession(false);
          navigate('/login');
          return;
        }
        
        setHasValidSession(true);

        // Load user profile if we don't have it yet
        if (!userProfile) {
          logger.debug('Loading user profile in MainPage');
          await handleAsyncError(() => loadUserProfile(), {
            component: 'MainPage',
            action: 'loadUserProfile',
          });
        }

        // Sync pacts with current date to ensure all data is up to date
        logger.debug('Syncing pacts with current date in MainPage');
        await handleAsyncError(() => syncPactsWithCurrentDate(), {
          component: 'MainPage', 
          action: 'syncPactsWithCurrentDate',
        });
        
        logger.debug('MainPage initialization completed successfully');
      } catch (error) {
        logger.error('Failed to initialize MainPage user data', error);
        // Don't redirect on errors here, let user stay and try refresh
      } finally {
        setIsLoading(false);
      }
    };

    // Only initialize if we have a user in store (from AppInitializer)
    if (user) {
      initializeUserData();
    } else {
      logger.debug('No user in store, checking session...');
      // If no user in store, check if we need to redirect
      supabase.auth.getSession().then(({ data: session, error }) => {
        if (error || !session?.session?.user) {
          logger.debug('No session found, redirecting to login');
          navigate('/login');
        }
      });
      setIsLoading(false);
    }
  }, [user, userProfile, loadUserProfile, syncPactsWithCurrentDate, handleAsyncError, navigate, logger]);

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
          <AuthLoadingIndicator
            isLoading={isLoading}
            hasUser={!!user}
            hasSession={hasValidSession}
            userProfile={userProfile}
            pactsCount={allPacts.length}
          />
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
