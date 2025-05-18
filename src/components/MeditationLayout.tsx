
import React from 'react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';

export interface MeditationLayoutProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  padded?: boolean;
}

export const MeditationLayout: React.FC<MeditationLayoutProps> = ({
  children,
  title,
  icon,
  padded = true
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-cosmic">
      <StarField starCount={50} />
      
      {title && (
        <div className="border-b border-cosmic-accent/20 p-4 flex items-center bg-cosmic-dark/40 backdrop-blur-md">
          {icon}
          <h1 className="text-cosmic-accent text-xl font-serif">{title}</h1>
        </div>
      )}
      
      <div className={`flex-1 ${padded ? 'p-4' : 'p-0'}`}>
        {children}
      </div>
      
      <BottomNavigation />
    </div>
  );
};
