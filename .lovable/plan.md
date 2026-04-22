

## Исправление: будущие года в календаре, потеря данных, аватар, кэш

### Найденные корни проблем

**Проблема №1 — В календаре слайдер показывает будущие года (вплоть до +50 от текущего)**
В `src/components/ui/calendar.tsx` слайдер года жёстко задан как `currentYear ± 50`, игнорируя `toYear`/`fromYear` пропсы из `ProfileForm`. Поэтому при онбординге слайдер позволяет выбрать 2076 год, хотя `disabled` пропс DayPicker отрезает будущие даты — выглядит сломанно.

**Проблема №2 — Триггер `on_auth_user_created` НЕ установлен в БД**
Запрос `information_schema.triggers` возвращает пустой список. Функция `handle_new_user()` существует, но триггер на `auth.users` к ней не прикреплён (видимо, был сброшен при одном из откатов). Поэтому при регистрации профиль НЕ создаётся, а `loadUserProfile` создаёт его сам — но `useOptimizedProfileCache.fetchProfile` параллельно делает свой `select` и мапит `data.name || 'Искатель'`, забивая стор фолбэком "Искатель". Отсюда расхождение между сохранёнными в БД данными (`Roman Ivanov`, `1986-09-30`, `profile_step_completed=true` — проверено прямым SQL) и тем, что видно в UI (`name: "Искатель"`, `birthDate: null`).

**Проблема №3 — `useOptimizedProfileCache` дублирует чтение профиля и затирает Zustand**
React-Query кэш с TTL 5 минут хранит первую (пустую) загрузку, а после сохранения формы — не инвалидируется, потому что форма пишет напрямую через `supabase.upsert` мимо мутации хука. Любой компонент, подписанный на `useOptimizedProfileCache`, продолжает показывать "Искатель"/`null`.

**Проблема №4 — Аватар не сохраняется**
`avatar_url` в БД остаётся `null`. По логике AvatarUpload показывает диалог `ConfirmUpload`, ждёт нажатия «Подтвердить». Если пользователь видит, что после выбора файла иконка не меняется — он либо не нажимает confirm, либо `setTimeout(loadUserProfile, 100)` после успешного upload пере-считывает старое значение из React-Query кэша и затирает оптимистичный апдейт.

**Проблема №5 — `select('id, name, ...')` в кэш-хуке использует `.single()` и крашится на отсутствующей строке**
Когда профиля ещё нет в БД, `useOptimizedProfileCache.fetchProfile` бросает PGRST116, React-Query повторяет запрос, всё это происходит параллельно с созданием профиля в `loadUserProfile`. Дополнительные гонки.

---

### План исправлений

**Шаг 1 — Восстановить триггер `on_auth_user_created` (миграция)**

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Бэкфилл существующих пользователей без profile-строки
INSERT INTO public.profiles (id, name)
SELECT u.id, ''
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
```

**Шаг 2 — Удалить `useOptimizedProfileCache` из критического пути**

- Найти все компоненты, импортирующие `useOptimizedProfileCache`, и заменить на чтение `userProfile` из Zustand (`useAppStore(s => s.userProfile)`).
- Файл `useOptimizedProfileCache.ts` удалить целиком — единственный источник истины — Zustand-стор.
- Из `loadUserProfile` убрать вторичный `setTimeout(loadOnboardingState)` чтобы не было каскада.

**Шаг 3 — Починить `Calendar` (запрет будущих годов)**

Переписать `src/components/ui/calendar.tsx`:
- Принимать `fromYear`/`toYear` через пропсы (передаются из `ProfileForm` как `fromYear={1930} toYear={currentYear-5}`).
- Слайдер года ограничивать `min={fromYear ?? minYear}` и `max={toYear ?? maxYear}`.
- Если `props.disabled` — не давать выбирать запрещённые даты в слайдере (clamp при `handleYearChange`).

**Шаг 4 — Упростить `UserProfileForm.onSubmit`**

- После успешного `upsert` — синхронно `useAppStore.setState({ userProfile: {...new}, profileStepCompleted: true })`. Уже сделано, но дополнительно вызвать `await loadUserProfile()` ОДИН раз, чтобы `birthDate` гарантированно стал `Date` объектом (а не строкой) и нормализовался `zodiacSign`.
- Убрать запись `birthDate` через `toISOString().split('T')[0]` — заменить на ручную DD/MM/YYYY → YYYY-MM-DD конвертацию через UTC, чтобы избежать сдвига часовых поясов (пример: 30 сентября 1986 в +03:00 при `toISOString` уйдёт в 29 сентября).

**Шаг 5 — Починить аватар**

- В `AvatarUpload.tsx` после `updateProfileAvatar` — НЕ вызывать `loadUserProfile()` через `setTimeout`. Только оптимистичный `useAppStore.setState({ userProfile: { ...state.userProfile, avatar_url } })`. Это убирает гонку с React-Query (которой больше не будет после Шага 2).
- Добавить query-string `?v={timestamp}` к публичному URL для cache-busting в `<img src>`.
- В `updateProfileAvatar` убрать `name: ''` из upsert payload (риск перезаписать имя пустой строкой если триггер не успел создать строку): использовать update вместо upsert, потому что строка теперь гарантированно есть благодаря триггеру (Шаг 1).

**Шаг 6 — Финальная проверка**

1. Прямой SQL: убедиться что у `2212ecc8-2227-495d-8f96-45980e1db638` записаны имя/дата.
2. Регистрация нового email → OTP → /profile-setup → форма не показывает "Искатель", а пустое поле имени.
3. Слайдер года: max — текущий год − 5, min — 1930, без 2076.
4. Сохранение даты: 30/09/1986 → в БД `1986-09-30` (без сдвига).
5. Аватар: после нажатия «Подтвердить» сразу появляется в кружке и сохраняется в БД (`avatar_url IS NOT NULL`).
6. F5 на любом шаге → данные на месте, никаких "Искатель" фолбэков.

### Файлы под изменение
- **Миграция:** новый файл с восстановлением триггера + бэкфилл profiles.
- `src/components/ui/calendar.tsx` — учёт `fromYear`/`toYear`.
- `src/components/UserProfileForm.tsx` — UTC-форматирование даты + единичный `loadUserProfile`.
- `src/components/AvatarUpload.tsx` — убрать setTimeout-перезагрузку, добавить cache-busting.
- `src/utils/avatarStorage.ts` — `update` вместо `upsert`, без `name: ''`.
- **Удалить:** `src/hooks/useOptimizedProfileCache.ts`.
- Обновить все импортёры `useOptimizedProfileCache` → `useAppStore`.

### Что НЕ трогаем
- `useAuthFlow`, `AuthBootstrap`, `ProtectedRoute` — работают корректно.
- RLS-политики `profiles` и `avatars` — корректные.
- Cosmic-дизайн, OTP, edge functions.
- `handle_new_user()` — функция корректна, не трогаем.

### Ожидаемый результат
После применения: новые пользователи получают пустой профиль (триггер), форма сохраняет данные одним upsert + единым reload, календарь не позволяет будущие года, аватар грузится без перезагрузок, "Искатель" больше не появляется как фолбэк нигде в UI. Готово к публикации.

