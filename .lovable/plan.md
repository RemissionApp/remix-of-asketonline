# План: Переработка страницы Профиля в стиле Asceta (Главная / Вселенная / Космос)

Сделаем пошагово в **3 этапа**, чтобы можно было проверять прогресс между ними.

---

## Дизайн-основа

Используем те же визуальные приёмы, что и на страницах Cosmos / Universe / Main:
- Контейнер `min-h-screen flex flex-col relative pb-24`, `<StarField />`, плавающий `<PageHeader />`, плавающий `<BottomNavigation />`.
- Карточки: `rounded-3xl border border-cosmic-*/25 bg-gradient-to-br from-…/40 via-cosmic-dark/60 to-…/15 p-5 shadow-lg`, `active:scale-[0.99]`.
- Иконка слева в круге 56–64px с цветным glow (как Cosmos / Lyra), текст по центру блока, заголовки `text-base font-semibold text-white` (+`font-serif` для `en`), сабтекст `text-xs text-cosmic-secondary`.
- Только существующие cosmic-токены (`cosmic-gold`, `cosmic-accent`, `cosmic-indigo`, `cosmic-dark`, `cosmic-secondary`, `cosmic-deep-blue`).

Создадим переиспользуемые UI:
- `src/components/profile/ui/ProfileRow.tsx` — строка-кнопка в стиле glass-карточки (icon + label + sublabel + value/toggle/badge/chevron).
- `src/components/profile/ui/ProfileSection.tsx` — заголовок секции (`text-[10px] uppercase tracking-[0.15em]`) + flex-колонка строк со скруглением группы.
- `src/components/profile/ui/ProfileStatCard.tsx` — числовая карточка статистики.

Шапка вкладок (`ProfileTabs`):
- Sticky под `PageHeader` (`top-16`), `overflow-x-auto`, скрытый scrollbar, `backdrop-blur` + полупрозрачный фон.
- Активная: текст `text-cosmic-gold`, нижняя подсветка `border-b-2 border-cosmic-gold`; неактивная `text-cosmic-secondary`.
- Кнопки `px-5 py-3 text-[11px] uppercase tracking-widest`.

---

## Этап 1 — Каркас + вкладки «Профиль» и «Духовное»

Файлы:
1. `src/components/profile/ui/ProfileRow.tsx`
2. `src/components/profile/ui/ProfileSection.tsx`
3. `src/components/profile/ui/ProfileStatCard.tsx`
4. `src/components/profile/ProfileTabs.tsx` — горизонтальные вкладки (state в URL `?tab=` или локально).
5. `src/components/profile/ProfileIdentityTab.tsx`
   - Аватар с кольцом + кнопка редактирования (используем `usePhotoUpload`).
   - Имя, ранг + энергия (из `useUserProgress`).
   - 3 stat-карточки: дни в приложении, активные пакты, звонки.
   - Прогресс до следующего ранга (пороги 0/300/700/1500/3000) — bar в стиле `from-cosmic-gold`.
   - Секции: «Личные данные» (имя, дата рождения, цель, аватар), «Язык и регион» (язык → `/language`, таймзона), «Достижения» → `/achievements`.
6. `src/components/profile/ProfileSpiritualTab.tsx`
   - Астро-карточка (зодиак, стихия, планета, модальность) — переиспользуем `utils/zodiac.ts` / `zodiacTraits.ts`.
   - Нумерология — `utils/numerologyUtils.ts` (судьба/душа/личность/год).
   - Секции «Звонки» (минуты — `useCallMinutes`, всего сессий, история → `/lyra/history` если маршрут есть, иначе `/universe`).
   - Секции «Пакты» (активные/лучший streak/завершённые) — данные из существующего стора.
7. `src/pages/ProfilePage.tsx` — переписать: `StarField`, `PageHeader title="Профиль/Profile/Perfil"`, `ProfileTabs`, рендер активной вкладки, плавающая `BottomNavigation`.
8. Минимальные переводы для табов и обоих экранов в `ru.ts/en.ts/es.ts` (`profile.tabs.*`, `profile.sections.*`, `profile.stats.*`, `ranks.*`, `spiritual.*`).

После этапа 1: страница работает, две первые вкладки полностью функциональны, остальные четыре — заглушки «Скоро».

---

## Этап 2 — Вкладки «Подписка», «Уведомления», «Конфиденциальность»

Файлы:
1. `src/components/profile/ProfileSubscriptionTab.tsx`
   - Градиентная карточка Asceta Pro: статус (Pro / Trial / Free) через `useEntitlement`, цена/план через `useRevenueCat`, список фич, кнопки Upgrade/Manage + History.
   - Секция «Детали» (только если Pro): дата следующего списания, способ оплаты, авто-продление (toggle — пока локально, persist в `profiles` если есть колонка, иначе TODO-заметка).
   - Секция «Минуты»: прогресс минут (`useCallMinutes`), кнопка «Купить минуты» с badge.
   - Секция «Другое»: восстановить покупки, реферал, сравнить планы → `/comparison`.
2. `src/components/profile/ProfileNotificationsTab.tsx`
   - Локальный state + сохранение в `profiles` (одно JSONB поле `notification_settings`) с debounce 500мс. Если колонки нет — добавим миграцией (`alter table profiles add column notification_settings jsonb default '{}'::jsonb`).
   - 5 секций (Пакты / Звонки / Миссии / Гороскоп / Подписка) с тогглами; время напоминания пактов — отдельная строка-пикер (input type="time").
   - Интеграция с существующим `PushNotificationManager` / `usePushNotifications` (если нет хука — оставить TODO, тогглы всё равно пишут в БД).
3. `src/components/profile/ProfilePrivacyTab.tsx`
   - Аналитика / crash-reports (тогглы, локальный state + localStorage).
   - Память звонков: тоггл «хранить историю», кнопка «Очистить историю» (delete из `call_summaries` для `user_id`), предупреждение.
   - Документы → `/privacy-policy`, `/terms`, `/licenses` (последний — TODO если нет страницы).
   - Поддержка: mailto, rate (Capacitor App store link), Share (`webShare.ts`).
   - О приложении: версия из `package.json` через Vite `import.meta.env`.
4. Миграция: добавить `notification_settings jsonb`, `privacy_settings jsonb`, `timezone text` в `public.profiles` (если их ещё нет).
5. Переводы `subscription.*`, `notifications.*`, `privacy.*` в трёх языках.

---

## Этап 3 — Вкладка «Аккаунт», финальная подчистка

Файлы:
1. `src/components/profile/ProfileAccountTab.tsx`
   - Email, смена пароля, подключённые провайдеры (Apple/Google) — статус из `user.app_metadata.providers`.
   - Экспорт данных: собираем выборки из таблиц пользователя → JSON → `Share.share` / download blob.
   - Sign out (через AlertDialog) + очистка стора.
   - «Опасная зона» в красной рамке: «Очистить все данные» и «Удалить аккаунт» (вызов существующего `/delete-account` или `batch_delete_user_data` RPC).
2. Удалить устаревшие компоненты, которые перестали использоваться:
   - `src/components/ProfilePage/ProfileSection.tsx` (старый), `LanguageSelector.tsx`, `LegalDocuments.tsx`, `LogoutButton.tsx`, `SubscriptionManager.tsx` — если ни одна страница больше не импортирует.
   - Перепроверить `AccountSettingsPage.tsx`: либо удалить и редиректить на `/profile?tab=account`, либо оставить как deep-link, переведя на новые компоненты.
3. Финальные переводы `account.*` + ревизия всех ключей в `ru/en/es`.
4. Проверка маршрутов в `AppRouter.tsx` (deep-link `/profile?tab=subscription` и т.п.).

---

## Технические детали / решения

- **Состояние вкладок**: `useSearchParams` (`?tab=identity`) — позволяет deep-link и сохраняется при навигации назад.
- **Tabs UI**: чистый Tailwind, без `@/components/ui/tabs` (там radix с другим стилем) — нужен горизонтальный скролл + sticky.
- **Иконки**: `lucide-react` — `User, Calendar, Target, Image, Globe, Clock, Trophy, Sparkles, Hash, Phone, BookOpen, Flame, Zap, CheckCircle, Crown, CreditCard, RefreshCw, Plus, Gift, Users, BarChart, Bell, AlertTriangle, Sun, Moon, Timer, BarChart2, Bug, Lock, Trash2, FileText, ScrollText, Scale, MessageCircle, Star, Share2, Info, Mail, Key, Apple, Chrome, Package, LogOut`.
- **Цветовые карты иконок**: `gold → cosmic-gold`, `purple → cosmic-accent`, `blue → cosmic-deep-blue`, `green → emerald-400`, `red → rose-500`, `gray → cosmic-secondary`.
- **Не трогаем**: `supabase/client.ts`, `supabase/types.ts`, `.env`, `capacitor.config.ts`, `ios/`, `android/`, логику пактов, RevenueCat конфиг.
- **БД-миграции** (только в этапе 2): добавление nullable JSONB-полей с дефолтами — безопасно для существующих данных.

После этапа 3 страница профиля полностью соответствует визуальному языку Asceta и закрывает все 6 разделов.
