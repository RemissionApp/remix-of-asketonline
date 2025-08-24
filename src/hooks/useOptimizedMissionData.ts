import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Mission } from '@/types';
import { createLogger } from '@/utils/logger';

const logger = createLogger('OptimizedMissionData');

interface MissionProgress {
  mission_id: string;
  day_number: number;
  completed: boolean;
  completed_at?: string;
  data: any;
}

interface MissionChoice {
  mission_id: string;
  choice_event_id: string;
  choice_id: string;
  consequences: any;
  chosen_at: string;
}

interface DailyReflection {
  mission_id: string;
  day_number: number;
  question: string;
  answer: string;
  reflection_type: string;
}

// Query keys for mission data
export const missionQueryKeys = {
  all: ['missions'] as const,
  byUser: (userId: string) => [...missionQueryKeys.all, userId] as const,
  progress: (userId: string, missionId: string) => [...missionQueryKeys.byUser(userId), 'progress', missionId] as const,
  choices: (userId: string, missionId: string) => [...missionQueryKeys.byUser(userId), 'choices', missionId] as const,
  reflections: (userId: string, missionId: string) => [...missionQueryKeys.byUser(userId), 'reflections', missionId] as const,
  details: (userId: string, missionId: string) => [...missionQueryKeys.byUser(userId), 'details', missionId] as const,
};

// Optimized mission data fetcher
const fetchMissionProgress = async (userId: string, missionId: string): Promise<MissionProgress[]> => {
  const { data, error } = await supabase
    .from('mission_progress_detailed')
    .select('*')
    .eq('user_id', userId)
    .eq('mission_id', missionId)
    .order('day_number', { ascending: true });

  if (error) throw error;
  return data || [];
};

const fetchMissionChoices = async (userId: string, missionId: string): Promise<MissionChoice[]> => {
  const { data, error } = await supabase
    .from('mission_choices')
    .select('*')
    .eq('user_id', userId)
    .eq('mission_id', missionId);

  if (error) throw error;
  return data || [];
};

const fetchDailyReflections = async (userId: string, missionId: string): Promise<DailyReflection[]> => {
  const { data, error } = await supabase
    .from('daily_reflections')
    .select('*')
    .eq('user_id', userId)
    .eq('mission_id', missionId)
    .order('day_number', { ascending: true });

  if (error) throw error;
  return data || [];
};

// Combined mission data fetcher
const fetchMissionDetails = async (userId: string, missionId: string) => {
  const [progress, choices, reflections] = await Promise.all([
    fetchMissionProgress(userId, missionId),
    fetchMissionChoices(userId, missionId),
    fetchDailyReflections(userId, missionId),
  ]);

  return { progress, choices, reflections };
};

export const useOptimizedMissionData = (userId: string | undefined, mission: Mission) => {
  const queryClient = useQueryClient();

  // Mission progress query
  const progressQuery = useQuery({
    queryKey: missionQueryKeys.progress(userId || '', mission.id),
    queryFn: () => fetchMissionProgress(userId!, mission.id),
    enabled: !!userId && !!mission.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Mission choices query
  const choicesQuery = useQuery({
    queryKey: missionQueryKeys.choices(userId || '', mission.id),
    queryFn: () => fetchMissionChoices(userId!, mission.id),
    enabled: !!userId && !!mission.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Daily reflections query
  const reflectionsQuery = useQuery({
    queryKey: missionQueryKeys.reflections(userId || '', mission.id),
    queryFn: () => fetchDailyReflections(userId!, mission.id),
    enabled: !!userId && !!mission.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Combined mission details query
  const detailsQuery = useQuery({
    queryKey: missionQueryKeys.details(userId || '', mission.id),
    queryFn: () => fetchMissionDetails(userId!, mission.id),
    enabled: !!userId && !!mission.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (update: {
      dayNumber: number;
      completed: boolean;
      completedAt?: string;
      data?: Record<string, any>;
    }) => {
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('mission_progress_detailed')
        .upsert({
          user_id: userId,
          mission_id: mission.id,
          day_number: update.dayNumber,
          completed: update.completed,
          completed_at: update.completedAt,
          data: update.data || {},
        });

      if (error) throw error;
      return update;
    },
    onMutate: async (update) => {
      await queryClient.cancelQueries({
        queryKey: missionQueryKeys.progress(userId || '', mission.id),
      });

      const previousProgress = queryClient.getQueryData(
        missionQueryKeys.progress(userId || '', mission.id)
      );

      queryClient.setQueryData(
        missionQueryKeys.progress(userId || '', mission.id),
        (old: MissionProgress[] | undefined) => {
          if (!old) return old;
          
          const updatedProgress = [...old];
          const existingIndex = updatedProgress.findIndex(
            p => p.day_number === update.dayNumber
          );

          if (existingIndex >= 0) {
            updatedProgress[existingIndex] = {
              ...updatedProgress[existingIndex],
              completed: update.completed,
              completed_at: update.completedAt,
              data: update.data || {},
            };
          } else {
            updatedProgress.push({
              mission_id: mission.id,
              day_number: update.dayNumber,
              completed: update.completed,
              completed_at: update.completedAt,
              data: update.data || {},
            });
          }

          return updatedProgress.sort((a, b) => a.day_number - b.day_number);
        }
      );

      return { previousProgress };
    },
    onError: (error, update, context) => {
      if (context?.previousProgress) {
        queryClient.setQueryData(
          missionQueryKeys.progress(userId || '', mission.id),
          context.previousProgress
        );
      }
      logger.error('Progress update failed', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: missionQueryKeys.progress(userId || '', mission.id),
      });
      queryClient.invalidateQueries({
        queryKey: missionQueryKeys.details(userId || '', mission.id),
      });
    },
  });

  // Save choice mutation
  const saveChoiceMutation = useMutation({
    mutationFn: async (choice: {
      eventId: string;
      choiceId: string;
      consequences: any[];
    }) => {
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('mission_choices')
        .upsert({
          user_id: userId,
          mission_id: mission.id,
          choice_event_id: choice.eventId,
          choice_id: choice.choiceId,
          consequences: choice.consequences,
        });

      if (error) throw error;
      return choice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: missionQueryKeys.choices(userId || '', mission.id),
      });
      queryClient.invalidateQueries({
        queryKey: missionQueryKeys.details(userId || '', mission.id),
      });
    },
    onError: (error) => {
      logger.error('Choice save failed', error);
    },
  });

  // Save reflection mutation
  const saveReflectionMutation = useMutation({
    mutationFn: async (reflection: {
      dayNumber: number;
      question: string;
      answer: string;
      reflectionType?: string;
    }) => {
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('daily_reflections')
        .upsert({
          user_id: userId,
          mission_id: mission.id,
          day_number: reflection.dayNumber,
          question: reflection.question,
          answer: reflection.answer,
          reflection_type: reflection.reflectionType || 'text',
        });

      if (error) throw error;
      return reflection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: missionQueryKeys.reflections(userId || '', mission.id),
      });
      queryClient.invalidateQueries({
        queryKey: missionQueryKeys.details(userId || '', mission.id),
      });
    },
    onError: (error) => {
      logger.error('Reflection save failed', error);
    },
  });

  // Batch prefetch all mission data
  const prefetchAllData = async () => {
    if (!userId) return;

    try {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: missionQueryKeys.progress(userId, mission.id),
          queryFn: () => fetchMissionProgress(userId, mission.id),
          staleTime: 2 * 60 * 1000,
        }),
        queryClient.prefetchQuery({
          queryKey: missionQueryKeys.choices(userId, mission.id),
          queryFn: () => fetchMissionChoices(userId, mission.id),
          staleTime: 5 * 60 * 1000,
        }),
        queryClient.prefetchQuery({
          queryKey: missionQueryKeys.reflections(userId, mission.id),
          queryFn: () => fetchDailyReflections(userId, mission.id),
          staleTime: 2 * 60 * 1000,
        }),
      ]);
    } catch (error) {
      logger.warn('Failed to prefetch mission data', error);
    }
  };

  return {
    // Data
    progress: progressQuery.data || [],
    choices: choicesQuery.data || [],
    reflections: reflectionsQuery.data || [],
    allData: detailsQuery.data,

    // Loading states
    isLoadingProgress: progressQuery.isLoading,
    isLoadingChoices: choicesQuery.isLoading,
    isLoadingReflections: reflectionsQuery.isLoading,
    isLoadingDetails: detailsQuery.isLoading,

    // Error states
    progressError: progressQuery.error,
    choicesError: choicesQuery.error,
    reflectionsError: reflectionsQuery.error,
    detailsError: detailsQuery.error,

    // Mutations
    updateProgress: updateProgressMutation.mutate,
    updateProgressAsync: updateProgressMutation.mutateAsync,
    isUpdatingProgress: updateProgressMutation.isPending,

    saveChoice: saveChoiceMutation.mutate,
    saveChoiceAsync: saveChoiceMutation.mutateAsync,
    isSavingChoice: saveChoiceMutation.isPending,

    saveReflection: saveReflectionMutation.mutate,
    saveReflectionAsync: saveReflectionMutation.mutateAsync,
    isSavingReflection: saveReflectionMutation.isPending,

    // Utilities
    prefetchAllData,
    
    // Manual refresh
    refreshAll: () => {
      queryClient.invalidateQueries({
        queryKey: missionQueryKeys.byUser(userId || ''),
      });
    },

    // Get current day based on progress
    getCurrentDay: () => {
      const completedDays = progressQuery.data?.filter(p => p.completed) || [];
      return Math.min(completedDays.length + 1, mission.duration);
    },

    // Check if mission is completed
    isCompleted: () => {
      const completedDays = progressQuery.data?.filter(p => p.completed) || [];
      return completedDays.length >= mission.duration;
    },
  };
};