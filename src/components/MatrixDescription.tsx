import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FullDestinyMatrixData, getNumerologyMeaning } from '@/utils/numerologyUtils';

interface MatrixDescriptionProps {
  matrixData: FullDestinyMatrixData;
  birthDate: string;
  name: string;
  language: string;
}

export const MatrixDescription: React.FC<MatrixDescriptionProps> = ({
  matrixData,
  birthDate,
  name,
  language
}) => {
  const getChakraName = (chakra: string) => {
    const names = {
      crown: language === 'ru' ? 'Сахасрара (Коронная)' : 'Sahasrara (Crown)',
      throat: language === 'ru' ? 'Вишуддха (Горловая)' : 'Vishuddha (Throat)',
      heart: language === 'ru' ? 'Анахата (Сердечная)' : 'Anahata (Heart)',
      root: language === 'ru' ? 'Муладхара (Корневая)' : 'Muladhara (Root)',
      thirdEye: language === 'ru' ? 'Аджна (Третий глаз)' : 'Ajna (Third Eye)',
      solar: language === 'ru' ? 'Манипура (Солнечное сплетение)' : 'Manipura (Solar Plexus)',
      sacral: language === 'ru' ? 'Свадхистана (Сакральная)' : 'Svadhisthana (Sacral)',
      additional: language === 'ru' ? 'Дополнительная энергия' : 'Additional Energy'
    };
    return names[chakra as keyof typeof names] || chakra;
  };

  const getPersonalityAnalysis = () => {
    const centerNum = matrixData.destinyCenter;
    const meaning = getNumerologyMeaning(centerNum, language);
    
    if (language === 'ru') {
      return {
        title: 'Анализ личности',
        content: `Ваша центральная энергия ${centerNum} говорит о том, что вы - ${meaning.title.ru.toLowerCase()}. ${meaning.description.ru}. Это число определяет вашу жизненную миссию и основные качества характера.`
      };
    }
    
    return {
      title: 'Personality Analysis',
      content: `Your central energy ${centerNum} indicates that you are ${meaning.title.en.toLowerCase()}. ${meaning.description.en}. This number defines your life mission and core character traits.`
    };
  };

  const getChakraAnalysis = () => {
    if (language === 'ru') {
      return {
        title: 'Энергетические центры (Чакры)',
        description: 'Каждая чакра представляет определенный аспект вашей жизни и энергетического состояния:'
      };
    }
    
    return {
      title: 'Energy Centers (Chakras)',
      description: 'Each chakra represents a specific aspect of your life and energetic state:'
    };
  };

  const getChannelAnalysis = () => {
    if (language === 'ru') {
      return {
        title: 'Каналы жизни',
        relationship: 'Канал отношений показывает, как вы строите связи с людьми и какие уроки получаете через партнерство.',
        money: 'Денежный канал раскрывает ваше отношение к материальным ценностям и способы достижения финансовой стабильности.'
      };
    }
    
    return {
      title: 'Life Channels',
      relationship: 'The relationship channel shows how you build connections with people and what lessons you learn through partnership.',
      money: 'The money channel reveals your attitude towards material values and ways to achieve financial stability.'
    };
  };

  const getConclusions = () => {
    const centerNum = matrixData.destinyCenter;
    const strongChakras = matrixData.chakras.filter(c => c.number >= 7);
    const challenges = matrixData.chakras.filter(c => c.number <= 3);
    
    if (language === 'ru') {
      return {
        title: 'Общие выводы и рекомендации',
        strengths: `Ваши сильные стороны связаны с энергией числа ${centerNum}. ${strongChakras.length > 0 ? `Особенно развиты энергии в ${strongChakras.length} чакрах.` : ''}`,
        challenges: `Области для развития: ${challenges.length > 0 ? `${challenges.length} энергетических центров требуют внимания и проработки.` : 'Энергетическая система в целом сбалансирована.'}`,
        advice: 'Рекомендуется медитировать на свой центральный номер, развивать интуицию и прислушиваться к внутреннему голосу при принятии важных решений.'
      };
    }
    
    return {
      title: 'General Conclusions and Recommendations',
      strengths: `Your strengths are connected to the energy of number ${centerNum}. ${strongChakras.length > 0 ? `Especially developed energies in ${strongChakras.length} chakras.` : ''}`,
      challenges: `Areas for development: ${challenges.length > 0 ? `${challenges.length} energy centers require attention and work.` : 'The energy system is generally balanced.'}`,
      advice: 'It is recommended to meditate on your central number, develop intuition and listen to your inner voice when making important decisions.'
    };
  };

  const personalityAnalysis = getPersonalityAnalysis();
  const chakraAnalysis = getChakraAnalysis();
  const channelAnalysis = getChannelAnalysis();
  const conclusions = getConclusions();

  return (
    <div className="space-y-6 mt-8">
      {/* Personality Analysis */}
      <Card className="bg-cosmic-dark/50 border-cosmic-accent/20">
        <CardHeader>
          <CardTitle className="text-cosmic-accent text-lg flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-accent to-purple-500 flex items-center justify-center mr-3 text-white font-bold text-sm">
              {matrixData.destinyCenter}
            </div>
            {personalityAnalysis.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-cosmic-secondary leading-relaxed">
            {personalityAnalysis.content}
          </p>
        </CardContent>
      </Card>

      {/* Chakra Analysis */}
      <Card className="bg-cosmic-dark/50 border-cosmic-accent/20">
        <CardHeader>
          <CardTitle className="text-cosmic-accent text-lg">
            {chakraAnalysis.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-cosmic-secondary">
            {chakraAnalysis.description}
          </p>
          <div className="grid grid-cols-1 gap-3">
            {matrixData.chakras.slice(0, 7).map((chakra, index) => {
              const meaning = getNumerologyMeaning(chakra.number, language);
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-cosmic/20 border border-cosmic-accent/10">
                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3"
                      style={{ backgroundColor: chakra.color }}
                    >
                      {chakra.number}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {getChakraName(chakra.chakra)}
                      </p>
                      <p className="text-cosmic-secondary text-xs">
                        {meaning.title[language as keyof typeof meaning.title]}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {chakra.number >= 7 ? (language === 'ru' ? 'Сильная' : 'Strong') : 
                     chakra.number <= 3 ? (language === 'ru' ? 'Развивать' : 'Develop') : 
                     (language === 'ru' ? 'Сбалансированная' : 'Balanced')}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Channels Analysis */}
      <Card className="bg-cosmic-dark/50 border-cosmic-accent/20">
        <CardHeader>
          <CardTitle className="text-cosmic-accent text-lg">
            {channelAnalysis.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
            <h4 className="text-pink-400 font-medium mb-2 flex items-center">
              <div className="w-4 h-4 rounded bg-pink-500 mr-2"></div>
              {language === 'ru' ? 'Канал отношений' : 'Relationship Channel'}
            </h4>
            <p className="text-cosmic-secondary text-sm">
              {channelAnalysis.relationship}
            </p>
            <div className="flex gap-2 mt-2">
              {matrixData.relationshipChannel.map((num, i) => (
                <Badge key={i} variant="outline" className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                  {num}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <h4 className="text-cyan-400 font-medium mb-2 flex items-center">
              <div className="w-4 h-4 rounded bg-cyan-500 mr-2"></div>
              {language === 'ru' ? 'Денежный канал' : 'Money Channel'}
            </h4>
            <p className="text-cosmic-secondary text-sm">
              {channelAnalysis.money}
            </p>
            <div className="flex gap-2 mt-2">
              {matrixData.moneyChannel.map((num, i) => (
                <Badge key={i} variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                  {num}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conclusions */}
      <Card className="bg-gradient-to-br from-cosmic-dark/80 to-purple-900/20 border-cosmic-accent/30">
        <CardHeader>
          <CardTitle className="text-cosmic-accent text-lg">
            {conclusions.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="text-green-400 font-medium mb-1 text-sm">
                {language === 'ru' ? '✨ Сильные стороны:' : '✨ Strengths:'}
              </h4>
              <p className="text-cosmic-secondary text-sm">
                {conclusions.strengths}
              </p>
            </div>
            
            <Separator className="bg-cosmic-accent/20" />
            
            <div>
              <h4 className="text-yellow-400 font-medium mb-1 text-sm">
                {language === 'ru' ? '🎯 Области развития:' : '🎯 Development Areas:'}
              </h4>
              <p className="text-cosmic-secondary text-sm">
                {conclusions.challenges}
              </p>
            </div>
            
            <Separator className="bg-cosmic-accent/20" />
            
            <div>
              <h4 className="text-blue-400 font-medium mb-1 text-sm">
                {language === 'ru' ? '💡 Рекомендации:' : '💡 Recommendations:'}
              </h4>
              <p className="text-cosmic-secondary text-sm">
                {conclusions.advice}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};