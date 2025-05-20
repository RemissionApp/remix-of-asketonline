
import React from 'react';
import { StarField } from '@/components/StarField';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation } from '@/components/BottomNavigation';

const SupportPage: React.FC = () => {
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
            Поддержка
          </h1>
        </div>
        
        <div className="w-full cosmic-card p-6 backdrop-blur-sm bg-cosmic-dark/40 border border-cosmic-accent/30 rounded-lg">
          <div className="space-y-6">
            <p className="text-cosmic-light">
              Для связи с нашей службой поддержки, вы можете воспользоваться следующими способами:
            </p>
            
            <div className="space-y-4 pt-2">
              <a 
                href="mailto:info@remissionsoft.com" 
                className="flex items-center text-cosmic-accent hover:text-cosmic-accent/80 underline"
              >
                <HelpCircle className="mr-2 h-4 w-4" /> 
                info@remissionsoft.com
              </a>
              
              <p className="text-cosmic-secondary text-sm">
                Мы обычно отвечаем в течение 24 часов в рабочие дни.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add the bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default SupportPage;
