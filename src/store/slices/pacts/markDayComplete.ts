
import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { PactsState } from './types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface MarkDayCompleteSlice {
  markDayComplete: (pactId: string) => Promise<void>;
}

export const createMarkDayCompleteSlice = (
  set: StateCreator<AppState>['setState'],
  get: () => AppState
): MarkDayCompleteSlice => ({
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
});
