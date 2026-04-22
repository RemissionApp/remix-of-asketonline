

## План полной проверки и фиксов перед публикацией

### Что уже проверено
- ✅ TypeScript компиляция чистая (`tsc --noEmit` 0 ошибок)
- ✅ Production build собирается успешно (`vite build` OK)
- ✅ Триггер `on_auth_user_created` живёт в БД
- ✅ Storage policies на `avatars` корректные (с владельцем по `auth.uid()`)
- ✅ Auth flow от регистрации до /main работает (видно в логах: профиль сохранён, onboarding завершён)

### Найденные критические проблемы

#### P0-1. Нарушение правил React в трёх местах — Minified React error #321
В консоли постоянная ошибка #321 — «invalid hook call». Причина:

- `src/hooks/useUserProgress.ts:54` — `useOptimizedDatabase()` вызывается **внутри async функции** `fetchUserProgress`
- `src/store/useAppStore.ts:163` — то же внутри `deleteAccount`
- `src/store/slices/pacts/markDayComplete.ts:33` — то же внутри slice action

`useOptimizedDatabase` — это React-хук (использует `useMemo`/`useCallback`). Вызывать его не на верхнем уровне компонента запрещено и ломает React-дерево.

**Фикс:** превратить `useOptimizedDatabase` в обычный объект функций (без `useMemo`/`useCallback`) или вынести нужные функции наружу как чистые `async function`. Кэш сделать модульным (Map на уровне модуля, а не через `useMemo`). Обновить все 3 места вызова.

#### P0-2. ElevenLabs TTS возвращает 401 «Unusual activity detected»
```
Edge function returned 500: Eleven Labs API error: 401 — Free Tier usage disabled
```
ElevenLabs заблокировал бесплатный ключ из-за detection. Это не баг кода — пользователю нужно купить платный план ElevenLabs или предоставить новый ключ.

**Фикс кода:** добавить graceful degradation в `text-to-speech` edge function — при 401 возвращать понятную ошибку (не 500), а на клиенте (медитации, аффирмации) ловить это и показывать toast «Голосовое озвучивание временно недоступно», не ломая остальной UX. Также добавить fallback на Web Speech API браузера для базовых случаев.

#### P1-3. Дублированное поле в SELECT запросе
`select('*, profile_step_completed')` — `profile_step_completed` уже включено в `*`, поэтому в JSON ответе поле приходит дважды (видно в network logs). PostgREST это терпит, но это мусор и риск конфликтов.

**Фикс:** заменить на `select('*')` в `authSlice.ts:615` и `onboardingSlice.ts:53`.

#### P1-4. Дублированные storage policies для avatars
В `pg_policies` 8 политик вместо 4 (по две каждой команды): «Avatars are publicly accessible» + «Avatar images are publicly accessible», «Users can upload their avatar» + «Users can upload their own avatar» и т.д. Не ломает, но мусор и одна политика «Avatars are publicly accessible» на SELECT позволяет листинг бакета (warning от линтера: `0025_public_bucket_allows_listing`).

**Фикс миграцией:** удалить старые дубли, оставить по одной политике на команду; для SELECT ограничить листинг — либо запретить листинг и оставить только direct-access по URL, либо явно разрешить только владельцу.

#### P1-5. Мёртвые предупреждения о deprecated коде
- `authSlice.ts:530` `updateUserProfile` помечена deprecated, но всё ещё экспортируется и вызывается из ряда мест.
- `gamificationSlice.ts:27` `addEnergyPoints` deprecated.
- `useOptimizedProfileCache.ts` — в плане его удалили из критического пути, но файл и его упоминания живы (используется в нескольких компонентах профиля).

**Фикс:** провести аудит реальных вызовов, удалить deprecated реализации и заменить вызовы на актуальные функции (`upsert` через слайсы). Если оставлять `useOptimizedProfileCache`, то выровнять контракт с `useAuthFlow` (инвалидация кэша при mutation).

#### P2-6. Bundle size 1.6MB (warning vite)
Один файл `index-*.js` 1.6 MB / 490 KB gzip — медленная загрузка на мобильных.

**Фикс:** `vite.config.ts` добавить `manualChunks` для разделения `react`, `react-router-dom`, `@tanstack/react-query`, `@supabase/supabase-js` в отдельные чанки. Lazy-load тяжёлых страниц (`MeditationProPage`, `NumerologyPage`, `FullHoroscopePage`) через `React.lazy`.

### Поэтапный план выполнения

**Этап 1 — критические фиксы (P0)**
1. Переписать `useOptimizedDatabase.ts`: вынести бизнес-логику в чистые функции, кэш — в модульную Map. Хук `useOptimizedDatabase` оставить как обёртку с `useCallback` для обратной совместимости в компонентах, но из не-React контекстов вызывать функции напрямую.
2. Обновить `useUserProgress.ts`, `useAppStore.ts:deleteAccount`, `markDayComplete.ts` — вызывать чистые функции вместо хука.
3. Сделать `text-to-speech` edge-function устойчивой к 401 (вернуть структурированную ошибку, статус 503 + `{available: false}`), и на клиенте `useTextToSpeech`/медитации показывать toast вместо runtime error.

**Этап 2 — чистка БД и запросов (P1)**
4. Миграция: удалить дубли storage policies, ограничить листинг бакета `avatars`.
5. Заменить `select('*, profile_step_completed')` → `select('*')` в auth/onboarding слайсах.
6. Удалить deprecated `updateUserProfile`, `addEnergyPoints`; заменить все вызовы на актуальные пути.

**Этап 3 — производительность (P2)**
7. `vite.config.ts`: `manualChunks` для vendor-чанков.
8. `React.lazy` + `Suspense` для тяжёлых страниц (Meditation, Numerology, FullHoroscope, AffirmationsPage, MissionsPage).

**Этап 4 — финальная проверка**
9. `tsc --noEmit` → 0 ошибок.
10. `vite build` → успех, размер главного чанка <800 KB.
11. Проверка консоли: ноль ошибок React #321 и ноль 500-ответов от edge functions (TTS показывает graceful toast).
12. End-to-end сценарий вручную в preview: регистрация нового email → OTP → профиль → онбординг → /main → загрузка аватара → создание пакта → выход → повторный вход.

### Что НЕ трогаем
- ElevenLabs Agent IDs и промпты Вселенной
- Cosmic дизайн-токены и тему
- Логику OTP-верификации email
- Рабочие edge functions (`generate-horoscope`, `generate-daily-advice`, `universe-answer`, `universe-dialogue`)
- Структуру `useAuthFlow` / `AuthBootstrap` (только что переписанную и работающую)

### Файлы под изменение
- `src/hooks/useOptimizedDatabase.ts` — рефакторинг хука в модуль с функциями
- `src/hooks/useUserProgress.ts`, `src/store/useAppStore.ts`, `src/store/slices/pacts/markDayComplete.ts` — заменить вызовы хука
- `supabase/functions/text-to-speech/index.ts` — graceful 503 при 401 от ElevenLabs
- `src/utils/audioPlayback.ts` (или аналог) и `src/components/MeditationBlock` — обработка 503 без runtime error
- `src/store/slices/authSlice.ts`, `src/store/slices/onboardingSlice.ts` — `select('*')`
- `src/store/slices/authSlice.ts`, `src/store/slices/gamificationSlice.ts` — удалить deprecated функции
- `supabase/migrations/<new>.sql` — чистка дублей storage policies + ограничение листинга
- `vite.config.ts` — manualChunks
- `src/App.tsx` — `React.lazy` для тяжёлых страниц

### Ожидаемый результат
После применения: ноль ошибок React в консоли, TTS не валит UI при заблокированном ключе, БД чистая, bundle разделён на чанки, e2e flow от регистрации до /main работает без сбоев. Приложение готово к публикации.

