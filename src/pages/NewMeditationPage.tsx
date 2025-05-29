
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StarField } from '@/components/StarField';
import { MeditationHeader } from '@/components/meditation/MeditationHeader';
import { MeditationHeroSection } from '@/components/meditation/MeditationHeroSection';
import { AdvancedMeditationPlayer } from '@/components/meditation/AdvancedMeditationPlayer';
import { MeditationDescription } from '@/components/meditation/MeditationDescription';
import { UserProgress } from '@/components/meditation/UserProgress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockSessions = [
  {
    id: '1',
    title: 'Утреннее перерождение',
    category: 'Энергия',
    curator: 'Анна Звездова',
    avatar: '/avatars/seeker.png',
    moonPhase: '🌕 Новолуние',
    level: 'Уровень 3: Гармония'
  },
  {
    id: '2',
    title: 'Вечернее очищение',
    category: 'Сон',
    curator: 'Михаил Космос',
    avatar: '/avatars/warrior.png',
    moonPhase: '🌓 Первая четверть',
    level: 'Уровень 2: Баланс'
  },
  {
    id: '3',
    title: 'Антистресс 5 минут',
    category: 'Фокус',
    curator: 'Елена Лунная',
    avatar: '/avatars/pilgrim.png',
    moonPhase: '🌙 Убывающая луна',
    level: 'Уровень 1: Начало'
  }
];

const mockAchievements = [
  { id: '1', title: 'Рассвет', description: '5 утренних сессий', icon: '🌅', unlocked: true },
  { id: '2', title: 'Штиль', description: '3 дня подряд', icon: '🌊', unlocked: true },
  { id: '3', title: 'Глубина', description: '60 минут медитации', icon: '🏔️', unlocked: false, progress: 75 },
  { id: '4', title: 'Сердце', description: 'Практика любви к себе', icon: '💖', unlocked: false, progress: 30 }
];

const NewMeditationPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState('Лес');
  const [selectedVoice, setSelectedVoice] = useState('Женский');

  const backgroundMusic = ['Лес', 'Дождь', 'Тибетские чаши', 'Океан', 'Тишина'];
  const voiceOptions = ['Мужской', 'Женский', 'Нейтральный'];

  const weeklyProgress = [15, 20, 0, 25, 30, 10, 35]; // minutes per day

  return (
    <div className="min-h-screen bg-cosmic-dark relative">
      <StarField starCount={100} />
      
      <div className="relative z-10">
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/meditation')}
            className="text-cosmic-accent hover:bg-cosmic-accent/20"
          >
            <ArrowLeft size={24} />
          </Button>
        </div>

        {/* Header with Session Slider */}
        <MeditationHeader
          sessions={mockSessions}
          currentIndex={currentSessionIndex}
          onSessionChange={setCurrentSessionIndex}
        />

        {/* Hero Section */}
        <MeditationHeroSection
          duration={10}
          audioType="voice+music"
          emotion="Вдохновение"
        />

        {/* Audio Player */}
        <div className="py-6">
          <AdvancedMeditationPlayer
            audioSrc="/meditations/demo.mp3"
            title={mockSessions[currentSessionIndex].title}
            onNext={() => {
              const nextIndex = currentSessionIndex < mockSessions.length - 1 
                ? currentSessionIndex + 1 
                : 0;
              setCurrentSessionIndex(nextIndex);
            }}
            onPrevious={() => {
              const prevIndex = currentSessionIndex > 0 
                ? currentSessionIndex - 1 
                : mockSessions.length - 1;
              setCurrentSessionIndex(prevIndex);
            }}
          />
        </div>

        {/* Tabs for Different Sections */}
        <Tabs defaultValue="description" className="px-4">
          <TabsList className="grid w-full grid-cols-2 bg-cosmic-dark/60 border border-cosmic-accent/20">
            <TabsTrigger 
              value="description"
              className="text-cosmic-secondary data-[state=active]:text-cosmic-accent data-[state=active]:bg-cosmic-accent/20"
            >
              Описание
            </TabsTrigger>
            <TabsTrigger 
              value="progress"
              className="text-cosmic-secondary data-[state=active]:text-cosmic-accent data-[state=active]:bg-cosmic-accent/20"
            >
              Прогресс
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-0">
            <MeditationDescription
              description="🌿 Закрой глаза. Сделай глубокий вдох. Ты в безопасности. Эта медитация поможет тебе почувствовать внутреннюю силу и начать день с ясным намерением."
              backgroundMusic={backgroundMusic}
              voiceOptions={voiceOptions}
              onMusicChange={setSelectedMusic}
              onVoiceChange={setSelectedVoice}
            />
          </TabsContent>

          <TabsContent value="progress" className="mt-0">
            <UserProgress
              consecutiveDays={8}
              unlockedLevel="Сердечный покой"
              weeklyProgress={weeklyProgress}
              achievements={mockAchievements}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NewMeditationPage;
