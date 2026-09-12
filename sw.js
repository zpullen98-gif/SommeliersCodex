/* The Sommelier's Codex — service worker.
   Bump CACHE on every deploy; that string is the whole update mechanism. */
const CACHE = 'codex-v65';

/* The world maps (maps/*.jpg) are deliberately NOT in ASSETS above.

   That list is installed in one atomic addAll: one missing or slow image and
   the worker never installs, and the reader keeps a stale app or none at all.
   The maps are also large, and everything in ASSETS is re-downloaded in full
   on every CACHE bump.

   So they live here instead, in a cache of their own that the page fills only
   when the reader asks for it. THE NAME HAS NO HYPHEN AFTER "codex" ON
   PURPOSE: activate below deletes every cache matching our own prefix, and a
   cache called codex-maps-v1 would be swept away on the first deploy after
   somebody stored nine megabytes of maps. */
const MAPS = 'codexmaps-v1';

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
  './js/data-tasting.js',
  './js/data-floor.js',
  './js/data-pairing.js',
  './js/data-maps.js',
  './js/data-advanced.js',
  './js/data-primers-advanced.js',
  './js/data-master.js',
  './js/data-primers-master.js',
  './js/codex7.js',
  './js/codex8.js',
  './js/codex9.js',
  './js/codex10.js',
  './js/codex11.js',
  './js/codex12.js',
  './js/codex13.js',
  './js/codex14.js',
  './js/codex15.js',
  './js/data-producers.js',
  './js/wine-parse.js',
  './js/wine-rows.js',
  './js/codex16.js',
  './js/codex17.js',
  './js/codex18.js',
  './js/codex19.js',
  './js/codex20.js',
  './js/codex21.js',
  './js/codex22.js',
  './js/codex23.js',
  './js/rewrite-preview.js',
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
      /* Cache Storage is per-ORIGIN, not per-scope. On zpullen98-gif.github.io every
         project page can see every other project's caches, so deleting everything
         that is not ours would wipe the offline shells of The Bartender's Ledger,
         First Light and Calendar For Life. Only ever reap our own prefix. */
      .then(keys => Promise.all(
        keys.filter(k => k.startsWith('codex-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()));
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  /* Served out of the maps cache, never out of CACHE, so a deploy cannot
     throw away what the reader chose to keep. Falling through to the network
     covers a map that is present on the server and not yet stored. */
  if (url.pathname.indexOf('/maps/') >= 0) {
    e.respondWith(caches.open(MAPS).then(c =>
      c.match(e.request).then(hit => hit || fetch(e.request))));
    return;
  }
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
