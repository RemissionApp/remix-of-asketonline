import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { PactsState } from './types';
import { supabase } from '@/lib/supabase';

export interface LoadPactsSlice {
  loadPacts: () => Promise<void>;
}

export const createLoadPactsSlice = (
  set: (state: Partial<AppState>) => void,
  get: () => AppState
): LoadPactsSlice => ({
  loadPacts: async () => {
    const { user } = get();

    if (!user) {
      console.log('LoadPacts: No user found, skipping load');
      return;
    }

    // Double-check actual Supabase session
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.session?.user) {
      console.log('LoadPacts: No valid Supabase session found', { sessionError, hasSession: !!session?.session });
      return;
    }

    const currentUserId = session.session.user.id;
    console.log('LoadPacts: Starting to load pacts for user:', currentUserId);

    try {
      // Get all pacts using the current session user ID
      const { data: pacts, error: pactsError } = await supabase
        .from('pacts')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });

      if (pactsError) throw pactsError;

      if (!pacts || pacts.length === 0) {
        console.log('LoadPacts: No pacts found for user');
        set({ pacts: [] });
        return;
      }

      console.log('LoadPacts: Found pacts:', pacts.length);

      // For each pact, get its days
      const pactsWithDays = await Promise.all(
        pacts.map(async pact => {
          const { data: days, error: daysError } = await supabase
            .from('pact_days')
            .select('*')
            .eq('pact_id', pact.id)
            .order('date', { ascending: true });

          if (daysError) throw daysError;

          // Calculate completed days
          const completedDays = days?.filter(d => d.completed).length || 0;
          const lastCompletedDay = days?.filter(d => d.completed).sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];

          console.log('LoadPacts: Processing pact', {
            pactId: pact.id,
            title: pact.title,
            totalDays: days?.length || 0,
            completedDays,
            lastCompletedDate: lastCompletedDay?.date || '',
          });

          // Transform to our app's format
          return {
            id: pact.id,
            title: pact.title,
            description: '',
            created_at: pact.created_at,
            start_date: pact.created_at,
            end_date: new Date(
              new Date(pact.created_at).getTime() +
                pact.duration * 24 * 60 * 60 * 1000
            ).toISOString(),
            days_total: pact.duration,
            days_completed: completedDays,
            last_completed_date: lastCompletedDay?.date || '',
            rejection: pact.title,
            status: pact.status as
              | 'active'
              | 'completed'
              | 'failed'
              | 'planned',
            type: '',
            duration: pact.duration,
            reward: pact.reward || '',
            days:
              days?.map(d => ({
                id: d.id,
                date: d.date,
                completed: d.completed,
              })) || [],
          };
        })
      );

      // Update local state
      console.log('LoadPacts: Setting pacts in store:', pactsWithDays.length);
      set({ pacts: pactsWithDays });
    } catch (error) {
      console.error('Error loading pacts:', error);
    }
  },
});
