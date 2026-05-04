
# Аудит логики и безопасности Asceta

Ниже — построчный отчёт по 12 разделам ТЗ. Подробности и исправления к каждому 🔴/💀 — в конце.

---

## 1. Онбординг и регистрация

| Пункт | Статус |
|---|---|
| Email уже существует | ✅ Supabase возвращает `User already registered`, обрабатывается в `LoginPage` |
| OTP истёк (>15 мин) | ✅ `validate_verification_code` чистит просроченные, возвращает false |
| Повторный вход после закрытия приложения с активным OTP | ⚠️ Код живёт 15 мин, но новая отправка не инвалидирует старый — `create_verification_code` делает DELETE, ОК |
| Rate limiting send-otp-email | 🔴 Нет лимита. Можно спамить Resend и счётчик email бесконечно |
| Ошибки Resend API | ⚠️ Ловятся try/catch, но клиенту возвращается общий 500 без деталей |
| Google: отмена авторизации | ✅ |
| Google без email | 🔴 `handle_new_user()` упадёт молча (RAISE WARNING), пользователь окажется в `auth.users` без profile |
| Apple повторный вход без email | ⚠️ Код полагается на `email`, при повторном входе Apple возвращает только при первом — нужен fallback на `sub` |
| Apple nonce | ✅ Используется встроенный Supabase OAuth, nonce генерируется SDK |
| Закрытие в середине онбординга | ✅ `user_onboarding_state` сохраняет `current_step`, при возврате восстанавливается |
| profile_step_completed | ✅ Сохраняется после каждого шага |
| birth_date пустая → гороскоп | 🔴 `generate-horoscope` падает на null birth_date — нет guard |
| Пропустить онбординг | ⚠️ Защита только во фронте; прямой переход на `/main` минует онбординг (`ProtectedRoute` не проверяет `current_step`) |
| handle_new_user всегда создаёт profile+sub | ⚠️ EXCEPTION → WARNING + RETURN NEW. Если триггер упал, юзер залогинен, но без profile. Нет recovery |
| trial_ends_at timezone | ✅ `now()` в Postgres = UTC, ОК |

---

## 2. Аутентификация и сессии

| Пункт | Статус |
|---|---|
| Истёкший токен во время использования | ✅ `autoRefreshToken: true` |
| onAuthStateChange | ✅ Подписка в `useAuthFlow` |
| Supabase недоступен на старте | 🔴 Нет offline-состояния — приложение зависает на splash |
| Logout очищает всё | ⚠️ Zustand persist частично остаётся, push-токен в `push_subscriptions` НЕ деактивируется при logout |
| Logout на одном из двух устройств | ✅ Локально, второй продолжает работать (ОК) |
| **storage = localStorage на нативе** | 💀 **КРИТИЧНО**. `client.ts` использует `localStorage` всегда. На Capacitor сессия (refresh token) хранится в незашифрованном WebView storage. Нужен `@capacitor/preferences` adapter |

---

## 3. Пакты — критичная логика

| Пункт | Статус |
|---|---|
| Лимит на количество пактов | 🔴 Нет — можно создать N пактов |
| Валидация длительности | ⚠️ Только UI-валидация (1–365), сервер принимает любое |
| Double-tap создания | 🔴 Нет debounce/disabled — две вставки за тап возможны |
| Смена timezone | 🔴 `markDayComplete` использует локальную дату через `toISOString().split('T')[0]` (UTC). При полёте в UTC+12 один день может задвоиться/пропуститься |
| markDayComplete idempotent | ⚠️ Проверка `existing day` перед вставкой есть, но не атомарно. Нужен UNIQUE(pact_id, date) индекс |
| 23:59 → 00:01 | 🔴 Зависит от того же UTC-расчёта; реально это два разных дня в UTC, но один локальный — пользователь думает «один день», а серия учитывает два |
| breakAscesis дважды | ⚠️ Идемпотентность через статус, но без транзакции |
| RLS pacts | ✅ `auth.uid() = user_id`, проверено |

---

## 4. Звонки с Вселенной

| Пункт | Статус |
|---|---|
| Обход лимита минут | 💀 **КРИТИЧНО**. `elevenlabs-conversation-token` НЕ проверяет ни JWT, ни `monthly_call_minutes`. Любой может получить токен, передав agentId, и звонить бесконечно |
| ElevenLabs недоступен | ✅ Возвращает 502 с понятной ошибкой |
| Permission denied для микрофона | ⚠️ Обрабатывается, но toast часто скрыт |
| Timeout подключения | 🔴 Нет таймаута на connect |
| Потеря интернета в звонке | ⚠️ ElevenLabs SDK закрывает сессию, но `increment_call_minutes` может не вызваться → потеря списания |
| Свернутое приложение iOS | 🔴 WebView убивает аудио, нет background mode capability |
| Звонок дольше оставшихся минут | 🔴 Таймер не обрывает звонок принудительно |
| Таймер в реальном времени | ⚠️ Списание ТОЛЬКО после окончания (`useCallMinutes`) — при крэше минуты не списываются |
| Сохранение саммари при закрытии | 🔴 Если приложение закрыто между концом звонка и записью summary, данные теряются |
| increment_call_minutes двойное списание | 🔴 Нет idempotency key, при ретрае могут списать дважды |
| monthly_call_minutes сброс | ✅ Используется `month_year` ключ — новый месяц = новая запись |
| buildLyraContext: пустые звонки | ✅ Возвращает базовый промпт |
| Лимит контекста | 🔴 Нет ограничения. 100 саммари × длинный текст легко выйдет за token limit |

---

## 5. Подписка и RevenueCat

| Пункт | Статус |
|---|---|
| allPurchasedProductIdentifiers | ✅ Исправлено — используется только `entitlements.active` / `activeSubscriptions` |
| Опечатка `asket_premium_montly` | ✅ Исправлено, оставлен fallback |
| Webhook Authorization | ⚠️ Простое сравнение строк → timing attack (низкий риск). Использовать timingSafeEqual |
| Webhook идемпотентность | 💀 **КРИТИЧНО**. Нет проверки `event.id`, нет сравнения timestamps. Старый EXPIRATION может перезаписать свежий RENEWAL → пользователь теряет PRO |
| Webhook раньше регистрации | 🔴 Insert в `subscriptions` без существующего user_id — FK не настроен, но висит сирота |
| expire-trials не трогает платных | ✅ `.eq('is_pro', false)` есть, ОК |
| trial_ends_at = NULL | ⚠️ `.lt('trial_ends_at', nowIso)` пропускает NULL — ОК |
| Cron timezone | ✅ UTC |
| Restore без покупок | ⚠️ Возвращает customerInfo с пустыми entitlements, UI не показывает явное сообщение |
| Платный → бесплатный | 🔴 Pro-фичи закрываются только при следующем `syncProStatus`, нет realtime подписки на `subscriptions` |
| **RLS subscriptions INSERT/UPDATE юзером** | 💀 **КРИТИЧНО**. Политики позволяют пользователю самому выставить `is_pro=true` через консоль браузера. Должен писать только `service_role` |
| **Клиент пишет в subscriptions** | 💀 Работает рука об руку с предыдущим — `revenueCatSlice.syncProStatus` upsert'ит из браузера, что и открывает дыру |

---

## 6. Edge Functions — безопасность

| Функция | CORS | JWT | Rate limit | Validation |
|---|---|---|---|---|
| universe-answer | ✅ | 🔴 нет проверки | 🔴 нет | ⚠️ только non-empty |
| universe-dialogue | ✅ | 🔴 | 🔴 | ⚠️ |
| generate-horoscope | ✅ | ⚠️ getUser есть | 🔴 нет | ⚠️ |
| text-to-speech | ✅ | 🔴 нет | 🔴 нет | ⚠️ |
| send-push-notification | ✅ | 🔴 **КРИТИЧНО**: принимает `userId/userIds` от клиента без проверки что = auth.uid → user A может пушить user B | 🔴 | ⚠️ |
| elevenlabs-conversation-token | ✅ | 💀 нет | 🔴 | ⚠️ |
| check-daily-limits | ✅ | ✅ | n/a | ✅ |
| revenuecat-webhook | ✅ | shared secret ⚠️ | n/a | ⚠️ |
| send-otp-email | ✅ | n/a | 🔴 нет | ⚠️ |

**Конкретно:**
- `generate-horoscope`: 🔴 кеш per-user через `detailed_horoscopes`/`full_horoscopes`, а не общий `cached_daily_horoscopes` per-zodiac — лишние LLM-вызовы
- `universe-answer` vs `universe-dialogue`: 🔴 дублирование — обе зовут LLM, надо консолидировать
- HTTP-коды частично нормальные, но `throw new Error → 500` везде вместо 400/401/429

---

## 7. БД — RLS и безопасность

- 💀 **subscriptions** — INSERT/UPDATE доступны юзеру (см. выше)
- ⚠️ **email_verification_codes** — SELECT с условием `auth.email() = email`. До регистрации `auth.email()` = NULL, не критично
- ✅ Все таблицы (24 шт.) имеют RLS
- ✅ Политики `auth.uid() = user_id` корректны
- 🔴 `batch_delete_user_data(target_user_id)` — SECURITY DEFINER, **не проверяет** что `target_user_id = auth.uid()`. Любой авторизованный юзер может стереть чужие данные
- 🔴 `increment_call_minutes(p_user_id, ...)` — SECURITY DEFINER, не проверяет `p_user_id = auth.uid()`. Можно начислять минуты другому
- 🔴 `call_summaries`, `monthly_call_minutes` — нет индексов на `(user_id, month_year)` / `(user_id, called_at)`
- 🔴 Нет UNIQUE индекса `pact_days(pact_id, date)` — допускает дубли

---

## 8. Push уведомления

- 🔴 Разрешение запрашивается при старте (нарушает Apple guideline) — нужно после первого осмысленного действия
- ⚠️ Отказ обрабатывается, но настройки уведомлений всё равно показываются
- 🔴 Нет обработки `InvalidToken` от FCM/APNs → мёртвые подписки накапливаются
- 🔴 Локальные напоминания не пересоздаются после force quit
- ⚠️ Возможны дубли (несколько активных subscriptions для одного user_id без дедупа)

---

## 9. Офлайн и граничные случаи

- 🔴 Нет offline-баннера/детектора
- 🔴 Действия пактов не очередятся офлайн (нет queue)
- ⚠️ Skeleton-состояния есть не везде (NumerologyPage, AffirmationsPage)
- 🔴 Нет таймаута на загрузку профиля (висит бесконечно)
- ✅ Empty states для пактов и звонков добавлены

---

## 10. Производительность и утечки

- 🔴 `StarField.tsx` — анимация работает даже когда компонент скрыт
- 🔴 Несколько `supabase.channel(...)` без `removeChannel` в cleanup (см. `useEntitlement`, `useUniverseQuestions`)
- ⚠️ TanStack Query staleTime по умолчанию 0 — лишние refetch на focus
- ⚠️ `userProfile` грузится на каждой смене вкладки
- 💀 Zustand persist сохраняет `customerInfo` целиком (включая токены) в localStorage. Чувствительные данные в plaintext
- 🔴 Нет migrate функции для persist

---

## 11. i18n

- 🔴 Несоответствия ключей между `ru.ts`/`en.ts`/`es.ts` (несколько десятков, нужен скрипт diff)
- ⚠️ Fallback на ключ есть, но иногда отображается raw key
- 🔴 Даты форматируются хардкодом `toLocaleDateString('ru-RU')` в нескольких местах
- ⚠️ Числа: единый формат `9.99`, не локализован
- ✅ RTL не критичен

---

## 12. Удаление аккаунта

- 🔴 `batch_delete_user_data` НЕ удаляет `call_summaries`, `monthly_call_minutes`, `audit_logs`, `cached_*`
- 🔴 Не удаляет аватар из Storage
- 🔴 Не отменяет подписку RevenueCat (нужен серверный вызов RC API)
- 🔴 Не удаляет `auth.users` (нет `service_role` admin call)
- 🔴 Нет транзакции — частичное удаление возможно
- ⚠️ Confirmation step с вводом слова отсутствует
- ✅ Redirect на WelcomePage после

---

# План исправлений (приоритизированный)

### Фаза 1 — критично (💀, требует немедленного фикса)

1. **Закрыть RLS дыру в `subscriptions`**: миграция — DROP политик INSERT/UPDATE для пользователей. Только `service_role`.
2. **Убрать клиентский upsert в `subscriptions`** из `revenueCatSlice.syncProStatus` — webhook становится единственным источником.
3. **Webhook идемпотентность**: создать таблицу `revenuecat_events(event_id PRIMARY KEY, processed_at)`. Проверять `event.id` и `event.event_timestamp_ms` ≥ текущего `subscription_end` перед апдейтом.
4. **Защитить `elevenlabs-conversation-token`**: добавить JWT-проверку (`getClaims`), вызвать `check-daily-limits` или прямой запрос к `monthly_call_minutes` ПЕРЕД выдачей токена. Отказывать если лимит исчерпан.
5. **Защитить `send-push-notification`**: проверить `getClaims(authHeader)`, разрешить отправку только если `userId === claims.sub` (или роль admin).
6. **Сессия Supabase в Capacitor**: создать `capacitorStorage` адаптер на `@capacitor/preferences` и подсунуть в `createClient` через override (через отдельный wrapper, не трогая autogen `client.ts`).
7. **`batch_delete_user_data`**: добавить `IF target_user_id <> auth.uid() THEN RAISE EXCEPTION; END IF;` + удаление новых таблиц + storage object delete + транзакция.
8. **`increment_call_minutes`**: проверка `p_user_id = auth.uid()`.

### Фаза 2 — высокий приоритет (🔴 безопасность/деньги)

9. JWT-проверка во всех LLM-функциях: `universe-answer`, `universe-dialogue`, `generate-horoscope`, `text-to-speech`.
10. Rate limiting через таблицу `rate_limits(user_id, endpoint, window_start, count)` или вынести в общую функцию.
11. Rate limit на `send-otp-email` (max 3/hour на email и IP).
12. Кеш гороскопов: переключить `generate-horoscope` на `cached_daily_horoscopes` per-zodiac/birth_year.
13. Слить `universe-answer` + `universe-dialogue` в одну функцию.
14. UNIQUE индекс `pact_days(pact_id, date)`.
15. Лимит на пакты (max 10 активных).
16. Debounce/disabled на кнопках создания пакта и mark-done.
17. Timezone-safe streak: хранить дату в `profile.timezone`, считать дни в этом TZ.
18. Лимит контекста `buildLyraContext` — top 5 саммари × 400 chars.
19. Принудительный обрыв звонка при исчерпании минут.
20. Periodic списание минут раз в 30 сек во время звонка (через keepalive ping).
21. Webhook auth — `crypto.timingSafeEqual`.
22. Realtime подписка на `subscriptions` для мгновенного отзыва PRO.
23. `useEntitlement` — добавить cleanup для каналов.
24. Удалить `customerInfo` из persist whitelist.
25. ProtectedRoute проверяет `user_onboarding_state.current_step === 'completed'`.

### Фаза 3 — средний приоритет (🔴 UX и потеря данных)

26. Offline detector + queue для пактов (через IndexedDB / Capacitor).
27. Background-mode capability + iOS audio session для звонков.
28. Timeout (15s) на ElevenLabs connect.
29. Сохранение call summary через `navigator.sendBeacon` или ретрай.
30. Skeleton состояния + timeouts на загрузку профиля (10s + retry).
31. Push: запрашивать permission после первого пакта/звонка.
32. Обработка InvalidToken FCM/APNs — soft-delete подписки.
33. Полное удаление аккаунта: edge function на service_role, удаление storage, RC subscriber DELETE через REST, `auth.admin.deleteUser`, всё в одной транзакции через RPC.
34. Confirmation step с вводом «УДАЛИТЬ».

### Фаза 4 — улучшения (⚠️)

35. i18n diff-скрипт + добавление недостающих ключей.
36. Локализованные даты через `Intl.DateTimeFormat`.
37. TanStack Query staleTime: 5 минут.
38. StarField — `IntersectionObserver` пауза анимации.
39. Migrate-функция Zustand persist (version bump).
40. Убрать guard `pacts.length > 0` для рендера CTA на пустом MainPage (если ещё актуально).

---

## Технические детали ключевых фиксов

**SQL миграция (фаза 1.1, 1.7, 1.8):**
```sql
DROP POLICY "Users can create their own subscription" ON subscriptions;
DROP POLICY "Users can update their subscription" ON subscriptions;

CREATE TABLE revenuecat_events (
  event_id text PRIMARY KEY,
  user_id uuid,
  type text,
  event_timestamp_ms bigint,
  processed_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION batch_delete_user_data(target_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF target_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  -- ... existing deletes + call_summaries, monthly_call_minutes, audit_logs
END $$;

CREATE OR REPLACE FUNCTION increment_call_minutes(p_user_id uuid, p_month_year text, p_minutes numeric)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF p_user_id <> auth.uid() THEN RAISE EXCEPTION 'forbidden'; END IF;
  INSERT INTO monthly_call_minutes ...
END $$;

CREATE UNIQUE INDEX pact_days_unique ON pact_days(pact_id, date);
```

**Capacitor storage adapter (фаза 1.6):** так как `client.ts` редактировать нельзя, создаём `src/integrations/supabase/capacitorAuth.ts` который при инициализации приложения мигрирует session из localStorage в Preferences и подменяет storage через `supabase.auth.setSession`. Альтернатива — переопределить через monkey-patch при старте.

**Webhook идемпотентность (фаза 1.3):**
```ts
const { data: dup } = await supabase.from('revenuecat_events')
  .select('event_id').eq('event_id', event.id).maybeSingle();
if (dup) return new Response(JSON.stringify({ ok: true, dup: true }));
// после успешного апдейта:
await supabase.from('revenuecat_events').insert({event_id: event.id, ...});
```

---

После одобрения плана я перейду в режим build и выполню Фазу 1 одной миграцией + правкой edge functions, затем Фазу 2, 3, 4 пошагово с подтверждением. Подтвердите — начинать с **Фазы 1 целиком** или выбрать конкретные пункты.
