
import { supabase } from '@/lib/supabase';
import { UniverseChatMessage } from './types';

/**
 * Subscribes to real-time updates for a chat session
 */
export const subscribeToSessionMessages = (
  sessionId: string,
  onNewMessage: (message: UniverseChatMessage) => void
) => {
  if (!sessionId) {
    console.error('Session ID is required for subscription');
    return {
      unsubscribe: () => {}
    };
  }

  console.log('Setting up real-time subscription for session:', sessionId);
  
  return supabase
    .channel(`session-${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'universe_chat_messages',
        filter: `session_id=eq.${sessionId}`
      },
      (payload) => {
        console.log('New message received via subscription:', payload.new);
        onNewMessage(payload.new as UniverseChatMessage);
      }
    )
    .subscribe();
};
