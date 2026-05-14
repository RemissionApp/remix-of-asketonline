import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type DeepContext =
  | 'lifePath'
  | 'soul'
  | 'personality'
  | 'expression'
  | 'square'
  | 'karma'
  | 'overall';

interface DeepRequest {
  context: DeepContext;
  focusNumber?: number;
  language: 'ru' | 'en' | 'es';
  profile: Record<string, unknown>;
}

interface State {
  loading: boolean;
  content: string | null;
  error: string | null;
  cached: boolean;
}

export function useNumerologyDeepReading() {
  const [state, setState] = useState<State>({
    loading: false,
    content: null,
    error: null,
    cached: false,
  });

  const generate = useCallback(async (req: DeepRequest) => {
    setState({ loading: true, content: null, error: null, cached: false });
    try {
      const { data, error } = await supabase.functions.invoke(
        'generate-numerology-description',
        { body: req }
      );
      if (error) throw error;
      if (!data?.content) throw new Error(data?.error ?? 'empty');
      setState({
        loading: false,
        content: data.content as string,
        error: null,
        cached: Boolean(data.cached),
      });
    } catch (err) {
      setState({
        loading: false,
        content: null,
        error: err instanceof Error ? err.message : String(err),
        cached: false,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, content: null, error: null, cached: false });
  }, []);

  return { ...state, generate, reset };
}