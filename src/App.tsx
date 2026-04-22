import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
// Removed TooltipProvider import as we temporarily disabled it
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

import { NotificationIntegrations } from './utils/notifications/notificationIntegrations';
import { performanceMonitor } from './utils/performance';
import { SafeAreaView } from './components/SafeAreaView';
import { AppRouter } from './components/AppRouter';
import { AuthBootstrap } from './components/auth/AuthBootstrap';

// Создаем новый экземпляр QueryClient
const queryClient = new QueryClient();

// Lightweight non-auth initializer (settings, notifications, perf).
// Auth is handled by <AuthBootstrap>.
const AppInitializer = () => {
  const logger = createLogger('AppInitializer');
  const initializeSettings = useAppStore(s => s.initializeSettings);

  useEffect(() => {
    try {
      initializeSettings();
      NotificationIntegrations.initializeAll();
      performanceMonitor.initWebVitals();
    } catch (err) {
      logger.error('AppInitializer error', err);
    }
  }, [initializeSettings, logger]);

  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <NotificationProvider>
          <SafeAreaView>
            <BrowserRouter>
              <AppInitializer />
              <AuthBootstrap>
                <div className="">
                  <AppRouter />
                </div>
                <PWAInstallPrompt />
                <PWAUpdateNotification />
              </AuthBootstrap>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </SafeAreaView>
        </NotificationProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
