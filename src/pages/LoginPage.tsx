import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { supabase, cleanupAuthState } from '@/lib/supabase';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  LoginVoiceGreeting,
  LoginVoiceGreetingRef,
} from '@/components/auth/LoginVoiceGreeting';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    signIn,
    signUp,
    loading,
    user,
    userProfile,
    checkEmailConfirmation,
    emailConfirmed,
    sendOtpCode,
    verifyOtpCode,
  } = useAppStore();
  const { t } = useTranslations();
  const voiceGreetingRef = useRef<LoginVoiceGreetingRef>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('login');
  const [emailSent, setEmailSent] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Эффект для проверки, вошел ли пользователь уже в систему
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Проверяем текущую сессию
        const { data } = await supabase.auth.getSession();

        // Если пользователь уже вошел в систему
        if (data?.session?.user) {
          console.log('Пользователь уже авторизован:', data.session.user);

          // Проверяем подтверждение email
          const isConfirmed = await checkEmailConfirmation();

          if (!isConfirmed) {
            toast({
              title: 'Подтвердите email',
              description:
                'Пожалуйста, подтвердите ваш email перед продолжением',
              variant: 'warning',
            });
            setAuthChecking(false);
            return;
          }

      // Проверяем, заполнил ли пользователь профиль используя централизованную функцию
      const storeState = useAppStore.getState();
      const profileComplete = storeState.isProfileComplete();
      
      if (profileComplete) {
        // Пользователь имеет заполненный профиль, проверяем onboarding
        const onboardingComplete = storeState.checkOnboardingStatus();
        if (onboardingComplete) {
          navigate('/main');
        } else {
          navigate('/onboarding');
        }
      } else {
        // Пользователю необходимо заполнить профиль
        navigate('/profile-setup');
      }
        } else {
          setAuthChecking(false);
        }
      } catch (err) {
        console.error('Ошибка при проверке статуса аутентификации:', err);
        setAuthChecking(false);
      }
    };

    checkAuthStatus();
  }, [navigate, checkEmailConfirmation, userProfile]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: t.auth.error,
        description: 'Пожалуйста, введите email и пароль',
        variant: 'destructive',
      });
      return;
    }

    // Воспроизводим приветствие при нажатии кнопки входа
    voiceGreetingRef.current?.playGreeting();

    // Очищаем состояние аутентификации перед входом в систему
    cleanupAuthState();

    const success = await signIn(email, password);
    if (success) {
      console.log('Вход выполнен успешно');
      // Проверяем, подтвержден ли email
      const isConfirmed = await checkEmailConfirmation();

      if (!isConfirmed) {
        toast({
          title: 'Подтвердите email',
          description: 'Пожалуйста, подтвердите ваш email перед продолжением',
          variant: 'warning',
        });
        return;
      }

      // Используем централизованную проверку профиля
      const storeState = useAppStore.getState();
      const profileComplete = storeState.isProfileComplete();
      
      if (!profileComplete) {
        navigate('/profile-setup');
      } else {
        // Профиль заполнен, проверяем onboarding
        const onboardingComplete = storeState.checkOnboardingStatus();
        if (onboardingComplete) {
          navigate('/main');
        } else {
          navigate('/onboarding');
        }
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, введите email и пароль',
        variant: 'destructive',
      });
      return;
    }

    // Очищаем состояние аутентификации перед регистрацией
    cleanupAuthState();

    try {
      await signUp(email, password);
      // New signUp function already creates user and sends OTP
      setOtpSent(true);
    } catch (error) {
      // Error is already handled in signUp function
      console.error('Signup error:', error);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      toast({
        title: "Ошибка",
        description: "Введите 6-значный код",
        variant: "destructive",
      });
      return;
    }

    setVerifyingOtp(true);
    try {
      const verified = await verifyOtpCode(email, otpCode);
      if (verified) {
        // Check if user is logged in now
        const currentUser = useAppStore.getState().user;
        if (currentUser) {
          // User is automatically logged in, navigate appropriately
          const storeState = useAppStore.getState();
          const profileComplete = storeState.isProfileComplete();
          
          if (!profileComplete) {
            navigate('/profile-setup');
          } else {
            const onboardingComplete = storeState.checkOnboardingStatus();
            if (onboardingComplete) {
              navigate('/main');
            } else {
              navigate('/onboarding');
            }
          }
        } else {
          // Fallback: user needs to sign in manually
          setActiveTab('login');
          setOtpSent(false);
          toast({
            title: t.auth.codeValidated,
            description: t.auth.emailVerifiedSignIn,
          });
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    const sent = await sendOtpCode(email);
    if (sent) {
      setOtpCode("");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: t.auth.resetPasswordError,
        description: 'Пожалуйста, введите email для восстановления пароля',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/profile-setup',
      });

      if (error) throw error;

      toast({
        title: t.auth.resetPassword,
        description: t.auth.resetPasswordSuccess,
      });
    } catch (error: any) {
      toast({
        title: t.auth.resetPasswordError,
        description: error.message || t.auth.resetPasswordError,
        variant: 'destructive',
      });
    }
  };

  const handleGuestLogin = () => {
    toast({
      title: t.auth.welcomeBack,
      description: t.auth.signInButton,
      variant: 'warning',
    });

    // Перенаправляем на главную страницу как гость
    setTimeout(() => {
      navigate('/main');
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Показываем загрузку, пока проверяем статус аутентификации
  if (authChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <StarField starCount={150} />
        <div className="cosmic-block backdrop-blur-sm p-8 rounded-lg border border-cosmic-accent/30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-cosmic-accent/60 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cosmic-secondary">{t.auth.checkingAuth}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <StarField starCount={150} />

      {/* Voice greeting component */}
      <LoginVoiceGreeting ref={voiceGreetingRef} />

      {/* Cosmic background image */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-cosmic-dark via-cosmic-accent/5 to-cosmic-dark" />

      <div className="relative z-10 max-w-md w-full mx-auto px-4">
        <h1 className="text-4xl font-serif text-white text-center mb-8">
          Asket
        </h1>

        {otpSent ? (
          <Card className="backdrop-blur-sm bg-cosmic-dark/10 border-cosmic-accent/30 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h2 className="text-xl text-white mb-4">{t.auth.enterOtpCode}</h2>
                <p className="text-cosmic-secondary">
                  {t.auth.otpSentMessage} {email}
                </p>
              </div>
              
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp-code" className="text-white">{t.auth.otpCodeLabel}</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otpCode}
                      onChange={setOtpCode}
                      maxLength={6}
                      containerClassName="group flex items-center has-[:disabled]:opacity-30"
                      className="disabled:cursor-not-allowed"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="border-cosmic-accent/30 text-white bg-cosmic-dark/20" />
                        <InputOTPSlot index={1} className="border-cosmic-accent/30 text-white bg-cosmic-dark/20" />
                        <InputOTPSlot index={2} className="border-cosmic-accent/30 text-white bg-cosmic-dark/20" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} className="border-cosmic-accent/30 text-white bg-cosmic-dark/20" />
                        <InputOTPSlot index={4} className="border-cosmic-accent/30 text-white bg-cosmic-dark/20" />
                        <InputOTPSlot index={5} className="border-cosmic-accent/30 text-white bg-cosmic-dark/20" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                
                <CosmicButton 
                  type="submit" 
                  className="w-full bg-cosmic-accent/70 backdrop-blur-sm hover:bg-cosmic-accent/80" 
                  disabled={verifyingOtp || otpCode.length !== 6}
                >
                  {verifyingOtp ? `${t.auth.verifyButton}...` : t.auth.verifyButton}
                </CosmicButton>
                
                <div className="text-center space-y-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOtp}
                    className="text-sm text-cosmic-accent hover:text-cosmic-accent/80"
                  >
                    {t.auth.resendCode}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpCode("");
                      setActiveTab("signup");
                    }}
                    className="text-sm text-cosmic-secondary hover:text-white block w-full"
                  >
                    ← Назад к регистрации
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : emailSent ? (
          <Card className="backdrop-blur-sm bg-cosmic-dark/10 border-cosmic-accent/30 shadow-lg">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl text-white mb-4">Проверьте вашу почту</h2>
              <p className="text-cosmic-secondary mb-6">
                На ваш email отправлено письмо с подтверждением. Пожалуйста,
                проверьте почту и перейдите по ссылке в письме для активации
                аккаунта.
              </p>
              <Button
                variant="outline"
                className="border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10"
                onClick={() => setEmailSent(false)}
              >
                Вернуться к форме входа
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="backdrop-blur-sm bg-cosmic-dark/10 border-cosmic-accent/30 shadow-lg">
            <CardContent className="pt-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-cosmic-dark/20">
                  <TabsTrigger value="login">{t.auth.signIn}</TabsTrigger>
                  <TabsTrigger value="signup">{t.auth.signUp}</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        {t.auth.email}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent h-5 w-5 z-10" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="example@email.com"
                          className="pl-10 bg-cosmic-dark/5 backdrop-blur-sm border-cosmic-accent/30 text-white placeholder:text-white/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">
                        {t.auth.password}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent h-5 w-5 z-10" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10 pr-10 bg-cosmic-dark/5 backdrop-blur-sm border-cosmic-accent/30 text-white placeholder:text-white/50"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent z-10"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-cosmic-accent hover:text-cosmic-accent/80 text-sm transition-colors"
                      >
                        {t.auth.forgotPassword}
                      </button>
                    </div>

                    <div className="pt-4">
                      <CosmicButton
                        type="submit"
                        className="w-full bg-cosmic-accent/70 backdrop-blur-sm hover:bg-cosmic-accent/80"
                        disabled={loading}
                      >
                        {loading ? 'Выполняется вход...' : t.auth.signInButton}
                      </CosmicButton>
                    </div>

                    <div className="text-center pt-2">
                      <p className="text-white text-sm">
                        {t.auth.noAccount}{' '}
                        <button
                          type="button"
                          onClick={() => setActiveTab('signup')}
                          className="text-cosmic-accent hover:text-cosmic-accent/80 transition-colors"
                        >
                          {t.auth.signUp}
                        </button>
                      </p>
                    </div>

                    <div className="pt-4 relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-cosmic-accent/20"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-cosmic-dark/10 backdrop-blur-sm px-2 text-xs text-cosmic-accent">
                          {t.auth.orContinueWith}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10 bg-cosmic-dark/5 backdrop-blur-sm"
                        onClick={handleGuestLogin}
                      >
                        {t.auth.guestSignIn || 'Войти как гость'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white">
                        {t.auth.email}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent h-5 w-5 z-10" />
                        <Input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="example@email.com"
                          className="pl-10 bg-cosmic-dark/5 backdrop-blur-sm border-cosmic-accent/30 text-white placeholder:text-white/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white">
                        {t.auth.password}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent h-5 w-5 z-10" />
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10 pr-10 bg-cosmic-dark/5 backdrop-blur-sm border-cosmic-accent/30 text-white placeholder:text-white/50"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent z-10"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <CosmicButton
                        type="submit"
                        className="w-full bg-cosmic-accent/70 backdrop-blur-sm hover:bg-cosmic-accent/80"
                        disabled={loading}
                      >
                        {loading ? 'Регистрация...' : t.auth.signUpButton}
                      </CosmicButton>
                    </div>

                    <div className="text-center pt-2">
                      <p className="text-white text-sm">
                        {t.auth.haveAccount}{' '}
                        <button
                          type="button"
                          onClick={() => setActiveTab('login')}
                          className="text-cosmic-accent hover:text-cosmic-accent/80 transition-colors"
                        >
                          {t.auth.signIn}
                        </button>
                      </p>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
