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

    // Prevent double-submit (race / double-tap)
    if ((get() as any).loading) {
      return;
    }

    // Validate inputs
    if (!pact.title || pact.title.trim().length === 0 || pact.title.length > 200) {
      toast({ title: 'Ошибка', description: 'Некорректное название аскезы', variant: 'destructive' });
      return;
    }
    if (!pact.duration || pact.duration < 1 || pact.duration > 365) {
      toast({ title: 'Ошибка', description: 'Длительность 1–365 дней', variant: 'destructive' });
      return;
    }

    // Limit max active pacts per user
    const { count: activeCount } = await supabase
      .from('pacts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'active');
    if ((activeCount ?? 0) >= 10) {
      toast({
        title: 'Лимит активных аскез',
        description: 'Максимум 10 активных аскез одновременно',
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

      // Create pact days using LOCAL calendar dates (avoid UTC drift at night)
      const today = new Date();
      const pactDays = Array.from({ length: pact.duration }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return {
          pact_id: newPact.id,
          date: `${y}-${m}-${day}`,
          completed: false,
        };
      });

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
