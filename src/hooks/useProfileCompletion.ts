import { useOptimizedProfileCache } from './useOptimizedProfileCache';
import { useAppStore } from '@/store/useAppStore';
import { useMemo } from 'react';

/**
 * Hook to check if user profile is complete
 * Uses React Query cache for real-time data with proper loading states
 */
export const useProfileCompletion = () => {
  const { user, userProfile, profileLoading } = useAppStore();
  const { profile: cachedProfile, isLoading } = useOptimizedProfileCache(user as any);

  const isProfileComplete = useMemo(() => {
    if (!user?.id) return false;
    
    // If profile is still loading, return false to prevent premature redirects
    if (isLoading || profileLoading) return false;
    
    // Prefer cached profile from React Query, fallback to store profile
    const activeProfile = cachedProfile || userProfile;
    
    if (!activeProfile) return false;
    
    // Only consider profile complete if it has real data (not defaults)
    const hasRealName = activeProfile.name && 
                       activeProfile.name !== 'Искатель' && 
                       activeProfile.name.trim() !== '';
    
    const hasBirthDate = !!activeProfile.birthDate;
    
    console.log('Profile completion check:', {
      userId: user.id,
      hasProfile: !!activeProfile,
      hasRealName,
      hasBirthDate,
      profileName: activeProfile?.name,
      birthDate: activeProfile?.birthDate,
      isComplete: hasRealName && hasBirthDate,
      isLoading,
      profileLoading
    });
    
    return hasRealName && hasBirthDate;
  }, [user?.id, cachedProfile, userProfile, isLoading, profileLoading]);

  return {
    isProfileComplete,
    isLoading: isLoading || profileLoading,
    profile: cachedProfile || userProfile,
    hasProfileData: !!(cachedProfile || userProfile)
  };
};