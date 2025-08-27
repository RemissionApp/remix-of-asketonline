import { useOptimizedProfileCache } from './useOptimizedProfileCache';
import { useAppStore } from '@/store/useAppStore';
import { useMemo } from 'react';

/**
 * Hook to check if user profile is complete
 * Uses React Query cache for real-time data
 */
export const useProfileCompletion = () => {
  const { user } = useAppStore();
  const { profile, isLoading } = useOptimizedProfileCache(user as any);

  const isProfileComplete = useMemo(() => {
    if (!user?.id) return false;
    
    if (!profile) return false;
    
    return !!(
      profile.name &&
      profile.name !== 'Искатель' &&
      profile.name.trim() !== '' &&
      profile.birthDate
    );
  }, [user?.id, profile]);

  return {
    isProfileComplete,
    isLoading,
    profile
  };
};