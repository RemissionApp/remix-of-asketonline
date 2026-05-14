import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Flame, Mountain, Wind, Droplet, Globe2, Sun, Moon, Sparkles, Hash, BookmarkPlus, BookmarkCheck, Heart, User as UserIcon, ArrowRight, type LucideIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { translateElement, translateRuler } from '@/utils/zodiacTranslations';
import {
  lifePathNumber,
  soulNumber,
  personalityNumber,
  expressionNumber,
  personalYearNumber,
  pythagoreanSquare,
} from '@/utils/numerology/calculations';
import { getNumberMeaning, pickI18n } from '@/utils/numerology/interpretations';
import { PythagoreanSquareSVG } from '@/components/numerology/PythagoreanSquareSVG';
import { useBriefHoroscope } from '@/hooks/useBriefHoroscope';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type Lang = 'ru' | 'en' | 'es';

const T = {
  astrology:    { ru: 'Астрология',          en: 'Astrology',         es: 'Astrología' },
  numerology:   { ru: 'Нумерология',         en: 'Numerology',        es: 'Numerología' },
  horoscope:    { ru: 'Гороскоп на сегодня', en: "Today's horoscope", es: 'Horóscopo de hoy' },
  sign:         { ru: 'Знак',                en: 'Sign',              es: 'Signo' },
  element:      { ru: 'Стихия',              en: 'Element',           es: 'Elemento' },
  ruler:        { ru: 'Управитель',          en: 'Ruler',             es: 'Regente' },
  lifePath:     { ru: 'Жизненный путь',      en: 'Life path',         es: 'Camino de vida' },
  destiny:      { ru: 'Судьба',              en: 'Destiny',           es: 'Destino' },
  soul:         { ru: 'Душа',                en: 'Soul',              es: 'Alma' },
  personality:  { ru: 'Личность',            en: 'Personality',       es: 'Personalidad' },
  personalYear: { ru: 'Личный год',          en: 'Personal year',     es: 'Año personal' },
  square:       { ru: 'Квадрат Пифагора',    en: 'Pythagorean square', es: 'Cuadrado de Pitágoras' },
  fullReading:  { ru: 'Полный разбор',       en: 'Full reading',      es: 'Lectura completa' },
  setBirth:     { ru: 'Укажите дату рождения, чтобы открыть',
                  en: 'Add your birth date to unlock',
                  es: 'Añade tu fecha de nacimiento para desbloquear' },
  goProfile:    { ru: 'Перейти в профиль', en: 'Open profile', es: 'Ir al perfil' },
  saveBtn:      { ru: 'Сохранить в Книгу Ответов', en: 'Save to Book of Answers', es: 'Guardar en el Libro de Respuestas' },
  savedBtn:     { ru: 'Сохранено', en: 'Saved', es: 'Guardado' },
  savedToast:   { ru: 'Гороскоп сохранён в Книгу Ответов', en: 'Horoscope saved to Book of Answers', es: 'Horóscopo guardado en el Libro de Respuestas' },
  saveError:    { ru: 'Не удалось сохранить', en: 'Failed to save', es: 'No se pudo guardar' },
  horoscopeFor: { ru: 'Гороскоп на', en: 'Horoscope for', es: 'Horóscopo del' },
} as const;

const elementIcon = (el?: string): LucideIcon => {
  switch (el) {
    case 'Fire':  return Flame;
    case 'Earth': return Mountain;
    case 'Air':   return Wind;
    case 'Water': return Droplet;
    default:      return Sparkles;
  }
};
const rulerIcon = (ruler?: string): LucideIcon => {
  if (!ruler) return Globe2;
  const first = ruler.split(',')[0].trim();
  if (first === 'Sun') return Sun;
  if (first === 'Moon') return Moon;
  return Globe2;
};

const Card: React.FC<{ title: string; icon: LucideIcon; children: React.ReactNode }> = ({
  title, icon: Icon, children,
}) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_8px_32px_-12px_rgba(124,58,237,0.35)] overflow-visible min-w-0">
    <header className="flex items-center gap-2 mb-4 min-w-0">
      <div className="w-8 h-8 rounded-lg bg-cosmic-accent/15 ring-1 ring-cosmic-accent/30 flex items-center justify-center">
        <Icon size={16} className="text-cosmic-accent" />
      </div>
      <h3 className="text-sm uppercase tracking-[0.18em] text-cosmic-secondary font-medium break-words min-w-0">{title}</h3>
    </header>
    {children}
  </section>
);

const Row: React.FC<{ icon: LucideIcon; label: string; value: string; iconColor?: string }> = ({
  icon: Icon, label, value, iconColor = 'text-cosmic-accent',
}) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-3">
      <Icon size={16} className={iconColor} />
      <span className="text-sm text-cosmic-secondary">{label}</span>
    </div>
    <span className="text-sm text-white font-medium">{value}</span>
  </div>
);

const NumberCell: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3 text-center">
    <div className="text-2xl font-serif text-white tabular-nums">{value}</div>
    <div className="text-[11px] uppercase tracking-wider text-cosmic-secondary mt-1">{label}</div>
  </div>
);

const TriadCell: React.FC<{ icon: LucideIcon; label: string; value: number | null; accent?: string }> = ({
  icon: Icon, label, value, accent = 'text-cosmic-accent',
}) => (
  <div className="rounded-xl bg-white/[0.04] border border-white/10 p-2.5 text-center">
    <Icon size={14} className={`${accent} mx-auto mb-1`} />
    <div className="text-xl font-serif text-white tabular-nums leading-none">{value ?? '—'}</div>
    <div className="text-[10px] uppercase tracking-wider text-cosmic-secondary mt-1.5">{label}</div>
  </div>
);

const NoBirthCTA: React.FC<{ lang: Lang }> = ({ lang }) => (
  <div className="text-center py-3">
    <p className="text-sm text-cosmic-secondary mb-3">{T.setBirth[lang]}</p>
    <Link
      to="/profile"
      className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-cosmic-accent/20 hover:bg-cosmic-accent/30 border border-cosmic-accent/40 text-white text-sm transition-colors"
    >
      {T.goProfile[lang]}
    </Link>
  </div>
);

const parseBirth = (raw: string | null): { d: number; m: number; y: number } | null => {
  if (!raw) return null;
  const dt = new Date(raw);
  if (isNaN(dt.getTime())) return null;
  return { d: dt.getDate(), m: dt.getMonth() + 1, y: dt.getFullYear() };
};

export const DesktopMainExtras: React.FC = () => {
  const { userProfile, language, user } = useAppStore();
  const lang = (['ru', 'en', 'es'].includes(language) ? language : 'en') as Lang;

  const birthDate = userProfile?.birthDate ? new Date(userProfile.birthDate) : null;
  const sign = birthDate ? getZodiacSign(birthDate) : null;
  const signData = sign ? zodiacData[sign] : null;

  const birthStr = userProfile?.birthDate ? String(userProfile.birthDate) : null;
  const parsed = parseBirth(birthStr);
  const fullName = userProfile?.name || '';
  const lifePath = parsed ? lifePathNumber(parsed.d, parsed.m, parsed.y) : null;
  const soul = fullName ? soulNumber(fullName) : null;
  const personality = fullName ? personalityNumber(fullName) : null;
  const expression = fullName ? expressionNumber(fullName) : null;
  const pYear = parsed ? personalYearNumber(parsed.d, parsed.m, new Date().getFullYear()) : null;
  const square = parsed ? pythagoreanSquare(parsed.d, parsed.m, parsed.y) : null;
  const lifePathMeaning = lifePath ? getNumberMeaning(lifePath) : null;

  const { horoscope, loading, displayedText, isTyping } = useBriefHoroscope();

  const ElIcon = elementIcon(signData?.element);
  const RulerIcon = rulerIcon(signData?.ruler);

  const todayKey = new Date().toISOString().slice(0, 10);
  const savedKey = sign ? `horoscope_saved_${sign}_${todayKey}` : null;
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (savedKey) setSaved(localStorage.getItem(savedKey) === '1');
  }, [savedKey]);

  const handleSave = async () => {
    if (!user || !horoscope?.description || !signData || !savedKey || saving || saved) return;
    setSaving(true);
    try {
      const dateLabel = new Date().toLocaleDateString(
        lang === 'ru' ? 'ru-RU' : lang === 'es' ? 'es-ES' : 'en-US'
      );
      const signLabel = signData.name[lang];
      const { error } = await supabase.from('universe_questions').insert({
        user_id: user.id,
        question: `${T.horoscopeFor[lang]} ${dateLabel} (${signLabel})`,
        answer: horoscope.description,
      });
      if (error) throw error;
      localStorage.setItem(savedKey, '1');
      setSaved(true);
      toast.success(T.savedToast[lang]);
    } catch (e) {
      console.error('Save horoscope error', e);
      toast.error(T.saveError[lang]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-full min-w-0">
      {/* Astrology */}
      <Card title={T.astrology[lang]} icon={Star}>
        {signData ? (
          <div className="space-y-1">
            <Row icon={Star}     label={T.sign[lang]}    value={`${signData.symbol} ${signData.name[lang]}`} iconColor="text-cosmic-gold" />
            <Row icon={ElIcon}   label={T.element[lang]} value={translateElement(signData.element, lang)}     iconColor="text-rose-300" />
            <Row icon={RulerIcon} label={T.ruler[lang]}   value={signData.ruler.split(',').map(r => translateRuler(r.trim(), lang)).join(', ')} iconColor="text-sky-300" />
          </div>
        ) : (
          <NoBirthCTA lang={lang} />
        )}
      </Card>

      {/* Numerology */}
      <Card title={T.numerology[lang]} icon={Hash}>
        {parsed && lifePath ? (
          <div className="space-y-5">
            {/* Life path hero */}
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute -inset-3 rounded-full bg-cosmic-accent/30 blur-2xl" />
                <div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center
                             bg-gradient-to-br from-cosmic-accent/80 via-fuchsia-500/60 to-indigo-700/70
                             border border-white/20
                             shadow-[0_0_40px_rgba(168,85,247,0.45),inset_0_1px_0_rgba(255,255,255,0.3)]"
                >
                  <span className="font-serif text-4xl text-white tabular-nums drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                    {lifePath}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-cosmic-secondary">
                {T.lifePath[lang]}
              </p>
              {lifePathMeaning && (
                <>
                  <h4 className="mt-1 font-serif text-lg text-cosmic-gold">
                    {pickI18n(lifePathMeaning.pythagorean.lifePath.title, lang)}
                  </h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/80 line-clamp-3">
                    {pickI18n(lifePathMeaning.pythagorean.lifePath.essence, lang)}
                  </p>
                </>
              )}
            </div>

            {/* Triad: soul / personality / expression */}
            {fullName && (
              <div className="grid grid-cols-3 gap-2">
                <TriadCell icon={Heart}     label={T.soul[lang]}        value={soul} accent="text-rose-300" />
                <TriadCell icon={UserIcon}  label={T.personality[lang]} value={personality} accent="text-sky-300" />
                <TriadCell icon={Star}      label={T.destiny[lang]}     value={expression} accent="text-cosmic-gold" />
              </div>
            )}

            {/* Personal year bar */}
            {pYear !== null && (
              <div className="flex items-center justify-between rounded-xl px-3 py-2.5 bg-white/[0.04] border border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-cosmic-accent" />
                  <span className="text-xs text-cosmic-secondary">{T.personalYear[lang]} · {new Date().getFullYear()}</span>
                </div>
                <span className="font-serif text-lg text-white tabular-nums">{pYear}</span>
              </div>
            )}

            {/* Mini Pythagorean square */}
            {square && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-cosmic-secondary mb-2 text-center">
                  {T.square[lang]}
                </p>
                <div className="max-w-[220px] mx-auto">
                  <PythagoreanSquareSVG square={square} size={220} />
                </div>
              </div>
            )}

            {/* CTA */}
            <Link
              to="/numerology"
              className="group relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white
                         bg-gradient-to-r from-cosmic-accent/30 via-fuchsia-500/25 to-indigo-600/30
                         border border-cosmic-accent/40
                         hover:from-cosmic-accent/45 hover:via-fuchsia-500/40 hover:to-indigo-600/45
                         transition-colors shadow-[0_0_25px_rgba(168,85,247,0.25)]"
            >
              <span className="font-serif tracking-wide">{T.fullReading[lang]}</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        ) : (
          <NoBirthCTA lang={lang} />
        )}
      </Card>

      {/* Daily horoscope */}
      <Card title={T.horoscope[lang]} icon={Sparkles}>
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-white/10 rounded w-full" />
            <div className="h-3 bg-white/10 rounded w-5/6" />
            <div className="h-3 bg-white/10 rounded w-4/6" />
            <div className="h-3 bg-white/10 rounded w-3/6" />
          </div>
        ) : (
          <>
            <p className="text-[14px] leading-relaxed text-white/90 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
              {displayedText || horoscope?.description || ''}
              {isTyping && <span className="ml-0.5 inline-block w-[2px] h-4 bg-cosmic-accent align-middle animate-pulse" />}
            </p>
            {user && horoscope?.description && signData && (
              <button
                onClick={handleSave}
                disabled={saved || saving || isTyping}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm leading-snug text-center transition-colors border disabled:opacity-70 disabled:cursor-not-allowed bg-cosmic-accent/15 hover:bg-cosmic-accent/25 border-cosmic-accent/40 text-white whitespace-normal break-words"
              >
                {saved ? <BookmarkCheck size={16} className="shrink-0" /> : <BookmarkPlus size={16} className="shrink-0" />}
                <span className="min-w-0">{saved ? T.savedBtn[lang] : T.saveBtn[lang]}</span>
              </button>
            )}
          </>
        )}
      </Card>
    </aside>
  );
};