
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
import { NewChatDialog } from '@/components/chat/NewChatDialog';
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
  } = useAppStore();
  
  const { t } = useTranslations();
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'sessions'>('sessions');
  
  // Load chat sessions on initial render
  useEffect(() => {
    loadChatSessions();
  }, [loadChatSessions]);
  
  // When a session is selected, switch to chat tab
  useEffect(() => {
    if (currentChatSession) {
      setActiveTab('chat');
    }
  }, [currentChatSession]);
  
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    if (!currentChatSession) {
      // If no session exists, create one with the message as title
      try {
        const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
        const sessionId = await createChatSession(title);
        if (sessionId) {
          // Now send the message
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
      sendChatMessage(message);
    }
  };
  
  const handleCreateNewChat = async (title: string) => {
    const sessionId = await createChatSession(title);
    if (sessionId) {
      setActiveTab('chat');
      return Promise.resolve();
    }
    return Promise.reject(new Error('Failed to create chat'));
  };
  
  const handleSelectSession = (sessionId: string) => {
    setCurrentChatSession(sessionId);
    setActiveTab('chat');
  };
  
  const getCurrentSession = (): UniverseChatSession | undefined => {
    return chatSessions.find(session => session.id === currentChatSession);
  };
  
  const chatContent = (
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
            onNewChat={() => setNewChatDialogOpen(true)}
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
        isDisabled={isSendingMessage || (activeTab === 'sessions')}
      />
      
      <NewChatDialog
        open={newChatDialogOpen}
        onOpenChange={setNewChatDialogOpen}
        onCreateChat={handleCreateNewChat}
      />
    </div>
  );
  
  return (
    <UniverseChatProWrapper isPro={!!userProfile?.isPro}>
      {chatContent}
    </UniverseChatProWrapper>
  );
};

export default UniverseChatPage;
