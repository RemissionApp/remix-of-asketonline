

## Фикс: убрать ложную ошибку RevenueCat в web-версии + дедупликация инициализации

### Корни проблемы

1. **`@revenuecat/purchases-capacitor` — нативный плагин**, в браузере всегда бросает `Web not supported in this plugin`. Это не баг, а ожидаемое поведение для web. Но `useRevenueCat` показывает destructive toast «Ошибка инициализации», пугая web-пользователей.

2. **Множественная инициализация**: `useRevenueCat(user?.id)` вызывается в нескольких компонентах одновременно (`UniverseMessageBlock`, `OfferingsDisplay`, `SubscriptionManager` и др.) — в логах видно 6 параллельных вызовов `initialize` с одним и тем же `userId`. Каждый бросает ошибку → 6 красных toast'ов.

3. **Нет детекции платформы перед вызовом**: код пытается инициализировать RevenueCat всегда, даже когда `Capacitor.isNativePlatform() === false`.

### План исправления

**Шаг 1 — Детектить нативную платформу в `revenueCatSlice.initialize`**
В `src/store/slices/revenueCatSlice.ts` в начале `initialize()`:
```ts
import { Capacitor } from '@capacitor/core';

if (!Capacitor.isNativePlatform()) {
  console.info('RevenueCat: skipping initialization on web (native-only plugin)');
  set({ isInitialized: false, billingAvailable: false, isLoading: false });
  return;
}
```
Это **тихо** пропускает инициализацию в браузере, без throw, без toast.

**Шаг 2 — Убрать destructive toast из `useRevenueCat`**
В `src/hooks/useRevenueCat.ts` обернуть `initialize(userId).catch(...)` так, чтобы при ошибке `Web not supported` НЕ показывать toast — только в консоль. Реальные ошибки (на нативе) продолжают показываться.

**Шаг 3 — Дедупликация инициализации**
В `revenueCatSlice` добавить guard: если `isInitialized === true` ИЛИ уже идёт `initializingPromise` — возвращать существующий promise вместо повторного вызова. Так 6 параллельных компонентов получат один общий init вместо 6 запросов.

**Шаг 4 — Отметить web как «billing недоступен» консистентно**
- `hasActiveSubscription` в web-режиме должен возвращать `false` (free tier), пока не подключён web-провайдер платежей (Stripe/Paddle).
- `OfferingsDisplay` уже корректно показывает «Google Play Billing недоступен» при `billingAvailable === false` — оставить.

### Файлы под изменение
- `src/store/slices/revenueCatSlice.ts` — добавить platform check + дедупликацию.
- `src/hooks/useRevenueCat.ts` — убрать toast при `Web not supported`.

### Что НЕ трогаем
- Нативную работу RevenueCat (iOS/Android-сборки продолжат работать как раньше).
- UI компоненты PRO (`ProFeatureOverlay`, `PaywallButton`).
- БД таблицу `subscriptions`.

### Дальнейший шаг (отдельным этапом, не сейчас)
Для **web-монетизации** подключить Stripe/Paddle через `payments--recommend_payment_provider` — это даст работающий paywall в браузере и PWA. RevenueCat остаётся для нативных билдов.

### Ожидаемый результат
В web-превью больше нет красного toast «Ошибка инициализации». В консоли — единственное info-сообщение «skipping on web». На нативном Android/iOS RevenueCat работает как раньше, paywall открывается.

