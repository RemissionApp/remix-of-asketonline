import React, { useEffect, useState } from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEntitlement } from '@/hooks/useEntitlement';
import { useAppStore } from '@/store/useAppStore';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { isNativePlatform } from '@/utils/platform';
import { Button } from '@/components/ui/button';

const DISMISS_KEY = 'trial_expired_dismissed_at';
const DISMISS_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Auto-shown paywall after the 3-day trial expires for users who never paid.
 * Renders at app root. Locks the screen until subscription or "later" (1/day).
 */
export const TrialExpiredGate: React.FC = () => {
  const { isPro, isTrialActive, trialEndsAt, loading } = useEntitlement();
  const { user } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const web = useWebBilling();
  const { presentPaywall } = useRevenueCat(user?.id);

  const [dismissed, setDismissed] = useState(() => {
    try {
      const ts = Number(localStorage.getItem(DISMISS_KEY) || 0);
      return ts && Date.now() - ts < DISMISS_TTL_MS;
    } catch {
      return false;
    }
  });

  // Routes where the gate must NOT block (auth, legal, paywall itself)
  const blockedRoutes = [
    '/welcome',
    '/login',
    '/auth',
    '/language',
    '/onboarding',
    '/user-profile',
    '/comparison',
    '/privacy-policy',
    '/terms',
    '/delete-account',
  ];
  const onBlockedRoute = blockedRoutes.some(r => location.pathname.startsWith(r));

  const trialEndedWithoutPayment =
    !!user?.id &&
    !loading &&
    !isPro &&
    !isTrialActive &&
    !!trialEndsAt &&
    trialEndsAt.getTime() <= Date.now();

  // Auto-trigger native paywall once when conditions match
  useEffect(() => {
    if (!trialEndedWithoutPayment || dismissed || onBlockedRoute) return;
    if (isNativePlatform()) {
      presentPaywall().catch(() => {});
    }
  }, [trialEndedWithoutPayment, dismissed, onBlockedRoute, presentPaywall]);

  if (!trialEndedWithoutPayment || dismissed || onBlockedRoute) return null;
  if (isNativePlatform()) return null; // native paywall already triggered

  const monthly =
    web.offering?.monthly ??
    web.offering?.availablePackages?.find(p =>
      p.identifier.toLowerCase().includes('month')
    ) ??
    null;
  const annual =
    web.offering?.annual ??
    web.offering?.availablePackages?.find(
      p =>
        p.identifier.toLowerCase().includes('annual') ||
        p.identifier.toLowerCase().includes('year')
    ) ??
    null;

  const handleLater = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
    setDismissed(true);
  };

  const handleCompare = () => {
    handleLater();
    navigate('/comparison');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-cosmic-dark/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-cosmic-gold/30 bg-gradient-to-br from-cosmic-dark via-cosmic-indigo/40 to-cosmic-dark p-6 shadow-[0_0_60px_rgba(232,193,108,0.25)]">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cosmic-gold to-cosmic-accent flex items-center justify-center shadow-[0_0_24px_rgba(232,193,108,0.5)] mb-3">
            <Crown size={26} className="text-cosmic-dark" />
          </div>
          <h2 className="text-xl font-serif text-white">Триал завершён</h2>
          <p className="text-sm text-cosmic-secondary mt-1.5">
            Чтобы продолжить пользоваться Asceta — оформи подписку
          </p>
        </div>

        <ul className="space-y-1.5 text-left mb-5">
          {[
            'Голосовой наставник Лира — 30 мин/мес',
            'Полная нумерология и матрицы',
            'Персональные гороскопы',
            'Безлимитные пакты аскезы',
            'Все миссии и достижения',
          ].map(f => (
            <li
              key={f}
              className="flex items-start gap-2 text-xs text-cosmic-secondary"
            >
              <span className="text-cosmic-gold mt-0.5">✦</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          {annual && (
            <Button
              className="w-full bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90 py-6 text-base font-semibold"
              onClick={() => web.purchase(annual)}
              disabled={web.isPurchasing || !web.isReady}
            >
              <Sparkles className="mr-2" size={18} />
              Год ·{' '}
              {annual.webBillingProduct?.currentPrice?.formattedPrice ?? '—'}
            </Button>
          )}
          {monthly && (
            <Button
              variant="outline"
              className="w-full border-cosmic-gold/40 text-cosmic-gold hover:bg-cosmic-gold/10"
              onClick={() => web.purchase(monthly)}
              disabled={web.isPurchasing || !web.isReady}
            >
              Месяц ·{' '}
              {monthly.webBillingProduct?.currentPrice?.formattedPrice ?? '—'}
            </Button>
          )}
          {!annual && !monthly && (
            <Button
              className="w-full bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
              onClick={handleCompare}
            >
              Открыть подписку
            </Button>
          )}
        </div>

        <button
          onClick={handleLater}
          className="block w-full text-center text-xs text-cosmic-secondary/70 mt-4 hover:text-cosmic-secondary transition-colors"
        >
          Напомнить позже
        </button>
      </div>
    </div>
  );
};
