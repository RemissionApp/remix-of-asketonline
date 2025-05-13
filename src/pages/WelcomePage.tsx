
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import useAuth from '@/hooks/useAuth';

const WelcomePage = () => {
  const { t } = useTranslations();
  const { setActiveScreen } = useAppStore();
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      setActiveScreen('main');
    }
  }, [isLoggedIn, loading, setActiveScreen]);

  const handleStart = () => {
    if (isLoggedIn) {
      setActiveScreen('main');
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cosmic">
      <div className="text-center text-white">
        <h1 className="text-5xl font-serif mb-4 cosmic-gradient-text">{t.welcome.title}</h1>
        <p className="text-xl mb-10 text-cosmic-secondary">{t.welcome.subtitle}</p>
        <Button onClick={handleStart} size="lg" className="bg-cosmic-accent hover:bg-cosmic-accent/80">
          {t.welcome.startButton}
        </Button>
      </div>

      <div className="fixed bottom-4 right-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/signin')} 
          className="text-sm text-cosmic-secondary border-cosmic-secondary hover:bg-cosmic-accent/20"
        >
          {t.auth.signIn}
        </Button>
      </div>
    </div>
  );
};

export default WelcomePage;
