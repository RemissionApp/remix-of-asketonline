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
import { usePWAFeatures } from '@/hooks/usePWAFeatures';
import { useAppStore } from '@/store/useAppStore';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

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

  if (isMobile) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            {getTitle()}
          </AlertDialogTitle>
        </AlertDialogHeader>

        {step === 'warning' && (
          <>
            <AlertDialogDescription className="space-y-4">
              <p>{getWarningMessage()}</p>

              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="font-medium text-destructive">
                      {language === 'ru'
                        ? 'Внимание!'
                        : language === 'es'
                          ? '¡Atención!'
                          : 'Warning!'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ru'
                      ? 'Прерывание аскезы негативно влияет на ваше духовное развитие и прогресс в приложении.'
                      : language === 'es'
                        ? 'Interrumpir la ascesis afecta negativamente tu desarrollo espiritual y progreso en la aplicación.'
                        : 'Breaking ascesis negatively affects your spiritual development and app progress.'}
                  </p>
                </CardContent>
              </Card>
            </AlertDialogDescription>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>
                {language === 'ru'
                  ? 'Продолжить аскезу'
                  : language === 'es'
                    ? 'Continuar ascesis'
                    : 'Continue Ascesis'}
              </AlertDialogCancel>
              <Button variant="destructive" onClick={handleWarningNext}>
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
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium">
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
                    variant={
                      selectedReason === reasonOption ? 'default' : 'outline'
                    }
                    size="sm"
                    className="w-full justify-start"
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
                  className="min-h-[80px]"
                />
              )}
            </AlertDialogDescription>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setStep('warning')}>
                {language === 'ru'
                  ? 'Назад'
                  : language === 'es'
                    ? 'Atrás'
                    : 'Back'}
              </AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleReasonNext}
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
                <Target className="w-4 h-4 text-destructive" />
                <span className="font-medium text-destructive">
                  {consequences.title}
                </span>
              </div>

              <ul className="space-y-2">
                {consequences.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <X className="w-3 h-3 text-destructive flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-amber-800">
                      {language === 'ru'
                        ? 'Помните:'
                        : language === 'es'
                          ? 'Recuerda:'
                          : 'Remember:'}
                    </span>
                  </div>
                  <p className="text-sm text-amber-700">
                    {language === 'ru'
                      ? 'Духовный путь - это марафон, а не спринт. Каждая попытка делает вас сильнее.'
                      : language === 'es'
                        ? 'El camino espiritual es un maratón, no un sprint. Cada intento te hace más fuerte.'
                        : 'The spiritual path is a marathon, not a sprint. Every attempt makes you stronger.'}
                  </p>
                </CardContent>
              </Card>
            </AlertDialogDescription>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setStep('reason')}>
                {language === 'ru'
                  ? 'Назад'
                  : language === 'es'
                    ? 'Atrás'
                    : 'Back'}
              </AlertDialogCancel>
              <Button variant="destructive" onClick={handleConfirm}>
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
      </AlertDialogContent>
    </AlertDialog>
  );
};
