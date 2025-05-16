
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
  
  // When a session is selected, switch to chat tab
  useEffect(() => {
    if (currentChatSession) {
      setActiveTab('chat');
      // Make sure messages are loaded when session changes
      loadChatMessages(currentChatSession);
    }
  }, [currentChatSession, loadChatMessages]);

  // Log chat messages for debugging
  useEffect(() => {
    console.log('Current chat messages in state:', chatMessages);
  }, [chatMessages]);
  
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    console.log('Sending message:', message);
    
    if (!currentChatSession) {
      // If no session exists, create one with the message as title
      try {
        const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
        console.log('Creating new chat session with title:', title);
        const sessionId = await createChatSession(title);
        if (sessionId) {
          // Now send the message
          console.log('Session created, sending message to session:', sessionId);
          await setCurrentChatSession(sessionId);
          // Make sure to switch to chat tab
          setActiveTab('chat');
          // Small timeout to ensure session is set
          setTimeout(() => {
            sendChatMessage(message);
          }, 100);
        }
      } catch (error) {
        console.error('Error creating chat session:', error);
        toast.error('Не удалось создать новый диалог');
      }
    } else {
      // Session exists, send message
      console.log('Sending message to existing session:', currentChatSession);
      setActiveTab('chat'); // Make sure we're on the chat tab
      sendChatMessage(message);
    }
  };
  
  const handleSelectSession = (sessionId: string) => {
    console.log('Selecting session:', sessionId);
    setCurrentChatSession(sessionId);
    setActiveTab('chat');
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
