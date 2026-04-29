## Редизайн: «жидкое стекло» в стиле iOS

Цель — внести единый стеклянный (glassmorphism) визуальный язык по всему приложению: прозрачные блюр-поверхности, свечение, плавающие панели, мягкие тени и красивые иконки вместо длинных текстовых кнопок.

---

### 1. Глобальная стеклянная система (фундамент)

**`src/styles/components.css`** — добавить переиспользуемые утилиты:

- `.glass` — базовое стекло: `backdrop-blur-2xl`, `bg-white/5`, `border border-white/10`, тонкая внутренняя подсветка через `box-shadow: inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.35)`.
- `.glass-strong` — более плотное стекло для верхней/нижней панелей (`bg-cosmic-dark/40`, `backdrop-blur-3xl`, `saturate-150`).
- `.glass-card` — для контентных блоков на главной (`rounded-2xl`, мягкая подсветка края, hover-glow).
- `.glass-icon-btn` — круглая стеклянная кнопка-иконка с свечением и `active:scale-95`.
- `.glow-ring` — анимированное мягкое свечение по периметру (для активных элементов).

**`tailwind.config.ts`** — добавить:
- `boxShadow.glass`, `boxShadow.glass-glow`
- `backdropBlur.3xl: '40px'`
- keyframes `shimmer` (медленное скольжение блика по стеклу) и `breathe` (мягкое пульсирующее свечение).

---

### 2. Верхняя панель (TopBar) — плавающее стекло

`src/components/TopBar.tsx` + `src/pages/MainPage.tsx`:

- Убрать сплошной `bg-cosmic-dark/80` и border-bottom.
- Сделать TopBar **плавающим**: отступ сверху (с учётом safe-area), отступы по бокам `mx-3`, `rounded-2xl`, класс `.glass-strong`.
- Контейнер-обёртка получает `pointer-events-none`, сама панель — `pointer-events-auto`, чтобы свечение не блокировало контент.
- Добавить тонкий блик сверху (`::before` градиент белый→прозрачный) и мягкое внешнее свечение `shadow-glass-glow`.
- Иконки энергии/звука/зодиака — в стиле `.glass-icon-btn`.

---

### 3. Нижняя навигация (BottomNavigation) — как в Telegram

`src/components/BottomNavigation.tsx`:

- Превратить в **плавающую плашку**: отступ от низа (`bottom: calc(env(safe-area-inset-bottom) + 12px)`), `mx-3`, `rounded-3xl`, `.glass-strong`.
- Убрать `border-top`, добавить мягкую тень снизу и подсветку сверху.
- Активная вкладка — кружок-«пилюля» позади иконки с `bg-cosmic-accent/25`, `backdrop-blur`, glow-ring и плавной `transition-all`.
- Иконки слегка крупнее (20px), подписи `text-[10px]` с `tracking-wide`.
- Учесть в `MainPage` — увеличить `pb-` контейнера, чтобы контент не уходил под плавающую панель.

---

### 4. Блок «Диалог со Вселенной» — иконочные кнопки

`src/components/universe/UniverseMessageBlock.tsx`:

- Переделать карточку под `.glass-card` с фоновой картинкой за стеклом (картинка остаётся, поверх — стеклянный слой `bg-white/5 backdrop-blur-xl`).
- Заменить две широкие кнопки на **две круглые стеклянные иконки** по центру:
  - **«Задать вопрос»** — иконка `MessageCircleQuestion` (lucide), золотое свечение.
  - **«Позвонить Вселенной»** — иконка `PhoneCall`, фиолетово-индиго свечение, мягкая `breathe`-анимация.
- Обе кнопки показываются **всегда** (не только PRO); если пользователь не PRO — нажатие на «Звонок» ведёт на paywall (через существующий механизм роутинга `/universe-call`, где уже есть гейт).
- Под иконками — короткие подписи `text-xs` на трёх языках.
- Размер иконок 56–64px, `rounded-full`, `.glass-icon-btn` + индивидуальное свечение через `shadow-[0_0_24px_rgba(...)]`.

---

### 5. Все блоки главной страницы — единый стеклянный язык

Применить `.glass-card` (заменив текущие `bg-cosmic-dark/...`, плотные бордеры) в:

- `DailyAdviceDisplay.tsx`
- `AffirmationsBlock.tsx`
- `MeditationBlock.tsx`
- `NumerologyDisplay.tsx`
- `ZodiacBadgeDisplay.tsx`
- `CosmicMissionsEntryPoint.tsx`
- `UserGreetingSection.tsx` (карточка приветствия с лёгким стеклом и shimmer-бликом)
- `PactDisplay` (рамка-стекло)

Общие правила:
- `rounded-2xl`, тонкий `border-white/10`, `backdrop-blur-xl`, `bg-white/[0.04]`.
- Иконки-заголовки в кружке-стекле `bg-white/10` вместо `bg-cosmic-accent/20`.
- Hover: лёгкое усиление прозрачности и свечение края.

---

### 6. Генерация фоновых изображений (Lovable AI / Nano banana)

Сгенерировать 2 PNG и положить в `public/`:

1. `public/glass-bg-cosmic.png` — мягкий космический градиент (фиолетово-индиго-золото, размытые туманности) — фон под главной для усиления эффекта стекла.
2. `public/universe-glass-bg.png` — обновлённая картинка для блока «Диалог со Вселенной» (силуэт галактики, чтобы стекло «играло» поверх).

Использовать модель `google/gemini-2.5-flash-image` через Lovable AI Gateway (без ключа). Сохранить локально, подключить как фон в `body` (через `base.css`) и в `UniverseMessageBlock`.

---

### 7. Мелочи и QA

- Проверить, что `pb` основного контейнера в `MainPage` достаточен с учётом плавающей нижней панели.
- Убедиться, что `z-index` верхней/нижней панелей выше контента, но `pointer-events` не ломает скролл.
- Сохранить адаптив: на mobile отступы плавающих панелей меньше (`mx-2`), на десктопе — `mx-4`.
- Никаких изменений логики, переводов, роутов, авторизации.

---

### Затронутые файлы

- `src/styles/components.css`, `src/styles/base.css`
- `tailwind.config.ts`
- `src/components/TopBar.tsx`
- `src/components/BottomNavigation.tsx`
- `src/pages/MainPage.tsx` (отступы под плавающие панели)
- `src/components/universe/UniverseMessageBlock.tsx`
- `src/components/MainPageComponents/UserGreetingSection.tsx`
- `src/components/MainPageComponents/AffirmationsBlock.tsx`
- `src/components/MainPageComponents/MeditationBlock.tsx`
- `src/components/MainPageComponents/CosmicMissionsEntryPoint.tsx`
- `src/components/MainPageComponents/PactDisplay.tsx`
- `src/components/DailyAdviceDisplay.tsx`
- `src/components/NumerologyDisplay.tsx`
- `src/components/ZodiacBadgeDisplay.tsx`
- `public/glass-bg-cosmic.png`, `public/universe-glass-bg.png` (новые)
