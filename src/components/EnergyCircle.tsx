
import React from 'react';
import { cn } from '@/lib/utils';

interface EnergyCircleProps {
  progress?: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const EnergyCircle: React.FC<EnergyCircleProps> = ({
  progress = 0,
  size = 'md',
  children,
  className,
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-36 h-36',
    md: 'w-64 h-64',
    lg: 'w-80 h-80',
  };

  return (
    <div 
      className={cn(
        'energy-circle animate-pulse-slow cursor-pointer',
        sizeClasses[size],
        className
      )}
      style={{
        background: `conic-gradient(rgba(139, 92, 246, 0.7) ${progress}%, rgba(139, 92, 246, 0.1) 0%)`
      }}
      onClick={onClick}
    >
      <div className="absolute inset-2 rounded-full bg-cosmic-dark/80 flex items-center justify-center backdrop-blur-sm">
        {children}
      </div>
      
      {/* Orbit particles */}
      <div className="absolute w-full h-full rounded-full animate-spin-slow" style={{ animationDuration: '20s' }}>
        <div className="absolute w-2 h-2 bg-cosmic-accent rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-[1px]"></div>
      </div>
      <div className="absolute w-full h-full rounded-full animate-spin-slow" style={{ animationDuration: '15s' }}>
        <div className="absolute w-2 h-2 bg-cosmic-gold rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-[1px]"></div>
      </div>
    </div>
  );
};
