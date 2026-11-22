/**
 * THE CHAMPAGNE HOUSES OF THE HOUSE TAB, HELD TO THEIR DESIGN (codex59, November 2026).
 *
 * The owner asked for a Champagne House tab under the house tab, with a deep study and a tableside description of
 * each house and its prestige cuvée: the 23 houses of a class sheet, each matched to its cuvée. codex59 is two pieces:
 * js/data-champagne.js (CHAMPAGNE_HOUSES, built by .scripts/champagne/build-champagne.cjs from one fragment a house)
 * and the layer js/codex59.js. This gate loads the SHIPPED chain index.html loads in check-card's loader, with the
 * shared house engine and the pack, and asserts:
 *
 *   1. the load: data-champagne.js then codex59.js straight after codex58.js and before boot.js; the layer ran
 *   2. the data: the roster against plan.json (whole: the sheet's 23 in the sheet's order, the counts pinned exact in
 *      one constant, WHOLE, which the gates agent fills at the whole build; with --partial the houses written, each
 *      in its place of the plan's order, the meta saying so); every record through schema.cjs; the data equal to
 *      the build of the fragments byte for byte; every id hc- and eight digits, once, held by keys.v1.json; hc- the
 *      tab's alone; nobody living in any string a record ships or the layer shows; schema.cjs's own test
 *   3. the spoken lines and the study items: each of the six lines at the table its sentences (the sale exactly
 *      two, the twenty exactly two, the tens one, the forty fives four to eight) and its words; three cards, kinds
 *      house, cuvee and term in order; three questions of four options tagged match, house and cuvee
 *   4. the pages: every house drawn clean, its blocks in their order (the name, the facts, At the table for the
 *      house with its forty five and ten, At the table for the cuvée with its forty five, the sale, its ten and its
 *      twenty, the chips, the sections in order, the sources closed at the foot, then the houses before and after
 *      and All); every field drawn where the record holds it; an address naming nothing falling to the root
 *   5. the root: the lesson, Study ahead of the houses, the partial line only while partial, every house once in the
 *      sheet's order with its cuvée as the label prints it (both names where it has two) and its line; the filter
 *   6. the room: Champagne houses the fifth room of V48_ROOMS, once and last; every room's row draws five; a tap on
 *      it from a house page climbs to the root, from the root adds no history entry
 *   7. the addresses warm and cold: lit the house tab, named; Back climbing a house to the root, the root to the
 *      Wine list, the Wine list to Home; the drill and Present it to the root; each cold
 *   8. On the list on the fixture house: every row a wine of the house by the record's house (or the library's name
 *      for its cuvée), once, the producer over the wine, no price, no vintage; a row opens a real card, Back returns
 *   9. study: the decks champcards, champmatch, champcards:{key} and champdue; the card face; on seeded grades a card
 *      right due tomorrow then in three days, a card wrong due today, in the layer's own slot alone; the house's
 *      three cards with when each is due; the due count on the root; the parents of the decks
 *  10. the matching drill: both ways, every house, the answer the record's own; every wrong answer another house's,
 *      never one the shown house or cuvée also answers to; a round dealt, a pick counted, a miss coming back
 *  11. the quiz: a house's three, the matching questions, ten from every house with the due first; graded in the
 *      layer's slot through the engine, never level progress, never in codex3's rotation, never an orphan, found
 *  12. Present it: a house shown, the line revealed, the mark kept by key in the slot, the next house
 *  13. the door from Producers and flagships: on a record whose key is a house's pick, last, opening the house
 *  14. the shell and the chain rule: the two tags in order, the worker listing both; every list in a gate here that
 *      names codex58.js names data-champagne.js and codex59.js straight after it, or in the list that follows it
 *  15. the layer's file: no dash, nobody named, var and function only, every wrapper typeof guarded and outermost,
 *      every selector under .wrap, every colour on its own ground, every shown word V59_WORDS's, and V59_WORDS in
 *      the strictest voice; this gate dash free
 *
 *   node .scripts/check-champagne.js [jsDir] [--partial]               every check above
 *   node .scripts/check-champagne.js [jsDir] [--partial] --mutations   then seeds faults in a scratch copy, one at a
 *                                                                       time, each to be caught by the check that
 *                                                                       names it (CHAMPAGNE_MUTATION=word|word runs
 *                                                                       only those whose names hold a word)
 *
 * --partial while the data is a partial build: the roster then counts the houses written. Without it the roster must
 * be whole. A section that throws fails as "section N ran to its end" and the next one runs. jsDir defaults to this
 * repo's js/. Needs the shared engine (OOT_SHARED, else ../worldtable/static/shared) and the pack (OOT_HOUSE_PACK, else
 * the pack beside the engine). CHAMPAGNE_GATES names another folder of gates for the chain rule (the mutations' scratch
 * copy). A tree with no codex59.js is SKIPPED. Exits non-zero if any check fails. The last line is the verdict.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const cp = require('child_process');

const ARGS = process.argv.slice(2);
if (ARGS.indexOf('--help') >= 0 || ARGS.indexOf('-h') >= 0) {
  console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^\/\*\*?\s?/, ''));
  process.exit(0);
}
const MUTATIONS = ARGS.indexOf('--mutations') >= 0;
const PARTIAL = ARGS.indexOf('--partial') >= 0;
const JS = path.resolve(ARGS.find((a) => a.charAt(0) !== '-') || path.join(__dirname, '..', 'js'));
const ROOT = path.join(JS, '..');
if (!fs.existsSync(path.join(JS, 'codex59.js'))) {
  console.log('check-champagne: no codex59.js in ' + JS + ', SKIPPED');
  process.exit(0);
}
const SHARED = process.env.OOT_SHARED || path.join(__dirname, '..', '..', 'worldtable', 'static', 'shared');
const ENGINE = path.join(SHARED, 'oot-house.js');
const UI_FILE = path.join(SHARED, 'oot-house-ui.js');
const PACK_FILE = process.env.OOT_HOUSE_PACK || path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
for (const f of [ENGINE, UI_FILE, PACK_FILE]) {
  if (!fs.existsSync(f)) { console.error('check-champagne: no ' + path.basename(f) + ' at ' + path.dirname(f) + ' (set OOT_SHARED or OOT_HOUSE_PACK)'); process.exit(1); }
}
const CH = require(path.join(__dirname, 'cms', 'chain.cjs'));
const S = require(path.join(__dirname, 'champagne', 'schema.cjs'));
const BF = require(path.join(__dirname, 'champagne', 'build-champagne.cjs'));
const GATES = path.resolve(process.env.CHAMPAGNE_GATES || __dirname);
const KEYS_FILE = path.join(S.DIR, 'keys.v1.json');
const FRAG_DIR = path.join(S.DIR, 'fragments');
const PLAN = S.loadPlan();
const ROSTER = S.roster(PLAN);
const PLAN_KEYS = ROSTER.map((p) => p.key);
const NOW = Date.parse('2026-11-22T15:02:00.000Z');
/* the sections of a house page in their order; the second cuvée and On the list only where the record has them */
const SECTIONS = ['v59-s-cuvee', 'v59-s-also', 'v59-s-style', 'v59-s-story', 'v59-s-guests', 'v59-s-traps', 'v59-s-sheet', 'v59-s-list', 'v59-s-study', 'v59-s-codex'];
/* the whole build pinned exact: the houses, the cards and the questions, the answers as the build deals them, the
   houses the library joins, those with a record in Producers and flagships and those with a second cuvée. Filled by
   the integrator in the commit of the whole build, 22 November 2026; a partial build is held without it. */
const WHOLE = { houses: 23, cards: 69, questions: 69, deal: [18, 17, 17, 17], joined: 19, cuvees: 7, picks: 4, also: 4 };

let passed = 0, failed = 0;
function check(what, ok, detail) {
  if (ok) { passed++; console.log('  ok    ' + what); }
  else { failed++; console.log('  FAIL  ' + what + (detail ? '  :: ' + String(detail).slice(0, 700) : '')); }
}
function note(what) { console.log('  note  ' + what); }
function section(name) { console.log(''); console.log('--- ' + name + ' ---'); }
function few(list, n) { return list.slice(0, n || 6).join(' | ') + (list.length > (n || 6) ? ' | and ' + (list.length - (n || 6)) + ' more' : ''); }
const tick = (ms) => new Promise((r) => setTimeout(r, ms || 10));
function seeded(start) {
  let s = start || 12345;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x80000000; };
}
/* check-producers-house.js's voiceProblems, the strictest, as check-flagships carries it */
const NUMERAL_RE = /\bLevel\s+(I|II|III|IV|[1-4])\b/;
function voiceProblems(s) {
  const out = [];
  if (s.indexOf(String.fromCharCode(0x2014)) >= 0) out.push('a long dash (U+2014)');
  if (s.indexOf(String.fromCharCode(0x2013)) >= 0) out.push('an en dash (U+2013)');
  if (/&(mdash|ndash|#8212|#8211|#x2014|#x2013);/i.test(s)) out.push('a dash entity');
  if (/\x20-{2}\x20/.test(s) || /\x20-\x20/.test(s)) out.push('a hyphen standing for a dash');
  if (/practi[cs]e/i.test(s.replace(/(^|[^\w])Practise(?!\w)/g, '$1'))) out.push('the retired word for study');
  if (NUMERAL_RE.test(s)) out.push('a level numeral: ' + s.match(NUMERAL_RE)[0]);
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c >= 0x2190) { out.push('a mark U+' + c.toString(16).toUpperCase()); break; }
  }
  return out;
}
const unesc = (s) => String(s || '').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function shown(html) {
  const said = [...String(html || '').matchAll(/\b(?:aria-label|placeholder|title|alt)="([^"]*)"/g)].map((m) => m[1]);
  return unesc(String(html || '').replace(/<[^>]+>/g, ' ') + ' ' + said.join(' ')).replace(/\s+/g, ' ');
}
function pageProblem(html) {
  const c = CH.cleanProblem(html) || CH.drawnVoiceProblem(html);
  if (c) return c;
  const t = shown(html);
  if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(t)) return 'shows undefined, NaN or an object';
  const v = voiceProblems(t.replace(/[^\x00-↏]/g, ''));
  return v.length ? v.join(', ') : '';
}
const attrs = (h, re) => [...String(h || '').matchAll(re)].map((m) => unesc(m[1]));
const fold = (s) => S.fold(s);

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
    after() { }, before() { }, prepend() { }, append() { },
    setAttribute() { }, getAttribute: () => null, removeAttribute() { }, hasAttribute: () => false,
    addEventListener() { }, removeEventListener() { }, dispatchEvent: () => true,
    focus() { }, blur() { }, click() { }, scrollIntoView() { }, insertAdjacentHTML() { },
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
    back() { go(-1); }, forward() { go(1); }, go(n) { go(n); }
  };
  function go(n) {
    const to = H.idx + n;
    if (to < 0 || to >= H.entries.length) return;
    H.idx = to;
    setUrl(H.entries[to].url);
    const ev = { state: H.entries[to].state };
    listeners.popstate.slice().forEach((fn) => fn(ev));
  }
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
async function bootDevice(opts) {
  const o = opts || {};
  const D = makeSandbox();
  if (o.hash) D.sandbox.history.replaceState(null, '', '/codex/' + o.hash);
  vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), D.ctx, { filename: 'oot-house.js' });
  vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), D.ctx, { filename: 'oot-house-ui.js' });
  const lib = D.G('OOT.houseLib');
  D.sandbox.OOT.house = lib.createHouseApi(lib.mapStorage(new Map()), { win: D.sandbox, now: () => NOW, rand: seeded(21), from: 'codex' });
  D.sandbox.fetch = (url) => {
    const u = String(url || '');
    const m = /^js\/regions\/([a-z0-9-]+)\.json/.exec(u);
    if (m) {
      const f = path.join(JS, 'regions', m[1] + '.json');
      if (!fs.existsSync(f)) return Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error('none')) });
      const body = fs.readFileSync(f, 'utf8');
      return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(body), json: () => Promise.resolve(JSON.parse(body)) });
    }
    if (o.noHouse) return Promise.resolve({ ok: false, status: 404, text: () => Promise.resolve(''), json: () => Promise.reject(new Error('none')) });
    return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(packText), json: () => Promise.resolve(JSON.parse(packText)) });
  };
  for (const f of FILES) {
    try { vm.runInContext(fs.readFileSync(path.join(JS, f), 'utf8'), D.ctx, { filename: f }); }
    catch (e) { console.error('check-champagne: js/' + f + ' failed to load: ' + e.message); process.exit(1); }
  }
  try { await D.G('typeof V27_LAST !== "undefined" ? V27_LAST : null'); } catch (e) { }
  try { await D.G('typeof V27_BOOT_PACK !== "undefined" ? V27_BOOT_PACK : null'); } catch (e) { }
  await tick(30);
  try { await D.G('typeof V27_WRITING !== "undefined" ? V27_WRITING : null'); } catch (e) { }
  await tick(30);
  D.J = (expr) => JSON.parse(D.G('JSON.stringify(' + expr + ')'));
  /* a page as codex32 builds it: the html handed to the builder */
  D.page = (prep) => String(D.G('(function () { var got = ""; var was32 = v32Build; v32Build = function (h, a) { if (!got) got = String(h || ""); return was32(h, a); }; try { ' + prep + ' } finally { v32Build = was32; } return got; })()') || '');
  return D;
}

function walk(v, where, fn) {
  if (typeof v === 'string') fn(v, where);
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, where + '[' + i + ']', fn));
  else if (v && typeof v === 'object') Object.keys(v).forEach((k) => walk(v[k], where ? where + '.' + k : k, fn));
}
/* a shipped record as a fragment's record: the minted ids taken off, a source's read read again from its address */
function asFragment(rec) {
  const r = JSON.parse(JSON.stringify(rec));
  delete r.id;
  r.cards = (r.cards || []).map((c) => ({ kind: c.kind, front: c.front, back: c.back }));
  r.questions = (r.questions || []).map((q) => ({ q: q.q, opts: q.opts, a: q.a, exp: q.exp, tag: q.tag }));
  r.sources = (r.sources || []).map((s) => ({ title: s.title, url: s.url, kind: s.kind, read: s.url ? 'page' : 'book' }));
  return r;
}
/* the build of the fragments the data was made from: the plan's every house, or with --partial the ones the data holds */
function buildNow(keys) {
  let dir = FRAG_DIR, tmp = '';
  if (PARTIAL) {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'champagne-frag-'));
    keys.forEach((k) => { const f = path.join(dir, k + '.json'); if (fs.existsSync(f)) fs.copyFileSync(f, path.join(tmp, k + '.json')); });
    dir = tmp;
  }
  let b;
  try { b = BF.build({ jsDir: JS, out: path.join(JS, 'data-champagne.js'), fragments: dir, keys: KEYS_FILE, partial: PARTIAL }, BF.readKeys(KEYS_FILE)); }
  catch (e) { b = { problems: [e.message], text: '' }; }
  if (tmp) {
    const shownDir = path.relative(S.ROOT, dir);
    const as = (!shownDir.startsWith('..') && !path.isAbsolute(shownDir) ? shownDir : dir).split(path.sep).join('/');
    b.text = String(b.text || '').split(as).join('.scripts/champagne/fragments');
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  return b;
}
/* the section of a page that a heading id opens, up to its close */
function secOf(h, id) {
  const at = h.indexOf('aria-labelledby="' + id + '"');
  return at >= 0 ? h.slice(at, h.indexOf('</section>', at)) : '';
}

async function main() {
  const TEXT = fs.readFileSync(path.join(JS, 'data-champagne.js'), 'utf8');
  const D = await bootDevice();
  console.log('check-champagne: ' + FILES.length + ' scripts from ' + path.join(ROOT, 'index.html') + ', codex59 at ' + (FILES.indexOf('codex59.js') + 1) + (PARTIAL ? ', the data held as a partial build' : ''));
  let REC = [], META = {}, WORDS = {};
  const SRC = fs.readFileSync(path.join(JS, 'codex59.js'), 'utf8');

  /* ================================================================ */
  section('1. the load');
  try {
    const i58 = FILES.indexOf('codex58.js');
    const want = ['codex58.js', 'data-champagne.js', 'codex59.js', 'boot.js'];
    check('the chain index.html loads holds data-champagne.js then codex59.js straight after codex58.js, then boot.js', i58 > 0 && JSON.stringify(FILES.slice(i58, i58 + want.length)) === JSON.stringify(want), FILES.slice(i58, i58 + want.length).join(' '));
    check('codex59 ran: V59_WORDS, v59W, its three views registered, owned by the house tab, parented and drawn, its acts', D.G('typeof V59_WORDS === "object" && typeof v59W === "function" && ["champagne", "champdrill", "champpresent"].every(function (k) { return !!V59_VIEWS[k] && typeof V25_VIEWS[k] === "function" && V32_OWNER[k] === "brennans" && V25_HUB[k] === "brennans" && V41_REDRAW[k] === 1; }) && V32_PARENT.champagne === "brennans" && V32_PARENT.champdrill === "champagne" && V32_PARENT.champpresent === "champagne" && ["producer", "wine", "cards", "quiz", "findclear", "dway", "dpick", "dnext", "dagain", "reveal", "mark", "pnext"].every(function (k) { return typeof V59_ACTS[k] === "function"; })') === true);
    check('the style element is written by the layer, id v59-style', SRC.indexOf("css.id = 'v59-style'") > 0);
    WORDS = D.J('V59_WORDS');
  } catch (e) { check('section 1 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('2. the data');
  try {
    const DATA = D.J('CHAMPAGNE_HOUSES');
    META = DATA.meta || {};
    REC = DATA.houses || [];
    const keys = REC.map((r) => r.key);
    const rosterBad = [];
    let last = -1;
    REC.forEach((r) => {
      const at = PLAN_KEYS.indexOf(r.key);
      if (at < 0) { rosterBad.push(r.key + ' is no house of the plan'); return; }
      if (at <= last) rosterBad.push(r.key + ' out of the sheet\'s order');
      last = at;
      const p = ROSTER[at];
      if (r.house !== p.house || r.producerId !== p.producerId || r.cuveeId !== p.cuveeId || r.pick !== p.pick) rosterBad.push(r.key + ': house, producerId, cuveeId or pick not the plan\'s');
      if (!r.cuvee || String(r.cuvee.name || '').indexOf(p.cuvee) < 0) rosterBad.push(r.key + ': the cuvée does not hold the plan\'s words ' + p.cuvee);
      if (!r.sheet || r.sheet.prints !== p.sheet) rosterBad.push(r.key + ': the sheet prints ' + JSON.stringify(r.sheet && r.sheet.prints) + ', the plan ' + JSON.stringify(p.sheet));
      if (!!p.also !== !!r.also) rosterBad.push(r.key + ': a second cuvée ' + (p.also ? 'missing' : 'not in the plan'));
    });
    const metaOk = META.roster === ROSTER.length && META.built === REC.length && META.prefix === S.ID_PREFIX && META.edition === PLAN.edition
      && META.cards === REC.length * 3 && META.questions === REC.length * 3 && META.partial === (REC.length < ROSTER.length);
    const whole = REC.length === ROSTER.length && JSON.stringify(keys) === JSON.stringify(PLAN_KEYS);
    if (PARTIAL) {
      check('the roster against plan.json, the houses written (' + REC.length + ' of ' + ROSTER.length + '): every record a house of the plan in the sheet\'s order, its house, ids, cuvée and sheet the plan\'s; the meta saying so', REC.length > 0 && rosterBad.length === 0 && metaOk, few(rosterBad, 5) + ' ' + JSON.stringify(META));
      if (whole) note('the data is the roster whole: run this gate without --partial');
    } else {
      check('the roster whole against plan.json: the sheet\'s ' + ROSTER.length + ' houses in the sheet\'s order, each its house, ids, cuvée and sheet the plan\'s; the meta ' + META.built + ' of ' + META.roster + ', not partial', whole && rosterBad.length === 0 && metaOk && META.partial === false, REC.length + ' houses; ' + few(rosterBad, 4) + ' ' + JSON.stringify(META));
      const deal = [0, 0, 0, 0];
      REC.forEach((r) => (r.questions || []).forEach((q) => { if (deal[q.a] !== undefined) deal[q.a]++; }));
      const got = { houses: REC.length, cards: META.cards, questions: META.questions, deal, joined: REC.filter((r) => r.producerId).length, cuvees: REC.filter((r) => r.cuveeId).length, picks: REC.filter((r) => r.pick).length, also: REC.filter((r) => r.also).length };
      check(WHOLE ? 'the counts pinned exact: ' + JSON.stringify(WHOLE) : 'the counts pinned exact: WHOLE is not yet filled (the gates agent pins it with the whole build)', !!WHOLE && JSON.stringify(got) === JSON.stringify(WHOLE), JSON.stringify(got));
    }
    const facts = S.facts(JS);
    const schemaBad = [];
    REC.forEach((r) => S.validateRecord(asFragment(r), PLAN, { facts, key: r.key }).forEach((x) => schemaBad.push(r.key + ': ' + x)));
    check('every shipped record through schema.cjs (' + REC.length + ' records, the minted ids taken off)', REC.length > 0 && schemaBad.length === 0, few(schemaBad, 4));
    const built = buildNow(keys);
    check('the data is the build: js/data-champagne.js equals the ' + (PARTIAL ? 'partial build of the ' + REC.length + ' houses it holds' : 'whole build of the plan\'s ' + ROSTER.length + ' fragments') + ', byte for byte', built.problems.length === 0 && built.text === TEXT, built.problems.length ? few(built.problems, 3) : 'the file differs from the build (' + TEXT.length + ' against ' + String(built.text).length + ' bytes)');
    const KEYS = BF.readKeys(KEYS_FILE);
    const idsBad = [];
    const seen = {};
    let n = 0;
    REC.forEach((r) => {
      const got = { id: r.id, cards: (r.cards || []).map((c) => c.id), questions: (r.questions || []).map((q) => q.id) };
      [got.id].concat(got.cards, got.questions).forEach((id) => { n++; if (!S.ID_RE.test(id)) idsBad.push(r.key + ' ' + id + ' not hc- and eight digits'); if (seen[id]) idsBad.push(id + ' twice'); seen[id] = 1; });
      if (got.id !== BF.recordId(r.key) && !(KEYS.keys[r.key] && KEYS.keys[r.key].id === got.id)) idsBad.push(r.key + ' ' + got.id + ' neither minted from its key nor kept');
      (r.cards || []).forEach((c) => { if (c.id !== BF.itemId(r.id, c.front)) idsBad.push(r.key + ' card ' + c.id + ' not minted from its front'); });
      (r.questions || []).forEach((q) => { if (q.id !== BF.itemId(r.id, q.q)) idsBad.push(r.key + ' question ' + q.id + ' not minted from its stem'); });
      const k = KEYS.keys[r.key];
      if (!k) { idsBad.push(r.key + ' not in keys.v1.json'); return; }
      if (KEYS.frozen ? !(k.id === got.id && k.cards.every((id) => got.cards.indexOf(id) >= 0) && k.questions.every((id) => got.questions.indexOf(id) >= 0)) : JSON.stringify(k) !== JSON.stringify(got)) idsBad.push(r.key + ': ' + JSON.stringify(got) + ' against ' + JSON.stringify(k));
    });
    if (!KEYS.frozen && Object.keys(KEYS.keys).sort().join() !== keys.slice().sort().join()) idsBad.push('keys.v1.json holds ' + Object.keys(KEYS.keys).length + ' records, the data ' + REC.length);
    check('ids against keys.v1.json (' + (KEYS.frozen ? 'frozen' : 'not yet frozen: the file holds exactly the ids the data ships') + '), each hc- and eight digits, minted from its key, front or stem, once among ' + n, idsBad.length === 0 && n === REC.length * 7, few(idsBad, 4));
    const pre = BF.prefixProblems(JS, path.join(JS, 'data-champagne.js'));
    check('hc- is the tab\'s alone: no other file under js/ mints or names it', pre.length === 0, few(pre, 3));
    const living = [];
    REC.forEach((r) => {
      const own = S.ownNames(r, ROSTER[PLAN_KEYS.indexOf(r.key)]);
      walk(r, r.key, (s, where) => { if (/\.id$|^[^.]*\.id$/.test(where) || /\]\.id$/.test(where)) return; const hit = S.livingIn(/\.url$/.test(where) ? s.replace(/[-_/.]+/g, ' ') : s, own, /\.url$/.test(where)); if (hit.length) living.push(where + ': ' + hit.join(', ')); });
    });
    Object.keys(WORDS).forEach((k) => { const hit = S.livingIn(WORDS[k], []); if (hit.length) living.push('V59_WORDS.' + k + ': ' + hit.join(', ')); });
    check('nobody living of people.json (' + S.people().names.length + ' names) in any string a record ships or the layer shows, a house\'s own name kept', living.length === 0 && S.people().names.length > 50, few(living, 5));
    const st = S.selfTest();
    check('schema.cjs\'s own test: the two pilots sound and ' + st.run + ' seeded faults each refused by the rule that names it', st.problems.length === 0 && st.run > 20, few(st.problems, 3));
  } catch (e) { check('section 2 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('3. the spoken lines and the study items');
  try {
    const lineBad = [], itemBad = [];
    const C = S.CAPS;
    REC.forEach((r) => {
      const t = r.table || {};
      Object.keys(C.lineSentences).forEach((k) => {
        const ns = S.sentenceList(t[k] || '').length, nw = S.words(t[k] || '');
        const ps = C.lineSentences[k], pw = C.lines[k];
        if (ns < ps[0] || ns > ps[1]) lineBad.push(r.key + ' ' + k + ' ' + ns + ' sentences (' + ps.join(' to ') + ')');
        if (nw < pw[0] || nw > pw[1]) lineBad.push(r.key + ' ' + k + ' ' + nw + ' words (' + pw.join(' to ') + ')');
      });
      if (!String(t.house45 || '').startsWith(r.house)) lineBad.push(r.key + ' house45 does not open on the house\'s name');
      if ((r.cards || []).map((c) => c.kind).join() !== 'house,cuvee,term') itemBad.push(r.key + ' cards ' + (r.cards || []).map((c) => c.kind).join());
      if ((r.questions || []).map((q) => q.tag).sort().join() !== 'cuvee,house,match') itemBad.push(r.key + ' tags ' + (r.questions || []).map((q) => q.tag).join());
      if ((r.questions || []).some((q) => !Array.isArray(q.opts) || q.opts.length !== 4 || !Number.isInteger(q.a) || q.a < 0 || q.a > 3)) itemBad.push(r.key + ' a question not of four options keyed');
    });
    check('the six lines at the table, read again on the shipped records: the sale and the twenty exactly two sentences, the tens one, the forty fives four to eight, each within its words, the house\'s forty five opening on its name', REC.length > 0 && lineBad.length === 0, few(lineBad, 5));
    check('three cards a house, house, cuvee and term in that order, and three questions of four options keyed, tagged match, house and cuvee', REC.length > 0 && itemBad.length === 0, few(itemBad, 5));
  } catch (e) { check('section 3 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('4. the pages');
  try {
    const bad = [], order = [], tableBad = [], secBad = [], fieldBad = [], footBad = [];
    REC.forEach((r, i) => {
      const h = String(D.G('v59PageHtml(' + JSON.stringify(r.key) + ')') || '');
      const p = pageProblem(h);
      if (p) bad.push(r.key + ': ' + p);
      const t = r.table || {};
      const at = (s) => h.indexOf(s);
      const nameAt = at('<h3 class="v59-name" id="v59-name" tabindex="-1">' + esc(r.house) + '</h3>');
      const navAt = at('<nav class="v48-nav"');
      const factsAt = at('<dl class="v59-facts">');
      const hAt = at('<section class="v59-table" id="v59-t-house"');
      const cAt = at('<section class="v59-table v59-ctable" id="v59-t-cuvee"');
      const chipsAt = at('<nav class="v32chips v59-jumps"');
      const firstSec = at('<section class="v59-sec');
      if (!(navAt > 0 && nameAt > navAt && factsAt > nameAt && hAt > factsAt && cAt > hAt && chipsAt > cAt && firstSec > chipsAt)) order.push(r.key);
      const seq = [[hAt, '<p class="v59-tline">' + esc(t.house45) + '</p>'], [hAt, '<p class="v59-tshort">' + esc(t.house10) + '</p>'], [cAt, '<p class="v59-tline">' + esc(t.cuvee45) + '</p>'], [cAt, '<p class="v59-tsale">' + esc(t.sale) + '</p>'], [cAt, '<p class="v59-tshort">' + esc(t.cuvee10) + '</p>'], [cAt, '<p class="v59-tshort">' + esc(t.cuvee20) + '</p>']];
      let prev = 0;
      seq.forEach((x, j) => { const k = h.indexOf(x[1], x[0]); if (k < 0 || k < prev || (j < 2 ? k > cAt : k > chipsAt)) tableBad.push(r.key + ' line ' + j); prev = k; });
      if (h.indexOf(esc('At the table: ' + r.cuvee.name)) < 0) tableBad.push(r.key + ': the cuvée\'s block not headed by its name');
      const secs = attrs(h, /<section class="v59-sec[^"]*" aria-labelledby="(v59-s-[a-z]+)"/g);
      const chips = attrs(h.slice(chipsAt, h.indexOf('</nav>', chipsAt)), /data-to="(v59-s-[a-z]+)"/g);
      const listed = h.indexOf('aria-labelledby="v59-s-list"') > 0;
      const want = SECTIONS.filter((s) => (s !== 'v59-s-also' || !!r.also) && (s !== 'v59-s-list' || listed));
      if (JSON.stringify(secs) !== JSON.stringify(want) || JSON.stringify(chips) !== JSON.stringify(want)) secBad.push(r.key + ': ' + secs.join(',') + ' / chips ' + chips.join(','));
      const c = r.cuvee, s = r.style || {};
      const cs = secOf(h, 'v59-s-cuvee');
      ['rhythm', 'blend', 'sites', 'making', 'lees', 'young', 'aged', 'serve'].concat(c.bottle ? ['bottle'] : []).forEach((k) => { if (cs.indexOf('<dd>' + esc(c[k]) + '</dd>') < 0) fieldBad.push(r.key + ' cuvee.' + k); });
      if (cs.indexOf('<p class="v59-cname">' + esc(c.name) + '</p>') < 0 || cs.indexOf(esc(c.first.what)) < 0 || (c.forms || []).some((f) => cs.indexOf(esc(f.name)) < 0 || cs.indexOf(esc(f.note)) < 0)) fieldBad.push(r.key + ' cuvee name, first or forms');
      if (r.also) { const as = secOf(h, 'v59-s-also'); if (as.indexOf(esc(r.also.name)) < 0 || as.indexOf(esc(r.also.note)) < 0 || as.indexOf(esc(r.also.line)) < 0 || as.indexOf(esc(WORDS['alsoH_' + r.also.standing])) < 0) fieldBad.push(r.key + ' also'); }
      const ss = secOf(h, 'v59-s-style');
      ['line', 'grapes', 'reserve', 'vessels', 'malolactic', 'lees', 'dosage'].forEach((k) => { if (s[k] && ss.indexOf('<dd>' + esc(s[k]) + '</dd>') < 0) fieldBad.push(r.key + ' style.' + k); if (!s[k] && ss.indexOf('<dt>' + esc(WORDS[k === 'line' ? 'styleLine' : k === 'grapes' ? 'styleGrapes' : k === 'lees' ? 'styleLees' : k]) + '</dt>') >= 0) fieldBad.push(r.key + ' style.' + k + ' drawn empty'); });
      if (s.nv && ((s.nv.name && ss.indexOf(esc(s.nv.name)) < 0) || ss.indexOf(esc(s.nv.note)) < 0)) fieldBad.push(r.key + ' style.nv');
      if (secOf(h, 'v59-s-story').indexOf(esc(r.story)) < 0) fieldBad.push(r.key + ' story');
      (r.guests || []).forEach((g, j) => { const gs = secOf(h, 'v59-s-guests'); if (gs.indexOf(esc(g.q)) < 0 || gs.indexOf(esc(g.a)) < 0) fieldBad.push(r.key + ' guests[' + j + ']'); });
      (r.traps || []).forEach((x, j) => { if (secOf(h, 'v59-s-traps').indexOf('<li>' + esc(x) + '</li>') < 0) fieldBad.push(r.key + ' traps[' + j + ']'); });
      const sh = secOf(h, 'v59-s-sheet');
      if (sh.indexOf(esc(r.sheet.prints)) < 0 || sh.indexOf(esc(r.sheet.label)) < 0 || sh.indexOf(esc(r.sheet.note)) < 0 || sh.indexOf(esc(r.sheet.prints)) > sh.indexOf(esc(r.sheet.label) + '</p>')) fieldBad.push(r.key + ' sheet');
      const fa = h.slice(factsAt, h.indexOf('</dl>', factsAt));
      if ((r.say && fa.indexOf(esc(r.say)) < 0) || fa.indexOf(esc(r.founded.what)) < 0 || fa.indexOf(esc(r.place)) < 0 || fa.indexOf(esc(r.kind.means)) < 0 || (r.kind.code && fa.indexOf(esc(r.kind.code + ', ' + WORDS['code_' + r.kind.code])) < 0)) fieldBad.push(r.key + ' facts');
      const srcAt = h.indexOf('<details class="v28-q v39-sec v59-sourcesbox" id="v59-s-sources"');
      const links = attrs(h.slice(srcAt), /<a href="([^"]+)" target="_blank" rel="noopener">/g);
      const lastSec = h.lastIndexOf('<section class="v59-sec');
      const stepsAt = h.indexOf('<nav class="v59-steps"');
      const steps = attrs(h.slice(stepsAt), /data-go="champagne" data-arg="([^"]*)" id="v59-(?:prev|all|next)"/g);
      const wantSteps = [i > 0 ? REC[i - 1].key : null, '', i < REC.length - 1 ? REC[i + 1].key : null].filter((x) => x !== null);
      if (!(srcAt > lastSec && stepsAt > srcAt) || /<details[^>]*v59-sourcesbox[^>]*\sopen/.test(h) || JSON.stringify(links) !== JSON.stringify((r.sources || []).filter((x) => /^https:\/\//.test(x.url)).map((x) => x.url)) || JSON.stringify(steps) !== JSON.stringify(wantSteps)) footBad.push(r.key + ' ' + steps.join(','));
    });
    check('every house drawn clean (' + REC.length + ' pages: cleanProblem, the house voice, no dash, never the retired word, no undefined)', REC.length > 0 && bad.length === 0, few(bad, 4));
    check('At the table first on every page: the row of rooms, the house\'s name, its facts, then the house\'s block, then the cuvée\'s, then the chips and the sections', order.length === 0, few(order, 6));
    check('the two blocks at the table in the wine card\'s order: the house in forty five seconds and in ten; the cuvée headed by its name, its forty five first, then the sale, then its ten and its twenty', tableBad.length === 0, few(tableBad, 6));
    check('the sections in their order with their chips: the cuvée in full, the second cuvée where there is one, the style, the story, what guests ask, the traps, the sheet and the label, On the list where the house pours the house\'s wines, Study, In the Codex', secBad.length === 0, few(secBad, 4));
    check('every field drawn where the record holds it, none drawn empty: the facts with the appellation\'s term, the cuvée in full with its forms, the second cuvée under its standing, the style, the story, guests, traps, the sheet before the label', fieldBad.length === 0, few(fieldBad, 6));
    check('the sources closed at the foot, every https source a link, then the houses before and after in the sheet\'s order and All', footBad.length === 0, few(footBad, 6));
    const none = D.J('(function () { return { a: V59_VIEWS.champagne.accept("no-such-house"), b: v59PageHtml("no-such-house").indexOf("v59-root") > 0 }; })()');
    check('an address naming no house the device holds falls to the root', none.a === '' && none.b === true, JSON.stringify(none));
    const N = await bootDevice({ noHouse: true });
    const nh = N.J('(function () { var h = v59HouseNow(); var k = ' + JSON.stringify((REC[0] || {}).key || '') + '; var p = v59PageHtml(k); return { house: !!(h && v28Wines(h).length), list: p.indexOf("v59-s-list") >= 0, cuvee: p.indexOf("v59-s-cuvee") >= 0, root: v59RootHtml().indexOf("v59-houses") >= 0, missing: /not loaded/.test(p + v59RootHtml()) }; })()');
    check('with no house loaded the root and a house page draw whole, without On the list, and never say the collection is not loaded', nh.house === false && nh.list === false && nh.cuvee === true && nh.root === true && nh.missing === false, JSON.stringify(nh));
  } catch (e) { check('section 4 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('5. the root');
  try {
    const root = String(D.G('v59RootHtml()') || '');
    const rows = attrs(root, /<li data-v59-row="([^"]+)"/g);
    const rowBad = [];
    REC.forEach((r) => {
      const at = root.indexOf('<li data-v59-row="' + r.key + '"');
      const li = at >= 0 ? root.slice(at, root.indexOf('</li>', at)) : '';
      const line = r.cuvee.name + (r.also ? ' · ' + r.also.name : '');
      if (li.indexOf('data-go="champagne" data-arg="' + r.key + '"') < 0 || li.indexOf('<span class="v25row-name">' + esc(r.house) + '</span>') < 0 || li.indexOf('<span class="v25row-line v59-rowcuvee">' + esc(line) + '</span>') < 0 || li.indexOf(esc(r.table.cuvee10)) < 0) rowBad.push(r.key);
    });
    check('the root lists every house once (' + rows.length + ' of ' + REC.length + ') in the sheet\'s order, each the house, its cuvée as the label prints it (both names where it has two) and the cuvée in a line, opening the house; clean', JSON.stringify(rows) === JSON.stringify(REC.map((r) => r.key)) && rowBad.length === 0 && !pageProblem(root), few(rowBad, 4) + ' ' + pageProblem(root));
    const lessonAt = root.indexOf('aria-labelledby="v59-lesson-h"'), studyAt = root.indexOf('aria-labelledby="v59-study-h"'), housesAt = root.indexOf('aria-labelledby="v59-houses-h"');
    check('the lesson of what a prestige cuvée is, then Study, then the houses', lessonAt > 0 && studyAt > lessonAt && housesAt > studyAt && ['lesson1', 'lesson2', 'lesson3', 'lesson4'].every((k) => root.indexOf(esc(WORDS[k])) > lessonAt && root.indexOf(esc(WORDS[k])) < studyAt), [lessonAt, studyAt, housesAt].join(' '));
    const study = secOf(root, 'v59-study-h');
    const doors = ['id="v59-door-drill"', 'data-deck="champmatch" id="v59-door-match"', 'data-deck="" id="v59-door-cards"', 'data-tag="" id="v59-door-quiz"', 'data-tag="match" id="v59-door-mquiz"', 'id="v59-door-present"'];
    check('Study on the root: the matching drill, the matching cards, every card, the quiz on every house, the matching questions and Present it', doors.every((d) => study.indexOf(d) > 0) && unesc(study).indexOf((REC.length * 3) + ' cards, three a house') > 0, study.slice(0, 300));
    const partialLine = root.indexOf('class="v32-line v59-partial"') > 0;
    check('the partial line shows only while the build is partial (' + (META.partial ? 'partial: ' + REC.length + ' of ' + META.roster : 'whole') + ')', partialLine === !!(META.partial && META.roster > REC.length));
    const f = D.J('(function () { var r = v59Houses(); var hit = function (q) { return r.filter(function (x) { return v59Match(x, q); }).map(function (x) { return x.key; }); }; var a = r[1] || r[0]; var w = a ? String(a.cuvee.name).split(" ").slice(-1)[0] : ""; V59_FIND.q = "zz-no-such-word"; var none = v59RootHtml(); V59_FIND.q = ""; return { all: hit("").length, house: a ? hit(a.house.split(" ")[0]).indexOf(a.key) >= 0 : false, cuvee: a ? hit(w).indexOf(a.key) >= 0 : false, none: hit("zz-no-such-word").length, folded: a ? hit(a.house.toUpperCase()).indexOf(a.key) >= 0 : false, hiddenAll: (none.match(/<li data-v59-row="[^"]+" hidden>/g) || []).length, noneLine: none.indexOf(v59W("findNone")) > 0, input: none.indexOf(\'id="v59-find-q"\') > 0 }; })()');
    check('the filter by a word typed: every house with nothing typed, a house by its name or its cuvée\'s word in any case, none for a word no house holds, the rows hidden and the count saying so', f.all === REC.length && f.house && f.cuvee && f.folded && f.none === 0 && f.hiddenAll === REC.length && f.noneLine && f.input, JSON.stringify(f));
  } catch (e) { check('section 5 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('6. the room');
  try {
    const rooms = D.J('V48_ROOMS.map(function (r) { return r[0]; })');
    check('Champagne houses is the fifth room of V48_ROOMS, once and last, named in V59_WORDS', rooms.length === 5 && rooms[4] === 'champagne' && rooms.filter((r) => r === 'champagne').length === 1 && D.G('v48RoomName("champagne")') === WORDS.tab, rooms.join(','));
    const navs = D.J('(function () { var out = {}; var h = v41House(); ["housestudies", "houserehearsal", "housereference"].forEach(function (v) { out[v] = v48HubHtml(v, h); }); out.champagne = v59RootHtml(); out.house = v59PageHtml(' + JSON.stringify((REC[0] || {}).key || '') + '); out.drill = v59DrillHtml(""); out.present = v59PresentHtml(' + JSON.stringify((REC[0] || {}).key || '') + '); return out; })()');
    navs.brennans = D.page('v32Go({ view: "brennans" }, "replace"); V25_VIEWS.brennans ? V25_VIEWS.brennans() : v41View();');
    const navBad = [];
    Object.keys(navs).forEach((k) => {
      const h = navs[k];
      const at = h.indexOf('<nav class="v48-nav"');
      const nav = at >= 0 ? h.slice(at, h.indexOf('</nav>', at)) : '';
      const routes = attrs(nav, /data-v48-route="([^"]+)"/g);
      const cur = attrs(nav, /data-v48-route="([^"]+)" aria-current="page"/g);
      const want = k === 'house' || k === 'drill' || k === 'present' ? 'champagne' : k;
      if (JSON.stringify(routes) !== JSON.stringify(['brennans', 'housestudies', 'houserehearsal', 'housereference', 'champagne']) || JSON.stringify(cur) !== JSON.stringify([want])) navBad.push(k + ': ' + routes.join(',') + ' current ' + cur.join(','));
    });
    check('every room\'s row draws five buttons in order, the Champagne houses button last, the current room marked (the Wine list, the three hubs, the root, a house, the drill and Present it)', navBad.length === 0, few(navBad, 4));
    const tap = D.J('(function () { var node = { getAttribute: function (k) { return k === "data-v48-route" ? "champagne" : null; } }; v32Go({ view: "champagne", arg: "" }, "push"); var onRoot = v59NavTap(node); v32Go({ view: "champagne", arg: ' + JSON.stringify((REC[0] || {}).key || '') + ' }, "push"); var n = history.length; var onHouse = v59NavTap(node); var a = { onRoot: onRoot, onHouse: onHouse, view: S.view, arg: v32Arg("champagne"), pushed: history.length - n }; v32Back(); a.back = v32Arg("champagne"); return a; })()');
    check('a tap on Champagne houses from a house page climbs to the root (pushed, Back returning to the house); from the root it is codex48\'s, already here', tap.onRoot === false && tap.onHouse === true && tap.view === 'champagne' && tap.arg === '' && tap.pushed === 1 && tap.back === (REC[0] || {}).key, JSON.stringify(tap));
  } catch (e) { check('section 6 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('7. the addresses warm and cold');
  try {
    const V = await bootDevice();
    const R0 = REC[0];
    const warm = V.J('(function () { var out = []; var at = function () { out.push({ view: S.view, arg: v32Arg(S.view), hash: location.hash, lit: v25NavWord(), name: v25MainName() }); }; v32Go({ view: "brennans" }, "push"); v32Go({ view: "champagne", arg: "" }, "push"); at(); v32Go({ view: "champagne", arg: ' + JSON.stringify(R0.key) + ' }, "push"); at(); v32Back(); at(); v32Back(); at(); v32Back(); out.push({ view: S.view }); return out; })()');
    check('warm: the root and a house each at its own address, lit the house tab and named; Back climbs the house to the root, the root to the Wine list, the Wine list to Home',
      warm[0].view === 'champagne' && warm[0].hash === '#/v/champagne' && warm[0].name === WORDS.tab && warm[1].arg === R0.key && warm[1].hash === '#/v/champagne/' + R0.key && warm[1].name === R0.house
      && warm.slice(0, 3).every((x) => x.lit === 'brennans') && warm[2].view === 'champagne' && warm[2].arg === '' && warm[3].view === 'brennans' && warm[4].view === 'home', JSON.stringify(warm));
    const parents = V.J('({ h: V59_VIEWS.champagne.parent(' + JSON.stringify(R0.key) + '), r: V59_VIEWS.champagne.parent(""), d: V59_VIEWS.champdrill.parent(""), p: V59_VIEWS.champpresent.parent(' + JSON.stringify(R0.key) + ') })');
    check('the parents: a house the root, the root the Wine list, the drill and Present it the root', parents.h.view === 'champagne' && !parents.h.arg && parents.r.view === 'brennans' && parents.d.view === 'champagne' && parents.p.view === 'champagne', JSON.stringify(parents));
    const coldBad = [];
    const cold = [['#/v/champagne', 'champagne', '', ['champagne', 'brennans', 'home']], ['#/v/champagne/' + R0.key, 'champagne', R0.key, ['champagne', 'champagne', 'brennans', 'home']], ['#/v/champagne/no-such-house', 'champagne', '', ['champagne', 'brennans', 'home']],
      ['#/v/champdrill/house', 'champdrill', 'house', ['champdrill', 'champagne', 'brennans', 'home']], ['#/v/champpresent/' + R0.key, 'champpresent', R0.key, ['champpresent', 'champagne', 'brennans', 'home']],
      ['#/flashcards/champcards:' + R0.key, 'deck', '', ['deck', 'champagne', 'champagne', 'brennans', 'home']], ['#/flashcards/champmatch', 'deck', '', ['deck', 'champagne', 'brennans', 'home']]];
    for (const [hash, view, arg, climb] of cold) {
      const Z = await bootDevice({ hash });
      const got = Z.J('({ view: S.view, arg: v32Arg(S.view), lit: v25NavWord() })');
      const html = view === 'deck' ? String(Z.G('v32DeckHtml()') || '') : String(Z.G('V59_VIEWS[' + JSON.stringify(view) + '].draw(V59_ARGS[' + JSON.stringify(view) + '] || "")') || '');
      const chain = Z.J('(function () { var out = [S.view]; for (var i = 0; i < 6 && S.view !== "home"; i++) { v32Back(); out.push(S.view); } return out; })()');
      if (got.view !== view || got.arg !== arg || got.lit !== 'brennans' || pageProblem(html) || JSON.stringify(chain) !== JSON.stringify(climb)) coldBad.push(hash + ' ' + JSON.stringify(got) + ' ' + chain.join('>') + ' ' + pageProblem(html));
    }
    check('each address answers cold (the root, a house, a house the device lacks falling to the root, the drill, Present it, a house\'s deck, the matching deck), lit the house tab, drawn clean, Back climbing to Home', coldBad.length === 0, few(coldBad, 3));
  } catch (e) { check('section 7 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('8. On the list, on the fixture house');
  try {
    const WINES = D.J('v28Wines(v53House()).map(function (w) { return { id: w.id, producer: v58Field(w, "producer"), wine: v58Field(w, "wine"), price: w.price, vintage: w.vintage }; })');
    const byId = {}; WINES.forEach((w) => { byId[w.id] = w; });
    const houseName = D.G('String((v53House() || {}).name || "")');
    check('the house is loaded: ' + houseName + ', ' + WINES.length + ' wines', WINES.length > 200 && !!houseName);
    const listBad = [];
    let rowsN = 0, housesN = 0, firstHit = null;
    REC.forEach((r) => {
      const list = D.J('v59HouseWines(v59Rec(' + JSON.stringify(r.key) + '))');
      const lib = r.cuveeId ? D.J('(function () { var x = prodById(' + JSON.stringify(r.cuveeId) + '); return x ? x.p : ""; })()') : '';
      const seen = {};
      list.forEach((x) => {
        const w = byId[x.id];
        if (!w) { listBad.push(r.key + ': ' + x.id + ' is no wine of the house'); return; }
        if (x.producer !== w.producer) listBad.push(r.key + ': ' + x.id + ' drawn as ' + x.producer);
        if (/\b(?:1[89]|20)\d{2}\b/.test(x.wine)) listBad.push(r.key + ': ' + x.wine + ' carries a vintage');
        if (x.wine !== w.wine.replace(/\s*\b(?:1[89]|20)\d{2}\b/g, '').replace(/\s{2,}/g, ' ').trim()) listBad.push(r.key + ': ' + x.id + ' wine ' + x.wine);
        const mine = fold(w.producer);
        if (!(mine === fold(r.house) || mine.indexOf(fold(r.house) + ' ') === 0 || fold(r.house).indexOf(mine + ' ') === 0 || (lib && (fold(lib) === mine || fold(lib).indexOf(mine + ' ') === 0 || mine.indexOf(fold(lib)) === 0)))) listBad.push(r.key + ': ' + w.producer + ' is not ' + r.house + (lib ? ' nor ' + lib : ''));
        if (seen[x.id]) listBad.push(r.key + ': ' + x.id + ' twice'); seen[x.id] = 1;
      });
      const h = String(D.G('v59PageHtml(' + JSON.stringify(r.key) + ')') || '');
      const sec = secOf(h, 'v59-s-list');
      const ids = attrs(sec, /data-v59="wine" data-id="([^"]+)"/g);
      if (JSON.stringify(ids) !== JSON.stringify(list.map((x) => x.id))) listBad.push(r.key + ': the section draws ' + ids.length + ' rows for ' + list.length);
      if (list.length) {
        housesN++; rowsN += list.length; if (!firstHit) firstHit = { r, id: list[0].id };
        const head = unesc((/<h2 class="v32-h2 v59-sec-h" id="v59-s-list" tabindex="-1">([^<]*)<\/h2>/.exec(sec) || [])[1] || '');
        const want = /['’]s$/i.test(houseName) ? 'On ' + houseName + ' list' : 'On the list at ' + houseName;
        if (head !== want) listBad.push(r.key + ': headed ' + head);
        const txt = shown(sec);
        if (/[$£€]/.test(txt) || list.some((x) => { const w = byId[x.id]; return (w.price && String(w.price).length > 2 && txt.indexOf(String(w.price)) >= 0); })) listBad.push(r.key + ': a price on the list');
      }
    });
    check('every row of On ' + houseName + ' list a wine of the house by the record\'s house or the library\'s name for its cuvée, once, the producer over the wine, no price and no vintage; ' + housesN + ' of ' + REC.length + ' houses pour ' + rowsN + ' wines', listBad.length === 0 && (housesN > 0 || !REC.some((r) => r.key === 'bollinger')), few(listBad, 5));
    const bol = REC.find((r) => r.key === 'bollinger');
    if (bol) {
      const l = D.J('v59HouseWines(v59Rec("bollinger")).map(function (x) { return x.wine; })');
      check('Bollinger on the fixture house: its La Grande Année among its rows', l.some((w) => /Grande Ann/.test(w)), l.join(' | '));
    }
    if (firstHit) {
      const opened = D.J('(function () { v32Go({ view: "champagne", arg: "" }, "push"); v32Go({ view: "champagne", arg: ' + JSON.stringify(firstHit.r.key) + ' }, "push"); var n = history.length; var ok = V59_ACTS.wine({ getAttribute: function (k) { return k === "data-id" ? ' + JSON.stringify(firstHit.id) + ' : null; } }); var a = { ok: ok, view: S.view, open: v28State().open, pushed: history.length - n }; v32Back(); a.back = { view: S.view, arg: v32Arg("champagne") }; a.none = V59_ACTS.wine({ getAttribute: function () { return "w-00000000"; } }); return a; })()');
      check('a row opens that wine\'s card on the list (pushed) and Back returns to the house (' + firstHit.r.house + '); a wine the house does not hold opens nothing', opened.ok === true && opened.view === 'cellar' && opened.open === firstHit.id && opened.pushed === 1 && opened.back.view === 'champagne' && opened.back.arg === firstHit.r.key && opened.none === false, JSON.stringify(opened));
    }
  } catch (e) { check('section 8 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('9. study: the decks, the face and the schedule');
  try {
    const T = await bootDevice();
    const R0 = REC[0];
    const allCards = [].concat.apply([], REC.map((r) => r.cards.map((c) => c.id)));
    const matchCards = [].concat.apply([], REC.map((r) => r.cards.filter((c) => c.kind !== 'term').map((c) => c.id)));
    const decks = T.J('(function () { var a = v32DeckDef("champcards"), m = v32DeckDef("champmatch"), b = v32DeckDef("champcards:' + R0.key + '"), c = v32DeckDef("champdue"); return { a: a.cards.map(function (x) { return x.id; }), ak: a.kind, m: m.cards.map(function (x) { return x.id; }), b: b.cards.map(function (x) { return x.id; }), bk: b.cards.every(function (x) { return x.kind === "champ" && x.house === "' + R0.key + '" && !!x.label; }), bn: b.name, c: c.cards.length, none: v32DeckDef("champcards:no-such-house").cards.length }; })()');
    check('the decks: champcards every card (' + allCards.length + ', kind champ), champmatch the house and cuvée cards alone (' + matchCards.length + '), champcards:{key} a house\'s three in order, champdue empty on a new device, a house the device lacks empty', decks.a.slice().sort().join() === allCards.slice().sort().join() && decks.ak === 'champ' && decks.m.slice().sort().join() === matchCards.slice().sort().join() && JSON.stringify(decks.b) === JSON.stringify(R0.cards.map((c) => c.id)) && decks.bk && decks.bn === 'Champagne cards: ' + R0.house && decks.c === 0 && decks.none === 0, JSON.stringify({ a: decks.a.length, m: decks.m.length, b: decks.b.length, c: decks.c }));
    const face = T.J('(function () { v32Go({ view: "champagne", arg: ' + JSON.stringify(R0.key) + ' }, "push"); v32StartRun("champcards:' + R0.key + '", { keepOrder: true, push: true }); var r = S._v32run; var c = r.cards[r.deck[0]]; var f = v32CardFace(c, r); r.flip = true; var b = v32CardFace(c, r); r.flip = false; return { id: c.id, house: c.house, front: c.front, back: c.back, f: f, b: b, view: S.view, lit: v25NavWord(), parent: v32ParentRoute(), hash: location.hash }; })()');
    check('the card face: the question alone over the house\'s name, then the answer with the door to the house; on codex32\'s card screen at #/flashcards/champcards:' + R0.key + ', lit the house tab, the run climbing to the house', face.f.indexOf(esc(face.front)) > 0 && face.f.indexOf(esc(face.back)) < 0 && face.b.indexOf(esc(face.back)) > 0 && face.b.indexOf('data-go="champagne" data-arg="' + face.house + '"') > 0 && face.f.indexOf(esc(R0.house)) > 0
      && !CH.cleanProblem(face.f + face.b + '<p>' + 'x'.repeat(100) + '</p>') && !CH.drawnVoiceProblem(face.f + face.b) && face.view === 'housedeck' && /^#\/flashcards\/champcards:/.test(face.hash) && face.lit === 'brennans' && face.parent.view === 'champagne' && face.parent.arg === R0.key, JSON.stringify({ view: face.view, hash: face.hash, lit: face.lit, parent: face.parent }));
    const slotKey = T.G('v59Key()');
    const before = Object.assign({}, T.store);
    const graded = T.J('(function () { var r = S._v32run; var ids = [r.cards[r.deck[0]].id, r.cards[r.deck[1]].id]; r.flip = true; v32Grade(true); r.flip = true; v32Grade(false); var o = v59Kept(); return { ids: ids, a: o.c[ids[0]], b: o.c[ids[1]], today: v59Today(), one: v59AddDays(1), three: v59AddDays(3), learnt: v32DeckDef("champcards:' + R0.key + '").learnt, due: v32DeckDef("champdue").cards.map(function (c) { return c.id; }) }; })()');
    const moved = Object.keys(Object.assign({}, before, T.store)).filter((k) => before[k] !== T.store[k]);
    const again = T.J('(function () { v32StartRun("champcards:' + R0.key + '", { keepOrder: true, first: ' + JSON.stringify(graded.ids[0]) + ' }); var r = S._v32run; r.flip = true; v32Grade(true); return v59Kept().c[' + JSON.stringify(graded.ids[0]) + ']; })()');
    check('on seeded grades, in the layer\'s slot: a card graded right is due tomorrow, then in three days; a card graded wrong is due today', graded.a && graded.a.due === graded.one && graded.a.n === 1 && graded.b && graded.b.due === graded.today && graded.b.n === 0 && again && again.due === graded.three && again.n === 2, JSON.stringify({ a: graded.a, b: graded.b, again }));
    check('the slot is oot-codex-champrs-v1 under the profile key rule, and a grade moves no other slot (' + (moved.join(', ') || 'none') + ' moved)', /oot-codex-champrs-v1/.test(slotKey) && slotKey in T.store && JSON.stringify(moved) === JSON.stringify([slotKey]) && T.G('localStorage.getItem(v58Key()) === null'), slotKey + ' ' + moved.join(' '));
    check('the due deck deals the one sent back; one card learnt of the house\'s', JSON.stringify(graded.due) === JSON.stringify([graded.ids[1]]) && graded.learnt === 1, JSON.stringify(graded));
    const page = T.G('v59PageHtml(' + JSON.stringify(R0.key) + ')');
    const study = secOf(page, 'v59-s-study');
    const states = attrs(study, /<span class="v59-cardstate">([^<]*)<\/span>/g);
    check('a house\'s Study: its three cards with when each is due (' + states.join(', ') + '), and the doors to its cards, its quiz, Present it and the drill', states.length === 3 && states.indexOf('Due today') >= 0 && states.indexOf('New') >= 0 && study.indexOf('data-v59="cards" data-deck="champcards:' + R0.key + '"') > 0 && study.indexOf('data-v59="quiz" data-key="' + R0.key + '"') > 0 && study.indexOf('data-go="champpresent" data-arg="' + R0.key + '"') > 0, study.slice(0, 300));
    const root = T.G('v59RootHtml()');
    const line = unesc((/id="v59-door-cards"><span class="v25row-name">[^<]*<\/span><span class="v25row-line">([^<]*)</.exec(root) || [])[1] || '');
    check('the due count on the root: ' + line, line.indexOf('1 due today') === 0, line);
    const deck = T.J('(function () { v32Go({ view: "champagne", arg: "" }, "push"); var ok = v59StartCards(""); return { ok: ok, deck: S._v32run && S._v32run.deckId, lit: v25NavWord(), parent: v32ParentRoute() }; })()');
    check('the cards door on the root with a card due starts the due deck, lit the house tab and climbing to the root', deck.ok === true && deck.deck === 'champdue' && deck.lit === 'brennans' && deck.parent.view === 'champagne' && !deck.parent.arg, JSON.stringify(deck));
    const T2 = await bootDevice();
    const screen = T2.J('(function () { v32Go({ view: "champagne", arg: "" }, "push"); var ok = v59StartCards(""); var a = { ok: ok, view: S.view, deck: S._v32deck, lit: v25NavWord(), parent: v32ParentRoute(), html: v32DeckHtml() }; v32Back(); a.back = S.view; v32StartRun("champcards:' + R0.key + '", {}); var r = S._v32run; while (r.deck.length) { r.flip = true; v32Grade(true); } a.end = v32CardHtml(); return a; })()');
    check('with nothing due the cards door opens the whole deck\'s own screen, lit the house tab, Back to the root; a deck dealt to its end offers Every house of the class sheet, never the Library', screen.ok === true && screen.view === 'deck' && screen.deck === 'champcards' && screen.lit === 'brennans' && screen.parent.view === 'champagne' && !pageProblem(screen.html) && screen.back === 'champagne' && screen.end.indexOf('data-go="champagne" data-arg="" id="v59-deck-all"') > 0 && screen.end.indexOf('data-v32="another"') < 0, JSON.stringify({ view: screen.view, deck: screen.deck, back: screen.back, p: pageProblem(screen.html) }));
  } catch (e) { check('section 9 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('10. the matching drill');
  try {
    const M = await bootDevice();
    const deals = M.J('(function () { var out = []; v59Houses().forEach(function (r) { ["house", "cuvee"].forEach(function (w) { for (var i = 0; i < 6; i++) { var d = v59DrillDeal(r.key, w); out.push({ key: r.key, way: w, prompt: d.prompt, opts: d.opts, a: d.a }); } }); }); return out; })()');
    const byKey = {}; REC.forEach((r) => { byKey[r.key] = r; });
    const names = (r) => { const out = []; const add = (s) => { const f = fold(s); if (f && out.indexOf(f) < 0) out.push(f); }; add(r.cuvee.name); if (r.also) add(r.also.name); String(r.sheet.prints).split('/').concat(String(r.sheet.label).split(/[;/]/)).forEach((p) => { add(p); add(p.replace(/\([^)]*\)/g, ' ')); }); return out; };
    const near = (a, b) => { const x = ' ' + fold(a) + ' ', y = ' ' + fold(b) + ' '; return !!fold(a) && !!fold(b) && (x === y || x.indexOf(y) >= 0 || y.indexOf(x) >= 0); };
    const ansBad = [], wrongBad = [];
    deals.forEach((d) => {
      const r = byKey[d.key];
      const answer = d.way === 'house' ? r.cuvee.name : r.house;
      if (d.prompt !== (d.way === 'house' ? r.house : r.cuvee.name) || !d.opts[d.a] || d.opts[d.a].key !== r.key || d.opts[d.a].text !== answer) ansBad.push(d.key + ' ' + d.way);
      if (d.opts.length !== Math.min(4, REC.length)) ansBad.push(d.key + ' ' + d.way + ' ' + d.opts.length + ' options');
      d.opts.forEach((o, i) => {
        if (i === d.a) return;
        const x = byKey[o.key];
        if (!x || x.key === r.key) { wrongBad.push(d.key + ': ' + o.text + ' is no other house'); return; }
        if (o.text !== (d.way === 'house' ? x.cuvee.name : x.house)) wrongBad.push(d.key + ': ' + o.text + ' is not ' + x.key + '\'s');
        if (d.way === 'house' && names(r).some((n) => near(n, o.text))) wrongBad.push(d.key + ': ' + o.text + ' is a name ' + r.house + ' answers to');
        if (d.way === 'cuvee' && names(x).some((n) => near(n, r.cuvee.name))) wrongBad.push(d.key + ': ' + x.house + ' answers to ' + r.cuvee.name);
      });
      if (new Set(d.opts.map((o) => fold(o.text))).size !== d.opts.length) wrongBad.push(d.key + ' ' + d.way + ': an answer twice');
    });
    check('the matching drill both ways on every house (' + deals.length + ' deals): the house shown, its cuvée as the label prints it the answer; the cuvée shown, its house the answer; four answers', REC.length >= 2 && ansBad.length === 0, few(ansBad, 5));
    check('every wrong answer of the drill another house\'s own cuvée or name, never one the shown house or cuvée also answers to (the sheet\'s words, the label\'s, the second cuvée), never twice', wrongBad.length === 0, few(wrongBad, 5));
    /* the clash proved on a fixture whatever the data holds: a house whose cuvée is Grande Cuvée (Krug's, beside the
       sheet's Grand Cuvée and the second cuvée Grande Cuvée for Ayala) added to a copy of the data on a device of its
       own; Ayala shown, Grande Cuvée is never a wrong answer, nor any name Ayala answers to (Krug Grande Cuvée, once
       Krug is written, stands ahead of the fixture and would be the one offered), and Grande Cuvée shown, Ayala is
       never one */
    const F = await bootDevice();
    const clash = REC.some((r) => r.key === 'ayala') ? F.J('(function () { var d = JSON.parse(JSON.stringify(CHAMPAGNE_HOUSES)); var f = JSON.parse(JSON.stringify(d.houses[0])); f.key = "zz-fixture"; f.house = "Fixture House"; f.cuvee.name = "Grande Cuvée"; f.sheet = { prints: "Grande Cuvée", label: "Grande Cuvée", note: "" }; delete f.also; d.houses.push(f); CHAMPAGNE_HOUSES = d; var a = 0, b = 0; for (var i = 0; i < 40; i++) { var x = v59DrillDeal("ayala", "house"); if (x.opts.some(function (o, j) { return j !== x.a && (o.key === "zz-fixture" || v59Clash(v59Names(v59Rec("ayala")), o.text)); })) a++; var y = v59DrillDeal("zz-fixture", "cuvee"); if (y.opts.some(function (o, j) { return j !== y.a && o.key === "ayala"; })) b++; } return { a: a, b: b, n: v59Houses().length }; })()') : null;
    check('a name a house answers to is never a wrong answer (a fixture Grande Cuvée beside Ayala\'s sheet, ' + (clash ? clash.n + ' houses' : 'Ayala not written') + '): Ayala shown, never Grande Cuvée; Grande Cuvée shown, never Ayala', !clash || (clash.a === 0 && clash.b === 0 && clash.n === REC.length + 1), JSON.stringify(clash));
    const run = M.J('(function () { v32Go({ view: "champdrill", arg: "" }, "push"); var d = v59DrillRound(""); var n = d.items.length; var it = d.items[0]; var wrong = (it.a + 1) % it.opts.length; v59DrillPick(wrong); var after = d.items.length; var miss = d.missed.length; v59DrillNext(); var it2 = d.items[1]; if (it2) { v59DrillPick(it2.a); v59DrillNext(); } var html = v59DrillHtml(""); while (!d.done) { var x = v59DrillItem(); v59DrillPick(x.a); v59DrillNext(); } return { n: n, after: after, miss: miss, right: d.right, done: d.done, last: d.items[d.items.length - 1].key === it.key && d.items[d.items.length - 1].again === true, html: html, end: v59DrillHtml(""), lit: v25NavWord(), parent: v32ParentRoute() }; })()');
    check('a round: ten questions, or one a house where fewer are written (' + run.n + '); a wrong pick counted a miss and its question coming back at the end once; right counted at the first try only; the end naming the score and the houses to learn again, lit the house tab, climbing to the root', run.n === Math.min(10, REC.length) && run.after === run.n + 1 && run.miss === 1 && run.right === run.n - 1 && run.done && run.last && !pageProblem(run.html) && !pageProblem(run.end) && run.end.indexOf('id="v59-d-end"') > 0 && run.end.indexOf('id="v59-miss-') > 0 && run.lit === 'brennans' && run.parent.view === 'champagne', JSON.stringify({ n: run.n, after: run.after, miss: run.miss, right: run.right, last: run.last }));
  } catch (e) { check('section 10 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('11. the quiz');
  try {
    const Q = await bootDevice();
    const R0 = REC[0];
    const one = Q.J('(function () { v32Go({ view: "champagne", arg: ' + JSON.stringify(R0.key) + ' }, "push"); var ok = v59StartQuiz(' + JSON.stringify(R0.key) + ', ""); return { ok: ok, view: S.view, mode: S.mode, section: S.section, ids: S.pool.map(function (q) { return q.id; }), keyed: S.pool.every(function (q) { return Array.isArray(q.opts) && q.opts.length === 4 && q.opts[q.a] !== undefined; }), lit: v25NavWord(), parent: v32ParentRoute() }; })()');
    const want = 'Champagne houses: ' + R0.house;
    check('a house\'s quiz: its three questions through the core engine as a drill, the section ' + want + ', lit the house tab, climbing to the house', one.ok === true && one.view === 'quiz' && one.mode === 'drill' && one.section === want && one.ids.slice().sort().join() === R0.questions.map((q) => q.id).sort().join() && one.keyed && one.lit === 'brennans' && one.parent.view === 'champagne' && one.parent.arg === R0.key, JSON.stringify(one).slice(0, 400));
    const asShipped = Q.J('v59QsOf(' + JSON.stringify(R0.key) + ').map(function (q) { return [q.id, q.q, q.opts, q.a]; })');
    check('the questions as the build dealt them, options and key unmoved', JSON.stringify(asShipped) === JSON.stringify(R0.questions.map((q) => [q.id, q.q, q.opts, q.a])));
    const before = JSON.parse(Q.G('localStorage.getItem("codexStats") || "{}"'));
    const ans = Q.J('(function () { var a = S.pool[0], b = S.pool[1]; statRecord(a, true); statRecord(b, false); var o = v59Kept(); var ka = qKey(a), kb = qKey(b); return { a: a.id, b: b.id, ra: o.q[a.id], rb: o.q[b.id], one: v59AddDays(1), today: v59Today(), srs: [ST.srs[ka] || null, ST.srs[kb] || null], owned: [keyOwned(ka), keyOwned("certified|" + a.id), keyOwned(a.id)], found: (findByKey(ka) || {}).id }; })()');
    check('answered through the engine (statRecord): right, due tomorrow in the layer\'s slot; wrong, due today; never in codex3\'s rotation (ST.srs untouched), never level progress, found by its key', ans.ra && ans.ra.due === ans.one && ans.ra.n === 1 && ans.rb && ans.rb.due === ans.today && ans.rb.n === 0 && ans.srs[0] === null && ans.srs[1] === null && JSON.stringify(before.srs || {}) === Q.G('JSON.stringify(ST.srs || {})') && ans.owned.every((x) => x === false) && ans.found === ans.a, JSON.stringify(ans));
    const orph = Q.J('(function () { var o = qidAudit(); var n = 0; Object.keys(o.orphanedKeys || {}).forEach(function (k) { n += (o.orphanedKeys[k] || []).filter(function (x) { return /\\bhc-/.test(x); }).length; }); return n; })()');
    check('a key of the tab is never an orphan in the ledger\'s audit', orph === 0, orph);
    const all = Q.J('(function () { v32Go({ view: "champagne", arg: "" }, "push"); v59StartQuiz("", ""); var a = { n: S.pool.length, first: S.pool[0] && S.pool[0].id, section: S.section, parent: v32ParentRoute(), lit: v25NavWord() }; v59StartQuiz("", "match"); a.m = S.pool.map(function (q) { return q.tag; }); a.mSection = S.section; return a; })()');
    const total = REC.length * 3;
    check('the quiz on every house: ten a round (of ' + total + '), the one due first, climbing to the root; the matching questions alone, one a house', all.n === Math.min(10, total) && all.first === ans.b && all.section === WORDS.quizAll && all.parent.view === 'champagne' && !all.parent.arg && all.lit === 'brennans' && all.m.length === REC.length && all.m.every((t) => t === 'match') && all.mSection === WORDS.quizMatch, JSON.stringify(all));
    const again = Q.J('(function () { startDrill(' + JSON.stringify(want) + '); var a = { n: S.pool.length, section: S.section }; startDrill(' + JSON.stringify(WORDS.quizAll) + '); a.all = S.section; startDrill(' + JSON.stringify(WORDS.quizMatch) + '); a.match = S.section; return a; })()');
    check('dealt again by its section (the results screen and codex19\'s report ask startDrill): the house\'s, every house\'s, the matching questions\'', again.n === 3 && again.section === want && again.all === WORDS.quizAll && again.match === WORDS.quizMatch, JSON.stringify(again));
  } catch (e) { check('section 11 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('12. Present it');
  try {
    const P = await bootDevice();
    const R0 = REC[0];
    const p = P.J('(function () { v32Go({ view: "champpresent", arg: ' + JSON.stringify(R0.key) + ' }, "push"); var a = { view: S.view, arg: v32Arg("champpresent"), first: v59PresentHtml(V59_ARGS.champpresent) }; V59_ACTS.reveal(); a.shown = v59PresentHtml(V59_ARGS.champpresent); V59_ACTS.mark({ getAttribute: function (k) { return k === "data-ok" ? "1" : null; } }); a.marked = v59PresentHtml(V59_ARGS.champpresent); a.rec = v59Kept().p[' + JSON.stringify(R0.key) + ']; a.one = v59AddDays(1); V59_ACTS.pnext(); a.next = v32Arg("champpresent"); a.parent = v32ParentRoute(); a.lit = v25NavWord(); return a; })()');
    check('Present it: the house shown with how to say it and the line hidden; revealed, the cuvée\'s forty five second line and the sale; marked said well, due tomorrow in the slot by the house\'s key; then the next house, climbing to the root', p.view === 'champpresent' && p.arg === R0.key && p.first.indexOf(esc(R0.table.cuvee45)) < 0 && p.first.indexOf(esc(R0.house)) > 0 && p.shown.indexOf(esc(R0.table.cuvee45)) > 0 && p.shown.indexOf(esc(R0.table.sale)) > 0 && p.rec && p.rec.due === p.one && p.marked.indexOf('id="v59-p-marked"') > 0 && p.next !== R0.key && (REC.length < 2 || !!p.next) && p.parent.view === 'champagne' && p.lit === 'brennans' && !pageProblem(p.first) && !pageProblem(p.shown) && !pageProblem(p.marked), JSON.stringify({ arg: p.arg, rec: p.rec, next: p.next }));
  } catch (e) { check('section 12 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('13. the door from Producers and flagships');
  try {
    const picked = REC.filter((r) => r.pick);
    const out = D.J('(function () { var out = []; Object.keys(FLAGSHIPS).forEach(function (id) { var f = FLAGSHIPS[id]; var h = v58PageHtml(id); var at = h.indexOf(\'aria-labelledby="v58-s-champ"\'); if (at >= 0) out.push({ key: f.key, last: h.lastIndexOf(\'<section class="v58-sec\') === h.lastIndexOf(\'<section class="v58-sec\', at), door: (/data-go="champagne" data-arg="([^"]+)"/.exec(h.slice(at)) || [])[1] || "" }); }); return out; })()');
    const doorBad = [];
    picked.forEach((r) => { const x = out.find((o) => o.key === r.pick); if (!x || !x.last || x.door !== r.key) doorBad.push(r.key + ': ' + JSON.stringify(x)); });
    out.forEach((o) => { if (!picked.some((r) => r.pick === o.key)) doorBad.push(o.key + ' has no house of the sheet, yet a door'); });
    const flag = picked[0] ? D.J('(function () { var f = null; Object.keys(FLAGSHIPS).forEach(function (id) { if (FLAGSHIPS[id].key === ' + JSON.stringify(picked[0].pick) + ') f = id; }); var h = v59PageHtml(' + JSON.stringify(picked[0].key) + '); return { f: f, door: h.indexOf(\'data-go="flagship" data-arg="\' + f + \'"\') > 0 }; })()') : { door: true };
    check('a door from Producers and flagships: the page of each house of the sheet with a record there (' + picked.length + ') gains, last, a door to its page here, and no other page does; the house page here opens that record', doorBad.length === 0 && flag.door === true, few(doorBad, 4) + ' ' + JSON.stringify(flag));
  } catch (e) { check('section 13 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('14. the shell and the chain rule');
  try {
    const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
    const at = (s) => index.indexOf(s);
    const i58 = at('src="js/codex58.js'), iData = at('src="js/data-champagne.js?v='), i59 = at('src="js/codex59.js?v='), iBoot = at('src="js/boot.js');
    check('index.html loads js/data-champagne.js then js/codex59.js, each once with ?v=, after codex58.js and before boot.js', i58 > 0 && iData > i58 && i59 > iData && iBoot > i59 && index.split('js/codex59.js').length === 2 && index.split('js/data-champagne.js').length === 2);
    const v = Number((sw.match(/const CACHE = '(?:oot-)?codex-v(\d+)';/) || [])[1]);
    const s58 = sw.indexOf("'./js/codex58.js'"), sData = sw.indexOf("'./js/data-champagne.js'"), s59 = sw.indexOf("'./js/codex59.js'");
    check('sw.js is codex-v123 or later (' + v + ') and lists ./js/data-champagne.js and ./js/codex59.js once each, after ./js/codex58.js', v >= 123 && s58 > 0 && sData > s58 && s59 > sData && sw.split("'./js/codex59.js'").length === 2 && sw.split("'./js/data-champagne.js'").length === 2, 'v' + v);
    const gates = fs.readdirSync(GATES).filter((f) => /^(check-|list-harness)[\w-]*\.c?js$/.test(f));
    const short = [];
    gates.forEach((f) => {
      const t = fs.readFileSync(path.join(GATES, f), 'utf8');
      const re = /'codex58\.js'\s*([,\]])/g;
      let m;
      while ((m = re.exec(t))) {
        const after = t.slice(m.index + 12, m.index + 300);
        const straight = /^\s*,\s*'data-champagne\.js'\s*,\s*'codex59\.js'/.test(after);
        const follows = m[1] === ']' && /^\s*\]\s*:\s*\[\]\)?\s*\.?(?:concat\()?[^;]{0,160}?\['data-champagne\.js',\s*'codex59\.js'\]/.test(after);
        const opens = m[1] === ']' && /^\s*\][^;]{0,200}?\['data-champagne\.js',\s*'codex59\.js'\]/.test(after);
        if (!straight && !follows && !opens) short.push(f + ': ' + t.slice(Math.max(0, m.index - 40), m.index + 60).replace(/\s+/g, ' '));
      }
    });
    check('the chain rule: every list in a gate here that names codex58.js names data-champagne.js and codex59.js straight after it, or in the list that follows it (' + gates.length + ' gates read)', !short.length && gates.length > 40, few(short, 3));
  } catch (e) { check('section 14 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('15. the layer\'s file');
  try {
    const read = SRC.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
    /* a spaced hyphen in code is arithmetic, so the source is held to every rule but that one, which the drawn pages and V59_WORDS carry */
    const srcBad = voiceProblems(SRC).concat(voiceProblems(read.replace(/[\u0300-\u036f]/g, ''))).filter((x) => !/hyphen standing/.test(x));
    check('codex59.js (its escapes read as the characters they are): no dash of any kind, never the retired word, no level numeral, nothing at or above U+2190', srcBad.length === 0, srcBad.join(', '));
    const people = S.people().names.filter((n) => (' ' + fold(SRC) + ' ').indexOf(' ' + fold(n) + ' ') >= 0);
    check('codex59.js names nobody living, not the house, ships no key and no model name, and holds no hc- literal (the prefix is the data\'s meta)', !people.length && !/Brennan/.test(SRC) && !/sk-ant|api[_-]?key|claude-|\bopus\b|\bsonnet\b|\bhaiku\b|\bfable\b|chatgpt|openai/i.test(SRC) && !/["'`]hc-|\^hc-|\bhc-[0-9a-z]{8}\b/.test(SRC), people.join(', '));
    const code = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/'(?:[^'\\\n]|\\.)*'/g, "''");
    check('codex59.js declares with var and function only (no let, const, class or arrow)', !/(^|[^\w.'"])(let|const|class)\s/.test(code) && code.indexOf('=>') < 0);
    const wrappers = SRC.split('\n').filter((l) => /^\s*var _v59\w+ = \w+;$/.test(l));
    const unguarded = wrappers.filter((line) => { const m = /var (_v59\w+) = (\w+);$/.exec(line); const i = SRC.indexOf(line); const before = SRC.slice(Math.max(0, i - 200), i); return !new RegExp('if \\(typeof ' + m[2] + ' === \'function\'\\) \\{\\s*$').test(before); });
    const pairs = wrappers.map((l) => { const m = /var (_v59\w+) = (\w+);$/.exec(l); return [m[2], m[1]]; });
    const outer = D.J('(function (pairs) { var out = []; pairs.forEach(function (p) { var f = this[p[0]]; if (typeof f !== "function" || typeof this[p[1]] !== "function" || f === this[p[1]] || String(f).indexOf("_v59") < 0) out.push(p[0]); }, this); return out; }).call(this, ' + JSON.stringify(pairs) + ')');
    check('codex59.js edits no earlier layer: every wrapper (' + wrappers.length + ') is typeof guarded, the guard on the line above it, and the outermost of its function on the chain', wrappers.length >= 18 && unguarded.length === 0 && outer.length === 0, unguarded.concat(outer).join(' | '));
    const cssAt = SRC.indexOf('css.textContent = ['), cssEnd = SRC.indexOf("].join('\\n')", cssAt);
    const rules = [...SRC.slice(cssAt, cssEnd).matchAll(/^\s*'((?:[^'\\]|\\.)*)',?$/gm)].map((m) => m[1]);
    const selBad = [];
    rules.forEach((r) => {
      const body = /^@media[^{]*\{(.*)\}$/.exec(r);
      const rule = body ? body[1] : r;
      const sel = rule.slice(0, rule.indexOf('{'));
      sel.split(',').forEach((x) => { if (!/^\.wrap\s/.test(x.trim())) selBad.push(x.trim()); });
    });
    check('every selector of the v59-style element (' + rules.length + ' rules) starts .wrap, every colour a house token (no colour written out)', rules.length > 50 && selBad.length === 0 && !rules.some((r) => /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(r)), selBad.slice(0, 5).join(' | '));
    const PARCH_T = ['--ink', '--ink-soft', '--claret'], DARK_T = ['--parch', '--parch2', '--gold', '--gold-soft', '--gold-hi'];
    const groundBad = [];
    let coloured = 0;
    rules.forEach((r) => {
      const body = /^@media[^{]*\{(.*)\}$/.exec(r);
      const rule = body ? body[1] : r;
      const sel = rule.slice(0, rule.indexOf('{'));
      const m = /[{;]color:var\((--[\w-]+)\)/.exec(rule.slice(rule.indexOf('{')));
      if (!m) return;
      coloured++;
      if (((/\.v59-(?:f|p)card\b/.test(sel)) ? PARCH_T : DARK_T).indexOf(m[1]) < 0) groundBad.push(sel + ' ' + m[1]);
    });
    const c39 = fs.readFileSync(path.join(JS, 'codex39.js'), 'utf8');
    const srcTok = (/'\.wrap \.v39-sources a\{(?:[^'}]*;)?color:var\((--[\w-]+)\)/.exec(c39) || [])[1] || '';
    const ourSrc = (/[{;]color:var\((--[\w-]+)\)/.exec(rules.find((r) => /^\.wrap \.v59-sources a\{/.test(r)) || '') || [])[1] || '';
    if (PARCH_T.indexOf(srcTok) >= 0 && DARK_T.indexOf(ourSrc) < 0) groundBad.push('.v59-sources a: codex39 colours its sources ' + srcTok + ' for parchment, and this layer gives them no dark page colour on its own ground');
    check('every colour on its own ground (the contrast rule, ' + coloured + ' coloured rules): under a card the parchment\'s tokens, elsewhere the dark page\'s, and the sources (codex39\'s ' + (srcTok || 'none') + ') given ' + (ourSrc || 'nothing'), coloured > 15 && groundBad.length === 0, groundBad.join(' | '));
    let lits = SRC.replace(/\/\*[\s\S]*?\*\//g, '');
    const cut = (s, a0, b0, off) => { const a = s.indexOf(a0), b = a >= 0 ? s.indexOf(b0, a) : -1; return a < 0 || b < 0 ? s : s.slice(0, a) + s.slice(b + off); };
    lits = cut(lits, 'var V59_WORDS = {', '\n};', 3);
    lits = cut(lits, 'css.textContent = [', "].join('\\n')", 0);
    const earlier = fs.readdirSync(JS).filter((f) => /^codex\d+\.js$/.test(f) && f !== 'codex59.js').map((f) => fs.readFileSync(path.join(JS, f), 'utf8')).join('\n');
    const strayWords = [];
    [...lits.matchAll(/'((?:[^'\\\n]|\\.)*)'/g)].map((m) => m[1]).forEach((l) => {
      const text = l.replace(/<[^>]*>/g, ' ').replace(/<[^>]*$/, ' ').replace(/^[^<]*>/, ' ').trim();
      if (!text || Object.prototype.hasOwnProperty.call(WORDS, text)) return;
      const prose = /[A-Z][a-z]{2,}/.test(text) || /[a-z]{2,}\s+[a-z]{2,}\s+[a-z]{2,}/.test(text);
      if (prose && earlier.indexOf(text) < 0) strayWords.push(text);
    });
    const keyCalls = [...SRC.matchAll(/v59W\('([A-Za-z_-]+)'\s*[,)]/g)].map((m) => m[1]).filter((k, i, a) => a.indexOf(k) === i);
    const noKey = keyCalls.filter((k) => !Object.prototype.hasOwnProperty.call(WORDS, k));
    const dyn = ['code_', 'kind_', 'alsoH_'];
    const unread = Object.keys(WORDS).filter((k) => keyCalls.indexOf(k) < 0 && SRC.split("'" + k + "'").length < 2 && !dyn.some((p) => k.indexOf(p) === 0));
    check('every word the layer shows is V59_WORDS\'s: no shown string literal outside it, every key it reads there (' + keyCalls.length + ' named), and every word of it read', strayWords.length === 0 && noKey.length === 0 && unread.length === 0, strayWords.concat(noKey, unread.map((k) => 'unread ' + k)).slice(0, 6).join(' | '));
    const wordBad = Object.keys(WORDS).map((k) => [k, voiceProblems(WORDS[k])]).filter((x) => x[1].length);
    const SUPER = /\b(best|most|finest|greatest|largest|smallest|highest|lowest|oldest|newest|easiest|hardest|fastest|ultimate|iconic|legendary|world class|famous|renowned|top|unique|cult|benchmark)\b/i;
    const AMER_W = /\b(color\w*|center\w*|toward|favor\w*|flavor\w*|\w+iz(e|es|ed|ing)|gray|program|practice|catalog|percent)\b/i;
    const wordStyle = Object.keys(WORDS).filter((k) => SUPER.test(WORDS[k]) || AMER_W.test(WORDS[k]) || /\bLevel\s+\d/.test(WORDS[k]) || /\$|£|€|%/.test(WORDS[k]) || /\b(cheap|expensive|price|value|bargain|score|points|medal|currently|now owned)\b/i.test(WORDS[k]));
    check('every word of V59_WORDS (' + Object.keys(WORDS).length + ') in the strictest voice: no dash, never the retired word, no level numeral, no superlative, British spelling, no price, no score, nothing told as a present state', Object.keys(WORDS).length > 100 && wordBad.length === 0 && wordStyle.length === 0, JSON.stringify(wordBad.concat(wordStyle)));
    const selfBad = voiceProblems(fs.readFileSync(__filename, 'utf8').replace(/(^|[^\w])Practise(?!\w)/g, '$1')).filter((p) => !/retired|numeral|hyphen/.test(p));
    check('check-champagne.js itself carries no dash and nothing at or above U+2190', selfBad.length === 0, selfBad.join(', '));
  } catch (e) { check('section 15 ran to its end', false, e && e.stack); }
}

/* ---- the gate proves it can fail ----
   Each mutation breaks one rule in a scratch copy of the shipped tree (index.html, sw.js, js/, every file copied, never
   linked) or, for the chain rule, of the gates; this gate, run on it, must fail, and fail by the check that names the
   rule. */
function copyTree(from, to) {
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach((name) => {
    const a = path.join(from, name), b = path.join(to, name);
    const st = fs.statSync(a);
    if (st.isDirectory()) copyTree(a, b);
    else if (st.isFile()) fs.writeFileSync(b, fs.readFileSync(a));
  });
}
function firstOf(re) {
  const t = fs.readFileSync(path.join(JS, 'data-champagne.js'), 'utf8');
  const m = re.exec(t);
  return m ? m[1] : 'none';
}
function mutations() {
  const card = firstOf(/"cards":\[\{"id":"(hc-[0-9a-z]{8})"/);
  const table = firstOf(/"house10":"([^"]{20,60})/);
  const living = S.people().names[0];
  const MUT = [
    ['the data file edited by hand', 'js/data-champagne.js', '"edition":"' + PLAN.edition + '"', '"edition":"2026-01-01"', 'the data is the build'],
    ['a card id moved in the data', 'js/data-champagne.js', '{"id":"' + card + '"', '{"id":"hc-00000000"', 'ids against keys.v1.json'],
    ['a living name in a table line', 'js/data-champagne.js', '"house10":"' + table, '"house10":"' + living + ' says ' + table, 'nobody living of people.json'],
    ['a house left off the root', 'js/codex59.js', "+ '<ul class=\"v25rows v32rows v59-houses\">' + list.map(v59HouseRow).join('')", "+ '<ul class=\"v25rows v32rows v59-houses\">' + list.slice(1).map(v59HouseRow).join('')", 'the root lists every house once'],
    ['the lesson left off the root', 'js/codex59.js', "+ v59P('', v59W('lesson1')) + v59P('', v59W('lesson2'))", "+ v59P('', v59W('lesson2'))", 'the lesson of what a prestige cuvée is'],
    ['At the table set after the chips', 'js/codex59.js', '  html += v59TableHtml(r);\n  var secs = v59Sections(r);\n', '  var secs = v59Sections(r);\n', 'At the table first'],
    ['the sale left out of the cuvée\'s block', 'js/codex59.js', "    + (v59Str(t.sale) ? eb('sale') + v59P('v59-tsale', t.sale) : '')\n    + (v59Str(t.cuvee10)", "    + (v59Str(t.cuvee10)", 'the two blocks at the table'],
    ['the story left out of a page', 'js/codex59.js', "    ['v59-s-story', v59W('storyChip'), v59P('v59-story', r.story), 'v59-storysec', v59W('storyH')],\n", '', 'the sections in their order'],
    ['the sheet drawn before the label swapped', 'js/codex59.js', "v59Esc(v59W('sheetPrints')) + '</p><p class=\"v59-sheet-t\">' + v59Txt(s.prints)", "v59Esc(v59W('sheetPrints')) + '</p><p class=\"v59-sheet-t\">' + v59Txt(s.label)", 'every field drawn where the record holds it'],
    ['the sources drawn open', 'js/codex59.js', 'id="v59-s-sources" data-v48-keep=', 'id="v59-s-sources" open data-v48-keep=', 'the sources closed at the foot'],
    ['the filter matching nothing', 'js/codex59.js', "  if (!words.length) return true;\n  var hay", "  if (!words.length) return true;\n  return false;\n  var hay", 'the filter by a word typed'],
    ['the room never pushed', 'js/codex59.js', "    V48_ROOMS.push(['champagne', v59W('tab')]);", '', 'Champagne houses is the fifth room'],
    ['the tap on the current room left to codex48', 'js/codex59.js', "    v59Go('champagne', '', 'push');\n    return true;\n  } catch (e) { return false; }", "    return false;\n  } catch (e) { return false; }", 'a tap on Champagne houses from a house page'],
    ['a house climbing to Home', 'js/codex59.js', "  parent: function (arg) { return v59Rec(arg) ? { view: 'champagne' } : { view: 'brennans' }; }", "  parent: function (arg) { return v59Rec(arg) ? { view: 'home' } : { view: 'brennans' }; }", 'the parents: a house the root'],
    ['the cold address left unread', 'js/codex59.js', "    v32Apply(r, typeof v32CurState === 'function' ? v32CurState() : null);\n    V32.pend = 'replace';\n", '', 'each address answers cold'],
    ['a list row opening no card', 'js/codex59.js', 'data-v59="wine" data-id="\' + v59Esc(x.id) + \'"', 'data-v59="wine" data-id="\' + v59Esc(x.id + \'0\') + \'"', 'every row of On'],
    ['a vintage drawn on the list', 'js/codex59.js', ".replace(/\\s*\\b(?:1[89]|20)\\d{2}\\b/g, '').replace(/\\s{2,}/g, ' ').trim() });", ".trim() + ' 2015' });", 'every row of On'],
    ['the matching deck dealing the term cards', 'js/codex59.js', "return c.ck === 'house' || c.ck === 'cuvee';", "return !!c.ck;", 'the decks: champcards every card'],
    ['a grade scheduled backwards', 'js/codex59.js', "v59Sched('c', c.id, !!got);", "v59Sched('c', c.id, !got);", 'a card graded right is due tomorrow'],
    ['the grades kept in the Producers and flagships slot', 'js/codex59.js', "var V59_SLOT = 'oot-codex-champrs-v1';", "var V59_SLOT = 'oot-codex-flagrs-v1';", 'the slot is oot-codex-champrs-v1'],
    ['the drill keyed to the first answer', 'js/codex59.js', "  opts.forEach(function (o, i) { if (o.key === r.key) a = i; });", "  a = 0;", 'the matching drill both ways'],
    ['the drill offering a name the house answers to', 'js/codex59.js', "    if (w === 'house' && v59Clash(mine, text)) return;\n", '', 'a name a house answers to is never a wrong answer'],
    ['the drill offering a house the cuvée also names', 'js/codex59.js', "    if (w === 'cuvee' && v59Clash(v59Names(x), v59Cuvee(r))) return;\n", '', 'a name a house answers to is never a wrong answer'],
    ['a missed question never coming back', 'js/codex59.js', "    if (again) { again.again = true; d.items.push(again); }", '', 'a round: ten questions'],
    ['a house\'s quiz dealing every question', 'js/codex59.js', '  if (key) return v59Shuffle(v59QsOf(key));', '  if (key) return v59Shuffle(v59QBook().list);', 'a house\'s quiz'],
    ['an answer kept in codex3\'s rotation', 'js/codex59.js', "      try { if (v59Own(v59QBook().by, q.id)) v59Sched('q', q.id, !!ok); } catch (e) { }\n      return;\n", "      try { if (v59Own(v59QBook().by, q.id)) v59Sched('q', q.id, !!ok); } catch (e) { }\n", 'never in codex3\'s rotation'],
    ['a key left an orphan in the ledger', 'js/codex59.js', '          if (left.length) orph[name] = left; else delete orph[name];\n', '', 'never an orphan in the ledger'],
    ['Present it keeping no mark', 'js/codex59.js', "    v59Sched('p', key, ok);\n", '', 'Present it: the house shown'],
    ['no door from Producers and flagships', 'js/codex59.js', "      var r = v59ForPick(f && f.key);\n      if (!r) return null;", "      return null;", 'a door from Producers and flagships'],
    ['the two tags swapped in index.html', 'index.html', '<script src="js/data-champagne.js?v=2"></script>\n<script src="js/codex59.js?v=1"></script>', '<script src="js/codex59.js?v=1"></script>\n<script src="js/data-champagne.js?v=2"></script>', 'index.html loads js/data-champagne.js then js/codex59.js'],
    ['a let in the layer', 'js/codex59.js', 'var V59_SLOT = ', 'let V59_SLOT = ', 'declares with var and function only'],
    ['an unguarded wrapper', 'js/codex59.js', "if (typeof v32CardFace === 'function') {\n  var _v59CardFace", "if (true) {\n  var _v59CardFace", 'every wrapper'],
    ['a selector outside .wrap', 'js/codex59.js', "'.wrap .v59-sec{", "'.v59-sec{", 'every selector of the v59-style element'],
    ['a shown word outside V59_WORDS', 'js/codex59.js', "v59Esc(v59W('lessonH'))", "'What a prestige wine is'", 'every word the layer shows is V59_WORDS'],
    ['a superlative in V59_WORDS', 'js/codex59.js', "tab: 'Champagne houses',", "tab: 'The finest Champagne houses',", 'in the strictest voice'],
    ['a gate list naming codex58.js without the new files', 'gates', "'codex58.js', 'data-champagne.js', 'codex59.js'", "'codex58.js'", 'the chain rule'],
    ['the sources left claret on the page\'s own ground', 'js/codex59.js', "'.wrap .v59-sources a{color:var(--gold-hi)}',", "'.wrap .v59-sources a{text-underline-offset:3px}',", 'every colour on its own ground'],
    ['a parchment colour on the page\'s own ground', 'js/codex59.js', "'.wrap .v59-fname{display:block;font-weight:700;color:var(--gold-hi);", "'.wrap .v59-fname{display:block;font-weight:700;color:var(--claret);", 'every colour on its own ground']
  ];
  const repoRoot = path.join(JS, '..');
  let held = 0;
  const problems = [];
  const only = process.env.CHAMPAGNE_MUTATION || '';
  const RUN = MUT.filter((m) => !only || only.split('|').some((w) => m[0].indexOf(w) >= 0));
  for (const [name, file, from, to, by] of RUN) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'champagne-mut-'));
    copyTree(JS, path.join(dir, 'js'));
    fs.writeFileSync(path.join(dir, 'index.html'), fs.readFileSync(path.join(repoRoot, 'index.html')));
    fs.writeFileSync(path.join(dir, 'sw.js'), fs.readFileSync(path.join(repoRoot, 'sw.js')));
    const env = Object.assign({}, process.env);
    let target;
    if (file === 'gates') {
      fs.mkdirSync(path.join(dir, 'gates'));
      fs.readdirSync(GATES).filter((f) => /^(check-|list-harness)[\w-]*\.c?js$/.test(f)).forEach((f) => fs.writeFileSync(path.join(dir, 'gates', f), fs.readFileSync(path.join(GATES, f))));
      target = path.join(dir, 'gates', 'check-cms.js');
      env.CHAMPAGNE_GATES = path.join(dir, 'gates');
    } else target = path.join(dir, file);
    if (fs.lstatSync(target).isSymbolicLink() || fs.realpathSync(target).indexOf(fs.realpathSync(dir) + path.sep) !== 0) { problems.push('the mutation "' + name + '" would write outside its scratch copy: refused'); fs.rmSync(dir, { recursive: true, force: true }); continue; }
    const src = fs.readFileSync(target, 'utf8');
    if (src.indexOf(from) < 0) { problems.push('the mutation "' + name + '" found nothing to change in ' + file); fs.rmSync(dir, { recursive: true, force: true }); continue; }
    fs.writeFileSync(target, src.replace(from, to));
    const argv = [__filename, path.join(dir, 'js')].concat(PARTIAL ? ['--partial'] : []);
    const r = cp.spawnSync(process.execPath, argv, { env, encoding: 'utf8', maxBuffer: 1 << 26 });
    fs.rmSync(dir, { recursive: true, force: true });
    const fails = String(r.stdout || '').split('\n').filter((l) => /^\s+FAIL\s/.test(l));
    const hit = fails.find((l) => l.indexOf(by) >= 0);
    if (r.status === 0) problems.push('the mutation "' + name + '" left this gate green');
    else if (!hit) problems.push('the mutation "' + name + '" was caught, but not by "' + by + '": ' + (fails[0] || String(r.stderr || '').split('\n')[0] || '').trim().slice(0, 200));
    else { held++; console.log('  mutation held: ' + name + ' :: ' + hit.trim().slice(6, 150)); }
  }
  console.log('  ' + held + ' of ' + RUN.length + ' mutations caught, each by its own check' + (RUN.length < MUT.length ? ' (' + RUN.length + ' of the ' + MUT.length + ' run, by CHAMPAGNE_MUTATION)' : ''));
  problems.forEach((p) => console.log('  FAIL  ' + p));
  return problems.length;
}

main().then(() => {
  console.log('');
  if (failed) { console.log('check-champagne: ' + failed + ' of ' + (passed + failed) + ' checks FAILED'); process.exit(1); }
  if (MUTATIONS) {
    console.log('');
    console.log('--- the mutations ---');
    const bad = mutations();
    if (bad) { console.log('check-champagne: all ' + passed + ' checks pass; ' + bad + ' mutation(s) FAILED'); process.exit(1); }
    console.log('check-champagne: all ' + passed + ' checks pass, and every mutation is caught by name');
    process.exit(0);
  }
  console.log('check-champagne: all ' + passed + ' checks pass');
  process.exit(0);
}).catch((e) => { console.error(e && e.stack || e); process.exit(1); });
