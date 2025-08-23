# Настройка RevenueCat для Google Play Billing

## Шаг 1: Получение API ключа RevenueCat

1. Войдите в ваш [RevenueCat Dashboard](https://app.revenuecat.com/)
2. Выберите проект "Asket"
3. Перейдите в **Project Settings** → **API Keys**
4. Скопируйте **Public API Key** для Android

## Шаг 2: Настройка API ключа в коде

Откройте файл `src/utils/revenueCat.ts` и замените строку:

```typescript
const REVENUECAT_API_KEY = 'your_revenuecat_api_key_here';
```

На ваш реальный API ключ:

```typescript
const REVENUECAT_API_KEY = 'appl_your_actual_api_key_here';
```

## Шаг 3: Проверка конфигурации Android

Убедитесь, что в файле `android/app/build.gradle` добавлена зависимость:

```gradle
implementation 'com.android.billingclient:billing:6.1.0'
```

И в `android/app/src/main/AndroidManifest.xml` добавлено разрешение:

```xml
<uses-permission android:name="com.android.vending.BILLING" />
```

## Шаг 4: Сборка и тестирование

1. Выполните сборку проекта:

```bash
npm run build
npx cap sync android
```

2. Запустите приложение на Android устройстве или эмуляторе

3. На главной странице вы увидите:
   - Кнопку "Купить Premium" в нижней части экрана
   - Полную панель тестирования покупок с детальной информацией

## Шаг 5: Тестирование покупок

1. **Тестовые аккаунты**: Добавьте тестовые аккаунты Google Play в RevenueCat Dashboard
2. **Тестовые продукты**: Убедитесь, что продукт `asket_monthly_premium:default` настроен в Google Play Console
3. **Тестирование**: Используйте тестовые аккаунты для совершения покупок

## Возможные проблемы

### Ошибка "API ключ не настроен"

- Проверьте, что API ключ правильно вставлен в `revenueCat.ts`
- Убедитесь, что ключ соответствует вашему проекту

### Ошибка "Нет доступных предложений"

- Проверьте настройки Offerings в RevenueCat Dashboard
- Убедитесь, что продукты связаны с Offerings

### Ошибка покупки

- Проверьте, что тестовый аккаунт добавлен в Google Play Console
- Убедитесь, что приложение подписано правильным ключом

## Полезные ссылки

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [Google Play Billing Documentation](https://developer.android.com/google/play/billing)
- [Capacitor RevenueCat Plugin](https://github.com/RevenueCat/purchases-capacitor)
