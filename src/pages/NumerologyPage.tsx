import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UserAvatar } from '@/components/UserAvatar';
import { PageHeader } from '@/components/ui/PageHeader';
import { DestinyMatrix } from '@/components/DestinyMatrix';
import FullDestinyMatrix from '@/components/FullDestinyMatrix';
import { Button } from '@/components/ui/button';
import { Grid, Sparkles, Star } from 'lucide-react';

const NumerologyPage = () => {
  const { userProfile, language } = useAppStore();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'matrix' | 'detailed' | 'full'>('full');

  const getNumerologyData = () => {
    // In a real app, this would calculate actual numerology based on user's birth date
    // For now, we'll return mock data
    return {
      lifePathNumber: 7,
      destinyNumber: 3,
      soulUrgeNumber: 9,
      personalityNumber: 5,
      expressionNumber: 4,
      birthDayNumber: 1,
      attitude: 8,
      balanceNumber: 6,
      challenges: [2, 3, 1],
      periods: [
        { number: 5, ageRange: '0-28' },
        { number: 7, ageRange: '29-56' },
        { number: 3, ageRange: '57+' },
      ],
    };
  };

  const renderNumerologyDefinition = (
    title: string,
    number: number,
    description: string
  ) => (
    <Card className="bg-cosmic-dark/50 border-cosmic-accent/20 mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-cosmic-accent font-serif">{title}</h3>
          <div className="w-10 h-10 rounded-full bg-cosmic-accent/20 flex items-center justify-center font-serif text-xl text-cosmic-accent">
            {number}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-cosmic-secondary text-sm">{description}</p>
      </CardContent>
    </Card>
  );

  const handleBack = () => {
    navigate('/main');
  };

  const numerologyData = getNumerologyData();

  const numerologyContent = (
    <div className="min-h-screen flex flex-col bg-cosmic pb-20">
      <PageHeader title="Нумерологический анализ" />

      <StarField starCount={50} />

      <div className="flex-1 px-4 py-4 pt-20 max-w-md mx-auto w-full">
        {/* User Info and View Toggle */}
        <div className="flex items-center justify-center mb-6">
          <UserAvatar size="lg" />
          <div className="ml-4">
            <h2 className="text-xl text-white font-serif">
              {userProfile?.name}
            </h2>
            <p className="text-cosmic-secondary text-sm">
              {userProfile?.birthDate
                ? new Date(userProfile?.birthDate).toLocaleDateString()
                : 'Укажите дату рождения в профиле'}
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-cosmic-dark/50 rounded-lg p-1 border border-cosmic-accent/20">
            <Button
              variant={viewMode === 'full' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('full')}
              className="px-3 py-2 text-xs"
            >
              <Star className="w-3 h-3 mr-1" />
              Полная
            </Button>
            <Button
              variant={viewMode === 'matrix' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('matrix')}
              className="px-3 py-2 text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Простая
            </Button>
            <Button
              variant={viewMode === 'detailed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('detailed')}
              className="px-3 py-2 text-xs"
            >
              <Grid className="w-3 h-3 mr-1" />
              Данные
            </Button>
          </div>
        </div>

        {/* Destiny Matrix Views */}
        {viewMode === 'matrix' && userProfile?.birthDate && (
          <DestinyMatrix 
            birthDate={String(userProfile.birthDate)} 
            name={userProfile.name || ''} 
            language={language}
          />
        )}

        {/* Full Destiny Matrix View */}
        {viewMode === 'full' && userProfile?.birthDate && (
          <FullDestinyMatrix 
            birthDate={String(userProfile.birthDate)} 
            name={userProfile.name || ''} 
            language={language}
          />
        )}

        {/* Detailed View */}
        {viewMode === 'detailed' && (
          <>
            <Card className="bg-cosmic-dark/50 border-cosmic-accent/20 mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-2xl text-cosmic-accent">
                      {numerologyData.lifePathNumber}
                    </div>
                    <p className="text-cosmic-secondary text-xs text-center">
                      Путь жизни
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-2xl text-cosmic-accent">
                      {numerologyData.destinyNumber}
                    </div>
                    <p className="text-cosmic-secondary text-xs text-center">
                      Число судьбы
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-2xl text-cosmic-accent">
                      {numerologyData.soulUrgeNumber}
                    </div>
                    <p className="text-cosmic-secondary text-xs text-center">
                      Число души
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-2xl text-cosmic-accent">
                      {numerologyData.personalityNumber}
                    </div>
                    <p className="text-cosmic-secondary text-xs text-center">
                      Число личности
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {renderNumerologyDefinition(
              'Число Пути Жизни',
              numerologyData.lifePathNumber,
              'Число Пути Жизни — ваше самое важное число. Оно описывает природную склонность вашего существа, оно влияет на все стороны вашего существования.'
            )}

            {renderNumerologyDefinition(
              'Число Судьбы',
              numerologyData.destinyNumber,
              'Число Судьбы определяет цель вашей жизни, к чему вы стремитесь, какие таланты и способности вам помогут в этом, какие уроки нужно пройти.'
            )}

            {renderNumerologyDefinition(
              'Число Души',
              numerologyData.soulUrgeNumber,
              'Число Души показывает глубинные желания и устремления, наши истинные мотивы поступков и решений, всё то, что находится глубоко внутри нас.'
            )}

            {renderNumerologyDefinition(
              'Число Личности',
              numerologyData.personalityNumber,
              'Число Личности показывает, как вас воспринимают другие люди, какое впечатление вы производите на окружающих при первой встрече.'
            )}

            {renderNumerologyDefinition(
              'Число Экспрессии',
              numerologyData.expressionNumber,
              'Число Экспрессии описывает ваши таланты, способности и инструменты, которые помогут вам следовать своему Пути Жизни.'
            )}

            <h3 className="text-cosmic-accent font-serif mt-8 mb-4">
              Периоды жизни
            </h3>

            <div className="space-y-4 mb-8">
              {numerologyData.periods.map((period, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-cosmic-accent/20 flex items-center justify-center mr-4 font-serif text-xl text-cosmic-accent">
                    {period.number}
                  </div>
                  <div>
                    <p className="text-white">{period.ageRange} лет</p>
                    <p className="text-cosmic-secondary text-sm">
                      {index === 0
                        ? 'Формирующий период'
                        : index === 1
                          ? 'Продуктивный период'
                          : 'Период мудрости'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      <BottomNavigation />
    </div>
  );

  if (!userProfile?.isPro) {
    return (
      <div className="min-h-screen flex flex-col bg-cosmic pb-20">
        <StarField starCount={50} />

        <PageHeader title="Нумерологический анализ" />

        <div className="flex-1 flex items-center justify-center p-4 pt-20">
          <Card className="max-w-md w-full bg-cosmic-dark/80 backdrop-blur-md border-cosmic-accent/20">
            <ProFeatureOverlay
              title="Нумерологический анализ"
              message="Этот раздел доступен только пользователям PRO"
            >
              <div className="h-96"></div>
            </ProFeatureOverlay>
          </Card>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return numerologyContent;
};

export default NumerologyPage;
