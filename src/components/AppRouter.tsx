import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useBackButton } from '@/hooks/useBackButton';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';
import { AuthDebugPanel } from '@/components/auth/AuthDebugPanel';

import WelcomePage from '@/pages/WelcomePage';
import LanguagePage from '@/pages/LanguagePage';
import LoginPage from '@/pages/LoginPage';
import UserProfilePage from '@/pages/UserProfilePage';
import OnboardingPage from '@/pages/OnboardingPage';
import MainPage from '@/pages/MainPage';
import CreatePactPage from '@/pages/CreatePactPage';
import PactsPage from '@/pages/PactsPage';
import UniversePage from '@/pages/UniversePage';
import ProfilePage from '@/pages/ProfilePage';
import NotFound from '@/pages/NotFound';
import ComparisonPage from '@/pages/ComparisonPage';
import MeditationPage from '@/pages/MeditationPage';
import NewMeditationPage from '@/pages/NewMeditationPage';
import DetailedHoroscopePage from '@/pages/DetailedHoroscopePage';
import FullHoroscopePage from '@/pages/FullHoroscopePage';
import UniverseChatPage from '@/pages/UniverseChatPage';
import CallPage from '@/pages/CallPage';
import NumerologyPage from '@/pages/NumerologyPage';
import MeditationProPage from '@/pages/MeditationProPage';
import AffirmationsPage from '@/pages/AffirmationsPage';
import CosmicMissionsPage from '@/pages/CosmicMissionsPage';
import { ArtifactCollectionPage } from '@/pages/ArtifactCollectionPage';
import AchievementsPage from '@/pages/AchievementsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import DeleteAccountPage from '@/pages/DeleteAccountPage';
import AccountSettingsPage from '@/pages/AccountSettingsPage';
import { AuthCallback } from '@/components/AuthCallback';

export const AppRouter: React.FC = () => {
  // Используем хук для обработки кнопки "Назад"
  useBackButton();

  return (
    <>
      <Routes>
        {/* Public routes - accessible to unauthenticated users */}
        <Route path="/" element={<PublicRoute><WelcomePage /></PublicRoute>} />
        <Route path="/language" element={<PublicRoute><LanguagePage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        
        {/* Protected routes - require authentication */}
        <Route path="/profile-setup" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute requireProfile><OnboardingPage /></ProtectedRoute>} />
        <Route path="/main" element={<ProtectedRoute requireProfile requireOnboarding><MainPage /></ProtectedRoute>} />
        <Route path="/create-pact" element={<ProtectedRoute requireProfile requireOnboarding><CreatePactPage /></ProtectedRoute>} />
        <Route path="/pacts" element={<ProtectedRoute requireProfile requireOnboarding><PactsPage /></ProtectedRoute>} />
        <Route path="/universe" element={<ProtectedRoute requireProfile requireOnboarding><UniversePage /></ProtectedRoute>} />
        <Route path="/universe-chat" element={<ProtectedRoute requireProfile requireOnboarding><UniverseChatPage /></ProtectedRoute>} />
        <Route path="/universe-call" element={<ProtectedRoute requireProfile requireOnboarding><CallPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute requireProfile requireOnboarding><ProfilePage /></ProtectedRoute>} />
        <Route path="/comparison" element={<ProtectedRoute requireProfile requireOnboarding><ComparisonPage /></ProtectedRoute>} />
        <Route path="/meditation" element={<ProtectedRoute requireProfile requireOnboarding><MeditationPage /></ProtectedRoute>} />
        <Route path="/meditation/session" element={<ProtectedRoute requireProfile requireOnboarding><NewMeditationPage /></ProtectedRoute>} />
        <Route path="/detailed-horoscope" element={<ProtectedRoute requireProfile requireOnboarding><DetailedHoroscopePage /></ProtectedRoute>} />
        <Route path="/full-horoscope" element={<ProtectedRoute requireProfile requireOnboarding><FullHoroscopePage /></ProtectedRoute>} />
        <Route path="/numerology" element={<ProtectedRoute requireProfile requireOnboarding><NumerologyPage /></ProtectedRoute>} />
        <Route path="/meditation-pro" element={<ProtectedRoute requireProfile requireOnboarding><MeditationProPage /></ProtectedRoute>} />
        <Route path="/affirmations" element={<ProtectedRoute requireProfile requireOnboarding><AffirmationsPage /></ProtectedRoute>} />
        <Route path="/cosmic-missions" element={<ProtectedRoute requireProfile requireOnboarding><CosmicMissionsPage /></ProtectedRoute>} />
        <Route path="/artifacts" element={<ProtectedRoute requireProfile requireOnboarding><ArtifactCollectionPage /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute requireProfile requireOnboarding><AchievementsPage /></ProtectedRoute>} />
        <Route path="/delete-account" element={<ProtectedRoute requireProfile requireOnboarding><DeleteAccountPage /></ProtectedRoute>} />
        <Route path="/account-settings" element={<ProtectedRoute requireProfile requireOnboarding><AccountSettingsPage /></ProtectedRoute>} />
        
        {/* Public legal pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        
        {/* Auth callback */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Auth debug panel (dev only) */}
      <AuthDebugPanel />
    </>
  );
};
