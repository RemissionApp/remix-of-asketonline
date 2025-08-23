import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Consequence } from '@/types';

export interface MissionChoice {
  id: string;
  user_id: string;
  mission_id: string;
  choice_event_id: string;
  choice_id: string;
  consequences: Consequence[];
  chosen_at: string;
}

export const useMissionChoices = (missionId: string) => {
  const queryClient = useQueryClient();

  const { data: choices, isLoading } = useQuery({
    queryKey: ['mission-choices', missionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mission_choices')
        .select('*')
        .eq('mission_id', missionId)
        .order('chosen_at', { ascending: true });

      if (error) throw error;
      return data?.map(item => ({
        ...item,
        consequences: (item.consequences as unknown) as Consequence[]
      })) as MissionChoice[];
    },
  });

  const makeChoiceMutation = useMutation({
    mutationFn: async ({
      choiceEventId,
      choiceId,
      consequences
    }: {
      choiceEventId: string;
      choiceId: string;
      consequences: Consequence[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('mission_choices')
        .upsert({
          user_id: user.id,
          mission_id: missionId,
          choice_event_id: choiceEventId,
          choice_id: choiceId,
          consequences: consequences as any,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mission-choices', missionId] });
    },
  });

  const getChoiceForEvent = (choiceEventId: string) => {
    return choices?.find(c => c.choice_event_id === choiceEventId);
  };

  return {
    choices,
    isLoading,
    makeChoice: makeChoiceMutation.mutate,
    isChoosing: makeChoiceMutation.isPending,
    getChoiceForEvent,
  };
};