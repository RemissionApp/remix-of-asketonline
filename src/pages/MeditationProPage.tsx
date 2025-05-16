
import React, { useState } from 'react';
import { Headphones } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { ProFeatureOverlay } from '@/components/ProFeatureOverlay';
import { useNavigate } from 'react-router-dom';
import { MeditationCard } from '@/components/MeditationCard';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { Button } from '@/components/ui/button';
import { MeditationLayout } from '@/components/MeditationLayout';
import { MeditationHeader } from '@/components/MeditationHeader';
import { MeditationTabContent } from '@/components/MeditationTabContent';
import { useProMeditations } from '@/data/meditationData';

const MeditationProPage: React.FC = () => {
  const { userProfile, upgradeToPro } = useAppStore();
  const { t } = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState("morning");
  const navigate = useNavigate();
  
  // Check if user has PRO subscription
  const isPro = userProfile.isPro;

  // Get meditation data
  const proMeditations = useProMeditations(isPro);
  
  const handleUpgrade = () => {
    // For demo purposes, upgrade the user immediately
    upgradeToPro();
  };
  
  const handleNavigateToFreePage = () => {
    navigate('/meditation');
  };

  return (
    <>
      <MeditationHeader 
        isPro={isPro}
        onBackClick={handleNavigateToFreePage}
      />
      
      <MeditationLayout 
        title="PRO Медитации"
        icon={<Headphones size={24} className="text-cosmic-accent mr-2" />}
      >
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
            isPro ? (
              <MeditationTabContent 
                key={category} 
                category={category} 
                meditations={proMeditations}
              />
            ) : (
              <MeditationTabContent 
                key={category} 
                category={category} 
                meditations={proMeditations}
              >
                <SubscriptionBanner className="mb-6" onUpgrade={handleUpgrade} />
                <ProFeatureOverlay 
                  title="Доступ к PRO медитациям" 
                  message="Получите доступ к полной коллекции медитаций с PRO"
                  className="w-full mb-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {proMeditations
                      .filter(m => m.category === category)
                      .slice(0, 2)
                      .map((meditation, index) => (
                        <MeditationCard 
                          key={meditation.id || index}
                          title={meditation.title}
                          description={meditation.description}
                          duration={meditation.duration}
                          image={meditation.image}
                        />
                      ))}
                  </div>
                </ProFeatureOverlay>
              </MeditationTabContent>
            )
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
      </MeditationLayout>
    </>
  );
};

export default MeditationProPage;
