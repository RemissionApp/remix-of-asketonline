
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useTranslations } from '@/hooks/useTranslations';
import { CosmicButton } from '@/components/CosmicButton';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

interface NameEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NameEditor: React.FC<NameEditorProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslations();
  const { userProfile, updateUserProfile, user } = useAppStore();
  const [tempName, setTempName] = useState<string>(userProfile?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  
  // Save the new name
  const handleSaveName = async () => {
    if (!user || !tempName || tempName.trim() === '') {
      toast({
        title: t.errors?.invalidName || "Ошибка",
        description: t.errors?.nameRequired || "Имя не может быть пустым",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Обновляем в Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: tempName.trim()
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Обновляем локальное состояние
      await updateUserProfile({
        ...userProfile,
        name: tempName.trim()
      });
      
      toast({
        title: t.success?.nameUpdated || "Имя обновлено",
        description: t.success?.profileSaved || "Ваши данные успешно сохранены"
      });
    } catch (error: any) {
      console.error("Error updating name:", error);
      toast({
        title: t.errors?.updateFailed || "Ошибка",
        description: error.message || t.errors?.nameUpdateFailed || "Не удалось обновить имя",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cosmic-dark border-cosmic-accent/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cosmic-accent">
            {t.userProfile?.editName || "Изменить имя"}
          </DialogTitle>
          <DialogDescription className="text-cosmic-secondary">
            {t.userProfile?.enterNewName || "Введите новое имя"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="bg-transparent backdrop-blur-[5px] border-cosmic-accent/30 text-white"
            placeholder={t.userProfile?.namePlaceholder || "Ваше имя"}
            autoFocus
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-cosmic-accent/30 text-cosmic-secondary hover:bg-cosmic-accent/10"
            disabled={isLoading}
          >
            {t.common?.cancel || "Отмена"}
          </Button>
          <CosmicButton onClick={handleSaveName} disabled={isLoading}>
            {isLoading 
              ? (t.common?.saving || "Сохранение...") 
              : (t.common?.save || "Сохранить")}
          </CosmicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NameEditor;
