import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { supabase } from '@/lib/supabase';
import { getDateString } from '../../utils/dateUtils';
import { toast } from '@/hooks/use-toast';

export interface SyncPactsSlice {
  syncPactsWithCurrentDate: () => Promise<void>;
}

export const createSyncPactsSlice = (
  set: (state: Partial<AppState>) => void,
  get: () => AppState
): SyncPactsSlice => ({
  syncPactsWithCurrentDate: async () => {
    const { user, loadPacts, addEnergyPoints, checkRankProgress, userProfile } =
      get();

    console.log('SyncPacts: Starting sync', { 
      hasUser: !!user,
      userId: user?.id 
    });

    if (!user) {
      console.log('SyncPacts: No user in store, skipping sync');
      return;
    }

    // Validate Supabase session
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.session?.user) {
      console.log('SyncPacts: Invalid session during sync', { 
        sessionError: sessionError?.message,
        hasSession: !!session?.session 
      });
      return;
    }

    const currentUserId = session.session.user.id;
    
    if (currentUserId !== user.id) {
      console.error('SyncPacts: User ID mismatch during sync', {
        storeUserId: user.id,
        sessionUserId: currentUserId,
      });
      return;
    }

    set({ loading: true });

    try {
      const today = new Date();
      const todayString = getDateString(today);

      // Get all active pacts
      const { data: pacts, error: pactsError } = await supabase
        .from('pacts')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('status', 'active');

      if (pactsError) throw pactsError;

      if (!pacts || pacts.length === 0) {
        console.log('SyncPacts: No active pacts found');
        set({ loading: false });
        return;
      }

      console.log('SyncPacts: Found active pacts:', pacts.length);

      let totalNewCompletedDays = 0;

      // For each pact, check for days that should be automatically marked as completed
      for (const pact of pacts) {
        console.log('SyncPacts: Processing pact', pact.id);
        
        const { data: days, error: daysError } = await supabase
          .from('pact_days')
          .select('id, date')
          .eq('pact_id', pact.id)
          .eq('completed', false)
          .lte('date', todayString);

        if (daysError) throw daysError;

        if (days && days.length > 0) {
          // Mark days as completed
          const dayIds = days.map(d => d.id);

          const { error: updateError } = await supabase
            .from('pact_days')
            .update({ completed: true })
            .in('id', dayIds);

          if (updateError) throw updateError;

          totalNewCompletedDays += days.length;

          // Check if all days are now completed
          const { data: remainingDays, error: remainingError } = await supabase
            .from('pact_days')
            .select('id')
            .eq('pact_id', pact.id)
            .eq('completed', false);

          if (remainingError) throw remainingError;

          if (remainingDays && remainingDays.length === 0) {
            // All days are completed, mark the pact as completed
            const { error: pactError } = await supabase
              .from('pacts')
              .update({ status: 'completed' })
              .eq('id', pact.id);

            if (pactError) throw pactError;
          }
        }
      }

      // If days were updated, update the user profile
      if (totalNewCompletedDays > 0) {
        // Update total days and add energy points
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('total_days, energy_points')
          .eq('id', currentUserId)
          .single();

        if (profileError) throw profileError;

        const newTotalDays = (profile.total_days || 0) + totalNewCompletedDays;
        const newEnergyPoints =
          (profile.energy_points || 0) + totalNewCompletedDays * 10;

        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({
            total_days: newTotalDays,
            energy_points: newEnergyPoints,
          })
          .eq('id', currentUserId);

        if (updateProfileError) throw updateProfileError;

        // Check if rank needs to be updated
        const currentRank = userProfile.rank;
        const newRank = checkRankProgress();

        if (newRank !== currentRank) {
          // Rank has changed, update profile
          const { error: rankError } = await supabase
            .from('profiles')
            .update({ rank: newRank })
            .eq('id', currentUserId);

          if (rankError) throw rankError;

          // Add bonus for rank upgrade
          await addEnergyPoints(50);

          toast({
            title: 'Новый ранг!',
            description: `Поздравляем! Вы достигли ранга ${newRank}`,
          });
        }
      }

      // Only reload pacts if there were changes
      if (totalNewCompletedDays > 0) {
        console.log('SyncPacts: Reloading pacts to reflect changes');
        await loadPacts();
      }
      console.log('SyncPacts: Sync completed successfully');
    } catch (error: any) {
      console.error('Error syncing pacts:', error);
    } finally {
      set({ loading: false });
    }
  },
});
