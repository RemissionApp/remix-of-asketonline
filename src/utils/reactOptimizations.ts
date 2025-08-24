// React optimization utilities
import React from 'react';

// Мемоизация для тяжелых вычислений
export const useMemoizedValue = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  return React.useMemo(factory, deps);
};

// Стабильные callback функции
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  return React.useCallback(callback, []);
};

// Debounced значения для предотвращения частых обновлений
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// HOC для мемоизации компонентов
export function withMemo<P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  return React.memo(Component, areEqual);
}

// Хук для предотвращения лишних ререндеров
export const useShallowMemo = <T>(value: T): T => {
  const ref = React.useRef<T>(value);
  
  if (!shallowEqual(ref.current, value)) {
    ref.current = value;
  }
  
  return ref.current;
};

// Простая shallow equal функция
function shallowEqual<T>(obj1: T, obj2: T): boolean {
  if (obj1 === obj2) return true;
  
  if (!obj1 || !obj2) return false;
  
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return obj1 === obj2;
  }
  
  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
}

// Хук для lazy загрузки компонентов
export const useLazyComponent = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): { Component: T | null; loading: boolean; error: Error | null } => {
  const [state, setState] = React.useState<{
    Component: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    Component: null,
    loading: true,
    error: null,
  });

  React.useEffect(() => {
    factory()
      .then(({ default: Component }) => {
        setState({ Component, loading: false, error: null });
      })
      .catch((error) => {
        setState({ Component: null, loading: false, error });
      });
  }, []);

  return state;
};

// Хук для intersection observer (lazy loading)
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
): [(node: Element | null) => void, boolean] => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [node, setNode] = React.useState<Element | null>(null);

  React.useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [node, options]);

  return [setNode, isIntersecting];
};

// Оптимизированный список для больших данных
export const useVirtualizedList = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = React.useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        width: '100%',
      },
    }));
  }, [items, startIndex, endIndex, itemHeight]);

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    totalHeight,
    scrollTop,
    setScrollTop,
  };
};