## Что меняем

### 1. Кнопка «Позвонить» в десктоп‑сайдбаре (это та зелёная пилюля со скриншота)
Файл: `src/components/desktop/DesktopSidebar.tsx`
- Заменить `bg-gradient-to-r from-emerald-500 to-emerald-600` на мистический фиолетово‑фуксиевый градиент с двойным glow и пульсирующим ореолом, в едином стиле с круглой кнопкой звонка.
- Локализовать подпись: RU «Позвонить Вселенной», EN «Call Lyra», ES «Llamar a Lyra» (сейчас просто «Call»/«Позвонить»).
- Добавить мягкое свечение и анимацию `animate-ping` за иконкой телефона.

### 2. EN‑тексты на странице звонка
Аудит ключей `lyra.*` в `src/i18n/languages/en.ts` и употребления в:
- `src/pages/CallPage.tsx` (заголовок шапки)
- `src/components/voice/VoiceCallInterface.tsx` (заголовок, ошибки, лимит)
- `src/components/voice/UniverseCaptions.tsx`, `CallStatus.tsx`, `CallStatusIndicator.tsx`
- `src/components/MainPageComponents/CallHero.tsx` (фолбэк уже корректный, проверить)
- `src/pages/UniverseHubPage.tsx`
Цель: на английском везде «Call Lyra» / «Lyra’s Call» / «Lyra is listening», без русских формулировок и без «Universe» там, где должна быть «Lyra».

### 3. Усиление мистики и реакция на речь Вселенной
Файл: `src/components/voice/VoiceCallInterface.tsx`
- Прокинуть `isSpeaking` в стили кнопки «Позвонить»/«End».
- При `isSpeaking`: ускорить `animate-ping` (1.2s), увеличить интенсивность shadow (`shadow-[0_0_80px_rgba(168,85,247,0.85)]`), добавить третий внешний расширяющийся ринг и слой парящих частиц (12 точек со случайными траекториями, CSS keyframes).
- Аналогичная реакция в `CallHero.tsx` и в новой мистической пилюле сайдбара (когда `isConnected && isSpeaking` — синхронизация через тот же хук `useElevenLabsConversation`/контекст; сайдбар читает `useConversationStatus`, если есть, иначе оставляем дефолтную пульсацию).

### 4. Параллакс и дрейф галактики на десктопе
Файл: `src/components/desktop/DesktopShell.tsx`
- Создать `GalaxyParallax.tsx`: два слоя — фоновый nebula (медленный drift) и слой звёзд (более быстрый drift + лёгкое смещение по `scrollY`).
- CSS keyframes: `@keyframes galaxy-drift { 0%{transform:translate3d(0,0,0) scale(1.05)} 50%{transform:translate3d(-1.5%,-1%,0) scale(1.08)} 100%{transform:translate3d(0,0,0) scale(1.05)} }` 60s ease‑in‑out infinite.
- Параллакс по скроллу: `transform: translate3d(0, scrollY * 0.05, 0)` для nebula, `* 0.15` для звёзд (через `requestAnimationFrame`, без сторонних либ).
- Включается только на `lg:` и при `prefers-reduced-motion: no-preference`.

### 5. Мистический фон‑дрон на экране звонка
- Добавить аудиофайл `src/assets/audio/cosmic-drone.mp3` (короткий ~30–45 с loop). Сгенерировать через ElevenLabs SFX (edge function) или попросить пользователя загрузить — **уточняю в шаге A ниже**.
- Хук `src/hooks/useAmbientDrone.ts`: `<audio loop>` с fade‑in/out, читает настройки из `useAppStore` (`ambientEnabled: boolean`, `ambientVolume: number 0..1`).
- Подключить в `CallPage.tsx`: автозапуск при монтировании, остановка при unmount.

### 6. Настройки звука в Профиле/Настройках
Файл: `src/pages/AccountSettingsPage.tsx` (или соответствующая секция настроек) + `src/store/useAppStore.ts`
- Новая секция «Атмосфера»:
  - Switch «Космический дрон во время звонка» (`ambientEnabled`).
  - Slider «Громкость» 0–100 % (`ambientVolume`), disabled когда выключено.
- Persist в localStorage через существующий механизм zustand persist.
- i18n‑ключи: `settings.ambientTitle`, `settings.ambientToggle`, `settings.ambientVolume` для ru/en/es.

### 7. Качество фоновой картинки Вселенной в вебе
- Перегенерировать `src/assets/cosmic-galaxy-bg.jpg` в **premium** качестве 1920×1920, более резко, без размытий, с явной космической детализацией.
- В `DesktopShell.tsx` задать `bg-cover bg-[center_top]`, `image-rendering: high-quality`, и явно указать минимальную высоту фонового слоя (`min-h-screen`), чтобы не было апскейла на больших мониторах.
- Доп. слой: тонкая виньетка `radial-gradient` к краям для более кинематографичного вида.

## Технические детали

- Mystical pill (sidebar):
  ```text
  bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-700
  border border-fuchsia-300/40
  shadow-[0_0_25px_rgba(168,85,247,0.55),0_0_60px_rgba(139,92,246,0.3)]
  + absolute -inset-1 rounded-xl bg-fuchsia-400/15 blur-md animate-pulse
  ```
- Speaking‑pulse — управляется через `data-speaking="true"` атрибут, CSS подбирает более интенсивные keyframes.
- Параллакс:
  ```text
  useEffect(() => {
    const onScroll = () => requestAnimationFrame(() => {
      nebulaRef.current.style.transform = `translate3d(0, ${scrollY*0.05}px, 0)`;
      starsRef.current.style.transform  = `translate3d(0, ${scrollY*0.15}px, 0)`;
    });
    window.addEventListener('scroll', onScroll, { passive: true });
  }, []);
  ```
- Drone audio: HTMLAudioElement, `audio.volume = ambientVolume`, fade через `setInterval` 50 мс шагами по 0.05.

## Что НЕ трогаем
- Логику ElevenLabs, биллинг минут, RLS, мобильную верстку.
- Существующие зелёные индикаторы статуса (точки «онлайн») — это корректный сигнал, не CTA.

## Файлы
Изменения: `DesktopSidebar.tsx`, `DesktopShell.tsx`, `VoiceCallInterface.tsx`, `CallHero.tsx`, `CallPage.tsx`, `AccountSettingsPage.tsx`, `useAppStore.ts`, `en.ts`/`ru.ts`/`es.ts`, `cosmic-galaxy-bg.jpg`.
Новые: `GalaxyParallax.tsx`, `useAmbientDrone.ts`, `src/assets/audio/cosmic-drone.mp3`.

## Уточнение перед стартом
**A. Источник звука дрона:** сгенерировать через ElevenLabs SFX (нужен `ELEVENLABS_API_KEY` — он уже подключён) и закешировать как mp3 в `src/assets/audio/`, или подождать ваш файл? По умолчанию — сгенерирую сам, ~40 с loop, тёплый космический ambient + лёгкий шёпот ветра.
