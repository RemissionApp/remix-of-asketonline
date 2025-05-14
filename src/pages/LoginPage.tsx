
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginPage: React.FC = () => {
  const { signIn, signUp, loading } = useAppStore();
  const { t } = useTranslations();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password);
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
        <h1 className="text-4xl font-serif text-white text-center mb-8">Аскеза</h1>
        
        <Card className="cosmic-card backdrop-blur-lg bg-cosmic-dark/40">
          <CardContent className="pt-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="signup">Регистрация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                      required
                    />
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
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Пароль</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
                      required
                    />
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
