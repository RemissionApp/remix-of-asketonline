import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Calendar, CreditCard, Crown, Gift, Plus, RefreshCw, Sparkles, Users,
} from 'lucide-react';
import { useEntitlement } from '@/hooks/useEntitlement';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useCallMinutes } from '@/hooks/useCallMinutes';
import { useAppStore } from '@/store/useAppStore';
import { isNativePlatform } from '@/utils/platform';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ProfileRow } from './ui/ProfileRow';
import { ProfileSection } from './ui/ProfileSection';
import { useProfileLang } from './i18n';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { getStripeEnvironment } from '@/lib/stripe';

export const ProfileSubscriptionTab: React.FC = () => {
  const navigate = useNavigate();
  const lang = useProfileLang();
  const { user } = useAppStore();
  const { isPro, isTrialActive, daysLeft, hoursLeft } = useEntitlement();
  const { presentPaywall, restorePurchases } = useRevenueCat(user?.id);
  const { minutesUsed, minutesLimit } = useCallMinutes();
  const { openCheckout, checkoutElement } = useStripeCheckout();

  const openPaywall = () => {
    if (isNativePlatform()) {
      presentPaywall().catch(() => navigate('/comparison'));
    } else {
      navigate('/comparison');
    }
  };

  const openManage = async () => {
    if (isNativePlatform()) {
      navigate('/comparison');
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: { returnUrl: `${window.location.origin}/profile`, environment: getStripeEnvironment() },
      });
      if (error || !data?.url) throw new Error(error?.message || 'no url');
      window.open(data.url, '_blank');
    } catch (e) {
      toast({ title: 'Не удалось открыть управление подпиской', variant: 'destructive' });
    }
  };

  const handleRestore = () => {
    if (isNativePlatform()) {
      restorePurchases().catch(() => {});
    } else {
      // On web there are no "purchases to restore" — opening the billing
      // portal lets users find the right account & resync subscription state.
      openManage();
    }
  };

  const buyMinutesPack = () => {
    if (isNativePlatform()) {
      // Native: route to in-app paywall as fallback.
      presentPaywall().catch(() => navigate('/comparison'));
      return;
    }
    if (!user?.id) return;
    openCheckout({
      priceId: 'asceta_minutes_10_pack',
      userId: user.id,
      customerEmail: user.email,
      returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });
  };

  const t = {
    title:        { ru: 'Asceta Pro',           en: 'Asceta Pro',         es: 'Asceta Pro' }[lang],
    statusActive: { ru: 'Активна',              en: 'Active',             es: 'Activa' }[lang],
    statusTrial:  { ru: 'Пробный период',       en: 'Trial',              es: 'Prueba' }[lang],
    statusFree:   { ru: 'Не подключена',        en: 'Not active',         es: 'No activa' }[lang],
    upgrade:      { ru: 'Подключить Pro',       en: 'Upgrade to Pro',     es: 'Mejorar a Pro' }[lang],
    manage:       { ru: 'Управление',           en: 'Manage',             es: 'Gestionar' }[lang],
    history:      { ru: 'История',              en: 'History',            es: 'Historial' }[lang],
    trialLeft:    (d: number, h: number) =>
      lang === 'ru' ? `Осталось ${d} дн. ${h} ч.` :
      lang === 'es' ? `Quedan ${d} d ${h} h` :
      `${d}d ${h}h left`,
    minutes:      { ru: 'Минуты звонков',         en: 'Call minutes',          es: 'Minutos de llamadas' }[lang],
    horoscopes:   { ru: 'Полные гороскопы и нумерология', en: 'Full horoscopes & numerology', es: 'Horóscopos completos' }[lang],
    pacts:        { ru: 'Безлимитные пакты аскезы',en: 'Unlimited ascesis pacts', es: 'Pactos ilimitados' }[lang],
    missions:     { ru: 'Все миссии и достижения',en: 'All missions & achievements', es: 'Misiones y logros' }[lang],
    affirmations: { ru: 'Аффирмации голосом Лиры',en: 'Affirmations in Lyra voice', es: 'Afirmaciones con voz de Lyra' }[lang],
    minutesSection:{ ru: 'Минуты',               en: 'Minutes',            es: 'Minutos' }[lang],
    minutesUsedLine:{ ru: 'Использовано',        en: 'Used',               es: 'Usado' }[lang],
    buyMinutes:   { ru: 'Купить минуты',         en: 'Buy more minutes',   es: 'Comprar minutos' }[lang],
    buyHint:      { ru: 'Дополнительные минуты для звонков', en: 'Extra call minutes', es: 'Minutos adicionales' }[lang],
    other:        { ru: 'Другое',                en: 'Other',              es: 'Otros' }[lang],
    restore:      { ru: 'Восстановить покупки',  en: 'Restore purchases',  es: 'Restaurar compras' }[lang],
    referral:     { ru: 'Пригласить друга',      en: 'Refer a friend',     es: 'Invita a un amigo' }[lang],
    referralHint: { ru: '+7 дней Pro за каждого друга', en: '+7 Pro days per friend', es: '+7 días Pro por amigo' }[lang],
    compare:      { ru: 'Сравнить планы',        en: 'Compare plans',      es: 'Comparar planes' }[lang],
  };

  const features: Array<keyof typeof t> = ['minutes', 'horoscopes', 'pacts', 'missions', 'affirmations'];
  const minutesPercent = Math.min(100, (minutesUsed / Math.max(1, minutesLimit)) * 100);

  const statusBadge = isPro ? (
    <span className="text-[11px] uppercase tracking-wider px-2 py-1 rounded-full bg-cosmic-gold text-cosmic-dark font-medium">{t.statusActive}</span>
  ) : isTrialActive ? (
    <span className="text-[11px] uppercase tracking-wider px-2 py-1 rounded-full bg-cosmic-accent/30 text-cosmic-accent border border-cosmic-accent/40">{t.statusTrial}</span>
  ) : (
    <span className="text-[11px] uppercase tracking-wider px-2 py-1 rounded-full bg-white/10 text-cosmic-secondary border border-white/15">{t.statusFree}</span>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl border border-cosmic-gold/30 bg-gradient-to-br from-cosmic-gold/20 via-cosmic-dark/60 to-cosmic-accent/20 p-5 shadow-lg shadow-cosmic-gold/20">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cosmic-gold to-cosmic-accent flex items-center justify-center shadow-[0_0_20px_rgba(232,193,108,0.5)]">
              <Crown size={22} className="text-cosmic-dark" />
            </div>
            <div>
              <div className={`text-lg text-white ${lang === 'en' ? 'font-serif' : 'font-serif'}`}>{t.title}</div>
              <div className="text-[12px] text-cosmic-secondary mt-0.5">
                {isTrialActive && !isPro ? t.trialLeft(daysLeft, hoursLeft) : isPro ? '' : '—'}
              </div>
            </div>
          </div>
          {statusBadge}
        </div>

        <ul className="mt-4 space-y-1.5">
          {features.map(f => (
            <li key={f as string} className="flex items-start gap-2 text-xs text-cosmic-secondary">
              <span className="text-cosmic-gold leading-none mt-0.5">✦</span>
              <span>{t[f] as string}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex gap-2">
          {!isPro && (
            <button
              onClick={openPaywall}
              className="flex-1 rounded-xl bg-cosmic-gold text-cosmic-dark text-xs font-medium py-2.5 active:scale-[0.99] transition-transform"
            >
              {t.upgrade}
            </button>
          )}
          <button
            onClick={() => (isPro ? openManage() : navigate('/comparison'))}
            className="flex-1 rounded-xl border border-cosmic-accent/30 text-cosmic-secondary text-xs py-2.5 active:scale-[0.99] transition-transform"
          >
            {isPro ? t.manage : t.compare}
          </button>
        </div>
      </div>

      <ProfileSection title={t.minutesSection}>
        <div className="bg-cosmic-dark/40 border border-cosmic-accent/15 rounded-2xl p-4">
          <div className="flex items-center justify-between text-[12px] text-cosmic-secondary">
            <span>{t.minutesUsedLine}: <span className="text-white">{minutesUsed.toFixed(1)} / {minutesLimit}</span></span>
            <span>{minutesPercent.toFixed(0)}%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-cosmic-dark/60 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cosmic-accent to-cosmic-gold" style={{ width: `${minutesPercent}%` }} />
          </div>
        </div>
        <ProfileRow icon={Plus} iconColor="gold" label={t.buyMinutes} sublabel={t.buyHint} onPress={buyMinutesPack} badge={{ text: '$1.99 / 10', color: 'gold' }} />
      </ProfileSection>

      <ProfileSection title={t.other}>
        <ProfileRow rounded="top" icon={RefreshCw} iconColor="purple" label={t.restore} onPress={handleRestore} />
        <ProfileRow rounded="middle" icon={Gift} iconColor="green" label={t.referral} sublabel={t.referralHint} badge={{ text: '+7d', color: 'green' }} />
        <ProfileRow rounded="bottom" icon={BarChart3} iconColor="gray" label={t.compare} onPress={() => navigate('/comparison')} />
      </ProfileSection>
      {checkoutElement}
    </div>
  );
};