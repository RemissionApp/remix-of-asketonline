
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean; // Обновляем на опциональный параметр
  isLoading?: boolean; // Обновляем на опциональный параметр
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage,
  disabled = false,
  isLoading = false
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
    await onSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-cosmic-accent/20 bg-cosmic-dark/40">
      <div className="flex space-x-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напишите ваше сообщение..."
          className="min-h-[60px] resize-none bg-cosmic-dark/60 border-cosmic-accent/30 text-white focus:border-cosmic-accent focus:ring-cosmic-accent/30"
          disabled={disabled}
        />
        <Button 
          type="submit" 
          className="bg-cosmic-accent hover:bg-cosmic-accent/90 self-end h-[60px] w-[60px]"
          disabled={!message.trim() || disabled}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </form>
  );
};
