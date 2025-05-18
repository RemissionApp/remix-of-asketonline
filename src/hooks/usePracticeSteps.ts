
import { useTranslations } from './useTranslations';

export interface PracticeStep {
  title: string;
  instruction: string;
  visualGuide: string;
  visualImageUrl?: string; // Добавляем поле для ссылки на изображение
}

export const usePracticeSteps = (language: string) => {
  const { t } = useTranslations();
  
  const steps: PracticeStep[] = [
    {
      title: t?.affirmations?.practice?.step1 || "Find a quiet space",
      instruction: language === 'ru' 
        ? "Найдите тихое место, где вы не будете потревожены в течение 5-10 минут. Сядьте или встаньте в удобное положение, расправьте плечи и выпрямите спину, чтобы энергия могла свободно циркулировать. Расслабьте мышцы лица и опустите плечи."
        : language === 'es' 
        ? "Encuentra un lugar tranquilo donde no serás molestado durante 5-10 minutos. Siéntate o ponte de pie en una posición cómoda, con los hombros hacia atrás y la espalda recta para que la energía pueda fluir libremente. Relaja los músculos de la cara y baja los hombros."
        : "Find a quiet place where you won't be disturbed for 5-10 minutes. Sit or stand in a comfortable position, shoulders back and spine straight to allow energy to flow freely. Relax your facial muscles and drop your shoulders.",
      visualGuide: "Look around your current environment and confirm you're in a space where you can fully focus without distractions.",
      visualImageUrl: "https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/practice-images/practice_0_step_1_quiet_space.png"
    },
    {
      title: t?.affirmations?.practice?.step2 || "Take three deep breaths",
      instruction: language === 'ru' 
        ? "Сделайте три глубоких вдоха через нос, задерживая дыхание на секунду перед каждым выдохом через рот. Представьте, как с каждым вдохом вы наполняетесь позитивной энергией, а с каждым выдохом освобождаетесь от напряжения и сомнений. Почувствуйте, как ваше тело становится легче с каждым циклом дыхания."
        : language === 'es' 
        ? "Toma tres respiraciones profundas por la nariz, haciendo una pausa por un segundo antes de cada exhalación por la boca. Imagina que con cada inhalación te llenas de energía positiva, y con cada exhalación liberas tensión y dudas. Siente cómo tu cuerpo se vuelve más ligero con cada ciclo de respiración."
        : "Take three deep breaths in through your nose, holding for a second before each exhale through your mouth. Imagine with each inhale you're filling with positive energy, and with each exhale you're releasing tension and doubt. Feel your body becoming lighter with each breath cycle.",
      visualGuide: "Close your eyes or find a soft focus point at eye level about 3-6 feet in front of you. This helps center your attention.",
      visualImageUrl: "https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/practice-images/practice_0_step_2_breathing.png"
    },
    {
      title: t?.affirmations?.practice?.step3 || "Repeat the affirmation aloud",
      instruction: language === 'ru' 
        ? "Произнесите аффирмацию вслух три раза медленно и с уверенностью. Говорите четко, с эмоциональной убежденностью, словно это уже существующая истина. Уделите внимание каждому слову, наполняя его значением. Почувствуйте вибрацию вашего голоса в вашем теле, позвольте словам резонировать в вашей груди."
        : language === 'es' 
        ? "Repite la afirmación en voz alta tres veces, lenta y confiadamente. Habla con claridad y con convicción emocional, como si fuera una verdad ya existente. Presta atención a cada palabra, llenándola de significado. Siente la vibración de tu voz en tu cuerpo, permite que las palabras resuenen en tu pecho."
        : "Say the affirmation out loud three times, slowly and confidently. Speak clearly and with emotional conviction, as if it's an existing truth. Pay attention to each word, filling it with meaning. Feel the vibration of your voice in your body, allow the words to resonate in your chest.",
      visualGuide: "Look at yourself in a mirror if available, or visualize yourself succeeding as you speak. Make eye contact with your reflection to strengthen your connection to the words.",
      visualImageUrl: "https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/practice-images/practice_0_step_3_speak_aloud.png"
    },
    {
      title: t?.affirmations?.practice?.step4 || "Repeat mentally",
      instruction: language === 'ru' 
        ? "Закройте глаза и повторите аффирмацию мысленно еще три раза. В этот раз визуализируйте, как слова формируются в вашем сознании золотым или ярким светом. Представьте, как эти светящиеся слова проникают глубоко в ваше подсознание и перепрограммируют его. Позвольте этим мыслям создать эмоциональный отклик в вашем теле."
        : language === 'es' 
        ? "Cierra los ojos y repite la afirmación mentalmente tres veces más. Esta vez, visualiza las palabras formándose en tu mente con luz dorada o brillante. Imagina estas palabras luminosas penetrando profundamente en tu subconsciente y reprogramándolo. Permite que estos pensamientos creen una respuesta emocional en tu cuerpo."
        : "Close your eyes and repeat the affirmation mentally three more times. This time, visualize the words forming in your mind with golden or bright light. Imagine these luminous words penetrating deeply into your subconscious and reprogramming it. Allow these thoughts to create an emotional response in your body.",
      visualGuide: "With eyes closed, look slightly upward toward the space between your eyebrows (your third eye center), which helps activate visualization centers in the brain.",
      visualImageUrl: "https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/practice-images/practice_0_step_4_mental_repeat.png"
    },
    {
      title: t?.affirmations?.practice?.step5 || "Visualize the affirmation",
      instruction: language === 'ru' 
        ? "С закрытыми глазами представьте конкретную сцену, в которой ваша аффирмация уже стала реальностью. Создайте яркое, детальное изображение себя, живущего этой истиной. Отметьте, как вы выглядите, что чувствуете, каково это - быть в этой реальности. Активируйте все органы чувств: что вы видите, слышите, чувствуете, обоняете или даже ощущаете на вкус в этом воображаемом сценарии. Позвольте положительным эмоциям наполнить вас."
        : language === 'es' 
        ? "Con los ojos cerrados, imagina una escena específica en la que tu afirmación ya es realidad. Crea una imagen vívida y detallada de ti mismo viviendo esta verdad. Nota cómo te ves, cómo te sientes, cómo es estar en esta realidad. Activa todos tus sentidos: qué ves, oyes, sientes, hueles o incluso saboreas en este escenario imaginario. Permite que las emociones positivas te llenen."
        : "With eyes closed, imagine a specific scene where your affirmation is already reality. Create a vivid, detailed picture of yourself living this truth. Notice how you look, how you feel, what it's like to be in this reality. Activate all your senses: what you see, hear, feel, smell, or even taste in this imagined scenario. Allow positive emotions to fill you.",
      visualGuide: "With eyes still closed, bring your awareness to the center of your chest (heart center) as you visualize, connecting the affirmation to your emotional center.",
      visualImageUrl: "https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/practice-images/practice_0_step_5_visualization.png"
    }
  ];
  
  return { steps };
};
