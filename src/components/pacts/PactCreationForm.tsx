import React, { useState } from 'react';
import { Plus, Calendar, Target, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';
import { PactTypeSelector } from './PactTypeSelector';
import { CosmicButton } from '@/components/CosmicButton';
import { cn } from '@/lib/utils';

interface PactCreationFormProps {
  onSubmit: (pactData: {
    title: string;
    duration: number;
    reward?: string;
    type?: string;
  }) => void;
  onCancel?: () => void;
  className?: string;
}

export const PactCreationForm: React.FC<PactCreationFormProps> = ({
  onSubmit,
  onCancel,
  className
}) => {
  const { language } = useAppStore();
  const [formData, setFormData] = useState({
    title: '',
    duration: 30,
    reward: '',
    type: ''
  });
  const [step, setStep] = useState(1);

  const getText = (key: string) => {
    const texts = {
      ru: {
        createPact: 'Создать аскезу',
        step1Title: 'Тип и название',
        step2Title: 'Продолжительность',
        step3Title: 'Цель и награда',
        pactTitle: 'Название аскезы',
        titlePlaceholder: 'Например: Отказ от сахара',
        duration: 'Продолжительность (дней)',
        reward: 'Цель/Награда',
        rewardPlaceholder: 'Что вы хотите получить...',
        next: 'Далее',
        back: 'Назад',
        create: 'Создать',
        cancel: 'Отмена',
        minDuration: 'Минимум 30 дней',
        required: 'Обязательное поле'
      },
      es: {
        createPact: 'Crear ascesis',
        step1Title: 'Tipo y nombre',
        step2Title: 'Duración',
        step3Title: 'Objetivo y recompensa',
        pactTitle: 'Nombre de la ascesis',
        titlePlaceholder: 'Ejemplo: Renunciar al azúcar',
        duration: 'Duración (días)',
        reward: 'Objetivo/Recompensa',
        rewardPlaceholder: 'Qué quieres obtener...',
        next: 'Siguiente',
        back: 'Atrás',
        create: 'Crear',
        cancel: 'Cancelar',
        minDuration: 'Mínimo 30 días',
        required: 'Campo obligatorio'
      },
      en: {
        createPact: 'Create Ascesis',
        step1Title: 'Type and Name',
        step2Title: 'Duration',
        step3Title: 'Goal and Reward',
        pactTitle: 'Ascesis Name',
        titlePlaceholder: 'Example: Give up sugar',
        duration: 'Duration (days)',
        reward: 'Goal/Reward',
        rewardPlaceholder: 'What you want to achieve...',
        next: 'Next',
        back: 'Back',
        create: 'Create',
        cancel: 'Cancel',
        minDuration: 'Minimum 30 days',
        required: 'Required field'
      }
    };
    return texts[language][key] || texts.en[key];
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit(formData);
    }
  };

  const isFormValid = () => {
    switch (step) {
      case 1:
        return formData.title.trim().length > 0;
      case 2:
        return formData.duration >= 30;
      case 3:
        return true; // Reward is optional
      default:
        return false;
    }
  };

  const canProceed = () => {
    return isFormValid();
  };

  const predefinedDurations = [30, 60, 90, 108];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <PactTypeSelector
              selectedType={formData.type}
              onTypeSelect={(type) => setFormData(prev => ({ ...prev, type }))}
            />
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-cosmic-secondary">
                {getText('pactTitle')} *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={getText('titlePlaceholder')}
                className="cosmic-input"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="w-12 h-12 text-cosmic-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {getText('step2Title')}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {predefinedDurations.map(days => (
                <button
                  key={days}
                  onClick={() => setFormData(prev => ({ ...prev, duration: days }))}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all duration-200 hover-scale',
                    formData.duration === days
                      ? 'border-cosmic-accent bg-cosmic-accent/20 text-white'
                      : 'border-cosmic-accent/30 bg-cosmic-dark/40 text-cosmic-secondary hover:border-cosmic-accent/60'
                  )}
                >
                  <div className="text-2xl font-bold">{days}</div>
                  <div className="text-sm">{getText('days')}</div>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-cosmic-secondary">
                {getText('duration')}
              </Label>
              <Input
                id="duration"
                type="number"
                min="30"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  duration: Math.max(30, parseInt(e.target.value) || 30)
                }))}
                className="cosmic-input text-center"
              />
              <p className="text-xs text-cosmic-secondary text-center">
                {getText('minDuration')}
              </p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Gift className="w-12 h-12 text-cosmic-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {getText('step3Title')}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reward" className="text-cosmic-secondary">
                  {getText('reward')}
                </Label>
                <Textarea
                  id="reward"
                  value={formData.reward}
                  onChange={(e) => setFormData(prev => ({ ...prev, reward: e.target.value }))}
                  placeholder={getText('rewardPlaceholder')}
                  className="cosmic-input min-h-[100px] resize-none"
                />
              </div>

              {/* Summary */}
              <div className="p-4 rounded-lg bg-cosmic-accent/10 border border-cosmic-accent/20">
                <h4 className="text-sm font-semibold text-cosmic-accent mb-2">
                  Краткое описание:
                </h4>
                <div className="space-y-1 text-sm text-cosmic-secondary">
                  <p><span className="text-white">Тип:</span> {formData.type || 'Общая'}</p>
                  <p><span className="text-white">Название:</span> {formData.title}</p>
                  <p><span className="text-white">Продолжительность:</span> {formData.duration} дней</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className={cn("cosmic-card bg-cosmic-dark/60 border-cosmic-accent/20", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Plus className="w-5 h-5 text-cosmic-accent" />
          {getText('createPact')}
        </CardTitle>
        
        {/* Progress Steps */}
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
                i === step
                  ? 'bg-cosmic-accent text-white'
                  : i < step
                    ? 'bg-cosmic-gold text-white'
                    : 'bg-cosmic-dark/60 text-cosmic-secondary border border-cosmic-accent/30'
              )}
            >
              {i}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {renderStep()}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 border-cosmic-accent/30 text-cosmic-secondary hover:text-white"
            >
              {getText('back')}
            </Button>
          )}

          {step < 3 ? (
            <CosmicButton
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1"
            >
              {getText('next')}
            </CosmicButton>
          ) : (
            <CosmicButton
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="flex-1"
            >
              {getText('create')}
            </CosmicButton>
          )}

          {onCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-cosmic-secondary hover:text-white"
            >
              {getText('cancel')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};