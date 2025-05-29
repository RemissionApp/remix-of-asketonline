
import { AppState } from '../../../types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { saveMessage, loadSessionMessages } from '@/utils/universeChat';
import { UniverseChatState } from '../universeChatTypes';

/**
 * Action creator for sending a chat message
 */
export const createSendChatMessageAction = <T extends AppState & UniverseChatState>(
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T
) => async (message: string, messageType: 'user' | 'universe' = 'user') => {
  const { user, userProfile, pacts } = get();
  const sessionId = get().currentChatSession;
  const currentMessages = get().chatMessages;
  
  if (!user) {
    toast.error('Требуется авторизация');
    return;
  }
  
  if (!sessionId) {
    // Create a new session instead of showing an error
    const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
    const newSessionId = await get().createChatSession(title);
    if (!newSessionId) {
      toast.error('Не удалось создать новую беседу');
      return;
    }
    
    // Set current session and try again
    await get().setCurrentChatSession(newSessionId);
    await get().sendChatMessage(message, messageType);
    return;
  }
  
  if (!message || message.trim() === '') {
    console.warn('Cannot send empty message');
    return;
  }
  
  try {
    set({ 
      isSendingMessage: true,
      isUniverseTyping: false // Reset typing state
    } as unknown as Partial<T>);
    
    // If this is a universe message (welcome), save it directly
    if (messageType === 'universe') {
      // Save universe welcome message to database
      const universeMessageId = await saveMessage(user.id, sessionId, message, 'universe');
      
      if (!universeMessageId) {
        throw new Error('Failed to save universe welcome message');
      }
      
      // Load updated messages
      const updatedMessages = await loadSessionMessages(sessionId);
      
      // Update state with all messages
      set({ 
        chatMessages: updatedMessages,
        isSendingMessage: false
      } as unknown as Partial<T>);
      
      return;
    }
    
    // Regular user message flow
    // Add temporary message to state immediately
    const tempUserMsg = {
      id: `temp-${Date.now()}-${Math.random()}`,
      content: message,
      sender: 'user',
      created_at: new Date().toISOString(),
      session_id: sessionId
    };
    
    set(state => ({
      chatMessages: [...state.chatMessages, tempUserMsg]
    } as unknown as Partial<T>));
    
    console.log('Sending chat message:', message);
    
    // Prepare user data for context
    const userData: any = {};
    
    // Add user profile information
    if (userProfile) {
      if (userProfile.name) {
        userData.userName = userProfile.name;
      }
      
      if (userProfile.goal) {
        userData.userGoal = userProfile.goal;
      }
      
      if (userProfile.birthDate) {
        userData.birthDate = userProfile.birthDate;
      }
    }
    
    // Find current active pact
    const currentVow = pacts?.find(p => p.status === 'active');
    
    // Add pact information if available
    if (currentVow) {
      userData.currentVow = currentVow.title || 'вредных привычек';
      
      // Get current day of the pact
      const completedDays = (currentVow.days || []).filter((day: any) => day.completed).length;
      userData.vowDay = completedDays + 1;
      userData.vowDuration = currentVow.duration || 21;
    }
    
    // Get recent messages for context (last 5 user messages)
    const recentUserMessages = currentMessages
      .filter(msg => msg.sender === 'user')
      .slice(-5)
      .map(msg => msg.content);
    
    // Save user message to database
    const userMessageId = await saveMessage(user.id, sessionId, message, 'user');
    
    if (!userMessageId) {
      throw new Error('Failed to save user message');
    }
    
    // Set universe typing indicator before calling the function
    set({ isUniverseTyping: true } as unknown as Partial<T>);
    
    // Call the universe-dialogue function using the imported supabase client
    const { data: dialogueResponse, error: dialogueError } = await supabase.functions.invoke('universe-dialogue', {
      body: {
        question: message,
        language: get().language,
        userData,
        recentMessages: recentUserMessages
      }
    });
    
    // Reset typing indicator once response is received
    set({ isUniverseTyping: false } as unknown as Partial<T>);
    
    if (dialogueError) {
      throw new Error(`Error from universe-dialogue function: ${dialogueError.message}`);
    }
    
    if (!dialogueResponse?.answer) {
      throw new Error('No response received from universe-dialogue function');
    }
    
    // Save universe response to database
    const universeMessageId = await saveMessage(user.id, sessionId, dialogueResponse.answer, 'universe');
    
    if (!universeMessageId) {
      throw new Error('Failed to save universe response');
    }
    
    // Load updated messages
    const updatedMessages = await loadSessionMessages(sessionId);
    
    // Update state with all messages
    set({ 
      chatMessages: updatedMessages,
      isSendingMessage: false
    } as unknown as Partial<T>);
  } catch (error) {
    console.error("Error sending chat message:", error);
    toast.error('Не удалось отправить сообщение');
    set({ 
      isSendingMessage: false,
      isUniverseTyping: false // Reset typing state on error
    } as unknown as Partial<T>);
  }
};
