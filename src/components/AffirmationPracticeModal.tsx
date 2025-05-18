
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import { useTranslations } from '@/hooks/useTranslations';
import { usePracticeSteps } from '@/hooks/usePracticeSteps';
import { PracticeStepContent } from './affirmations/PracticeStepContent';
import { PracticeCompletionState } from './affirmations/PracticeCompletionState';
import { PracticeModalFooter } from './affirmations/PracticeModalFooter';

interface AffirmationPracticeModalProps {
  affirmation: {
    id: number;
    text: string;
    instruction: string;
    action: string;
  };
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export const AffirmationPracticeModal: React.FC<AffirmationPracticeModalProps> = ({
  affirmation,
  isOpen,
  onClose,
  language
}) => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { t } = useTranslations();
  const { steps } = usePracticeSteps(language);
  
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
    onClose();
    setStep(0);
    setCompleted(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-cosmic-dark to-gray-900 border-cosmic-accent/40 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-cosmic-accent font-semibold">
            {t?.affirmations?.practice?.title || "Practice Affirmation"}
          </DialogTitle>
          <DialogDescription className="text-white/80">
            {completed 
              ? (language === 'ru' 
                  ? 'Поздравляем с завершением практики!' 
                  : language === 'es' 
                  ? '¡Felicidades por completar la práctica!' 
                  : 'Congratulations on completing the practice!')
              : affirmation.text
            }
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
                language={language}
                visualImageUrl={currentStep.visualImageUrl}
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
