
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { CosmicButton } from '@/components/CosmicButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';
import { StarField } from '@/components/StarField';
import { ArrowLeft } from 'lucide-react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { PactOath } from '@/components/PactOath';
import { Button } from '@/components/ui/button';

const CreatePactPage: React.FC = () => {
  const navigate = useNavigate();
  const { addPact, user, language } = useAppStore();
  const { t } = useTranslations();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [reward, setReward] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showOath, setShowOath] = useState(false);
  const [customDuration, setCustomDuration] = useState(false);

  const handleCreatePact = async () => {
    if (!title) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Error',
        description: language === 'ru' ? 'Необходимо указать название практики' : 'You must specify a practice name',
        variant: 'destructive',
      });
      return;
    }

    if (customDuration && (duration < 7 || duration > 365)) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Error',
        description: language === 'ru' ? 'Длительность должна быть от 7 до 365 дней' : 'Duration must be between 7 and 365 days',
        variant: 'destructive',
      });
      return;
    }

    setShowOath(true);
  };
  
  const handleConfirmOath = async () => {
    setIsCreating(true);
    
    try {
      await addPact({
        title,
        duration,
        reward,
        status: 'active',
        user_id: user?.id || ''
      });
      
      navigate('/main');
    } catch (error) {
      console.error('Error creating pact:', error);
      toast({
        title: language === 'ru' ? 'Ошибка создания практики' : 'Error creating practice',
        description: language === 'ru' ? 'Пожалуйста, попробуйте еще раз' : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (showOath) {
    return <PactOath 
      title={title}
      duration={duration}
      reward={reward}
      onConfirm={handleConfirmOath}
      onBack={() => setShowOath(false)}
    />;
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <StarField starCount={100} />
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-8">
        <button 
          onClick={() => navigate('/main')}
          className="absolute top-4 left-4 p-2 text-cosmic-accent"
        >
          <ArrowLeft size={24} />
        </button>
        
        <h2 className="text-3xl font-serif text-white mb-6">
          {t?.createPact?.title || "Создать практику"}
        </h2>
        <div className="w-full max-w-md space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">
              {t?.createPact?.practiceName || "Название практики"}
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-cosmic-dark border-cosmic-accent/30 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="duration" className="text-white mb-2 block">
              {t?.createPact?.duration || "Длительность (дней)"}
            </Label>
            
            <div className="grid grid-cols-3 gap-2 mb-2">
              <Button 
                variant={duration === 30 && !customDuration ? "default" : "outline"}
                onClick={() => {
                  setDuration(30);
                  setCustomDuration(false);
                }}
                className="w-full"
              >
                30 {t?.createPact?.days || "дней"}
              </Button>
              <Button 
                variant={duration === 60 && !customDuration ? "default" : "outline"} 
                onClick={() => {
                  setDuration(60);
                  setCustomDuration(false);
                }}
                className="w-full"
              >
                60 {t?.createPact?.days || "дней"}
              </Button>
              <Button 
                variant={duration === 90 && !customDuration ? "default" : "outline"}
                onClick={() => {
                  setDuration(90);
                  setCustomDuration(false);
                }}
                className="w-full"
              >
                90 {t?.createPact?.days || "дней"}
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <Button 
                variant={customDuration ? "default" : "outline"}
                onClick={() => setCustomDuration(true)}
                className="w-full"
              >
                {t?.createPact?.custom || "Свой вариант"}
              </Button>
              
              {customDuration && (
                <Input
                  type="number"
                  min={7}
                  max={365}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                  className="bg-cosmic-dark border-cosmic-accent/30 text-white w-24"
                />
              )}
            </div>
            
            <p className="text-sm text-cosmic-secondary mt-1">
              {duration} {t?.createPact?.days || "дней"}
            </p>
          </div>
          
          <div>
            <Label htmlFor="reward" className="text-white">
              {t?.createPact?.reward || "Награда"}
            </Label>
            <Textarea
              id="reward"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              className="bg-cosmic-dark border-cosmic-accent/30 text-white"
              placeholder={t?.createPact?.rewardPlaceholder || "Что вы получите, когда завершите практику?"}
            />
          </div>
          <CosmicButton onClick={handleCreatePact} disabled={isCreating}>
            {isCreating
              ? t?.createPact?.creating || "Создание..."
              : t?.createPact?.create || "Создать"}
          </CosmicButton>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default CreatePactPage;
