Похоже, само приложение уже рендерится в iframe: я вижу стартовый экран Asket в Preview. Но есть несколько вещей в коде, которые могут делать Preview нестабильным или пустым у вас: PWA/service worker регистрируется прямо в dev-preview, manifest запрашивается без preview-токена и получает 401, а service worker может кэшировать/перехватывать навигацию внутри приватного preview-домена.

План исправления:

1. Отключить PWA service worker в Lovable Preview и dev-режиме
   - Не регистрировать `/sw.js`, когда приложение открыто на `lovableproject.com`, `lovable.app`, `localhost` или в Vite dev mode.
   - Если service worker уже был зарегистрирован в preview, автоматически снять регистрацию и очистить связанные cache storage записи.
   - В production/published web PWA-функции оставить включенными.

2. Сделать manifest безопасным для Preview
   - Не подключать `manifest.json` в dev/Lovable Preview, чтобы браузер не получал 401 и не создавал PWA-ошибки в консоли.
   - Для опубликованной версии manifest останется доступен.

3. Добавить iframe-safe guard
   - Не добавлять запреты на iframe и не выполнять редиректы из iframe наружу.
   - Добавить утилиту определения среды Preview, чтобы будущие нативные/PWA-интеграции не ломали web-preview.

4. Проверить результат
   - Открыть `/` в sandbox preview.
   - Убедиться, что стартовый экран Asket виден.
   - Проверить консоль: не должно быть критичных ошибок из-за manifest/service worker.
   - Проверить network: основные файлы приложения грузятся с 200.

Технические детали:

- Основные файлы для изменения:
  - `src/main.tsx`
  - `src/utils/pwaUtils.ts`
  - возможно `src/utils/pwaUpdateManager.ts`
  - `index.html`

- Предлагаемая логика среды:
  - `import.meta.env.DEV === true` → не регистрировать service worker
  - `window.location.hostname.includes('lovableproject.com')` → не регистрировать service worker
  - `window.location.hostname.includes('lovable.app')` в preview-сценарии → не регистрировать service worker
  - production/custom domain → PWA включена

После одобрения внесу эти изменения.