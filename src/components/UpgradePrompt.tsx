import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Sparkles, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  feature: string;
  currentUsage?: string;
  className?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  currentUsage,
  className = ""
}) => {
  const { language } = useAppStore();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/pro-features');
  };

  const getText = () => {
    switch (language) {
      case 'ru':
        return {
          title: 'Улучшите до PRO',
          description: `Вы достигли дневного лимита для ${feature}. Получите неограниченный доступ с PRO подпиской.`,
          usage: currentUsage ? `Использовано: ${currentUsage}` : '',
          features: [
            'До 3 вопросов Вселенной в день',
            'Безлимитные голосовые звонки',
            'Безлимитные медитации',
            'До 5 активных аскез',
            'Полная нумерология с AI'
          ],
          cta: 'Обновить до PRO'
        };
      case 'es':
        return {
          title: 'Actualizar a PRO',
          description: `Has alcanzado el límite diario para ${feature}. Obtén acceso ilimitado con la suscripción PRO.`,
          usage: currentUsage ? `Usado: ${currentUsage}` : '',
          features: [
            'Hasta 3 preguntas del Universo por día',
            'Llamadas de voz ilimitadas',
            'Meditaciones ilimitadas',
            'Hasta 5 ascetismos activos',
            'Numerología completa con AI'
          ],
          cta: 'Actualizar a PRO'
        };
      default:
        return {
          title: 'Upgrade to PRO',
          description: `You've reached the daily limit for ${feature}. Get unlimited access with PRO subscription.`,
          usage: currentUsage ? `Used: ${currentUsage}` : '',
          features: [
            'Up to 3 Universe questions per day',
            'Unlimited voice calls',
            'Unlimited meditations',
            'Up to 5 active asceticisms',
            'Full numerology with AI'
          ],
          cta: 'Upgrade to PRO'
        };
    }
  };

  const text = getText();

  return (
    <Card className={`border-cosmic-accent/30 bg-cosmic-dark/50 backdrop-blur ${className}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Crown className="h-12 w-12 text-cosmic-gold" />
            <Sparkles className="h-4 w-4 text-cosmic-gold absolute -top-1 -right-1" />
          </div>
        </div>
        <CardTitle className="text-cosmic-gold flex items-center justify-center gap-2">
          <Zap size={20} />
          {text.title}
        </CardTitle>
        <CardDescription className="text-cosmic-secondary">
          {text.description}
        </CardDescription>
        {text.usage && (
          <p className="text-sm text-cosmic-accent">{text.usage}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-cosmic-text">PRO включает:</h4>
          <ul className="space-y-1">
            {text.features.map((feature, index) => (
              <li key={index} className="text-sm text-cosmic-secondary flex items-center gap-2">
                <Sparkles size={12} className="text-cosmic-gold flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <Button 
          onClick={handleUpgrade}
          className="w-full bg-cosmic-gold hover:bg-cosmic-gold/90 text-cosmic-dark font-semibold"
        >
          <Crown size={16} className="mr-2" />
          {text.cta}
        </Button>
      </CardContent>
    </Card>
  );
};