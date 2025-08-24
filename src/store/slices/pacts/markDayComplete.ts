import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { PactsState } from './types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface MarkDayCompleteSlice {
  markDayComplete: (pactId: string) => Promise<void>;
}

export const createMarkDayCompleteSlice = (
  set: (state: Partial<AppState>) => void,
  get: () => AppState
): MarkDayCompleteSlice => ({
  markDayComplete: async pactId => {
    const { user, loadPacts, addEnergyPoints, checkRankProgress, userProfile } =
      get();

    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Вы должны войти в систему для отметки дня',
        variant: 'destructive',
      });
      return;
    }

    set({ loading: true });

    try {
      // Use optimized database operations
      const { useOptimizedDatabase } = await import('@/hooks/useOptimizedDatabase');
      const { optimizedMarkDayComplete } = useOptimizedDatabase();
      
      const result = await optimizedMarkDayComplete(pactId, user.id);
      
      if (result.success) {
        // Add energy points
        await addEnergyPoints(10);
        
        // Check for streak achievements
        const consecutiveDays = result.completedDays;
        
        if (consecutiveDays >= 7) {
          await get().unlockAchievement('7-days-streak');
        }
        
        if (consecutiveDays >= 30) {
          await get().unlockAchievement('30-days-streak');
        }
        
        // Check if rank needs to be updated
        const currentRank = userProfile.rank;
        const newRank = checkRankProgress();
        
        if (newRank !== currentRank) {
          const { error: rankError } = await supabase
            .from('profiles')
            .update({ rank: newRank })
            .eq('id', user.id);
            
          if (rankError) throw rankError;
          
          await addEnergyPoints(50);
          
          toast({
            title: 'Новый ранг!',
            description: `Поздравляем! Вы достигли ранга ${newRank}`,
          });
        }
        
        await loadPacts();
        
        toast({
          title: 'День отмечен',
          description: 'День аскезы успешно отмечен как выполненный',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось отметить день',
        variant: 'destructive',
      });
    } finally {
      set({ loading: false });
    }
  },
});
