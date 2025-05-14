
import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { WorkSection, LoveSection, HealthSection, AdviceSection } from './HoroscopeSections';
import { useHoroscopeFetcher } from './horoscope/useHoroscopeFetcher';
import { HoroscopeHeader } from './horoscope/HoroscopeHeader';
import { AdditionalInfo } from './horoscope/AdditionalInfo';
import { HoroscopeSkeleton } from './horoscope/HoroscopeSkeleton';

interface DetailedHoroscopeDisplayProps {
  className?: string;
}

export const DetailedHoroscopeDisplay: React.FC<DetailedHoroscopeDisplayProps> = ({ className }) => {
  const { userProfile, language } = useAppStore();
  const { 
    horoscopeSections, 
    additionalInfo, 
    loading, 
    refreshing, 
    handleRefresh,
    zodiacSign
  } = useHoroscopeFetcher();
  
  const userName = userProfile?.name || 'Искатель';
  const currentDate = new Date().toLocaleDateString(
    language === 'ru' ? 'ru-RU' : 
    language === 'es' ? 'es-ES' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );
  
  if (loading) {
    return <HoroscopeSkeleton className={className} />;
  }
  
  const isPro = userProfile?.isPro || false;
  
  return (
    <div className={`p-4 ${className}`}>
      <HoroscopeHeader 
        userName={userName}
        currentDate={currentDate}
        zodiacSign={zodiacSign}
        isPro={isPro}
        refreshing={refreshing}
        handleRefresh={handleRefresh}
        language={language}
      />
      
      {/* Horoscope sections */}
      <div className="space-y-6">
        <WorkSection content={horoscopeSections.work} />
        <LoveSection content={horoscopeSections.love} />
        <HealthSection content={horoscopeSections.health} />
        <AdviceSection content={horoscopeSections.advice} />
      </div>
      
      {/* Additional info */}
      <AdditionalInfo additionalInfo={additionalInfo} />
      
      <div className="mt-6 text-center text-cosmic-accent text-sm italic">
        <p>Пусть твой день будет продуктивным и гармоничным!</p>
      </div>
    </div>
  );
};
