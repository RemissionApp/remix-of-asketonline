
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const ContactForm: React.FC = () => {
  const { t } = useTranslations();
  const { userProfile } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form schema
  const formSchema = z.object({
    name: z.string().min(2, { 
      message: t.errors?.nameRequired || "Имя обязательно" 
    }),
    email: z.string().email({
      message: t.errors?.invalidEmail || "Неверный формат email"
    }),
    message: z.string().min(10, {
      message: t.errors?.messageMinLength || "Сообщение должно содержать не менее 10 символов"
    }),
  });
  
  // Initialize form with user data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userProfile?.name || '',
      email: userProfile?.email || '',
      message: ''
    }
  });
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Send email to developer
      const { error } = await supabase.functions.invoke('send-developer-email', {
        body: {
          name: values.name,
          email: values.email,
          message: values.message,
          userInfo: {
            userId: userProfile.id,
            isPro: userProfile.isPro
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: t.support?.emailSent || "Сообщение отправлено",
        description: t.support?.emailSentDesc || "Спасибо за обращение! Мы постараемся ответить как можно скорее.",
      });
      
      // Reset form
      form.reset({
        name: values.name,
        email: values.email,
        message: ''
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: t.errors?.emailError || "Ошибка отправки",
        description: t.errors?.emailErrorDesc || "Не удалось отправить сообщение. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-cosmic-secondary">
                {t.support?.nameLabel || "Имя"}
              </FormLabel>
              <FormControl>
                <Input 
                  className="bg-transparent border-cosmic-accent/30 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-cosmic-secondary">
                {t.support?.emailLabel || "Email"}
              </FormLabel>
              <FormControl>
                <Input 
                  className="bg-transparent border-cosmic-accent/30 text-white"
                  type="email"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-cosmic-secondary">
                {t.support?.messageLabel || "Сообщение"}
              </FormLabel>
              <FormControl>
                <Textarea 
                  className="min-h-[150px] bg-transparent border-cosmic-accent/30 text-white resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-cosmic-accent/20 hover:bg-cosmic-accent/30 border border-cosmic-accent/30 text-white"
          disabled={isLoading}
        >
          {isLoading 
            ? (t.support?.sending || "Отправка...") 
            : (t.support?.send || "Отправить")}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
