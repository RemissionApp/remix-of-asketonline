
import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { EnergyCircle } from '@/components/EnergyCircle';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { Home, Sparkles, MessageSquare, User, ChevronLeft, ChevronRight, CircleDot, Headphones } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RankBadge } from '@/components/RankBadge';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/UserAvatar';
import { Link } from 'react-router-dom';

const MainPage: React.FC = () => {
  const { 
    pacts = [], // Provide a default empty array if pacts is undefined
    dailyQuote, 
    markDayComplete, 
    setActiveScreen,
    syncPactsWithCurrentDate,
    language,
    userProfile
  } = useAppStore();
  const { t } = useTranslations();
  const [currentPactIndex, setCurrentPactIndex] = useState(0);
  const [showEnergyEffect, setShowEnergyEffect] = useState(false);
  
  // Sync pacts with current date when component mounts
  useEffect(() => {
    if (typeof syncPactsWithCurrentDate === 'function') {
      syncPactsWithCurrentDate();
    }
  }, [syncPactsWithCurrentDate]);
  
  // Filter active pacts, ensure pacts is defined before filtering
  const activePacts = pacts && pacts.filter ? pacts.filter(p => p.status === 'active') : [];
  
  // Get current pact, ensuring activePacts has elements
  const currentPact = activePacts.length > 0 ? activePacts[currentPactIndex] : null;
  
  const activeDaysCompleted = currentPact
    ? currentPact.days.filter(day => day.completed).length
    : 0;
    
  const progress = currentPact
    ? Math.round((activeDaysCompleted / currentPact.duration) * 100)
    : 0;
  
  // Function to format the rejection text based on language
  const formatRejection = (rejectionText: string) => {
    if (!rejectionText) return '';
    
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
    
    // Get translations for current language
    const translations = predefinedOptions[language] || {};
    
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
  
  // Complete day handler with visual effect
  const handleCompleteDayWithEffect = () => {
    if (currentPact) {
      markDayComplete(currentPact.id);
      setShowEnergyEffect(true);
      
      setTimeout(() => {
        setShowEnergyEffect(false);
      }, 2000);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      {/* Energy points display */}
      <div className="absolute top-4 right-4 z-20 flex items-center px-3 py-1.5 bg-cosmic-dark/70 backdrop-blur-sm rounded-full border border-cosmic-gold/20">
        <CircleDot size={16} className="text-cosmic-gold mr-1.5" />
        <span className="text-cosmic-gold font-medium">{userProfile?.energyPoints || 0}</span>
      </div>
      
      {/* Rank badge */}
      <div className="absolute top-4 left-4 z-20">
        <RankBadge size="sm" />
      </div>
      
      {/* Energy effect animation */}
      {showEnergyEffect && (
        <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="animate-pulse-slow">
            <div className="text-cosmic-gold text-3xl font-bold animate-bounce">
              +10
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        {activePacts.length > 0 ? (
          <>
            {/* Pact navigation controls */}
            {activePacts.length > 1 && (
              <div className="mb-4 flex items-center justify-center">
                <button 
                  onClick={handlePrevPact} 
                  className="text-cosmic-accent p-1 mr-2"
                  aria-label="Previous pact"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex space-x-1">
                  {activePacts.map((_, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        index === currentPactIndex 
                          ? "bg-cosmic-accent" 
                          : "bg-cosmic-accent/30"
                      )}
                    />
                  ))}
                </div>
                <button 
                  onClick={handleNextPact} 
                  className="text-cosmic-accent p-1 ml-2"
                  aria-label="Next pact"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
            
            <h1 className="text-xl text-center uppercase font-serif text-white mb-1">
              {`${getAscesisPrefix()} ${formatRejection(currentPact?.title || '')}`}
            </h1>
            
            <EnergyCircle progress={progress} size="lg">
              <div className="text-center p-4">
                <p className="text-4xl font-bold font-serif text-white">
                  {activeDaysCompleted}/{currentPact?.duration || 0}
                </p>
                <p className="text-lg text-cosmic-accent mt-2">{t?.main?.days || "days"}</p>
              </div>
            </EnergyCircle>
            
            <CosmicButton 
              className="mt-8" 
              onClick={handleCompleteDayWithEffect}
            >
              {t?.main?.todayCompleted || "Today Completed"}
            </CosmicButton>
            
            <QuoteDisplay quote={dailyQuote || ""} className="mt-12" />
            
            {/* Add Meditation Button */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <CosmicButton 
                variant="outline" 
                onClick={() => setActiveScreen('universe')}
              >
                {t?.main?.askUniverse || "Ask the Universe"}
              </CosmicButton>
              
              <CosmicButton 
                variant="outline"
                onClick={() => setActiveScreen('meditation')}
              >
                <Headphones className="mr-2" size={18} />
                {t?.meditation?.pageTitle || "Meditations"}
              </CosmicButton>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-serif text-white mb-4">
              {t?.main?.noPacts || "No active ascesis"}
            </h1>
            
            <CosmicButton 
              onClick={() => setActiveScreen('create-pact')}
              className="mt-4"
            >
              {t?.main?.createPact || "Create Ascesis"}
            </CosmicButton>
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-cosmic-dark/80 backdrop-blur-md border-t border-cosmic-accent/20 z-20">
        <div className="flex justify-around items-center p-3 max-w-lg mx-auto">
          <button 
            className="flex flex-col items-center p-2 text-cosmic-accent"
            onClick={() => setActiveScreen('main')}
          >
            <Home size={24} />
            <span className="text-xs mt-1">{t?.main?.nav?.path || "Path"}</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('create-pact')}
          >
            <Sparkles size={24} />
            <span className="text-xs mt-1">{t?.main?.nav?.ascesis || "Ascesis"}</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('universe')}
          >
            <MessageSquare size={24} />
            <span className="text-xs mt-1">{t?.main?.nav?.universe || "Universe"}</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('profile')}
          >
            <div className="relative">
              <UserAvatar size="sm" showRankBorder={false} />
            </div>
            <span className="text-xs mt-1">{t?.main?.nav?.profile || "Profile"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
