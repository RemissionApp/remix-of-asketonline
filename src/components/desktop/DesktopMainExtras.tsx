import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Flame, Mountain, Wind, Droplet, Globe2, Sun, Moon, Sparkles, Hash, BookmarkPlus, BookmarkCheck, type LucideIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { translateElement, translateRuler } from '@/utils/zodiacTranslations';
import {
  calculateLifePathNumber,
  calculatePersonalityNumber,
  calculateDestinyMatrix,
} from '@/utils/numerologyUtils';
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
  lifePath:     { ru: 'Число жизни',         en: 'Life path',         es: 'Camino' },
  destiny:      { ru: 'Судьба',              en: 'Destiny',           es: 'Destino' },
  personality:  { ru: 'Личность',            en: 'Personality',       es: 'Personalidad' },
  year:         { ru: 'Год',                 en: 'Year',              es: 'Año' },
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
  <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_8px_32px_-12px_rgba(124,58,237,0.35)]">
    <header className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-cosmic-accent/15 ring-1 ring-cosmic-accent/30 flex items-center justify-center">
        <Icon size={16} className="text-cosmic-accent" />
      </div>
      <h3 className="text-sm uppercase tracking-[0.18em] text-cosmic-secondary font-medium">{title}</h3>
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

export const DesktopMainExtras: React.FC = () => {
  const { userProfile, language, user } = useAppStore();
  const lang = (['ru', 'en', 'es'].includes(language) ? language : 'en') as Lang;

  const birthDate = userProfile?.birthDate ? new Date(userProfile.birthDate) : null;
  const sign = birthDate ? getZodiacSign(birthDate) : null;
  const signData = sign ? zodiacData[sign] : null;

  const birthStr = userProfile?.birthDate ? String(userProfile.birthDate) : null;
  const lifePath = birthStr ? calculateLifePathNumber(birthStr) : null;
  const personality = userProfile?.name ? calculatePersonalityNumber(userProfile.name) : null;
  const matrix = birthStr ? calculateDestinyMatrix(birthStr, userProfile?.name || '') : null;

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
    <aside className="hidden lg:flex flex-col gap-4 w-full">
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
        {birthStr ? (
          <div className="grid grid-cols-2 gap-2">
            <NumberCell label={T.lifePath[lang]}    value={lifePath?.toString() ?? '—'} />
            <NumberCell label={T.destiny[lang]}     value={matrix?.spiritualNumber?.toString() ?? '—'} />
            <NumberCell label={T.personality[lang]} value={personality?.toString() ?? '—'} />
            <NumberCell label={T.year[lang]}        value={matrix?.yearNumber?.toString() ?? '—'} />
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
            <p className="text-[14px] leading-relaxed text-white/90 whitespace-pre-line">
              {displayedText || horoscope?.description || ''}
              {isTyping && <span className="ml-0.5 inline-block w-[2px] h-4 bg-cosmic-accent align-middle animate-pulse" />}
            </p>
            {user && horoscope?.description && signData && (
              <button
                onClick={handleSave}
                disabled={saved || saving || isTyping}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm transition-colors border disabled:opacity-70 disabled:cursor-not-allowed bg-cosmic-accent/15 hover:bg-cosmic-accent/25 border-cosmic-accent/40 text-white"
              >
                {saved ? <BookmarkCheck size={16} /> : <BookmarkPlus size={16} />}
                {saved ? T.savedBtn[lang] : T.saveBtn[lang]}
              </button>
            )}
          </>
        )}
      </Card>
    </aside>
  );
};