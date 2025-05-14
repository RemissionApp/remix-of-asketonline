
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Send } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { QuoteDisplay } from '@/components/QuoteDisplay';

const UniversePage: React.FC = () => {
  const { askUniverse, activeQuestions, setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<null | {
    question: string;
    answer: string;
  }>(null);
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    setActiveScreen('main');
    navigate('/main');
  };
  
  const handleAskUniverse = () => {
    if (question.trim().length < 3) return;
    
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
        toast.error(typeof error === 'string' ? error : "Вселенная молчит. Попробуйте позже.");
      } finally {
        setQuestion('');
        setIsAsking(false);
      }
    }, 2000); // Delay for effect
  };
  
  return (
    <div className="min-h-screen flex flex-col relative">
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
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 max-w-lg mx-auto w-full">
        {currentAnswer ? (
          <div className="animate-fade-in w-full">
            <div className="cosmic-card mb-6">
              <h2 className="text-lg font-serif text-cosmic-accent mb-2">
                {t.universe.yourQuestion}
              </h2>
              <p className="text-white">{currentAnswer.question}</p>
            </div>
            
            <div className="cosmic-card bg-cosmic-accent/10">
              <h2 className="text-lg font-serif text-cosmic-gold mb-4">
                {t.universe.universeAnswer}
              </h2>
              
              <QuoteDisplay 
                quote={currentAnswer.answer} 
                className="mb-8"
              />
              
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
            
            <p className="text-cosmic-secondary text-center">
              {t.universe.thinking}
            </p>
          </div>
        ) : (
          <div className="w-full animate-fade-in">
            <h2 className="text-2xl font-serif text-white mb-6 text-center">
              {t.universe.question}
            </h2>
            
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.universe.questionPlaceholder}
              className="cosmic-input w-full h-40 resize-none mb-8"
            />
            
            <CosmicButton 
              onClick={handleAskUniverse}
              className="w-full"
              disabled={question.length < 3}
            >
              <Send size={18} className="mr-2" />
              {t.universe.askButton}
            </CosmicButton>
            
            {activeQuestions.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-serif text-cosmic-secondary mb-4">
                  {t.universe.previousQuestions}
                </h3>
                
                <div className="space-y-4">
                  {activeQuestions.slice(0, 3).map((q) => (
                    <div key={q.id} className="cosmic-card bg-cosmic-dark/60">
                      <p className="text-sm text-cosmic-secondary mb-2">
                        {new Date(q.date).toLocaleDateString()}
                      </p>
                      <p className="text-white mb-2">{q.question}</p>
                      <QuoteDisplay quote={q.answer} className="!text-sm !p-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversePage;
