import React, { useState, useEffect } from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { UniverseChatPreview } from '@/components/ProFeatures/UniverseChatPreview';
import { BottomNavigation } from '@/components/BottomNavigation';
import { CountdownTimer } from '@/components/CountdownTimer';
import { UniverseHeader } from '@/components/universe/UniverseHeader';
import { VoiceGreeting } from '@/components/universe/VoiceGreeting';
import { QuestionForm } from '@/components/universe/QuestionForm';
import { ThinkingAnimation } from '@/components/universe/ThinkingAnimation';
import { UniverseAnswer } from '@/components/universe/UniverseAnswer';
import { PreviousQuestions } from '@/components/universe/PreviousQuestions';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { PageHeader } from '@/components/PageHeader';

const UniversePage: React.FC = () => {
  const { askUniverse, activeQuestions, userProfile, language, pacts } =
    useAppStore();
  const { generateAndPlaySpeech, stopSpeech } = useTextToSpeech();
  const [isAsking, setIsAsking] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<null | {
    question: string;
    answer: string;
  }>(null);

  // Останавливаем воспроизведение при размонтировании компонента
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []); // Remove stopSpeech dependency to prevent excessive calls

  // Check if there are active pacts
  const activePacts = pacts?.filter(p => p.status === 'active') || [];
  const hasActivePacts = activePacts.length > 0;

  // Determine if user has PRO access
  const isPro = userProfile?.isPro || false;

  const handleAskUniverse = (question: string) => {
    setIsAsking(true);

    // Effect of "Universe thinking"
    setTimeout(async () => {
      try {
        const response = await askUniverse(question);
        setCurrentAnswer({
          question: response.question,
          answer: response.answer,
        });

        // Автоматически произносим фразу при получении ответа
        const announcementText =
          language === 'ru'
            ? 'Вот тебе мой ответ! Если ты хочешь услышать его, нажми на кнопку воспроизведение.'
            : language === 'es'
              ? '¡Aquí tienes mi respuesta! Si quieres escucharla, presiona el botón de reproducción.'
              : 'Here is my answer! If you want to hear it, press the play button.';

        generateAndPlaySpeech(announcementText, {
          voice: 'Custom',
          model: 'eleven_multilingual_v2',
        });
      } catch (error) {
        console.error('Error asking universe:', error);
      } finally {
        setIsAsking(false);
      }
    }, 2000); // Delay for effect
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-20">
      <StarField starCount={150} />

      <PageHeader
        title={
          language === 'ru'
            ? 'Вселенная'
            : language === 'es'
              ? 'Universo'
              : 'Universe'
        }
      />

      {/* Voice Greeting без автозапуска для улучшения производительности */}
      <VoiceGreeting
        userProfile={userProfile}
        language={language}
        autoPlay={false}
      />

      {/* Show countdown timer if there are active pacts */}
      {hasActivePacts && <CountdownTimer pactId={activePacts[0]?.id} />}

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-20 py-4 max-w-3xl mx-auto w-full">
        {currentAnswer ? (
          <UniverseAnswer
            question={currentAnswer.question}
            answer={currentAnswer.answer}
            onNewQuestion={() => setCurrentAnswer(null)}
          />
        ) : isAsking ? (
          <ThinkingAnimation />
        ) : (
          <div className="w-full animate-fade-in">
            <QuestionForm
              onSubmit={handleAskUniverse}
              isLoading={isAsking}
              language={language}
            />

            {/* Only show Chat Preview for all users, but with PRO overlay for non-pro */}
            <div className="mt-10">
              <UniverseChatPreview />
            </div>

            <PreviousQuestions questions={activeQuestions} />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default UniversePage;
