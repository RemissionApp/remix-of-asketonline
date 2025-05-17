
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
import FullHoroscopePage from "./pages/FullHoroscopePage";
import UniverseChatPage from "./pages/UniverseChatPage";
import NumerologyPage from "./pages/NumerologyPage";
import MeditationProPage from "./pages/MeditationProPage";
import AffirmationsPage from "./pages/AffirmationsPage";
import { supabase, cleanupAuthState } from "./lib/supabase";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Global onboarding check component
const AppInitializer = () => {
  const { checkOnboardingStatus } = useAppStore();
  
  useEffect(() => {
    // Check onboarding status on app load
    checkOnboardingStatus();
    
    // Set up auth listener to detect session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN') {
        console.log("User signed in, session:", session);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
      } else if (event === 'USER_UPDATED') {
        console.log("User updated:", session?.user);
      } else if (event === 'PASSWORD_RECOVERY') {
        console.log("Password recovery event");
      }
    });
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [checkOnboardingStatus]);
  
  return null;
};

// AuthCallback component to handle OAuth redirects
const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserProfile, user, loadUserProfile, handleAuthCallback } = useAppStore();

  useEffect(() => {
    const processAuthCallback = async () => {
      const hash = location.hash;
      const searchParams = new URLSearchParams(location.search);
      
      // Check if this is an auth callback
      if (hash || searchParams.get('access_token') || searchParams.get('code') || searchParams.get('email_confirmed')) {
        try {
          // Clean up auth state first
          cleanupAuthState();
          
          // Handle the auth callback
          const success = await handleAuthCallback(hash);
          
          if (success) {
            // Navigate to profile setup or main page
            navigate('/profile-setup');
          } else {
            // If not successful, redirect to login
            navigate('/login');
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

    processAuthCallback();
  }, [location, navigate, updateUserProfile, user, loadUserProfile, handleAuthCallback]);

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
            <Route path="/full-horoscope" element={<FullHoroscopePage />} />
            <Route path="/affirmations" element={<AffirmationsPage />} />
            {/* Pro features routes */}
            <Route path="/meditation-pro" element={<MeditationProPage />} />
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
