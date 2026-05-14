import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';

const POLL_INTERVAL_MS = 1500;
const MAX_POLLS = 20;

const CheckoutReturnPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAppStore();
  const sessionId = params.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'pending'>('loading');

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    let polls = 0;

    const poll = async () => {
      polls += 1;
      const { data } = await supabase
        .from('subscriptions')
        .select('status, stripe_subscription_id')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;
      const active = data && ['active', 'trialing'].includes(data.status as string) && !!data.stripe_subscription_id;
      if (active) {
        setStatus('success');
        return;
      }
      if (polls >= MAX_POLLS) {
        setStatus('pending');
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    };
    poll();
    return () => { cancelled = true; };
  }, [user?.id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cosmic-dark p-6">
      <div className="max-w-md w-full text-center rounded-3xl border border-cosmic-gold/30 bg-gradient-to-br from-cosmic-dark via-cosmic-indigo/40 to-cosmic-dark p-8">
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto text-cosmic-gold animate-spin mb-4" size={42} />
            <h1 className="text-xl font-serif text-white mb-2">Завершаем оформление…</h1>
            <p className="text-sm text-cosmic-secondary">Подтверждаем оплату</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="mx-auto text-cosmic-gold mb-4" size={48} />
            <h1 className="text-xl font-serif text-white mb-2">Подписка активна</h1>
            <p className="text-sm text-cosmic-secondary mb-6">Добро пожаловать в Asceta Pro ✦</p>
            <Button className="w-full bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90" onClick={() => navigate('/main')}>
              Продолжить
            </Button>
          </>
        )}
        {status === 'pending' && (
          <>
            <Loader2 className="mx-auto text-cosmic-secondary mb-4" size={42} />
            <h1 className="text-xl font-serif text-white mb-2">Оплата обрабатывается</h1>
            <p className="text-sm text-cosmic-secondary mb-6">
              Это может занять до минуты. Статус обновится автоматически.
              {sessionId && <span className="block opacity-50 mt-2 text-[11px]">{sessionId}</span>}
            </p>
            <Button className="w-full bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90" onClick={() => navigate('/main')}>
              На главную
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutReturnPage;
