## План — фикс прокрутки на мобильной и планшетной версии

### Проблема
В прошлом цикле я починил скролл на десктопе через `lg:hidden` для fixed `TopBar` и `BottomNavigation`. Но на мобильной (< 768px) и планшетной (768–1023px) разметке остаётся проблема: фиксированная обёртка `TopBar` имеет `pointer-events: auto` (по умолчанию) и перекрывает верхнюю часть экрана, перехватывая жесты скролла. Кроме того, `min-h-screen` + `100dvh` от родителей могут не давать контенту нормально расти.

### Что меняю

**`src/pages/MainPage.tsx`**
1. Fixed-обёртке `TopBar` добавить `pointer-events-none` (сам `TopBar` внутри уже включает `pointer-events-auto` для интерактивных элементов). Это снимет блокировку touch-скролла в верхней зоне.
2. На мобильной и планшетной версии гарантировать достаточный `padding-top` под фиксированный `TopBar` и `padding-bottom` под `BottomNavigation` с учётом `env(safe-area-inset-*)`. Заменю `pt-16` на динамический отступ, и `pb-32` на `pb-[calc(var(--bottomnav-total)+2rem)]` (переменная уже определена в `base.css`).
3. Убрать дублирующую обёртку `<div className="lg:hidden"><BottomNavigation /></div>` — сам компонент уже имеет `lg:hidden` встроенный.

**`src/components/MainPageComponents/MainContent.tsx`**
- Проверить что внутренний `<main>` не имеет `overflow-hidden` по вертикали и нормально растёт в высоту вместе с контентом (по коду уже OK, изменений не требует).

### Файлы
- `src/pages/MainPage.tsx`

### Технические детали
- `pointer-events-none` на fixed-контейнере + `pointer-events-auto` на содержимом — стандартный приём, чтобы прозрачные зоны фиксированного оверлея пропускали скролл.
- `--bottomnav-total` уже определён в `src/styles/base.css` как `calc(var(--bottomnav-height) + var(--sab))`, что корректно учитывает safe-area на iPhone.