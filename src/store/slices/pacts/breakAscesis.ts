
import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface BreakAscesisSlice {
  breakAscesis: (pactId: string, reason?: string) => Promise<void>;
}

export const createBreakAscesisSlice = (
  set: (state: Partial<AppState>) => void,
  get: () => AppState
): BreakAscesisSlice => ({
  breakAscesis: async (pactId, reason = '') => {
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
      // Update pact status to failed with reason
      const { error: pactError } = await supabase
        .from('pacts')
        .update({ 
          status: 'failed',
          reason: reason || null
        })
        .eq('id', pactId);
      
      if (pactError) throw pactError;
      
      // Subtract 100 energy points as a penalty
      await addEnergyPoints(-100);
      
      // Reload pacts to reflect changes
      await loadPacts();
      
      // Show confirmation message
      const messages = {
        ru: {
          title: "Аскеза прервана",
          description: "Не расстраивайтесь, каждая попытка — это шаг к росту"
        },
        en: {
          title: "Ascesis broken",
          description: "Don't be discouraged, every attempt is a step towards growth"
        },
        es: {
          title: "Ascesis interrumpida", 
          description: "No te desanimes, cada intento es un paso hacia el crecimiento"
        }
      };
      
      const currentMessages = messages[language] || messages.ru;
      
      toast({
        title: currentMessages.title,
        description: currentMessages.description,
        variant: "default"
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
