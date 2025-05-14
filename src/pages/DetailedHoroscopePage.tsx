
import React from 'react';
import { StarField } from '@/components/StarField';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { DetailedHoroscopeDisplay } from '@/components/DetailedHoroscopeDisplay';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DetailedHoroscopePage: React.FC = () => {
  const { setActiveScreen, language } = useAppStore();
  const navigate = useNavigate();

  const handleGoBack = () => {
    setActiveScreen('main');
    navigate('/main');
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={150} />
      
      {/* Back button */}
      <div className="relative z-10 px-4 py-4 flex items-center">
        <button
          className="p-2 text-cosmic-accent"
          onClick={handleGoBack}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-serif text-white flex-1 text-center mr-8">
          {language === 'ru' ? 'Подробный гороскоп' : 
           language === 'es' ? 'Horóscopo detallado' : 
           'Detailed Horoscope'}
        </h1>
      </div>
      
      {/* Main content */}
      <div className="flex-1 relative z-10 overflow-auto">
        <DetailedHoroscopeDisplay className="px-4 py-2" />
      </div>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default DetailedHoroscopePage;
