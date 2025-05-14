
import React from 'react';
import { Home, Sparkles, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { UserAvatar } from './UserAvatar';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNavigation: React.FC = () => {
  const { setActiveScreen, activeScreen } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Helper to determine which screen is active based on URL
  const isActive = (path: string) => location.pathname === path;
  
  const handleNavigation = (screen: string, path: string) => {
    // Update the active screen in the store
    setActiveScreen(screen);
    // Navigate to the corresponding route
    navigate(path);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-cosmic-dark/80 backdrop-blur-md border-t border-cosmic-accent/20 z-20">
      <div className="flex justify-around items-center p-3 max-w-lg mx-auto">
        <button 
          className={`flex flex-col items-center p-2 ${isActive('/main') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
          onClick={() => handleNavigation('main', '/main')}
        >
          <Home size={24} />
          <span className="text-xs mt-1">{t.main.nav.path}</span>
        </button>
        
        <button 
          className={`flex flex-col items-center p-2 ${isActive('/create-pact') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
          onClick={() => handleNavigation('create-pact', '/create-pact')}
        >
          <Sparkles size={24} />
          <span className="text-xs mt-1">{t.main.nav.ascesis}</span>
        </button>
        
        <button 
          className={`flex flex-col items-center p-2 ${isActive('/universe') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
          onClick={() => handleNavigation('universe', '/universe')}
        >
          <MessageSquare size={24} />
          <span className="text-xs mt-1">{t.main.nav.universe}</span>
        </button>
        
        <button 
          className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-cosmic-accent' : 'text-cosmic-secondary'}`}
          onClick={() => handleNavigation('profile', '/profile')}
        >
          <div className="relative">
            <UserAvatar size="sm" showRankBorder={false} />
          </div>
          <span className="text-xs mt-1">{t.main.nav.profile}</span>
        </button>
      </div>
    </div>
  );
};
