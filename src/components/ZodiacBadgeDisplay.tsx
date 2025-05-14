
import React from 'react';
import { ZodiacBadge } from '@/components/ZodiacBadge';
import { ZodiacInfo } from '@/components/ZodiacInfo';
import { useAppStore } from '@/store/useAppStore';

export const ZodiacBadgeDisplay: React.FC = () => {
  const { userProfile } = useAppStore();
  
  // Only display if user has a birthdate
  if (!userProfile?.birthDate) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <ZodiacInfo />
    </div>
  );
};
