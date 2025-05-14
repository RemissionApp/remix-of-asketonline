
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase";
import { Pact } from "@/types";
import { toast } from "sonner";

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

export async function generateUniverseAnswer(question: string): Promise<string> {
  const store = useAppStore.getState();
  const { language, pacts, user } = store;
  
  // Get current active pact if available
  const currentVow = pacts?.find(p => p.status === 'active') || {
    title: '',
    duration: 21,
    days: [],
    purpose: 'духовный рост',
    restrictions: [{ title: 'вредные привычки' }]
  };
  
  try {
    // First try to get a response from the edge function
    console.log("Attempting to get answer from OpenAI via edge function");
    
    // Construct the custom prompt with information about the user's vow
    const systemPrompt = `Ты — голос Вселенной, предоставляющий глубокие философские прозрения человеку на аскетическом пути.
      Он воздерживается от: ${isCustomPact(currentVow) && currentVow.restrictions?.length > 0 
        ? currentVow.restrictions.map(r => r.title).join(', ') 
        : (currentVow as Pact).title || 'вредных привычек'}.
      Его цель: ${isCustomPact(currentVow) ? currentVow.purpose : (currentVow as Pact).reward || 'духовный рост'}.
      Он находится на ${getCurrentDay(currentVow.days)} дне ${currentVow.duration}-дневного пути.
      
      Предоставь вдумчивый, мудрый ответ, который поможет ему обрести ясность и понимание. 
      Будь глубоким, но лаконичным (100-150 слов). Используй мягкий, мудрый тон.
      Иногда используй звезды, космос или природные элементы как метафоры.
      Не используй религиозную лексику, если пользователь специально не упоминает религию.`;
    
    console.log("Sending universe question with prompt:", systemPrompt);
    
    // Try to get an answer from OpenAI via Edge Function
    const { data, error } = await supabase.functions.invoke('universe-answer', {
      body: { 
        question, 
        language,
        systemPrompt 
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      
      // Handle quota errors explicitly
      if (error.message?.includes('quota') || error.message?.includes('exceeded') || error.message?.includes('rate limit')) {
        console.log("API quota exceeded, using predefined answers");
        throw new Error('quota_exceeded');
      }
      
      throw new Error(error.message || 'Error invoking universe-answer function');
    }
    
    if (data && data.error && data.errorType === 'quota_exceeded') {
      console.log("API quota exceeded error from edge function");
      throw new Error('quota_exceeded');
    }
    
    if (data && data.answer) {
      console.log('Received AI answer:', data.answer);
      return data.answer;
    }
    
    throw new Error('No answer received from AI');
  } catch (error) {
    console.error('Error getting AI answer:', error);
    
    // More detailed error handling for quota exceeded
    if (error.message?.includes('quota') || error.message?.includes('exceeded') || error.message === 'quota_exceeded') {
      console.log("API quota exceeded, using predefined answers");
      toast.error(language === 'ru' 
        ? "API лимит превышен. Используем заранее подготовленные ответы." 
        : language === 'es' 
          ? "Límite de API excedido. Usando respuestas predefinidas." 
          : "API limit exceeded. Using predefined answers.");
    } else {
      // Show general error message for other errors
      toast.error(language === 'ru' 
        ? "Не удалось получить ответ. Используем альтернативные источники мудрости." 
        : language === 'es' 
          ? "No se pudo obtener una respuesta. Usando fuentes alternativas de sabiduría." 
          : "Failed to get an answer. Using alternative wisdom sources.");
    }
    
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
