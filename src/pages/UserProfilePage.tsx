
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { Card, CardContent } from '@/components/ui/card';
import UserProfileForm from '@/components/UserProfileForm';
import { useAppStore } from '@/store/useAppStore';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, user, loading, onboardingComplete } = useAppStore();
  
  // Check if user is logged in and already has profile data
  useEffect(() => {
    // Added a console.log to help debug the auth flow
    console.log("Profile setup: user status", { user, userProfile, loading, onboardingComplete });

    // If user is still loading, don't redirect yet
    if (loading) return;
    
    // If no user is found after loading completes, redirect to login
    if (!user && !loading) {
      console.log("No user found, redirecting to login");
      navigate('/login');
      return;
    }

    // Only redirect to onboarding or main if user has completed profile
    if (!loading && 
        userProfile && 
        userProfile.name && 
        userProfile.name !== 'Искатель' && 
        userProfile.birthDate) {
      
      // If user hasn't completed onboarding yet, send them there
      if (!onboardingComplete) {
        console.log("Profile completed, redirecting to onboarding");
        navigate('/onboarding');
      } else {
        // If onboarding is already complete, go to main
        console.log("Profile and onboarding already completed, redirecting to main");
        navigate('/main');
      }
    }
  }, [userProfile, user, loading, navigate, onboardingComplete]);

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
