import React from 'react';
import { ChatMessagesDisplay } from '@/components/chat/ChatMessagesDisplay';
import { UniverseChatMessage } from '@/utils/universeChat';
import { useAppStore } from '@/store/useAppStore';
import { UserGreeting } from '@/components/universe/UserGreeting';

export interface ChatTabContentProps {
  isLoadingChat: boolean;
  chatMessages: UniverseChatMessage[];
}

export const ChatTabContent: React.FC<ChatTabContentProps> = ({
  isLoadingChat,
  chatMessages,
}) => {
  const { userProfile, language } = useAppStore();

  return (
    <div className="h-[calc(100vh-230px)] flex flex-col">
      {chatMessages.length === 0 && !isLoadingChat && (
        <UserGreeting userProfile={userProfile} language={language} />
      )}
      <ChatMessagesDisplay isLoading={isLoadingChat} messages={chatMessages} />
    </div>
  );
};
