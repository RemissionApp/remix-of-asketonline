
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import { useAppStore } from "./store/useAppStore";
import WelcomePage from "./pages/WelcomePage";
import LanguagePage from "./pages/LanguagePage";
import OnboardingPage from "./pages/OnboardingPage";
import MainPage from "./pages/MainPage";
import CreatePactPage from "./pages/CreatePactPage";
import UniversePage from "./pages/UniversePage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import ComparisonPage from "./pages/ComparisonPage";
import MeditationPage from "./pages/MeditationPage";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

// Component to sync router state with app state
const RouterSync = () => {
  const { activeScreen, setActiveScreen } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Map app screens to routes
    const screenToRoute: Record<string, string> = {
      'welcome': '/',
      'language': '/language',
      'onboarding': '/onboarding',
      'main': '/main',
      'create-pact': '/create-pact',
      'universe': '/universe',
      'profile': '/profile',
      'comparison': '/comparison',
      'meditation': '/meditation'
    };

    // Update URL when app state changes
    const route = screenToRoute[activeScreen] || '/';
    if (location.pathname !== route) {
      navigate(route);
    }
  }, [activeScreen, navigate, location.pathname]);

  useEffect(() => {
    // Map routes to app screens
    const routeToScreen: Record<string, string> = {
      '/': 'welcome',
      '/language': 'language',
      '/onboarding': 'onboarding',
      '/main': 'main',
      '/create-pact': 'create-pact',
      '/universe': 'universe',
      '/profile': 'profile',
      '/comparison': 'comparison',
      '/meditation': 'meditation'
    };

    // Update app state when URL changes
    const screen = routeToScreen[location.pathname];
    if (screen && screen !== activeScreen) {
      setActiveScreen(screen);
    }
  }, [location.pathname, activeScreen, setActiveScreen]);

  return null;
};

const AppContent = () => {
  const { activeScreen, onboardingComplete } = useAppStore();
  
  if (activeScreen === 'welcome') {
    return <WelcomePage />;
  }
  
  if (activeScreen === 'language') {
    return <LanguagePage />;
  }
  
  if (!onboardingComplete && activeScreen === 'onboarding') {
    return <OnboardingPage />;
  }
  
  switch (activeScreen) {
    case 'main':
      return <MainPage />;
    case 'create-pact':
      return <CreatePactPage />;
    case 'universe':
      return <UniversePage />;
    case 'profile':
      return <ProfilePage />;
    case 'comparison':
      return <ComparisonPage />;
    case 'meditation':
      return <MeditationPage />;
    default:
      return <MainPage />;
  }
};

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <RouterSync />
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/language" element={<LanguagePage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/create-pact" element={<CreatePactPage />} />
              <Route path="/universe" element={<UniversePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/comparison" element={<ComparisonPage />} />
              <Route path="/meditation" element={<MeditationPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
