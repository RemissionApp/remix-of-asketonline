
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyChatStateProps {
  onNewChat?: () => void;
}

export const EmptyChatState: React.FC<EmptyChatStateProps> = ({ onNewChat }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 mt-20 mb-20">
      <div className="w-16 h-16 rounded-full bg-cosmic-dark/60 border border-cosmic-accent/30 flex items-center justify-center mb-4">
        <MessageCircle className="h-8 w-8 text-cosmic-accent/80" />
      </div>
      <h3 className="text-xl font-serif text-cosmic-accent mb-2">Начните новый диалог</h3>
      <p className="text-center text-cosmic-secondary mb-6 max-w-md">
        Задайте вопрос Вселенной и получите ответ, основанный на космических энергиях и мудрости звезд
      </p>
      {onNewChat && (
        <Button 
          onClick={onNewChat}
          className="bg-cosmic-accent hover:bg-cosmic-accent/90"
        >
          Новый диалог
        </Button>
      )}
    </div>
  );
};
