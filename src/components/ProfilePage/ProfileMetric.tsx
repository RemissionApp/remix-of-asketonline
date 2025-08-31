import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileMetricProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color?: string;
  className?: string;
}

export const ProfileMetric: React.FC<ProfileMetricProps> = ({
  icon: Icon,
  label,
  value,
  color = 'text-cosmic-accent',
  className
}) => {
  return (
    <div className={cn(
      'text-center p-space-sm rounded-lg bg-cosmic-accent/5 animate-fade-in',
      className
    )}>
      <div className="flex items-center justify-center mb-1">
        <Icon className={cn('w-4 h-4', color)} />
      </div>
      <div className={cn('text-lg font-bold', color)}>
        {value}
      </div>
      <div className="text-xs text-cosmic-text/60">
        {label}
      </div>
    </div>
  );
};