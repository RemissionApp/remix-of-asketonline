import React from 'react';
import { Sparkles, Crown } from 'lucide-react';
import { useEntitlement } from '@/hooks/useEntitlement';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const TrialBanner: React.FC = () => {
  const { isTrialActive, isPro, daysLeft, hoursLeft, loading } = useEntitlement();
  const navigate = useNavigate();

  if (loading || isPro || !isTrialActive) return null;

  const isLastDay = daysLeft === 0;
  const timeLabel =
    daysLeft > 0
      ? `${daysLeft} ${daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}`
      : `${hoursLeft} ч`;

  return (
    <div
      className={`mx-4 mt-2 rounded-xl border px-4 py-3 backdrop-blur-md ${
        isLastDay
          ? 'border-cosmic-gold/60 bg-cosmic-gold/10'
          : 'border-cosmic-accent/40 bg-cosmic-dark/60'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles
            size={18}
            className={isLastDay ? 'text-cosmic-gold' : 'text-cosmic-accent'}
          />
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground">
              Полный доступ открыт
            </div>
            <div className="text-xs text-muted-foreground truncate">
              Осталось {timeLabel} триала
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant={isLastDay ? 'default' : 'outline'}
          className="shrink-0"
          onClick={() => navigate('/comparison')}
        >
          <Crown size={14} className="mr-1" />
          Продолжить
        </Button>
      </div>
    </div>
  );
};