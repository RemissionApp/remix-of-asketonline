import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { performanceMonitor } from '@/utils/performanceMonitor';

// Module-level cache (safe to use outside React)
const moduleCache = new Map<string, { data: any; timestamp: number }>();

const setCache = (key: string, data: any) => {
  moduleCache.set(key, { data, timestamp: Date.now() });
};

const getFromCache = (key: string) => moduleCache.get(key);

export const clearOptimizedCache = () => moduleCache.clear();
export const getOptimizedCacheStats = () => ({
  size: moduleCache.size,
  keys: Array.from(moduleCache.keys()),
});

// ============================================================
// Pure async functions — safe to call from anywhere (non-React)
// ============================================================

export async function batchDeleteUserData(userId: string) {
    const measureKey = 'batch-delete-user-data';
    performanceMonitor.startMeasure(measureKey);

    try {
    const { error } = await supabase.rpc('batch_delete_user_data', {
      target_user_id: userId,
    });
    if (error) throw error;
    performanceMonitor.endMeasure(measureKey);
    return { success: true as const };
  } catch (error: any) {
    performanceMonitor.endMeasure(measureKey);
    toast({
      title: 'Ошибка удаления',
      description: error.message || 'Не удалось удалить данные пользователя',
      variant: 'destructive',
    });
    return { success: false as const, error };
  }
}

export async function optimizedMarkDayComplete(pactId: string, userId: string) {
    const measureKey = 'mark-day-complete';
    performanceMonitor.startMeasure(measureKey);

    try {
      const { data: incompleteDays, error: daysError } = await supabase
        .from('pact_days')
        .select('id, date')
        .eq('pact_id', pactId)
        .eq('completed', false)
        .order('date', { ascending: true });

      if (daysError) throw daysError;

      if (!incompleteDays || incompleteDays.length === 0) {
        throw new Error('Все дни уже выполнены');
      }

      const firstIncompleteDay = incompleteDays[0];

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('total_days, energy_points')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const updates = [
        supabase
          .from('pact_days')
          .update({ completed: true })
          .eq('id', firstIncompleteDay.id),
        supabase
          .from('profiles')
          .update({ 
            total_days: (profile.total_days || 0) + 1,
            energy_points: (profile.energy_points || 0) + 10
          })
          .eq('id', userId),
      ];

      const results = await Promise.all(updates);
      for (const result of results) {
        if (result.error) throw result.error;
      }

      if (incompleteDays.length === 1) {
        const { error: pactError } = await supabase
          .from('pacts')
          .update({ status: 'completed' })
          .eq('id', pactId);
        if (pactError) throw pactError;
      }

      const totalCompletedDays = await supabase
        .from('pact_days')
        .select('id', { count: 'exact' })
        .eq('pact_id', pactId)
        .eq('completed', true);

      performanceMonitor.endMeasure(measureKey);
    return { success: true as const, completedDays: totalCompletedDays.count || 0 };
  } catch (error: any) {
    performanceMonitor.endMeasure(measureKey);
    throw error;
  }
}

export async function getCachedUserProgress(userId: string, forceRefresh = false) {
    const cacheKey = `user-progress-${userId}`;
    if (!forceRefresh) {
      const cached = getFromCache(cacheKey);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        return cached.data;
      }
    }

    const measureKey = 'user-progress-fetch';
    performanceMonitor.startMeasure(measureKey);

    try {
      const { data, error } = await supabase
        .from('user_progress_summary')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const progressData = {
        profile: {
          id: data.id,
          energy_points: data.energy_points,
          total_days: data.total_days,
        rank: data.rank,
        },
        achievementsCount: data.achievements_count,
        missionsCount: data.missions_count,
        artifactsCount: data.artifacts_count,
        completedMissionsCount: data.completed_missions_count,
      };

      setCache(cacheKey, progressData);
      performanceMonitor.endMeasure(measureKey);
      return progressData;
  } catch (error: any) {
    performanceMonitor.endMeasure(measureKey);
    throw error;
  }
}

export async function batchInsertPactDays(
  pactId: string,
  days: Array<{ date: string; completed: boolean }>
) {
    const measureKey = 'batch-insert-pact-days';
    performanceMonitor.startMeasure(measureKey);

    try {
      const pactDays = days.map(day => ({
        pact_id: pactId,
        date: day.date,
      completed: day.completed,
      }));

    const { error } = await supabase.from('pact_days').insert(pactDays);
      if (error) throw error;

      performanceMonitor.endMeasure(measureKey);
    return { success: true as const };
  } catch (error: any) {
    performanceMonitor.endMeasure(measureKey);
    throw error;
  }
}

// React hook wrapper — safe to use inside components
export const useOptimizedDatabase = () => {
  return {
    batchDeleteUserData: useCallback(batchDeleteUserData, []),
    optimizedMarkDayComplete: useCallback(optimizedMarkDayComplete, []),
    getCachedUserProgress: useCallback(getCachedUserProgress, []),
    batchInsertPactDays: useCallback(batchInsertPactDays, []),
    clearCache: useCallback(clearOptimizedCache, []),
    getCacheStats: useCallback(getOptimizedCacheStats, []),
  };
};