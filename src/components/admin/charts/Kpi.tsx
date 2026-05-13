import React from 'react';

export const Kpi: React.FC<{ label: string; value: string | number; hint?: string }> = ({ label, value, hint }) => (
  <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5">
    <div className="text-xs uppercase tracking-wider text-cosmic-secondary">{label}</div>
    <div className="mt-2 font-serif text-3xl text-white tabular-nums">{value}</div>
    {hint && <div className="text-xs text-cosmic-secondary/70 mt-1">{hint}</div>}
  </div>
);
