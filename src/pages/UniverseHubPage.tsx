import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageCircleQuestion } from 'lucide-react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { useCallMinutes } from '@/hooks/useCallMinutes';
import { supabase } from '@/integrations/supabase/client';

const titles = { ru: 'Вселенная', en: 'Lyra', es: 'Lyra' };

const UniverseHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const lang = (language as keyof typeof titles) ?? 'ru';

  const callTitle = lang === 'ru' ? 'Позвонить Вселенной' : lang === 'es' ? 'Llamar a Lyra' : 'Call Lyra';
  const callSub =
    lang === 'ru' ? 'Высший разум всегда слышит тебя'
      : lang === 'es' ? 'La sabiduría siempre te escucha'
      : 'The higher mind always hears you';
  const askTitle =
    lang === 'ru' ? 'Задать вопрос Вселенной'
      : lang === 'es' ? 'Hacer una pregunta a Lyra'
      : 'Ask Lyra a question';
  const askSub =
    lang === 'ru' ? 'Получите ясный ответ и направление прямо сейчас'
      : lang === 'es' ? 'Recibe una respuesta clara y una dirección ahora'
      : 'Receive a clear answer and direction right now';

  const { user } = useAppStore();
  const { minutesUsed, minutesLimit, minutesLeft } = useCallMinutes();
  const [history, setHistory] = useState<Array<{ id: string; called_at: string; duration_seconds: number | null; summary: string | null }>>([]);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('call_summaries')
      .select('id, called_at, duration_seconds, summary')
      .eq('user_id', user.id)
      .order('called_at', { ascending: false })
      .limit(5)
      .then(({ data }) => setHistory(data ?? []));
  }, [user?.id]);

  const labels = {
    history: { ru: 'Последние разговоры', en: 'Recent conversations', es: 'Conversaciones recientes' }[lang],
    empty:   { ru: 'Твой первый разговор с Вселенной изменит многое',
               en: 'Your first conversation with Lyra will change everything',
               es: 'Tu primera conversación con Lyra lo cambiará todo' }[lang],
    minutes: { ru: 'Минуты этого месяца', en: 'Minutes this month', es: 'Minutos este mes' }[lang],
    left:    { ru: 'осталось', en: 'left', es: 'restantes' }[lang],
    min:     { ru: 'мин', en: 'min', es: 'min' }[lang],
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(
      lang === 'ru' ? 'ru-RU' : lang === 'es' ? 'es-ES' : 'en-US',
      { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
    );

  return (
    <MobileOptimizedInterface>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-24">
        <StarField />
        <PageHeader title={titles[lang] ?? titles.ru} />
        <div className="flex-1 relative z-10 px-3 pt-20 sm:px-4 max-w-lg mx-auto w-full flex flex-col gap-3 sm:gap-4">
          <GlassCard icon={Phone}                  variant="purple" title={callTitle} subtitle={callSub} onClick={() => navigate('/universe-call')} />
          <GlassCard icon={MessageCircleQuestion} variant="gold"   title={askTitle}  subtitle={askSub}  onClick={() => navigate('/universe')} />

          {/* Monthly minutes */}
          <div className="glass relative rounded-2xl p-4 overflow-hidden">
            <div className="flex justify-between text-xs text-white/55 mb-2">
              <span>{labels.minutes}</span>
              <span>{minutesLeft} {labels.min} {labels.left}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-cosmic-gold/80 rounded-full"
                style={{ width: `${Math.min(100, (minutesUsed / Math.max(1, minutesLimit)) * 100)}%` }}
              />
            </div>
          </div>

          {/* History */}
          <div className="mt-2">
            <div className="text-xs text-white/40 uppercase tracking-widest mb-3 px-1">
              {labels.history}
            </div>
            {history.length === 0 ? (
              <div className="glass relative rounded-2xl p-8 flex flex-col items-center gap-3 overflow-hidden">
                <div className="text-3xl opacity-40">🌌</div>
                <div className="text-sm text-white/45 text-center max-w-xs">{labels.empty}</div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {history.map(call => (
                  <div key={call.id} className="glass relative rounded-2xl p-4 overflow-hidden">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs text-white/55">{formatDate(call.called_at)}</div>
                      <div className="text-xs text-white/35">
                        {Math.max(1, Math.round((call.duration_seconds ?? 0) / 60))} {labels.min}
                      </div>
                    </div>
                    {call.summary && (
                      <div className="text-sm text-white/75 leading-relaxed line-clamp-3">{call.summary}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <BottomNavigation />
        </div>
      </div>
    </MobileOptimizedInterface>
  );
};

export default UniverseHubPage;
