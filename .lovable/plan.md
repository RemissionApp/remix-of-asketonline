## План работ

Меняем только разметку, стили и тексты переводов. Логику, роуты, Supabase и хуки не трогаем.

---

### Часть 1. Откат «Лиры» в русском (EN и ES не трогаем)

В `src/i18n/languages/ru.ts` блок `lyra: { ... }` переписываем под «Вселенную»:

- `voiceGuide: 'Вселенная'`
- `callButton: 'Позвонить Вселенной'`
- `callScreen: 'Звонок Вселенной'`
- `callTitle: 'Звонок Вселенной'`
- `callButtonShort: 'Позвонить Вселенной'`
- `callHistory: 'Разговоры со Вселенной'`
- `callSubtitle: 'Вселенная всегда рядом и готова слушать'`
- `callTip: 'Нажмите на кнопку звонка, чтобы соединиться со Вселенной…'`
- `hearFromGuide: 'Услышать от Вселенной'`
- `errorMicDenied`, `errorAgentUnavailable` — заменить «Лира/Лире/Лирой» → «Вселенная/Вселенной».

В `src/i18n/languages/ru.ts` (раздел `universeChat`): `chatTitle`, `chatProTitle`, `chatProMessage` уже на «Вселенной» — проверим и оставим.

EN (`en.ts`) и ES (`es.ts`) не меняем — там остаётся `Lyra`.

Ключ объекта `lyra` в коде остаётся (это технический namespace), меняется только видимый текст для русского.

---

### Часть 2. Упрощение экрана звонка (мобильная версия)

Файл: `src/components/voice/VoiceCallInterface.tsx`.

Убираем с экрана:
- `<WaveVisualization />` (диаграмма голоса);
- `<UniverseAvatar />` визуальная индикация «как звучит»;
- `<CallStatus />` («Ready to connect / Готов к соединению / Connecting…»);
- `<UniverseCaptions />` (живые субтитры) — на мобиле тоже скрываем;
- подпись `getSubtitle()` под заголовком;
- длинный tip-текст `getTipText()`.

Оставляем:
- заголовок (`Звонок Вселенной` / `Lyra's Call` / `Llamada de Lyra`);
- одну круглую кнопку звонка (старт/стоп) с пульсацией;
- маленькую строку «Осталось N мин» под кнопкой;
- таймер длительности при активном звонке (компактный, под кнопкой).

Контейнер карточки делаем компактнее под мобильный экран: убираем тяжёлые тени и градиенты, фиксируем минимальные отступы, центрируем кнопку по вертикали в доступной высоте `var(--content-height)`.

Импорты `WaveVisualization`, `UniverseAvatar`, `CallStatus`, `UniverseCaptions` из файла удаляем (сами компоненты не удаляем — могут использоваться где-то ещё; проверю `rg` и удалю только если нигде больше не используются).

---

### Часть 3. Мобильная адаптация (по шагам из ТЗ)

Выполняем шаги 1–13 из присланной спецификации, с правками под существующий проект:

1. **`capacitor.config.ts`** — обновить `ios`, `android`, `plugins` (SplashScreen, StatusBar, Keyboard) согласно ТЗ. Сохранить существующий `appId` и `server.url`.
2. **`src/index.css`** — добавить базовый сброс, safe-area переменные (`--sat`, `--sab`, `--topbar-height`, `--bottomnav-height`, `--content-height`), утилиты `.pt-safe/.pb-safe/.scroll-view`, скрытие скроллбара, `min-height: 44px` для интерактивных элементов, `font-size: max(16px,1rem)` для инпутов. Существующие токены дизайн-системы сохраняем.
3. **`tailwind.config.ts`** — добавить брейкпоинты `xs/sm/md`, safe-area `spacing`, `height.screen-safe/content`, шкалу `fontSize` (`micro/tiny/small/base/medium/large/title/hero`), плагин с утилитами `pb-safe/pt-safe/mb-safe/scrollbar-none`. Не ломаем уже используемые классы.
4. **`src/components/AppLayout.tsx`** — создать общий контейнер (`fixed inset-0 flex flex-col`), TopBar + scrollable main с `pb-[calc(64px+env(safe-area-inset-bottom))]` + BottomNavigation. Прим. в `App.tsx` для всех табовых страниц.
5. **TopBar** — обновить существующий компонент шапки (найду через `rg`): `pt-[calc(env(safe-area-inset-top)+8px)]`, h=56+safe, glass-фон.
6. **`BottomNavigation.tsx`** — `fixed bottom-0`, `pb-[calc(env(safe-area-inset-bottom)+8px)]`, иконки 21px, лейблы `text-[10px]`, активный индикатор, `min-h-[44px]`.
7. **Карточки** — единый шаблон (`rounded-2xl bg-white/7 backdrop-blur-xl border border-white/10 active:scale-[0.98] min-h-[76px]`) применить к карточкам разделов на главной, в «Космосе», «Вселенной».
8. **Главный экран `MainPage.tsx`** — структура «приветствие → hero-кнопка звонка → пакты/CTA → совет дня», адаптивная типографика.
9. **Типографика** — заменить `text-xs/sm/base/lg/xl/2xl/3xl` в ключевых компонентах на `text-tiny/small/base/medium/large/title/hero`. Запрещаем размеры < 11px (кроме лейблов BottomNavigation 10px).
10. **`useKeyboardAware`** — создать хук на `@capacitor/keyboard` (плагин уже есть в зависимостях — проверю; иначе добавлю). Подключить в `LoginPage`, `OnboardingPage`, `CreatePactPage`, `UniverseChatPage`.
11. **`CallPage.tsx`** — полноэкранный layout без BottomNavigation: header с кнопкой назад/X, центрированная упрощённая VoiceCallInterface (см. часть 2), кнопка завершения снизу с `pb-safe`.
12. **Fullscreen-страницы** (DetailedHoroscopePage, FullHoroscopePage, CreatePactPage, CallPage и др.) — обернуть в `FullScreenLayout` без BottomNavigation, добавить safe-area.
13. **Финальная проверка** — пройти чек-лист (горизонтальный скролл, safe-area на iPhone SE/14/Pro Max, Android, перекрытие нижней навигации, клавиатура).

---

### Технические детали

- Существующая дизайн-токены в `index.css` (HSL-переменные, `--cosmic-*`) сохраняем; новое добавляем рядом.
- Tailwind: `screens` переопределяем (xs=375, sm=390, md=430, lg=768, xl=1024) — это может сместить текущие брейкпоинты `sm:`/`md:`. Пройдусь `rg` по `sm:`/`md:`/`lg:` и поправлю критичные места (в основном это уже мобильные классы, последствия минимальны).
- `BottomNavigation` уже существует — переписываем его JSX/классы под новую сетку, поведение и пункты меню оставляем как есть.
- Удалённые с экрана звонка компоненты (`WaveVisualization`, `UniverseAvatar`, `CallStatus`, `UniverseCaptions`) оставляем в `src/components/voice/` как файлы — на случай возврата.
- Никаких изменений в `src/integrations/supabase/*`, edge functions, `useElevenLabsConversation`, store, роутах.

---

### Порядок выполнения

1. Откат RU-переводов `lyra.*`.
2. Упрощение `VoiceCallInterface.tsx`.
3. CSS reset + safe-area (`index.css`).
4. `tailwind.config.ts` (брейкпоинты, шрифты, плагин).
5. `capacitor.config.ts`.
6. `AppLayout` + TopBar + BottomNavigation.
7. `MainPage`, карточки на главной/Космос/Вселенная, типографика.
8. `useKeyboardAware` + интеграция в формы.
9. `CallPage` + остальные fullscreen-экраны.
10. Прогон по чек-листу через preview на 375/390/430.
