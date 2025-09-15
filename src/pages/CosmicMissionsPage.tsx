import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { TopBar } from '@/components/TopBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { Mission } from '@/types';
import { MissionsTabBar } from '@/components/missions/MissionsTabBar';
import { MissionsList } from '@/components/missions/MissionsList';
import { MissionCategories } from '@/components/missions/categories/MissionCategories';
import { RecommendedMission } from '@/components/missions/recommended/RecommendedMission';
import {
  getPageTitle,
  filterMissions,
} from '@/components/missions/MissionsUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MissionNavigation } from '@/components/navigation/MissionNavigation';

const CosmicMissionsPage: React.FC = () => {
  const { language, userProfile } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />

      <TopBar />

      <main className="flex-1 container mx-auto px-4 py-6">
        <MissionNavigation />

        <h1
          className={`text-2xl ${language === 'en' ? 'font-serif' : ''} mb-6 text-cosmic-gold`}
        >
          {getPageTitle(language)}
        </h1>

        {/* Enhanced Mission Interface */}
        <Tabs defaultValue="recommended" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-cosmic-accent/10 border border-cosmic-accent/20">
            <TabsTrigger
              value="recommended"
              className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark"
            >
              {language === 'ru'
                ? 'Рекомендации'
                : language === 'es'
                  ? 'Recomendaciones'
                  : 'Recommended'}
            </TabsTrigger>
            <TabsTrigger
              value="browse"
              className="data-[state=active]:bg-cosmic-gold data-[state=active]:text-cosmic-dark"
            >
              {language === 'ru'
                ? 'Обзор'
                : language === 'es'
                  ? 'Explorar'
                  : 'Browse'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="space-y-6">
            <RecommendedMission />

            {userProfile?.activeMission && (
              <div className="bg-cosmic-indigo/10 border border-cosmic-indigo/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cosmic-indigo mb-2">
                  {language === 'ru'
                    ? 'Активная миссия'
                    : language === 'es'
                      ? 'Misión activa'
                      : 'Active Mission'}
                </h3>
                <p className="text-cosmic-silver text-sm">
                  {language === 'ru'
                    ? 'У вас есть активная миссия. Завершите её, чтобы принять новую.'
                    : language === 'es'
                      ? 'Tienes una misión activa. Complétala para aceptar una nueva.'
                      : 'You have an active mission. Complete it to accept a new one.'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <MissionCategories />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default CosmicMissionsPage;
