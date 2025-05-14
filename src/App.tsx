
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { useAppStore } from "./store/useAppStore";
import WelcomePage from "./pages/WelcomePage";
import LanguagePage from "./pages/LanguagePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import OnboardingPage from "./pages/OnboardingPage";
import PactOathPage from "./pages/PactOathPage";
import MainPage from "./pages/MainPage";
import CreatePactPage from "./pages/CreatePactPage";
import UniversePage from "./pages/UniversePage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import ComparisonPage from "./pages/ComparisonPage";
import MeditationPage from "./pages/MeditationPage";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

// Component to sync router with app state
const RouterSync = () => {
  const { activeScreen, setActiveScreen, onboardingComplete } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  // When activeScreen changes in store, update URL
  useEffect(() => {
    const pathMap: Record<string, string> = {
      'welcome': '/',
      'language': '/language',
      'signin': '/signin',
      'signup': '/signup',
      'onboarding': '/onboarding',
      'pact-oath': '/pact-oath',
      'main': '/main',
      'create-pact': '/create-pact',
      'universe': '/universe',
      'profile': '/profile',
      'comparison': '/comparison',
      'meditation': '/meditation',
    };
    
    if (pathMap[activeScreen] && location.pathname !== pathMap[activeScreen]) {
      navigate(pathMap[activeScreen]);
    }
  }, [activeScreen, location.pathname, navigate]);
  
  // When URL changes, update activeScreen
  useEffect(() => {
    const screenMap: Record<string, typeof activeScreen> = {
      '/': 'welcome',
      '/language': 'language',
      '/signin': 'signin',
      '/signup': 'signup',
      '/onboarding': 'onboarding',
      '/pact-oath': 'pact-oath',
      '/main': 'main',
      '/create-pact': 'create-pact',
      '/universe': 'universe',
      '/profile': 'profile',
      '/comparison': 'comparison',
      '/meditation': 'meditation'
    };
    
    const newScreen = screenMap[location.pathname];
    if (newScreen && activeScreen !== newScreen) {
      setActiveScreen(newScreen);
    }
  }, [location.pathname, activeScreen, setActiveScreen]);

  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <RouterSync />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/language" element={<LanguagePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/pact-oath" element={<PactOathPage />} />
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
  );
};

export default App;
