import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start mb-4">
      <div className="flex-shrink-0 mr-3">
        <div className="w-10 h-10 rounded-full overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-cosmic-accent/60 to-cosmic-accent/20 shadow-lg shadow-cosmic-accent/10 border-2 border-cosmic-gold">
          <Avatar className="h-full w-full">
            <AvatarImage
              src="https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//Avataruniverse.png"
              alt="Вселенная"
              className="object-cover z-10"
            />
            <AvatarFallback className="bg-cosmic-dark text-cosmic-accent">
              ВС
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full overflow-hidden z-0">
            <div className="absolute animate-pulse top-0 left-1/2 w-5 h-1 bg-white/30 rounded transform -translate-x-1/2 blur-sm"></div>
            <div className="absolute animate-pulse delay-300 bottom-0 left-1/2 w-5 h-1 bg-white/30 rounded transform -translate-x-1/2 blur-sm"></div>
            <div className="absolute animate-pulse delay-150 left-0 top-1/2 w-1 h-5 bg-white/30 rounded transform -translate-y-1/2 blur-sm"></div>
            <div className="absolute animate-pulse delay-150 right-0 top-1/2 w-1 h-5 bg-white/30 rounded transform -translate-y-1/2 blur-sm"></div>
          </div>
        </div>
      </div>

      <div className="bg-cosmic-dark/80 border border-cosmic-accent/20 text-cosmic-secondary rounded-2xl rounded-tl-none p-4 max-w-xs md:max-w-md backdrop-blur-md relative">
        <div className="absolute inset-0 overflow-hidden rounded-2xl rounded-tl-none pointer-events-none">
          <div className="absolute top-0 right-0 w-20 h-20 bg-cosmic-accent/10 rounded-full filter blur-xl transform -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-cosmic-accent/5 rounded-full filter blur-xl transform translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmic-accent/30 to-transparent"></div>
        </div>
        <div className="flex items-center space-x-2 relative z-10">
          <span className="w-2 h-2 bg-cosmic-accent rounded-full animate-bounce"></span>
          <span
            className="w-2 h-2 bg-cosmic-accent rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></span>
          <span
            className="w-2 h-2 bg-cosmic-accent rounded-full animate-bounce"
            style={{ animationDelay: '0.4s' }}
          ></span>
        </div>
      </div>
    </div>
  );
};
