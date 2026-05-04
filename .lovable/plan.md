
## Цель
Привести все блоки главного экрана к единому стилю, как у "Позвонить Вселенной" (`CallHero`): шрифты `text-base font-semibold` для заголовка, `text-xs text-cosmic-secondary` для подзаголовка, без отдельных кнопок — весь блок кликабелен.

## Изменения по блокам

### 1. `DailyAdviceDisplay.tsx` — Совет дня
- Убрать декоративную иконку `Sparkles` (фоновая звезда за лампочкой) — оставить только `LightbulbIcon`.
- Убрать кнопку "Принять совет" (`Button` с `action`).
- Текст совета вывести на полную ширину блока (вынести `<p>{dailyAdvice}</p>` ниже основной строки `flex`, в отдельный блок под header'ом).
- Шрифты заголовка/подзаголовка привести к `text-base font-semibold text-white` + `text-xs text-cosmic-secondary` (как в CallHero).

### 2. `UniverseMessageBlock.tsx` — Задать вопрос Вселенной
- Убрать кнопку "Задать вопрос Вселенной" (`Button`).
- Корневой `<div>` заменить на `<button onClick={handleQuestionClick}>` — весь блок становится кликабельным (по аналогии с `CallHero`).
- Шрифты уже совпадают с CallHero — оставить.

### 3. `ZodiacBadgeDisplay.tsx` — Гороскоп
- Заголовок: убрать `text-base sm:text-xl font-medium` + условный `font-serif/font-display`. Заменить на `text-base font-semibold text-white` (как в CallHero).
- Внутрь блока с `<ZodiacInfo />` (вверху, над контентом) добавить компактную полоску с детальными данными знака (Телец, даты, стихия, управитель, характеристики) — то есть `ZodiacInfo` уже это содержит, нужно убедиться, что он отображается **внутри** карточки `rounded-2xl border border-white/10 bg-white/5` — это уже так.
- Главное: убрать дублирующее отображение детальных данных знака зодиака снаружи карточки (если такое есть на `/main` — проверить родителя). В текущем `ZodiacBadgeDisplay` дубля нет; данные уже только внутри `ZodiacInfo`. Действие: сохраняем структуру, но унифицируем шрифты.

### 4. `AffirmationsBlock.tsx` — Аффирмации
- Иконку `TextCursor` заменить на более подходящую, например `Heart` или `Quote` из `lucide-react` (выбрать `Quote`).
- Убрать `CosmicButton "Открыть аффирмации"`.
- Корневой `<div>` → `<button onClick={handleAffirmationsClick}>` (весь блок кликабельный).
- Заголовок: `text-base font-semibold text-white` (убрать `font-serif/font-display`, `sm:text-xl`).
- Подпись: `text-xs text-cosmic-secondary`.

### 5. `NumerologyDisplay.tsx` + `NumerologyContent.tsx` — Нумерология
- Шрифты заголовка к стилю CallHero (`text-base font-semibold text-white`, без `font-serif/font-display`).
- В `NumerologyContent`: убрать кнопку "Подробнее" (`button` с `Star`), убрать дублирующий блок описания внизу.
- Корневой `<div>` блока сделать `<button onClick={() => navigate('/numerology')}>` — весь блок кликабельный.
- Внутренние данные (Путь жизни, Число выражения, Число личности) уже находятся внутри карточки — структура верная.

### 6. `CosmicMissionsEntryPoint.tsx` — Космические миссии
- Убрать `CosmicButton "Открыть миссии"`.
- Корневой `<div>` → `<button onClick={handleViewMissions}>`.
- Заголовок: `text-base font-semibold text-white` (убрать `font-serif/font-display`, `sm:text-xl`).
- Подпись: `text-xs text-cosmic-secondary`.

## Единый стиль (как CallHero)
- Корень: `<button>` с `group relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ... p-5 text-left shadow-lg transition-transform active:scale-[0.99]`.
- Заголовок: `text-base font-semibold text-white`.
- Подзаголовок: `text-xs text-cosmic-secondary`.
- Иконка: круг 64×64 с градиентом и shadow.

## Файлы к изменению
- `src/components/DailyAdviceDisplay.tsx`
- `src/components/universe/UniverseMessageBlock.tsx`
- `src/components/ZodiacBadgeDisplay.tsx`
- `src/components/MainPageComponents/AffirmationsBlock.tsx`
- `src/components/NumerologyDisplay.tsx`
- `src/components/numerology/NumerologyContent.tsx`
- `src/components/MainPageComponents/CosmicMissionsEntryPoint.tsx`

Логика навигации, расчёты нумерологии и данные знаков зодиака не изменяются — только разметка и стили.
