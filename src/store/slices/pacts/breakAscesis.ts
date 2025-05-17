
import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface BreakAscesisSlice {
  breakAscesis: (pactId: string) => Promise<void>;
}

export const createBreakAscesisSlice = (
  set: (state: Partial<AppState>) => void,
  get: () => AppState
): BreakAscesisSlice => ({
  breakAscesis: async (pactId) => {
    const { user, loadPacts, addEnergyPoints, language } = get();
    
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
      // Update pact status to failed
      const { error: pactError } = await supabase
        .from('pacts')
        .update({ status: 'failed' })
        .eq('id', pactId);
      
      if (pactError) throw pactError;
      
      // Subtract 100 energy points as a penalty
      await addEnergyPoints(-100);
      
      // Update the profile to reflect the broken ascesis
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Reload pacts to reflect changes
      await loadPacts();
      
      // Show message to the user
      toast({
        title: language === 'ru' 
          ? "Аскеза прервана" 
          : language === 'es'
            ? "Ascesis interrumpida"
            : "Ascesis broken",
        description: language === 'ru' 
          ? "Вы потеряли 100 энергетических очков" 
          : language === 'es'
            ? "Has perdido 100 puntos de energía"
            : "You lost 100 energy points",
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
