
import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isDisabled = false }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSendMessage = () => {
    if (!inputText.trim() || isDisabled) return;
    
    onSendMessage(inputText);
    setInputText('');
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
        
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Напишите сообщение..."
          className="flex-1 bg-cosmic-dark/50 border border-cosmic-accent/30 rounded-full px-4 py-2 text-white mx-2 focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50"
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          disabled={isDisabled}
        />
        
        <Button
          variant={inputText.trim() ? "default" : "ghost"}
          size="icon"
          className={inputText.trim() ? "bg-cosmic-accent hover:bg-cosmic-accent/90" : "text-cosmic-secondary"}
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isDisabled}
        >
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
};
