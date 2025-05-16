
import React, { useEffect } from 'react';
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
  // Debug log messages when they change
  useEffect(() => {
    console.log('ChatTabContent: messages updated:', chatMessages.length);
  }, [chatMessages]);
  
  return (
    <div className="px-4 h-[calc(100vh-220px)]">
      <ChatMessagesDisplay 
        isLoading={isLoadingChat} 
        messages={chatMessages} 
      />
    </div>
  );
};
