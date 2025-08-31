import React from 'react';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'elevated';
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  children,
  className,
  variant = 'default'
}) => {
  const baseClasses = 'bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg';
  
  const variantClasses = {
    default: 'p-space-lg',
    compact: 'p-space-md',
    elevated: 'p-space-lg shadow-lg shadow-cosmic-accent/20'
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );
};