
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { Card, CardContent } from '@/components/ui/card';
import UserProfileForm from '@/components/UserProfileForm';
import { useAppStore } from '@/store/useAppStore';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, user, loading } = useAppStore();
  
  // Check if user is logged in and already has profile data
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // If user already has a name other than the default and a birthdate set, 
    // they've completed profile setup, so redirect to main
    if (!loading && 
        userProfile && 
        userProfile.name !== 'Искатель' && 
        userProfile.birthDate) {
      navigate('/main');
    }
  }, [userProfile, user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <StarField starCount={150} />
      
      {/* Cosmic background image */}
      <div className="fixed inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url('/lovable-uploads/1fab6aac-8009-418b-8685-51057869b4ad.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/20 to-cosmic-dark/80" />
      </div>
      
      <div className="relative z-10 max-w-md w-full mx-auto">
        <Card className="cosmic-card backdrop-blur-[5px] bg-cosmic-dark/10 border-cosmic-accent/20">
          <CardContent className="pt-6">
            <UserProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;
