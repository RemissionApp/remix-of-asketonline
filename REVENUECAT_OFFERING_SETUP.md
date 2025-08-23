# Настройка Offering в RevenueCat Dashboard

## Проблема

У вас есть продукт `asket_monthly_premium:default`, но нет связанного Offering. Это означает, что приложение не может получить предложения для покупки.

## Решение: Создание Offering

### Шаг 1: Перейдите в RevenueCat Dashboard

1. Войдите в [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Выберите проект "Asket"
3. Перейдите в **Product catalog** → **Offerings**

### Шаг 2: Создайте новый Offering

1. Нажмите кнопку **"+ New Offering"**
2. Заполните поля:
   - **Identifier:** `default` (или любое другое название)
   - **Display Name:** `Premium Subscription`
   - **Description:** `Основная подписка Premium`

### Шаг 3: Добавьте пакет в Offering

1. В созданном Offering нажмите **"+ New Package"**
2. Заполните поля:
   - **Identifier:** `monthly` (или любое другое название)
   - **Display Name:** `Monthly Premium`
   - **Description:** `Ежемесячная подписка Premium`

### Шаг 4: Свяжите продукт с пакетом

1. В пакете нажмите **"Attach Product"**
2. Выберите продукт `asket_monthly_premium:default`
3. Нажмите **"Save"**

### Шаг 5: Свяжите Entitlement

1. В пакете нажмите **"Attach Entitlement"**
2. Выберите entitlement `asket_premium_montly`
3. Нажмите **"Save"**

### Шаг 6: Установите Offering как текущий

1. В списке Offerings найдите созданный Offering
2. Нажмите на три точки справа
3. Выберите **"Set as Current"**

## Проверка настройки

После настройки в приложении вы должны увидеть:

- ✅ Оффер загружается
- ✅ Отображается доступный пакет
- ✅ Кнопка "Купить" активна

## Структура конфигурации

```
Offering: "default"
├── Package: "monthly"
    ├── Product: "asket_monthly_premium:default"
    └── Entitlement: "asket_premium_montly"
```

## Возможные проблемы

### "Нет доступных офферов"

- Убедитесь, что Offering создан и установлен как текущий
- Проверьте, что продукт связан с пакетом
- Убедитесь, что entitlement связан с пакетом

### "Оффер загружается, но нет пакетов"

- Проверьте, что пакет создан в Offering
- Убедитесь, что продукт привязан к пакету

### "Кнопка покупки неактивна"

- Проверьте, что entitlement привязан к пакету
- Убедитесь, что продукт имеет статус "Published" в Google Play Console

## Полезные ссылки

- [RevenueCat Offerings Documentation](https://www.revenuecat.com/docs/entitlements)
- [RevenueCat Product Catalog](https://www.revenuecat.com/docs/product-catalog)
- [Google Play Console](https://play.google.com/console)
