
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";

interface PracticeModalFooterProps {
  completed: boolean;
  step: number;
  stepsCount: number;
  language: string;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export const PracticeModalFooter: React.FC<PracticeModalFooterProps> = ({
  completed,
  step,
  stepsCount,
  language,
  onPrevious,
  onNext,
  onComplete
}) => {
  const backText = language === 'ru' ? 'Назад' : language === 'es' ? 'Atrás' : 'Back';
  const nextText = language === 'ru' ? 'Далее' : language === 'es' ? 'Siguiente' : 'Next';
  const completeText = language === 'ru' ? 'Завершить' : language === 'es' ? 'Completar' : 'Complete';
  const completePracticeText = language === 'ru' ? 'Завершить практику' : language === 'es' ? 'Completar práctica' : 'Complete Practice';
  
  if (completed) {
    return (
      <DialogFooter className="flex justify-between mt-6 sm:justify-between">
        <Button 
          onClick={onComplete}
          className="bg-gradient-to-r from-green-500/80 to-teal-500/80 hover:from-green-500 hover:to-teal-500 w-full"
        >
          {completePracticeText}
        </Button>
      </DialogFooter>
    );
  }
  
  return (
    <DialogFooter className="flex justify-between mt-6 sm:justify-between">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={step === 0}
        className={`border-cosmic-accent/30 text-cosmic-accent ${step === 0 ? 'opacity-50' : 'hover:bg-cosmic-accent/10'}`}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        {backText}
      </Button>
      
      <Button 
        onClick={onNext}
        className="bg-gradient-to-r from-purple-500/80 to-indigo-500/80 hover:from-purple-500 hover:to-indigo-500"
      >
        {step === stepsCount - 1 ? completeText : nextText}
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </DialogFooter>
  );
};
