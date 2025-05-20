
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const helpMessages = {
  // Frequently asked questions and answers about the app
  "default": "Я виртуальный ассистент приложения. Чем я могу помочь вам сегодня? Вы можете спросить о функциях приложения, о аскезах, о том как работает профиль пользователя, или о других возможностях.",
  "app_features": "Наше приложение предлагает следующие функции: создание и отслеживание аскез, чат со вселенной для получения ответов на вопросы, персональный гороскоп, медитации, нумерология и многое другое. Чем конкретно вы интересуетесь?",
  "ascesis": "Аскезы - это добровольные практики самоограничения, которые помогают тренировать силу воли и дисциплину. В нашем приложении вы можете создать аскезы разной продолжительности, следить за прогрессом и получать награды за их выполнение. Хотите узнать, как создать аскезу?",
  "create_pact": "Чтобы создать новую аскезу, перейдите на главный экран и нажмите 'Создать аскезу'. Затем введите название, выберите продолжительность (30, 60, 90 дней или свою), добавьте описание и выберите награду. После этого вам нужно будет произнести клятву, чтобы закрепить намерение.",
  "profile": "В профиле пользователя вы можете изменить свое имя, дату рождения, посмотреть информацию о знаке зодиака, сменить язык приложения и управлять подпиской. Также там отображается ваш текущий духовный ранг и достижения.",
  "subscription": "Подписка PRO открывает доступ к расширенным функциям: полный гороскоп, неограниченное количество аскез, продвинутые медитации, нумерологические расчеты и чат со вселенной. Вы можете активировать подписку через профиль.",
  "horoscope": "В приложении доступен краткий ежедневный гороскоп и полный подробный гороскоп для PRO-пользователей. Для получения гороскопа необходимо указать дату рождения в профиле.",
  "meditation": "В разделе медитаций вы найдете различные практики для расслабления, сосредоточения, утренние и вечерние медитации. Часть базовых медитаций доступна всем пользователям, а расширенные - только с PRO-подпиской.",
  "universe": "Раздел 'Вселенная' позволяет задавать вопросы и получать на них глубокие, вдумчивые ответы. Ответы формируются на основе древней мудрости и современных психологических подходов.",
  "change_language": "Чтобы изменить язык, перейдите в раздел профиля и выберите предпочитаемый язык в блоке языковых настроек. Доступны русский, английский и испанский языки.",
  "pro_features": "PRO-функции включают: полный персональный гороскоп, расширенные медитации, нумерологию, неограниченные аскезы, чат со вселенной. Хотите узнать подробнее о какой-то из этих функций?",
  "contact_developer": "Если у вас остались вопросы или предложения, вы можете написать разработчику. Для этого перейдите во вкладку 'Написать разработчику' и заполните форму обратной связи."
};

serve(async (req) => {
  // This is necessary for CORS to work
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { question, userData } = await req.json();
    
    // Extract user info if available
    const userName = userData?.userName || 'Пользователь';
    const isPro = userData?.isPro || false;
    
    // Simple keyword matching for common questions
    let answer = helpMessages.default;
    const lowercaseQuestion = question.toLowerCase();
    
    if (lowercaseQuestion.includes('функци') || lowercaseQuestion.includes('что умеет') || lowercaseQuestion.includes('возможности')) {
      answer = helpMessages.app_features;
    } else if (lowercaseQuestion.includes('аскез') && !lowercaseQuestion.includes('создать')) {
      answer = helpMessages.ascesis;
    } else if ((lowercaseQuestion.includes('аскез') || lowercaseQuestion.includes('пакт')) && (lowercaseQuestion.includes('создать') || lowercaseQuestion.includes('новый') || lowercaseQuestion.includes('добавить'))) {
      answer = helpMessages.create_pact;
    } else if (lowercaseQuestion.includes('профил')) {
      answer = helpMessages.profile;
    } else if (lowercaseQuestion.includes('подпис') || lowercaseQuestion.includes('pro')) {
      answer = helpMessages.subscription;
    } else if (lowercaseQuestion.includes('гороскоп') || lowercaseQuestion.includes('зодиак')) {
      answer = helpMessages.horoscope;
    } else if (lowercaseQuestion.includes('медитац')) {
      answer = helpMessages.meditation;
    } else if (lowercaseQuestion.includes('вселенн') || lowercaseQuestion.includes('спросить')) {
      answer = helpMessages.universe;
    } else if (lowercaseQuestion.includes('язык') || lowercaseQuestion.includes('language')) {
      answer = helpMessages.change_language;
    } else if (lowercaseQuestion.includes('про') && (lowercaseQuestion.includes('функц') || lowercaseQuestion.includes('возможности'))) {
      answer = helpMessages.pro_features;
    } else if (lowercaseQuestion.includes('разработчик') || lowercaseQuestion.includes('поддержк') || lowercaseQuestion.includes('связ')) {
      answer = helpMessages.contact_developer;
    }
    
    // Personalize the response if we have user data
    const personalizedAnswer = `${userName}, ${answer}`;
    
    // Add PRO suggestion for non-PRO users where relevant
    const proSuggestion = !isPro && (
      lowercaseQuestion.includes('гороскоп') || 
      lowercaseQuestion.includes('нумеролог') || 
      lowercaseQuestion.includes('полный') ||
      lowercaseQuestion.includes('чат') && lowercaseQuestion.includes('вселенн')
    ) ? "\n\nКстати, с PRO-подпиской вам будут доступны все расширенные функции приложения!" : "";
    
    return new Response(
      JSON.stringify({ 
        answer: personalizedAnswer + proSuggestion 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in support-assistant function:", error);
    
    return new Response(
      JSON.stringify({ error: "Произошла ошибка при обработке вашего запроса" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
