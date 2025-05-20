
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import Index from './pages/Index';
import WelcomePage from './pages/WelcomePage';
import LanguagePage from './pages/LanguagePage';
import OnboardingPage from './pages/OnboardingPage';
import MainPage from './pages/MainPage';
import CreatePactPage from './pages/CreatePactPage';
import UniversePage from './pages/UniversePage';
import UniverseChatPage from './pages/UniverseChatPage';
import ProfilePage from './pages/ProfilePage';
import ComparisonPage from './pages/ComparisonPage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import MeditationPage from './pages/MeditationPage';
import MeditationProPage from './pages/MeditationProPage';
import DetailedHoroscopePage from './pages/DetailedHoroscopePage';
import FullHoroscopePage from './pages/FullHoroscopePage';
import NumerologyPage from './pages/NumerologyPage';
import CosmicMissionsPage from './pages/CosmicMissionsPage';
import AffirmationsPage from './pages/AffirmationsPage';
import SupportPage from './pages/SupportPage';
import NotFound from './pages/NotFound';

function App() {
  const { user, loading, loadUserProfile } = useAppStore();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        await loadUserProfile();
      }
    };

    fetchProfile();
  }, [user, loadUserProfile]);

  // Пока идет загрузка, отображаем индикатор загрузки или сплеш-скрин
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="cosmic-block backdrop-blur-sm p-8 rounded-lg border border-cosmic-accent/30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-cosmic-accent/60 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cosmic-secondary">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/language" element={<LanguagePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/create-pact" element={<CreatePactPage />} />
        <Route path="/universe" element={<UniversePage />} />
        <Route path="/universe-chat" element={<UniverseChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/comparison" element={<ComparisonPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage showSignup />} />
        <Route path="/profile-setup" element={<UserProfilePage />} />
        <Route path="/meditation" element={<MeditationPage />} />
        <Route path="/meditation-pro" element={<MeditationProPage />} />
        <Route path="/detailed-horoscope" element={<DetailedHoroscopePage />} />
        <Route path="/full-horoscope" element={<FullHoroscopePage />} />
        <Route path="/numerology" element={<NumerologyPage />} />
        <Route path="/cosmic-missions" element={<CosmicMissionsPage />} />
        <Route path="/affirmations" element={<AffirmationsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
