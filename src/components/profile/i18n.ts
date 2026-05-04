import { useAppStore } from '@/store/useAppStore';

export type Lang = 'ru' | 'en' | 'es';

export const useProfileLang = (): Lang => {
  const { language } = useAppStore();
  return (['ru', 'en', 'es'].includes(language) ? language : 'ru') as Lang;
};

export const RANK_LABELS: Record<string, Record<Lang, string>> = {
  seeker:      { ru: 'Искатель',     en: 'Seeker',      es: 'Buscador' },
  pilgrim:     { ru: 'Паломник',     en: 'Pilgrim',     es: 'Peregrino' },
  warrior:     { ru: 'Воин',         en: 'Warrior',     es: 'Guerrero' },
  master:      { ru: 'Мастер',       en: 'Master',      es: 'Maestro' },
  enlightened: { ru: 'Просветлённый',en: 'Enlightened', es: 'Iluminado' },
};

export const RANK_THRESHOLDS: { rank: string; min: number }[] = [
  { rank: 'seeker',      min: 0 },
  { rank: 'pilgrim',     min: 300 },
  { rank: 'warrior',     min: 700 },
  { rank: 'master',      min: 1500 },
  { rank: 'enlightened', min: 3000 },
];

export const getRankProgress = (energy: number) => {
  let current = RANK_THRESHOLDS[0];
  let next: typeof RANK_THRESHOLDS[number] | null = null;
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (energy >= RANK_THRESHOLDS[i].min) {
      current = RANK_THRESHOLDS[i];
      next = RANK_THRESHOLDS[i + 1] ?? null;
    }
  }
  if (!next) return { current, next: current, percent: 100, pointsToNext: 0 };
  const span = next.min - current.min;
  const done = energy - current.min;
  return {
    current,
    next,
    percent: Math.max(0, Math.min(100, (done / span) * 100)),
    pointsToNext: Math.max(0, next.min - energy),
  };
};