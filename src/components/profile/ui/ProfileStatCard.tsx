import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
}

export const ProfileStatCard: React.FC<Props> = ({ icon: Icon, label, value, hint }) => (
  <div className="flex flex-col items-center justify-center text-center bg-cosmic-dark/40 border border-cosmic-accent/15 backdrop-blur-sm rounded-2xl px-3 py-3">
    <Icon size={14} className="text-cosmic-gold mb-1" />
    <div className="font-serif text-xl text-white leading-none">{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-cosmic-secondary mt-1.5">{label}</div>
    {hint && <div className="text-[10px] text-cosmic-secondary/70 mt-0.5">{hint}</div>}
  </div>
);