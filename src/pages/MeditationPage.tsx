
import React from 'react';
import { StarField } from '@/components/StarField';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Home, Sparkles, MessageSquare, User, Headphones, ArrowLeft, Crown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { MeditationSlider } from '@/components/MeditationSlider';
import { MeditationCard } from '@/components/MeditationCard';
import { Meditation } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MeditationPage: React.FC = () => {
  const { setActiveScreen, userProfile } = useAppStore();
  const { t } = useTranslations();
  const [selectedCategory, setSelectedCategory] = React.useState("morning");
  const navigate = useNavigate();
  
  // Check if user has PRO subscription
  const isPro = userProfile.isPro;

  // Sample meditation data with audioSrc - only FREE meditations
  const freeMeditations: Meditation[] = [
    {
      id: 'morning-free-1',
      title: 'Утренняя медитация',
      description: 'Начните свой день с этой простой 5-минутной медитации',
      duration: '5 мин',
      category: 'morning',
      image: '/meditation/morning1.jpg',
      audioSrc: '/meditations/morning-free.mp3',
      locked: false,
      requiresPro: false
    },
    {
      id: 'evening-free-1',
      title: 'Вечернее расслабление',
      description: 'Подготовьтесь ко сну с этой успокаивающей медитацией',
      duration: '7 мин',
      category: 'evening',
      image: '/meditation/evening1.jpg',
      audioSrc: '/meditations/evening-free.mp3',
      locked: false,
      requiresPro: false
    },
    {
      id: 'stress-free-1',
      title: 'Снятие стресса',
      description: 'Быстрая медитация для снятия напряжения',
      duration: '3 мин',
      category: 'stress',
      image: '/meditation/stress1.jpg',
      audioSrc: '/meditations/stress-free.mp3',
      locked: false,
      requiresPro: false
    },
  ];

  // Filter meditations by category
  const filteredMeditations = freeMeditations.filter(meditation => meditation.category === selectedCategory);

  const handleNavigateToProPage = () => {
    navigate('/meditation-pro');
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />

      {/* Header with back button and PRO navigation */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4">
        <button onClick={() => setActiveScreen('main')} className="p-2 text-cosmic-accent">
          <ArrowLeft size={24} />
        </button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-cosmic-gold bg-cosmic-dark/60 hover:bg-cosmic-accent/20"
                onClick={handleNavigateToProPage}
              >
                <Crown size={18} className="text-cosmic-gold" />
                <span>PRO медитации</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Перейти к PRO медитациям</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-8">
        <div className="flex items-center justify-center mb-6">
          <Headphones size={24} className="text-cosmic-accent mr-2" />
          <h1 className="text-2xl text-center uppercase font-serif text-white">
            Бесплатные медитации
          </h1>
        </div>

        <Tabs 
          defaultValue="morning" 
          className="w-full max-w-lg" 
          onValueChange={setSelectedCategory}
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="morning">{t.meditation.categories.morning}</TabsTrigger>
            <TabsTrigger value="evening">{t.meditation.categories.evening}</TabsTrigger>
            <TabsTrigger value="stress">{t.meditation.categories.stress}</TabsTrigger>
          </TabsList>

          {Object.keys(t.meditation.categories).slice(0, 3).map((category) => (
            <TabsContent key={category} value={category} className="w-full">
              <div className="space-y-4">
                <MeditationSlider meditations={filteredMeditations} />

                <div className="text-center mt-8">
                  <p className="text-cosmic-secondary mb-3">
                    Исследуйте нашу коллекцию PRO медитаций для более глубоких практик
                  </p>
                  <Button 
                    variant="default"
                    onClick={handleNavigateToProPage}
                    className="bg-cosmic-gold/80 hover:bg-cosmic-gold text-cosmic-dark"
                  >
                    <Crown size={16} className="mr-2" />
                    Перейти к PRO медитациям
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-cosmic-dark/80 backdrop-blur-md border-t border-cosmic-accent/20 z-20">
        <div className="flex justify-around items-center p-3 max-w-lg mx-auto">
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('main')}
          >
            <Home size={24} />
            <span className="text-xs mt-1">{t.main.path}</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('create-pact')}
          >
            <Sparkles size={24} />
            <span className="text-xs mt-1">{t.main.ascesis}</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('universe')}
          >
            <MessageSquare size={24} />
            <span className="text-xs mt-1">{t.main.universe}</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('profile')}
          >
            <User size={24} />
            <span className="text-xs mt-1">{t.main.profile}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeditationPage;
