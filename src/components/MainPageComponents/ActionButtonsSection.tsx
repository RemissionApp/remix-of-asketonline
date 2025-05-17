
import React from 'react';
import { useAppStore } from '@/store/useAppStore';

export const ActionButtonsSection: React.FC = () => {
  const { setActiveScreen } = useAppStore();
  
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {/* Buttons can be added here in the future */}
    </div>
  );
};
