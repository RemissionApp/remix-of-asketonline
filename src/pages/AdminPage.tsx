import React, { useState } from 'react';
import { LayoutDashboard, Users, FileBarChart, MousePointerClick, GitBranch, DollarSign, Repeat, Activity } from 'lucide-react';
import { OverviewSection } from '@/components/admin/sections/Overview';
import { UsersSection } from '@/components/admin/sections/Users';
import { PagesSection } from '@/components/admin/sections/Pages';
import { EventsSection } from '@/components/admin/sections/Events';
import { FunnelsSection } from '@/components/admin/sections/Funnels';
import { RevenueSection } from '@/components/admin/sections/Revenue';
import { RetentionSection } from '@/components/admin/sections/Retention';
import { HealthSection } from '@/components/admin/sections/Health';

type Tab = 'overview' | 'revenue' | 'users' | 'retention' | 'pages' | 'events' | 'funnels' | 'health';

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'overview', label: 'Обзор', icon: LayoutDashboard },
  { id: 'revenue', label: 'Доходы', icon: DollarSign },
  { id: 'users', label: 'Пользователи', icon: Users },
  { id: 'retention', label: 'Retention', icon: Repeat },
  { id: 'pages', label: 'Страницы', icon: FileBarChart },
  { id: 'events', label: 'События', icon: MousePointerClick },
  { id: 'funnels', label: 'Воронки', icon: GitBranch },
  { id: 'health', label: 'Здоровье', icon: Activity },
];

const AdminPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const [days, setDays] = useState(30);

  return (
    <div className="min-h-screen w-full bg-cosmic-dark text-white">
      <div className="mx-auto max-w-6xl px-4 lg:px-0 py-6">
        <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-serif text-3xl text-white">Admin</h1>
            <div className="text-xs text-cosmic-secondary mt-1">Аналитика и управление пользователями</div>
          </div>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white outline-none"
          >
            <option value={1}>За сутки</option>
            <option value={7}>За 7 дней</option>
            <option value={30}>За 30 дней</option>
            <option value={90}>За 90 дней</option>
            <option value={365}>За год</option>
          </select>
        </header>

        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors border ${
                tab === id
                  ? 'bg-cosmic-accent/25 border-cosmic-accent/50 text-white'
                  : 'bg-white/5 border-white/10 text-cosmic-secondary hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div>
          {tab === 'overview' && <OverviewSection days={days} />}
          {tab === 'revenue' && <RevenueSection days={days} />}
          {tab === 'users' && <UsersSection />}
          {tab === 'retention' && <RetentionSection days={days} />}
          {tab === 'pages' && <PagesSection days={days} />}
          {tab === 'events' && <EventsSection days={days} />}
          {tab === 'funnels' && <FunnelsSection days={days} />}
          {tab === 'health' && <HealthSection />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
