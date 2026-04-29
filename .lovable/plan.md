## Многоэтапный план полной доработки приложения для запуска

Делим работу на 4 этапа. Каждый этап — отдельное сообщение/итерация: вы подтверждаете → я внедряю → проверяете в превью → переходим к следующему. Это безопаснее, чем менять всё разом.

---

### Этап 1 (СЕЙЧАС) — Фикс профиля: «Искатель» + сегодняшняя дата + валидация

**Симптомы:**
- При входе под существующим юзером на `/profile-setup` показывается имя «Искатель» и дата = сегодня.
- Календарь позволяет выбрать дату вплоть до `2025-12-31` (хардкод) и/или сегодняшнюю.

**Корни:**

1. `src/components/UserProfileForm.tsx`:
   - `useState({ name: '', birthDate: new Date() })` — стартовое значение даты = сегодня. Если профиль ещё не подгрузился, `ProfileForm` рендерится с этой датой и юзер видит «29 апреля 2026».
   - В `ProfileForm` проп: `birthDate: formData.birthDate || userProfile.birthDate || new Date()` — то же самое, всегда есть fallback на `new Date()`.
2. `src/components/MainPageComponents/UserGreetingSection.tsx`:
   - `userName = userProfile?.name || 'Искатель'` — если имя пустое или профиль ещё грузится, всегда показывает «Искатель». Это даёт ложное ощущение, что данные не сохранились.
3. `src/pages/UserProfilePage.tsx` использует **только** `loading` (общий флаг авторизации), не дожидается `userProfile.birthDate`. Форма монтируется со «свежим» `new Date()` до того, как профиль из БД хидрируется.
4. `src/components/ProfileForm.tsx`:
   - `maxBirthDate = subYears(today, 5)` — корректно, **но** дефолтное значение приходит сверху как `new Date()` (сегодня), что > maxBirthDate → форма стартует с невалидным значением.
5. `src/components/BirthDateEditor.tsx`:
   - `maxDate = new Date('2025-12-31')` — хардкод прошлого года, к 2026 уже неверный. Должно быть `subYears(today, 5)`.

**Правки:**

- **`UserProfileForm.tsx`**:
  - Не инициализировать `formData.birthDate` значением `new Date()`. Использовать `null` пока профиль не загрузился.
  - Пока `userProfile` не хидрирован (нет ни name, ни birthDate **и** нет флага «профиль точно пустой»), показывать спиннер вместо формы. Гарантировать, что для **существующих** пользователей форма стартует уже с реальными значениями из БД.
  - Передавать в `ProfileForm` `birthDate: undefined` (не `new Date()`), если ничего нет — пусть поле будет пустым с плейсхолдером «Выберите дату рождения».

- **`ProfileForm.tsx`**:
  - Убрать fallback `defaultValues.birthDate || new Date()`. Принимать `Date | null | undefined`, не подставлять сегодня.
  - `defaultCalendarMonth` считать от `subYears(today, 25)` если значения нет (более логично, чем 1990).
  - Зод-схему оставить как есть (требует Date).

- **`BirthDateEditor.tsx`**:
  - Заменить хардкод `new Date('2025-12-31')` на `subYears(new Date(), 5)`.
  - Импортировать `subYears` из `date-fns`.

- **`UserGreetingSection.tsx`**:
  - Если `userProfile?.name` пустое — не показывать «Искатель», показывать просто приветствие без имени (или «—»). «Искатель» как ник навязывается насильно — уберём.

- **`UserProfilePage.tsx`**:
  - Дожидаться загрузки профиля (если `user` есть, но `userProfile.name === '' && userProfile.birthDate === null && !profileStepCompleted` и идёт `loading` хидратации) — показывать спиннер.

**Ожидаемый результат этапа 1:**
- Существующий юзер заходит → видит свои реальные имя и дату рождения, **не** «Искатель» и **не** сегодня.
- В календаре выбрать дату позже, чем `today − 5 лет`, невозможно (ни в первичной форме, ни в редакторе из настроек).
- На главной приветствие не подставляет «Искатель» вместо пустого имени.

**Файлы:** `src/components/UserProfileForm.tsx`, `src/components/ProfileForm.tsx`, `src/components/BirthDateEditor.tsx`, `src/components/MainPageComponents/UserGreetingSection.tsx`, `src/pages/UserProfilePage.tsx`.

---

### Этап 2 — Сквозной аудит auth-флоу и удаление мёртвого кода

- В кодовой базе сосуществуют **две системы** auth-навигации: новая `useAuthFlow` (`src/hooks/useAuthFlow.ts`) и старая `determineAuthRoute` (`src/utils/authRouter.ts`). `WelcomePage` всё ещё использует старую. Это источник рассинхронов.
- Удалить `src/utils/authRouter.ts` после миграции `WelcomePage`, `useAuthDebug`, `ProtectedRoute`/`PublicRoute` (если используют) на `useAuthFlow`.
- Привести `signIn` (`authSlice.ts`) к единому пути: после успеха не дублировать `loadUserProfile/loadOnboardingState` (их уже зовёт `onAuthStateChange` в `useAuthFlowBootstrap`). Убрать race.
- Удалить `updateUserProfile` (помечен deprecated) и заменить вызовы на прямой upsert в `profiles` (он уже в `UserProfileForm`).
- Тест end-to-end: новый юзер → OTP → `/profile-setup` → `/onboarding` → `/main`; existing юзер → `/login` → `/main` (без промежуточных мерцаний).

**Файлы:** `src/utils/authRouter.ts` (удалить), `src/pages/WelcomePage.tsx`, `src/hooks/useAuthDebug.ts`, `src/store/slices/authSlice.ts`, `src/components/auth/ProtectedRoute.tsx`, `src/components/auth/PublicRoute.tsx`.

---

### Этап 3 — UX/дизайн полировка ключевых экранов

- **LoginPage**: визуально перегружен (3 формы в одной карточке). Сделать более чистый, добавить состояния «загрузка» внутри кнопки, единый отступ.
- **OnboardingPage**: 3 шага сейчас — заглушка с маркированными списками. Сделать карточный дизайн, иконки фич, прогресс-бар сверху, кнопки крупнее, лучшая читаемость на мобильном.
- **UserProfilePage**: убрать «Шаг 1 из 2» дубль (он и в `UserProfileForm`, и можно ещё раз), добавить иллюстрацию/иконку, увеличить отступы.
- **MainPage UserGreetingSection**: переработать в более минималистичный блок (часы/дата меньшим шрифтом, имя крупнее).
- Глобально: проверить, что ничего не выпадает на мобильном (375px), все touch-targets ≥ 44px.

---

### Этап 4 — Подготовка к запуску: чек-лист

- Включить **подтверждение email** в Auth (сейчас OTP-flow свой; убедиться, что обычный `signUp` тоже требует подтверждения).
- Добавить **rate limiting** на edge functions (минимум `voice-to-text`, `text-to-speech`, `fetch-horoscope`, `universe-answer`) — сейчас любой авторизованный юзер может расходовать `LOVABLE_API_KEY` без ограничений сверх `daily_limits`.
- Прогнать `security--run_security_scan`, поправить критичные находки.
- Проверить, что все `console.log` в продакшен-коде закрыты `logger.debug` (сейчас в `authSlice.verifyOtpCode` много прямых `console.log` с email/code — вытащить).
- Sentry / error tracking — опционально, но желательно для запуска.
- Smoke-test всех платных фич (paywall пока только нативный — для web план в отдельной задаче через Stripe/Paddle).

---

## Что делаем прямо сейчас

Начинаем с **Этапа 1**. Это закроет основную жалобу («показывает имя Искатель и старую/сегодняшнюю дату») и валидацию даты. Этапы 2–4 запускаем последовательно по вашему согласию после проверки результата каждого предыдущего.