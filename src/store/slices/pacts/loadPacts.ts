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

    console.log('LoadPacts: Starting load process', {
      hasStoreUser: !!user,
      storeUserId: user?.id,
    });

    if (!user) {
      console.log('LoadPacts: No user in store, skipping load');
      return;
    }

    // Double-check actual Supabase session and compare user IDs
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.session?.user) {
      console.log('LoadPacts: No valid Supabase session found', { 
        sessionError: sessionError?.message,
        hasSession: !!session?.session,
        hasUser: !!session?.session?.user
      });
      return;
    }

    const currentUserId = session.session.user.id;
    console.log('LoadPacts: Session validation successful', {
      currentUserId,
      storeUserId: user.id,
      userIdsMatch: currentUserId === user.id,
    });

    if (currentUserId !== user.id) {
      console.error('LoadPacts: User ID mismatch between store and session', {
        storeUserId: user.id,
        sessionUserId: currentUserId,
      });
      return;
    }

    try {
      // Get all pacts using the current session user ID
      console.log('LoadPacts: Executing pacts query', {
        userId: currentUserId,
        query: `SELECT * FROM pacts WHERE user_id = '${currentUserId}' ORDER BY created_at DESC`,
      });

      const { data: pacts, error: pactsError } = await supabase
        .from('pacts')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });

      if (pactsError) {
        console.error('LoadPacts: Database error', pactsError);
        throw pactsError;
      }

      console.log('LoadPacts: Raw pacts data from database:', {
        pactsCount: pacts?.length || 0,
        pacts: pacts?.map(p => ({
          id: p.id,
          title: p.title,
          status: p.status,
          duration: p.duration,
          created_at: p.created_at,
        })) || [],
      });

      if (!pacts || pacts.length === 0) {
        console.log('LoadPacts: No pacts found for user');
        set({ pacts: [] });
        return;
      }

      console.log('LoadPacts: Found pacts:', pacts.length);

      // Process each pact individually with error handling
      const pactResults = await Promise.allSettled(
        pacts.map(async (pact, index) => {
          try {
            console.log(`LoadPacts: Processing pact ${index + 1}/${pacts.length}`, {
              pactId: pact.id,
              title: pact.title,
              status: pact.status,
              duration: pact.duration,
            });

            const { data: days, error: daysError } = await supabase
              .from('pact_days')
              .select('*')
              .eq('pact_id', pact.id)
              .order('date', { ascending: true });

            if (daysError) {
              console.warn(`LoadPacts: Error loading days for pact ${pact.id}:`, daysError);
              // Continue with empty days array instead of failing
            }

            // Calculate completed days with fallback
            const safeDays = days || [];
            const completedDays = safeDays.filter(d => d?.completed).length;
            const lastCompletedDay = safeDays
              .filter(d => d?.completed)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

            console.log('LoadPacts: Successfully processed pact', {
              pactId: pact.id,
              title: pact.title,
              totalDays: safeDays.length,
              completedDays,
              lastCompletedDate: lastCompletedDay?.date || 'None',
            });

            // Transform to our app's format with safe defaults
            return {
              id: pact.id,
              title: pact.title || 'Untitled Pact',
              description: '',
              created_at: pact.created_at,
              start_date: pact.created_at,
              end_date: new Date(
                new Date(pact.created_at).getTime() +
                  (pact.duration || 21) * 24 * 60 * 60 * 1000
              ).toISOString(),
              days_total: pact.duration || 21,
              days_completed: completedDays,
              last_completed_date: lastCompletedDay?.date || '',
              rejection: pact.title || 'Untitled Pact',
              status: (pact.status || 'active') as
                | 'active'
                | 'completed'
                | 'failed'
                | 'planned',
              type: '',
              duration: pact.duration || 21,
              reward: pact.reward || '',
              days: safeDays.map(d => ({
                id: d?.id || '',
                date: d?.date || '',
                completed: Boolean(d?.completed),
              })),
            };
          } catch (error) {
            console.error(`LoadPacts: Failed to process pact ${pact.id}:`, error);
            
            // Return minimal pact data as fallback
            return {
              id: pact.id,
              title: pact.title || 'Untitled Pact',
              description: '',
              created_at: pact.created_at,
              start_date: pact.created_at,
              end_date: new Date(
                new Date(pact.created_at).getTime() +
                  (pact.duration || 21) * 24 * 60 * 60 * 1000
              ).toISOString(),
              days_total: pact.duration || 21,
              days_completed: 0,
              last_completed_date: '',
              rejection: pact.title || 'Untitled Pact',
              status: (pact.status || 'active') as
                | 'active'
                | 'completed'
                | 'failed'
                | 'planned',
              type: '',
              duration: pact.duration || 21,
              reward: pact.reward || '',
              days: [],
            };
          }
        })
      );

      // Extract successful results and log any failures
      const pactsWithDays = pactResults
        .map((result, index) => {
          if (result.status === 'fulfilled') {
            return result.value;
          } else {
            console.error(`LoadPacts: Failed to process pact at index ${index}:`, result.reason);
            return null;
          }
        })
        .filter(Boolean);

      console.log('LoadPacts: Processing complete', {
        totalPacts: pacts.length,
        successfullyProcessed: pactsWithDays.length,
        failed: pacts.length - pactsWithDays.length,
      });

      // Update local state
      console.log('LoadPacts: Setting pacts in store:', pactsWithDays.length);
      set({ pacts: pactsWithDays });
    } catch (error) {
      console.error('Error loading pacts:', error);
    }
  },
});
