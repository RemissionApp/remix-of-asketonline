
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Pact } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';

export const usePactManager = () => {
  const { 
    pacts = [], 
    markDayComplete,
    syncPactsWithCurrentDate,
    language
  } = useAppStore();
  const [currentPactIndex, setCurrentPactIndex] = useState(0);
  const [showEnergyEffect, setShowEnergyEffect] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();

  // Filter active pacts
  const activePacts = pacts?.filter(p => p.status === 'active') || [];
  
  // Get current pact
  const currentPact = activePacts[currentPactIndex] || null;
  
  // Change handlers for the carousel
  const handlePrevPact = () => {
    if (currentPactIndex > 0) {
      setCurrentPactIndex(currentPactIndex - 1);
    } else {
      setCurrentPactIndex(activePacts.length - 1);
    }
  };
  
  const handleNextPact = () => {
    if (currentPactIndex < activePacts.length - 1) {
      setCurrentPactIndex(currentPactIndex + 1);
    } else {
      setCurrentPactIndex(0);
    }
  };
  
  // Handler for completing a day with visual effect
  const handleCompleteDayWithEffect = () => {
    if (currentPact) {
      markDayComplete(currentPact.id);
      setShowEnergyEffect(true);
      
      // Show success toast
      toast({
        title: language === 'ru' ? 'День отмечен!' : language === 'es' ? '¡Día completado!' : 'Day completed!',
        description: language === 'ru' ? '+10 энергии' : language === 'es' ? '+10 de energía' : '+10 energy',
      });
      
      setTimeout(() => {
        setShowEnergyEffect(false);
      }, 2000);
    }
  };

  // Sync pacts with current date
  useEffect(() => {
    syncPactsWithCurrentDate();
  }, [syncPactsWithCurrentDate]);

  return {
    activePacts,
    currentPactIndex,
    currentPact,
    showEnergyEffect,
    handlePrevPact,
    handleNextPact,
    handleCompleteDayWithEffect
  };
};
