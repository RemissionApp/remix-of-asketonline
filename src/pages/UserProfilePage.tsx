
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
    // Added a console.log to help debug the auth flow
    console.log("Profile setup: user status", { user, userProfile, loading });

    // If user is still loading, don't redirect yet
    if (loading) return;
    
    // If no user is found after loading completes, redirect to login
    if (!user && !loading) {
      console.log("No user found, redirecting to login");
      navigate('/login');
      return;
    }

    // Only redirect to onboarding if the profile is already completed
    // User has completed profile if they have a name other than default and a birthdate
    if (!loading && 
        userProfile && 
        userProfile.name !== 'Искатель' && 
        userProfile.birthDate) {
      console.log("Profile already completed, redirecting to onboarding");
      navigate('/onboarding');
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
