import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface DailyReflection {
  id: string;
  user_id: string;
  mission_id: string;
  day_number: number;
  question: string;
  answer: string;
  reflection_type: string;
  created_at: string;
}

export const useDailyReflections = (missionId: string) => {
  const queryClient = useQueryClient();

  const { data: reflections, isLoading } = useQuery({
    queryKey: ['daily-reflections', missionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_reflections')
        .select('*')
        .eq('mission_id', missionId)
        .order('day_number', { ascending: true });

      if (error) throw error;
      return data as DailyReflection[];
    },
  });

  const saveReflectionMutation = useMutation({
    mutationFn: async ({
      dayNumber,
      question,
      answer,
      reflectionType = 'text'
    }: {
      dayNumber: number;
      question: string;
      answer: string;
      reflectionType?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('daily_reflections')
        .upsert({
          user_id: user.id,
          mission_id: missionId,
          day_number: dayNumber,
          question,
          answer,
          reflection_type: reflectionType,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-reflections', missionId] });
    },
  });

  const getReflectionForDay = (dayNumber: number) => {
    return reflections?.find(r => r.day_number === dayNumber);
  };

  return {
    reflections,
    isLoading,
    saveReflection: saveReflectionMutation.mutate,
    isSaving: saveReflectionMutation.isPending,
    getReflectionForDay,
  };
};