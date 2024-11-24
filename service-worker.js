self.addEventListener('install', (event) => {
  console.log('Service Worker instalado.');
  event.waitUntil(
    caches.open('super-slim-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/app.css',
        '/assets/icon-192x192.png',
        '/assets/icon-512x512.png',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});