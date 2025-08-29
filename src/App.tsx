
import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { createLogger } from '@/utils/logger';
import { useTranslations } from '@/hooks/useTranslations';

import { useAppStore } from './store/useAppStore';
import { supabase, cleanupAuthState } from './lib/supabase';
import WelcomePage from './pages/WelcomePage';
import LanguagePage from './pages/LanguagePage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import MainPage from './pages/MainPage';
import CreatePactPage from './pages/CreatePactPage';
import PactsPage from './pages/PactsPage';
import UniversePage from './pages/UniversePage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import ComparisonPage from './pages/ComparisonPage';
import PaywallPage from './pages/PaywallPage';
import MeditationPage from './pages/MeditationPage';
import NewMeditationPage from './pages/NewMeditationPage';
import DetailedHoroscopePage from './pages/DetailedHoroscopePage';
import FullHoroscopePage from './pages/FullHoroscopePage';
import UniverseChatPage from './pages/UniverseChatPage';
import CallPage from './pages/CallPage';
import NumerologyPage from './pages/NumerologyPage';
import MeditationProPage from './pages/MeditationProPage';
import AffirmationsPage from './pages/AffirmationsPage';
import CosmicMissionsPage from './pages/CosmicMissionsPage';
import { ArtifactCollectionPage } from './pages/ArtifactCollectionPage';
import AchievementsPage from './pages/AchievementsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import DeleteAccountPage from './pages/DeleteAccountPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { PWAUpdateNotification } from './components/PWAUpdateNotification';
import { NotificationProvider } from './components/notifications/NotificationSystem';
import { AudioProvider } from './contexts/AudioContext';
import { NavigationAudioManager } from './components/navigation/NavigationAudioManager';

import { NotificationIntegrations } from './utils/notifications/notificationIntegrations';
import { performanceMonitor } from './utils/performance';

// Create new QueryClient instance
const queryClient = new QueryClient();

// App initialization component
const AppInitializer = () => {
  const logger = createLogger('AppInitializer');

  try {
  const {
    checkOnboardingStatus,
    user,
    setUser,
    initializeSettings,
    loadUserProfile,
  } = useAppStore();

  useEffect(() => {
    // Initialize settings from localStorage
    initializeSettings();

    // Check onboarding status on app load
    checkOnboardingStatus();

    // Initialize push notifications
    NotificationIntegrations.initializeAll();

    // Initialize performance monitoring
    performanceMonitor.initWebVitals();

    // Set up auth state change listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('Auth state changed', { event, userId: session?.user?.id, hasSession: !!session });

      // Handle auth state changes synchronously
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        
        // Load user profile after setting user (defer to prevent blocking)
        setTimeout(async () => {
          try {
            await loadUserProfile();
            logger.debug('Profile loaded after auth state change');
          } catch (error) {
            logger.error('Failed to load profile after auth change', error);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // THEN check current session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          logger.error('Error getting session', error);
          return;
        }

        if (data.session?.user) {
          logger.info('Found existing session', { userId: data.session.user.id });
          setUser(data.session.user);
          
          // Load profile for existing session
          try {
            await loadUserProfile();
            logger.debug('Profile loaded for existing session');
          } catch (error) {
            logger.error('Failed to load profile for existing session', error);
          }
        } else {
          logger.info('No existing session found');
        }
      } catch (error) {
        logger.error('Failed to check session', error);
      }
    };

    checkSession();

    // Unsubscribe on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [checkOnboardingStatus, setUser, initializeSettings, loadUserProfile]);

    return null;
  } catch (error) {
    logger.error('Error in AppInitializer', error);
    return null;
  }
};

// OAuth callback handler component
const AuthCallback = () => {
  const logger = createLogger('AuthCallback');
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserProfile, user, loadUserProfile } = useAppStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get auth data from URL
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const queryParams = new URLSearchParams(location.search);

      // Check if this is an auth callback
      if (hashParams.get('access_token') || queryParams.get('code')) {
        try {
          // Handle redirect internally
          const { data, error } = await supabase.auth.getSession();

          if (error) throw error;

          if (data?.session?.user) {
            // Clean auth state to prevent issues
            await cleanupAuthState();

            // Load user profile data
            await loadUserProfile();

            // Redirect to profile setup or main
            navigate('/profile-setup');
          }
        } catch (error) {
          logger.error('Auth callback error', error);
          navigate('/login');
        }
      } else {
        // Not an auth callback, redirect to main
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [location, navigate, updateUserProfile, user, loadUserProfile]);

  const { t } = useTranslations();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-cosmic-accent border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-cosmic-secondary">{t.auth.signingIn}</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <BrowserRouter>
            <AudioProvider>
              <NotificationProvider>
                <AppInitializer />
                <NavigationAudioManager />
                <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/language" element={<LanguagePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile-setup" element={<UserProfilePage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/create-pact" element={<CreatePactPage />} />
                <Route path="/pacts" element={<PactsPage />} />
                <Route path="/universe" element={<UniversePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/account-settings"
                  element={<AccountSettingsPage />}
                />
                <Route path="/comparison" element={<ComparisonPage />} />
                <Route path="/paywall" element={<PaywallPage />} />
                <Route path="/meditation" element={<MeditationPage />} />
                <Route
                  path="/meditation/session"
                  element={<NewMeditationPage />}
                />
                <Route
                  path="/detailed-horoscope"
                  element={<DetailedHoroscopePage />}
                />
                <Route path="/full-horoscope" element={<FullHoroscopePage />} />
                <Route path="/affirmations" element={<AffirmationsPage />} />
                {/* Pro features routes */}
                <Route path="/meditation-pro" element={<MeditationProPage />} />
                <Route path="/universe-chat" element={<UniverseChatPage />} />
                <Route path="/universe-call" element={<CallPage />} />
                <Route path="/numerology" element={<NumerologyPage />} />
                <Route path="/cosmic-missions" element={<CosmicMissionsPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/artifacts" element={<ArtifactCollectionPage />} />
                {/* Legal Pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route
                  path="/terms-of-service"
                  element={<TermsOfServicePage />}
                />
                <Route path="/delete-account" element={<DeleteAccountPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
                <PWAInstallPrompt />
                <PWAUpdateNotification />
              </NotificationProvider>
            </AudioProvider>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </ErrorBoundary>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
