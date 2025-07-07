const CACHE_NAME = 'cosmic-path-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Ресурсы для кэширования при установке
const urlsToCache = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Установка service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('Service Worker: Caching files');
      await cache.addAll(urlsToCache);
      
      // Принудительно активируем новый service worker
      self.skipWaiting();
    })()
  );
});

// Перехват сетевых запросов с стратегией Network First
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Сначала пытаемся загрузить из сети
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // Если сеть недоступна, показываем offline страницу
          console.log('Fetch failed; returning offline page instead.', error);
          
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  } else {
    // Для остальных запросов используем Cache First стратегию
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          return cachedResponse;
        }
        
        try {
          const networkResponse = await fetch(event.request);
          
          // Кэшируем успешные ответы
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          
          return networkResponse;
        } catch (error) {
          console.log('Fetch failed:', error);
          throw error;
        }
      })()
    );
  }
});

// Активация service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push уведомления с детализированными типами
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const defaultOptions = {
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id || 1,
      type: data.type || 'default'
    },
    actions: [
      {
        action: 'open',
        title: 'Открыть',
        icon: '/icon-72.png'
      },
      {
        action: 'close',
        title: 'Закрыть'
      }
    ]
  };

  let title = 'Asket App';
  let body = 'У вас есть новое уведомление';
  let customOptions = {};

  // Типы уведомлений
  switch (data.type) {
    case 'daily_reminder':
      title = 'Ежедневное напоминание';
      body = 'Не забудьте подтвердить выполнение вашей аскезы';
      customOptions = {
        tag: 'daily-reminder',
        renotify: true,
        requireInteraction: true
      };
      break;
      
    case 'pact_start':
      title = 'Начало аскезы';
      body = `Ваша аскеза "${data.pactTitle}" начинается сегодня!`;
      customOptions = {
        tag: 'pact-start',
        requireInteraction: true
      };
      break;
      
    case 'pact_complete':
      title = 'Аскеза завершена!';
      body = `Поздравляем! Вы успешно завершили "${data.pactTitle}"`;
      customOptions = {
        tag: 'pact-complete',
        requireInteraction: true
      };
      break;
      
    case 'meditation_reminder':
      title = 'Время медитации';
      body = 'Найдите несколько минут для медитативной практики';
      customOptions = {
        tag: 'meditation-reminder'
      };
      break;
      
    case 'universe_message':
      title = 'Сообщение от Вселенной';
      body = data.message || 'У вас есть новое напутствие';
      customOptions = {
        tag: 'universe-message',
        requireInteraction: true
      };
      break;
      
    case 'achievement':
      title = 'Новое достижение!';
      body = `Вы получили достижение: ${data.achievementTitle}`;
      customOptions = {
        tag: 'achievement',
        requireInteraction: true
      };
      break;
      
    case 'subscription_reminder':
      title = 'Напоминание о подписке';
      body = data.message || 'Ваша PRO-подписка скоро истекает';
      customOptions = {
        tag: 'subscription'
      };
      break;
  }
  
  const options = { ...defaultOptions, ...customOptions, body };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Обработка клика по уведомлению с роутингом
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received.');
  event.notification.close();
  
  const { type, pactId, achievementId } = event.notification.data;
  let url = '/';
  
  // Определяем URL для перехода
  switch (type) {
    case 'daily_reminder':
    case 'pact_start':
    case 'pact_complete':
      url = pactId ? `/main?pact=${pactId}` : '/main';
      break;
    case 'meditation_reminder':
      url = '/meditation';
      break;
    case 'universe_message':
      url = '/universe';
      break;
    case 'achievement':
      url = '/profile';
      break;
    case 'subscription_reminder':
      url = '/comparison';
      break;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Проверяем, есть ли уже открытая вкладка
      for (const client of clientList) {
        if (client.url.includes(url.split('?')[0]) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Открываем новую вкладку
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});