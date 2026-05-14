## Цели
1. Сделать «Глубокий разбор» устойчивым к 429/402 с понятными сообщениями и автоповтором с обратным отсчётом.
2. Добавить кнопку «Сохранить в Книгу Ответов» и историю сохранённых разборов с просмотром.
3. Починить все предупреждения Supabase security linter (RLS без политик, search_path, SECURITY DEFINER, extension in public).
4. Гарантировать корректный сброс скролла на `/numerology` при переключении вкладок и системы.

---

## Блок A — Обработка ошибок и ретрай в «Глубоком разборе»

### Edge function `generate-numerology-description`
- При 429: парсить `Retry-After` (или дефолт 30 сек), возвращать `{ error: 'rate_limited', retryAfter: <sec> }`.
- При 402: возвращать `{ error: 'credits_exhausted' }` (уже есть, уточнить копию).

### Хук `useNumerologyDeepReading`
- Расширить state: `retryAfter: number | null`, `errorCode: 'rate_limited' | 'credits_exhausted' | 'generic' | null`.
- При `rate_limited`: запустить `setInterval`, обновлять `retryAfter` каждую секунду; по достижении 0 — авто-повтор последнего запроса (хранить последний `req` в ref).
- Кнопка «Повторить сейчас» доступна всегда при ошибке.

### UI на `NumerologyPage`
- Понятные сообщения (i18n ru/en/es):
  - 429: «Слишком много запросов. Повтор через {n} сек…» + кнопка «Повторить сейчас».
  - 402: «Закончились AI-кредиты. Пополните баланс в настройках» + ссылка на Settings.
  - Generic: «Не удалось получить разбор» + «Повторить».
- Спиннер сменяется на бейдж с countdown.

---

## Блок B — Книга Ответов (история глубоких разборов)

### Данные
Используем существующую таблицу `numerology_deep_cache` + новая таблица `numerology_saved_readings`:
- `id`, `user_id`, `title` (авто из контекста + даты), `context`, `focus_number`, `language`, `content`, `profile_snapshot jsonb`, `created_at`.
- RLS: владелец видит/создаёт/удаляет свои.

Миграция создаётся в Блоке D (вместе с фиксами линтера).

### UI
- В панели «Deep Reading» рядом с результатом — кнопка `Bookmark` «Сохранить в Книгу Ответов». После сохранения — toast + кнопка отключается (state `saved`).
- На той же странице добавить аккордеон/секцию **«Книга Ответов»** внизу:
  - Список последних 20 сохранённых разборов: заголовок, дата, контекст-бейдж.
  - Клик — раскрывает Markdown-контент (re-use текущий рендерер).
  - Кнопка удаления.
- Хук `useAnswersBook`: `list`, `save`, `remove`.
- i18n ключи: `v2.answersBook.{title, save, saved, empty, delete, openItem}`.

---

## Блок C — Скролл `/numerology`

- Текущий `useEffect` использует `window.scrollTo`. На мобилках с `MobileOptimizedInterface` контейнер скорее всего скроллит внутренний `div`, а не `window`.
- Найти ближайший скролл-контейнер (вероятно, корневой `.min-h-screen` или родитель с `overflow-y-auto`) и сбрасывать его `scrollTop = 0` при смене `tab`/`system`.
- Также проверить, что у корня страницы нет `overflow: hidden`, мешающего скроллу при большом контенте (после добавления Книги Ответов страница станет длиннее).
- Решение: `useLayoutEffect` + ref на `scrollRef` (внутренний div), заодно `window.scrollTo(0,0)` как fallback.

---

## Блок D — Security linter миграции

Все 17 issue в одной миграции:

1. **RLS Enabled No Policy** — `revenuecat_events`: добавить политики (только `service_role` insert; user select запрещён) либо просто `REVOKE ALL` от `anon/authenticated`.
2. **Function Search Path Mutable** — `validate_subscription_status` не имеет `SET search_path`. Пересоздать с `SET search_path = public`.
3. **Extension in Public** — определить какое расширение (`pg_trgm`/`citext`/иное) и переместить в схему `extensions`: `ALTER EXTENSION ... SET SCHEMA extensions;` (создать схему при необходимости).
4. **SECURITY DEFINER executable by anon/authenticated** (10 функций) — `REVOKE EXECUTE ON FUNCTION ... FROM PUBLIC, anon;` оставить только нужным ролям (`authenticated` для `batch_delete_user_data`, `increment_call_minutes`, `has_role`; `service_role` для `handle_new_user`, `create_verification_code`, `validate_verification_code`, `update_updated_at_column`).

После миграции — повторно запустить линтер и убедиться, что осталось 0 предупреждений (или только те, что неустранимы и согласованы).

---

## Технические детали

### Файлы для создания
- `src/hooks/useAnswersBook.ts`
- `src/components/numerology/AnswersBookList.tsx`
- `supabase/migrations/<ts>_answers_book_and_security_fixes.sql`

### Файлы для изменения
- `supabase/functions/generate-numerology-description/index.ts` (Retry-After)
- `src/hooks/useNumerologyDeepReading.ts` (countdown, retry, errorCode)
- `src/pages/NumerologyPage.tsx` (UI ошибок, save button, AnswersBookList, scroll fix через ref)
- `src/i18n/languages/{ru,en,es}.ts` + `translationTypes.ts` (новые ключи `v2.deepAnalysis.retry/rateLimited/creditsExhausted`, `v2.answersBook.*`)

### Порядок работы
1. Миграция (Блок D + таблица Книги Ответов) → ждём подтверждения.
2. Edge function + хук + UI ошибок (Блок A).
3. Книга Ответов: хук + компонент + интеграция (Блок B).
4. Скролл-фикс (Блок C).
5. Прогон `supabase--linter` для проверки, что предупреждений нет.

---

## Открытые вопросы (отвечу по умолчанию, если не уточните)

- **Авто-повтор при 429**: запускать автоматически по истечению countdown — да.
- **Где показывать «Книга Ответов»**: внизу страницы `/numerology` отдельной секцией. (Альтернатива — отдельная страница `/answers-book`. Если нужно — скажите, сделаю.)
- **Снапшот профиля при сохранении**: сохраняем целиком, чтобы показывать историю даже после смены даты рождения.
