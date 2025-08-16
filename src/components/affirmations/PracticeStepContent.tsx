import React from 'react';
import { ChevronRight } from 'lucide-react';

interface PracticeStepContentProps {
  instruction: string;
  visualGuide: string;
  guideImage: string;
  language: string;
}

export const PracticeStepContent: React.FC<PracticeStepContentProps> = ({
  instruction,
  visualGuide,
  guideImage,
  language,
}) => {
  const visualGuideLabel =
    language === 'ru'
      ? 'Визуальное руководство: '
      : language === 'es'
        ? 'Guía visual: '
        : 'Visual guide: ';

  return (
    <div className="mt-6 space-y-4">
      <div className="bg-cosmic-dark/80 rounded-md p-4 border border-cosmic-accent/20">
        <div className="flex flex-col md:flex-row gap-4 items-start mb-4">
          <div className="flex-shrink-0">
            <img
              src={guideImage}
              alt="Visual practice guide"
              className="w-32 h-32 object-cover rounded-lg border border-cosmic-accent/30"
            />
          </div>
          <div className="flex-1">
            <p className="text-white/90">{instruction}</p>
          </div>
        </div>
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
