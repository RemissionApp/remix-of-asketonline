// Kill-switch service worker.
// Purpose: unregister any previously-installed service worker, clear all
// caches, and reload open clients so the Lovable IDE preview iframe is no
// longer hijacked by a stale PWA shell.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      await self.clients.claim();
      const names = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
      const allClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });
      await Promise.all(allClients.map((c) => {
        try {
          const url = new URL(c.url);
          url.searchParams.set('sw-cleanup', Date.now().toString());
          return c.navigate(url.toString());
        } catch (e) {
          return Promise.resolve();
        }
      }));
      await self.registration.unregister();
    } catch (e) {
      // best-effort
    }
  })());
});

// Pass-through fetch — never cache.
self.addEventListener('fetch', () => {});
