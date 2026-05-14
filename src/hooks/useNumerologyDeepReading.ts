import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type DeepContext =
  | 'lifePath'
  | 'soul'
  | 'personality'
  | 'expression'
  | 'square'
  | 'karma'
  | 'overall';

export interface DeepRequest {
  context: DeepContext;
  focusNumber?: number;
  language: 'ru' | 'en' | 'es';
  profile: Record<string, unknown>;
}

export type DeepErrorCode = 'rate_limited' | 'credits_exhausted' | 'generic' | null;

interface State {
  loading: boolean;
  content: string | null;
  error: string | null;
  errorCode: DeepErrorCode;
  retryAfter: number | null;
  cached: boolean;
}

export function useNumerologyDeepReading() {
  const [state, setState] = useState<State>({
    loading: false,
    content: null,
    error: null,
    errorCode: null,
    retryAfter: null,
    cached: false,
  });
  const lastReqRef = useRef<DeepRequest | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const generate = useCallback(async (req: DeepRequest) => {
    clearTimer();
    lastReqRef.current = req;
    setState({ loading: true, content: null, error: null, errorCode: null, retryAfter: null, cached: false });
    try {
      const { data, error } = await supabase.functions.invoke(
        'generate-numerology-description',
        { body: req }
      );
      if (error) {
        // supabase.functions.invoke wraps non-2xx as FunctionsHttpError; data may still be present
        const ctx = (error as { context?: Response }).context;
        let parsed: { error?: string; retryAfter?: number } = {};
        if (ctx) {
          try { parsed = await ctx.clone().json(); } catch { /* noop */ }
        }
        const status = ctx?.status;
        if (status === 429 || parsed.error === 'rate_limited') {
          const retryAfter = parsed.retryAfter ?? 30;
          setState({ loading: false, content: null, error: null, errorCode: 'rate_limited', retryAfter, cached: false });
          startCountdown(retryAfter);
          return;
        }
        if (status === 402 || parsed.error === 'credits_exhausted') {
          setState({ loading: false, content: null, error: null, errorCode: 'credits_exhausted', retryAfter: null, cached: false });
          return;
        }
        throw error;
      }
      if (!data?.content) {
        if (data?.error === 'rate_limited') {
          const retryAfter = data?.retryAfter ?? 30;
          setState({ loading: false, content: null, error: null, errorCode: 'rate_limited', retryAfter, cached: false });
          startCountdown(retryAfter);
          return;
        }
        if (data?.error === 'credits_exhausted') {
          setState({ loading: false, content: null, error: null, errorCode: 'credits_exhausted', retryAfter: null, cached: false });
          return;
        }
        throw new Error(data?.error ?? 'empty');
      }
      setState({
        loading: false,
        content: data.content as string,
        error: null,
        errorCode: null,
        retryAfter: null,
        cached: Boolean(data.cached),
      });
    } catch (err) {
      setState({
        loading: false,
        content: null,
        error: err instanceof Error ? err.message : String(err),
        errorCode: 'generic',
        retryAfter: null,
        cached: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCountdown = useCallback((seconds: number) => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setState((s) => {
        if (s.retryAfter === null) return s;
        const next = s.retryAfter - 1;
        if (next <= 0) {
          clearTimer();
          if (lastReqRef.current) {
            // fire-and-forget retry
            void generate(lastReqRef.current);
          }
          return { ...s, retryAfter: 0 };
        }
        return { ...s, retryAfter: next };
      });
    }, 1000);
  }, [generate]);

  const retry = useCallback(() => {
    if (lastReqRef.current) void generate(lastReqRef.current);
  }, [generate]);

  const reset = useCallback(() => {
    clearTimer();
    lastReqRef.current = null;
    setState({ loading: false, content: null, error: null, errorCode: null, retryAfter: null, cached: false });
  }, []);

  useEffect(() => () => clearTimer(), []);

  return { ...state, generate, retry, reset };
}