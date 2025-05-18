
import { AppState } from '../../../types';
import { supabase } from '@/lib/supabase';
import { UniverseChatState } from '../universeChatTypes';

/**
 * Action creator for subscribing to real-time chat messages
 */
export const createSubscribeToChatMessagesAction = <T extends AppState & UniverseChatState>(
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
) => async (sessionId: string) => {
  console.log('Subscribing to chat messages for session:', sessionId);
  
  try {
    const channel = supabase
      .channel(`chat-${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'universe_chat_messages',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        console.log('New message received:', payload);
        get().handleNewChatMessage(payload);
      })
      .subscribe();
    
    // Return cleanup function
    return () => {
      console.log('Unsubscribing from chat messages');
      supabase.removeChannel(channel);
    };
  } catch (error) {
    console.error('Error subscribing to chat messages:', error);
    return () => {}; // No-op cleanup function
  }
};
