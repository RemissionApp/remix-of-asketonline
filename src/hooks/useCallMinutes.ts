import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import { createLogger } from '@/utils/logger';

const logger = createLogger('useCallMinutes');

const getMonthYear = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const useCallMinutes = () => {
  const { user } = useAppStore();
  const [minutesUsed, setMinutesUsed] = useState(0);
  const [minutesLimit, setMinutesLimit] = useState(30);
  const [loading, setLoading] = useState(true);

  const monthYear = getMonthYear();

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('monthly_call_minutes')
        .select('minutes_used, minutes_limit')
        .eq('user_id', user.id)
        .eq('month_year', monthYear)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setMinutesUsed(Number(data.minutes_used) || 0);
        setMinutesLimit(Number(data.minutes_limit) || 30);
      } else {
        setMinutesUsed(0);
        setMinutesLimit(30);
      }
    } catch (e) {
      logger.error('Failed to load minutes', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id, monthYear]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addMinutes = useCallback(
    async (seconds: number) => {
      if (!user?.id || seconds <= 0) return;
      const minutes = Number((seconds / 60).toFixed(2));
      try {
        const { error } = await supabase.rpc('increment_call_minutes', {
          p_user_id: user.id,
          p_month_year: monthYear,
          p_minutes: minutes,
        });
        if (error) throw error;
        await refresh();
      } catch (e) {
        logger.error('Failed to increment minutes', e);
      }
    },
    [user?.id, monthYear, refresh]
  );

  const minutesLeft = Math.max(0, Math.floor(minutesLimit - minutesUsed));
  const limitReached = minutesUsed >= minutesLimit;

  return {
    minutesUsed,
    minutesLimit,
    minutesLeft,
    limitReached,
    loading,
    addMinutes,
    refresh,
  };
};