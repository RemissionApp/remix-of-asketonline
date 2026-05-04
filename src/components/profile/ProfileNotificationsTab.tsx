import React, { useEffect, useState } from 'react';
import { Bell, Clock, Flame, Sparkles, Compass } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/integrations/supabase/client';
import { ProfileSection } from './ui/ProfileSection';
import { ProfileRow } from './ui/ProfileRow';
import { useProfileLang } from './i18n';

interface NotificationSettings {
  dailyReminder: boolean;
  reminderTime: string;
  streakAlerts: boolean;
  missionUpdates: boolean;
  universeMessages: boolean;
}

const DEFAULTS: NotificationSettings = {
  dailyReminder: true,
  reminderTime: '09:00',
  streakAlerts: true,
  missionUpdates: true,
  universeMessages: true,
};

export const ProfileNotificationsTab: React.FC = () => {
  const lang = useProfileLang();
  const { user } = useAppStore();
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('profiles').select('notification_settings').eq('id', user.id).maybeSingle()
      .then(({ data }) => {
        const s = (data?.notification_settings as Partial<NotificationSettings>) || {};
        setSettings({ ...DEFAULTS, ...s });
        setLoaded(true);
      });
  }, [user?.id]);

  useEffect(() => {
    if (!loaded || !user?.id) return;
    const handle = setTimeout(() => {
      supabase.from('profiles').update({ notification_settings: settings as any }).eq('id', user.id);
    }, 400);
    return () => clearTimeout(handle);
  }, [settings, loaded, user?.id]);

  const t = {
    section:   { ru: 'Уведомления',         en: 'Notifications',     es: 'Notificaciones' }[lang],
    daily:     { ru: 'Ежедневное напоминание', en: 'Daily reminder',  es: 'Recordatorio diario' }[lang],
    time:      { ru: 'Время напоминания',   en: 'Reminder time',     es: 'Hora' }[lang],
    streaks:   { ru: 'Серии и стрики',      en: 'Streak alerts',     es: 'Rachas' }[lang],
    missions:  { ru: 'Обновления миссий',   en: 'Mission updates',   es: 'Misiones' }[lang],
    universe:  { ru: 'Послания Вселенной',  en: 'Universe messages', es: 'Mensajes del Universo' }[lang],
  };

  const set = <K extends keyof NotificationSettings>(k: K, v: NotificationSettings[K]) =>
    setSettings(prev => ({ ...prev, [k]: v }));

  return (
    <div className="flex flex-col gap-5">
      <ProfileSection title={t.section}>
        <ProfileRow icon={Bell}     iconColor="gold"   label={t.daily}    rounded="top"
          toggle={{ value: settings.dailyReminder, onChange: v => set('dailyReminder', v) }} />
        <div className="flex items-center gap-3 bg-cosmic-dark/40 border border-cosmic-accent/15 backdrop-blur-sm p-4 rounded-md">
          <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-cosmic-deep-blue/25 ring-1 ring-sky-400/30">
            <Clock size={16} className="text-sky-300" />
          </div>
          <div className="flex-1 text-sm text-white">{t.time}</div>
          <input
            type="time"
            value={settings.reminderTime}
            disabled={!settings.dailyReminder}
            onChange={e => set('reminderTime', e.target.value)}
            className="bg-cosmic-deep-blue/40 border border-cosmic-accent/20 text-white text-xs rounded-lg px-2 py-1 disabled:opacity-40"
          />
        </div>
        <ProfileRow icon={Flame}    iconColor="red"    label={t.streaks}  rounded="middle"
          toggle={{ value: settings.streakAlerts, onChange: v => set('streakAlerts', v) }} />
        <ProfileRow icon={Compass}  iconColor="purple" label={t.missions} rounded="middle"
          toggle={{ value: settings.missionUpdates, onChange: v => set('missionUpdates', v) }} />
        <ProfileRow icon={Sparkles} iconColor="blue"   label={t.universe} rounded="bottom"
          toggle={{ value: settings.universeMessages, onChange: v => set('universeMessages', v) }} />
      </ProfileSection>
    </div>
  );
};