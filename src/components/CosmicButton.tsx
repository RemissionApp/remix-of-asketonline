import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import type { ButtonProps } from './ui/button';
import { usePWAFeatures } from '@/hooks/usePWAFeatures';

interface CosmicButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: 'default' | 'outline' | 'subtle' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CosmicButton: React.FC<CosmicButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  onClick,
  ...props
}) => {
  const { haptic } = usePWAFeatures();
  const variantClasses = {
    default:
      'bg-gradient-to-r from-cosmic-accent to-cosmic-indigo hover:from-purple-500 hover:to-blue-500 text-white shadow-md',
    outline:
      'border border-cosmic-accent bg-cosmic-accent/20 text-cosmic-accent hover:bg-cosmic-accent/30 shadow-sm',
    subtle: 'bg-cosmic-accent/10 text-cosmic-accent hover:bg-cosmic-accent/20',
    destructive:
      'bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/30',
    ghost:
      'text-cosmic-accent hover:bg-cosmic-accent/10 hover:text-cosmic-accent',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Non-blocking haptic feedback
    try {
      haptic.buttonTap().catch(() => {});
    } catch (error) {
      // Ignore haptic errors
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={handleClick}
      className={cn(
        'rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
