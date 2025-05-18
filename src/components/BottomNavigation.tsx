
import React from 'react';
import { Home, Sparkles, MessageSquare, UserRound, Stars, Calculator } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate, useLocation } from 'react-router-dom';

// Define a mapping between route paths and ActiveScreen values
const routeToScreenMapping: Record<string, 'welcome' | 'language' | 'onboarding' | 'main' | 'create-pact' | 'universe' | 'profile' | 'comparison' | 'meditation' | 'login' | 'signup' | 'universe-chat' | 'full-horoscope' | 'numerology'> = {
  '/main': 'main',
  '/create-pact': 'create-pact',
  '/universe': 'universe',
  '/universe-chat': 'universe-chat',
  '/profile': 'profile',
  '/comparison': 'comparison',
  '/meditation': 'meditation',
  '/full-horoscope': 'full-horoscope',
  '/numerology': 'numerology'
};

export const BottomNavigation: React.FC = () => {
  const { setActiveScreen, activeScreen, userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Helper to determine which screen is active based on URL
  const isActive = (path: string) => location.pathname === path;
  
  // Updated to match the ActiveScreen type
  const handleNavigation = (screen: 'welcome' | 'language' | 'onboarding' | 'main' | 'create-pact' | 'universe' | 'profile' | 'comparison' | 'meditation' | 'login' | 'signup' | 'universe-chat' | 'full-horoscope' | 'numerology', path: string) => {
    console.log(`Navigating to ${screen} at path ${path}`);
    // Update the active screen in the store
    setActiveScreen(screen);
    // Navigate to the corresponding route
    navigate(path);
  };
  
  // Check if user has PRO subscription
  const isPro = userProfile?.isPro || false;
  
  // Get numerology text based on language
  const numerologyText = language === 'ru' ? 'Нумерология' : language === 'es' ? 'Numerología' : 'Numerology';
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      <div className="flex justify-center">
        <div className="w-full bg-cosmic-dark/40 backdrop-blur-md border-t border-cosmic-accent/15 px-2">
          <div className="flex justify-around items-center py-1 max-w-3xl mx-auto">
            <button 
              className={`flex flex-col items-center p-1 ${isActive('/main') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
              onClick={() => handleNavigation('main', '/main')}
            >
              <Home size={18} />
              <span className="text-xs">{t.main.nav.path || 'Path'}</span>
            </button>
            
            <button 
              className={`flex flex-col items-center p-1 ${isActive('/create-pact') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
              onClick={() => handleNavigation('create-pact', '/create-pact')}
            >
              <Sparkles size={18} />
              <span className="text-xs">{t.main.nav.ascesis || 'Ascesis'}</span>
            </button>
            
            {/* Show different Universe/Chat buttons based on PRO status */}
            {isPro ? (
              <>
                {/* Universe Question button for PRO users */}
                <button 
                  className={`flex flex-col items-center p-1 ${isActive('/universe') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
                  onClick={() => handleNavigation('universe', '/universe')}
                >
                  <MessageSquare size={18} />
                  <span className="text-xs">{t.main.nav.universe || 'Universe'}</span>
                </button>
                
                {/* Universe Chat button for PRO users */}
                <button 
                  className={`flex flex-col items-center p-1 ${isActive('/universe-chat') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
                  onClick={() => handleNavigation('universe-chat', '/universe-chat')}
                >
                  <MessageSquare size={18} />
                  <span className="text-xs">{t.main.nav.universeChat || 'Chat'}</span>
                </button>
                
                {/* Numerology button for PRO users - HIGHLIGHTED */}
                <button 
                  className={`flex flex-col items-center p-1 ${isActive('/numerology') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
                  onClick={() => handleNavigation('numerology', '/numerology')}
                >
                  <Calculator size={18} className={isActive('/numerology') ? '' : 'animate-bounce'} />
                  <span className="text-xs">{numerologyText}</span>
                </button>
              </>
            ) : (
              <>
                {/* Universe Question button for non-PRO users */}
                <button 
                  className={`flex flex-col items-center p-1 ${isActive('/universe') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
                  onClick={() => handleNavigation('universe', '/universe')}
                >
                  <MessageSquare size={18} />
                  <span className="text-xs">{t.main.nav.universe || 'Universe'}</span>
                </button>
                
                {/* Full Horoscope preview for non-PRO users */}
                <button 
                  className={`flex flex-col items-center p-1 ${isActive('/full-horoscope') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
                  onClick={() => handleNavigation('full-horoscope', '/full-horoscope')}
                >
                  <Stars size={18} />
                  <span className="text-xs">Гороскоп</span>
                </button>
                
                {/* Numerology button preview for non-PRO users - HIGHLIGHTED */}
                <button 
                  className={`flex flex-col items-center p-1 ${isActive('/numerology') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
                  onClick={() => handleNavigation('numerology', '/numerology')}
                >
                  <Calculator size={18} className={isActive('/numerology') ? '' : 'animate-bounce'} />
                  <span className="text-xs">{numerologyText}</span>
                </button>
              </>
            )}
            
            <button 
              className={`flex flex-col items-center p-1 ${isActive('/profile') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
              onClick={() => handleNavigation('profile', '/profile')}
            >
              <UserRound size={18} />
              <span className="text-xs">{t.main.nav.profile || 'Profile'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
