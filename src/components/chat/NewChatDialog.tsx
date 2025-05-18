
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewChatDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateSession: (title: string) => Promise<void>;
}

export const NewChatDialog: React.FC<NewChatDialogProps> = ({
  open,
  onClose,
  onCreateSession
}) => {
  const [title, setTitle] = useState('Новый диалог с Вселенной');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onCreateSession(title);
      setTitle('Новый диалог с Вселенной');
    } catch (error) {
      console.error('Error creating new chat session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-cosmic-dark border-cosmic-accent/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-cosmic-accent">Создать новый диалог</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm text-white/80">Название диалога</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название"
                className="bg-cosmic-dark/60 border-cosmic-accent/30 text-white"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10"
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim() || isSubmitting}
              className="bg-cosmic-accent hover:bg-cosmic-accent/90"
            >
              {isSubmitting ? 'Создание...' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
