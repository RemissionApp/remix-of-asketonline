import React, { useState } from 'react';
import { Headphones, Crown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MeditationLayout } from '@/components/MeditationLayout';
import { MeditationHeader } from '@/components/MeditationHeader';
import { MeditationTabContent } from '@/components/MeditationTabContent';
import { useFreeMeditations } from '@/data/meditationData';
import { PageHeader } from '@/components/PageHeader';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';

const MeditationPage: React.FC = () => {
  const { userProfile } = useAppStore();
  const { t } = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState('morning');
  const navigate = useNavigate();

  // Check if user has PRO subscription
  const isPro = userProfile.isPro;

  // Get meditation data
  const freeMeditations = useFreeMeditations();

  const handleNavigateToProPage = () => {
    navigate('/meditation-pro');
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-20">
      <StarField starCount={100} />

      <PageHeader
        title={t.meditation.freeMeditations}
        onBackClick={() => navigate('/main')}
      />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 pt-20 py-6">
        <div className="w-full max-w-lg flex flex-col items-center">
          <Tabs
            defaultValue="morning"
            className="w-full max-w-lg"
            onValueChange={setSelectedCategory}
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="morning">
                {t.meditation.categories.morning}
              </TabsTrigger>
              <TabsTrigger value="evening">
                {t.meditation.categories.evening}
              </TabsTrigger>
              <TabsTrigger value="stress">
                {t.meditation.categories.stress}
              </TabsTrigger>
            </TabsList>

            {Object.keys(t.meditation.categories)
              .slice(0, 3)
              .map(category => (
                <MeditationTabContent
                  key={category}
                  category={category}
                  meditations={freeMeditations}
                >
                  <div className="text-center mt-8">
                     <p className="text-cosmic-secondary mb-3">
                      {t.meditation.exploreProCollection}
                    </p>
                    <Button
                      variant="default"
                      onClick={handleNavigateToProPage}
                      className="bg-cosmic-gold/80 hover:bg-cosmic-gold text-cosmic-dark"
                    >
                      <Crown size={16} className="mr-2" />
                      {t.meditation.goToPro}
                    </Button>
                  </div>
                </MeditationTabContent>
              ))}
          </Tabs>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MeditationPage;
