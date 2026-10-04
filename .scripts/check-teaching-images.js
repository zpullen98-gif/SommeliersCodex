/* node .scripts/check-teaching-images.js [Codex root] [--require-art]
   Actual policy/worker in a no-network VM. Rendering is checked separately. */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), crypto = require('node:crypto');
const assert = require('node:assert/strict');
const ROOT = path.resolve(process.argv.slice(2).find(x => !x.startsWith('--')) || path.join(__dirname, '..'));
const REQUIRE_ART = process.argv.includes('--require-art');
let checks = 0;
const check = (name, result) => { assert.ok(result, name); checks++; };
function storage() {
  const tables = new Map(), key = x => typeof x === 'string' ? x : x.url;
  return { tables, async keys() { return [...tables.keys()]; }, async delete(n) { return tables.delete(n); }, async open(n) {
    if (!tables.has(n)) tables.set(n, new Map());
    const t = tables.get(n);
    return { async keys() { return [...t.keys()].map(u => new Request(u)); }, async match(r) { return t.get(key(r))?.clone(); }, async delete(r) { return t.delete(key(r)); }, async put(r, s) { t.set(key(r), s.clone()); } };
  } };
}
function webp(size = 24) {
  const b = Buffer.alloc(size); b.write('RIFF'); b.writeUInt32LE(size - 8, 4); b.write('WEBPVP8 ', 8);
  return new Response(b, { headers: { 'Content-Type': 'image/webp' } });
}
function device(base = 'https://example.test/codex/sw.js', cache = storage()) {
  const requests = [], handlers = {};
  const context = vm.createContext({ URL, Request, Response, AbortController, setTimeout, clearTimeout, Uint8Array, DataView,
    location: new URL(base), caches: cache,
    fetch: async (u, options) => { requests.push({ url: typeof u === 'string' ? u : u.url, options }); return webp(); },
    self: { location: new URL(base), clients: { claim: async () => {} }, addEventListener: (name, fn) => { handlers[name] = fn; } }
  });
  context.importScripts = (...files) => files.forEach(file => vm.runInContext(fs.readFileSync(path.join(ROOT, file.split('?')[0]), 'utf8'), context));
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'), context);
  return { c: context, cache, requests, handlers, base, api: context.CodexTeachingCache };
}
async function ask(d, relative) {
  let answer;
  d.handlers.fetch({ request: new Request(new URL(relative, d.base)), respondWith(p) { answer = p; } });
  return answer && await answer;
}
(async () => {
  const d = device(), items = d.api.entries();
  check('six reviewed teaching guides with unique ids', items.length === 6 && new Set(items.map(x => x.id)).size === 6);
  for (const item of items) {
    check(item.id + ': complete accessible metadata', d.api.entry(item.id) && item.alt.length > 60 && item.caption.length > 60 && item.key.every(x => x.length === 2 && x.every(Boolean)));
    check(item.id + ': primary source links', item.sources.every(x => /^https:\/\/(?:www\.)?(?:christies.com|wsetglobal.com|awri.com.au|inspection.canada.ca|plantgrape.fr|wineaustralia.com|bourgogne-wines.com|verallia.com|champagne.fr|wset-uat-integr8.azurewebsites.net)\//.test(x.url)));
    const asset = path.join(ROOT, item.file);
    if (REQUIRE_ART) check(item.id + ': release art exists', fs.existsSync(asset));
    if (fs.existsSync(asset)) {
      const bytes = fs.readFileSync(asset);
      await d.api.validate(new Response(bytes, { headers: { 'Content-Type': 'image/webp' } })); checks++;
      check(item.id + ': within image budget', bytes.length <= d.api.maxBytes);
      check(item.id + ': delivered bytes and checksum match', bytes.length === item.bytes && crypto.createHash('sha256').update(bytes).digest('hex') === item.sha256);
    }
    if (item.thumb) {
      check(item.id + ': thumbnail has matching aspect ratio', item.thumb.width < item.width && item.thumb.width * item.height === item.thumb.height * item.width);
      const thumbPath = path.join(ROOT, item.thumb.file);
      if (REQUIRE_ART) check(item.id + ': release thumbnail exists', fs.existsSync(thumbPath));
      if (fs.existsSync(thumbPath)) {
        const bytes = fs.readFileSync(thumbPath);
        await d.api.validate(new Response(bytes, { headers: { 'Content-Type': 'image/webp' } })); checks++;
        check(item.id + ': thumbnail bytes match and stay bounded', bytes.length === item.thumb.bytes && bytes.length <= d.api.maxBytes);
      }
    }
  }
  check('ullage guide gives all six named levels', items[0].key.length === 6);
  check('heat clue guide explicitly refuses diagnosis from appearance', /appearance alone cannot/i.test(items[1].caption));
  check('particles guide distinguishes TCA', /do not mean.*TCA/i.test(items[2].key[2][1]));
  const colour = d.api.entry('grid-colour-rim'), bottles = d.api.entry('bottle-shapes'), pinot = d.api.entry('pinot-noir');
  check('colour key describes seven observations, never a grape or age diagnosis', colour.key.length === 7 && /cannot prove grape variety or age/.test(colour.note));
  check('bottle guide has four shapes and no fixed punt-depth claim', bottles.key.length === 4 && /not fixed by bottle shape/.test(bottles.note) && /does not tell you.*quality/.test(bottles.note));
  check('portrait reading is unnumbered and acknowledges variable leaves', pinot.numbered === false && /unlobed or have three or five lobes/.test(pinot.key[1][1]));
  check('nested grape image is an exact approved asset', d.api.match(new URL(pinot.file, d.base).href, d.base) === pinot && !d.api.match(new URL(pinot.file + '?other=1', d.base).href, d.base));
  const assets = vm.runInContext('ASSETS', d.c);
  check('pictures are not in atomic precache', !assets.some(x => /assets\/teach\/|atlas-zoom-v/.test(x)));
  check('text, UI and policy are precached', ['data-teaching-images', 'teaching-cache', 'codex33', 'codex34'].every(x => assets.includes('./js/' + x + '.js')));
  const first = items[0], url = new URL(first.file, d.base).href;
  await ask(d, first.file);
  const teach = d.api.cacheName('teach', d.base);
  check('a viewed approved image goes only to teaching cache', d.cache.tables.size === 1 && d.cache.tables.get(teach).has(url));
  d.c.fetch = async () => { throw new Error('offline'); };
  check('viewed teaching image opens offline', (await ask(d, first.file)).ok);
  const requestCount = d.requests.length;
  check('cache hit did not request network', requestCount === 1);
  await (await d.cache.open(teach)).put(url, new Response('<html>corrupt cached body</html>', {headers:{'content-type':'image/webp'}}));
  await assert.rejects(ask(d, first.file), /offline/); checks++;
  check('corrupt cached body is removed', !d.cache.tables.get(teach).has(url));
  d.c.fetch = async () => webp(); await ask(d, first.file);
  d.c.fetch = async () => { throw new Error('offline'); };
  await assert.rejects(ask(d, items[1].file), /offline/); checks++;
  d.c.fetch = async u => { d.requests.push({url: typeof u === 'string' ? u : u.url}); return webp(); };
  await ask(d, first.file + '?unknown=1'); await ask(d, 'assets/teach/unregistered-v1.webp');
  check('unregistered and query paths never grow any cache', d.cache.tables.size === 1 && d.cache.tables.get(teach).size === 1);
  const sample = JSON.parse(JSON.stringify(first)); sample.id = 'zoom-fixture'; sample.kind = 'zoom'; sample.file = 'maps/atlas-zoom-v1/fixture.webp';
  items.push(sample);
  await ask(d, sample.file);
  const zoom = d.api.cacheName('zoom', d.base);
  check('zoom imagery gets separate collection before broad maps rule', d.cache.tables.has(zoom) && !d.cache.tables.has(vm.runInContext('MAPS', d.c)));
  check('map requests still use original exact map policy', !d.api.owns(new URL('maps/atlas-v2/france.svg', d.base).href, d.base));
  const other = device('https://example.test/SommeliersCodex/sw.js', d.cache);
  other.c.fetch = async () => { throw new Error('other installation offline'); };
  // The public worker deliberately yields an out-of-wing URL to the browser.
  // Exercise the shared policy directly to prove no sibling installation hit.
  await assert.rejects(other.api.respond(new Request(new URL(first.file, other.base)), other.base), /other installation/); checks++;
  check('installation caches are distinct', other.api.cacheName('teach', other.base) !== teach);
  check('teaching namespaces cannot capture another installation', !d.api.owns(new URL(first.file, other.base).href, d.base));
  check('teaching cache names survive both shell prefixes', !/^(?:oot-)?codex-/.test(teach) && !/^(?:oot-)?codex-/.test(zoom));
  const filling = [];
  for (let i=0;i<55;i++) {
    const fixture = {...first, id:'bounded-'+i, file:'assets/teach/bounded-'+i+'-v1.webp'};
    items.push(fixture); filling.push(ask(d, fixture.file));
  }
  await Promise.all(filling);
  check('concurrent requests respect the 48-file bound', d.cache.tables.get(teach).size === 48);
  check('oldest viewed files are evicted first', !d.cache.tables.get(teach).has(url));
  check('teaching eviction leaves zoom collection intact', d.cache.tables.get(zoom).size === 1);
  for (const response of [
    new Response('<html>not an image</html>', {headers:{'content-type':'text/html'}}),
    new Response('<html>not an image</html>', {headers:{'content-type':'image/webp'}}),
    new Response('missing', {status:404,headers:{'content-type':'image/webp'}}),
    new Response(await webp().arrayBuffer(), {status:206,headers:{'content-type':'image/webp'}}),
    webp(d.api.maxBytes + 1),
    new Response('short', {headers:{'content-type':'image/webp','content-length':String(d.api.maxBytes+1)}})
  ]) { await assert.rejects(d.api.validate(response)); checks++; }
  const forged = webp(); Object.defineProperty(forged, 'redirected', {value:true});
  await assert.rejects(d.api.validate(forged)); checks++;
  // A unavailable cache must not break the online image itself.
  const noCache = device(); noCache.c.caches = {open: async () => {throw new Error('unavailable');}};
  check('cache unavailable still displays online image', (await ask(noCache, first.file)).ok);
  check('known download forbids redirects and uses abort signal', noCache.requests[0].options.redirect === 'error' && noCache.requests[0].options.signal);
  const stalled = device(); let signal;
  stalled.c.fetch = (_, options) => {signal = options.signal; return new Promise(() => {});};
  stalled.c.setTimeout = fn => setTimeout(fn, 5);
  await assert.rejects(ask(stalled, first.file), /timed out/); checks++;
  check('timeout aborts the in-flight response', signal.aborted);
  const empty = device(); empty.c.CODEX_TEACHING_IMAGES.entries = [];
  check('empty manifest supplies no figure data or fetch', !empty.api.entry(first.id) && empty.requests.length === 0);
  // Run the actual image helper with a tiny DOM to hold offline-rendition
  // selection and bounded fallback independent of a browser's lazy timings.
  const ui = device(), uiEvents = {}, notes = [];
  function node(tag) {
    const attrs = {}, events = {};
    return {tagName:tag.toUpperCase(), style:{}, hidden:false, complete:false, naturalWidth:0,
      get src() {return attrs.src || '';}, set src(value) {attrs.src=new URL(value,ui.base).href;this.currentSrc=attrs.src;},
      getAttribute(k) {return attrs[k] || null;}, setAttribute(k,v) {attrs[k]=String(v);}, removeAttribute(k) {delete attrs[k];},
      addEventListener(k,fn) {events[k]=fn;}, fire(k) {if(events[k])events[k]({target:this});},
      querySelector() {return null;}, appendChild(n) {notes.push(n);return n;}};
  }
  Object.assign(ui.c,{document:{createElement:node,querySelectorAll:()=>[]},window:{addEventListener:(k,f)=>{uiEvents[k]=f;}},
    navigator:{onLine:false},primerView:()=>{},tasteGridView:()=>{},cellarView:()=>{}});
  vm.runInContext(fs.readFileSync(path.join(ROOT,'js/codex33.js'),'utf8'),ui.c);
  const item=ui.api.entries()[0], thumbUrl=new URL(item.thumb.file,ui.base).href, fullUrl=new URL(item.file,ui.base).href;
  const uiCache=await ui.cache.open(ui.api.cacheName('teach',ui.base)); await uiCache.put(thumbUrl,webp());
  let picture=ui.c.v33Image(item,true); await new Promise(setImmediate);
  check('offline viewer chooses saved thumbnail before requesting an absent full image',picture.src===thumbUrl&&ui.requests.length===0);
  await uiCache.delete(thumbUrl); await uiCache.put(fullUrl,webp());
  picture=ui.c.v33Image(item,false); await new Promise(setImmediate);
  check('offline inline image uses saved full image when thumbnail is absent',picture.src===fullUrl&&ui.requests.length===0);
  ui.c.navigator.onLine=true; picture=ui.c.v33Image(item,true);ui.c.v33ImageFallback(picture,node('div'));
  picture.fire('error');check('failed full rendition retries the approved thumbnail once',picture.src===thumbUrl&&!picture.hidden);
  picture.fire('error');check('both missing renditions stop retrying and retain the written fallback',picture.hidden&&notes.some(n=>/reading guide is below/.test(n.textContent||'')));
  console.log('check-teaching-images: all ' + checks + ' checks pass');
})().catch(error => {console.error(error);process.exitCode=1;});
