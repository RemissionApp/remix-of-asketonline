import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
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
import { Eye, EyeOff, Lock, Mail, User, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  LoginVoiceGreeting,
  LoginVoiceGreetingRef,
} from '@/components/auth/LoginVoiceGreeting';
import PasswordStrengthIndicator, {
  isPasswordStrongEnough,
} from '@/components/auth/PasswordStrengthIndicator';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import { signInWithApple } from '@/utils/appleSignIn';
import { lovable } from '@/integrations/lovable';

const GoogleLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.806.54-1.8368.8595-3.0477.8595-2.344 0-4.3282-1.5831-5.0359-3.7104H.9573v2.3318C2.4382 15.9831 5.4818 18 9 18z"/>
    <path fill="#FBBC05" d="M3.9641 10.71c-.18-.54-.2823-1.1168-.2823-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1731 0 7.5477 0 9c0 1.4523.3477 2.8268.9573 4.0418l3.0068-2.3318z"/>
    <path fill="#EA4335" d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582l3.0068 2.3318C4.6718 5.1626 6.656 3.5795 9 3.5795z"/>
  </svg>
);

const AppleLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const LoginPage: React.FC = () => {
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
  const { status, targetRoute } = useAuthFlow();
  const voiceGreetingRef = useRef<LoginVoiceGreetingRef>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('login');
  const [emailSent, setEmailSent] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Authenticated users are auto-redirected by useAuthFlow.
  if (status !== 'unauthenticated' && status !== 'initializing' && targetRoute !== '/login') {
    return <Navigate to={targetRoute} replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: t.auth.error,
        description: t.auth.enterEmailAndPassword,
        variant: 'destructive',
      });
      return;
    }

    voiceGreetingRef.current?.playGreeting();
    cleanupAuthState();
    // signIn() updates the store; useAuthFlow will redirect via <Navigate>.
    await signIn(email, password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: t.auth.error,
        description: t.auth.enterEmailAndPassword,
        variant: 'destructive',
      });
      return;
    }

    if (!isPasswordStrongEnough(password)) {
      toast({
        title: t.auth.weakPasswordTitle,
        description: t.auth.weakPasswordDescription,
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: t.auth.passwordsDontMatchTitle,
        description: t.auth.passwordsDontMatchDescription,
        variant: 'destructive',
      });
      return;
    }

    // Очищаем состояние аутентификации перед регистрацией
    cleanupAuthState();

    // signUp now handles OTP sending internally
    await signUp(email, password);
    setOtpSent(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpCode || otpCode.length !== 6) {
      toast({
        title: t.auth.error,
        description: t.auth.enter6DigitCode,
        variant: "destructive",
      });
      return;
    }

    setVerifyingOtp(true);
    try {
      const verified = await verifyOtpCode(email, otpCode, password);
      if (verified) {
        // Store updates trigger useAuthFlow → automatic <Navigate> to /profile-setup.
        const currentUser = useAppStore.getState().user;
        if (!currentUser) {
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
        description: t.auth.enterEmailForReset,
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [oauthLoading, setOauthLoading] = useState<null | 'google' | 'apple'>(null);

  const handleAppleSignIn = async () => {
    setOauthLoading('apple');
    try {
      cleanupAuthState();
      const res = await signInWithApple();
      if (res.error) {
        toast({
          title: 'Apple Sign-In',
          description: res.error.message,
          variant: 'destructive',
        });
      }
      // если res.redirected — браузер сам уведёт пользователя на Apple
    } finally {
      setOauthLoading(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setOauthLoading('google');
    try {
      cleanupAuthState();
      const res = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });
      if (res.error) {
        toast({
          title: 'Google Sign-In',
          description: (res.error as Error).message,
          variant: 'destructive',
        });
      }
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <StarField starCount={150} />

      {/* Voice greeting component */}
      <LoginVoiceGreeting ref={voiceGreetingRef} />

      {/* Cosmic background image */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-cosmic-dark via-cosmic-accent/5 to-cosmic-dark" />

      <div className="relative z-10 max-w-md w-full mx-auto px-4">
        <h1 className="text-4xl font-serif text-white text-center mb-8">
          Asceta
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
                      onChange={(value) => {
                        console.log('OTP input changed:', value);
                        setOtpCode(value);
                      }}
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
                  <p className="text-center text-sm text-cosmic-secondary">
                    {t.auth.enter6DigitCodeFromEmail}
                  </p>
                </div>
                
                <CosmicButton 
                  type="submit" 
                  className="w-full min-h-[52px] bg-cosmic-accent/70 backdrop-blur-sm hover:bg-cosmic-accent/80 flex items-center justify-center gap-2"
                  disabled={verifyingOtp || otpCode.length !== 6}
                >
                  {verifyingOtp && <Loader2 className="h-4 w-4 animate-spin" />}
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
                    {t.auth.backToSignup}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : emailSent ? (
          <Card className="backdrop-blur-sm bg-cosmic-dark/10 border-cosmic-accent/30 shadow-lg">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl text-white mb-4">{t.auth.checkYourEmail}</h2>
              <p className="text-cosmic-secondary mb-6">
                {t.auth.emailConfirmationSent}
              </p>
              <Button
                variant="outline"
                className="border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10"
                onClick={() => setEmailSent(false)}
              >
                {t.auth.returnToLogin}
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
                        className="w-full min-h-[52px] bg-cosmic-accent/70 backdrop-blur-sm hover:bg-cosmic-accent/80 flex items-center justify-center gap-2"
                        disabled={loading}
                      >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? t.auth.signingIn : t.auth.signInButton}
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

                    {import.meta.env.DEV && (
                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10 bg-cosmic-dark/5 backdrop-blur-sm"
                          onClick={handleGuestLogin}
                        >
                          {t.auth.guestSignIn || 'Войти как гость'} (dev)
                        </Button>
                      </div>
                    )}

                    <div className="pt-2 space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-cosmic-accent/30 text-white hover:bg-cosmic-accent/10 bg-cosmic-dark/5 backdrop-blur-sm flex items-center justify-center gap-2"
                        onClick={handleGoogleSignIn}
                        disabled={oauthLoading !== null}
                      >
                        {oauthLoading === 'google' && <Loader2 className="h-4 w-4 animate-spin" />}
                        {t.auth.continueWithGoogle}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-cosmic-accent/30 text-white hover:bg-cosmic-accent/10 bg-cosmic-dark/5 backdrop-blur-sm flex items-center justify-center gap-2"
                        onClick={handleAppleSignIn}
                        disabled={oauthLoading !== null}
                      >
                        {oauthLoading === 'apple'
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Apple className="h-4 w-4" />}
                        {t.auth.continueWithApple}
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
                      <PasswordStrengthIndicator password={password} className="pt-1" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password" className="text-white">
                        {t.auth.repeatPassword}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent h-5 w-5 z-10" />
                        <Input
                          id="signup-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10 pr-10 bg-cosmic-dark/5 backdrop-blur-sm border-cosmic-accent/30 text-white placeholder:text-white/50"
                          required
                        />
                        {confirmPassword.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(v => !v)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cosmic-accent z-10"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        )}
                      </div>
                      {confirmPassword.length > 0 && password !== confirmPassword && (
                        <p className="text-xs text-destructive">{t.auth.passwordsDontMatchHint}</p>
                      )}
                    </div>

                    <div className="pt-4">
                      <CosmicButton
                        type="submit"
                        className="w-full min-h-[52px] bg-cosmic-accent/70 backdrop-blur-sm hover:bg-cosmic-accent/80 flex items-center justify-center gap-2"
                        disabled={
                          loading ||
                          !isPasswordStrongEnough(password) ||
                          password !== confirmPassword
                        }
                      >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? t.auth.signingUp : t.auth.signUpButton}
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
