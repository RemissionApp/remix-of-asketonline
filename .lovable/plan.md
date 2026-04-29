# План: устойчивая авторизация и подготовка к Android/iOS

## Часть 1. Найденные проблемы авторизации

После полного прохода по `useAuthFlow`, `AuthBootstrap`, `authSlice.loadUserProfile`, `onboardingSlice.loadOnboardingState`, `PublicRoute`, `ProtectedRoute`, `WelcomePage`, `LoginPage`:

1. **Нет «sticky» загрузки профиля.** `loadUserProfile` обёрнут в `try/catch`. Если *главный* запрос к `profiles` упадёт сетью / RLS / гонкой токена — состояние `userProfile` и `profileStepCompleted` остаются дефолтными (`name=''`, `false`), и `useAuthFlow` навсегда уходит в `needs_profile` → редирект на `/profile-setup` вместо `/main`. Нет ни ретраев, ни «не сбрасывать ранее загруженный профиль».
2. **Гонка с RLS на холодном старте.** В `useAuthFlowBootstrap` `getSession()` вызывается *после* `onAuthStateChange`. Listener при `INITIAL_SESSION` уже триггерит `setUser` + `hydrateForUser`, и параллельный `getSession` может вызвать второй `hydrateForUser` до того, как токен прогрелся. На вебе это иногда приводит к `auth.uid() = null` в первом запросе.
3. **Флаг `__authFlowReady` ставится только в финальном `finally` инициализации.** Пока `getSession()` висит, весь UI заперт в загрузчике `AuthBootstrap`. Если сеть медленная, пользователь видит спиннер 5-10 сек вместо мгновенного редиректа.
4. **`onboardingSlice.loadOnboardingState`** вызывает `Promise.all` с `single()`. Если вторая `single()` упадёт (PGRST116 обрабатывается, но любая 401/timeout — нет), функция бросит исключение, и `profileStepCompleted` *не* обновится из БД, даже если в `profiles` он `true`. На чёрный день это и есть «авторизация не работает».
5. **Нет дедупликации hydrate.** `SIGNED_IN`, `INITIAL_SESSION`, `TOKEN_REFRESHED` могут вызывать `hydrateForUser` параллельно — две одновременные загрузки профиля.
6. **Главная страница не предзагружается.** Когда пользователь уже авторизован и заходит на `/`, `WelcomePage` сначала рендерит спиннер, потом редиректит. Нужно: если статус ≠ `unauthenticated` — сразу `<Navigate to="/main">` (или target).
7. **`emailConfirmed` инициализируется в false** — не критично, но при `onAuthStateChange(SIGNED_IN)` не выставляется в true автоматически из `session.user.email_confirmed_at`.

## Часть 2. Изменения в коде (что делаем)

### 2.1 `src/hooks/useAuthFlow.ts`
- В `useAuthFlowBootstrap`:
  - Сначала `getSession()` синхронно → `setUser` + ставим `__authFlowReady=true` *немедленно*, **до** загрузки профиля. Так UI сразу узнаёт «есть юзер» и роуты уже могут редиректить.
  - Потом `hydrateForUser()` в фоне.
  - В `onAuthStateChange` дедупим: храним `lastHydratedUserId` в ref, не вызываем `hydrate` повторно для того же uid, если уже идёт загрузка.
  - На `INITIAL_SESSION` НЕ дублируем hydrate (его сделал блок `getSession`).
- Авто-выставление `emailConfirmed` из `session.user.email_confirmed_at`.

### 2.2 `src/store/slices/authSlice.ts` — устойчивый `loadUserProfile`
- Добавить параметр `{ silent?: boolean }`.
- Главный запрос `profiles` обернуть в **3 попытки с экспоненциальным бэкоффом** (300/600/1200 мс) — это лечит гонку токена/RLS.
- **Никогда не затирать существующий валидный `userProfile`**: если запрос упал, а в сторе уже есть `userProfile.name && userProfile.birthDate` — оставляем как есть.
- `profileStepCompleted` вычисляем как `prev || dbValue` (sticky), как уже сделано для onboarding.
- Если профиль *найден* и `name && birth_date` — мгновенно `set({ profileStepCompleted: true })` даже если в БД флаг ещё `false` (фолбэк-эвристика, чтобы не зацикливаться на `/profile-setup`).
- Все «вторичные» запросы (`subscriptions`, `achievements`, `missions`, horoscope) уже best-effort — оставляем, но выносим в **`Promise.allSettled`** параллельно, чтобы не серилизовать ожидание.

### 2.3 `src/store/slices/onboardingSlice.ts`
- Заменить `Promise.all([profile, onboarding])` на `Promise.allSettled` + индивидуальный обработчик ошибок для каждого, чтобы падение одного не отменяло обновление флагов из второго.
- Sticky-merge уже есть — оставляем.

### 2.4 Мгновенная маршрутизация авторизованного юзера
- `WelcomePage`, `LanguagePage`, `LoginPage`, `PublicRoute`: убрать ожидание `status === 'initializing'` для случая, когда уже есть `user` в сторе. Логика в `useAuthFlow`: если `user` есть — статус сразу не `initializing`, а минимум `needs_profile` (мы безопасно редиректим на `/profile-setup` или `/main`).
- В `AuthBootstrap` показывать спиннер только когда **нет user** и **getSession** ещё не отработал. Если сессия уже восстановилась — рендерим детей сразу, профиль догрузится в фоне.
- Профиль грузится в фоне → пользователь сразу видит `/main`. Если профиль ещё не подъехал, `useAuthFlow` временно вернёт `needs_profile`, поэтому добавим **«grace period»**: первые ~2 сек после bootstrap не редиректим с защищённых роутов, если идёт загрузка профиля. Реализуем флагом `profileLoading` в сторе и проверкой в `ProtectedRoute`.

### 2.5 `ProtectedRoute`
- Учесть `profileLoading`: если идёт первая загрузка — рендерить детей (или мини-лоадер на месте контента), не редиректить.

## Часть 3. Что нужно доделать перед сборкой Android/iOS

Не входит в этот PR, но критично — фиксируем чек-лист, согласуем приоритеты:

### 3.1 Capacitor / нативная конфигурация
- **`capacitor.config.ts`**: убрать ничего лишнего (ок), добавить `ios.contentInset: 'always'`, `android.allowMixedContent: false`, удалить dev-`server.url` из `ios/App/App/capacitor.config.json` и `android/.../assets/capacitor.config.json` перед релизом (сейчас там захардкожен `http://169.254.170.36:8080` — это убьёт прод-сборку).
- **Deep links / OAuth callback**: в `AndroidManifest.xml` и `Info.plist` нет `intent-filter`/`CFBundleURLTypes` для схемы `com.asket.cosmicascension://` и `https://asket.app/auth/callback`. Без этого OAuth-возврат на устройство не работает. Добавить:
  - Android: `<intent-filter>` с `BROWSABLE/DEFAULT` + `data scheme="com.asket.cosmicascension"` и App Links для `https://asket.app`.
  - iOS: `CFBundleURLTypes` + `Associated Domains` (`applinks:asket.app`).
- **Permissions**:
  - Android: добавить `POST_NOTIFICATIONS` (Android 13+), `RECORD_AUDIO` (для ElevenLabs voice), `VIBRATE`, `WAKE_LOCK`.
  - iOS Info.plist: `NSMicrophoneUsageDescription`, `NSUserNotificationsUsageDescription` (push), `NSPhotoLibraryUsageDescription` (если аватар из галереи), `ITSAppUsesNonExemptEncryption=false`.

### 3.2 Плагины Capacitor, которые нужны но не установлены
- `@capacitor/push-notifications` (push сейчас только web)
- `@capacitor/local-notifications` (для напоминаний об аскезах)
- `@capacitor/preferences` (заменить часть localStorage на безопасное хранилище)
- `@capacitor/app` уже есть → подключить deep-link listener в `useAuthFlowBootstrap`
- `@capacitor/splash-screen` (есть конфиг, нужен пакет)
- `@capacitor/keyboard` (для поправки `viewport` при OTP-вводе)
- `capacitor-secure-storage-plugin` или `@capacitor-community/secure-storage` для хранения Supabase-сессии (сейчас она в localStorage WebView — стирается ОС при очистке кеша)

### 3.3 Supabase auth для нативных приложений
- **Supabase storage adapter**: на native подменить `localStorage` Supabase-клиента на `Capacitor Preferences` / SecureStorage. Без этого пользователь будет каждый раз логиниться заново после рестарта приложения.
- В `src/integrations/supabase/client.ts` это автоген — обернуть через **отдельную инициализацию** или PATCH через `supabase.auth.setSession` + кастом-стораж.
- OAuth (Google/Apple) на iOS требует Sign in with Apple (App Store правило 4.8). Сейчас только Email+OTP — допустимо, но Apple Sign In крайне желателен.

### 3.4 RevenueCat / биллинг
- Webhook и cron уже есть. Доделать в дашборде: продукты `pro_monthly`/`pro_yearly` с 3-day intro trial в App Store Connect и Google Play Console (вы уже знаете).
- Заменить web-обращения «купить» на `presentPaywall()` на native — частично сделано в `TrialBanner`, проверить остальные точки.

### 3.5 PWA service worker не должен мешать native
- В native-сборке не регистрировать `sw.js` (в `main.tsx` обернуть `registerServiceWorker()` в `if (!Capacitor.isNativePlatform())`).
- Сейчас регистрируется всегда → внутри WebView это безвредно, но кеш `cosmic-path-v1.0.0` ломает hot-reload и потенциально маскирует обновления JS-бандла.

### 3.6 Сетевые запросы и CORS
- Все edge-функции уже с CORS. Для native добавить в Info.plist `NSAppTransportSecurity` (по умолчанию ок, но ElevenLabs WSS нужно проверить) и `NSExceptionDomains` если потребуется.

### 3.7 Иконки/Splash
- Иконки для iOS/Android есть в `AppIcons (3)` — нужно прогнать через `cordova-res` / `@capacitor/assets` и сгенерировать все размеры, заменить плейсхолдеры в `ios/App/App/Assets.xcassets/AppIcon.appiconset` и `android/app/src/main/res/mipmap-*`.

### 3.8 Безопасность
- `cleanupAuthState()` стирает все `sb-*` ключи — на native это сломает SecureStorage. После перехода на нативный сторадж переписать функцию через `Preferences.clear()` для auth-ключей.
- Удалить из `disable_triggers.sql` (валяется в корне) — выглядит как временный файл.

### 3.9 Сборка
- `package.json` без скрипта `cap:sync`. Добавить:
  ```json
  "cap:sync": "vite build && cap sync",
  "ios": "vite build && cap sync ios && cap open ios",
  "android": "vite build && cap sync android && cap open android"
  ```
- Подтянуть отсутствующие плагины через npm.

## Что я сделаю прямо сейчас (после approve)

Только **Часть 2** (устойчивая авторизация + мгновенный редирект на `/main`). Чек-лист native (Часть 3) — отдельными задачами по вашему приоритету.

Файлы под правку:
- `src/hooks/useAuthFlow.ts`
- `src/store/slices/authSlice.ts`
- `src/store/slices/onboardingSlice.ts`
- `src/components/auth/AuthBootstrap.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/PublicRoute.tsx`
- `src/pages/WelcomePage.tsx`, `src/pages/LoginPage.tsx` — мелкие правки (убрать локальный спиннер, доверять `useAuthFlow`)

После аппрува — реализую и покажу краткий отчёт + предложу следующим шагом взять Часть 3 (Android/iOS).
