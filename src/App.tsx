
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import { useAppStore } from "./store/useAppStore";
import WelcomePage from "./pages/WelcomePage";
import LanguagePage from "./pages/LanguagePage";
import LoginPage from "./pages/LoginPage";
import UserProfilePage from "./pages/UserProfilePage";
import OnboardingPage from "./pages/OnboardingPage";
import MainPage from "./pages/MainPage";
import CreatePactPage from "./pages/CreatePactPage";
import UniversePage from "./pages/UniversePage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import ComparisonPage from "./pages/ComparisonPage";
import MeditationPage from "./pages/MeditationPage";
import DetailedHoroscopePage from "./pages/DetailedHoroscopePage";
import UniverseChatPage from "./pages/UniverseChatPage";
import NumerologyPage from "./pages/NumerologyPage";
import { supabase, cleanupAuthState } from "./lib/supabase";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Global onboarding check component
const AppInitializer = () => {
  const { checkOnboardingStatus } = useAppStore();
  
  useEffect(() => {
    // Check onboarding status on app load
    checkOnboardingStatus();
  }, [checkOnboardingStatus]);
  
  return null;
};

// AuthCallback component to handle OAuth redirects
const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserProfile, user, loadUserProfile } = useAppStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the auth data from the URL
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const queryParams = new URLSearchParams(location.search);
      
      // Check if this is an auth callback
      if (hashParams.get('access_token') || queryParams.get('code')) {
        try {
          // Handle the redirect internally
          const { data, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          if (data?.session?.user) {
            // Clean up auth state to prevent issues
            cleanupAuthState();
            
            // Load user profile data
            await loadUserProfile();
            
            // Navigate to profile setup or main
            navigate('/profile-setup');
          }
        } catch (error) {
          console.error('Auth callback error:', error);
          navigate('/login');
        }
      } else {
        // Not an auth callback, redirect to home
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
            <Route path="/detailed-horoscope" element={<DetailedHoroscopePage />} />
            {/* New routes for PRO features */}
            <Route path="/universe-chat" element={<UniverseChatPage />} />
            <Route path="/numerology" element={<NumerologyPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
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
