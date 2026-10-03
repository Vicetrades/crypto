// Minimal service worker — just enough to satisfy Android/Chrome installability.
// This app needs live network access (Binance) to function, so we don't cache
// or serve offline data; we simply pass every request straight to the network.
const CACHE = 'signals-shell-v1';
const SHELL = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(()=>{}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Only handle same-origin app-shell files from cache; everything else (Binance, fonts, CDN) goes to the network.
  const url = new URL(e.request.url);
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
  // else: let the browser handle it normally (not intercepted)
});
