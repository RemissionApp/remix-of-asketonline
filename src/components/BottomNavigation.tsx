
import React from 'react';
import { Home, Sparkles, MessageSquare, UserRound, Stars } from 'lucide-react';
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
    // Update the active screen in the store
    setActiveScreen(screen);
    // Navigate to the corresponding route
    navigate(path);
  };
  
  // Check if user has PRO subscription
  const isPro = userProfile?.isPro || false;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      <div className="flex justify-center">
        <div className="w-full bg-cosmic-dark/40 backdrop-blur-md border-t border-cosmic-accent/15 px-2">
          <div className="flex justify-around items-center py-1 max-w-3xl mx-auto">
            {/* Path button - Visible for both PRO and free users */}
            <button 
              className={`flex flex-col items-center p-1 ${isActive('/main') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
              onClick={() => handleNavigation('main', '/main')}
            >
              <Home size={18} />
              <span className="text-xs">{t.main.nav.path || 'Path'}</span>
            </button>
            
            {/* Ascesis button - Visible for both PRO and free users */}
            <button 
              className={`flex flex-col items-center p-1 ${isActive('/create-pact') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
              onClick={() => handleNavigation('create-pact', '/create-pact')}
            >
              <Sparkles size={18} />
              <span className="text-xs">{t.main.nav.ascesis || 'Ascesis'}</span>
            </button>
            
            {/* Different navigation options based on PRO status */}
            {isPro ? (
              <>
                {/* Chat button - Only visible for PRO users */}
                <button 
                  className={`flex flex-col items-center p-1 ${isActive('/universe-chat') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
                  onClick={() => handleNavigation('universe-chat', '/universe-chat')}
                >
                  <MessageSquare size={18} />
                  <span className="text-xs">{t.main.nav.universeChat || 'Chat'}</span>
                </button>
                
                {/* Full Horoscope button - Only visible for PRO users */}
                <button 
                  className={`flex flex-col items-center p-1 ${isActive('/full-horoscope') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
                  onClick={() => handleNavigation('full-horoscope', '/full-horoscope')}
                >
                  <Stars size={18} />
                  <span className="text-xs">{language === 'ru' ? 'Гороскоп' : language === 'es' ? 'Horóscopo' : 'Horoscope'}</span>
                </button>
              </>
            ) : (
              <>
                {/* Universe question button - Only visible for free users */}
                <button 
                  className={`flex flex-col items-center p-1 ${isActive('/universe') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
                  onClick={() => handleNavigation('universe', '/universe')}
                >
                  <MessageSquare size={18} />
                  <span className="text-xs">{t.main.nav.universe || 'Universe'}</span>
                </button>
              </>
            )}
            
            {/* Profile button - Visible for both PRO and free users */}
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
