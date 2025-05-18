
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyChatStateProps {
  onNewChat: () => void;
}

export const EmptyChatState: React.FC<EmptyChatStateProps> = ({ onNewChat }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-cosmic-accent/10 rounded-full flex items-center justify-center mb-6">
        <MessageSquare size={40} className="text-cosmic-accent/70" />
      </div>
      
      <h3 className="text-xl font-serif text-white mb-2">Диалог с Вселенной</h3>
      <p className="text-cosmic-secondary mb-8 max-w-md">
        Задайте вопрос и Вселенная откроет вам свои тайны. Создайте новый диалог, чтобы начать путешествие.
      </p>
      
      <Button 
        onClick={onNewChat}
        className="bg-cosmic-accent hover:bg-cosmic-accent/90"
      >
        Начать новый диалог
      </Button>
    </div>
  );
};
