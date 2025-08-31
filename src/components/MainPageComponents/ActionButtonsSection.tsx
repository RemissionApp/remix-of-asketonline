import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { SimplePurchaseButton } from '@/components/SimplePurchaseButton';

export const ActionButtonsSection: React.FC = () => {
  const { setActiveScreen } = useAppStore();

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      <SimplePurchaseButton />
    </div>
  );
};
