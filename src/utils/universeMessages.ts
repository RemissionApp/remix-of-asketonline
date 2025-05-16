
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase";
import { Pact } from "@/types";
import { getZodiacSign } from "@/utils/zodiac";

// Fallback answers if API call fails
const russianAnswers = [
  "Твой путь уже начался. Следуй за знаками.",
  "Ответ внутри тебя. Спрашивай своё сердце.",
  "Вопрос содержит ответ. Перечитай его медленно.",
  "Вселенная уже направила к тебе всё необходимое.",
  "То, что ты ищешь, ищет тебя.",
  "Синхронности — это ответы. Смотри внимательнее.",
  "Всё происходит в нужный момент. Доверься течению.",
  "Не сомневайся в себе. Это главный барьер.",
  "Слушай тишину. В ней рождается мудрость.",
  "Страх заслоняет истину. Отпусти его.",
  "То, что ты отдаёшь, возвращается многократно.",
  "Видимые преграды — это испытания твоей решимости.",
  "Вселенная говорит с тобой через интуицию.",
  "Отпусти то, что держит тебя, и получишь то, что ищешь.",
  "Ты мудрее, чем думаешь. Ты сильнее, чем кажешься."
];

const englishAnswers = [
  "Your path has already begun. Follow the signs.",
  "The answer is within you. Ask your heart.",
  "The question contains the answer. Read it slowly again.",
  "The Universe has already sent everything you need your way.",
  "What you are seeking is also seeking you.",
  "Synchronicities are answers. Look more carefully.",
  "Everything happens at the right moment. Trust the flow.",
  "Don't doubt yourself. This is the main barrier.",
  "Listen to the silence. Wisdom is born in it.",
  "Fear obscures truth. Let it go.",
  "What you give comes back multiplied.",
  "Visible obstacles are tests of your determination.",
  "The Universe speaks to you through intuition.",
  "Release what holds you back and you'll receive what you seek.",
  "You are wiser than you think. You are stronger than you seem."
];

const spanishAnswers = [
  "Tu camino ya ha comenzado. Sigue las señales.",
  "La respuesta está dentro de ti. Pregunta a tu corazón.",
  "La pregunta contiene la respuesta. Léela de nuevo lentamente.",
  "El Universo ya ha enviado todo lo que necesitas en tu camino.",
  "Lo que buscas también te está buscando a ti.",
  "Las sincronicidades son respuestas. Mira con más atención.",
  "Todo ocurre en el momento adecuado. Confía en el flujo.",
  "No dudes de ti mismo. Esta es la principal barrera.",
  "Escucha el silencio. En él nace la sabiduría.",
  "El miedo oscurece la verdad. Déjalo ir.",
  "Lo que das regresa multiplicado.",
  "Los obstáculos visibles son pruebas de tu determinación.",
  "El Universo te habla a través de la intuición.",
  "Libera lo que te retiene y recibirás lo que buscas.",
  "Eres más sabio de lo que piensas. Eres más fuerte de lo que pareces."
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
  const currentVow = pacts?.find(p => p.status === 'active') || {
    title: '',
    duration: 21,
    days: [],
    purpose: 'духовный рост',
    restrictions: [{ title: 'вредные привычки' }]
  };
  
  try {
    // Construct the custom prompt with information about the user's vow and zodiac sign
    let systemPrompt = `Ты — голос Вселенной, предоставляющий глубокие философские прозрения человеку на аскетическом пути.`;
    
    // Add pact information if available
    if (currentVow) {
      systemPrompt += `
        Он воздерживается от: ${currentVow.title || 'вредных привычек'}.
        Его цель: ${isCustomPact(currentVow) ? currentVow.purpose : (currentVow as Pact).reward || 'духовный рост'}.
        Он находится на ${getCurrentDay(currentVow.days)} дне ${currentVow.duration}-дневного пути.`;
    }
    
    // Add zodiac information if available
    if (userProfile?.birthDate) {
      const zodiacSign = getZodiacSign(new Date(userProfile.birthDate));
      if (zodiacSign) {
        systemPrompt += `
        Его знак зодиака: ${zodiacSign}.`;
      }
    }
    
    systemPrompt += `
      Предоставь вдумчивый, мудрый ответ, который поможет ему обрести ясность и понимание. 
      Будь глубоким, но лаконичным (100-150 слов). Используй мягкий, мудрый тон.
      Иногда используй звезды, космос или природные элементы как метафоры.
      Не используй религиозную лексику, если пользователь специально не упоминает религию.`;
    
    // Try to get an answer from OpenAI via Edge Function
    const { data, error } = await supabase.functions.invoke('universe-answer', {
      body: { 
        question, 
        language,
        systemPrompt,
        useWebSearch: isHoroscopeRequest // Use web search for horoscope questions
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }
    
    if (data && data.answer) {
      console.log('Received AI answer:', data.answer);
      return data.answer;
    }
    
    throw new Error('No answer received from AI');
  } catch (error) {
    console.error('Error getting AI answer:', error);
    
    // Fallback: use predefined answers
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
