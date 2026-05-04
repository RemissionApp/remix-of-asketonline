import React, { useEffect, useState } from 'react';
import { BarChart3, Bug, Trash2, FileText } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/integrations/supabase/client';
import { ProfileSection } from './ui/ProfileSection';
import { ProfileRow } from './ui/ProfileRow';
import { useProfileLang } from './i18n';
import { toast } from 'sonner';

interface PrivacySettings {
  analytics: boolean;
  crashReports: boolean;
}

const DEFAULTS: PrivacySettings = { analytics: true, crashReports: true };

export const ProfilePrivacyTab: React.FC = () => {
  const lang = useProfileLang();
  const { user } = useAppStore();
  const [settings, setSettings] = useState<PrivacySettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('profiles').select('privacy_settings').eq('id', user.id).maybeSingle()
      .then(({ data }) => {
        const s = (data?.privacy_settings as Partial<PrivacySettings>) || {};
        setSettings({ ...DEFAULTS, ...s });
        setLoaded(true);
      });
  }, [user?.id]);

  useEffect(() => {
    if (!loaded || !user?.id) return;
    const handle = setTimeout(() => {
      supabase.from('profiles').update({ privacy_settings: settings as any }).eq('id', user.id);
    }, 400);
    return () => clearTimeout(handle);
  }, [settings, loaded, user?.id]);

  const t = {
    section:   { ru: 'Конфиденциальность', en: 'Privacy',         es: 'Privacidad' }[lang],
    analytics: { ru: 'Аналитика',          en: 'Analytics',       es: 'Analítica' }[lang],
    crashes:   { ru: 'Отчёты об ошибках',  en: 'Crash reports',   es: 'Errores' }[lang],
    data:      { ru: 'Данные',             en: 'Data',            es: 'Datos' }[lang],
    clearCalls:{ ru: 'Очистить историю звонков', en: 'Clear call history', es: 'Borrar llamadas' }[lang],
    privacyDoc:{ ru: 'Политика конфиденциальности', en: 'Privacy policy', es: 'Política de privacidad' }[lang],
    cleared:   { ru: 'История очищена',    en: 'History cleared', es: 'Borrado' }[lang],
  };

  const clearCalls = async () => {
    if (!user?.id) return;
    const { error } = await supabase.from('call_summaries').delete().eq('user_id', user.id);
    if (error) toast.error(error.message); else toast.success(t.cleared);
  };

  return (
    <div className="flex flex-col gap-5">
      <ProfileSection title={t.section}>
        <ProfileRow icon={BarChart3} iconColor="blue" label={t.analytics} rounded="top"
          toggle={{ value: settings.analytics, onChange: v => setSettings(s => ({ ...s, analytics: v })) }} />
        <ProfileRow icon={Bug}       iconColor="red"  label={t.crashes}   rounded="bottom"
          toggle={{ value: settings.crashReports, onChange: v => setSettings(s => ({ ...s, crashReports: v })) }} />
      </ProfileSection>
      <ProfileSection title={t.data}>
        <ProfileRow icon={Trash2}   iconColor="red"  label={t.clearCalls} rounded="top"    onPress={clearCalls} />
        <ProfileRow icon={FileText} iconColor="gray" label={t.privacyDoc} rounded="bottom" onPress={() => window.open('https://asceta.app/privacy', '_blank')} />
      </ProfileSection>
    </div>
  );
};