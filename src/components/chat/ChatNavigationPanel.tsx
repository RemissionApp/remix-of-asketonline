
import React from 'react';
import { Home, MessageSquare, Search, Star, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';

interface ChatNavigationPanelProps {
  onNewChat: () => void;
}

export const ChatNavigationPanel: React.FC<ChatNavigationPanelProps> = ({ onNewChat }) => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      <div className="flex justify-center">
        <div className="w-full bg-cosmic-dark/60 backdrop-blur-md border-t border-cosmic-accent/15 px-2">
          <div className="flex justify-around items-center py-2 max-w-3xl mx-auto">
            <button 
              onClick={() => navigate('/main')}
              className="flex flex-col items-center p-1 text-cosmic-secondary hover:text-cosmic-accent transition-colors"
            >
              <Home size={18} />
              <span className="text-xs">{t.main.nav.path || 'Главная'}</span>
            </button>
            
            <button 
              onClick={onNewChat}
              className="flex flex-col items-center p-1 text-cosmic-secondary hover:text-cosmic-accent transition-colors"
            >
              <MessageSquare size={18} />
              <span className="text-xs">Новый диалог</span>
            </button>
            
            <button 
              className="flex flex-col items-center p-1 text-cosmic-secondary hover:text-cosmic-accent transition-colors"
            >
              <Search size={18} />
              <span className="text-xs">Поиск</span>
            </button>
            
            <button 
              onClick={() => navigate('/universe')}
              className="flex flex-col items-center p-1 text-cosmic-secondary hover:text-cosmic-accent transition-colors"
            >
              <Star size={18} />
              <span className="text-xs">Вселенная</span>
            </button>
            
            <button 
              onClick={() => navigate('/profile')}
              className="flex flex-col items-center p-1 text-cosmic-secondary hover:text-cosmic-accent transition-colors"
            >
              <Settings size={18} />
              <span className="text-xs">{t.main.nav.profile || 'Профиль'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
