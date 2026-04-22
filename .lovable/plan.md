

## Миграция на Lovable Cloud + восстановление приложения

### Ситуация

Старый Supabase проект `aewfggzscyjxpuciqtti` **удалён навсегда** (на паузе >90 дней). Данные пользователей не восстановить. Backup можно скачать только если у вас есть доступ к dashboard, но подключить его обратно к приложению нельзя.

**Что есть в коде:**
- 38 SQL миграций (полная схема БД)
- 17 edge functions
- Хардкод URL/ключей старого Supabase в `src/lib/supabase.ts`
- Зависимость от секретов: OPENAI_API_KEY, RESEND_API_KEY, ELEVENLABS_API_KEY и др.

---

### Этап 1: Включение Lovable Cloud

1. Включить Lovable Cloud в проекте (создаст новый backend на базе Supabase под управлением Lovable)
2. Автоматически будут созданы переменные `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
3. Auto-сгенерируется `src/integrations/supabase/client.ts` и `types.ts`

### Этап 2: Чистка старой конфигурации

1. **Удалить** `src/lib/supabase.ts` (хардкод старого проекта)
2. Найти все импорты `from '@/lib/supabase'` и заменить на `from '@/integrations/supabase/client'`
3. Перенести `cleanupAuthState()` и `ensureAvatarBucketExists()` в новый файл `src/lib/authUtils.ts`
4. Удалить старый `.env` если есть, использовать только Lovable Cloud переменные

### Этап 3: Применение схемы БД

Применить все 38 миграций последовательно через Lovable Cloud migration tool. Включают:
- Таблицы: profiles, user_roles, pacts, missions, achievements, horoscopes, numerology, daily_limits и др.
- RLS политики
- Функции (has_role, handle_new_user trigger и т.д.)
- Storage buckets (avatars)

При конфликтах — объединить в одну консолидированную миграцию.

### Этап 4: Деплой Edge Functions

17 функций деплоятся автоматически из `supabase/functions/`. Проверить каждую:
- `generate-horoscope`, `generate-full-horoscope`, `generate-monthly-horoscope`, `fetch-horoscope`
- `generate-numerology-description`, `generate-daily-advice`
- `universe-answer`, `universe-dialogue`
- `send-otp-email`, `verify-otp`, `verify-otp-simple`
- `text-to-speech`, `voice-to-text`, `elevenlabs-signed-url`
- `check-daily-limits`, `update-daily-limits`
- `send-push-notification`

### Этап 5: Настройка секретов

Запросить у пользователя и добавить в Lovable Cloud:
- `OPENAI_API_KEY` — для гороскопов и AI (или заменить на Lovable AI Gateway)
- `RESEND_API_KEY` — уже есть ✅
- `ELEVENLABS_API_KEY` — для text-to-speech
- RevenueCat ключи если используются

**Рекомендация:** заменить OpenAI на Lovable AI Gateway (бесплатно до конца октября, дешевле, ключ не нужен) — это правка ~5 edge functions.

### Этап 6: Настройка Auth

1. Включить Email/Password провайдер в Cloud
2. Отключить email confirmation на время разработки (для быстрого тестирования)
3. Настроить SMTP через Resend для production писем
4. Настроить Site URL и Redirect URLs

### Этап 7: Storage

Создать bucket `avatars` (public, 2MB лимит) — код уже есть в `ensureAvatarBucketExists`.

### Этап 8: Тестирование пользовательского пути

Полный прогон после миграции:
1. Регистрация нового пользователя → email/OTP → вход
2. `/profile-setup` → заполнение профиля → сохранение в БД
3. `/onboarding` → прохождение шагов
4. `/main` → создание пакта, генерация гороскопа
5. Проверка edge functions (AI ответы, TTS, лимиты)
6. Logout → cleanupAuthState → повторный вход
7. Удаление аккаунта (через edge function, не client-side)

### Этап 9: iOS Capacitor

Обновить `capacitor.config.ts` если есть ссылки на старый URL. Пересобрать приложение.

---

### Что НЕ переносится

- ❌ Пользователи (auth.users) старого проекта — все будут регистрироваться заново
- ❌ Их данные (профили, пакты, история) — потеряны
- ❌ Файлы из старого storage — потеряны

Если у вас остался скачанный backup из Supabase — его можно импортировать как SQL отдельной миграцией в новую БД (только данные, без auth).

---

### Вопросы перед стартом

1. **AI провайдер:** заменить OpenAI на Lovable AI Gateway (рекомендую) или оставить OpenAI с вашим ключом?
2. **Email confirmation:** отключить на время разработки для быстрых тестов?
3. **Backup данных:** есть ли у вас скачанный backup старого Supabase, который нужно импортировать?
4. **ElevenLabs / RevenueCat:** есть ли актуальные ключи или эти функции пока пропустить?

