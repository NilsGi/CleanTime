const CACHE_NAME = 'na-moteslista-v14-24';
const VERSIONED_INDEX = '/index.html?v=14.24';
const APP_SHELL = [
  '/css/styles.css?v=14.24',
  '/js/utils.js?v=14.24',
  '/js/api.js?v=14.24',
  '/js/meetings.js?v=14.24',
  '/js/filters.js?v=14.24',
  '/js/place-search.js?v=14.24',
  '/js/map.js?v=14.24',
  '/js/stats.js?v=14.24',
  '/js/pdf-folder.js?v=14.24',
  '/js/share-navigation.js?v=14.24',
  '/js/app.js?v=14.24',
  '/data/sweden-places.json?v=14.24',
  '/manifest.webmanifest?v=14.24',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        await cache.addAll(APP_SHELL);
        const response = await fetch(VERSIONED_INDEX, { cache: 'reload' });
        if (!response.ok) throw new Error('Kunde inte hämta aktuell index.html');
        await cache.put('/index.html', response);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => Promise.all(
        clients.map(client => typeof client.navigate === 'function'
          ? client.navigate(client.url).catch(() => null)
          : Promise.resolve())
      ))
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
      fetch(event.request, { cache: 'reload' })
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
