import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';


interface PageHeaderProps {
  title: string;
  onBackClick?: () => void;
  backTo?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  onBackClick, 
  backTo = '/main' 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
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
      <div className="fixed top-0 left-0 right-0 z-40 bg-cosmic-dark/80 backdrop-blur-sm border-b border-cosmic-accent/20 pt-safe-top">
        <div className="flex items-center px-4 py-3 h-14">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-cosmic-accent hover:bg-cosmic-accent/20 shrink-0"
          >
            <ArrowLeft size={20} />
          </Button>
          
          <h1 className="text-lg font-serif text-white flex-1 text-center">
            {title}
          </h1>
          
          <div className="w-10"></div>
        </div>
      </div>
    </>
  );
};