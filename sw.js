/**
 * 21 Table — Blackjack  /  Service Worker
 * Version: 1.0.3
 *
 * Place sw.js in the SAME directory as index.html, style.css, game.js, and manifest.json.
 * Bump CACHE_VERSION whenever you deploy a new version so returning users get fresh content.
 */

const CACHE_VERSION = 'v1.0.3';
const CACHE_NAME    = `blackjack-${CACHE_VERSION}`;

const PRECACHE = [
  './',
  './index.html',
  './style.css',
  './game.js',
  './cloud-sync.js',
  './manifest.json',
  './img/card-back.png',
  './img/city-lasvegas.png',
  './img/city-paris.png',
  './img/city-singapore.png',
  './img/city-melbourne.png',
  './img/icon-music.png',
  './img/icon-mute.png',
  './img/icon-cart.png',
  './img/icon-chart.png',
  './img/icon-question.png',
  './img/icon-back.png',
  './img/icon-chip-bankroll.png',
  './img/icon-plus.png',
  './img/suit-heart.png',
  './img/suit-club.png',
  './img/suit-diamond.png',
  './img/suit-spade.png',
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

  // Never intercept cross-origin requests (Firebase, Stripe, Google APIs, etc.) —
  // only this game's own same-origin files go through the cache. This also avoids
  // ever touching the Firestore/Functions SDK's own network traffic.
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        // clone IMMEDIATELY, synchronously — cloning later (e.g. inside the
        // caches.open().then() below) can throw "Response body is already
        // used" once the original response starts being consumed.
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        return response;
      });
    })
  );
});
