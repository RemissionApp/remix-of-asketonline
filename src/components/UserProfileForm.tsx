
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from "@/components/ui/date-picker";
import { useTranslations } from '@/hooks/useTranslations';
import { useToast } from '@/hooks/use-toast';

interface UserProfileFormProps {
  onSuccess?: () => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSuccess = () => {} }) => {
  const { updateUserProfile, userProfile } = useAppStore();
  const navigate = useNavigate();
  const { t } = useTranslations();
  const { toast } = useToast();
  
  const initialBirthDate = userProfile?.birthDate ? new Date(userProfile.birthDate) : null;
  
  const [birthDate, setBirthDate] = React.useState<Date | null>(initialBirthDate);
  
  const formSchema = z.object({
    name: z.string()
      .min(2, t.userProfile?.nameRequired || "Name must be at least 2 characters")
      .max(50, t.userProfile?.nameMaxLength || "Name must be 50 characters or less"),
    age: z.number()
      .int(t.userProfile?.ageValidationInteger || 'Must be an integer')
      .min(5, t.userProfile?.ageValidationTooYoung || 'Too young')
      .max(120, t.userProfile?.ageValidationTooOld || 'Too old')
      .nullable()
      .optional(),
    goal: z.string()
      .min(10, t.userProfile?.goalValidationShort || 'Must be at least 10 characters')
      .max(200, t.userProfile?.goalValidationLong || 'Must be 200 characters or less'),
    zodiacSign: z.string().optional(),
    birthDate: z.date().nullable().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userProfile?.name || '',
      age: userProfile?.age || undefined,
      goal: userProfile?.goal || '',
      zodiacSign: userProfile?.zodiacSign || '',
      birthDate: initialBirthDate || undefined,
    },
  });
  
  const handleBirthDateChange = (date: Date | null) => {
    setBirthDate(date);
    form.setValue('birthDate', date);
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const profileData = {
      ...values,
      birthDate: values.birthDate ? values.birthDate.toISOString() : null,
    };
    
    try {
      await updateUserProfile(profileData);
      toast({
        title: t.userProfile?.profileUpdated || "Profile updated",
        description: t.userProfile?.profileUpdatedDesc || "Your profile has been updated successfully",
      });
      
      if (onSuccess) onSuccess();
      navigate('/main');
    } catch (error) {
      toast({
        title: t.userProfile?.profileUpdateFailed || "Update failed",
        description: t.userProfile?.profileUpdateFailedDesc || "There was a problem updating your profile",
        variant: "destructive",
      });
    }
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">{t.userProfile?.nameLabel || 'Name'}</Label>
        <Input
          type="text"
          id="name"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <div className="text-red-500">{form.formState.errors.name.message}</div>
        )}
      </div>
      
      <div>
        <Label htmlFor="age">{t.userProfile?.ageLabel || 'Age'}</Label>
        <Input
          type="number"
          id="age"
          {...form.register('age', { valueAsNumber: true })}
        />
        {form.formState.errors.age && (
          <div className="text-red-500">{form.formState.errors.age.message}</div>
        )}
      </div>
      
      <div>
        <Label htmlFor="goal">{t.userProfile?.goalLabel || 'Life Goal'}</Label>
        <Input
          type="text"
          id="goal"
          {...form.register('goal')}
        />
        {form.formState.errors.goal && (
          <div className="text-red-500">{form.formState.errors.goal.message}</div>
        )}
      </div>
      
      <div>
        <Label htmlFor="birthDate">{t.userProfile?.birthDateLabel || 'Birth Date'}</Label>
        <DatePicker
          id="birthDate"
          onSelect={handleBirthDateChange}
          date={birthDate}
        />
        {form.formState.errors.birthDate && (
          <div className="text-red-500">{form.formState.errors.birthDate.message}</div>
        )}
      </div>
      
      <CosmicButton type="submit" disabled={form.formState.isSubmitting}>
        {t.userProfile?.submitButton || 'Submit'}
      </CosmicButton>
    </form>
  );
};

export default UserProfileForm;
