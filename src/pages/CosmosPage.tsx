import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stars, Calculator, Sparkles } from 'lucide-react';
import { StarField } from '@/components/StarField';
import { BottomNavigation } from '@/components/BottomNavigation';
import { MobileOptimizedInterface } from '@/components/ui/MobileOptimizedInterface';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAppStore } from '@/store/useAppStore';

const titles = {
  ru: { page: 'Космос', horoscope: 'Гороскоп', numerology: 'Нумерология', affirmations: 'Аффирмации' },
  en: { page: 'Cosmos', horoscope: 'Horoscope', numerology: 'Numerology', affirmations: 'Affirmations' },
  es: { page: 'Cosmos', horoscope: 'Horóscopo', numerology: 'Numerología', affirmations: 'Afirmaciones' },
};

const subtitles = {
  ru: { horoscope: 'Карта звёзд на сегодня', numerology: 'Числа твоей судьбы', affirmations: 'Слова силы' },
  en: { horoscope: 'Today\u2019s star map', numerology: 'Numbers of your destiny', affirmations: 'Words of power' },
  es: { horoscope: 'Mapa estelar de hoy', numerology: 'N\u00fameros de tu destino', affirmations: 'Palabras de poder' },
};

const CosmosPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const lang = (language as keyof typeof titles) ?? 'ru';
  const t = titles[lang] ?? titles.ru;
  const s = subtitles[lang] ?? subtitles.ru;

  const cards = [
    { icon: Stars, title: t.horoscope, subtitle: s.horoscope, to: '/full-horoscope' },
    { icon: Calculator, title: t.numerology, subtitle: s.numerology, to: '/numerology' },
    { icon: Sparkles, title: t.affirmations, subtitle: s.affirmations, to: '/affirmations' },
  ];

  return (
    <MobileOptimizedInterface>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden pb-24">
        <StarField />
        <PageHeader title={t.page} />
        <div className="flex-1 relative z-10 px-4 pt-20 max-w-lg mx-auto w-full space-y-3">
          {cards.map(({ icon: Icon, title, subtitle, to }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="w-full glass-strong border border-cosmic-accent/20 rounded-2xl p-4 flex items-center gap-4 text-left transition hover:border-cosmic-accent/50 hover:shadow-[0_0_18px_rgba(139,92,246,0.35)]"
            >
              <div className="w-12 h-12 rounded-full bg-cosmic-accent/20 flex items-center justify-center text-cosmic-accent">
                <Icon size={22} />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">{title}</div>
                <div className="text-cosmic-secondary/80 text-xs mt-0.5">{subtitle}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe-bottom">
          <BottomNavigation />
        </div>
      </div>
    </MobileOptimizedInterface>
  );
};

export default CosmosPage;