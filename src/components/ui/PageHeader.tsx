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
    <>
      {/* Logo and Asket text positioned above header */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center">
        <img 
          src="/asket-logo.png" 
          alt="Asket Logo" 
          className="w-16 h-16 rounded-full object-cover"
        />
        <span className="text-white font-serif text-sm mt-1">Asket</span>
      </div>
      
      {/* Header */}
      <div className={`fixed top-0 left-0 right-0 z-40 bg-cosmic-dark/80 backdrop-blur-sm border-b border-cosmic-accent/20 ${className}`}>
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
          
          <div className="w-10"></div>
        </div>
      </div>
    </>
  );
};