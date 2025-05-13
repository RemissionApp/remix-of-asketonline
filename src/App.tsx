
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { supabase } from "./integrations/supabase/client";
import AuthRedirect from "./components/AuthRedirect";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

const AppContent = () => {
  const { activeScreen, onboardingComplete, setSession, setUser } = useAppStore();
  
  // Check for existing session and set up auth listener
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [setSession, setUser]);
  
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
            <Routes>
              <Route path="/" element={<AppContent />} />
              <Route path="/comparison" element={<ComparisonPage />} />
              <Route path="/meditation" element={<MeditationPage />} />
              
              {/* Auth routes - redirect if already logged in */}
              <Route path="/signin" element={
                <AuthRedirect authRequired={false} redirectTo="/">
                  <SignInPage />
                </AuthRedirect>
              } />
              <Route path="/signup" element={
                <AuthRedirect authRequired={false} redirectTo="/">
                  <SignUpPage />
                </AuthRedirect>
              } />
              
              {/* Protected routes - require authentication */}
              <Route path="/profile" element={
                <AuthRedirect>
                  <ProfilePage />
                </AuthRedirect>
              } />
              
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
