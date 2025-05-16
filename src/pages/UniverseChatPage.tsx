
import React, { useState, useEffect } from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from '@/hooks/useTranslations';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatSessionsList } from '@/components/chat/ChatSessionsList';
import { ChatTabContent } from '@/components/chat/ChatTabContent';
import { UniverseChatProWrapper } from '@/components/chat/UniverseChatProWrapper';
import { toast } from 'sonner';
import { UniverseChatSession } from '@/utils/universeChat';
import { BottomNavigation } from '@/components/BottomNavigation';

const UniverseChatPage = () => {
  const { 
    userProfile, 
    chatSessions, 
    currentChatSession, 
    chatMessages,
    isLoadingChat,
    isSendingMessage,
    loadChatSessions,
    createChatSession,
    setCurrentChatSession,
    sendChatMessage,
    loadChatMessages,
  } = useAppStore();
  
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState<'chat' | 'sessions'>('sessions');
  
  // Загружаем сессии чата при первом рендеринге
  useEffect(() => {
    loadChatSessions();
  }, [loadChatSessions]);
  
  // Когда выбрана сессия, переключаемся на вкладку чата и загружаем сообщения
  useEffect(() => {
    if (currentChatSession) {
      setActiveTab('chat');
      loadChatMessages(currentChatSession);
    }
  }, [currentChatSession, loadChatMessages]);
  
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    try {
      if (!currentChatSession) {
        // Создаем новую сессию с сообщением в качестве названия
        const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
        console.log('Creating new chat session with title:', title);
        
        const sessionId = await createChatSession(title);
        
        if (sessionId) {
          console.log('Session created with ID:', sessionId);
          // Устанавливаем текущую сессию и переключаемся на вкладку чата
          await setCurrentChatSession(sessionId);
          setActiveTab('chat');
          
          // Ждем немного, чтобы состояние обновилось, прежде чем отправлять
          setTimeout(() => {
            sendChatMessage(message);
          }, 200);
        }
      } else {
        // Сессия существует, убеждаемся, что мы на вкладке чата, и отправляем сообщение
        setActiveTab('chat');
        await sendChatMessage(message);
      }
    } catch (error) {
      console.error('Error in send message flow:', error);
      toast.error(t.universe?.errorSendingMessage || 'Failed to send message');
    }
  };
  
  const handleSelectSession = (sessionId: string) => {
    console.log('Selecting session:', sessionId);
    setCurrentChatSession(sessionId);
  };
  
  const getCurrentSession = (): UniverseChatSession | undefined => {
    return chatSessions.find(session => session.id === currentChatSession);
  };
  
  // Оборачиваем контент проверкой PRO
  const content = (
    <div className="min-h-screen flex flex-col bg-cosmic">
      <StarField starCount={100} />
      
      <ChatHeader title={getCurrentSession()?.title || t.universe?.chatTitle || 'Диалог со Вселенной'} />
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'chat' | 'sessions')}
        className="w-full max-w-2xl mx-auto mt-20"
      >
        <TabsList className="w-full bg-cosmic-dark/50 backdrop-blur-md mb-4 border border-cosmic-accent/20 rounded-lg overflow-hidden">
          <TabsTrigger value="sessions" className="w-1/2 data-[state=active]:bg-cosmic-accent/20 data-[state=active]:text-white">
            {t.universe?.conversations || 'Беседы'}
          </TabsTrigger>
          <TabsTrigger value="chat" className="w-1/2 data-[state=active]:bg-cosmic-accent/20 data-[state=active]:text-white" disabled={!currentChatSession}>
            {t.universe?.currentChat || 'Текущий разговор'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions" className="px-4 mb-24">
          <ChatSessionsList 
            sessions={chatSessions}
            onSelectSession={handleSelectSession}
            currentSessionId={currentChatSession}
          />
        </TabsContent>
        
        <TabsContent value="chat" className="mb-24">
          <ChatTabContent 
            isLoadingChat={isLoadingChat}
            chatMessages={chatMessages}
          />
        </TabsContent>
      </Tabs>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isDisabled={isSendingMessage}
      />
      
      <BottomNavigation />
    </div>
  );
  
  return (
    <UniverseChatProWrapper isPro={userProfile?.isPro || false}>
      {content}
    </UniverseChatProWrapper>
  );
};

export default UniverseChatPage;
