
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase";
import { Pact } from "@/types";
import { getZodiacSign } from "@/utils/zodiac";

// Fallback poetic answers if API call fails
const russianAnswers = [
  "Путь открывается шаг за шагом. Тишина между вдохами — твой ответ.",
  "В глубине молчания рождается истина. Она уже внутри тебя.",
  "Звёзды говорят через синхронии. Смотри внимательнее на мир вокруг.",
  "Ты — часть космического танца. Твои шаги уже вплетены в узор Вселенной.",
  "Сомнения — лишь тени от света. За каждой тенью стоит источник яркости.",
  "Время течёт по-разному для разных сердец. Не торопи свою реку.",
  "В центре бури всегда есть тишина. Найди её внутри себя.",
  "Каждый вдох — это диалог с миром. Выдох — твоё согласие на жизнь.",
  "Твой вопрос уже содержит ответ. Вслушайся в его эхо внутри тебя.",
  "Горизонты расширяются, когда ты перестаёшь смотреть только вперёд.",
  "Истина не прячется от тебя. Она ждёт, когда ты будешь готов её увидеть.",
  "Корни твоей силы глубже, чем ты думаешь. Они питаются из источника вечности.",
  "Ты идёшь не один. Миллионы звёзд освещают твой путь каждую ночь.",
  "Сердце знает то, что ум ещё не понял. Доверься этому знанию.",
  "В каждой капле росы отражается целое небо. Ты тоже отражаешь целую вселенную."
];

const englishAnswers = [
  "The path reveals itself with each step. The silence between breaths is your answer.",
  "In the depth of silence, truth is born. It's already within you.",
  "Stars speak through synchronicities. Look more carefully at the world around you.",
  "You are part of the cosmic dance. Your steps are already woven into the universe's pattern.",
  "Doubts are merely shadows cast by light. Behind each shadow stands a source of brightness.",
  "Time flows differently for different hearts. Don't rush your river.",
  "At the center of every storm lies stillness. Find it within yourself.",
  "Each breath is a dialogue with the world. Each exhale is your agreement to life.",
  "Your question already contains the answer. Listen to its echo within you.",
  "Horizons expand when you stop looking only forward.",
  "Truth doesn't hide from you. It waits until you're ready to see it.",
  "The roots of your strength go deeper than you think. They draw from the source of eternity.",
  "You don't walk alone. Millions of stars light your path each night.",
  "The heart knows what the mind hasn't yet understood. Trust this knowing.",
  "In each dewdrop, an entire sky is reflected. You too reflect an entire universe."
];

const spanishAnswers = [
  "El camino se revela paso a paso. El silencio entre respiraciones es tu respuesta.",
  "En la profundidad del silencio nace la verdad. Ya está dentro de ti.",
  "Las estrellas hablan a través de sincronicidades. Mira con más atención el mundo que te rodea.",
  "Eres parte de la danza cósmica. Tus pasos ya están entretejidos en el patrón del universo.",
  "Las dudas son solo sombras proyectadas por la luz. Detrás de cada sombra hay una fuente de brillo.",
  "El tiempo fluye diferente para diferentes corazones. No apresures tu río.",
  "En el centro de cada tormenta hay quietud. Encuéntrala dentro de ti.",
  "Cada respiración es un diálogo con el mundo. Cada exhalación es tu acuerdo con la vida.",
  "Tu pregunta ya contiene la respuesta. Escucha su eco dentro de ti.",
  "Los horizontes se expanden cuando dejas de mirar solo hacia adelante.",
  "La verdad no se esconde de ti. Espera hasta que estés listo para verla.",
  "Las raíces de tu fuerza son más profundas de lo que piensas. Se nutren de la fuente de la eternidad.",
  "No caminas solo. Millones de estrellas iluminan tu camino cada noche.",
  "El corazón sabe lo que la mente aún no ha entendido. Confía en ese conocimiento.",
  "En cada gota de rocío se refleja un cielo entero. Tú también reflejas un universo entero."
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
    
    // Add zodiac information if available
    if (userProfile?.birthDate) {
      const zodiacSign = getZodiacSign(new Date(userProfile.birthDate));
      if (zodiacSign) {
        userData.zodiacSign = zodiacSign;
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
    
    // Use the new poetic dialogue function
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
