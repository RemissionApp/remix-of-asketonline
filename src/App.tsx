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
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { PWAUpdateNotification } from './components/PWAUpdateNotification';
import { NotificationProvider } from './components/notifications/NotificationSystem';

import { NotificationIntegrations } from './utils/notifications/notificationIntegrations';
import { performanceMonitor } from './utils/performance';
import { SafeAreaView } from './components/SafeAreaView';
import { AppRouter } from './components/AppRouter';
import { AuthBootstrap } from './components/auth/AuthBootstrap';
import { TrialExpiredGate } from './components/TrialExpiredGate';

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
                <TrialExpiredGate />
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
