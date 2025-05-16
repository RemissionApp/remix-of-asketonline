
import React, { useState, useRef } from 'react';
import { Send, Mic, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/hooks/useTranslations';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isDisabled = false }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslations();
  
  const handleSendMessage = () => {
    if (!inputText.trim() || isDisabled || isSending) return;
    
    setIsSending(true);
    
    try {
      onSendMessage(inputText);
      setInputText('');
      
      // Make sure to focus back on input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      // Add a small delay for better UX feedback
      setTimeout(() => setIsSending(false), 500);
    }
  };
  
  const toggleRecording = () => {
    if (isDisabled) return;
    setIsRecording(!isRecording);
    
    // This is just a mock for the voice recording functionality
    if (!isRecording) {
      // Start recording logic would go here
      console.log('Started recording');
    } else {
      // Stop recording and process voice message
      console.log('Stopped recording');
      // For now, we'll just log this. In the future, we can implement actual voice recording
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Enter (but not with Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-20 bg-cosmic-dark/80 backdrop-blur-md">
      <div className="flex items-center max-w-2xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          className={`text-cosmic-secondary ${isRecording ? 'text-red-500' : ''}`}
          onClick={toggleRecording}
          disabled={isDisabled}
        >
          <Mic size={24} />
        </Button>
        
        <div className="flex-1 mx-2 relative">
          <Textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.universe?.questionPlaceholder || "Напишите сообщение..."}
            className="resize-none bg-cosmic-dark/50 border border-cosmic-accent/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50 min-h-[50px] max-h-[120px]"
            onKeyDown={handleKeyDown}
            disabled={isDisabled || isSending}
            rows={1}
          />
        </div>
        
        <Button
          variant={inputText.trim() ? "default" : "ghost"}
          size="icon"
          className={inputText.trim() ? "bg-cosmic-accent hover:bg-cosmic-accent/90" : "text-cosmic-secondary"}
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isDisabled || isSending}
        >
          {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </Button>
      </div>
    </div>
  );
};
