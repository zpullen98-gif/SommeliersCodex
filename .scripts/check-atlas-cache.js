/* Behavioural offline tests, without a browser or any network request.
   node .scripts/check-atlas-cache.js [Codex root]
   Runs the shipped cache layer and workers with an in-memory Cache API. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ROOT = path.resolve(process.argv[2] || path.join(__dirname, '..'));
let checks = 0;
function check(label, value) { assert.ok(value, label); checks++; }
const svg = () => new Response('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M0 0L10 10"/></svg>', { headers: { 'content-type': 'image/svg+xml; charset=utf-8' } });
function storage() {
  const tables = new Map();
  const key = (request) => typeof request === 'string' ? request : request.url;
  const caches = {
    async keys() { return [...tables.keys()]; },
    async delete(name) { return tables.delete(name); },
    async open(name) {
      if (!tables.has(name)) tables.set(name, new Map());
      const table = tables.get(name);
      return {
        async match(request) { return table.get(key(request))?.clone(); },
        async put(request, response) { table.set(key(request), response.clone()); },
        async delete(request) { return table.delete(key(request)); },
        async keys() { return [...table.keys()].map((url) => new Request(url)); }
      };
    },
    async match(request) {
      for (const table of tables.values()) if (table.has(key(request))) return table.get(key(request)).clone();
    }
  };
  return { caches, tables };
}
function page(url, store = storage(), network = async () => svg()) {
  const requests = [], events = [];
  const context = vm.createContext({
    URL, Request, Response, AbortController, Promise, setTimeout, clearTimeout, atob,
    location: new URL(url), caches: store.caches,
    fetch: (request, options) => { requests.push({ request, options }); return network(request, options); },
    window: { dispatchEvent(event) { events.push(event.type); } },
    CustomEvent: class { constructor(type) { this.type = type; } },
    ST: Object.freeze({ progress: 'untouched' })
  });
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/data-maps.js'), 'utf8'), context);
  const old = fs.readFileSync(path.join(ROOT, 'js/codex23.js'), 'utf8');
  vm.runInContext(old.slice(0, old.indexOf('function v23Open')), context);
  context.ATLAS_V2 = { version: '3', sheets: Object.fromEntries(context.MAP_SHEETS.map((s) => [s.id, { file: 'maps/atlas-v3/' + s.id + '.svg' }])) };
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/atlas-cache.js'), 'utf8'), context);
  return { c: context, requests, events, store };
}
async function keep(cache, url, response = svg()) { await (await cache.caches.open(url[0])).put(url[1], response); }
function worker(url, store) {
  const listeners = {}, requests = [];
  const loc = new URL(url);
  const context = vm.createContext({
    URL, Request, Response, Promise, AbortController, setTimeout, clearTimeout, location: loc, caches: store.caches,
    fetch: async (request) => { requests.push(request.url); return svg(); },
    self: { location: loc, clients: { claim: async () => {} }, addEventListener: (type, fn) => { listeners[type] = fn; } }
  });
  context.importScripts = (...files) => files.forEach((file) => vm.runInContext(fs.readFileSync(path.join(ROOT, file.split('?')[0]), 'utf8'), context));
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), context);
  return { context, listeners, requests };
}
async function responseFrom(w, url) {
  let response;
  w.listeners.fetch({ request: new Request(url), respondWith(value) { response = value; } });
  return response && await response;
}
(async () => {
  const shared = storage();
  const standalone = page('https://example.test/SommeliersCodex/index.html', shared);
  const wing = page('https://example.test/codex/', shared);
  check('all seventeen maps visible before network/cache work', standalone.c.V23.have.length === 17);
  await standalone.c.v23Probe();
  check('cold offline probe retains the full inventory without HEAD/GET requests', standalone.requests.length === 0 && standalone.c.V23.have.length === 17);
  check('installation cache names differ on the same origin', standalone.c.ATLAS_CACHE_NAME !== wing.c.ATLAS_CACHE_NAME);
  check('map caches survive both shell reap prefixes', !standalone.c.ATLAS_CACHE_NAME.startsWith('codex-') && !standalone.c.ATLAS_CACHE_NAME.startsWith('oot-codex-'));
  check('new edition has a different installation cache from atlas v2', standalone.c.ATLAS_CACHE_NAME !== standalone.c.ATLAS_PREVIOUS_CACHE && standalone.c.ATLAS_CACHE_NAME.startsWith('codexmaps-v3-'));
  await keep(shared, ['codexmaps-v1', 'https://example.test/SommeliersCodex/maps/france.jpg'], new Response('old source', { headers: { 'content-type': 'image/jpeg' } }));
  await keep(shared, ['codexmaps-v1', 'https://example.test/codex/maps/france.jpg'], new Response('old wing', { headers: { 'content-type': 'image/jpeg' } }));
  const oldSourceUrl = 'https://example.test/SommeliersCodex/maps/atlas-v2/france.svg';
  const oldWingUrl = 'https://example.test/codex/maps/atlas-v2/france.svg';
  await keep(shared, [standalone.c.ATLAS_PREVIOUS_CACHE, oldSourceUrl]);
  await keep(shared, [standalone.c.ATLAS_PREVIOUS_CACHE, oldWingUrl]);
  await keep(shared, [wing.c.ATLAS_PREVIOUS_CACHE, oldWingUrl]);
  await standalone.c.v23Probe();
  check('old JPG and v2 SVG never count as current edition saves', Object.keys(standalone.c.V23.stored).length === 0);
  check('old edition is recognised for explicit removal without new saves', standalone.c.V23.olderStored);
  const button = { disabled: false }, messages = [];
  await standalone.c.v23StoreAll(button, (s) => messages.push(s));
  check('all current maps save and the operation settles', Object.keys(standalone.c.V23.stored).length === 17 && !button.disabled && !standalone.c.V23.busy);
  check('manual save fetches each map once', standalone.requests.length === 17);
  check('requests refuse redirects and other origins', standalone.requests.every((r) => r.options.redirect === 'error' && r.options.mode === 'same-origin' && r.request.startsWith('https://example.test/SommeliersCodex/maps/atlas-v3/')));
  check('progress and final status survive without rerendering', messages.some((s) => s.includes('Saving 1 of 17')) && /All 17 maps/.test(standalone.c.V23.lastMessage));
  check('upgrade never removes original saved maps', shared.tables.get('codexmaps-v1').size === 2);
  check('upgrade retains v2 maps without overwriting their bytes', shared.tables.get(standalone.c.ATLAS_PREVIOUS_CACHE).size === 2 && shared.tables.get(wing.c.ATLAS_PREVIOUS_CACHE).size === 1);
  check('other installation cannot claim these saved maps', Object.keys(await wing.c.v23ReadStored()).length === 0);
  await wing.c.v23StoreAll({ disabled: false }, () => {});
  await standalone.c.v23Forget(button, () => {});
  check('removal clears only this installation current cache', !shared.tables.has(standalone.c.ATLAS_CACHE_NAME) && shared.tables.get(wing.c.ATLAS_CACHE_NAME).size === 17);
  check('legacy removal uses exact own URLs only', shared.tables.get('codexmaps-v1').size === 1 && shared.tables.get('codexmaps-v1').has('https://example.test/codex/maps/france.jpg'));
  check('v2 removal deletes only own exact URLs even in a mispopulated cache', !shared.tables.get(standalone.c.ATLAS_PREVIOUS_CACHE).has(oldSourceUrl) && shared.tables.get(standalone.c.ATLAS_PREVIOUS_CACHE).has(oldWingUrl) && shared.tables.get(wing.c.ATLAS_PREVIOUS_CACHE).has(oldWingUrl));
  await standalone.c.v23Probe();
  check('other installation archive cannot enable removal or claim a saved edition', !standalone.c.V23.olderStored);
  check('removed maps remain discoverable', standalone.c.V23.have.length === 17 && Object.keys(standalone.c.V23.stored).length === 0);
  check('cache work leaves study records unchanged', standalone.c.ST.progress === 'untouched');

  const attempts = {}, partial = page('https://example.test/codex/', storage(), async (url) => {
    const id = url.split('/').pop().replace('.svg', ''); attempts[id] = (attempts[id] || 0) + 1;
    if (id === 'spain' || (id === 'germany' && attempts[id] === 1)) throw new Error('offline');
    return svg();
  });
  await partial.c.v23StoreAll(button, () => {});
  check('failed downloads retry once', attempts.spain === 2 && attempts.germany === 2);
  check('partial save retains successful maps and honest counts', Object.keys(partial.c.V23.stored).length === 16 && /16 of 17/.test(partial.c.V23.lastMessage) && /1 could not/.test(partial.c.V23.lastMessage));
  partial.c.fetch = async () => svg();
  await partial.c.v23StoreAll(button, () => {});
  check('retry completes a partial collection', Object.keys(partial.c.V23.stored).length === 17 && /All 17/.test(partial.c.V23.lastMessage));
  const cached = await partial.store.caches.open(partial.c.ATLAS_CACHE_NAME);
  await cached.put(partial.c.atlasCacheUrl('france') + '?old=1', svg());
  await cached.delete(partial.c.atlasCacheUrl('france'));
  check('query variants cannot count as the exact current file', !(await partial.c.v23ReadStored()).france);
  await cached.put(partial.c.atlasCacheUrl('france'), new Response('<html>fallback</html>', { headers: { 'content-type': 'text/html' } }));
  check('HTML fallback cache entry cannot count as a saved map', !(await partial.c.v23ReadStored()).france);

  for (const [label, res] of [
    ['HTML with 200', new Response('<html>fallback</html>', { headers: { 'content-type': 'text/html' } })],
    ['HTML with a forged SVG MIME', new Response('<html>fallback</html>', { headers: { 'content-type': 'image/svg+xml' } })],
    ['SVG script', new Response('<svg><script>alert(1)</script></svg>', { headers: { 'content-type': 'image/svg+xml' } })],
    ['SVG external resource', new Response('<svg><image href="https://unlisted.example/image"/></svg>', { headers: { 'content-type': 'image/svg+xml' } })],
    ['SVG relative external resource', new Response('<svg><image href="other.svg"/></svg>', { headers: { 'content-type': 'image/svg+xml' } })],
    ['SVG imported stylesheet', new Response('<svg><style>@import "other.css";</style></svg>', { headers: { 'content-type': 'image/svg+xml' } })],
    ['SVG external entity', new Response('<!DOCTYPE svg [<!ENTITY external SYSTEM "other.svg">]><svg>&external;</svg>', { headers: { 'content-type': 'image/svg+xml' } })],
    ['failed response', new Response('missing', { status: 404, headers: { 'content-type': 'image/svg+xml' } })]
  ]) { await assert.rejects(partial.c.atlasCacheValidate(res)); checks++; }
  await partial.c.atlasCacheValidate(new Response('<svg><defs><linearGradient id="gold"/></defs><path fill="url(#gold)"/><use href="#gold"/></svg>', { headers: { 'content-type': 'image/svg+xml' } })); checks++;
  const embedded = 'data:image/webp;base64,' + Buffer.from('RIFF0000WEBPVP8 decorative fixture').toString('base64');
  const frame = (size) => {
    const bytes = Buffer.alloc(size); bytes.write('RIFF'); bytes.writeUInt32LE(size - 8, 4); bytes.write('WEBPVP8 ', 8);
    return 'data:image/webp;base64,' + bytes.toString('base64');
  };
  const embeddedResponse = (value, twice = false) => new Response('<svg><image href="' + value + '"/>' + (twice ? '<image href="' + value + '"/>' : '') + '</svg>', { headers: { 'content-type': 'image/svg+xml' } });
  await partial.c.atlasCacheValidate(embeddedResponse(embedded)); checks++;
  await partial.c.atlasCacheValidate(embeddedResponse(frame(320 * 1024))); checks++;
  for (const response of [
    embeddedResponse(embedded, true),
    embeddedResponse('data:image/webp;base64,' + Buffer.from('<html>not WebP</html>').toString('base64')),
    embeddedResponse(embedded.replace('image/webp', 'image/svg+xml')),
    embeddedResponse(frame(320 * 1024 + 1))
  ]) { await assert.rejects(partial.c.atlasCacheValidate(response)); checks++; }
  partial.c.ATLAS_V2.sheets.france.file = 'https://unlisted.example/map.svg';
  await assert.rejects(partial.c.atlasCacheFetch('france')); checks++;
  partial.c.ATLAS_V2.sheets.france.file = 'maps/atlas-v2/france.svg';
  check('a stale file path cannot be admitted into the new collection', partial.c.atlasCacheUrl('france') === null);
  partial.c.ATLAS_V2.sheets.france.file = 'maps/atlas-v3/france.svg';
  partial.c.ATLAS_V2.version = '2';
  check('a stale manifest cannot claim the new edition', partial.c.atlasCacheUrl('france') === null);
  partial.c.ATLAS_V2.version = '3';
  check('unknown map id has no fetchable URL', partial.c.atlasCacheUrl('not-registered') === null);
  const stalled = page('https://example.test/codex/', storage(), () => new Promise(() => {}));
  stalled.c.ATLAS_FETCH_TIMEOUT_MS = 5;
  await assert.rejects(stalled.c.atlasCacheFetch('france'), /timed out/); checks++;
  check('timeout aborts the request', stalled.requests[0].options.signal.aborted);
  const unavailable = page('https://example.test/codex/');
  unavailable.c.caches = undefined;
  await unavailable.c.v23Probe(); await unavailable.c.v23StoreAll(button, () => {});
  check('unavailable Cache API does not hide lessons or claim a save', unavailable.c.V23.have.length === 17 && /not available/.test(unavailable.c.V23.lastMessage));

  const workerSource = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const shellName = workerSource.match(/const CACHE\s*=\s*['"]((?:oot-)?codex-v\d+)['"]/);
  assert.ok(shellName, 'worker declares the expected standalone or wing cache name');
  const installPath = shellName[1].startsWith('oot-codex-') ? '/codex/' : '/SommeliersCodex/';
  const own = page('https://example.test' + installPath, shared);
  const sw = worker('https://example.test' + installPath + 'sw.js', shared);
  check('worker and page derive the identical installation cache', vm.runInContext('MAPS', sw.context) === own.c.ATLAS_CACHE_NAME);
  check('worker and page agree on the preceding edition archive', vm.runInContext('PREVIOUS_MAPS', sw.context) === own.c.ATLAS_PREVIOUS_CACHE);
  const previousUrl = 'https://example.test' + installPath + 'maps/atlas-v2/france.svg';
  await keep(shared, [own.c.ATLAS_PREVIOUS_CACHE, previousUrl], new Response('previous edition', { headers: { 'content-type': 'image/svg+xml' } }));
  check('worker serves an exact v2 map from its old cache to an older tab', await (await responseFrom(sw, previousUrl)).text() === 'previous edition' && sw.requests.length === 0);
  await (await shared.caches.open(own.c.ATLAS_CACHE_NAME)).delete(own.c.atlasCacheUrl('france'));
  await responseFrom(sw, own.c.atlasCacheUrl('france'));
  check('v2 cache cannot satisfy a v3 map request', sw.requests.length === 1 && sw.requests[0] === own.c.atlasCacheUrl('france'));
  sw.requests.length = 0;
  await keep(shared, [own.c.ATLAS_CACHE_NAME, own.c.atlasCacheUrl('france')]);
  await responseFrom(sw, own.c.atlasCacheUrl('france'));
  check('worker serves a current saved map without network', sw.requests.length === 0);
  const oldUrl = 'https://example.test' + installPath + 'maps/france.jpg';
  await keep(shared, ['codexmaps-v1', oldUrl], new Response('original picture', { headers: { 'content-type': 'image/jpeg' } }));
  check('worker still serves an exact original JPG', await (await responseFrom(sw, oldUrl)).text() === 'original picture');
  const ownShell = vm.runInContext('CACHE', sw.context);
  await shared.caches.open(ownShell); await shared.caches.open(ownShell.replace(/\d+$/, '1'));
  let activation;
  sw.listeners.activate({ waitUntil(promise) { activation = promise; } }); await activation;
  check('shell activation preserves current maps and both legacy archives', shared.tables.has(own.c.ATLAS_CACHE_NAME) && shared.tables.has(own.c.ATLAS_PREVIOUS_CACHE) && shared.tables.has('codexmaps-v1'));
  check('shell activation removes only its prior shell', shared.tables.has(ownShell) && !shared.tables.has(ownShell.replace(/\d+$/, '1')));
  console.log('check-atlas-cache: all ' + checks + ' checks pass (' + ROOT + ')');
})().catch((error) => { console.error(error); process.exitCode = 1; });
