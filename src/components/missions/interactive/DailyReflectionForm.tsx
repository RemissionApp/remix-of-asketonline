import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DailyQuestion } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

interface DailyReflectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  question: DailyQuestion;
  onSubmit: (answer: any) => void;
}

export const DailyReflectionForm: React.FC<DailyReflectionFormProps> = ({
  isOpen,
  onClose,
  question,
  onSubmit,
}) => {
  const { language } = useAppStore();
  const [textAnswer, setTextAnswer] = useState('');
  const [scaleAnswer, setScaleAnswer] = useState([5]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleSubmit = () => {
    let answer;
    
    switch (question.type) {
      case 'text':
      case 'reflection':
        answer = textAnswer;
        break;
      case 'scale':
        answer = scaleAnswer[0];
        break;
      case 'photo':
        answer = { text: textAnswer, photo: photoFile };
        break;
      default:
        answer = textAnswer;
    }

    onSubmit(answer);
    
    // Reset form
    setTextAnswer('');
    setScaleAnswer([5]);
    setPhotoFile(null);
  };

  const isValid = () => {
    if (question.type === 'photo' && question.required) {
      return textAnswer.trim() !== '' || photoFile !== null;
    }
    if (question.type === 'text' || question.type === 'reflection') {
      return !question.required || textAnswer.trim() !== '';
    }
    return true;
  };

  const renderInput = () => {
    switch (question.type) {
      case 'reflection':
      case 'text':
        return (
          <Textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder={
              language === 'ru' 
                ? 'Поделитесь своими мыслями...' 
                : language === 'es' 
                ? 'Comparte tus pensamientos...' 
                : 'Share your thoughts...'
            }
            className="bg-cosmic-accent/10 border-cosmic-accent/30 text-white placeholder:text-cosmic-silver/50 min-h-[120px]"
            required={question.required}
          />
        );

      case 'scale':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-2xl font-bold text-cosmic-gold">{scaleAnswer[0]}</span>
              <span className="text-cosmic-silver ml-2">/ 10</span>
            </div>
            <Slider
              value={scaleAnswer}
              onValueChange={setScaleAnswer}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-cosmic-silver">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
        );

      case 'photo':
        return (
          <div className="space-y-4">
            <Textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder={
                language === 'ru' 
                  ? 'Опишите ваш опыт...' 
                  : language === 'es' 
                  ? 'Describe tu experiencia...' 
                  : 'Describe your experience...'
              }
              className="bg-cosmic-accent/10 border-cosmic-accent/30 text-white placeholder:text-cosmic-silver/50"
            />
            
            <div className="border-2 border-dashed border-cosmic-accent/30 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer text-cosmic-silver hover:text-cosmic-gold transition-colors"
              >
                <div className="text-4xl mb-2">📸</div>
                <p>
                  {language === 'ru' 
                    ? 'Добавить фото (опционально)' 
                    : language === 'es' 
                    ? 'Añadir foto (opcional)' 
                    : 'Add photo (optional)'}
                </p>
                {photoFile && (
                  <p className="text-cosmic-gold mt-2">{photoFile.name}</p>
                )}
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cosmic-dark border-cosmic-accent/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cosmic-gold text-center">
            ✨ {language === 'ru' ? 'Вопрос дня' : language === 'es' ? 'Pregunta del día' : 'Daily Question'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center p-4 bg-cosmic-purple/10 rounded-lg border border-cosmic-purple/30">
            <p className="text-white">{question.question}</p>
          </div>

          {renderInput()}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-cosmic-accent/30 text-cosmic-silver hover:text-white"
            >
              {language === 'ru' ? 'Отмена' : language === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid()}
              className="flex-1 bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === 'ru' ? 'Отправить' : language === 'es' ? 'Enviar' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};