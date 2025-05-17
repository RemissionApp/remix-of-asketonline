
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SetBirthDateCardProps {
  uiText: {
    setBirthDateTitle: string;
    setBirthDateDescription: string;
    goToProfileButton: string;
  };
}

export const SetBirthDateCard: React.FC<SetBirthDateCardProps> = ({ uiText }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6 mb-8 bg-slate-800/40 backdrop-blur-sm border-amber-500/30">
      <h2 className="text-xl font-semibold mb-4 text-amber-300">{uiText.setBirthDateTitle}</h2>
      <p className="mb-4">{uiText.setBirthDateDescription}</p>
      <Button 
        onClick={() => navigate('/profile')}
        className="bg-amber-500/80 hover:bg-amber-600/90 text-black backdrop-blur-sm"
      >
        {uiText.goToProfileButton}
      </Button>
    </Card>
  );
};
