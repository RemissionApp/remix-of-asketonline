import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DailyLimits {
  universe_questions: { used: number; limit: number; canUse: boolean };
  voice_calls: { used: number; limit: number; canUse: boolean };
  meditations: { used: number; limit: number; canUse: boolean };
  cosmic_missions: { used: number; limit: number; canUse: boolean };
  pacts: { used: number; limit: number; canUse: boolean };
  isPro: boolean;
}

export const useDailyLimits = () => {
  const [limits, setLimits] = useState<DailyLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLimits = async () => {
    try {
      setError(null);
      const { data, error } = await supabase.functions.invoke('check-daily-limits');
      
      if (error) throw error;
      setLimits(data);
    } catch (err) {
      console.error('Error fetching daily limits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch limits');
    } finally {
      setLoading(false);
    }
  };

  const updateUsage = async (action: 'universe_question' | 'voice_call' | 'meditation' | 'cosmic_mission') => {
    try {
      const { error } = await supabase.functions.invoke('update-daily-limits', {
        body: { action }
      });
      
      if (error) throw error;
      
      // Refresh limits after update
      await fetchLimits();
      return true;
    } catch (err) {
      console.error('Error updating usage:', err);
      setError(err instanceof Error ? err.message : 'Failed to update usage');
      return false;
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  return {
    limits,
    loading,
    error,
    fetchLimits,
    updateUsage,
  };
};