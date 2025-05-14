import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { CosmicButton } from '@/components/CosmicButton';
import { useTranslations } from '@/hooks/useTranslations';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format, differenceInYears } from 'date-fns';
import { ru, es, enUS } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/UserAvatar';

const UserProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const { updateUserProfile, userProfile, language, onboardingComplete, setOnboardingComplete } = useAppStore();
  const { t, getYearWord } = useTranslations();
  const [age, setAge] = useState<number | null>(null);
  
  // Get locale based on selected language
  const getLocale = () => {
    switch (language) {
      case 'ru':
        return ru;
      case 'es':
        return es;
      default:
        return enUS;
    }
  };
  
  // Create form schema based on language
  const formSchema = z.object({
    name: z.string().min(2, { 
      message: t.userProfile?.nameRequired || "Имя обязательно" 
    }),
    birthDate: z.date({
      required_error: t.userProfile?.birthDateRequired || "Укажите дату рождения"
    }),
  });

  // Initialize form with existing data or defaults
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userProfile.name !== 'Искатель' ? userProfile.name : "",
      birthDate: userProfile.birthDate || new Date(),
    },
  });
  
  // Calculate age whenever birthDate changes
  useEffect(() => {
    const birthDate = form.getValues('birthDate');
    if (birthDate) {
      const calculatedAge = differenceInYears(new Date(), birthDate);
      setAge(calculatedAge);
    }
  }, [form.watch('birthDate')]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Update the profile in Supabase
    await updateUserProfile({
      name: values.name,
      birthDate: values.birthDate
    });
    
    // After profile update, determine the next page based on onboarding status
    if (onboardingComplete) {
      // If onboarding was already completed, go directly to main
      navigate('/main');
    } else {
      // If onboarding not completed, go to onboarding page
      navigate('/onboarding');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="flex justify-center mb-4">
        <UserAvatar size="lg" />
      </div>
      
      <h2 className="text-3xl font-serif text-white mb-6">
        {t.userProfile?.title || "О тебе"}
      </h2>
      
      {age !== null && (
        <div className="mb-6 text-cosmic-secondary font-medium">
          {t.userProfile?.age || "Возраст"}: {age} {getYearWord(age)}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel className="text-cosmic-secondary text-sm">
                  {t.userProfile?.nameLabel || "Как тебя зовут"}
                </FormLabel>
                <FormControl>
                  <Input 
                    className="bg-transparent backdrop-blur-[5px] border-cosmic-accent/30 text-white"
                    placeholder={t.userProfile?.namePlaceholder || "Введите ваше имя"} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel className="text-cosmic-secondary text-sm">
                  {t.userProfile?.birthDateLabel || "Дата рождения"}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full bg-transparent backdrop-blur-[5px] border-cosmic-accent/30 text-left font-normal text-white",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: getLocale() })
                        ) : (
                          <span>{t.userProfile?.birthDatePlaceholder || "Выберите дату рождения"}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto bg-cosmic-dark/30 backdrop-blur-[5px] border-cosmic-accent/30 p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <div className="pt-4">
            <CosmicButton 
              className="w-full bg-transparent backdrop-blur-[5px] border border-cosmic-accent hover:bg-cosmic-accent/20"
              type="submit"
            >
              {t.userProfile?.continueButton || "Продолжить"}
            </CosmicButton>
          </div>
        </form>
      </Form>
      
      <div className="mt-6 text-cosmic-secondary text-sm">
        {t.userProfile?.currentDate || "Текущая дата"}: {format(new Date(), "PPP", { locale: getLocale() })}
      </div>
    </div>
  );
};

export default UserProfileForm;
