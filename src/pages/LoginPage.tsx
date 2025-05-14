
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StarField } from '@/components/StarField';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveScreen, login, user, signup, fetchUserProfile } = useAppStore();
  const { toast } = useToast();
  
  // State for login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for signup form
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Effect to redirect if already logged in
  useEffect(() => {
    if (user) {
      setActiveScreen('main');
      navigate('/main');
    }
  }, [user, navigate, setActiveScreen]);
  
  // Handle the back button
  const handleBack = () => {
    navigate('/');
    setActiveScreen('welcome');
  };
  
  // Handle login submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const result = await login(email, password);
      if (result.error) {
        toast({
          title: "Ошибка входа",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        // Load user profile data
        await fetchUserProfile();
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать!",
        });
        navigate('/main');
        setActiveScreen('main');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось войти в систему. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle signup submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    if (!signupEmail || !signupPassword || !signupPasswordConfirm) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }
    
    if (signupPassword !== signupPasswordConfirm) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      return;
    }
    
    if (signupPassword.length < 6) {
      toast({
        title: "Ошибка",
        description: "Пароль должен содержать не менее 6 символов",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSignupLoading(true);
      const result = await signup(signupEmail, signupPassword);
      
      if (result.error) {
        toast({
          title: "Ошибка регистрации",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Успешная регистрация",
          description: "Аккаунт создан. Теперь вы можете войти.",
        });
        setActiveTab('login');
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать аккаунт. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setSignupLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-cosmic-dark relative">
      <StarField starCount={100} />
      
      {/* Back button */}
      <div className="relative z-10 p-4">
        <button
          onClick={handleBack}
          className="text-cosmic-accent hover:text-cosmic-accent-hover"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-white mb-4">
              Аскеза
            </h1>
            <p className="text-cosmic-secondary mb-8">
              {activeTab === 'login' ? 'Войдите, чтобы продолжить' : 'Создайте аккаунт для начала путешествия'}
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex mb-6 border-b border-cosmic-accent/30">
            <button
              className={`flex-1 py-3 text-center ${
                activeTab === 'login'
                  ? 'text-cosmic-accent border-b-2 border-cosmic-accent font-medium'
                  : 'text-cosmic-secondary'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Вход
            </button>
            <button
              className={`flex-1 py-3 text-center ${
                activeTab === 'signup'
                  ? 'text-cosmic-accent border-b-2 border-cosmic-accent font-medium'
                  : 'text-cosmic-secondary'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Регистрация
            </button>
          </div>
          
          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm text-cosmic-secondary">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm text-cosmic-secondary">
                    Пароль
                  </label>
                  <a href="#" className="text-xs text-cosmic-accent hover:underline">
                    Забыли пароль?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-cosmic-accent hover:bg-cosmic-accent/80 text-white"
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </Button>
            </form>
          )}
          
          {/* Signup Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="signup-email" className="block text-sm text-cosmic-secondary">
                  Email
                </label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-password" className="block text-sm text-cosmic-secondary">
                  Пароль
                </label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                  required
                />
                <p className="text-xs text-cosmic-secondary">
                  Минимум 6 символов
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-password-confirm" className="block text-sm text-cosmic-secondary">
                  Подтвердите пароль
                </label>
                <Input
                  id="signup-password-confirm"
                  type="password"
                  value={signupPasswordConfirm}
                  onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-cosmic-accent hover:bg-cosmic-accent/80 text-white"
                disabled={signupLoading}
              >
                {signupLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
