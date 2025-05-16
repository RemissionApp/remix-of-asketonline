
import React, { useRef, useEffect } from 'react';
import { Loader2, Star } from 'lucide-react';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { UniverseChatMessage } from '@/utils/universeChat';
import { EmptyChatState } from '@/components/chat/EmptyChatState';
import { Progress } from "@/components/ui/progress";
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ChatMessagesDisplayProps {
  isLoading: boolean;
  messages: UniverseChatMessage[];
}

export const ChatMessagesDisplay: React.FC<ChatMessagesDisplayProps> = ({ 
  isLoading,
  messages 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  
  // Simulate loading progress for better UX
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(100);
    }
  }, [isLoading]);
  
  // Scroll to bottom of messages when new messages arrive or when loading completes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  
  // Handle empty state with styled loader
  if (isLoading && messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 rounded-full bg-cosmic-dark border-2 border-cosmic-gold flex items-center justify-center mb-4 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <Avatar className="h-full w-full">
              <AvatarImage 
                src="https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//Avataruniverse.png" 
                alt="Вселенная"
                className="object-cover opacity-40"
              />
              <AvatarFallback className="bg-cosmic-dark text-cosmic-accent">ВС</AvatarFallback>
            </Avatar>
          </div>
          <Star className="h-8 w-8 text-cosmic-accent animate-spin relative z-10" />
          <div className="absolute inset-0 rounded-full overflow-hidden z-0">
            <div className="absolute animate-pulse top-0 left-1/2 w-8 h-1 bg-white/20 rounded transform -translate-x-1/2 blur-md"></div>
            <div className="absolute animate-pulse delay-300 bottom-0 left-1/2 w-8 h-1 bg-white/20 rounded transform -translate-x-1/2 blur-md"></div>
            <div className="absolute animate-pulse delay-150 left-0 top-1/2 w-1 h-8 bg-white/20 rounded transform -translate-y-1/2 blur-md"></div>
            <div className="absolute animate-pulse delay-150 right-0 top-1/2 w-1 h-8 bg-white/20 rounded transform -translate-y-1/2 blur-md"></div>
          </div>
        </div>
        <span className="text-cosmic-secondary text-center font-serif mt-2">Вселенная обдумывает ваш вопрос...</span>
        <div className="w-full max-w-xs mt-4">
          <Progress value={loadingProgress} className="h-1 bg-cosmic-dark/50" />
        </div>
      </div>
    );
  }
  
  // Handle empty chat state
  if (!isLoading && messages.length === 0) {
    return <EmptyChatState />;
  }
  
  return (
    <div 
      ref={containerRef} 
      className="flex-1 overflow-y-auto px-4 pb-4 pt-2 scrollbar-thin scrollbar-thumb-cosmic-accent/20 scrollbar-track-transparent mb-16"
    >
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id || `temp-${Date.now()}-${Math.random()}`} 
            message={message} 
          />
        ))}
        
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center relative border-2 border-cosmic-gold">
                <Avatar className="h-full w-full">
                  <AvatarImage 
                    src="https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/pics//Avataruniverse.png" 
                    alt="Вселенная"
                    className="object-cover opacity-70"
                  />
                  <AvatarFallback className="bg-cosmic-dark text-cosmic-accent">ВС</AvatarFallback>
                </Avatar>
                <Loader2 className="h-5 w-5 text-white animate-spin absolute z-10" />
                <div className="absolute inset-0 rounded-full overflow-hidden z-0">
                  <div className="absolute animate-pulse top-0 left-1/2 w-5 h-1 bg-white/20 rounded transform -translate-x-1/2 blur-sm"></div>
                  <div className="absolute animate-pulse delay-300 bottom-0 left-1/2 w-5 h-1 bg-white/20 rounded transform -translate-x-1/2 blur-sm"></div>
                  <div className="absolute animate-pulse delay-150 left-0 top-1/2 w-1 h-5 bg-white/20 rounded transform -translate-y-1/2 blur-sm"></div>
                  <div className="absolute animate-pulse delay-150 right-0 top-1/2 w-1 h-5 bg-white/20 rounded transform -translate-y-1/2 blur-sm"></div>
                </div>
              </div>
              <div className="absolute inset-0 animate-ping bg-cosmic-accent/5 rounded-full"></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} className="h-16" />
      </div>
    </div>
  );
};
