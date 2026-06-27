const CACHE_NAME = 'citybuilding-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/css/admin-dashboard.css',
  '/js/theme.js',
  '/js/site.js',
  '/images/logo.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) { return name !== CACHE_NAME; }).map(function(name) { return caches.delete(name); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).then(function(fetchResponse) {
        if (fetchResponse && fetchResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
          var copy = fetchResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, copy); });
        }
        return fetchResponse;
      });
    }).catch(function() {
      if (event.request.mode === 'navigate') return caches.match('/');
    })
  );
});
