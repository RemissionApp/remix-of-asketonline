import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: number | string;
  active?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const NumberCard: React.FC<Props> = ({ label, value, active, onClick, size = 'md' }) => {
  const dim =
    size === 'lg' ? 'w-20 h-20 text-3xl' : size === 'sm' ? 'w-12 h-12 text-base' : 'w-16 h-16 text-2xl';
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-2 rounded-2xl transition-all',
        active && 'bg-cosmic-gold/10 ring-1 ring-cosmic-gold/40',
        onClick && 'hover:bg-white/5 active:scale-95'
      )}
    >
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-cosmic-gold/30 to-cosmic-accent/30 border border-white/10',
          'shadow-[0_0_20px_hsl(var(--cosmic-gold)/0.25)] flex items-center justify-center font-serif text-foreground',
          dim
        )}
      >
        {value}
      </div>
      <p className="text-cosmic-secondary text-[11px] text-center leading-tight max-w-[88px]">
        {label}
      </p>
    </button>
  );
};

export default NumberCard;