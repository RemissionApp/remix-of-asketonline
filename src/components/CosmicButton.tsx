
import React from 'react';
import { cn } from '@/lib/utils';

interface CosmicButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const CosmicButton: React.FC<CosmicButtonProps> = ({
  onClick,
  children,
  variant = 'default',
  size = 'md',
  className,
  disabled = false,
  type = 'button',
}) => {
  const variantClasses = {
    default: 'bg-gradient-to-r from-cosmic-accent to-cosmic-indigo hover:from-cosmic-accent2 hover:to-cosmic-deep-blue text-white shadow-sm',
    outline: 'border border-cosmic-accent bg-transparent text-cosmic-accent hover:bg-cosmic-accent/10',
    subtle: 'bg-cosmic-accent/10 text-cosmic-accent hover:bg-cosmic-accent/20'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn(
        'rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
};
