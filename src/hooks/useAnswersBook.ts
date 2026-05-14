import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';

export interface SavedReading {
  id: string;
  title: string;
  context: string;
  focus_number: number | null;
  language: string;
  content: string;
  profile_snapshot: Record<string, unknown>;
  created_at: string;
}

export interface SaveReadingInput {
  title: string;
  context: string;
  focusNumber?: number;
  language: string;
  content: string;
  profileSnapshot: Record<string, unknown>;
}

export function useAnswersBook() {
  const { user } = useAppStore();
  const [items, setItems] = useState<SavedReading[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from('numerology_saved_readings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    setItems(((data ?? []) as unknown) as SavedReading[]);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (input: SaveReadingInput) => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('numerology_saved_readings')
        .insert([{
          user_id: user.id,
          title: input.title,
          context: input.context,
          focus_number: input.focusNumber ?? null,
          language: input.language,
          content: input.content,
          profile_snapshot: input.profileSnapshot as never,
        }])
        .select()
        .single();
      if (error) throw error;
      await refresh();
      return data as unknown as SavedReading;
    },
    [user?.id, refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      if (!user?.id) return;
      await supabase.from('numerology_saved_readings').delete().eq('id', id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    [user?.id]
  );

  return { items, loading, save, remove, refresh };
}
