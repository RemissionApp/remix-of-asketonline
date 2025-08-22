import React from 'react';
import { cn } from '@/lib/utils';

interface EnergyCircleProps {
  progress?: number; // 0 to 100
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  status?: 'active' | 'completed' | 'failed' | 'planned';
}

export const EnergyCircle: React.FC<EnergyCircleProps> = ({
  progress = 0,
  size = 'md',
  children,
  className,
  onClick,
  style,
  status = 'active',
}) => {
  const sizeClasses = {
    xs: 'w-24 h-24',
    sm: 'w-48 h-48',
    md: 'w-64 h-64',
    lg: 'w-80 h-80',
  };

  const getProgressGradient = () => {
    if (status === 'failed') {
      return `conic-gradient(rgba(239, 68, 68, 0.7) ${progress}%, rgba(239, 68, 68, 0.1) 0%)`;
    }
    return `conic-gradient(rgba(139, 92, 246, 0.7) ${progress}%, rgba(139, 92, 246, 0.1) 0%)`;
  };

  return (
    <div className="relative flex justify-center items-center p-8">
      <div
        className={cn(
          'energy-circle animate-pulse-slow relative',
          sizeClasses[size],
          onClick && 'cursor-pointer',
          status === 'failed' && 'ring-2 ring-red-500/30',
          className
        )}
        style={{
          background: getProgressGradient(),
          ...style,
        }}
        onClick={onClick}
      >
        <div className="absolute inset-2 rounded-full bg-cosmic-dark/80 flex items-center justify-center backdrop-blur-sm">
          {children}
        </div>

        {/* Orbit particles */}
        <div
          className="absolute w-full h-full rounded-full animate-spin-slow"
          style={{ animationDuration: '20s' }}
        >
          <div className="absolute w-2 h-2 bg-cosmic-accent rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-[1px]"></div>
        </div>
        <div
          className="absolute w-full h-full rounded-full animate-spin-slow"
          style={{ animationDuration: '15s' }}
        >
          <div className="absolute w-2 h-2 bg-cosmic-gold rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-[1px]"></div>
        </div>
      </div>
    </div>
  );
};
