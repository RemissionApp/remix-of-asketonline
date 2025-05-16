
import { supabase } from '@/lib/supabase';
import { UniverseChatMessage } from './types';
import { generateUniverseAnswer } from '../universeMessages';
import { updateSessionTimestamp } from './sessionManager';

/**
 * Loads messages for a specific session
 */
export const loadSessionMessages = async (sessionId: string): Promise<UniverseChatMessage[]> => {
  if (!sessionId) {
    console.error('Session ID is required to load messages');
    return [];
  }

  try {
    console.log('Loading messages for session:', sessionId);
    
    const { data, error } = await supabase
      .from('universe_chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    
    console.log(`Loaded ${data?.length || 0} messages for session ${sessionId}`);
    return data as UniverseChatMessage[];
  } catch (error) {
    console.error('Error loading session messages:', error);
    return [];
  }
};

/**
 * Saves a chat message to the database
 */
export const saveMessage = async (
  userId: string,
  sessionId: string,
  content: string,
  sender: 'user' | 'universe'
): Promise<string | null> => {
  try {
    const messageId = crypto.randomUUID();
    
    const { error } = await supabase
      .from('universe_chat_messages')
      .insert({
        id: messageId,
        user_id: userId,
        session_id: sessionId,
        content,
        sender
      });
      
    if (error) throw error;
    return messageId;
  } catch (error) {
    console.error(`Error saving ${sender} message:`, error);
    return null;
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
  if (!userId || !sessionId || !message) {
    throw new Error('Missing required parameters to send message');
  }

  try {
    console.log(`Sending message to universe (session ${sessionId}):`, message);
    
    // Save the user message
    const userMessageId = await saveMessage(userId, sessionId, message, 'user');
    
    if (!userMessageId) {
      throw new Error('Failed to save user message');
    }
    
    console.log('User message saved with ID:', userMessageId);

    // Update the session's last message timestamp
    await updateSessionTimestamp(sessionId);

    // Generate the universe's response
    console.log('Generating universe answer through GPT...');
    const universeResponse = await generateUniverseAnswer(message);
    console.log('Generated answer:', universeResponse.substring(0, 50) + '...');
    
    // Save the universe's response
    const universeMessageId = await saveMessage(userId, sessionId, universeResponse, 'universe');
    
    if (!universeMessageId) {
      throw new Error('Failed to save universe response');
    }
    
    console.log('Universe response saved with ID:', universeMessageId);

    // Return the updated messages
    return await loadSessionMessages(sessionId);
  } catch (error) {
    console.error('Error in sendMessageToUniverse:', error);
    throw error;
  }
};
