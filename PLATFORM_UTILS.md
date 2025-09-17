# Утилиты для определения платформы

Набор утилит для определения платформы (iOS, Android, Web) и выполнения платформо-специфичного кода.

## Основные функции

### `src/utils/platform.ts`

#### `getPlatform()`

Возвращает текущую платформу: `'ios' | 'android' | 'web'`

```typescript
import { getPlatform } from '@/utils/platform';

const platform = getPlatform(); // 'ios' | 'android' | 'web'
```

#### `isIOS()`, `isAndroid()`, `isWeb()`, `isNative()`

Проверяют конкретную платформу:

```typescript
import { isIOS, isAndroid, isWeb, isNative } from '@/utils/platform';

if (isIOS()) {
  // Код только для iOS
}

if (isAndroid()) {
  // Код только для Android
}

if (isWeb()) {
  // Код только для веб
}

if (isNative()) {
  // Код для нативных платформ (iOS + Android)
}
```

#### `getPlatformInfo()`

Возвращает полную информацию о платформе:

```typescript
import { getPlatformInfo } from '@/utils/platform';

const info = getPlatformInfo();
// {
//   platform: 'ios' | 'android' | 'web',
//   isIOS: boolean,
//   isAndroid: boolean,
//   isWeb: boolean,
//   isNative: boolean
// }
```

#### `platformSpecific()`

Выполняет код в зависимости от платформы:

```typescript
import { platformSpecific } from '@/utils/platform';

const result = platformSpecific({
  ios: () => 'iOS specific value',
  android: () => 'Android specific value',
  web: () => 'Web specific value',
  default: () => 'Fallback value',
});
```

#### `getPlatformClasses()`

Получает CSS классы в зависимости от платформы:

```typescript
import { getPlatformClasses } from '@/utils/platform';

const classes = getPlatformClasses({
  ios: 'ios-specific-class',
  android: 'android-specific-class',
  web: 'web-specific-class',
  default: 'default-class',
});
```

#### `getPlatformValue()`

Получает значения в зависимости от платформы:

```typescript
import { getPlatformValue } from '@/utils/platform';

const padding = getPlatformValue({
  ios: 20,
  android: 16,
  web: 0,
  default: 8,
});
```

#### `supportsFeature()`

Проверяет поддержку функций:

```typescript
import { supportsFeature } from '@/utils/platform';

if (supportsFeature('safe-area')) {
  // Использовать safe-area
}

if (supportsFeature('haptic')) {
  // Использовать haptic feedback
}
```

## React хуки

### `src/hooks/usePlatform.ts`

#### `usePlatform()`

Основной хук для определения платформы в React компонентах:

```typescript
import { usePlatform } from '@/hooks/usePlatform';

const MyComponent = () => {
  const {
    platform,
    isIOS,
    isAndroid,
    isWeb,
    isNative,
    supportsSafeArea,
    supportsHaptic
  } = usePlatform();

  return (
    <div className={isIOS ? 'ios-style' : 'default-style'}>
      {platform} app
    </div>
  );
};
```

#### `usePlatformValue()`

Хук для получения платформо-специфичных значений:

```typescript
import { usePlatformValue } from '@/hooks/usePlatform';

const MyComponent = () => {
  const padding = usePlatformValue({
    ios: 20,
    android: 16,
    web: 0,
    default: 8
  });

  return (
    <div style={{ padding }}>
      Content
    </div>
  );
};
```

#### `usePlatformClasses()`

Хук для получения платформо-специфичных CSS классов:

```typescript
import { usePlatformClasses } from '@/hooks/usePlatform';

const MyComponent = () => {
  const classes = usePlatformClasses({
    ios: 'ios-navigation',
    android: 'android-navigation',
    web: 'web-navigation',
    default: 'default-navigation'
  });

  return <nav className={classes}>Navigation</nav>;
};
```

## Примеры использования

### 1. Адаптивные стили

```typescript
import { usePlatform } from '@/hooks/usePlatform';

const BottomNavigation = () => {
  const { isAndroid, isIOS, supportsSafeArea } = usePlatform();

  return (
    <div
      style={{
        paddingBottom: supportsSafeArea
          ? 'env(safe-area-inset-bottom)'
          : isAndroid
            ? '16px'
            : '0px',
      }}
    >
      Navigation content
    </div>
  );
};
```

### 2. Условная функциональность

```typescript
import { usePlatform } from '@/hooks/usePlatform';

const MyComponent = () => {
  const { isNative, supportsHaptic } = usePlatform();

  const handlePress = async () => {
    if (supportsHaptic) {
      await Haptics.impact({ style: ImpactStyle.Medium });
    }

    // Основная логика
  };

  return (
    <button onClick={handlePress}>
      {isNative ? 'Native Button' : 'Web Button'}
    </button>
  );
};
```

### 3. Платформо-специфичные компоненты

```typescript
import { usePlatformValue } from '@/hooks/usePlatform';

const Icon = ({ name }: { name: string }) => {
  const iconSize = usePlatformValue({
    ios: 24,
    android: 22,
    web: 20,
    default: 20
  });

  return (
    <IconComponent
      name={name}
      size={iconSize}
    />
  );
};
```

### 4. Условная загрузка компонентов

```typescript
import { usePlatform } from '@/hooks/usePlatform';

const MyPage = () => {
  const { isNative } = usePlatform();

  return (
    <div>
      {isNative ? (
        <NativeSpecificComponent />
      ) : (
        <WebSpecificComponent />
      )}
    </div>
  );
};
```

### 5. Логирование для отладки

```typescript
import { logPlatformInfo } from '@/utils/platform';

// В начале приложения или для отладки
logPlatformInfo();
// Выведет в консоль:
// Platform Info: {
//   platform: 'ios',
//   isIOS: true,
//   isAndroid: false,
//   isWeb: false,
//   isNative: true,
//   capacitorPlatform: 'ios',
//   userAgent: '...'
// }
```

## Поддерживаемые функции

- `'safe-area'` - поддержка safe area insets
- `'haptic'` - haptic feedback
- `'native-sharing'` - нативное разделение
- `'camera'` - доступ к камере

## Интеграция с Capacitor

Утилиты автоматически определяют платформу через Capacitor API:

- `Capacitor.isNativePlatform()` - проверка нативной платформы
- `Capacitor.getPlatform()` - получение конкретной платформы

Это обеспечивает точное определение платформы в гибридных приложениях.
