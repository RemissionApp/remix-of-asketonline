
import React, { useState, useEffect } from 'react';
import { TopBar } from '@/components/TopBar';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calculator, Book, Clock, Heart, FilePlus2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { UserAvatar } from '@/components/UserAvatar';
import { calculateLifePathNumber, getNumerologyMeaning, calculateExpressionNumber, calculatePersonalityNumber } from '@/utils/numerologyUtils';
import { PythagoreanMatrix } from '@/components/numerology/PythagoreanMatrix';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CosmicButton } from '@/components/CosmicButton';

const NumerologyPage = () => {
  const { userProfile, language } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [matrixData, setMatrixData] = useState<Record<string, number>>({});
  
  // Вычисляем данные для психоматрицы на основе даты рождения пользователя
  useEffect(() => {
    if (userProfile?.birthDate) {
      // Получаем строковое представление даты
      const birthDateStr = new Date(userProfile.birthDate).toLocaleDateString('en-CA');
      const digitsCount: Record<string, number> = {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0};
      
      // Извлекаем все цифры из строки даты
      const allDigits = birthDateStr.replace(/\D/g, '').split('');
      
      // Подсчитываем вхождения каждой цифры
      allDigits.forEach(digit => {
        if (digit !== '0') { // Пропускаем нули
          digitsCount[digit] = (digitsCount[digit] || 0) + 1;
        }
      });
      
      setMatrixData(digitsCount);
    }
  }, [userProfile?.birthDate]);
  
  // Функция для получения переведенных текстов
  const getTranslatedText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      title: {
        ru: 'Нумерологический анализ',
        en: 'Numerology Analysis',
        es: 'Análisis Numerológico'
      },
      overview: {
        ru: 'Обзор',
        en: 'Overview',
        es: 'Resumen'
      },
      matrix: {
        ru: 'Матрица',
        en: 'Matrix',
        es: 'Matriz'
      },
      cycles: {
        ru: 'Циклы',
        en: 'Cycles',
        es: 'Ciclos'
      },
      compatibility: {
        ru: 'Совместимость',
        en: 'Compatibility',
        es: 'Compatibilidad'
      },
      advancedCalc: {
        ru: 'Расширенный анализ',
        en: 'Advanced Analysis',
        es: 'Análisis Avanzado'
      },
      whatIs: {
        ru: 'Что такое нумерология?',
        en: 'What is Numerology?',
        es: '¿Qué es la Numerología?'
      },
      whatIsDesc: {
        ru: 'Нумерология — древняя наука о влиянии чисел на жизнь человека. Она помогает раскрыть потенциал, таланты и характеристики личности.',
        en: 'Numerology is an ancient science about the influence of numbers on human life. It helps to reveal the potential, talents, and characteristics of an individual.',
        es: 'La numerología es una ciencia antigua sobre la influencia de los números en la vida humana. Ayuda a revelar el potencial, talentos y características de una persona.'
      },
      coreNumbers: {
        ru: 'Ваши основные числа',
        en: 'Your Core Numbers',
        es: 'Sus Números Principales'
      },
      lifePathNumber: {
        ru: 'Число жизненного пути',
        en: 'Life Path Number',
        es: 'Número del Camino de Vida'
      },
      expressionNumber: {
        ru: 'Число выражения',
        en: 'Expression Number',
        es: 'Número de Expresión'
      },
      personalityNumber: {
        ru: 'Число личности',
        en: 'Personality Number',
        es: 'Número de Personalidad'
      },
      soulNumber: {
        ru: 'Число души',
        en: 'Soul Number',
        es: 'Número del Alma'
      },
      destinyNumber: {
        ru: 'Число судьбы',
        en: 'Destiny Number',
        es: 'Número del Destino'
      },
      psychomatrix: {
        ru: 'Психоматрица',
        en: 'Psychomatrix',
        es: 'Psicomatriz'
      },
      psychomatrixDesc: {
        ru: 'Квадрат Пифагора, показывающий распределение энергий',
        en: 'Pythagorean Square, showing energy distribution',
        es: 'Cuadrado de Pitágoras, mostrando la distribución de energías'
      },
      lifeCycles: {
        ru: 'Жизненные циклы',
        en: 'Life Cycles',
        es: 'Ciclos de Vida'
      },
      personalYear: {
        ru: 'Персональный год',
        en: 'Personal Year',
        es: 'Año Personal'
      },
      missingNumbers: {
        ru: 'Отсутствующие числа',
        en: 'Missing Numbers',
        es: 'Números Faltantes'
      },
      missingNumbersDesc: {
        ru: 'Указывают на качества, которые нужно развивать',
        en: 'Indicate qualities that need to be developed',
        es: 'Indican cualidades que deben desarrollarse'
      },
      fullReport: {
        ru: 'Полный отчёт',
        en: 'Full Report',
        es: 'Informe Completo'
      },
      noData: {
        ru: 'Укажите дату рождения в профиле',
        en: 'Specify birth date in profile',
        es: 'Especifique la fecha de nacimiento en el perfil'
      },
      noBirthDate: {
        ru: 'Для создания нумерологического отчёта необходимо указать дату рождения в профиле.',
        en: 'To create a numerological report, you need to specify your birth date in your profile.',
        es: 'Para crear un informe numerológico, debe especificar su fecha de nacimiento en su perfil.'
      },
      updateProfile: {
        ru: 'Обновить профиль',
        en: 'Update Profile',
        es: 'Actualizar Perfil'
      }
    };
    
    return texts[key][language as keyof typeof texts[typeof key]] || texts[key]['en'];
  };
  
  const handleBack = () => {
    navigate('/main');
  };
  
  const handleCalculator = () => {
    navigate('/numerology-calculator');
  };
  
  // Получаем основные нумерологические данные на основе профиля пользователя
  const getNumerologyData = () => {
    if (!userProfile?.birthDate) {
      return {
        lifePathNumber: 0,
        expressionNumber: 0,
        personalityNumber: 0,
        birthDayNumber: 0,
        maturityNumber: 0,
        balanceNumber: 0,
        currentYear: 0
      };
    }
    
    const birthDate = new Date(userProfile.birthDate);
    const lifePathNumber = calculateLifePathNumber(birthDate.toISOString().split('T')[0]);
    const expressionNumber = calculateExpressionNumber(userProfile.name || '');
    const personalityNumber = calculatePersonalityNumber(userProfile.name || '');
    const birthDay = birthDate.getDate();
    const birthDayNumber = birthDay > 9 && birthDay !== 11 && birthDay !== 22 && birthDay !== 33 
      ? birthDay.toString().split('').reduce((a, b) => a + parseInt(b), 0) 
      : birthDay;
      
    // Вычисляем число зрелости (путь жизни + выражение)
    let maturityNumber = lifePathNumber + expressionNumber;
    if (maturityNumber > 9 && maturityNumber !== 11 && maturityNumber !== 22 && maturityNumber !== 33) {
      maturityNumber = maturityNumber.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    
    // Вычисляем число баланса (первые буквы имен)
    let balanceNumber = 0;
    if (userProfile.name) {
      const nameArray = userProfile.name.split(' ');
      if (nameArray.length > 1) {
        const firstLetterValues: Record<string, number> = {
          'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
          'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
          's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
        };
        
        nameArray.forEach(name => {
          if (name[0] && firstLetterValues[name[0].toLowerCase()]) {
            balanceNumber += firstLetterValues[name[0].toLowerCase()];
          }
        });
        
        if (balanceNumber > 9 && balanceNumber !== 11 && balanceNumber !== 22 && balanceNumber !== 33) {
          balanceNumber = balanceNumber.toString().split('').reduce((a, b) => a + parseInt(b), 0);
        }
      }
    }
    
    // Вычисляем персональный год
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const birthMonth = birthDate.getMonth() + 1;
    const birthDayOfMonth = birthDate.getDate();
    
    let personalYearNumber = birthMonth + birthDayOfMonth + currentYear;
    while (personalYearNumber > 9 && personalYearNumber !== 11 && personalYearNumber !== 22) {
      personalYearNumber = personalYearNumber.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    
    return {
      lifePathNumber,
      expressionNumber,
      personalityNumber,
      birthDayNumber,
      maturityNumber,
      balanceNumber,
      currentYear: personalYearNumber
    };
  };
  
  // Создаем карточку для числа с его описанием
  const renderNumerologyDefinition = (title: string, number: number, description?: string) => (
    <Card className="bg-cosmic-dark/50 border-cosmic-accent/20 mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-cosmic-accent font-serif">{title}</h3>
          <div className="w-10 h-10 rounded-full bg-cosmic-accent/20 flex items-center justify-center font-serif text-xl text-cosmic-accent">
            {number}
          </div>
        </div>
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-cosmic-secondary text-sm">{description}</p>
        </CardContent>
      )}
    </Card>
  );
  
  const numerologyData = getNumerologyData();
  const birthDateFormatted = userProfile?.birthDate 
    ? new Date(userProfile.birthDate).toLocaleDateString(
        language === 'ru' ? 'ru-RU' : language === 'es' ? 'es-ES' : 'en-US'
      )
    : "";
  
  // Находим отсутствующие числа в матрице
  const missingNumbers = Object.entries(matrixData)
    .filter(([_, count]) => count === 0)
    .map(([num]) => num)
    .sort();
  
  // Вычисляем жизненные периоды пользователя
  const calculateLifePeriods = () => {
    if (!userProfile?.birthDate) return [];
    
    const birthDate = new Date(userProfile.birthDate);
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    // Первый период: 36 - число жизненного пути
    const lifePathNum = numerologyData.lifePathNumber;
    const firstPeriodEnd = 36 - lifePathNum > 0 ? 36 - lifePathNum : 36 - (lifePathNum - 9);
    
    // Второй период: 9 лет
    const secondPeriodEnd = firstPeriodEnd + 9;
    
    return [
      { 
        number: (month + day) % 9 || 9, 
        ageRange: `0-${firstPeriodEnd}`,
        title: language === 'ru' ? 'Формирование' : language === 'es' ? 'Formación' : 'Formation'
      },
      { 
        number: day % 9 || 9, 
        ageRange: `${firstPeriodEnd + 1}-${secondPeriodEnd}`,
        title: language === 'ru' ? 'Продуктивность' : language === 'es' ? 'Productividad' : 'Productivity'
      },
      { 
        number: lifePathNum % 9 || 9, 
        ageRange: `${secondPeriodEnd + 1}+`,
        title: language === 'ru' ? 'Мудрость' : language === 'es' ? 'Sabiduría' : 'Wisdom'
      }
    ];
  };
  
  const lifePeriods = calculateLifePeriods();
  
  // Получаем значение числа жизненного пути
  const lifePathMeaning = getNumerologyMeaning(numerologyData.lifePathNumber, language);
  const lifePathTitle = lifePathMeaning.title[language as keyof typeof lifePathMeaning.title] || lifePathMeaning.title.en;
  const lifePathDescription = lifePathMeaning.description[language as keyof typeof lifePathMeaning.description] || lifePathMeaning.description.en;
  
  // Контент страницы для пользователей с PRO-подпиской
  const numerologyContent = (
    <div className="min-h-screen flex flex-col bg-cosmic pb-20">
      <div className="bg-cosmic-dark text-white py-2 px-4 flex items-center z-20 fixed top-0 left-0 right-0">
        <Button 
          variant="ghost" 
          className="text-cosmic-secondary mr-2 p-2" 
          onClick={handleBack}
        >
          <ChevronLeft size={24} />
        </Button>
        
        <div className="flex items-center flex-1">
          <Calculator size={24} className="text-cosmic-accent mr-3" />
          <div>
            <h2 className="text-cosmic-accent font-serif">{getTranslatedText('title')}</h2>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="text-cosmic-accent p-2" 
          onClick={handleCalculator}
        >
          <FilePlus2 size={20} />
        </Button>
      </div>
      
      <StarField starCount={50} />
      
      <div className="flex-1 px-4 py-4 mt-16 max-w-md mx-auto w-full">
        {!userProfile?.birthDate ? (
          <Card className="bg-cosmic-dark border-cosmic-accent/20 mb-4">
            <CardHeader>
              <CardTitle className="text-cosmic-accent font-serif">
                {getTranslatedText('title')}
              </CardTitle>
              <CardDescription className="text-cosmic-secondary">
                {getTranslatedText('noData')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-cosmic-secondary mb-4">
                {getTranslatedText('noBirthDate')}
              </p>
              <Button 
                className="w-full bg-cosmic-accent"
                onClick={() => navigate('/profile')}
              >
                {getTranslatedText('updateProfile')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-center mb-6">
              <UserAvatar size="lg" />
              <div className="ml-4">
                <h2 className="text-xl text-white font-serif">{userProfile?.name}</h2>
                <p className="text-cosmic-secondary text-sm">
                  {birthDateFormatted}
                </p>
              </div>
            </div>
            
            <Tabs 
              defaultValue={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="overview">{getTranslatedText('overview')}</TabsTrigger>
                <TabsTrigger value="matrix">{getTranslatedText('matrix')}</TabsTrigger>
                <TabsTrigger value="cycles">{getTranslatedText('cycles')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                {/* Информация о нумерологии */}
                <Card className="bg-cosmic-dark/50 border-cosmic-accent/20 mb-4">
                  <CardHeader>
                    <CardTitle className="text-cosmic-accent font-serif flex items-center">
                      <Book className="mr-2 h-5 w-5" />
                      {getTranslatedText('whatIs')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cosmic-secondary text-sm">
                      {getTranslatedText('whatIsDesc')}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Основные числа */}
                <Card className="bg-cosmic-dark/50 border-cosmic-accent/20 mb-4">
                  <CardHeader>
                    <CardTitle className="text-cosmic-accent font-serif flex items-center">
                      <Calculator className="mr-2 h-5 w-5" />
                      {getTranslatedText('coreNumbers')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-2xl text-cosmic-accent">
                          {numerologyData.lifePathNumber}
                        </div>
                        <p className="text-cosmic-secondary text-xs text-center">
                          {getTranslatedText('lifePathNumber')}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-2xl text-cosmic-accent">
                          {numerologyData.expressionNumber}
                        </div>
                        <p className="text-cosmic-secondary text-xs text-center">
                          {getTranslatedText('expressionNumber')}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-2xl text-cosmic-accent">
                          {numerologyData.personalityNumber}
                        </div>
                        <p className="text-cosmic-secondary text-xs text-center">
                          {getTranslatedText('personalityNumber')}
                        </p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-2xl text-cosmic-accent">
                          {numerologyData.maturityNumber}
                        </div>
                        <p className="text-cosmic-secondary text-xs text-center">
                          {getTranslatedText('destinyNumber')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Число жизненного пути с описанием */}
                    <div className="mt-4 bg-cosmic-dark/60 rounded-lg p-3 border border-cosmic-accent/20">
                      <h3 className="text-cosmic-accent font-serif text-lg mb-2">
                        {getTranslatedText('lifePathNumber')}: {numerologyData.lifePathNumber}
                      </h3>
                      <p className="text-white text-sm font-serif mb-1">{lifePathTitle}</p>
                      <p className="text-cosmic-secondary text-sm">
                        {lifePathDescription}
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <CosmicButton 
                        onClick={handleCalculator}
                        variant="outline"
                        className="w-full"
                      >
                        {getTranslatedText('fullReport')}
                      </CosmicButton>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="matrix">
                {/* Психоматрица */}
                <Card className="bg-cosmic-dark/50 border-cosmic-accent/20 mb-4">
                  <CardHeader>
                    <CardTitle className="text-cosmic-accent font-serif">
                      {getTranslatedText('psychomatrix')}
                    </CardTitle>
                    <CardDescription className="text-cosmic-secondary">
                      {getTranslatedText('psychomatrixDesc')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PythagoreanMatrix digits={matrixData} language={language} />
                  </CardContent>
                </Card>
                
                {/* Отсутствующие числа */}
                {missingNumbers.length > 0 && (
                  <Card className="bg-cosmic-dark/50 border-cosmic-accent/20 mb-4">
                    <CardHeader>
                      <CardTitle className="text-cosmic-accent font-serif">
                        {getTranslatedText('missingNumbers')}
                      </CardTitle>
                      <CardDescription className="text-cosmic-secondary">
                        {getTranslatedText('missingNumbersDesc')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {missingNumbers.map((num) => (
                          <div 
                            key={num}
                            className="w-12 h-12 rounded-full bg-cosmic-accent/10 border border-cosmic-accent/20 flex items-center justify-center text-cosmic-accent font-serif text-xl"
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="cycles">
                {/* Жизненные периоды */}
                <Card className="bg-cosmic-dark/50 border-cosmic-accent/20 mb-4">
                  <CardHeader>
                    <CardTitle className="text-cosmic-accent font-serif flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      {getTranslatedText('lifeCycles')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lifePeriods.map((period, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-cosmic-accent/20 flex items-center justify-center mr-4 font-serif text-xl text-cosmic-accent">
                          {period.number}
                        </div>
                        <div>
                          <p className="text-white">{period.ageRange} {language === 'ru' ? 'лет' : language === 'es' ? 'años' : 'years'}</p>
                          <p className="text-cosmic-secondary text-sm">
                            {period.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                {/* Персональный год */}
                <Card className="bg-cosmic-dark/50 border-cosmic-accent/20 mb-4">
                  <CardHeader>
                    <CardTitle className="text-cosmic-accent font-serif flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      {getTranslatedText('personalYear')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-cosmic-gold/20 flex items-center justify-center font-serif text-3xl text-cosmic-gold">
                        {numerologyData.currentYear}
                      </div>
                    </div>
                    <p className="text-cosmic-secondary text-center text-sm">
                      {language === 'ru' 
                        ? `Ваш персональный год: ${numerologyData.currentYear}. Это энергия, которая будет влиять на все аспекты вашей жизни в текущем году.` 
                        : language === 'es'
                          ? `Su año personal: ${numerologyData.currentYear}. Esta es la energía que influirá en todos los aspectos de su vida en el año actual.`
                          : `Your personal year: ${numerologyData.currentYear}. This is the energy that will influence all aspects of your life in the current year.`}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Кнопка для расширенного анализа */}
            <Card className="bg-cosmic-dark/50 border-cosmic-accent/20 mb-4">
              <CardContent className="pt-4 pb-4">
                <CosmicButton 
                  onClick={handleCalculator}
                  className="w-full"
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  {getTranslatedText('advancedCalc')}
                </CosmicButton>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
  
  // Если пользователь не имеет PRO-подписки, показываем оверлей
  if (!userProfile?.isPro) {
    return (
      <div className="min-h-screen flex flex-col bg-cosmic">
        <StarField starCount={50} />
        <TopBar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-cosmic-dark/80 backdrop-blur-md border-cosmic-accent/20">
            <ProFeatureOverlay
              title={getTranslatedText('title')}
              message={language === 'ru' 
                ? "Этот раздел доступен только пользователям PRO" 
                : language === 'es'
                  ? "Esta sección está disponible solo para usuarios PRO"
                  : "This section is available only for PRO users"}
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
