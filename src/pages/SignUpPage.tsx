
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CosmicButton } from '@/components/CosmicButton';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const { setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate sign-up
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success: proceed to pact oath page
      setActiveScreen('pact-oath');
      
    } catch (error) {
      setError(t.auth.signUpError);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-4">
      <StarField starCount={150} />
      
      {/* Cosmic background image */}
      <div className="fixed inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url('/lovable-uploads/1fab6aac-8009-418b-8685-51057869b4ad.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/20 to-cosmic-dark/80" />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="cosmic-card backdrop-blur-lg bg-cosmic-dark/40">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-serif text-white">
                {t.auth.signUp}
              </h1>
              <p className="text-cosmic-secondary mt-2">
                {t.auth.createAccountPrompt}
              </p>
            </div>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-cosmic-secondary">
                  {t.auth.name}
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t.auth.namePlaceholder}
                  className="cosmic-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cosmic-secondary">
                  {t.auth.email}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  className="cosmic-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-cosmic-secondary">
                  {t.auth.password}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="cosmic-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-cosmic-secondary">
                  {t.auth.confirmPassword}
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="cosmic-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <CosmicButton
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? t.auth.processing : t.auth.signUpButton}
              </CosmicButton>
            </form>
            
            <div className="mt-6 text-center text-cosmic-secondary">
              <p>
                {t.auth.alreadyHaveAccount}{' '}
                <Link 
                  to="/signin" 
                  className="text-cosmic-accent hover:underline"
                  onClick={() => setActiveScreen('signin')}
                >
                  {t.auth.signInNow}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
