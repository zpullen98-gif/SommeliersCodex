/* The five-star card (codex54), proven in a node sandbox.

   Modelled on .scripts/check-brennans.js's loader: a sandbox with a real
   history stack and a Map for sessionStorage, the shared house engine and
   its UI loaded first, then every classic script index.html loads from js/
   (through codex54.js), the pack served to the engine's boot fetch. For six
   wines (a glass wine, a tasting pour, a Bubbles bottle, a half bottle and
   two floor bottles) it prints the card's block heading order and holds the
   card to its spec: one Next at the top, one door per destination In the
   Codex, each video once, the sale directly under the forty-five when the
   pack has one (and absent when it has none), the guest line gone from the
   top, The guide's line under On the floor, Practise this wine one row.

     node .wip/prove-card.cjs [--pack <file>] [--dump <wine id>]

   --pack defaults to OOT_HOUSE_PACK, else the shared pack beside OOT_SHARED.
   Work in progress, kept on codex54-wip; never shipped. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const CH = require(path.join(__dirname, '..', '.scripts', 'cms', 'chain.cjs'));

const ARGS = process.argv.slice(2);
const opt = (k) => { const i = ARGS.indexOf(k); return i >= 0 ? ARGS[i + 1] : ''; };
const JS = path.join(__dirname, '..', 'js');
const SHARED = process.env.OOT_SHARED || path.join(__dirname, '..', '..', 'worldtable', 'static', 'shared');
const PACK_FILE = opt('--pack') || process.env.OOT_HOUSE_PACK || path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
const DUMP = opt('--dump');
const ENGINE = path.join(SHARED, 'oot-house.js');
const UI_FILE = path.join(SHARED, 'oot-house-ui.js');
const NOW = Date.parse('2026-10-03T14:02:00.000Z');

let passed = 0, failed = 0;
function check(what, ok, detail) {
  if (ok) { passed++; console.log('  ok    ' + what); }
  else { failed++; console.log('  FAIL  ' + what + (detail ? '  :: ' + String(detail).slice(0, 600) : '')); }
}
function seeded(start) {
  let s = start || 12345;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x80000000; };
}

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
  return { sandbox, ctx, G, store };
}

const packText = fs.readFileSync(PACK_FILE, 'utf8');
const house = JSON.parse(packText).house;
const D = makeSandbox();
vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), D.ctx, { filename: 'oot-house.js' });
vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), D.ctx, { filename: 'oot-house-ui.js' });
const lib = D.G('OOT.houseLib');
D.sandbox.OOT.house = lib.createHouseApi(lib.mapStorage(new Map()), { win: D.sandbox, now: () => NOW, rand: seeded(21), from: 'codex' });
D.sandbox.fetch = () => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(packText), json: () => Promise.resolve(JSON.parse(packText)) });
const FILES = CH.chainFiles(JS);
for (const f of FILES) {
  try { vm.runInContext(fs.readFileSync(path.join(JS, f), 'utf8'), D.ctx, { filename: f }); }
  catch (e) { console.error('prove-card: js/' + f + ' failed to load: ' + e.message); process.exit(1); }
}
const tick = (ms) => new Promise((r) => setTimeout(r, ms || 10));

/* ---------------- reading a card ---------------- */
const str = (s) => (typeof s === 'string' ? s.trim() : '');
const kv = (x, f) => (x && x[f] && x[f].by === 'person' ? x[f].value : null);
function packKind(w) {
  if (w.list === 'bottle') return /half/i.test(str(w.section)) || /375/.test(str(w.size)) ? 'floor-half' : 'floor';
  const menuBottle = !str(w.glass) && !!str(w.bottle);
  const printed = (Array.isArray(w.prices) ? w.prices : []).some((p) => p && str(p.printed));
  if (printed && !menuBottle) return 'glass';
  const poured = (house.tastings || []).some((t) => (t.courses || []).some((c) => c && c.pourId === w.id));
  if (!printed && poured) return 'pour';
  if (menuBottle) return /bubbles at/i.test(str(w.section)) ? 'bubbles' : 'half';
  return 'glass';
}
const pick = (k, f) => house.wines.find((w) => packKind(w) === k && (!f || f(w)));
const WINES = [
  ['a glass wine', pick('glass')],
  ['a tasting pour', pick('pour')],
  ['a Bubbles bottle', pick('bubbles')],
  ['a half bottle', pick('half')],
  ['a floor bottle with a first pick or tier', pick('floor', (w) => w.offeredWith && w.firstPickIds) || pick('floor', (w) => w.offeredWith)],
  ['a floor bottle in Red Burgundy', pick('floor', (w) => /Red Burgundy/.test(w.section))]
].filter((x) => x[1]);

function heads(html) {
  const out = [];
  const re = /<(h3|summary)\b[^>]*class="[^"]*\bv54-h\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(html))) out.push(m[2].replace(/<[^>]+>/g, '').trim());
  return out;
}
function count(html, re) { return (html.match(re) || []).length; }
function section(html, id) {
  const at = html.indexOf('id="' + id + '"');
  if (at < 0) return '';
  const start = html.lastIndexOf('<', at);
  const tag = /^<(\w+)/.exec(html.slice(start))[1];
  let depth = 0, i = start;
  const open = new RegExp('<' + tag + '\\b', 'g'), close = new RegExp('</' + tag + '>', 'g');
  const re = new RegExp('<' + tag + '\\b|</' + tag + '>', 'g');
  re.lastIndex = start;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].charAt(1) === '/') { depth--; if (depth === 0) return html.slice(start, m.index + m[0].length); }
    else depth++;
  }
  void open; void close; void i;
  return html.slice(start);
}
const DASH = /\u2014|\u2013|&mdash;|&ndash;|&#8212;|&#8211;|&#x2014;|&#x2013;| -- /i;

(async () => {
  try { await D.G('typeof V27_LAST !== "undefined" ? V27_LAST : null'); } catch (e) { }
  try { await D.G('typeof V27_BOOT_PACK !== "undefined" ? V27_BOOT_PACK : null'); } catch (e) { }
  await tick(30);
  try { await D.G('typeof V27_WRITING !== "undefined" ? V27_WRITING : null'); } catch (e) { }
  await tick(30);
  const n = D.G('(v28House() && v28House().wines || []).length');
  console.log('prove-card: ' + FILES.length + ' scripts, codex54 at ' + (FILES.indexOf('codex54.js') + 1) + ', the house holds ' + n + ' wines, pack ' + path.basename(PACK_FILE));
  const withSale = house.wines.filter((w) => str((kv(w, 'lines') || {}).sale)).length;
  console.log('prove-card: ' + withSale + ' wines in this pack carry a sale');
  D.G('S.view = "cellar"; S._v25area = "brennans";');
  const draw = (id) => D.G('(function () { var st = v28State(); st.open = ' + JSON.stringify(id) + '; st.q = ""; st.sec = ""; return v28CardHtml(' + JSON.stringify(id) + '); })()');
  if (DUMP) { console.log(draw(DUMP)); return; }
  check('codex54 loaded: V54_WORDS and v54SubjectFor are defined', D.G('typeof V54_WORDS === "object" && typeof v54SubjectFor === "function"'));
  for (const [label, w] of WINES) {
    console.log('');
    console.log('--- ' + label + ': ' + w.name + ' (' + w.id + ', ' + w.section + ') ---');
    const html = String(draw(w.id) || '');
    const order = heads(html);
    console.log('  order: ' + order.join(' | '));
    const l = kv(w, 'lines') || {};
    const top = html.slice(0, html.indexOf('id="v54-where"') > 0 ? html.indexOf('id="v54-where"') : html.length);
    check('drawn whole: the v54 card, no undefined, NaN or [object Object], tags balanced', html.indexOf('v54-card') > 0 && !CH.cleanProblem(html), CH.cleanProblem(html));
    check('the drawn card carries no dash', !DASH.test(html.replace(/<[^>]*>/g, ' ')), (DASH.exec(html) || [''])[0]);
    const nextTop = count(top.slice(0, top.indexOf('v54-titlerow') > 0 ? top.indexOf('</div>', top.indexOf('v54-titlerow')) : 0), /data-v28="open"[^>]*data-step="1"/g);
    check('the title row holds one Next at most (one when the list goes on)', nextTop <= 1, nextTop);
    const allNext = count(html, />Next<\/button>/g);
    check('one bare Next on the whole card', allNext <= 1, allNext);
    const s45 = str(l.s45), sale = str(l.sale);
    const atTable = section(html, 'v54-table');
    check('At the table holds the forty-five large', !s45 || atTable.indexOf('v54-fortyfive') >= 0);
    if (sale) {
      const i45 = atTable.indexOf('v54-fortyfive'), iSale = atTable.indexOf('v54-sale');
      const between = atTable.slice(i45, iSale);
      check('The sale sits directly under the forty-five, under its gold rule', i45 >= 0 && iSale > i45 && count(between, /<p\b/g) <= 1 && atTable.indexOf('v54-rule') > i45, [i45, iSale].join(','));
      check('the sale is the pack\'s own words', atTable.indexOf(sale.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')) >= 0 || atTable.indexOf(sale) >= 0);
    } else {
      check('no sale block when the pack holds none', html.indexOf('v54-sale') < 0);
    }
    const guest = str(kv(w, 'guest'));
    const tablePart = atTable;
    check('the guest line is gone from the top', !guest || tablePart.indexOf('The guest line') < 0);
    const floor = section(html, 'v54-floor');
    check('The guide\'s line stands under On the floor', !guest || guest === str(l.s20) || floor.indexOf('v54-guide') >= 0);
    const codex = section(html, 'v54-codex');
    const doors = [...codex.matchAll(/data-v54-dest="([^"]+)"/g)].map((m) => m[1]);
    const dup = doors.filter((d, i) => doors.indexOf(d) !== i);
    console.log('  In the Codex: ' + (doors.join(', ') || 'none'));
    check('In the Codex: one door per destination', !dup.length, dup.join(', '));
    check('In the Codex: one map at most', doors.filter((d) => /^map:/.test(d)).length <= 1);
    check('codex52\'s atlas box is not on the card', html.indexOf('class="v52-atlas"') < 0);
    const vids = [...html.matchAll(/data-video="([^"]+)"/g)].map((m) => m[1]);
    console.log('  videos: ' + vids.length);
    check('each video once on the card', new Set(vids).size === vids.length, vids.join(','));
    check('What it\'s made of carries no per component video list', section(html, 'v54-madeof').indexOf('v30-list') < 0);
    check('Who makes it carries no library link', html.indexOf('v38-lib') < 0);
    check('Pronounced: for the respellings', html.indexOf('<span class="v28-soft">Say it:</span>') < 0);
    const prac = section(html, 'v54-practise');
    check('Practise this wine is one chip row', count(html, /class="v28-btnrow v54-practise-row"/g) <= 1 && html.indexOf('v28-acts') < 0, count(html, /v54-practise-row/g));
    console.log('  practise: ' + [...prac.matchAll(/<button[^>]*>([^<]*)<\/button>/g)].map((m) => m[1]).join(' | '));
    const foot = html.slice(html.indexOf('v28-foot'));
    check('the footer: Edit, then Previous and Next', foot.indexOf('data-v28="edit"') > 0);
  }
  console.log('');
  const back = D.G('(function () { var h = v28House(); var w = h.wines.filter(function (x) { return v28CardOf(x, h); })[0]; var c = v28CardOf(w, h); return { id: w.id, s10: c.back.s10, sale: c.back.sale || "" }; })()');
  const bw = house.wines.find((w) => w.id === back.id);
  const bsale = str((kv(bw, 'lines') || {}).sale);
  check('the flash card back carries the sale under the ten when the pack has one', bsale ? back.sale === bsale : !back.sale, JSON.stringify(back).slice(0, 200));
  const face = D.G('(function () { var h = v28House(); var w = h.wines.filter(function (x) { return v28CardOf(x, h); })[0]; S._v28deck = { ids: [w.id], idx: 0, flipped: true, got: 0, again: 0, label: "x", missed: [], from: null, pushed: false }; var out = v28DeckHtml(); S._v28deck = null; return out; })()');
  check('the deck\'s flipped face draws the sale under the ten', bsale ? String(face).indexOf('v54-sale') > String(face).indexOf('v28-ten') && String(face).indexOf('v28-ten') > 0 : String(face).indexOf('v54-sale') < 0);
  console.log('');
  console.log('prove-card: ' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error('prove-card: ' + (e && e.stack || e)); process.exit(1); });
