
import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingStateProps {
  uiText: {
    loadingTitle: string;
    loadingDescription: string;
  };
}

export const LoadingState: React.FC<LoadingStateProps> = ({ uiText }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin mb-4">
        <Loader className="h-12 w-12 text-amber-400" />
      </div>
      <p className="text-amber-300 text-lg">{uiText.loadingTitle}</p>
      <p className="text-gray-400 mt-2">{uiText.loadingDescription}</p>
    </div>
  );
};
