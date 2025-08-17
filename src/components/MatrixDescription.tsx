import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FullDestinyMatrixData } from '@/utils/numerologyUtils';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface MatrixDescriptionProps {
  matrixData: FullDestinyMatrixData;
  birthDate: string;
  name: string;
  language?: string;
}

interface NumerologyDescription {
  centralEnergy?: {
    title: string;
    number: number;
    description: string;
    keyTask: string;
    influence: string;
  };
  ancestralLines?: {
    masculine: {
      title: string;
      energies: string[];
      tasks: string;
    };
    feminine: {
      title: string;
      energies: string[];
      tasks: string;
    };
  };
  moneyChannel?: {
    title: string;
    energies: number[];
    description: string;
    recommendations: string;
  };
  relationshipChannel?: {
    title: string;
    energies: number[];
    description: string;
    idealPartner: string;
    challenges: string;
  };
  chakras?: Array<{
    name: string;
    number: number;
    description: string;
    recommendations: string;
  }>;
  ageLines?: Array<{
    period: string;
    description: string;
    recommendations: string;
  }>;
  generalConclusion?: {
    personalProfile: string;
    lifeTasks: string;
    potentialRealization: string;
    finalRecommendations: string;
  };
}

export const MatrixDescription: React.FC<MatrixDescriptionProps> = ({ 
  matrixData, 
  birthDate, 
  name, 
  language = 'ru' 
}) => {
  const { userProfile } = useAppStore();
  const [description, setDescription] = useState<NumerologyDescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadOrGenerateDescription();
  }, [matrixData, birthDate, name, language]);

  const loadOrGenerateDescription = async () => {
    if (!userProfile?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // First, save or get the numerology reading
      const { data: reading, error: readingError } = await supabase
        .from('numerology_readings')
        .upsert({
          user_id: userProfile.id,
          birth_date: birthDate,
          name: name,
          matrix_data: matrixData
        })
        .select()
        .single();

      if (readingError) {
        console.error('Error saving reading:', readingError);
        throw readingError;
      }

      // Try to get existing description
      const { data: existingDescription } = await supabase
        .from('numerology_descriptions')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('reading_id', reading.id)
        .eq('language', language)
        .single();

      if (existingDescription) {
        setDescription(existingDescription.description_data);
        setLoading(false);
        return;
      }

      // Generate new description
      await generateDescription(reading.id);

    } catch (error) {
      console.error('Error loading description:', error);
      setLoading(false);
      toast.error('Ошибка при загрузке описания матрицы');
    }
  };

  const generateDescription = async (readingId: string) => {
    if (!userProfile?.id) return;

    try {
      setGenerating(true);

      const { data, error } = await supabase.functions.invoke('generate-numerology-description', {
        body: {
          matrixData,
          userId: userProfile.id,
          readingId,
          language
        }
      });

      if (error) {
        throw error;
      }

      setDescription(data.description);
      toast.success('Описание матрицы успешно создано');

    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('Ошибка при создании описания матрицы');
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!userProfile?.id) return;

    try {
      // Delete existing description
      await supabase
        .from('numerology_descriptions')
        .delete()
        .eq('user_id', userProfile.id);

      // Generate new one
      loadOrGenerateDescription();
    } catch (error) {
      console.error('Error regenerating description:', error);
      toast.error('Ошибка при перегенерации описания');
    }
  };

  if (loading) {
    return (
      <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-cosmic-accent" />
            <p className="text-cosmic-secondary">
              {generating ? 'Создаём персональное описание...' : 'Загружаем описание матрицы...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!description) {
    return (
      <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <p className="text-cosmic-secondary text-center">
              Не удалось загрузить описание матрицы.
            </p>
            <Button onClick={loadOrGenerateDescription} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Попробовать снова
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Regenerate Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleRegenerate} 
          variant="outline" 
          size="sm"
          disabled={generating}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Перегенерировать описание
        </Button>
      </div>

      {/* Central Energy */}
      {description.centralEnergy && (
        <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
          <CardHeader>
            <CardTitle className="text-cosmic-accent flex items-center gap-2">
              <span className="text-2xl">🌟</span>
              {description.centralEnergy.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-cosmic-text">{description.centralEnergy.description}</p>
            <div className="border-l-4 border-cosmic-accent/50 pl-4">
              <h4 className="font-semibold text-white mb-2">Ключевая задача:</h4>
              <p className="text-cosmic-secondary">{description.centralEnergy.keyTask}</p>
            </div>
            <div className="border-l-4 border-cosmic-accent/50 pl-4">
              <h4 className="font-semibold text-white mb-2">Влияние:</h4>
              <p className="text-cosmic-secondary">{description.centralEnergy.influence}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ancestral Lines */}
      {description.ancestralLines && (
        <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
          <CardHeader>
            <CardTitle className="text-cosmic-accent flex items-center gap-2">
              <span className="text-2xl">🌳</span>
              Линии рода
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-white mb-3">{description.ancestralLines.masculine.title}</h4>
              {description.ancestralLines.masculine.energies.map((energy, index) => (
                <p key={index} className="text-cosmic-secondary mb-2">{energy}</p>
              ))}
              <div className="bg-cosmic-dark/50 p-3 rounded-lg mt-3">
                <p className="text-cosmic-text font-medium">Задачи: {description.ancestralLines.masculine.tasks}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3">{description.ancestralLines.feminine.title}</h4>
              {description.ancestralLines.feminine.energies.map((energy, index) => (
                <p key={index} className="text-cosmic-secondary mb-2">{energy}</p>
              ))}
              <div className="bg-cosmic-dark/50 p-3 rounded-lg mt-3">
                <p className="text-cosmic-text font-medium">Задачи: {description.ancestralLines.feminine.tasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Money Channel */}
      {description.moneyChannel && (
        <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
          <CardHeader>
            <CardTitle className="text-cosmic-accent flex items-center gap-2">
              <span className="text-2xl">💰</span>
              {description.moneyChannel.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-cosmic-text">{description.moneyChannel.description}</p>
            <div className="bg-cosmic-dark/50 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Рекомендации:</h4>
              <p className="text-cosmic-secondary">{description.moneyChannel.recommendations}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relationship Channel */}
      {description.relationshipChannel && (
        <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
          <CardHeader>
            <CardTitle className="text-cosmic-accent flex items-center gap-2">
              <span className="text-2xl">💕</span>
              {description.relationshipChannel.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-cosmic-text">{description.relationshipChannel.description}</p>
            <div className="border-l-4 border-cosmic-accent/50 pl-4">
              <h4 className="font-semibold text-white mb-2">Идеальный партнёр:</h4>
              <p className="text-cosmic-secondary">{description.relationshipChannel.idealPartner}</p>
            </div>
            <div className="border-l-4 border-cosmic-accent/50 pl-4">
              <h4 className="font-semibold text-white mb-2">Вызовы:</h4>
              <p className="text-cosmic-secondary">{description.relationshipChannel.challenges}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chakras */}
      {description.chakras && description.chakras.length > 0 && (
        <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
          <CardHeader>
            <CardTitle className="text-cosmic-accent flex items-center gap-2">
              <span className="text-2xl">🌈</span>
              Анализ чакр
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {description.chakras.map((chakra, index) => (
              <div key={index} className="border-l-4 border-cosmic-accent/50 pl-4">
                <h4 className="font-semibold text-white mb-2">
                  {chakra.name} - Число {chakra.number}
                </h4>
                <p className="text-cosmic-secondary mb-2">{chakra.description}</p>
                <div className="bg-cosmic-dark/50 p-3 rounded-lg">
                  <p className="text-cosmic-text text-sm font-medium">Рекомендации: {chakra.recommendations}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Age Lines */}
      {description.ageLines && description.ageLines.length > 0 && (
        <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
          <CardHeader>
            <CardTitle className="text-cosmic-accent flex items-center gap-2">
              <span className="text-2xl">⏳</span>
              Возрастные периоды
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {description.ageLines.map((ageLine, index) => (
              <div key={index} className="border-l-4 border-cosmic-accent/50 pl-4">
                <h4 className="font-semibold text-white mb-2">{ageLine.period}</h4>
                <p className="text-cosmic-secondary mb-2">{ageLine.description}</p>
                <div className="bg-cosmic-dark/50 p-3 rounded-lg">
                  <p className="text-cosmic-text text-sm font-medium">Рекомендации: {ageLine.recommendations}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* General Conclusion */}
      {description.generalConclusion && (
        <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
          <CardHeader>
            <CardTitle className="text-cosmic-accent flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Общие выводы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {description.generalConclusion.personalProfile && (
              <div>
                <h4 className="font-semibold text-white mb-2">Личностный профиль:</h4>
                <p className="text-cosmic-text leading-relaxed">{description.generalConclusion.personalProfile}</p>
              </div>
            )}
            
            {description.generalConclusion.lifeTasks && (
              <div>
                <h4 className="font-semibold text-white mb-2">Жизненные задачи:</h4>
                <p className="text-cosmic-text leading-relaxed">{description.generalConclusion.lifeTasks}</p>
              </div>
            )}
            
            {description.generalConclusion.potentialRealization && (
              <div>
                <h4 className="font-semibold text-white mb-2">Пути реализации потенциала:</h4>
                <p className="text-cosmic-text leading-relaxed">{description.generalConclusion.potentialRealization}</p>
              </div>
            )}
            
            {description.generalConclusion.finalRecommendations && (
              <div className="bg-cosmic-dark/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Итоговые рекомендации:</h4>
                <p className="text-cosmic-text leading-relaxed">{description.generalConclusion.finalRecommendations}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};