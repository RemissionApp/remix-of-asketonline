# Fix: ElevenLabs Agents Not Connecting on Universe Call

## Root causes
1. Используется устаревший пакет `@11labs/react@0.1.4` — он не поддерживает современные ConvAI агенты с WebRTC.
2. В `useElevenLabsConversation.ts` запрашивается signed URL, но в `startSession` передаётся только `agentId` — подписанный URL игнорируется, авторизация падает.
3. Не указан `connectionType` (`webrtc`/`websocket`) — современные агенты требуют его явно.
4. Микрофон не запрашивается перед `startSession` — на мобильных/PWA сессия сразу обрывается.

## Changes

### 1. SDK migration
- Удалить `@11labs/react`, установить `@elevenlabs/react` (последняя версия).
- Обновить импорт в `src/hooks/useElevenLabsConversation.ts` на `@elevenlabs/react`.

### 2. `src/hooks/useElevenLabsConversation.ts`
- Перед стартом сессии вызывать `await navigator.mediaDevices.getUserMedia({ audio: true })` для разрешения микрофона.
- Использовать WebRTC через `conversation token` (рекомендованный путь):
  - Новый edge function endpoint `elevenlabs-conversation-token` возвращает `{ token }`.
  - `conversation.startSession({ conversationToken: token, connectionType: 'webrtc' })`.
- Добавить понятные тосты/ошибки на отказ микрофона и сетевые ошибки.
- Расширить `onMessage` обработку (`user_transcript`, `agent_response`) для будущего отображения чата.

### 3. Edge function
- Создать новую функцию `supabase/functions/elevenlabs-conversation-token/index.ts`:
  - GET к `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=...` с `xi-api-key`.
  - Возвращает `{ token }`.
  - Полные CORS-заголовки (`Access-Control-Allow-Methods`, `OPTIONS` preflight, заголовки во всех ответах включая ошибки).
  - Валидация `agentId` через zod, статус 400 при отсутствии.
- Старую `elevenlabs-signed-url` оставить как fallback (на случай WebSocket), обновив CORS до того же набора.

### 4. UI feedback
- В `VoiceCallInterface.tsx` (и `UniverseAvatar` через `isActive`) использовать `conversation.status === 'connected'` для триггера эффекта «открытых зелёных глаз», а не локальный флаг.
- Тост при ошибке подключения с понятным текстом на текущем языке.

## Notes
- `ELEVENLABS_API_KEY` уже есть в секретах — дополнительных ключей не требуется.
- Агенты RU/EN/ES уже настроены в коде; их ID не меняем.
- Изменения сохраняют существующий glassmorphism-дизайн страницы звонка.

После одобрения переключаюсь в build-режим и применяю.
