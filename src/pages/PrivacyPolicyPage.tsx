import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrivacyPolicy } from '@/components/legal/PrivacyPolicy';
import { useTranslations } from '@/hooks/useTranslations';

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();

  return (
    <div className="min-h-screen bg-cosmic-dark text-cosmic-text">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.common?.back || 'Назад'}
        </Button>

        {/* Privacy Policy Content */}
        <div className="max-w-4xl mx-auto">
          <PrivacyPolicy />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;