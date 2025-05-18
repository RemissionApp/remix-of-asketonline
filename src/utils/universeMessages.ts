
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
  
  // Check if this is a horoscope request
  if (isHoroscopeRequest(question) && userProfile?.birthDate) {
    const horoscopeResult = await handleHoroscopeRequest(question, userProfile, language);
    if (horoscopeResult) {
      return horoscopeResult;
    }
    // If horoscope fetch fails, continue with regular answer
  }

  // Get current active pact if available
  const currentVow = pacts?.find(p => p.status === 'active');
  
  try {
    // Prepare user data for context
    const userData = prepareUserData(userProfile, currentVow);
    
    // Add zodiac sign if birthdate is available
    if (userProfile?.birthDate) {
      const zodiacSign = getZodiacSign(new Date(userProfile.birthDate));
      if (zodiacSign) {
        userData.zodiacSign = zodiacSign;
      }
    }
    
    // Get the custom system prompt
    const customSystemPrompt = getUniverseSystemPrompt();
    
    // Use the dialogue function with the structured response format
    const { data, error } = await supabase.functions.invoke('universe-answer', {
      body: { 
        question, 
        language,
        userData,
        systemPrompt: customSystemPrompt
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }
    
    if (data && data.answer) {
      console.log('Received expert universe answer:', data.answer.substring(0, 100) + '...');
      return data.answer;
    }
    
    throw new Error('No answer received from dialogue function');
  } catch (error) {
    console.error('Error getting universe dialogue:', error);
    
    // Fallback: use predefined poetic answers
    return getRandomFallbackMessage(language);
  }
}
