
import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { EnergyEffect } from '@/components/EnergyEffect';
import { useNavigate } from 'react-router-dom';
import { DeveloperSwitch } from '@/components/DeveloperSwitch';
import { MainContent } from '@/components/MainPageComponents/MainContent';
import { useMainPageUtils } from '@/components/MainPageComponents/mainPageUtils';
import { useToast } from '@/hooks/use-toast';

const MainPage: React.FC = () => {
  const { 
    pacts = [], 
    dailyQuote, 
    markDayComplete, 
    syncPactsWithCurrentDate,
    language,
    setActiveScreen
  } = useAppStore();
  const [currentPactIndex, setCurrentPactIndex] = useState(0);
  const [showEnergyEffect, setShowEnergyEffect] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatRejection, getAscesisPrefix } = useMainPageUtils();
  
  // Sync pacts with current date when component mounts
  useEffect(() => {
    syncPactsWithCurrentDate();
  }, [syncPactsWithCurrentDate]);
  
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
  
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      {/* Use the TopBar component */}
      <TopBar />
      
      {/* Developer Mode Switch */}
      <div className="absolute top-20 right-4 z-20">
        <DeveloperSwitch />
      </div>
      
      {/* Energy effect animation */}
      <EnergyEffect show={showEnergyEffect} />
      
      {/* Main content */}
      <MainContent
        activePacts={activePacts}
        currentPactIndex={currentPactIndex}
        currentPact={currentPact}
        dailyQuote={dailyQuote}
        showEnergyEffect={showEnergyEffect}
        handlePrevPact={handlePrevPact}
        handleNextPact={handleNextPact}
        handleCompleteDayWithEffect={handleCompleteDayWithEffect}
        getAscesisPrefix={getAscesisPrefix}
        formatRejection={formatRejection}
      />
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MainPage;
