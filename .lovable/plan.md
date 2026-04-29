
# План: устранение замечаний аудита (3 этапа)

Цель — закрыть все 12 пунктов из аудита, не ломая текущий auth/onboarding flow и совместимость с Capacitor 7. Объём поделён на 3 коммита: сначала самое опасное (бюллетень подписок и сборка), затем нативные интеграции (Apple Sign-In, push), затем производительность и чистка.

## Этап 1 — Блокеры подписок и сборки

Цель: исправить ошибки, из-за которых пользователи получают незаслуженный PRO и из-за которых возможен сбой нативной сборки.

### 1.1 RevenueCat — логика подписки
Файл: `src/store/slices/revenueCatSlice.ts`
- Удалить ветку `hasPurchasedProducts` из `checkActiveSubscription` — оставить только активные `entitlements.active` и `activeSubscriptions`. Историческая покупка/рефанд больше не открывает PRO.
- Исправить опечатку `'asket_premium_montly'` → `'asket_premium_monthly'` (оставить старый ID как fallback на 1 релиз для уже активных пользователей).
- Не сохранять полный `customerInfo` в `partialize` (zustand persist) — оставить только `hasActiveSubscription`, `lastInitializedUserId`, `isInitialized`. Полный объект всегда подгружается из RevenueCat при старте.
- Снять `console.log` уровня DEBUG (оставить `console.warn/error`).

### 1.2 RevenueCat — service
Файл: `src/utils/revenueCat.ts`
- `LOG_LEVEL.DEBUG` → `LOG_LEVEL.INFO` в production (`import.meta.env.DEV` для DEBUG).
- Ключи остаются в исходнике (по решению пользователя — это публичные SDK-ключи RevenueCat).
- `checkBillingAvailability()` — кешировать результат на время сессии, чтобы не делать второй `getOfferings()`.

### 1.3 Capacitor preferences — версия
Файл: `package.json`
- Понизить `@capacitor/preferences` с `^8.0.1` на `^7.0.1` — соответствие Capacitor 7. `nativeSessionBridge.ts` API не меняется.

### 1.4 Vite / bundle
Файл: `vite.config.ts`
- Перенести `vitest` из `dependencies` в `devDependencies` (`package.json`).
- Добавить `manualChunks` для разделения vendor-пакетов: `react`, `radix-ui`, `supabase`, `revenuecat`, `recharts`. Уберёт огромный single-chunk warning.
- Оставить `chunkSizeWarningLimit: 1000`.

### 1.5 Capacitor config
Файл: `capacitor.config.ts`
- Удалить блок `SafeArea` из `plugins` (плагин не установлен) ИЛИ доустановить `@capacitor-community/safe-area`. Выберу удаление, потому что safe-area уже частично делается через CSS env(safe-area-inset-*).
- Добавить `server.androidScheme: 'https'` и `server.iosScheme: 'app.lovable.5484cc75896e42e9a5fffef3bd09c812'` (под deep links для OAuth, который уже подготовлен в `nativeDeepLinks.ts`).

---

## Этап 2 — Apple Sign-In (гибрид) и Push notifications

### 2.1 Apple Sign-In: нативно на iOS, Lovable OAuth на Android/web
Установить `@capacitor-community/apple-sign-in`.

Новый файл: `src/utils/appleSignIn.ts`
- Функция `signInWithApple()`:
  - На iOS (`Capacitor.getPlatform() === 'ios'`):
    - Вызвать `SignInWithApple.authorize({ clientId: 'com.asket.cosmicascension', redirectURI: <supabase callback>, scopes: 'email name', nonce, state })`.
    - Передать `identityToken` в `supabase.auth.signInWithIdToken({ provider: 'apple', token, nonce })`.
  - На Android и web: использовать `lovable.auth.signInWithOAuth('apple', { redirect_uri: window.location.origin })`. Если интеграция Lovable Cloud auth не подключена — этот шаг попросит пользователя подключить Apple через инструмент `configure-social-login` (выполнится в build-mode).

Кнопка Apple добавляется на `src/pages/LoginPage.tsx` рядом с Google.

Манифесты (только iOS, делается в build-mode):
- `ios/App/App/Info.plist` — заявка `Sign in with Apple` capability будет включена через Xcode после `npx cap sync` (отметим в инструкции пользователю; в проекте через `cap sync` capability не активируется автоматически — пользователь активирует в Xcode → Signing & Capabilities → +Capability → Sign in with Apple).

### 2.2 Push notifications
Файл: `src/utils/notifications/pushNotificationService.ts`
- Заменить `import { supabase } from '@/lib/supabase'` на `from '@/integrations/supabase/client'` (уйдёт `any`).
- Установить `@capacitor/push-notifications@^7` (соответствие Capacitor 7).
- Добавить retry с exponential backoff (3 попытки) для регистрации FCM/APNs токена в Supabase.
- Клиентский rate-limit: не отправлять token-update чаще, чем 1 раз в 60 секунд (in-memory throttle).

### 2.3 Realtime trial expiry
Файл: `src/hooks/useEntitlement.ts`
- Подписаться на `supabase.channel('profiles:trial').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: 'id=eq.<userId>' })` — обновлять `trialEndsAt` без перемонтирования.
- Добавить `setInterval(60_000)` для пересчёта `isTrialActive` локально (на случай, если реалтайм пропущен).

Миграция БД: `ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;` (если ещё не добавлена). Проверю и добавлю при необходимости.

---

## Этап 3 — Производительность и чистка

### 3.1 StarField (`src/components/full-horoscope/MovingStarField.tsx` и аналогичный StarField)
- Полностью убрать инжект 60+ `<style>` тегов. Перевести на:
  - Один глобальный CSS-файл с 4 шаблонными keyframe-наборами (slow/medium/fast × float/twinkle).
  - Звёздам присваиваются классы из этих наборов, индивидуальные параметры (позиция, размер, цвет) — через inline `style`.
- Все `Math.random()` уже в `useMemo` — но также убрать оставшийся `Math.random()` из inline-вычисления opacity (если есть). Перепроверю.
- Убрать `backgroundAttachment: 'fixed'` для iOS WebView (использовать background fixed wrapper с `position: fixed`).
- Заменить hardcoded ссылку на `aewfggzscyjxpuciqtti.supabase.co` (чужой проект) на локальный asset из `public/` или валидный URL текущего Supabase.

### 3.2 Code splitting
Файл: `src/App.tsx`
- Обернуть тяжёлые страницы в `React.lazy()`: `FullHoroscopePage`, `NewMeditationPage`, `MeditationProPage`, `UniverseChatPage`, `CallPage`, `NumerologyPage`, `DetailedHoroscopePage`. Suspense fallback — текущий лоадер.

### 3.3 TrialBanner
Файл: `src/components/.../TrialBanner.tsx` (найду точный путь через rg)
- Заменить прямой вызов `useRevenueCatStore().presentPaywall(...)` на хук `useRevenueCat().presentPaywall(...)` — чтобы ошибки/успех показывались тостами.

### 3.4 Чистка
- `src/lib/supabase.ts` — удалить `as any`-реэкспорт, мигрировать оставшиеся импорты на `@/integrations/supabase/client`. Если call sites слишком много — оставить, но снять `any` через `Database` тип.
- Убрать `console.log` спам в `revenueCatSlice` и `revenueCat.ts` (оставить только warn/error).

---

## Технические заметки

### Что НЕ меняем (по решению пользователя)
- Сессия Supabase остаётся в `localStorage` + текущий `nativeSessionBridge` (зеркало в Keychain/SharedPrefs). `client.ts` не трогаем.
- RevenueCat ключи остаются в `src/utils/revenueCat.ts`.
- `.env` остаётся как есть (это только `VITE_*` публичные ключи Lovable Cloud — их безопасно хранить в репо, как и в любом frontend-проекте).

### Структура коммитов
1. **Этап 1** (1 коммит): `revenueCatSlice.ts`, `revenueCat.ts`, `package.json`, `vite.config.ts`, `capacitor.config.ts`.
2. **Этап 2** (1 коммит): `appleSignIn.ts`, `LoginPage.tsx`, `pushNotificationService.ts`, `useEntitlement.ts`, миграция realtime.
3. **Этап 3** (1 коммит): `MovingStarField.tsx`, `App.tsx` lazy, `TrialBanner.tsx`, чистка `lib/supabase.ts`, удаление логов.

### Ручные действия пользователя после Этапа 2
После `git pull` + `npx cap sync`:
- iOS: открыть `ios/App/App.xcworkspace`, в Signing & Capabilities добавить **Sign in with Apple**.
- Lovable Cloud → Users → Authentication Settings → Sign In Methods → Apple: убедиться, что provider включён (для Android/web).
- Lovable Cloud → Users → Auth Settings → URL Configuration: добавить `app.lovable.5484cc75896e42e9a5fffef3bd09c812://auth/callback` в Redirect URLs (для deep links).

После одобрения плана начну Этап 1.
