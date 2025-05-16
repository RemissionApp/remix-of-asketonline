
import React from 'react';
import { StarField } from '@/components/StarField';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Home, Sparkles, MessageSquare, User, Headphones, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { ProBadge } from '@/components/ProBadge';
import { useNavigate } from 'react-router-dom';
import { MeditationSlider } from '@/components/MeditationSlider';
import { MeditationCard } from '@/components/MeditationCard';
import { Meditation } from '@/types';
import { Button } from '@/components/ui/button';

const MeditationProPage: React.FC = () => {
  const { setActiveScreen, userProfile, upgradeToPro } = useAppStore();
  const { t } = useTranslations();
  const [selectedCategory, setSelectedCategory] = React.useState("morning");
  const navigate = useNavigate();
  
  // Check if user has PRO subscription
  const isPro = userProfile.isPro;

  // Sample meditation data with audioSrc - only PRO meditations
  const proMeditations: Meditation[] = [
    {
      id: 'morning-pro-1',
      title: t.meditation.morning.title,
      description: t.meditation.morning.description,
      duration: '10 мин',
      category: 'morning',
      image: '/meditation/morning2.jpg',
      audioSrc: '/meditations/morning-pro-1.mp3',
      locked: !isPro,
      requiresPro: true
    },
    {
      id: 'morning-pro-2',
      title: 'Утренняя энергия',
      description: 'Зарядитесь энергией на весь день',
      duration: '15 мин',
      category: 'morning',
      image: '/meditation/morning3.jpg',
      audioSrc: '/meditations/morning-pro-2.mp3',
      locked: !isPro,
      requiresPro: true
    },
    {
      id: 'evening-pro-1',
      title: t.meditation.evening.title,
      description: t.meditation.evening.description,
      duration: '12 мин',
      category: 'evening',
      image: '/meditation/evening2.jpg',
      audioSrc: '/meditations/evening-pro-1.mp3',
      locked: !isPro,
      requiresPro: true
    },
    {
      id: 'stress-pro-1',
      title: t.meditation.stress.title,
      description: t.meditation.stress.description,
      duration: '8 мин',
      category: 'stress',
      image: '/meditation/stress2.jpg',
      audioSrc: '/meditations/stress-pro-1.mp3',
      locked: !isPro,
      requiresPro: true
    },
    {
      id: 'visualization-pro-1',
      title: t.meditation.visualization.title,
      description: t.meditation.visualization.description,
      duration: '15 мин',
      category: 'visualization',
      image: '/meditation/visualization1.jpg',
      audioSrc: '/meditations/visualization-pro-1.mp3',
      locked: !isPro,
      requiresPro: true
    }
  ];

  // Filter meditations by category
  const filteredMeditations = proMeditations.filter(meditation => meditation.category === selectedCategory);
  
  const handleUpgrade = () => {
    // For demo purposes, upgrade the user immediately
    upgradeToPro();
  };
  
  const handleNavigateToFreePage = () => {
    navigate('/meditation');
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />

      {/* Header with back button and PRO badge if applicable */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4">
        <button onClick={handleNavigateToFreePage} className="p-2 text-cosmic-accent">
          <ArrowLeft size={24} />
        </button>
        {isPro && <ProBadge size="md" />}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-8">
        <div className="flex items-center justify-center mb-6">
          <Headphones size={24} className="text-cosmic-accent mr-2" />
          <h1 className="text-2xl text-center uppercase font-serif text-white">
            PRO Медитации
          </h1>
        </div>

        <Tabs 
          defaultValue="morning" 
          className="w-full max-w-lg" 
          onValueChange={setSelectedCategory}
        >
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="morning">{t.meditation.categories.morning}</TabsTrigger>
            <TabsTrigger value="evening">{t.meditation.categories.evening}</TabsTrigger>
            <TabsTrigger value="stress">{t.meditation.categories.stress}</TabsTrigger>
            <TabsTrigger value="mantra">{t.meditation.categories.mantra}</TabsTrigger>
            <TabsTrigger value="visualization">{t.meditation.categories.visual}</TabsTrigger>
          </TabsList>

          {Object.keys(t.meditation.categories).map((category) => (
            <TabsContent key={category} value={category} className="w-full">
              <div className="space-y-8">
                {isPro ? (
                  <MeditationSlider meditations={filteredMeditations} />
                ) : (
                  <>
                    <SubscriptionBanner className="mb-6" onUpgrade={handleUpgrade} />
                    <ProFeatureOverlay 
                      title="Доступ к PRO медитациям" 
                      message="Получите доступ к полной коллекции медитаций с PRO"
                      className="w-full mb-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <MeditationCard 
                          title={filteredMeditations[0]?.title || "Утренняя медитация PRO"}
                          description={filteredMeditations[0]?.description || "Описание медитации"}
                          duration={filteredMeditations[0]?.duration || "10 мин"}
                          image={filteredMeditations[0]?.image || "/meditation/morning2.jpg"}
                        />
                        <MeditationCard 
                          title={filteredMeditations[1]?.title || "Вечерняя медитация PRO"}
                          description={filteredMeditations[1]?.description || "Описание медитации"}
                          duration={filteredMeditations[1]?.duration || "12 мин"}
                          image={filteredMeditations[1]?.image || "/meditation/evening2.jpg"}
                        />
                      </div>
                    </ProFeatureOverlay>
                  </>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Return to Free meditations */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={handleNavigateToFreePage}
            className="border-cosmic-accent/40 text-cosmic-accent hover:bg-cosmic-accent/10"
          >
            Вернуться к бесплатным медитациям
          </Button>
        </div>
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

export default MeditationProPage;
