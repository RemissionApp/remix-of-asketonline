import React from 'react';

interface Props {
  label: string;
  value: number;
  hint?: string;
  symbol?: string;
}

export const KarmaPositionCard: React.FC<Props> = ({ label, value, hint, symbol }) => (
  <div className="rounded-2xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-3 flex items-center gap-3">
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cosmic-gold/30 to-cosmic-accent/30 border border-white/10 flex items-center justify-center font-serif text-foreground">
      <span className="text-lg">{value}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-foreground text-sm flex items-center gap-1">
        {symbol && <span className="text-cosmic-gold">{symbol}</span>}
        {label}
      </p>
      {hint && <p className="text-cosmic-secondary text-xs truncate">{hint}</p>}
    </div>
  </div>
);

export default KarmaPositionCard;