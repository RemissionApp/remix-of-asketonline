import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageCircleQuestion } from 'lucide-react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAppStore } from '@/store/useAppStore';
import { RecentCallsBlock } from '@/components/universe/RecentCallsBlock';
import { RecentQuestionsBlock } from '@/components/universe/RecentQuestionsBlock';

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

  return (
    <MobileOptimizedInterface>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-24">
        <StarField />
        <PageHeader title={titles[lang] ?? titles.ru} />
        <div className="flex-1 relative z-10 px-3 pt-20 sm:px-4 max-w-lg mx-auto w-full flex flex-col gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/universe-call')}
            className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-cosmic-accent/25 bg-gradient-to-br from-cosmic-indigo/40 via-cosmic-dark/60 to-cosmic-accent/30 p-5 text-left shadow-lg shadow-cosmic-accent/30 transition-transform active:scale-[0.99]"
          >
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-indigo shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                <span className="absolute inset-0 rounded-full bg-cosmic-accent/40 animate-ping" />
                <Phone className="relative h-7 w-7 text-white" />
              </div>
              <div className="flex-1 min-w-0 text-center">
                <div className={`text-base font-semibold text-white ${lang === 'en' ? 'font-serif' : ''}`}>{callTitle}</div>
                <div className="mt-0.5 text-xs text-cosmic-secondary">{callSub}</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/universe')}
            className="group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-cosmic-gold/25 bg-gradient-to-br from-cosmic-gold/25 via-cosmic-dark/60 to-cosmic-accent/15 p-5 text-left shadow-lg shadow-cosmic-gold/25 transition-transform active:scale-[0.99]"
          >
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-gold to-cosmic-accent/60 shadow-[0_0_30px_rgba(232,193,108,0.5)]">
                <MessageCircleQuestion className="relative h-7 w-7 text-white" />
              </div>
              <div className="flex-1 min-w-0 text-center">
                <div className={`text-base font-semibold text-white ${lang === 'en' ? 'font-serif' : ''}`}>{askTitle}</div>
                <div className="mt-0.5 text-xs text-cosmic-secondary">{askSub}</div>
              </div>
            </div>
          </button>

          <RecentCallsBlock />
          <RecentQuestionsBlock />
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <BottomNavigation />
        </div>
      </div>
    </MobileOptimizedInterface>
  );
};

export default UniverseHubPage;
