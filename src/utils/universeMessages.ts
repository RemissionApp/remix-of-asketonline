
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase";
import { Pact } from "@/types";
import { getZodiacSign } from "@/utils/zodiac";

// Fallback poetic answers if API call fails
const russianAnswers = [
  "Тишина — это ответ, в который не помещаются слова.",
  "Ты слышишь меня даже тогда, когда я молчу.",
  "Покой не даётся, он появляется, когда ты перестаёшь искать.",
  "Путь открывается шаг за шагом. Тишина между вдохами — твой ответ.",
  "В глубине молчания рождается истина. Она уже внутри тебя.",
  "Звёзды говорят через синхронии. Смотри внимательнее на мир вокруг.",
  "Ты — часть космического танца. Твои шаги уже вплетены в узор Вселенной.",
  "Сомнения — лишь тени от света. За каждой тенью стоит источник яркости.",
  "Время течёт по-разному для разных сердец. Не торопи свою реку.",
  "В центре бури всегда есть тишина. Найди её внутри себя."
];

const englishAnswers = [
  "Silence is the answer that words cannot contain.",
  "You hear me even when I am silent.",
  "Peace isn't given, it appears when you stop searching.",
  "The path reveals itself with each step. The silence between breaths is your answer.",
  "In the depth of silence, truth is born. It's already within you.",
  "Stars speak through synchronicities. Look more carefully at the world around you.",
  "You are part of the cosmic dance. Your steps are already woven into the universe's pattern.",
  "Doubts are merely shadows cast by light. Behind each shadow stands a source of brightness.",
  "Time flows differently for different hearts. Don't rush your river.",
  "At the center of every storm lies stillness. Find it within yourself."
];

const spanishAnswers = [
  "El silencio es la respuesta que las palabras no pueden contener.",
  "Me escuchas incluso cuando estoy en silencio.",
  "La paz no se da, aparece cuando dejas de buscar.",
  "El camino se revela paso a paso. El silencio entre respiraciones es tu respuesta.",
  "En la profundidad del silencio nace la verdad. Ya está dentro de ti.",
  "Las estrellas hablan a través de sincronicidades. Mira con más atención el mundo que te rodea.",
  "Eres parte de la danza cósmica. Tus pasos ya están entretejidos en el patrón del universo.",
  "Las dudas son solo sombras proyectadas por la luz. Detrás de cada sombra hay una fuente de brillo.",
  "El tiempo fluye diferente para diferentes corazones. No apresures tu río.",
  "En el centro de cada tormenta hay quietud. Encuéntrala dentro de ti."
];

// Helper function to get current day of the pact
function getCurrentDay(days = []) {
  if (!days || days.length === 0) return 1;
  const completedDays = days.filter(day => day.completed).length;
  return completedDays + 1;
}

// Type guard for custom pact type
function isCustomPact(pact: any): pact is { 
  title: string; 
  duration: number; 
  days: any[]; 
  purpose: string; 
  restrictions: { title: string; }[] 
} {
  return pact && 'restrictions' in pact && 'purpose' in pact;
}

// Get today's date formatted for horoscope data
function getTodayFormatted() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export async function generateUniverseAnswer(question: string): Promise<string> {
  const store = useAppStore.getState();
  const { language, pacts, userProfile } = store;
  
  // Check if this is a horoscope request
  const isHoroscopeRequest = question.toLowerCase().includes('гороскоп') || 
                           question.toLowerCase().includes('horoscope') ||
                           question.toLowerCase().includes('zodiac') ||
                           question.toLowerCase().includes('звезды') ||
                           question.toLowerCase().includes('предсказание') ||
                           question.toLowerCase().includes('прогноз');

  // Special handling for horoscope requests
  if (isHoroscopeRequest && userProfile?.birthDate) {
    try {
      const zodiacSign = getZodiacSign(new Date(userProfile.birthDate));
      if (!zodiacSign) throw new Error("Couldn't determine zodiac sign");
      
      // Get daily horoscope through the edge function
      const { data, error } = await supabase.functions.invoke('fetch-horoscope', {
        body: { sign: zodiacSign, language, detailed: false }
      });
      
      if (error) throw error;
      if (data.success && data.data.description) {
        return data.data.description;
      }
      throw new Error("No horoscope data available");
    } catch (error) {
      console.error("Horoscope error:", error);
      // If horoscope fetch fails, continue with regular answer
    }
  }

  // Get current active pact if available
  const currentVow = pacts?.find(p => p.status === 'active');
  
  try {
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
        const zodiacSign = getZodiacSign(new Date(userProfile.birthDate));
        if (zodiacSign) {
          userData.zodiacSign = zodiacSign;
        }
      }
    }
    
    // Add pact information if available
    if (currentVow) {
      userData.currentVow = currentVow.title || 'вредных привычек';
      userData.vowDay = getCurrentDay(currentVow.days);
      userData.vowDuration = currentVow.duration || 21;
      
      if (isCustomPact(currentVow)) {
        userData.vowPurpose = currentVow.purpose;
      } else if ((currentVow as any).reward) {
        userData.vowPurpose = (currentVow as any).reward;
      } else {
        userData.vowPurpose = 'духовный рост';
      }
    }
    
    // Use the dialogue function with the poetic structure
    const { data, error } = await supabase.functions.invoke('universe-dialogue', {
      body: { 
        question, 
        language,
        userData
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }
    
    if (data && data.answer) {
      console.log('Received poetic dialogue answer:', data.answer.substring(0, 100) + '...');
      return data.answer;
    }
    
    throw new Error('No answer received from dialogue function');
  } catch (error) {
    console.error('Error getting universe dialogue:', error);
    
    // Fallback: use predefined poetic answers
    let answers;
    
    switch (language) {
      case 'en':
        answers = englishAnswers;
        break;
      case 'es':
        answers = spanishAnswers;
        break;
      case 'ru':
      default:
        answers = russianAnswers;
    }
    
    // Get a random index from the answers array
    const randomIndex = Math.floor(Math.random() * answers.length);
    return answers[randomIndex];
  }
}
