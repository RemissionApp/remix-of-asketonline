

## Проверка ElevenLabs и промптов Вселенной

### Что проверено

**1. ElevenLabs Agent IDs** ✅ присутствуют в `src/hooks/useElevenLabsConversation.ts`:
- RU: `agent_01jzg4fchcew0tq8fy4j75vkva`
- EN: `agent_01jzhxjnzrfghs4d2dqbyz6d3a`
- ES: `agent_01jzhxwswhfas9ss9ae74n16v0`

Эти ID не трогаем — они ваши и корректные.

**2. Промпты Вселенной** ✅ ваши оригинальные промпты на месте в двух файлах:
- `supabase/functions/universe-answer/index.ts` (9 пунктов, точно ваш текст)
- `src/utils/universe/universeUtils.ts` (10 пунктов с примером/кейсом)
- `supabase/functions/universe-dialogue/index.ts` (9 пунктов, ваш текст)

Промпты НЕ изменялись при миграции на Lovable AI Gateway — поменялся только endpoint и ключ авторизации.

---

### Найденные проблемы

#### Проблема 1: Несоответствие имени секрета ElevenLabs 🔴
В коде edge functions используется `ELEVEN_LABS_API_KEY` (с подчёркиванием), но согласно гайдлайнам ElevenLabs стандартное имя — `ELEVENLABS_API_KEY` (без подчёркивания). Сейчас в Lovable Cloud секрет вообще **не настроен** ни под одним из имён (в списке секретов есть только RESEND и LOVABLE_API_KEY).

Затронутые функции:
- `elevenlabs-signed-url/index.ts` — голосовые звонки с агентами Вселенной не работают
- `text-to-speech/index.ts` — озвучка ответов Вселенной не работает

#### Проблема 2: Несоответствие промптов между файлами 🟡
- В `universeUtils.ts` (клиент) промпт содержит **10 пунктов** (с пунктом «Опиши на примере»)
- В `universe-answer/index.ts` (сервер) промпт содержит **9 пунктов** (без примера)

Клиент отправляет свой `customSystemPrompt` через поле `systemPrompt` в body, но edge function **игнорирует** это поле и всегда использует свой жёстко зашитый промпт. Поэтому 10-й пункт из клиента никогда не доходит до AI.

#### Проблема 3: Endpoint для signed URL 🟡
Используется `get_signed_url` (с подчёркиванием) — это устаревший вариант. Актуальный: `get-signed-url` (с дефисом). Может работать оба, но безопаснее использовать актуальный.

---

### План исправления

**Шаг 1. Запросить ElevenLabs API ключ**
Вызвать `add_secret` для `ELEVENLABS_API_KEY` (унифицированное имя по гайдлайнам). Дождаться, пока вы добавите ключ.

**Шаг 2. Обновить edge functions на новое имя секрета**
- `supabase/functions/elevenlabs-signed-url/index.ts`: `ELEVEN_LABS_API_KEY` → `ELEVENLABS_API_KEY`
- `supabase/functions/text-to-speech/index.ts`: то же самое
- В `elevenlabs-signed-url` поменять URL на `get-signed-url` (с дефисом)

**Шаг 3. Привести промпт Вселенной к единому каноническому виду**
Использовать **10-пунктовую версию** из `universeUtils.ts` (с пунктом «Опиши на примере») как источник истины:
- Заменить системный промпт в `universe-answer/index.ts` (default ветка для regular questions) на полный текст из `getUniverseSystemPrompt()`
- Сохранить специальный астролог-промпт для daily advice (он отдельный)
- Так же обновить `universe-dialogue/index.ts` чтобы оба диалоговых пути использовали идентичный 10-пунктовый промпт

**Шаг 4. (Опционально) Заставить edge function уважать клиентский промпт**
В `universe-answer/index.ts` добавить логику: если клиент прислал `systemPrompt` в body — использовать его, иначе — дефолтный. Это даст вам гибкость менять промпт с клиента без редеплоя функций.

**Шаг 5. Проверка**
- Убедиться что `useElevenLabsConversation.ts` не трогаем (Agent IDs ваши)
- После добавления секрета и редеплоя — протестировать звонок и TTS

---

### Что НЕ меняем
- Agent IDs (RU/EN/ES) — ваши, корректные
- Текст ваших 10 пунктов промпта — ни одного слова
- Логику выбора агента по языку
- Astrologer prompt для daily advice (это отдельная фича)

