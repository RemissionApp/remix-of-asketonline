
import React from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { EnergyEffect } from '@/components/EnergyEffect';
import { DeveloperSwitch } from '@/components/DeveloperSwitch';
import { MainContent } from '@/components/MainPageComponents/MainContent';
import { useMainPageUtils } from '@/components/MainPageComponents/mainPageUtils';
import { usePactManager } from '@/hooks/usePactManager';
import { useProfileLoader } from '@/hooks/useProfileLoader';

const MainPage: React.FC = () => {
  const { dailyQuote } = useAppStore();
  const { formatRejection, getAscesisPrefix } = useMainPageUtils();
  const { isLoading } = useProfileLoader();
  const { 
    activePacts,
    currentPactIndex,
    currentPact,
    showEnergyEffect,
    handlePrevPact,
    handleNextPact,
    handleCompleteDayWithEffect
  } = usePactManager();
  
  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />
      
      {/* Use the TopBar component */}
      <TopBar />
      
      {/* Developer Mode Switch */}
      <div className="absolute top-20 right-4 z-20">
        <DeveloperSwitch />
      </div>
      
      {/* Energy effect animation */}
      <EnergyEffect show={showEnergyEffect} />
      
      {/* Main content */}
      <MainContent
        activePacts={activePacts}
        currentPactIndex={currentPactIndex}
        currentPact={currentPact}
        dailyQuote={dailyQuote}
        isLoading={isLoading}
        handlePrevPact={handlePrevPact}
        handleNextPact={handleNextPact}
        handleCompleteDayWithEffect={handleCompleteDayWithEffect}
        getAscesisPrefix={getAscesisPrefix}
        formatRejection={formatRejection}
      />
      
      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MainPage;
