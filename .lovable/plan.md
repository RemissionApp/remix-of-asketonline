## Goal

Adapt the main page (`/main`) for mobile (390px) by:
1. Reordering content blocks per user spec.
2. Adding a beautiful display font for Russian (matching the elegance of Cinzel for English).
3. Shrinking type sizes and vertical spacing on mobile.

## 1. New block order on MainPage

Edit `src/components/MainPageComponents/MainContent.tsx` to reorder:

```text
1. UserGreetingSection      (приветствие — без изменений)
2. PactDisplay              (текущий пакт)
3. DailyAdviceDisplay       (Совет дня)
4. UniverseMessageBlock     (Диалог со Вселенной)   ← перенесено вверх
5. ZodiacBadgeDisplay       (Гороскоп)
6. AffirmationsBlock        (Аффирмации)
7. NumerologyDisplay        (Нумерология)
8. MeditationBlock          (Медитации)
9. CosmicMissionsEntryPoint (Космические миссии)    ← в самый низ
10. ActiveMissionWidget + UserLevelDisplay остаются после миссий
```

## 2. Beautiful Russian display font

Cinzel (текущий `font-serif`) не поддерживает кириллицу — поэтому русский текст падает на запасной шрифт. Добавим **Playfair Display** (поддерживает кириллицу, элегантный, парный к Cinzel по характеру) и заведём новую утилиту `font-display`, которая автоматически выбирает правильный шрифт в зависимости от языка.

Изменения:

- `src/styles/base.css` — подгрузить Playfair Display (cyrillic + latin):
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Cormorant:wght@400;500;600;700&display=swap');
  ```
- `tailwind.config.ts` — добавить:
  ```ts
  fontFamily: {
    serif: ['Cinzel', 'serif'],
    display: ['"Playfair Display"', 'Cinzel', 'serif'], // элегантный + кириллица
    sans: ['Inter', 'sans-serif'],
    cormorant: ['Cormorant', 'serif'],
  }
  ```
- В заголовочных компонентах (`UserGreetingSection`, `UniverseMessageBlock`, `AffirmationsBlock`, `MeditationBlock`, `CosmicMissionsEntryPoint`, `NumerologyDisplay`, `ZodiacBadgeDisplay`, `DailyAdviceDisplay`) заменить логику:
  ```tsx
  // было
  const headingFontClass = language === 'en' ? 'font-serif' : 'font-sans';
  // станет
  const headingFontClass = language === 'en' ? 'font-serif' : 'font-display';
  ```
  Это даёт RU/ES красивый антиквенный шрифт (Playfair Display поддерживает все три языка), а EN сохраняет нынешний Cinzel.

## 3. Mobile typography & spacing reduction

Применяем «mobile-first»: уменьшаем размеры по умолчанию, восстанавливаем большие на `sm:` (≥640px).

| Элемент | Сейчас | Станет (mobile → desktop) |
|---|---|---|
| Greeting username `<h2>` | `text-3xl sm:text-4xl mt-2` | `text-2xl sm:text-4xl mt-1` |
| Greeting label | `text-sm` | `text-xs sm:text-sm` |
| Block titles `<h3>` (Universe/Affirmations/Meditation/Missions) | `text-xl` | `text-base sm:text-xl` |
| Block descriptions `<p>` | базовый | `text-sm sm:text-base` |
| Daily Advice text | `text-base` | `text-sm sm:text-base leading-snug` |
| Daily Advice title | базовый | `text-sm sm:text-base` |
| Section vertical margins | `mb-6` / `mt-8` | `mb-4 sm:mb-6` / `mt-5 sm:mt-8` |
| Block inner padding | `p-4` | `p-3 sm:p-4` |
| Avatar/Icon (Universe) | `h-14 w-14` | `h-11 w-11 sm:h-14 sm:w-14` |
| Icon wrappers (`size={24}`) | 24 | 20 на mobile через класс родителя (`p-1.5 sm:p-2`) |
| `MainContent` container | `px-4 py-6 pt-20` | `px-3 py-4 pt-16 sm:px-4 sm:py-6 sm:pt-20` |

Все изменения — через адаптивные Tailwind-классы, чтобы desktop остался прежним.

## 4. Files to edit

- `src/styles/base.css` — добавить Playfair Display.
- `tailwind.config.ts` — добавить `font-display`.
- `src/components/MainPageComponents/MainContent.tsx` — порядок блоков + spacing.
- `src/components/MainPageComponents/UserGreetingSection.tsx` — font-display, mobile sizes.
- `src/components/DailyAdviceDisplay.tsx` — font-display, mobile sizes.
- `src/components/universe/UniverseMessageBlock.tsx` — font-display, mobile sizes.
- `src/components/MainPageComponents/AffirmationsBlock.tsx` — то же.
- `src/components/MainPageComponents/MeditationBlock.tsx` — то же.
- `src/components/MainPageComponents/CosmicMissionsEntryPoint.tsx` — то же.
- `src/components/NumerologyDisplay.tsx` — font-display, mobile sizes.
- `src/components/ZodiacBadgeDisplay.tsx` — font-display, mobile sizes.

## 5. QA после внедрения

- Проверить `/main` на 390×740 (mobile) — заголовки компактнее, отступы меньше, читаемо.
- Переключить язык RU → заголовки рендерятся Playfair Display (антиквенный), а не Inter.
- Переключить EN → остаётся Cinzel (как сейчас).
- Проверить десктоп ≥640px — размеры как раньше.
- Порядок блоков соответствует ТЗ.

Английская типографика остаётся эталонной и не меняется.
