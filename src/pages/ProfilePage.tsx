
import React from 'react';
import { StarField } from '@/components/StarField';
import UserProfileForm from '@/components/UserProfileForm';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { ProBadge } from '@/components/ProBadge';
import { CosmicButton } from '@/components/CosmicButton';
import { SparklesIcon, ChevronLeft } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { userProfile, upgradeToPro, cancelProSubscription, setActiveScreen } = useAppStore();
  const navigate = useNavigate();

  const handleManageSubscription = () => {
    if (userProfile.isPro) {
      // For demo purposes, just toggle the subscription
      cancelProSubscription();
    } else {
      upgradeToPro();
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <StarField starCount={100} />
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-8 max-w-md mx-auto w-full">
        <div className="mb-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setActiveScreen('main')} 
              className="flex items-center text-white hover:text-cosmic-accent transition-colors"
              aria-label="Return to main screen"
            >
              <ChevronLeft size={20} />
              <span className="ml-1">Назад</span>
            </button>
            {userProfile.isPro && (
              <ProBadge size="md" />
            )}
          </div>
          
          <h1 className="text-2xl text-white font-serif mb-4">Профиль</h1>
          
          <UserProfileForm />
          
          <div className="mt-8">
            <h2 className="text-xl text-white font-serif mb-4">Подписка</h2>
            
            {userProfile.isPro ? (
              <div className="bg-cosmic-accent/10 border border-cosmic-gold/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium flex items-center">
                      <SparklesIcon size={16} className="text-cosmic-gold mr-2" />
                      ASKET PRO
                    </h3>
                    <p className="text-sm text-cosmic-secondary">Active subscription</p>
                  </div>
                  <ProBadge />
                </div>
                <CosmicButton variant="outline" className="w-full" onClick={handleManageSubscription}>
                  Manage Subscription
                </CosmicButton>
              </div>
            ) : (
              <SubscriptionBanner />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
