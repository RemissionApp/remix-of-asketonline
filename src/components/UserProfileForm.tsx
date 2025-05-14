import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';

export const UserProfileForm: React.FC<{ onSubmit?: () => void; onBack?: () => void }> = ({
  onSubmit,
  onBack
}) => {
  const { userProfile, updateUserProfile, onboardingComplete, setOnboardingComplete } = useAppStore();
  const { t } = useTranslations();
  
  const [name, setName] = useState<string>(userProfile.name || '');
  const [birthDate, setBirthDate] = useState<Date | null>(userProfile.birthDate || null);
  const [nameError, setNameError] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    
    if (!name.trim()) {
      setNameError(t.profile.nameRequired);
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!birthDate) {
      setDateError(t.profile.birthDateRequired);
      isValid = false;
    } else {
      setDateError('');
    }
    
    if (isValid) {
      updateUserProfile({ 
        name, 
        birthDate 
      });
      setOnboardingComplete(true);
      if (onSubmit) onSubmit();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t.profile.name}</Label>
        <Input
          id="name"
          placeholder={t.profile.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-cosmic-dark/5 backdrop-blur-sm border-cosmic-accent/30 text-white placeholder:text-white/50"
        />
        {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birthDate">{t.profile.birthDate}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !birthDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {birthDate ? (
                format(birthDate, "PPP", {locale: ru})
              ) : (
                <span>{t.profile.pickDate}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              locale={ru}
              selected={birthDate}
              onSelect={setBirthDate}
              disabled={(date) =>
                date > new Date() || date < new Date('1900-01-01')
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
      </div>
      
      <div className="flex justify-between">
        {onBack && (
          <CosmicButton variant="secondary" onClick={onBack}>
            {t.profile.back}
          </CosmicButton>
        )}
        <CosmicButton type="submit">{ onboardingComplete ? t.profile.update : t.profile.continue }</CosmicButton>
      </div>
    </form>
  );
};
