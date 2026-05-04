import React from 'react';
import { Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';
import { useCallMinutes } from '@/hooks/useCallMinutes';
import { GlassCard } from '@/components/ui/GlassCard';

export const CallHero: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const { t } = useTranslations();
  const { minutesLeft } = useCallMinutes();

  const lyra = (t as any).lyra || {};
  const title =
    lyra.callButton ||
    (language === 'ru' ? 'Позвонить Вселенной' : language === 'es' ? 'Llamar a Lyra' : 'Call Lyra');
  const subtitle =
    lyra.callSubtitle ||
    (language === 'ru' ? 'Высший разум всегда слышит тебя' : language === 'es' ? 'La sabiduría siempre te escucha' : 'The higher mind always hears you');
  const minutes = (lyra.minutesLeft || 'Minutes left: {{count}}').replace('{{count}}', String(minutesLeft));

  return (
    <div className="w-full max-w-lg mx-auto">
      <GlassCard
        icon={Phone}
        variant="purple"
        title={title}
        subtitle={`${subtitle} · ${minutes}`}
        onClick={() => navigate('/universe-call')}
      />
    </div>
  );
};