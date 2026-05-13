import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data: u } = await supabase.auth.getUser();
        if (!u?.user) { if (alive) setIsAdmin(false); return; }
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', u.user.id)
          .eq('role', 'admin')
          .maybeSingle();
        if (alive) setIsAdmin(!!data);
      } catch {
        if (alive) setIsAdmin(false);
      }
    })();
    return () => { alive = false; };
  }, []);
  return isAdmin;
}
