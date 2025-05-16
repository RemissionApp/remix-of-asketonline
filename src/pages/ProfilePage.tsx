
import React from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { ProfileSection } from '@/components/ProfilePage/ProfileSection';

const ProfilePage: React.FC = () => {
  const { userProfile } = useAppStore();
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <StarField starCount={100} />
      
      {/* Cosmic background image */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/lovable-uploads/1fab6aac-8009-418b-8685-51057869b4ad.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/20 to-cosmic-dark/80" />
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-8 max-w-md mx-auto w-full">
        <ProfileSection />
      </div>
    </div>
  );
};

export default ProfilePage;
