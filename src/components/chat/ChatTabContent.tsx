
import React from 'react';
import { ChatMessagesDisplay } from '@/components/chat/ChatMessagesDisplay';
import { UniverseChatMessage } from '@/utils/universeChat';

export interface ChatTabContentProps {
  isLoadingChat: boolean;
  chatMessages: UniverseChatMessage[];
}

export const ChatTabContent: React.FC<ChatTabContentProps> = ({ 
  isLoadingChat,
  chatMessages
}) => {
  return (
    <div className="h-[calc(100vh-230px)] flex flex-col">
      <ChatMessagesDisplay 
        isLoading={isLoadingChat} 
        messages={chatMessages} 
      />
    </div>
  );
};
