
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
    <div className="mb-6 mt-4">
      <h2 className="text-xl text-white font-serif mb-4 flex items-center">
        Ваш знак зодиака
        <div className="ml-2">
          <ZodiacBadge size="sm" />
        </div>
      </h2>
      <ZodiacInfo />
    </div>
  );
};
