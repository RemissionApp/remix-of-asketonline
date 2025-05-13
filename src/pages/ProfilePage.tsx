
import React from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Star } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const ProfilePage: React.FC = () => {
  const { userProfile, setActiveScreen } = useAppStore();
  const { t } = useTranslations();
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <StarField starCount={100} />
      
      {/* Header */}
      <div className="relative z-10 px-4 py-4 flex items-center">
        <button
          className="p-2 text-cosmic-accent"
          onClick={() => setActiveScreen('main')}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-serif text-white flex-1 text-center mr-8">
          {t.profile.title}
        </h1>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
        <div className="cosmic-card mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-serif text-white">
                {userProfile.name}
              </h2>
              <p className="text-cosmic-secondary mt-1">
                {userProfile.goal}
              </p>
            </div>
            
            <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <div className="text-center">
              <p className="text-2xl font-serif text-white">
                {userProfile.totalDays}
              </p>
              <p className="text-sm text-cosmic-secondary">
                {t.profile.daysOfAscesis}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-serif text-cosmic-gold">
                {userProfile.energyPoints}
              </p>
              <p className="text-sm text-cosmic-secondary">
                {t.profile.energy}
              </p>
            </div>
          </div>
        </div>
        
        <div className="cosmic-card mb-6 bg-gradient-to-br from-cosmic-accent/20 to-cosmic-gold/10">
          <div className="flex items-center">
            <Star className="text-cosmic-gold mr-3" />
            <h3 className="text-lg font-serif text-white">{t.profile.proTitle}</h3>
          </div>
          
          <p className="text-cosmic-secondary mt-4 mb-6">
            {t.profile.proDescription}
          </p>
          
          <ul className="space-y-3 mb-6">
            {t.profile.proFeatures.map((feature, i) => (
              <li key={i} className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-cosmic-gold/20 flex items-center justify-center mr-3">
                  <div className="w-2 h-2 rounded-full bg-cosmic-gold"></div>
                </div>
                <span className="text-white">{feature}</span>
              </li>
            ))}
          </ul>
          
          <CosmicButton className="w-full">
            {t.profile.proButton}
          </CosmicButton>
        </div>
        
        <div className="cosmic-card mb-6">
          <h3 className="text-lg font-serif text-white mb-4">
            {t.profile.settings}
          </h3>
          
          <ul className="space-y-4">
            {t.profile.settingsItems.map((setting, i) => (
              <li key={i} className="flex justify-between items-center pb-3 border-b border-cosmic-accent/10">
                <span className="text-cosmic-secondary">{setting}</span>
                <span className="text-cosmic-accent">
                  {i === 0 && 'Вкл'}
                  {i === 1 && 'Космическая'}
                  {i === 2 && 'Вкл'}
                  {i === 3 && 'Русский'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
