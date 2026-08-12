/* The Sommelier's Codex — service worker.
   Bump CACHE on every deploy; that string is the whole update mechanism. */
const CACHE = 'codex-v33';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/codex.css',
  './js/data-questions.js',
  './js/reference.js',
  './js/core.js',
  './js/codex2.js',
  './js/codex3.js',
  './js/codex4.js',
  './js/codex5.js',
  './js/data-primers.js',
  './js/codex6.js',
  './js/data-intro.js',
  './js/data-primers-intro.js',
  './js/data-grapes-plus.js',
  './js/data-advanced.js',
  './js/data-primers-advanced.js',
  './js/data-master.js',
  './js/data-primers-master.js',
  './js/codex7.js',
  './js/codex8.js',
  './js/codex9.js',
  './js/codex10.js',
  './js/codex11.js',
  './js/boot.js',
  './fonts/cinzel-normal-400-900-latin.woff2',
  './fonts/cinzel-normal-400-900-latin-ext.woff2',
  './fonts/cinzeldecorative-normal-700-latin.woff2',
  './fonts/cinzeldecorative-normal-700-latin-ext.woff2',
  './fonts/cinzeldecorative-normal-900-latin.woff2',
  './fonts/cinzeldecorative-normal-900-latin-ext.woff2',
  './fonts/ebgaramond-normal-400-800-latin.woff2',
  './fonts/ebgaramond-normal-400-800-latin-ext.woff2',
  './fonts/ebgaramond-italic-400-800-latin.woff2',
  './fonts/ebgaramond-italic-400-800-latin-ext.woff2',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  /* cache:'reload' bypasses the HTTP cache so a new SW never precaches stale copies */
  e.waitUntil(caches.open(CACHE).then(c =>
    c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()));
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit || fetch(e.request).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
    ).catch(err => {
      /* offline fallback only makes sense for page navigations — returning
         HTML for a failed font/script request would corrupt the cache story */
      if (e.request.mode === 'navigate') return caches.match('./index.html');
      throw err;
    })
  );
});
