
import React, { useState } from 'react';
import { StarField } from '@/components/StarField';
import { MeditationCard } from '@/components/MeditationCard';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { Home, Sparkles, MessageSquare, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MeditationPage: React.FC = () => {
  const { setActiveScreen, userProfile } = useAppStore();
  const { t } = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState("morning");
  
  // Check if user has PRO subscription
  const isPro = userProfile.isPro;

  // Sample meditation data
  const meditations = [
    {
      id: 'morning-1',
      title: t.meditation.morning.title1,
      description: t.meditation.morning.desc1,
      duration: '10 min',
      category: 'morning',
      image: '/meditation/morning1.jpg'
    },
    {
      id: 'morning-2',
      title: t.meditation.morning.title2,
      description: t.meditation.morning.desc2,
      duration: '15 min',
      category: 'morning',
      image: '/meditation/morning2.jpg'
    },
    {
      id: 'evening-1',
      title: t.meditation.evening.title1,
      description: t.meditation.evening.desc1,
      duration: '12 min',
      category: 'evening',
      image: '/meditation/evening1.jpg'
    },
    {
      id: 'stress-1',
      title: t.meditation.stress.title1,
      description: t.meditation.stress.desc1,
      duration: '8 min',
      category: 'stress',
      image: '/meditation/stress1.jpg'
    },
    {
      id: 'mantra-1',
      title: t.meditation.mantra.title1,
      description: t.meditation.mantra.desc1,
      duration: '20 min',
      category: 'mantra',
      image: '/meditation/mantra1.jpg'
    },
    {
      id: 'visualization-1',
      title: t.meditation.visualization.title1,
      description: t.meditation.visualization.desc1,
      duration: '15 min',
      category: 'visualization',
      image: '/meditation/visualization1.jpg'
    }
  ];

  // Filter meditations by category
  const filteredMeditations = meditations.filter(meditation => meditation.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col relative pb-16">
      <StarField starCount={100} />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-8">
        <h1 className="text-2xl text-center uppercase font-serif text-white mb-6">
          {t.meditation.pageTitle}
        </h1>

        {isPro ? (
          <>
            <Tabs 
              defaultValue="morning" 
              className="w-full max-w-md" 
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMeditations.map(meditation => (
                      <MeditationCard 
                        key={meditation.id} 
                        title={meditation.title}
                        description={meditation.description}
                        duration={meditation.duration}
                        image={meditation.image}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </>
        ) : (
          <div className="flex flex-col items-center w-full max-w-md">
            <SubscriptionBanner className="mb-6" />
            
            {/* Preview of locked content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full opacity-60">
              {meditations.filter(med => med.category === 'morning').slice(0, 2).map(meditation => (
                <MeditationCard 
                  key={meditation.id} 
                  title={meditation.title}
                  description={meditation.description}
                  duration={meditation.duration}
                  image={meditation.image}
                  locked={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-cosmic-dark/80 backdrop-blur-md border-t border-cosmic-accent/20 z-20">
        <div className="flex justify-around items-center p-3 max-w-lg mx-auto">
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('main')}
          >
            <Home size={24} />
            <span className="text-xs mt-1">{t.main.nav.path}</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('create-pact')}
          >
            <Sparkles size={24} />
            <span className="text-xs mt-1">{t.main.nav.ascesis}</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('universe')}
          >
            <MessageSquare size={24} />
            <span className="text-xs mt-1">{t.main.nav.universe}</span>
          </button>
          
          <button 
            className="flex flex-col items-center p-2 text-cosmic-secondary"
            onClick={() => setActiveScreen('profile')}
          >
            <User size={24} />
            <span className="text-xs mt-1">{t.main.nav.profile}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeditationPage;
