Причина уже видна по логам: текущий звонок стартует через ElevenLabs WebRTC, SDK получает токен успешно, но затем LiveKit endpoint `https://livekit.rtc.elevenlabs.io/rtc/v1/validate` возвращает `404`, после чего WebSocket закрывается с `code: 1006`. Это не проблема микрофона, UI или лимитов — падает именно WebRTC-подключение ElevenLabs/LiveKit.

План фикса:

1. Перевести звонок Вселенной с WebRTC на WebSocket-режим ElevenLabs
   - В `useElevenLabsConversation` вместо `agentId + connectionType: 'webrtc'` получать `signedUrl` через backend-функцию `elevenlabs-signed-url`.
   - Стартовать сессию через:
     ```ts
     conversation.startSession({
       signedUrl,
       connectionType: 'websocket',
       ...overrides
     })
     ```
   - Это обходит падающий LiveKit `/rtc/v1/validate`, потому что WebSocket-режим подключается к ConvAI напрямую.

2. Сделать ошибку backend-функции диагностируемой
   - Добавить в `elevenlabs-signed-url` структурированные ответы для:
     - отсутствующего `ELEVENLABS_API_KEY`,
     - 401/403 от ElevenLabs,
     - отсутствующего `signed_url` в ответе,
     - неизвестной ошибки.
   - Не логировать секреты.

3. Улучшить клиентские логи звонка
   - Логировать выбранный агент, язык, режим подключения `websocket`, факт получения signed URL и длительность попытки подключения.
   - В `onDisconnect` логировать `closeCode/closeReason` вместе с текущими `code/reason/context`.
   - В `onError` сохранять исходный объект ошибки и человекочитаемое сообщение.

4. Сохранить текущий UX
   - Не менять экран звонка визуально.
   - Оставить текущую работу таймера, лимитов минут, сохранения summary и контекста пользователя.
   - Если signed URL не получен — показывать существующую ошибку “Не удалось соединиться с Вселенной”.

5. Проверка после внедрения
   - Проверить, что в network больше нет запроса к `livekit.rtc.elevenlabs.io/rtc/v1/validate`.
   - Проверить, что появляется WebSocket-сессия ElevenLabs ConvAI и звонок не обрывается через 1 секунду.
   - Если backend вернет 401/403, это будет означать, что ключ ElevenLabs всё еще без нужных прав для signed URL; тогда потребуется заменить ключ на ключ с ConvAI permissions.