/**
 * 21 Table — Blackjack  /  Service Worker
 * Version: 1.0.0
 *
 * Place sw.js in the SAME directory as index.html on your server.
 * Update CACHE_VERSION when you deploy a new version so users get fresh content.
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME    = `blackjack-${CACHE_VERSION}`;

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        caches.open(CACHE_NAME).then(c => c.put(event.request, response.clone()));
        return response;
      });
    })
  );
});
