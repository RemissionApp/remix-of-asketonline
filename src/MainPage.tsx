
import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { EnergyEffect } from '@/components/EnergyEffect';
import { ActivePactDisplay } from '@/components/ActivePactDisplay';
import { NoPactsView } from '@/components/NoPactsView';
import { PactNavigation } from '@/components/PactNavigation';
import { ActionButtons } from '@/components/ActionButtons';
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const { 
    pacts = [], // Set default empty array if pacts is undefined
    dailyQuote, 
    markDayComplete, 
    syncPactsWithCurrentDate,
    language
  } = useAppStore();
  const [currentPactIndex, setCurrentPactIndex] = useState(0);
  const [showEnergyEffect, setShowEnergyEffect] = useState(false);
  const navigate = useNavigate();
  
  // Sync pacts with current date when component mounts
  useEffect(() => {
    syncPactsWithCurrentDate();
  }, [syncPactsWithCurrentDate]);
  
  // Filter active pacts (safely handling undefined pacts)
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
      
      setTimeout(() => {
        setShowEnergyEffect(false);
      }, 2000);
    }
  };

  // Navigate to create pact page
  const handleCreatePact = () => {
    navigate('/create-pact');
  };
  
  // Function to format the rejection text based on language
  const formatRejection = (rejectionText: string) => {
    // Predefined options with translations
    const predefinedOptions: Record<string, Record<string, string>> = {
      ru: {
        'sugar': 'сахара',
        'phone_after_22': 'телефона после 22:00',
        'cigarettes': 'сигарет',
        'procrastination': 'прокрастинации',
        'social_media': 'социальных сетей',
        'alcohol': 'алкоголя',
        'junk_food': 'фастфуда'
      },
      en: {
        'sugar': 'sugar',
        'phone_after_22': 'phone after 10 PM',
        'cigarettes': 'cigarettes',
        'procrastination': 'procrastination',
        'social_media': 'social media',
        'alcohol': 'alcohol',
        'junk_food': 'junk food'
      },
      es: {
        'sugar': 'azúcar',
        'phone_after_22': 'teléfono después de las 22:00',
        'cigarettes': 'cigarrillos',
        'procrastination': 'procrastinación',
        'social_media': 'redes sociales',
        'alcohol': 'alcohol',
        'junk_food': 'comida rápida'
      }
    };
    
    if (!rejectionText) return '';
    
    // Get translations for current language
    const translations = predefinedOptions[language];
    
    // Check if it's a multiple rejection (comma-separated)
    if (rejectionText.includes(',')) {
      const items = rejectionText.split(',').map(item => item.trim());
      const translatedItems = items.map(item => translations[item] || item);
      return translatedItems.join(', ');
    }
    
    // Single rejection
    return translations[rejectionText] || rejectionText;
  };
  
  // Get the prefix for the ascesis title based on language
  const getAscesisPrefix = () => {
    switch (language) {
      case 'ru':
        return 'Аскеза от';
      case 'es':
        return 'Ascesis de';
      default:
        return 'Ascesis from';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      <TopBar />
      <EnergyEffect show={showEnergyEffect} />
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        {activePacts.length > 0 ? (
          <>
            <PactNavigation 
              currentIndex={currentPactIndex}
              totalPacts={activePacts.length}
              onPrevious={handlePrevPact}
              onNext={handleNextPact}
            />
            
            <ActivePactDisplay 
              pact={currentPact}
              onCompleteDayClick={handleCompleteDayWithEffect}
              getAscesisPrefix={getAscesisPrefix}
              formatRejection={formatRejection}
            />
            
            <QuoteDisplay quote={dailyQuote} className="mt-12" />
            
            <ActionButtons />
          </>
        ) : (
          <NoPactsView onCreatePactClick={handleCreatePact} />
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default MainPage;
