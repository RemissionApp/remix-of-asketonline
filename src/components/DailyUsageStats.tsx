import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LimitIndicator } from '@/components/ui/LimitIndicator';
import { useDailyLimits } from '@/hooks/useDailyLimits';
import { useAppStore } from '@/store/useAppStore';
import { Calendar, TrendingUp } from 'lucide-react';

export const DailyUsageStats: React.FC = () => {
  const { limits, loading } = useDailyLimits();
  const { language } = useAppStore();

  const getText = () => {
    switch (language) {
      case 'ru':
        return {
          title: 'Дневная активность',
          questions: 'Вопросы Вселенной',
          calls: 'Голосовые звонки',
          meditations: 'Медитации',
          missions: 'Космические миссии',
          pacts: 'Аскезы'
        };
      case 'es':
        return {
          title: 'Actividad diaria',
          questions: 'Preguntas del Universo',
          calls: 'Llamadas de voz',
          meditations: 'Meditaciones',
          missions: 'Misiones cósmicas',
          pacts: 'Ascetismos'
        };
      default:
        return {
          title: 'Daily Activity',
          questions: 'Universe Questions',
          calls: 'Voice Calls',
          meditations: 'Meditations',
          missions: 'Cosmic Missions',
          pacts: 'Asceticisms'
        };
    }
  };

  const text = getText();

  if (loading || !limits) {
    return (
      <Card className="border-cosmic-accent/30 bg-cosmic-dark/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-cosmic-text flex items-center gap-2">
            <Calendar size={20} />
            {text.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-cosmic-accent/20 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-cosmic-accent/30 bg-cosmic-dark/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-cosmic-text flex items-center gap-2">
          <TrendingUp size={20} />
          {text.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LimitIndicator
          used={limits.universe_questions.used}
          limit={limits.universe_questions.limit}
          label={text.questions}
          isPro={limits.isPro}
        />
        
        <LimitIndicator
          used={limits.voice_calls.used}
          limit={limits.voice_calls.limit}
          label={text.calls}
          isPro={limits.isPro}
        />
        
        <LimitIndicator
          used={limits.meditations.used}
          limit={limits.meditations.limit}
          label={text.meditations}
          isPro={limits.isPro}
        />
        
        <LimitIndicator
          used={limits.cosmic_missions.used}
          limit={limits.cosmic_missions.limit}
          label={text.missions}
          isPro={limits.isPro}
        />
        
        <LimitIndicator
          used={limits.pacts.used}
          limit={limits.pacts.limit}
          label={text.pacts}
          isPro={limits.isPro}
        />
      </CardContent>
    </Card>
  );
};