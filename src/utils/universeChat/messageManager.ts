import { supabase } from '@/lib/supabase';
import { UniverseChatMessage } from './types';

/**
 * Saves a chat message to the database
 */
export async function saveMessage(
  userId: string,
  sessionId: string,
  content: string,
  sender: 'user' | 'universe'
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('universe_chat_messages')
      .insert({
        user_id: userId,
        session_id: sessionId,
        content,
        sender,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving message:', error);
      return null;
    }

    // Update last message timestamp for the session
    await supabase
      .from('universe_chat_sessions')
      .update({ last_message: new Date().toISOString() })
      .eq('id', sessionId);

    return data.id;
  } catch (error) {
    console.error('Exception in saveMessage:', error);
    return null;
  }
}

/**
 * Loads messages for a specific chat session
 */
export async function loadSessionMessages(
  sessionId: string
): Promise<UniverseChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('universe_chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading session messages:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Exception in loadSessionMessages:', error);
    return [];
  }
}

/**
 * Sends a message to the universe and processes the response
 * @param userId The user ID
 * @param sessionId The chat session ID
 * @param message The message content
 * @param recentMessages Recent message history for context
 * @returns An updated list of messages for the session
 */
export async function sendMessageToUniverse(
  userId: string,
  sessionId: string,
  message: string,
  recentMessages: string[] = []
): Promise<UniverseChatMessage[]> {
  try {
    // First save the user's message
    const userMessageId = await saveMessage(userId, sessionId, message, 'user');

    if (!userMessageId) {
      throw new Error('Failed to save user message');
    }

    // Get user profile data for context
    const { data: profileData } = await supabase
      .from('profiles')
      .select('birth_date, name, goal')
      .eq('id', userId)
      .single();

    // Then get the response from the universe (openai)
    const { data: universeResponse, error: universeError } =
      await supabase.functions.invoke('universe-dialogue', {
        body: {
          question: message,
          language: 'ru', // Можно добавить выбор языка позже
          recentMessages, // Передаем историю сообщений
          userData: profileData
            ? {
                userName: profileData.name,
                birthDate: profileData.birth_date,
                userGoal: profileData.goal,
              }
            : undefined,
        },
      });

    if (universeError || !universeResponse?.answer) {
      console.error('Error getting universe response:', universeError);
      throw new Error('Failed to get universe response');
    }

    // Save the universe's response
    const universeMessageId = await saveMessage(
      userId,
      sessionId,
      universeResponse.answer,
      'universe'
    );

    if (!universeMessageId) {
      throw new Error('Failed to save universe message');
    }

    // Return updated messages
    return await loadSessionMessages(sessionId);
  } catch (error) {
    console.error('Exception in sendMessageToUniverse:', error);
    throw error;
  }
}
