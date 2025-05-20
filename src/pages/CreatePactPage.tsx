import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { CosmicButton } from '@/components/CosmicButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';
import { StarField } from '@/components/StarField';
import { Home, Sparkles, MessageSquare, User } from 'lucide-react';
import { BottomNavigation } from '@/components/BottomNavigation';

const CreatePactPage: React.FC = () => {
  const navigate = useNavigate();
  const { addPact, user, language } = useAppStore();
  const { t } = useTranslations();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(7);
  const [reward, setReward] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePact = async () => {
    if (!title) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Error',
        description: language === 'ru' ? 'Необходимо указать название практики' : 'You must specify a practice name',
        variant: 'destructive',
      });
      return;
    }

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

  return (
    <div className="relative min-h-screen flex flex-col">
      <StarField starCount={100} />
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 py-8">
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
            <Label htmlFor="duration" className="text-white">
              {t?.createPact?.duration || "Длительность (дней)"}
            </Label>
            <Slider
              id="duration"
              defaultValue={[duration]}
              max={30}
              min={7}
              step={1}
              onValueChange={(value) => setDuration(value[0])}
              className="bg-cosmic-dark border-cosmic-accent/30 text-white"
            />
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
