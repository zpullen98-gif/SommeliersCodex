/**
 * THE HOUSE'S VIDEOS IN THE CODEX: LINKS OUT, NEVER A PLAYER (codex30).
 *
 * Loads the SHIPPED chain with codex30 on top of the SHIPPED engine and the
 * shipped Brennan's pack, over a Map storage, once as shipped and once with
 * four videos put on the pack here (one on the Berres Riesling, one about the
 * house itself on a dish, one through a lexicon term that reaches the Berres,
 * one with a link the engine refuses), and asks:
 *
 *   1. the engine drops the refused link; three videos stand
 *   2. the study view carries Videos (3) at its foot: the topics in order,
 *      the house's own first, each a closed disclosure; every title a link
 *      to a video host in a new tab with rel noopener; the words say a video
 *      needs a connection; a wine opens its card in place and a dish is a
 *      link into the Table on the suite's path
 *   3. the Berres card carries Watch after the service note and before In
 *      this app: its own video first, then the one through its term, each
 *      with the channel and the length; a wine no video names carries none
 *   4. nothing anywhere embeds or plays: no iframe, no video element, no
 *      autoplay, and nothing is fetched when a block is drawn
 *   5. the rules here are the engine's (videosFor, videoGroups, videoUrlOk),
 *      and a link that slipped past an older engine is never drawn
 *   6. the shipped pack, with no videos, draws neither block
 *   7. no OOT at all: the chain loads and draws nothing
 *   8. codex30's own words pass voiceProblems; the file is var and function
 *      only, dash free, below U+2190 and names nobody; sw.js lists it,
 *      index.html loads it after codex29 and before boot, and the gates that
 *      load the chain carry it
 *
 *   node .scripts/check-videos.js [jsDir]
 *   OOT_SHARED=<dir holding oot-house.js>   default ../worldtable/static/shared
 *
 * Exits non-zero on any failure.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const JS = process.argv.slice(2).find((a) => a.charAt(0) !== '-')
  || path.join(__dirname, '..', 'js');
const SHARED = process.env.OOT_SHARED
  || path.join(__dirname, '..', '..', 'worldtable', 'static', 'shared');
const ENGINE = path.join(SHARED, 'oot-house.js');
const UI_FILE = path.join(SHARED, 'oot-house-ui.js');
const PACK_FILE = path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
for (const f of [ENGINE, UI_FILE, PACK_FILE]) {
  if (!fs.existsSync(f)) {
    console.error('check-videos: no ' + path.basename(f) + ' at ' + SHARED + ' (set OOT_SHARED)');
    process.exit(1);
  }
}
if (!fs.existsSync(path.join(JS, 'codex30.js'))) {
  console.log('check-videos: no codex30.js in ' + JS + ', SKIPPED');
  process.exit(0);
}

const OPTIONAL = new Set(['codex13.js', 'data-firstpath.js', 'codex29.js', 'codex30.js']);
const FILES = ['data-questions.js', 'reference.js', 'core.js', 'codex2.js', 'codex3.js',
  'codex4.js', 'codex5.js', 'data-primers.js', 'codex6.js', 'data-intro.js',
  'data-primers-intro.js', 'data-grapes-plus.js', 'data-tasting.js', 'data-floor.js',
  'data-pairing.js', 'data-maps.js', 'data-advanced.js', 'data-primers-advanced.js',
  'data-master.js', 'data-primers-master.js', 'codex7.js', 'codex8.js', 'codex9.js',
  'codex10.js', 'codex11.js', 'codex12.js', 'data-firstpath.js', 'codex13.js', 'codex14.js',
  'codex15.js', 'data-producers.js', 'menu-desk.js', 'wine-rows.js', 'codex16.js',
  'codex17.js', 'codex18.js', 'codex19.js', 'codex20.js', 'codex21.js', 'codex22.js',
  'codex23.js', 'codex24.js', 'codex25.js', 'codex26.js', 'codex27.js', 'codex28.js', 'codex29.js', 'codex30.js', 'boot.js'];

const NOW = Date.parse('2026-10-03T14:02:00.000Z');
function seeded(start) {
  let s = start || 12345;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x80000000; };
}

let passed = 0, failed = 0;
function check(what, ok, detail) {
  if (ok) { passed++; console.log('  ok    ' + what); }
  else { failed++; console.log('  FAIL  ' + what + (detail ? '  :: ' + detail : '')); }
}
function section(name) { console.log(''); console.log('--- ' + name + ' ---'); }

/* check-home's keep-set, word for word, as check-house holds it */
const NUMERAL_RE = /\bLevel\s+(I|II|III|IV)\b/;
function voiceProblems(s) {
  const out = [];
  if (s.indexOf(String.fromCharCode(0x2014)) >= 0) out.push('a long dash (U+2014)');
  if (/\x20-{2}\x20/.test(s)) out.push('a double hyphen');
  if (/practi[cs]e/i.test(s)) out.push('the retired word for study');
  if (NUMERAL_RE.test(s)) out.push('a level numeral: ' + s.match(NUMERAL_RE)[0]);
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if ((c >= 0x2190 && c <= 0x2BFF) || (c >= 0x1F000) || c === 0xFE0F || (c >= 0xE000 && c <= 0xF8FF)) {
      out.push('a glyph U+' + c.toString(16).toUpperCase());
      break;
    }
  }
  return out;
}

/* check-house's sandbox: one stub node, a Map-backed localStorage, a window
   that records its listeners, and a history that records what is pushed. */
function makeSandbox(seed, opts) {
  const o = opts || {};
  const store = Object.create(null);
  Object.keys(seed || {}).forEach((k) => { store[k] = seed[k]; });
  let NODE;
  const stubEl = () => NODE;
  NODE = {
    style: {}, dataset: {}, value: '', checked: false, disabled: false, hidden: false, files: null,
    classList: { add() { }, remove() { }, contains: () => false, toggle() { } },
    children: [], childNodes: [],
    appendChild: (c) => c, insertBefore: (c) => c, removeChild: (c) => c, remove() { },
    setAttribute() { }, getAttribute: () => null, removeAttribute() { },
    addEventListener() { }, removeEventListener() { }, dispatchEvent: () => true,
    focus() { }, blur() { }, click() { }, scrollIntoView() { },
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 }),
    querySelector: () => NODE, querySelectorAll: () => [],
    closest: () => NODE, contains: () => false, cloneNode: () => NODE,
    get parentNode() { return NODE; }, get parentElement() { return NODE; },
    get firstChild() { return null; }, get firstElementChild() { return NODE; },
    get lastChild() { return null; }, get nextSibling() { return null; },
    get innerHTML() { return ''; }, set innerHTML(v) { },
    get textContent() { return ''; }, set textContent(v) { },
    get innerText() { return ''; }, set innerText(v) { },
  };
  const listeners = { storage: [], popstate: [] };
  const hist = { pushed: [], replaced: [], backs: 0 };
  const scrolls = [];
  const sandbox = {
    console,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    },
    navigator: { userAgent: 'node', onLine: true },
    setTimeout, clearTimeout, setInterval, clearInterval,
    matchMedia: () => ({ matches: false, addEventListener() { }, addListener() { } }),
    requestAnimationFrame: (f) => setTimeout(f, 0),
    alert() { }, confirm: () => false, prompt: () => null,
    fetch: () => Promise.reject(new Error('no network in this harness')),
    scrollTo(x, y) { scrolls.push(y); }, scrollBy() { }, getComputedStyle: () => ({ getPropertyValue: () => '' }),
    innerWidth: 390, innerHeight: 844, devicePixelRatio: 1, scrollY: 0,
    addEventListener(type, fn) { if (listeners[type]) listeners[type].push(fn); },
    removeEventListener() { },
    history: {
      pushState(s) { hist.pushed.push(s); }, replaceState(s, t, u) { hist.replaced.push({ s, u }); }, back() { hist.backs++; },
    },
    speechSynthesis: undefined, Notification: undefined,
    performance: { now: () => 0 },
    URL: globalThis.URL, Blob: globalThis.Blob, TextEncoder: globalThis.TextEncoder,
    Intl: globalThis.Intl, Date: globalThis.Date, Math: globalThis.Math, JSON: globalThis.JSON,
    Promise: globalThis.Promise, Map: globalThis.Map, Set: globalThis.Set,
  };
  if (!o.noLocation) sandbox.location = o.location || { href: 'http://localhost/', search: '', hash: '' };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.document = {
    documentElement: stubEl(), head: stubEl(), body: stubEl(),
    createElement: stubEl, createDocumentFragment: stubEl, createTextNode: () => stubEl(),
    getElementById: stubEl, querySelector: stubEl, querySelectorAll: () => [],
    addEventListener() { }, removeEventListener() { },
    readyState: 'complete', title: '',
    get activeElement() { return null; },
    get head() { return stubEl(); }, get body() { return stubEl(); },
  };
  const ctx = vm.createContext(sandbox);
  const G = (expr) => vm.runInContext(expr, ctx);
  return { sandbox, ctx, G, store, listeners, hist, scrolls };
}

function loadChain(H) {
  for (const f of FILES) {
    const p = path.join(JS, f);
    if (!fs.existsSync(p)) {
      if (OPTIONAL.has(f)) continue;
      console.error('missing ' + f + ' in ' + JS);
      process.exit(1);
    }
    try { vm.runInContext(fs.readFileSync(p, 'utf8'), H.ctx, { filename: f }); }
    catch (e) {
      console.error('FAILED to load ' + f + ': ' + e.message);
      console.error(String(e.stack).split('\n').slice(0, 6).join('\n'));
      process.exit(1);
    }
  }
}

const tick = (ms) => new Promise((r) => setTimeout(r, ms || 10));
const packText = fs.readFileSync(PACK_FILE, 'utf8');
const packJson = JSON.parse(packText);
const house = packJson.house;

/* A device as the wing's shell boots it: the engine and its screens, then the
   chain, with fetch answering the one same-origin pack. */
function bootDevice(opts) {
  const o = opts || {};
  const servedText = o.packText || packText;
  const D = makeSandbox(o.seed || {}, o);
  vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), D.ctx, { filename: 'oot-house.js' });
  vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), D.ctx, { filename: 'oot-house-ui.js' });
  const lib = D.G('OOT.houseLib');
  D.sandbox.OOT.house = lib.createHouseApi(lib.mapStorage(new Map()), { win: D.sandbox, now: () => NOW, rand: seeded(21), from: 'codex' });
  D.sandbox.fetch = (url) => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(servedText) });
  loadChain(D);
  return D;
}
async function settle(D) {
  await D.G('V27_LAST');
  await D.G('V27_BOOT_PACK');
  await tick(30);
  await D.G('V27_WRITING');
  await tick(20);
}
const ROOT = path.join(__dirname, '..');
const wineId = (re) => (house.wines.find((w) => re.test(w.name)) || {}).id;

/* The shipped pack with four videos on it, the case this layer is for. */
function videoPackText() {
  const p = JSON.parse(packText);
  const h = p.house;
  const berres = wineId(/Berres/);
  const dish = h.dishes[0];
  const term = h.lexicon.find((t) => t.itemIds.indexOf(berres) >= 0);
  h.videos = [
    { id: 'v-berres01', url: 'https://www.youtube.com/watch?v=aaaaaaaaaaa', title: 'Mosel Riesling, Slate and Sugar', channel: 'A Wine Channel', mins: 9, topic: 'German Riesling', why: 'Why the slate and the sugar read the way they do, so the Kabinett question has an answer.', itemIds: [berres], termIds: [], house: false, checkedOn: '2026-10-04', ts: 1 },
    { id: 'v-houseone', url: 'https://youtu.be/bbbbbbbbbbb', title: 'Inside the House', channel: 'A Press Channel', mins: 0, topic: 'The house', why: 'The room and its story, the one a first visit asks for.', itemIds: [dish.id], termIds: [], house: true, checkedOn: '2026-10-04', ts: 1 },
    { id: 'v-termone1', url: 'https://vimeo.com/123456', title: 'A Word on the List', channel: 'A Teaching Channel', mins: 3.4, topic: 'German Riesling', why: 'The word on the label, said the way the floor says it.', itemIds: [], termIds: term ? [term.id] : [], house: false, checkedOn: '2026-10-04', ts: 1 },
    { id: 'v-badlink1', url: 'http://www.youtube.com/watch?v=ccccccccccc', title: 'Not Secure', channel: 'Nobody', mins: 1, topic: 'German Riesling', why: 'Dropped by the engine.', itemIds: [berres], termIds: [], house: false, checkedOn: '2026-10-04', ts: 1 }
  ];
  return { text: JSON.stringify(p), term, dish };
}

const PLAYER = /<iframe|<video[\s>]|autoplay/i;

async function main() {
  const BERRES = wineId(/Berres/);
  const vp = videoPackText();
  check('the pack holds a lexicon term that reaches the Berres (' + (vp.term ? vp.term.term : 'none') + ')', !!vp.term);

  /* ================================================================ */
  section('the study view, with videos');
  const D = bootDevice({ packText: vp.text, location: { href: 'http://localhost/codex/', pathname: '/codex/', search: '', hash: '' } });
  await settle(D);
  const G = D.G;
  check('the engine dropped the refused link; three videos stand', G('JSON.stringify(v28House().videos.map(function (v) { return v.id; }))') === JSON.stringify(['v-berres01', 'v-houseone', 'v-termone1']));
  let fetched = 0;
  D.sandbox.fetch = () => { fetched++; return Promise.reject(new Error('nothing is fetched here')); };
  const study = G('v28StudyHtml()');
  check('Videos (3) at the foot of the study view', study.indexOf('<h3 class="secgroup" id="v30-videos-h">Videos (3)</h3>') >= 0
    && study.indexOf('id="v30-videos-h"') > study.indexOf('id="v28-rows"'));
  check('the words say a video opens in a new tab and needs a connection', study.indexOf('Each video opens on YouTube or Vimeo in a new tab, and needs a connection.') >= 0);
  const topics = [...study.matchAll(/<details class="v28-q v30-topic"><summary>([^<]+) \((\d+)\)<\/summary>/g)].map((m) => m[1] + ' ' + m[2]);
  check('the topics in order, the house\'s own first, each a closed disclosure (' + topics.join(', ') + ')', JSON.stringify(topics) === JSON.stringify(['The house 1', 'German Riesling 2']) && study.indexOf('v30-topic" open') < 0);
  const links = [...study.matchAll(/<a class="v28-link v30-title" href="([^"]+)" target="_blank" rel="noopener">/g)].map((m) => m[1]);
  check('every title a link to a video host in a new tab with rel noopener', JSON.stringify(links) === JSON.stringify(['https://youtu.be/bbbbbbbbbbb', 'https://www.youtube.com/watch?v=aaaaaaaaaaa', 'https://vimeo.com/123456']));
  check('the refused link is nowhere', study.indexOf('ccccccccccc') < 0);
  check('a wine a video teaches opens its card in place', study.indexOf('<button type="button" class="v28-link v30-open" data-v28="open" data-id="' + BERRES + '">') >= 0);
  check('a dish is a link into the Table on the suite\'s path', study.indexOf('href="/table/menu#' + vp.dish.id + '"') >= 0);
  check('the channel and the length, rounded, the length left out when unknown', study.indexOf('<span class="v30-meta">A Teaching Channel, 3 min</span>') >= 0 && study.indexOf('<span class="v30-meta">A Press Channel</span>') >= 0);
  check('no player: no iframe, no video element, no autoplay', !PLAYER.test(study));

  /* ================================================================ */
  section('the cards');
  G('V28_QUOTE = function (s) { return v28Esc(s); }');
  const berres = G('v28CardHtml(' + JSON.stringify(BERRES) + ')');
  check('the Berres card carries Watch', berres.indexOf('<h3 class="secgroup" id="v30-watch-h">Watch</h3>') >= 0);
  const onCard = [...berres.matchAll(/<li class="v30-video" data-video="([^"]+)">/g)].map((m) => m[1]);
  check('its own video first, then the one through its term (' + onCard.join(', ') + ')', JSON.stringify(onCard) === JSON.stringify(['v-berres01', 'v-termone1']));
  check('with the channel and the length', berres.indexOf('<span class="v30-meta">A Wine Channel, 9 min</span>') >= 0);
  check('a screen reader hears that it opens a new tab', berres.indexOf('<span class="sr-only"> (opens in a new tab)</span>') >= 0);
  const note = berres.indexOf('Your words. Allergens: confirm at lineup.');
  const watch = berres.indexOf('id="v30-watch-h"');
  const here = berres.indexOf('>' + G('v28W("here")') + '</h3>');
  check('Watch sits after the service note and before In this app', note > 0 && watch > note && (here < 0 || watch < here));
  check('no player on the card', !PLAYER.test(berres));
  const other = house.wines.find((w) => w.id !== BERRES && vp.term.itemIds.indexOf(w.id) < 0);
  check('a wine no video names carries no Watch block (' + other.name + ')', G('v28CardHtml(' + JSON.stringify(other.id) + ')').indexOf('v30-watch') < 0);
  check('nothing was fetched to draw a block', fetched === 0);

  /* ================================================================ */
  section('the rules are the engine\'s');
  check('videosFor here and in the engine agree on every wine', G('v28House().wines.every(function (w) { return JSON.stringify(v30ForLocal(v28House(), w.id).map(function (v) { return v.id; })) === JSON.stringify(OOT.houseLib.videosFor(v28House(), w.id).map(function (v) { return v.id; })); })') === true);
  check('videoGroups here and in the engine agree', G('JSON.stringify(v30GroupsLocal(v28House())) === JSON.stringify(OOT.houseLib.videoGroups(v28House()))') === true);
  const LINKS = ['https://www.youtube.com/watch?v=x', 'https://m.youtube.com/x', 'https://youtu.be/x', 'https://player.vimeo.com/video/1', 'http://www.youtube.com/x', 'https://youtube.com.example.org/x', 'https://user@youtube.com/x', 'https://www.youtube.com:8080/x', 'javascript:alert(1)', ''];
  check('the link rule here is the engine\'s', G(JSON.stringify(LINKS) + '.map(v30UrlOk).join()') === G(JSON.stringify(LINKS) + '.map(OOT.houseLib.videoUrlOk).join()'));
  check('a link that slipped past an older engine is never drawn', G('(function () { var h = JSON.parse(JSON.stringify(v28House())); h.videos.push({ id: "v-sneaked1", url: "javascript:alert(1)", title: "Sneaked", channel: "", mins: 0, topic: "", why: "", itemIds: [' + JSON.stringify(BERRES) + '], termIds: [], house: false, checkedOn: "", ts: 1 }); return v30WatchHtml(h, ' + JSON.stringify(BERRES) + ').indexOf("sneaked") < 0 && v30VideosHtml(h).indexOf("javascript") < 0; })()') === true);

  /* ================================================================ */
  section('the shipped pack, with its videos and with them taken out');
  const shipped = JSON.parse(packText);
  const shippedVideos = (shipped.house && shipped.house.videos) || [];
  const P = bootDevice({ location: { href: 'http://localhost/codex/', pathname: '/codex/', search: '', hash: '' } });
  await settle(P);
  check('the house holds the pack\'s ' + shippedVideos.length + ' videos', P.G('(v28House().videos || []).length') === shippedVideos.length);
  if (shippedVideos.length) {
    const pStudy = P.G('v28StudyHtml()');
    const pLinks = [...pStudy.matchAll(/<a class="v28-link v30-title" href="([^"]+)" target="_blank" rel="noopener">/g)].map((m) => m[1]);
    check('the Videos entry links every shipped video out, each in a new tab', pLinks.length === shippedVideos.length && shippedVideos.every((v) => pLinks.indexOf(v.url) >= 0), pLinks.length + ' of ' + shippedVideos.length);
    check('no player in the shipped study view', !PLAYER.test(pStudy));
    const reach = P.G('OOT.houseLib.videosFor(v28House(), ' + JSON.stringify(BERRES) + ').length');
    check('the Berres card shows Watch exactly when a shipped video reaches it (' + reach + ')', (P.G('v28CardHtml(' + JSON.stringify(BERRES) + ')').indexOf('v30-watch') >= 0) === (reach > 0));
    check('every shipped title and channel passes voiceProblems', shippedVideos.every((v) => voiceProblems(v.title + ' ' + v.channel + ' ' + v.why).length === 0), JSON.stringify(shippedVideos.map((v) => voiceProblems(v.title + ' ' + v.channel + ' ' + v.why)).filter((x) => x.length)));
  }
  delete shipped.house.videos;
  const B = bootDevice({ packText: JSON.stringify(shipped), location: { href: 'http://localhost/codex/', pathname: '/codex/', search: '', hash: '' } });
  await settle(B);
  check('with the list taken out, the house holds no videos', B.G('v28House().videos') === undefined);
  check('and neither block is drawn', B.G('v28StudyHtml()').indexOf('v30-') < 0 && B.G('v28CardHtml(' + JSON.stringify(BERRES) + ')').indexOf('v30-') < 0);

  /* ================================================================ */
  section('no OOT at all');
  const N = makeSandbox({}, {});
  loadChain(N);
  check('the chain loads with no OOT and codex30 on top', N.G('typeof OOT') === 'undefined' && N.G('typeof v30VideosHtml') === 'function');
  check('nothing is drawn with no house', N.G('v30VideosHtml(null)') === '' && N.G('v30WatchHtml(null, "w-aaaaaaaa")') === '');

  /* ================================================================ */
  section('voice, the file and the shell');
  const words = G('JSON.stringify(V30_WORDS)');
  const bad = Object.entries(JSON.parse(words)).map(([k, v]) => [k, voiceProblems(v)]).filter((x) => x[1].length);
  check('every word codex30 writes passes voiceProblems', bad.length === 0, JSON.stringify(bad));
  const blocks = [study.slice(study.indexOf('id="v30-videos-h"')), berres.slice(watch, berres.indexOf('</section>', watch))];
  const strip = (s) => s.replace(/<[^>]+>/g, ' ');
  check('the drawn blocks pass voiceProblems (the test titles are plain)', blocks.every((b) => voiceProblems(strip(b)).length === 0));
  const src = fs.readFileSync(path.join(JS, 'codex30.js'), 'utf8');
  check('codex30.js: no long dash, no en dash, no double hyphen, nothing at or above U+2190', ![...src].some((ch) => ch.codePointAt(0) === 0x2013 || ch.codePointAt(0) === 0x2014 || ch.codePointAt(0) >= 0x2190) && !/\x20-{2}\x20/.test(src));
  check('codex30.js declares with var and function only, no arrow', !/^\s*(let|const|class)\s/m.test(src) && src.indexOf('=>') < 0);
  check('codex30.js names nobody', !/Lizzy/.test(src));
  check('codex30.js embeds nothing', !PLAYER.test(src.replace(/\/\*[\s\S]*?\*\//g, '')));
  if (fs.existsSync(path.join(ROOT, 'sw.js')) && fs.existsSync(path.join(ROOT, 'index.html'))) {
    const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
    const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    check('sw.js lists codex30.js in ASSETS', sw.indexOf("'./js/codex30.js'") > 0);
    const scripts = [...index.matchAll(/<script src="js\/([^"?]+)\?v=\d+"><\/script>/g)].map((m) => m[1]);
    const expected = ['codex29.js', 'codex30.js', 'data-atlas-v2.js', 'atlas-cache.js', 'codex31.js', 'codex32.js', 'data-teaching-images.js', 'teaching-cache.js', 'codex33.js', 'codex34.js', 'codex35.js', 'boot.js'];
    const at = scripts.indexOf('codex29.js');
    check('index.html preserves codex29, codex30, atlas data/cache/UI, the consolidation, then boot in exact order', at >= 0 &&
      JSON.stringify(scripts.slice(at, at + expected.length)) === JSON.stringify(expected) &&
      expected.every((file) => scripts.filter((name) => name === file).length === 1));
  }
  ['check-home.js', 'check-house.js', 'check-merge.js', 'check-study.js', 'check-winelist.js'].forEach((f) => {
    const p = path.join(__dirname, f);
    if (fs.existsSync(p)) check(f + ' loads codex30.js in its chain', fs.readFileSync(p, 'utf8').indexOf("'codex30.js'") > 0);
  });

  console.log('');
  if (failed) {
    console.log('check-videos: ' + failed + ' of ' + (passed + failed) + ' checks FAILED');
    process.exit(1);
  }
  console.log('check-videos: all ' + passed + ' checks pass');
  process.exit(0);
}

process.on('beforeExit', () => {
  console.error('check-videos: the run ended before its summary (a case never settled)');
  process.exit(1);
});

main().catch((e) => {
  console.error('check-videos: ' + (e && e.stack ? e.stack : e));
  process.exit(1);
});
