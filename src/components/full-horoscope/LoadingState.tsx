
import React from 'react';
import { Loader } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface LoadingStateProps {
  uiText: {
    loadingTitle: string;
    loadingDescription: string;
  };
}

export const LoadingState: React.FC<LoadingStateProps> = ({ uiText }) => {
  return (
    <Card className="p-6 mb-8 bg-slate-800/40 backdrop-blur-sm border-amber-500/30">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin mb-4">
          <Loader className="h-12 w-12 text-amber-400" />
        </div>
        <p className="text-amber-300 text-lg">{uiText.loadingTitle}</p>
        <p className="text-gray-400 mt-2">{uiText.loadingDescription}</p>
      </div>
    </Card>
  );
};
