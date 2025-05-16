
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';

interface ChatHeaderProps {
  title?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  
  const handleBack = () => {
    navigate('/main');
  };
  
  return (
    <div className="bg-cosmic-dark text-white py-2 px-4 flex items-center z-20 fixed top-0 left-0 right-0">
      <Button 
        variant="ghost" 
        className="text-cosmic-secondary mr-2 p-2" 
        onClick={handleBack}
      >
        <ChevronLeft size={24} />
      </Button>
      
      <div className="flex items-center flex-1">
        <div className="w-10 h-10 rounded-full overflow-hidden relative mr-3 border-2 border-cosmic-gold">
          <img 
            src="https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//Avataruniverse.png" 
            alt="Вселенная"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cosmic-accent/20 to-transparent"></div>
        </div>
        <div>
          <h2 className="text-cosmic-accent font-serif">
            {title || t.universe?.chatTitle || 'Вселенная'}
          </h2>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <p className="text-xs text-cosmic-secondary">онлайн</p>
          </div>
        </div>
      </div>
    </div>
  );
};
