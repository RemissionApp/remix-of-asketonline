
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { MeditationLayout } from '@/components/MeditationLayout';
import { MessageSquare } from 'lucide-react';
import { UniverseChatProWrapper } from '@/components/chat/UniverseChatProWrapper';
import { EmptyChatState } from '@/components/chat/EmptyChatState';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatNavigationPanel } from '@/components/chat/ChatNavigationPanel';
import { NewChatDialog } from '@/components/chat/NewChatDialog';
import { ChatMessagesDisplay } from '@/components/chat/ChatMessagesDisplay';
import { ChatInput } from '@/components/chat/ChatInput';
import { UniverseChatSession, UniverseChatMessage } from '@/store/slices/chat/universeChatTypes';

const UniverseChatPage: React.FC = () => {
  // Состояние для диалогового окна нового чата
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  
  // Получаем все необходимые состояния и функции из хранилища приложения
  const { 
    universeChat,
    universeChatSessions,
    universeChatMessages,
    universeChatCurrentSessionId,
    universeChatIsTyping,
    universeChatIsLoading,
    createUniverseChatSession,
    setCurrentUniverseChatSession,
    loadUniverseChatMessages,
    sendUniverseChatMessage
  } = useAppStore();
  
  // При монтировании компонента создаем новый сеанс, если нет активных сеансов
  useEffect(() => {
    const initializeChat = async () => {
      if (universeChatSessions.length === 0) {
        await createUniverseChatSession('Новый диалог с Вселенной');
      }
    };
    
    initializeChat();
  }, [universeChatSessions, createUniverseChatSession]);
  
  // Обработчики действий
  const handleNewChat = () => {
    setIsNewChatDialogOpen(true);
  };
  
  const handleCreateNewChat = async (title: string) => {
    await createUniverseChatSession(title);
    setIsNewChatDialogOpen(false);
  };
  
  const handleSelectSession = async (sessionId: string) => {
    await setCurrentUniverseChatSession(sessionId);
  };
  
  const handleSendMessage = async (message: string) => {
    if (message.trim() === '') return;
    await sendUniverseChatMessage(message);
  };

  return (
    <MeditationLayout 
      title="Диалог с Вселенной" 
      icon={<MessageSquare size={24} className="text-purple-400 mr-3" />}
      disablePadding={true}
    >
      <UniverseChatProWrapper isPro={true}>
        <div className="w-full h-full flex flex-col">
          <ChatHeader onNewChat={handleNewChat} />
          
          <div className="flex-1 flex">
            {/* Боковая панель с сеансами чата */}
            <ChatNavigationPanel 
              sessions={universeChatSessions as UniverseChatSession[]}
              currentSessionId={universeChatCurrentSessionId}
              onSelectSession={handleSelectSession}
              onNewChat={handleNewChat}
              isLoading={universeChatIsLoading}
            />
            
            {/* Основная область чата */}
            <div className="flex-1 flex flex-col h-full px-1 md:px-4">
              {universeChatCurrentSessionId ? (
                <>
                  <ChatMessagesDisplay 
                    messages={universeChatMessages as UniverseChatMessage[]} 
                    isLoading={universeChatIsLoading}
                    isTyping={universeChatIsTyping}
                  />
                  
                  <ChatInput 
                    onSendMessage={handleSendMessage}
                    disabled={universeChatIsLoading || universeChatIsTyping}
                    isLoading={universeChatIsLoading}
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
        open={isNewChatDialogOpen}
        onClose={() => setIsNewChatDialogOpen(false)}
        onCreateSession={handleCreateNewChat}
      />
    </MeditationLayout>
  );
};

export default UniverseChatPage;
