import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PasswordRules {
  minLength: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export const evaluatePassword = (password: string): PasswordRules => ({
  minLength: password.length >= 8,
  hasUpper: /[A-ZА-ЯЁ]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecial: /[^A-Za-zА-Яа-яЁё0-9]/.test(password),
});

export const passwordScore = (rules: PasswordRules): number =>
  Object.values(rules).filter(Boolean).length;

export const isPasswordStrongEnough = (password: string): boolean => {
  const r = evaluatePassword(password);
  return r.minLength && r.hasUpper && r.hasNumber;
};

interface Props {
  password: string;
  className?: string;
}

const Rule: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <li
    className={cn(
      'flex items-center gap-2 text-xs transition-colors',
      ok ? 'text-cosmic-accent' : 'text-white/50'
    )}
  >
    {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
    {label}
  </li>
);

const PasswordStrengthIndicator: React.FC<Props> = ({ password, className }) => {
  const rules = evaluatePassword(password);
  const score = passwordScore(rules);
  const percent = (score / 4) * 100;

  const barColor =
    score <= 1
      ? 'bg-destructive'
      : score === 2
      ? 'bg-yellow-500'
      : score === 3
      ? 'bg-cosmic-accent/70'
      : 'bg-cosmic-accent';

  const label =
    score <= 1 ? 'Слабый' : score === 2 ? 'Средний' : score === 3 ? 'Хороший' : 'Сильный';

  if (!password) return null;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-cosmic-dark/40 overflow-hidden">
          <div
            className={cn('h-full transition-all duration-300', barColor)}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-white/70 w-16 text-right">{label}</span>
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        <Rule ok={rules.minLength} label="Мин. 8 символов" />
        <Rule ok={rules.hasUpper} label="Заглавная буква" />
        <Rule ok={rules.hasNumber} label="Цифра" />
        <Rule ok={rules.hasSpecial} label="Спецсимвол" />
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;