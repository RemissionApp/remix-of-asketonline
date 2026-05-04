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
      className="sticky top-16 z-20 -mx-3 px-3 sm:-mx-4 sm:px-4 overflow-x-auto no-scrollbar"
    >
      <div className="flex items-center gap-2 py-2 w-max">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              data-tab={id}
              onClick={() => onChange(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-colors backdrop-blur-sm ${
                isActive
                  ? 'bg-cosmic-accent/25 border-cosmic-accent/50 text-white'
                  : 'bg-cosmic-dark/40 border-cosmic-accent/15 text-cosmic-secondary hover:text-white'
              }`}
            >
              <Icon size={13} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};