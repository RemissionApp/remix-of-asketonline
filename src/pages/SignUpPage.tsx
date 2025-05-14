
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { Card, CardContent } from '@/components/ui/card';
import { CosmicButton } from '@/components/CosmicButton';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Link } from 'react-router-dom';
import { UserIcon, ArrowRight } from 'lucide-react';

const SignUpPage: React.FC = () => {
  const { setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  const [loading, setLoading] = useState(false);
  
  // Form schema
  const formSchema = z.object({
    email: z.string().email({
      message: t.auth?.emailInvalid || "Неверный формат email"
    }),
    password: z.string().min(6, {
      message: t.auth?.passwordLength || "Пароль должен быть не менее 6 символов"
    }),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t.auth?.passwordMatch || "Пароли не совпадают",
    path: ["confirmPassword"],
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      // For demonstration, we'll just log and proceed
      console.log('Sign up attempt:', values);
      
      // In a real app, you would register with a backend here
      // const response = await authService.signUp(values);
      
      setTimeout(() => {
        setLoading(false);
        setActiveScreen('onboarding');
      }, 1000);
    } catch (error) {
      console.error('Sign up error:', error);
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    setActiveScreen('onboarding');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <StarField starCount={150} />
      
      {/* Cosmic background image */}
      <div className="fixed inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url('/lovable-uploads/1fab6aac-8009-418b-8685-51057869b4ad.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/20 to-cosmic-dark/80" />
      </div>
      
      <div className="relative z-10 max-w-md w-full mx-auto px-4">
        <Card className="cosmic-card backdrop-blur-lg bg-cosmic-dark/40">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-cosmic-accent/10 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-cosmic-accent" />
              </div>
              <h2 className="text-2xl font-serif text-white mt-4">
                {t.auth?.createAccountTitle || "Создать аккаунт"}
              </h2>
              <p className="text-cosmic-secondary mt-2">
                {t.auth?.signUpSubtitle || "Зарегистрируйтесь, чтобы начать"}
              </p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cosmic-secondary">{t.auth?.email || "Email"}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t.auth?.emailPlaceholder || "user@example.com"} 
                          className="bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cosmic-secondary">{t.auth?.password || "Пароль"}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder={t.auth?.passwordPlaceholder || "••••••••"} 
                          className="bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-cosmic-secondary">
                        {t.auth?.confirmPassword || "Подтвердите пароль"}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder={t.auth?.passwordPlaceholder || "••••••••"} 
                          className="bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <CosmicButton type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-cosmic-secondary border-t-white rounded-full"></span>
                        {t.auth?.processing || "Обработка..."}
                      </span>
                    ) : (
                      <span>{t.auth?.signUpButton || "Создать аккаунт"}</span>
                    )}
                  </CosmicButton>
                </div>
                
                <div className="text-center text-cosmic-secondary text-sm pt-2">
                  <p>{t.auth?.haveAccount || "Уже есть аккаунт?"} {' '}
                    <Link to="/signin" className="text-cosmic-accent hover:underline">
                      {t.auth?.signIn || "Войти"}
                    </Link>
                  </p>
                </div>
                
                <div className="flex items-center pt-4">
                  <div className="flex-grow h-px bg-cosmic-accent/20"></div>
                  <span className="px-4 text-sm text-cosmic-secondary">{t.auth?.orContinueWith || "Или продолжить как"}</span>
                  <div className="flex-grow h-px bg-cosmic-accent/20"></div>
                </div>
                
                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={handleContinueAsGuest}
                    className="w-full flex items-center justify-center px-4 py-2 border border-cosmic-accent/30 rounded-md hover:bg-cosmic-accent/10 transition-colors text-cosmic-secondary"
                  >
                    <span>{t.auth?.continueAsGuest || "Гость"}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
