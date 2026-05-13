import { supabase } from '@/integrations/supabase/client';

export async function callAdmin(action: string, payload: Record<string, unknown> = {}) {
  const { data, error } = await supabase.functions.invoke('admin-analytics', {
    body: { action, ...payload },
  });
  if (error) throw error;
  return data;
}
