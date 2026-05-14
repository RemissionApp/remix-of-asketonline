## Цель

Подключить встроенные платежи Lovable (Stripe) для веб-версии Asceta, чтобы пользователи могли оформить подписку Pro прямо сейчас в тестовом режиме — без настройки RevenueCat-дашборда и без своего Stripe-аккаунта. RevenueCat остаётся подключённым для iOS/Android.

## Что произойдёт

1. **Включаю встроенные Stripe-платежи** (`enable_stripe_payments`). Lovable автоматически создаст тестовое окружение Stripe — реальные карты не списываются, для тестов используется карта `4242 4242 4242 4242`. Свой Stripe-аккаунт **не нужен**, API-ключи добавлять не нужно. Для приёма реальных платежей позже потребуется только верификация (claim аккаунта).
2. **Спрошу про налоги.** Stripe-интеграция Lovable поддерживает три режима: полная обработка налогов (Stripe = merchant of record, +3.5%), только расчёт налогов (+0.5%), или без налоговой автоматизации. Для цифровой подписки на международную аудиторию обычно подходит вариант 1.
3. **Создам товары** (`batch_create_product`):
   - `Asceta Pro Monthly` — месячная подписка
   - `Asceta Pro Annual` — годовая подписка
   Цены ты назовёшь после включения (например, $4.99/мес и $39.99/год).
4. **Реализую веб-чекаут**:
   - edge-функция `create-checkout` — создаёт Stripe Checkout Session и возвращает URL
   - edge-функция `stripe-webhook` — слушает `checkout.session.completed` / `customer.subscription.updated` / `deleted` и обновляет таблицу `subscriptions` (`is_pro`, `status`, `subscription_end`)
   - edge-функция `customer-portal` — открывает Stripe Customer Portal для управления подпиской
5. **Переписываю веб-ветку оплаты** в `FeatureComparison.tsx`, `TrialExpiredGate.tsx`, `ProfileSubscriptionTab.tsx`, `PaywallButton.tsx`:
   - вместо `useWebBilling` (RevenueCat Web) используется новый хук `useStripeCheckout`
   - кнопки «Месяц» / «Год» вызывают `create-checkout` и редиректят на `session.url`
   - после успеха Stripe редиректит на `/comparison?success=true` → дергаем `refresh-entitlement` → разблокируем Pro
   - native-ветка (Capacitor) **не меняется** — там по-прежнему RevenueCat
6. **Удаляю мёртвый веб-код RevenueCat**:
   - `src/utils/revenueCatWeb.ts`, `src/hooks/useWebBilling.ts`
   - пакет `@revenuecat/purchases-js` из `package.json`
   - sandbox-ключ `rcb_sb_...` из репозитория

## Технические детали

**Архитектура entitlement:**
- Источник истины — таблица `public.subscriptions` (уже есть). Webhook обновляет `is_pro=true`, `status='active'`, `subscription_end=period_end`.
- `useEntitlement` уже читает `subscriptions` → `isPro` → `isUnlocked`. Менять не надо.
- На native — `revenuecat-webhook` (уже есть) пишет в ту же таблицу. Двойной источник работает корректно: чьё событие пришло позже, тот и побеждает.

**Edge-функции (`verify_jwt = false` где нужно для webhook):**
- `create-checkout` — JWT обязателен, берёт `auth.uid()`, ищет/создаёт Stripe Customer по email, создаёт subscription mode session с `client_reference_id=user_id` и `metadata.user_id`.
- `stripe-webhook` — `verify_jwt=false`, проверяет подпись через `STRIPE_WEBHOOK_SECRET`, апдейтит `subscriptions` через service role.
- `customer-portal` — JWT обязателен, возвращает billing portal URL.

**Секреты, которые добавит Lovable автоматически после `enable_stripe_payments`:**
`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`. Вручную ничего вводить не надо.

**Что НЕ трогаю:**
- `src/integrations/supabase/client.ts`, `types.ts`
- `capacitor.config.ts`, `.env`, `ios/`, `android/`
- RevenueCat-логика для native (`useRevenueCat`, `revenueCatSlice`, `revenuecat-webhook`)
- Таблицы БД — текущая схема `subscriptions` достаточна

## После плана

После твоего одобрения я:
1. Вызову `enable_stripe_payments` (это откроет короткую форму — заполни email и имя, можно использовать алиас `you+asceta@…`).
2. Спрошу про налоговый режим и цены подписок.
3. Создам товары и весь код одним заходом.