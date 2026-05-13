## План

### 1. Кнопка «Сохранить в Книгу Ответов» в блоке гороскопа

В `DesktopMainExtras.tsx` (карточка «Гороскоп на сегодня») и в `useBriefHoroscope` (на мобильном — где гороскоп показывается через `QuoteDisplay`/`UniverseMessageBlock`) добавлю кнопку «Сохранить в Книгу Ответов».

При нажатии:
- INSERT в таблицу `universe_questions`: `question = "Гороскоп на DD.MM.YYYY ({знак})"`, `answer = текст гороскопа`.
- Toast подтверждения (ru/en/es).
- Кнопка становится «Сохранено ✓» и блокируется, чтобы не сохранять дубль за тот же день (флаг в localStorage `horoscope_saved_{sign}_{YYYY-MM-DD}`).
- Сохранённые записи появятся в существующем блоке «Недавние вопросы Вселенной» (`RecentQuestionsBlock`).

### 2. Автообновление гороскопа раз в сутки + при открытии главной

В `useBriefHoroscope`:
- Сейчас уже есть кэш по дню через `localStorage`. Добавлю проверку при монтировании: если дата кэша `< сегодня`, кэш сбрасывается и инициируется новая загрузка с edge-функции `fetch-horoscope`.
- Добавлю слушатель `visibilitychange` и `focus`: если пользователь возвращается в приложение и кэш устарел — перезапросить.
- В `MainPage` уже автоматически рендерится `DesktopMainExtras` → хук срабатывает при открытии. Этого достаточно для «обновления при открытии главного экрана».

### 3. Фикс прокрутки на десктопе на `/main`

Проблема: `DesktopShell` оборачивает `MainPage`, а сама `MainPage` рендерит fixed `TopBar` (z-100) и `BottomNavigation`, которые перекрывают контент в десктопной разметке. Плюс `pb-32` рассчитан на мобильный bottom-nav.

Решение:
- В `MainPage` скрывать `TopBar` и `BottomNavigation` на `lg:` (через `className="lg:hidden"` обёртку), потому что десктопная навигация уже в `DesktopSidebar`.
- Контейнер сетки: убрать `pt-16` на `lg`, заменить `pb-32` на `lg:pb-12`, чтобы низ страницы не обрезался.
- Внутренний `<main>` в `MainContent.tsx` имеет `pt-10` — это ок, но проверю что `DesktopShell` `<main>` с `overflow-y-auto` корректно скроллит весь контент включая sticky правую колонку.

### Технические детали

- Новых таблиц/миграций не нужно — используется существующая `universe_questions` с RLS `auth.uid() = user_id`.
- Файлы:
  - `src/components/desktop/DesktopMainExtras.tsx` — кнопка сохранения в карточке гороскопа.
  - `src/hooks/useBriefHoroscope.ts` — авто-обновление по visibilitychange/focus, проверка устаревания кэша.
  - `src/components/universe/UniverseMessageBlock.tsx` (мобильный) — добавить ту же кнопку, чтобы фича была и на телефоне.
  - `src/pages/MainPage.tsx` — `lg:hidden` для TopBar/BottomNavigation, корректные паддинги для desktop.

Локализация ru/en/es для всех новых строк («Сохранить в Книгу Ответов» / «Save to Book of Answers» / «Guardar en el Libro de Respuestas», «Сохранено» / «Saved» / «Guardado»).