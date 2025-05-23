
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store/useAppStore';
import { Heart, MessageCircle } from 'lucide-react';

interface BreakAscesisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pactTitle: string;
  pactId: string;
}

export const BreakAscesisDialog: React.FC<BreakAscesisDialogProps> = ({
  isOpen,
  onClose,
  pactTitle,
  pactId
}) => {
  const [reason, setReason] = useState('');
  const [showSupportMessage, setShowSupportMessage] = useState(false);
  const { breakAscesis, language } = useAppStore();

  const handleBreakAscesis = async () => {
    await breakAscesis(pactId, reason);
    setShowSupportMessage(true);
  };

  const handleClose = () => {
    setReason('');
    setShowSupportMessage(false);
    onClose();
  };

  const supportMessages = {
    ru: {
      title: "Поддержка от Вселенной",
      message: "Дорогой искатель, то, что ты пытался изменить себя — уже огромный шаг на пути к просветлению. Неудача — это не конец, а начало нового понимания. Каждая попытка делает тебя сильнее. В следующий раз ты обязательно справишься, ведь теперь ты знаешь больше о себе. Твоя душа растёт через опыт, и каждый шаг важен. 🌟",
      understood: "Понял, спасибо"
    },
    en: {
      title: "Support from the Universe",
      message: "Dear seeker, the fact that you tried to change yourself is already a huge step on the path to enlightenment. Failure is not the end, but the beginning of new understanding. Each attempt makes you stronger. Next time you will definitely succeed, because now you know more about yourself. Your soul grows through experience, and every step matters. 🌟",
      understood: "Understood, thank you"
    },
    es: {
      title: "Apoyo del Universo",
      message: "Querido buscador, el hecho de que intentaras cambiarte a ti mismo ya es un gran paso en el camino hacia la iluminación. El fracaso no es el final, sino el comienzo de una nueva comprensión. Cada intento te hace más fuerte. La próxima vez definitivamente lo lograrás, porque ahora sabes más sobre ti mismo. Tu alma crece a través de la experiencia, y cada paso importa. 🌟",
      understood: "Entendido, gracias"
    }
  };

  const texts = {
    ru: {
      title: "Прервать аскезу",
      subtitle: `Вы уверены, что хотите прервать аскезу "${pactTitle}"?`,
      reasonLabel: "Расскажите, что помешало (необязательно)",
      reasonPlaceholder: "Опишите причину или сложности, с которыми столкнулись...",
      couldntDo: "Я не смог",
      cancel: "Отмена",
      warning: "Вы потеряете 100 энергетических очков"
    },
    en: {
      title: "Break Asceticism",
      subtitle: `Are you sure you want to break the asceticism "${pactTitle}"?`,
      reasonLabel: "Tell us what prevented you (optional)",
      reasonPlaceholder: "Describe the reason or difficulties you faced...",
      couldntDo: "I couldn't do it",
      cancel: "Cancel",
      warning: "You will lose 100 energy points"
    },
    es: {
      title: "Romper Ascetismo",
      subtitle: `¿Estás seguro de que quieres romper el ascetismo "${pactTitle}"?`,
      reasonLabel: "Cuéntanos qué te lo impidió (opcional)",
      reasonPlaceholder: "Describe la razón o las dificultades que enfrentaste...",
      couldntDo: "No pude hacerlo",
      cancel: "Cancelar",
      warning: "Perderás 100 puntos de energía"
    }
  };

  const currentTexts = texts[language] || texts.ru;
  const currentSupport = supportMessages[language] || supportMessages.ru;

  if (showSupportMessage) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="cosmic-card max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-cosmic-accent">
              <Heart className="w-5 h-5" />
              {currentSupport.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-6 h-6 text-cosmic-accent mt-1 flex-shrink-0" />
              <p className="text-white leading-relaxed">
                {currentSupport.message}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleClose} className="cosmic-button w-full">
              {currentSupport.understood}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="cosmic-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {currentTexts.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-cosmic-secondary">
            {currentTexts.subtitle}
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-white">
              {currentTexts.reasonLabel}
            </Label>
            <Textarea
              id="reason"
              placeholder={currentTexts.reasonPlaceholder}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="cosmic-input min-h-[80px]"
            />
          </div>
          
          <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg">
            ⚠️ {currentTexts.warning}
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            {currentTexts.cancel}
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleBreakAscesis}
            className="bg-red-600 hover:bg-red-700"
          >
            {currentTexts.couldntDo}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
