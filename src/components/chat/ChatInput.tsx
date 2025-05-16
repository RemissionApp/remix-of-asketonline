
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/hooks/useTranslations';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isDisabled = false }) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslations();
  
  // Focus input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);
  
  const handleSendMessage = async () => {
    if (!inputText.trim() || isDisabled || isSending) return;
    
    const messageToSend = inputText.trim();
    setIsSending(true);
    
    try {
      // Clear input immediately for better UX
      setInputText('');
      
      // Send message
      await onSendMessage(messageToSend);
      
      // Focus back on input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      // If error, restore the text
      setInputText(messageToSend);
    } finally {
      // Delay resetting sending state for UX
      setTimeout(() => setIsSending(false), 300);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Enter (but not with Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // Auto-resize textarea (limited by max-h in CSS)
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };
  
  return (
    <div className="fixed bottom-16 left-0 right-0 p-4 z-30 bg-cosmic-dark/80 backdrop-blur-md">
      <div className="flex items-end max-w-2xl mx-auto">
        <div className="flex-1 mx-2 relative">
          <Textarea
            ref={inputRef}
            value={inputText}
            onChange={handleTextareaChange}
            placeholder={t.universe?.questionPlaceholder || "Спроси у Вселенной..."}
            className="resize-none bg-cosmic-dark/50 border border-cosmic-accent/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50 min-h-[50px] max-h-[120px]"
            onKeyDown={handleKeyDown}
            disabled={isDisabled || isSending}
            rows={1}
          />
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-xl opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-accent/5 to-cosmic-dark/0"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-cosmic-accent/10 rounded-full filter blur-xl transform -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </div>
        
        <Button
          variant={inputText.trim() ? "default" : "ghost"}
          size="icon"
          className={`mb-1 ${inputText.trim() ? "bg-cosmic-accent hover:bg-cosmic-accent/90" : "text-cosmic-secondary"}`}
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isDisabled || isSending}
        >
          {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </Button>
      </div>
    </div>
  );
};
