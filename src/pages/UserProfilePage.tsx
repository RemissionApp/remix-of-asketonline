import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { Card, CardContent } from '@/components/ui/card';
import UserProfileForm from '@/components/UserProfileForm';
import { useAppStore } from '@/store/useAppStore';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, user, loading } = useAppStore();
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Check if user is logged in and handle profile completion status
  useEffect(() => {
    // First check - redirect to login if no user
    if (!user) {
      navigate('/login');
      return;
    }

    // Wait until we're not in loading state to make decisions
    if (!loading) {
      setCheckingAuth(false);
      
      // If profile is complete, go to main
      if (userProfile && 
          userProfile.name !== 'Искатель' && 
          userProfile.birthDate) {
        // User has completed profile setup, go to main
        navigate('/main');
      }
      // Otherwise stay on this page to complete profile setup
    }
  }, [userProfile, user, loading, navigate]);

  // Show loading or the form
  if (loading || checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

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
