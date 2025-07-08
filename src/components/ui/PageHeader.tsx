import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  backTo?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  backTo = '/main',
  className = ''
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(backTo);
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-cosmic-dark/80 backdrop-blur-sm border-b border-cosmic-accent/20 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 h-14">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-cosmic-accent/10 hover:bg-cosmic-accent/20 transition-colors text-cosmic-accent"
        >
          <ArrowLeft size={20} />
        </button>
        
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-serif text-white font-medium">
          {title}
        </h1>
        
        <div className="flex items-center space-x-2">
          <img 
            src="/universe-logo.png" 
            alt="Universe Logo" 
            className="w-8 h-8 rounded-full object-cover border border-cosmic-gold/50"
            onLoad={() => console.log('UI PageHeader image loaded successfully')}
            onError={(e) => {
              console.error('UI PageHeader image failed to load:', e);
              console.log('Image src: /universe-logo.png');
            }}
          />
          <span className="text-white font-serif text-sm">Asket</span>
        </div>
      </div>
    </div>
  );
};