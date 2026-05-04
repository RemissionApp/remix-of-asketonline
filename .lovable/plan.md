## Стратегический рефакторинг Asceta — план по этапам

Большая работа разбита на 10 последовательных шагов. После каждого шага останавливаюсь и жду подтверждения.

---

### Шаг 1. База данных (SQL миграции)

Создать через миграционный инструмент:
- Таблица `call_summaries` (id, user_id, called_at, duration_seconds, summary, key_topics text[], emotional_tone) + RLS «users see own».
- Таблица `monthly_call_minutes` (user_id, month_year, minutes_used numeric, minutes_limit int default 30, UNIQUE) + RLS.
- Функция `increment_call_minutes(uuid, text, numeric)` SECURITY DEFINER с UPSERT.

---

### Шаг 2. Переименование Asket → Asceta и наставника

- Глобальный поиск/замена «Asket» → «Asceta» в `index.html`, `manifest.json`, `package.json` (display name полей), splash, meta, onboarding-копиях. Технические идентификаторы (`com.asket.*` в Android/iOS, `capacitor.config.ts`) **не трогаем** — это сломает сборку.
- В `src/i18n/languages/ru.ts|en.ts|es.ts` добавить ключи: `voiceGuide`, `callButton`, `callScreen`, `callHistory`, `callSubtitle`, `minutesLeft` (с плейсхолдером `{{count}}`), `hearFromGuide`, `limitReachedCta`. Значения — по тексту задания (RU=Вселенная, EN/ES=Lyra).
- Переименование файлов и роутов:
  - `UniversePage.tsx` → `LyraPage.tsx`, роут `/universe` → `/lyra`
  - `UniverseChatPage.tsx` → `LyraChatPage.tsx`, роут `/universe-chat` → `/lyra-chat`
  - `store/slices/universeSlice.ts` → `lyraSlice.ts`
  - `store/slices/universeQuestionSlice.ts` → `lyraQuestionSlice.ts`
  - Обновить все импорты, `App.tsx`, `useAppStore.ts`, `BottomNavigation.tsx`.
- Edge functions `universe-answer`, `universe-dialogue` — **URL не меняем** (deploy slug остаётся), только внутренние строки/комментарии можно обновить.

---

### Шаг 3. Удалить медитации

- Удалить файлы: `MeditationPage.tsx`, `NewMeditationPage.tsx`, `MeditationProPage.tsx`, `data/meditationData.ts`.
- Убрать роуты `/meditation`, `/new-meditation`, `/meditation-pro` из `App.tsx`.
- Удалить пункт медитации из `BottomNavigation.tsx` и любые ссылки/импорты в `MainPage`, `ProfilePage` и т.д.
- Поле `meditations_count` в `daily_limits` оставляем (БД не ломаем), просто не используем.

---

### Шаг 4. Удалить артефакты

- Удалить `pages/ArtifactCollectionPage.tsx`, роут `/artifacts`, `useCosmicArtifacts.ts` если он только для UI.
- Убрать ссылки/иконки артефактов из навигации, профиля, наград.
- Таблицу `cosmic_artifacts` оставляем (БД не ломаем).
- `UserLevelDisplay`, `AchievementsPage`, ранги, energy_points, `gamificationSlice` — не трогаем.

---

### Шаг 5. Память звонков (buildLyraContext)

- В `useElevenLabsConversation.ts` добавить `buildLyraContext(userId)`: тянет последние 5 `call_summaries`, активные `pacts`, `profile`. Локализация контекста по языку из `useAppStore` (вместо несуществующего `profile.language`).
- Передавать контекст через `overrides.agent.prompt.prompt` в `conversation.startSession({...})` (Eleven Labs SDK позволяет override промпта на сессию — должно быть включено в dashboard агента).
- На `onDisconnect`: если длительность > 20 сек — вызвать edge function `universe-dialogue` с заданием «сделай саммари + темы + эмоциональный тон в JSON», результат записать в `call_summaries`. Длительность считаем по таймеру звонка.

---

### Шаг 6. Лимит минут

- Создать `src/hooks/useCallMinutes.ts` (по спецификации задания) с `monthYear = YYYY-MM`, селектом текущего месяца, `addMinutes(seconds)` через RPC `increment_call_minutes`.
- В `VoiceCallInterface.tsx` запускать таймер при `onConnect`, при `onDisconnect` вызывать `addMinutes(elapsed)`.
- Если `limitReached` — вместо большой кнопки звонка показывать кнопку-CTA `t('limitReachedCta')`, ведущую на пейволл (RevenueCat/`useRevenueCat`).

---

### Шаг 7. Hero-блок звонка

- На `CallPage.tsx`: крупный пульсирующий круг (CSS keyframes `pulse-ring`), подпись `t('callSubtitle')`, метка `t('minutesLeft', {count: minutesLeft})`.
- На `MainPage.tsx`: добавить hero-блок ВЫШЕ пактов:
  ```
  TopBar → TrialBanner → CallHero → Активные пакты → Миссия дня → UserLevelDisplay
  ```
- Стили через существующие cosmic-токены (`--cosmic-dark`, `cosmic-accent`).

---

### Шаг 8. Новая навигация + CosmosPage

- `BottomNavigation.tsx` — ровно 5 вкладок: Главная (`/main`), Вселенная/Lyra (`/lyra`), Миссии (`/missions` или существующий `/cosmic-missions`), Космос (`/cosmos`), Профиль (`/profile`).
- Создать `src/pages/CosmosPage.tsx` — три карточки-ссылки: Гороскоп → `/full-horoscope` (или существующий роут), Нумерология → `/numerology`, Аффирмации → `/affirmations`. Дизайн — тёмный космический, существующие токены.
- Зарегистрировать роут `/cosmos` в `App.tsx`.

---

### Шаг 9. Аффирмации с голосом

- В `AffirmationsPage.tsx` рядом с каждой аффирмацией — кнопка `t('hearFromGuide')` (RU «Услышать от Вселенной», EN/ES «Hear/Escuchar de Lyra»).
- Использовать существующий `useTextToSpeech` (он уже на ElevenLabs). Voice ID — тот же, что у голосового агента (берём из конфигурации, оставляем дефолт).

---

### Шаг 10. Финальная сверка переводов

- Пройтись по `ru.ts/en.ts/es.ts` и проверить, что все новые ключи (`voiceGuide`, `callButton`, `callScreen`, `callHistory`, `callSubtitle`, `minutesLeft`, `limitReachedCta`, `hearFromGuide`) присутствуют во всех трёх языках, что в EN/ES «pact» переведён как `ascetic vow` / `voto ascético`, а в RU остаётся «пакт аскезы».
- Прогнать UI визуально на всех трёх языках на ключевых экранах (Main, Call, Lyra, Cosmos, Affirmations, Pacts).

---

### Что НЕ трогаем

`src/integrations/supabase/client.ts`, `types.ts`, `.env`, `capacitor.config.ts`, папки `ios/` и `android/`, RevenueCat-конфиг (кроме использования хука), `supabase/config.toml` (project_id).

---

### Технические уточнения / отступления от ТЗ

1. **`profile.language` не существует** в таблице `profiles` — для локализации контекста Lyra использую язык из `useAppStore` (там уже хранится выбранный язык пользователя).
2. **`pacts.current_streak` / `is_active`** — в текущей схеме `pacts` нет таких колонок (есть `status`, `duration`, и `pact_days`). В `buildLyraContext` использую `status='active'` как фильтр и считаю streak из `pact_days` (или подставляю `duration` если streak считать дорого — уточню в реализации).
3. **Передача системного промпта** в Eleven Labs: требует, чтобы в dashboard каждого из трёх агентов было разрешено `agent.prompt` override. Если не включено — контекст не применится (уведомлю в финале).
4. **Edge function URL** для `universe-*` оставляю без изменений, как просили.
5. **Таблицы `cosmic_artifacts`, `meditations*`-related поля** в БД оставляю — миграции на удаление не делаю, только убираю UI.

---

После Шага 1 остановлюсь и покажу результат миграции для подтверждения, затем продолжу Шаг 2 и т.д.