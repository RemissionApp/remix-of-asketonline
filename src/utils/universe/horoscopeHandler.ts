import { supabase } from '@/lib/supabase';
import { getZodiacSign } from '@/utils/zodiac';
import { UserProfile } from '@/types';

/**
 * Handles horoscope request processing
 * @param question The user's question
 * @param userProfile User profile data
 * @param language Current language
 * @returns Horoscope result or null if unsuccessful
 */
export async function handleHoroscopeRequest(
  question: string,
  userProfile: UserProfile | null,
  language: string
): Promise<string | null> {
  try {
    // Check if user has birthdate
    if (!userProfile?.birthDate) {
      return null;
    }

    // Get zodiac sign
    const zodiacSign = getZodiacSign(new Date(userProfile.birthDate));
    if (!zodiacSign) {
      throw new Error("Couldn't determine zodiac sign");
    }

    // Get daily horoscope through the edge function
    const { data, error } = await supabase.functions.invoke('fetch-horoscope', {
      body: { sign: zodiacSign, language, detailed: false },
    });

    if (error) {
      throw error;
    }

    if (data.success && data.data.description) {
      return data.data.description;
    }

    throw new Error('No horoscope data available');
  } catch (error) {
    console.error('Horoscope error:', error);
    return null;
  }
}

/**
 * Detects if a question is related to horoscope/astrology
 * @param question The user's question
 * @returns Boolean indicating if it's a horoscope request
 */
export function isHoroscopeRequest(question: string): boolean {
  const lowercaseQuestion = question.toLowerCase();

  return (
    lowercaseQuestion.includes('гороскоп') ||
    lowercaseQuestion.includes('horoscope') ||
    lowercaseQuestion.includes('zodiac') ||
    lowercaseQuestion.includes('звезды') ||
    lowercaseQuestion.includes('предсказание') ||
    lowercaseQuestion.includes('прогноз')
  );
}
