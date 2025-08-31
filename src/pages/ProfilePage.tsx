import React from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { BottomNavigation } from '@/components/BottomNavigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { CompactUserLevelDisplay } from '@/components/ProfilePage/CompactUserLevelDisplay';
import { ProfileHeader } from '@/components/ProfilePage/ProfileHeader';
import { ProfileContainer } from '@/components/ProfilePage/ProfileContainer';
import { UserStatsDisplay } from '@/components/ProfilePage/UserStatsDisplay';
import { QuickSettings } from '@/components/ProfilePage/QuickSettings';
import { SubscriptionManager } from '@/components/ProfilePage/SubscriptionManager';
import { LogoutButton } from '@/components/ProfilePage/LogoutButton';
import { useUserProgress } from '@/hooks/useUserProgress';

const ProfilePage: React.FC = () => {
  const { userProfile, language } = useAppStore();
  const { stats } = useUserProgress();

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />

      <PageHeader
        title={
          language === 'ru'
            ? 'Профиль'
            : language === 'es'
              ? 'Perfil'
              : 'Profile'
        }
      />

      {/* Cosmic background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-cosmic-dark via-cosmic-accent/5 to-cosmic-dark opacity-30" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 pt-20 py-8 max-w-md mx-auto w-full">
        <ProfileContainer>
          {/* User Level Display */}
          <CompactUserLevelDisplay
            level={stats.level}
            experiencePoints={stats.experiencePoints}
            experienceToNextLevel={stats.experienceToNextLevel}
            totalEnergyEarned={stats.totalEnergyEarned}
          />
          
          {/* Profile Header with User Info */}
          <ProfileHeader />
          
          {/* User Statistics */}
          <UserStatsDisplay />
          
          {/* Quick Settings */}
          <QuickSettings />
          
          {/* Subscription Manager */}
          <SubscriptionManager />
          
          {/* Logout Button */}
          <LogoutButton />
        </ProfileContainer>
      </div>

      {/* Add the bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
