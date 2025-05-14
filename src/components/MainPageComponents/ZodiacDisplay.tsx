
import React from 'react';
import { ZodiacInfo } from '@/components/ZodiacInfo';
import { useAppStore } from '@/store/useAppStore';

export const ZodiacDisplay: React.FC = () => {
  const { userProfile } = useAppStore();
  
  // Only display if user has a birthdate
  if (!userProfile?.birthDate) {
    return null;
  }
  
  return (
    <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-4 mb-6 w-full max-w-lg mx-auto">
      <ZodiacInfo />
    </div>
  );
};
