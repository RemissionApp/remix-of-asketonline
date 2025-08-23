import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface MissionProgressDetail {
  id: string;
  user_id: string;
  mission_id: string;
  day_number: number;
  completed: boolean;
  completed_at?: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useMissionProgress = (missionId: string) => {
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['mission-progress', missionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mission_progress_detailed')
        .select('*')
        .eq('mission_id', missionId)
        .order('day_number', { ascending: true });

      if (error) throw error;
      return data as MissionProgressDetail[];
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ 
      dayNumber, 
      completed, 
      data = {} 
    }: { 
      dayNumber: number; 
      completed: boolean; 
      data?: Record<string, any> 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data: result, error } = await supabase
        .from('mission_progress_detailed')
        .upsert({
          user_id: user.id,
          mission_id: missionId,
          day_number: dayNumber,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          data: data as any,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mission-progress', missionId] });
    },
  });

  const getProgressForDay = (dayNumber: number) => {
    return progress?.find(p => p.day_number === dayNumber);
  };

  const completedDays = progress?.filter(p => p.completed).length || 0;
  const totalProgress = progress?.length || 0;
  const progressPercentage = totalProgress > 0 ? Math.floor((completedDays / totalProgress) * 100) : 0;

  return {
    progress,
    isLoading,
    updateProgress: updateProgressMutation.mutate,
    isUpdating: updateProgressMutation.isPending,
    getProgressForDay,
    completedDays,
    totalProgress,
    progressPercentage,
  };
};