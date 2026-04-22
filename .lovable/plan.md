

## Полная переработка пути пользователя: регистрация → профиль → онбординг → main

### Корень всех проблем

После глубокого анализа найдено **5 фундаментальных проблем**, из-за которых пользователя «выбрасывает» после регистрации:

1. **Двойной источник истины для onboarding-флагов**. `profile_step_completed` хранится одновременно в двух таблицах (`profiles` И `user_onboarding_state`), и они рассинхронизированы. В UI логика `isProfileComplete()` использует только данные `name+birthDate`, а `authRouter.determineAuthRoute()` требует ОБА условия (`isProfileComplete && profileStepCompleted`). Когда они расходятся — пользователь зацикливается между `/profile-setup` и `/onboarding`.

2. **Бесконечная гонка редиректов**. `AppInitializer`, `AuthGuard`, `PublicRoute`, `ProtectedRoute`, `LoginPage` и `WelcomePage` — **6 мест** одновременно проверяют сессию и навигируют. После `signUp/verifyOtp` `LoginPage` навигирует, потом `onAuthStateChange` в `AppInitializer` снова грузит профиль, потом `ProtectedRoute` опять вычисляет маршрут — каждый шаг основан на возможно устаревшем состоянии. В логах видно **6 повторных запросов `/profiles`** за 3 секунды и многократные `isProfileComplete check`.

3. **`updateUserProfile` помечен deprecated**, а основной поток сохранения (`UserProfileForm`) лезет напрямую в `supabase.upsert` мимо стора. После `await loadUserProfile()` чтение приходит из старого React-Query кеша (`useOptimizedProfileCache`), потому что инвалидация запросов отсутствует. Поэтому в логах после успешного UPDATE вы видели «Искатель»/`birth_date: null`.

4. **`PublicRoute` не показывает loading**, пока `user` ещё не подгружен из сессии — мгновенно отрисовывает `LoginPage`, который сам себя редиректит. Возникают «вспышки» страниц и сбитая навигация.

5. **`AuthGuard` грузит профиль повторно** даже если `AppInitializer` уже сделал это, плюс `loadUserProfile` внутри себя вызывает ещё `loadOnboardingState` через `setTimeout`. Получается каскад из 3-4 повторных загрузок одних и тех же данных.

---

### Решение: единая централизованная машина состояний

Перепишу авторизацию полностью — frontend код делается с нуля, дизайн (космическая тема) и API контракты сохраняются.

#### Шаг 1. Один источник истины — новый `useAuthFlow` hook

Создаю `src/hooks/useAuthFlow.ts` — единственный hook, который:
- слушает `onAuthStateChange` и `getSession` ОДИН раз для всего приложения
- грузит профиль и onboarding-state атомарно (одним `Promise.all`)
- выставляет статус: `'initializing' | 'unauthenticated' | 'needs_profile' | 'needs_onboarding' | 'ready'`
- возвращает `targetRoute` — единственное место, где определяется куда редиректить

Удалить дублирование из `LoginPage`, `WelcomePage`, `PublicRoute`, `ProtectedRoute`, `AuthGuard`, `AppInitializer`. Они все будут читать `useAuthFlow()` без собственной логики.

#### Шаг 2. Унификация `profile_step_completed`

В БД `profiles.profile_step_completed` оставляю как **единственное место истины**. Удаляю колонку из `user_onboarding_state` (миграция: `ALTER TABLE user_onboarding_state DROP COLUMN profile_step_completed`). Логика `isProfileComplete()` будет проверять `userProfile.name && userProfile.birthDate && userProfile.profileStepCompleted` — все три из одного источника (таблица `profiles`).

Поле `profileStepCompleted` добавлю в `UserProfile` тип (сейчас его нет).

#### Шаг 3. Удаление `useOptimizedProfileCache` из критического пути

React-Query кеш на профиле создаёт race conditions. Удаляю его использование из flow регистрации/логина — оставляю только Zustand store как источник истины для пользовательских данных. Кеш React-Query оставляю только для горoscope/missions.

#### Шаг 4. Правильный порядок в `onAuthStateChange`

По best practice (Supabase docs): callback **синхронный**, тяжёлая работа через `setTimeout(..., 0)`. Это уже почти так в `AppInitializer`, но `AuthGuard` дублирует логику — его удалю и заменю на единый `<AuthBootstrap>` компонент, который рендерит `loading` пока `useAuthFlow().status === 'initializing'`.

#### Шаг 5. Полностью переписанный `LoginPage`

С нуля, без 600+ строк, без `authChecking` состояния, без ручного навигирования:
- `useAuthFlow` сам редиректит через `<Navigate>` если уже залогинен
- Только формы + локальное состояние ввода
- Tabs «Вход / Регистрация» с шарингом email
- Регистрация: email → password + confirmPassword + strength indicator (уже создан) → OTP → автологин
- Чёткий показ ошибок (неверный пароль / пользователь уже есть / слабый пароль)
- Кнопку «Гость» оставляю только в `import.meta.env.DEV`

#### Шаг 6. Переписанный `UserProfileForm`

- Единственная функция: вызвать `updateProfile({ name, birthDate })` из нового hook `useProfileMutations`
- Внутри: `upsert` в `profiles` с `profile_step_completed: true`, потом синхронный `set()` в Zustand с новыми значениями
- БЕЗ `loadUserProfile` после mutation (мы уже знаем что записали)
- БЕЗ `loadOnboardingState` (поле теперь только в profiles)
- БЕЗ ручной навигации — `useAuthFlow` сам перерасчитает targetRoute и отрендерит `<Navigate>`

#### Шаг 7. Переписанный `OnboardingPage`

- Записать `onboarding_step_completed: true` в `user_onboarding_state` (через `upsert`)
- Обновить Zustand
- `useAuthFlow` отредиректит на `/main`
- Убрать дублирующий `useEffect` с `checkOnboardingStatus`

#### Шаг 8. Дизайн-полировка (без изменения темы)

- `LoginPage`: единая высота карточки между табами Login/Signup (сейчас прыгает)
- Индикатор сложности пароля показывается только когда поле в фокусе или непустое
- Иконка глаза синхронизирована для обоих полей пароля
- На `/profile-setup` добавить subtle подсказку «Шаг 1 из 2» сверху
- На `/onboarding` индикатор «Шаг 2 из 2»
- Loading-состояния везде в едином cosmic-style (StarField + спиннер)
- Toast'ы при ошибках регистрации более понятные на русском

#### Шаг 9. Миграция БД

```sql
-- Удалить дубль колонки
ALTER TABLE public.user_onboarding_state 
  DROP COLUMN IF EXISTS profile_step_completed;

-- Бэкфилл: для существующих пользователей с заполненным профилем 
-- проставить profile_step_completed = true
UPDATE public.profiles 
SET profile_step_completed = true 
WHERE name IS NOT NULL 
  AND name != '' 
  AND name != 'Искатель' 
  AND birth_date IS NOT NULL 
  AND profile_step_completed = false;
```

Это починит вашего текущего пользователя `Roman Ivanov`, у которого `profile_step_completed = false`, но данные есть.

---

### Файлы под изменение

**Создать новые:**
- `src/hooks/useAuthFlow.ts` — единый источник навигации
- `src/components/auth/AuthBootstrap.tsx` — заменяет AuthGuard

**Переписать целиком:**
- `src/pages/LoginPage.tsx`
- `src/components/UserProfileForm.tsx`
- `src/pages/OnboardingPage.tsx`
- `src/components/auth/PublicRoute.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/utils/authRouter.ts`
- `src/store/slices/onboardingSlice.ts` (упростить, убрать profile_step_completed)
- `src/store/slices/authSlice.ts` (упростить loadUserProfile, добавить profileStepCompleted в стейт)
- `src/App.tsx` (упростить AppInitializer)

**Удалить:**
- `src/components/auth/AuthGuard.tsx` (заменён AuthBootstrap)
- `src/utils/authUtils.ts` (дубль authRouter)
- `src/hooks/useOptimizedOnboarding.ts` (упростить через useAuthFlow)
- `src/components/onboarding/OptimizedOnboardingGuard.tsx` (не нужен)

**Не трогать:**
- ElevenLabs, Universe промпты, Edge Functions, Cosmic тема, дизайн-токены, RLS политики таблиц (profile/avatar/missions), компонент `PasswordStrengthIndicator`, `ProfileForm` (форма уже исправлена), `AvatarUpload`.

### Что увидит пользователь после фикса

```text
[Регистрация] → [OTP] → [/profile-setup: имя+дата] → [/onboarding: 3 шага] → [/main]
                                  ↓ (одно сохранение)              ↓ (одно сохранение)
                            один redirect             один redirect
```

Никаких миганий, петель, повторных загрузок. Если обновить страницу в любой точке — пользователь окажется ровно там, где должен быть.

### Тестовый сценарий после применения

1. Регистрируюсь новым email → получаю OTP → ввожу → автоматически на `/profile-setup`
2. Ввожу имя «Test» и дату → клик «Продолжить» → автоматически на `/onboarding`
3. Прохожу 3 шага → автоматически на `/main`
4. F5 на любом шаге — возвращает туда же
5. Logout → снова login тем же email/паролем → попадаю на `/main` (всё запомнилось)
6. Существующий пользователь `Roman Ivanov` после миграции попадёт сразу на `/onboarding` (профиль уже заполнен)

