
import React, { useState, useEffect } from 'react';
import { MeditationLayout } from '@/components/MeditationLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { useAffirmations } from '@/hooks/useAffirmations';
import { generateAllAffirmationImages } from '@/utils/generateAffirmationImageUtils';
import { useAppStore } from '@/store/useAppStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateAllAffirmationImages as generateAllVisualGuideImages } from '@/utils/generateAffirmationImages';
import { useToast } from '@/components/ui/use-toast';
import { CosmicButton } from '@/components/CosmicButton'; 
import { ensurePracticeImageBucketExists } from '@/lib/supabase';

const AdminAffirmationImagesPage: React.FC = () => {
  const { language } = useAppStore();
  const affirmations = useAffirmations(language);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingGuides, setIsGeneratingGuides] = useState(false);
  const [results, setResults] = useState<Record<number, string>>({});
  const [guideResults, setGuideResults] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Убедимся, что бакет для изображений существует
  useEffect(() => {
    ensurePracticeImageBucketExists()
      .then(success => {
        if (success) {
          console.log("Бакет practice-images успешно создан или уже существует");
        } else {
          console.error("Не удалось создать бакет practice-images");
          setError("Не удалось создать бакет для изображений. Проверьте консоль.");
        }
      });
  }, []);
  
  const handleGenerateImages = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      toast({
        title: "Генерация изображений",
        description: "Начата генерация изображений для аффирмаций. Это может занять некоторое время.",
      });
      
      const generatedImages = await generateAllAffirmationImages(affirmations, language);
      setResults(generatedImages);
      
      toast({
        title: "Готово!",
        description: `Сгенерировано ${Object.keys(generatedImages).length} изображений для аффирмаций.`,
      });
    } catch (err) {
      console.error('Ошибка генерации изображений аффирмаций:', err);
      setError('Не удалось сгенерировать изображения. См. консоль для деталей.');
      
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сгенерировать изображения для аффирмаций.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleGenerateGuideImages = async () => {
    setIsGeneratingGuides(true);
    
    try {
      toast({
        title: "Генерация изображений",
        description: "Начата генерация изображений для визуальных руководств. Это может занять некоторое время.",
      });
      
      const generatedImages = await generateAllVisualGuideImages();
      setGuideResults(generatedImages);
      
      toast({
        title: "Готово!",
        description: `Сгенерировано ${Object.keys(generatedImages).length} изображений для визуальных руководств.`,
      });
    } catch (err) {
      console.error('Ошибка генерации изображений для визуальных руководств:', err);
      setError('Не удалось сгенерировать изображения руководств. См. консоль для деталей.');
      
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сгенерировать изображения для визуальных руководств.",
      });
    } finally {
      setIsGeneratingGuides(false);
    }
  };
  
  return (
    <MeditationLayout title="Генерация изображений для аффирмаций">
      <div className="w-full max-w-4xl mx-auto pb-20">
        <Tabs defaultValue="affirmations" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="affirmations">Аффирмации</TabsTrigger>
            <TabsTrigger value="guides">Визуальные руководства</TabsTrigger>
          </TabsList>
          
          <TabsContent value="affirmations">
            <Card>
              <CardHeader>
                <CardTitle>Управление изображениями аффирмаций</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Эта страница позволяет сгенерировать изображения для всех аффирмаций. 
                  Изображения будут созданы с помощью DALL-E и сохранены в хранилище Supabase.
                </p>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center mb-4">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}
                
                {Object.keys(results).length > 0 && (
                  <div className="bg-green-50 text-green-600 p-3 rounded-md flex items-center mb-4">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Изображения успешно сгенерированы!
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <Button 
                    onClick={handleGenerateImages} 
                    disabled={isGenerating}
                    className="flex items-center gap-2"
                  >
                    {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
                    <Image className="h-4 w-4" />
                    {isGenerating ? 'Генерация изображений...' : 'Сгенерировать изображения аффирмаций'}
                  </Button>
                  
                  <CosmicButton
                    onClick={handleGenerateImages}
                    disabled={isGenerating}
                    className="flex items-center gap-2"
                  >
                    {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
                    <Image className="h-4 w-4" />
                    {isGenerating ? 'Генерация...' : 'Сгенерировать (Космический стиль)'}
                  </CosmicButton>
                </div>
              </CardContent>
            </Card>
            
            {Object.entries(results).length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Сгенерированные изображения аффирмаций</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(results).map(([id, url]) => {
                    const affirmation = affirmations.find(a => a.id === Number(id));
                    return (
                      <div key={id} className="border rounded-md p-2">
                        <h3 className="font-medium mb-2">{affirmation?.text.slice(0, 50)}...</h3>
                        <img 
                          src={url} 
                          alt={`Изображение для аффирмации ${id}`} 
                          className="w-full rounded-md mb-2"
                        />
                        <div className="bg-gray-50 p-2 rounded-md text-xs overflow-x-auto">
                          <code>{url}</code>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="guides">
            <Card>
              <CardHeader>
                <CardTitle>Управление изображениями визуальных руководств</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Здесь можно сгенерировать изображения для визуальных руководств в практике аффирмаций.
                  Изображения будут созданы с помощью DALL-E и сохранены в хранилище Supabase.
                </p>
                
                <div className="flex flex-wrap gap-4 mt-6">
                  <Button 
                    onClick={handleGenerateGuideImages} 
                    disabled={isGeneratingGuides}
                    className="flex items-center gap-2"
                  >
                    {isGeneratingGuides && <Loader2 className="h-4 w-4 animate-spin" />}
                    <Image className="h-4 w-4" />
                    {isGeneratingGuides ? 'Генерация руководств...' : 'Сгенерировать изображения руководств'}
                  </Button>
                  
                  <CosmicButton 
                    onClick={handleGenerateGuideImages} 
                    disabled={isGeneratingGuides}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {isGeneratingGuides && <Loader2 className="h-4 w-4 animate-spin" />}
                    <Image className="h-4 w-4" />
                    {isGeneratingGuides ? 'Генерация...' : 'Космический стиль'}
                  </CosmicButton>
                </div>
              </CardContent>
            </Card>
            
            {Object.entries(guideResults).length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Сгенерированные изображения руководств</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(guideResults).map(([step, url]) => (
                    <div key={step} className="border rounded-md p-2">
                      <h3 className="font-medium mb-2">Шаг {step}</h3>
                      <img 
                        src={url} 
                        alt={`Изображение для шага ${step}`} 
                        className="w-full rounded-md mb-2"
                      />
                      <div className="bg-gray-50 p-2 rounded-md text-xs overflow-x-auto">
                        <code>{url}</code>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MeditationLayout>
  );
};

export default AdminAffirmationImagesPage;
