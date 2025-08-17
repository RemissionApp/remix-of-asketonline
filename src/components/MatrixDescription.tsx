import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FullDestinyMatrixData } from '@/utils/numerologyUtils';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { NumerologyDiagnostic } from './NumerologyDiagnostic';
import { FallbackMatrixDescription } from './FallbackMatrixDescription';

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
  const [showFallback, setShowFallback] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrGenerateDescription();
    }, 1000); // Delay to show fallback first
    
    return () => clearTimeout(timer);
  }, [matrixData, birthDate, name, language]);

  const loadOrGenerateDescription = async () => {
    console.log('🔄 MatrixDescription: Начинаем загрузку/генерацию описания');
    console.log('📊 MatrixData:', matrixData);
    console.log('👤 UserProfile:', userProfile);
    console.log('📅 BirthDate:', birthDate);
    console.log('👨 Name:', name);
    console.log('🌍 Language:', language);

    if (!userProfile?.id) {
      console.log('❌ MatrixDescription: Нет userProfile.id');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('⏳ MatrixDescription: Начинаем процесс загрузки');

      // First, save or get the numerology reading
      console.log('💾 MatrixDescription: Сохраняем/получаем numerology reading');
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
        console.error('❌ MatrixDescription: Ошибка сохранения reading:', readingError);
        throw readingError;
      }

      console.log('✅ MatrixDescription: Reading создан/получен:', reading);

      // Try to get existing description
      console.log('🔍 MatrixDescription: Ищем существующее описание');
      const { data: existingDescription, error: descError } = await supabase
        .from('numerology_descriptions')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('reading_id', reading.id)
        .eq('language', language)
        .maybeSingle();

      if (descError) {
        console.error('❌ MatrixDescription: Ошибка поиска описания:', descError);
      }

      console.log('🔍 MatrixDescription: Результат поиска описания:', existingDescription);

      if (existingDescription) {
        console.log('✅ MatrixDescription: Найдено существующее описание');
        setDescription(existingDescription.description_data);
        setShowFallback(false);
        setLoading(false);
        return;
      }

      console.log('📝 MatrixDescription: Существующего описания нет, генерируем новое');
      // Generate new description
      await generateDescription(reading.id);

    } catch (error) {
      console.error('❌ MatrixDescription: Общая ошибка:', error);
      setLoading(false);
      toast.error('Ошибка при загрузке описания матрицы');
    }
  };

  const generateDescription = async (readingId: string) => {
    console.log('🤖 MatrixDescription: Начинаем генерацию описания');
    console.log('🆔 ReadingId:', readingId);
    
    if (!userProfile?.id) {
      console.log('❌ MatrixDescription: Нет userProfile.id для генерации');
      return;
    }

    try {
      setGenerating(true);
      console.log('⚡ MatrixDescription: Вызываем Edge функцию generate-numerology-description');

      const requestBody = {
        matrixData,
        userId: userProfile.id,
        readingId,
        language
      };
      
      console.log('📤 MatrixDescription: Отправляем данные:', requestBody);

      const { data, error } = await supabase.functions.invoke('generate-numerology-description', {
        body: requestBody
      });

      console.log('📥 MatrixDescription: Ответ Edge функции - data:', data);
      console.log('📥 MatrixDescription: Ответ Edge функции - error:', error);

      if (error) {
        console.error('❌ MatrixDescription: Ошибка от Edge функции:', error);
        throw error;
      }

      if (!data?.description) {
        console.error('❌ MatrixDescription: Нет описания в ответе:', data);
        throw new Error('Нет описания в ответе Edge функции');
      }

      console.log('✅ MatrixDescription: Описание получено успешно');
      setDescription(data.description);
      setShowFallback(false);
      toast.success('Описание матрицы успешно создано');

    } catch (error) {
      console.error('❌ MatrixDescription: Ошибка генерации:', error);
      setRetryCount(prev => prev + 1);
      
      if (retryCount < 2) {
        toast.error(`Попытка ${retryCount + 1}/3 не удалась. Повторяем...`);
        setTimeout(() => generateDescription(readingId), 2000);
      } else {
        toast.error(`Не удалось создать описание. Показываем базовую версию.`);
        setShowFallback(true);
      }
    } finally {
      setGenerating(false);
      setLoading(false);
      console.log('🏁 MatrixDescription: Завершили генерацию');
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

  // Show fallback description immediately while loading
  if (showFallback && !description) {
    return (
      <div className="space-y-6">
        <NumerologyDiagnostic 
          matrixData={matrixData}
          birthDate={birthDate}
          name={name}
          language={language}
        />
        
        <FallbackMatrixDescription 
          matrixData={matrixData}
          name={name}
        />
        
        {loading && (
          <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
            <CardContent className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-6 h-6 animate-spin text-cosmic-accent" />
                <p className="text-cosmic-secondary text-sm">
                  {generating ? 
                    `Создаём детальное описание... (попытка ${retryCount + 1})` : 
                    'Подключаемся к системе анализа...'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (!description && !showFallback) {
    return (
      <div className="space-y-4">
        <NumerologyDiagnostic 
          matrixData={matrixData}
          birthDate={birthDate}
          name={name}
          language={language}
        />
        
        <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
              <p className="text-cosmic-secondary text-center">
                Не удалось загрузить полное описание матрицы.
              </p>
              <div className="flex gap-2">
                <Button onClick={loadOrGenerateDescription} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Попробовать снова
                </Button>
                <Button onClick={() => setShowFallback(true)} variant="secondary" size="sm">
                  Показать базовое описание
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success indicator and regenerate button */}
      <Card className="bg-gradient-to-r from-green-500/20 to-cosmic-accent/20 border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-white font-medium">Детальное описание готово!</p>
            </div>
            <Button 
              onClick={handleRegenerate} 
              variant="ghost" 
              size="sm"
              disabled={generating}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Обновить
            </Button>
          </div>
        </CardContent>
      </Card>

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