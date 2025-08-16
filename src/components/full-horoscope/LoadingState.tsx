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
    <Card className="p-6 mb-8 bg-slate-800/20 backdrop-blur-sm border-amber-500/30">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin mb-4">
          <Loader className="h-12 w-12 text-amber-400" />
        </div>
        <p className="text-amber-300 text-lg font-medium">
          {uiText.loadingTitle}
        </p>
        <p className="text-gray-400 mt-2">{uiText.loadingDescription}</p>
        <div className="mt-4 flex justify-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="inline-block rounded-full animate-pulse"
              style={{
                width: `${6 + i * 2}px`,
                height: `${6 + i * 2}px`,
                backgroundColor: i % 2 === 0 ? '#f59e0b' : '#9d7cf6',
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s',
              }}
            ></span>
          ))}
        </div>
      </div>
    </Card>
  );
};
