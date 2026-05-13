import { useConversation } from '@elevenlabs/react';
import { Capacitor } from '@capacitor/core';
import { useAppStore } from '@/store/useAppStore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { createLogger } from '@/utils/logger';

// Агенты для разных языков
const AGENTS = {
  ru: 'agent_01jzg4fchcew0tq8fy4j75vkva',
  en: 'agent_01jzhxjnzrfghs4d2dqbyz6d3a',
  es: 'agent_01jzhxwswhfas9ss9ae74n16v0',
};

const CONNECTION_TIMEOUT_MS = 15000;

type PendingStart = {
  agentId: string;
  startedAt: number;
  timeoutId: ReturnType<typeof setTimeout>;
  resolve: () => void;
  reject: (error: Error) => void;
};

type PactLike = { status?: string; title?: string; duration?: number | string };
type SummaryLike = { summary?: string | null; called_at?: string | null };
type ConversationConnectProps = { conversationId?: string };
type DisconnectDetails = {
  reason?: string;
  message?: string;
  code?: string | number;
  closeCode?: number;
  closeReason?: string;
  context?: unknown;
};
type ElevenLabsMessage = {
  type?: string;
  source?: string;
  message?: string;
  agent_response_event?: { agent_response?: string };
  agent_response_correction_event?: { corrected_agent_response?: string };
  user_transcription_event?: { user_transcript?: string };
};
type ElevenLabsErrorDetails = {
  code?: string | number;
  reason?: string;
  name?: string;
  closeCode?: number;
  closeReason?: string;
  context?: unknown;
};

const getCloseContext = (context: unknown) =>
  context && typeof context === 'object'
    ? (context as { code?: number; reason?: string })
    : undefined;

const getRuntimePlatform = () => {
  if (Capacitor.isNativePlatform()) return Capacitor.getPlatform();
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return 'ios-webview';
  if (/Android/.test(navigator.userAgent)) return 'android-webview';
  return 'web';
};

const toError = (value: unknown, fallback: string) => {
  if (value instanceof Error) return value;
  if (typeof value === 'string' && value.trim()) return new Error(value);
  return new Error(fallback);
};

export const useElevenLabsConversation = () => {
  const logger = useMemo(() => createLogger('useElevenLabsConversation'), []);
  const { language, user, userProfile, pacts } = useAppStore();
  const [isConnected, setIsConnected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [lastAgentMessage, setLastAgentMessage] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const callStartRef = useRef<number | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const pendingStartRef = useRef<PendingStart | null>(null);
  const pendingContextRef = useRef<string | null>(null);

  const buildLyraContext = useCallback(async (): Promise<string | null> => {
    if (!user?.id) return null;
    try {
      const { data: summaries } = await supabase
        .from('call_summaries')
        .select('summary, key_topics, emotional_tone, called_at')
        .eq('user_id', user.id)
        .order('called_at', { ascending: false })
        .limit(5);

      const activePacts = ((pacts || []) as PactLike[]).filter(p => p.status === 'active');
      const name = userProfile?.name || '';

      const intro =
        language === 'ru'
          ? `Контекст пользователя ${name}.`
          : language === 'es'
            ? `Contexto del usuario ${name}.`
            : `User context for ${name}.`;

      const pactsLine = activePacts.length
        ? (language === 'ru' ? 'Активные пакты: ' : language === 'es' ? 'Votos activos: ' : 'Active vows: ') +
          activePacts.map(p => `${p.title} (${p.duration}d)`).join('; ')
        : '';

      const historyLine = summaries?.length
        ? (language === 'ru'
            ? 'Последние разговоры: '
            : language === 'es'
              ? 'Conversaciones recientes: '
              : 'Recent calls: ') +
          summaries
            .map((s: SummaryLike) => `[${new Date(s.called_at || Date.now()).toLocaleDateString()}] ${(s.summary || '').slice(0, 300)}`)
            .join(' | ')
        : '';

      // Hard cap total context to ~2000 chars to stay within token budget
      return [intro, pactsLine, historyLine].filter(Boolean).join('\n').slice(0, 2000);
    } catch (e) {
      logger.error('Failed to build context', e);
      return null;
    }
  }, [user?.id, userProfile?.name, pacts, language, logger]);

  const saveCallSummary = useCallback(
    async (durationSeconds: number) => {
      if (!user?.id || durationSeconds < 20) return;
      try {
        const lastUser = lastUserMessage || '';
        const lastAgent = lastAgentMessage || '';
        const summary = `${lastUser ? 'User: ' + lastUser + '. ' : ''}${lastAgent ? 'Guide: ' + lastAgent : ''}`.slice(0, 500);
        await supabase.from('call_summaries').insert({
          user_id: user.id,
          duration_seconds: durationSeconds,
          summary: summary || null,
          emotional_tone: null,
          key_topics: [],
        });
      } catch (e) {
        logger.error('Failed to save call summary', e);
      }
    },
    [user?.id, lastAgentMessage, lastUserMessage, logger]
  );

  const conversation = useConversation({
    onConnect: (props?: ConversationConnectProps) => {
      const pendingStart = pendingStartRef.current;
      if (pendingStart) {
        clearTimeout(pendingStart.timeoutId);
        pendingStart.resolve();
        pendingStartRef.current = null;
      }

      logger.info('ElevenLabs conversation connected', {
        conversationId: props?.conversationId,
        agentId: pendingStart?.agentId,
        platform: getRuntimePlatform(),
        elapsedMs: pendingStart ? Math.round(performance.now() - pendingStart.startedAt) : undefined,
      });
      setIsConnected(true);
      setLastAgentMessage(null);
      setLastUserMessage(null);
      callStartRef.current = Date.now();
      const id = props?.conversationId ?? null;
      if (id) {
        setConversationId(id);
        conversationIdRef.current = id;
      }

      if (pendingContextRef.current) {
        try {
          conversation.sendContextualUpdate(pendingContextRef.current, { contextId: 'asceta-user-context' });
          logger.info('Sent ElevenLabs contextual update', {
            contextLength: pendingContextRef.current.length,
          });
        } catch (e) {
          logger.warn('Failed to send contextual update after connect', e);
        } finally {
          pendingContextRef.current = null;
        }
      }
    },
    onDisconnect: (details?: DisconnectDetails) => {
      const pendingStart = pendingStartRef.current;
      if (pendingStart) {
        clearTimeout(pendingStart.timeoutId);
        pendingStart.reject(new Error('AGENT_UNAVAILABLE'));
        pendingStartRef.current = null;
      }
      pendingContextRef.current = null;
      logger.info('ElevenLabs conversation disconnected', {
        reason: details?.reason,
        message: details?.message,
        code: details?.code,
        closeCode: details?.closeCode ?? details?.context?.code,
        closeReason: details?.closeReason ?? details?.context?.reason,
        context: details?.context,
      });
      setIsConnected(false);
      const start = callStartRef.current;
      callStartRef.current = null;
      const duration = start ? Math.round((Date.now() - start) / 1000) : 0;
      if (duration >= 20) {
        void saveCallSummary(duration);
      }
      setConversationId(null);
      conversationIdRef.current = null;
    },
    onMessage: (message: ElevenLabsMessage) => {
      logger.debug('Received message', { type: message?.type ?? message?.source });
      try {
        // New SDK shape with explicit event types
        if (message?.type === 'agent_response') {
          const text =
            message.agent_response_event?.agent_response ?? message.message;
          if (text) setLastAgentMessage(text);
        } else if (message?.type === 'agent_response_correction') {
          const text =
            message.agent_response_correction_event?.corrected_agent_response;
          if (text) setLastAgentMessage(text);
        } else if (message?.type === 'user_transcript') {
          const text =
            message.user_transcription_event?.user_transcript ?? message.message;
          if (text) setLastUserMessage(text);
        } else if (message?.source === 'ai' && message?.message) {
          // Fallback for simplified SDK shape
          setLastAgentMessage(message.message);
        } else if (message?.source === 'user' && message?.message) {
          setLastUserMessage(message.message);
        }
      } catch (e) {
        logger.error('Failed to parse onMessage', e);
      }
    },
    onError: (message: string | ElevenLabsMessage, error?: ElevenLabsErrorDetails) => {
      const pendingStart = pendingStartRef.current;
      if (pendingStart) {
        clearTimeout(pendingStart.timeoutId);
        pendingStart.reject(toError(error ?? message, 'AGENT_UNAVAILABLE'));
        pendingStartRef.current = null;
      }
      pendingContextRef.current = null;
      logger.error('ElevenLabs conversation error', {
        message: typeof message === 'string' ? message : message.message,
        rawMessage: message,
        code: error?.code,
        reason: error?.reason,
        name: error?.name,
        closeCode: error?.closeCode ?? error?.context?.code,
        closeReason: error?.closeReason ?? error?.context?.reason,
        error,
      });
    },
  });

  const startConversation = useCallback(async () => {
    const startedAt = performance.now();
    try {
      const agentId = AGENTS[language as keyof typeof AGENTS] || AGENTS.en;
      const platform = getRuntimePlatform();

      logger.info('Starting ElevenLabs conversation', {
        agentId,
        language,
        connectionType: 'websocket',
        platform,
        hasMediaDevices: Boolean(navigator.mediaDevices?.getUserMedia),
      });

      if (!navigator.mediaDevices?.getUserMedia) {
        logger.error('Microphone API is unavailable', undefined, { platform });
        throw new Error('MIC_PERMISSION_DENIED');
      }

      // 1. Запрашиваем доступ к микрофону до старта сессии и сразу освобождаем preflight stream.
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        logger.info('Microphone permission granted', {
          platform,
          elapsedMs: Math.round(performance.now() - startedAt),
        });
      } catch (micErr) {
        logger.error('Microphone permission denied or unavailable', micErr, { platform });
        throw new Error('MIC_PERMISSION_DENIED');
      }

      // 2. Build context for the agent (best-effort)
      const context = await buildLyraContext();
      pendingContextRef.current = context;

      // 3. Стартуем публичную WebSocket-сессию напрямую через agentId.
      // Это обходит падающий LiveKit WebRTC /rtc/v1/validate endpoint и не требует convai_write API key.
      logger.info('Starting public ElevenLabs WebSocket session', {
        agentId,
        platform,
        contextLength: context?.length ?? 0,
        elapsedMs: Math.round(performance.now() - startedAt),
      });

      await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          if (pendingStartRef.current?.agentId === agentId) {
            pendingStartRef.current = null;
            pendingContextRef.current = null;
            logger.error('ElevenLabs WebSocket connection timed out', undefined, {
              agentId,
              platform,
              timeoutMs: CONNECTION_TIMEOUT_MS,
            });
            try {
              conversation.endSession();
            } catch (_) {}
            reject(new Error('AGENT_UNAVAILABLE'));
          }
        }, CONNECTION_TIMEOUT_MS);

        pendingStartRef.current = {
          agentId,
          startedAt,
          timeoutId,
          resolve,
          reject,
        };

        try {
          conversation.startSession({
            agentId,
            connectionType: 'websocket',
            ...(user?.id ? { userId: user.id } : {}),
          } as any);
        } catch (startError) {
          clearTimeout(timeoutId);
          pendingStartRef.current = null;
          pendingContextRef.current = null;
          reject(toError(startError, 'AGENT_UNAVAILABLE'));
        }
      });

      logger.info('ElevenLabs WebSocket connected', {
        agentId,
        platform,
        elapsedMs: Math.round(performance.now() - startedAt),
      });

      return null;
    } catch (error) {
      logger.error('Error starting ElevenLabs conversation', error);
      throw error;
    }
  }, [conversation, language, buildLyraContext, user?.id]);

  const endConversation = useCallback(async () => {
    try {
      if (pendingStartRef.current) {
        clearTimeout(pendingStartRef.current.timeoutId);
        pendingStartRef.current.reject(new Error('CALL_CANCELLED'));
        pendingStartRef.current = null;
      }
      pendingContextRef.current = null;
      await conversation.endSession();
    } catch (error) {
      logger.error('Error ending conversation', error);
    }
  }, [conversation]);

  useEffect(() => {
    return () => {
      if (pendingStartRef.current) {
        clearTimeout(pendingStartRef.current.timeoutId);
        pendingStartRef.current.reject(new Error('CALL_CANCELLED'));
        pendingStartRef.current = null;
      }
      pendingContextRef.current = null;
    };
  }, []);

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
    lastAgentMessage,
    lastUserMessage,
  };
};
