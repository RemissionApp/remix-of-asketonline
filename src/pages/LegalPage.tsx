
import React from 'react';
import { StarField } from '@/components/StarField';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation } from '@/components/BottomNavigation';

const LegalPage: React.FC = () => {
  const { t } = useTranslations();
  const navigate = useNavigate();
  
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
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-8 max-w-md mx-auto w-full">
        <div className="w-full flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            className="mr-auto text-white"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl text-white font-serif text-center flex-1 mr-8">
            {t.legal?.title || "Legal Documents"}
          </h1>
        </div>
        
        <div className="w-full cosmic-card p-6 backdrop-blur-sm bg-cosmic-dark/40 border border-cosmic-accent/30 rounded-lg">
          <div className="space-y-6">
            <h2 className="text-xl text-cosmic-accent font-serif">{t.legal?.privacyPolicy || "Privacy Policy"}</h2>
            <div className="text-cosmic-light space-y-4">
              <p>{t.legal?.lastUpdated || "Last updated"}: 14 {t.legal?.may || "May"}, 2025</p>
              
              <h3 className="text-white text-lg font-medium">1. {t.legal?.introduction || "Introduction"}</h3>
              <p>{t.legal?.introText || "The ASKET application respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, process and protect the information you provide when using our application."}</p>
              
              {/* More privacy policy sections would go here */}
            </div>
            
            <h2 className="text-xl text-cosmic-accent font-serif mt-8">{t.legal?.termsOfUse || "Terms of Use"}</h2>
            <div className="text-cosmic-light space-y-4">
              <p>{t.legal?.lastUpdated || "Last updated"}: 14 {t.legal?.may || "May"}, 2025</p>
              
              <h3 className="text-white text-lg font-medium">1. {t.legal?.acceptance || "Acceptance of Terms"}</h3>
              <p>{t.legal?.acceptanceText || "By using the ASKET application, you agree to comply with these Terms of Use. If you do not agree with these terms, please do not use our application."}</p>
              
              {/* More terms of use sections would go here */}
            </div>
          </div>
        </div>
      </div>

      {/* Add the bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default LegalPage;
