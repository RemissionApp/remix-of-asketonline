
import React from 'react';
import { StarField } from '@/components/StarField';
import { EnergyCircle } from '@/components/EnergyCircle';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { CosmicButton } from '@/components/CosmicButton';
import { PactCard } from '@/components/PactCard';
import { useAppStore } from '@/store/useAppStore';
import { Home, Sparkles, MessageSquare, User } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const MainPage: React.FC = () => {
  const { 
    pacts, 
    dailyQuote, 
    markDayComplete, 
    setActiveScreen 
  } = useAppStore();
  const { t } = useTranslations();
  
  const activePact = pacts.find(p => p.status === 'active');
  
  const activeDaysCompleted = activePact
    ? activePact.days.filter(day => day.completed).length
    : 0;
    
  const progress = activePact
    ? Math.round((activeDaysCompleted / activePact.duration) * 100)
    : 0;
  
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        {activePact ? (
          <>
            <h1 className="text-xl font-serif text-white mb-4">
              {activePact.title}
            </h1>
            
            <EnergyCircle progress={progress} size="lg">
              <div className="text-center p-4">
                <p className="text-4xl font-bold font-serif text-white">
                  {activeDaysCompleted}/{activePact.duration}
                </p>
                <p className="text-lg text-cosmic-accent mt-2">{t.main.days}</p>
              </div>
            </EnergyCircle>
            
            <CosmicButton 
              className="mt-8" 
              onClick={() => markDayComplete(activePact.id)}
            >
              {t.main.todayCompleted}
            </CosmicButton>
            
            <QuoteDisplay quote={dailyQuote} className="mt-12" />
            
            <CosmicButton 
              variant="outline" 
              className="mt-6" 
              onClick={() => setActiveScreen('universe')}
            >
              {t.main.askUniverse}
            </CosmicButton>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-serif text-white mb-4">
              {t.main.noPacts}
            </h1>
            
            <CosmicButton 
              onClick={() => setActiveScreen('create-pact')}
              className="mt-4"
            >
              {t.main.createPact}
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
            <span className="text-xs mt-1">{t.main.nav.path}</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('create-pact')}
          >
            <Sparkles size={24} />
            <span className="text-xs mt-1">{t.main.nav.ascesis}</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('universe')}
          >
            <MessageSquare size={24} />
            <span className="text-xs mt-1">{t.main.nav.universe}</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('profile')}
          >
            <User size={24} />
            <span className="text-xs mt-1">{t.main.nav.profile}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
