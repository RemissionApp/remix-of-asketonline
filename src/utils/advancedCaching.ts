// Advanced Caching для оптимизации производительности PWA
export interface CacheStrategy {
  name: string;
  pattern: RegExp;
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'network-only' | 'cache-only';
  maxAge?: number; // в секундах
  maxEntries?: number;
}

export interface CacheStatus {
  size: number;
  entries: number;
  lastUpdated: Date;
}

class AdvancedCacheManager {
  private strategies: Map<string, CacheStrategy> = new Map();
  private cacheName = 'asket-advanced-cache-v1';

  /**
   * Проверяет поддержку Cache API
   */
  isSupported(): boolean {
    return typeof caches !== 'undefined';
  }

  /**
   * Инициализирует стратегии кэширования
   */
  async initializeStrategies(): Promise<void> {
    if (!this.isSupported()) return;

    // Стратегии для разных типов контента
    const defaultStrategies: CacheStrategy[] = [
      {
        name: 'static-assets',
        pattern: /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2?)$/,
        strategy: 'cache-first',
        maxAge: 86400 * 30, // 30 дней
        maxEntries: 100
      },
      {
        name: 'api-responses',
        pattern: /\/api\//,
        strategy: 'network-first',
        maxAge: 300, // 5 минут
        maxEntries: 50
      },
      {
        name: 'horoscope-data',
        pattern: /horoscope|zodiac/,
        strategy: 'stale-while-revalidate',
        maxAge: 3600, // 1 час
        maxEntries: 20
      },
      {
        name: 'meditation-audio',
        pattern: /meditation.*\.(mp3|wav|ogg)$/,
        strategy: 'cache-first',
        maxAge: 86400 * 7, // 7 дней
        maxEntries: 30
      },
      {
        name: 'profile-images',
        pattern: /avatar|profile.*\.(png|jpg|jpeg)$/,
        strategy: 'cache-first',
        maxAge: 86400 * 7, // 7 дней
        maxEntries: 50
      }
    ];

    for (const strategy of defaultStrategies) {
      this.strategies.set(strategy.name, strategy);
    }

    console.log('Advanced caching strategies initialized');
  }

  /**
   * Получает стратегию для URL
   */
  private getStrategyForUrl(url: string): CacheStrategy | null {
    for (const strategy of this.strategies.values()) {
      if (strategy.pattern.test(url)) {
        return strategy;
      }
    }
    return null;
  }

  /**
   * Кэширует ответ согласно стратегии
   */
  async cacheResponse(request: Request, response: Response): Promise<void> {
    if (!this.isSupported()) return;

    const strategy = this.getStrategyForUrl(request.url);
    if (!strategy) return;

    try {
      const cache = await caches.open(this.cacheName);
      
      // Клонируем ответ, так как Response можно использовать только один раз
      const responseToCache = response.clone();
      
      // Добавляем метаданные
      const headers = new Headers(responseToCache.headers);
      headers.set('cached-at', new Date().toISOString());
      headers.set('cache-strategy', strategy.name);
      headers.set('max-age', strategy.maxAge?.toString() || '0');
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers
      });

      await cache.put(request, modifiedResponse);
      
      // Проверяем лимиты
      await this.enforceMaxEntries(strategy);
      
    } catch (error) {
      console.warn('Error caching response:', error);
    }
  }

  /**
   * Получает ответ из кэша
   */
  async getCachedResponse(request: Request): Promise<Response | null> {
    if (!this.isSupported()) return null;

    try {
      const cache = await caches.open(this.cacheName);
      const cachedResponse = await cache.match(request);
      
      if (!cachedResponse) return null;

      // Проверяем срок действия
      const cachedAt = cachedResponse.headers.get('cached-at');
      const maxAge = cachedResponse.headers.get('max-age');
      
      if (cachedAt && maxAge) {
        const cacheTime = new Date(cachedAt).getTime();
        const maxAgeMs = parseInt(maxAge) * 1000;
        const now = Date.now();
        
        if (now - cacheTime > maxAgeMs) {
          // Кэш устарел
          await cache.delete(request);
          return null;
        }
      }

      return cachedResponse;
    } catch (error) {
      console.warn('Error getting cached response:', error);
      return null;
    }
  }

  /**
   * Применяет стратегию кэширования
   */
  async handleRequest(request: Request): Promise<Response> {
    const strategy = this.getStrategyForUrl(request.url);
    
    if (!strategy) {
      // Без стратегии - просто делаем запрос
      return fetch(request);
    }

    switch (strategy.strategy) {
      case 'cache-first':
        return this.cacheFirstStrategy(request);
      
      case 'network-first':
        return this.networkFirstStrategy(request);
      
      case 'stale-while-revalidate':
        return this.staleWhileRevalidateStrategy(request);
      
      case 'cache-only':
        return this.cacheOnlyStrategy(request);
      
      case 'network-only':
        return this.networkOnlyStrategy(request);
      
      default:
        return fetch(request);
    }
  }

  private async cacheFirstStrategy(request: Request): Promise<Response> {
    const cachedResponse = await this.getCachedResponse(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    await this.cacheResponse(request, networkResponse);
    return networkResponse;
  }

  private async networkFirstStrategy(request: Request): Promise<Response> {
    try {
      const networkResponse = await fetch(request);
      await this.cacheResponse(request, networkResponse);
      return networkResponse;
    } catch (error) {
      const cachedResponse = await this.getCachedResponse(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  }

  private async staleWhileRevalidateStrategy(request: Request): Promise<Response> {
    const cachedResponse = await this.getCachedResponse(request);
    
    // Обновляем в фоне
    const networkPromise = fetch(request).then(response => {
      this.cacheResponse(request, response);
      return response;
    }).catch(() => {
      // Игнорируем ошибки сети в фоновом обновлении
    });

    // Возвращаем кэшированный ответ если есть, иначе ждем сеть
    if (cachedResponse) {
      return cachedResponse;
    }

    return await networkPromise || new Response('Network error', { status: 503 });
  }

  private async cacheOnlyStrategy(request: Request): Promise<Response> {
    const cachedResponse = await this.getCachedResponse(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Not found in cache', { status: 404 });
  }

  private async networkOnlyStrategy(request: Request): Promise<Response> {
    return fetch(request);
  }

  /**
   * Принудительное ограничение количества записей
   */
  private async enforceMaxEntries(strategy: CacheStrategy): Promise<void> {
    if (!strategy.maxEntries) return;

    try {
      const cache = await caches.open(this.cacheName);
      const keys = await cache.keys();
      
      // Фильтруем ключи по паттерну стратегии
      const strategyKeys = keys.filter(key => strategy.pattern.test(key.url));
      
      if (strategyKeys.length > strategy.maxEntries) {
        // Удаляем самые старые записи
        const toDelete = strategyKeys.slice(0, strategyKeys.length - strategy.maxEntries);
        await Promise.all(toDelete.map(key => cache.delete(key)));
      }
    } catch (error) {
      console.warn('Error enforcing cache limits:', error);
    }
  }

  /**
   * Предварительная загрузка критических ресурсов
   */
  async preloadCriticalResources(urls: string[]): Promise<void> {
    if (!this.isSupported()) return;

    const cache = await caches.open(this.cacheName);
    
    const preloadPromises = urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
          console.log(`Preloaded: ${url}`);
        }
      } catch (error) {
        console.warn(`Failed to preload: ${url}`, error);
      }
    });

    await Promise.all(preloadPromises);
  }

  /**
   * Получает статистику кэша
   */
  async getCacheStats(): Promise<CacheStatus> {
    if (!this.isSupported()) {
      return { size: 0, entries: 0, lastUpdated: new Date() };
    }

    try {
      const cache = await caches.open(this.cacheName);
      const keys = await cache.keys();
      
      let totalSize = 0;
      let lastUpdated = new Date(0);

      for (const key of keys) {
        const response = await cache.match(key);
        if (response) {
          const cachedAt = response.headers.get('cached-at');
          if (cachedAt) {
            const cacheTime = new Date(cachedAt);
            if (cacheTime > lastUpdated) {
              lastUpdated = cacheTime;
            }
          }
          
          // Примерная оценка размера
          const contentLength = response.headers.get('content-length');
          if (contentLength) {
            totalSize += parseInt(contentLength);
          }
        }
      }

      return {
        size: totalSize,
        entries: keys.length,
        lastUpdated
      };
    } catch (error) {
      console.warn('Error getting cache stats:', error);
      return { size: 0, entries: 0, lastUpdated: new Date() };
    }
  }

  /**
   * Очищает весь кэш
   */
  async clearCache(): Promise<void> {
    if (!this.isSupported()) return;

    try {
      await caches.delete(this.cacheName);
      console.log('Advanced cache cleared');
    } catch (error) {
      console.warn('Error clearing cache:', error);
    }
  }
}

// Экспортируем единственный экземпляр
export const advancedCache = new AdvancedCacheManager();

/**
 * Утилиты для интеграции с Service Worker
 */
export const cacheServiceWorker = {
  /**
   * Регистрирует обработчики в Service Worker
   */
  setupServiceWorkerCache(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', async (event) => {
        if (event.data.type === 'CACHE_REQUEST') {
          const { request } = event.data;
          const response = await advancedCache.handleRequest(new Request(request.url));
          
          event.ports[0].postMessage({
            type: 'CACHE_RESPONSE',
            response: response
          });
        }
      });
    }
  }
};