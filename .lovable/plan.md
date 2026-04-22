

## Фикс: онбординг не проходит — state переключается обратно после завершения

### Что показывают данные

- В БД `user_onboarding_state` для текущего юзера уже корректно: `onboarding_step_completed=true`, `current_step='complete'`, `completed_at='20:36:55'`. То есть upsert из `OnboardingPage.completeOnboarding()` **проходит успешно**.
- Но юзер всё ещё на `/onboarding` — значит в Zustand store `onboardingStepCompleted=false`, и `useAuthFlow` возвращает `targetRoute='/onboarding'`.

### Корни проблемы

**Корень №1 — `loadOnboardingState` имеет 5-минутный TTL-кэш**, который не учитывает ручные `setState` извне.
В `OnboardingPage.completeOnboarding()` после upsert делается `useAppStore.setState({onboardingStepCompleted: true})` напрямую — но `lastSyncedAt` не обновляется. Любой следующий вызов `loadOnboardingState` (из `loadUserProfile` через `setTimeout`, при TOKEN_REFRESHED, при mount нового компонента, при возврате на вкладку) видит «кэш истёк» → делает свежий SELECT → если попал в гонку с upsert, получает старое значение и **перезатирает `true` обратно в `false`**.

**Корень №2 — каскадный вызов в `authSlice.loadUserProfile`** (строка 799):
```ts
setTimeout(() => get().loadOnboardingState(), 0);
```
Каждый раз при загрузке профиля (а это происходит ПОСТОЯННО — в network видно 6+ запросов `/profiles?id=eq.` за 2 секунды на mount) триггерится `loadOnboardingState`. В сочетании с гонкой это перетирает только что выставленное `true`.

**Корень №3 — сам `loadOnboardingState` использует `|| false`** для дефолта. Если БД вернёт `null` (например, transient ошибка которая не выкинула throw), state обнулится.

**Корень №4 — `OnboardingPage` не вызывает `navigate('/main')` напрямую**, полагаясь на ProtectedRoute + useAuthFlow. Но useAuthFlow зависит от Zustand state, который в любой момент может быть перетёрт `loadOnboardingState`. Нет надёжной точки «всё, мы закончили».

### План исправлений

**Шаг 1 — Убрать каскад из `authSlice.loadUserProfile`**
Удалить `setTimeout(() => get().loadOnboardingState(), 0)` со строки 799 `src/store/slices/authSlice.ts`. Загрузка onboarding state делается ровно один раз — в `useAuthFlowBootstrap.hydrateForUser()` через `Promise.all([loadUserProfile, loadOnboardingState])`. Дублирующие вызовы из `loadUserProfile` удалить.

**Шаг 2 — Усилить `OnboardingPage.completeOnboarding`**
После успешного upsert:
1. Обновить `lastSyncedAt: new Date()` вместе с флагами, чтобы заблокировать повторное чтение из БД на 5 минут.
2. Вызвать `navigate('/main', { replace: true })` напрямую (через `useNavigate`), не полагаясь на ProtectedRoute. Так редирект происходит мгновенно и детерминированно.
3. Удалить вызов `setActiveScreen('main')` — это устаревший legacy-механизм, не имеющий отношения к React Router.

**Шаг 3 — Сделать `loadOnboardingState` idempotent при наличии свежего `completed_at`**
В `src/store/slices/onboardingSlice.ts:84-93`: если в стейте уже `onboardingStepCompleted === true && completedAt !== null`, **не перезаписывать** этот флаг даже при обновлении из БД (защитный switch: `prev || fromDb`). Это гарантирует, что race-условие не сможет откатить true → false.

**Шаг 4 — Расширить TTL-кэш с учётом завершённого онбординга**
Если `state.completedAt !== null` — пропускать загрузку из БД полностью (возврат раньше TTL-чека). Завершённый онбординг — финальный, никогда не возвращается в незавершённое состояние без явного `resetOnboarding`.

**Шаг 5 — Убедиться, что `useAuthFlow` реагирует на изменение state**
Текущий `useAuthFlow` уже подписан на `onboardingStepCompleted` через `useAppStore(s => s.onboardingStepCompleted)` — это OK, ничего не трогаем.

### Файлы под изменение
- `src/pages/OnboardingPage.tsx` — добавить `useNavigate`, обновить `lastSyncedAt`, прямой `navigate('/main')`.
- `src/store/slices/authSlice.ts` — удалить каскадный `setTimeout(loadOnboardingState)` со строки 799.
- `src/store/slices/onboardingSlice.ts` — защитное слияние (true-sticky), early-return при `completedAt !== null`.

### Что НЕ трогаем
- БД и миграции — всё в порядке, данные в `user_onboarding_state` корректны.
- `useAuthFlow`, `ProtectedRoute`, `AppRouter` — работают правильно.
- RLS policies, триггер `on_auth_user_created` — без изменений.

### Ожидаемый результат
После клика «Начать путь» / «Пропустить» в онбординге — мгновенный переход на `/main`, без отката state. Перезагрузка страницы не возвращает на `/onboarding`. Race-условие из множественных `loadUserProfile`/`TOKEN_REFRESHED` больше не способно откатить завершённый онбординг.

