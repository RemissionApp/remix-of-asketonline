import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
}

export const ProfileStatCard: React.FC<Props> = ({ icon: Icon, label, value, hint }) => (
  <div className="flex flex-col items-center justify-center text-center bg-cosmic-dark/40 border border-cosmic-accent/15 backdrop-blur-sm rounded-2xl px-3 py-4 min-h-[88px]">
    <Icon size={16} className="text-cosmic-gold mb-1.5" />
    <div className="font-serif text-2xl text-white leading-none tabular-nums">{value}</div>
    <div className="text-[11px] uppercase tracking-wider text-cosmic-secondary mt-2">{label}</div>
    {hint && <div className="text-[11px] text-cosmic-secondary/70 mt-0.5">{hint}</div>}
  </div>
);