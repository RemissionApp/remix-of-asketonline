import React from 'react';
import { SparklesIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProBadge: React.FC<ProBadgeProps> = ({
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1 bg-gradient-to-r from-cosmic-gold to-amber-500 text-black font-semibold rounded-full',
        sizeClasses[size],
        className
      )}
    >
      <SparklesIcon size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
      <span>PRO</span>
    </div>
  );
};
