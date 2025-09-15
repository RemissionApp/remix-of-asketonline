import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useBackButton } from '@/hooks/useBackButton';

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
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/language" element={<LanguagePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile-setup" element={<UserProfilePage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/create-pact" element={<CreatePactPage />} />
      <Route path="/pacts" element={<PactsPage />} />
      <Route path="/universe" element={<UniversePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/account-settings" element={<AccountSettingsPage />} />
      <Route path="/comparison" element={<ComparisonPage />} />
      <Route path="/meditation" element={<MeditationPage />} />
      <Route path="/meditation/session" element={<NewMeditationPage />} />
      <Route path="/detailed-horoscope" element={<DetailedHoroscopePage />} />
      <Route path="/full-horoscope" element={<FullHoroscopePage />} />
      <Route path="/affirmations" element={<AffirmationsPage />} />
      {/* Pro features routes */}
      <Route path="/meditation-pro" element={<MeditationProPage />} />
      <Route path="/universe-chat" element={<UniverseChatPage />} />
      <Route path="/universe-call" element={<CallPage />} />
      <Route path="/numerology" element={<NumerologyPage />} />
      <Route path="/cosmic-missions" element={<CosmicMissionsPage />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/artifacts" element={<ArtifactCollectionPage />} />
      {/* Legal Pages */}
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/delete-account" element={<DeleteAccountPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
