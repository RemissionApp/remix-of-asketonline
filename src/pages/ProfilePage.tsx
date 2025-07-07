
import React from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { ProfileSection } from '@/components/ProfilePage/ProfileSection';
import { BottomNavigation } from '@/components/BottomNavigation';

const ProfilePage: React.FC = () => {
  const { userProfile } = useAppStore();
  
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      {/* Cosmic background gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/40 via-cosmic-accent/10 to-cosmic-dark" />
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-8 max-w-md mx-auto w-full">
        <ProfileSection />
      </div>

      {/* Add the bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
