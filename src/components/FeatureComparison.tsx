
import React from 'react';
import { CheckIcon, XIcon, SparklesIcon, ArrowRightIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';

const FeatureComparison: React.FC = () => {
  const { t } = useTranslations();
  const { upgradeToPro, userProfile } = useAppStore();
  const navigate = useNavigate();
  const isPro = userProfile.isPro;
  
  // Extended feature list
  const features = [
    {
      name: t.comparison.features[0].name,
      free: true,
      pro: true,
      freeDescription: t.comparison.features[0].freeDescription,
      proDescription: t.comparison.features[0].proDescription,
    },
    {
      name: "Meditation Library",
      free: false,
      pro: true,
      freeDescription: "Not available",
      proDescription: "Full access to all meditations",
    },
    {
      name: "Daily Quotes",
      free: true,
      pro: true,
      freeDescription: "Basic quotes",
      proDescription: "Premium quotes + personalized insights",
    },
    {
      name: "Universe Conversations",
      free: true,
      pro: true,
      freeDescription: "5 questions/day",
      proDescription: "Unlimited questions",
    },
    {
      name: "Energy Points",
      free: true,
      pro: true,
      freeDescription: "Standard earn rate",
      proDescription: "2x earn rate + bonus rewards",
    },
    {
      name: "Exclusive Challenges",
      free: false,
      pro: true,
      freeDescription: "Not available",
      proDescription: "Weekly special challenges",
    }
  ];
  
  const handleUpgrade = () => {
    upgradeToPro();
    navigate('/profile');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <SparklesIcon size={40} className="text-cosmic-gold mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white mb-2">{t.comparison.title}</h2>
        <p className="text-cosmic-secondary max-w-md mx-auto">
          Upgrade to PRO to unlock your full potential with premium features and exclusive content.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free Plan */}
        <Card className="border-2 bg-cosmic-dark/50">
          <CardHeader className="text-center bg-cosmic-dark pb-4">
            <CardTitle className="text-xl text-white">ASKET</CardTitle>
            <p className="text-cosmic-secondary">{t.comparison.freePlan}</p>
            <p className="text-2xl font-bold mt-2 text-white">{t.comparison.free}</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 py-2 border-b border-cosmic-accent/10">
                <div className="w-8">
                  {feature.free ? (
                    <CheckIcon className="text-green-500 h-5 w-5" />
                  ) : (
                    <XIcon className="text-gray-400 h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-white">{feature.name}</p>
                  <p className="text-sm text-cosmic-secondary">{feature.freeDescription}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-2 border-cosmic-gold bg-cosmic-dark/50 relative overflow-hidden">
          {/* PRO Badge */}
          <div className="absolute top-0 right-0 bg-cosmic-gold text-black font-bold px-4 py-1 rounded-bl-lg">
            PRO
          </div>
          
          <CardHeader className="text-center bg-gradient-to-b from-cosmic-gold/20 to-cosmic-dark pb-4">
            <CardTitle className="text-xl text-white">ASKET PRO</CardTitle>
            <p className="text-cosmic-secondary">{t.comparison.proPlan}</p>
            <p className="text-2xl font-bold mt-2 text-white">{t.comparison.pricing}</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 py-2 border-b border-cosmic-gold/10">
                <div className="w-8">
                  {feature.pro ? (
                    <CheckIcon className="text-cosmic-gold h-5 w-5" />
                  ) : (
                    <XIcon className="text-gray-400 h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-white">{feature.name}</p>
                  <p className="text-sm text-cosmic-gold">{feature.proDescription}</p>
                </div>
              </div>
            ))}
            
            {isPro ? (
              <div className="bg-cosmic-gold/20 p-3 rounded-md text-center mt-6">
                <p className="text-white font-medium">You already have PRO access!</p>
                <Button 
                  className="w-full mt-2 bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
                  onClick={() => navigate('/meditation')}
                >
                  Explore PRO Features <ArrowRightIcon className="ml-2" size={16} />
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full mt-6 bg-cosmic-gold text-cosmic-dark hover:bg-cosmic-gold/90"
                onClick={handleUpgrade}
              >
                <SparklesIcon className="mr-2" size={16} />
                {t.comparison.upgradeButton}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Testimonials */}
      {!isPro && (
        <div className="mt-12 max-w-3xl mx-auto">
          <h3 className="text-xl font-serif text-white text-center mb-6">What PRO Users Say</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-cosmic-dark/30 border-cosmic-accent/20">
              <CardContent className="p-4">
                <p className="text-cosmic-secondary italic mb-3">"The meditation library has transformed my daily practice. Worth every penny for the inner peace alone."</p>
                <p className="text-white font-medium">- Anna K.</p>
              </CardContent>
            </Card>
            <Card className="bg-cosmic-dark/30 border-cosmic-accent/20">
              <CardContent className="p-4">
                <p className="text-cosmic-secondary italic mb-3">"Being able to maintain multiple ascesis practices at once has accelerated my spiritual growth significantly."</p>
                <p className="text-white font-medium">- Mikhail S.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureComparison;
