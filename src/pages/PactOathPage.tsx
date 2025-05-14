
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { PactOath } from '@/components/PactOath';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

const PactOathPage: React.FC = () => {
  const { setActiveScreen, setOnboardingComplete } = useAppStore();
  const { t } = useTranslations();
  const [confirmed, setConfirmed] = useState(false);
  
  const handleSignContract = () => {
    // Mark onboarding as complete and navigate to main page
    setOnboardingComplete(true);
    setActiveScreen('main');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4">
      <StarField starCount={150} />
      
      {/* Cosmic background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url('/lovable-uploads/1fab6aac-8009-418b-8685-51057869b4ad.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/20 to-cosmic-dark/80" />
      </div>
      
      <div className="relative z-10 w-full max-w-lg">
        <h1 className="text-3xl font-serif text-white text-center mb-6">
          {t.pactOath.title}
        </h1>
        
        <p className="text-lg text-cosmic-secondary text-center mb-8">
          {t.pactOath.subtitle}
        </p>
        
        <Card className="cosmic-card backdrop-blur-lg bg-cosmic-dark/40 mb-6">
          <CardContent className="p-6">
            <PactOath />
            
            <p className="text-cosmic-secondary text-sm mt-4 mb-6">
              {t.pactOath.instructions}
            </p>
            
            <div className="flex items-center space-x-2 mb-6">
              <Checkbox 
                id="confirm" 
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked === true)}
              />
              <label 
                htmlFor="confirm" 
                className="text-sm font-medium text-cosmic-secondary cursor-pointer"
              >
                {t.pactOath.confirmReading}
              </label>
            </div>
            
            <CosmicButton 
              className="w-full" 
              disabled={!confirmed}
              onClick={handleSignContract}
            >
              {t.pactOath.signContract}
            </CosmicButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PactOathPage;
