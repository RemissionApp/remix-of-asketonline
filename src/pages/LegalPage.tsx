
import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LegalTranslations {
  pageTitle?: string;
  termsOfService?: string;
  privacyPolicy?: string;
  termsContent?: string;
  privacyContent?: string;
  backButton?: string;
}

const LegalPage: React.FC = () => {
  const { t } = useTranslations();
  const navigate = useNavigate();
  
  // Access legal translations with proper typing
  const legal: LegalTranslations = t.legal || {};
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      {/* Cosmic background image */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/lovable-uploads/1fab6aac-8009-418b-8685-51057869b4ad.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark/20 to-cosmic-dark/80" />
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col px-4 py-8 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={handleBack}
            className="text-cosmic-accent hover:text-cosmic-secondary transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl text-white font-serif ml-4">
            {legal.pageTitle || "Legal Information"}
          </h1>
        </div>
        
        {/* Terms of Service */}
        <div className="mb-8">
          <h2 className="text-xl text-white font-serif mb-4">
            {legal.termsOfService || "Terms of Service"}
          </h2>
          <div className="text-cosmic-secondary text-sm leading-relaxed">
            {legal.termsContent || "Terms of service content goes here."}
          </div>
        </div>
        
        {/* Privacy Policy */}
        <div className="mb-8">
          <h2 className="text-xl text-white font-serif mb-4">
            {legal.privacyPolicy || "Privacy Policy"}
          </h2>
          <div className="text-cosmic-secondary text-sm leading-relaxed">
            {legal.privacyContent || "Privacy policy content goes here."}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default LegalPage;
