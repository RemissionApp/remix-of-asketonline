import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAppStore } from '@/store/useAppStore';

const T = {
  ru: {
    title: 'Космическая атмосфера',
    toggle: 'Мистический дрон во время звонка',
    volume: 'Громкость',
    hint: 'Лёгкий шёпот вселенной и космический фон во время звонка.',
  },
  en: {
    title: 'Cosmic atmosphere',
    toggle: 'Mystical drone during the call',
    volume: 'Volume',
    hint: 'Soft cosmic whisper and ambient drone while you are on a call.',
  },
  es: {
    title: 'Atmósfera cósmica',
    toggle: 'Dron místico durante la llamada',
    volume: 'Volumen',
    hint: 'Susurro cósmico suave y dron ambiental durante la llamada.',
  },
} as const;

export const AmbientSoundSection: React.FC = () => {
  const { language, ambientEnabled, ambientVolume, setAmbientEnabled, setAmbientVolume } =
    useAppStore();
  const lang = (['ru', 'en', 'es'].includes(language) ? language : 'en') as keyof typeof T;
  const t = T[lang];

  return (
    <div>
      <h2 className="text-xl text-white font-serif mb-4">{t.title}</h2>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {ambientEnabled ? (
              <Volume2 className="w-5 h-5 text-fuchsia-300" />
            ) : (
              <VolumeX className="w-5 h-5 text-cosmic-secondary" />
            )}
            <span className="text-sm text-white">{t.toggle}</span>
          </div>
          <Switch checked={ambientEnabled} onCheckedChange={setAmbientEnabled} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-cosmic-secondary">
            <span>{t.volume}</span>
            <span className="tabular-nums">{Math.round(ambientVolume * 100)}%</span>
          </div>
          <Slider
            value={[Math.round(ambientVolume * 100)]}
            onValueChange={([v]) => setAmbientVolume((v ?? 0) / 100)}
            min={0}
            max={100}
            step={1}
            disabled={!ambientEnabled}
          />
        </div>

        <p className="text-[12px] text-cosmic-secondary/80">{t.hint}</p>
      </div>
    </div>
  );
};