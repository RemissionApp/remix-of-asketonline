import React from 'react';
import {
  CheckIcon,
  SparklesIcon,
  ArrowLeftIcon,
  RefreshCwIcon,
  CrownIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { useEntitlement } from '@/hooks/useEntitlement';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { useWebBilling } from '@/hooks/useWebBilling';
import { isWebPlatform, isNativePlatform } from '@/utils/platform';
import { toast } from 'sonner';

const PRO_FEATURES = [
  '30 минут звонков с Лирой каждый месяц',
  'Полная нумерология: квадрат Пифагора и матрица кармы',
  'Персональные дневные, месячные и годовые гороскопы',
  'Безлимитные пакты аскезы',
  'Все космические миссии и достижения',
  'Аффирмации голосом Вселенной',
  'История звонков и расширенная аналитика',
];

const FeatureComparison: React.FC = () => {
  const { user } = useAppStore();
  const navigate = useNavigate();
  const { isPro, isTrialActive } = useEntitlement();
  const { presentPaywall, restorePurchases } = useRevenueCat(user?.id);
  const web = useWebBilling();
  const onWeb = isWebPlatform();

  const monthlyPkg =
    web.offering?.monthly ??
    web.offering?.availablePackages?.find(p =>
      p.identifier.toLowerCase().includes('month')
    ) ??
    null;
  const annualPkg =
    web.offering?.annual ??
    web.offering?.availablePackages?.find(
      p =>
        p.identifier.toLowerCase().includes('annual') ||
        p.identifier.toLowerCase().includes('year')
    ) ??
    null;

  const handleNativeUpgrade = async () => {
    try {
      await presentPaywall();
    } catch (e) {
      toast.error('Не удалось открыть оплату', {
        description: 'Попробуйте ещё раз через минуту',
      });
    }
  };

  if (isPro) {
    return (
      <div className="container mx-auto max-w-md px-4 py-12 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-cosmic-gold to-cosmic-accent flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(232,193,108,0.4)]">
          <CrownIcon size={28} className="text-cosmic-dark" />
        </div>
        <h2 className="text-2xl font-serif text-white mb-2">
          У вас активна подписка Asceta Pro
        </h2>
        <p className="text-sm text-cosmic-secondary mb-6">
          Все премиум-функции открыты
        </p>
        <Button
          onClick={() => navigate(-1)}
          className="bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
        >
          Вернуться в приложение
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-cosmic-secondary hover:text-white"
          onClick={() => navigate('/main')}
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Назад
        </Button>
      </div>

      <div className="text-center mb-7">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-cosmic-gold to-cosmic-accent flex items-center justify-center mb-3 shadow-[0_0_24px_rgba(232,193,108,0.4)]">
          <CrownIcon size={24} className="text-cosmic-dark" />
        </div>
        <h1 className="text-2xl font-serif text-white">Asceta Pro</h1>
        <p className="text-sm text-cosmic-secondary mt-1">
          {isTrialActive
            ? 'Продолжи путь после триала'
            : 'Открой полный доступ ко всем функциям'}
        </p>
      </div>

      {/* Tariffs */}
      <div className="space-y-3 mb-7">
        {onWeb ? (
          <>
            {annualPkg && (
              <button
                onClick={() => web.purchase(annualPkg)}
                disabled={web.isPurchasing || !web.isReady}
                className="relative w-full text-left rounded-2xl border-2 border-cosmic-gold bg-gradient-to-br from-cosmic-gold/15 to-cosmic-accent/10 p-5 hover:bg-cosmic-gold/20 transition-colors disabled:opacity-60"
              >
                <div className="absolute top-3 right-3 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cosmic-gold text-cosmic-dark font-semibold">
                  Выгоднее
                </div>
                <div className="text-xs text-cosmic-secondary uppercase tracking-wider mb-1">
                  Годовая подписка
                </div>
                <div className="text-2xl text-white font-serif">
                  {annualPkg.webBillingProduct?.currentPrice?.formattedPrice ??
                    '—'}
                  <span className="text-sm text-cosmic-secondary"> / год</span>
                </div>
                <div className="text-xs text-cosmic-gold mt-2">
                  {web.isPurchasing
                    ? 'Открываем оплату…'
                    : 'Оформить на год →'}
                </div>
              </button>
            )}
            {monthlyPkg && (
              <button
                onClick={() => web.purchase(monthlyPkg)}
                disabled={web.isPurchasing || !web.isReady}
                className="w-full text-left rounded-2xl border border-cosmic-accent/30 bg-cosmic-dark/50 p-5 hover:bg-cosmic-dark/70 transition-colors disabled:opacity-60"
              >
                <div className="text-xs text-cosmic-secondary uppercase tracking-wider mb-1">
                  Ежемесячно
                </div>
                <div className="text-2xl text-white font-serif">
                  {monthlyPkg.webBillingProduct?.currentPrice?.formattedPrice ??
                    '—'}
                  <span className="text-sm text-cosmic-secondary"> / мес</span>
                </div>
                <div className="text-xs text-cosmic-secondary mt-2">
                  {web.isPurchasing
                    ? 'Открываем оплату…'
                    : 'Оформить на месяц →'}
                </div>
              </button>
            )}
            {!monthlyPkg && !annualPkg && (
              <Button
                className="w-full bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90 py-6"
                disabled={!web.isReady}
                onClick={() =>
                  web.offering?.availablePackages?.[0] &&
                  web.purchase(web.offering.availablePackages[0])
                }
              >
                <SparklesIcon className="mr-2" size={18} />
                Оформить Pro
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={handleNativeUpgrade}
            className="w-full bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90 py-6 text-base font-semibold"
          >
            <SparklesIcon className="mr-2" size={18} />
            Оформить подписку
          </Button>
        )}
      </div>

      {/* Features list */}
      <div className="rounded-2xl border border-cosmic-accent/20 bg-cosmic-dark/40 p-5 mb-5">
        <div className="text-xs uppercase tracking-wider text-cosmic-gold mb-3">
          Что входит в Pro
        </div>
        <ul className="space-y-2.5">
          {PRO_FEATURES.map(f => (
            <li
              key={f}
              className="flex items-start gap-2.5 text-sm text-white/85"
            >
              <CheckIcon size={16} className="text-cosmic-gold mt-0.5 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {isNativePlatform() && (
        <button
          onClick={() => restorePurchases().catch(() => {})}
          className="w-full flex items-center justify-center gap-2 text-xs text-cosmic-secondary py-3"
        >
          <RefreshCwIcon size={14} />
          Восстановить покупки
        </button>
      )}

      <div className="flex justify-center gap-4 mt-3">
        <button
          onClick={() => navigate('/privacy-policy')}
          className="text-[11px] text-cosmic-secondary/60 hover:text-cosmic-secondary"
        >
          Конфиденциальность
        </button>
        <button
          onClick={() => navigate('/terms')}
          className="text-[11px] text-cosmic-secondary/60 hover:text-cosmic-secondary"
        >
          Условия
        </button>
      </div>
    </div>
  );
};

export default FeatureComparison;
