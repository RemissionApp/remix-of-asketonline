import { StateCreator } from 'zustand';
import { AppState } from '../types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Pact } from '@/types';
import { getDateString } from '../utils/dateUtils';

export interface PactsSlice {
  pacts: Pact[];
  
  addPact: (pact: Omit<Pact, 'id' | 'created_at' | 'days' | 'description' | 'start_date' | 'end_date' | 'days_total' | 'days_completed' | 'last_completed_date' | 'rejection'>) => Promise<void>;
  markDayComplete: (pactId: string) => Promise<void>;
  loadPacts: () => Promise<void>;
  syncPactsWithCurrentDate: () => Promise<void>;
}

export const createPactsSlice: StateCreator<AppState, [], [], PactsSlice> = (set, get) => ({
  pacts: [],
  
  // Add a new pact
  addPact: async (pact) => {
    const { user, loadPacts } = get();
    
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Вы должны войти в систему для создания аскезы",
        variant: "destructive"
      });
      return;
    }
    
    set({ loading: true });
    
    try {
      // Insert the new pact
      const { data: newPact, error: pactError } = await supabase
        .from('pacts')
        .insert({
          user_id: user.id,
          title: pact.title,
          duration: pact.duration,
          reward: pact.reward,
          status: 'active'
        })
        .select()
        .single();
      
      if (pactError) throw pactError;
      
      // Create pact days
      const pactDays = Array.from({ length: pact.duration }, (_, i) => ({
        pact_id: newPact.id,
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false
      }));
      
      const { error: daysError } = await supabase
        .from('pact_days')
        .insert(pactDays);
      
      if (daysError) throw daysError;
      
      // Check if this is the first pact for achievement
      const { data: pactCount } = await supabase
        .from('pacts')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);
      
      if (pactCount && pactCount.length === 1) {
        // This is the first pact, unlock achievement
        await get().unlockAchievement('first-pact');
        // Add bonus energy points
        await get().addEnergyPoints(20);
      }
      
      // Reload pacts
      await loadPacts();
      
      toast({
        title: "Аскеза создана",
        description: "Ваша аскеза была успешно создана"
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать аскезу",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
  
  // Mark a day as complete
  markDayComplete: async (pactId) => {
    const { user, loadPacts, addEnergyPoints, checkRankProgress, userProfile } = get();
    
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Вы должны войти в систему для отметки дня",
        variant: "destructive"
      });
      return;
    }
    
    set({ loading: true });
    
    try {
      // Find the first incomplete day for this pact
      const { data: days, error: daysError } = await supabase
        .from('pact_days')
        .select('*')
        .eq('pact_id', pactId)
        .eq('completed', false)
        .order('date', { ascending: true })
        .limit(1);
      
      if (daysError) throw daysError;
      
      if (days && days.length > 0) {
        const day = days[0];
        
        // Mark the day as completed
        const { error: updateError } = await supabase
          .from('pact_days')
          .update({ completed: true })
          .eq('id', day.id);
        
        if (updateError) throw updateError;
        
        // Add energy points
        await addEnergyPoints(10);
        
        // Check if all days are completed for this pact
        const { data: remainingDays, error: remainingError } = await supabase
          .from('pact_days')
          .select('id')
          .eq('pact_id', pactId)
          .eq('completed', false);
        
        if (remainingError) throw remainingError;
        
        if (remainingDays && remainingDays.length === 0) {
          // All days are completed, mark the pact as completed
          const { error: pactError } = await supabase
            .from('pacts')
            .update({ status: 'completed' })
            .eq('id', pactId);
          
          if (pactError) throw pactError;
        }
        
        // Check for streak achievements
        const { data: completedDays, error: streakError } = await supabase
          .from('pact_days')
          .select('id')
          .eq('pact_id', pactId)
          .eq('completed', true);
        
        if (streakError) throw streakError;
        
        const consecutiveDays = completedDays?.length || 0;
        
        // Check for 7-day streak achievement
        if (consecutiveDays >= 7) {
          await get().unlockAchievement('7-days-streak');
        }
        
        // Check for 30-day streak achievement
        if (consecutiveDays >= 30) {
          await get().unlockAchievement('30-days-streak');
        }
        
        // Update total days in profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('total_days')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        const newTotalDays = (profile.total_days || 0) + 1;
        
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({ 
            total_days: newTotalDays,
          })
          .eq('id', user.id);
        
        if (updateProfileError) throw updateProfileError;
        
        // Check if rank needs to be updated
        const currentRank = userProfile.rank;
        const newRank = checkRankProgress();
        
        if (newRank !== currentRank) {
          // Rank has changed, update profile
          const { error: rankError } = await supabase
            .from('profiles')
            .update({ rank: newRank })
            .eq('id', user.id);
          
          if (rankError) throw rankError;
          
          // Add bonus for rank upgrade
          await addEnergyPoints(50);
          
          toast({
            title: "Новый ранг!",
            description: `Поздравляем! Вы достигли ранга ${newRank}`
          });
        }
        
        // Reload pacts to reflect changes
        await loadPacts();
        
        toast({
          title: "День отмечен",
          description: "День аскезы успешно отмечен как выполненный"
        });
      }
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отметить день",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
  
  // Load pacts
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
      const pactsWithDays = await Promise.all(pacts.map(async (pact) => {
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
          end_date: new Date(new Date(pact.created_at).getTime() + pact.duration * 24 * 60 * 60 * 1000).toISOString(),
          days_total: pact.duration,
          days_completed: 0,
          last_completed_date: '',
          rejection: pact.title,
          status: pact.status as 'active' | 'completed' | 'failed' | 'planned',
          type: '',
          duration: pact.duration,
          reward: pact.reward || '',
          days: days?.map(d => ({
            id: d.id,
            date: d.date,
            completed: d.completed
          })) || []
        };
      }));
      
      // Update local state
      set({ pacts: pactsWithDays });
    } catch (error) {
      console.error("Error loading pacts:", error);
    }
  },

  // Sync pacts with current date
  syncPactsWithCurrentDate: async () => {
    const { user, loadPacts, addEnergyPoints, checkRankProgress, userProfile } = get();
    
    if (!user) return;
    
    set({ loading: true });
    
    try {
      const today = new Date();
      const todayString = getDateString(today);
      
      // Get all active pacts
      const { data: pacts, error: pactsError } = await supabase
        .from('pacts')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      if (pactsError) throw pactsError;
      
      if (!pacts || pacts.length === 0) {
        set({ loading: false });
        return;
      }
      
      let totalNewCompletedDays = 0;
      
      // For each pact, check for days that should be automatically marked as completed
      for (const pact of pacts) {
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
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        const newTotalDays = (profile.total_days || 0) + totalNewCompletedDays;
        const newEnergyPoints = (profile.energy_points || 0) + (totalNewCompletedDays * 10);
        
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({ 
            total_days: newTotalDays,
            energy_points: newEnergyPoints
          })
          .eq('id', user.id);
        
        if (updateProfileError) throw updateProfileError;
        
        // Check if rank needs to be updated
        const currentRank = userProfile.rank;
        const newRank = checkRankProgress();
        
        if (newRank !== currentRank) {
          // Rank has changed, update profile
          const { error: rankError } = await supabase
            .from('profiles')
            .update({ rank: newRank })
            .eq('id', user.id);
          
          if (rankError) throw rankError;
          
          // Add bonus for rank upgrade
          await addEnergyPoints(50);
          
          toast({
            title: "Новый ранг!",
            description: `Поздравляем! Вы достигли ранга ${newRank}`
          });
        }
      }
      
      // Reload pacts to reflect changes
      await loadPacts();
    } catch (error: any) {
      console.error("Error syncing pacts:", error);
    } finally {
      set({ loading: false });
    }
  }
});
