
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export const useProfileLoader = () => {
  const {
    user,
    userProfile,
    loadUserProfile
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile if needed
  useEffect(() => {
    const initializeUserData = async () => {
      setIsLoading(true);
      
      // If user is logged in but we don't have profile data yet, load it
      if (user && !userProfile) {
        await loadUserProfile();
      }
      
      setIsLoading(false);
    };
    
    initializeUserData();
  }, [user, userProfile, loadUserProfile]);

  return { isLoading };
};
