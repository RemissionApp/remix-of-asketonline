
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import { supabase } from "./lib/supabase";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const AppContent = () => {
  const { loadUserProfile, user, setUser } = useAppStore();
  
  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
        await loadUserProfile();
      }
    };
    
    initAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            loadUserProfile();
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, [loadUserProfile, setUser]);
  
  return (
    <BrowserRouter>
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
