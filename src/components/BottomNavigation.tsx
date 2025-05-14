
import React from 'react';
import { Home, Sparkles, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { UserAvatar } from './UserAvatar';

export const BottomNavigation: React.FC = () => {
  const { setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  
  return (
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
          <div className="relative">
            <UserAvatar size="sm" showRankBorder={false} />
          </div>
          <span className="text-xs mt-1">{t.main.nav.profile}</span>
        </button>
      </div>
    </div>
  );
};
