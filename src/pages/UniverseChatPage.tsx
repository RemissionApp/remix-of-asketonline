
import React, { useState, useEffect } from 'react';
import { MeditationLayout } from '@/components/MeditationLayout';
import { UniverseChatProWrapper } from '@/components/chat/UniverseChatProWrapper';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatNavigationPanel } from '@/components/chat/ChatNavigationPanel';
import { ChatMessagesDisplay } from '@/components/chat/ChatMessagesDisplay';
import { ChatInput } from '@/components/chat/ChatInput';
import { EmptyChatState } from '@/components/chat/EmptyChatState';
import { NewChatDialog } from '@/components/chat/NewChatDialog';
import { useAppStore } from '@/store/useAppStore';
import { MessageCircle } from 'lucide-react';

const UniverseChatPage: React.FC = () => {
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const { 
    userProfile,
    chatSessions,
    loadChatSessions,
    createChatSession,
    currentChatSession,
    setCurrentChatSession,
    chatMessages,
    loadChatMessages,
    sendChatMessage,
    isLoadingChatSessions,
    isSendingMessage,
    isUniverseTyping,
    isLoadingChat
  } = useAppStore();
  
  useEffect(() => {
    // Загружаем сессии чата при монтировании компонента
    loadChatSessions();
  }, [loadChatSessions]);
  
  const handleChatSelection = async (sessionId: string) => {
    if (currentChatSession !== sessionId) {
      await setCurrentChatSession(sessionId);
    }
  };
  
  const handleCreateChat = async (title: string) => {
    const sessionId = await createChatSession(title);
    setIsNewChatDialogOpen(false);
    
    if (sessionId) {
      await setCurrentChatSession(sessionId);
    }
  };
  
  const handleNewChat = () => {
    setIsNewChatDialogOpen(true);
  };
  
  const handleSendMessage = async (message: string) => {
    if (currentChatSession) {
      // Здесь исправлена ошибка - удален второй аргумент
      await sendChatMessage(message);
    }
  };
  
  return (
    <MeditationLayout
      title="Чат с Вселенной"
      icon={<MessageCircle size={24} className="text-purple-400 mr-3" />}
      disablePadding
    >
      {/* Для доступа к этой функции требуется Pro подписка */}
      <UniverseChatProWrapper>
        <div className="h-screen flex flex-col">
          <ChatHeader onNewChat={handleNewChat} />
          
          <div className="flex-1 flex overflow-hidden">
            <ChatNavigationPanel 
              sessions={chatSessions}
              currentSessionId={currentChatSession}
              onSelectSession={handleChatSelection}
              onNewChat={handleNewChat}
              isLoading={isLoadingChatSessions}
            />
            
            <div className="flex-1 flex flex-col h-full relative">
              {currentChatSession ? (
                <>
                  <ChatMessagesDisplay 
                    messages={chatMessages}
                    isLoading={isLoadingChat}
                    isTyping={isUniverseTyping}
                  />
                  <ChatInput 
                    onSendMessage={handleSendMessage}
                    disabled={isSendingMessage}
                    isLoading={isSendingMessage}
                  />
                </>
              ) : (
                <EmptyChatState onNewChat={handleNewChat} />
              )}
            </div>
          </div>
        </div>
      </UniverseChatProWrapper>
      
      <NewChatDialog 
        isOpen={isNewChatDialogOpen} 
        onClose={() => setIsNewChatDialogOpen(false)}
        onCreate={handleCreateChat}
      />
    </MeditationLayout>
  );
};

export default UniverseChatPage;
