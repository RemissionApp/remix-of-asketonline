
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

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div 
        className={`relative max-w-lg w-full mx-auto overflow-hidden transition-all duration-1000 ${
          isReady ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Portal awakening effect */}
        <div className="relative w-full aspect-square max-w-md mx-auto mb-6">
          {/* Background subtle glow */}
          <div className="absolute inset-0 bg-cosmic-dark rounded-full blur-xl opacity-60" />
          
          {/* Main glowing circle */}
          <div className="absolute inset-4 rounded-full border-2 border-cosmic-gold/80 animate-spin-slow shadow-[0_0_40px_rgba(245,158,11,0.5)]" 
               style={{animationDuration: '30s'}} />
          
          {/* Inner circle - brighter */}
          <div className="absolute inset-10 rounded-full border border-cosmic-gold shadow-[0_0_20px_rgba(245,158,11,0.8)] animate-spin-slow"
               style={{animationDuration: '20s', animationDirection: 'reverse'}} />
          
          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-full bg-cosmic-gold/5 filter blur-md animate-pulse-slow" />
          </div>
          
          {/* Bright ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/2 h-1/2 rounded-full border-2 border-cosmic-gold shadow-[0_0_30px_rgba(245,158,11,0.9)] animate-pulse-slow" />
          </div>
          
          {/* Small particles */}
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-1 bg-cosmic-gold rounded-full blur-[1px] animate-spin-slow" 
              style={{
                top: `${50 + 35 * Math.cos(i * (Math.PI / 3))}%`, 
                left: `${50 + 35 * Math.sin(i * (Math.PI / 3))}%`,
                animationDuration: `${15 + i * 2}s`
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className={`cosmic-card relative z-10 transition-opacity duration-1000 ${
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

          <div className="mt-6 text-right text-cosmic-gold italic">
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
          className="bg-cosmic-gold text-black hover:bg-cosmic-gold/80 animate-pulse-slow"
        >
          Заключить Пакт
        </Button>
      </div>
    </div>
  );
};
