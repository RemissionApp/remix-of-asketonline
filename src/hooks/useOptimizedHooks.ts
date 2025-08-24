// Optimized state management hooks
import React from 'react';
import { useShallowMemo, useDebouncedValue } from '@/utils/reactOptimizations';

// Оптимизированный хук для частых обновлений состояния
export const useOptimizedState = <T>(
  initialValue: T,
  debounceMs?: number
): [T, T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = React.useState<T>(initialValue);
  
  const debouncedState = debounceMs 
    ? useDebouncedValue(state, debounceMs)
    : state;
    
  const memoizedState = useShallowMemo(debouncedState);
  
  return [state, memoizedState, setState];
};

// Хук для управления списками с оптимизацией
export const useOptimizedList = <T>(
  initialItems: T[],
  keyExtractor: (item: T) => string | number
) => {
  const [items, setItems] = React.useState<T[]>(initialItems);
  
  const memoizedItems = React.useMemo(() => items, [items]);
  
  const addItem = React.useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, []);
  
  const removeItem = React.useCallback((key: string | number) => {
    setItems(prev => prev.filter(item => keyExtractor(item) !== key));
  }, [keyExtractor]);
  
  const updateItem = React.useCallback((key: string | number, updater: (item: T) => T) => {
    setItems(prev => prev.map(item => 
      keyExtractor(item) === key ? updater(item) : item
    ));
  }, [keyExtractor]);
  
  const clearItems = React.useCallback(() => {
    setItems([]);
  }, []);
  
  return {
    items: memoizedItems,
    addItem,
    removeItem,
    updateItem,
    clearItems,
    setItems
  };
};

// Оптимизированный хук для формы
export const useOptimizedForm = <T extends Record<string, any>>(
  initialValues: T,
  validateDebounceMs: number = 300
) => {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof T, boolean>>>({});
  
  const debouncedValues = useDebouncedValue(values, validateDebounceMs);
  
  const setValue = React.useCallback(<K extends keyof T>(
    field: K,
    value: T[K]
  ) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);
  
  const setError = React.useCallback(<K extends keyof T>(
    field: K,
    error?: string
  ) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);
  
  const resetForm = React.useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  const isValid = React.useMemo(() => {
    return Object.values(errors).every(error => !error);
  }, [errors]);
  
  return {
    values,
    debouncedValues,
    errors,
    touched,
    isValid,
    setValue,
    setError,
    resetForm,
    setValues,
    setErrors,
    setTouched
  };
};

// Хук для управления модальными окнами с оптимизацией
export const useOptimizedModal = (initialOpen: boolean = false) => {
  const [isOpen, setIsOpen] = React.useState(initialOpen);
  const [data, setData] = React.useState<any>(null);
  
  const openModal = React.useCallback((modalData?: any) => {
    setData(modalData);
    setIsOpen(true);
  }, []);
  
  const closeModal = React.useCallback(() => {
    setIsOpen(false);
    // Delay clearing data to allow for exit animations
    setTimeout(() => setData(null), 300);
  }, []);
  
  const toggleModal = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal
  };
};

// Хук для управления асинхронными операциями
export const useOptimizedAsync = <T, E = Error>() => {
  const [state, setState] = React.useState<{
    data: T | null;
    loading: boolean;
    error: E | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });
  
  const execute = React.useCallback(async (asyncFunction: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error as E }));
      throw error;
    }
  }, []);
  
  const reset = React.useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);
  
  return {
    ...state,
    execute,
    reset
  };
};

// Хук для оптимизированной пагинации
export const useOptimizedPagination = (
  totalItems: number,
  itemsPerPage: number = 10
) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const totalPages = React.useMemo(() => 
    Math.ceil(totalItems / itemsPerPage), 
    [totalItems, itemsPerPage]
  );
  
  const startIndex = React.useMemo(() => 
    (currentPage - 1) * itemsPerPage, 
    [currentPage, itemsPerPage]
  );
  
  const endIndex = React.useMemo(() => 
    Math.min(startIndex + itemsPerPage - 1, totalItems - 1), 
    [startIndex, itemsPerPage, totalItems]
  );
  
  const goToPage = React.useCallback((page: number) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clampedPage);
  }, [totalPages]);
  
  const nextPage = React.useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);
  
  const prevPage = React.useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);
  
  const canGoNext = React.useMemo(() => 
    currentPage < totalPages, 
    [currentPage, totalPages]
  );
  
  const canGoPrev = React.useMemo(() => 
    currentPage > 1, 
    [currentPage]
  );
  
  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev
  };
};