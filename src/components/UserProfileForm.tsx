
import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CosmicButton } from '@/components/CosmicButton';
import { useTranslations } from '@/hooks/useTranslations';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const UserProfileForm: React.FC = () => {
  const { updateUserProfile, setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  
  // Create form schema based on language
  const formSchema = z.object({
    name: z.string().min(2, { 
      message: t.userProfile?.nameRequired || "Имя обязательно" 
    }),
    age: z.coerce.number().int().min(5).max(120).optional(),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: undefined
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateUserProfile({
      name: values.name,
      age: values.age
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
            name="age"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel className="text-cosmic-secondary text-sm">
                  {t.userProfile?.ageLabel || "Возраст"}
                </FormLabel>
                <FormControl>
                  <Input 
                    className="bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                    type="number"
                    placeholder={t.userProfile?.agePlaceholder || "Введите ваш возраст"} 
                    {...field} 
                    onChange={event => field.onChange(event.target.value === "" ? undefined : parseInt(event.target.value, 10))}
                  />
                </FormControl>
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
