import React from 'react';
import { Star, Flame, Mountain, Wind, Droplet, Globe2, Sun, Moon, Hash, Phone, Trophy, Sparkles, BookOpen, Grid3X3, type LucideIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { ProfileSection } from './ui/ProfileSection';
import { ProfileRow } from './ui/ProfileRow';
import { ProfileStatCard } from './ui/ProfileStatCard';
import { useProfileLang } from './i18n';
import { getZodiacSign, zodiacData } from '@/utils/zodiac';
import { calculateLifePathNumber, calculatePersonalityNumber, calculateDestinyMatrix } from '@/utils/numerologyUtils';
import { useCallMinutes } from '@/hooks/useCallMinutes';
import { translateElement, translateRuler } from '@/utils/zodiacTranslations';

const elementIcon = (el?: string): LucideIcon => {
  switch (el) {
    case 'Fire': return Flame;
    case 'Earth': return Mountain;
    case 'Air': return Wind;
    case 'Water': return Droplet;
    default: return Flame;
  }
};
const elementIconColor = (el?: string): 'red' | 'green' | 'blue' | 'purple' => {
  switch (el) {
    case 'Fire': return 'red';
    case 'Earth': return 'green';
    case 'Air': return 'blue';
    case 'Water': return 'blue';
    default: return 'red';
  }
};
const rulerIcon = (ruler?: string): LucideIcon => {
  if (!ruler) return Globe2;
  const first = ruler.split(',')[0].trim();
  if (first === 'Sun') return Sun;
  if (first === 'Moon') return Moon;
  return Globe2;
};

export const ProfileSpiritualTab: React.FC = () => {
  const lang = useProfileLang();
  const { userProfile, pacts } = useAppStore();
  const navigate = useNavigate();
  const { minutesUsed, minutesLimit } = useCallMinutes();

  const t = {
    astro:      { ru: 'Астрология',      en: 'Astrology',     es: 'Astrología' }[lang],
    sign:       { ru: 'Знак',            en: 'Sign',          es: 'Signo' }[lang],
    element:    { ru: 'Стихия',          en: 'Element',       es: 'Elemento' }[lang],
    ruler:      { ru: 'Управитель',      en: 'Ruler',         es: 'Regente' }[lang],
    numerology: { ru: 'Нумерология',     en: 'Numerology',    es: 'Numerología' }[lang],
    lifePath:   { ru: 'Число жизни',     en: 'Life path',     es: 'Camino de vida' }[lang],
    destiny:    { ru: 'Число судьбы',    en: 'Destiny',       es: 'Destino' }[lang],
    personality:{ ru: 'Личность',        en: 'Personality',   es: 'Personalidad' }[lang],
    yearNumber: { ru: 'Год',             en: 'Year number',   es: 'Año' }[lang],
    activity:   { ru: 'Активность',      en: 'Activity',      es: 'Actividad' }[lang],
    callMin:    { ru: 'Минут звонков',   en: 'Call minutes',  es: 'Minutos' }[lang],
    pactsCount: { ru: 'Аскезы',          en: 'Pacts',         es: 'Pactos' }[lang],
    energy:     { ru: 'Энергия',         en: 'Energy',        es: 'Energía' }[lang],
    notSet:     { ru: 'не указано',      en: 'not set',       es: 'no definido' }[lang],
    explore:    { ru: 'Подробнее',       en: 'Explore',       es: 'Explorar' }[lang],
    horoscope:  { ru: 'Подробный гороскоп', en: 'Detailed horoscope', es: 'Horóscopo detallado' }[lang],
    matrix:     { ru: 'Матрица судьбы',  en: 'Destiny matrix',es: 'Matriz del destino' }[lang],
  };

  const birthDate = userProfile?.birthDate ? new Date(userProfile.birthDate) : null;
  const sign = birthDate ? getZodiacSign(birthDate) : null;
  const signData = sign ? zodiacData[sign] : null;
  const signName = signData ? `${signData.symbol} ${signData.name[lang]}` : t.notSet;

  const elementValue = signData
    ? translateElement(signData.element, lang)
    : t.notSet;
  const rulerValue = signData
    ? signData.ruler.split(',').map(r => translateRuler(r.trim(), lang)).join(', ')
    : t.notSet;
  const ElIcon = elementIcon(signData?.element);
  const RulerIcon = rulerIcon(signData?.ruler);

  const birthStr = userProfile?.birthDate ? String(userProfile.birthDate) : null;
  const lifePath = birthStr ? calculateLifePathNumber(birthStr) : null;
  const personality = userProfile?.name ? calculatePersonalityNumber(userProfile.name) : null;
  const matrix = birthStr ? calculateDestinyMatrix(birthStr, userProfile?.name || '') : null;

  return (
    <div className="flex flex-col gap-5">
      <ProfileSection title={t.astro}>
        <ProfileRow icon={Star}     iconColor="gold"                                  label={t.sign}    value={signName}   rounded="top" />
        <ProfileRow icon={ElIcon}   iconColor={elementIconColor(signData?.element)}  label={t.element} value={elementValue} rounded="middle" />
        <ProfileRow icon={RulerIcon} iconColor="blue"                                 label={t.ruler}   value={rulerValue}   rounded="bottom" />
      </ProfileSection>

      <ProfileSection title={t.numerology}>
        <ProfileRow icon={Hash}     iconColor="purple" label={t.lifePath}    value={lifePath?.toString() ?? t.notSet} rounded="top" />
        <ProfileRow icon={Hash}     iconColor="gold"   label={t.destiny}     value={matrix?.spiritualNumber?.toString() ?? t.notSet} rounded="middle" />
        <ProfileRow icon={Hash}     iconColor="blue"   label={t.personality} value={personality?.toString() ?? t.notSet} rounded="middle" />
        <ProfileRow icon={Hash}     iconColor="green"  label={t.yearNumber}  value={matrix?.yearNumber?.toString() ?? t.notSet} rounded="bottom" />
      </ProfileSection>

      <ProfileSection title={t.activity}>
        <div className="grid grid-cols-3 gap-2">
          <ProfileStatCard icon={Phone}    label={t.callMin}    value={`${Math.round(minutesUsed)}/${minutesLimit}`} />
          <ProfileStatCard icon={Trophy}   label={t.pactsCount} value={pacts?.length ?? 0} />
          <ProfileStatCard icon={Sparkles} label={t.energy}     value={userProfile?.energyPoints ?? 0} />
        </div>
      </ProfileSection>

      <ProfileSection title={t.explore}>
        <ProfileRow icon={BookOpen}  iconColor="gold"   label={t.horoscope} rounded="top"    onPress={() => navigate('/detailed-horoscope')} />
        <ProfileRow icon={Grid3X3}   iconColor="purple" label={t.matrix}    rounded="bottom" onPress={() => navigate('/numerology')} />
      </ProfileSection>
    </div>
  );
};