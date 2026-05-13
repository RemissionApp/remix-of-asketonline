# Починим звонок Вселенной

## Что происходит сейчас

В консоли при попытке звонка видно:

```
Initial connection failed: v1 RTC path not found.
Consider upgrading your LiveKit server version – Retrying
websocket closed { code: 1006, wasClean: false }
```

Соединение поднимается на ~1 секунду, потом разрывается.

## Корневая причина

Установленные версии SDK устарели:

- `@elevenlabs/react` — **1.3.0** (актуальная **1.6.0**)
- `@elevenlabs/client` — **1.4.0** (актуальная **1.7.0**), внутри `livekit-client ^2.11.4`

ElevenLabs обновили серверный LiveKit и больше не отдают «v1 RTC path». Старый клиентский livekit-client пытается подключиться по устаревшему пути → сервер отвечает 404 → WebSocket падает с кодом 1006 → SDK через секунду рвёт сессию. Это не проблема ключа, не проблема агента и не проблема edge-функции — звонок реально доходит до ElevenLabs (в логах видно `room_agent_01jzg4...`), но рукопожатие WebRTC ломается на старом транспорте.

В моих других проектах звонки работают именно потому, что там стоит свежий `@elevenlabs/react`.

## Что сделаю

1. Обновлю зависимости в `package.json`:
   - `@elevenlabs/react` → `^1.6.0` (подтянет `@elevenlabs/client@^1.7.0` и свежий `livekit-client`).
2. Проверю, что текущий `useElevenLabsConversation.ts` совместим с новым SDK (API `useConversation`, `startSession({ agentId, connectionType: 'webrtc' })`, события `onConnect/onMessage/onError` — без изменений в 1.6).
3. Добавлю в `onError` / `onDisconnect` более информативные логи (код, причина, reason), чтобы в будущем такие регрессии ловились сразу.
4. Прогоню звонок в превью и проверю:
   - нет ошибки `v1 RTC path not found`,
   - WebSocket не закрывается с code 1006 в первые секунды,
   - статус идёт `Соединение… → На связи` и держится.

## Что НЕ трогаю

- Edge-функции (`elevenlabs-conversation-token` уже удалена в прошлый раз — публичные агенты подключаются напрямую через `agentId`).
- ID агентов RU/EN/ES.
- UI `VoiceCallInterface` и логику минут.

## Технические детали

```text
package.json
  "@elevenlabs/react": "^1.3.0"  →  "^1.6.0"

src/hooks/useElevenLabsConversation.ts
  onError: добавить error?.code / error?.reason в лог
  onDisconnect: логировать reason при наличии
```

Если после апдейта SDK звонок всё ещё рвётся — следующий шаг: переключить `connectionType` с `'webrtc'` на `'websocket'` через `elevenlabs-signed-url` edge-функцию (она уже есть в проекте) как fallback.
