/**
 * THE FIVE-STAR CARD AND THE FLOW, HELD TO THEIR DESIGN (codex54, 31 October 2026).
 *
 * The owner asked for every wine on the Brennan's list to open on a five-star
 * tableside description with a sale at the very top, connected once to
 * everything the Codex holds, and for the app's overlaps to be cut. codex54
 * wraps codex28's card last, adds a DOM pass after codex33's and codex37's,
 * and reshapes the flow (the question bank, one Village tasting, the grape
 * decks under Grapes, the level page, the Library, Brennan's rooms, the
 * parents and the search). This loads the SHIPPED chain index.html loads
 * (through codex54), with the shared house engine and the pack, in
 * check-brennans's VM (a history that is a real stack, a location that
 * follows it, a Map for sessionStorage), on two devices: one with the pack as
 * given, one with a sale written in memory into every wine that lacks one, so
 * the gate holds both the card with a sale and the card without one on the
 * shipped pack and on a pack that carries sales. It asserts:
 *
 *   1. the load: codex54 runs, its words and its helpers defined
 *   2. the card on six wines (a glass wine, a tasting pour, a Bubbles
 *      bottle, a half bottle and two floor bottles): the block order, At the
 *      table first and Practise this wine last; one Next at the top and one
 *      bare Next on the card; the forty-five large; the sale directly under
 *      it, under its gold rule, when the pack holds one, and no sale block
 *      when it holds none; the guest line gone from the top; codex52's atlas
 *      box off the card; no per component film list; no library link under
 *      Who makes it; Pronounced: for the respellings; Practise this wine one
 *      chip row; the footer Edit, Previous and Next
 *   3. every card the house holds (271 on the shipped pack): drawn whole and
 *      dash free; Where we pour it equal to the dishes' own pairings (first
 *      pick, second choice, the bottle tiers with their words, the tastings
 *      and the drink without alcohol), each list the pack's derived fields
 *      (firstPickIds, secondFor, offeredWith) and no first pick a dish does
 *      not name; the guest line once, under On the floor (or as the timed
 *      line it is word for word);
 *      one door per destination In the Codex, one map at most, every door's
 *      target resolvable and every door opening its screen; each film once
 *   4. the flash card back: the sale under the ten when the pack has one, on
 *      codex28's deck and on codex32's runs, and absent otherwise
 *   5. the flow: the question bank and #/quizzes; the Practise row; the
 *      Grapes Tasting section's four rows and no Blind flight door; the
 *      Library's and the level page's rows; Brennan's rooms; the parents
 *      table; the search groups; the stale words; the owner's rule (2
 *      November 2026): codex25's notice shown on no screen (home and its
 *      colophon, the level page, the CMS root, the Library, More)
 *   6. voice: every string codex54 draws (its words, the flow's pages
 *      whole, and on every card and flash face its own headings, eyebrows,
 *      disclosures, chips and buttons; the pack's fields are the house's,
 *      drawn as it wrote them) through check-producers-house's
 *      voiceProblems, the strictest, with the tab word Practise excepted;
 *      codex54.js carries no dash and no mark at or above U+2190, declares
 *      with var and function only, names nobody and ships no key; this gate
 *      carries no dash either
 *   7. the wiring: index.html loads codex54.js once, straight after
 *      codex53.js and before boot.js, with ?v=; sw.js lists it after
 *      codex53.js and its CACHE is codex-v113 or later; the chain rule: every
 *      list in a gate here that names codex53.js names codex54.js straight
 *      after it
 *
 *   node .scripts/check-card.js [jsDir] [--partial]
 *
 * jsDir defaults to this repo's js/; the site's check-wings passes the
 * wing's codex/js. Needs the shared engine (OOT_SHARED, else
 * ../worldtable/static/shared) and the pack (OOT_HOUSE_PACK, else the pack
 * beside the engine). A tree with no codex54.js is SKIPPED. Exits non-zero
 * if any check fails. The last line is the verdict.
 *
 * One layer on (codex57, the Grapes tab at the table, 9 November 2026): where
 * the chain carries codex57.js the search's grapes group is the 75 grape
 * pages and no grape card is synthesised from the Régionale fields, every
 * grape dealing its own profile. --partial accepts a grape table still being
 * written (js/data-grapes-table.js built with --partial): the two counts then
 * follow the grapes the data holds.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ARGS = process.argv.slice(2);
/* --partial: the grape table (js/data-grapes-table.js) is still being written, so the grape counts follow the data */
const PARTIAL = ARGS.indexOf('--partial') >= 0;
const JS = path.resolve(ARGS.find((a) => a.charAt(0) !== '-') || path.join(__dirname, '..', 'js'));
const SHARED = process.env.OOT_SHARED || path.join(__dirname, '..', '..', 'worldtable', 'static', 'shared');
const ENGINE = path.join(SHARED, 'oot-house.js');
const UI_FILE = path.join(SHARED, 'oot-house-ui.js');
const PACK_FILE = process.env.OOT_HOUSE_PACK || path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
for (const f of [ENGINE, UI_FILE, PACK_FILE]) {
  if (!fs.existsSync(f)) {
    console.error('check-card: no ' + path.basename(f) + ' at ' + path.dirname(f) + ' (set OOT_SHARED or OOT_HOUSE_PACK)');
    process.exit(1);
  }
}
if (!fs.existsSync(path.join(JS, 'codex54.js'))) {
  console.log('check-card: no codex54.js in ' + JS + ', SKIPPED');
  process.exit(0);
}
const CH = require(path.join(__dirname, 'cms', 'chain.cjs'));
const NOW = Date.parse('2026-10-03T14:02:00.000Z');

let passed = 0, failed = 0;
function check(what, ok, detail) {
  if (ok) { passed++; console.log('  ok    ' + what); }
  else { failed++; console.log('  FAIL  ' + what + (detail ? '  :: ' + String(detail).slice(0, 600) : '')); }
}
function section(name) { console.log(''); console.log('--- ' + name + ' ---'); }
function seeded(start) {
  let s = start || 12345;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x80000000; };
}

/* The voice rules: check-producers-house.js's voiceProblems, the strictest, as it is. */
const NUMERAL_RE = /\bLevel\s+(I|II|III|IV)\b/;
function voiceProblems(s) {
  const out = [];
  if (s.indexOf(String.fromCharCode(0x2014)) >= 0) out.push('a long dash (U+2014)');
  if (s.indexOf(String.fromCharCode(0x2013)) >= 0) out.push('an en dash (U+2013)');
  if (/&(mdash|ndash|#8212|#8211|#x2014|#x2013);/i.test(s)) out.push('a dash entity');
  if (/\x20-{2}\x20/.test(s)) out.push('a double hyphen');
  if (/practi[cs]e/i.test(s.replace(/(^|[^\w])Practise(?!\w)/g, '$1'))) out.push('the retired word for study'); /* the tab word Practise, that exact token, is the one use let through */
  if (NUMERAL_RE.test(s)) out.push('a level numeral: ' + s.match(NUMERAL_RE)[0]);
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c >= 0x2190) { out.push('a mark U+' + c.toString(16).toUpperCase()); break; }
  }
  return out;
}
function dashProblems(s) { return voiceProblems(s).filter((p) => !/retired|numeral/.test(p)); }
/* what a page shows: its text and the words its controls carry (aria-label, placeholder, title), never its markup */
function shown(html) {
  const said = [...String(html || '').matchAll(/\b(?:aria-label|placeholder|title)="([^"]*)"/g)].map((m) => m[1]);
  return (String(html || '').replace(/<[^>]+>/g, ' ') + ' ' + said.join(' '))
    .replace(/&amp;/g, '&').replace(/&#39;/g, '\'').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ');
}
const text = (html) => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

/* ---------------- a device: the sandbox, the engine, the chain ---------------- */
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
  return { sandbox, ctx, G, store, H };
}

const FILES = CH.chainFiles(JS);
const tick = (ms) => new Promise((r) => setTimeout(r, ms || 10));
async function bootDevice(packText) {
  const D = makeSandbox();
  vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), D.ctx, { filename: 'oot-house.js' });
  vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), D.ctx, { filename: 'oot-house-ui.js' });
  const lib = D.G('OOT.houseLib');
  D.sandbox.OOT.house = lib.createHouseApi(lib.mapStorage(new Map()), { win: D.sandbox, now: () => NOW, rand: seeded(21), from: 'codex' });
  D.sandbox.fetch = () => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(packText), json: () => Promise.resolve(JSON.parse(packText)) });
  for (const f of FILES) {
    try { vm.runInContext(fs.readFileSync(path.join(JS, f), 'utf8'), D.ctx, { filename: f }); }
    catch (e) { console.error('check-card: js/' + f + ' failed to load: ' + e.message); process.exit(1); }
  }
  try { await D.G('typeof V27_LAST !== "undefined" ? V27_LAST : null'); } catch (e) { }
  try { await D.G('typeof V27_BOOT_PACK !== "undefined" ? V27_BOOT_PACK : null'); } catch (e) { }
  await tick(30);
  try { await D.G('typeof V27_WRITING !== "undefined" ? V27_WRITING : null'); } catch (e) { }
  await tick(30);
  D.G('S.view = "cellar"; S._v25area = "brennans";');
  D.draw = (id) => String(D.G('(function () { var st = v28State(); st.open = ' + JSON.stringify(id) + '; st.q = ""; st.sec = ""; return v28CardHtml(' + JSON.stringify(id) + '); })()') || '');
  return D;
}

/* ---------------- the pack, and its copy with a sale in every wine ---------------- */
const packText = fs.readFileSync(PACK_FILE, 'utf8');
const PACK = JSON.parse(packText);
const house = PACK.house;
const str = (s) => (typeof s === 'string' ? s.trim() : '');
const kv = (x, f) => (x && x[f] && x[f].by === 'person' ? x[f].value : null);
const SALES = JSON.parse(packText);
let written = 0;
SALES.house.wines.forEach((w) => {
  const l = w.lines && w.lines.value;
  if (!l || str(l.sale)) return;
  l.sale = 'A sale written by this gate for ' + str(w.name).replace(/\s+/g, ' ') + ': a bright glass that lifts the table. Offer it with confidence and let the guest taste it.';
  written++;
});
const saleText = JSON.stringify(SALES);
const saleOf = (pack, id) => { const w = pack.house.wines.find((x) => x.id === id); return str((kv(w, 'lines') || {}).sale); };

/* the six wines, chosen by the pack's own fields */
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

/* what the dishes say of a wine, read from the pack alone */
function pairingsOf(id) {
  const out = { first: [], second: [], bottles: [], pours: [], zero: [] };
  (house.dishes || []).forEach((d) => {
    const p = kv(d, 'pairing');
    if (!p || typeof p !== 'object') return;
    if (p.wineId === id) {
      out.first.push(d);
      if (p.zeroProofId) out.zero.push(d);
    }
    if (p.secondId === id) out.second.push(d);
    const b = p.bottles && typeof p.bottles === 'object' ? p.bottles : {};
    ['value', 'classic', 'splurge', 'half'].forEach((t) => { if (b[t] && b[t].wineId === id) out.bottles.push({ dish: d, tier: t }); });
  });
  (house.tastings || []).forEach((t) => (t.courses || []).forEach((c) => { if (c && c.pourId === id) out.pours.push({ t, c }); }));
  return out;
}

/* ---------------- reading a card ---------------- */
const ORDER = ['At the table', 'Where we pour it', 'The wine', 'In the Codex', 'Who makes it', 'What it’s made of', 'The five parts', 'On the floor', 'The service note', 'Watch', 'Practise this wine'];
const ALWAYS = ['At the table', 'The wine', 'In the Codex', 'On the floor', 'The service note', 'Practise this wine'];
function cardHeads(html) {
  const out = [];
  const re = /<(h3|summary)\b[^>]*class="[^"]*\bv54-h\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(html))) out.push(m[2].replace(/<[^>]+>/g, '').trim());
  return out;
}
function count(html, re) { return (html.match(re) || []).length; }
function block(html, id) {
  const at = html.indexOf('id="' + id + '"');
  if (at < 0) return '';
  const start = html.lastIndexOf('<', at);
  const tag = /^<(\w+)/.exec(html.slice(start))[1];
  const re = new RegExp('<' + tag + '\\b|</' + tag + '>', 'g');
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    if (m[0].charAt(1) === '/') { depth--; if (depth === 0) return html.slice(start, m.index + m[0].length); }
    else depth++;
  }
  return html.slice(start);
}
/* Where we pour it as drawn: each eyebrow and the text of its rows */
function whereLists(html) {
  const out = {};
  const parts = block(html, 'v54-where').split(/<h4 class="v28-eyebrow">/).slice(1);
  parts.forEach((p) => {
    const head = text(p.slice(0, p.indexOf('</h4>')));
    out[head] = [...p.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => text(m[1]));
  });
  return out;
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

async function main() {
  const A = await bootDevice(packText);
  const n = A.G('(v28House() && v28House().wines || []).length');
  const SHELL = FILES.indexOf('codex54.js') >= 0;
  console.log('check-card: ' + FILES.length + ' scripts from ' + path.join(JS, '..', 'index.html') + ', codex54 at ' + (FILES.indexOf('codex54.js') + 1) + ', the house holds ' + n + ' wines, pack ' + path.basename(PACK_FILE));
  const withSale = house.wines.filter((w) => str((kv(w, 'lines') || {}).sale)).length;
  console.log('check-card: ' + withSale + ' wines in this pack carry a sale; the second device carries ' + (withSale + written) + ' (' + written + ' written here in memory)');
  const B = await bootDevice(saleText);
  const drawn = [], cards = [];

  /* ================================================================ */
  section('1. the load');
  check('the chain index.html loads holds codex54.js', SHELL, FILES.slice(-4).join(' '));
  check('codex54 ran: V54_WORDS, v54W, v54SubjectFor, v54GridFor and the card wrapper are defined', A.G('typeof V54_WORDS === "object" && typeof v54W === "function" && typeof v54SubjectFor === "function" && typeof v54GridFor === "function" && typeof v54CardHtml === "function"'));
  check('the house is read on both devices (' + n + ' wines)', n === house.wines.length && B.G('v28House().wines.length') === n, n);
  check('the style element is written by the layer, id v54-style', fs.readFileSync(path.join(JS, 'codex54.js'), 'utf8').indexOf("css.id = 'v54-style'") > 0);

  /* ================================================================ */
  section('2. the card on six wines');
  check('the six wines are found in the pack (' + WINES.length + ')', WINES.length === 6, WINES.map((x) => x[0]).join(', '));
  for (const [label, w] of WINES) {
    console.log('');
    console.log('  ' + label + ': ' + w.name + ' (' + w.id + ', ' + w.section + ')');
    for (const [dev, D, pack] of [['as given', A, PACK], ['with sales', B, SALES]]) {
      const html = D.draw(w.id);
      cards.push(html);
      const tag = label + ' (' + dev + ')';
      const order = cardHeads(html);
      if (dev === 'as given') console.log('    order: ' + order.join(' | '));
      const P = pairingsOf(w.id);
      const pours = P.first.length + P.second.length + P.bottles.length + P.pours.length + P.zero.length > 0;
      const want = ORDER.filter((h) => order.indexOf(h) >= 0);
      check(tag + ': the blocks in the card\'s order, the six that always stand present, Where we pour it exactly when a dish or a tasting names the wine',
        html.indexOf('v54-card') > 0 && JSON.stringify(order) === JSON.stringify(want) && ALWAYS.every((h) => order.indexOf(h) >= 0) && order[0] === 'At the table' && order[order.length - 1] === 'Practise this wine' && (order.indexOf('Where we pour it') >= 0) === pours,
        order.join(' | '));
      check(tag + ': drawn whole, no undefined, NaN or [object Object], tags balanced', !CH.cleanProblem(html), CH.cleanProblem(html));
      const titleRow = html.slice(0, html.indexOf('</div>', Math.max(0, html.indexOf('v54-titlerow'))));
      const nextTop = count(titleRow, /data-v28="open"[^>]*data-step="1"/g);
      check(tag + ': one Next in the title row, one bare Next on the card', nextTop <= 1 && count(html, />Next<\/button>/g) === nextTop, nextTop);
      const l = kv(pack.house.wines.find((x) => x.id === w.id), 'lines') || {};
      const s45 = str(l.s45), sale = str(l.sale);
      const atTable = block(html, 'v54-table');
      check(tag + ': At the table holds the forty-five large (#v28-s45)', !s45 || /<p class="v28-timed v54-fortyfive" id="v28-s45">/.test(atTable));
      if (sale) {
        const i45 = atTable.indexOf('v54-fortyfive'), iRule = atTable.indexOf('v54-rule'), iSale = atTable.indexOf('class="v54-sale"');
        check(tag + ': the sale stands directly under the forty-five, under its gold rule, in the pack\'s own words', i45 >= 0 && iRule > i45 && iSale > iRule && count(atTable.slice(i45, iRule), /<p\b/g) === 0 && [esc(sale), esc(sale).replace(/&#39;/g, '\'')].some((e) => atTable.indexOf(e) > iSale) && atTable.indexOf('id="v28-s10"') > iSale, [i45, iRule, iSale].join(','));
      } else {
        check(tag + ': no sale block when the pack holds none', html.indexOf('v54-sale') < 0);
      }
      const lines = D.G('(function () { var w = v28House().wines.filter(function (x) { return x.id === ' + JSON.stringify(w.id) + '; })[0]; var l = v28LinesShown(w); return { guest: l.guest || "", shown: !!l.guestShown }; })()');
      check(tag + ': the guest line is gone from the top, The guide\'s line under On the floor when it is not the twenty', atTable.indexOf('v54-guide') < 0 && (!lines.shown || block(html, 'v54-floor').indexOf('<p class="v54-guide">' + esc(lines.guest) + '</p>') >= 0));
      check(tag + ': codex52\'s atlas box is not on the card', html.indexOf('class="v52-atlas"') < 0);
      check(tag + ': What it\'s made of carries no per component film list; Who makes it no library link', block(html, 'v54-madeof').indexOf('v30-list') < 0 && html.indexOf('v38-lib') < 0);
      check(tag + ': Pronounced: for the respellings, never Say it: in a block', html.indexOf('<span class="v28-soft">Say it:</span>') < 0);
      check(tag + ': Practise this wine is one chip row, codex28\'s acts row gone', count(html, /class="v28-btnrow v54-practise-row"/g) === 1 && html.indexOf('v28-acts') < 0);
      const foot = html.slice(html.lastIndexOf('v28-foot'));
      check(tag + ': the footer: Edit, then Previous and Next', foot.indexOf('data-v28="edit"') > 0 && html.lastIndexOf('v28-foot') > html.indexOf('id="v54-practise"'));
      if (dev === 'as given') {
        const prac = block(html, 'v54-practise');
        console.log('    practise: ' + [...prac.matchAll(/<button[^>]*>([^<]*)<\/button>/g)].map((m) => m[1]).join(' | '));
        console.log('    In the Codex: ' + [...block(html, 'v54-codex').matchAll(/data-v54-dest="([^"]+)"/g)].map((m) => m[1]).join(', '));
      }
    }
  }

  /* ================================================================ */
  section('3. every card the house holds');
  const ids = house.wines.map((w) => w.id);
  const bad = { draw: [], dash: [], where: [], fields: [], guest: [], dup: [], map: [], target: [], films: [], next: [] };
  const RESOLVE = 'function (dest) {'
    + ' var i = dest.indexOf(":"), kind = dest.slice(0, i), k = dest.slice(i + 1);'
    + ' if (kind === "grape") return !!v53GrapeFind(k);'
    + ' if (kind === "region") return k.indexOf("country:") === 0 ? !!(v39Country(k.slice(8)) || (typeof v39CountryByKey === "function" && v39CountryByKey(k.slice(8)))) : !!v39Find(k);'
    + ' if (kind === "map") return v25MapSheets().some(function (s) { return s.id === k; });'
    + ' if (kind === "producer") return WINE_PRODUCERS.some(function (p) { return p && p.id === k; });'
    + ' if (kind === "chapter") return /^\\d+$/.test(k) ? !!PRIMERS[Number(k)] : PRIMERS.some(function (p) { return p && p.cat === k; });'
    + ' if (kind === "subject") return v53SubjectList().some(function (s) { return s.id === k; });'
    + ' if (kind === "grid") { var g = v53GridReads()[k]; return !!(g && g.reads && g.reads.length); }'
    + ' if (kind === "illus") return !!CodexTeachingCache.entry(k);'
    + ' if (kind === "culinary") return !!v37Lesson(k);'
    + ' return false; }';
  const resolve = (dest) => { try { return A.G('(' + RESOLVE + ')(' + JSON.stringify(dest) + ')'); } catch (e) { return false; } };
  const kinds = {};
  let firstPicks = 0, seconds = 0, tiers = 0;
  for (const id of ids) {
    const w = house.wines.find((x) => x.id === id);
    let html = '';
    try { html = A.draw(id); } catch (e) { bad.draw.push(id + ' threw ' + e.message); continue; }
    if (!html || html.indexOf('v54-card') < 0 || CH.cleanProblem(html)) { bad.draw.push(id + ': ' + (CH.cleanProblem(html) || 'not the v54 card')); continue; }
    cards.push(html);
    const dp = dashProblems(shown(html));
    if (dp.length) bad.dash.push(id + ': ' + dp.join(', '));
    /* Where we pour it, against the dishes */
    const P = pairingsOf(id);
    const L = whereLists(html);
    const tierWord = (t) => A.G('v54TierWord(' + JSON.stringify(t) + ')');
    const wantFirst = P.first.map((d) => d.name), wantSecond = P.second.map((d) => d.name);
    const wantBottles = P.bottles.map((b) => tierWord(b.tier) + ': ' + b.dish.name);
    const gotFirst = L['First pick for'] || [], gotSecond = L['Second choice for'] || [], gotBottles = L['By the bottle'] || [];
    const gotPours = L['On the tastings'] || [], gotZero = L['Without alcohol'] || [];
    const okList = (got, wantL) => got.length === wantL.length && got.every((g, i) => g.indexOf(wantL[i]) === 0);
    if (!okList(gotFirst, wantFirst) || !okList(gotSecond, wantSecond) || !okList(gotBottles, wantBottles) || gotPours.length !== P.pours.length || gotZero.length !== P.zero.length) {
      bad.where.push(id + ': first ' + gotFirst.length + '/' + wantFirst.length + ', second ' + gotSecond.length + '/' + wantSecond.length + ', bottles ' + gotBottles.length + '/' + wantBottles.length + ', tastings ' + gotPours.length + '/' + P.pours.length + ', zero ' + gotZero.length + '/' + P.zero.length);
    }
    firstPicks += gotFirst.length; seconds += gotSecond.length; tiers += gotBottles.length;
    /* the pack's derived fields say the same, and no first pick is one a dish does not name */
    const fp = kv(w, 'firstPickIds') || [], sf = kv(w, 'secondFor') || [], ow = kv(w, 'offeredWith') || [];
    const same = (a, b) => JSON.stringify(a.slice().sort()) === JSON.stringify(b.slice().sort());
    if (!same(fp, P.first.map((d) => d.id)) || !same(sf, P.second.map((d) => d.id)) || !same(ow.map((o) => o.dishId + ':' + o.tier), P.bottles.map((b) => b.dish.id + ':' + b.tier))) {
      bad.fields.push(id + ': firstPickIds ' + JSON.stringify(fp) + ' against ' + JSON.stringify(P.first.map((d) => d.id)));
    }
    /* the guest line once */
    const g = A.G('(function () { var w = v28House().wines.filter(function (x) { return x.id === ' + JSON.stringify(id) + '; })[0]; var l = v28LinesShown(w); return { guest: l.guest || "", shown: !!l.guestShown, s10: l.s10 || "", s20: l.s20 || "", s45: l.s45 || "" }; })()');
    if (g.guest) {
      /* the line drawn as a whole element (a coaching answer that quotes it is the house's own words, not the line) */
      const whole = (h) => [esc(g.guest), esc(g.guest).replace(/&#39;/g, '\'')].filter((e, i, a) => a.indexOf(e) === i).reduce((t, e) => t + h.split('>' + e + '</').length - 1, 0);
      const times = whole(html);
      const timed = [g.s10, g.s20, g.s45].indexOf(g.guest) >= 0;
      if (times !== 1 || (!timed && whole(block(html, 'v54-floor')) !== 1) || (timed && block(html, 'v54-floor').indexOf('v54-guide') >= 0)) bad.guest.push(id + ': ' + times + ' times, shown ' + g.shown + ', a timed line ' + timed);
    }
    /* In the Codex */
    const doors = [...block(html, 'v54-codex').matchAll(/data-v54-dest="([^"]+)"/g)].map((m) => m[1]);
    const dup = doors.filter((d, i) => doors.indexOf(d) !== i);
    if (dup.length) bad.dup.push(id + ': ' + dup.join(', '));
    if (doors.filter((d) => /^map:/.test(d)).length > 1) bad.map.push(id);
    doors.forEach((d) => { const k = d.slice(0, d.indexOf(':')); kinds[k] = (kinds[k] || 0) + 1; if (!resolve(d)) bad.target.push(id + ' ' + d); });
    /* films once, one Next */
    const vids = [...html.matchAll(/data-video="([^"]+)"/g)].map((m) => m[1]);
    if (new Set(vids).size !== vids.length) bad.films.push(id);
    if (count(html, />Next<\/button>/g) > 1) bad.next.push(id);
  }
  console.log('  doors In the Codex across the list: ' + Object.keys(kinds).map((k) => k + ' ' + kinds[k]).join(', '));
  console.log('  Where we pour it across the list: ' + firstPicks + ' first picks, ' + seconds + ' second choices, ' + tiers + ' bottle tiers');
  check('every card draws as the v54 card, whole (' + ids.length + ')', !bad.draw.length, bad.draw.slice(0, 4).join('; '));
  check('every card carries no dash and no mark at or above U+2190', !bad.dash.length, bad.dash.slice(0, 4).join('; '));
  check('Where we pour it on every card equals the dishes\' own pairings: first picks, second choices, the bottle tiers with their words, the tastings and the drinks without alcohol', !bad.where.length, bad.where.slice(0, 4).join('; '));
  check('every wine\'s firstPickIds, secondFor and offeredWith are the dishes\' own, so no card shows a false first pick', !bad.fields.length, bad.fields.slice(0, 3).join('; '));
  check('the guest line once on every card: under On the floor as The guide\'s line, or as the timed line it is word for word', !bad.guest.length, bad.guest.slice(0, 4).join('; '));
  check('In the Codex: one door per destination on every card', !bad.dup.length, bad.dup.slice(0, 4).join('; '));
  check('In the Codex: one map at most on every card', !bad.map.length, bad.map.slice(0, 6).join(', '));
  check('In the Codex: every door\'s target resolves (' + Object.keys(kinds).reduce((s, k) => s + kinds[k], 0) + ' doors)', !bad.target.length, bad.target.slice(0, 6).join('; '));
  check('each film once on every card', !bad.films.length, bad.films.slice(0, 6).join(', '));
  check('one bare Next at most on every card', !bad.next.length, bad.next.slice(0, 6).join(', '));
  /* each door kind opens its screen, as a tap would */
  const sample = {};
  for (const id of ids) {
    const html = A.draw(id);
    for (const m of block(html, 'v54-codex').matchAll(/<button\b[^>]*\bdata-v54-dest="([a-z]+):[^"]*"[^>]*>/g)) {
      if (!sample[m[1]]) sample[m[1]] = { id, tag: m[0] };
    }
    if (Object.keys(sample).length >= Object.keys(kinds).length) break;
  }
  const VIEW = { grape: 'grape', region: 'region|country', map: 'worldmap', producer: 'producers', chapter: 'primer', subject: 'cmssubject', grid: 'griddrill', illus: 'illustrations', culinary: 'culinary' };
  const opened = Object.keys(sample).map((kind) => {
    const s = sample[kind];
    const attrs = {};
    for (const m of s.tag.matchAll(/(data-[\w-]+)="([^"]*)"/g)) attrs[m[1]] = m[2].replace(/&amp;/g, '&');
    const act = attrs['data-v28'];
    const got = A.G('(function () { var st = v28State(); st.open = ' + JSON.stringify(s.id) + '; S.view = "cellar"; S._v25area = "brennans";'
      + ' var a = ' + JSON.stringify(attrs) + '; var node = { getAttribute: function (k) { return Object.prototype.hasOwnProperty.call(a, k) ? a[k] : null; }, closest: function () { return node; } };'
      + ' try { v28Act(' + JSON.stringify(act) + ', node); } catch (e) { return "threw " + e.message; } var v = S.view; S.view = "cellar"; return v; })()');
    return [kind, got, new RegExp('^(' + (VIEW[kind] || '.+') + ')$').test(got)];
  });
  console.log('  doors opened: ' + opened.map((o) => o[0] + ' to ' + o[1]).join(', '));
  check('each kind of door In the Codex opens its screen, as a tap would (' + opened.length + ' kinds: ' + Object.keys(VIEW).join(', ') + ')', opened.length === Object.keys(kinds).length && Object.keys(VIEW).every((k) => sample[k]) && opened.every((o) => o[2]), opened.filter((o) => !o[2]).map((o) => o[0] + ' ' + o[1]).join('; '));

  /* ================================================================ */
  section('4. the flash card back');
  for (const [dev, D, pack] of [['as given', A, PACK], ['with sales', B, SALES]]) {
    const back = D.G('(function () { var h = v28House(); var w = h.wines.filter(function (x) { return v28CardOf(x, h); })[0]; var c = v28CardOf(w, h); return { id: w.id, s10: c.back.s10, sale: c.back.sale || "" }; })()');
    const bsale = saleOf(pack, back.id);
    check('the flash card back carries the sale when the pack has one, and none otherwise (' + dev + (bsale ? ', a sale' : ', no sale') + ')', bsale ? back.sale === bsale : !back.sale, JSON.stringify(back).slice(0, 200));
    const face = String(D.G('(function () { var h = v28House(); var w = h.wines.filter(function (x) { return v28CardOf(x, h); })[0]; S._v28deck = { ids: [w.id], idx: 0, flipped: true, got: 0, again: 0, label: "x", missed: [], from: null, pushed: false }; var out = v28DeckHtml(); S._v28deck = null; return out; })()') || '');
    cards.push(face);
    check('codex28\'s deck draws the sale under the ten on the flipped face (' + dev + ')', bsale ? face.indexOf('v54-sale') > face.indexOf('v28-ten') && face.indexOf('v28-ten') > 0 : face.indexOf('v54-sale') < 0);
    const run = String(D.G('(function () { var h = v28House(); var w = h.wines.filter(function (x) { return v28CardOf(x, h); })[0]; return v32CardFace({ kind: "house", c: v28CardOf(w, h) }, { flip: true, dir: "n2p" }) || ""; })()') || '');
    check('codex32\'s runs draw the sale under the ten on a house card\'s back (' + dev + ')', bsale ? run.indexOf('v54-sale') > run.indexOf('v28-ten') && run.indexOf('v28-ten') > 0 : run.indexOf('v54-sale') < 0, run.slice(0, 160));
  }

  /* ================================================================ */
  section('5. the flow');
  const G = A.G;
  const rows = (html) => {
    const out = [];
    const re = /<button\b([^>]*)>([\s\S]*?)<\/button>/g;
    let m;
    while ((m = re.exec(String(html || '')))) {
      const attrs = m[1], body = m[2];
      const name = (/<span class="v25row-name">([\s\S]*?)<\/span>/.exec(body) || [])[1];
      const line = (/<span class="v25row-line">([\s\S]*?)<\/span>/.exec(body) || [])[1];
      const route = ['data-go', 'data-arg', 'data-v32', 'data-deck', 'data-k', 'data-v48-route', 'data-v53'].map((k) => {
        const a = new RegExp(k + '="([^"]*)"').exec(attrs);
        return a ? k.replace('data-', '') + '=' + a[1] : '';
      }).filter(Boolean).join(' ');
      out.push({ name: text(name != null ? name : body), line: text(line || ''), route, attrs });
    }
    return out;
  };
  const heads = (html) => [...String(html || '').matchAll(/<(h2|h3|summary)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => text(m[2]));
  const BUILD = {
    bank: 'v53BankHtml()',
    quizzes: 'v32QuizzesHtml()',
    flashcards: 'v32FlashcardsHtml()',
    grapes: 'v53GrapesRootHtml()',
    library: 'v32LibraryHtml()',
    level: 'v32LevelHtml(activeLevel)',
    rehearsal: 'v48HubHtml("houserehearsal", v41House())',
    studies: 'v48HubHtml("housestudies", v41House())'
  };
  const VIEWOF = { level: 'level', rehearsal: 'houserehearsal', studies: 'housestudies' };
  const drawPage = (k) => { const prev = G('S.view'); G('S.view = ' + JSON.stringify(VIEWOF[k] || k)); const html = String(G(BUILD[k]) || ''); G('S.view = ' + JSON.stringify(prev)); return html; };
  const Hs = {};
  Object.keys(BUILD).forEach((k) => { Hs[k] = drawPage(k); drawn.push(Hs[k]); });
  check('the flow\'s eight pages draw whole (the bank, #/quizzes, Practise, Grapes, the Library, the level page, Service rehearsal, Wine studies)', Object.keys(Hs).every((k) => Hs[k].length > 200 && !CH.cleanProblem(Hs[k])), Object.keys(Hs).filter((k) => CH.cleanProblem(Hs[k])).map((k) => k + ': ' + CH.cleanProblem(Hs[k])).join('; '));
  const Lv = G('v53Lv().name');
  const names = (html) => rows(html).map((r) => r.name);
  const routes = (html) => rows(html).map((r) => r.route);
  const sectionOf = (html, id) => { const at = html.indexOf('id="' + id + '"'); if (at < 0) return ''; const end = html.indexOf('</section>', at); return html.slice(at, end < 0 ? html.length : end); };
  const goRow = (list, key) => list.filter((r) => new RegExp('(^| )go=' + key + '( |$)').test(r.route));
  const gdeck = (r) => /deck=grapes(:[rw]|-all)?( |$)/.test(r.route);

  /* the question bank and #/quizzes */
  const BK = rows(Hs.bank);
  const bh = heads(Hs.bank);
  console.log('  the bank: ' + bh.join(' | '));
  check('the bank is named The ' + Lv + ' question bank', bh[0] === 'The ' + Lv + ' question bank', bh[0]);
  const order = ['The whole paper', 'The regions', 'Service references', 'Hands on'].map((h) => bh.indexOf(h));
  check('the bank gains The whole paper, The regions, Service references and Hands on, in that order, after the domains', order.every((i, k) => i > 1 && (k === 0 || i > order[k - 1])), order.join(','));
  check('the bank\'s lifted rows are the chain\'s own Quizzes rows (codex32 and codex39)', goRow(BK, 'weak').length === 1 && goRow(BK, 'regiondrill').length >= 2 && goRow(BK, 'servicedrill').length === 1 && goRow(BK, 'service').length === 1 && goRow(BK, 'grid').length === 1);
  check('the level test once, in the bank\'s lead', BK.filter((r) => /k=leveltest/.test(r.route)).length === 1);
  check('no Blind flight, no codex39 45 minute tasting, no second endless row in the bank', !goRow(BK, 'flight').length && !goRow(BK, 'villagetasting').length && !goRow(BK, 'endless').length);
  check('codex39\'s 45 minute run and Blind flight still answer their addresses', G('typeof V25_GO.villagetasting === "function" && typeof V25_GO.flight === "function"'));
  check('#/quizzes draws the bank: the same title and the same rows', heads(Hs.quizzes)[0] === 'The ' + Lv + ' question bank' && JSON.stringify(routes(Hs.quizzes)) === JSON.stringify(routes(Hs.bank)), heads(Hs.quizzes)[0]);
  check('#/quizzes carries its own scope chip (scope-all acts on the quizzes root)', /data-v32="scope-all"|data-v32="scope-one"/.test(Hs.quizzes) && Hs.quizzes.indexOf('v54-quizbank') > 0);
  check('the main name of #/quizzes is the bank\'s', G('(function () { var w = S.view; S.view = "quizzes"; var n = v25MainName(); S.view = w; return n; })()') === 'The ' + Lv + ' question bank');

  /* the Practise row */
  const P = rows(Hs.flashcards);
  console.log('  Practise: ' + heads(Hs.flashcards).join(' | '));
  check('Practise: the rounds row points at the bank, no row to Quizzes', P.some((r) => /rounds$/.test(r.name) && /go=bank/.test(r.route)) && !goRow(P, 'quizzes').length);
  check('Practise: no grape deck (Grapes owns them)', !P.some(gdeck), P.filter(gdeck).map((r) => r.name).join(','));
  check('Practise: no Blind flight and no level test', !goRow(P, 'flight').length && !P.some((r) => /k=leveltest/.test(r.route)));
  check('Practise: no empty group left (Reference cards leaves whole)', heads(Hs.flashcards).indexOf('Reference cards') < 0 && !/<section class="v32-group[^"]*"[^>]*><h3[^>]*>[^<]*<\/h3><\/section>/.test(Hs.flashcards));
  check('Practise: Due today\'s button reads Start today’s questions', P.some((r) => r.name === 'Start today’s questions'));

  /* Grapes' Tasting */
  const T = names(sectionOf(Hs.grapes, 'v53-g-tasting'));
  console.log('  Grapes, Tasting: ' + T.join(' | '));
  const tRows = rows(sectionOf(Hs.grapes, 'v53-g-tasting'));
  check('Grapes\' Tasting reads The Court’s grid drill, The Village tasting, Warm up: call the structure, The deductive grid', JSON.stringify(T) === JSON.stringify(['The Court’s grid drill', 'The Village tasting', 'Warm up: call the structure', 'The deductive grid']), T.join(' | '));
  check('the Village tasting is the 30 minute one on the Court\'s grid', tRows.some((r) => /go=courttasting/.test(r.route) && /30 minutes/.test(r.line)));
  check('Warm up keeps the Blind Grid\'s line', tRows.some((r) => r.name === 'Warm up: call the structure' && /go=grid/.test(r.route) && r.line === 'The structure called from its sensations, then the grape'));
  const C = rows(sectionOf(Hs.grapes, 'v53-g-cards'));
  check('Grapes\' Cards holds the four grape decks', C.filter(gdeck).length === 4, C.map((r) => r.route).join(','));
  check('no Blind flight door on Grapes, the bank or Service rehearsal; its view kept', Hs.grapes.indexOf('data-go="flight"') < 0 && !goRow(BK, 'flight').length && !goRow(rows(Hs.rehearsal), 'flight').length && G('typeof V25_VIEWS.flight === "function" || typeof V25_GO.flight === "function"'));
  const tg = Object.keys(Hs).filter((k) => Hs[k].indexOf('data-go="tastegrid"') >= 0);
  check('the method shows as How to taste: the method in the reading rooms only', JSON.stringify(tg) === JSON.stringify(['library']) && rows(Hs.library).filter((r) => r.name === 'How to taste: the method').length === 1 && Hs.library.indexOf('Study the grid') < 0, tg.join(','));

  /* the level page and the Library */
  const LV = rows(Hs.level);
  check('the level page has no search box', Hs.level.indexOf('id="v32-q"') < 0 && Hs.level.indexOf('v32-search-h') < 0);
  check('the level page loses the World Map row and keeps the Workshop row', !goRow(LV, 'worldmap').length && goRow(LV, 'techniques').length === 1);
  const LB = rows(Hs.library);
  console.log('  the Library: ' + heads(Hs.library).filter((h) => /^(Practise|The reading rooms|The atlas)$/.test(h)).join(' | '));
  check('the Library loses the Terroir row', !goRow(LB, 'terroir').length);
  /* codex55: the atlas is the Wine Atlas tab again, so the Library's line ends at the reading rooms */
  check('the Library\'s line reads For ' + Lv + ': Practise and the question bank first, then the reading rooms.', text(Hs.library).indexOf('For ' + Lv + ': Practise and the question bank first, then the reading rooms.') >= 0);
  check('the line for every level is as true', G('v32W("libLineAll")') === 'For every level: Practise and the question bank first, then the reading rooms.');
  check('the Library\'s search box stays, its placeholder A chapter, a grape, a place, a producer or a subject', /id="cf-in"/.test(Hs.library) && Hs.library.indexOf('placeholder="A chapter, a grape, a place, a producer or a subject"') > 0);
  check('the Library\'s Practise section follows the root (no grape decks, the rounds to the bank)', !LB.some(gdeck) && LB.some((r) => /rounds$/.test(r.name) && /go=bank/.test(r.route)));
  const another = G('(function () { var seen = null; var was = v32Go; v32Go = function (r) { seen = r; }; try { v32Act("another", null); } finally { v32Go = was; } return JSON.stringify(seen); })()');
  check('Another deck returns to the Library', another === '{"view":"library"}', another);

  /* Brennan's rooms */
  const R = rows(Hs.rehearsal);
  console.log('  Service rehearsal: ' + heads(Hs.rehearsal).filter((h) => !/^(Wine list|Wine studies|Service rehearsal|House reference)$/.test(h)).join(' | '));
  check('the house due is one row, Wine cards to revisit, dealt by codex53\'s house step', R.filter((r) => r.name === 'Wine cards to revisit').length <= 1 && !/Start the wines due/.test(Hs.rehearsal) && (R.some((r) => r.name === 'Wine cards to revisit' && /v53=housedue/.test(r.route)) || G('v53HouseDue().a') === 0));
  check('no second Wine cards to revisit deck (list-weak) and no schedule note', !R.some((r) => /deck=list-weak/.test(r.route)) && Hs.rehearsal.indexOf('Due today follows') < 0);
  check('the producers\' deck group is named Producer cards', heads(Hs.rehearsal).some((h) => /^Producer cards/.test(h)) && heads(Hs.rehearsal).every((h) => !/^Who makes our wines/.test(h)));
  const own0 = G('v54OwnCount()');
  check('with no bottles of her own: no Recite your cellar, no Quiz your cellar (the house\'s ' + n + ' never count)', own0 === 0 && !goRow(R, 'cellarrecite').length && !goRow(R, 'cellardrill').length, own0);
  G('ST.cellar = (ST.cellar || []).concat([{ id: "check-own", name: "Check sentinel", producer: "Own wine", region: "Test place", grapes: "Chardonnay" }]);');
  const own1 = G('v54OwnCount()');
  const R1 = drawPage('rehearsal');
  const ownSec = (() => { const at = R1.indexOf('data-v48-keep="v54-own"'); return at < 0 ? '' : R1.slice(at, R1.indexOf('</details>', at)); })();
  G('ST.cellar = ST.cellar.filter(function (w) { return w.id !== "check-own"; });');
  check('with one bottle of her own: Your own bottles holds Recite your cellar and Quiz your cellar', own1 === 1 && /Your own bottles/.test(ownSec) && goRow(rows(ownSec), 'cellarrecite').length === 1 && goRow(rows(ownSec), 'cellardrill').length === 1, own1 + ' ' + text(ownSec).slice(0, 160));
  const W = rows(Hs.studies);
  check('Wine studies without the World Map, the grape study cards and the service reference', !W.some((r) => /route=worldmap|route=serviceref/.test(r.route) || gdeck(r)) && Hs.studies.indexOf('wider-study') < 0);
  check('the Culinary Companion stays in Wine studies, owned by the house', W.some((r) => /v48-route=culinary/.test(r.route)) && G('V32_OWNER.culinary') === 'brennans');

  /* the parents */
  const parent = (setup) => G('(function () { var keep = { v: S.view, deck: S._v32deck, run: S._v32run, from: S._v54from, sec: S.section }; try { ' + setup + '; return JSON.stringify(v32ParentRoute()); } catch (e) { return "throws " + e.message; } finally { S.view = keep.v; S._v32deck = keep.deck; S._v32run = keep.run; S._v54from = keep.from; S.section = keep.sec; } })()');
  const startFrom = (fromSetup, runView) => parent(fromSetup + '; V54_FROM.prev = null; v54NoteFrom(); S.view = ' + JSON.stringify(runView) + '; v54NoteFrom()');
  const PARENTS = [
    ['quizzes', 'S.view = "quizzes"', '{"view":"library"}'],
    ['quiz, started from the bank', null, '{"view":"bank"}', () => startFrom('S.view = "bank"', 'quiz')],
    ['results, after a quiz from the bank', null, '{"view":"bank"}', () => parent('S.view = "bank"; V54_FROM.prev = null; v54NoteFrom(); S.view = "quiz"; v54NoteFrom(); S.view = "results"; v54NoteFrom()')],
    ['quiz, started from #/quizzes', null, '{"view":"quizzes"}', () => startFrom('S.view = "quizzes"', 'quiz')],
    ['quiz, a CMS drill from its subject', null, '{"view":"cmssubject","arg":"bordeaux"}', () => startFrom('S.view = "cmssubject"; S._v53subject = "bordeaux"', 'quiz')],
    ['quiz, a grape drill from its page', null, '{"view":"grape","arg":"riesling"}', () => startFrom('S.view = "grape"; S._v53grape = "riesling"', 'quiz')],
    ['quiz, Quiz our wine list from Service rehearsal', null, '{"view":"houserehearsal"}', () => startFrom('S.view = "houserehearsal"', 'quiz')],
    ['quiz, the quick quiz from the Practise root', null, '{"view":"flashcards"}', () => startFrom('S.view = "flashcards"', 'quiz')],
    ['grid (the Blind Grid), from Grapes', null, '{"view":"grapes"}', () => startFrom('S.view = "grapes"', 'grid')],
    ['service (the Service Ritual), from the Library', null, '{"view":"library"}', () => startFrom('S.view = "library"', 'service')],
    ['quiz, on a cold address', 'S.view = "quiz"; S._v54from = null', '{"view":"bank"}'],
    ['results, on a cold address', 'S.view = "results"; S._v54from = null', '{"view":"bank"}'],
    ['housesay', 'S.view = "housesay"', '{"view":"houserehearsal"}'],
    ['houseguest', 'S.view = "houseguest"', '{"view":"houserehearsal"}'],
    ['houserecite', 'S.view = "houserecite"', '{"view":"houserehearsal"}'],
    ['cellarrecite', 'S.view = "cellarrecite"', '{"view":"houserehearsal"}'],
    ['deck list (a house deck)', 'S.view = "deck"; S._v32deck = "list"', '{"view":"houserehearsal"}'],
    ['deck bottles:red-burgundy', 'S.view = "deck"; S._v32deck = "bottles:red-burgundy"', '{"view":"houserehearsal"}'],
    ['deck producers', 'S.view = "deck"; S._v32deck = "producers"', '{"view":"houserehearsal"}'],
    ['the house due run', 'S.view = "housedeck"; S._v32run = { v32: true, deckId: "due", kind: "house" }', '{"view":"houserehearsal"}'],
    ['deck grapes', 'S.view = "deck"; S._v32deck = "grapes"', '{"view":"grapes"}'],
    ['deck grapes-all', 'S.view = "deck"; S._v32deck = "grapes-all"', '{"view":"grapes"}'],
    ['deck grape:riesling (its page, codex53)', 'S.view = "deck"; S._v32deck = "grape:riesling"', '{"view":"grape","arg":"riesling"}'],
    ['deck cms:bordeaux (its subject, codex53)', 'S.view = "deck"; S._v32deck = "cms:bordeaux"', '{"view":"cmssubject","arg":"bordeaux"}'],
    ['culinary', 'S.view = "culinary"', '{"view":"housestudies"}'],
    ['cellarcompass (unchanged)', 'S.view = "cellarcompass"', '{"view":"level"}'],
    ['deck cellar-compass (unchanged)', 'S.view = "deck"; S._v32deck = "cellar-compass"', '{"view":"cellarcompass"}'],
    ['bank', 'S.view = "bank"', '{"view":"library"}'],
    ['courttasting', 'S.view = "courttasting"', '{"view":"grapes"}']
  ];
  const wrongP = [];
  PARENTS.forEach(([label, setup, want, fn]) => {
    const got = fn ? fn() : parent(setup);
    console.log('  parent of ' + label.padEnd(50) + ' ' + got);
    if (got !== want) wrongP.push(label + ': ' + got + ', not ' + want);
  });
  check('the parents table: every screen climbs where the flow says (' + PARENTS.length + ' rows)', !wrongP.length, wrongP.join('; '));
  check('the lit word of a grape deck is Grapes wherever it opened', G('(function () { var k = { v: S.view, d: S._v32deck, f: S._v53from }; S.view = "deck"; S._v32deck = "grapes:w"; S._v53from = null; var w = v25NavWord(); S.view = k.v; S._v32deck = k.d; S._v53from = k.f; return w; })()') === 'grapes');
  check('a run started by a real draw keeps its starting screen (render wrapped)', (() => { try { return G('(function () { S.view = "bank"; render(); var cat = Object.keys(cats())[0]; V25_GO.drill(cat); var r = S.view + " " + JSON.stringify(v32ParentRoute()); S.view = "home"; render(); return r; })()') === 'quiz {"view":"bank"}'; } catch (e) { return false; } })());

  /* the search */
  const ix = JSON.parse(G('JSON.stringify(Object.keys(v44Index()).map(function (k) { var g = v44Index()[k]; return [k, g.length]; }))'));
  console.log('  the search index: ' + ix.map(([k, len]) => k + ' ' + len).join(', '));
  const ixm = Object.fromEntries(ix);
  check('the index gains the 44 subjects', ixm.subjects === 44, ixm.subjects);
  /* codex57 (the Grapes tab at the table): the table adds the grapes the Codex lacked and gives the twelve the Régionale
     book alone held a profile, so the whole build is 75 pages and no card is written from the Régionale fields. Under
     --partial (the data still being written) the counts follow the grapes the data holds; a chain with no codex57.js
     keeps codex53's own counts. */
  const HAS57 = FILES.indexOf('codex57.js') >= 0;
  const GT = HAS57 ? JSON.parse(G('JSON.stringify((function () { var t = (typeof GRAPE_TABLE !== "undefined" && GRAPE_TABLE) || {}; return Object.keys(t).map(function (k) { return t[k] && t[k].status; }); })())')) : [];
  const gtNew = GT.filter((x) => x === 'new').length, gtThin = GT.filter((x) => x === 'thin').length;
  const NGRAPES = !HAS57 ? 59 : (PARTIAL ? 59 + gtNew : 75);
  const NSYNTH = !HAS57 ? 12 : (PARTIAL ? 12 - gtThin : 0);
  check('the grapes group is the ' + NGRAPES + ' grape pages, each opening its page', ixm.grapes === NGRAPES && G('v44Index().grapes.every(function (e) { return e.kind === "route" && e.arg === "grape" && !!v53GrapeFind(e.extra); })'), ixm.grapes);
  const hitsB = JSON.parse(G('JSON.stringify(v44Results("bordeaux").map(function (g) { return [g.key, g.title, g.rows.length]; }))'));
  console.log('  "bordeaux": ' + hitsB.map((g) => g[1] + ' ' + g[2]).join(' | '));
  check('a search for bordeaux finds the Court’s subject, in a group of its own', hitsB.some((g) => g[0] === 'subjects' && g[1] === 'The Court’s subjects'));
  const pin = JSON.parse(G('JSON.stringify((v44Results("pinot noir").filter(function (g) { return g.key === "grapes"; })[0] || { rows: [] }).rows.slice(0, 2).map(function (r) { return [r.title, r.kind, r.arg, r.extra]; }))'));
  check('a grape hit opens the grape\'s page (route grape/{slug})', pin.length && pin[0][1] === 'route' && pin[0][2] === 'grape' && pin[0][3] === 'pinot-noir', JSON.stringify(pin));
  check('the grapes group is titled Grapes', G('(v44Results("riesling").filter(function (g) { return g.key === "grapes"; })[0] || {}).title') === 'Grapes');
  check('the search names The World Map and How to taste: the method', G('v44Index().learn.some(function (e) { return e.arg === "worldmap" && e.title === "The World Map"; }) && v44Index().learn.some(function (e) { return e.arg === "tastegrid" && e.title === "How to taste: the method"; })'));
  check('the index\'s walk holds groups of rows and nothing else', G('Object.keys(v44Index()).every(function (k) { return Array.isArray(v44Index()[k]); })'));

  /* the stale words */
  check('the World Map named in our rows (codex39\'s row word, codex42\'s path step)', G('V39_WORDS.atlasRow') === 'The World Map' && G('V42_PATHS.every(function (p) { return (p.steps || []).every(function (s) { return String(s[2]).indexOf("Wine Atlas") < 0; }); })'));
  check('Keep one on Our Wine List reworded', G('V27_SAY_NONE').indexOf('Our Wine List') < 0 && /wine list/.test(G('V27_SAY_NONE')), G('V27_SAY_NONE'));
  const synth = JSON.parse(G('JSON.stringify(v53GrapeJoin().list.filter(function (r) { return !r.g; }).map(function (r) { return r.slug; }))'));
  const faces = JSON.parse(G('JSON.stringify(v53GrapeJoin().list.filter(function (r) { return !r.g; }).map(function (r) { var d = v32DeckDef("grape:" + r.slug); var c = d.cards[0]; return c ? v32CardFace(c, { flip: true, dir: "n2p" }) : ""; }))'));
  check(NSYNTH ? 'the ' + NSYNTH + ' synthetic "No comparison is written" lines are dropped from the grape cards' : 'no grape card is synthesised: every grape of the join deals its own profile (codex57)', synth.length === NSYNTH && faces.every((f) => f && f.indexOf('No comparison is written') < 0 && f.indexOf('undefined') < 0), synth.length + ': ' + synth.join(' '));
  const cardsAll = JSON.parse(G('JSON.stringify(v53GrapeJoin().list.map(function (r) { var d = v32DeckDef("grape:" + r.slug); var c = d.cards[0]; var f = c ? v32CardFace(c, { flip: true, dir: "n2p" }) : ""; return [r.slug, d.cards.length, c ? c.id === r.name : false, f.indexOf("No comparison is written") < 0 && f.indexOf("undefined") < 0 && f.length > 0]; }))'));
  check('every grape of the join (' + cardsAll.length + ') deals one card under its own name, its face whole', cardsAll.length === NGRAPES && cardsAll.every((c) => c[1] === 1 && c[2] && c[3]), cardsAll.filter((c) => !(c[1] === 1 && c[2] && c[3])).map((c) => c[0]).join(' '));
  check('Our List keeps its stored key (V27_CELLAR_SECTION)', G('V27_CELLAR_SECTION') === 'Our List');

  /* the owner's rule (2 November 2026): the tool is the owner's own and carries no disclaimer, so codex25's
     non-affiliation line, kept as a constant, is shown on no screen */
  const NOTICE = String(G('typeof V25_NONAFFIL === "string" ? V25_NONAFFIL : ""'));
  const noNotice = (html) => !!NOTICE && String(html || '').indexOf(NOTICE) < 0 && !/affiliated|endorsed/i.test(text(html));
  const drawAs = (view, expr) => String(G('(function () { var w = S.view; S.view = ' + JSON.stringify(view) + '; try { return ' + expr + '; } finally { S.view = w; } })()') || '');
  check('the notice is kept as codex25\'s constant (V25_NONAFFIL), so these checks have a line to look for', NOTICE.length > 40, NOTICE);
  const SCREENS = { home: drawAs('home', 'v25HomeHtml()'), level: Hs.level, cms: drawAs('cms', 'v53CmsRootHtml()'), library: Hs.library, more: drawAs('more', 'v32MoreHtml()') };
  console.log('  the notice on: ' + Object.keys(SCREENS).map((k) => k + ' ' + (noNotice(SCREENS[k]) ? 'no' : 'YES') + ' (' + SCREENS[k].length + ')').join(', '));
  check('no screen shows the notice: home, the level page, the CMS root, the Library and More, each drawn whole', Object.keys(SCREENS).every((k) => SCREENS[k].length > 200 && noNotice(SCREENS[k])), Object.keys(SCREENS).filter((k) => !(SCREENS[k].length > 200 && noNotice(SCREENS[k]))).join(', '));
  check('the CMS root keeps its exam day and its subjects', SCREENS.cms.indexOf('data-go="cmsday"') >= 0 && /cmssubject/.test(SCREENS.cms));
  check('More drops its About group, which held the notice alone, and keeps Learning and help', SCREENS.more.indexOf('v32-more-about') < 0 && SCREENS.more.indexOf('v42-more-learning') >= 0);
  const colo = G('(function () { var added = 0, removed = 0, out = { removeChild: function () { removed++; } }; var foot = { className: "colophon", textContent: V25_NONAFFIL, parentNode: out }; var p = { className: "nonaffil", textContent: V25_NONAFFIL, parentNode: foot }; foot.removeChild = function () { removed++; }; var app = { querySelector: function () { return null; }, querySelectorAll: function () { return [foot, p]; }, appendChild: function (c) { added++; return c; }, insertBefore: function (c) { added++; return c; } }; v25Colophon(app); return added + " " + removed; })()');
  check('home\'s colophon (v25Colophon) draws nothing and takes off one already drawn', /^0 [12]$/.test(colo), colo);

  /* ================================================================ */
  section('6. voice');
  const L54 = fs.readFileSync(path.join(JS, 'codex54.js'), 'utf8');
  const unescaped = L54.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
  const words = JSON.parse(G('JSON.stringify(V54_WORDS)'));
  const wp = voiceProblems(Object.keys(words).map((k) => words[k]).join('\n'));
  check('V54_WORDS (' + Object.keys(words).length + ' strings) passes the strictest voice sweep, the tab word Practise excepted', !wp.length, wp.join(', '));
  const vp = voiceProblems(drawn.map(shown).join('\n'));
  check('the flow\'s pages as codex54 draws them (' + drawn.length + ') pass the strictest voice sweep whole, the tab word Practise excepted', !vp.length, vp.join(', '));
  /* a card's own words: its headings, eyebrows, disclosures, chips and buttons and its controls' labels (the pack's fields within are the house's, drawn as it wrote them) */
  const own = (html) => [...String(html || '').matchAll(/<(h2|h3|h4|summary|button)\b[^>]*>([\s\S]*?)<\/\1>|<p class="v28-eyebrow[^"]*">([\s\S]*?)<\/p>/g)].map((m) => shown(m[2] || m[3] || '')).join('\n');
  const cp = voiceProblems(cards.map(own).join('\n'));
  check('the words codex54 draws on every card and flash face (' + cards.length + ': headings, eyebrows, disclosures, chips, buttons) pass the strictest voice sweep, the tab word Practise excepted', !cp.length, cp.join(', '));
  const sp = dashProblems(L54).concat(dashProblems(unescaped));
  check('codex54.js (its escapes read as the characters they are): no dash, no mark at or above U+2190', !sp.length, sp.join(', '));
  check('codex54.js names no level by numeral', !/\bLevel\s+(I|II|III|IV|[1-4])\b/.test(L54));
  check('codex54.js declares with var and function only, no arrow, no let, const or class', !/^\s*(let|const|class)\s/m.test(L54) && L54.indexOf('=>') < 0);
  check('codex54.js names nobody and ships no key', !/Lizzy|sk-ant|api[_-]?key/i.test(L54));
  check('codex54.js edits no earlier layer: every wrapper is typeof guarded', (L54.match(/^var _v54\w+ = (\w+);$/gm) || []).every((line) => { const t = /= (\w+);$/.exec(line)[1]; return L54.indexOf('typeof ' + t + ' === \'function\'') >= 0; }));
  const selfP = dashProblems(fs.readFileSync(__filename, 'utf8'));
  check('check-card.js itself: no dash, no mark at or above U+2190', !selfP.length, selfP.join(', '));

  /* ================================================================ */
  section('7. the wiring and the chain rule');
  const index = path.join(JS, '..', 'index.html');
  const sw = path.join(JS, '..', 'sw.js');
  if (fs.existsSync(index) && fs.existsSync(sw)) {
    const sources = [...fs.readFileSync(index, 'utf8').matchAll(/<script\b[^>]*\bsrc=["'](js\/[^"']+)["'][^>]*>\s*<\/script>/g)].map((m) => m[1]);
    const scripts = sources.map((s) => s.slice(3).split(/[?#]/)[0]);
    const at = scripts.indexOf('codex53.js');
    check('index.html loads codex54.js once, straight after codex53.js and before boot.js, with ?v=', at >= 0 && scripts[at + 1] === 'codex54.js' && scripts.indexOf('boot.js') > at + 1 /* codex55 and any later layer between */
      && scripts.filter((s) => s === 'codex54.js').length === 1 && /^js\/codex54\.js\?v=\d+$/.test(sources[at + 1]), scripts.slice(Math.max(0, at - 1), at + 3).join(' '));
    const s = fs.readFileSync(sw, 'utf8');
    const v = Number((s.match(/const CACHE = '(?:oot-)?codex-v(\d+)';/) || [])[1]);
    check('sw.js lists ./js/codex54.js after ./js/codex53.js, and its CACHE is codex-v113 or later (' + v + ')', s.indexOf("'./js/codex54.js'") > s.indexOf("'./js/codex53.js'") && s.indexOf("'./js/codex53.js'") > 0 && v >= 113);
  } else check('index.html and sw.js beside ' + JS, false);
  const gates = fs.readdirSync(__dirname).filter((f) => /^(check-|list-harness)[\w-]*\.c?js$/.test(f));
  const short = gates.filter((f) => {
    const t = fs.readFileSync(path.join(__dirname, f), 'utf8');
    const n53 = (t.match(/'codex53\.js'\s*,\s*'boot\.js'/g) || []).length;
    const listed = (t.match(/'codex53\.js'\s*[,\]]/g) || []).length;
    const next = (t.match(/'codex53\.js'\s*,\s*'codex54\.js'/g) || []).length;
    return n53 > 0 || listed > next;
  });
  check('the chain rule: every list in a gate here that names codex53.js names codex54.js straight after it (' + gates.length + ' gates read)', !short.length, short.join(', '));
}

main().then(() => {
  console.log('');
  if (failed) { console.log('check-card: ' + failed + ' of ' + (passed + failed) + ' checks FAILED'); process.exit(1); }
  console.log('check-card: all ' + passed + ' checks pass');
  process.exit(0);
}).catch((e) => { console.error(e && e.stack || e); process.exit(1); });
