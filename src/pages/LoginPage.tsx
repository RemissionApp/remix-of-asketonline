
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase, cleanupAuthState } from '@/lib/supabase';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  
  // We directly access the store to ensure it's ready for the component
  const store = useAppStore((state) => state);
  
  // Initialize state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [loading, setLoading] = useState(false);
  
  // Effect to check if user is already logged in
  useEffect(() => {
    // Check if user is already logged in
    const checkAuthState = async () => {
      if (store.user) {
        console.log("Login page: user is logged in", { user: store.user });
        navigate('/main');
      }
    };
    
    checkAuthState();
  }, [store.user, navigate]);
  
  // Handle sign in with safety checks
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Ошибка входа",
        description: "Пожалуйста, введите email и пароль",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Clean up auth state before signing in
      cleanupAuthState();
      
      // Check if store has the signIn function
      if (typeof store.signIn !== 'function') {
        console.error("signIn function is not available", { store });
        toast({
          title: "System Error",
          description: "Authentication system is currently unavailable. Please try again later.",
          variant: "destructive"
        });
        return;
      }
      
      const success = await store.signIn(email, password);
      
      if (success) {
        console.log("Sign in successful");
        navigate('/main');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Ошибка входа",
        description: error.message || "Произошла ошибка при входе",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle sign up with safety checks
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Ошибка регистрации",
        description: "Пожалуйста, введите email и пароль",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Clean up auth state before signing up
      cleanupAuthState();
      
      // Check if store has the signUp function
      if (typeof store.signUp !== 'function') {
        console.error("signUp function is not available", { store });
        toast({
          title: "System Error",
          description: "Registration system is currently unavailable. Please try again later.",
          variant: "destructive"
        });
        return;
      }
      
      await store.signUp(email, password);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Произошла ошибка при регистрации",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Введите email",
        description: "Для сброса пароля необходимо указать email",
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
        description: "Инструкции по сбросу пароля отправлены на ваш email"
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Ошибка сброса пароля",
        description: error.message || "Не удалось отправить инструкции по сбросу пароля",
        variant: "destructive"
      });
    }
  };

  const handleGuestLogin = () => {
    toast({
      title: "Гостевой вход",
      description: "Вход в качестве гостя",
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
        
        <Card className="backdrop-blur-sm bg-cosmic-dark/10 border-cosmic-accent/30 shadow-lg">
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-cosmic-dark/20">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="signup">Регистрация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">{t.auth?.email || "Email"}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent h-5 w-5 z-10" />
                      <Input
                        id="email"
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="pl-10 bg-cosmic-dark/5 backdrop-blur-sm border-cosmic-accent/30 text-white placeholder:text-white/50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">{t.auth?.password || "Пароль"}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent h-5 w-5 z-10" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-cosmic-dark/5 backdrop-blur-sm border-cosmic-accent/30 text-white placeholder:text-white/50"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent z-10"
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
                      {t.auth?.forgotPassword || "Забыли пароль?"}
                    </button>
                  </div>
                  
                  <div className="pt-4">
                    <CosmicButton 
                      type="submit" 
                      className="w-full bg-cosmic-accent/70 backdrop-blur-sm hover:bg-cosmic-accent/80" 
                      disabled={loading}
                    >
                      {loading ? (t.auth?.loggingIn || "Вход...") : (t.auth?.signInButton || "Войти")}
                    </CosmicButton>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-white text-sm">
                      {t.auth?.noAccount || "Нет аккаунта?"}{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("signup")}
                        className="text-cosmic-accent hover:text-cosmic-accent/80 transition-colors"
                      >
                        {t.auth?.signUp || "Регистрация"}
                      </button>
                    </p>
                  </div>

                  <div className="pt-4 relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-cosmic-accent/20"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-cosmic-dark/10 backdrop-blur-sm px-2 text-xs text-cosmic-accent">{t.auth?.orContinueWith || "Или войти как"}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10 bg-cosmic-dark/5 backdrop-blur-sm"
                      onClick={handleGuestLogin}
                    >
                      {t.auth?.guestSignIn || "Гость"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">{t.auth?.email || "Email"}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent h-5 w-5 z-10" />
                      <Input
                        id="signup-email"
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="pl-10 bg-cosmic-dark/5 backdrop-blur-sm border-cosmic-accent/30 text-white placeholder:text-white/50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">{t.auth?.password || "Пароль"}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent h-5 w-5 z-10" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-cosmic-dark/5 backdrop-blur-sm border-cosmic-accent/30 text-white placeholder:text-white/50"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent z-10"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <CosmicButton 
                      type="submit" 
                      className="w-full bg-cosmic-accent/70 backdrop-blur-sm hover:bg-cosmic-accent/80" 
                      disabled={loading}
                    >
                      {loading ? (t.auth?.signingUp || "Регистрация...") : (t.auth?.signUpButton || "Зарегистрироваться")}
                    </CosmicButton>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-white text-sm">
                      {t.auth?.haveAccount || "Уже есть аккаунт?"}{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("login")}
                        className="text-cosmic-accent hover:text-cosmic-accent/80 transition-colors"
                      >
                        {t.auth?.signIn || "Войти"}
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
