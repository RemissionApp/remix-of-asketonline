
import React, { useState } from 'react';
import { Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useTranslations } from '@/hooks/useTranslations';

export const LegalDocuments: React.FC = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfUse, setShowTermsOfUse] = useState(false);
  const { t } = useTranslations();
  
  return (
    <>
      <div className="bg-cosmic-accent/10 border border-cosmic-accent/30 rounded-lg p-5 mb-8">
        <h3 className="text-white font-medium mb-4 font-sans">{t.legal?.title || "Legal Information"}</h3>
        <div className="flex flex-col gap-3">
          <Button 
            variant="ghost" 
            className="justify-start text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20 font-sans"
            onClick={() => setShowPrivacyPolicy(true)}
          >
            <Shield className="mr-2 h-5 w-5" />
            <span>{t.legal?.privacyPolicy || "Privacy Policy"}</span>
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start text-cosmic-secondary hover:text-white hover:bg-cosmic-accent/20 font-sans"
            onClick={() => setShowTermsOfUse(true)}
          >
            <FileText className="mr-2 h-5 w-5" />
            <span>{t.legal?.termsOfUse || "Terms of Use"}</span>
          </Button>
        </div>
      </div>
      
      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="bg-cosmic-dark text-white border-cosmic-accent/30 max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-cosmic-accent font-serif">{t.legal?.privacyPolicy || "Privacy Policy"}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-cosmic-secondary">
            <div className="space-y-4 text-sm font-sans">
              <p>{t.legal?.lastUpdated || "Last updated"}: 14 {t.legal?.may || "May"}, 2025</p>
              
              <h3 className="text-white text-base font-medium font-sans">1. {t.legal?.introduction || "Introduction"}</h3>
              <p>{t.legal?.introText || "The ASKET application respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, process and protect the information you provide when using our application."}</p>
              
              <h3 className="text-white text-base font-medium font-sans">2. {t.legal?.dataCollected || "Information We Collect"}</h3>
              <p>{t.legal?.dataCollectedText || "We collect the following types of information:"}</p>
              <ul className="list-disc pl-5">
                <li>{t.legal?.profileInfo || "Profile information: name, email, goals"}</li>
                <li>{t.legal?.usageData || "Usage data: information about your pacts, days of observance, and interaction with the application"}</li>
                <li>{t.legal?.technicalData || "Technical information: IP address, device type, OS version"}</li>
              </ul>
              
              <h3 className="text-white text-base font-medium font-sans">3. {t.legal?.dataUse || "Use of Information"}</h3>
              <p>{t.legal?.dataUseText || "Your information is used for:"}</p>
              <ul className="list-disc pl-5">
                <li>{t.legal?.provideServices || "Providing and improving application features"}</li>
                <li>{t.legal?.personalizeExperience || "Personalizing your experience"}</li>
                <li>{t.legal?.communication || "Communicating with you about updates"}</li>
                <li>{t.legal?.analytics || "Analytics and research"}</li>
              </ul>
              
              <h3 className="text-white text-base font-medium font-sans">4. {t.legal?.dataSecurity || "Data Security"}</h3>
              <p>{t.legal?.dataSecurityText || "We use commercially acceptable measures to protect your data, but remember that no method of transmission over the internet is 100% secure."}</p>
              
              <h3 className="text-white text-base font-medium font-sans">5. {t.legal?.policyChanges || "Changes to Policy"}</h3>
              <p>{t.legal?.policyChangesText || "We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page."}</p>
              
              <h3 className="text-white text-base font-medium font-sans">6. {t.legal?.contact || "Contact"}</h3>
              <p>{t.legal?.contactText || "If you have any questions about this privacy policy, please contact us at: support@asket-app.com"}</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      
      {/* Terms of Use Dialog */}
      <Dialog open={showTermsOfUse} onOpenChange={setShowTermsOfUse}>
        <DialogContent className="bg-cosmic-dark text-white border-cosmic-accent/30 max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-cosmic-accent font-serif">{t.legal?.termsOfUse || "Terms of Use"}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-cosmic-secondary">
            <div className="space-y-4 text-sm font-sans">
              <p>{t.legal?.lastUpdated || "Last updated"}: 14 {t.legal?.may || "May"}, 2025</p>
              
              <h3 className="text-white text-base font-medium font-sans">1. {t.legal?.acceptance || "Acceptance of Terms"}</h3>
              <p>{t.legal?.acceptanceText || "By using the ASKET application, you agree to comply with these Terms of Use. If you do not agree with these terms, please do not use our application."}</p>
              
              <h3 className="text-white text-base font-medium font-sans">2. {t.legal?.serviceDescription || "Service Description"}</h3>
              <p>{t.legal?.serviceDescriptionText || "The ASKET application provides a platform for creating and tracking personal ascesis pacts, receiving spiritual advice, and tracking personal progress. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time."}</p>
              
              <h3 className="text-white text-base font-medium font-sans">3. {t.legal?.userAccounts || "User Accounts"}</h3>
              <p>{t.legal?.userAccountsText || "To use some features of the application, you need to create an account. You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account."}</p>
              
              <h3 className="text-white text-base font-medium font-sans">4. {t.legal?.userContent || "User Content"}</h3>
              <p>{t.legal?.userContentText || "You retain all rights to content you create in the application. However, by creating content, you grant us a non-exclusive license to use, reproduce, and display that content in connection with the operation of the application."}</p>
              
              <h3 className="text-white text-base font-medium font-sans">5. {t.legal?.prohibitedBehavior || "Prohibited Behavior"}</h3>
              <p>{t.legal?.prohibitedBehaviorText || "You are prohibited from using the application for illegal purposes or violating the rights of others. Content that is:"}</p>
              <ul className="list-disc pl-5">
                <li>{t.legal?.violatesLaws || "Violates laws or rights of third parties"}</li>
                <li>{t.legal?.threatening || "Threatening, offensive, or discriminatory"}</li>
                <li>{t.legal?.maliciousCode || "Contains malicious code"}</li>
                <li>{t.legal?.interferes || "Interferes with the normal operation of the application"}</li>
              </ul>
              
              <h3 className="text-white text-base font-medium font-sans">6. {t.legal?.disclaimers || "Limitation of Liability"}</h3>
              <p>{t.legal?.disclaimersText || "The application is provided 'as is' and 'as available'. We make no warranties regarding the accuracy, completeness, or reliability of content or services provided through the application."}</p>
              
              <h3 className="text-white text-base font-medium font-sans">7. {t.legal?.termsChanges || "Changes to Terms"}</h3>
              <p>{t.legal?.termsChangesText || "We may modify these terms at any time. By continuing to use the application after such changes, you agree to the updated terms."}</p>
              
              <h3 className="text-white text-base font-medium font-sans">8. {t.legal?.termination || "Termination"}</h3>
              <p>{t.legal?.terminationText || "We may terminate or suspend your access to the application immediately, without prior notice or liability, for any reason, including violation of these terms."}</p>
              
              <h3 className="text-white text-base font-medium font-sans">9. {t.legal?.contact || "Contact"}</h3>
              <p>{t.legal?.contactText || "If you have any questions about these terms of use, please contact us at: support@asket-app.com"}</p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};
