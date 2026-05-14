## Цель

Привести подписку и триал к одной модели:
**`isUnlocked = isPro || isTrialActive`** — единственная проверка во всём приложении.
Бесплатной версии больше нет: 3 дня триала → платная подписка. После окончания триала пользователю автоматически показывается экран оплаты.

---

## 1. Единый источник правды — `useEntitlement`

Переписать `src/hooks/useEntitlement.ts`:
- Источник: только таблица `subscriptions` (БД), плюс `trial_ends_at` из `profiles` как fallback.
- Realtime-подписка на `subscriptions` UPDATE → мгновенный пересчёт.
- Минутный tick для авто-перехода `isTrialActive: true → false` без перезагрузки.
- Возвращает: `isUnlocked, isPro, isTrialActive, isLoading, daysLeft, hoursLeft, isCritical (<24h), trialEndsAt, refetch`.
- Никакого чтения `userProfile.isPro` / `localStorage` для определения статуса.

## 2. Авто-показ paywall после окончания триала

Новый компонент **`TrialExpiredGate`** монтируется в `App.tsx` рядом с `TrialBanner`:
- Слушает `useEntitlement()`.
- Срабатывает один раз, когда `!isLoading && !isPro && trialEndsAt && trialEndsAt <= now` и пользователь авторизован.
- На вебе — модалка-оверлей со страницей подписки (контент `ComparisonPage` без сравнительной таблицы).
- На нативном — `revenueCatStore.presentPaywall()`.
- Пока пользователь не оформил подписку или не закрыл осознанно (кнопка «позже» — допустима только 1 раз/сутки через `localStorage` ключ `trial_expired_dismissed_at`), модалка возвращается при следующем заходе в приложение.
- `ProFeatureOverlay`/`PaywallButton` продолжают работать как fallback на закрытых фичах.

## 3. Чистка `src/store/slices/revenueCatSlice.ts`

- Убрать `hasActiveSubscriptions` (использует `activeSubscriptions` — он надёжен, но дублирует entitlement-проверку; оставляем именно его) и **полностью удалить любые упоминания `allPurchasedProductIdentifiers`** во всём коде.
- Заменить опечатку `'asket_premium_montly'` → `'asket_premium_monthly'` (оставить fallback, как сейчас, с TODO на удаление через 60 дней).
- LOG_LEVEL: `DEBUG` только при `import.meta.env.DEV`, иначе `ERROR`.
- `syncProStatus` пишет `is_pro` только в zustand; запись в `subscriptions` — только через `revenuecat-webhook` (как сейчас, оставить комментарий).

## 4. Удалить экран сравнения «Free vs Pro»

`src/components/FeatureComparison.tsx` — удалить таблицу/карточки сравнения и все упоминания «Бесплатно». Заменить на единый экран **«Asceta Pro»**:
- Заголовок: «Открой полный доступ» / «Подписка активна» (если `isPro`).
- Список фич Pro (без колонки Free).
- Два тарифа: месяц / год (год — рекомендованный, цена и формат из RevenueCat offering).
- На вебе — кнопки оплаты через `useWebBilling`.
- На нативном — кнопка `presentPaywall()`.
- Кнопка «Восстановить покупки» (только нативный).
- Ссылки: Privacy, Terms.
- Если `isPro` — карточка «У вас активная подписка», без кнопок покупки.

`ComparisonPage.tsx` — обёртка остаётся, рендерит обновлённый `FeatureComparison`.

## 5. Чистка применения проверок во всех экранах

Глобально пройти по результатам `grep "isPro|hasActiveSubscription|userProfile?.isPro|allPurchasedProductIdentifiers"` и:
- Заменить `userProfile?.isPro`, `subscription?.is_pro`, `hasActiveSubscription` → `useEntitlement().isUnlocked` (или `.isPro` там, где нужен именно платный статус — это только `ProfileSubscriptionTab` и `ComparisonPage`).
- Удалить `allPurchasedProductIdentifiers`, `'asket_premium_montly'` везде.
- `presentPaywall()` всегда оборачивать: `isNativePlatform() ? presentPaywall() : navigate('/comparison')`.

Затрагиваемые файлы (по результатам grep):
`MainPage`, `TopBar`, `DailyUsageStats`, `LimitIndicator`, `VoiceInputButton`, `DetailedHoroscopePage/Content`, `BriefHoroscopeDisplay`, `HoroscopeProOverlay`, `UniverseChatPage`, `UniverseChatProWrapper`, `QuestionForm`, `NumerologyPage` (через preview-компоненты), `NumerologyPreview`, `UniverseChatPreview`, `useTextToSpeech`, `useOptimizedTextToSpeech`, `useVoiceInput`, `useHoroscopeData`, `useMissionState`, `useEnhancedMissionState`, `useDailyLimits`, `SubscriptionManager` (оба), `SubscriptionBanner`, `ProductionReadinessPanel`, `DeveloperSwitch`, `AuthDebugPanel`, `NumerologyDiagnostic`, `OfferingsDisplay`, `SimplePurchaseButton`, `PaywallButton`, `ProFeatureOverlay`, `TrialBanner`.

Удалить устаревшие компоненты-дубликаты, если не используются: один из двух `SubscriptionManager`, `OfferingsDisplay`, `SimplePurchaseButton`, `SubscriptionBanner` — оставить только то, что реально импортируется.

## 6. `TrialBanner`, `PaywallButton`, `ProFeatureOverlay`

- `TrialBanner`: показывать только при `isTrialActive && !isPro`. Зелёный режим (>24ч) и красный (<24ч).
- `PaywallButton`: скрыть при `isUnlocked`. Web → `/comparison`, Native → `presentPaywall()`.
- `ProFeatureOverlay`: при `isUnlocked` рендерит `children` без блюра. Иначе — блюр + `PaywallButton`.

## 7. `ProfileSubscriptionTab` (модуль подписки в профиле)

- Статус-бейдж: «Активна» (`isPro`) / «Пробный период» (`isTrialActive`) / «Не активна» (после триала).
- Удалить кнопку `manage = presentPaywall()` для уже Pro: показывать «Управление подпиской» → ведёт на нативные настройки (`Capacitor` → магазин) или на `/comparison` на вебе.
- Убрать дублирующую секцию «История» (вела на /comparison) — заменить на «Сравнить тарифы» только если `!isPro`.
- Использовать `isUnlocked` для блока «доступные фичи».

## 8. `expire-trials` edge function

Изменить SQL на безопасную форму: обновлять только записи где
`status = 'trialing' AND is_pro = true AND user_id IN (profiles where trial_ends_at < now AND payment_method_attached = false)`.
(Сейчас код фильтрует по `is_pro = false` — это баг: триал имеет `is_pro = false` и `status = 'trialing'`, нужно сбрасывать `status = 'canceled'` именно для них; флаг `is_pro` остаётся `false`.) Уточнить так:

```sql
UPDATE subscriptions
SET status = 'canceled', updated_at = now()
WHERE status = 'trialing'
  AND user_id IN (SELECT id FROM profiles
                  WHERE trial_ends_at < now()
                    AND payment_method_attached = false);
```

Не трогать `status IN ('active','past_due','canceled')`.

## 9. Финальная проверка трёх сценариев

- **A. Триал активен**: `isUnlocked = true` → нет ни одного `PaywallButton`/`ProFeatureOverlay`/«Купить», TrialBanner зелёный.
- **B. Триал истёк, не Pro**: TrialBanner скрыт, `TrialExpiredGate` открывает paywall, закрытые фичи в overlay, базовые открыты (главный, краткий гороскоп, профиль).
- **C. Активная Pro**: paywall и overlay скрыты везде, `ProfileSubscriptionTab` показывает «Активна», `ComparisonPage` — «Подписка активна».

Verification: `bunx tsc --noEmit`, прогон unit-тестов (`bun test`), ручная проверка в preview по сценариям A/B/C через `DeveloperSwitch`.

---

## Технические заметки

- Не трогать: `src/integrations/supabase/{client,types}.ts`, `capacitor.config.ts`, `.env`, `ios/`, `android/`.
- Не вносить миграций БД (RLS и таблицы соответствуют требуемой логике).
- Web Billing уже подключён (sandbox key `rcb_sb_…`), используется через `useWebBilling`.
- Оставить fallback `'asket_premium_montly'` ещё на 60 дней с пометкой TODO.

После апрува плана выполняю шаги 1 → 9 единым проходом, проверяю TS-компиляцию и поведение в preview.