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
  attachment_url?: string;
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
      reflectionType = 'text',
      attachmentFile
    }: {
      dayNumber: number;
      question: string;
      answer: string;
      reflectionType?: string;
      attachmentFile?: File;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) throw new Error('User not authenticated');
      
      let attachmentUrl = null;
      
      // Загружаем фото если есть
      if (attachmentFile) {
        const fileExt = attachmentFile.name.split('.').pop();
        const fileName = `${user.id}/${missionId}/day-${dayNumber}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('mission-photos')
          .upload(fileName, attachmentFile);
          
        if (uploadError) {
          console.error('❌ Ошибка загрузки фото:', uploadError);
          throw new Error('Не удалось загрузить фото');
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('mission-photos')
          .getPublicUrl(fileName);
          
        attachmentUrl = publicUrl;
        console.log('✅ Фото загружено:', attachmentUrl);
      }
      
      const { data, error } = await supabase
        .from('daily_reflections')
        .upsert({
          user_id: user.id,
          mission_id: missionId,
          day_number: dayNumber,
          question,
          answer: typeof answer === 'object' ? JSON.stringify(answer) : String(answer),
          reflection_type: reflectionType,
          attachment_url: attachmentUrl,
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