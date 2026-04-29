## Цель
Заменить текущую модель «бесплатно с ограничениями + PRO» на **3-дневный полный trial**: новый пользователь получает все функции без блокировок, а на 3-й день со старта триала автоматически списывается оплата (или подписка отменяется, если способ оплаты не привязан).

## Этап 1. Снять блокировки со всех функций (быстрая ценность)

Сейчас `isPro` управляет показом `ProFeatureOverlay`, `PaywallButton`, лимитов и блюра контента в ~30 файлах. Чтобы пользователь видел всё, делаем единый источник правды — `useEntitlement()`, который возвращает `isUnlocked = isPro || isTrialActive`.

- Создать хук `src/hooks/useEntitlement.ts`:
  - `isTrialActive` — `trial_ends_at > now()`
  - `isUnlocked` — `isPro || isTrialActive`
  - `daysLeft`, `hoursLeft` для UI
- Обновить компоненты-блокировщики так, чтобы при `isUnlocked` они **рендерили детей напрямую**, без overlay/blur/CTA:
  - `ProFeatureOverlay`, `PaywallButton`, `HoroscopeProOverlay`, `UniverseChatProWrapper`, `UniverseMessageBlock`, `BriefHoroscopeDisplay`, `MeditationCard`, `NumerologyPreview`, `UniverseChatPreview`
- Снять дневные лимиты (`useDailyLimits`, edge `check-daily-limits`) на время триала: возвращать `unlimited: true`.
- В `BottomNavigation`, `MainPage`, `MeditationPage`, `NumerologyPage`, `CallPage`, `UniversePage`, `DetailedHoroscopePage` убрать ветки «показать paywall».

## Этап 2. База данных: trial-поля

Миграция:
```sql
ALTER TABLE public.profiles
  ADD COLUMN trial_started_at timestamptz DEFAULT now(),
  ADD COLUMN trial_ends_at timestamptz DEFAULT (now() + interval '3 days'),
  ADD COLUMN payment_method_attached boolean DEFAULT false;

ALTER TABLE public.subscriptions
  ADD COLUMN trial_ends_at timestamptz,
  ADD COLUMN status text DEFAULT 'trialing'  -- trialing | active | past_due | canceled
    CHECK (status IN ('trialing','active','past_due','canceled'));
```
Обновить `handle_new_user()` чтобы вместе с профилем создавалась запись `subscriptions` со `status='trialing'` и `trial_ends_at = now()+3 days`.

## Этап 3. UI триала

- Новый компонент `TrialBanner` в `TopBar`/`MainPage`: «Полный доступ ещё N дней Ч часов. Привяжите карту, чтобы продолжить после триала».
- Кнопка «Привязать карту» открывает paywall (RevenueCat на нативе / заглушка на web).
- На последнем дне (≤24ч) баннер становится акцентным (warning).
- Если `payment_method_attached=false` и trial истёк → показывать мягкий paywall и блокировать только тогда.

## Этап 4. Автосписание на 3-й день

Поскольку фактическое списание делает платёжный провайдер (RevenueCat/Stripe), наша задача — корректно сконфигурировать подписку с trial-периодом и обработать вебхуки.

- В RevenueCat-офферинге включить **3-day free trial** на пакет (настройка в дашборде продукта; код передаёт `package` как есть — менять не нужно).
- Edge-функция `trial-status` (новая): возвращает текущее состояние триала по `user_id` для клиента, чтобы UI не зависел от времени устройства.
- Edge-функция `revenuecat-webhook` (новая, `verify_jwt = false`): обрабатывает события `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `BILLING_ISSUE` → апдейтит `subscriptions.status` и `profiles.is_pro`-эквивалент.
- Cron `pg_cron` ежечасно: для записей со `status='trialing' AND trial_ends_at < now() AND payment_method_attached=false` ставит `status='canceled'`. Это страховка на случай, если вебхук не пришёл.

## Этап 5. Web fallback (важно)

RevenueCat работает только на нативе. Для web-превью:
- Триал «работает» по `trial_ends_at` из БД.
- По истечении триала на web — мягкий экран «Скачайте приложение, чтобы продолжить» (без жёстких блокировок отдельных фич, единый paywall-route).

## Этап 6. Очистка

- Убрать `DeveloperSwitch` тоггл `isPro` из продакшен-сборки (оставить только в dev).
- Обновить `FeatureComparison` — теперь это страница-описание тарифа, без кнопок «разблокировать» в каждой фиче.
- Тексты: «PRO» → «Полный доступ», «Откройте PRO» → «Управлять подпиской».

## Что нужно от вас перед стартом
1. Подтвердите: на iOS/Android используем RevenueCat (текущий стек), или хотите Stripe для web-оплаты тоже?
2. Цена и период подписки (например, 299₽/мес) — для текстов баннера.
3. На время разработки **сразу разблокировать всё для всех существующих пользователей** (поставить им `trial_ends_at = now()+3 days`)?

## Технические детали (для разработки)
- Файлы для правок (Этап 1): `src/components/ProFeatureOverlay.tsx`, `PaywallButton.tsx`, `HoroscopeProOverlay.tsx`, `UniverseChatProWrapper.tsx`, `UniverseMessageBlock.tsx`, `BriefHoroscopeDisplay.tsx`, `MeditationCard.tsx`, `MeditationHeader.tsx`, `ProFeatures/*`, `BottomNavigation.tsx`, `DailyUsageStats.tsx`, страницы `Meditation*`, `Numerology*`, `Universe*`, `Call*`, `DetailedHoroscope*`.
- Новые: `src/hooks/useEntitlement.ts`, `src/components/TrialBanner.tsx`, `supabase/functions/trial-status`, `supabase/functions/revenuecat-webhook`.
- Миграция БД + обновление `handle_new_user`.
- Backfill-INSERT для существующих пользователей.
