
import React from 'react';
import { StarField } from '@/components/StarField';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft } from 'lucide-react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';

const LegalPage: React.FC = () => {
  const { language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/profile');
  };
  
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      {/* Header */}
      <div className="relative z-10 px-4 py-4 flex items-center">
        <button
          className="p-2 text-cosmic-accent"
          onClick={handleBack}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-serif text-white flex-1 text-center mr-8">
          {t.legal?.title || "Legal Information"}
        </h1>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex-1 px-4 py-2 overflow-y-auto">
        <div className="max-w-lg mx-auto space-y-8 pb-8">
          {/* Terms of Service */}
          <section className="cosmic-card p-4">
            <h2 className="text-xl font-serif text-white mb-3">
              {t.legal?.terms || "Terms of Service"}
            </h2>
            <div className="text-cosmic-secondary text-sm space-y-2">
              <p className="whitespace-pre-line">
                {t.legal?.termsContent || "By using our application, you agree to these terms..."}
              </p>
            </div>
          </section>
          
          {/* Privacy Policy */}
          <section className="cosmic-card p-4">
            <h2 className="text-xl font-serif text-white mb-3">
              {t.legal?.privacy || "Privacy Policy"}
            </h2>
            <div className="text-cosmic-secondary text-sm space-y-2">
              <p className="whitespace-pre-line">
                {t.legal?.privacyContent || "We protect your data and privacy..."}
              </p>
              <h3 className="text-md text-white mt-4">
                {t.legal?.dataCollected || "Data We Collect"}
              </h3>
              <p>
                {t.legal?.dataCollectedText || "We collect minimal information required to provide our services..."}
              </p>
            </div>
          </section>
          
          {/* Contact Information */}
          <section className="cosmic-card p-4">
            <h2 className="text-xl font-serif text-white mb-3">
              {t.legal?.contact || "Contact Us"}
            </h2>
            <div className="text-cosmic-secondary text-sm">
              <p className="whitespace-pre-line">
                {t.legal?.contactText || "For any inquiries or concerns, please contact us at:"}
              </p>
              <p className="mt-2">
                <span className="text-cosmic-accent">email@cosmicascension.com</span>
              </p>
            </div>
          </section>
          
          {/* Disclaimers */}
          <section className="cosmic-card p-4">
            <h2 className="text-xl font-serif text-white mb-3">
              {t.legal?.disclaimers || "Disclaimers"}
            </h2>
            <div className="text-cosmic-secondary text-sm space-y-2">
              <p className="whitespace-pre-line">
                {t.legal?.disclaimersText || "The information provided in this application is for general guidance and entertainment purposes only..."}
              </p>
            </div>
          </section>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default LegalPage;
