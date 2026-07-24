const CACHE_NAME = 'na-moteslista-v14-23';
const APP_SHELL = [
  '/',
  '/index.html',
  '/css/styles.css?v=14.23',
  '/js/utils.js?v=14.23',
  '/js/api.js?v=14.23',
  '/js/meetings.js?v=14.23',
  '/js/filters.js?v=14.23',
  '/js/place-search.js?v=14.23',
  '/js/map.js?v=14.23',
  '/js/stats.js?v=14.23',
  '/js/pdf-folder.js?v=14.23',
  '/js/share-navigation.js?v=14.23',
  '/js/app.js?v=14.23',
  '/data/sweden-places.json?v=14.23',
  '/manifest.webmanifest?v=14.23',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  if (url.pathname.includes('/api/') || url.pathname.includes('/mote')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response.ok) return response;

          const copy = response.clone();
          return caches.open(CACHE_NAME)
            .then(cache => cache.put('/index.html', copy))
            .then(() => response);
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          if (!response.ok) return response;

          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => Response.error());
    })
  );
});
