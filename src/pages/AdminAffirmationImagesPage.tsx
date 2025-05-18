
import React, { useState } from 'react';
import { MeditationLayout } from '@/components/MeditationLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { generateAllAffirmationImages } from '@/utils/generateAffirmationImages';

const AdminAffirmationImagesPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerateImages = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const generatedImages = await generateAllAffirmationImages();
      setResults(generatedImages);
    } catch (err) {
      console.error('Error generating affirmation images:', err);
      setError('Failed to generate images. See console for details.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <MeditationLayout title="Генерация изображений для аффирмаций">
      <div className="w-full max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Управление изображениями аффирмаций</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Эта страница позволяет сгенерировать изображения для всех шагов практики аффирмаций. 
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
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerateImages} 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
              <Image className="h-4 w-4" />
              {isGenerating ? 'Генерация изображений...' : 'Сгенерировать изображения'}
            </Button>
          </CardFooter>
        </Card>
        
        {Object.entries(results).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Сгенерированные изображения</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results).map(([step, url]) => (
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
      </div>
    </MeditationLayout>
  );
};

export default AdminAffirmationImagesPage;
