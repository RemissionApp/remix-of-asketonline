import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export type IconColor = 'gold' | 'purple' | 'blue' | 'green' | 'red' | 'gray';

const iconColorMap: Record<IconColor, { bg: string; text: string; ring: string }> = {
  gold:   { bg: 'bg-cosmic-gold/15',     text: 'text-cosmic-gold',     ring: 'ring-cosmic-gold/30' },
  purple: { bg: 'bg-cosmic-accent/15',   text: 'text-cosmic-accent',   ring: 'ring-cosmic-accent/30' },
  blue:   { bg: 'bg-cosmic-deep-blue/25',text: 'text-sky-300',         ring: 'ring-sky-400/30' },
  green:  { bg: 'bg-emerald-500/15',     text: 'text-emerald-300',     ring: 'ring-emerald-400/30' },
  red:    { bg: 'bg-rose-500/15',        text: 'text-rose-300',        ring: 'ring-rose-400/30' },
  gray:   { bg: 'bg-white/5',            text: 'text-cosmic-secondary',ring: 'ring-white/10' },
};

const badgeColorMap: Record<IconColor, string> = {
  gold:   'bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/30',
  purple: 'bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/30',
  blue:   'bg-sky-500/20 text-sky-300 border-sky-400/30',
  green:  'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  red:    'bg-rose-500/20 text-rose-300 border-rose-400/30',
  gray:   'bg-white/10 text-cosmic-secondary border-white/15',
};

interface ProfileRowProps {
  icon: LucideIcon;
  iconColor?: IconColor;
  label: string;
  sublabel?: string;
  value?: string;
  onPress?: () => void;
  toggle?: { value: boolean; onChange: (v: boolean) => void };
  badge?: { text: string; color?: IconColor };
  rounded?: 'top' | 'middle' | 'bottom' | 'single';
}

export const ProfileRow: React.FC<ProfileRowProps> = ({
  icon: Icon,
  iconColor = 'gold',
  label,
  sublabel,
  value,
  onPress,
  toggle,
  badge,
  rounded = 'single',
}) => {
  const c = iconColorMap[iconColor];
  const radius =
    rounded === 'top' ? 'rounded-t-2xl rounded-b-md'
    : rounded === 'bottom' ? 'rounded-t-md rounded-b-2xl'
    : rounded === 'middle' ? 'rounded-md'
    : 'rounded-2xl';

  const Wrapper: React.ElementType = onPress ? 'button' : 'div';

  return (
    <Wrapper
      type={onPress ? 'button' : undefined}
      onClick={onPress}
      className={`w-full text-left flex items-center gap-3 bg-cosmic-dark/40 border border-cosmic-accent/15 backdrop-blur-sm p-4 ${radius} ${onPress ? 'transition-transform active:scale-[0.99] hover:bg-cosmic-dark/55' : ''}`}
    >
      <div className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-xl ${c.bg} ring-1 ${c.ring}`}>
        <Icon size={16} className={c.text} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white truncate">{label}</div>
        {sublabel && (
          <div className="text-[11px] text-cosmic-secondary mt-0.5 truncate">{sublabel}</div>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badgeColorMap[badge.color ?? 'gold']}`}>
            {badge.text}
          </span>
        )}
        {value && !toggle && (
          <span className="text-[11px] text-cosmic-secondary text-right max-w-[40vw] truncate">{value}</span>
        )}
        {toggle && (
          <Switch checked={toggle.value} onCheckedChange={toggle.onChange} />
        )}
        {onPress && !toggle && <ChevronRight size={14} className="text-cosmic-secondary" />}
      </div>
    </Wrapper>
  );
};