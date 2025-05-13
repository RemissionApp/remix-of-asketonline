
import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CosmicButton } from '@/components/CosmicButton';
import { useTranslations } from '@/hooks/useTranslations';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const UserProfileForm: React.FC = () => {
  const { updateUserProfile, setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  
  // Create form schema based on language
  const formSchema = z.object({
    name: z.string().min(2, { 
      message: t.userProfile?.nameRequired || "Имя обязательно" 
    }),
    birthDate: z.date({
      required_error: t.userProfile?.birthDateRequired || "Укажите дату рождения"
    }),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateUserProfile({
      name: values.name,
      birthDate: values.birthDate
    });
    setActiveScreen('onboarding');
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <h2 className="text-3xl font-serif text-white mb-8">
        {t.userProfile?.title || "О тебе"}
      </h2>
      
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
                    className="bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
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
                          "w-full bg-cosmic-dark/50 border-cosmic-accent/30 text-left font-normal text-white",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{t.userProfile?.birthDatePlaceholder || "Выберите дату рождения"}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto bg-cosmic-dark border-cosmic-accent/30 p-0" align="start">
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
            <CosmicButton className="w-full">
              {t.userProfile?.continueButton || "Продолжить"}
            </CosmicButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserProfileForm;
