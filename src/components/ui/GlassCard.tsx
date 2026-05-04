import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';

export type GlassVariant = 'purple' | 'gold' | 'green' | 'blue' | 'amber' | 'violet';

const VARIANTS: Record<GlassVariant, { iconBg: string; iconText: string; glow: string }> = {
  purple: { iconBg: 'bg-[rgba(124,107,224,0.25)]', iconText: 'text-white',          glow: 'from-[rgba(124,107,224,0.30)] to-transparent' },
  violet: { iconBg: 'bg-[rgba(139,92,246,0.25)]',  iconText: 'text-white',          glow: 'from-[rgba(139,92,246,0.30)] to-transparent' },
  gold:   { iconBg: 'bg-[rgba(201,169,110,0.25)]', iconText: 'text-white',          glow: 'from-[rgba(201,169,110,0.30)] to-transparent' },
  amber:  { iconBg: 'bg-[rgba(245,158,11,0.25)]',  iconText: 'text-white',          glow: 'from-[rgba(245,158,11,0.30)] to-transparent' },
  green:  { iconBg: 'bg-[rgba(16,185,129,0.25)]',  iconText: 'text-white',          glow: 'from-[rgba(16,185,129,0.30)] to-transparent' },
  blue:   { iconBg: 'bg-[rgba(59,130,246,0.25)]',  iconText: 'text-white',          glow: 'from-[rgba(59,130,246,0.30)] to-transparent' },
};

interface GlassCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  variant?: GlassVariant;
  onClick?: () => void;
  children?: React.ReactNode;
  showChevron?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  icon: Icon,
  title,
  subtitle,
  variant = 'purple',
  onClick,
  children,
  showChevron = true,
  className = '',
}) => {
  const v = VARIANTS[variant];
  const Wrapper: React.ElementType = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`w-full glass-medium glass-shine relative rounded-2xl p-4 overflow-hidden text-left ${
        onClick ? 'active:scale-[0.98] transition-transform duration-150' : ''
      } ${className}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r ${v.glow} pointer-events-none`} />
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${v.iconBg}`}>
          <Icon size={26} className={v.iconText} />
        </div>
        <div className="text-left flex-1 min-w-0">
          <div className="text-base font-semibold text-white mb-0.5 truncate">{title}</div>
          {subtitle && (
            <div className="text-xs text-white/55 leading-relaxed line-clamp-2">{subtitle}</div>
          )}
        </div>
        {showChevron && onClick && (
          <ChevronRight size={16} className="text-white/30 flex-shrink-0" />
        )}
      </div>
      {children && (
        <div className="mt-3 pt-3 border-t border-white/10 text-sm text-white/65 leading-relaxed text-left relative z-10">
          {children}
        </div>
      )}
    </Wrapper>
  );
};