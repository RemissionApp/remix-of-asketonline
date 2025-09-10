import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface CompletedPact {
  id: string;
  title: string;
  duration: number;
  reward?: string;
  energyEarned: number;
  totalDays: number;
}

export function usePactCompletion() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCompletedPact, setCurrentCompletedPact] = useState<CompletedPact | null>(null);
  const { pacts, userProfile } = useAppStore();

  // Track shown completions to avoid duplicates
  const getShownCompletions = useCallback(() => {
    const stored = localStorage.getItem('shown_pact_completions');
    return stored ? JSON.parse(stored) : [];
  }, []);

  const markCompletionAsShown = useCallback((pactId: string) => {
    const shown = getShownCompletions();
    const updated = [...shown, pactId];
    localStorage.setItem('shown_pact_completions', JSON.stringify(updated));
  }, [getShownCompletions]);

  const checkForCompletedPacts = useCallback(() => {
    const completedPacts = pacts.filter(pact => pact.status === 'completed');
    const shownCompletions = getShownCompletions();
    
    // Find new completions that haven't been shown yet
    const newCompletions = completedPacts.filter(
      pact => !shownCompletions.includes(pact.id)
    );

    if (newCompletions.length > 0) {
      const pact = newCompletions[0]; // Show first new completion
      
      setCurrentCompletedPact({
        id: pact.id,
        title: pact.title,
        duration: pact.duration,
        reward: pact.reward,
        energyEarned: pact.duration * 10, // 10 energy per day
        totalDays: userProfile.totalDays,
      });
      
      setDialogOpen(true);
      markCompletionAsShown(pact.id);
      
      // Haptic feedback for celebration
      console.log('Pact completion detected');
    }
  }, [pacts, userProfile.totalDays, getShownCompletions, markCompletionAsShown]);

  // Check for completed pacts when pacts change
  useEffect(() => {
    if (pacts.length > 0) {
      checkForCompletedPacts();
    }
  }, [pacts, checkForCompletedPacts]);

  const handleDialogClose = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setCurrentCompletedPact(null);
      
      // Check if there are more completions to show
      setTimeout(() => {
        checkForCompletedPacts();
      }, 500);
    }
  }, [checkForCompletedPacts]);

  return {
    dialogOpen,
    currentCompletedPact,
    handleDialogClose,
  };
}