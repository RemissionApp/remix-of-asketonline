import { useConversation } from '@elevenlabs/react';
import { useAppStore } from '@/store/useAppStore';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { createLogger } from '@/utils/logger';

// Агенты для разных языков
const AGENTS = {
  ru: 'agent_01jzg4fchcew0tq8fy4j75vkva',
  en: 'agent_01jzhxjnzrfghs4d2dqbyz6d3a',
  es: 'agent_01jzhxwswhfas9ss9ae74n16v0',
};

export const useElevenLabsConversation = () => {
  const logger = createLogger('useElevenLabsConversation');
  const { language } = useAppStore();
  const [isConnected, setIsConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      logger.info('ElevenLabs conversation connected');
      setIsConnected(true);
    },
    onDisconnect: () => {
      logger.info('ElevenLabs conversation disconnected');
      setIsConnected(false);
      setConversationId(null);
    },
    onMessage: message => {
      logger.debug('Received message', {
        messageContent: message.message,
        source: message.source,
      });
    },
    onError: error => {
      logger.error('ElevenLabs conversation error', error);
    },
  });

  const startConversation = useCallback(async () => {
    try {
      const agentId = AGENTS[language as keyof typeof AGENTS] || AGENTS.en;

      // 1. Запрашиваем доступ к микрофону до старта сессии
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micErr) {
        logger.error('Microphone permission denied', micErr);
        throw new Error('MIC_PERMISSION_DENIED');
      }

      // 2. Получаем conversation token для WebRTC
      const { data, error } = await supabase.functions.invoke(
        'elevenlabs-conversation-token',
        { body: { agentId } }
      );

      if (error || !data?.token) {
        throw new Error(error?.message || 'Failed to get conversation token');
      }

      // 3. Стартуем сессию через WebRTC с токеном
      const id = await conversation.startSession({
        conversationToken: data.token,
        connectionType: 'webrtc',
      });
      setConversationId(id);

      return id;
    } catch (error) {
      logger.error('Error starting ElevenLabs conversation', error);
      throw error;
    }
  }, [conversation, language]);

  const endConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      logger.error('Error ending conversation', error);
    }
  }, [conversation]);

  const setVolume = useCallback(
    async (volume: number) => {
      try {
        await conversation.setVolume({
          volume: Math.max(0, Math.min(1, volume)),
        });
      } catch (error) {
        logger.error('Error setting volume', error);
      }
    },
    [conversation]
  );

  return {
    startConversation,
    endConversation,
    setVolume,
    isConnected,
    isSpeaking: conversation.isSpeaking || false,
    status: conversation.status,
    conversationId,
  };
};
