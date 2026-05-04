import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Mail, Globe, FileText, Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/lib/supabase';
import { ProfileSection } from './ui/ProfileSection';
import { ProfileRow } from './ui/ProfileRow';
import { useProfileLang } from './i18n';
import { toast } from 'sonner';

export const ProfileAccountTab: React.FC = () => {
  const lang = useProfileLang();
  const navigate = useNavigate();
  const { user, signOut, language, setLanguage } = useAppStore();

  const provider = (user as any)?.app_metadata?.provider ?? 'email';

  const t = {
    account:  { ru: 'Аккаунт',         en: 'Account',         es: 'Cuenta' }[lang],
    email:    { ru: 'Email',           en: 'Email',           es: 'Email' }[lang],
    method:   { ru: 'Способ входа',    en: 'Sign-in method',  es: 'Método' }[lang],
    language: { ru: 'Язык',            en: 'Language',        es: 'Idioma' }[lang],
    data:     { ru: 'Данные',          en: 'Data',            es: 'Datos' }[lang],
    export:   { ru: 'Экспорт данных',  en: 'Export data',     es: 'Exportar datos' }[lang],
    danger:   { ru: 'Опасная зона',    en: 'Danger zone',     es: 'Zona peligrosa' }[lang],
    logout:   { ru: 'Выйти',           en: 'Sign out',        es: 'Cerrar sesión' }[lang],
    delete:   { ru: 'Удалить аккаунт', en: 'Delete account',  es: 'Eliminar cuenta' }[lang],
    exported: { ru: 'Файл готов',      en: 'Export ready',    es: 'Listo' }[lang],
  };

  const handleLogout = async () => {
    cleanupAuthState();
    await signOut();
    navigate('/login');
  };

  const handleExport = async () => {
    if (!user?.id) return;
    try {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      const { data: pacts } = await supabase.from('pacts').select('*').eq('user_id', user.id);
      const { data: missions } = await supabase.from('mission_progress').select('*').eq('user_id', user.id);
      const blob = new Blob([JSON.stringify({ profile, pacts, missions }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `asceta-export-${Date.now()}.json`; a.click();
      URL.revokeObjectURL(url);
      toast.success(t.exported);
    } catch (e: any) {
      toast.error(e?.message ?? 'Error');
    }
  };

  const langLabel = ({ ru: 'Русский', en: 'English', es: 'Español' } as const)[language as 'ru'|'en'|'es'];
  const cycleLang = () => {
    const order: ('ru'|'en'|'es')[] = ['ru', 'en', 'es'];
    const next = order[(order.indexOf(language as any) + 1) % order.length];
    setLanguage(next);
  };

  return (
    <div className="flex flex-col gap-5">
      <ProfileSection title={t.account}>
        <ProfileRow icon={Mail}     iconColor="blue"   label={t.email}    value={user?.email ?? '—'} rounded="top" />
        <ProfileRow icon={FileText} iconColor="gray"   label={t.method}   value={provider} rounded="middle" />
        <ProfileRow icon={Globe}    iconColor="purple" label={t.language} value={langLabel} rounded="bottom" onPress={cycleLang} />
      </ProfileSection>

      <ProfileSection title={t.data}>
        <ProfileRow icon={Download} iconColor="green" label={t.export} rounded="single" onPress={handleExport} />
      </ProfileSection>

      <ProfileSection title={t.danger}>
        <ProfileRow icon={LogOut} iconColor="gray" label={t.logout} rounded="top"    onPress={handleLogout} />
        <ProfileRow icon={Trash2} iconColor="red"  label={t.delete} rounded="bottom" onPress={() => navigate('/delete-account')} />
      </ProfileSection>
    </div>
  );
};