Нашёл причину по логам:

- В коде и `package.json` уже стоит `@elevenlabs/react@1.6.0`, `@elevenlabs/client@1.7.0`, `livekit-client@2.18.7`.
- Но текущий preview фактически грузит старый Vite prebundle: `node_modules/.vite/deps/@elevenlabs_react.js` содержит `react_sdk version 1.3.0` и `client 1.4.0`.
- Поэтому сеть всё ещё показывает запрос `version=1.3.0`, затем `https://livekit.rtc.elevenlabs.io/rtc/v1/validate`, который возвращает `404 page not found`.
- Из-за этого WebRTC закрывается с `code: 1006`, и звонок сразу обрывается.

План исправления:

1. Очистить Vite optimized-deps cache для ElevenLabs (`node_modules/.vite/deps`), чтобы preview пересобрал пакет с новой версией SDK.
2. Перезапустить dev server, чтобы браузер получил новый bundle без `version=1.3.0`.
3. Проверить, что новый prebundle содержит `@elevenlabs/react@1.6.0` / `@elevenlabs/client@1.7.0`, а сетевой запрос больше не идёт с `version=1.3.0`.
4. Если после очистки кэша WebRTC всё равно будет падать, переключить звонок Вселенной на fallback через WebSocket + `elevenlabs-signed-url`, потому что эта функция уже есть в проекте и обходит проблемный LiveKit WebRTC путь.

<presentation-actions>
<presentation-link url="https://docs.lovable.dev/tips-tricks/troubleshooting">Troubleshooting docs</presentation-link>
</presentation-actions>