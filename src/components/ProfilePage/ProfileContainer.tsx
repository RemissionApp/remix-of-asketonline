import React from 'react';
import { cn } from '@/lib/utils';

interface ProfileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ProfileContainer: React.FC<ProfileContainerProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('w-full space-y-space-lg', className)}>
      {children}
    </div>
  );
};