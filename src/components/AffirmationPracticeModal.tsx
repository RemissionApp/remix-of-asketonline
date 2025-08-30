import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { usePracticeSteps } from '@/hooks/usePracticeSteps';
import { useOptimizedTextToSpeech } from '@/hooks/useOptimizedTextToSpeech';
import { PracticeStepContent } from './affirmations/PracticeStepContent';
import { PracticeCompletionState } from './affirmations/PracticeCompletionState';
import { PracticeModalFooter } from './affirmations/PracticeModalFooter';

interface AffirmationPracticeModalProps {
  affirmation: {
    id: number;
    text: string;
    instruction: string;
    action: string;
    guideImage: string;
  };
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export const AffirmationPracticeModal: React.FC<
  AffirmationPracticeModalProps
> = ({ affirmation, isOpen, onClose, language }) => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { t } = useTranslations();
  const { steps } = usePracticeSteps(language);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { generateAndPlaySpeech, stopSpeech, isGenerating, isPlaying } = useOptimizedTextToSpeech();

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Stop background audio and TTS when practice is completed
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopSpeech();
    onClose();
    setStep(0);
    setCompleted(false);
  };

  // Start background audio when modal opens
  useEffect(() => {
    if (isOpen && !completed) {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.log('Audio autoplay prevented:', error);
        });
      }
    }
  }, [isOpen, completed]);

  // Stop audio when modal closes or practice completes
  useEffect(() => {
    if (!isOpen || completed) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      stopSpeech();
    }
  }, [isOpen, completed, stopSpeech]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Background OM audio */}
      <audio
        ref={audioRef}
        src="https://aewfggzscyjxpuciqtti.supabase.co/storage/v1/object/public/meditation/OM.mp3"
        loop
        preload="auto"
      />
      
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-cosmic-dark to-gray-900 border-cosmic-accent/40 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-cosmic-accent font-medium">
            {t?.affirmations?.practice?.title || 'Practice Affirmation'}
          </DialogTitle>
          <DialogDescription className="text-white/80">
            {completed
              ? language === 'ru'
                ? 'Поздравляем с завершением практики!'
                : language === 'es'
                  ? '¡Felicidades por completar la práctica!'
                  : 'Congratulations on completing the practice!'
              : affirmation.text}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Progress value={progress} className="h-2 bg-gray-700" />

          {completed ? (
            <PracticeCompletionState language={language} />
          ) : (
            <div className="mt-6 space-y-4">
              <h3 className="text-cosmic-accent font-medium text-lg">
                {currentStep.title}
              </h3>

              <PracticeStepContent
                instruction={currentStep.instruction}
                visualGuide={currentStep.visualGuide}
                guideImage={affirmation.guideImage}
                language={language}
                affirmationText={affirmation.text}
                isStep3={step === 2}
                onPlayAffirmation={() => generateAndPlaySpeech(affirmation.text, { voice: 'Custom', model: 'eleven_multilingual_v2' })}
                isGeneratingVoice={isGenerating}
                isPlayingVoice={isPlaying}
              />
            </div>
          )}
        </div>

        <PracticeModalFooter
          completed={completed}
          step={step}
          stepsCount={steps.length}
          language={language}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onComplete={handleComplete}
        />
      </DialogContent>
    </Dialog>
  );
};
