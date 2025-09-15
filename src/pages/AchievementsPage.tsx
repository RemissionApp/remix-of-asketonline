import React from 'react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { AchievementSystem } from '@/components/achievements/AchievementSystem';
import { UserLevelDisplay } from '@/components/achievements/UserLevelDisplay';
import { useAppStore } from '@/store/useAppStore';
import { useUserProgress } from '@/hooks/useUserProgress';

const AchievementsPage: React.FC = () => {
  const { language } = useAppStore();
  const { stats, isLoading } = useUserProgress();

  const getPageTitle = () => {
    switch (language) {
      case 'ru':
        return 'Достижения';
      case 'es':
        return 'Logros';
      default:
        return 'Achievements';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pb-16">
        <StarField starCount={150} />
        <div className="cosmic-block backdrop-blur-sm p-8 rounded-lg border border-cosmic-accent/30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-cosmic-accent/60 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cosmic-secondary">
              {language === 'ru'
                ? 'Загружаем достижения...'
                : language === 'es'
                  ? 'Cargando logros...'
                  : 'Loading achievements...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />

      <PageHeader title={getPageTitle()} />

      {/* Cosmic background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-cosmic-dark via-cosmic-accent/5 to-cosmic-dark opacity-30" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 pt-20 py-8 max-w-md mx-auto w-full space-y-6">
        {/* User Level Display */}
        <UserLevelDisplay
          level={stats.level}
          experiencePoints={stats.experiencePoints}
          experienceToNextLevel={stats.experienceToNextLevel}
          totalEnergyEarned={stats.totalEnergyEarned}
          className="w-full"
        />

        {/* Achievement System */}
        <div className="w-full">
          <AchievementSystem userStats={stats} />
        </div>
      </div>

      {/* Bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default AchievementsPage;
