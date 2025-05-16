
import React, { useState, useRef, useEffect } from 'react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatSessionsList } from '@/components/chat/ChatSessionsList';
import { useTranslations } from '@/hooks/useTranslations';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, PlusCircle } from 'lucide-react';
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
    loadChatMessages
  } = useAppStore();
  
  const { t } = useTranslations();
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'sessions'>('sessions');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Load chat sessions on initial render
  useEffect(() => {
    loadChatSessions();
  }, [loadChatSessions]);
  
  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
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
  
  const handleNewChat = () => {
    setNewChatDialogOpen(true);
    setNewChatTitle('');
  };
  
  const handleCreateNewChat = async () => {
    if (newChatTitle.trim().length < 3) {
      toast.error('Название диалога должно содержать не менее 3 символов');
      return;
    }
    
    try {
      const sessionId = await createChatSession(newChatTitle);
      if (sessionId) {
        setNewChatDialogOpen(false);
        setActiveTab('chat');
      } else {
        toast.error('Не удалось создать новый диалог');
      }
    } catch (error) {
      console.error('Error creating chat session:', error);
      toast.error('Не удалось создать новый диалог');
    }
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
            onNewChat={handleNewChat}
            currentSessionId={currentChatSession}
          />
        </TabsContent>
        
        <TabsContent value="chat" className="px-4 h-[calc(100vh-220px)]">
          {isLoadingChat ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-cosmic-accent animate-spin" />
              <span className="ml-2 text-cosmic-secondary">Загрузка сообщений...</span>
            </div>
          ) : (
            <>
              {chatMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center flex-col">
                  <div className="w-20 h-20 bg-cosmic-accent/10 rounded-full flex items-center justify-center mb-4">
                    <PlusCircle size={32} className="text-cosmic-accent" />
                  </div>
                  <p className="text-cosmic-secondary text-center max-w-xs">
                    {t.universe?.startConversation || 'Начните диалог с Вселенной, задав свой первый вопрос'}
                  </p>
                </div>
              ) : (
                <div 
                  ref={chatContainerRef}
                  className="h-full overflow-y-auto pr-2"
                >
                  {chatMessages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isDisabled={isSendingMessage || (activeTab === 'sessions')}
      />
      
      <Dialog open={newChatDialogOpen} onOpenChange={setNewChatDialogOpen}>
        <DialogContent className="bg-cosmic-dark border-cosmic-accent/30 text-white">
          <h3 className="text-lg font-medium font-serif text-cosmic-accent mb-4">
            {t.universe?.newChatTitle || 'Новый диалог со Вселенной'}
          </h3>
          <Label htmlFor="chat-title" className="text-cosmic-secondary text-sm">
            {t.universe?.chatTitleLabel || 'Название диалога'}
          </Label>
          <Input
            id="chat-title"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            placeholder={t.universe?.chatTitlePlaceholder || 'Например: Поиск моего пути'}
            className="bg-cosmic-dark/50 border-cosmic-accent/30 text-white mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setNewChatDialogOpen(false)}
            >
              {t.common?.cancel || 'Отмена'}
            </Button>
            <Button
              onClick={handleCreateNewChat}
              className="bg-cosmic-accent hover:bg-cosmic-accent/90"
              disabled={newChatTitle.trim().length < 3}
            >
              {t.common?.create || 'Создать'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
  
  if (!userProfile?.isPro) {
    return (
      <div className="min-h-screen flex flex-col bg-cosmic">
        <StarField starCount={50} />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-cosmic-dark/80 backdrop-blur-md border-cosmic-accent/20">
            <ProFeatureOverlay
              title="Диалог со Вселенной"
              message="Этот раздел доступен только пользователям PRO"
            >
              <div className="h-96"></div>
            </ProFeatureOverlay>
          </Card>
        </div>
        <BottomNavigation />
      </div>
    );
  }
  
  return chatContent;
};

export default UniverseChatPage;
