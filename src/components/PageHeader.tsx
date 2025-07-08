import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import universeLogoImage from '@/assets/universe-logo.png';

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
        
        <div className="flex-1 flex items-center justify-center mr-10">
          <h1 className="text-lg font-serif text-white mr-3">
            {title}
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 border border-yellow-400 flex items-center justify-center">
              <div className="w-1 h-1 bg-green-400 rounded-full"></div>
            </div>
            <span className="text-white font-serif text-sm">Asket</span>
          </div>
        </div>
      </div>
    </div>
  );
};