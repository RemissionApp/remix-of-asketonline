
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  backTo?: string;
}

const AuthLayout = ({ 
  children, 
  title, 
  subtitle,
  showBackButton = false,
  backTo = '/' 
}: AuthLayoutProps) => {
  const { t } = useTranslations();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cosmic p-4">
      <div className="w-full max-w-md bg-background p-8 rounded-lg shadow-lg relative">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4"
            asChild
          >
            <Link to={backTo}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">{t.auth.backToSignIn}</span>
            </Link>
          </Button>
        )}
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-serif font-bold cosmic-gradient-text">{title}</h1>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
