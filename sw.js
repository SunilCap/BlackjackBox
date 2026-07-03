/**
 * 21 Table — Blackjack  /  Service Worker
 * Version: 1.0.0
 *
 * Place this file (sw.js) in the SAME directory as blackjack.html on your server.
 * The game will automatically register it for offline support.
 *
 * Update CACHE_VERSION whenever you deploy a new version of blackjack.html
 * so that returning users get fresh content.
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME    = `blackjack-${CACHE_VERSION}`;

/* Files to pre-cache on install */
const PRECACHE = [
  './',
  './blackjack.html',
];

/* ── INSTALL: cache app shell ── */
self.addEventListener('install', event => {
  console.log(`[SW] Installing ${CACHE_NAME}`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())   // activate immediately
  );
});

/* ── ACTIVATE: purge old caches ── */
self.addEventListener('activate', event => {
  console.log(`[SW] Activating ${CACHE_NAME}`);
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log(`[SW] Deleting old cache: ${key}`);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())   // take control immediately
  );
});

/* ── FETCH: cache-first, network fallback ── */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        /* Only cache successful same-origin responses */
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      });
    })
  );
});
