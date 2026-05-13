План исправления звонков:

1. Исправить способ подключения к ElevenLabs по документации
   - Для публичных агентов использовать прямое подключение через `startSession({ agentId, connectionType: 'webrtc' })`.
   - Backend-токен использовать только как fallback для приватных агентов.
   - Причина: текущий backend-запрос к ElevenLabs падает для всех трёх агентов с `401 missing_permissions: API key is missing convai_write`, поэтому проблема не в ID агентов, а в выбранном способе соединения/правах API ключа.

2. Убрать хрупкую логику запуска сессии
   - Не ждать `conversation.startSession()` как Promise: в установленном `@elevenlabs/react@1.3.0` через `ConversationProvider` этот метод запускает сессию асинхронно и ошибки отдаёт в `onError`.
   - Не вызывать `conversation.getId()` сразу после старта, пока соединение ещё не создано.
   - Сохранять `conversationId` из `onConnect`, как рекомендует SDK.

3. Сделать корректную обработку ошибок звонка
   - Пробросить ошибки SDK из `onError` в UI, чтобы кнопка не зависала и пользователь видел реальную причину.
   - Разделить ошибки: микрофон, авторизация, недоступный агент, ошибка backend-токена, ошибка SDK/WebRTC.

4. Проверить все текущие агенты
   - Оставить действующие ID:
     - RU: `agent_01jzg4fchcew0tq8fy4j75vkva`
     - EN: `agent_01jzhxjnzrfghs4d2dqbyz6d3a`
     - ES: `agent_01jzhxwswhfas9ss9ae74n16v0`
   - Проверить подключение каждого языка через одинаковый flow.

5. Обновить backend-функцию только как fallback
   - Оставить `elevenlabs-conversation-token` для приватных агентов.
   - Улучшить сообщение ошибки `missing_permissions`, чтобы было понятно: если агент приватный, API key должен иметь ElevenLabs ConvAI permission `convai_write`; если агент публичный, backend-токен не нужен.

Техническая причина текущей поломки:

```text
Frontend всегда запрашивает conversation token
        ↓
elevenlabs-conversation-token вызывает ElevenLabs token API
        ↓
ElevenLabs отвечает 401 missing_permissions convai_write
        ↓
звонок не стартует у всех агентов
```

После реализации основным путём станет официальный SDK-flow для публичных агентов:

```text
Пользователь нажимает звонок
        ↓
микрофон разрешён
        ↓
@elevenlabs/react startSession({ agentId, connectionType: 'webrtc' })
        ↓
onConnect получает conversationId
        ↓
звонок активен
```