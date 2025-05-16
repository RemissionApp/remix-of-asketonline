
import React from 'react';
import { Home, Sparkles, MessageSquare, UserRound } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate, useLocation } from 'react-router-dom';

// Define a mapping between route paths and ActiveScreen values
const routeToScreenMapping: Record<string, 'welcome' | 'language' | 'onboarding' | 'main' | 'create-pact' | 'universe' | 'profile' | 'comparison' | 'meditation' | 'login' | 'signup'> = {
  '/main': 'main',
  '/create-pact': 'create-pact',
  '/universe': 'universe',
  '/profile': 'profile',
  '/comparison': 'comparison',
  '/meditation': 'meditation'
};

export const BottomNavigation: React.FC = () => {
  const { setActiveScreen, activeScreen } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Helper to determine which screen is active based on URL
  const isActive = (path: string) => location.pathname === path;
  
  const handleNavigation = (screen: 'welcome' | 'language' | 'onboarding' | 'main' | 'create-pact' | 'universe' | 'profile' | 'comparison' | 'meditation' | 'login' | 'signup', path: string) => {
    // Update the active screen in the store
    setActiveScreen(screen);
    // Navigate to the corresponding route
    navigate(path);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      <div className="flex justify-center">
        <div className="max-w-xs w-full mx-auto bg-cosmic-dark/60 backdrop-blur-md border-t border-cosmic-accent/15 rounded-t-xl px-2 py-2">
          <div className="flex justify-around items-center">
            <button 
              className={`flex flex-col items-center p-1.5 ${isActive('/main') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
              onClick={() => handleNavigation('main', '/main')}
            >
              <Home size={20} />
              <span className="text-xs mt-0.5">{t.main.path || 'Путь'}</span>
            </button>
            
            <button 
              className={`flex flex-col items-center p-1.5 ${isActive('/create-pact') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
              onClick={() => handleNavigation('create-pact', '/create-pact')}
            >
              <Sparkles size={20} />
              <span className="text-xs mt-0.5">{t.main.ascesis || 'Аскеза'}</span>
            </button>
            
            <button 
              className={`flex flex-col items-center p-1.5 ${isActive('/universe') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
              onClick={() => handleNavigation('universe', '/universe')}
            >
              <MessageSquare size={20} />
              <span className="text-xs mt-0.5">{t.universe?.title || t.main.universe || 'Вселенная'}</span>
            </button>
            
            <button 
              className={`flex flex-col items-center p-1.5 ${isActive('/profile') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
              onClick={() => handleNavigation('profile', '/profile')}
            >
              <UserRound size={20} />
              <span className="text-xs mt-0.5">{t.profile?.title || t.main.profile || 'Профиль'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
