import React, { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { createLogger } from '@/utils/loggerUtils';

import { useAppStore } from './store/useAppStore';
import { supabase, cleanupAuthState } from './lib/supabase';
import WelcomePage from './pages/WelcomePage';
import LanguagePage from './pages/LanguagePage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import MainPage from './pages/MainPage';
import CreatePactPage from './pages/CreatePactPage';
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
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { PWAUpdateNotification } from './components/PWAUpdateNotification';

import { NotificationIntegrations } from './utils/notifications/notificationIntegrations';

// Создаем новый экземпляр QueryClient
const queryClient = new QueryClient();

// Компонент глобальной инициализации приложения
const AppInitializer = () => {
  const logger = createLogger('AppInitializer');

  try {
    const { checkOnboardingStatus, user, loadUserProfile, setUser } =
      useAppStore();

    useEffect(() => {
      // Проверяем состояние onboarding при загрузке приложения
      checkOnboardingStatus();

      // Инициализируем push-уведомления
      NotificationIntegrations.initializeAll();

      // Настраиваем слушатель изменений состояния аутентификации
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        logger.info('Auth state changed', { event, userId: session?.user?.id });

        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);

          // Отложенная загрузка данных пользователя для предотвращения deadlock
          setTimeout(() => {
            loadUserProfile();
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      // Проверяем текущую сессию при инициализации
      const checkSession = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            logger.error('Ошибка получения сессии', error);
            return;
          }

          if (data.session?.user) {
            setUser(data.session.user);
            await loadUserProfile();
          }
        } catch (error) {
          logger.error('Не удалось проверить сессию', error);
        }
      };

      checkSession();

      // Отписываемся при размонтировании
      return () => {
        subscription.unsubscribe();
      };
    }, [checkOnboardingStatus, loadUserProfile, setUser]);

    return null;
  } catch (error) {
    logger.error('Error in AppInitializer', error);
    return null;
  }
};

// Компонент для обработки перенаправлений OAuth
const AuthCallback = () => {
  const logger = createLogger('AuthCallback');
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserProfile, user, loadUserProfile } = useAppStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Получаем данные аутентификации из URL
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const queryParams = new URLSearchParams(location.search);

      // Проверяем, является ли это обратным вызовом аутентификации
      if (hashParams.get('access_token') || queryParams.get('code')) {
        try {
          // Обрабатываем перенаправление внутренне
          const { data, error } = await supabase.auth.getSession();

          if (error) throw error;

          if (data?.session?.user) {
            // Очищаем состояние аутентификации для предотвращения проблем
            cleanupAuthState();

            // Загружаем данные профиля пользователя
            await loadUserProfile();

            // Перенаправляем на настройку профиля или главную
            navigate('/profile-setup');
          }
        } catch (error) {
          logger.error('Ошибка обратного вызова аутентификации', error);
          navigate('/login');
        }
      } else {
        // Не является обратным вызовом аутентификации, перенаправляем на главную
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [location, navigate, updateUserProfile, user, loadUserProfile]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-cosmic-accent border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-cosmic-secondary">Выполняется вход...</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppInitializer />
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/language" element={<LanguagePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile-setup" element={<UserProfilePage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/create-pact" element={<CreatePactPage />} />
              <Route path="/universe" element={<UniversePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/comparison" element={<ComparisonPage />} />
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
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <PWAInstallPrompt />
            <PWAUpdateNotification />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </QueryClientProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;
