import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FullDestinyMatrixData } from '@/utils/numerologyUtils';
import { Sparkles, Heart, DollarSign, Crown, Lightbulb } from 'lucide-react';

interface FallbackMatrixDescriptionProps {
  matrixData: FullDestinyMatrixData;
  name: string;
}

export const FallbackMatrixDescription: React.FC<FallbackMatrixDescriptionProps> = ({
  matrixData,
  name
}) => {
  // Generate instant descriptions based on matrix numbers
  const getInstantDescription = (number: number) => {
    const descriptions: { [key: number]: string } = {
      1: "Энергия лидерства и новых начинаний. Вы прирожденный первопроходец.",
      2: "Энергия сотрудничества и дипломатии. Вы миротворец и объединитель.",
      3: "Энергия творчества и самовыражения. Вы вдохновляете других своим оптимизмом.",
      4: "Энергия стабильности и практичности. Вы строите прочный фундамент.",
      5: "Энергия свободы и перемен. Вы жаждете приключений и новых впечатлений.",
      6: "Энергия заботы и служения. Вы создаете гармонию в отношениях.",
      7: "Энергия мудрости и духовности. Вы ищете глубокие истины.",
      8: "Энергия материального успеха. Вы обладаете организаторскими способностями.",
      9: "Энергия служения человечеству. Вы несете свет миру.",
      11: "Мастерское число интуиции. Вы обладаете экстрасенсорными способностями.",
      22: "Мастерское число созидателя. Вы можете воплотить грандиозные планы."
    };
    return descriptions[number] || "Уникальная энергия, требующая особого изучения.";
  };

  const getLifeAdvice = (centralEnergy: number) => {
    const advice: { [key: number]: string } = {
      1: "Не бойтесь быть первым. Ваша инициативность - ключ к успеху.",
      2: "Развивайте дипломатические навыки. Сотрудничество принесет больше, чем конкуренция.",
      3: "Выражайте себя творчески. Ваш оптимизм заразителен.",
      4: "Создавайте систему и порядок. Ваша практичность - основа стабильности.",
      5: "Принимайте изменения как возможности. Свобода - ваш главный приоритет.",
      6: "Заботьтесь о близких, но не забывайте о себе. Баланс - ваша сила.",
      7: "Развивайте интуицию и духовность. Уединение поможет найти ответы.",
      8: "Используйте организаторские способности для достижения материального успеха.",
      9: "Служите высшей цели. Ваша миссия - помогать другим расти.",
      11: "Доверяйте интуиции. Ваши предчувствия обычно верны.",
      22: "Воплощайте масштабные идеи. У вас есть сила изменить мир."
    };
    return advice[centralEnergy] || "Изучайте свою уникальную энергию и следуйте внутреннему голосу.";
  };

  return (
    <div className="space-y-4">
      {/* Header with notification */}
      <Card className="bg-gradient-to-r from-cosmic-accent/20 to-cosmic-secondary/20 border-cosmic-accent/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-cosmic-accent animate-pulse" />
            <div>
              <p className="text-white font-medium">Базовый анализ готов!</p>
              <p className="text-cosmic-secondary text-sm">
                Детальное описание генерируется... Это займет немного времени.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Central Energy - Quick Analysis */}
      <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
        <CardHeader>
          <CardTitle className="text-cosmic-accent flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Ваша центральная энергия: {matrixData.destinyCenter}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-cosmic-text mb-4">
            {getInstantDescription(matrixData.destinyCenter)}
          </p>
          <div className="bg-cosmic-dark/50 p-3 rounded-lg">
            <p className="text-cosmic-secondary text-sm">
              <strong>Совет дня:</strong> {getLifeAdvice(matrixData.destinyCenter)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Summary */}
      <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
        <CardHeader>
          <CardTitle className="text-cosmic-accent flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Личностный профиль для {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-cosmic-accent/20 flex items-center justify-center mx-auto mb-2">
                <span className="text-cosmic-accent font-bold">{matrixData.chakras[0]?.number || 1}</span>
              </div>
              <p className="text-cosmic-secondary text-sm">Духовность</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-cosmic-accent/20 flex items-center justify-center mx-auto mb-2">
                <span className="text-cosmic-accent font-bold">{matrixData.chakras[4]?.number || 1}</span>
              </div>
              <p className="text-cosmic-secondary text-sm">Материальное</p>
            </div>
          </div>
          
          <p className="text-cosmic-text">
            Ваша числовая формула говорит о том, что вы обладаете уникальным сочетанием 
            энергий {matrixData.destinyCenter}, {matrixData.chakras[0]?.number || 1} и {matrixData.chakras[4]?.number || 1}. 
            Это делает вас особенным и наделяет определенными талантами.
          </p>
        </CardContent>
      </Card>

      {/* Quick Guidance */}
      <Card className="bg-cosmic-dark/80 backdrop-blur-sm border-cosmic-accent/30">
        <CardHeader>
          <CardTitle className="text-cosmic-accent flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Быстрые рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-cosmic-accent mt-1" />
            <div>
              <p className="text-white font-medium">Финансы</p>
              <p className="text-cosmic-secondary text-sm">
                Ваши денежные энергии {matrixData.moneyChannel.join(', ')} указывают на 
                {matrixData.moneyChannel.reduce((a, b) => a + b, 0) > 15 ? 
                  ' высокий потенциал в бизнесе и инвестициях' : 
                  ' важность стабильности и постепенного накопления'}.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-cosmic-accent mt-1" />
            <div>
              <p className="text-white font-medium">Отношения</p>
              <p className="text-cosmic-secondary text-sm">
                Энергии {matrixData.relationshipChannel.join(', ')} в канале любви показывают 
                {matrixData.relationshipChannel.reduce((a, b) => a + b, 0) > 20 ? 
                  ' страстную и глубокую натуру в отношениях' : 
                  ' потребность в гармонии и взаимопонимании'}.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading indicator for full description */}
      <Card className="bg-cosmic-dark/50 border-cosmic-accent/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-cosmic-accent border-t-transparent"></div>
            <p className="text-cosmic-secondary">
              Создаем детальное описание вашей матрицы судьбы...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};