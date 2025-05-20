
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useTranslations } from '@/hooks/useTranslations';
import { CosmicButton } from '@/components/CosmicButton';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { formatDate, getLocaleByLanguage } from '@/utils/dateFormatUtils';

interface BirthDateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BirthDateEditor: React.FC<BirthDateEditorProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslations();
  const { userProfile, updateUserProfile, user, language } = useAppStore();
  const [tempBirthDate, setTempBirthDate] = useState<Date | null>(
    userProfile?.birthDate ? new Date(userProfile.birthDate) : null
  );
  const [isLoading, setIsLoading] = useState(false);
  
  // Save the new birth date
  const handleSaveBirthDate = async () => {
    if (!user || !tempBirthDate) {
      onOpenChange(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format birthDate to YYYY-MM-DD for Supabase
      const formattedBirthDate = formatDate(tempBirthDate, 'en', false).split('/').reverse().join('-');
      
      // Update directly in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          birth_date: formattedBirthDate
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Also update the local store
      await updateUserProfile({
        ...userProfile,
        birthDate: formattedBirthDate
      });
      
      toast({
        title: t.success?.birthDateUpdated || "Дата рождения обновлена",
        description: t.success?.profileSaved || "Ваши данные успешно сохранены"
      });
    } catch (error: any) {
      console.error("Error updating birth date:", error);
      toast({
        title: t.errors?.updateFailed || "Ошибка",
        description: error.message || t.errors?.birthDateUpdateFailed || "Не удалось обновить дату рождения",
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
            {t.zodiac?.editBirthDate || "Edit birth date"}
          </DialogTitle>
          <DialogDescription className="text-cosmic-secondary">
            {t.userProfile?.birthDateLabel || "Дата рождения"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Calendar
            mode="single"
            selected={tempBirthDate || undefined}
            onSelect={(date) => setTempBirthDate(date)}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
            className="mx-auto pointer-events-auto"
            locale={getLocaleByLanguage(language)}
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
          <CosmicButton onClick={handleSaveBirthDate} disabled={isLoading}>
            {isLoading 
              ? (t.common?.saving || "Сохранение...") 
              : (t.common?.save || "Сохранить")}
          </CosmicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BirthDateEditor;
