import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { PaywallButton } from '@/components/PaywallButton';

export const ActionButtonsSection: React.FC = () => {
  const { setActiveScreen } = useAppStore();

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      <PaywallButton variant="premium" size="lg" className="w-full max-w-sm" />
    </div>
  );
};
