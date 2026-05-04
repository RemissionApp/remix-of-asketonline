## 1. PactOath — кнопка «Подпись» внизу вкладки «Клятва»

`src/components/PactOath.tsx`:
- На основной странице (вкладка клятвы), под полем с текстом клятвы и кнопкой «Прочитать вслух», добавить **второй CTA** — `Подписать договор` (золотистый акцент в стиле приложения), вызывающий `handleSignContract` напрямую.
- Кнопка всегда видна (без обязательного открытия диалога), но если пользователь ещё не нажал «Прочитать вслух» — показать тонкую подсказку под ней («Рекомендуем сначала прочитать клятву вслух»).
- Сохранить существующий поток через `Dialog` для тех, кто читает вслух.
- Локализация ru/en/es: «Подписать клятву» / «Sign the oath» / «Firmar el juramento».

## 2. PactsPage → диалог «Клятва» — кнопка «Подписана»

`src/pages/PactsPage.tsx`:
- В `Dialog` просмотра клятвы (`oathPact`) добавить футер с неактивной (disabled) зелёной кнопкой-бейджем «✓ Подписана / Signed / Firmada» — визуальное подтверждение, что договор уже заключён. Закрытие — кнопка «Закрыть».

## 3. BreakAscesisDialog — единый космический стиль

`src/components/BreakAscesisDialog.tsx`:
- Заменить дефолтные shadcn-стили на космический glassmorphism:
  - `AlertDialogContent`: `bg-cosmic-dark/80 backdrop-blur-xl border border-cosmic-accent/30 rounded-3xl text-white max-w-md`.
  - Заголовок — `cosmic-gradient-text font-serif`, иконка `AlertTriangle` в круглом контейнере с градиентом `from-red-500/30 to-cosmic-accent/20`.
  - Внутренние `Card` → `rounded-2xl border-white/10 bg-cosmic-dark/40 backdrop-blur-md`.
  - Жёлтую карточку «Помните» перекрасить под космос: `bg-cosmic-gold/10 border-cosmic-gold/30`, текст `text-cosmic-gold` / `text-cosmic-secondary`.
  - Кнопки причин — `rounded-2xl border-white/10 bg-cosmic-dark/40`, активная — `bg-cosmic-accent/30 border-cosmic-accent`.
  - Основной CTA «Прервать» — красный градиент `from-red-600 to-red-500` с лёгким glow.
  - `Textarea` — `bg-cosmic-dark/40 border-cosmic-accent/20 text-white`.
- Добавить `<StarField />` оверлей внутри диалога (низкая плотность ~30 звёзд) для атмосферы — позиционировать `absolute inset-0 pointer-events-none rounded-3xl overflow-hidden`.

## 4. NumerologyPage — переименование и редизайн

`src/pages/NumerologyPage.tsx`:

**Переименование:**
- `PageHeader title` → `t.numerology.title` со значением «Нумерология / Numerology / Numerología». Добавить ключ `numerology.title` в `src/translations/*` (ru/en/es), оставить `numerology.analysis` для совместимости.

**Структура (по образцу UniverseHubPage / CosmosPage):**
- Обернуть содержимое в `<MobileOptimizedInterface>`, использовать `pt-20 pb-24`, `max-w-lg mx-auto`.
- Hero-блок сверху: имя пользователя + дата рождения внутри стеклянной карточки `rounded-3xl border-white/10 bg-gradient-to-br from-cosmic-accent/15 via-cosmic-dark/60 to-cosmic-gold/10 backdrop-blur-md`, с маленьким бейджем `Sparkles` («Ваш числовой портрет»).
- Карточка «Ключевые числа» (Path / Expression / Personality): тот же glass-стиль; круги чисел — `bg-gradient-to-br from-cosmic-gold/30 to-cosmic-accent/30 border border-white/10 shadow-[0_0_20px_rgba(232,193,108,0.2)]`.
- **Переключатель режимов** (`viewMode`): заменить на сегментный pill-control в космическом стиле — `rounded-full bg-cosmic-dark/60 border border-cosmic-accent/20 backdrop-blur-md p-1`, активный сегмент — `bg-gradient-to-r from-cosmic-gold/40 to-cosmic-accent/40 text-white shadow`. Лейблы: «Матрица / Простая / Подробно».
- Все вложенные `Card` (определения чисел, periods) перевести на тот же glass-класс `rounded-3xl border-white/10 bg-cosmic-dark/40 backdrop-blur-md`. Цифры — золотой градиент.
- Periods: каждая строка — горизонтальная glass-карточка с круглым числом слева и описанием справа.
- Локализовать жёстко зашитый русский текст (определения чисел, «Простая», «Данные», «Периоды жизни», «Формирующий период» и т.д.) через `useTranslations` (новые ключи `numerology.definitions.*`, `numerology.periods.*`).

## 5. Технические детали

- Никаких изменений схемы БД.
- Никаких новых зависимостей.
- Edge-функции не трогаем.
- Файлы:
  - **edit:** `src/components/PactOath.tsx`, `src/pages/PactsPage.tsx`, `src/components/BreakAscesisDialog.tsx`, `src/pages/NumerologyPage.tsx`, `src/translations/ru.ts`, `src/translations/en.ts`, `src/translations/es.ts` (или единый файл, в зависимости от структуры — проверим при имплементации).
