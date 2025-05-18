
import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { EnergyEffect } from '@/components/EnergyEffect';
import { useNavigate } from 'react-router-dom';
import { MainContent } from '@/components/MainPageComponents/MainContent';
import { useMainPageUtils } from '@/components/MainPageComponents/mainPageUtils';
import { useToast } from '@/hooks/use-toast';
import { CountdownTimer } from '@/components/CountdownTimer';
import { NumerologyPreview } from '@/components/numerology/NumerologyPreview';
import { DeveloperSwitch } from '@/components/DeveloperSwitch';

const MainPage: React.FC = () => {
  const { 
    pacts = [], 
    syncPactsWithCurrentDate,
    language,
    user,
    loadUserProfile,
    userProfile,
    setActiveScreen,
    breakAscesis
  } = useAppStore();
  const [currentPactIndex, setCurrentPactIndex] = useState(0);
  const [showEnergyEffect, setShowEnergyEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatRejection, getAscesisPrefix } = useMainPageUtils();
  
  // Check if user is logged in and load user profile if needed
  useEffect(() => {
    const initializeUserData = async () => {
      setIsLoading(true);
      
      // If user is logged in but we don't have profile data yet, load it
      if (user && !userProfile) {
        await loadUserProfile();
      }
      
      // Then sync pacts with current date
      syncPactsWithCurrentDate();
      setIsLoading(false);
    };
    
    initializeUserData();
    
    // Log successful rendering for debugging
    console.log("MainPage initialized with components");
  }, [user, userProfile, loadUserProfile, syncPactsWithCurrentDate]);
  
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
  
  // Handler for breaking ascesis
  const handleBreakAscesis = () => {
    if (currentPact) {
      const confirmMessage = language === 'ru' 
        ? "Вы уверены, что хотите прервать аскезу? Вы потеряете 100 энергетических очков."
        : language === 'es'
          ? "¿Estás seguro de que quieres romper la ascesis? Perderás 100 puntos de energía."
          : "Are you sure you want to break this ascesis? You will lose 100 energy points.";
          
      if (window.confirm(confirmMessage)) {
        breakAscesis(currentPact.id);
        
        // If this was the only pact, reset the index
        if (activePacts.length === 1) {
          setCurrentPactIndex(0);
        }
        // If we're at the last pact and it's being removed, go back one
        else if (currentPactIndex === activePacts.length - 1) {
          setCurrentPactIndex(currentPactIndex - 1);
        }
      }
    }
  };
  
  // Empty string for dailyQuote since we're using DailyAdviceDisplay component
  const dailyQuote = '';
  
  // Log visibility information
  console.log("MainPage rendering with components:", {
    hasUserProfile: !!userProfile,
    hasBirthDate: !!userProfile?.birthDate,
    isPro: userProfile?.isPro,
    activePacts: activePacts.length,
    isLoading
  });
  
  // Check if the user has a birth date to determine whether to show numerology preview
  const showNumerologyPreview = userProfile?.birthDate !== undefined && userProfile?.birthDate !== null;
  
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      {/* Background StarField animation */}
      <StarField starCount={100} />
      
      {/* TopBar component at the top of the page */}
      <TopBar />
      
      {/* Developer mode switch */}
      <div className="fixed top-16 right-4 z-30">
        <DeveloperSwitch />
      </div>
      
      {/* Countdown timer when there's an active pact - fixed at top */}
      {activePacts.length > 0 && 
        <div className="sticky top-16 z-20 w-full bg-cosmic-dark/70 backdrop-blur-md shadow-md">
          <CountdownTimer pactId={currentPact?.id} />
        </div>
      }
      
      {/* Energy effect animation */}
      <EnergyEffect show={showEnergyEffect} />
      
      {/* Special Numerology Preview - Displayed with high visibility */}
      {showNumerologyPreview && (
        <div className="px-4 pt-4 mt-20 max-w-md mx-auto w-full">
          <NumerologyPreview />
        </div>
      )}
      
      {/* Main content with all components */}
      <MainContent
        activePacts={activePacts}
        currentPactIndex={currentPactIndex}
        currentPact={currentPact}
        dailyQuote={dailyQuote}
        isLoading={isLoading}
        showEnergyEffect={showEnergyEffect}
        handlePrevPact={handlePrevPact}
        handleNextPact={handleNextPact}
        handleBreakAscesis={handleBreakAscesis}
        getAscesisPrefix={getAscesisPrefix}
        formatRejection={formatRejection}
      />
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MainPage;
