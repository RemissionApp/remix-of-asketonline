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
import { calculateLifePathNumber, calculateExpressionNumber, calculatePersonalityNumber, getNumerologyMeaning, calculateFullDestinyMatrix } from '@/utils/numerologyUtils';
import { MatrixDescription } from '@/components/MatrixDescription';
import { useTranslations } from '@/hooks/useTranslations';

const NumerologyPage = () => {
  const { userProfile, language } = useAppStore();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'matrix' | 'detailed' | 'full'>('full');

  const getNumerologyData = () => {
    if (!userProfile?.birthDate) {
      return {
        lifePathNumber: 0,
        destinyNumber: 0,
        soulUrgeNumber: 0,
        personalityNumber: 0,
        expressionNumber: 0,
        birthDayNumber: 0,
        attitude: 0,
        balanceNumber: 0,
        challenges: [0, 0, 0],
        periods: [],
      };
    }

    const birthDate = String(userProfile.birthDate);
    const name = userProfile.name || '';
    
    // Calculate real numerology data
    const lifePathNumber = calculateLifePathNumber(birthDate);
    const expressionNumber = calculateExpressionNumber(name);
    const personalityNumber = calculatePersonalityNumber(name);
    
    const date = new Date(birthDate);
    const birthDay = date.getDate();
    const birthMonth = date.getMonth() + 1;
    const birthYear = date.getFullYear();
    
    // Calculate additional numbers
    const reduceToSingleDigit = (num: number): number => {
      if (num === 11 || num === 22 || num === 33) return num;
      while (num > 9) {
        let sum = 0;
        while (num > 0) {
          sum += num % 10;
          num = Math.floor(num / 10);
        }
        num = sum;
      }
      return num;
    };

    const destinyNumber = reduceToSingleDigit(birthDay + birthMonth + birthYear);
    const soulUrgeNumber = reduceToSingleDigit(lifePathNumber + expressionNumber);
    const attitude = reduceToSingleDigit(birthDay + birthMonth);
    const balanceNumber = reduceToSingleDigit(lifePathNumber + destinyNumber);
    
    // Calculate life periods
    const firstPeriod = reduceToSingleDigit(birthMonth);
    const secondPeriod = reduceToSingleDigit(birthDay);
    const thirdPeriod = reduceToSingleDigit(birthYear);
    
    return {
      lifePathNumber,
      destinyNumber,
      soulUrgeNumber,
      personalityNumber,
      expressionNumber,
      birthDayNumber: reduceToSingleDigit(birthDay),
      attitude,
      balanceNumber,
      challenges: [
        Math.abs(lifePathNumber - destinyNumber) || 1,
        Math.abs(firstPeriod - secondPeriod) || 1,
        Math.abs(firstPeriod - thirdPeriod) || 1
      ],
      periods: [
        { number: firstPeriod, ageRange: '0-28' },
        { number: secondPeriod, ageRange: '29-56' },
        { number: thirdPeriod, ageRange: '57+' },
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
      <PageHeader title={t.numerology.analysis} />

      <StarField starCount={50} />

      <div className="flex-1 px-4 py-4 pt-20 max-w-md mx-auto w-full">
        {/* User Info */}
        <div className="text-center mb-6">
          <h2 className="text-xl text-white font-serif">
            {userProfile?.name}
          </h2>
          <p className="text-cosmic-secondary text-sm">
            {userProfile?.birthDate
              ? new Date(userProfile?.birthDate).toLocaleDateString()
              : 'Укажите дату рождения в профиле'}
          </p>
        </div>

        {/* Core numbers summary (moved from main screen) */}
        {userProfile?.birthDate && (
          <Card className="bg-cosmic-dark/50 border-cosmic-accent/20 mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-xl text-cosmic-accent">
                    {numerologyData.lifePathNumber}
                  </div>
                  <p className="text-cosmic-secondary text-xs text-center">
                    {language === 'ru' ? 'Путь жизни' : language === 'es' ? 'Sendero de vida' : 'Life Path'}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-xl text-cosmic-accent">
                    {numerologyData.expressionNumber}
                  </div>
                  <p className="text-cosmic-secondary text-xs text-center">
                    {language === 'ru' ? 'Число выражения' : language === 'es' ? 'Número de expresión' : 'Expression'}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-xl text-cosmic-accent">
                    {numerologyData.personalityNumber}
                  </div>
                  <p className="text-cosmic-secondary text-xs text-center">
                    {language === 'ru' ? 'Число личности' : language === 'es' ? 'Número de personalidad' : 'Personality'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-cosmic-dark/80 backdrop-blur-sm rounded-lg p-1 border border-cosmic-accent/30">
            <Button
              variant={viewMode === 'full' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('full')}
              className="px-4 py-2 text-sm text-white border-0"
            >
              <Star className="w-4 h-4 mr-2" />
              {t.numerology.viewModes.full}
            </Button>
            <Button
              variant={viewMode === 'matrix' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('matrix')}
              className="px-4 py-2 text-sm text-white border-0"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Простая
            </Button>
            <Button
              variant={viewMode === 'detailed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('detailed')}
              className="px-4 py-2 text-sm text-white border-0"
            >
              <Grid className="w-4 h-4 mr-2" />
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
          <>
            <FullDestinyMatrix 
              birthDate={String(userProfile.birthDate)} 
              name={userProfile.name || ''} 
              language={language}
            />
            <MatrixDescription
              matrixData={calculateFullDestinyMatrix(String(userProfile.birthDate), userProfile.name || '')}
              birthDate={String(userProfile.birthDate)}
              name={userProfile.name || ''}
              language={language}
            />
          </>
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

  return numerologyContent;
};

export default NumerologyPage;
