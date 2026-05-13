## План: десктопная версия + админ-панель с аналитикой

Мобильную вёрстку не трогаем. Вся новая работа активируется от `lg:` (≥1024px) и выше — на телефоне визуально ничего не меняется.

---

### Часть A. Десктопный layout (≥ lg, 1024px+)

**Архитектура.** Создаём один контейнер `DesktopShell` (`src/components/desktop/DesktopShell.tsx`), который применяется только на десктопе через медиа-условие. На мобилке возвращает `children` без обёртки — это гарантирует нулевое влияние на мобайл.

```
┌──────────────────────────────────────────────────────────┐
│ Sidebar (260px, sticky)  │  Main content (max-w-5xl)     │
│ ─ Лого Asceta           │  ┌───────────────────────────┐ │
│ ─ Главная               │  │ TopBar (десктопный)        │ │
│ ─ Вселенная             │  │  поиск · энергия · аватар  │ │
│ ─ Аскезы                │  └───────────────────────────┘ │
│ ─ Космос                │                                │
│ ─ Профиль               │  Контент страницы              │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─       │  (сетка вместо одной колонки)  │
│ Pro статус · подписка   │                                │
└──────────────────────────────────────────────────────────┘
```

- Прозрачный glass-стиль сохраняем (`backdrop-blur-xl`, `bg-white/5`, `border-white/10`).
- Sidebar — не shadcn-sidebar, а кастомный, чтобы не ломать дизайн-токены.
- BottomNavigation скрывается на `lg:` (`lg:hidden`), вместо неё — sidebar.
- PageHeader скрывается на `lg:`, его роль выполняет десктопный TopBar внутри shell.

**Страницы под десктоп (только публичные/ключевые):**
1. **Лендинг** (`/` / `WelcomePage`) — hero слева + визуал справа в две колонки, фичи в bento-сетке 3×2.
2. **LoginPage** — двухколоночный split: форма слева (max-w-md), маркетинг-визуал справа.
3. **MainPage** — три колонки: слева sidebar, центр (кнопка звонка + пакты), справа боковая колонка (совет дня, прогресс, ранг).
4. **ProfilePage** — sidebar-табы слева вертикально (а не горизонтальный скролл), контент таба справа в 2 колонках где уместно (Identity: личное + статистика рядом).
5. **CallPage** — оставляем фуллскрин, но кнопка звонка центрирована, по бокам пустое пространство, таймер крупнее.
6. **UniverseHubPage** — две колонки: слева кнопки звонка/чата, справа список последних звонков + вопросов.
7. **CosmosPage** — bento-сетка 2×2: зодиак, нумерология, аффирмации, миссии.
8. **PactsPage** — список пактов в две колонки.

**Файлы новые:**
- `src/components/desktop/DesktopShell.tsx`
- `src/components/desktop/DesktopSidebar.tsx`
- `src/components/desktop/DesktopTopBar.tsx`
- `src/hooks/useIsDesktop.ts` (`window.matchMedia('(min-width: 1024px)')`)

**Файлы меняются (только добавляются `lg:`-классы и условные ветки):**
- `src/App.tsx` или `src/components/AppRouter.tsx` — оборачиваем Routes в `<DesktopShell>` для перечисленных выше страниц.
- 8 страниц выше — добавляем `lg:grid lg:grid-cols-…` контейнеры. Существующие мобильные классы остаются.
- `BottomNavigation` — `lg:hidden`.
- `PageHeader` — `lg:hidden`.

---

### Часть B. Админ-панель и аналитика (защищённая)

**B.1. Роли (миграция).**

```sql
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

create policy "Users can view own roles" on public.user_roles
  for select using (auth.uid() = user_id);
create policy "Admins can view all roles" on public.user_roles
  for select using (public.has_role(auth.uid(), 'admin'));
```

После миграции выдаю **тебе** роль admin одним INSERT (нужно: твой user_id из `profiles`). Просто скажи, какой email — найду.

**B.2. Таблицы аналитики.**

```sql
create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text not null,
  path text not null,
  referrer text,
  language text,
  platform text,                  -- 'web' | 'ios' | 'android'
  duration_ms integer,            -- time on page (отправляется при unmount)
  created_at timestamptz not null default now()
);
create index page_views_user_idx on public.page_views(user_id, created_at desc);
create index page_views_path_idx on public.page_views(path, created_at desc);

create table public.user_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text not null,
  event_name text not null,       -- 'call_started','call_ended','pact_created','chat_message','pro_purchased' и т.п.
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index user_events_user_idx on public.user_events(user_id, created_at desc);
create index user_events_name_idx on public.user_events(event_name, created_at desc);
```

RLS: пользователи могут только INSERT (для трекинга). Только admin может SELECT.

**B.3. Frontend-трекер.**

- `src/hooks/useAnalytics.ts` — `track(event, props)`, `trackPageView(path)`, генерирует `session_id` (sessionStorage) при первом вызове. Батчит вставки по 5 событий или раз в 5с (debounce), чтобы не спамить.
- `src/components/analytics/AnalyticsProvider.tsx` — слушает `useLocation`, на каждое изменение пути логит page_view с durations предыдущего.
- В ключевые места добавляю `track()`:
  - `useElevenLabsConversation`: `call_started`, `call_ended` (с длительностью)
  - `UniverseChatPage`: `chat_message_sent`
  - `CreatePactPage`: `pact_created`
  - `LoginPage`: `signup_completed`, `login_completed`
  - `OnboardingPage`: `onboarding_step` (с номером шага)
  - `ProfileSubscriptionTab`: `pro_purchased` (когда status переходит в active)

**B.4. Админ-страница `/admin`.**

Защищена роутом-гардом `<RequireAdmin>` — проверяет `has_role(auth.uid(), 'admin')` через `supabase.rpc`. Если не admin — редирект на `/main`. Никаких хардкод-кред в коде.

UI вкладок (sidebar slim):
1. **Обзор** — KPI-карточки: всего пользователей, активные за 24ч/7д/30д, подписчики Pro, конверсия trial→pro, средний чек минут звонков. Графики: новые регистрации по дням (line chart, recharts), активность по часам (bar).
2. **Пользователи** — таблица: email, имя, дата регистрации, последний вход, страна по IP (опц.), статус подписки, дней в приложении, аскез, минут звонков. Фильтр по языку, по статусу подписки, по дате. Клик → подробный профиль пользователя.
3. **Страницы** — топ страниц по просмотрам, среднее время на странице (по `duration_ms`), bounce rate (приближённо: сессии с 1 page_view).
4. **Действия (события)** — топ событий за период, разбивка по дням, фильтр по `event_name`.
5. **Воронки** — преднастроенные:
   - регистрация → завершён онбординг → первый звонок
   - регистрация → создан первый пакт → завершён первый день
   - открыт экран Pro → начал оплату → подписался
   Плюс конструктор: выбрать 2-4 события из списка.
6. **Сегменты** — фильтры пользователей по комбинации (язык, подписка, кол-во звонков, дней в приложении). Сохранение пресетов в localStorage.

Все запросы — через **edge function `admin-analytics`** (single endpoint, разные `action`-параметры), которая внутри проверяет `has_role(auth.uid(),'admin')` и выполняет агрегации. Это безопаснее, чем гонять heavy SQL с клиента, и держит всю логику в одном месте.

**Файлы новые:**
- `src/pages/AdminPage.tsx` (роут `/admin`, lazy)
- `src/components/admin/RequireAdmin.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/components/admin/sections/Overview.tsx`
- `src/components/admin/sections/Users.tsx`
- `src/components/admin/sections/Pages.tsx`
- `src/components/admin/sections/Events.tsx`
- `src/components/admin/sections/Funnels.tsx`
- `src/components/admin/sections/Segments.tsx`
- `src/components/admin/charts/*` (LineChart, BarChart, KpiCard на recharts — уже есть в зависимостях)
- `supabase/functions/admin-analytics/index.ts`
- `src/hooks/useAnalytics.ts`
- `src/components/analytics/AnalyticsProvider.tsx`

**В существующий код вносится:**
- `App.tsx`/`AppRouter.tsx` — добавить роут `/admin`, обернуть в `RequireAdmin`. Вставить `<AnalyticsProvider>` под `BrowserRouter`.
- 5-7 мест в коде (звонки, пакты, чат, логин, онбординг, Pro) — `track('event_name', {...})` без изменения логики.

---

### Что будет в этой ветке работ

1. Миграция: `app_role`, `user_roles`, `has_role`, `page_views`, `user_events` + RLS.
2. Edge function `admin-analytics` (агрегации, проверка роли).
3. Frontend-трекер + провайдер + 6 точек инструментирования.
4. Десктопный shell + sidebar/topbar + 8 страниц с двух/трёхколоночной адаптацией под `lg:`.
5. Админ-страница `/admin` с 6 вкладками и graceful-empty-states пока данных мало.
6. После миграции: попрошу твой email/user_id и одним INSERT назначу роль admin.

### Чего не будет

- Хардкода `Admin/admin` в коде (не пройдёт ревью App Store, и любой увидит в bundle).
- Изменений мобильной вёрстки — все новые классы префиксованы `lg:`.
- Изменений бизнес-логики, схем существующих таблиц, ElevenLabs-хуков, RLS существующих таблиц.
