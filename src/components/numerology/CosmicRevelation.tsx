import React from 'react';
import { Sparkles, Star } from 'lucide-react';
import { NUMBER_PLANETS, PLANET_SYMBOLS, TAROT_ARCANA, ZODIAC_SYMBOLS } from '@/utils/numerology/astroLinks';
import { isMasterNumber, type NumerologyProfile } from '@/utils/numerology/calculations';
import { zodiacData, type ZodiacSign } from '@/utils/zodiac';

type Lang = 'ru' | 'en' | 'es';

interface Props {
  profile: NumerologyProfile;
  zodiacSign: ZodiacSign | null;
  lang: Lang;
}

interface Insight {
  title: string;
  body: string;
  glyph: string;
}

const t = {
  ru: {
    title: 'Космическое откровение',
    subtitle: 'Редкие совпадения в вашей карте',
    skyArcanaMatchesZodiac: (arcana: string, sign: string) =>
      `Аркан Неба матрицы — «${arcana}» — управляет вашим знаком ${sign}. Тройное совпадение карты, числа и звёзд.`,
    masterInPosition: (pos: string, n: number) =>
      `Мастер-число ${n}★ в позиции «${pos}» — редкая активация духовной миссии. Только у ~3% людей.`,
    lifePathPlanetVsZodiacRuler: (planet: string, ruler: string) =>
      `Ваше число судьбы управляется ${planet}, а знак — ${ruler}. Это редкая полярность, дающая баланс материи и формы.`,
    lifePathPlanetEqualsRuler: (planet: string) =>
      `Планета вашего числа судьбы (${planet}) совпадает с управителем знака. Усиленный архетип — путь по своей природе.`,
  },
  en: {
    title: 'Cosmic Revelation',
    subtitle: 'Rare alignments in your chart',
    skyArcanaMatchesZodiac: (arcana: string, sign: string) =>
      `The Sky arcana — “${arcana}” — rules your sign ${sign}. A triple alignment of card, number and stars.`,
    masterInPosition: (pos: string, n: number) =>
      `Master number ${n}★ in the “${pos}” position — a rare activation of spiritual mission. Only ~3% of people carry it.`,
    lifePathPlanetVsZodiacRuler: (planet: string, ruler: string) =>
      `Your Life Path is ruled by ${planet}, your sign by ${ruler}. A rare polarity that grants balance of matter and form.`,
    lifePathPlanetEqualsRuler: (planet: string) =>
      `Your Life Path planet (${planet}) matches the sign's ruler. A reinforced archetype — the path of true nature.`,
  },
  es: {
    title: 'Revelación Cósmica',
    subtitle: 'Alineaciones raras en tu carta',
    skyArcanaMatchesZodiac: (arcana: string, sign: string) =>
      `El arcano del Cielo — “${arcana}” — rige tu signo ${sign}. Triple alineación de carta, número y estrellas.`,
    masterInPosition: (pos: string, n: number) =>
      `Número maestro ${n}★ en la posición “${pos}” — rara activación de misión espiritual. Solo ~3% lo lleva.`,
    lifePathPlanetVsZodiacRuler: (planet: string, ruler: string) =>
      `Tu Camino de Vida lo rige ${planet}, tu signo lo rige ${ruler}. Polaridad rara que da equilibrio de materia y forma.`,
    lifePathPlanetEqualsRuler: (planet: string) =>
      `El planeta de tu Camino de Vida (${planet}) coincide con el regente del signo. Arquetipo reforzado.`,
  },
} as const;

const planetName: Record<string, Record<Lang, string>> = {
  sun: { ru: 'Солнце', en: 'the Sun', es: 'el Sol' },
  moon: { ru: 'Луна', en: 'the Moon', es: 'la Luna' },
  mars: { ru: 'Марс', en: 'Mars', es: 'Marte' },
  venus: { ru: 'Венера', en: 'Venus', es: 'Venus' },
  mercury: { ru: 'Меркурий', en: 'Mercury', es: 'Mercurio' },
  jupiter: { ru: 'Юпитер', en: 'Jupiter', es: 'Júpiter' },
  saturn: { ru: 'Сатурн', en: 'Saturn', es: 'Saturno' },
  uranus: { ru: 'Уран', en: 'Uranus', es: 'Urano' },
  neptune: { ru: 'Нептун', en: 'Neptune', es: 'Neptuno' },
  pluto: { ru: 'Плутон', en: 'Pluto', es: 'Plutón' },
  earth: { ru: 'Земля', en: 'Earth', es: 'la Tierra' },
};

const positionName = (key: string, lang: Lang): string => {
  const m: Record<string, Record<Lang, string>> = {
    sky: { ru: 'Небо', en: 'Sky', es: 'Cielo' },
    earth: { ru: 'Земля', en: 'Earth', es: 'Tierra' },
    center: { ru: 'Центр', en: 'Center', es: 'Centro' },
    personalMission: { ru: 'Личная миссия', en: 'Personal Mission', es: 'Misión Personal' },
    socialMission: { ru: 'Социальная миссия', en: 'Social Mission', es: 'Misión Social' },
    talent: { ru: 'Талант', en: 'Talent', es: 'Talento' },
  };
  return m[key]?.[lang] ?? key;
};

export const CosmicRevelation: React.FC<Props> = ({ profile, zodiacSign, lang }) => {
  const insights: Insight[] = [];
  const tr = t[lang];

  // 1) Sky arcana matches zodiac sign
  if (zodiacSign) {
    const arcana = TAROT_ARCANA[profile.karma.sky];
    if (arcana?.zodiac === zodiacSign) {
      insights.push({
        glyph: ZODIAC_SYMBOLS[zodiacSign] ?? '✦',
        title: tr.title,
        body: tr.skyArcanaMatchesZodiac(
          arcana.name[lang],
          zodiacData[zodiacSign].name[lang]
        ),
      });
    }
  }

  // 2) Master numbers in key positions
  const positions: Array<[string, number]> = [
    ['sky', profile.karma.sky],
    ['earth', profile.karma.earth],
    ['center', profile.karma.center],
    ['personalMission', profile.karma.personalMission],
    ['socialMission', profile.karma.socialMission],
    ['talent', profile.karma.talent],
  ];
  positions.forEach(([key, val]) => {
    if (isMasterNumber(val)) {
      insights.push({
        glyph: '✦',
        title: tr.title,
        body: tr.masterInPosition(positionName(key, lang), val),
      });
    }
  });

  // 3) Life Path planet vs zodiac ruler
  if (zodiacSign) {
    const lpPlanet = NUMBER_PLANETS[profile.pythagorean.lifePath];
    const ruler = (zodiacData[zodiacSign].ruler.split(',')[0] ?? '').trim().toLowerCase();
    const rulerKey = (
      ['sun','moon','mars','venus','mercury','jupiter','saturn','uranus','neptune','pluto']
        .includes(ruler) ? ruler : null
    ) as keyof typeof PLANET_SYMBOLS | null;
    if (lpPlanet && rulerKey) {
      const lpName = planetName[lpPlanet]?.[lang] ?? lpPlanet;
      const rulerName = planetName[rulerKey]?.[lang] ?? rulerKey;
      if (lpPlanet === rulerKey) {
        insights.push({
          glyph: PLANET_SYMBOLS[lpPlanet],
          title: tr.title,
          body: tr.lifePathPlanetEqualsRuler(lpName),
        });
      } else {
        insights.push({
          glyph: `${PLANET_SYMBOLS[lpPlanet]} · ${PLANET_SYMBOLS[rulerKey as keyof typeof PLANET_SYMBOLS]}`,
          title: tr.title,
          body: tr.lifePathPlanetVsZodiacRuler(lpName, rulerName),
        });
      }
    }
  }

  if (insights.length === 0) return null;

  return (
    <div className="rounded-3xl border border-cosmic-gold/30 bg-gradient-to-br from-cosmic-gold/15 via-cosmic-dark/70 to-cosmic-accent/15 backdrop-blur-md p-4 space-y-3 shadow-[0_0_30px_hsl(var(--cosmic-gold)/0.18)]">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-cosmic-gold animate-pulse" />
        <h3 className="font-serif text-foreground text-sm tracking-wide">
          {tr.title}
        </h3>
      </div>
      <p className="text-[11px] uppercase tracking-wider text-cosmic-gold/80">
        {tr.subtitle}
      </p>
      <ul className="space-y-2">
        {insights.slice(0, 3).map((ins, i) => (
          <li
            key={i}
            className="flex gap-3 items-start rounded-2xl bg-cosmic-dark/40 border border-white/5 p-3"
          >
            <span
              className="text-2xl text-cosmic-gold shrink-0 leading-none mt-0.5"
              aria-hidden
            >
              {ins.glyph}
            </span>
            <p className="text-sm text-foreground/90 leading-snug">
              {ins.body}
            </p>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-1.5 text-[10px] text-cosmic-secondary/70 pt-1">
        <Star className="w-3 h-3" />
        <span>{insights.length} / {insights.length}</span>
      </div>
    </div>
  );
};

export default CosmicRevelation;