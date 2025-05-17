
import React from 'react';
import { cn } from '@/lib/utils';

interface CosmicButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'subtle' | 'destructive' | 'white';
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
    default: 'bg-gradient-to-r from-cosmic-accent to-cosmic-indigo hover:from-purple-500 hover:to-blue-500 text-white shadow-md',
    outline: 'border border-cosmic-accent bg-cosmic-accent/20 text-cosmic-accent hover:bg-cosmic-accent/30 shadow-sm',
    subtle: 'bg-cosmic-accent/10 text-cosmic-accent hover:bg-cosmic-accent/20',
    destructive: 'bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/30',
    white: 'border border-white text-white hover:bg-white/10 shadow-sm'
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
        'rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
};
