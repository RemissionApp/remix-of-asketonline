## Что меняем на странице `/login`

### 1. Убрать кнопку «Войти как гость (dev)»
Файл: `src/pages/LoginPage.tsx`
- Удалить весь блок `{import.meta.env.DEV && (...)}` (строки 456–467) с кнопкой `handleGuestLogin`.
- Удалить функцию `handleGuestLogin` (строки 187–196), т.к. она больше не используется.

### 2. Добавить официальные логотипы Google и Apple на кнопки OAuth
Файл: `src/pages/LoginPage.tsx`
- Кнопка «Продолжить с Google»: добавить inline-SVG с фирменным многоцветным логотипом Google (4 цвета — синий/красный/жёлтый/зелёный, как требуют [Google Brand Guidelines](https://developers.google.com/identity/branding-guidelines)). Размер 18×18, слева от текста.
- Кнопка «Продолжить с Apple»: заменить текущую `Apple` иконку из `lucide-react` (это иконка-яблоко общего вида) на официальный Apple-logo SVG (моно-чёрный/белый, согласно [Sign in with Apple guidelines](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple)). Цвет — `currentColor`, чтобы наследовал белый текст кнопки.
- Оба SVG вставляем как маленькие React-компоненты в том же файле (или в `src/components/icons/`), чтобы не тянуть лишних зависимостей.
- Удалить неиспользуемый импорт `Apple` из `lucide-react`.

### 3. Mobile OAuth на домене `asceta.app`
Текущая реализация:
- **Google** — `lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin })` через Lovable Cloud managed OAuth broker (`/~oauth/...`).
- **Apple** — на iOS Capacitor нативный `SignInWithApple`, на Android и в браузере — Lovable Cloud managed OAuth.

По документации Lovable Cloud, managed OAuth (`/~oauth/initiate` и `/~oauth/callback`) **уже поддерживает custom-домены автоматически** — `asceta.app` и `www.asceta.app` входят в allowlist редиректов, т.к. это активные custom-домены проекта. `redirect_uri: window.location.origin` корректно вернёт `https://asceta.app` при заходе с мобильного браузера.

Проверки и действия:
1. Запустить браузер на мобильном viewport и перейти на `https://asceta.app/login`. Нажать «Продолжить с Google» — убедиться, что редирект идёт на `https://asceta.app/~oauth/initiate?...` → Google → `https://asceta.app/~oauth/callback` → возврат на `/`.
2. То же для Apple (web flow).
3. Проверить, что в Lovable Cloud → Users → Authentication Settings провайдеры Google и Apple включены (managed-mode).
4. Если Apple через managed-mode на web возвращает ошибку — это означает, что Sign in with Apple требует BYOC-настройки Services ID + Return URL для домена `asceta.app`; в этом случае мы оформим инструкцию и попросим тебя сгенерировать ключ.

PWA service worker уже настроен корректно — `/~oauth` в `navigateFallbackDenylist` (если используется `vite-plugin-pwa`); проверим и при необходимости добавим.

### Тех-детали (не критично читать)
- Никаких изменений в `useAuthFlow`, `lovable/index.ts`, `appleSignIn.ts` не требуется — они уже корректны для custom-домена.
- `useAuthFlow` после успешного OAuth-возврата автоматически перенаправит на `/profile-setup` или `/main` в зависимости от состояния пользователя.

### Что покажу после реализации
- Скриншот обновлённой страницы `/login` (mobile viewport).
- Результат тестового OAuth-потока для Google с домена `asceta.app` (URL-цепочка).
- Если Apple managed-OAuth не работает на web — отдельный шаг с настройкой BYOC.
