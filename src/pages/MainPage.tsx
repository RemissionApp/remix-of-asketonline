
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
import { DetailedHoroscopeDisplay } from '@/components/DetailedHoroscopeDisplay';

const MainPage: React.FC = () => {
  const { 
    pacts = [], 
    dailyQuote, 
    markDayComplete, 
    syncPactsWithCurrentDate,
    language,
    user,
    loadUserProfile,
    userProfile,
    setActiveScreen
  } = useAppStore();
  const [currentPactIndex, setCurrentPactIndex] = useState(0);
  const [showEnergyEffect, setShowEnergyEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showHoroscope, setShowHoroscope] = useState(false);
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

  // Toggle horoscope display
  const toggleHoroscope = () => {
    setShowHoroscope(!showHoroscope);
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

      {/* Toggle horoscope button */}
      <div className="absolute top-20 left-4 z-20">
        <button 
          onClick={toggleHoroscope} 
          className="bg-cosmic-accent/20 hover:bg-cosmic-accent/30 text-cosmic-gold px-3 py-1 rounded-full text-xs font-medium"
        >
          {showHoroscope ? (
            language === 'ru' ? 'Скрыть гороскоп' : 
            language === 'es' ? 'Ocultar horóscopo' : 
            'Hide horoscope'
          ) : (
            language === 'ru' ? 'Показать гороскоп' : 
            language === 'es' ? 'Mostrar horóscopo' : 
            'Show horoscope'
          )}
        </button>
      </div>
      
      {/* Energy effect animation */}
      <EnergyEffect show={showEnergyEffect} />
      
      {/* Show either the horoscope or the main content */}
      {showHoroscope ? (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 mt-16 overflow-auto">
          <DetailedHoroscopeDisplay className="max-w-2xl mx-auto" />
        </div>
      ) : (
        /* Main content */
        <MainContent
          activePacts={activePacts}
          currentPactIndex={currentPactIndex}
          currentPact={currentPact}
          dailyQuote={dailyQuote}
          isLoading={isLoading}
          showEnergyEffect={showEnergyEffect}
          handlePrevPact={handlePrevPact}
          handleNextPact={handleNextPact}
          handleCompleteDayWithEffect={handleCompleteDayWithEffect}
          getAscesisPrefix={getAscesisPrefix}
          formatRejection={formatRejection}
        />
      )}
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MainPage;
