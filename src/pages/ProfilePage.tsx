
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft, Star, Award, ChevronRight, Flag } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { RankBadge } from '@/components/RankBadge';
import { AchievementCard } from '@/components/AchievementCard';
import { MissionCard } from '@/components/MissionCard';
import { Progress } from '@/components/ui/progress';

const ProfilePage: React.FC = () => {
  const { userProfile, setActiveScreen, language, assignMission } = useAppStore();
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'missions'>('profile');
  
  // Рассчитываем прогресс к следующему рангу
  const calculateRankProgress = () => {
    const { rank, totalDays } = userProfile;
    let nextRank;
    let currentThreshold;
    let nextThreshold;
    
    switch (rank) {
      case 'seeker':
        nextRank = 'pilgrim';
        currentThreshold = 0;
        nextThreshold = 10;
        break;
      case 'pilgrim':
        nextRank = 'warrior';
        currentThreshold = 10;
        nextThreshold = 30;
        break;
      case 'warrior':
        nextRank = 'master';
        currentThreshold = 30;
        nextThreshold = 90;
        break;
      case 'master':
        nextRank = 'enlightened';
        currentThreshold = 90;
        nextThreshold = 365;
        break;
      default:
        return { progress: 100, nextRank: null, daysLeft: 0 };
    }
    
    const daysProgress = totalDays - currentThreshold;
    const rangeDays = nextThreshold - currentThreshold;
    const progress = Math.min(Math.round((daysProgress / rangeDays) * 100), 100);
    const daysLeft = Math.max(nextThreshold - totalDays, 0);
    
    return { progress, nextRank, daysLeft };
  };
  
  const { progress, nextRank, daysLeft } = calculateRankProgress();
  
  // Функция для перевода названия следующего ранга
  const getNextRankName = () => {
    if (!nextRank) return '';
    
    if (language === 'ru') {
      switch(nextRank) {
        case 'pilgrim': return 'Пилигрима';
        case 'warrior': return 'Воина Света';
        case 'master': return 'Мастера';
        case 'enlightened': return 'Просветлённого';
        default: return '';
      }
    } else if (language === 'es') {
      switch(nextRank) {
        case 'pilgrim': return 'Peregrino';
        case 'warrior': return 'Guerrero de Luz';
        case 'master': return 'Maestro';
        case 'enlightened': return 'Iluminado';
        default: return '';
      }
    } else {
      switch(nextRank) {
        case 'pilgrim': return 'Pilgrim';
        case 'warrior': return 'Light Warrior';
        case 'master': return 'Master';
        case 'enlightened': return 'Enlightened';
        default: return '';
      }
    }
  };
  
  // Функция для получения текста оставшихся дней
  const getDaysLeftText = () => {
    if (!nextRank) return '';
    
    if (language === 'ru') {
      return `${daysLeft} ${getDaysForm(daysLeft)} до ранга ${getNextRankName()}`;
    } else if (language === 'es') {
      return `${daysLeft} días hasta el rango de ${getNextRankName()}`;
    } else {
      return `${daysLeft} days until ${getNextRankName()} rank`;
    }
  };
  
  // Функция для склонения дней в русском языке
  const getDaysForm = (days: number) => {
    if (language !== 'ru') return 'days';
    
    const lastDigit = days % 10;
    const lastTwoDigits = days % 100;
    
    if (lastDigit === 1 && lastTwoDigits !== 11) {
      return 'день';
    } else if (
      (lastDigit === 2 || lastDigit === 3 || lastDigit === 4) && 
      !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
    ) {
      return 'дня';
    } else {
      return 'дней';
    }
  };
  
  // Локализованные названия вкладок
  const getTabs = () => {
    if (language === 'ru') {
      return [
        { id: 'profile' as const, name: 'Профиль' },
        { id: 'achievements' as const, name: 'Достижения' },
        { id: 'missions' as const, name: 'Миссии' }
      ];
    } else if (language === 'es') {
      return [
        { id: 'profile' as const, name: 'Perfil' },
        { id: 'achievements' as const, name: 'Logros' },
        { id: 'missions' as const, name: 'Misiones' }
      ];
    } else {
      return [
        { id: 'profile' as const, name: 'Profile' },
        { id: 'achievements' as const, name: 'Achievements' },
        { id: 'missions' as const, name: 'Missions' }
      ];
    }
  };
  
  // Получаем разблокированные и заблокированные достижения
  const unlockedAchievements = userProfile.achievements.filter(a => a.unlocked);
  const lockedAchievements = userProfile.achievements.filter(a => !a.unlocked);
  
  // Функция для создания новой миссии
  const handleCreateMission = () => {
    assignMission();
  };
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <StarField starCount={100} />
      
      {/* Header */}
      <div className="relative z-10 px-4 py-4 flex items-center">
        <button
          className="p-2 text-cosmic-accent"
          onClick={() => setActiveScreen('main')}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-serif text-white flex-1 text-center mr-8">
          {t.profile.title}
        </h1>
      </div>
      
      {/* Tabs navigation */}
      <div className="relative z-10 px-4">
        <div className="flex border-b border-cosmic-accent/20">
          {getTabs().map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-2 ${activeTab === tab.id 
                ? 'text-cosmic-accent border-b-2 border-cosmic-accent' 
                : 'text-cosmic-secondary hover:text-white'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col px-4 py-4 max-w-lg mx-auto w-full">
        {activeTab === 'profile' && (
          <>
            <div className="cosmic-card mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif text-white">
                    {userProfile.name}
                  </h2>
                  <div className="flex items-center mt-1">
                    <RankBadge />
                  </div>
                  <p className="text-cosmic-secondary mt-2">
                    {userProfile.goal}
                  </p>
                </div>
                
                <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              {nextRank && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-cosmic-secondary">{getDaysLeftText()}</span>
                    <span className="text-cosmic-accent">{progress}%</span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2 bg-cosmic-secondary/20"
                  />
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <div className="text-center">
                  <p className="text-2xl font-serif text-white">
                    {userProfile.totalDays}
                  </p>
                  <p className="text-sm text-cosmic-secondary">
                    {t.profile.daysOfAscesis}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-serif text-cosmic-gold">
                    {userProfile.energyPoints}
                  </p>
                  <p className="text-sm text-cosmic-secondary">
                    {t.profile.energy}
                  </p>
                </div>
              </div>
            </div>
            
            {userProfile.activeMission && (
              <MissionCard 
                mission={userProfile.activeMission}
                className="mb-6"
              />
            )}
            
            <div className="cosmic-card mb-6 bg-gradient-to-br from-cosmic-accent/20 to-cosmic-gold/10">
              <div className="flex items-center">
                <Star className="text-cosmic-gold mr-3" />
                <h3 className="text-lg font-serif text-white">{t.profile.proTitle}</h3>
              </div>
              
              <p className="text-cosmic-secondary mt-4 mb-6">
                {t.profile.proDescription}
              </p>
              
              <ul className="space-y-3 mb-6">
                {t.profile.proFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-cosmic-gold/20 flex items-center justify-center mr-3">
                      <div className="w-2 h-2 rounded-full bg-cosmic-gold"></div>
                    </div>
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <CosmicButton className="w-full">
                {t.profile.proButton}
              </CosmicButton>
            </div>
            
            <div className="cosmic-card mb-6">
              <h3 className="text-lg font-serif text-white mb-4">
                {t.profile.settings}
              </h3>
              
              <ul className="space-y-4">
                {t.profile.settingsItems.map((setting, i) => (
                  <li key={i} className="flex justify-between items-center pb-3 border-b border-cosmic-accent/10">
                    <span className="text-cosmic-secondary">{setting}</span>
                    <span className="text-cosmic-accent">
                      {i === 0 && 'Вкл'}
                      {i === 1 && 'Космическая'}
                      {i === 2 && 'Вкл'}
                      {i === 3 && 'Русский'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <h3 className="text-lg text-white font-serif">
              {language === 'ru' ? 'Разблокированные достижения' : 
               language === 'es' ? 'Logros desbloqueados' : 
               'Unlocked achievements'}
            </h3>
            
            {unlockedAchievements.length > 0 ? (
              <div className="space-y-3">
                {unlockedAchievements.map(achievement => (
                  <AchievementCard 
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </div>
            ) : (
              <p className="text-cosmic-secondary text-center py-4">
                {language === 'ru' ? 'У вас пока нет разблокированных достижений' : 
                 language === 'es' ? 'Aún no tienes logros desbloqueados' : 
                 'You have no unlocked achievements yet'}
              </p>
            )}
            
            {lockedAchievements.length > 0 && (
              <>
                <h3 className="text-lg text-white font-serif mt-6">
                  {language === 'ru' ? 'Предстоящие достижения' : 
                   language === 'es' ? 'Logros próximos' : 
                   'Upcoming achievements'}
                </h3>
                
                <div className="space-y-3">
                  {lockedAchievements.map(achievement => (
                    <AchievementCard 
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        
        {activeTab === 'missions' && (
          <div className="space-y-4">
            <h3 className="text-lg text-white font-serif">
              {language === 'ru' ? 'Текущая миссия' : 
               language === 'es' ? 'Misión actual' : 
               'Current mission'}
            </h3>
            
            {userProfile.activeMission ? (
              <MissionCard 
                mission={userProfile.activeMission}
              />
            ) : (
              <div className="text-center cosmic-card">
                <p className="text-cosmic-secondary mb-4">
                  {language === 'ru' ? 'У вас нет активных миссий' : 
                   language === 'es' ? 'No tienes misiones activas' : 
                   'You have no active missions'}
                </p>
                
                <CosmicButton
                  onClick={handleCreateMission}
                >
                  {language === 'ru' ? 'Получить миссию' : 
                   language === 'es' ? 'Obtener misión' : 
                   'Get mission'}
                </CosmicButton>
              </div>
            )}
            
            <div className="mt-8 cosmic-card bg-gradient-to-br from-cosmic-accent/10 to-cosmic-dark">
              <div className="flex items-center">
                <Flag className="text-cosmic-accent mr-3" />
                <h3 className="text-lg font-serif text-white">
                  {language === 'ru' ? 'О космических миссиях' : 
                   language === 'es' ? 'Sobre misiones cósmicas' : 
                   'About cosmic missions'}
                </h3>
              </div>
              
              <p className="text-cosmic-secondary mt-4">
                {language === 'ru' ? 'Космические миссии — это специальные задания от Вселенной, которые помогут вам укрепить вашу силу духа и получить дополнительные награды. Завершайте миссии и получайте энергетические очки и достижения.' : 
                 language === 'es' ? 'Las misiones cósmicas son tareas especiales del Universo que te ayudarán a fortalecer tu espíritu y obtener recompensas adicionales. Completa misiones y obtén puntos de energía y logros.' : 
                 'Cosmic missions are special tasks from the Universe that will help you strengthen your spirit and earn additional rewards. Complete missions to earn energy points and achievements.'}
              </p>
              
              <div className="flex items-center justify-between mt-4 pt-2 border-t border-cosmic-accent/10">
                <div className="flex items-center">
                  <Award className="text-cosmic-gold w-4 h-4 mr-1" />
                  <span className="text-cosmic-gold text-sm">
                    {language === 'ru' ? 'Эксклюзивные награды' : 
                     language === 'es' ? 'Recompensas exclusivas' : 
                     'Exclusive rewards'}
                  </span>
                </div>
                
                <ChevronRight className="text-cosmic-accent w-5 h-5" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
