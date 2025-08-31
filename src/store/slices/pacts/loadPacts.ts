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

    if (!user) return;

    try {
      // Get all pacts
      const { data: pacts, error: pactsError } = await supabase
        .from('pacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (pactsError) throw pactsError;

      if (!pacts || pacts.length === 0) {
        set({ pacts: [] });
        return;
      }

      // For each pact, get its days
      const pactsWithDays = await Promise.all(
        pacts.map(async pact => {
          const { data: days, error: daysError } = await supabase
            .from('pact_days')
            .select('*')
            .eq('pact_id', pact.id)
            .order('date', { ascending: true });

          if (daysError) throw daysError;

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
            days_completed: 0,
            last_completed_date: '',
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
      set({ pacts: pactsWithDays });
    } catch (error) {
      console.error('Error loading pacts:', error);
    }
  },
});
