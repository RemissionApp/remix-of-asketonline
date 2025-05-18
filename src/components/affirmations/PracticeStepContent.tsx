
import React from 'react';
import { ChevronRight } from "lucide-react";

interface PracticeStepContentProps {
  instruction: string;
  visualGuide: string;
  language: string;
  visualImageUrl: string; // Make this required, not optional
}

export const PracticeStepContent: React.FC<PracticeStepContentProps> = ({
  instruction,
  visualGuide,
  language,
  visualImageUrl
}) => {
  const visualGuideLabel = language === 'ru' 
    ? 'Визуальное руководство: ' 
    : language === 'es' 
    ? 'Guía visual: ' 
    : 'Visual guide: ';
  
  return (
    <div className="mt-6 space-y-4">
      <div className="bg-cosmic-dark/80 rounded-md p-4 border border-cosmic-accent/20">
        <p className="text-white/90 mb-4">
          {instruction}
        </p>
        
        {visualImageUrl && (
          <div className="mb-4 rounded-md overflow-hidden">
            <img 
              src={visualImageUrl} 
              alt="Визуальное руководство" 
              className="w-full h-auto object-cover rounded-md"
              loading="lazy"
            />
          </div>
        )}
        
        <div className="bg-purple-900/30 border border-purple-500/30 rounded p-3 flex items-start">
          <div className="bg-purple-500 rounded-full p-1 mr-2 mt-0.5 flex-shrink-0">
            <ChevronRight size={12} />
          </div>
          <p className="text-purple-200 text-sm">
            <span className="font-medium">{visualGuideLabel}</span>
            {visualGuide}
          </p>
        </div>
      </div>
    </div>
  );
};
