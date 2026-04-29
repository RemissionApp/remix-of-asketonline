import React from 'react';
import { Sparkles, Crown, AlertTriangle } from 'lucide-react';
import { useEntitlement } from '@/hooks/useEntitlement';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useRevenueCatStore } from '@/store/slices/revenueCatSlice';

export const TrialBanner: React.FC = () => {
  const { isTrialActive, isPro, daysLeft, hoursLeft, loading } = useEntitlement();
  const navigate = useNavigate();
  const presentPaywall = useRevenueCatStore((s) => s.presentPaywall);

  if (loading || isPro || !isTrialActive) return null;

  const totalHoursLeft = daysLeft * 24 + hoursLeft;
  const isUrgent = totalHoursLeft < 24; // last 24h — red mode
  const isLastDay = daysLeft === 0;
  const timeLabel =
    daysLeft > 0
      ? `${daysLeft} ${daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}`
      : `${hoursLeft} ч`;

  const handleOpen = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await presentPaywall();
        return;
      } catch (e) {
        console.warn('Paywall failed, falling back to /comparison', e);
      }
    }
    navigate('/comparison');
  };

  return (
    <div
      className={`mx-4 mt-2 rounded-xl border px-4 py-3 backdrop-blur-md ${
        isUrgent
          ? 'border-destructive/60 bg-destructive/10'
          : isLastDay
          ? 'border-cosmic-gold/60 bg-cosmic-gold/10'
          : 'border-cosmic-accent/40 bg-cosmic-dark/60'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {isUrgent ? (
            <AlertTriangle size={18} className="text-destructive" />
          ) : (
            <Sparkles
              size={18}
              className={isLastDay ? 'text-cosmic-gold' : 'text-cosmic-accent'}
            />
          )}
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground">
              {isUrgent ? 'Триал почти закончился' : 'Полный доступ открыт'}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {isUrgent
                ? `Осталось ${hoursLeft} ч. Привяжите оплату, чтобы не потерять доступ`
                : `Осталось ${timeLabel} триала`}
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant={isUrgent || isLastDay ? 'default' : 'outline'}
          className="shrink-0"
          onClick={handleOpen}
        >
          <Crown size={14} className="mr-1" />
          {isUrgent ? 'Оплатить' : 'Продолжить'}
        </Button>
      </div>
    </div>
  );
};