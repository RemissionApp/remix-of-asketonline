import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { PactsState, AddPactParams } from './types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface AddPactSlice {
  addPact: (pact: AddPactParams) => Promise<void>;
}

export const createAddPactSlice = (
  set: (state: Partial<AppState>) => void,
  get: () => AppState
): AddPactSlice => ({
  addPact: async pact => {
    const { user, loadPacts } = get();

    if (!user) {
      toast({
        title: 'Ошибка',
        description: 'Вы должны войти в систему для создания аскезы',
        variant: 'destructive',
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
          status: 'active',
          type: pact.type || 'spiritual',
        })
        .select()
        .single();

      if (pactError) throw pactError;

      // Create pact days
      const pactDays = Array.from({ length: pact.duration }, (_, i) => ({
        pact_id: newPact.id,
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        completed: false,
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
      console.log('AddPact: Reloading pacts after creation');
      await loadPacts();
      console.log('AddPact: Pacts reloaded successfully');

      toast({
        title: 'Аскеза создана',
        description: 'Ваша аскеза была успешно создана',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось создать аскезу',
        variant: 'destructive',
      });
    } finally {
      set({ loading: false });
    }
  },
});
