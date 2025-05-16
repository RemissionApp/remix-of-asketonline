
import React from 'react';
import { ChatMessagesDisplay } from '@/components/chat/ChatMessagesDisplay';
import { UniverseChatMessage } from '@/utils/universeChat';

interface ChatTabContentProps {
  isLoadingChat: boolean;
  chatMessages: UniverseChatMessage[];
}

export const ChatTabContent: React.FC<ChatTabContentProps> = ({ 
  isLoadingChat,
  chatMessages
}) => {
  // Add debug logging to verify messages are coming through
  console.log('ChatTabContent received messages:', chatMessages);
  
  return (
    <div className="px-4 h-[calc(100vh-220px)]">
      <ChatMessagesDisplay 
        isLoading={isLoadingChat} 
        messages={chatMessages} 
      />
    </div>
  );
};
