# План: RevenueCat Web Billing на сайте Asceta

В RevenueCat уже настроены продукты (`asket_pro_monthly`, `asket_pro_annually`) с привязанными Stripe-офферингами и entitlement `asket_pro_annually`. Используем официальный Web Billing SDK от RevenueCat — пользователь оплачивает прямо на сайте, подписка автоматически синхронизируется с тем же `appUserID` что и в iOS/Android приложении.

## Что нужно от пользователя

1. **Web Billing public API key** из RevenueCat Dashboard → Project Settings → API Keys → ключ с префиксом `rcb_` (это публичный ключ, можно хранить в коде, но мы положим в secret для гибкости).
2. Подтвердить что в RevenueCat Dashboard → **Web Billing** включена платформа Web и продукты `asket_pro_monthly` / `asket_pro_annually` доступны для веба (часто требуется отдельно «Add to Web Billing»).
3. Stripe-аккаунт уже подключён в RevenueCat (видно по скриншоту — это всё что требуется, отдельный Stripe в Lovable не нужен).

## Технические шаги

### 1. Установка SDK
```
bun add @revenuecat/purchases-js
```

### 2. Новый сервис `src/utils/revenueCatWeb.ts`
- Singleton-обёртка над `Purchases.configure({ apiKey, appUserId })`.
- Методы: `getOfferings()`, `purchasePackage(rcPackage)`, `getCustomerInfo()`, `restore()`.
- `appUserId` берём из `useAppStore().user.id` — тот же что и в нативном SDK, чтобы entitlement работал кросс-платформенно.

### 3. Расширить `useRevenueCat.ts`
- Если `isWebPlatform()` → использовать `revenueCatWeb`, иначе текущую Capacitor-реализацию.
- Унифицировать форму `offerings` / `customerInfo` чтобы UI не различал источник.
- `presentPaywall` на вебе больше не редиректит на `/comparison`, а вызывает `purchasePackage` выбранного пакета (или открывает встроенный Stripe Checkout-редирект, который SDK делает автоматически).

### 4. Обновить `ComparisonPage.tsx` / `FeatureComparison.tsx`
- На вебе: убрать предупреждение «только в App Store / Google Play».
- Показать две реальные кнопки: «Месяц — $X» и «Год — $Y» с ценами из `offering.availablePackages[i].rcBillingProduct.currentPrice.formattedPrice`.
- По клику — `purchasePackage(pkg)`. SDK сам редиректит на Stripe Checkout, потом возвращает на success URL.
- Success URL: `/comparison?purchase=success` → показать toast «PRO активирован» и обновить `customerInfo`.

### 5. Webhook (уже есть)
`supabase/functions/revenuecat-webhook/index.ts` уже обрабатывает события RevenueCat — Web Billing шлёт те же события `INITIAL_PURCHASE` / `RENEWAL` / `CANCELLATION`, доп. изменения не нужны. Проверим что в RevenueCat Dashboard → Integrations → Webhooks указан URL нашей функции.

### 6. Серверная проверка `is_pro`
Уже сделано в edge functions (`universe-answer`, `generate-numerology-description`) — они читают entitlement из БД, который пишется webhook'ом. Никаких изменений.

### 7. Secret
Запросить через `add_secret`:
- `VITE_REVENUECAT_WEB_BILLING_KEY` — публичный ключ `rcb_...`, доступный фронтенду.

## Файлы

**Новые:**
- `src/utils/revenueCatWeb.ts` — Web Billing сервис.

**Изменяемые:**
- `package.json` (+ `@revenuecat/purchases-js`)
- `src/hooks/useRevenueCat.ts` — роутинг web/native.
- `src/store/slices/revenueCatSlice.ts` — поддержка веб-офферингов.
- `src/pages/ComparisonPage.tsx` — убрать disclaimer, обработать `?purchase=success`.
- `src/components/FeatureComparison.tsx` — реальные кнопки оплаты с ценами.

## Что НЕ делаем
- Не подключаем Stripe напрямую через Lovable Payments — RevenueCat уже посредник, дублирование сломает синхронизацию entitlements между web/iOS/Android.
- Не трогаем нативный Capacitor flow — он продолжает работать как есть.

## После одобрения плана
Жду от вас Web Billing API key (`rcb_...`) и подтверждение что продукты добавлены в Web Billing в RevenueCat Dashboard — после этого реализую всё за один проход.
