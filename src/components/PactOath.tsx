
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

interface PactOathProps {
  title: string;
  duration: number;
  reward: string;
  onConfirm: () => void;
  onBack: () => void;
}

export const PactOath: React.FC<PactOathProps> = ({ 
  title, 
  duration, 
  reward, 
  onConfirm,
  onBack 
}) => {
  const { userProfile } = useAppStore();
  const [isReady, setIsReady] = useState(false);
  const [showText, setShowText] = useState(false);
  
  // Simulating the "portal opening" effect
  useEffect(() => {
    const timer1 = setTimeout(() => setIsReady(true), 500);
    const timer2 = setTimeout(() => setShowText(true), 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  
  // Play sound effect on component mount
  useEffect(() => {
    // Sound effect could be added here in the future
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div 
        className={`cosmic-card max-w-lg w-full mx-auto relative overflow-hidden transition-all duration-1000 ${
          isReady ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-cosmic-accent/5 animate-pulse-slow" />
        <div className="absolute inset-0 bg-cosmic-accent/10 animate-float opacity-50" />
        
        {/* Main content */}
        <div className={`relative z-10 transition-opacity duration-1000 ${
          showText ? 'opacity-100' : 'opacity-0'
        }`}>
          <h2 className="text-2xl font-serif text-center text-white mb-4">
            Текст Аскезы
          </h2>
          
          <div className="space-y-4 text-cosmic-secondary">
            <p className="text-center">«Я осознанно вхожу в этот Путь.</p>

            <p className="text-center">Я выбираю добровольный отказ —<br />
            не как жертву, но как источник силы.</p>

            <p className="text-center">Я отказываюсь от <span className="text-cosmic-accent">{title}</span>,<br />
            чтобы раскрыть в себе глубину,<br />
            освободить пространство для нового<br />
            и обрести ясность воли.</p>

            <p className="text-center">Пусть каждый день моего выбора<br />
            будет шагом к Силе, к Целостности, к Истинному Себе.</p>

            <p className="text-center">Я заключаю договор с Вселенной —<br />
            на <span className="text-cosmic-accent">{duration}</span> дней я соблюдаю аскезу<br />
            во имя <span className="text-cosmic-accent">{reward}</span>.</p>

            <p className="text-center">Я признаю искушения как учителей.<br />
            Я принимаю трудность как топливо.<br />
            Я вхожу в этот обет с полной ответственностью.</p>

            <p className="text-center">Пусть Вселенная станет свидетелем моего намерения.</p>

            <p className="text-center">Да будет Сила внутри меня.»</p>
          </div>

          <div className="mt-6 text-right text-cosmic-accent italic">
            <p>{userProfile.name} — Дитя Воли</p>
          </div>
        </div>
      </div>
      
      <div className={`flex gap-4 mt-6 transition-all duration-1000 ${
        showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <Button
          variant="outline"
          onClick={onBack}
          className="text-cosmic-secondary border-cosmic-accent/30 hover:bg-cosmic-accent/20"
        >
          Назад
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-cosmic-accent text-white hover:bg-cosmic-accent2 animate-pulse-slow"
        >
          Заключить Пакт
        </Button>
      </div>
    </div>
  );
};
