
import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { calculateBreakPenalty, getCompletedDaysCount } from '@/utils/pactUtils';

export interface BreakAscesisSlice {
  breakAscesis: (pactId: string, reason?: string) => Promise<void>;
}

export const createBreakAscesisSlice = (
  set: (state: Partial<AppState>) => void,
  get: () => AppState
): BreakAscesisSlice => ({
  breakAscesis: async (pactId, reason) => {
    const { user, loadPacts, addEnergyPoints, language, userProfile } = get();
    
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Вы должны войти в систему для прерывания аскезы",
        variant: "destructive"
      });
      return;
    }
    
    set({ loading: true });
    
    try {
      // Получаем информацию о аскезе для расчета штрафа
      const { data: pactData, error: pactFetchError } = await supabase
        .from('pacts')
        .select('*, pact_days(*)')
        .eq('id', pactId)
        .single();
      
      if (pactFetchError) throw pactFetchError;

      // Вычисляем штраф в зависимости от прогресса
      const completedDays = pactData.pact_days?.filter((day: any) => day.completed).length || 0;
      const calculatedPenalty = calculateBreakPenalty(completedDays, pactData.duration || 1);

      // Update pact status to failed with reason
      const { error: pactError } = await supabase
        .from('pacts')
        .update({ 
          status: 'failed',
          break_reason: reason || null
        })
        .eq('id', pactId);
      
      if (pactError) throw pactError;
      
      // Subtract calculated penalty points
      await addEnergyPoints(-calculatedPenalty);
      
      // Update the profile to reflect the broken ascesis
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Reload pacts to reflect changes
      await loadPacts();
      
      // Show detailed message to the user
      toast({
        title: language === 'ru' 
          ? "Аскеза прервана" 
          : language === 'es'
            ? "Ascesis interrumpida"
            : "Ascesis broken",
        description: language === 'ru' 
          ? `Вы потеряли ${calculatedPenalty} энергетических очков` 
          : language === 'es'
            ? `Has perdido ${calculatedPenalty} puntos de energía`
            : `You lost ${calculatedPenalty} energy points`,
        variant: "destructive"
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось прервать аскезу",
        variant: "destructive"
      });
    } finally {
      set({ loading: false });
    }
  },
});
