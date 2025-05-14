
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loading } = useAppStore();
  const { t } = useTranslations();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите email для восстановления пароля",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/profile-setup',
      });

      if (error) throw error;

      toast({
        title: "Сброс пароля",
        description: "Проверьте вашу электронную почту для инструкций по сбросу пароля"
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить инструкции по сбросу пароля",
        variant: "destructive"
      });
    }
  };

  const handleGuestLogin = () => {
    toast({
      title: "Гостевой режим",
      description: "Внимание: прогресс пользователя не будет сохранен",
      variant: "warning"
    });
    
    // Navigate to main page as guest
    setTimeout(() => {
      navigate('/main');
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        <h1 className="text-4xl font-serif text-white text-center mb-8">Asket</h1>
        
        <Card className="cosmic-card backdrop-blur-lg bg-cosmic-dark/30 border-cosmic-accent/30">
          <CardContent className="pt-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="signup">Регистрация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent h-5 w-5" />
                      <Input
                        id="email"
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="pl-10 bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent h-5 w-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      className="text-cosmic-accent hover:text-cosmic-accent/80 text-sm transition-colors"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                  
                  <div className="pt-4">
                    <CosmicButton 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? "Загрузка..." : "Войти"}
                    </CosmicButton>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-white text-sm">
                      Нет аккаунта?{" "}
                      <button
                        type="button"
                        onClick={() => document.querySelector('[value="signup"]')?.dispatchEvent(new Event('click'))}
                        className="text-cosmic-accent hover:text-cosmic-accent/80 transition-colors"
                      >
                        Зарегистрироваться
                      </button>
                    </p>
                  </div>

                  <div className="pt-4 relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-cosmic-accent/20"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-cosmic-dark/50 px-2 text-xs text-cosmic-accent">или</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10"
                      onClick={handleGuestLogin}
                    >
                      Войти как гость
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent h-5 w-5" />
                      <Input
                        id="signup-email"
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="pl-10 bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Пароль</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent h-5 w-5" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <CosmicButton 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? "Загрузка..." : "Создать аккаунт"}
                    </CosmicButton>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-white text-sm">
                      Уже есть аккаунт?{" "}
                      <button
                        type="button"
                        onClick={() => document.querySelector('[value="login"]')?.dispatchEvent(new Event('click'))}
                        className="text-cosmic-accent hover:text-cosmic-accent/80 transition-colors"
                      >
                        Войти
                      </button>
                    </p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
