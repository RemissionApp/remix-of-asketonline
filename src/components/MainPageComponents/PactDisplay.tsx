import React, { useState } from 'react';
import { Pact } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { AdaptivePactDisplay } from '@/components/AdaptivePactDisplay';
import { BreakAscesisDialog } from '@/components/BreakAscesisDialog';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { Button } from '../ui/button';

interface PactDisplayProps {
  activePacts: Pact[];
  allPacts: Pact[];
  currentPactIndex: number;
  currentPact: Pact | null;
  handlePrevPact: () => void;
  handleNextPact: () => void;
  getAscesisPrefix: () => string;
  formatRejection: (text: string) => string;
}

export const PactDisplay: React.FC<PactDisplayProps> = ({
  activePacts,
  allPacts,
  currentPactIndex,
  currentPact,
  handlePrevPact,
  handleNextPact,
  getAscesisPrefix,
  formatRejection,
}) => {
  const { breakAscesis } = useAppStore();
  const [showBreakDialog, setShowBreakDialog] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);

  // Handle pact index change
  const handlePactIndexChange = (newIndex: number) => {
    // Use existing navigation handlers to change pact
    const diff = newIndex - currentPactIndex;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        handleNextPact();
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        handlePrevPact();
      }
    }
  };

  const handleBreakAscesis = async (reason?: string) => {
    if (!currentPact || isBreaking) {
      console.log('Cannot break ascesis:', {
        currentPact: !!currentPact,
        isBreaking,
      });
      return;
    }

    console.log('Breaking ascesis:', { pactId: currentPact.id, reason });
    setIsBreaking(true);

    try {
      if (!breakAscesis) {
        throw new Error('breakAscesis function not available');
      }
      await breakAscesis(currentPact.id, reason);
      setShowBreakDialog(false);
    } catch (error) {
      console.error('Failed to break ascesis:', error);
    } finally {
      setIsBreaking(false);
    }
  };

  const handleBreakAscesisClick = () => {
    setShowBreakDialog(true);
  };

  const { user } = useAppStore();
  const { offerings, purchasePackage } = useRevenueCat(user?.id);

  if (!allPacts.length) return null;

  return (
    <div className="w-full max-w-lg mx-auto">
      <AdaptivePactDisplay
        pacts={allPacts}
        currentPactIndex={currentPactIndex}
        onPactChange={handlePactIndexChange}
        onBreakAscesis={handleBreakAscesisClick}
        getAscesisPrefix={getAscesisPrefix}
        formatRejection={formatRejection}
      />

      {/* Break Ascesis Dialog */}
      <div className="relative z-40">
        <BreakAscesisDialog
          pact={currentPact}
          isOpen={showBreakDialog}
          onClose={() => setShowBreakDialog(false)}
          onConfirm={handleBreakAscesis}
        />
      </div>
    </div>
  );
};
