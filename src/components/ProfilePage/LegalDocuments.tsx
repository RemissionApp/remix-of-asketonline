import React from 'react';
import { Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';

export const LegalDocuments: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();

  return (
    <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-5 mb-8">
      <h3 className="text-white font-medium mb-4 font-sans">
        {t.legal?.title || 'Legal Information'}
      </h3>
      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          className="justify-start text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20 font-sans"
          onClick={() => navigate('/privacy-policy')}
        >
          <Shield className="mr-2 h-5 w-5" />
          <span>{t.legal?.privacyPolicy || 'Privacy Policy'}</span>
        </Button>
        <Button
          variant="ghost"
          className="justify-start text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20 font-sans"
          onClick={() => navigate('/terms-of-service')}
        >
          <FileText className="mr-2 h-5 w-5" />
          <span>{t.legal?.termsOfUse || 'Terms of Use'}</span>
        </Button>
      </div>
    </div>
  );
};
