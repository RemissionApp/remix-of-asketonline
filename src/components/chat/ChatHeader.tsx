import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
          <Avatar className="h-full w-full">
            <AvatarImage
              src="https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//Avataruniverse.png"
              alt="Вселенная"
              className="object-cover"
            />
            <AvatarFallback className="bg-cosmic-dark text-cosmic-accent">
              ВС
            </AvatarFallback>
          </Avatar>

          <div className="absolute inset-0 bg-gradient-to-b from-cosmic-accent/20 to-transparent"></div>
          <div className="absolute inset-0 rounded-full overflow-hidden z-0">
            <div className="absolute animate-pulse top-0 left-1/2 w-4 h-1 bg-white/20 rounded transform -translate-x-1/2 blur-sm"></div>
            <div className="absolute animate-pulse delay-300 bottom-0 left-1/2 w-4 h-1 bg-white/20 rounded transform -translate-x-1/2 blur-sm"></div>
            <div className="absolute animate-pulse delay-150 left-0 top-1/2 w-1 h-4 bg-white/20 rounded transform -translate-y-1/2 blur-sm"></div>
            <div className="absolute animate-pulse delay-150 right-0 top-1/2 w-1 h-4 bg-white/20 rounded transform -translate-y-1/2 blur-sm"></div>
          </div>
        </div>
        <div>
          <h2 className="font-serif">
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
