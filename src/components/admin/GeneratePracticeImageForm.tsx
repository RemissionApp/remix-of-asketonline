
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface GeneratePracticeImageFormProps {
  practiceId?: number;
  stepId?: number;
  onImageGenerated?: (imageUrl: string) => void;
}

export const GeneratePracticeImageForm: React.FC<GeneratePracticeImageFormProps> = ({
  practiceId = 0,
  stepId,
  onImageGenerated
}) => {
  const [prompt, setPrompt] = useState('');
  const [filename, setFilename] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || !filename.trim()) {
      setError('Пожалуйста, заполните оба поля');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase.functions.invoke('generate-practice-image', {
        body: {
          prompt,
          filename,
          practiceId,
          stepId
        }
      });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedImage(data.imageUrl);
      toast({
        title: "Изображение успешно создано!",
        description: "Изображение было сгенерировано и сохранено в Supabase",
      });

      if (onImageGenerated) {
        onImageGenerated(data.imageUrl);
      }
    } catch (err) {
      console.error('Ошибка при генерации изображения:', err);
      setError(err.message || 'Произошла ошибка при генерации изображения');
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: err.message || 'Произошла ошибка при генерации изображения',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Генерация изображения для практик</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">Промпт для изображения</label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Опишите детально изображение, которое хотите сгенерировать..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="filename" className="text-sm font-medium">Имя файла (без расширения)</label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="meditation_visual"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {generatedImage && (
            <div className="space-y-2">
              <div className="bg-green-50 text-green-600 p-3 rounded-md flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Изображение успешно сгенерировано!
              </div>
              <div className="border rounded-md p-2">
                <img 
                  src={generatedImage} 
                  alt="Сгенерированное изображение" 
                  className="w-full rounded-md" 
                />
              </div>
              <div className="bg-gray-50 p-2 rounded-md text-xs overflow-x-scroll">
                <code>{generatedImage}</code>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex items-center"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Генерация...' : 'Сгенерировать изображение'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
