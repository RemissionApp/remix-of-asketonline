import React, { useRef } from 'react';
import { Camera, Calendar, Compass, Flag, Flame, Trophy, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { ProfileSection } from './ui/ProfileSection';
import { ProfileRow } from './ui/ProfileRow';
import { ProfileStatCard } from './ui/ProfileStatCard';
import { useProfileLang, RANK_LABELS, getRankProgress } from './i18n';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const ProfileIdentityTab: React.FC = () => {
  const lang = useProfileLang();
  const { user, userProfile, updateUserProfile, pacts } = useAppStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const energy = userProfile?.energyPoints ?? 0;
  const rankInfo = getRankProgress(energy);
  const rankLabel = RANK_LABELS[rankInfo.current.rank]?.[lang] ?? rankInfo.current.rank;
  const nextLabel = RANK_LABELS[rankInfo.next.rank]?.[lang] ?? rankInfo.next.rank;

  const t = {
    rank:        { ru: 'Ранг',          en: 'Rank',         es: 'Rango' }[lang],
    progress:    { ru: 'до',            en: 'to',           es: 'hasta' }[lang],
    pointsLeft:  (n: number) => ({ ru: `${n} ⚡ до ${nextLabel}`, en: `${n} ⚡ to ${nextLabel}`, es: `${n} ⚡ hasta ${nextLabel}` }[lang]),
    info:        { ru: 'Личное',        en: 'Personal',     es: 'Personal' }[lang],
    name:        { ru: 'Имя',           en: 'Name',         es: 'Nombre' }[lang],
    birth:       { ru: 'Дата рождения', en: 'Birth date',   es: 'Fecha de nacimiento' }[lang],
    goal:        { ru: 'Цель',          en: 'Goal',         es: 'Objetivo' }[lang],
    notSet:      { ru: 'не указано',    en: 'not set',      es: 'no definido' }[lang],
    days:        { ru: 'Дней в Asceta', en: 'Days in app',  es: 'Días' }[lang],
    pactsLbl:    { ru: 'Аскезы',        en: 'Pacts',        es: 'Pactos' }[lang],
    energyLbl:   { ru: 'Энергия',       en: 'Energy',       es: 'Energía' }[lang],
    edit:        { ru: 'Изменить аватар', en: 'Edit avatar', es: 'Editar avatar' }[lang],
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      await updateUserProfile({ avatar_url: data.publicUrl });
      toast.success('✓');
    } catch (err: any) {
      toast.error(err?.message ?? 'Error');
    }
  };

  const initials = (userProfile?.name || user?.email || '?').slice(0, 1).toUpperCase();
  const birthDateStr = userProfile?.birthDate
    ? new Date(userProfile.birthDate).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'es' ? 'es-ES' : 'en-US')
    : t.notSet;

  return (
    <div className="flex flex-col gap-5">
      {/* Avatar + rank */}
      <div className="flex flex-col items-center text-center gap-3">
        <button
          onClick={() => fileRef.current?.click()}
          className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-cosmic-accent/40 bg-cosmic-dark/50"
          aria-label={t.edit}
        >
          {userProfile?.avatar_url ? (
            <img src={userProfile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif text-3xl text-cosmic-gold">
              {initials}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-cosmic-accent/90 flex items-center justify-center ring-2 ring-cosmic-dark">
            <Camera size={12} className="text-white" />
          </span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />
        <div>
          <div className="font-serif text-lg text-white">{userProfile?.name || t.notSet}</div>
          <div className="text-[11px] text-cosmic-secondary">{user?.email}</div>
        </div>

        {/* Rank progress */}
        <div className="w-full bg-cosmic-dark/40 border border-cosmic-accent/15 backdrop-blur-sm rounded-2xl p-4 mt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-cosmic-secondary">{t.rank}</span>
            <span className="font-serif text-sm text-cosmic-gold">{rankLabel}</span>
          </div>
          <div className="h-1.5 bg-cosmic-deep-blue/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cosmic-accent to-cosmic-gold transition-all"
              style={{ width: `${rankInfo.percent}%` }}
            />
          </div>
          {rankInfo.pointsToNext > 0 && (
            <div className="text-[10px] text-cosmic-secondary mt-1.5 text-right">
              {t.pointsLeft(rankInfo.pointsToNext)}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <ProfileStatCard icon={Calendar} label={t.days} value={userProfile?.totalDays ?? 0} />
        <ProfileStatCard icon={Trophy} label={t.pactsLbl} value={pacts?.length ?? 0} />
        <ProfileStatCard icon={Flame} label={t.energyLbl} value={energy} />
      </div>

      {/* Personal */}
      <ProfileSection title={t.info}>
        <ProfileRow icon={Sparkles} iconColor="purple" label={t.name} value={userProfile?.name || t.notSet} rounded="top" />
        <ProfileRow icon={Calendar} iconColor="blue"   label={t.birth} value={birthDateStr} rounded="middle" />
        <ProfileRow icon={Flag}     iconColor="gold"   label={t.goal}  value={userProfile?.goal || t.notSet} rounded="bottom" />
      </ProfileSection>
    </div>
  );
};