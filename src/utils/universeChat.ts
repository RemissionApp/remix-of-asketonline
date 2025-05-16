
import { supabase } from '@/lib/supabase';
import { generateUniverseAnswer } from './universeMessages';

export interface UniverseChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'universe';
  created_at: string;
  session_id?: string;
}

export interface UniverseChatSession {
  id: string;
  title: string;
  last_message: string;
  created_at: string;
}

/**
 * Creates a new chat session
 */
export const createChatSession = async (userId: string, title: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('universe_chat_sessions')
      .insert({
        user_id: userId,
        title
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error creating chat session:', error);
    return null;
  }
};

/**
 * Loads messages for a specific session
 */
export const loadSessionMessages = async (sessionId: string): Promise<UniverseChatMessage[]> => {
  try {
    // Add logging to verify messages are being loaded
    console.log('Loading messages for session:', sessionId);
    
    const { data, error } = await supabase
      .from('universe_chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    // Log the loaded messages
    console.log('Loaded messages:', data);
    return data as UniverseChatMessage[];
  } catch (error) {
    console.error('Error loading session messages:', error);
    return [];
  }
};

/**
 * Loads all chat sessions for the user
 */
export const loadChatSessions = async (userId: string): Promise<UniverseChatSession[]> => {
  try {
    const { data, error } = await supabase
      .from('universe_chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('last_message', { ascending: false });
      
    if (error) throw error;
    return data as UniverseChatSession[];
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    return [];
  }
};

/**
 * Sends a message to the universe and handles database operations
 */
export const sendMessageToUniverse = async (
  userId: string,
  sessionId: string,
  message: string
): Promise<UniverseChatMessage[]> => {
  try {
    console.log('Sending message to universe:', message);
    
    // First, save the user message
    const userMessageId = crypto.randomUUID();
    const userMessagePayload = {
      id: userMessageId,
      user_id: userId,
      session_id: sessionId,
      content: message,
      sender: 'user' as const
    };
    
    // Insert the user message
    const { error: userMsgError } = await supabase
      .from('universe_chat_messages')
      .insert(userMessagePayload);

    if (userMsgError) throw userMsgError;
    console.log('User message saved:', userMessagePayload);

    // Generate the universe's response
    console.log('Generating universe answer through GPT...');
    const universeResponse = await generateUniverseAnswer(message);
    console.log('Generated answer:', universeResponse);
    
    // Insert the universe's response
    const universeMessageId = crypto.randomUUID();
    const universeMessagePayload = {
      id: universeMessageId,
      user_id: userId,
      session_id: sessionId,
      content: universeResponse,
      sender: 'universe' as const
    };
    
    const { error: universeMsgError } = await supabase
      .from('universe_chat_messages')
      .insert(universeMessagePayload);

    if (universeMsgError) throw universeMsgError;
    console.log('Universe message saved:', universeMessagePayload);

    // Update the session last_message timestamp
    await supabase
      .from('universe_chat_sessions')
      .update({ last_message: new Date().toISOString() })
      .eq('id', sessionId);

    // Return the updated messages
    return await loadSessionMessages(sessionId);
  } catch (error) {
    console.error('Error sending message to universe:', error);
    throw error;
  }
};

/**
 * Subscribes to real-time updates for a chat session
 */
export const subscribeToSessionMessages = (
  sessionId: string,
  onNewMessage: (message: UniverseChatMessage) => void
) => {
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
        console.log('New message received via subscription:', payload);
        onNewMessage(payload.new as UniverseChatMessage);
      }
    )
    .subscribe();
};
