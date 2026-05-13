import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'asceta_session_id';

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getPlatform(): string {
  if (typeof navigator === 'undefined') return 'web';
  // @ts-ignore
  if ((window as any).Capacitor?.getPlatform) return (window as any).Capacitor.getPlatform();
  return 'web';
}

export async function trackEvent(eventName: string, properties: Record<string, unknown> = {}) {
  try {
    const { data: u } = await supabase.auth.getUser();
    await supabase.from('user_events').insert({
      user_id: u?.user?.id ?? null,
      session_id: getSessionId(),
      event_name: eventName,
      properties: properties as any,
    });
  } catch (_) {
    /* swallow — analytics must never break UX */
  }
}

export async function trackPageView(path: string, durationMs?: number, language?: string) {
  try {
    const { data: u } = await supabase.auth.getUser();
    await supabase.from('page_views').insert({
      user_id: u?.user?.id ?? null,
      session_id: getSessionId(),
      path,
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      language: language ?? null,
      platform: getPlatform(),
      duration_ms: durationMs ?? null,
    });
  } catch (_) {}
}

export function useTrackOnMount(eventName: string, properties: Record<string, unknown> = {}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent(eventName, properties);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
