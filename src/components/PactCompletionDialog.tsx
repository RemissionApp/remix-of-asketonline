import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Share, Plus, X } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { cn } from '@/lib/utils';

interface PactCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pact: {
    title: string;
    duration: number;
    reward?: string;
  };
  energyEarned: number;
  totalDays: number;
  onShareSuccess?: () => void;
  onCreateNewPact?: () => void;
}

export function PactCompletionDialog({
  open,
  onOpenChange,
  pact,
  energyEarned,
  totalDays,
  onShareSuccess,
  onCreateNewPact,
}: PactCompletionDialogProps) {
  const { t } = useTranslations();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.pactCompletion?.shareTitle || 'Completed ascesis!',
          text: t.pactCompletion?.shareText?.replace('{title}', pact.title).replace('{days}', String(pact.duration)).replace('{energy}', String(energyEarned)) || `I completed the ascesis "${pact.title}" for ${pact.duration} days!`,
        });
        onShareSuccess?.();
      } catch (error) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md mx-auto bg-gradient-to-br from-cosmic-dark to-gray-900 border border-cosmic-accent/30 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="relative mx-auto">
            {/* Animated trophy icon with glow effect */}
            <div className="relative">
              <Trophy className="w-16 h-16 text-cosmic-accent mx-auto animate-pulse" />
              <Star className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
              <Star className="w-4 h-4 text-yellow-300 absolute -bottom-1 -left-1 animate-bounce" />
            </div>
            
            {/* Decorative sparkles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute w-2 h-2 bg-cosmic-accent rounded-full animate-ping",
                    i % 2 === 0 ? "opacity-60" : "opacity-40"
                  )}
                  style={{
                    left: `${20 + (i * 15)}%`,
                    top: `${10 + (i % 3) * 30}%`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cosmic-accent to-cosmic-primary bg-clip-text text-transparent">
            {t.pactCompletion?.title || 'Congratulations on completing your ascesis!'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pact details */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-cosmic-accent">
              {pact.title}
            </h3>
            <p className="text-cosmic-secondary">
              {t.pactCompletion?.completedDays?.replace('{days}', String(pact.duration)) || `You completed the ascesis for ${pact.duration} days in a row`}
            </p>
          </div>

          {/* Goal from universe */}
          {pact.reward && (
            <div className="bg-cosmic-dark/50 border border-cosmic-accent/20 rounded-lg p-4 space-y-3">
              <h4 className="text-cosmic-accent font-medium text-center">
                {t.pactCompletion?.goalTitle || 'Your goal:'}
              </h4>
              <p className="text-sm text-cosmic-light italic text-center">
                "{pact.reward}"
              </p>
              
              {/* Mystical message from universe */}
              <div className="border-t border-cosmic-accent/20 pt-3 mt-3">
                <p className="text-xs text-cosmic-secondary text-center leading-relaxed">
                  {t.pactCompletion?.universeMessage || '✨ The Universe has heard every step you took on this path. If you performed the ascesis honestly and with full dedication, the energy of the Cosmos is already working to fulfill your desire. Trust the process - what you truly need will come at the right time. ✨'}
                </p>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cosmic-dark/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-cosmic-accent">
                +{energyEarned}
              </div>
              <div className="text-xs text-cosmic-secondary">
                {t.pactCompletion?.energyEarned || 'Energy Earned'}
              </div>
            </div>
            <div className="bg-cosmic-dark/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-cosmic-accent">
                {totalDays}
              </div>
              <div className="text-xs text-cosmic-secondary">
                {t.pactCompletion?.totalDays || 'Total Days'}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="w-full sm:flex-1 border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10"
              >
                <Share className="w-4 h-4 mr-2" />
                {t.pactCompletion?.shareButton || 'Share'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onCreateNewPact}
                className="w-full sm:flex-1 border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t.pactCompletion?.newPactButton || 'New Ascesis'}
              </Button>
            </div>
            
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-gradient-to-r from-cosmic-accent to-cosmic-primary hover:from-cosmic-accent/80 hover:to-cosmic-primary/80"
            >
              {t.pactCompletion?.closeButton || 'Continue'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}