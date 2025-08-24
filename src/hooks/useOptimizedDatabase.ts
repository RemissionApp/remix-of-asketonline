import { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { DatabaseOptimizer } from '@/utils/databaseOptimizations';

// Optimized database operations hook
export const useOptimizedDatabase = () => {
  const dbOptimizer = useMemo(() => DatabaseOptimizer.getInstance(), []);

  // Batch delete with transaction-like behavior
  const batchDeleteUserData = useCallback(async (userId: string) => {
    const measureKey = 'batch-delete-user-data';
    performanceMonitor.startMeasure(measureKey);

    try {
      // Delete pact_days first (child table)
      const { data: pactIds } = await supabase
        .from('pacts')
        .select('id')
        .eq('user_id', userId);

      if (pactIds && pactIds.length > 0) {
        const pactIdList = pactIds.map(p => p.id);
        await supabase.from('pact_days').delete().in('pact_id', pactIdList);
      }

      // Batch delete all user-related data using database optimizer
      const deleteTables = [
        'achievements',
        'pacts', 
        'universe_questions',
        'universe_chat_messages',
        'universe_chat_sessions',
        'missions',
        'mission_progress',
        'detailed_horoscopes',
        'full_horoscopes',
        'astro_profiles',
        'numerology_readings',
        'numerology_descriptions',
        'push_subscriptions',
        'subscriptions',
        'profiles'
      ];

      await dbOptimizer.batchDelete(deleteTables, 'user_id', userId);

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
  }, [dbOptimizer]);

  // Optimized pact completion with fewer DB calls
  const optimizedMarkDayComplete = useCallback(async (pactId: string, userId: string) => {
    const measureKey = 'mark-day-complete';
    performanceMonitor.startMeasure(measureKey);

    try {
      // Single query to get all necessary data
      const { data: pactData, error: pactError } = await supabase
        .from('pacts')
        .select(`
          id,
          user_id,
          pact_days(id, date, completed),
          profiles!inner(total_days, energy_points, rank)
        `)
        .eq('id', pactId)
        .single();

      if (pactError) throw pactError;

      const incompleteDays = pactData.pact_days.filter(day => !day.completed);
      if (incompleteDays.length === 0) {
        throw new Error('Все дни уже выполнены');
      }

      const firstIncompleteDay = incompleteDays.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )[0];

      // Batch updates
      const updates = [
        supabase
          .from('pact_days')
          .update({ completed: true })
          .eq('id', firstIncompleteDay.id),
        
        supabase
          .from('profiles')
          .update({ 
            total_days: (pactData.profiles.total_days || 0) + 1,
            energy_points: (pactData.profiles.energy_points || 0) + 10
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

      performanceMonitor.endMeasure(measureKey);
      return { success: true, completedDays: pactData.pact_days.length - incompleteDays.length + 1 };

    } catch (error: any) {
      performanceMonitor.endMeasure(measureKey);
      throw error;
    }
  }, []);

  // Cached user progress with optimized queries
  const getCachedUserProgress = useCallback(async (userId: string, forceRefresh = false) => {
    const cacheKey = `user-progress-${userId}`;
    
    if (!forceRefresh) {
      const cached = dbOptimizer.getFromCache(cacheKey);
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes cache
        return cached.data;
      }
    }

    const measureKey = 'user-progress-fetch';
    performanceMonitor.startMeasure(measureKey);

    try {
      // Single optimized query with joins
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          achievements(count),
          missions(count),
          cosmic_artifacts(count),
          mission_progress_detailed(count)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      const progressData = {
        profile: data,
        achievementsCount: data.achievements?.[0]?.count || 0,
        missionsCount: data.missions?.[0]?.count || 0,
        artifactsCount: data.cosmic_artifacts?.[0]?.count || 0,
        completedMissionsCount: data.mission_progress_detailed?.[0]?.count || 0,
      };

      dbOptimizer.setCache(cacheKey, progressData);
      performanceMonitor.endMeasure(measureKey);
      
      return progressData;

    } catch (error: any) {
      performanceMonitor.endMeasure(measureKey);
      throw error;
    }
  }, [dbOptimizer]);

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

      await dbOptimizer.batchInsert('pact_days', pactDays);
      performanceMonitor.endMeasure(measureKey);
      
      return { success: true };

    } catch (error: any) {
      performanceMonitor.endMeasure(measureKey);
      throw error;
    }
  }, [dbOptimizer]);

  return {
    batchDeleteUserData,
    optimizedMarkDayComplete,
    getCachedUserProgress,
    batchInsertPactDays,
    clearCache: dbOptimizer.clearCache.bind(dbOptimizer),
    getCacheStats: dbOptimizer.getCacheStats.bind(dbOptimizer)
  };
};