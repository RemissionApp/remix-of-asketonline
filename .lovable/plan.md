# Этап 4: Биллинг RevenueCat + автосписание после триала

## Цены (зафиксированы)
- **Месячная подписка**: $9.99 / месяц
- **Годовая подписка**: $99.99 / год (экономия ~17%)
- **Триал**: 3 дня полного доступа для всех новых пользователей

## Что будет сделано

### 1. Конфигурация RevenueCat (инструкция пользователю)
В дашборде RevenueCat нужно создать/проверить:
- Продукты в App Store Connect и Google Play:
  - `pro_monthly` — $9.99/мес с 3-day free trial
  - `pro_yearly` — $99.99/год с 3-day free trial
- Один Offering `default` с двумя Package: `$rc_monthly` и `$rc_annual`
- Entitlement `pro` привязан к обоим продуктам
- 3-дневный free trial настраивается на уровне Introductory Offer в App Store Connect / Base Plan в Google Play (RevenueCat сам подхватит)

Я подготовлю короткий чек-лист в `REVENUECAT_PAYWALL_SETUP.md`.

### 2. UI Paywall (`src/components/PaywallScreen.tsx` — новый)
Полноэкранный экран с двумя тарифами:
- Карточка «Год» — $99.99, бейдж «Выгоднее на 17%», подсветка как рекомендуемая
- Карточка «Месяц» — $9.99
- Подзаголовок: «3 дня бесплатно, потом $X. Отмена в любой момент.»
- Кнопки: «Начать бесплатно» (вызывает `purchasePackage`), «Восстановить покупки», ссылки на Terms/Privacy
- Цены подтягиваются из `offerings[0].availablePackages` через `pkg.product.priceString` (локализованные)

### 3. TrialBanner (доработка)
- Показывается на `MainPage` пока `isTrialActive && !isPro`
- Текст: «Триал: осталось N дн. M ч. Привяжите оплату, чтобы не потерять доступ»
- Кнопка → открывает `PaywallScreen`
- За 24ч до конца триала — красная подсветка + push-напоминание (через существующий `pushNotificationService`)

### 4. Soft Paywall после истечения триала
- Хук `useEntitlement` уже возвращает `isUnlocked = isPro || isTrialActive`
- Когда триал истёк и нет подписки → `MainPage` показывает блокирующий `PaywallScreen` поверх контента (а не отдельные оверлеи на каждой фиче)
- На web — кнопка «Открыть в приложении» (RevenueCat работает только нативно)

### 5. Edge Function `revenuecat-webhook`
Файл: `supabase/functions/revenuecat-webhook/index.ts`
Принимает события от RevenueCat (`INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `EXPIRATION`, `BILLING_ISSUE`):
- Обновляет `subscriptions` (is_pro, status, product_id, subscription_end, original_transaction_id)
- Обновляет `profiles.payment_method_attached = true` при `INITIAL_PURCHASE`
- Проверяет подпись через секрет `REVENUECAT_WEBHOOK_AUTH`
- `verify_jwt = false` в config.toml для этой функции

В RevenueCat Dashboard → Integrations → Webhooks указать URL:
`https://pbemnbaapzuwimlwelut.supabase.co/functions/v1/revenuecat-webhook`

### 6. Edge Function `expire-trials` + cron
Файл: `supabase/functions/expire-trials/index.ts`
Раз в час:
- Находит профили где `trial_ends_at < now()` и `payment_method_attached = false` и `subscriptions.is_pro = false`
- Помечает `subscriptions.status = 'expired'`
- На фронте `useEntitlement` сам перестаёт давать доступ

`pg_cron` job на каждый час (через insert tool, не миграция).

### 7. Синхронизация при старте приложения
В `revenueCatSlice.initialize()` после получения `customerInfo`:
- Если `entitlements.active.pro` есть → upsert в `subscriptions` (is_pro=true, product_id, subscription_end)
- Это страхует на случай, если webhook опоздает

### 8. Тексты и i18n
Добавить ключи в `src/i18n/languages/{ru,en,es}.ts`:
- `paywall.title`, `paywall.monthlyPrice`, `paywall.yearlyPrice`, `paywall.trialNotice`, `paywall.cta`, `paywall.restore`, `trial.banner.daysLeft`, `trial.banner.attachCard` и т.д.

## Технические детали

**Секреты, которые попрошу добавить**:
- `REVENUECAT_WEBHOOK_AUTH` — произвольная строка, которую вы укажете в RevenueCat → Webhook → Authorization header

**Что НЕ делаем**:
- Stripe для web не подключаем (вы подтвердили RevenueCat-only)
- На web триал работает, но оплату пользователь сделает только в нативном приложении
- Не трогаем существующие `ProFeatureOverlay` / `PaywallButton` — они уже корректно учитывают `isUnlocked`

## Файлы

**Новые:**
- `src/components/PaywallScreen.tsx`
- `supabase/functions/revenuecat-webhook/index.ts`
- `supabase/functions/expire-trials/index.ts`

**Изменения:**
- `src/components/TrialBanner.tsx` — кнопка → PaywallScreen, красный режим за 24ч
- `src/pages/MainPage.tsx` — рендер PaywallScreen когда триал истёк
- `src/store/slices/revenueCatSlice.ts` — sync с `subscriptions` после initialize
- `supabase/config.toml` — `verify_jwt = false` для `revenuecat-webhook`
- `src/i18n/languages/*.ts` — новые ключи
- `REVENUECAT_PAYWALL_SETUP.md` — чек-лист настройки дашборда

## После одобрения
Сначала попрошу добавить `REVENUECAT_WEBHOOK_AUTH`, затем выполню всё одной волной.
