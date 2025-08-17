import { StateCreator } from 'zustand';
import { AppState } from '../../types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import {
  calculateBreakPenalty,
  getCompletedDaysCount,
} from '@/utils/pactUtils';
import {
  handleError,
  AppError,
  withAsyncErrorHandler,
} from '@/utils/errorHandler';
import { createLogger } from '@/utils/logger';

const logger = createLogger('BreakAscesis');

export interface BreakAscesisSlice {
  breakAscesis: (pactId: string, reason?: string) => Promise<void>;
}

export const createBreakAscesisSlice = (
  set: (state: Partial<AppState>) => void,
  get: () => AppState
): BreakAscesisSlice => ({
  breakAscesis: withAsyncErrorHandler(
    async (pactId, reason) => {
      const { user, loadPacts, addEnergyPoints, language, userProfile } = get();

      logger.info('Breaking ascesis', { pactId, reason, userId: user?.id });

      if (!user) {
        throw new AppError(
          'User must be logged in to break ascesis',
          'AUTH_REQUIRED'
        );
      }

      set({ loading: true });

      try {
        // Get pact information for penalty calculation
        const { data: pactData, error: pactFetchError } = await supabase
          .from('pacts')
          .select('*, pact_days(*)')
          .eq('id', pactId)
          .single();

        if (pactFetchError) {
          throw new AppError(
            `Failed to fetch pact: ${pactFetchError.message}`,
            'FETCH_ERROR'
          );
        }

        // Calculate penalty based on progress
        const completedDays =
          pactData.pact_days?.filter((day: any) => day.completed).length || 0;
        const calculatedPenalty = calculateBreakPenalty(
          completedDays,
          pactData.duration || 1
        );

        logger.info('Calculated penalty', { completedDays, calculatedPenalty });

        // Update pact status to failed with reason
        const { error: pactError } = await supabase
          .from('pacts')
          .update({
            status: 'failed',
            break_reason: reason || null,
          })
          .eq('id', pactId);

        if (pactError) {
          throw new AppError(
            `Failed to update pact: ${pactError.message}`,
            'UPDATE_ERROR'
          );
        }

        // Subtract calculated penalty points
        await addEnergyPoints(-calculatedPenalty);

        // Update the profile to reflect the broken ascesis
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          logger.warn('Failed to fetch updated profile', profileError);
          // Non-critical error, don't throw
        }

        // Reload pacts to reflect changes
        await loadPacts();

        logger.info('Ascesis broken successfully', {
          pactId,
          penalty: calculatedPenalty,
        });

        // Show detailed message to the user
        toast({
          title:
            language === 'ru'
              ? 'Аскеза прервана'
              : language === 'es'
                ? 'Ascesis interrumpida'
                : 'Ascesis broken',
          description:
            language === 'ru'
              ? `Вы потеряли ${calculatedPenalty} энергетических очков`
              : language === 'es'
                ? `Has perdido ${calculatedPenalty} puntos de energía`
                : `You lost ${calculatedPenalty} energy points`,
          variant: 'destructive',
        });
      } finally {
        set({ loading: false });
      }
    },
    {
      context: 'BreakAscesis',
      fallback: () => {
        set({ loading: false });
        toast({
          title: 'Ошибка',
          description: 'Не удалось прервать аскезу',
          variant: 'destructive',
        });
      },
    }
  ),
});
