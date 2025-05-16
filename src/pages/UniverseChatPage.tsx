
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
  
  // Load chat sessions on initial render
  useEffect(() => {
    loadChatSessions();
  }, [loadChatSessions]);
  
  // When a session is selected, switch to chat tab and load messages
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
        // Create a new session with the message as title
        const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
        console.log('Creating new chat session with title:', title);
        
        const sessionId = await createChatSession(title);
        
        if (sessionId) {
          console.log('Session created with ID:', sessionId);
          // Set current session and switch to chat tab
          await setCurrentChatSession(sessionId);
          setActiveTab('chat');
          
          // Wait a moment for state to update before sending
          setTimeout(() => {
            sendChatMessage(message);
          }, 200);
        }
      } else {
        // Session exists, make sure we're on chat tab and send message
        setActiveTab('chat');
        await sendChatMessage(message);
      }
    } catch (error) {
      console.error('Error in send message flow:', error);
      toast.error(t.universe?.errorSendingMessage || 'Не удалось отправить сообщение');
    }
  };
  
  const handleSelectSession = (sessionId: string) => {
    console.log('Selecting session:', sessionId);
    setCurrentChatSession(sessionId);
  };
  
  const getCurrentSession = (): UniverseChatSession | undefined => {
    return chatSessions.find(session => session.id === currentChatSession);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-cosmic">
      <StarField starCount={50} />
      
      <ChatHeader title={getCurrentSession()?.title || t.universe?.chatTitle || 'Диалог со Вселенной'} />
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'chat' | 'sessions')}
        className="w-full max-w-2xl mx-auto mt-16 mb-20"
      >
        <TabsList className="w-full bg-cosmic-dark/50 backdrop-blur-md mb-4">
          <TabsTrigger value="sessions" className="w-1/2">
            {t.universe?.conversations || 'Диалоги'}
          </TabsTrigger>
          <TabsTrigger value="chat" className="w-1/2" disabled={!currentChatSession}>
            {t.universe?.currentChat || 'Текущий чат'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions" className="px-4">
          <ChatSessionsList 
            sessions={chatSessions}
            onSelectSession={handleSelectSession}
            currentSessionId={currentChatSession}
          />
        </TabsContent>
        
        <TabsContent value="chat">
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
    </div>
  );
};

export default UniverseChatPage;
