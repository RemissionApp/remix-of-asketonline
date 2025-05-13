
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from '@/hooks/useTranslations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/components/AuthLayout";

const SignInSchema = z.object({
  email: z.string().email({
    message: "Invalid email format",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

type SignInValues = z.infer<typeof SignInSchema>;

const SignInPage = () => {
  const { t } = useTranslations();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInValues) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: error.name,
          description: error.message,
        });
        return;
      }

      toast({
        title: t.auth.welcomeBack,
        description: "Login successful!",
      });

      // Redirect to main page after successful login
      window.location.href = '/';

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={t.welcome.title} 
      subtitle={t.auth.welcomeBack}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.auth.email}</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.auth.password}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              {t.auth.forgotPassword}
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : t.auth.signInButton}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-muted-foreground">
          {t.auth.noAccount}{' '}
          <Link to="/signup" className="text-primary hover:underline font-medium">
            {t.auth.signUp}
          </Link>
        </p>
      </div>

      <div className="flex items-center my-6">
        <Separator className="flex-grow" />
        <span className="px-4 text-xs text-muted-foreground">{t.auth.orContinueWith}</span>
        <Separator className="flex-grow" />
      </div>

      <div className="flex justify-center space-x-4">
        {/* Future social auth buttons could go here */}
      </div>
    </AuthLayout>
  );
};

export default SignInPage;
