
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { calculateLifePathNumber, calculateExpressionNumber, calculatePersonalityNumber, getNumerologyMeaning } from '@/utils/numerologyUtils';
import { PythagoreanMatrix } from './PythagoreanMatrix';
import { Calculator, Activity, Book, Calendar, Star, Heart, Compass, Lightbulb } from 'lucide-react';

interface NumerologyFormData {
  fullName: string;
  birthName: string;
  birthDate: string;
  currentName: string;
  gender: 'male' | 'female';
  birthPlace: string;
  goal: string;
}

interface NumerologyReportViewProps {
  formData: NumerologyFormData;
  language: string;
}

export const NumerologyReportView: React.FC<NumerologyReportViewProps> = ({ 
  formData,
  language
}) => {
  // Вычисляем все необходимые числа для отчета
  const reportData = useMemo(() => {
    const birthDate = new Date(formData.birthDate);
    
    // 1. Число жизненного пути
    const lifePathNumber = calculateLifePathNumber(formData.birthDate);
    
    // 2. Число выражения (имени)
    const expressionNumber = calculateExpressionNumber(
      formData.birthName || formData.fullName
    );
    
    // 3. Число личности
    const personalityNumber = calculatePersonalityNumber(
      formData.birthName || formData.fullName
    );
    
    // 4. Число души (гласные в имени)
    const calculateSoulNumber = (name: string): number => {
      if (!name || name.trim() === '') return 0;
      
      const letterValues: Record<string, number> = {
        'a': 1, 'e': 5, 'i': 9, 'o': 6, 'u': 3, 'y': 7,
        'а': 1, 'е': 5, 'ё': 5, 'и': 9, 'о': 6, 'у': 3, 'ы': 7, 'э': 5, 'ю': 7, 'я': 1
      };
      
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
      
      const normalizedName = name.toLowerCase();
      let sum = 0;
      
      for (const letter of normalizedName) {
        if (letterValues[letter]) {
          sum += letterValues[letter];
        }
      }
      
      return reduceToSingleDigit(sum);
    };
    
    const soulNumber = calculateSoulNumber(formData.birthName || formData.fullName);
    
    // 5. Число дня рождения
    const birthDay = birthDate.getDate();
    const birthDayNumber = birthDay > 9 && birthDay !== 11 && birthDay !== 22 && birthDay !== 33 
      ? String(birthDay).split('').reduce((a, b) => a + parseInt(b), 0) 
      : birthDay;
    
    // 6. Число зрелости (жизненный путь + выражение)
    let maturityNumber = lifePathNumber + expressionNumber;
    if (maturityNumber > 9 && maturityNumber !== 11 && maturityNumber !== 22 && maturityNumber !== 33) {
      maturityNumber = String(maturityNumber).split('').reduce((a, b) => a + parseInt(b), 0);
    }
    
    // 7. Психоматрица (квадрат Пифагора)
    const getPsychomatrix = (dateString: string) => {
      const digits = dateString.replace(/\D/g, '').split('');
      const counts: Record<string, number> = {
        '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0
      };
      
      digits.forEach(digit => {
        if (digit !== '0') {
          counts[digit]++;
        }
      });
      
      return counts;
    };
    
    const psychomatrix = getPsychomatrix(formData.birthDate);
    
    // 8. Отсутствующие числа (кармические уроки)
    const missingNumbers = Object.entries(psychomatrix)
      .filter(([_, count]) => count === 0)
      .map(([num]) => num)
      .sort();
    
    // 9. Периоды жизни
    const getLifePeriods = () => {
      const birthDate = new Date(formData.birthDate);
      const birthMonth = birthDate.getMonth() + 1;
      const birthDay = birthDate.getDate();
      
      // Первый период: 36 - жизненный путь (или другая формула)
      const firstPeriodEnd = 36 - (lifePathNumber > 9 ? lifePathNumber - 9 : lifePathNumber);
      // Второй период: 9 лет
      const secondPeriodEnd = firstPeriodEnd + 9;
      
      return [
        { 
          number: (birthMonth + birthDay) % 9 || 9, 
          ageRange: `0-${firstPeriodEnd}`,
          title: language === 'ru' ? 'Формирование' : language === 'es' ? 'Formación' : 'Formation'
        },
        { 
          number: birthDay % 9 || 9, 
          ageRange: `${firstPeriodEnd + 1}-${secondPeriodEnd}`,
          title: language === 'ru' ? 'Продуктивность' : language === 'es' ? 'Productividad' : 'Productivity'
        },
        { 
          number: lifePathNumber % 9 || 9, 
          ageRange: `${secondPeriodEnd + 1}+`,
          title: language === 'ru' ? 'Мудрость' : language === 'es' ? 'Sabiduría' : 'Wisdom'
        }
      ];
    };
    
    const lifePeriods = getLifePeriods();
    
    // 10. Персональный год
    const calculatePersonalYear = () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const birthMonth = birthDate.getMonth() + 1;
      const birthDayOfMonth = birthDate.getDate();
      
      let personalYear = birthMonth + birthDayOfMonth + currentYear;
      while (personalYear > 9 && personalYear !== 11 && personalYear !== 22) {
        personalYear = String(personalYear).split('').reduce((a, b) => a + parseInt(b), 0);
      }
      
      return personalYear;
    };
    
    const personalYear = calculatePersonalYear();
    
    return {
      lifePathNumber,
      expressionNumber,
      personalityNumber,
      soulNumber,
      birthDayNumber,
      maturityNumber,
      psychomatrix,
      missingNumbers,
      lifePeriods,
      personalYear
    };
  }, [formData]);
  
  // Получаем переведенные тексты для интерфейса
  const getTranslatedText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      reportTitle: {
        ru: 'Ваш нумерологический отчёт',
        en: 'Your Numerology Report',
        es: 'Su Informe Numerológico'
      },
      intro: {
        ru: 'Введение',
        en: 'Introduction',
        es: 'Introducción'
      },
      introText: {
        ru: 'Нумерология — это древняя система, изучающая связь между числами и событиями в жизни человека. Этот отчёт создан на основе вашей даты рождения и имени, чтобы помочь понять вашу личность, таланты, и жизненное предназначение.',
        en: 'Numerology is an ancient system that studies the connection between numbers and events in a person\'s life. This report is created based on your date of birth and name to help you understand your personality, talents, and life purpose.',
        es: 'La Numerología es un sistema antiguo que estudia la conexión entre los números y los eventos en la vida de una persona. Este informe se crea en base a su fecha de nacimiento y nombre para ayudarle a comprender su personalidad, talentos y propósito de vida.'
      },
      coreNumbers: {
        ru: 'Основные числа личности',
        en: 'Core Personality Numbers',
        es: 'Números Principales de Personalidad'
      },
      lifePathNumber: {
        ru: 'Число жизненного пути',
        en: 'Life Path Number',
        es: 'Número del Camino de Vida'
      },
      lifePathDesc: {
        ru: 'Самое важное число, показывающее основу вашей личности, таланты и испытания.',
        en: 'The most important number, showing the foundation of your personality, talents and challenges.',
        es: 'El número más importante, que muestra la base de su personalidad, talentos y desafíos.'
      },
      expressionNumber: {
        ru: 'Число выражения',
        en: 'Expression Number',
        es: 'Número de Expresión'
      },
      expressionDesc: {
        ru: 'Отражает таланты и способности, данные при рождении.',
        en: 'Reflects talents and abilities given at birth.',
        es: 'Refleja los talentos y habilidades dados al nacer.'
      },
      personalityNumber: {
        ru: 'Число личности',
        en: 'Personality Number',
        es: 'Número de Personalidad'
      },
      personalityDesc: {
        ru: 'Показывает, как вас воспринимают другие люди.',
        en: 'Shows how other people perceive you.',
        es: 'Muestra cómo le perciben otras personas.'
      },
      soulNumber: {
        ru: 'Число души',
        en: 'Soul Number',
        es: 'Número del Alma'
      },
      soulDesc: {
        ru: 'Раскрывает ваши глубинные желания и мотивации.',
        en: 'Reveals your deep desires and motivations.',
        es: 'Revela sus deseos profundos y motivaciones.'
      },
      birthDayNumber: {
        ru: 'Число дня рождения',
        en: 'Birth Day Number',
        es: 'Número del Día de Nacimiento'
      },
      birthDayDesc: {
        ru: 'Указывает на особые таланты и подарки судьбы.',
        en: 'Indicates special talents and gifts of fate.',
        es: 'Indica talentos especiales y dones del destino.'
      },
      maturityNumber: {
        ru: 'Число зрелости',
        en: 'Maturity Number',
        es: 'Número de Madurez'
      },
      maturityDesc: {
        ru: 'Активируется после 35 лет, показывает ваши цели во второй половине жизни.',
        en: 'Activated after age 35, shows your goals in the second half of life.',
        es: 'Activado después de los 35 años, muestra sus objetivos en la segunda mitad de la vida.'
      },
      psychomatrixTitle: {
        ru: 'Психоматрица (Квадрат Пифагора)',
        en: 'Psychomatrix (Pythagorean Square)',
        es: 'Psicomatriz (Cuadrado de Pitágoras)'
      },
      psychomatrixDesc: {
        ru: 'Распределение энергий и качеств характера, основанных на цифрах вашей даты рождения.',
        en: 'Distribution of energies and character qualities based on the digits of your date of birth.',
        es: 'Distribución de energías y cualidades de carácter basadas en los dígitos de su fecha de nacimiento.'
      },
      missingNumbers: {
        ru: 'Отсутствующие числа',
        en: 'Missing Numbers',
        es: 'Números Faltantes'
      },
      missingNumbersDesc: {
        ru: 'Показывают качества, которые важно развивать в этой жизни.',
        en: 'Show qualities that are important to develop in this life.',
        es: 'Muestran cualidades importantes para desarrollar en esta vida.'
      },
      lifePeriods: {
        ru: 'Периоды жизни',
        en: 'Life Periods',
        es: 'Periodos de Vida'
      },
      lifePeriodsDesc: {
        ru: 'Основные фазы вашего развития и энергии, влияющие на каждый период.',
        en: 'Main phases of your development and energies affecting each period.',
        es: 'Fases principales de su desarrollo y energías que afectan a cada período.'
      },
      personalCycles: {
        ru: 'Персональные циклы',
        en: 'Personal Cycles',
        es: 'Ciclos Personales'
      },
      personalYear: {
        ru: 'Персональный год',
        en: 'Personal Year',
        es: 'Año Personal'
      },
      personalYearDesc: {
        ru: 'Влияние текущего года на вашу жизнь.',
        en: 'The influence of the current year on your life.',
        es: 'La influencia del año actual en su vida.'
      },
      formation: {
        ru: 'Формирование',
        en: 'Formation',
        es: 'Formación'
      },
      productivity: {
        ru: 'Продуктивность',
        en: 'Productivity',
        es: 'Productividad'
      },
      wisdom: {
        ru: 'Мудрость',
        en: 'Wisdom',
        es: 'Sabiduría'
      },
      recommendations: {
        ru: 'Рекомендации',
        en: 'Recommendations',
        es: 'Recomendaciones'
      },
      recommendationsDesc: {
        ru: 'Советы для гармоничного развития в соответствии с вашими числами.',
        en: 'Advice for harmonious development in accordance with your numbers.',
        es: 'Consejos para un desarrollo armonioso de acuerdo con sus números.'
      }
    };
    
    return texts[key][language as keyof typeof texts[typeof key]] || texts[key]['en'];
  };
  
  const getName = () => {
    if (formData.currentName) {
      return formData.currentName;
    }
    
    if (formData.fullName) {
      const nameParts = formData.fullName.split(' ');
      return nameParts[0]; // Возвращаем только имя
    }
    
    return '';
  };
  
  // Получаем значение для числа жизненного пути
  const lifePathMeaning = getNumerologyMeaning(reportData.lifePathNumber, language);
  const lifePathTitle = lifePathMeaning.title[language as keyof typeof lifePathMeaning.title] || lifePathMeaning.title.en;
  const lifePathDescription = lifePathMeaning.description[language as keyof typeof lifePathMeaning.description] || lifePathMeaning.description.en;
  
  // Форматируем дату рождения для отображения
  const formatBirthDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (language === 'ru') {
      return date.toLocaleDateString('ru-RU');
    } else if (language === 'es') {
      return date.toLocaleDateString('es-ES');
    }
    return date.toLocaleDateString('en-US');
  };

  return (
    <>
      <Card className="bg-cosmic-dark border-cosmic-accent/20 mb-4">
        <CardHeader>
          <CardTitle className="text-cosmic-accent font-serif flex items-center">
            <Book className="mr-2 h-5 w-5" />
            {getTranslatedText('reportTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Введение */}
            <div>
              <h3 className="text-cosmic-accent font-serif text-lg mb-2 flex items-center">
                <Book className="mr-2 h-5 w-5" />
                {getTranslatedText('intro')}
              </h3>
              <p className="text-cosmic-secondary text-sm">
                {getTranslatedText('introText')}
              </p>
              <div className="mt-2 bg-cosmic-dark/50 border border-cosmic-accent/20 rounded-md p-3">
                <div className="text-sm text-cosmic-secondary">
                  <span className="text-cosmic-accent">{language === 'ru' ? 'Имя:' : language === 'es' ? 'Nombre:' : 'Name:'}</span> {formData.fullName}
                </div>
                <div className="text-sm text-cosmic-secondary">
                  <span className="text-cosmic-accent">{language === 'ru' ? 'Дата рождения:' : language === 'es' ? 'Fecha de nacimiento:' : 'Date of birth:'}</span> {formatBirthDate(formData.birthDate)}
                </div>
                {formData.birthPlace && (
                  <div className="text-sm text-cosmic-secondary">
                    <span className="text-cosmic-accent">{language === 'ru' ? 'Место рождения:' : language === 'es' ? 'Lugar de nacimiento:' : 'Place of birth:'}</span> {formData.birthPlace}
                  </div>
                )}
              </div>
            </div>
            
            {/* Основные числа */}
            <div>
              <h3 className="text-cosmic-accent font-serif text-lg mb-2 flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                {getTranslatedText('coreNumbers')}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-2xl text-cosmic-accent">
                    {reportData.lifePathNumber}
                  </div>
                  <p className="text-cosmic-secondary text-xs text-center">
                    {getTranslatedText('lifePathNumber')}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-2xl text-cosmic-accent">
                    {reportData.expressionNumber}
                  </div>
                  <p className="text-cosmic-secondary text-xs text-center">
                    {getTranslatedText('expressionNumber')}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-2xl text-cosmic-accent">
                    {reportData.soulNumber}
                  </div>
                  <p className="text-cosmic-secondary text-xs text-center">
                    {getTranslatedText('soulNumber')}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-cosmic-accent/20 flex items-center justify-center mb-2 font-serif text-2xl text-cosmic-accent">
                    {reportData.personalityNumber}
                  </div>
                  <p className="text-cosmic-secondary text-xs text-center">
                    {getTranslatedText('personalityNumber')}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-4">
                {/* Число жизненного пути */}
                <div className="bg-cosmic-dark/50 border border-cosmic-accent/20 rounded-md p-3">
                  <h4 className="text-cosmic-accent font-serif mb-1 flex items-center">
                    <Compass className="mr-2 h-4 w-4" />
                    {getTranslatedText('lifePathNumber')}: {reportData.lifePathNumber}
                  </h4>
                  <p className="text-xs text-cosmic-secondary mb-2">
                    {getTranslatedText('lifePathDesc')}
                  </p>
                  <p className="text-sm text-white">
                    <span className="text-cosmic-accent">{lifePathTitle}.</span> {lifePathDescription}
                  </p>
                </div>
                
                {/* Число выражения */}
                <div className="bg-cosmic-dark/50 border border-cosmic-accent/20 rounded-md p-3">
                  <h4 className="text-cosmic-accent font-serif mb-1 flex items-center">
                    <Star className="mr-2 h-4 w-4" />
                    {getTranslatedText('expressionNumber')}: {reportData.expressionNumber}
                  </h4>
                  <p className="text-xs text-cosmic-secondary mb-2">
                    {getTranslatedText('expressionDesc')}
                  </p>
                </div>
                
                {/* Число души */}
                <div className="bg-cosmic-dark/50 border border-cosmic-accent/20 rounded-md p-3">
                  <h4 className="text-cosmic-accent font-serif mb-1 flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    {getTranslatedText('soulNumber')}: {reportData.soulNumber}
                  </h4>
                  <p className="text-xs text-cosmic-secondary mb-2">
                    {getTranslatedText('soulDesc')}
                  </p>
                </div>
                
                {/* Число зрелости */}
                <div className="bg-cosmic-dark/50 border border-cosmic-accent/20 rounded-md p-3">
                  <h4 className="text-cosmic-accent font-serif mb-1 flex items-center">
                    <Activity className="mr-2 h-4 w-4" />
                    {getTranslatedText('maturityNumber')}: {reportData.maturityNumber}
                  </h4>
                  <p className="text-xs text-cosmic-secondary mb-2">
                    {getTranslatedText('maturityDesc')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Психоматрица */}
            <div>
              <h3 className="text-cosmic-accent font-serif text-lg mb-2 flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                {getTranslatedText('psychomatrixTitle')}
              </h3>
              <p className="text-cosmic-secondary text-sm mb-2">
                {getTranslatedText('psychomatrixDesc')}
              </p>
              <div className="bg-cosmic-dark/50 border border-cosmic-accent/20 rounded-md">
                <PythagoreanMatrix digits={reportData.psychomatrix} language={language} />
              </div>
              
              {/* Отсутствующие числа */}
              {reportData.missingNumbers.length > 0 && (
                <div className="mt-4 bg-cosmic-dark/50 border border-cosmic-accent/20 rounded-md p-3">
                  <h4 className="text-cosmic-accent font-serif mb-1">
                    {getTranslatedText('missingNumbers')}
                  </h4>
                  <p className="text-xs text-cosmic-secondary mb-2">
                    {getTranslatedText('missingNumbersDesc')}
                  </p>
                  <div className="flex gap-2">
                    {reportData.missingNumbers.map((num) => (
                      <div 
                        key={num}
                        className="w-8 h-8 rounded-full bg-cosmic-accent/10 border border-cosmic-accent/20 flex items-center justify-center text-cosmic-accent font-serif"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Периоды жизни */}
            <div>
              <h3 className="text-cosmic-accent font-serif text-lg mb-2 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                {getTranslatedText('lifePeriods')}
              </h3>
              <p className="text-cosmic-secondary text-sm mb-2">
                {getTranslatedText('lifePeriodsDesc')}
              </p>
              
              <div className="space-y-3">
                {reportData.lifePeriods.map((period, index) => (
                  <div key={index} className="flex items-center bg-cosmic-dark/50 border border-cosmic-accent/20 rounded-md p-3">
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
              </div>
            </div>
            
            {/* Персональные циклы */}
            <div>
              <h3 className="text-cosmic-accent font-serif text-lg mb-2 flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                {getTranslatedText('personalCycles')}
              </h3>
              
              <div className="bg-cosmic-dark/50 border border-cosmic-accent/20 rounded-md p-3">
                <h4 className="text-cosmic-accent font-serif mb-1 flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {getTranslatedText('personalYear')}: {reportData.personalYear}
                </h4>
                <p className="text-xs text-cosmic-secondary mb-2">
                  {getTranslatedText('personalYearDesc')}
                </p>
              </div>
            </div>
            
            {/* Рекомендации */}
            <div>
              <h3 className="text-cosmic-accent font-serif text-lg mb-2 flex items-center">
                <Lightbulb className="mr-2 h-5 w-5" />
                {getTranslatedText('recommendations')}
              </h3>
              <p className="text-cosmic-secondary text-sm mb-2">
                {getTranslatedText('recommendationsDesc')}
              </p>
              <div className="bg-cosmic-dark/50 border border-cosmic-accent/20 rounded-md p-3 text-cosmic-secondary">
                {language === 'ru' 
                  ? `${getName()}, ваше число жизненного пути ${reportData.lifePathNumber} указывает на то, что вам важно развивать ${lifePathTitle.toLowerCase()}. Обратите внимание на отсутствующие в вашей психоматрице числа — это зоны для роста.`
                  : language === 'es'
                    ? `${getName()}, su número de camino de vida ${reportData.lifePathNumber} indica que es importante para usted desarrollar ${lifePathTitle.toLowerCase()}. Preste atención a los números ausentes en su psicomatriz — estas son áreas para crecer.`
                    : `${getName()}, your life path number ${reportData.lifePathNumber} indicates that it's important for you to develop ${lifePathTitle.toLowerCase()}. Pay attention to the missing numbers in your psychomatrix — these are areas for growth.`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
