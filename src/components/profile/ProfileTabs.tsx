import React, { useEffect, useRef } from 'react';
import { User, Sparkles, Crown, Bell, Shield, Settings } from 'lucide-react';
import { useProfileLang } from './i18n';

export type ProfileTabId =
  | 'identity'
  | 'spiritual'
  | 'subscription'
  | 'notifications'
  | 'privacy'
  | 'account';

interface Props {
  active: ProfileTabId;
  onChange: (id: ProfileTabId) => void;
}

export const ProfileTabs: React.FC<Props> = ({ active, onChange }) => {
  const lang = useProfileLang();
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs: { id: ProfileTabId; icon: typeof User; label: string }[] = [
    { id: 'identity',      icon: User,     label: { ru: 'Профиль',     en: 'Identity',     es: 'Perfil' }[lang] },
    { id: 'spiritual',     icon: Sparkles, label: { ru: 'Духовный',    en: 'Spiritual',    es: 'Espiritual' }[lang] },
    { id: 'subscription',  icon: Crown,    label: { ru: 'Подписка',    en: 'Subscription', es: 'Suscripción' }[lang] },
    { id: 'notifications', icon: Bell,     label: { ru: 'Уведомления', en: 'Notifications',es: 'Avisos' }[lang] },
    { id: 'privacy',       icon: Shield,   label: { ru: 'Приватность', en: 'Privacy',      es: 'Privacidad' }[lang] },
    { id: 'account',       icon: Settings, label: { ru: 'Аккаунт',     en: 'Account',      es: 'Cuenta' }[lang] },
  ];

  useEffect(() => {
    const el = scrollRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  return (
    <div
      ref={scrollRef}
      className="sticky z-20 -mx-3 px-3 sm:-mx-4 sm:px-4 overflow-x-auto no-scrollbar bg-cosmic-dark/60 backdrop-blur-md"
      style={{ top: 'calc(env(safe-area-inset-top, 0px) + 60px)' }}
    >
      <div className="flex items-center gap-2 py-2 w-max">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              data-tab={id}
              onClick={() => onChange(id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 min-h-[36px] rounded-full border text-xs whitespace-nowrap transition-colors backdrop-blur-sm ${
                isActive
                  ? 'bg-cosmic-accent/30 border-cosmic-accent/60 text-white shadow-[0_0_14px_rgba(139,92,246,0.35)]'
                  : 'bg-white/5 border-white/10 text-cosmic-secondary active:text-white'
              }`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};