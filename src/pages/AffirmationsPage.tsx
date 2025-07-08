import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { AffirmationCard } from '@/components/AffirmationCard';
import { PageHeader } from '@/components/PageHeader';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';

// Импорт фоновых изображений
import successBg from '@/assets/affirmation-success-bg.jpg';
import confidenceBg from '@/assets/affirmation-confidence-bg.jpg';
import abundanceBg from '@/assets/affirmation-abundance-bg.jpg';
import loveBg from '@/assets/affirmation-love-bg.jpg';
import wellbeingBg from '@/assets/affirmation-wellbeing-bg.jpg';
import focusBg from '@/assets/affirmation-focus-bg.jpg';
import transformationBg from '@/assets/affirmation-transformation-bg.jpg';
import wisdomBg from '@/assets/affirmation-wisdom-bg.jpg';
import selfLoveBg from '@/assets/affirmation-self-love-bg.jpg';
import resilienceBg from '@/assets/affirmation-resilience-bg.jpg';
import growthBg from '@/assets/affirmation-growth-bg.jpg';

const AffirmationsPage: React.FC = () => {
  const { language } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Translation for the title
  const affirmationsTitle = language === 'ru' ? 'Аффирмации' : 
                          language === 'es' ? 'Afirmaciones' : 'Affirmations';

  const categories = [
    { id: "all", name: language === 'ru' ? 'Все' : language === 'es' ? 'Todos' : 'All' },
    { id: "success", name: language === 'ru' ? 'Успех' : language === 'es' ? 'Éxito' : 'Success' },
    { id: "confidence", name: language === 'ru' ? 'Уверенность' : language === 'es' ? 'Confianza' : 'Confidence' },
    { id: "wellbeing", name: language === 'ru' ? 'Благополучие' : language === 'es' ? 'Bienestar' : 'Well-being' },
    { id: "love", name: language === 'ru' ? 'Любовь' : language === 'es' ? 'Amor' : 'Love' },
    { id: "abundance", name: language === 'ru' ? 'Изобилие' : language === 'es' ? 'Abundancia' : 'Abundance' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative pb-20">
      <StarField starCount={100} />
      
      <PageHeader title={affirmationsTitle} />
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 pt-20 py-6">
        <div className="w-full max-w-2xl flex flex-col items-center">
          {/* Categories filter */}
          <div className="w-full max-w-2xl mb-6 overflow-x-auto">
            <div className="flex space-x-2 p-1 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${selectedCategory === category.id 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md' 
                      : 'bg-cosmic-dark/60 text-white/70 hover:bg-cosmic-dark/80'}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Affirmations */}
          <div className="w-full max-w-2xl space-y-4">
            <p className="text-white/80 text-center mb-8 backdrop-blur-sm bg-cosmic-dark/30 p-4 rounded-lg border border-cosmic-accent/20 max-w-2xl mx-auto">
              {language === 'ru' 
                ? 'Выберите аффирмацию, медитируйте над ней и повторяйте ежедневно для трансформирующего эффекта.'
                : language === 'es'
                  ? 'Selecciona una afirmación, medita sobre ella y repítela diariamente para un efecto transformador.'
                  : 'Choose an affirmation, meditate on it, and repeat it daily for transformative effect.'}
            </p>
            
            <AffirmationsContent selectedCategory={selectedCategory} language={language} />
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

interface AffirmationsContentProps {
  selectedCategory: string;
  language: string;
}

const AffirmationsContent: React.FC<AffirmationsContentProps> = ({ selectedCategory, language }) => {
  const affirmations = useAffirmations(language);
  
  const filteredAffirmations = selectedCategory === "all" 
    ? affirmations
    : affirmations.filter(aff => aff.categories.includes(selectedCategory));

  return (
    <>
      {filteredAffirmations.map((affirmation) => (
        <AffirmationCard 
          key={affirmation.id}
          affirmation={affirmation}
          language={language}
        />
      ))}
    </>
  );
};

// Custom hook to get affirmations based on language
const useAffirmations = (language: string) => {
  // Data for affirmations in English (default)
  const affirmationsEn = [
    {
      id: 1,
      text: "I am capable of achieving my goals and creating the life I desire.",
      instruction: "Say this affirmation while visualizing yourself having already achieved your goals. Feel the emotions of success and fulfillment.",
      action: "Write down three specific goals and read this affirmation before working on each one.",
      image: successBg,
      categories: ["success", "confidence"]
    },
    {
      id: 2,
      text: "I am confident in my abilities and trust my decisions.",
      instruction: "Stand in front of a mirror, make eye contact with yourself, and say this with conviction. Notice your posture straighten as you speak.",
      action: "Make one decision today without seeking others' approval first.",
      image: confidenceBg,
      categories: ["confidence"]
    },
    {
      id: 3,
      text: "I attract abundance and prosperity in all areas of my life.",
      instruction: "Place your hands over your heart as you say this, imagining golden light surrounding you, representing abundance flowing into your life.",
      action: "Notice and write down three instances of abundance you already have in your life.",
      image: abundanceBg,
      categories: ["abundance", "wellbeing"]
    },
    {
      id: 4,
      text: "I am worthy of love and respect from myself and others.",
      instruction: "Repeat this affirmation slowly, placing emphasis on 'worthy.' Allow yourself to truly feel deserving as you say it.",
      action: "Do one act of self-care today that honors your worth.",
      image: loveBg,
      categories: ["love", "wellbeing"]
    },
    {
      id: 5,
      text: "My mind is clear, focused, and aligned with my highest purpose.",
      instruction: "Say this while taking deep breaths, imagining each breath clearing your mind of distractions and doubts.",
      action: "Set a timer for 10 minutes of undistracted work on your most important task.",
      image: focusBg,
      categories: ["success", "wellbeing"]
    },
    {
      id: 6,
      text: "I release what no longer serves me and welcome positive transformation.",
      instruction: "Visualize yourself letting go of a weight or burden with each exhale, and welcoming in light with each inhale.",
      action: "Identify one habit or thought pattern to release today and take one small step to change it.",
      image: transformationBg,
      categories: ["wellbeing"]
    },
    {
      id: 7,
      text: "I am connected to the infinite wisdom of the universe and trust its guidance.",
      instruction: "Place your palms facing upward on your knees while seated, symbolizing your openness to receive wisdom and guidance.",
      action: "When faced with a decision today, pause and ask for guidance before responding.",
      image: wisdomBg,
      categories: ["abundance", "wellbeing"]
    },
    {
      id: 8,
      text: "I love and accept myself fully, embracing both my strengths and weaknesses.",
      instruction: "Place your hand on your heart and speak to yourself with compassion, as you would to a beloved friend.",
      action: "Write down three things you love about yourself and one area you're working on with compassion.",
      image: selfLoveBg,
      categories: ["love", "confidence"]
    },
    {
      id: 9,
      text: "I am resilient and grow stronger through life's challenges.",
      instruction: "Stand tall with your feet firmly planted, shoulders back, and repeat this affirmation with strength in your voice.",
      action: "Reflect on a past challenge and identify one way it helped you grow stronger.",
      image: resilienceBg,
      categories: ["confidence", "success"]
    },
    {
      id: 10,
      text: "Every day in every way, I am becoming better and better.",
      instruction: "Say this first thing in the morning and last thing at night, creating a mental image of your improving self.",
      action: "Identify one small improvement you can make today and commit to it.",
      image: growthBg,
      categories: ["success", "wellbeing"]
    }
  ];
  
  // Russian translations
  const affirmationsRu = [
    {
      id: 1,
      text: "Я способен(на) достигать своих целей и создавать жизнь, которую я желаю.",
      instruction: "Произносите эту аффирмацию, представляя себя уже достигшим своих целей. Почувствуйте эмоции успеха и удовлетворения.",
      action: "Запишите три конкретные цели и прочитайте эту аффирмацию перед работой над каждой из них.",
      image: successBg,
      categories: ["success", "confidence"]
    },
    {
      id: 2,
      text: "Я уверен(а) в своих способностях и доверяю своим решениям.",
      instruction: "Встаньте перед зеркалом, установите зрительный контакт с собой и произнесите это с убеждением. Обратите внимание, как выпрямляется ваша осанка, когда вы говорите.",
      action: "Примите сегодня одно решение, не ища одобрения других.",
      image: confidenceBg,
      categories: ["confidence"]
    },
    {
      id: 3,
      text: "Я привлекаю изобилие и процветание во всех сферах своей жизни.",
      instruction: "Положите руки на сердце, произнося это, представляя золотой свет вокруг вас, символизирующий изобилие, входящее в вашу жизнь.",
      action: "Отметьте и запишите три примера изобилия, которые уже есть в вашей жизни.",
      image: abundanceBg,
      categories: ["abundance", "wellbeing"]
    },
    {
      id: 4,
      text: "Я достоин(йна) любви и уважения от себя и других.",
      instruction: "Повторяйте эту аффирмацию медленно, делая акцент на слове 'достоин'. Позвольте себе по-настоящему почувствовать свою ценность.",
      action: "Выполните сегодня один акт заботы о себе, который подчеркивает вашу ценность.",
      image: loveBg,
      categories: ["love", "wellbeing"]
    },
    {
      id: 5,
      text: "Мой разум ясен, сосредоточен и настроен на мою высшую цель.",
      instruction: "Произносите это, делая глубокие вдохи, представляя, что каждый вдох очищает ваш разум от отвлекающих факторов и сомнений.",
      action: "Установите таймер на 10 минут сосредоточенной работы над самой важной задачей.",
      image: focusBg,
      categories: ["success", "wellbeing"]
    },
    {
      id: 6,
      text: "Я отпускаю то, что больше не служит мне, и приветствую позитивные перемены.",
      instruction: "Представьте, что вы отпускаете тяжесть или бремя с каждым выдохом и приветствуете свет с каждым вдохом.",
      action: "Определите одну привычку или шаблон мышления, от которого стоит отказаться сегодня, и предпримите небольшой шаг для его изменения.",
      image: transformationBg,
      categories: ["wellbeing"]
    },
    {
      id: 7,
      text: "Я связан(а) с безграничной мудростью вселенной и доверяю её руководству.",
      instruction: "Положите ладони вверх на колени, сидя, что символизирует вашу открытость для получения мудрости и руководства.",
      action: "Столкнувшись с решением сегодня, сделайте паузу и попросите руководства перед ответом.",
      image: wisdomBg,
      categories: ["abundance", "wellbeing"]
    },
    {
      id: 8,
      text: "Я люблю и принимаю себя полностью, принимая как свои сильные, так и слабые стороны.",
      instruction: "Положите руку на сердце и говорите с собой с состраданием, как с любимым другом.",
      action: "Запишите три вещи, которые вы любите в себе, и одну область, над которой вы работаете с состраданием.",
      image: selfLoveBg,
      categories: ["love", "confidence"]
    },
    {
      id: 9,
      text: "Я устойчив(а) и становлюсь сильнее благодаря жизненным испытаниям.",
      instruction: "Стойте прямо, твердо упираясь ногами, расправив плечи, и повторяйте эту аффирмацию с силой в голосе.",
      action: "Подумайте о прошлом испытании и определите, как оно помогло вам стать сильнее.",
      image: resilienceBg,
      categories: ["confidence", "success"]
    },
    {
      id: 10,
      text: "Каждый день во всех отношениях я становлюсь лучше и лучше.",
      instruction: "Говорите это первым делом утром и последним делом вечером, создавая мысленный образ вашего совершенствующегося я.",
      action: "Определите одно небольшое улучшение, которое вы можете сделать сегодня, и обязуйтесь его выполнить.",
      image: growthBg,
      categories: ["success", "wellbeing"]
    }
  ];

  // Spanish translations
  const affirmationsEs = [
    {
      id: 1,
      text: "Soy capaz de lograr mis objetivos y crear la vida que deseo.",
      instruction: "Di esta afirmación mientras te visualizas habiendo logrado ya tus objetivos. Siente las emociones de éxito y realización.",
      action: "Escribe tres objetivos específicos y lee esta afirmación antes de trabajar en cada uno.",
      image: successBg,
      categories: ["success", "confidence"]
    },
    {
      id: 2,
      text: "Confío en mis habilidades y en mis decisiones.",
      instruction: "Párate frente a un espejo, haz contacto visual contigo mismo y di esto con convicción. Nota cómo tu postura se endereza mientras hablas.",
      action: "Toma una decisión hoy sin buscar la aprobación de otros primero.",
      image: confidenceBg,
      categories: ["confidence"]
    },
    {
      id: 3,
      text: "Atraigo abundancia y prosperidad en todas las áreas de mi vida.",
      instruction: "Coloca tus manos sobre tu corazón mientras dices esto, imaginando una luz dorada que te rodea, representando la abundancia fluyendo en tu vida.",
      action: "Nota y escribe tres ejemplos de abundancia que ya tienes en tu vida.",
      image: abundanceBg,
      categories: ["abundance", "wellbeing"]
    },
    {
      id: 4,
      text: "Soy digno de amor y respeto de mí mismo y de los demás.",
      instruction: "Repite esta afirmación lentamente, poniendo énfasis en 'digno'. Permítete sentirte verdaderamente merecedor mientras lo dices.",
      action: "Realiza un acto de autocuidado hoy que honre tu valor.",
      image: loveBg,
      categories: ["love", "wellbeing"]
    },
    {
      id: 5,
      text: "Mi mente está clara, enfocada y alineada con mi propósito más elevado.",
      instruction: "Di esto mientras respiras profundamente, imaginando que cada respiración despeja tu mente de distracciones y dudas.",
      action: "Configura un temporizador para 10 minutos de trabajo sin distracciones en tu tarea más importante.",
      image: focusBg,
      categories: ["success", "wellbeing"]
    },
    {
      id: 6,
      text: "Libero lo que ya no me sirve y acojo la transformación positiva.",
      instruction: "Visualízate liberando un peso o carga con cada exhalación y recibiendo luz con cada inhalación.",
      action: "Identifica un hábito o patrón de pensamiento para liberar hoy y da un pequeño paso para cambiarlo.",
      image: transformationBg,
      categories: ["wellbeing"]
    },
    {
      id: 7,
      text: "Estoy conectado a la sabiduría infinita del universo y confío en su guía.",
      instruction: "Coloca tus palmas hacia arriba sobre tus rodillas mientras estás sentado, simbolizando tu apertura para recibir sabiduría y orientación.",
      action: "Cuando te enfrentes a una decisión hoy, haz una pausa y pide orientación antes de responder.",
      image: wisdomBg,
      categories: ["abundance", "wellbeing"]
    },
    {
      id: 8,
      text: "Me amo y me acepto completamente, abrazando tanto mis fortalezas como mis debilidades.",
      instruction: "Coloca tu mano sobre tu corazón y háblate con compasión, como lo harías con un querido amigo.",
      action: "Escribe tres cosas que amas de ti mismo y un área en la que estás trabajando con compasión.",
      image: selfLoveBg,
      categories: ["love", "confidence"]
    },
    {
      id: 9,
      text: "Soy resiliente y me hago más fuerte a través de los desafíos de la vida.",
      instruction: "Párate erguido con los pies firmemente plantados, hombros hacia atrás, y repite esta afirmación con fuerza en tu voz.",
      action: "Reflexiona sobre un desafío pasado e identifica una forma en que te ayudó a hacerte más fuerte.",
      image: resilienceBg,
      categories: ["confidence", "success"]
    },
    {
      id: 10,
      text: "Cada día, en todos los sentidos, me estoy volviendo mejor y mejor.",
      instruction: "Di esto lo primero por la mañana y lo último por la noche, creando una imagen mental de tu yo que mejora.",
      action: "Identifica una pequeña mejora que puedas hacer hoy y comprométete con ella.",
      image: growthBg,
      categories: ["success", "wellbeing"]
    }
  ];

  // Return the appropriate language version
  switch(language) {
    case 'ru':
      return affirmationsRu;
    case 'es':
      return affirmationsEs;
    default:
      return affirmationsEn;
  }
};

export default AffirmationsPage;
