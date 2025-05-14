
import React from 'react';

interface HoroscopeSkeletonProps {
  className?: string;
}

export const HoroscopeSkeleton: React.FC<HoroscopeSkeletonProps> = ({ className }) => {
  return (
    <div className={`text-center p-6 ${className}`}>
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="h-6 bg-cosmic-accent/20 rounded w-3/4"></div>
        <div className="space-y-2 w-full">
          <div className="h-4 bg-cosmic-accent/20 rounded w-5/6"></div>
          <div className="h-4 bg-cosmic-accent/20 rounded w-full"></div>
          <div className="h-4 bg-cosmic-accent/20 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
};
