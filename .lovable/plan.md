
# План: Идеальный модуль нумерологии для Asceta

Реализуем по 3 крупным блокам. После каждого блока — проверка в превью и согласование, перед переходом к следующему.

---

## БЛОК 1 — Фундамент (математика + базовые тексты + переводы)

### 1.1 `src/utils/numerology/calculations.ts`
Вся математика согласно ТЗ:
- `pythagoreanReduce` (мастер-числа 11/22/33 не редуцируются)
- `lifePathNumber` — редуцируем день/месяц/год по отдельности, потом сумма
- `expressionNumber`, `soulNumber`, `personalityNumber` — Пифагор RU+EN таблицы
- `maturityNumber`, `personalYearNumber`, `balanceNumber`, `birthdayNumber`
- Халдейская система: `chaldeanReduce`, `chaldeanNameNumber`, `chaldeanLifePath` (compound + single)
- `pythagoreanSquare` — рабочие числа A/B/C/D, ячейки 1-9, ряды, диагонали, характеристики
- `karmaMatrix` — center/sky/earth/missions/corners/talent/karmaBlock/planets

### 1.2 `src/utils/numerology/__tests__/calculations.test.ts`
Эталонный тест на дате **14.03.1995**:
- Life Path = 5
- Квадрат Пифагора с правильным распределением цифр
- Халдей compound/single
- Матрица Кармы все позиции

### 1.3 `src/utils/numerology/astroLinks.ts`
- `NUMBER_PLANETS`, `NUMBER_ZODIAC`, `NUMBER_ELEMENTS`
- `TAROT_ARCANA` — 22 аркана (имя, планета, ключевые слова, краткое значение) на ru/en/es
- `PLANET_SYMBOLS`, `ZODIAC_SYMBOLS`
- `numberCompatibility(n1, n2)`

### 1.4 `src/utils/numerology/interpretations.ts`
Базовые шаблоны для чисел 1–9, 11, 22, 33.
Каждое число содержит:
- `pythagorean.lifePath`: title, essence (2-3 предложения), shadow, gifts[], challenges[], mission, affirmation, relationships, career, spiritual
- `pythagorean.soul`, `pythagorean.personality`, `pythagorean.expression` — короткие описания
- `chaldean.compound`, `chaldean.single` — короткие описания
- `squareCell` — для каждой позиции 1–9: значения absent/weak/medium/strong/very_strong
- `colors`, `crystals`, `luckyDay`, `luckyNumbers`

Тон: глубокий, мистический, безоценочный, на «вы».
Эти шаблоны короткие и охватывают все 12 чисел — глубокий персональный разбор делает LLM в Блоке 3.

### 1.5 Переводы
Добавить ключи в `src/i18n/languages/ru.ts`, `en.ts`, `es.ts`:
- `numerology.title`, `subtitle`
- `numerology.systems.{pythagorean,chaldean,both}`
- Названия чисел: `lifePathNumber`, `soulNumber`, `personalityNumber`, `expressionNumber`, `maturity`, `personalYear`, `balance`, `birthday`
- `numerology.square.{1..9}` — Характер, Энергия и т.д.
- `numerology.karma.*` — mainNumber, sky, earth, personalMission, socialMission
- `numerology.gifts`, `challenges`, `mission`, `affirmation`, `ruledBy`, `hearFromUniverse`, `squareAnalysis`, `chaldeanView`, `masterNumber`
- `planets.{sun,moon,mars,venus,mercury,jupiter,saturn,uranus,neptune,pluto,earth}`

---

## БЛОК 2 — UI (визуал + страница)

### 2.1 `src/components/numerology/PythagoreanSquareSVG.tsx`
- viewBox 0 0 320 320, 3×3 клетки 100×100 + gap 10
- Каждая клетка — стеклянный rect с цветом по силе (0/1/2/3/4+)
- Точки-звёзды вместо цифр (count кружков)
- Диагонали 1-5-9 (золото) и 3-5-7 (фиолет), горизонтали белым
- 50 случайных звёзд через `useMemo([])`
- Анимации в `src/styles/numerology.css` (keyframes, не inline random)

### 2.2 `src/components/numerology/KarmaMatrixSVG.tsx`
- viewBox 0 0 400 400
- Центральный круг (главное число)
- Ромб: небо/земля/личная/социальная миссии
- 4 угла кармических задач
- 7 планет на круге r=130 с символами Unicode
- Анимации: вращение внешнего кольца, pulse центра, twinkle звёзд

### 2.3 `src/styles/numerology.css`
Все keyframes: twinkle, pulse-glow, draw-line, orbit-slow/medium/fast, rotate-slow.
Подключить в `src/styles/index.css`.

### 2.4 Подкомпоненты `src/components/numerology/`
- `NumberCard.tsx` — большая цифра + название + планетарный символ + бейдж «Мастер-число»
- `NumberDetailAccordion.tsx` — раскрывающийся разбор (essence, gifts/challenges, mission, affirmation, planet)
- `SquareAnalysisAccordion.tsx` — для каждой ячейки 1–9 текст по strength
- `KarmaPositionCard.tsx` — позиция с арканом Таро
- `WorkingNumbersStrip.tsx` — A/B/C/D полоска

### 2.5 `src/pages/NumerologyPage.tsx` — полностью переписать
Структура (см. ТЗ):
1. Заголовок (subtitle, title, имя·дата)
2. Переключатель систем: Пифагор / Халдей / Обе
3. Горизонтальный скролл главных чисел (NumberCard)
4. Табы матриц: Квадрат Пифагора (SVG + рабочие числа A/B/C/D) | Матрица Кармы (SVG)
5. Детальный разбор (аккордеоны NumberDetailAccordion)
6. Разбор Квадрата Пифагора (SquareAnalysisAccordion)
7. Разбор Матрицы Кармы (центральное число + 4 позиции)

Все вычисления в `useMemo` с зависимостью от `birthDate`+`fullName`.
Старый `numerologyUtils.ts`, `DestinyMatrix.tsx`, `FullDestinyMatrix.tsx`, `MatrixDescription.tsx` удаляются после переключения страницы (импорты обновлены).

Обновить `numerologyUtils.test.ts` или удалить и заменить новыми тестами.

---

## БЛОК 3 — Backend (LLM глубокий разбор) + проверка

### 3.1 `supabase/functions/generate-numerology-description/index.ts`
Полностью переработать:
- Принимает: `userId`, `readingId`, `language`, `birthDate`, `fullName`, `zodiacSign`, и весь рассчитанный набор (lifePath, soul, personality, expression, personalYear, square, karma)
- Системный промпт мастера-нумеролога (см. ТЗ)
- Через Lovable AI Gateway, модель `google/gemini-3-flash-preview`
- Обработка 429 / 402
- Кэш в таблице `numerology_descriptions` по `(user_id, reading_id, language)`
- Возвращает структуру: суть, дары, уроки, миссия, совет, аффирмация — поблочно для разных чисел

### 3.2 На странице
Кнопка «Получить персональный разбор от Вселенной» вызывает функцию, ответ показывается в специальном блоке под аккордеонами с typing-эффектом.

### 3.3 Финальная QA
Прогнать тесты, проверить превью на дате 14.03.1995:
- Life Path = 5 ✓
- Все ячейки квадрата соответствуют эталону
- Анимации без глюков мерцания
- Скролл и тексты не обрезаются на десктопе и мобиле (с учётом предыдущих фиксов)

---

## Технические детали

**Файлы создаются:**
```
src/utils/numerology/
  ├ calculations.ts
  ├ astroLinks.ts
  ├ interpretations.ts
  └ __tests__/calculations.test.ts
src/components/numerology/
  ├ PythagoreanSquareSVG.tsx
  ├ KarmaMatrixSVG.tsx
  ├ NumberCard.tsx
  ├ NumberDetailAccordion.tsx
  ├ SquareAnalysisAccordion.tsx
  ├ KarmaPositionCard.tsx
  └ WorkingNumbersStrip.tsx
src/styles/numerology.css
```

**Файлы переписываются:**
- `src/pages/NumerologyPage.tsx`
- `supabase/functions/generate-numerology-description/{index.ts,prompts.ts,generator.ts}`
- `src/i18n/languages/{ru,en,es}.ts` (добавление ключей)

**Удаляются после переключения:**
- `src/utils/numerologyUtils.ts`
- `src/components/DestinyMatrix.tsx`
- `src/components/FullDestinyMatrix.tsx`
- `src/components/MatrixDescription.tsx`
- `src/utils/__tests__/numerologyUtils.test.ts`

**Не трогаем:** `src/integrations/supabase/*`, `capacitor.config.ts`, RevenueCat.

---

## Порядок согласования

После каждого блока я останавливаюсь и показываю результат. Вы проверяете и говорите «ок» или просите правки.

1. **Блок 1** ≈ математика + интерпретации + переводы. Проверка: тесты на 14.03.1995 проходят.
2. **Блок 2** ≈ SVG + новая страница. Проверка: визуал в превью.
3. **Блок 3** ≈ edge function с LLM. Проверка: персональный разбор приходит.

Готов начинать с Блока 1?
