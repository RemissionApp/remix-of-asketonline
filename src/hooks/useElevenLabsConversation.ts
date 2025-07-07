import { useConversation } from '@11labs/react';
import { useAppStore } from '@/store/useAppStore';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Агенты для разных языков
const AGENTS = {
  ru: 'agent_01jzg4fchcew0tq8fy4j75vkva',
  en: 'agent_01jzhxjnzrfghs4d2dqbyz6d3a', 
  es: 'agent_01jzhxwswhfas9ss9ae74n16v0'
};

export const useElevenLabsConversation = () => {
  const { language } = useAppStore();
  const [isConnected, setIsConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('ElevenLabs conversation connected');
      setIsConnected(true);
    },
    onDisconnect: () => {
      console.log('ElevenLabs conversation disconnected');
      setIsConnected(false);
      setConversationId(null);
    },
    onMessage: (message) => {
      console.log('Received message:', message);
    },
    onError: (error) => {
      console.error('ElevenLabs conversation error:', error);
    }
  });

  const startConversation = useCallback(async () => {
    try {
      // Получаем ID агента на основе выбранного языка
      const agentId = AGENTS[language as keyof typeof AGENTS] || AGENTS.en;
      
      // Запрашиваем подписанную ссылку от нашего edge function
      const { data, error } = await supabase.functions.invoke('elevenlabs-signed-url', {
        body: { agentId }
      });

      if (error || !data?.signedUrl) {
        throw new Error(error?.message || 'Failed to get signed URL');
      }
      
      // Запускаем разговор с подписанной ссылкой
      const id = await conversation.startSession({ 
        agentId: agentId,
        authorization: data.signedUrl
      });
      setConversationId(id);
      
      return id;
    } catch (error) {
      console.error('Error starting ElevenLabs conversation:', error);
      throw error;
    }
  }, [conversation, language]);

  const endConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  }, [conversation]);

  const setVolume = useCallback(async (volume: number) => {
    try {
      await conversation.setVolume({ volume: Math.max(0, Math.min(1, volume)) });
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  }, [conversation]);

  return {
    startConversation,
    endConversation,
    setVolume,
    isConnected,
    isSpeaking: conversation.isSpeaking || false,
    status: conversation.status,
    conversationId
  };
};