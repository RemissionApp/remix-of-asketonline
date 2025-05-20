
import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SupportSection: React.FC = () => {
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const goToSupportPage = () => {
    navigate('/support');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <p className="text-cosmic-secondary text-sm">
          {t.support?.description || "Нужна помощь? Наша служба поддержки готова помочь вам с любыми вопросами."}
        </p>
        
        <Button 
          variant="outline" 
          className="w-full justify-start border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10"
          onClick={goToSupportPage}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {t.support?.contactUs || "Связаться с поддержкой"}
        </Button>
      </div>
    </div>
  );
};
