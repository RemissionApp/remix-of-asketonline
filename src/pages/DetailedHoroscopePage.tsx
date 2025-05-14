import React, { useEffect, useState } from 'react';
import { StarField } from '@/components/StarField';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Star, Briefcase, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';

interface DetailedHoroscope {
  work: string;
  love: string;
  health: string;
  advice: string;
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
    work: {
      ru: 'Работа и финансы',
      en: 'Work and Finances',
      es: 'Trabajo y Finanzas'
    },
    love: {
      ru: 'Любовь и отношения',
      en: 'Love and Relationships',
      es: 'Amor y Relaciones'
    },
    health: {
      ru: 'Здоровье и самочувствие',
      en: 'Health and Wellbeing',
      es: 'Salud y Bienestar'
    },
    advice: {
      ru: 'Совет дня',
      en: 'Daily Advice',
      es: 'Consejo del Día'
    },
    closing: {
      ru: 'Пусть ваш день будет продуктивным и гармоничным!',
      en: 'May your day be productive and harmonious!',
      es: '¡Que tu día sea productivo y armonioso!'
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
        const generateHoroscopeText = (sign: string, lang: string, section: string): string => {
          const texts = {
            work: {
              ru: {
                aries: 'Сегодня вам предстоит активная деятельность в профессиональной сфере. Возможны новые проекты или задачи, требующие быстрого решения. Финансовое положение стабильно, но от крупных трат лучше воздержаться.',
                taurus: 'День благоприятен для финансовых операций и инвестиций. Ваша практичность поможет принять верные решения. В рабочих вопросах проявите настойчивость - это принесет результаты.',
                gemini: 'Сегодня ожидается множество коммуникаций по работе. Вероятны интересные деловые предложения. Финансовая ситуация требует внимания - обратите внимание на мелкие расходы.',
                cancer: 'В профессиональной сфере сегодня потребуется осторожность. Избегайте конфликтов с коллегами. В финансовых вопросах возможны неожиданные поступления или находки.',
                leo: 'Ваши лидерские качества сегодня будут особенно заметны. Используйте их для продвижения рабочих проектов. В финансовом плане день стабилен, возможны небольшие поступления.',
                virgo: 'Сосредоточьтесь на завершении ранее начатых проектов. День благоприятен для решения интеллектуальных задач. Финансовое положение улучшается, возможны неожиданные доходы.',
                libra: 'Сегодня вам потребуется дипломатичность в решении рабочих вопросов. Финансовые решения лучше отложить на другой день. Сконцентрируйтесь на улучшении взаимоотношений в коллективе.',
                scorpio: 'День подходит для глубокого анализа и стратегического планирования. В финансах проявите осторожность, особенно в вопросах инвестирования. Возможны скрытые возможности для заработка.',
                sagittarius: 'Энергичный день для профессиональной деятельности. Возможно расширение деловых контактов или путешествия по работе. Финансовое положение улучшается благодаря новым проектам.',
                capricorn: 'Сегодня стоит сосредоточиться на карьерных целях. Систематичный подход принесет хорошие результаты. В финансовых вопросах проявите консервативность и осторожность.',
                aquarius: 'День благоприятен для нестандартных решений в работе и инновационных идей. Финансовое положение стабильно, но может потребоваться пересмотр бюджета или долгосрочных вложений.',
                pisces: 'Интуиция поможет вам сегодня в принятии важных решений по работе. В финансовых вопросах избегайте импульсивных трат и доверяйте своему внутреннему голосу.'
              },
              en: {
                aries: 'Today your energy and determination are at their peak. Use this day for important beginnings and active actions. Trust your intuition in decision making. In personal relationships, show more patience and understanding. Financial investments today can be particularly successful. It\'s best to spend the evening in a calm environment, restoring your strength.',
                taurus: 'The day is favorable for material matters. Your practicality will help solve financial problems. At work, new interesting offers are possible. Pay attention to health and proper nutrition. In your personal life, a period of harmony and understanding begins. The evening is good for communicating with loved ones and creating a cozy atmosphere.',
                gemini: 'Today you should focus on communication and new acquaintances. It is possible to receive important information that will change your plans. At work, show flexibility and adaptability. The financial situation is stable, but it is better to postpone large expenses. In personal life, pleasant surprises are possible. The evening is suitable for intellectual entertainment.',
                cancer: 'The day is suitable for household chores and taking care of loved ones. Your emotional intuition is especially strong now. At work, small difficulties are possible, but you will cope with them with the help of colleagues. The financial situation requires attention and planning. In personal relationships, show more openness. The evening is good for a family dinner.',
                leo: 'The day is suitable for your charisma and leadership qualities. Use this to promote your ideas. At work, recognition of your merits is possible. The financial situation is improving. In your personal life, bright emotions and pleasant moments await you. The evening is suitable for creative self-realization and entertainment.',
                virgo: 'The day is favorable for analysis and planning. Your attention to detail will help avoid mistakes. At work, focus on completing projects you have started. The financial situation is stable, but requires careful accounting. In personal life, small misunderstandings are possible. The evening is suitable for self-education and reading.',
                libra: 'The day is especially important for you to maintain balance in all areas of life. At work, interesting partnership offers are possible. The financial situation is improving thanks to your diplomacy. In personal life, harmony and mutual understanding. The evening is good for cultural events and socializing with friends.',
                scorpio: 'The day is filled with deep emotions and intuitive insights. At work, you can reveal secrets or find hidden opportunities. The financial situation requires caution in investments. In personal life, passionate expressions of feelings are possible. The evening is suitable for meditation and self-knowledge.',
                sagittarius: 'The day is filled with optimism and enthusiasm. Use this to expand your horizons. At work, new perspectives and travel are possible. The financial situation is stable, but requires planning. In personal life, adventures and new impressions. The evening is good for philosophical conversations and planning for the future.',
                capricorn: 'The day is favorable for career achievements and professional growth. Your discipline and responsibility are bearing fruit. The financial situation is improving thanks to the right decisions. In personal life, stability and support. The evening is suitable for planning long-term goals.',
                aquarius: 'The day is favorable for originality and non-standard thinking. At work, innovative solutions and unexpected turns are possible. The financial situation is related to collective projects. In personal life, the desire for freedom and independence. The evening is good for communicating with like-minded people and planning for the future.',
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
                aquarius: 'El día es favorable para originalidad y pensamiento no estándar. En el trabajo, son posibles soluciones innovadoras y giros inesperados. La situación financiera está relacionada con proyectos colectivos. En la vida personal, el deseo de libertad e independencia. La noche es buena para comunicarse con personas afines y planificar el futuro.',
                pisces: 'El día está lleno de inspiración creativa y empatía. En el trabajo, usa tu intuición para resolver problemas complejos. La situación financiera es inestable, requiere atención. En la vida personal, una conexión emocional profunda con los seres queridos. La noche es adecuada para el arte, la música y las prácticas espirituales.'
              }
            },
            love: {
              ru: {
                aries: 'В личной жизни сегодня ожидается эмоциональный подъем. Будьте открыты для общения и новых знакомств. В существующих отношениях проявите инициативу для укрепления связи.',
                taurus: 'День благоприятен для романтических встреч и укрепления существующих отношений. Проявите заботу о партнере через маленькие знаки внимания и поддержку.',
                gemini: 'Коммуникация в отношениях сегодня особенно важна. Говорите о своих чувствах открыто, но избегайте поверхностных разговоров. Одиноким Близнецам звезды сулят интересные знакомства.',
                cancer: 'В личных отношениях сегодня может потребоваться больше внимания и заботы. Проявите эмпатию к близким, но не забывайте о своих эмоциональных границах.',
                leo: 'Романтическая сфера сегодня полна ярких эмоций. Проявите щедрость и великодушие к партнеру. Одинокие Львы могут привлечь внимание благодаря своей харизме.',
                virgo: 'В личной жизни рекомендуется проявить повышенное внимание к близким. Возможны конфликты из-за недопонимания, особенно с теми, кто вам дорог. Старайтесь быть терпеливыми и открытыми в общении.',
                libra: 'Гармония в отношениях сегодня для вас приоритет. Проявите дипломатичность и избегайте конфликтов. День благоприятен для романтических встреч и укрепления партнерских связей.',
                scorpio: 'Интенсивность эмоций сегодня может зашкаливать. Постарайтесь контролировать ревность и не поддавайтесь манипуляциям. В отношениях ценится честность и открытость.',
                sagittarius: 'В личной жизни сегодня возможны приятные сюрпризы и новые знакомства. Существующим отношениям нужно больше свободы и пространства для роста.',
                capricorn: 'День благоприятен для укрепления семейных уз и долгосрочных отношений. Проявите ответственность и надежность, это высоко оценят близкие.',
                aquarius: 'В отношениях сегодня важна независимость и свобода самовыражения. При этом не забывайте учитывать чувства партнера. Одиноким Водолеям звезды сулят необычные знакомства.',
                pisces: 'Эмоциональная связь с партнером сегодня усилится. Доверяйте своей интуиции в вопросах любви. День благоприятен для романтических встреч и глубоких разговоров.'
              },
              en: {
                aries: 'Today your energy and determination are at their peak. Use this day for important beginnings and active actions. Trust your intuition in decision making. In personal relationships, show more patience and understanding. Financial investments today can be particularly successful. It\'s best to spend the evening in a calm environment, restoring your strength.',
                taurus: 'The day is favorable for material matters. Your practicality will help solve financial problems. At work, new interesting offers are possible. Pay attention to health and proper nutrition. In your personal life, a period of harmony and understanding begins. The evening is good for communicating with loved ones and creating a cozy atmosphere.',
                gemini: 'Today you should focus on communication and new acquaintances. It is possible to receive important information that will change your plans. At work, show flexibility and adaptability. The financial situation is stable, but it is better to postpone large expenses. In personal life, pleasant surprises are possible. The evening is suitable for intellectual entertainment.',
                cancer: 'The day is suitable for household chores and taking care of loved ones. Your emotional intuition is especially strong now. At work, small difficulties are possible, but you will cope with them with the help of colleagues. The financial situation requires attention and planning. In personal relationships, show more openness. The evening is good for a family dinner.',
                leo: 'The day is suitable for your charisma and leadership qualities. Use this to promote your ideas. At work, recognition of your merits is possible. The financial situation is improving. In your personal life, bright emotions and pleasant moments await you. The evening is suitable for creative self-realization and entertainment.',
                virgo: 'The day is favorable for analysis and planning. Your attention to detail will help avoid mistakes. At work, focus on completing projects you have started. The financial situation is stable, but requires careful accounting. In personal life, small misunderstandings are possible. The evening is suitable for self-education and reading.',
                libra: 'The day is especially important for you to maintain balance in all areas of life. At work, interesting partnership offers are possible. The financial situation is improving thanks to your diplomacy. In personal life, harmony and mutual understanding. The evening is good for cultural events and socializing with friends.',
                scorpio: 'The day is filled with deep emotions and intuitive insights. At work, you can reveal secrets or find hidden opportunities. The financial situation requires caution in investments. In personal life, passionate expressions of feelings are possible. The evening is suitable for meditation and self-knowledge.',
                sagittarius: 'The day is filled with optimism and enthusiasm. Use this to expand your horizons. At work, new perspectives and travel are possible. The financial situation is stable, but requires planning. In personal life, adventures and new impressions. The evening is good for philosophical conversations and planning for the future.',
                capricorn: 'The day is favorable for career achievements and professional growth. Your discipline and responsibility are bearing fruit. The financial situation is improving thanks to the right decisions. In personal life, stability and support. The evening is suitable for planning long-term goals.',
                aquarius: 'The day is favorable for originality and non-standard thinking. At work, innovative solutions and unexpected turns are possible. The financial situation is related to collective projects. In personal life, the desire for freedom and independence. The evening is good for communicating with like-minded people and planning for the future.',
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
                aquarius: 'El día es favorable para originalidad y pensamiento no estándar. En el trabajo, son posibles soluciones innovadoras y giros inesperados. La situación financiera está relacionada con proyectos colectivos. En la vida personal, el deseo de libertad e independencia. La noche es buena para comunicarse con personas afines y planificar el futuro.',
                pisces: 'El día está lleno de inspiración creativa y empatía. En el trabajo, usa tu intuición para resolver problemas complejos. La situación financiera es inestable, requiere atención. En la vida personal, una conexión emocional profunda con los seres queridos. La noche es adecuada para el arte, la música y las prácticas espirituales.'
              }
            },
            health: {
              ru: {
                aries: 'Энергии сегодня у вас в избытке, направьте ее на физическую активность. Избегайте перенапряжения и следите за режимом питания. Полезны будут кардиотренировки.',
                taurus: 'Обратите внимание на горло и шею – это ваши уязвимые зоны. Полезны будут прогулки на свежем воздухе и правильное питание. Избегайте переедания.',
                gemini: 'Сегодня стоит обратить внимание на дыхательную систему. Полезны дыхательные упражнения и свежий воздух. Избегайте нервного перенапряжения и недосыпа.',
                cancer: 'Эмоциональное состояние напрямую влияет на ваше здоровье. Найдите время для релаксации и медитации. Обратите внимание на здоровье желудка, избегайте тяжелой пищи.',
                leo: 'Сердце и спина требуют сегодня внимания. Избегайте чрезмерных нагрузок и стрессов. Полезны умеренные физические упражнения и правильное питание.',
                virgo: 'Обратите внимание на эмоциональное состояние. Стресс может повлиять на общее самочувствие, поэтому найдите время для отдыха и расслабления. Полезны будут прогулки на свежем воздухе или занятия йогой.',
                libra: 'Позаботьтесь о почках и позвоночнике. Пейте больше воды и следите за осанкой. Полезны будут упражнения на равновесие и гармонизацию.',
                scorpio: 'Сегодня важно контролировать эмоции, они могут влиять на здоровье. Обратите внимание на репродуктивную систему. Полезны будут водные процедуры.',
                sagittarius: 'Обратите внимание на бедра и печень. Избегайте избытка жирной пищи и алкоголя. Полезны будут прогулки на свежем воздухе и умеренная физическая активность.',
                capricorn: 'Колени и кости требуют заботы. Избегайте переохлаждения и чрезмерных нагрузок. Полезны будут упражнения на укрепление опорно-двигательного аппарата.',
                aquarius: 'Сегодня стоит обратить внимание на нервную систему и кровообращение. Избегайте переутомления. Полезны будут расслабляющие процедуры и достаточный отдых.',
                pisces: 'Ступни и иммунная система нуждаются в особой заботе. Избегайте переохлаждения и инфекций. Полезны водные процедуры и медитации.'
              },
              en: {
                aries: 'Today your energy and determination are at their peak. Use this day for important beginnings and active actions. Trust your intuition in decision making. In personal relationships, show more patience and understanding. Financial investments today can be particularly successful. It\'s best to spend the evening in a calm environment, restoring your strength.',
                taurus: 'The day is favorable for material matters. Your practicality will help solve financial problems. At work, new interesting offers are possible. Pay attention to health and proper nutrition. In your personal life, a period of harmony and understanding begins. The evening is good for communicating with loved ones and creating a cozy atmosphere.',
                gemini: 'Today you should focus on communication and new acquaintances. It is possible to receive important information that will change your plans. At work, show flexibility and adaptability. The financial situation is stable, but it is better to postpone large expenses. In personal life, pleasant surprises are possible. The evening is suitable for intellectual entertainment.',
                cancer: 'The day is suitable for household chores and taking care of loved ones. Your emotional intuition is especially strong now. At work, small difficulties are possible, but you will cope with them with the help of colleagues. The financial situation requires attention and planning. In personal relationships, show more openness. The evening is good for a family dinner.',
                leo: 'The day is suitable for your charisma and leadership qualities. Use this to promote your ideas. At work, recognition of your merits is possible. The financial situation is improving. In your personal life, bright emotions and pleasant moments await you. The evening is suitable for creative self-realization and entertainment.',
                virgo: 'The day is favorable for analysis and planning. Your attention to detail will help avoid mistakes. At work, focus on completing projects you have started. The financial situation is stable, but requires careful accounting. In personal life, small misunderstandings are possible. The evening is suitable for self-education and reading.',
                libra: 'The day is especially important for you to maintain balance in all areas of life. At work, interesting partnership offers are possible. The financial situation is improving thanks to your diplomacy. In personal life, harmony and mutual understanding. The evening is good for cultural events and socializing with friends.',
                scorpio: 'The day is filled with deep emotions and intuitive insights. At work, you can reveal secrets or find hidden opportunities. The financial situation requires caution in investments. In personal life, passionate expressions of feelings are possible. The evening is suitable for meditation and self-knowledge.',
                sagittarius: 'The day is filled with optimism and enthusiasm. Use this to expand your horizons. At work, new perspectives and travel are possible. The financial situation is stable, but requires planning. In personal life, adventures and new impressions. The evening is good for philosophical conversations and planning for the future.',
                capricorn: 'The day is favorable for career achievements and professional growth. Your discipline and responsibility are bearing fruit. The financial situation is improving thanks to the right decisions. In personal life, stability and support. The evening is suitable for planning long-term goals.',
                aquarius: 'The day is favorable for originality and non-standard thinking. At work, innovative solutions and unexpected turns are possible. The financial situation is related to collective projects. In personal life, the desire for freedom and independence. The evening is good for communicating with like-minded people and planning for the future.',
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
                aquarius: 'El día es favorable para originalidad y pensamiento no estándar. En el trabajo, son posibles soluciones innovadoras y giros inesperados. La situación financiera está relacionada con proyectos colectivos. En la vida personal, el deseo de libertad e independencia. La noche es buena para comunicarse con personas afines y planificar el futuro.',
                pisces: 'El día está lleno de inspiración creativa y empatía. En el trabajo, usa tu intuición para resolver problemas complejos. La situación financiera es inestable, requiere atención. En la vida personal, una conexión emocional profunda con los seres queridos. La noche es adecuada para el arte, la música y las prácticas espirituales.'
              }
            },
            advice: {
              ru: {
                aries: 'Действуйте решительно, но не забывайте о последствиях. Сегодня удача на стороне смелых и уверенных в себе людей.',
                taurus: 'Проявите терпение и настойчивость. Не торопите события, позвольте им развиваться естественным образом.',
                gemini: 'Больше общайтесь и делитесь информацией. Используйте свою коммуникабельность для решения сложных задач.',
                cancer: 'Доверяйте своей интуиции и защищайте то, что вам дорого. Дом и семья – ваша опора сегодня.',
                leo: 'Проявите щедрость и великодушие. Сегодня ваша способность вдохновлять других будет особенно ценна.',
                virgo: 'Сосредоточьтесь на текущих задачах и избегайте перенапряжения. Сегодня — не лучший день для начала новых проектов, но отличное время для завершения ранее начатых дел.',
                libra: 'Стремитесь к гармонии и равновесию. Избегайте конфликтов и ищите компромиссы в спорных ситуациях.',
                scorpio: 'Доверяйте своей интуиции и не бойтесь заглянуть в глубину ситуации. Трансформация необходима для роста.',
                sagittarius: 'Расширяйте свои горизонты. Сегодня благоприятный день для обучения, путешествий и новых открытий.',
                capricorn: 'Проявите дисциплину и ответственность. Систематический подход принесет успех в любом деле.',
                aquarius: 'Мыслите нестандартно и не бойтесь быть оригинальным. Ваша уникальность – ваша сила.',
                pisces: 'Доверяйте своей интуиции и творческим импульсам. Мечты могут указать верное направление.'
              },
              en: {
                aries: 'Today your energy and determination are at their peak. Use this day for important beginnings and active actions. Trust your intuition in decision making. In personal relationships, show more patience and understanding. Financial investments today can be particularly successful. It\'s best to spend the evening in a calm environment, restoring your strength.',
                taurus: 'The day is favorable for material matters. Your practicality will help solve financial problems. At work, new interesting offers are possible. Pay attention to health and proper nutrition. In your personal life, a period of harmony and understanding begins. The evening is good for communicating with loved ones and creating a cozy atmosphere.',
                gemini: 'Today you should focus on communication and new acquaintances. It is possible to receive important information that will change your plans. At work, show flexibility and adaptability. The financial situation is stable, but it is better to postpone large expenses. In personal life, pleasant surprises are possible. The evening is suitable for intellectual entertainment.',
                cancer: 'The day is suitable for household chores and taking care of loved ones. Your emotional intuition is especially strong now. At work, small difficulties are possible, but you will cope with them with the help of colleagues. The financial situation requires attention and planning. In personal relationships, show more openness. The evening is good for a family dinner.',
                leo: 'The day is suitable for your charisma and leadership qualities. Use this to promote your ideas. At work, recognition of your merits is possible. The financial situation is improving. In your personal life, bright emotions and pleasant moments await you. The evening is suitable for creative self-realization and entertainment.',
                virgo: 'The day is favorable for analysis and planning. Your attention to detail will help avoid mistakes. At work, focus on completing projects you have started. The financial situation is stable, but requires careful accounting. In personal life, small misunderstandings are possible. The evening is suitable for self-education and reading.',
                libra: 'The day is especially important for you to maintain balance in all areas of life. At work, interesting partnership offers are possible. The financial situation is improving thanks to your diplomacy. In personal life, harmony and mutual understanding. The evening is good for cultural events and socializing with friends.',
                scorpio: 'The day is filled with deep emotions and intuitive insights. At work, you can reveal secrets or find hidden opportunities. The financial situation requires caution in investments. In personal life, passionate expressions of feelings are possible. The evening is suitable for meditation and self-knowledge.',
                sagittarius: 'The day is filled with optimism and enthusiasm. Use this to expand your horizons. At work, new perspectives and travel are possible. The financial situation is stable, but requires planning. In personal life, adventures and new impressions. The evening is good for philosophical conversations and planning for the future.',
                capricorn: 'The day is favorable for career achievements and professional growth. Your discipline and responsibility are bearing fruit. The financial situation is improving thanks to the right decisions. In personal life, stability and support. The evening is suitable for planning long-term goals.',
                aquarius: 'The day is favorable for originality and non-standard thinking. At work, innovative solutions and unexpected turns are possible. The financial situation is related to collective projects. In personal life, the desire for freedom and independence. The evening is good for communicating with like-minded people and planning for the future.',
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
                aquarius: 'El día es favorable para originalidad y pensamiento no estándar. En el trabajo, son posibles soluciones innovadoras y giros inesperados. La situación financiera está relacionada con proyectos colectivos. En la vida personal, el deseo de libertad e independencia. La noche es buena para comunicarse con personas afines y planificar el futuro.',
                pisces: 'El día está lleno de inspiración creativa y empatía. En el trabajo, usa tu intuición para resolver problemas complejos. La situación financiera es inestable, requiere atención. En la vida personal, una conexión emocional profunda con los seres queridos. La noche es adecuada para el arte, la música y las prácticas espirituales.'
              }
            }
          };

          if (!zodiacSign || !section || !lang || !texts[section] || !texts[section][lang] || !texts[section][lang][zodiacSign]) {
            // Return default message based on section
            switch(section) {
              case 'work':
                return 'Сегодня благоприятный день для профессиональной деятельности. Доверьтесь своей интуиции в принятии деловых решений.';
              case 'love':
                return 'В личной жизни ожидается гармония и взаимопонимание. Уделите больше внимания близким людям.';
              case 'health':
                return 'Обратите внимание на свое здоровье. Избегайте стрессов и найдите время для отдыха и релаксации.';
              case 'advice':
                return 'Сосредоточьтесь на главном и не распыляйтесь на мелочи. День благоприятен для духовного развития.';
              default:
                return 'Звезды сегодня особенно благосклонны к вам. Воспользуйтесь этой энергией для достижения своих целей.';
            }
          }

          return texts[section][lang][zodiacSign];
        };

        // Generate fallback horoscope
        const fallbackHoroscope = {
          work: generateHoroscopeText(zodiacSign, language, 'work'),
          love: generateHoroscopeText(zodiacSign, language, 'love'),
          health: generateHoroscopeText(zodiacSign, language, 'health'),
          advice: generateHoroscopeText(zodiacSign, language, 'advice'),
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
        <CardContent className="space-y-6">
          {/* Work and Finances */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-medium text-cosmic-gold">
              <Briefcase size={18} />
              {translations.work[language] || translations.work.en}
            </div>
            <p className="text-base font-serif leading-relaxed whitespace-pre-wrap">
              {horoscope.work}
            </p>
          </div>
          
          {/* Love and Relationships */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-medium text-cosmic-gold">
              <Heart size={18} />
              {translations.love[language] || translations.love.en}
            </div>
            <p className="text-base font-serif leading-relaxed whitespace-pre-wrap">
              {horoscope.love}
            </p>
          </div>
          
          {/* Health and Wellbeing */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-medium text-cosmic-gold">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cosmic-gold">
                <path d="M16 18a2 2 0 0 1 0 4c-2.5 0-4-2.5-4.5-3.5C10 16 4.5 16 2 22" />
                <path d="M5 11a2 2 0 0 1 0-4c2.5 0 4 2.5 4.5 3.5" />
                <path d="M14.5 6.5C15 4 17 4 19.1 4c2 0 3.9 2 3.9 5a4.8 4.8 0 0 1-4.9 5H6.5" />
                <path d="M12 19c-2.2 0-3.9-1.5-3.9-3.5S9.8 12 12 12s3.9 1.5 3.9 3.5a3.4 3.4 0 0 1-1.9 3" />
                <path d="M12 12V4" />
              </svg>
              {translations.health[language] || translations.health.en}
            </div>
            <p className="text-base font-serif leading-relaxed whitespace-pre-wrap">
              {horoscope.health}
            </p>
          </div>
          
          {/* Daily Advice */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-medium text-cosmic-gold">
              <Sparkles size={18} />
              {translations.advice[language] || translations.advice.en}
            </div>
            <p className="text-base font-serif leading-relaxed whitespace-pre-wrap">
              {horoscope.advice}
            </p>
          </div>
          
          {/* Closing message */}
          <p className="text-cosmic-accent italic text-center mt-4">
            {translations.closing[language] || translations.closing.en}
          </p>
          
          {/* Additional information */}
          <div className="grid grid-cols-2 gap-4 text-sm mt-2 text-cosmic-accent">
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
