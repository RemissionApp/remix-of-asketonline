import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChoiceEvent } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { useMissionTranslations } from '@/hooks/useMissionTranslations';

interface PathChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  choiceEvent: ChoiceEvent;
  onChoice: (choiceId: string) => void;
  missionId?: string;
}

export const PathChoiceModal: React.FC<PathChoiceModalProps> = ({
  isOpen,
  onClose,
  choiceEvent,
  onChoice,
  missionId,
}) => {
  const { language } = useAppStore();
  const { getTranslatedChoiceEvent } = useMissionTranslations();

  const handleChoice = (choiceId: string) => {
    onChoice(choiceId);
    onClose();
  };

  // Get translated choice event if available
  const translatedEvent = missionId ? getTranslatedChoiceEvent(missionId, choiceEvent.id) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cosmic-dark border-cosmic-accent/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cosmic-gold text-center">
            {translatedEvent?.title || choiceEvent.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-cosmic-silver text-center">
            {translatedEvent?.description || choiceEvent.description}
          </p>

          <div className="space-y-3">
            {choiceEvent.choices.map((choice, index) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice.id)}
                className="w-full p-4 text-left bg-cosmic-accent/10 hover:bg-cosmic-accent/20 border border-cosmic-accent/30 rounded-lg transition-all duration-200 hover:scale-[1.02] group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-cosmic-purple/20 rounded-full flex items-center justify-center text-cosmic-purple font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white group-hover:text-cosmic-gold transition-colors">
                      {translatedEvent?.choices?.[choice.id] || choice.text}
                    </p>
                    {choice.energyModifier && (
                      <p className="text-xs text-cosmic-silver mt-1">
                        {choice.energyModifier > 0 ? '+' : ''}
                        {choice.energyModifier} {language === 'ru' ? 'энергии' : language === 'es' ? 'energía' : 'energy'}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-cosmic-accent/30 text-cosmic-silver hover:text-white"
            >
              {language === 'ru' ? 'Отмена' : language === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};