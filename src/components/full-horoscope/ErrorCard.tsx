
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorCardProps {
  error: string;
  uiText: {
    errorTitle: string;
    tryAgainButton: string;
  };
  onRetry: () => void;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({ 
  error, 
  uiText, 
  onRetry 
}) => {
  return (
    <Card className="p-6 mb-8 bg-slate-800/40 backdrop-blur-sm border-red-500/30">
      <div className="flex items-center gap-2 text-red-400 mb-4">
        <AlertCircle size={20} />
        <h2 className="text-xl font-semibold">{uiText.errorTitle}</h2>
      </div>
      <p className="mb-4">{error}</p>
      <Button 
        onClick={onRetry}
        className="bg-amber-500/80 hover:bg-amber-600/90 text-black backdrop-blur-sm"
      >
        {uiText.tryAgainButton}
      </Button>
    </Card>
  );
};
