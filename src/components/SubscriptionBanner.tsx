
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CosmicButton } from './CosmicButton';
import { useTranslations } from '@/hooks/useTranslations';

interface SubscriptionBannerProps {
  className?: string;
}

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ className = '' }) => {
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleUpgrade = () => {
    navigate('/comparison');
  };
  
  return (
    <Card className={`border-cosmic-gold/30 bg-gradient-to-r from-cosmic-dark/80 to-cosmic-accent/20 backdrop-blur-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
            <div className="w-16 h-16 bg-cosmic-gold/20 rounded-full flex items-center justify-center">
              <SparklesIcon size={32} className="text-cosmic-gold" />
            </div>
          </div>
          
          <div className="flex-grow text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-serif text-white mb-1">{t.subscription.bannerTitle}</h3>
            <p className="text-sm text-cosmic-secondary">{t.subscription.bannerDesc}</p>
          </div>
          
          <CosmicButton onClick={handleUpgrade} className="whitespace-nowrap">
            {t.subscription.upgradeNow}
          </CosmicButton>
        </div>
      </CardContent>
    </Card>
  );
};
