
import React, { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { UniverseChatMessage } from '@/utils/universeChat';
import { EmptyChatState } from '@/components/chat/EmptyChatState';

interface ChatMessagesDisplayProps {
  isLoading: boolean;
  messages: UniverseChatMessage[];
}

export const ChatMessagesDisplay: React.FC<ChatMessagesDisplayProps> = ({ 
  isLoading,
  messages 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Log messages for debugging
  useEffect(() => {
    console.log('ChatMessagesDisplay: Rendering with messages:', messages.length);
    if (messages.length > 0) {
      console.log('First message:', messages[0]?.content?.substring(0, 30));
      console.log('Last message:', messages[messages.length - 1]?.content?.substring(0, 30));
    }
  }, [messages]);
  
  // Scroll to bottom of messages when new messages arrive or when loading completes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  
  // Handle empty state with loader
  if (isLoading && messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-cosmic-accent animate-spin" />
        <span className="ml-2 text-cosmic-secondary">Загрузка сообщений...</span>
      </div>
    );
  }
  
  // Handle empty chat state
  if (!isLoading && messages.length === 0) {
    return <EmptyChatState />;
  }
  
  return (
    <div 
      ref={chatContainerRef}
      className="h-full overflow-y-auto pr-2 pb-4 space-y-4"
    >
      {messages.map((message) => (
        <ChatMessage 
          key={message.id || `temp-${Date.now()}-${Math.random()}`} 
          message={message} 
        />
      ))}
      
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 text-cosmic-accent animate-spin" />
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
