import React, { useState } from 'react';
import { Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslations } from '@/hooks/useTranslations';
import { PrivacyPolicy } from '@/components/legal/PrivacyPolicy';
import { TermsOfService } from '@/components/legal/TermsOfService';

export const LegalDocuments: React.FC = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfUse, setShowTermsOfUse] = useState(false);
  const { t } = useTranslations();

  return (
    <>
      <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-5 mb-8">
        <h3 className="text-white font-medium mb-4 font-sans">
          {t.legal?.title || 'Legal Information'}
        </h3>
        <div className="flex flex-col gap-3">
          <Button
            variant="ghost"
            className="justify-start text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20 font-sans"
            onClick={() => setShowPrivacyPolicy(true)}
          >
            <Shield className="mr-2 h-5 w-5" />
            <span>{t.legal?.privacyPolicy || 'Privacy Policy'}</span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20 font-sans"
            onClick={() => setShowTermsOfUse(true)}
          >
            <FileText className="mr-2 h-5 w-5" />
            <span>{t.legal?.termsOfUse || 'Terms of Use'}</span>
          </Button>
        </div>
      </div>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="bg-cosmic-dark text-white border-cosmic-accent/30 max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Политика конфиденциальности</DialogTitle>
          </DialogHeader>
          <PrivacyPolicy />
        </DialogContent>
      </Dialog>

      {/* Terms of Use Dialog */}
      <Dialog open={showTermsOfUse} onOpenChange={setShowTermsOfUse}>
        <DialogContent className="bg-cosmic-dark text-white border-cosmic-accent/30 max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>Условия использования</DialogTitle>
          </DialogHeader>
          <TermsOfService />
        </DialogContent>
      </Dialog>
    </>
  );
};
