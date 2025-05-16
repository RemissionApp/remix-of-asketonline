
import React, { useState, useEffect } from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatTabContent } from '@/components/chat/ChatTabContent';
import { UniverseChatProWrapper } from '@/components/chat/UniverseChatProWrapper';
import { toast } from 'sonner';
import { BottomNavigation } from '@/components/BottomNavigation';

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
  } = useAppStore();
  
  const { t } = useTranslations();
  
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
        loadChatMessages(currentChatSession);
      }
    };
    
    initializeChat();
  }, [currentChatSession, createChatSession, loadChatMessages, setCurrentChatSession, t.universe]);
  
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
        // Session exists, send message
        await sendChatMessage(message);
      }
    } catch (error) {
      console.error('Error in send message flow:', error);
      toast.error(t.universe?.errorSendingMessage || 'Failed to send message');
    }
  };
  
  // Wrap content with PRO check
  const content = (
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
  );
  
  return (
    <UniverseChatProWrapper isPro={userProfile?.isPro || false}>
      {content}
    </UniverseChatProWrapper>
  );
};

export default UniverseChatPage;
