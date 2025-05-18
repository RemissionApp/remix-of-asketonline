
import React, { useState, useEffect } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { BottomNavigation } from '@/components/BottomNavigation';
import { UniverseChatPreview } from '@/components/ProFeatures/UniverseChatPreview';
import { TypingEffect } from '@/components/TypingEffect';
import { CountdownTimer } from '@/components/CountdownTimer';

const UniversePage: React.FC = () => {
  const { askUniverse, activeQuestions, setActiveScreen, userProfile, language, pacts } = useAppStore();
  const { t } = useTranslations();
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<null | {
    question: string;
    answer: string;
  }>(null);
  const navigate = useNavigate();
  
  // Check if there are active pacts
  const activePacts = pacts?.filter(p => p.status === 'active') || [];
  const hasActivePacts = activePacts.length > 0;
  
  const handleGoBack = () => {
    setActiveScreen('main');
    navigate('/main');
  };
  
  // Проверка минимальной длины вопроса (100 символов)
  const isQuestionTooShort = question.trim().length < 100;
  
  const handleAskUniverse = () => {
    if (isQuestionTooShort) {
      toast.error(language === 'ru' 
        ? 'Опишите свой вопрос подробнее (минимум 100 символов)' 
        : language === 'es' 
          ? 'Describe tu pregunta con más detalle (mínimo 100 caracteres)'
          : 'Describe your question in more detail (minimum 100 characters)');
      return;
    }
    
    setIsAsking(true);
    
    // Effect of "Universe thinking"
    setTimeout(async () => {
      try {
        const response = await askUniverse(question);
        setCurrentAnswer({
          question: response.question,
          answer: response.answer
        });
      } catch (error) {
        console.error("Error asking universe:", error);
        toast.error(typeof error === 'string' ? error : "The Universe is silent. Try again later.");
      } finally {
        setQuestion('');
        setIsAsking(false);
      }
    }, 2000); // Delay for effect
  };
  
  // Determine if user has PRO access
  const isPro = userProfile?.isPro || false;
  
  // Счетчик символов
  const characterCount = question.length;
  const characterCountColor = isQuestionTooShort ? 'text-red-400' : 'text-cosmic-secondary';

  // Функция для форматирования ответа с разделением на абзацы
  const formatUniverseAnswer = (answer: string) => {
    // Разделяем текст на абзацы по двойным переносам строк
    const paragraphs = answer.split(/\n\s*\n/);
    
    return (
      <div className="space-y-6">
        {paragraphs.map((paragraph, index) => (
          <div key={index} className="space-y-2">
            {paragraph.split('\n').map((line, lineIdx) => {
              // Выделяем заголовки цифрами (1., 2., и т.д.)
              if (/^\d+\./.test(line.trim())) {
                return (
                  <h3 key={lineIdx} className="text-cosmic-gold font-cormorant text-xl font-medium mt-4">
                    {line}
                  </h3>
                );
              }
              return <p key={lineIdx} className="text-white font-inter leading-relaxed">{line}</p>;
            })}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={150} />
      
      {/* Header */}
      <div className="relative z-10 px-4 py-4 flex items-center">
        <button
          className="p-2 text-cosmic-accent"
          onClick={handleGoBack}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-serif text-white flex-1 text-center mr-8">
          {t.universe.title}
        </h1>
      </div>
      
      {/* User Greeting */}
      {userProfile?.name && (
        <div className="relative z-10 text-center mb-4">
          <h2 className="text-cosmic-gold font-serif text-xl">
            {language === 'ru' 
              ? `Приветствую тебя, ${userProfile.name}!` 
              : language === 'es'
                ? `¡Te saludo, ${userProfile.name}!`
                : `Greetings, ${userProfile.name}!`}
          </h2>
        </div>
      )}
      
      {/* Show countdown timer if there are active pacts */}
      {hasActivePacts && <CountdownTimer pactId={activePacts[0]?.id} />}
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 max-w-3xl mx-auto w-full">
        {currentAnswer ? (
          <div className="animate-fade-in w-full">
            <div className="cosmic-card mb-6">
              <h2 className="text-lg font-cormorant font-medium text-cosmic-accent mb-2">
                {t.universe.yourQuestion}
              </h2>
              <p className="text-white font-inter">{currentAnswer.question}</p>
            </div>
            
            <div className="cosmic-card bg-cosmic-accent/10">
              <h2 className="text-lg font-cormorant font-medium text-cosmic-gold mb-4">
                {t.universe.universeAnswer}
              </h2>
              
              {/* Используем форматированный вывод ответа */}
              {formatUniverseAnswer(currentAnswer.answer)}
              
              <div className="mt-8 flex justify-center">
                <CosmicButton 
                  onClick={() => setCurrentAnswer(null)} 
                  variant="outline"
                >
                  {t.universe.newQuestion}
                </CosmicButton>
              </div>
            </div>
          </div>
        ) : isAsking ? (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <div className="energy-circle w-40 h-40 animate-pulse-slow mb-6">
              <div className="absolute inset-0 rounded-full flex items-center justify-center">
                <div className="text-cosmic-accent animate-pulse-slow">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V2M12 22v-2M6.34 6.34L4.93 4.93M19.07 19.07l-1.41-1.41M4 12H2M22 12h-2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <p className="text-cosmic-secondary text-center font-inter">
              {t.universe.thinking}
            </p>
          </div>
        ) : (
          <div className="w-full animate-fade-in">
            <h2 className="text-2xl font-cormorant font-medium text-white mb-6 text-center">
              {language === 'ru' 
                ? "Подробно опиши свою проблему Вселенной" 
                : language === 'es'
                  ? "Describe detalladamente tu problema al Universo"
                  : "Describe your problem to the Universe in detail"}
            </h2>
            
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={language === 'ru' 
                ? "Опиши свою ситуацию подробно (минимум 100 символов)..." 
                : language === 'es'
                  ? "Describe tu situación en detalle (mínimo 100 caracteres)..."
                  : "Describe your situation in detail (minimum 100 characters)..."}
              className="cosmic-input font-inter w-full h-40 resize-none mb-2"
            />
            
            {/* Счетчик символов */}
            <div className={`text-right mb-6 ${characterCountColor}`}>
              <span className="text-xs">
                {characterCount}/100 {language === 'ru' ? 'символов' : language === 'es' ? 'caracteres' : 'characters'}
              </span>
            </div>
            
            <CosmicButton 
              onClick={handleAskUniverse}
              className="w-full font-inter"
              variant="outline"
              disabled={isQuestionTooShort}
            >
              {language === 'ru' 
                ? "Отправить вопрос" 
                : language === 'es'
                  ? "Enviar pregunta"
                  : "Send question"}
            </CosmicButton>
            
            {/* Only show Chat Preview for PRO users */}
            {isPro && (
              <div className="mt-10">
                <UniverseChatPreview />
              </div>
            )}
            
            {activeQuestions.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-cormorant font-medium text-cosmic-secondary mb-4">
                  {t.universe.previousQuestions}
                </h3>
                
                <div className="space-y-4">
                  {activeQuestions.slice(0, 3).map((q) => (
                    <div key={q.id} className="cosmic-card bg-cosmic-dark/60">
                      <p className="text-sm text-cosmic-secondary mb-2 font-inter">
                        {new Date(q.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-white mb-2 font-inter">{q.question}</p>
                      <QuoteDisplay quote={q.answer} className="!text-sm !p-0 font-inter" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default UniversePage;
