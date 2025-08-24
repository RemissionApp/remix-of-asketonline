import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types';
import { AuthUser } from '@/types/api';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { createLogger } from '@/utils/logger';

const logger = createLogger('OptimizedProfileCache');

interface ProfileCacheData {
  profile: UserProfile;
  lastUpdated: number;
  synced: boolean;
}

// Query keys
export const profileQueryKeys = {
  all: ['profile'] as const,
  detail: (userId: string) => [...profileQueryKeys.all, userId] as const,
  progress: (userId: string) => [...profileQueryKeys.all, userId, 'progress'] as const,
};

// Centralized profile fetcher
const fetchProfile = async (userId: string): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;

  // Transform database format to app format
  return {
    name: data.name || 'Искатель',
    email: '', // Will be set from auth user
    age: null,
    energyPoints: data.energy_points || 0,
    goal: data.goal || 'Познать свою истинную силу',
    isPro: false, // Will be updated from subscriptions
    rank: data.rank || 'seeker',
    zodiacSign: '', // Will be calculated from birth_date
    totalDays: data.total_days || 0,
    achievements: [], // Will be loaded separately
    birthDate: data.birth_date ? new Date(data.birth_date) : null,
    avatar_url: data.avatar_url,
    activeMission: undefined, // Will be loaded separately
  };
};

// Optimized profile cache hook
export const useOptimizedProfileCache = (user: AuthUser | null) => {
  const queryClient = useQueryClient();
  const { userProfile, ...appStore } = useAppStore();

  // Profile query with caching
  const profileQuery = useQuery({
    queryKey: profileQueryKeys.detail(user?.id || ''),
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    meta: {
      errorMessage: 'Failed to load profile',
    },
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const updateData: Record<string, any> = {};

      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.birthDate !== undefined) {
        updateData.birth_date = updates.birthDate?.toISOString().split('T')[0] || null;
      }
      if (updates.goal !== undefined) updateData.goal = updates.goal;
      if (updates.avatar_url !== undefined) updateData.avatar_url = updates.avatar_url;
      if (updates.energyPoints !== undefined) updateData.energy_points = updates.energyPoints;
      if (updates.totalDays !== undefined) updateData.total_days = updates.totalDays;
      if (updates.rank !== undefined) updateData.rank = updates.rank;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      return updates;
    },
    onMutate: async (updates) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: profileQueryKeys.detail(user!.id),
      });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData(
        profileQueryKeys.detail(user!.id)
      );

      // Optimistically update
      queryClient.setQueryData(
        profileQueryKeys.detail(user!.id),
        (old: UserProfile | undefined) => {
          if (!old) return old;
          return { ...old, ...updates };
        }
      );

      // Update app store immediately
      if (previousProfile) {
        // Note: Direct store update for optimistic UI
        logger.debug('Optimistically updating profile in store');
      }

      return { previousProfile };
    },
    onError: (error, updates, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(
          profileQueryKeys.detail(user!.id),
          context.previousProfile
        );
        // Note: Profile rollback handled by React Query
      }

      logger.error('Profile update failed', error);
      toast({
        title: 'Ошибка обновления профиля',
        description: error instanceof Error ? error.message : 'Не удалось обновить профиль',
        variant: 'destructive',
      });
    },
    onSuccess: (updates) => {
      logger.debug('Profile updated successfully', updates);
      toast({
        title: 'Профиль обновлен',
        description: 'Ваш профиль был успешно обновлен',
      });
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.detail(user!.id),
      });
    },
  });

  // Energy points update mutation (frequently used)
  const updateEnergyMutation = useMutation({
    mutationFn: async (points: number) => {
      if (!user?.id) throw new Error('User not authenticated');

      const currentProfile = queryClient.getQueryData(
        profileQueryKeys.detail(user.id)
      ) as UserProfile;

      const newTotal = (currentProfile?.energyPoints || 0) + points;

      const { error } = await supabase
        .from('profiles')
        .update({ energy_points: newTotal })
        .eq('id', user.id);

      if (error) throw error;

      return newTotal;
    },
    onMutate: async (points) => {
      await queryClient.cancelQueries({
        queryKey: profileQueryKeys.detail(user!.id),
      });

      const previousProfile = queryClient.getQueryData(
        profileQueryKeys.detail(user!.id)
      ) as UserProfile;

      if (previousProfile) {
        const newEnergyPoints = previousProfile.energyPoints + points;
        
        queryClient.setQueryData(
          profileQueryKeys.detail(user!.id),
          { ...previousProfile, energyPoints: newEnergyPoints }
        );

        // Note: Energy points update handled optimistically by React Query
      }

      return { previousProfile };
    },
    onError: (error, points, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(
          profileQueryKeys.detail(user!.id),
          context.previousProfile
        );
        // Note: Energy rollback handled by React Query
      }
      logger.error('Energy update failed', error);
    },
    onSuccess: (newTotal) => {
      logger.debug('Energy points updated', { newTotal });
    },
  });

  // Preload related data
  const preloadUserData = async () => {
    if (!user?.id) return;

    try {
      // Preload achievements
      queryClient.prefetchQuery({
        queryKey: ['achievements', user.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('achievements')
            .select('*')
            .eq('user_id', user.id);

          if (error) throw error;
          return data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
      });

      // Preload subscription status
      queryClient.prefetchQuery({
        queryKey: ['subscription', user.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (error) throw error;
          return data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    } catch (error) {
      logger.warn('Failed to preload user data', error);
    }
  };

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,
    
    // Mutations
    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    
    updateEnergy: updateEnergyMutation.mutate,
    updateEnergyAsync: updateEnergyMutation.mutateAsync,
    isUpdatingEnergy: updateEnergyMutation.isPending,
    
    // Utilities
    preloadUserData,
    
    // Manual refresh
    refreshProfile: () => {
      queryClient.invalidateQueries({
        queryKey: profileQueryKeys.detail(user?.id || ''),
      });
    },
    
    // Cache utilities
    getCachedProfile: () => {
      return queryClient.getQueryData(
        profileQueryKeys.detail(user?.id || '')
      ) as UserProfile | undefined;
    },
    
    setCachedProfile: (profile: UserProfile) => {
      queryClient.setQueryData(
        profileQueryKeys.detail(user?.id || ''),
        profile
      );
    },
  };
};