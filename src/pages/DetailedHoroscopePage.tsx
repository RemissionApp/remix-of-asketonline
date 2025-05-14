
import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';

interface DetailedHoroscope {
  description: string;
  lucky_number: string;
  lucky_time: string;
  color: string;
  mood: string;
}

const DetailedHoroscopePage: React.FC = () => {
  const [horoscope, setHoroscope] = useState<DetailedHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const { userProfile, language } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get zodiac sign info
  const zodiacSign = userProfile?.birthDate ? getZodiacSign(userProfile.birthDate) : null;
  const zodiacInfo = zodiacSign ? zodiacData[zodiacSign] : null;
  
  // Translations
  const translations = {
    title: {
      ru: `${userProfile?.name || 'Искатель'}, это твой день!`,
      en: `${userProfile?.name || 'Seeker'}, this is your day!`,
      es: `${userProfile?.name || 'Buscador'}, ¡este es tu día!`
    },
    backButton: {
      ru: 'Назад',
      en: 'Back',
      es: 'Atrás'
    },
    loading: {
      ru: 'Раскрываем тайны звезд...',
      en: 'Revealing the mysteries of the stars...',
      es: 'Revelando los misterios de las estrellas...'
    },
    luckyNumber: {
      ru: 'Счастливое число',
      en: 'Lucky Number',
      es: 'Número de la Suerte'
    },
    luckyTime: {
      ru: 'Удачное время',
      en: 'Lucky Time',
      es: 'Hora de la Suerte'
    },
    color: {
      ru: 'Цвет дня',
      en: 'Color of the Day',
      es: 'Color del Día'
    },
    mood: {
      ru: 'Настроение',
      en: 'Mood',
      es: 'Estado de Ánimo'
    },
    proTitle: {
      ru: `${userProfile?.name || 'Искатель'}, это твой день!`,
      en: `${userProfile?.name || 'Seeker'}, this is your day!`,
      es: `${userProfile?.name || 'Buscador'}, ¡este es tu día!`
    },
    proMessage: {
      ru: 'Узнайте, что звезды приготовили для вас сегодня в полной версии',
      en: 'Discover what the stars have prepared for you today in the full version',
      es: 'Descubre lo que las estrellas han preparado para ti hoy en la versión completa'
    }
  };

  useEffect(() => {
    const fetchDetailedHoroscope = async () => {
      if (!userProfile?.isPro) {
        // For non-PRO users, just set loading to false without fetching
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Check if user has birth date to determine zodiac sign
        if (!userProfile?.birthDate || !zodiacSign) {
          setLoading(false);
          return;
        }
        
        // Try to get cached detailed horoscope for today
        const today = new Date().toISOString().split('T')[0];
        const cachedHoroscope = localStorage.getItem(`horoscope_${zodiacSign}_${today}_detailed`);
        
        if (cachedHoroscope) {
          setHoroscope(JSON.parse(cachedHoroscope));
          setLoading(false);
          return;
        }
        
        // Generate fallback data since the edge function is failing
        const generateHoroscopeText = (sign: string, lang: string): string => {
          const texts = {
            ru: {
              aries: 'Сегодня ваша энергия и решительность на пике. Используйте этот день для важных начинаний и активных действий. Доверьтесь своей интуиции в принятии решений. В личных отношениях проявите больше терпения и понимания. Финансовые вложения сегодня могут оказаться особенно удачными. Вечер лучше провести в спокойной обстановке, восстанавливая силы.',
              taurus: 'День благоприятен для материальных вопросов. Ваша практичность поможет решить финансовые проблемы. В работе возможны новые интересные предложения. Уделите внимание здоровью и правильному питанию. В личной жизни наступает период гармонии и понимания. Вечер хорош для общения с близкими людьми и создания уютной атмосферы.',
              gemini: 'Сегодня вам стоит сосредоточиться на общении и новых знакомствах. Возможно получение важной информации, которая изменит ваши планы. В работе проявите гибкость и адаптивность. Финансовое положение стабильно, но крупные траты лучше отложить. В личной жизни возможны приятные сюрпризы. Вечер подходит для интеллектуальных развлечений.',
              cancer: 'День подходит для домашних дел и заботы о близких. Ваша эмоциональная интуиция сейчас особенно сильна. В работе возможны небольшие трудности, но вы справитесь с ними с помощью коллег. Финансовое положение требует внимания и планирования. В личных отношениях проявите больше открытости. Вечер хорош для семейного ужина.',
              leo: 'Сегодня ваша харизма и лидерские качества особенно заметны. Используйте это для продвижения своих идей. В работе возможно признание ваших заслуг. Финансовое положение улучшается. В личной жизни вас ждут яркие эмоции и приятные моменты. Вечер подходит для творческой самореализации и развлечений.',
              virgo: 'День благоприятен для анализа и планирования. Ваше внимание к деталям поможет избежать ошибок. В работе сосредоточьтесь на завершении начатых проектов. Финансовое положение стабильно, но требует внимательного учета. В личной жизни возможны небольшие недопонимания. Вечер подходит для самообразования и чтения.',
              libra: 'Сегодня вам особенно важно поддерживать баланс во всех сферах жизни. В работе возможны интересные партнерские предложения. Финансовое положение улучшается благодаря вашей дипломатии. В личной жизни гармония и взаимопонимание. Вечер хорош для культурных мероприятий и общения с друзьями.',
              scorpio: 'День наполнен глубокими эмоциями и интуитивными озарениями. В работе вы можете раскрыть тайны или найти скрытые возможности. Финансовое положение требует осторожности в инвестициях. В личной жизни возможны страстные проявления чувств. Вечер подходит для медитации и самопознания.',
              sagittarius: 'Сегодня ваш оптимизм и энтузиазм заразительны. Используйте это для расширения своих горизонтов. В работе возможны новые перспективы и путешествия. Финансовое положение стабильно, но требует планирования. В личной жизни приключения и новые впечатления. Вечер хорош для философских бесед и планирования будущего.',
              capricorn: 'День благоприятен для карьерных достижений и профессионального роста. Ваша дисциплина и ответственность приносят плоды. Финансовое положение улучшается благодаря правильным решениям. В личной жизни стабильность и поддержка. Вечер подходит для планирования долгосрочных целей.',
              aquarius: 'Сегодня ваша оригинальность и нестандартное мышление особенно ценны. В работе возможны инновационные решения и неожиданные повороты. Финансовое положение связано с коллективными проектами. В личной жизни стремление к свободе и независимости. Вечер хорош для общения с единомышленниками и планирования будущего.',
              pisces: 'День наполнен творческим вдохновением и эмпатией. В работе используйте свою интуицию для решения сложных задач. Финансовое положение нестабильно, требует внимания. В личной жизни глубокая эмоциональная связь с близкими. Вечер подходит для искусства, музыки и духовных практик.'
            },
            en: {
              aries: 'Today your energy and determination are at their peak. Use this day for important beginnings and active actions. Trust your intuition in decision making. In personal relationships, show more patience and understanding. Financial investments today can be particularly successful. It\'s best to spend the evening in a calm environment, restoring your strength.',
              taurus: 'The day is favorable for material matters. Your practicality will help solve financial problems. At work, new interesting offers are possible. Pay attention to health and proper nutrition. In your personal life, a period of harmony and understanding begins. The evening is good for communicating with loved ones and creating a cozy atmosphere.',
              gemini: 'Today you should focus on communication and new acquaintances. It is possible to receive important information that will change your plans. At work, show flexibility and adaptability. The financial situation is stable, but it is better to postpone large expenses. In personal life, pleasant surprises are possible. The evening is suitable for intellectual entertainment.',
              cancer: 'The day is suitable for household chores and taking care of loved ones. Your emotional intuition is especially strong now. At work, small difficulties are possible, but you will cope with them with the help of colleagues. The financial situation requires attention and planning. In personal relationships, show more openness. The evening is good for a family dinner.',
              leo: 'Today your charisma and leadership qualities are especially noticeable. Use this to promote your ideas. At work, recognition of your merits is possible. The financial situation is improving. In your personal life, bright emotions and pleasant moments await you. The evening is suitable for creative self-realization and entertainment.',
              virgo: 'The day is favorable for analysis and planning. Your attention to detail will help avoid mistakes. At work, focus on completing projects you have started. The financial situation is stable, but requires careful accounting. In personal life, small misunderstandings are possible. The evening is suitable for self-education and reading.',
              libra: 'Today it is especially important for you to maintain balance in all areas of life. At work, interesting partnership offers are possible. The financial situation is improving thanks to your diplomacy. In personal life, harmony and mutual understanding. The evening is good for cultural events and socializing with friends.',
              scorpio: 'The day is filled with deep emotions and intuitive insights. At work, you can reveal secrets or find hidden opportunities. The financial situation requires caution in investments. In personal life, passionate expressions of feelings are possible. The evening is suitable for meditation and self-knowledge.',
              sagittarius: 'Today your optimism and enthusiasm are contagious. Use this to expand your horizons. At work, new perspectives and travel are possible. The financial situation is stable, but requires planning. In personal life, adventures and new impressions. The evening is good for philosophical conversations and planning for the future.',
              capricorn: 'The day is favorable for career achievements and professional growth. Your discipline and responsibility are bearing fruit. The financial situation is improving thanks to the right decisions. In personal life, stability and support. The evening is suitable for planning long-term goals.',
              aquarius: 'Today your originality and non-standard thinking are especially valuable. At work, innovative solutions and unexpected turns are possible. The financial situation is related to collective projects. In personal life, the desire for freedom and independence. The evening is good for communicating with like-minded people and planning for the future.',
              pisces: 'The day is filled with creative inspiration and empathy. At work, use your intuition to solve complex problems. The financial situation is unstable, requires attention. In personal life, a deep emotional connection with loved ones. The evening is suitable for art, music and spiritual practices.'
            },
            es: {
              aries: 'Hoy tu energía y determinación están en su punto máximo. Usa este día para inicios importantes y acciones activas. Confía en tu intuición para tomar decisiones. En las relaciones personales, muestra más paciencia y comprensión. Las inversiones financieras hoy pueden ser particularmente exitosas. Es mejor pasar la noche en un ambiente tranquilo, recuperando fuerzas.',
              taurus: 'El día es favorable para asuntos materiales. Tu practicidad ayudará a resolver problemas financieros. En el trabajo, son posibles nuevas ofertas interesantes. Presta atención a la salud y a la alimentación adecuada. En tu vida personal, comienza un período de armonía y comprensión. La noche es buena para comunicarte con tus seres queridos y crear un ambiente acogedor.',
              gemini: 'Hoy deberías centrarte en la comunicación y en nuevos conocidos. Es posible recibir información importante que cambiará tus planes. En el trabajo, muestra flexibilidad y adaptabilidad. La situación financiera es estable, pero es mejor posponer grandes gastos. En la vida personal, son posibles sorpresas agradables. La noche es adecuada para entretenimiento intelectual.',
              cancer: 'El día es adecuado para las tareas domésticas y el cuidado de los seres queridos. Tu intuición emocional es especialmente fuerte ahora. En el trabajo, son posibles pequeñas dificultades, pero las superarás con la ayuda de colegas. La situación financiera requiere atención y planificación. En las relaciones personales, muestra más apertura. La noche es buena para una cena familiar.',
              leo: 'Hoy tu carisma y cualidades de liderazgo son especialmente notorias. Úsalo para promover tus ideas. En el trabajo, es posible el reconocimiento de tus méritos. La situación financiera está mejorando. En tu vida personal, te esperan emociones brillantes y momentos agradables. La noche es adecuada para la autorrealización creativa y el entretenimiento.',
              virgo: 'El día es favorable para el análisis y la planificación. Tu atención al detalle ayudará a evitar errores. En el trabajo, concéntrate en completar proyectos que hayas iniciado. La situación financiera es estable, pero requiere una contabilidad cuidadosa. En la vida personal, son posibles pequeños malentendidos. La noche es adecuada para la autoeducación y la lectura.',
              libra: 'Hoy es especialmente importante para ti mantener el equilibrio en todas las áreas de la vida. En el trabajo, son posibles ofertas de asociación interesantes. La situación financiera está mejorando gracias a tu diplomacia. En la vida personal, armonía y entendimiento mutuo. La noche es buena para eventos culturales y socializar con amigos.',
              scorpio: 'El día está lleno de emociones profundas e ideas intuitivas. En el trabajo, puedes revelar secretos o encontrar oportunidades ocultas. La situación financiera requiere precaución en las inversiones. En la vida personal, son posibles expresiones apasionadas de sentimientos. La noche es adecuada para la meditación y el autoconocimiento.',
              sagittarius: 'Hoy tu optimismo y entusiasmo son contagiosos. Úsalo para expandir tus horizontes. En el trabajo, son posibles nuevas perspectivas y viajes. La situación financiera es estable, pero requiere planificación. En la vida personal, aventuras y nuevas impresiones. La noche es buena para conversaciones filosóficas y planificar el futuro.',
              capricorn: 'El día es favorable para logros profesionales y crecimiento profesional. Tu disciplina y responsabilidad están dando frutos. La situación financiera está mejorando gracias a las decisiones correctas. En la vida personal, estabilidad y apoyo. La noche es adecuada para planificar objetivos a largo plazo.',
              aquarius: 'Hoy tu originalidad y pensamiento no estándar son especialmente valiosos. En el trabajo, son posibles soluciones innovadoras y giros inesperados. La situación financiera está relacionada con proyectos colectivos. En la vida personal, el deseo de libertad e independencia. La noche es buena para comunicarse con personas afines y planificar el futuro.',
              pisces: 'El día está lleno de inspiración creativa y empatía. En el trabajo, usa tu intuición para resolver problemas complejos. La situación financiera es inestable, requiere atención. En la vida personal, una conexión emocional profunda con los seres queridos. La noche es adecuada para el arte, la música y las prácticas espirituales.'
            }
          };

          return zodiacSign && lang in texts && zodiacSign in texts[lang] 
            ? texts[lang][zodiacSign]
            : 'Звезды сегодня особенно благосклонны к вам. Воспользуйтесь этой энергией для достижения своих целей и мечтаний.';
        };

        // Generate fallback horoscope
        const fallbackHoroscope = {
          description: generateHoroscopeText(zodiacSign, language),
          lucky_number: Math.floor(Math.random() * 100).toString(),
          lucky_time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
          color: ['красный', 'синий', 'зеленый', 'фиолетовый', 'оранжевый', 'розовый', 'золотой'][Math.floor(Math.random() * 7)],
          mood: ['радостный', 'задумчивый', 'спокойный', 'энергичный', 'вдохновленный'][Math.floor(Math.random() * 5)]
        };
        
        // Set the horoscope and cache it
        setHoroscope(fallbackHoroscope);
        localStorage.setItem(`horoscope_${zodiacSign}_${today}_detailed`, JSON.stringify(fallbackHoroscope));
      } catch (error) {
        console.error('Error fetching detailed horoscope:', error);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetailedHoroscope();
  }, [userProfile?.birthDate, userProfile?.isPro, zodiacSign, language, toast, userProfile?.name]);
  
  const renderDetailedHoroscope = () => {
    if (!userProfile?.isPro) {
      return (
        <ProFeatureOverlay
          title={translations.proTitle[language] || translations.proTitle.en}
          message={translations.proMessage[language] || translations.proMessage.en}
        >
          <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="text-cosmic-gold" size={20} />
                {translations.title[language] || translations.title.en}
              </CardTitle>
              <CardDescription>
                {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 bg-cosmic-accent/10 rounded-md" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
                <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
                <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
                <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </ProFeatureOverlay>
      );
    }
    
    if (loading || !horoscope) {
      return (
        <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="text-cosmic-gold" size={20} />
              {translations.title[language] || translations.title.en}
            </CardTitle>
            <CardDescription>
              {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-cosmic-accent/70 italic text-center">
              {translations.loading[language] || translations.loading.en}
            </p>
            <Skeleton className="h-32 bg-cosmic-accent/10 rounded-md" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
              <Skeleton className="h-8 bg-cosmic-accent/10 rounded-md" />
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card className="border-cosmic-accent/20 bg-cosmic-dark/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-cosmic-gold" size={20} />
            {translations.title[language] || translations.title.en}
          </CardTitle>
          <CardDescription>
            {zodiacInfo?.symbol} {zodiacInfo?.name[language] || zodiacInfo?.name.en || ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="cosmic-gradient-text text-base font-serif leading-relaxed whitespace-pre-wrap">
            {horoscope.description}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mt-6 text-cosmic-accent">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {translations.luckyNumber[language] || translations.luckyNumber.en}:
              </span>
              <span>{horoscope.lucky_number}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {translations.luckyTime[language] || translations.luckyTime.en}:
              </span>
              <span>{horoscope.lucky_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {translations.color[language] || translations.color.en}:
              </span>
              <span>{horoscope.color}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {translations.mood[language] || translations.mood.en}:
              </span>
              <span>{horoscope.mood}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={150} />
      <TopBar />
      
      <Button
        variant="ghost"
        className="absolute top-20 left-4 z-20 text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20"
        onClick={() => navigate('/main')}
      >
        <ArrowLeft size={16} className="mr-2" />
        {translations.backButton[language] || translations.backButton.en}
      </Button>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 mt-16">
        <div className="w-full max-w-lg">
          {renderDetailedHoroscope()}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default DetailedHoroscopePage;
