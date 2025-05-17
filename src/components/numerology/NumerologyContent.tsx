
import React from 'react';
import { CosmicButton } from '../CosmicButton';
import { useNavigate } from 'react-router-dom';

interface NumerologyContentProps {
  lifePathNumber: number;
  title: string;
  description: string;
  moreDetailsText: string;
}

export const NumerologyContent: React.FC<NumerologyContentProps> = ({
  lifePathNumber,
  title,
  description,
  moreDetailsText
}) => {
  const navigate = useNavigate();
  
  const handleMoreDetails = () => {
    navigate('/numerology');
  };

  return (
    <div className="cosmic-block backdrop-blur-sm border border-cosmic-accent/30 rounded-lg mb-6 w-full max-w-lg mx-auto">
      <div className="w-full p-4 rounded-lg backdrop-blur-sm bg-transparent">
        <div className="flex items-center mb-3">
          <div className="bg-cosmic-accent/20 rounded-lg p-2 mr-3">
            <span className="text-3xl">{lifePathNumber}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-cosmic-accent">
              {title}
            </h3>
            <p className="text-sm text-cosmic-secondary">
              {moreDetailsText}: {lifePathNumber}
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="font-medium text-white">{title}</p>
          <p className="text-sm text-cosmic-secondary mt-2">{description}</p>
        </div>
        
        <div className="mt-4 flex justify-center">
          <CosmicButton 
            onClick={handleMoreDetails} 
            variant="outline" 
            size="sm"
            className="mt-2"
          >
            {moreDetailsText}
          </CosmicButton>
        </div>
      </div>
    </div>
  );
};
