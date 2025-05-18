
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase";
import { getZodiacSign } from "@/utils/zodiac";
import { 
  isHoroscopeRequest, 
  handleHoroscopeRequest 
} from "./universe/horoscopeHandler";
import { getRandomFallbackMessage } from "./universe/fallbackMessages";
import { 
  getCurrentDay, 
  isCustomPact, 
  prepareUserData, 
  getUniverseSystemPrompt 
} from "./universe/universeUtils";

/**
 * Generates an answer from the universe based on the user's question
 * @param question The user's question
 * @returns Promise that resolves to the universe's answer
 */
export async function generateUniverseAnswer(question: string): Promise<string> {
  const store = useAppStore.getState();
  const { language, pacts, userProfile } = store;
  
  console.log('Generating universe answer for:', question.substring(0, 50) + '...');
  console.log('User language:', language);
  
  try {
    // Check if this is a horoscope request
    if (isHoroscopeRequest(question) && userProfile?.birthDate) {
      console.log('Detected horoscope request, processing specialized response');
      try {
        const horoscopeResult = await handleHoroscopeRequest(question, userProfile, language);
        if (horoscopeResult) {
          console.log('Successfully generated horoscope response');
          return horoscopeResult;
        }
        console.warn('Horoscope request detected but no result returned, falling back to regular answer');
      } catch (horoscopeError) {
        console.error('Error in horoscope handling:', horoscopeError);
        // Continue with regular answer as fallback
      }
    }

    // Get current active pact if available
    const currentVow = pacts?.find(p => p.status === 'active');
    
    // Prepare user data for context
    const userData = prepareUserData(userProfile, currentVow);
    
    // Add zodiac sign if birthdate is available
    if (userProfile?.birthDate) {
      try {
        const zodiacSign = getZodiacSign(new Date(userProfile.birthDate));
        if (zodiacSign) {
          userData.zodiacSign = zodiacSign;
          console.log('Added zodiac sign to user data:', zodiacSign);
        }
      } catch (zodiacError) {
        console.error('Error determining zodiac sign:', zodiacError);
      }
    }
    
    // Get the custom system prompt
    const customSystemPrompt = getUniverseSystemPrompt();
    
    console.log('Calling universe-answer edge function with context data');
    
    // Use the dialogue function with the structured response format
    const { data, error } = await supabase.functions.invoke('universe-answer', {
      body: { 
        question, 
        language,
        userData,
        systemPrompt: customSystemPrompt
      },
      // Add timeout to prevent long-hanging requests
      options: {
        timeout: 30000 // 30 seconds timeout
      }
    });

    if (error) {
      console.error('Edge function error details:', {
        message: error.message,
        name: error.name,
        statusCode: error.statusCode,
      });
      throw new Error(`Edge function error: ${error.message}`);
    }
    
    if (!data) {
      console.error('No data received from edge function');
      throw new Error('No response data received from universe');
    }
    
    if (data && data.answer) {
      console.log('Received universe answer:', data.answer.substring(0, 100) + '...');
      return data.answer;
    }
    
    console.error('Invalid response structure:', data);
    throw new Error('Invalid response structure received from universe');
  } catch (error) {
    console.error('Error generating universe answer:', {
      errorMessage: error.message,
      errorName: error.name,
      errorStack: error.stack,
      question: question.substring(0, 50) + '...'
    });
    
    // Provide specialized fallback message based on error type
    if (error.message && error.message.includes('timeout')) {
      return `The universe is contemplating deeply on your question. Please try again in a moment, as cosmic wisdom sometimes requires patience.`;
    }
    
    if (error.name === 'AbortError') {
      return `Connection to the cosmic realm was interrupted. The stars will align again shortly.`;
    }
    
    if (error.message && error.message.includes('network')) {
      return `The celestial connection is temporarily unavailable. Please check your connection to the earthly internet.`;
    }
    
    // Fallback: use predefined poetic answers
    console.log('Using fallback message due to error');
    return getRandomFallbackMessage(language);
  }
}
