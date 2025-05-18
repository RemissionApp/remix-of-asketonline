
import React from 'react';
import { LockIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

interface ProFeatureOverlayProps {
  title?: string;
  message?: string;
  children: React.ReactNode;
  className?: string;
  navigateTo?: string;
}

export const ProFeatureOverlay: React.FC<ProFeatureOverlayProps> = ({
  title = 'PRO Feature',
  message = 'Upgrade to PRO to unlock this feature',
  children,
  className = '',
  navigateTo = '/comparison'
}) => {
  const navigate = useNavigate();
  const { upgradeToPro } = useAppStore();
  
  const handleClick = () => {
    navigate(navigateTo);
  };
  
  return (
    <div 
      className={`relative ${className} cursor-pointer`} 
      onClick={handleClick}
    >
      {/* The actual content that's blurred/locked */}
      <div className="filter blur-sm pointer-events-none opacity-60">
        {children}
      </div>
      
      {/* Lock icon in top right corner */}
      <div className="absolute top-2 right-2 z-10">
        <div className="w-8 h-8 bg-cosmic-dark/70 backdrop-blur-sm rounded-full flex items-center justify-center">
          <LockIcon size={16} className="text-cosmic-gold" />
        </div>
      </div>
      
      {/* Overlay that makes the whole component clickable */}
      <div className="absolute inset-0 bg-cosmic-dark/40 backdrop-blur-sm rounded-lg border border-cosmic-accent/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="p-4 text-center">
          <h3 className="text-lg font-serif text-white mb-2">{title}</h3>
          <p className="text-sm text-cosmic-secondary">{message}</p>
        </div>
      </div>
    </div>
  );
};
