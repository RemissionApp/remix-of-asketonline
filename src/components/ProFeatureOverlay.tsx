
import React from 'react';
import { LockIcon, SparklesIcon } from 'lucide-react';
import { CosmicButton } from './CosmicButton';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

interface ProFeatureOverlayProps {
  title?: string;
  message?: string;
  children: React.ReactNode;
  className?: string;
}

export const ProFeatureOverlay: React.FC<ProFeatureOverlayProps> = ({
  title = 'PRO Feature',
  message = 'Upgrade to PRO to unlock this feature',
  children,
  className = ''
}) => {
  const navigate = useNavigate();
  const { upgradeToPro } = useAppStore();
  
  const handleUpgrade = () => {
    // For demo purposes, we'll just set the user to PRO immediately
    upgradeToPro();
    navigate('/comparison');
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* The actual content that's blurred/locked */}
      <div className="filter blur-sm pointer-events-none opacity-60">
        {children}
      </div>
      
      {/* Overlay with upgrade CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-cosmic-dark/70 backdrop-blur-sm">
        <div className="p-6 rounded-lg text-center max-w-xs">
          <div className="w-12 h-12 bg-cosmic-gold/20 rounded-full mx-auto flex items-center justify-center mb-4">
            <LockIcon size={24} className="text-cosmic-gold" />
          </div>
          <h3 className="text-lg font-serif text-white mb-2">{title}</h3>
          <p className="text-sm text-cosmic-secondary mb-4">{message}</p>
          <CosmicButton onClick={handleUpgrade}>
            <SparklesIcon size={16} className="mr-2" />
            Unlock PRO Features
          </CosmicButton>
        </div>
      </div>
    </div>
  );
};
