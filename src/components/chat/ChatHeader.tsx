
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ChatHeaderProps {
  onNewChat?: () => void; // Добавляем опциональный обработчик
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onNewChat }) => {
  return (
    <div className="border-b border-cosmic-accent/20 p-4 flex items-center justify-between bg-cosmic-dark/40 backdrop-blur-md">
      <h2 className="text-cosmic-accent text-xl font-serif">Диалог с Вселенной</h2>
      
      {onNewChat && (
        <Button 
          variant="outline" 
          size="sm" 
          className="border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10" 
          onClick={onNewChat}
        >
          <PlusCircle size={16} className="mr-1" /> Новый диалог
        </Button>
      )}
    </div>
  );
};
