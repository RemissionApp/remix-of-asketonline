
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
  
  console.log('ChatMessagesDisplay rendering with messages:', messages.length, messages);
  
  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    console.log('Scrolling to bottom due to messages update');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-cosmic-accent animate-spin" />
        <span className="ml-2 text-cosmic-secondary">Загрузка сообщений...</span>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return <EmptyChatState />;
  }
  
  return (
    <div 
      ref={chatContainerRef}
      className="h-full overflow-y-auto pr-2 pb-4"
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
