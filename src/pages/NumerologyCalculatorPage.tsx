
import React, { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { calculateLifePathNumber, calculateExpressionNumber, calculatePersonalityNumber, getNumerologyMeaning } from '@/utils/numerologyUtils';
import { ChevronLeft, Calculator, Book, Save, PenLine } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NumerologyReportView } from '@/components/numerology/NumerologyReportView';

interface NumerologyFormData {
  fullName: string;
  birthName: string;
  birthDate: string;
  currentName: string;
  gender: 'male' | 'female';
  birthPlace: string;
  goal: string;
}

const NumerologyCalculatorPage = () => {
  const { userProfile, language } = useAppStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<NumerologyFormData>({
    fullName: userProfile?.name || '',
    birthName: '',
    birthDate: userProfile?.birthDate 
      ? new Date(userProfile.birthDate).toISOString().split('T')[0] 
      : '',
    currentName: '',
    gender: 'male',
    birthPlace: '',
    goal: ''
  });
  
  const [showReport, setShowReport] = useState(false);
  const [activeTab, setActiveTab] = useState("data");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleGenderChange = (value: 'male' | 'female') => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };
  
  const handleCalculate = () => {
    if (!formData.fullName || !formData.birthDate) {
      toast({
        title: language === 'ru' ? "Ошибка" : language === 'es' ? "Error" : "Error",
        description: language === 'ru' 
          ? "Заполните обязательные поля: ФИО и дату рождения" 
          : language === 'es'
            ? "Complete los campos obligatorios: nombre completo y fecha de nacimiento"
            : "Fill in the required fields: full name and date of birth",
        variant: "destructive"
      });
      return;
    }
    
    // Переключаемся на вкладку отчета
    setShowReport(true);
    setActiveTab("report");
  };
  
  const handleBack = () => {
    if (showReport && activeTab === "report") {
      setActiveTab("data");
      return;
    }
    navigate('/numerology');
  };
  
  const getTranslatedText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      title: {
        ru: 'Нумерологический калькулятор',
        en: 'Numerology Calculator',
        es: 'Calculadora Numerológica'
      },
      data: {
        ru: 'Данные',
        en: 'Data',
        es: 'Datos'
      },
      report: {
        ru: 'Отчёт',
        en: 'Report',
        es: 'Informe'
      },
      fullName: {
        ru: 'ФИО полностью',
        en: 'Full Name',
        es: 'Nombre Completo'
      },
      birthName: {
        ru: 'ФИО при рождении',
        en: 'Birth Name',
        es: 'Nombre de Nacimiento'
      },
      birthNameHint: {
        ru: 'Если отличается от текущего',
        en: 'If different from current',
        es: 'Si es diferente del actual'
      },
      birthDate: {
        ru: 'Дата рождения',
        en: 'Date of Birth',
        es: 'Fecha de Nacimiento'
      },
      currentName: {
        ru: 'Используемое имя',
        en: 'Current Name',
        es: 'Nombre Actual'
      },
      currentNameHint: {
        ru: 'Имя, которым вас называют',
        en: 'Name you go by',
        es: 'Nombre por el que le llaman'
      },
      gender: {
        ru: 'Пол',
        en: 'Gender',
        es: 'Género'
      },
      male: {
        ru: 'Мужской',
        en: 'Male',
        es: 'Masculino'
      },
      female: {
        ru: 'Женский',
        en: 'Female',
        es: 'Femenino'
      },
      birthPlace: {
        ru: 'Место рождения',
        en: 'Place of Birth',
        es: 'Lugar de Nacimiento'
      },
      birthPlaceHint: {
        ru: 'Опционально',
        en: 'Optional',
        es: 'Opcional'
      },
      goal: {
        ru: 'Цель анализа',
        en: 'Analysis Goal',
        es: 'Objetivo del Análisis'
      },
      goalHint: {
        ru: 'Напр.: личная жизнь, бизнес, предназначение',
        en: 'E.g.: personal life, business, purpose',
        es: 'Ej.: vida personal, negocios, propósito'
      },
      calculate: {
        ru: 'Рассчитать',
        en: 'Calculate',
        es: 'Calcular'
      },
      generateReport: {
        ru: 'Сформировать отчёт',
        en: 'Generate Report',
        es: 'Generar Informe'
      },
      introduction: {
        ru: 'Введение',
        en: 'Introduction',
        es: 'Introducción'
      },
      personalNumbers: {
        ru: 'Основные числа',
        en: 'Core Numbers',
        es: 'Números Principales'
      },
      nameInfluence: {
        ru: 'Влияние имени',
        en: 'Name Influence',
        es: 'Influencia del Nombre'
      },
      cycles: {
        ru: 'Персональные циклы',
        en: 'Personal Cycles',
        es: 'Ciclos Personales'
      },
      psychomatrix: {
        ru: 'Психоматрица',
        en: 'Psychomatrix',
        es: 'Psicomatriz'
      },
      compatibility: {
        ru: 'Совместимость',
        en: 'Compatibility',
        es: 'Compatibilidad'
      },
      purpose: {
        ru: 'Предназначение',
        en: 'Purpose',
        es: 'Propósito'
      },
      karmic: {
        ru: 'Кармические аспекты',
        en: 'Karmic Aspects',
        es: 'Aspectos Kármicos'
      },
      forecast: {
        ru: 'Прогноз на год',
        en: 'Yearly Forecast',
        es: 'Pronóstico Anual'
      },
      recommendations: {
        ru: 'Рекомендации',
        en: 'Recommendations',
        es: 'Recomendaciones'
      }
    };
    
    return texts[key][language as keyof typeof texts[typeof key]] || texts[key]['en'];
  };
  
  // Если пользователь не имеет PRO подписки, показываем оверлей
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
                ? "Расширенный нумерологический калькулятор доступен только для PRO пользователей" 
                : language === 'es'
                  ? "La calculadora numerológica avanzada está disponible solo para usuarios PRO"
                  : "Advanced numerology calculator is available only for PRO users"}
            >
              <div className="h-96"></div>
            </ProFeatureOverlay>
          </Card>
        </div>
        <BottomNavigation />
      </div>
    );
  }
  
  return (
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
          <Book size={24} className="text-cosmic-accent mr-3" />
          <div>
            <h2 className="text-cosmic-accent font-serif">{getTranslatedText('title')}</h2>
          </div>
        </div>
      </div>
      
      <StarField starCount={50} />
      
      <div className="flex-1 px-4 py-4 mt-16 max-w-md mx-auto w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="data">{getTranslatedText('data')}</TabsTrigger>
            <TabsTrigger value="report" disabled={!showReport}>{getTranslatedText('report')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data">
            <Card className="bg-cosmic-dark border-cosmic-accent/20 mb-4">
              <CardHeader>
                <CardTitle className="text-cosmic-accent font-serif">
                  {getTranslatedText('title')}
                </CardTitle>
                <CardDescription className="text-cosmic-secondary">
                  {language === 'ru' 
                    ? "Введите ваши данные для полного нумерологического анализа"
                    : language === 'es'
                      ? "Ingrese sus datos para un análisis numerológico completo"
                      : "Enter your data for a complete numerological analysis"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Полное имя */}
                <div>
                  <Label htmlFor="fullName" className="text-cosmic-secondary">
                    {getTranslatedText('fullName')} *
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="bg-cosmic-dark border-cosmic-accent/20 text-white"
                    placeholder={language === 'ru' ? "Иванов Иван Иванович" : "John Smith"}
                    required
                  />
                </div>
                
                {/* Имя при рождении */}
                <div>
                  <Label htmlFor="birthName" className="text-cosmic-secondary">
                    {getTranslatedText('birthName')}
                  </Label>
                  <Input
                    id="birthName"
                    name="birthName"
                    value={formData.birthName}
                    onChange={handleChange}
                    className="bg-cosmic-dark border-cosmic-accent/20 text-white"
                    placeholder={language === 'ru' ? "Если менялась фамилия" : "If name changed"}
                  />
                  <p className="text-xs text-cosmic-secondary mt-1">
                    {getTranslatedText('birthNameHint')}
                  </p>
                </div>
                
                {/* Дата рождения */}
                <div>
                  <Label htmlFor="birthDate" className="text-cosmic-secondary">
                    {getTranslatedText('birthDate')} *
                  </Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="bg-cosmic-dark border-cosmic-accent/20 text-white"
                    required
                  />
                </div>
                
                {/* Используемое имя */}
                <div>
                  <Label htmlFor="currentName" className="text-cosmic-secondary">
                    {getTranslatedText('currentName')}
                  </Label>
                  <Input
                    id="currentName"
                    name="currentName"
                    value={formData.currentName}
                    onChange={handleChange}
                    className="bg-cosmic-dark border-cosmic-accent/20 text-white"
                  />
                  <p className="text-xs text-cosmic-secondary mt-1">
                    {getTranslatedText('currentNameHint')}
                  </p>
                </div>
                
                {/* Пол */}
                <div>
                  <Label className="text-cosmic-secondary block mb-2">
                    {getTranslatedText('gender')} *
                  </Label>
                  <RadioGroup 
                    defaultValue={formData.gender} 
                    onValueChange={(value) => handleGenderChange(value as 'male' | 'female')}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="text-cosmic-secondary">
                        {getTranslatedText('male')}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="text-cosmic-secondary">
                        {getTranslatedText('female')}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Место рождения */}
                <div>
                  <Label htmlFor="birthPlace" className="text-cosmic-secondary">
                    {getTranslatedText('birthPlace')}
                  </Label>
                  <Input
                    id="birthPlace"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    className="bg-cosmic-dark border-cosmic-accent/20 text-white"
                  />
                  <p className="text-xs text-cosmic-secondary mt-1">
                    {getTranslatedText('birthPlaceHint')}
                  </p>
                </div>
                
                {/* Цель анализа */}
                <div>
                  <Label htmlFor="goal" className="text-cosmic-secondary">
                    {getTranslatedText('goal')}
                  </Label>
                  <Textarea
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="bg-cosmic-dark border-cosmic-accent/20 text-white min-h-[80px]"
                    placeholder={language === 'ru' 
                      ? "Для чего вам нужен нумерологический анализ" 
                      : "Why you need a numerology analysis"}
                  />
                  <p className="text-xs text-cosmic-secondary mt-1">
                    {getTranslatedText('goalHint')}
                  </p>
                </div>
                
                <div className="pt-2">
                  <Button
                    onClick={handleCalculate}
                    className="w-full bg-cosmic-accent text-white"
                    disabled={!formData.fullName || !formData.birthDate}
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    {getTranslatedText('generateReport')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="report">
            {showReport && (
              <NumerologyReportView
                formData={formData}
                language={language}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default NumerologyCalculatorPage;
