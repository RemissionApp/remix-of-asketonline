
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';
import { toast } from 'sonner';

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateChat: (title: string) => Promise<void>;
}

export const NewChatDialog: React.FC<NewChatDialogProps> = ({ 
  open, 
  onOpenChange,
  onCreateChat 
}) => {
  const [newChatTitle, setNewChatTitle] = useState('');
  const { t } = useTranslations();
  
  const handleCreateNewChat = async () => {
    if (newChatTitle.trim().length < 3) {
      toast.error('Название диалога должно содержать не менее 3 символов');
      return;
    }
    
    try {
      await onCreateChat(newChatTitle);
      setNewChatTitle('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating chat session:', error);
      toast.error('Не удалось создать новый диалог');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cosmic-dark border-cosmic-accent/30 text-white">
        <h3 className="text-lg font-medium font-serif text-cosmic-accent mb-4">
          {t.universe?.newChatTitle || 'Новый диалог со Вселенной'}
        </h3>
        <Label htmlFor="chat-title" className="text-cosmic-secondary text-sm">
          {t.universe?.chatTitleLabel || 'Название диалога'}
        </Label>
        <Input
          id="chat-title"
          value={newChatTitle}
          onChange={(e) => setNewChatTitle(e.target.value)}
          placeholder={t.universe?.chatTitlePlaceholder || 'Например: Поиск моего пути'}
          className="bg-cosmic-dark/50 border-cosmic-accent/30 text-white mb-4"
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            {t.common?.cancel || 'Отмена'}
          </Button>
          <Button
            onClick={handleCreateNewChat}
            className="bg-cosmic-accent hover:bg-cosmic-accent/90"
            disabled={newChatTitle.trim().length < 3}
          >
            {t.common?.create || 'Создать'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
