import { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { performanceMonitor } from '@/utils/performanceMonitor';

// Optimized database operations hook
export const useOptimizedDatabase = () => {
  // Simple cache implementation
  const cache = useMemo(() => new Map<string, { data: any; timestamp: number }>(), []);

  const setCache = useCallback((key: string, data: any) => {
    cache.set(key, { data, timestamp: Date.now() });
  }, [cache]);

  const getFromCache = useCallback((key: string) => {
    return cache.get(key);
  }, [cache]);

  const clearCache = useCallback(() => {
    cache.clear();
  }, [cache]);

  const getCacheStats = useCallback(() => {
    return { size: cache.size, keys: Array.from(cache.keys()) };
  }, [cache]);

  // Batch delete with transaction-like behavior using database function
  const batchDeleteUserData = useCallback(async (userId: string) => {
    const measureKey = 'batch-delete-user-data';
    performanceMonitor.startMeasure(measureKey);

    try {
      // Use the database function for optimized batch deletion
      const { error } = await supabase.rpc('batch_delete_user_data', {
        target_user_id: userId
      });

      if (error) throw error;

      performanceMonitor.endMeasure(measureKey);
      return { success: true };

    } catch (error: any) {
      performanceMonitor.endMeasure(measureKey);
      toast({
        title: 'Ошибка удаления',
        description: error.message || 'Не удалось удалить данные пользователя',
        variant: 'destructive',
      });
      return { success: false, error };
    }
  }, []);

  // Optimized pact completion with fewer DB calls
  const optimizedMarkDayComplete = useCallback(async (pactId: string, userId: string) => {
    const measureKey = 'mark-day-complete';
    performanceMonitor.startMeasure(measureKey);

    try {
      // Get incomplete days for this pact
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

      // Get current profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('total_days, energy_points')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Batch updates
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
          .eq('id', userId)
      ];

      // Check if pact is completed
      if (incompleteDays.length === 1) {
        updates.push(
          supabase
            .from('pacts')
            .update({ status: 'completed' })
            .eq('id', pactId)
        );
      }

      await Promise.all(updates);

      const totalCompletedDays = await supabase
        .from('pact_days')
        .select('id', { count: 'exact' })
        .eq('pact_id', pactId)
        .eq('completed', true);

      performanceMonitor.endMeasure(measureKey);
      return { success: true, completedDays: (totalCompletedDays.count || 0) };

    } catch (error: any) {
      performanceMonitor.endMeasure(measureKey);
      throw error;
    }
  }, []);

  // Cached user progress with optimized queries
  const getCachedUserProgress = useCallback(async (userId: string, forceRefresh = false) => {
    const cacheKey = `user-progress-${userId}`;
    
    if (!forceRefresh) {
      const cached = getFromCache(cacheKey);
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes cache
        return cached.data;
      }
    }

    const measureKey = 'user-progress-fetch';
    performanceMonitor.startMeasure(measureKey);

    try {
      // Use the optimized view
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
          rank: data.rank
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
  }, [getFromCache, setCache]);

  // Batch insert for multiple records
  const batchInsertPactDays = useCallback(async (pactId: string, days: Array<{ date: string; completed: boolean }>) => {
    const measureKey = 'batch-insert-pact-days';
    performanceMonitor.startMeasure(measureKey);

    try {
      const pactDays = days.map(day => ({
        pact_id: pactId,
        date: day.date,
        completed: day.completed
      }));

      const { error } = await supabase
        .from('pact_days')
        .insert(pactDays);

      if (error) throw error;

      performanceMonitor.endMeasure(measureKey);
      return { success: true };

    } catch (error: any) {
      performanceMonitor.endMeasure(measureKey);
      throw error;
    }
  }, []);

  return {
    batchDeleteUserData,
    optimizedMarkDayComplete,
    getCachedUserProgress,
    batchInsertPactDays,
    clearCache,
    getCacheStats
  };
};