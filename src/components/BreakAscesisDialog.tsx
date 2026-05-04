import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle,
  Zap,
  Clock,
  Heart,
  Target,
  MessageSquare,
  X,
} from 'lucide-react';
import { StarField } from '@/components/StarField';
import { cn } from '@/lib/utils';
import { usePWAFeatures } from '@/hooks/usePWAFeatures';
import { useAppStore } from '@/store/useAppStore';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Pact } from '@/types';
import {
  getPactBreakPenalty,
  formatPenaltyDescription,
} from '@/utils/pactUtils';

interface BreakAscesisDialogProps {
  pact: Pact;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
}

export const BreakAscesisDialog: React.FC<BreakAscesisDialogProps> = ({
  pact,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [step, setStep] = useState<'warning' | 'reason' | 'consequences'>(
    'warning'
  );
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const { haptic, badge, notifications } = usePWAFeatures();
  const { language, userProfile } = useAppStore();
  const { handleError } = useErrorHandler();

  const getTitle = () => {
    switch (language) {
      case 'ru':
        return 'Прервать аскезу?';
      case 'es':
        return '¿Interrumpir ascesis?';
      default:
        return 'Break Ascesis?';
    }
  };

  const getWarningMessage = () => {
    switch (language) {
      case 'ru':
        return `Вы уверены, что хотите прервать аскезу "${pact.title}"? Это серьезное решение с последствиями.`;
      case 'es':
        return `¿Estás seguro de que quieres interrumpir la ascesis "${pact.title}"? Esta es una decisión seria con consecuencias.`;
      default:
        return `Are you sure you want to break the ascesis "${pact.title}"? This is a serious decision with consequences.`;
    }
  };

  const getConsequences = () => {
    const penalty = getPactBreakPenalty(pact);
    const penaltyDescription = formatPenaltyDescription(penalty, language);

    switch (language) {
      case 'ru':
        return {
          title: 'Последствия прерывания аскезы:',
          items: [
            penaltyDescription,
            'Сброс прогресса текущей аскезы',
            'Снижение ранга духовного развития',
            'Негативное влияние на карму',
            'Потеря накопленных бонусов',
          ],
        };
      case 'es':
        return {
          title: 'Consecuencias de interrumpir la ascesis:',
          items: [
            penaltyDescription,
            'Reinicio del progreso de la ascesis actual',
            'Reducción del rango de desarrollo espiritual',
            'Impacto negativo en el karma',
            'Pérdida de bonificaciones acumuladas',
          ],
        };
      default:
        return {
          title: 'Consequences of breaking ascesis:',
          items: [
            penaltyDescription,
            'Reset of current ascesis progress',
            'Spiritual rank reduction',
            'Negative karma impact',
            'Loss of accumulated bonuses',
          ],
        };
    }
  };

  const getCommonReasons = () => {
    switch (language) {
      case 'ru':
        return [
          'Слишком сложно продолжать',
          'Изменились жизненные обстоятельства',
          'Потерял мотивацию',
          'Здоровье не позволяет',
          'Неправильно выбрал аскезу',
          'Другая причина',
        ];
      case 'es':
        return [
          'Demasiado difícil de continuar',
          'Circunstancias de vida cambiaron',
          'Perdí la motivación',
          'La salud no lo permite',
          'Elegí mal la ascesis',
          'Otra razón',
        ];
      default:
        return [
          'Too difficult to continue',
          'Life circumstances changed',
          'Lost motivation',
          'Health issues',
          'Chose wrong ascesis',
          'Other reason',
        ];
    }
  };

  const handleWarningNext = async () => {
    try {
      await haptic.warning();
    } catch (error) {
      console.warn('Haptic warning failed:', error);
    }
    setStep('reason');
  };

  const handleReasonNext = async () => {
    await haptic.notification();
    setStep('consequences');
  };

  const handleConfirm = async () => {
    try {
      console.log('BreakAscesisDialog: Confirming break', {
        selectedReason,
        reason,
      });

      // Non-blocking haptic feedback
      haptic.error().catch(err => console.warn('Haptic error failed:', err));

      const finalReason =
        selectedReason === 'Другая причина' ||
        selectedReason === 'Otra razón' ||
        selectedReason === 'Other reason'
          ? reason
          : selectedReason || undefined;

      // Call confirm function first
      await onConfirm(finalReason);

      // Update notifications and badge (non-blocking)
      try {
        await notifications.motivational(
          language === 'ru'
            ? 'Аскеза прервана'
            : language === 'es'
              ? 'Ascesis interrumpida'
              : 'Ascesis broken'
        );
        await badge.increment();
      } catch (notificationError) {
        console.warn('Notification/badge update failed:', notificationError);
      }

      // Reset dialog state
      onClose();
      setStep('warning');
      setReason('');
      setSelectedReason(null);
    } catch (error) {
      handleError(error, {
        component: 'BreakAscesisDialog',
        action: 'handleConfirm',
      });
    }
  };

  const handleCancel = async () => {
    await haptic.buttonTap();
    onClose();
    setStep('warning');
    setReason('');
    setSelectedReason(null);
  };

  const consequences = getConsequences();
  const commonReasons = getCommonReasons();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md overflow-hidden rounded-3xl border border-cosmic-accent/30 bg-cosmic-dark/80 backdrop-blur-xl text-white shadow-[0_0_40px_rgba(116,90,242,0.25)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl opacity-60">
          <StarField starCount={30} />
        </div>
        <div className="relative z-10">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 font-serif">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500/30 to-cosmic-accent/20 border border-red-400/30">
              <AlertTriangle className="w-5 h-5 text-red-300" />
            </span>
            <span className="cosmic-gradient-text text-lg">{getTitle()}</span>
          </AlertDialogTitle>
        </AlertDialogHeader>

        {step === 'warning' && (
          <>
            <AlertDialogDescription className="space-y-4">
              <p className="text-cosmic-secondary">{getWarningMessage()}</p>

              <Card className="rounded-2xl border-red-400/20 bg-cosmic-dark/40 backdrop-blur-md">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-300" />
                    <span className="font-medium text-red-300">
                      {language === 'ru'
                        ? 'Внимание!'
                        : language === 'es'
                          ? '¡Atención!'
                          : 'Warning!'}
                    </span>
                  </div>
                  <p className="text-sm text-cosmic-secondary">
                    {language === 'ru'
                      ? 'Прерывание аскезы негативно влияет на ваше духовное развитие и прогресс в приложении.'
                      : language === 'es'
                        ? 'Interrumpir la ascesis afecta negativamente tu desarrollo espiritual y progreso en la aplicación.'
                        : 'Breaking ascesis negatively affects your spiritual development and app progress.'}
                  </p>
                </CardContent>
              </Card>
            </AlertDialogDescription>

            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel
                onClick={handleCancel}
                className="rounded-2xl border-white/10 bg-cosmic-dark/40 text-cosmic-secondary hover:bg-cosmic-dark/60 hover:text-white"
              >
                {language === 'ru'
                  ? 'Продолжить аскезу'
                  : language === 'es'
                    ? 'Continuar ascesis'
                    : 'Continue Ascesis'}
              </AlertDialogCancel>
              <Button
                onClick={handleWarningNext}
                className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.35)] hover:from-red-500 hover:to-red-400"
              >
                {language === 'ru'
                  ? 'Все равно прервать'
                  : language === 'es'
                    ? 'Interrumpir de todos modos'
                    : 'Break Anyway'}
              </Button>
            </AlertDialogFooter>
          </>
        )}

        {step === 'reason' && (
          <>
            <AlertDialogDescription className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cosmic-accent" />
                <span className="font-medium text-white">
                  {language === 'ru'
                    ? 'Расскажите, почему вы прерываете аскезу:'
                    : language === 'es'
                      ? 'Cuéntanos por qué interrumpes la ascesis:'
                      : "Tell us why you're breaking the ascesis:"}
                </span>
              </div>

              <div className="space-y-2">
                {commonReasons.map(reasonOption => (
                  <Button
                    key={reasonOption}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'w-full justify-start rounded-2xl border text-sm transition-colors',
                      selectedReason === reasonOption
                        ? 'border-cosmic-accent/60 bg-cosmic-accent/25 text-white'
                        : 'border-white/10 bg-cosmic-dark/40 text-cosmic-secondary hover:text-white hover:border-cosmic-accent/30'
                    )}
                    onClick={async () => {
                      try {
                        await haptic.buttonTap();
                      } catch (error) {
                        console.warn('Haptic button tap failed:', error);
                      }
                      setSelectedReason(reasonOption);
                    }}
                  >
                    {reasonOption}
                  </Button>
                ))}
              </div>

              {(selectedReason === 'Другая причина' ||
                selectedReason === 'Otra razón' ||
                selectedReason === 'Other reason') && (
                <Textarea
                  placeholder={
                    language === 'ru'
                      ? 'Опишите свою причину...'
                      : language === 'es'
                        ? 'Describe tu razón...'
                        : 'Describe your reason...'
                  }
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="min-h-[80px] rounded-2xl bg-cosmic-dark/40 border-cosmic-accent/20 text-white placeholder:text-cosmic-secondary/60"
                />
              )}
            </AlertDialogDescription>

            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel
                onClick={() => setStep('warning')}
                className="rounded-2xl border-white/10 bg-cosmic-dark/40 text-cosmic-secondary hover:bg-cosmic-dark/60 hover:text-white"
              >
                {language === 'ru'
                  ? 'Назад'
                  : language === 'es'
                    ? 'Atrás'
                    : 'Back'}
              </AlertDialogCancel>
              <Button
                onClick={handleReasonNext}
                className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.35)] hover:from-red-500 hover:to-red-400 disabled:opacity-50"
                disabled={
                  !selectedReason ||
                  (selectedReason.includes('причина') && !reason.trim())
                }
              >
                {language === 'ru'
                  ? 'Далее'
                  : language === 'es'
                    ? 'Siguiente'
                    : 'Next'}
              </Button>
            </AlertDialogFooter>
          </>
        )}

        {step === 'consequences' && (
          <>
            <AlertDialogDescription className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-red-300" />
                <span className="font-medium text-red-300">
                  {consequences.title}
                </span>
              </div>

              <ul className="space-y-2">
                {consequences.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-cosmic-secondary">
                    <X className="w-3 h-3 text-red-300 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Card className="rounded-2xl border-cosmic-gold/30 bg-cosmic-gold/10 backdrop-blur-md">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-cosmic-gold" />
                    <span className="font-medium text-cosmic-gold">
                      {language === 'ru'
                        ? 'Помните:'
                        : language === 'es'
                          ? 'Recuerda:'
                          : 'Remember:'}
                    </span>
                  </div>
                  <p className="text-sm text-cosmic-secondary">
                    {language === 'ru'
                      ? 'Духовный путь - это марафон, а не спринт. Каждая попытка делает вас сильнее.'
                      : language === 'es'
                        ? 'El camino espiritual es un maratón, no un sprint. Cada intento te hace más fuerte.'
                        : 'The spiritual path is a marathon, not a sprint. Every attempt makes you stronger.'}
                  </p>
                </CardContent>
              </Card>
            </AlertDialogDescription>

            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel
                onClick={() => setStep('reason')}
                className="rounded-2xl border-white/10 bg-cosmic-dark/40 text-cosmic-secondary hover:bg-cosmic-dark/60 hover:text-white"
              >
                {language === 'ru'
                  ? 'Назад'
                  : language === 'es'
                    ? 'Atrás'
                    : 'Back'}
              </AlertDialogCancel>
              <Button
                onClick={handleConfirm}
                className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.35)] hover:from-red-500 hover:to-red-400"
              >
                <Zap className="w-4 h-4 mr-1" />
                {language === 'ru'
                  ? 'Прервать аскезу'
                  : language === 'es'
                    ? 'Interrumpir ascesis'
                    : 'Break Ascesis'}
              </Button>
            </AlertDialogFooter>
          </>
        )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
