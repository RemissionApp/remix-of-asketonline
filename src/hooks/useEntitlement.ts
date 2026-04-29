import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';

interface EntitlementState {
  isUnlocked: boolean;
  isPro: boolean;
  isTrialActive: boolean;
  trialEndsAt: Date | null;
  daysLeft: number;
  hoursLeft: number;
  loading: boolean;
}

/**
 * Single source of truth for "can the user access premium features?".
 * During the 3-day trial, isUnlocked === true for everyone.
 * After trial ends, only paying users (isPro) keep access.
 */
export function useEntitlement(): EntitlementState {
  const { user, userProfile } = useAppStore();
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) {
      setTrialEndsAt(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('profiles')
      .select('trial_ends_at')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setTrialEndsAt(data?.trial_ends_at ? new Date(data.trial_ends_at) : null);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const now = Date.now();
  const isTrialActive = !!trialEndsAt && trialEndsAt.getTime() > now;
  const isPro = !!userProfile?.isPro;
  const isUnlocked = isPro || isTrialActive;

  const msLeft = trialEndsAt ? Math.max(0, trialEndsAt.getTime() - now) : 0;
  const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
  const daysLeft = Math.floor(hoursLeft / 24);

  return {
    isUnlocked,
    isPro,
    isTrialActive,
    trialEndsAt,
    daysLeft,
    hoursLeft: hoursLeft % 24,
    loading,
  };
}