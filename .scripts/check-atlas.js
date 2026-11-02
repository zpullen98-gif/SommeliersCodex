/**
 * THE WINE ATLAS TAB AND MORE'S LIBRARY, HELD TO THEIR DESIGN (codex55, 2 November 2026).
 *
 * The owner asked for the Library tab to move into More, for the Wine Atlas to come back to the bar, and for every
 * region to carry its maps, its knowledge and the districts within it. codex55 reassigns the bar, moves the owners
 * and the parents, puts The Library at the head of More, takes the atlas out of the Library and draws the Wine
 * Atlas root, the region page and the country page from what the Codex already holds. This loads the SHIPPED chain
 * index.html loads (through codex55), with the shared house engine and the pack, in check-card's loader
 * (check-brennans's VM: a history that is a real stack, a location that follows it), its fetch answering
 * js/regions/<sheet>.json from the tree so codex39's own loader reads the regions as the app does. It asserts:
 *
 *   1. the load: codex55 runs, its words and its builders defined
 *   2. the bar: V25_NAV and the drawn bar read Home, the house, CMS, Grapes, Wine Atlas and More in that order,
 *      without codex47's class, the due pill on More alone; the Wine Atlas and More taps push their roots from
 *      elsewhere and add no entry on the root itself
 *   3. the owners and the parents: the six atlas views owned and lit Wine Atlas; no view left with Library; the
 *      Library, the bank, Practise, Quizzes, a deck and the Workshop lit More; a region's deck and drill lit Wine
 *      Atlas; the house's, the CMS and the grape decks keep their words; the cold parents of every atlas view,
 *      the Library, the bank and a region's decks
 *   4. More: its first group is The Library, three rows to the Library's sections in order, each opening the
 *      Library; More's groups follow
 *   5. the Library without the atlas: no atlas section, no chip to it, no World Map row, its line true
 *   6. the root: worldMapView draws the hub; the five chips; the seventeen sheet doors in the order of the maps;
 *      every country once, as a chip and as a group; every region once, under its own country, in codex39's
 *      order, its line the district count and the field map's count; the hub's own loading reads every sheet's
 *      reading; a sheet's address still draws codex31's sheet
 *   7. five regions (Burgundy, Champagne, Napa and Sonoma, Rioja, Mosel) through codex39's region view: the
 *      inline map is codex45's figure for the slug, its door to the field map screen; The districts holds every
 *      place of the reading (as often as the reading names it) and every place of the map exactly once, each
 *      map place's mark at the point the artwork draws its dot, so no name is lost from either source; codex39's
 *      The places folded in, its sections kept; the order map, districts, reading, In the Codex, the doors;
 *      every In the Codex door resolving and opening its screen
 *   8. the country pages: France and Italy with their sheet inline and every region as a row with its count,
 *      codex39's list replaced, every row's door resolving; Canada with its field map inline; Eastern Europe
 *      with its chooser of eight
 *   9. the field map screen keeps its Read in depth door to the region page
 *  10. voice and the file: V55_WORDS and every page drawn here through check-producers-house's voiceProblems,
 *      the strictest (the tab word Practise excepted; the readings' and the maps' own fields are the data's,
 *      drawn as written, so a mark at or above U+2190 in them is theirs); codex55.js free of every dash, naming
 *      nobody, shipping no key and no model name, declaring with var and function only, every wrapper typeof
 *      guarded; this gate carries no dash
 *  11. the shell and the chain rule: index.html loads codex55.js once with ?v=, after codex54.js and before
 *      boot.js; sw.js is codex-v114 or later and lists it after codex54.js; every list in a gate here that
 *      names codex54.js names codex55.js straight after it
 *
 *   node .scripts/check-atlas.js [jsDir]
 *
 * jsDir defaults to this repo's js/; the site's check-wings may pass the wing's codex/js. Needs the shared engine
 * (OOT_SHARED, else ../worldtable/static/shared) and the pack (OOT_HOUSE_PACK, else the pack beside the engine).
 * A tree with no codex55.js is SKIPPED. Exits non-zero if any check fails. The last line is the verdict.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ARGS = process.argv.slice(2);
const JS = path.resolve(ARGS.find((a) => a.charAt(0) !== '-') || path.join(__dirname, '..', 'js'));
const ROOT = path.join(JS, '..');
const SHARED = process.env.OOT_SHARED || path.join(__dirname, '..', '..', 'worldtable', 'static', 'shared');
const ENGINE = path.join(SHARED, 'oot-house.js');
const UI_FILE = path.join(SHARED, 'oot-house-ui.js');
const PACK_FILE = process.env.OOT_HOUSE_PACK || path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
for (const f of [ENGINE, UI_FILE, PACK_FILE]) {
  if (!fs.existsSync(f)) { console.error('check-atlas: no ' + path.basename(f) + ' at ' + path.dirname(f) + ' (set OOT_SHARED or OOT_HOUSE_PACK)'); process.exit(1); }
}
if (!fs.existsSync(path.join(JS, 'codex55.js'))) {
  console.log('check-atlas: no codex55.js in ' + JS + ', SKIPPED');
  process.exit(0);
}
const CH = require(path.join(__dirname, 'cms', 'chain.cjs'));
const NOW = Date.parse('2026-10-03T14:02:00.000Z');

let passed = 0, failed = 0;
function check(what, ok, detail) {
  if (ok) { passed++; console.log('  ok    ' + what); }
  else { failed++; console.log('  FAIL  ' + what + (detail ? '  :: ' + String(detail).slice(0, 700) : '')); }
}
function section(name) { console.log(''); console.log('--- ' + name + ' ---'); }
function seeded(start) {
  let s = start || 12345;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x80000000; };
}
const tick = (ms) => new Promise((r) => setTimeout(r, ms || 10));

/* check-producers-house.js's voiceProblems, the strictest, as check-card carries it */
const NUMERAL_RE = /\bLevel\s+(I|II|III|IV)\b/;
function voiceProblems(s) {
  const out = [];
  if (s.indexOf(String.fromCharCode(0x2014)) >= 0) out.push('a long dash (U+2014)');
  if (s.indexOf(String.fromCharCode(0x2013)) >= 0) out.push('an en dash (U+2013)');
  if (/&(mdash|ndash|#8212|#8211|#x2014|#x2013);/i.test(s)) out.push('a dash entity');
  if (/\x20-{2}\x20/.test(s)) out.push('a double hyphen');
  if (/practi[cs]e/i.test(s.replace(/(^|[^\w])Practise(?!\w)/g, '$1'))) out.push('the retired word for study');
  if (NUMERAL_RE.test(s)) out.push('a level numeral: ' + s.match(NUMERAL_RE)[0]);
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c >= 0x2190) { out.push('a mark U+' + c.toString(16).toUpperCase()); break; }
  }
  return out;
}
const unesc = (s) => String(s || '').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
/* what a page shows: its text and the words its controls carry */
function shown(html) {
  const said = [...String(html || '').matchAll(/\b(?:aria-label|placeholder|title)="([^"]*)"/g)].map((m) => m[1]);
  return unesc(String(html || '').replace(/<[^>]+>/g, ' ') + ' ' + said.join(' ')).replace(/\s+/g, ' ');
}

/* ---------------- check-card's loader: the sandbox, the engine, the chain ---------------- */
function makeSandbox() {
  const store = Object.create(null);
  store.codexLevel = 'certified';
  const sess = Object.create(null);
  let NODE;
  const stubEl = () => NODE;
  NODE = {
    style: {}, dataset: {}, value: '', checked: false, disabled: false, hidden: false, files: null,
    classList: { add() { }, remove() { }, contains: () => false, toggle() { } },
    children: [], childNodes: [],
    appendChild: (c) => c, insertBefore: (c) => c, removeChild: (c) => c, remove() { }, replaceChildren() { },
    /* the one addition to check-card's stub: the node methods the Library's earlier passes call (codex45's after) */
    after() { }, before() { }, prepend() { }, append() { },
    setAttribute() { }, getAttribute: () => null, removeAttribute() { }, hasAttribute: () => false,
    addEventListener() { }, removeEventListener() { }, dispatchEvent: () => true,
    focus() { }, blur() { }, click() { }, scrollIntoView() { },
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 }),
    getClientRects: () => [],
    querySelector: () => NODE, querySelectorAll: () => [],
    closest: () => NODE, contains: () => false, cloneNode: () => NODE, matches: () => false,
    get parentNode() { return NODE; }, get parentElement() { return NODE; },
    get firstChild() { return null; }, get firstElementChild() { return NODE; },
    get lastChild() { return null; }, get nextSibling() { return null; }, get nextElementSibling() { return null; },
    get innerHTML() { return ''; }, set innerHTML(v) { },
    get textContent() { return ''; }, set textContent(v) { },
    get innerText() { return ''; }, set innerText(v) { }
  };
  const listeners = { popstate: [], storage: [], pageshow: [] };
  const origin = 'http://localhost';
  const loc = { origin, pathname: '/codex/', search: '', hash: '', href: origin + '/codex/' };
  const setUrl = (u) => {
    const m = /^([^?#]*)(\?[^#]*)?(#.*)?$/.exec(u || '');
    if (m[1]) loc.pathname = m[1];
    loc.search = m[2] || '';
    loc.hash = m[3] || '';
    loc.href = origin + loc.pathname + loc.search + loc.hash;
  };
  const H = { entries: [{ state: null, url: '/codex/' }], idx: 0 };
  const history = {
    get state() { return H.entries[H.idx].state; },
    get length() { return H.entries.length; },
    scrollRestoration: 'auto',
    pushState(s, t, u) {
      H.entries = H.entries.slice(0, H.idx + 1);
      H.entries.push({ state: s == null ? null : JSON.parse(JSON.stringify(s)), url: u == null ? H.entries[H.idx].url : u });
      H.idx++;
      if (u != null) setUrl(u);
    },
    replaceState(s, t, u) {
      H.entries[H.idx] = { state: s == null ? null : JSON.parse(JSON.stringify(s)), url: u == null ? H.entries[H.idx].url : u };
      if (u != null) setUrl(u);
    },
    back() { }, forward() { }, go() { }
  };
  const sandbox = {
    console: { log() { }, warn() { }, error() { }, info() { } },
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      key: (i) => Object.keys(store)[i] || null,
      get length() { return Object.keys(store).length; }
    },
    sessionStorage: {
      getItem: (k) => (k in sess ? sess[k] : null),
      setItem: (k, v) => { sess[k] = String(v); },
      removeItem: (k) => { delete sess[k]; }
    },
    navigator: { userAgent: 'node', onLine: true },
    setTimeout, clearTimeout, setInterval, clearInterval,
    matchMedia: () => ({ matches: false, addEventListener() { }, addListener() { } }),
    requestAnimationFrame: (f) => setTimeout(f, 0),
    alert() { }, confirm: () => false, prompt: () => null,
    fetch: () => Promise.reject(new Error('no network in this harness')),
    scrollTo() { }, scrollBy() { }, getComputedStyle: () => ({ getPropertyValue: () => '' }),
    innerWidth: 390, innerHeight: 844, devicePixelRatio: 1, scrollY: 0, pageYOffset: 0,
    addEventListener(type, fn) { if (listeners[type]) listeners[type].push(fn); },
    removeEventListener(type, fn) { if (listeners[type]) listeners[type] = listeners[type].filter((f) => f !== fn); },
    location: loc, history,
    speechSynthesis: undefined, Notification: undefined, IntersectionObserver: undefined,
    performance: { now: () => 0 },
    URL: globalThis.URL, URLSearchParams: globalThis.URLSearchParams, Blob: globalThis.Blob, TextEncoder: globalThis.TextEncoder,
    Intl: globalThis.Intl, Date: globalThis.Date, Math: globalThis.Math, JSON: globalThis.JSON,
    Promise: globalThis.Promise, Map: globalThis.Map, Set: globalThis.Set
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.document = {
    documentElement: stubEl(),
    createElement: stubEl, createDocumentFragment: stubEl, createTextNode: () => stubEl(),
    getElementById: stubEl, querySelector: stubEl, querySelectorAll: () => [],
    addEventListener() { }, removeEventListener() { },
    readyState: 'complete', title: '', referrer: '', hidden: false,
    get activeElement() { return null; },
    get head() { return stubEl(); }, get body() { return stubEl(); }
  };
  const ctx = vm.createContext(sandbox);
  const G = (expr) => vm.runInContext(expr, ctx);
  return { sandbox, ctx, G, store, H };
}

const FILES = CH.chainFiles(JS);
const packText = fs.readFileSync(PACK_FILE, 'utf8');
const fetches = [];
async function bootDevice() {
  const D = makeSandbox();
  vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), D.ctx, { filename: 'oot-house.js' });
  vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), D.ctx, { filename: 'oot-house-ui.js' });
  const lib = D.G('OOT.houseLib');
  D.sandbox.OOT.house = lib.createHouseApi(lib.mapStorage(new Map()), { win: D.sandbox, now: () => NOW, rand: seeded(21), from: 'codex' });
  /* the pack for the house; a region's reading from the repo, as the app fetches it */
  D.sandbox.fetch = (url) => {
    const u = String(url || '');
    const m = /^js\/regions\/([a-z0-9-]+)\.json/.exec(u);
    if (m) {
      fetches.push(m[1]);
      const f = path.join(JS, 'regions', m[1] + '.json');
      if (!fs.existsSync(f)) return Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error('none')) });
      const body = fs.readFileSync(f, 'utf8');
      return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(body), json: () => Promise.resolve(JSON.parse(body)) });
    }
    return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(packText), json: () => Promise.resolve(JSON.parse(packText)) });
  };
  for (const f of FILES) {
    try { vm.runInContext(fs.readFileSync(path.join(JS, f), 'utf8'), D.ctx, { filename: f }); }
    catch (e) { console.error('check-atlas: js/' + f + ' failed to load: ' + e.message); process.exit(1); }
  }
  try { await D.G('typeof V27_LAST !== "undefined" ? V27_LAST : null'); } catch (e) { }
  try { await D.G('typeof V27_BOOT_PACK !== "undefined" ? V27_BOOT_PACK : null'); } catch (e) { }
  await tick(30);
  try { await D.G('typeof V27_WRITING !== "undefined" ? V27_WRITING : null'); } catch (e) { }
  await tick(30);
  /* a page's string, captured where codex39 builds it */
  D.page = (prep) => String(D.G('(function () { var got = ""; var was = v39Build; v39Build = function (h, a) { got = String(h || ""); return was(h, a); }; try { ' + prep + ' } finally { v39Build = was; } return got; })()') || '');
  return D;
}

/* the regions as the repo holds them */
const REC = {};
for (const f of fs.readdirSync(path.join(JS, 'regions'))) {
  if (!/\.json$/.test(f) || f === 'techniques.json') continue;
  Object.assign(REC, JSON.parse(fs.readFileSync(path.join(JS, 'regions', f), 'utf8')).records || {});
}
const fold = (s) => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
function treeNames(list, out) { (list || []).forEach((p) => { if (p && typeof p.name === 'string' && p.name.trim()) { out.push(p.name.trim()); treeNames(p.places, out); } }); return out; }
function countOf(arr) { const o = {}; arr.forEach((x) => { o[x] = (o[x] || 0) + 1; }); return o; }
const attr = (html, re) => [...String(html).matchAll(re)].map((m) => unesc(m[1]));

async function main() {
  const A = await bootDevice();
  console.log('check-atlas: ' + FILES.length + ' scripts from ' + path.join(ROOT, 'index.html') + ', codex55 at ' + (FILES.indexOf('codex55.js') + 1));
  const drawn = [];

  /* ================================================================ */
  section('1. the load');
  check('the chain index.html loads holds codex55.js straight after codex54.js', FILES.indexOf('codex55.js') === FILES.indexOf('codex54.js') + 1, FILES.slice(-4).join(' '));
  check('codex55 ran: V55_WORDS, v55W, the hub, the region and country builders and the join are defined',
    A.G('typeof V55_WORDS === "object" && typeof v55W === "function" && typeof v55HubHtml === "function" && typeof v55RegionHtml === "function" && typeof v55CountryHtml === "function" && typeof v55Join === "function"'));
  check('the style element is written by the layer, id v55-style', fs.readFileSync(path.join(JS, 'codex55.js'), 'utf8').indexOf("css.id = 'v55-style'") > 0);

  /* ================================================================ */
  section('2. the bar');
  const nav = A.G('JSON.stringify(V25_NAV)');
  const want = JSON.stringify([['home', 'Home'], ['brennans', A.G('v41TabWord()')], ['cms', 'CMS'], ['grapes', 'Grapes'], ['worldmap', 'Wine Atlas'], ['more', 'More']]);
  check('V25_NAV reads Home, the house, CMS, Grapes, Wine Atlas and More', nav === want, nav);
  A.G('S.view = "home"; S.wmap = null;');
  const bar = A.G('v25NavHtml()');
  const keys = attr(bar, /data-nav="([^"]*)"/g);
  const due = A.G('v32DueToday().total');
  const pills = (bar.match(/class="v32pill"/g) || []).length;
  const onMore = /<button[^>]*data-nav="more"[^>]*>More <span class="v32pill">/.test(bar);
  check('the drawn bar: six words in order, Wine Atlas the word of worldmap', keys.join(',') === 'home,brennans,cms,grapes,worldmap,more' && />Wine Atlas</.test(bar), keys.join(','));
  check('the drawn bar carries no v47nav class', bar.indexOf('v47nav') < 0);
  check('the due pill rides on More alone (' + due + ' due)', due ? (pills === 1 && onMore) : pills === 0, bar.slice(-300));
  const tap = A.G('(function () { v32Go({ view: "home" }, "push"); var n0 = history.length; v25Nav("worldmap"); var a = { view: S.view, wmap: S.wmap, hash: location.hash, n: history.length - n0 }; v25Nav("worldmap"); a.again = history.length - n0; v32Go({ view: "worldmap", arg: "france" }, "push"); var n1 = history.length; v25Nav("worldmap"); a.fromSheet = { view: S.view, wmap: S.wmap, n: history.length - n1 }; var n2 = history.length; v25Nav("more"); a.more = { view: S.view, n: history.length - n2 }; v25Nav("more"); a.moreAgain = history.length - n2; return JSON.stringify(a); })()');
  const T = JSON.parse(tap);
  check('Wine Atlas from Home pushes the root (#/v/worldmap); on the root it adds no entry', T.view === 'worldmap' && !T.wmap && T.hash === '#/v/worldmap' && T.n === 1 && T.again === 1, tap);
  check('Wine Atlas from a sheet pushes the root', T.fromSheet.view === 'worldmap' && !T.fromSheet.wmap && T.fromSheet.n === 1, tap);
  check('More pushes More; on More it adds no entry', T.more.view === 'more' && T.more.n === 1 && T.moreAgain === 1, tap);

  /* ================================================================ */
  section('3. the owners and the parents');
  const ATLAS = ['worldmap', 'regions', 'country', 'region', 'fieldatlas', 'fieldmap'];
  const own = JSON.parse(A.G('JSON.stringify({ o: V32_OWNER, u: V25_UNDER, h: V25_HUB, a: V25_AREA, p: V32_PARENT })'));
  check('the six atlas views are owned by worldmap in V32_OWNER, V25_UNDER and V25_HUB', ATLAS.every((k) => own.o[k] === 'worldmap' && own.u[k] === 'worldmap' && own.h[k] === 'worldmap'), JSON.stringify(ATLAS.map((k) => [k, own.o[k], own.u[k], own.h[k]])));
  const left = ['o', 'u', 'h', 'a'].map((t) => Object.keys(own[t]).filter((k) => own[t][k] === 'library').map((k) => t + '.' + k)).flat();
  check('no view and no door is left with library', left.length === 0, left.join(' '));
  check('V25_AREA.worldmap is worldmap', own.a.worldmap === 'worldmap');
  check('the parents: the root under Home, the regions and the field atlas under the root, the Library under More', own.p.worldmap === 'home' && own.p.regions === 'worldmap' && own.p.fieldatlas === 'worldmap' && own.p.library === 'more', JSON.stringify([own.p.worldmap, own.p.regions, own.p.fieldatlas, own.p.library]));
  const lit = (prep) => A.G('(function () { S.wmap = null; S._v32deck = ""; S._v32run = null; S.pool = []; S.section = ""; S._v53drill = ""; S._v53from = null; ' + prep + '; return v25NavWord(); })()');
  const LIT = [
    ['the root', 'S.view = "worldmap"', 'worldmap'], ['a sheet', 'S.view = "worldmap"; S.wmap = "france"', 'worldmap'], ['the regions index', 'S.view = "regions"', 'worldmap'],
    ['a country', 'S.view = "country"; S._v39country = "france"', 'worldmap'], ['a region', 'S.view = "region"; S._v39region = "burgundy"', 'worldmap'],
    ['the field atlas', 'S.view = "fieldatlas"', 'worldmap'], ['a field map', 'S.view = "fieldmap"; S._v45map = "burgundy"', 'worldmap'],
    ['the Library', 'S.view = "library"', 'more'], ['the bank', 'S.view = "bank"', 'more'], ['Practise', 'S.view = "flashcards"', 'more'], ['Quizzes', 'S.view = "quizzes"', 'more'],
    ['the Workshop', 'S.view = "techniques"', 'more'], ['More', 'S.view = "more"', 'more'],
    ['a deck (the service references)', 'S.view = "deck"; S._v32deck = "service"', 'more'],
    ['a region\'s deck', 'S.view = "deck"; S._v32deck = "region:burgundy"', 'worldmap'], ['a sheet\'s deck', 'S.view = "deck"; S._v32deck = "regions:france"', 'worldmap'],
    ['every region\'s deck', 'S.view = "deck"; S._v32deck = "regions"', 'worldmap'],
    ['a region\'s cards in a run', 'S.view = "flash"; S._v32run = { v32: true, deckId: "region:burgundy" }', 'worldmap'],
    ['a region drill', 'S.view = "quiz"; S.section = v39W("drillSection"); S.pool = v39Questions(["burgundy"])', 'worldmap'],
    ['a level drill', 'S.view = "quiz"; S.section = Object.keys(cats())[0]; S.pool = (LEVELS[activeLevel].bank || []).slice(0, 3)', 'more'],
    ['a CMS deck', 'S.view = "deck"; S._v32deck = "cms:" + v53Subjects()[0].id', 'cms'], ['a grape deck', 'S.view = "deck"; S._v32deck = "grapes"', 'grapes'],
    ['the house\'s list deck', 'S.view = "deck"; S._v32deck = "list"', 'brennans'], ['Brennan\'s', 'S.view = "brennans"', 'brennans'], ['CMS', 'S.view = "cms"', 'cms'], ['Grapes', 'S.view = "grapes"', 'grapes'], ['Home', 'S.view = "home"', 'home']
  ];
  const litBad = LIT.map(([n, prep, w]) => [n, lit(prep), w]).filter((x) => x[1] !== x[2]);
  check('the lit word on ' + LIT.length + ' screens (the atlas views, a region\'s deck and drill: Wine Atlas; the Library\'s: More; the others their own)', litBad.length === 0, JSON.stringify(litBad));
  const par = (prep) => A.G('(function () { S.wmap = null; S._v32deck = ""; ' + prep + '; return JSON.stringify(v32ParentRoute()); })()');
  const PAR = [
    ['the root', 'S.view = "worldmap"', { view: 'home' }], ['a sheet', 'S.view = "worldmap"; S.wmap = "france"', { view: 'worldmap', arg: '' }],
    ['the regions index', 'S.view = "regions"', { view: 'worldmap', arg: '' }], ['the field atlas', 'S.view = "fieldatlas"', { view: 'worldmap', arg: '' }],
    ['a field map', 'S.view = "fieldmap"; S._v45map = "burgundy"', { view: 'fieldatlas' }], ['a country', 'S.view = "country"; S._v39country = "france"', { view: 'regions', arg: 'france' }],
    ['a region', 'S.view = "region"; S._v39region = "burgundy"', { view: 'country', arg: 'france' }], ['the Library', 'S.view = "library"', { view: 'more' }],
    ['the bank', 'S.view = "bank"', { view: 'library' }], ['Quizzes', 'S.view = "quizzes"', { view: 'library' }],
    ['a region\'s deck', 'S.view = "deck"; S._v32deck = "region:burgundy"', { view: 'region', arg: 'burgundy' }],
    ['a sheet\'s deck', 'S.view = "deck"; S._v32deck = "regions:france"', { view: 'country', arg: 'france' }],
    ['every region\'s deck', 'S.view = "deck"; S._v32deck = "regions"', { view: 'worldmap', arg: '' }]
  ];
  const parBad = PAR.map(([n, prep, w]) => [n, par(prep), JSON.stringify(w)]).filter((x) => x[1] !== x[2]);
  check('the cold parents on ' + PAR.length + ' screens (root to Home, sheet and index to the root, the Library to More, a region\'s deck to its region)', parBad.length === 0, JSON.stringify(parBad));
  check('the root is named The Wine Atlas in the main landmark', A.G('(function () { S.view = "worldmap"; S.wmap = null; return v25MainName(); })()') === 'The Wine Atlas');

  /* ================================================================ */
  section('4. More');
  const more = A.G('v32MoreHtml()');
  drawn.push(['More', more]);
  const firstGroup = /<\/h2><\/div>(<section[^>]*>[\s\S]*?<\/section>)/.exec(more);
  const fg = firstGroup ? firstGroup[1] : '';
  check('More\'s first group is The Library', /class="v32-group v55-libgroup"/.test(fg) && /<h3[^>]*>The Library<\/h3>/.test(fg), fg.slice(0, 200));
  const libRows = attr(fg, /data-go="v55lib" data-arg="([^"]*)"/g);
  const libNames = attr(fg, /<span class="v25row-name">([^<]*)<\/span>/g);
  check('its rows: Practise, The question bank, The reading rooms, to their sections in order', JSON.stringify(libRows) === JSON.stringify(['v53-practise-h', 'v53-bank-h', 'v53-reading-h']) && JSON.stringify(libNames) === JSON.stringify(['Practise', 'The question bank', 'The reading rooms']), libRows.join(' ') + ' | ' + libNames.join(' '));
  check('More\'s own groups follow it (the record, the backup, the Maître d\')', more.indexOf('v55-libgroup') < more.indexOf('v32-more-rec') && more.indexOf('v32-more-rec') > 0, more.slice(0, 300));
  const opened = A.G('(function () { v32Go({ view: "more" }, "push"); var n = history.length; v25Go("v55lib", "v53-bank-h"); return JSON.stringify({ view: S.view, hash: location.hash, n: history.length - n, parent: v32ParentRoute() }); })()');
  const O = JSON.parse(opened);
  check('a row opens the Library (#/library), one entry pushed, its cold parent More', O.view === 'library' && /^#\/library/.test(O.hash) && O.n === 1 && O.parent.view === 'more', opened);

  /* ================================================================ */
  section('5. the Library without the atlas');
  const lib = A.G('v32LibraryHtml()');
  drawn.push(['the Library', lib]);
  check('no atlas section, no chip to it, no World Map row', lib.indexOf('v53-atlas') < 0 && lib.indexOf('data-to="v53-atlas-h"') < 0 && lib.indexOf('data-go="worldmap"') < 0);
  check('its sections and chips remain: Practise, the question bank, the reading rooms', /id="v53-practise-h"/.test(lib) && /id="v53-reading-h"/.test(lib) && /v53-bankgroup/.test(lib) && attr(lib, /data-v53="jump" data-to="([^"]*)"/g).join(',') === 'v53-practise-h,v53-bank-h,v53-reading-h', attr(lib, /data-v53="jump" data-to="([^"]*)"/g).join(','));
  check('its line names no atlas', /<p class="v32-line">For [^<]*then the reading rooms\.<\/p>/.test(lib) && !/<p class="v32-line">[^<]*atlas/.test(lib));

  /* ================================================================ */
  section('6. the root');
  /* a second device, fresh: no reading fetched until the hub is drawn, every sheet's after it */
  const B = await bootDevice();
  const before = fetches.length;
  const none = B.G('v55Regions().filter(function (a) { return v39RecReady(a); }).length');
  B.G('S.view = "worldmap"; S.wmap = null;');
  const hub0 = B.page('worldMapView();');
  check('worldMapView with no sheet draws the hub', /id="v55-hub"/.test(hub0), hub0.slice(0, 200));
  for (let i = 0; i < 60 && !B.G('v55Regions().every(function (a) { return v39RecReady(a); })'); i++) await tick(40);
  const parts = [...new Set(fetches.slice(before))];
  const partsWant = B.G('(function () { var p = {}; v55Regions().forEach(function (a) { p[v39PartName(a)] = 1; }); return Object.keys(p).length; })()');
  check('the hub reads every sheet\'s reading through codex39\'s loader (' + parts.length + ' files of ' + partsWant + ', none read before it)', none === 0 && B.G('v55Regions().every(function (a) { return v39RecReady(a); })') && parts.length === partsWant, parts.join(' '));
  A.G('S.view = "worldmap"; S.wmap = null;');
  const hub = A.page('worldMapView();');
  drawn.push(['the root', hub]);
  const chips = [...hub.matchAll(/<nav class="v32chips v55-chips"[\s\S]*?<\/nav>/g)].map((m) => m[0])[0] || '';
  check('the five chips: The World Map, Countries, Every region (to their sections), Field maps, Techniques (to their screens)',
    JSON.stringify(attr(chips, />([^<]+)<\/button>/g)) === JSON.stringify(['The World Map', 'Countries', 'Every region', 'Field maps', 'Techniques'])
    && attr(chips, /data-to="([^"]*)"/g).join(',') === 'v55-sheets-h,v55-countries-h,v55-regions-h' && attr(chips, /data-go="([^"]*)"/g).join(',') === 'fieldatlas,techniques'
    && ['v55-sheets-h', 'v55-countries-h', 'v55-regions-h'].every((id) => hub.indexOf('id="' + id + '"') > 0) && A.G('typeof V25_GO.fieldatlas === "function" && typeof V25_GO.techniques === "function"'), chips);
  const sheetIds = JSON.parse(A.G('JSON.stringify((function () { var ids = v31Sheets().map(function (s) { return s.id; }), out = []; MAP_GROUPS.forEach(function (g) { g[1].forEach(function (id) { if (ids.indexOf(id) >= 0) out.push(id); }); }); ids.forEach(function (id) { if (out.indexOf(id) < 0) out.push(id); }); return out; })())'));
  const doors = attr(hub, /data-v39="openmap" data-sheet="([^"]*)"/g);
  check('the seventeen sheets as doors, in the order of the maps (' + doors.length + ')', doors.length === 17 && JSON.stringify(doors) === JSON.stringify(sheetIds), doors.join(' '));
  const order = JSON.parse(A.G('JSON.stringify(v55CountryOrder().map(function (r) { return r.key; }))'));
  const allCountries = JSON.parse(A.G('JSON.stringify(Object.keys(v39Countries()).filter(function (k) { return v39Country(k); }))'));
  const chipsC = attr(hub.slice(hub.indexOf('v55-countrychips')), /data-v39="country" data-key="([^"]*)"/g).slice(0, order.length);
  const groups = attr(hub, /class="v32-group v55-country" data-v55-country="([^"]*)"/g);
  check('every country once (' + order.length + ' of ' + allCountries.length + '): a chip each and a group each, in the order of the maps', order.length === allCountries.length && allCountries.every((k) => order.indexOf(k) >= 0) && JSON.stringify(chipsC) === JSON.stringify(order) && JSON.stringify(groups) === JSON.stringify(order), JSON.stringify({ order, chipsC, groups }));
  let regionBad = [], regionN = 0;
  const allSlugs = JSON.parse(A.G('JSON.stringify(v55Regions().map(function (a) { return a.slug; }))'));
  const seenSlugs = countOf(attr(hub, /data-v39="region" data-slug="([^"]*)"/g));
  order.forEach((k) => {
    const at = hub.indexOf('data-v55-country="' + k + '"');
    const end = hub.indexOf('</section>', at);
    const grp = hub.slice(at, end);
    const want = JSON.parse(A.G('JSON.stringify((function () { var c = v39CountryOf(' + JSON.stringify(k) + '); return c && c.sheet && !c.mapless ? v39SheetRegions(c.sheet).map(function (a) { return a.slug; }) : []; })())'));
    const got = attr(grp, /data-v39="region" data-slug="([^"]*)"/g);
    if (JSON.stringify(got) !== JSON.stringify(want)) regionBad.push(k + ': ' + got.join(',') + ' / ' + want.join(','));
    if (grp.indexOf('data-v39="country" data-key="' + k + '"') < 0) regionBad.push(k + ': no country door');
    got.forEach((slug) => {
      regionN++;
      const line = unesc((new RegExp('data-v55-count="' + slug + '">([^<]*)<').exec(grp) || [])[1] || '');
      const wantLine = A.G('v55RegionLine(v39Find(' + JSON.stringify(slug) + '))');
      const n = treeNames(REC[slug] && REC[slug].places, []).length;
      const m = A.G('v45Map(' + JSON.stringify(slug) + ') ? v45Map(' + JSON.stringify(slug) + ').places.length : 0');
      if (line !== wantLine || line !== (n === 1 ? '1 district' : n + ' districts') + ' · ' + m + ' on its field map') regionBad.push(slug + ': ' + line);
    });
  });
  check('every region once (' + regionN + ' of ' + allSlugs.length + '), under its own country in codex39\'s order, its line its district count and its field map\'s count',
    regionN === allSlugs.length && allSlugs.every((s) => seenSlugs[s] === 1) && regionBad.length === 0, regionBad.slice(0, 6).join(' | '));
  const sheetView = A.G('(function () { var got = ""; var was = el; el = function (h) { got = String(h); return was(h); }; S.view = "worldmap"; S.wmap = "france"; try { worldMapView(); } finally { el = was; } return got; })()');
  check('a sheet\'s address still draws codex31\'s sheet (#/v/worldmap/france)', /v31-sheet/.test(sheetView) && !/v55-hub/.test(sheetView), sheetView.slice(0, 160));
  A.G('S.wmap = null;');

  /* ================================================================ */
  section('7. five regions');
  const FIVE = ['burgundy', 'champagne', 'napa-sonoma', 'rioja', 'mosel'];
  for (const slug of FIVE) {
    console.log('');
    const html = A.page('S.view = "region"; S._v39region = ' + JSON.stringify(slug) + '; v39RegionView();');
    drawn.push([slug, html]);
    const m = JSON.parse(A.G('JSON.stringify(v45Map(' + JSON.stringify(slug) + '))'));
    const file = A.G('v45File(v45Map(' + JSON.stringify(slug) + '))');
    const fig = (/<figure class="v45-figure">[\s\S]*?<\/figure>/.exec(html) || [''])[0];
    const reading = REC[slug] || {};
    const names = treeNames(reading.places, []);
    console.log('  ' + slug + ': ' + names.length + ' places in the reading, ' + m.places.length + ' on the map');
    check(slug + ': the inline map is codex45\'s figure for the slug (its artwork, its viewer), with the mark\'s holder and the door to the field map screen',
      !!fig && fig.indexOf('src="' + file + '"') > 0 && fig.indexOf('data-v45="zoom" data-v45-arg="' + slug + '"') > 0 && /class="v55-mapfig" data-v55-map="[^"]*"/.test(html) && /class="v55-pin" hidden/.test(html)
      && html.indexOf('data-v45="map" data-v45-arg="' + slug + '"') > 0, fig.slice(0, 200));
    const dist = html.slice(html.indexOf('<section class="v55-districts"'), html.indexOf('</section>', html.indexOf('<section class="v55-districts"')) + 10);
    const placed = countOf(attr(dist, /data-v55-place="([^"]*)"/g));
    const wantPlaced = countOf(names.concat([]));
    /* the map places that join no reading place are drawn by their own name under Also on the map */
    const pinNums = attr(dist, /data-pin="([^"]*)"/g).map(Number);
    const pinNames = attr(dist, /data-v55="pin" data-pin="[^"]*" data-x="[^"]*" data-y="[^"]*" data-name="([^"]*)"/g);
    const alsoNames = attr(dist.slice(Math.max(0, dist.indexOf('v55-also'))), /class="v55-d v55-alsoitem" data-v55-place="([^"]*)"/g);
    names.forEach((n) => { wantPlaced[n] = wantPlaced[n]; });
    alsoNames.forEach((n) => { wantPlaced[n] = (wantPlaced[n] || 0) + 1; });
    const readingOk = names.every((n) => placed[n] >= countOf(names)[n]) && Object.keys(placed).every((n) => placed[n] === (wantPlaced[n] || 0));
    const mapOk = pinNums.length === m.places.length && pinNums.every((n, i) => pinNums.indexOf(n) === i) && m.places.every((p, i) => pinNums.indexOf(i + 1) >= 0)
      && m.places.every((p, i) => pinNames[pinNums.indexOf(i + 1)] === p.name);
    check(slug + ': The districts holds every place of the reading (' + names.length + ') as often as the reading names it', readingOk, JSON.stringify({ missing: names.filter((n) => !placed[n]).slice(0, 5) }));
    check(slug + ': and every place of the map (' + m.places.length + ') exactly once, ' + (m.places.length - alsoNames.length) + ' joined to the reading\'s, ' + alsoNames.length + ' under Also on the map', mapOk, JSON.stringify({ pinNums, pinNames: pinNames.slice(0, 4) }));
    const proj = JSON.parse(A.G('JSON.stringify(v45Map(' + JSON.stringify(slug) + ').places.map(function (p) { var q = v55Project(v45Map(' + JSON.stringify(slug) + '), p); return [q.x, q.y]; }))'));
    const xs = attr(dist, /data-pin="[^"]*" data-x="([^"]*)"/g).map(Number), ys = attr(dist, /data-pin="[^"]*" data-x="[^"]*" data-y="([^"]*)"/g).map(Number);
    const svg = fs.readFileSync(path.join(ROOT, m.file), 'utf8');
    const dots = [...svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="3\.2"/g)].map((d) => [Number(d[1]), Number(d[2])]);
    const off = pinNums.map((n, i) => Math.hypot(xs[i] - dots[n - 1][0], ys[i] - dots[n - 1][1]));
    check(slug + ': each mark stands on the dot the artwork draws (worst ' + Math.max(...off).toFixed(3) + ' of 1200 units)', dots.length === m.places.length && off.every((d) => d < 0.5) && proj.length === m.places.length, JSON.stringify(off));
    check(slug + ': codex39\'s The places folded into The districts, its other sections kept', html.indexOf('v39-sec-places') < 0 && html.indexOf('id="v39-sec-land"') > 0 && html.indexOf('id="v39-sec-sources"') > 0);
    const at = (s) => html.indexOf(s);
    check(slug + ': the order: the head, the map, The districts, the reading, In the Codex, codex39\'s doors',
      at('class="viewhead"') < at('class="v55-map"') && at('class="v55-map"') < at('class="v55-districts"') && at('class="v55-districts"') < at('class="v39-steps"') && at('class="v39-steps"') < at('class="v55-codex"') && at('class="v55-codex"') < at('class="v28-btnrow v39-acts"'),
      [at('class="v55-map"'), at('class="v55-districts"'), at('class="v39-steps"'), at('class="v55-codex"'), at('class="v28-btnrow v39-acts"')].join(' '));
    const codex = html.slice(at('class="v55-codex"'), at('class="v28-btnrow v39-acts"'));
    const techs = attr(codex, /data-v46="lesson" data-v46-arg="([^"]*)"/g);
    const wantTechs = JSON.parse(A.G('JSON.stringify(v46For(' + JSON.stringify(slug) + ').map(function (t) { return t.slug; }))'));
    const subj = attr(codex, /data-go="cmssubject" data-arg="([^"]*)"/g);
    const wantSubj = A.G('(function () { var s = v55Subject(v39Find(' + JSON.stringify(slug) + ')); return s ? s.id : ""; })()');
    const grids = attr(codex, /data-go="griddrill" data-arg="([^"]*)"/g);
    const grapes = attr(codex, /data-go="grape" data-arg="([^"]*)"/g);
    const flash = /data-v39="flash" id="v39-act-flash" data-slug="([^"]*)"/.exec(codex), drill = /data-v39="drill" id="v39-act-drill" data-slug="([^"]*)"/.exec(codex);
    console.log('    In the Codex: ' + techs.length + ' techniques, subject ' + (subj[0] || 'none') + ', grid ' + grids.join(',') + ', grapes ' + grapes.join(',') + ', flashcards ' + !!flash + ', drill ' + !!drill);
    const resolve = [];
    techs.forEach((t) => { if (!A.G('(function () { var t = v46Find(' + JSON.stringify(t) + '); return !!t && t.usedBy.indexOf(' + JSON.stringify(slug) + ') >= 0; })()')) resolve.push('technique ' + t); });
    subj.forEach((s) => { if (!A.G('!!v53Subject(' + JSON.stringify(s) + ')')) resolve.push('subject ' + s); });
    grids.forEach((g) => { if (!A.G('(function () { var g = GRID_READS[' + JSON.stringify(g) + ']; return !!g && g.reads.some(function (r) { return r.region.split(/,|\\band\\b/).some(function (p) { return v39SlugFor(p.replace(/\\([^)]*\\)/g, " ").trim() + ", " + r.country) === ' + JSON.stringify(slug) + '; }); }); })()')) resolve.push('grid ' + g); });
    grapes.forEach((g) => { if (!A.G('!!v53GrapeFind(' + JSON.stringify(g) + ')')) resolve.push('grape ' + g); });
    if (!flash || !A.G('v32DeckDef("region:' + slug + '").cards.length > 0')) resolve.push('flashcards');
    if (!drill || !A.G('v39Questions(["' + slug + '"]).length > 0')) resolve.push('drill');
    if (!A.G('["cmssubject","griddrill","grape"].every(function (k) { return typeof V25_GO[k] === "function"; })')) resolve.push('V25_GO');
    check(slug + ': every door In the Codex resolves (the techniques whose usedBy names it, the Court\'s subject by codex54\'s rule, one grid door a grape whose read names it, the grapes\' pages, its flashcards and its drill)',
      resolve.length === 0 && JSON.stringify(techs) === JSON.stringify(wantTechs) && JSON.stringify(subj) === JSON.stringify(wantSubj ? [wantSubj] : []) && new Set(grids).size === grids.length && grapes.length > 0, resolve.join(', ') + ' ' + JSON.stringify({ techs, wantTechs, subj, wantSubj }));
    /* every door opens its screen */
    const opens = A.G('(function () { var out = []; var back = function () { v32Go({ view: "region", arg: ' + JSON.stringify(slug) + ' }, "push"); }; '
      + JSON.stringify(techs) + '.forEach(function (t) { back(); v46Go(t); if (S.view !== "technique" || S._v46technique !== t) out.push("technique " + t); }); '
      + JSON.stringify(subj) + '.forEach(function (s) { back(); v25Go("cmssubject", s); if (S.view !== "cmssubject") out.push("subject " + s); }); '
      + JSON.stringify(grids) + '.forEach(function (g) { back(); v25Go("griddrill", g); if (S.view !== "griddrill" || S._v53gridGrape !== g) out.push("grid " + g); }); '
      + JSON.stringify(grapes) + '.forEach(function (g) { back(); v25Go("grape", g); if (S.view !== "grape" || S._v53grape !== g) out.push("grape " + g); }); '
      + 'back(); v39Act("flash", { getAttribute: function (k) { return k === "data-slug" ? ' + JSON.stringify(slug) + ' : ""; } }); if (!(S._v32run && S._v32run.deckId === "region:' + slug + '")) out.push("flashcards " + S.view); var w1 = v25NavWord(); '
      + 'back(); v39Act("drill", { getAttribute: function (k) { return k === "data-slug" ? ' + JSON.stringify(slug) + ' : ""; } }); if (S.view !== "quiz" || !S.pool.length) out.push("drill " + S.view); var w2 = v25NavWord(); var p2 = JSON.stringify(v32ParentRoute()); '
      + 'S.mode = null; S.pool = []; back(); return JSON.stringify({ out: out, w1: w1, w2: w2, p2: p2 }); })()');
    const OP = JSON.parse(opens);
    check(slug + ': every door opens its screen; the flashcards and the drill light Wine Atlas, the drill climbing back to the region', OP.out.length === 0 && OP.w1 === 'worldmap' && OP.w2 === 'worldmap' && OP.p2 === JSON.stringify({ view: 'region', arg: slug }), opens);
  }

  /* ================================================================ */
  section('8. the country pages');
  for (const key of ['france', 'italy']) {
    const html = A.page('S.view = "country"; S._v39country = ' + JSON.stringify(key) + '; v39CountryView();');
    drawn.push([key, html]);
    const sheet = A.G('v39CountryOf(' + JSON.stringify(key) + ').sheet');
    const mapSrc = A.G('mapFile(' + JSON.stringify(sheet) + ')');
    check(key + ': its map inline, the sheet\'s artwork opening codex31\'s sheet and its guide, codex31\'s viewer under it',
      html.indexOf('class="v55-mapfig v55-sheetfig" data-v55-sheet="' + sheet + '"') > 0 && html.indexOf('src="' + mapSrc + '"') > 0 && html.indexOf('data-v39="openmap" data-sheet="' + sheet + '"') > 0 && html.indexOf('data-v55="enlarge" data-sheet="' + sheet + '"') > 0, mapSrc);
    const want = JSON.parse(A.G('JSON.stringify(v39SheetRegions(' + JSON.stringify(sheet) + ').map(function (a) { return a.slug; }))'));
    const regs = html.slice(html.indexOf('id="v39-sec-regions"'), html.indexOf('</details>', html.indexOf('id="v39-sec-regions"')));
    const got = attr(regs, /data-v39="region" data-slug="([^"]*)"/g);
    const lines = want.map((s) => [unesc((new RegExp('data-v55-count="' + s + '">([^<]*)<').exec(regs) || [])[1] || ''), A.G('v55RegionLine(v39Find(' + JSON.stringify(s) + '))')]);
    const unresolved = got.filter((slug) => !A.G('!!v39Find(' + JSON.stringify(slug) + ')'));
    check(key + ': every region (' + want.length + ') once as a row with its district count, in codex39\'s list\'s place, every row\'s door resolving', unresolved.length === 0 && JSON.stringify(got) === JSON.stringify(want) && lines.every((l) => l[0] && l[0] === l[1] && /districts? · \d+ on its field map$/.test(l[0])) && (html.match(/class="v39-doors/g) || []).length === 1, JSON.stringify(lines.slice(0, 3)));
    const at = (s) => html.indexOf(s);
    check(key + ': the order: the head, the map, the reading', at('class="viewhead"') < at('class="v55-map"') && at('class="v55-map"') < at('class="v39-steps"'));
  }
  const canada = A.page('S.view = "country"; S._v39country = "canada"; v39CountryView();');
  drawn.push(['canada', canada]);
  check('canada: its field map inline (codex45\'s figure for country-canada)', canada.indexOf('data-v45="zoom" data-v45-arg="country-canada"') > 0 && canada.indexOf('class="v55-mapfig" data-v55-map="country-canada"') > 0);
  const ee = A.page('S.view = "country"; S._v39country = "eastern-europe"; v39CountryView();');
  drawn.push(['eastern-europe', ee]);
  check('eastern-europe: one of its eight field maps inline, a chooser of eight chips', attr(ee, /data-v55="choose" data-key="eastern-europe" data-map="([^"]*)"/g).length === 8 && (ee.match(/<figure class="v45-figure">/g) || []).length === 1);

  /* ================================================================ */
  section('9. the field map screen');
  check('the field map screen keeps its Read in depth door to the region page', A.G('v45ReadingActions(v45Map("burgundy"))').indexOf('data-v45="reading" data-v45-arg="burgundy"') > 0);

  /* ================================================================ */
  section('10. voice and the file');
  const words = JSON.parse(A.G('JSON.stringify(V55_WORDS)'));
  const wordBad = Object.keys(words).map((k) => [k, voiceProblems(words[k])]).filter((x) => x[1].length);
  check('every word of V55_WORDS passes the strictest voice rules (' + Object.keys(words).length + ')', wordBad.length === 0, JSON.stringify(wordBad));
  /* the layer's own words on every page drawn here (the readings' and the maps' fields are the data's, drawn as written) */
  const pageBad = [];
  drawn.forEach(([name, html]) => {
    const said = shown(html);
    voiceProblems(said.replace(/[^\x00-↏]/g, '')).forEach((p) => { if (!/mark/.test(p)) pageBad.push(name + ': ' + p); });
  });
  check('no page drawn here shows a dash, the retired word or a level numeral (' + drawn.length + ' pages)', pageBad.length === 0, pageBad.slice(0, 6).join(' | '));
  const src = fs.readFileSync(path.join(JS, 'codex55.js'), 'utf8');
  const unescaped = src.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
  /* the tab word Practise, and the identifiers built on it (v53-practise-h, libPractise...), are not prose */
  const prose = (t) => t.replace(/\bv\d+-practise-h\b/g, '').replace(/\blibPractise\w*/g, '').replace(/(^|[^\w])Practise(?!\w)/g, '$1');
  const srcBad = voiceProblems(prose(src)).concat(voiceProblems(prose(unescaped)));
  check('codex55.js (its escapes read as the characters they are): no dash of any kind, never the retired word, no level numeral, no mark at or above U+2190', srcBad.length === 0, srcBad.join(', '));
  check('codex55.js names nobody and ships no key and no model name', !/Lizzy|sk-ant|api[_-]?key|claude-|\bopus\b|\bsonnet\b|\bhaiku\b/i.test(src));
  check('codex55.js declares with var and function only (no let, const, class or arrow)', !/(^|[^\w.'"])(let|const|class)\s/.test(src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/'(?:[^'\\]|\\.)*'/g, "''")) && src.indexOf('=>') < 0);
  const wrappers = src.match(/^\s*var _v55\w+ = (\w+);$/gm) || [];
  check('codex55.js edits no earlier layer: every wrapper (' + wrappers.length + ') is typeof guarded', wrappers.length > 0 && wrappers.every((line) => { const t = /= (\w+);$/.exec(line)[1]; return src.indexOf('typeof ' + t + ' === \'function\'') >= 0; }), wrappers.join(' | '));
  const selfBad = voiceProblems(fs.readFileSync(__filename, 'utf8').replace(/(^|[^\w])Practise(?!\w)/g, '$1')).filter((p) => !/retired|numeral/.test(p));
  check('check-atlas.js itself carries no dash and no mark at or above U+2190', selfBad.length === 0, selfBad.join(', '));

  /* ================================================================ */
  section('11. the shell and the chain rule');
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const i54 = index.indexOf('src="js/codex54.js'), i55 = index.indexOf('src="js/codex55.js?v='), iBoot = index.indexOf('src="js/boot.js');
  check('index.html loads js/codex55.js once, with ?v=, after codex54.js and before boot.js', i55 > i54 && i55 < iBoot && index.split('js/codex55.js').length === 2);
  const v = Number((sw.match(/const CACHE = '(?:oot-)?codex-v(\d+)';/) || [])[1]);
  check('sw.js is codex-v114 or later (' + v + ') and lists ./js/codex55.js once, after ./js/codex54.js', v >= 114 && sw.indexOf("'./js/codex55.js'") > sw.indexOf("'./js/codex54.js'") && sw.indexOf("'./js/codex54.js'") > 0 && sw.split("'./js/codex55.js'").length === 2);
  const gates = fs.readdirSync(__dirname).filter((f) => /^(check-|list-harness)[\w-]*\.c?js$/.test(f));
  const short = gates.filter((f) => {
    const t = fs.readFileSync(path.join(__dirname, f), 'utf8');
    const n54 = (t.match(/'codex54\.js'\s*,\s*'boot\.js'/g) || []).length;
    const listed = (t.match(/'codex54\.js'\s*[,\]]/g) || []).length;
    const next = (t.match(/'codex54\.js'\s*,\s*'codex55\.js'/g) || []).length;
    return n54 > 0 || listed > next;
  });
  check('the chain rule: every list in a gate here that names codex54.js names codex55.js straight after it (' + gates.length + ' gates read)', !short.length, short.join(', '));
}

main().then(() => {
  console.log('');
  if (failed) { console.log('check-atlas: ' + failed + ' of ' + (passed + failed) + ' checks FAILED'); process.exit(1); }
  console.log('check-atlas: all ' + passed + ' checks passed');
  process.exit(0);
}).catch((e) => { console.error(e && e.stack || e); process.exit(1); });
