
import { supabase } from '@/lib/supabase';
import { UniverseChatSession } from './types';

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
 * Loads all chat sessions for the user
 */
export const loadChatSessions = async (userId: string): Promise<UniverseChatSession[]> => {
  if (!userId) {
    console.error('User ID is required to load chat sessions');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('universe_chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('last_message', { ascending: false });
      
    if (error) throw error;
    console.log(`Loaded ${data?.length || 0} chat sessions for user ${userId}`);
    return data as UniverseChatSession[];
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    return [];
  }
};

/**
 * Updates the session's last message timestamp
 */
export const updateSessionTimestamp = async (sessionId: string): Promise<void> => {
  try {
    await supabase
      .from('universe_chat_sessions')
      .update({ last_message: new Date().toISOString() })
      .eq('id', sessionId);
  } catch (error) {
    console.error('Error updating session timestamp:', error);
  }
};
