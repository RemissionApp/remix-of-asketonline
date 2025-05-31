
import React, { useState, useEffect } from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatTabContent } from '@/components/chat/ChatTabContent';
import { UniverseChatProWrapper } from '@/components/chat/UniverseChatProWrapper';
import { BottomNavigation } from '@/components/BottomNavigation';
import { toast } from 'sonner';

const UniverseChatPage = () => {
  const { 
    userProfile, 
    currentChatSession, 
    chatMessages,
    isLoadingChat,
    isSendingMessage,
    loadChatSessions,
    createChatSession,
    setCurrentChatSession,
    sendChatMessage,
    loadChatMessages,
    isUniverseTyping
  } = useAppStore();
  
  const { t } = useTranslations();
  const [initialLoaded, setInitialLoaded] = useState(false);
  
  // Load chat sessions on first render
  useEffect(() => {
    loadChatSessions();
  }, [loadChatSessions]);
  
  // Ensure we have a current session and load messages
  useEffect(() => {
    const initializeChat = async () => {
      // If there's no active session, create one
      if (!currentChatSession) {
        try {
          // Using a fallback for defaultChatTitle if it doesn't exist in translations
          const defaultTitle = t.universe?.chatTitle || 'Диалог со Вселенной';
          const sessionId = await createChatSession(defaultTitle);
          
          if (sessionId) {
            console.log('Created new default session:', sessionId);
            await setCurrentChatSession(sessionId);
          }
        } catch (error) {
          console.error('Error creating default chat session:', error);
        }
      } else {
        // If we already have a session, load its messages
        await loadChatMessages(currentChatSession);
        setInitialLoaded(true);
      }
    };
    
    initializeChat();
  }, [currentChatSession, createChatSession, loadChatMessages, setCurrentChatSession, t.universe]);
  
  // Add welcome message when session and messages are loaded
  useEffect(() => {
    const addWelcomeMessage = async () => {
      // Only proceed if we have a session, messages are loaded, and there are no messages
      if (
        currentChatSession && 
        !isLoadingChat && 
        initialLoaded &&
        chatMessages.length === 0 && 
        !isSendingMessage
      ) {
        try {
          // Create welcome message from universe (not from user)
          const welcomeMessage = "Здравствуйте! Я готова помочь вам найти ответы на вопросы. О чем бы вы хотели поговорить сегодня?";
          
          // Send welcome message as universe message
          await sendChatMessage(welcomeMessage, 'universe');
        } catch (error) {
          console.error('Error adding welcome message:', error);
        }
      }
    };
    
    addWelcomeMessage();
  }, [currentChatSession, isLoadingChat, initialLoaded, chatMessages.length, isSendingMessage, sendChatMessage]);
  
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
          await setCurrentChatSession(sessionId);
          
          // Wait a bit for state to update before sending
          setTimeout(() => {
            sendChatMessage(message);
          }, 200);
        }
      } else {
        // Session exists, send message as user message
        await sendChatMessage(message);
      }
    } catch (error) {
      console.error('Error in send message flow:', error);
      toast.error(t.universe?.errorSendingMessage || 'Failed to send message');
    }
  };
  
  const handleNewChat = async () => {
    try {
      // Creating a new chat session
      const defaultTitle = t.universe?.newChatTitle || 'Новый диалог со Вселенной';
      const sessionId = await createChatSession(defaultTitle);
      
      if (sessionId) {
        await setCurrentChatSession(sessionId);
        setInitialLoaded(false); // Reset so welcome message can be added
        toast.success('Создан новый диалог');
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error('Ошибка создания нового диалога');
    }
  };
  
  // Wrap content with PRO check
  return (
    <UniverseChatProWrapper isPro={userProfile?.isPro || false}>
      <div className="min-h-screen flex flex-col bg-cosmic">
        <StarField starCount={100} />
        
        <ChatHeader title={t.universe?.chatTitle || 'Диалог со Вселенной'} />
        
        <div className="w-full max-w-2xl mx-auto mt-20">
          <div className="px-4 mb-24">
            <ChatTabContent 
              isLoadingChat={isLoadingChat}
              chatMessages={chatMessages}
            />
          </div>
        </div>
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isDisabled={isSendingMessage}
        />
        
        <BottomNavigation />
      </div>
    </UniverseChatProWrapper>
  );
};

export default UniverseChatPage;
