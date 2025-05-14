import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { EnergyCircle } from '@/components/EnergyCircle';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { CosmicButton } from '@/components/CosmicButton';
import { PactCard } from '@/components/PactCard';
import { useAppStore } from '@/store/useAppStore';
import { CircleDot, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { BottomNavigation } from '@/components/BottomNavigation';
import { NoPactsView } from '@/components/NoPactsView';
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const { 
    pacts = [], // Set default empty array if pacts is undefined
    dailyQuote, 
    markDayComplete, 
    setActiveScreen,
    syncPactsWithCurrentDate,
    language,
    userProfile = {} // Default to empty object if userProfile is undefined
  } = useAppStore();
  const { t } = useTranslations();
  const { toast } = useToast();
  const [currentPactIndex, setCurrentPactIndex] = useState(0);
  const [showEnergyEffect, setShowEnergyEffect] = useState(false);
  const navigate = useNavigate();
  
  // Ensure userProfile.energyPoints exists, default to 0 if not
  const energyPoints = userProfile?.energyPoints || 0;
  
  // Sync pacts with current date when component mounts
  useEffect(() => {
    syncPactsWithCurrentDate();
  }, [syncPactsWithCurrentDate]);
  
  // Filter active pacts, ensuring pacts is an array
  const activePacts = (pacts || []).filter(p => p?.status === 'active') || [];
  
  // Get current pact with safety check
  const currentPact = activePacts[currentPactIndex] || null;
  
  // Safely get completed days count
  const activeDaysCompleted = currentPact && currentPact.days && Array.isArray(currentPact.days)
    ? currentPact.days.filter(day => day?.completed).length
    : 0;
    
  // Calculate progress safely
  const progress = currentPact
    ? Math.round((activeDaysCompleted / (currentPact.duration || 1)) * 100)
    : 0;
  
  // Function to format the rejection text based on language
  const formatRejection = (rejectionText: string = '') => {
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
  
  // Navigate to create pact page
  const handleCreatePact = () => {
    setActiveScreen('create-pact');
    navigate('/create-pact');
  };
  
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      {/* Energy points display */}
      <div className="absolute top-4 right-4 z-20 flex items-center px-3 py-1.5 bg-cosmic-dark/70 backdrop-blur-sm rounded-full border border-cosmic-gold/20">
        <CircleDot size={16} className="text-cosmic-gold mr-1.5" />
        <span className="text-cosmic-gold font-medium">{energyPoints}</span>
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
            
            {currentPact && (
              <>
                <h1 className="text-xl text-center uppercase font-serif text-white mb-1">
                  {`${getAscesisPrefix()} ${formatRejection(currentPact?.title || '')}`}
                </h1>
                
                <EnergyCircle progress={progress} size="lg">
                  <div className="text-center p-4">
                    <p className="text-4xl font-bold font-serif text-white">
                      {activeDaysCompleted}/{currentPact?.duration || 0}
                    </p>
                    <p className="text-lg text-cosmic-accent mt-2">{t.main.days}</p>
                  </div>
                </EnergyCircle>
                
                <CosmicButton 
                  className="mt-8" 
                  onClick={handleCompleteDayWithEffect}
                >
                  {t.main.todayCompleted}
                </CosmicButton>
              </>
            )}
            
            <QuoteDisplay quote={dailyQuote} className="mt-12" />
            
            {/* Add Meditation Button */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <CosmicButton 
                variant="outline" 
                onClick={() => {
                  setActiveScreen('universe');
                  navigate('/universe');
                }}
              >
                {t.main.askUniverse}
              </CosmicButton>
              
              <CosmicButton 
                variant="outline"
                onClick={() => {
                  setActiveScreen('meditation');
                  navigate('/meditation');
                }}
              >
                <Headphones className="mr-2" size={18} />
                {language === 'ru' ? 'Медитации' : 
                 language === 'es' ? 'Meditaciones' : 'Meditations'}
              </CosmicButton>
            </div>
          </>
        ) : (
          <NoPactsView />
        )}
      </div>
      
      {/* Use the BottomNavigation component instead of inline navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MainPage;
