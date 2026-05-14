import { useEffect, useId, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';

interface EntitlementState {
  isUnlocked: boolean;
  isPro: boolean;
  isTrialActive: boolean;
  trialEndsAt: Date | null;
  daysLeft: number;
  hoursLeft: number;
  isCritical: boolean;
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
  // Tick state: пересчитываем isTrialActive каждые 60 секунд, даже без events.
  const [, setNowTick] = useState(0);
  // Уникальный id на каждый инстанс хука — чтобы несколько компонентов,
  // одновременно использующих useEntitlement, не делили один и тот же
  // Realtime-канал (повторный .on() после .subscribe() кидает исключение
  // и роняет приложение в ErrorBoundary).
  const instanceId = useId();

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

    // Re-fetch authoritative PRO status from subscriptions table on mount,
    // so a stale persisted store doesn't keep isPro=true after webhook revoke.
    supabase
      .from('subscriptions')
      .select('is_pro,status')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        const next = !!data?.is_pro && (data?.status === 'active' || data?.status === 'trialing');
        const { updateProStatus } = useAppStore.getState();
        updateProStatus(next);
      });

    // Realtime: сразу видим, когда trial_ends_at меняется (продление, отмена).
    const channel = supabase
      .channel(`profiles:trial:${user.id}:${instanceId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        payload => {
          const next = (payload.new as { trial_ends_at?: string | null })?.trial_ends_at;
          setTrialEndsAt(next ? new Date(next) : null);
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        payload => {
          const row = (payload.new ?? payload.old) as
            | { is_pro?: boolean; status?: string }
            | null;
          const next = !!row?.is_pro && (row?.status === 'active' || row?.status === 'trialing');
          const { updateProStatus } = useAppStore.getState();
          updateProStatus(next);
        },
      )
      .subscribe();

    // Локальный tick на случай, если realtime пропустил событие истечения.
    const interval = window.setInterval(() => setNowTick(t => t + 1), 60_000);

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
      window.clearInterval(interval);
    };
  }, [user?.id, instanceId]);

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
    isCritical: isTrialActive && hoursLeft < 24,
    loading,
  };
}