import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircleQuestion } from 'lucide-react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { BottomNavigation } from '@/components/BottomNavigation';
import { QuestionForm } from '@/components/universe/QuestionForm';
import { ThinkingAnimation } from '@/components/universe/ThinkingAnimation';
import { UniverseAnswer } from '@/components/universe/UniverseAnswer';
import { RecentQuestionsBlock } from '@/components/universe/RecentQuestionsBlock';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { PageHeader } from '@/components/ui/PageHeader';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';

const UniversePage: React.FC = () => {
  const { askUniverse, language } = useAppStore();
  const { generateAndPlaySpeech, stopSpeech } = useTextToSpeech();
  const [isAsking, setIsAsking] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<null | {
    question: string;
    answer: string;
  }>(null);

  useEffect(() => () => stopSpeech(), []);

  const lang = (language as 'ru' | 'en' | 'es') ?? 'ru';
  const tr = (ru: string, en: string, es: string) =>
    lang === 'ru' ? ru : lang === 'es' ? es : en;

  const handleAsk = async (question: string) => {
    setIsAsking(true);
    setTimeout(async () => {
      try {
        const response = await askUniverse(question);
        setCurrentAnswer({ question: response.question, answer: response.answer });
        const announce = tr(
          'Вот тебе мой ответ! Если хочешь услышать его, нажми на кнопку воспроизведения.',
          'Here is my answer! If you want to hear it, press the play button.',
          '¡Aquí tienes mi respuesta! Si quieres escucharla, presiona el botón de reproducción.'
        );
        generateAndPlaySpeech(announce, { voice: 'Custom', model: 'eleven_multilingual_v2' });
      } catch (e) {
        console.error('Error asking universe:', e);
      } finally {
        setIsAsking(false);
      }
    }, 1500);
  };

  return (
    <MobileOptimizedInterface>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-24">
        <StarField starCount={120} />
        <PageHeader title={tr('Вопрос Вселенной', 'Ask the Universe', 'Pregunta al Universo')} />

        <div className="flex-1 relative z-10 px-3 pt-20 sm:px-4 max-w-lg mx-auto w-full flex flex-col gap-3 sm:gap-4">
          {currentAnswer ? (
            <UniverseAnswer
              question={currentAnswer.question}
              answer={currentAnswer.answer}
              onNewQuestion={() => setCurrentAnswer(null)}
            />
          ) : isAsking ? (
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-accent/15 via-cosmic-dark/60 to-cosmic-gold/10 backdrop-blur-md p-6">
              <ThinkingAnimation />
            </div>
          ) : (
            <>
              {/* Hero intro */}
              <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-gold/15 via-cosmic-dark/60 to-cosmic-accent/15 backdrop-blur-md shadow-lg shadow-cosmic-gold/10 p-5 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-cosmic-gold to-cosmic-accent flex items-center justify-center shadow-[0_0_24px_rgba(232,193,108,0.4)] mb-3">
                  <Sparkles size={20} className="text-white" />
                </div>
                <h1 className="font-serif text-lg text-white mb-1">
                  {tr('Спроси у Вселенной', 'Ask the Universe', 'Pregunta al Universo')}
                </h1>
                <p className="text-xs text-cosmic-secondary leading-relaxed">
                  {tr(
                    'Опиши свою ситуацию подробно — чем точнее вопрос, тем глубже ответ.',
                    'Describe your situation in detail — the more precise your question, the deeper the answer.',
                    'Describe tu situación en detalle — cuanto más preciso, más profunda la respuesta.'
                  )}
                </p>
              </section>

              {/* Question form */}
              <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-accent/15 via-cosmic-dark/60 to-cosmic-gold/10 backdrop-blur-md shadow-lg shadow-cosmic-accent/10 p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-indigo flex items-center justify-center">
                    <MessageCircleQuestion size={14} className="text-white" />
                  </div>
                  <h3 className="font-serif text-sm text-white">
                    {tr('Твой вопрос', 'Your question', 'Tu pregunta')}
                  </h3>
                </div>
                <QuestionForm onSubmit={handleAsk} isLoading={isAsking} language={lang} />
              </section>

              {/* History */}
              <RecentQuestionsBlock />
            </>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <BottomNavigation />
        </div>
      </div>
    </MobileOptimizedInterface>
  );
};

export default UniversePage;
