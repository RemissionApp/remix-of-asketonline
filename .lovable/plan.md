## 1. Убрать баннер тестового режима

Файл `src/App.tsx`:
- Удалить импорт `PaymentTestModeBanner` (строка 52) и его рендер (строка 85).

Файл `src/components/PaymentTestModeBanner.tsx`:
- Удалить файл целиком.

**Контекст:** Stripe go-live полностью завершён (все 5 шагов `completed`). `.env.production` уже содержит `pk_live_...`, `.env.development` — `pk_test_...`. Баннер сейчас показывается только в preview (sandbox-режим). После удаления баннер исчезнет везде. Реальные карты на `asceta.app` будут списываться, в preview оплата продолжит работать в тестовом режиме скрыто (это нормально для разработки).

## 2. Полная pre-publish проверка приложения

Прогоню все доступные проверки и соберу единый отчёт:

### A. Stripe / платежи
- ✅ Go-live статус — все 5 шагов завершены (уже проверено).
- Верифицировать через `supabase--curl_edge_functions` создание live-checkout сессии для каждой цены: `asceta_pro_monthly`, `asceta_pro_yearly`, `asceta_minutes_pack_10`.
- Проверить, что у всех продуктов в Stripe выставлен tax code `txcd_10103001` (SaaS).
- Проверить webhook live: `payments-webhook` принимает `?env=live` и подписан `PAYMENTS_LIVE_WEBHOOK_SECRET` (секрет уже есть).
- Проверить `create-portal-session` (Billing Portal на live).

### B. База данных и безопасность
- `supabase--linter` — все автоматические security-warning'и.
- `security--run_security_scan` — глубокий security-скан RLS, политик, утечек.
- Просмотреть таблицы `subscriptions`, `profiles`, `monthly_call_minutes` на корректность RLS.

### C. Auth
- Проверить, что в Lovable Cloud включены: email/password + Google + Apple (managed OAuth).
- Email confirmation включена (триггер `handle_new_user` создаёт профиль и trial).
- HIBP (leaked password check) — рекомендую включить, спрошу подтверждение если выключено.

### D. Edge функции
- Список деплоя: `create-checkout`, `payments-webhook`, `create-portal-session`, `delete-account`, `expire-trials` и др.
- Проверить, что у платёжных функций `verify_jwt = false` в `supabase/config.toml`.
- Проверить `supabase--edge_function_logs` за последние сутки на критические ошибки.

### E. Frontend
- Зависимости: `code--dependency_scan` — известные уязвимости в npm.
- Сборка production (`bun run build`) — нет TS/Vite ошибок.
- SEO: `index.html` — title, meta description, og-теги, canonical, lang.
- Service Worker / PWA — корректный кэш, `/~oauth` в denylist (для OAuth с custom-домена).

### F. Custom domain
- `asceta.app` — статус Active, SSL валиден.
- OAuth-редиректы (`/~oauth/callback`) работают на custom-домене.

### G. Чек-лист публикации (выдам пошагово)
- Что нажать в Lovable для публикации.
- Как протестировать реальной картой минимальную сумму ($1.99 за 10 минут).
- Где смотреть Stripe live-транзакции и логи Cloud.

### Что вернётся пользователю
Один сжатый отчёт: ✅ что готово / ⚠️ что требует внимания / ❌ что блокирует публикацию, с конкретными файлами/секциями для каждого пункта. Если найдутся блокеры, предложу их сразу починить.

### Тех-детали
- Никаких изменений в платёжной логике, RLS или auth не планируется без явного блокера.
- Для preview оплата останется sandbox — это by design (Vite автоматически грузит `.env.development`).
