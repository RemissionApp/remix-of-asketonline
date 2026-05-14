## Что нужно исправить

1. **Календарь даты рождения** — сейчас в `src/components/ui/calendar.tsx` сверху отрисовываются «Год: 1990» и «Месяц: 1» как сырые слайдеры, а `ProfileForm` дополнительно включает `captionLayout="dropdown"`, из-за чего поверх ещё рендерятся нативные `<select>` Month/Year (белая засветка на скриншоте). Плюс в шапке цифры дней «засвечены» — это `day_today` со светлым `bg-accent` без контраста.
2. **Онбординг** — шаги 1 и 2 в `src/pages/OnboardingPage.tsx` всё ещё показывают «Бесплатные функции» vs «Pro функции», хотя бесплатной версии больше нет. Должен быть только триал → Pro.
3. **Кнопка «Оформить Pro»** на `/comparison` — на web не работает: рендерится fallback `<Button>` (когда `monthlyPkg` и `annualPkg` не нашлись в `web.offering`), и его `onClick` дёргает `web.purchase(availablePackages[0])`. Если оффер не успел загрузиться или identifier пакетов не содержит `month/annual/year`, кнопка молча ничего не делает. Также если `web.offering` вовсе пустой, fallback не рендерится из-за `if (!monthlyPkg && !annualPkg)`.
4. **OTP-письмо** — `supabase/functions/send-otp-email/index.ts` использует имя «Asket / Аскет», лиловый бренд-градиент `hsl(260, 80%, 65%)` и адрес `Asket <noreply@remissionsoft.net>`. Нужно «Asceta» во всех языках + цвета бренда (космический тёмный + золотой акцент `cosmic-gold`).

## План

### Шаг 1. Календарь даты рождения
**Файл:** `src/components/ui/calendar.tsx` — переписать.
- Удалить блоки слайдеров «Год/Месяц».
- Кастомный header (`components.Caption`): два аккуратно стилизованных `<select>` (месяц, год) на тёмном фоне в стиле cosmic (`bg-cosmic-dark/60 border-cosmic-accent/30 text-white`), плюс кнопки «‹ ›» для шага по месяцам.
- Диапазон годов: `fromYear..toYear` если переданы, иначе `currentYear-100..currentYear`.
- Дни: `day_selected` — `bg-cosmic-accent text-white`; `day_today` — `border border-cosmic-gold/40` без светлой заливки (чтобы не «засвечивало»); `day_outside`/`day_disabled` — `text-cosmic-secondary/40`.
- Шапка дней недели — `text-cosmic-secondary`, фон поповера — уже задан в `ProfileForm`.

**Файл:** `src/components/ProfileForm.tsx`
- Убрать `captionLayout="dropdown"` (наш кастомный header его заменяет).
- В `PopoverContent` поднять контраст: `bg-cosmic-dark/95` (вместо `/30`) и убрать `backdrop-blur` (на фото он смешивается с фоном звёзд).

**Файл:** `src/components/BirthDateEditor.tsx` — без изменений (использует тот же `Calendar`).

### Шаг 2. Онбординг — убрать сравнение тарифов
**Файл:** `src/pages/OnboardingPage.tsx`
- Сделать 2 шага вместо 3: `welcome` и `proTrial`.
- Шаг 1 (welcome) — как сейчас (заголовок + описание + «Войти/Далее»).
- Шаг 2 — единственный экран «Asceta Pro · 3 дня бесплатно»: иконка `Crown`, заголовок «3 дня бесплатно», подпись «Полный доступ ко всем функциям, без ограничений», список из `PRO_FEATURES` (тот же, что в `FeatureComparison`). Кнопка «Начать путь» вызывает `completeOnboarding()`.
- Удалить ветку `step === 1` с «Бесплатные функции» полностью.
- В `t.onboarding`: использовать существующие ключи `proFeatures`/`steps.proFeatures`; ключ `freeFeatures` больше не читаем (оставляем в i18n, не удаляем — чтобы не ломать типы).

### Шаг 3. Кнопка «Оформить Pro» на /comparison
**Файл:** `src/components/FeatureComparison.tsx`
- Перед рендером тарифов проверять `web.isLoading` → показывать скелетон/«Загружаем тарифы…».
- Если `web.isReady` и `availablePackages.length > 0`, но ни `monthly`, ни `annual` не определились — рендерить **все** доступные пакеты циклом (`availablePackages.map`), а не один fallback.
- Fallback-кнопка «Оформить Pro»: убрать условие `!monthlyPkg && !annualPkg` — если пакетов вообще нет, показывать сообщение «Тарифы временно недоступны, попробуйте позже» + кнопку «Обновить» (`web.refresh()`), не молчаливый no-op.
- Логировать `console.warn('[Paywall] no packages', web.offering)` чтобы диагностировать на проде.

**Файл:** `src/utils/revenueCatWeb.ts` (быстрая проверка) — убедиться, что `getWebOfferings()` возвращает `current` оффер; если нет — попробовать `all['default']`. (Если уже так — пропустить.)

### Шаг 4. OTP-письмо
**Файл:** `supabase/functions/send-otp-email/index.ts`
- Заменить во всех `subject/instructions/footerNote` `Asket` → `Asceta`, `Аскет` → `Asceta`.
- В `from`: `"Asceta <noreply@remissionsoft.net>"`.
- Шапка/код-секция: заменить лиловый градиент на бренд:
  - header background: `linear-gradient(135deg, #0F0B1F 0%, #1A1333 100%)` (cosmic-dark) с золотой обводкой `1px solid rgba(232,193,108,0.35)`;
  - logo: `color: #E8C16C` (cosmic-gold), serif шрифт;
  - code-section: тёмный фон + золотой бордер, цифры — `color: #E8C16C`, не белый блок.
- Subtitle/instructions: заголовок `color: #E8C16C`, текст `rgba(255,255,255,0.85)`.
- Деплой функции `send-otp-email` после изменений.

### Шаг 5. Проверка
- TS-компиляция (`bunx tsc --noEmit`).
- Открыть `/profile-setup` → дата рождения: ровный кастомный селектор без сырых элементов.
- Онбординг: 2 шага, без блока «Бесплатные функции».
- `/comparison` на web: либо реальные пакеты, либо понятное сообщение + кнопка обновить.
- Запросить OTP, проверить письмо: «Asceta», тёмно-золотой стиль.

Файлы НЕ трогаю: `supabase/client.ts`, `types.ts`, `capacitor.config.ts`, `.env`, `ios/`, `android/`.