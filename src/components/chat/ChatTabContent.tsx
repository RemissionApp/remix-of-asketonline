
import React from 'react';
import { ChatMessagesDisplay } from '@/components/chat/ChatMessagesDisplay';
import { UniverseChatMessage } from '@/store/slices/chat/universeChatTypes';
import { useAppStore } from '@/store/useAppStore';
import { UserGreeting } from '@/components/universe/UserGreeting';

export interface ChatTabContentProps {
  isLoadingChat: boolean;
  chatMessages: UniverseChatMessage[];
  isTyping: boolean; // Добавляем свойство isTyping
}

export const ChatTabContent: React.FC<ChatTabContentProps> = ({ 
  isLoadingChat,
  chatMessages,
  isTyping = false // Добавляем свойство с дефолтным значением
}) => {
  const { userProfile, language } = useAppStore();
  
  return (
    <div className="h-[calc(100vh-230px)] flex flex-col">
      {chatMessages.length === 0 && !isLoadingChat && (
        <UserGreeting userProfile={userProfile} language={language} />
      )}
      <ChatMessagesDisplay 
        isLoading={isLoadingChat} 
        messages={chatMessages}
        isTyping={isTyping}
      />
    </div>
  );
};
