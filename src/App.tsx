
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

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
            <Routes>
              <Route path="/" element={<AppContent />} />
              <Route path="/comparison" element={<ComparisonPage />} />
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
