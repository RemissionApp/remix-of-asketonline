import React, { useState } from 'react';
import { Plus, ScrollText, FileText, X, Trophy, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { PageHeader } from '@/components/ui/PageHeader';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';
import { BottomNavigation } from '@/components/BottomNavigation';
import { CountdownTimer } from '@/components/CountdownTimer';
import { CosmicButton } from '@/components/CosmicButton';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations, SupportedLanguage } from '@/hooks/useTranslations';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { BreakAscesisDialog } from '@/components/BreakAscesisDialog';
import type { Pact } from '@/types';

const titles = { ru: 'Аскезы', en: 'Ascesis', es: 'Ascesis' } as const;

const formatRejection = (rejection: string, language: string): string => {
  const map: Record<string, Record<string, string>> = {
    ru: { sugar: 'сахара', phone_after_22: 'телефона после 22:00', cigarettes: 'сигарет', procrastination: 'прокрастинации', social_media: 'социальных сетей', alcohol: 'алкоголя', junk_food: 'фастфуда' },
    en: { sugar: 'sugar', phone_after_22: 'phone after 10 PM', cigarettes: 'cigarettes', procrastination: 'procrastination', social_media: 'social media', alcohol: 'alcohol', junk_food: 'junk food' },
    es: { sugar: 'azúcar', phone_after_22: 'teléfono después de las 22:00', cigarettes: 'cigarrillos', procrastination: 'procrastinación', social_media: 'redes sociales', alcohol: 'alcohol', junk_food: 'comida rápida' },
  };
  const tr = map[language] || map.en;
  if (!rejection) return '';
  if (rejection.includes(',')) {
    return rejection.split(',').map(s => tr[s.trim()] || s.trim()).join(', ');
  }
  return tr[rejection] || rejection;
};

const getDaysWord = (n: number, lang: string) => {
  if (lang !== 'ru') return 'days';
  const d = n % 10, dd = n % 100;
  if (d === 1 && dd !== 11) return 'день';
  if ([2, 3, 4].includes(d) && !(dd >= 12 && dd <= 14)) return 'дня';
  return 'дней';
};

const getOathText = (pact: Pact, userName: string, language: string): string => {
  const rej = formatRejection(pact.title || '', language);
  const dur = pact.duration;
  const dw = getDaysWord(dur, language);
  const reward = pact.reward || '';
  if (language === 'ru') {
    return `Я, ${userName}, заявляю перед Вселенной, Землёй и Небом о своём намерении взять аскезу от ${rej} на ${dur} ${dw}.\n\nЯ осознанно отказываюсь от временного, чтобы открыть путь вечному.\n\nВсю освободившуюся энергию и плоды моей аскезы я направляю на исполнение моего желания (${reward}).\n\nВо благо себе, во благо миру. Да будет так. Благодарю. Благодарю. Благодарю.`;
  }
  if (language === 'es') {
    return `Yo, ${userName}, declaro ante el Universo, la Tierra y el Cielo mi intención de tomar ascesis de ${rej} durante ${dur} ${dw}.\n\nRenuncio conscientemente a lo temporal para abrir el camino a lo eterno.\n\nDirijo toda la energía liberada y los frutos de mi ascesis hacia el cumplimiento de mi deseo (${reward}).\n\nPor mi bien, por el bien del mundo. Que así sea. Gracias. Gracias. Gracias.`;
  }
  return `I, ${userName}, declare before the Universe, Earth, and Sky my intention to take ascesis from ${rej} for ${dur} ${dw}.\n\nI consciously reject the temporary to open the path to the eternal.\n\nI direct all the freed energy and fruits of my ascesis toward the fulfillment of my desire (${reward}).\n\nFor my good, for the good of the world. So be it. Thank you. Thank you. Thank you.`;
};

const PactsPage: React.FC = () => {
  const { pacts = [], language, userProfile, breakAscesis } = useAppStore();
  const navigate = useNavigate();
  const lang = (language as keyof typeof titles) ?? 'ru';

  const [oathPact, setOathPact] = useState<Pact | null>(null);
  const [breakPact, setBreakPact] = useState<Pact | null>(null);

  const tr = (ru: string, en: string, es: string) =>
    language === 'ru' ? ru : language === 'es' ? es : en;

  const sorted = [...pacts].sort((a, b) => {
    const pri = { active: 3, completed: 2, failed: 1 } as const;
    const pa = pri[a.status as keyof typeof pri] || 0;
    const pb = pri[b.status as keyof typeof pri] || 0;
    if (pa !== pb) return pb - pa;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleBreak = async (reason?: string) => {
    if (!breakPact || !breakAscesis) return;
    await breakAscesis(breakPact.id, reason);
    setBreakPact(null);
  };

  const renderCard = (pact: Pact) => {
    const completed = pact.days?.filter(d => d.completed).length || 0;
    const progress = Math.round((completed / pact.duration) * 100);
    const isActive = pact.status === 'active';
    const isFailed = pact.status === 'failed';
    const isCompleted = pact.status === 'completed';

    const statusBadge = isCompleted
      ? { Icon: Trophy, color: 'text-green-300', bg: 'bg-green-500/15', label: tr('Завершена', 'Completed', 'Completada') }
      : isFailed
        ? { Icon: AlertCircle, color: 'text-red-300', bg: 'bg-red-500/15', label: tr('Прервана', 'Broken', 'Rota') }
        : null;

    return (
      <div
        key={pact.id}
        className="rounded-3xl border border-cosmic-accent/25 bg-gradient-to-br from-cosmic-indigo/40 via-cosmic-dark/60 to-cosmic-accent/30 shadow-lg shadow-cosmic-accent/30 backdrop-blur-md p-4 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wider text-cosmic-secondary">
              {tr('Аскеза от', 'Ascesis from', 'Ascesis de')}
            </p>
            <h3 className="text-base sm:text-lg font-serif text-white truncate">
              {formatRejection(pact.title || '', language)}
            </h3>
          </div>
          {statusBadge && (
            <span className={cn('flex items-center gap-1 px-2 py-1 rounded-full text-[10px]', statusBadge.bg, statusBadge.color)}>
              <statusBadge.Icon size={12} />
              {statusBadge.label}
            </span>
          )}
        </div>

        {isActive && (
          <div className="mb-3">
            <CountdownTimer pactId={pact.id} />
          </div>
        )}

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-cosmic-secondary mb-1.5">
            <span>{tr('Прогресс', 'Progress', 'Progreso')}</span>
            <span className="text-white font-medium">
              {completed} / {pact.duration} {getDaysWord(pact.duration, language)}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                isFailed
                  ? 'bg-gradient-to-r from-red-500 to-red-400'
                  : isCompleted
                    ? 'bg-gradient-to-r from-green-400 to-cosmic-gold'
                    : 'bg-gradient-to-r from-cosmic-gold to-cosmic-accent'
              )}
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>

        {pact.reward && (
          <div className="mb-3 border-l-2 border-cosmic-gold/40 pl-3">
            <p className="text-[10px] uppercase tracking-wider text-cosmic-gold mb-0.5">
              {tr('Цель', 'Goal', 'Objetivo')}
            </p>
            <p className="text-xs text-cosmic-secondary leading-relaxed line-clamp-3">
              {pact.reward}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setOathPact(pact)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl border border-white/10 bg-cosmic-dark/40 text-cosmic-secondary hover:text-white hover:border-cosmic-accent/40 transition-colors text-xs"
          >
            <FileText size={14} />
            {tr('Клятва', 'Oath', 'Juramento')}
          </button>
          {isActive && (
            <button
              onClick={() => setBreakPact(pact)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors text-xs"
            >
              <X size={14} />
              {tr('Отменить', 'Break', 'Romper')}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <MobileOptimizedInterface>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-24">
        <StarField starCount={120} />
        <PageHeader title={titles[lang] ?? titles.ru} />

        <div className="flex-1 relative z-10 px-3 pt-20 sm:px-4 max-w-lg mx-auto w-full flex flex-col gap-3 sm:gap-4">
          {/* Create new ascesis CTA */}
          <button
            onClick={() => navigate('/create-pact')}
            className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cosmic-gold/20 via-cosmic-dark/60 to-cosmic-accent/20 p-4 text-left shadow-lg shadow-cosmic-gold/10 transition-transform active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-gold/80 to-cosmic-accent/60 shadow-[0_0_20px_rgba(232,193,108,0.3)]">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">
                  {tr('Создать новую аскезу', 'Create new ascesis', 'Crear nueva ascesis')}
                </div>
                <div className="text-[11px] text-cosmic-secondary">
                  {tr('Заключи договор со Вселенной', 'Make a covenant with the Universe', 'Haz un pacto con el Universo')}
                </div>
              </div>
            </div>
          </button>

          {sorted.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-cosmic-dark/40 backdrop-blur-md p-8 text-center">
              <ScrollText className="mx-auto mb-3 h-10 w-10 text-cosmic-secondary" />
              <p className="text-sm text-cosmic-secondary">
                {tr('Пока нет аскез', 'No ascesis yet', 'Aún no hay ascesis')}
              </p>
            </div>
          ) : (
            sorted.map(renderCard)
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <BottomNavigation />
        </div>

        {/* Oath viewer */}
        <Dialog open={!!oathPact} onOpenChange={o => !o && setOathPact(null)}>
          <DialogContent className="bg-cosmic-dark border-cosmic-accent/40 text-white max-w-md mx-2 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="cosmic-gradient-text text-lg font-serif">
                {tr('Клятва', 'The Oath', 'El Juramento')}
              </DialogTitle>
              <DialogDescription className="text-cosmic-secondary text-xs">
                {oathPact && formatRejection(oathPact.title || '', language)}
              </DialogDescription>
            </DialogHeader>
            <div className="my-2 p-4 bg-cosmic-dark/50 border border-cosmic-accent/30 rounded-2xl max-h-72 overflow-y-auto">
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {oathPact && getOathText(oathPact, userProfile?.name || '', language)}
              </p>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <div className="w-full flex items-center justify-center gap-2 rounded-2xl border border-green-500/40 bg-green-500/15 py-3 text-sm font-medium text-green-300">
                <CheckCircle2 size={16} />
                {tr('Подписана', 'Signed', 'Firmada')}
              </div>
              <button
                onClick={() => setOathPact(null)}
                className="w-full rounded-2xl border border-white/10 bg-cosmic-dark/40 py-2 text-xs text-cosmic-secondary hover:text-white hover:border-cosmic-accent/40 transition-colors"
              >
                {tr('Закрыть', 'Close', 'Cerrar')}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {breakPact && (
          <BreakAscesisDialog
            pact={breakPact}
            isOpen={!!breakPact}
            onClose={() => setBreakPact(null)}
            onConfirm={handleBreak}
          />
        )}
      </div>
    </MobileOptimizedInterface>
  );
};

export default PactsPage;
