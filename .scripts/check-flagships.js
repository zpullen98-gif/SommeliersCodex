/**
 * THE PRODUCERS AND THEIR FLAGSHIPS, HELD TO THEIR DESIGN (codex58, November 2026).
 *
 * The owner asked for a tab under Study in the Wine Atlas holding five of the most famous producers of each wine
 * region, each with its flagship wine in deep and full detail and its story. codex58 is two pieces: js/data-flagships.js
 * (FLAGSHIPS, FLAGSHIP_GROUPS and FLAGSHIP_META, built by .scripts/flagships/build-flagships.cjs from one fragment a
 * group) and the layer js/codex58.js. This gate loads the SHIPPED chain index.html loads in check-card's loader, with
 * the shared house engine and the pack, and asserts:
 *
 *   1. the load: data-flagships.js then codex58.js straight after codex57.js and before boot.js; the layer ran
 *   2. the data: the roster in the plan's order (51 groups of five when whole; with --partial the groups written, each
 *      its picks in the plan's order); when whole the counts pinned exact (WHOLE: 255 records, 510 cards and 510
 *      questions with the deal, 43 regions in 16 countries, 206 houses joined to the library and 49 outside it);
 *      every shipped record through schema.cjs; the data equal to the build of the
 *      fragments byte for byte; every id fl- and eight digits, once, and held by keys.v1.json (frozen or not); fl- the
 *      tab's alone; nobody living of people.json in any string a record ships; the people check's own test
 *   3. the caps, read again from schema.cjs's CAPS on the shipped records
 *   4. the pages: every house drawn clean (cleanProblem, the house voice, no dash, no undefined), At the table first
 *      with the line in it, the sections in their order with their chips, the flagship in full, the sources closed at
 *      the foot, the houses before and after; In the Codex's grapes each a grape page named in the first statement of
 *      the wine's grapes, none denied, a crossing's parent, read short of a longer name or of another vintage or wine
 *   5. the root and the groups: every house once under its group, in the plan's order; the partial line only while the
 *      build is partial; Study with the due count; each group's five as cards opening their houses, its doors, Study the
 *      five, the groups before and after
 *   6. the doors: Producers and flagships last of the Wine Atlas root's study doors; Five producers on every region
 *      page with a group, its chip after Read, and on no other; Its flagship on every library producer page with a
 *      record, opening the house, and Back
 *   7. On Brennan's list, on the fixture house: every row a wine of the house by the record's producer, once, producer
 *      and wine alone, no price; none left off (a producer the library joins, or whose name reads as the record's
 *      house, its initials and the words of the trade taken off); the house's name read whole, never a longer name that
 *      goes on from the record's; a row opens the wine's card and Back returns to the house
 *   8. study: the decks flagcards, flagcards:{group} and flagsdue; the card face; on seeded grades a card graded right
 *      due tomorrow, then in three days, one graded wrong due today, in the layer's own slot with every other slot
 *      untouched; the due deck, the learnt count, the deck screen and its end, the house's two cards with when each is
 *      due, the due count on the root
 *   9. the quiz: a group's questions and ten from every flagship, the due first; graded in the layer's slot through the
 *      engine, never level progress, never in codex3's rotation, never an orphan, found by its key; dealt again by its
 *      section; lit Wine Atlas and climbing to the group or the root
 *  10. the views warm and cold: lit Wine Atlas, named, an address naming nothing falling to the root, Back climbing a
 *      house to its group, the group to the root, the root to the Wine Atlas root; each address cold, the decks' too,
 *      climbing to Home
 *  11. the shell and the chain rule: the two tags in order, codex-v118 or later listing both; every list in a gate here
 *      that names codex57.js names data-flagships.js and codex58.js straight after it (or in the list that follows it)
 *  12. the layer's file: no dash, nobody named, no key, no fl- literal, var and function only, every wrapper typeof
 *      guarded, every selector under .wrap, every colour on its own ground (the parchment's tokens under a card, the
 *      dark page's elsewhere, codex39's claret sources given the dark page's gold), every shown word from V58_WORDS
 *      (and V58_WORDS in the strictest voice); this gate dash free
 *
 *   node .scripts/check-flagships.js [jsDir] [--partial]               every check above
 *   node .scripts/check-flagships.js [jsDir] [--partial] --mutations   then seeds 36 faults in a scratch copy (29 with
 *                                                                       --partial, where no count, no grape and no
 *                                                                       house is pinned), one at
 *                                                                       a time, and expects each caught by the check
 *                                                                       that names it (FLAGSHIPS_MUTATION=word|word
 *                                                                       runs only the ones whose names hold a word)
 *
 * --partial while the data is a partial build: the roster then counts only the groups FLAGSHIP_GROUPS holds, and the
 * data is held to the partial build of those groups' fragments. Without it the roster must be whole.
 *
 * A section that throws fails as "section N ran to its end" and the next one runs, so a seeded fault is always named.
 * jsDir defaults to this repo's js/; the site's check-wings may pass the wing's codex/js. Needs the shared engine
 * (OOT_SHARED, else ../worldtable/static/shared) and the pack (OOT_HOUSE_PACK, else the pack beside the engine). The
 * plan, the fragments, the schema and the gates the chain rule reads are this checkout's (.scripts/flagships/;
 * FLAGSHIPS_KEYS names another keys file, FLAGSHIPS_GATES another folder of gates). A tree with no codex58.js is
 * SKIPPED. Exits non-zero if any check fails. The last line is the verdict.
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
if (!fs.existsSync(path.join(JS, 'codex58.js'))) {
  console.log('check-flagships: no codex58.js in ' + JS + ', SKIPPED');
  process.exit(0);
}
const SHARED = process.env.OOT_SHARED || path.join(__dirname, '..', '..', 'worldtable', 'static', 'shared');
const ENGINE = path.join(SHARED, 'oot-house.js');
const UI_FILE = path.join(SHARED, 'oot-house-ui.js');
const PACK_FILE = process.env.OOT_HOUSE_PACK || path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
for (const f of [ENGINE, UI_FILE, PACK_FILE]) {
  if (!fs.existsSync(f)) { console.error('check-flagships: no ' + path.basename(f) + ' at ' + path.dirname(f) + ' (set OOT_SHARED or OOT_HOUSE_PACK)'); process.exit(1); }
}
const CH = require(path.join(__dirname, 'cms', 'chain.cjs'));
const S = require(path.join(__dirname, 'flagships', 'schema.cjs'));
const BF = require(path.join(__dirname, 'flagships', 'build-flagships.cjs'));
const GATES = path.resolve(process.env.FLAGSHIPS_GATES || __dirname);
const KEYS_FILE = path.resolve(process.env.FLAGSHIPS_KEYS || path.join(S.DIR, 'keys.v1.json'));
const PLAN = S.loadPlan();
const ROSTER = S.roster(PLAN);
const PICK = {}; ROSTER.forEach((x) => { PICK[x.pick.key] = x; });
const NOW = Date.parse('2026-11-12T14:02:00.000Z');
const SECTIONS = ['v58-s-wine', 'v58-s-story', 'v58-s-others', 'v58-s-traps', 'v58-s-list', 'v58-s-study', 'v58-s-codex'];
/* the whole build of wave one, pinned exact (without --partial): the groups and records, the cards and questions, the
   answers as the build deals them, the regions and their countries, the houses the library joins (its producers and
   its wines) and those outside it. A pin moves only with the plan, in the same commit. */
const WHOLE = { groups: 51, records: 255, cards: 510, questions: 510, deal: [128, 128, 127, 127], regions: 43, countries: 16, joined: 206, producers: 201, wines: 5, outside: 49 };

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

/* check-producers-house.js's voiceProblems, the strictest, as check-grapes-table carries it */
const NUMERAL_RE = /\bLevel\s+(I|II|III|IV|[1-4])\b/;
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
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/* what a page shows: its text and the words its controls carry */
function shown(html) {
  const said = [...String(html || '').matchAll(/\b(?:aria-label|placeholder|title|alt)="([^"]*)"/g)].map((m) => m[1]);
  return unesc(String(html || '').replace(/<[^>]+>/g, ' ') + ' ' + said.join(' ')).replace(/\s+/g, ' ');
}
const fold = (s) => S.fold(s);
/* a drawn page in the house voice: clean markup, no dash, never the retired word, no numbered level, no undefined */
function pageProblem(html) {
  const c = CH.cleanProblem(html) || CH.drawnVoiceProblem(html);
  if (c) return c;
  const t = shown(html);
  if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(t)) return 'shows undefined, NaN or an object';
  const v = voiceProblems(t.replace(/[^\x00-↏]/g, ''));
  return v.length ? v.join(', ') : '';
}
const attrs = (h, re) => [...String(h || '').matchAll(re)].map((m) => unesc(m[1]));

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
  /* check-brennans's step through the entries: the address follows, popstate fires */
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
/* opts.hash: the address the device opens on */
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
    return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(packText), json: () => Promise.resolve(JSON.parse(packText)) });
  };
  for (const f of FILES) {
    try { vm.runInContext(fs.readFileSync(path.join(JS, f), 'utf8'), D.ctx, { filename: f }); }
    catch (e) { console.error('check-flagships: js/' + f + ' failed to load: ' + e.message); process.exit(1); }
  }
  try { await D.G('typeof V27_LAST !== "undefined" ? V27_LAST : null'); } catch (e) { }
  try { await D.G('typeof V27_BOOT_PACK !== "undefined" ? V27_BOOT_PACK : null'); } catch (e) { }
  await tick(30);
  try { await D.G('typeof V27_WRITING !== "undefined" ? V27_WRITING : null'); } catch (e) { }
  await tick(30);
  D.J = (expr) => JSON.parse(D.G('JSON.stringify(' + expr + ')'));
  D.T = (expr) => { try { return D.G(expr); } catch (e) { return null; } };
  /* a page as codex39 or codex32 builds it: the html handed to the builder */
  D.page = (prep) => String(D.G('(function () { var got = ""; var was = v39Build, was32 = v32Build; v39Build = function (h, a) { got = String(h || ""); return was(h, a); }; v32Build = function (h, a) { if (!got) got = String(h || ""); return was32(h, a); }; try { ' + prep + ' } finally { v39Build = was; v32Build = was32; } return got; })()') || '');
  /* a region's reading, fetched as the app fetches it */
  D.load = async (parts) => {
    D.G('(function () { ' + JSON.stringify(parts) + '.forEach(function (p) { v39LoadPart(p); }); })()');
    for (let i = 0; i < 150 && !D.G(JSON.stringify(parts) + '.every(function (p) { return v39PartReady(p); })'); i++) await tick(20);
  };
  return D;
}

/* every string of a record with its path, as schema.cjs walks a fragment */
function walk(v, where, fn) {
  if (typeof v === 'string') fn(v, where);
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, where + '[' + i + ']', fn));
  else if (v && typeof v === 'object') Object.keys(v).forEach((k) => walk(v[k], where ? where + '.' + k : k, fn));
}
/* a shipped record as a fragment's record: the minted ids taken off; a source's read, never shipped, read again from
   its address (a page when it has one, a book when it has none) */
function asFragment(rec) {
  const r = JSON.parse(JSON.stringify(rec));
  delete r.id;
  r.cards = (r.cards || []).map((c) => ({ front: c.front, back: c.back }));
  r.questions = (r.questions || []).map((q) => ({ q: q.q, opts: q.opts, a: q.a, exp: q.exp, tag: q.tag }));
  r.sources = (r.sources || []).map((s) => ({ title: s.title, url: s.url, kind: s.kind, read: s.url ? 'page' : 'book' }));
  return r;
}
/* the caps of schema.cjs's CAPS, read here on the shipped record */
function capProblems(r) {
  const C = S.CAPS, out = [];
  const w = (s) => (typeof s === 'string' ? (s.trim() ? S.words(s) : 0) : -1);
  const within = (where, s, p) => { const n = w(s); const lo = Array.isArray(p) ? p[0] : 0, hi = Array.isArray(p) ? p[1] : p; if (n < lo || n > hi) out.push(where + ' ' + n + ' words (' + lo + ' to ' + hi + ')'); };
  const count = (where, l, p) => { const n = Array.isArray(l) ? l.length : -1; if (n < p[0] || n > p[1]) out.push(where + ' ' + n + ' (' + p[0] + ' to ' + p[1] + ')'); };
  const W = r.wine || {};
  within('say', r.say, C.say);
  within('place', r.place, C.place);
  if (!(r.founded === '' || /^\d{3,4}$/.test(String(r.founded)))) out.push('founded ' + r.founded);
  Object.keys(C.wine).forEach((k) => within('wine.' + k, W[k], C.wine[k]));
  if (S.COLOURS.indexOf(W.colour) < 0) out.push('wine.colour ' + W.colour);
  count('wine.label', W.label, C.label.n);
  (W.label || []).forEach((x, i) => { within('wine.label[' + i + '].term', x.term, C.label.term); within('wine.label[' + i + '].means', x.means, C.label.means); });
  within('table', r.table, C.table);
  const ts = S.sentenceList(r.table || '').length;
  if (ts < C.tableSentences[0] || ts > C.tableSentences[1]) out.push('table ' + ts + ' sentences');
  within('story', r.story, C.story);
  if (new Set(String(r.story || '').match(/\b1\d{3}\b|\b20[0-2]\d\b/g) || []).size < C.storyYears) out.push('story with fewer than ' + C.storyYears + ' dated years');
  count('others', r.others, C.others.n);
  (r.others || []).forEach((x, i) => { within('others[' + i + '].name', x.name, C.others.name); within('others[' + i + '].note', x.note, C.others.note); });
  count('traps', r.traps, C.traps.n);
  (r.traps || []).forEach((x, i) => within('traps[' + i + ']', x, C.traps.line));
  count('cards', r.cards, [C.cards.n, C.cards.n]);
  (r.cards || []).forEach((x, i) => { within('cards[' + i + '].front', x.front, C.cards.front); within('cards[' + i + '].back', x.back, C.cards.back); });
  count('questions', r.questions, [C.questions.n, C.questions.n]);
  (r.questions || []).forEach((x, i) => { within('questions[' + i + '].q', x.q, C.questions.stem); within('questions[' + i + '].exp', x.exp, C.questions.exp); if (!Array.isArray(x.opts) || x.opts.length !== 4) out.push('questions[' + i + '] options ' + (x.opts || []).length); (x.opts || []).forEach((o, j) => within('questions[' + i + '].opts[' + j + ']', o, C.questions.option)); if (!Number.isInteger(x.a) || x.a < 0 || x.a > 3) out.push('questions[' + i + '].a'); });
  count('sources', r.sources, C.sources.n);
  (r.sources || []).forEach((x, i) => within('sources[' + i + '].title', x.title, C.sources.title));
  if ((r.sources || []).filter((x) => /^https:\/\//.test(x.url || '')).length < C.sources.web) out.push('sources: no https address');
  const n = S.readingWords(r);
  if (n > C.entry) out.push('entry ' + n + ' reading words');
  return out;
}

/* this gate's own reading of one house: every word of one name (the estate words and particles left out, as schema.cjs
   reads a name) stands in the other, so Biondi Santi (Tenuta Greppo) is Biondi-Santi and R. Lopez de Heredia is Lopez de
   Heredia, while Mouton Rothschild is never Lafite Rothschild */
function sameHouse(a, b) {
  const t = (s) => ' ' + fold(s) + ' ';
  const has = (text, name) => { const ws = S.nameWords(name); return ws.length > 0 && ws.every((w) => t(text).indexOf(' ' + w + ' ') >= 0); };
  return has(a, b) || has(b, String(a).replace(/\([^)]*\)/g, ' '));
}
/* the build of the fragments the data was made from: the whole roster, or with --partial the groups the data holds */
function buildNow(groups) {
  let dir = path.join(S.DIR, 'fragments'), tmp = '';
  if (PARTIAL) {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'flagships-frag-'));
    groups.forEach((k) => { const f = path.join(dir, k + '.json'); if (fs.existsSync(f)) fs.copyFileSync(f, path.join(tmp, k + '.json')); });
    dir = tmp;
  }
  let b;
  try { b = BF.build({ jsDir: JS, out: path.join(JS, 'data-flagships.js'), fragments: dir, keys: KEYS_FILE, partial: PARTIAL }, BF.readKeys(KEYS_FILE)); }
  catch (e) { b = { problems: [e.message], text: '' }; }
  if (tmp) {
    const shownDir = path.relative(S.ROOT, tmp);
    const as = (!shownDir.startsWith('..') && !path.isAbsolute(shownDir) ? shownDir : tmp).split(path.sep).join('/');
    b.text = String(b.text || '').split(as).join('.scripts/flagships/fragments');
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  return b;
}

async function main() {
  const TEXT = fs.readFileSync(path.join(JS, 'data-flagships.js'), 'utf8');
  const D = await bootDevice();
  console.log('check-flagships: ' + FILES.length + ' scripts from ' + path.join(ROOT, 'index.html') + ', codex58 at ' + (FILES.indexOf('codex58.js') + 1) + (PARTIAL ? ', the data held as a partial build' : ''));
  let DATA = {}, GROUPS = [], META = {}, IDS = [], REC = [], WORDS = {};
  const SRC = fs.readFileSync(path.join(JS, 'codex58.js'), 'utf8');

  /* ================================================================ */
  section('1. the load');
  try {
    const i57 = FILES.indexOf('codex57.js');
    const want = ['codex57.js', 'data-flagships.js', 'codex58.js', 'boot.js'];
    check('the chain index.html loads holds data-flagships.js then codex58.js straight after codex57.js, then boot.js', i57 > 0 && JSON.stringify(FILES.slice(i57, i57 + want.length)) === JSON.stringify(want), FILES.slice(i57, i57 + want.length).join(' '));
    check('codex58 ran: V58_WORDS, v58W, the three views registered and owned by the Wine Atlas, its acts and its sections', D.G('typeof V58_WORDS === "object" && typeof v58W === "function" && ["flagships", "flaggroup", "flagship"].every(function (k) { return !!V58_VIEWS[k] && typeof V25_VIEWS[k] === "function" && V32_OWNER[k] === "worldmap"; }) && ["producer", "open", "wine", "cards", "quiz"].every(function (k) { return typeof V58_ACTS[k] === "function"; }) && !!V58_SECS.list && !!V58_SECS.study') === true);
    check('the style element is written by the layer, id v58-style', SRC.indexOf("css.id = 'v58-style'") > 0);
    WORDS = D.J('V58_WORDS');
  } catch (e) { check('section 1 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('2. the data');
  try {
    DATA = D.J('FLAGSHIPS'); GROUPS = D.J('FLAGSHIP_GROUPS'); META = D.J('FLAGSHIP_META');
    IDS = Object.keys(DATA);
    REC = IDS.map((id) => DATA[id]);
    const planKeys = PLAN.groups.map((g) => g.key);
    const rosterBad = [];
    let lastAt = -1;
    GROUPS.forEach((g) => {
      const pg = PLAN.groups[planKeys.indexOf(g.key)];
      if (!pg) { rosterBad.push(g.key + ' is no group of the plan'); return; }
      const at = planKeys.indexOf(g.key);
      if (at <= lastAt) rosterBad.push(g.key + ' out of the plan\'s order');
      lastAt = at;
      if (g.title !== pg.title || g.region !== pg.region || g.country !== pg.country) rosterBad.push(g.key + ': its title, region or country is not the plan\'s');
      const keys = (g.ids || []).map((id) => (DATA[id] || {}).key);
      const want = pg.picks.map((p) => p.key).filter((k) => keys.indexOf(k) >= 0);
      if (JSON.stringify(keys) !== JSON.stringify(want) || keys.some((k) => !k)) rosterBad.push(g.key + ': ' + keys.join(',') + ' not its picks in the plan\'s order');
      if (!PARTIAL && keys.length !== S.PICKS) rosterBad.push(g.key + ': ' + keys.length + ' of five');
      (g.ids || []).forEach((id) => { const r = DATA[id]; if (r && r.group !== g.key) rosterBad.push(id + ' in ' + g.key + ', its group ' + r.group); });
    });
    const flat = [].concat.apply([], GROUPS.map((g) => g.ids || []));
    if (JSON.stringify(flat) !== JSON.stringify(IDS)) rosterBad.push('FLAGSHIPS is not FLAGSHIP_GROUPS\' ids in order');
    REC.forEach((r) => {
      const p = PICK[r.key];
      if (!p) { rosterBad.push(r.id + ': ' + r.key + ' is no pick'); return; }
      if (r.group !== p.group.key || r.region !== p.group.region || r.producer !== p.pick.producer || r.producerId !== p.pick.producerId) rosterBad.push(r.key + ': group, region, producer or producerId not the plan\'s');
    });
    const whole = GROUPS.length === S.GROUPS && IDS.length === S.GROUPS * S.PICKS;
    const metaOk = META.roster === ROSTER.length && META.built === IDS.length && META.groups === GROUPS.length && META.prefix === S.ID_PREFIX && META.wave === PLAN.wave && META.edition === PLAN.edition
      && META.cards === IDS.length * S.CAPS.cards.n && META.questions === IDS.length * S.CAPS.questions.n && META.partial === (IDS.length < ROSTER.length);
    if (PARTIAL) {
      check('the roster in the plan\'s order, the groups written (' + GROUPS.length + ' of ' + PLAN.groups.length + ', ' + IDS.length + ' of ' + ROSTER.length + ' houses): every group a group of the plan in its order, its records its picks in their order, each record\'s group, region, producer and producerId the plan\'s; FLAGSHIP_META says so', GROUPS.length > 0 && rosterBad.length === 0 && metaOk, few(rosterBad, 5) + ' ' + JSON.stringify(META));
      if (whole) note('the data is whole: run this gate without --partial');
    } else {
      check('the roster whole and in the plan\'s order: ' + S.GROUPS + ' groups of five, the ' + ROSTER.length + ' records of plan.json, FLAGSHIP_META ' + META.built + ' of ' + META.roster + ', not partial', whole && rosterBad.length === 0 && metaOk && META.partial === false && JSON.stringify(REC.map((r) => r.key)) === JSON.stringify(ROSTER.map((x) => x.pick.key)), GROUPS.length + ' groups, ' + IDS.length + ' records; ' + few(rosterBad, 4) + ' ' + JSON.stringify(META));
      const deal = [0, 0, 0, 0];
      let cards = 0, qs = 0;
      REC.forEach((r) => { cards += (r.cards || []).length; (r.questions || []).forEach((q) => { qs++; if (deal[q.a] !== undefined) deal[q.a]++; }); });
      const got = {
        groups: GROUPS.length, records: IDS.length, cards, questions: qs, deal,
        regions: new Set(REC.map((r) => r.region)).size, countries: new Set(GROUPS.map((g) => g.country)).size,
        joined: REC.filter((r) => r.producerId).length, producers: REC.filter((r) => /^p-/.test(r.producerId)).length,
        wines: REC.filter((r) => /^w-/.test(r.producerId)).length, outside: REC.filter((r) => !r.producerId).length
      };
      const pinsOk = JSON.stringify(got) === JSON.stringify(WHOLE) && ROSTER.length === WHOLE.records && PLAN.groups.length === WHOLE.groups && META.cards === WHOLE.cards && META.questions === WHOLE.questions;
      check('the counts pinned exact: ' + WHOLE.groups + ' groups, ' + WHOLE.records + ' records, ' + WHOLE.cards + ' cards and ' + WHOLE.questions + ' questions (the answers dealt A ' + WHOLE.deal[0] + ', B ' + WHOLE.deal[1] + ', C ' + WHOLE.deal[2] + ', D ' + WHOLE.deal[3] + '), ' + WHOLE.regions + ' regions in ' + WHOLE.countries + ' countries, ' + WHOLE.joined + ' houses joined to the library (' + WHOLE.producers + ' producers, ' + WHOLE.wines + ' wines) and ' + WHOLE.outside + ' outside it', pinsOk, JSON.stringify(got) + ' against ' + JSON.stringify(WHOLE));
    }
    const facts = S.facts(JS);
    const schemaBad = [];
    REC.forEach((r) => {
      const p = PICK[r.key];
      if (!p) return;
      const i = p.group.picks.findIndex((x) => x.key === r.key);
      S.validateRecord(asFragment(r), PLAN, p.group.key, i, { facts }).forEach((x) => schemaBad.push(r.key + ': ' + x));
    });
    check('every shipped record through schema.cjs (' + REC.length + ' records, the minted ids taken off)', REC.length > 0 && schemaBad.length === 0, few(schemaBad, 4));
    const built = buildNow(GROUPS.map((g) => g.key));
    check('the data is the build: js/data-flagships.js equals the ' + (PARTIAL ? 'partial build of the ' + GROUPS.length + ' groups it holds' : 'whole build of the 51 fragments') + ', byte for byte', built.problems.length === 0 && built.text === TEXT, built.problems.length ? few(built.problems, 3) : 'the file differs from the build (' + TEXT.length + ' against ' + String(built.text).length + ' bytes)');
    const KEYS = BF.readKeys(KEYS_FILE);
    const idsBad = [];
    const seen = {};
    let n = 0;
    REC.forEach((r) => {
      const got = { id: r.id, cards: (r.cards || []).map((c) => c.id), questions: (r.questions || []).map((q) => q.id) };
      [got.id].concat(got.cards, got.questions).forEach((id) => { n++; if (!S.ID_RE.test(id)) idsBad.push(r.key + ' ' + id + ' not fl- and eight digits'); if (seen[id]) idsBad.push(id + ' twice'); seen[id] = 1; });
      if (got.id !== BF.recordId(r.key) && !(KEYS.keys[r.key] && KEYS.keys[r.key].id === got.id)) idsBad.push(r.key + ' ' + got.id + ' neither minted from its key nor kept');
      const k = KEYS.keys[r.key];
      if (!k) { idsBad.push(r.key + ' not in keys.v1.json'); return; }
      if (KEYS.frozen ? !(k.id === got.id && k.cards.every((id) => got.cards.indexOf(id) >= 0) && k.questions.every((id) => got.questions.indexOf(id) >= 0)) : JSON.stringify(k) !== JSON.stringify(got)) idsBad.push(r.key + ': ' + JSON.stringify(got) + ' against ' + JSON.stringify(k));
    });
    if (!KEYS.frozen && Object.keys(KEYS.keys).sort().join() !== REC.map((r) => r.key).sort().join()) idsBad.push('keys.v1.json holds ' + Object.keys(KEYS.keys).length + ' records, the data ' + REC.length);
    check('ids frozen against keys.v1.json (' + (KEYS.frozen ? 'frozen: every kept id still minted' : 'not yet frozen: the file holds exactly the ids the data ships') + '), each fl- and eight digits, once among ' + n, idsBad.length === 0 && n === REC.length * 5, few(idsBad, 4));
    const pre = BF.prefixProblems(JS, path.join(JS, 'data-flagships.js'));
    check('fl- is the tab\'s alone: no other file under js/ mints or names it (codex21\'s keyOwned guard the one allowed)', pre.length === 0, few(pre, 3));
    const living = [];
    REC.forEach((r) => walk(r, r.key, (s, where) => { if (S.idPath(where)) return; const hit = S.livingIn(/\.url$/.test(where) ? s.replace(/[-_/.]+/g, ' ') : s, r.producer); if (hit.length) living.push(where + ': ' + hit.join(', ')); }));
    Object.keys(WORDS).forEach((k) => { const hit = S.livingIn(WORDS[k], ''); if (hit.length) living.push('V58_WORDS.' + k + ': ' + hit.join(', ')); });
    check('nobody living of people.json (' + S.people().names.length + ' names) in any string a record ships or the layer shows, a house\'s own name kept, an id never read as prose', living.length === 0 && S.people().names.length > 100, few(living, 5));
    const pt = S.peopleTest();
    check('the people check\'s own test: a producerId copied from the plan (p-nicolas-joly) and a minted id pass, a living name in the table, the story, a card, an option or an address is refused', pt.length === 0, pt.join(' | '));
  } catch (e) { check('section 2 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('3. the caps');
  try {
    const capBad = [];
    REC.forEach((r) => capProblems(r).forEach((p) => capBad.push(r.key + ' ' + p)));
    check('every cap of schema.cjs, read again on the shipped records (say, place, the wine and its label, the table in one or two sentences, the story with two dated years, others, traps, two cards, two questions of four options, sources with an https address, the reading words)', REC.length > 0 && capBad.length === 0, few(capBad, 5));
    const tagBad = REC.filter((r) => (r.questions || []).map((q) => q.tag).sort().join() !== 'story,wine').map((r) => r.key);
    check('every record\'s two questions: one tagged wine and one tagged story', tagBad.length === 0, tagBad.join(' '));
  } catch (e) { check('section 3 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('4. the pages');
  const LISTED = {};
  try {
    const bad = [], order = [], secBad = [], wineBad = [], footBad = [];
    const PAGE = {};
    REC.forEach((r, i) => {
      const h = String(D.G('v58PageHtml(' + JSON.stringify(r.id) + ')') || '');
      PAGE[r.id] = h;
      const prob = pageProblem(h);
      if (prob) bad.push(r.key + ': ' + prob);
      const headAt = h.indexOf('<h2 tabindex="-1" class="v32-h">' + esc(r.producer) + '</h2>');
      const tableAt = h.indexOf('<section class="v58-table" aria-labelledby="v58-table-h">');
      const lineAt = h.indexOf('<p class="v58-tline">' + esc(r.table) + '</p>');
      const navAt = h.indexOf('<nav class="v32chips v58-jumps" aria-label="Sections">');
      const firstSec = h.indexOf('<section class="v58-sec');
      if (!(headAt > 0 && tableAt > headAt && lineAt > tableAt && navAt > lineAt && firstSec > navAt && h.indexOf('</section>', tableAt) < navAt)) order.push(r.key);
      const secs = attrs(h, /<section class="v58-sec[^"]*" aria-labelledby="(v58-s-[a-z]+)"/g);
      const chips = attrs(h.slice(navAt, h.indexOf('</nav>', navAt)), /data-to="(v58-s-[a-z]+)"/g);
      const listed = h.indexOf('aria-labelledby="v58-s-list"') > 0;
      if (listed) LISTED[r.id] = 1;
      const want = SECTIONS.filter((s) => s !== 'v58-s-list' || listed);
      if (JSON.stringify(secs) !== JSON.stringify(want) || JSON.stringify(chips) !== JSON.stringify(want)) secBad.push(r.key + ': ' + secs.join(',') + ' / chips ' + chips.join(','));
      const W = r.wine || {};
      const wine = h.slice(h.indexOf('aria-labelledby="v58-s-wine"'), h.indexOf('</section>', h.indexOf('aria-labelledby="v58-s-wine"')));
      const rows = attrs(wine, /<dt>([^<]*)<\/dt>/g);
      const wantRows = ['The grapes', 'The vineyards', 'How it is made', 'In the glass', 'Ageing', 'Serving'].concat((W.label || []).map((x) => x.term));
      if (wine.indexOf('<p class="v58-wname">' + esc(W.name) + '</p>') < 0 || wine.indexOf(esc(W.appellation)) < 0 || JSON.stringify(rows) !== JSON.stringify(wantRows)
        || ['grapes', 'sites', 'making', 'glass', 'ageing', 'serve'].some((k) => wine.indexOf('<dd>' + esc(W[k]) + '</dd>') < 0) || (W.label || []).some((x) => wine.indexOf('<dd>' + esc(x.means) + '</dd>') < 0)) wineBad.push(r.key);
      if (h.indexOf('<p class="v58-story">' + esc(r.story) + '</p>') < 0 || (r.traps || []).some((t) => h.indexOf('<li>' + esc(t) + '</li>') < 0) || (r.others || []).some((o) => h.indexOf('<span class="v58-oname">' + esc(o.name) + '</span>') < 0)) wineBad.push(r.key + ' (story, traps or others)');
      const srcAt = h.indexOf('<details class="v28-q v39-sec v58-sourcesbox" id="v58-s-sources">');
      const links = attrs(h.slice(srcAt), /<a href="([^"]+)" target="_blank" rel="noopener">/g);
      const lastSec = h.lastIndexOf('<section class="v58-sec');
      const stepsAt = h.indexOf('<nav class="v58-steps"');
      const prev = i > 0 ? REC[i - 1].id : '', next = i < REC.length - 1 ? REC[i + 1].id : '';
      const steps = attrs(h.slice(stepsAt), /data-go="flagship" data-arg="([^"]+)"/g);
      if (!(srcAt > lastSec && (stepsAt < 0 || stepsAt > srcAt)) || JSON.stringify(links) !== JSON.stringify((r.sources || []).filter((s) => /^https:\/\//.test(s.url)).map((s) => s.url)) || JSON.stringify(steps) !== JSON.stringify([prev, next].filter(Boolean))) footBad.push(r.key);
    });
    check('every house drawn clean (' + REC.length + ' pages: cleanProblem, the house voice, no dash, never the retired word, no numbered level, no undefined)', REC.length > 0 && bad.length === 0, few(bad, 4));
    check('At the table first on every page: the house heading, then At the table holding the line for the table, then the chips and the sections', order.length === 0, few(order, 6));
    check('the sections in their order with their chips: the flagship, the story, other wines, traps, On our list where the house pours the house\'s wines, Study, In the Codex', secBad.length === 0, few(secBad, 4));
    check('the flagship in full on every page: its name, its appellation, the grapes, the vineyards, how it is made, in the glass, ageing, serving and every term of its label; the story, every trap and every other wine', wineBad.length === 0, few(wineBad, 6));
    check('the sources closed at the foot, every https source a link, then the houses before and after in the roster\'s order', footBad.length === 0, few(footBad, 6));
    const none = D.J('(function () { return { a: V58_VIEWS.flagship.accept("fl-00000000"), b: V58_VIEWS.flaggroup.accept("no-such-group"), c: v58PageHtml("fl-00000000").indexOf("v58-root") > 0 }; })()');
    check('an address naming nothing the device holds falls to the root', none.a === '' && none.b === '' && none.c === true, JSON.stringify(none));
    /* In the Codex's grapes, by the gate's own reading: every door a page draws is a grape page the Codex holds, named
       in the first statement of the wine's grapes (up to a semicolon or a full stop: what follows tells of other
       vintages or another wine); and the wines whose grapes name a grape the bottle does not hold are pinned by name, a
       grape denied (Climens), a crossing's parents (Lanzerac, Muller-Catoir), a name read short of a longer one
       (Donnafugata's Muscat of Alexandria), a first vintage or another wine (Simonsig, Chave), beside two read whole */
    const grams = D.J('(function (texts) { return texts.map(function (t) { var w = v58Fold(t).split(" ").filter(Boolean), out = []; for (var i = 0; i < w.length; i++) for (var n = 1; n <= 3 && i + n <= w.length; n++) { var k = ""; try { k = String(v53GrapeKey(w.slice(i, i + n).join(" ")) || ""); } catch (e) { k = ""; } if (k && out.indexOf(k) < 0) out.push(k); } return out; }); })(' + JSON.stringify(REC.map((r) => String((r.wine || {}).grapes || '').split(/;|\.(?:\s|$)/)[0])) + ')');
    const GRAPE_PIN = { climens: { not: ['sauvignon-blanc'], has: ['semillon'] }, lanzerac: { not: ['pinot-noir'], has: ['pinotage'] }, 'muller-catoir': { not: ['silvaner', 'riesling'], has: [] }, donnafugata: { not: ['muscat-blanc'], has: [] }, simonsig: { not: ['chenin-blanc'], has: ['chardonnay', 'pinot-noir'] }, chave: { not: ['marsanne', 'roussanne'], has: ['syrah'] }, krug: { not: [], has: ['pinot-noir', 'chardonnay', 'meunier'] }, latour: { not: [], has: ['cabernet-sauvignon', 'merlot', 'cabernet-franc', 'petit-verdot'] } };
    const grapeBad = [];
    let grapeDoors = 0, pinned = 0;
    REC.forEach((r, i) => {
      const h = PAGE[r.id];
      const at = h.indexOf('aria-labelledby="v58-s-codex"');
      const doors = at >= 0 ? attrs(h.slice(at, h.indexOf('</section>', at)), /data-go="grape" data-arg="([^"]+)"/g) : [];
      grapeDoors += doors.length;
      doors.forEach((s) => { if (grams[i].indexOf(s) < 0) grapeBad.push(r.key + ': ' + s + ' is not named in the first statement of its grapes'); else if (!D.G('!!v53GrapeFind(' + JSON.stringify(s) + ')')) grapeBad.push(r.key + ': ' + s + ' opens no grape page'); });
      const pin = GRAPE_PIN[r.key];
      if (!pin) return;
      pinned++;
      pin.not.forEach((s) => { if (doors.indexOf(s) >= 0) grapeBad.push(r.key + ': a door to ' + s + ', a grape its bottle does not hold'); });
      pin.has.forEach((s) => { if (doors.indexOf(s) < 0) grapeBad.push(r.key + ': no door to ' + s); });
    });
    check('In the Codex\'s grapes (' + grapeDoors + ' doors): each a grape page the Codex holds, named in the first statement of the wine\'s grapes; none to a grape denied, a crossing\'s parent, a name read short of a longer one, or another vintage or wine (' + pinned + ' pinned by name)', grapeDoors > REC.length && grapeBad.length === 0 && (PARTIAL || pinned === Object.keys(GRAPE_PIN).length), few(grapeBad, 5));
  } catch (e) { check('section 4 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('5. the root and the groups');
  try {
    const root = String(D.G('v58RootHtml()') || '');
    const rows = attrs(root, /data-go="flagship" data-arg="([^"]+)" id="v58-h-/g);
    const groupOrder = [];
    [...root.matchAll(/<div class="v58-group" data-v58-group="([^"]+)">([\s\S]*?)<\/ul><\/div>/g)].forEach((m) => { groupOrder.push(m[1]); const g = GROUPS.find((x) => x.key === m[1]); if (!g || JSON.stringify(attrs(m[2], /data-go="flagship" data-arg="([^"]+)"/g)) !== JSON.stringify(g.ids) || m[2].indexOf('data-go="flaggroup" data-arg="' + m[1] + '"') < 0) groupOrder.push('BAD ' + m[1]); });
    check('the root lists every house once (' + rows.length + ' of ' + IDS.length + '), each group\'s five in the plan\'s order under the group with the row of the five at a glance; clean', rows.length === IDS.length && new Set(rows).size === IDS.length && IDS.every((id) => rows.indexOf(id) >= 0) && groupOrder.length === GROUPS.length && !groupOrder.some((x) => /^BAD/.test(x)) && !pageProblem(root), few(groupOrder.filter((x) => /^BAD/.test(x)), 4) + ' ' + pageProblem(root));
    const countries = D.J('v58Countries().map(function (c) { return c.key; })');
    const order = D.J('v56Countries().map(function (c) { return c.key; })');
    const inOrder = countries.filter((k) => order.indexOf(k) >= 0);
    check('the countries in the atlas\'s own order (' + countries.join(', ') + '), each a section with its chip when there are more than one', JSON.stringify(inOrder) === JSON.stringify(order.filter((k) => inOrder.indexOf(k) >= 0)) && countries.every((k) => root.indexOf('id="v58-c-' + k + '"') > 0) && (countries.length < 2 || countries.every((k) => root.indexOf('data-to="v58-c-' + k + '"') > 0)), countries.join(' '));
    const partialLine = root.indexOf('class="v32-line v58-partial"') > 0;
    check('the partial line shows only while the build is partial (' + (META.partial ? 'partial: ' + IDS.length + ' of ' + META.roster : 'whole') + ')', partialLine === !!(META.partial && META.roster > IDS.length));
    const studyAt = root.indexOf('<section class="v32-sec v58-study" aria-labelledby="v58-study-h">');
    const firstCountry = root.indexOf('<section class="v32-sec v58-country"');
    const study = root.slice(studyAt, root.indexOf('</section>', studyAt));
    check('Study on the root, ahead of the countries: the flagship cards with their count and the quiz on every flagship', studyAt > 0 && studyAt < firstCountry && study.indexOf('data-v58="cards" id="v58-door-cards"') > 0 && study.indexOf('data-v58="quiz" data-group="" id="v58-door-quiz"') > 0 && unesc(study).indexOf((IDS.length * 2) + ' cards, two a house') > 0, study.slice(0, 400));
    const gBad = [];
    GROUPS.forEach((g, i) => {
      const h = String(D.G('v58GroupHtml(' + JSON.stringify(g.key) + ')') || '');
      const p = pageProblem(h);
      if (p) gBad.push(g.key + ': ' + p);
      const cards = attrs(h, /<li class="card v58-card" data-v58-card="([^"]+)">/g);
      const opens = attrs(h, /class="v58-card-open" data-go="flagship" data-arg="([^"]+)"/g);
      if (JSON.stringify(cards) !== JSON.stringify(g.ids) || JSON.stringify(opens) !== JSON.stringify(g.ids)) gBad.push(g.key + ': cards ' + cards.join(','));
      g.ids.forEach((id) => { const r = DATA[id]; if (h.indexOf(esc(r.table)) < 0 || h.indexOf('>' + esc(r.producer) + '</button>') < 0) gBad.push(g.key + ': ' + r.key + ' without its name or its line'); });
      const region = D.G('!!v58Region(' + JSON.stringify(g.region) + ')');
      if (region && h.indexOf('data-v39="region" data-slug="' + g.region + '"') < 0) gBad.push(g.key + ': no region door');
      if (h.indexOf('data-go="flagships" id="v58-root-door"') < 0) gBad.push(g.key + ': no door to the root');
      if (h.indexOf('data-v58="cards" data-deck="flagcards:' + g.key + '" id="v58-gdoor-cards"') < 0 || h.indexOf('data-v58="quiz" data-group="' + g.key + '" id="v58-gdoor-quiz"') < 0) gBad.push(g.key + ': no Study the five');
      const steps = attrs(h.slice(h.indexOf('<nav class="v58-steps"')), /data-go="flaggroup" data-arg="([^"]+)"/g);
      const want = [i > 0 ? GROUPS[i - 1].key : '', i < GROUPS.length - 1 ? GROUPS[i + 1].key : ''].filter(Boolean);
      if (h.indexOf('<nav class="v58-steps"') < 0 ? want.length : JSON.stringify(steps) !== JSON.stringify(want)) gBad.push(g.key + ': steps ' + steps.join(','));
    });
    check('every group (' + GROUPS.length + ') drawn clean: its houses as cards in the plan\'s order, each one door to its house with its name and its line; the region, the root, Study the five (its cards and its quiz) and the groups before and after', gBad.length === 0, few(gBad, 4));
  } catch (e) { check('section 5 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('6. the doors');
  try {
    const A = await bootDevice();
    const hub = A.page('S.view = "worldmap"; S.wmap = null; worldMapView();');
    const doorsAt = hub.indexOf('<ul class="v25rows v32rows v56-doors">');
    const doors = doorsAt >= 0 ? hub.slice(doorsAt, hub.indexOf('</ul>', doorsAt)) : '';
    const names = attrs(doors, /<span class="v25row-name">([^<]*)<\/span>/g);
    const regionsN = new Set(GROUPS.map((g) => g.region)).size;
    const atlasLine = unesc((/id="v58-atlas-door"><span class="v25row-name">[^<]*<\/span><span class="v25row-line">([^<]*)</.exec(doors) || [])[1] || '');
    check('the Wine Atlas root: Producers and flagships, last of its study doors, opening the root, its line counting ' + IDS.length + ' houses across ' + regionsN + ' regions', names[names.length - 1] === 'Producers and flagships' && doors.indexOf('data-go="flagships" id="v58-atlas-door"') > 0 && (hub.match(/id="v58-atlas-door"/g) || []).length === 1
      && atlasLine === A.G('v58W("atlasLine", { houses: v58Count(' + IDS.length + ', "oneHouseLow", "nHouses"), regions: v58Count(' + regionsN + ', "oneRegion", "nRegions") })') && !pageProblem(hub), names.join(', ') + ' / ' + atlasLine);
    const slugs = [...new Set(GROUPS.map((g) => g.region))];
    const parts = A.J('(function () { var p = {}; ' + JSON.stringify(slugs) + '.forEach(function (s) { var a = v39Find(s); if (a) p[v39PartName(a)] = 1; }); return Object.keys(p); })()');
    await A.load(parts);
    const fiveBad = [];
    slugs.forEach((slug) => {
      if (!A.G('!!v39Find(' + JSON.stringify(slug) + ')')) { fiveBad.push(slug + ': no region of the atlas'); return; }
      const h = A.page('S.view = "region"; S._v39region = ' + JSON.stringify(slug) + '; v39RegionView();');
      const at = h.indexOf('<section class="v58 v58-five" aria-labelledby="v58-five-h">');
      const five = at >= 0 ? h.slice(at, h.indexOf('</section>', at)) : '';
      const mine = GROUPS.filter((g) => g.region === slug);
      const rows = attrs(five, /data-go="flaggroup" data-arg="([^"]+)" id="v58-five-/g);
      if (at < 0 || JSON.stringify(rows) !== JSON.stringify(mine.map((g) => g.key))) { fiveBad.push(slug + ': rows ' + rows.join(',')); return; }
      mine.forEach((g) => { const line = unesc((new RegExp('id="v58-five-' + g.key + '"><span class="v25row-name">[^<]*</span><span class="v25row-line">([^<]*)<').exec(five) || [])[1] || ''); g.ids.forEach((id) => { if (line.indexOf(DATA[id].producer) < 0) fiveBad.push(slug + ': ' + g.key + '\'s line lacks ' + DATA[id].producer); }); });
      const codexAt = h.indexOf('<section class="v55-codex"');
      if (codexAt >= 0 && at > codexAt) fiveBad.push(slug + ': after In the Codex');
      const readAt = h.indexOf('id="v56-s-read"');
      if (readAt >= 0 && h.indexOf('<button type="button" class="v28-chip" data-v56="jump" data-to="v58-five-h" id="v58-s-five">', readAt) !== h.indexOf('</button>', readAt) + 9) fiveBad.push(slug + ': the chip not straight after Read');
      if ((h.match(/id="v58-five-h"/g) || []).length !== 1) fiveBad.push(slug + ': twice');
      const p = pageProblem(five + '</section>');
      if (p) fiveBad.push(slug + ': ' + p);
    });
    const bare = A.G('(function () { var s = ' + JSON.stringify(slugs) + '; var r = v39Regions().filter(function (a) { return s.indexOf(a.slug) < 0; })[0]; return r ? r.slug : ""; })()');
    if (bare) { const h = A.page('S.view = "region"; S._v39region = ' + JSON.stringify(bare) + '; v39RegionView();'); if (h.indexOf('v58-five') >= 0 || h.indexOf('v58-s-five') >= 0) fiveBad.push(bare + ' has no group, yet shows Five producers'); }
    check('Five producers on every region page with a group (' + slugs.length + ' regions), drawn clean, each group a door with its houses named, before In the Codex, its chip straight after Read; none on a region with no group (' + (bare || 'none to try') + ')', fiveBad.length === 0, few(fiveBad, 4));
    A.G('var __v58Gate = function (pid) { var put = []; var mk = function () { var o = { className: "", _h: "" }; Object.defineProperty(o, "innerHTML", { get: function () { return this._h; }, set: function (v) { this._h = String(v); } }); return o; }; var row = {}; var host = { insertBefore: function (box, before) { put.push({ html: box.innerHTML, cls: box.className, before: before === row }); }, appendChild: function (box) { put.push({ html: box.innerHTML, cls: box.className, before: false }); } }; row.parentNode = host; var view = { querySelector: function (s) { return s === ".centerrow" ? row : null; }, firstElementChild: host }; var wasMake = document.createElement, wasView = _v58ProfileView; document.createElement = mk; _v58ProfileView = function () { return view; }; try { prodProfileView(prodById(pid)); } finally { document.createElement = wasMake; _v58ProfileView = wasView; } return put; };');
    const libBad = [];
    let libN = 0;
    REC.filter((r) => /^p-/.test(r.producerId || '')).forEach((r) => {
      if (!A.G('!!prodById(' + JSON.stringify(r.producerId) + ')')) { libBad.push(r.key + ': ' + r.producerId + ' finds no library page'); return; }
      libN++;
      const put = A.J('__v58Gate(' + JSON.stringify(r.producerId) + ')');
      const mine = REC.filter((x) => x.producerId === r.producerId);
      if (put.length !== 1 || !put[0].before || put[0].cls.indexOf('v58-libdoor') < 0 || mine.some((x) => put[0].html.indexOf('data-v58="open" data-id="' + x.id + '"') < 0 || put[0].html.indexOf(esc(x.wine.name)) < 0) || put[0].html.indexOf(esc(mine.length > 1 ? WORDS.libHMany : WORDS.libH)) < 0) libBad.push(r.key + ': ' + JSON.stringify(put).slice(0, 200));
    });
    const other = A.G('(function () { var held = ' + JSON.stringify(REC.map((r) => r.producerId)) + '; var p = (typeof WINE_PRODUCERS !== "undefined" ? WINE_PRODUCERS : []).filter(function (x) { return x && /^p-/.test(x.id) && held.indexOf(x.id) < 0; })[0]; return p ? p.id : ""; })()');
    if (other && A.J('__v58Gate(' + JSON.stringify(other) + ')').length) libBad.push(other + ' has no flagship, yet its page gains a door');
    const first = REC.find((r) => /^p-/.test(r.producerId || ''));
    let act = null;
    if (first) act = A.J('(function () { v32Go({ view: "producers", arg: ' + JSON.stringify(first.producerId) + ' }, "push"); var n = history.length; var ok = V58_ACTS.open({ getAttribute: function (k) { return k === "data-id" ? ' + JSON.stringify(first.id) + ' : null; } }); var a = { ok: ok, view: S.view, arg: v32Arg("flagship"), pushed: history.length - n }; v32Back(); a.back = S.view; return a; })()');
    check('Its flagship on every library producer page with a record (' + libN + '), in the page\'s own markup before its drill, naming the wine; none on a producer without one; the door opens the house (pushed) and Back returns to the producer', libN > 0 && libBad.length === 0 && act && act.ok === true && act.view === 'flagship' && act.arg === first.id && act.pushed === 1 && act.back === 'producers', few(libBad, 3) + ' ' + JSON.stringify(act));
  } catch (e) { check('section 6 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('7. On Brennan\'s list, on the fixture house');
  try {
    const WINES = D.J('v28Wines(v53House()).map(function (w) { return { id: w.id, producer: v58Field(w, "producer"), wine: v58Field(w, "wine"), price: w.price, vintage: w.vintage }; })');
    const byId = {}; WINES.forEach((w) => { byId[w.id] = w; });
    const houseName = D.G('String((v53House() || {}).name || "")');
    check('the house is loaded: ' + houseName + ', ' + WINES.length + ' wines', WINES.length > 200 && !!houseName);
    const listBad = [];
    let rowsN = 0, housesN = 0, firstHit = null;
    REC.forEach((r) => {
      const list = D.J('v58HouseWines(v58Rec(' + JSON.stringify(r.id) + '))');
      const seen = {};
      list.forEach((x) => {
        const w = byId[x.id];
        if (!w) { listBad.push(r.key + ': ' + x.id + ' is no wine of the house'); return; }
        if (x.producer !== w.producer || x.wine !== w.wine) listBad.push(r.key + ': ' + x.id + ' drawn as ' + x.producer + ' / ' + x.wine);
        if (!sameHouse(w.producer, r.producer)) listBad.push(r.key + ': ' + w.producer + ' is not ' + r.producer);
        const k = fold(w.producer) + '|' + fold(w.wine);
        if (seen[k]) listBad.push(r.key + ': ' + w.producer + ' ' + w.wine + ' twice'); seen[k] = 1;
      });
      const h = String(D.G('v58PageHtml(' + JSON.stringify(r.id) + ')') || '');
      const at = h.indexOf('aria-labelledby="v58-s-list"');
      const sec = at >= 0 ? h.slice(at, h.indexOf('</section>', at)) : '';
      const ids = attrs(sec, /data-v58="wine" data-id="([^"]+)"/g);
      if (JSON.stringify(ids) !== JSON.stringify(list.map((x) => x.id))) listBad.push(r.key + ': the section draws ' + ids.length + ' rows for ' + list.length);
      if (list.length) {
        housesN++; rowsN += list.length; if (!firstHit) firstHit = { r, id: list[0].id };
        const head = unesc((/<h2 class="v32-h2 v58-sec-h" id="v58-s-list" tabindex="-1">([^<]*)<\/h2>/.exec(sec) || [])[1] || '');
        const want = /['’]s$/i.test(houseName) ? 'On ' + houseName + ' list' : 'On the list at ' + houseName;
        if (head !== want) listBad.push(r.key + ': headed ' + head);
        const txt = shown(sec);
        if (/[$£€]/.test(txt) || list.some((x) => { const w = byId[x.id]; return (w.price && String(w.price).length > 2 && txt.indexOf(String(w.price)) >= 0); })) listBad.push(r.key + ': a price on the list');
      }
    });
    check('every row of On ' + houseName + ' list a wine of the house by the record\'s own producer (every word of one name in the other), once, the producer over the wine, no price; ' + housesN + ' of ' + REC.length + ' houses pour ' + rowsN + ' wines', listBad.length === 0 && housesN > 0, few(listBad, 5));
    /* none left off, by the gate's own reading of a house's name: codex38's bare name, a bracket left out, the initials
       before it and the words of the trade after it taken off; a wine whose producer the library joins to the record's
       own producer, or whose name so read is the record's, is on that record's list (F.E. Trimbach's wines on Trimbach's) */
    const left = D.J('(function () { var name = function (s) { return String(v38Bare(String(s || "").replace(/\\([^)]*\\)/g, " ")) || "").replace(/^(?:[a-z] )+/, "").replace(/(?: (?:wines?|winery|vineyards?|estates?|cellars?|family|s a|sa|spa|srl))+$/, "").trim(); }; var wines = v28Wines(v53House()); var out = []; Object.keys(FLAGSHIPS).forEach(function (id) { var r = FLAGSHIPS[id]; var on = {}; v58HouseWines(r).forEach(function (x) { on[v58Fold(x.producer) + "|" + v58Fold(x.wine)] = 1; }); wines.forEach(function (w) { var p = v58Field(w, "producer"), wn = v58Field(w, "wine"); if (!p) return; var lib = null; if (/^p-/.test(r.producerId)) { try { lib = v38Library([p, v38ShortWho(p)]); } catch (e) { lib = null; } } if (lib && lib.id && lib.id !== r.producerId) return; if (!(lib && lib.id === r.producerId) && (!name(p) || name(p) !== name(r.producer))) return; if (!on[v58Fold(p) + "|" + v58Fold(wn)]) out.push(r.key + ": " + p + " / " + wn); }); }); return out; })()');
    check('no wine of the house left off a record\'s list: every wine the library joins to the record\'s producer, or whose producer reads as the record\'s house (its initials and the words of the trade taken off), is drawn', left.length === 0, few(left, 5));
    const named = D.J('(function () { var by = {}; Object.keys(FLAGSHIPS).forEach(function (id) { by[FLAGSHIPS[id].key] = FLAGSHIPS[id]; }); return ' + JSON.stringify([['trimbach', 'F.E. Trimbach', true], ['lopez-de-heredia', 'R. López de Heredia', true], ['la-rioja-alta', 'La Rioja Alta', true], ['biondi-santi', 'Biondi Santi (Tenuta Greppo)', true], ['latour', 'Château Latour-Martillac', false], ['ferrari', 'Ferrari-Carano', false], ['krug', 'Krugerhof', false]]) + '.filter(function (x) { return !!by[x[0]]; }).map(function (x) { return [x[0], x[1], x[2], v58IsHouse(by[x[0]], x[1])]; }); })()');
    const namedBad = named.filter((x) => x[2] !== x[3]).map((x) => x[1] + (x[2] ? ' is ' : ' is not ') + x[0] + '\'s house');
    check('the house\'s name read whole: F.E. Trimbach is Trimbach, R. López de Heredia and La Rioja Alta the records that go on from them, Biondi Santi (Tenuta Greppo) Biondi-Santi; never a longer name that goes on from the record\'s (Latour-Martillac is not Latour, Ferrari-Carano is not Ferrari)', (PARTIAL ? named.length > 0 : named.length === 7) && namedBad.length === 0, namedBad.join(' | '));
    if (firstHit) {
      const opened = D.J('(function () { v32Go({ view: "flagships", arg: "" }, "push"); v32Go({ view: "flagship", arg: ' + JSON.stringify(firstHit.r.id) + ' }, "push"); var n = history.length; var ok = V58_ACTS.wine({ getAttribute: function (k) { return k === "data-id" ? ' + JSON.stringify(firstHit.id) + ' : null; } }); var a = { ok: ok, view: S.view, open: v28State().open, pushed: history.length - n }; v32Back(); a.back = { view: S.view, arg: v32Arg("flagship") }; a.none = V58_ACTS.wine({ getAttribute: function () { return "w-00000000"; } }); return a; })()');
      check('a row opens that wine\'s card on the list (pushed) and Back returns to the house (' + firstHit.r.producer + '); a wine the house does not hold opens nothing', opened.ok === true && opened.view === 'cellar' && opened.open === firstHit.id && opened.pushed === 1 && opened.back.view === 'flagship' && opened.back.arg === firstHit.r.id && opened.none === false, JSON.stringify(opened));
    }
  } catch (e) { check('section 7 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('8. study: the decks, the face and the schedule');
  try {
    const T = await bootDevice();
    const G0 = GROUPS[0];
    const gCards = [].concat.apply([], G0.ids.map((id) => DATA[id].cards.map((c) => c.id)));
    const allCards = [].concat.apply([], REC.map((r) => r.cards.map((c) => c.id)));
    const decks = T.J('(function () { var a = v32DeckDef("flagcards"), b = v32DeckDef("flagcards:' + G0.key + '"), c = v32DeckDef("flagsdue"); return { a: a.cards.map(function (x) { return x.id; }), ak: a.kind, b: b.cards.map(function (x) { return x.id; }), bk: b.cards.every(function (x) { return x.kind === "flag" && x.group === "' + G0.key + '" && !!x.house && !!x.label; }), bn: b.name, c: c.cards.length, none: v32DeckDef("flagcards:no-such-group").cards.length }; })()');
    const groupsOk = GROUPS.every((g) => JSON.stringify(T.J('v32DeckDef("flagcards:' + g.key + '").cards.map(function (x) { return x.id; })')) === JSON.stringify([].concat.apply([], g.ids.map((id) => DATA[id].cards.map((c) => c.id)))));
    check('the decks: flagcards every flagship card (' + allCards.length + ', kind flag), flagcards:{group} each group\'s own in its order (' + G0.key + ': ' + gCards.length + '), flagsdue empty on a new device, a group the device lacks empty', decks.a.length === allCards.length && decks.a.slice().sort().join() === allCards.slice().sort().join() && decks.ak === 'flag' && JSON.stringify(decks.b) === JSON.stringify(gCards) && decks.bk && decks.bn === 'Flagship cards: ' + G0.title && decks.c === 0 && decks.none === 0 && groupsOk, JSON.stringify({ a: decks.a.length, b: decks.b.length, c: decks.c, groupsOk }));
    const face = T.J('(function () { v32Go({ view: "flagships", arg: "" }, "push"); v32Go({ view: "flaggroup", arg: "' + G0.key + '" }, "push"); v32StartRun("flagcards:' + G0.key + '", { keepOrder: true, push: true }); var r = S._v32run; var c = r.cards[r.deck[0]]; var f = v32CardFace(c, r); r.flip = true; var b = v32CardFace(c, r); r.flip = false; return { id: c.id, house: c.house, front: c.front, back: c.back, f: f, b: b, view: S.view, lit: v25NavWord(), parent: v32ParentRoute(), hash: location.hash }; })()');
    check('the card face: the question alone over the house\'s name, then the answer under it with the door to the house; on codex32\'s card screen at #/flashcards/flagcards:' + G0.key + ', lit Wine Atlas, the run climbing to the group', face.f.indexOf(esc(face.front)) > 0 && face.f.indexOf(esc(face.back)) < 0 && face.b.indexOf(esc(face.back)) > 0 && face.b.indexOf('data-go="flagship" data-arg="' + face.house + '"') > 0 && face.f.indexOf(esc(DATA[face.house].producer)) > 0
      && !CH.cleanProblem(face.f + face.b + '<p>' + 'x'.repeat(100) + '</p>') && !CH.drawnVoiceProblem(face.f + face.b) && face.view === 'housedeck' && /^#\/flashcards\/flagcards:/.test(face.hash) && face.lit === 'worldmap' && face.parent.view === 'flaggroup' && face.parent.arg === G0.key, JSON.stringify({ view: face.view, hash: face.hash, lit: face.lit, parent: face.parent }));
    const slotKey = T.G('v58Key()');
    const before = Object.assign({}, T.store);
    const graded = T.J('(function () { var r = S._v32run; var ids = [r.cards[r.deck[0]].id, r.cards[r.deck[1]].id]; r.flip = true; v32Grade(true); r.flip = true; v32Grade(false); var o = v58Kept(); return { ids: ids, a: o.c[ids[0]], b: o.c[ids[1]], today: v58Today(), one: v58AddDays(1), three: v58AddDays(3), learnt: v32DeckDef("flagcards:' + G0.key + '").learnt, due: v32DeckDef("flagsdue").cards.map(function (c) { return c.id; }) }; })()');
    const moved = Object.keys(Object.assign({}, before, T.store)).filter((k) => before[k] !== T.store[k]);
    const again = T.J('(function () { v32StartRun("flagcards:' + G0.key + '", { keepOrder: true, first: ' + JSON.stringify(graded.ids[0]) + ' }); var r = S._v32run; r.flip = true; v32Grade(true); return v58Kept().c[' + JSON.stringify(graded.ids[0]) + ']; })()');
    check('on seeded grades, in the layer\'s slot: a card graded right is due tomorrow, then in three days; a card graded wrong is due today, sooner', graded.a && graded.a.due === graded.one && graded.a.n === 1 && graded.b && graded.b.due === graded.today && graded.b.n === 0 && again && again.due === graded.three && again.n === 2 && again.due > graded.b.due, JSON.stringify({ a: graded.a, b: graded.b, again }));
    check('the slot is oot-codex-flagrs-v1 under the profile key rule, and a grade moves no other slot (' + (moved.join(', ') || 'none') + ' moved)', /oot-codex-flagrs-v1/.test(slotKey) && slotKey in T.store && JSON.stringify(moved) === JSON.stringify([slotKey]) && T.G('localStorage.getItem(v57Key()) === null'), slotKey + ' ' + moved.join(' '));
    check('the due deck deals the one sent back; one card learnt of the group\'s', JSON.stringify(graded.due) === JSON.stringify([graded.ids[1]]) && graded.learnt === 1, JSON.stringify(graded));
    const page = T.G('v58PageHtml(' + JSON.stringify(T.G('v58CardBook().by[' + JSON.stringify(graded.ids[1]) + '].house')) + ')');
    const studyAt = page.indexOf('aria-labelledby="v58-s-study"');
    const study = studyAt >= 0 ? page.slice(studyAt, page.indexOf('</section>', studyAt)) : '';
    const states = attrs(study, /<span class="v58-cardstate">([^<]*)<\/span>/g);
    check('a house\'s Study: its two cards with when each is due (' + states.join(', ') + '), and the doors to its group\'s cards and its group\'s quiz', states.length === 2 && states.indexOf('Due today') >= 0 && study.indexOf('data-v58="cards" data-deck="flagcards:' + G0.key + '"') > 0 && study.indexOf('data-v58="quiz" data-group="' + G0.key + '"') > 0, study.slice(0, 300));
    const root = T.G('v58RootHtml()');
    const line = unesc((/id="v58-door-cards"><span class="v25row-name">[^<]*<\/span><span class="v25row-line">([^<]*)</.exec(root) || [])[1] || '');
    check('the due count on the root: ' + line, line.indexOf('1 due today') === 0, line);
    const deck = T.J('(function () { v32Go({ view: "flagships", arg: "" }, "push"); var ok = v58StartCards(""); var a = { ok: ok, view: S.view, deck: S._v32deck || (S._v32run && S._v32run.deckId), lit: v25NavWord(), parent: v32ParentRoute() }; return a; })()');
    check('the cards door on the root with a card due starts the due deck, lit Wine Atlas and climbing to the root', deck.ok === true && deck.deck === 'flagsdue' && deck.lit === 'worldmap' && deck.parent.view === 'flagships', JSON.stringify(deck));
    const T2 = await bootDevice();
    const screen = T2.J('(function () { v32Go({ view: "flagships", arg: "" }, "push"); var ok = v58StartCards(""); var a = { ok: ok, view: S.view, deck: S._v32deck, lit: v25NavWord(), parent: v32ParentRoute(), html: v32DeckHtml() }; v32Back(); a.back = S.view; v32StartRun("flagcards:' + G0.key + '", {}); var r = S._v32run; while (r.deck.length) { r.flip = true; v32Grade(true); } a.end = v32CardHtml(); return a; })()');
    check('with nothing due the cards door opens the whole deck\'s own screen (its round sizes), lit Wine Atlas, Back to the root; a deck dealt to its end offers Every region and its five, never the Library', screen.ok === true && screen.view === 'deck' && screen.deck === 'flagcards' && screen.lit === 'worldmap' && screen.parent.view === 'flagships' && !pageProblem(screen.html) && screen.back === 'flagships' && screen.end.indexOf('data-go="flagships" id="v58-deck-all"') > 0 && screen.end.indexOf('data-v32="another"') < 0, JSON.stringify({ view: screen.view, deck: screen.deck, back: screen.back, p: pageProblem(screen.html) }));
  } catch (e) { check('section 8 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('9. the quiz');
  try {
    const Q = await bootDevice();
    const G0 = GROUPS[0];
    const gQs = [].concat.apply([], G0.ids.map((id) => DATA[id].questions.map((q) => q.id)));
    const one = Q.J('(function () { v32Go({ view: "flagships", arg: "" }, "push"); v32Go({ view: "flaggroup", arg: "' + G0.key + '" }, "push"); var ok = v58StartQuiz("' + G0.key + '"); return { ok: ok, view: S.view, mode: S.mode, section: S.section, ids: S.pool.map(function (q) { return q.id; }), cats: S.pool.map(function (q) { return q.cat; }), keyed: S.pool.every(function (q) { return Array.isArray(q.opts) && q.opts.length === 4 && q.opts[q.a] !== undefined; }), lit: v25NavWord(), parent: v32ParentRoute() }; })()');
    const want = 'Flagships: ' + G0.title;
    const asShipped = Q.J('v58QsOfGroup("' + G0.key + '").map(function (q) { return [q.id, q.q, q.opts, q.a]; })');
    const shipped = [].concat.apply([], G0.ids.map((id) => DATA[id].questions.map((q) => [q.id, q.q, q.opts, q.a])));
    check('a group\'s quiz: its ' + gQs.length + ' questions through the core engine as a drill, their options and answers as the build dealt them, the section ' + want + ', lit Wine Atlas, climbing to the group', one.ok === true && one.view === 'quiz' && one.mode === 'drill' && one.section === want && one.ids.slice().sort().join() === gQs.slice().sort().join() && one.cats.every((c) => c === want) && one.keyed && JSON.stringify(asShipped) === JSON.stringify(shipped) && one.lit === 'worldmap' && one.parent.view === 'flaggroup' && one.parent.arg === G0.key, JSON.stringify(one).slice(0, 400));
    const before = JSON.parse(Q.G('localStorage.getItem("codexStats") || "{}"'));
    const ans = Q.J('(function () { var a = S.pool[0], b = S.pool[1]; statRecord(a, true); statRecord(b, false); var o = v58Kept(); var ka = qKey(a), kb = qKey(b); return { a: a.id, b: b.id, ra: o.q[a.id], rb: o.q[b.id], one: v58AddDays(1), today: v58Today(), srs: [ST.srs[ka] || null, ST.srs[kb] || null], owned: [keyOwned(ka), keyOwned("certified|" + a.id), keyOwned(a.id)], found: (findByKey(ka) || {}).id, cat: (findByKey(ka) || {}).cat }; })()');
    check('answered through the engine (statRecord): right, due tomorrow in the layer\'s slot; wrong, due today; never in codex3\'s rotation (ST.srs untouched), never level progress, found by its key in its group\'s section', ans.ra && ans.ra.due === ans.one && ans.ra.n === 1 && ans.rb && ans.rb.due === ans.today && ans.rb.n === 0 && ans.srs[0] === null && ans.srs[1] === null && JSON.stringify(before.srs || {}) === Q.G('JSON.stringify(ST.srs || {})') && ans.owned.every((x) => x === false) && ans.found === ans.a && ans.cat === want, JSON.stringify(ans));
    const orph = Q.J('(function () { var o = qidAudit(); var n = 0; Object.keys(o.orphanedKeys || {}).forEach(function (k) { n += (o.orphanedKeys[k] || []).filter(function (x) { return /\\bfl-/.test(x); }).length; }); return n; })()');
    check('a flagship key is never an orphan in the ledger\'s audit', orph === 0, orph);
    const all = Q.J('(function () { v32Go({ view: "flagships", arg: "" }, "push"); v58StartQuiz(""); return { n: S.pool.length, first: S.pool[0] && S.pool[0].id, section: S.section, parent: v32ParentRoute(), lit: v25NavWord() }; })()');
    const total = REC.length * 2;
    check('the quiz on every flagship: ten a round (of ' + total + '), the one due first, the section Flagships: every region, climbing to the root', all.n === Math.min(10, total) && all.first === ans.b && all.section === 'Flagships: every region' && all.parent.view === 'flagships' && all.lit === 'worldmap', JSON.stringify(all));
    const again = Q.J('(function () { startDrill("' + want + '"); var a = { n: S.pool.length, section: S.section }; startDrill("Flagships: every region"); a.all = S.pool.length; a.allSection = S.section; S.view = "results"; a.lit = v25NavWord(); a.parent = v32ParentRoute(); return a; })()');
    check('dealt again by its section (the results screen and codex19\'s report ask startDrill): the group\'s, every flagship\'s; the results lit Wine Atlas, climbing to the root', again.n === gQs.length && again.section === want && again.all === Math.min(10, total) && again.allSection === 'Flagships: every region' && again.lit === 'worldmap' && again.parent.view === 'flagships', JSON.stringify(again));
    const root = Q.G('v58RootHtml()');
    const qline = unesc((/id="v58-door-quiz"><span class="v25row-name">[^<]*<\/span><span class="v25row-line">([^<]*)</.exec(root) || [])[1] || '');
    check('the quiz door on the root counts the questions due: ' + qline, qline.indexOf('1 due today') === 0, qline);
  } catch (e) { check('section 9 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('10. the views warm and cold');
  try {
    const V = await bootDevice();
    const R0 = REC[0], G0 = GROUPS.find((g) => g.key === R0.group);
    const warm = V.J('(function () { var out = []; var at = function () { out.push({ view: S.view, arg: v32Arg(S.view), hash: location.hash, lit: v25NavWord(), name: v25MainName() }); }; v32Go({ view: "worldmap", arg: "" }, "push"); v32Go({ view: "flagships", arg: "" }, "push"); at(); v32Go({ view: "flaggroup", arg: ' + JSON.stringify(G0.key) + ' }, "push"); at(); v32Go({ view: "flagship", arg: ' + JSON.stringify(R0.id) + ' }, "push"); at(); v32Back(); at(); v32Back(); at(); v32Back(); out.push({ view: S.view }); return out; })()');
    check('warm: the root, a group and a house each at its own address, lit Wine Atlas and named; Back climbs the house to its group, the group to the root, the root to the Wine Atlas root',
      warm[0].view === 'flagships' && warm[0].hash === '#/v/flagships' && warm[1].view === 'flaggroup' && warm[1].arg === G0.key && warm[1].hash === '#/v/flaggroup/' + G0.key && warm[1].name === G0.title && warm[2].view === 'flagship' && warm[2].arg === R0.id && warm[2].hash === '#/v/flagship/' + R0.id && warm[2].name === R0.producer
      && warm.slice(0, 5).every((x) => x.lit === 'worldmap') && warm[3].view === 'flaggroup' && warm[4].view === 'flagships' && warm[5].view === 'worldmap', JSON.stringify(warm));
    const parents = V.J('(function () { var out = {}; ["flagships", "flaggroup", "flagship"].forEach(function (v) { out[v] = V32_PARENT[v]; }); out.p1 = V58_VIEWS.flagship.parent(' + JSON.stringify(R0.id) + '); out.p2 = V58_VIEWS.flaggroup.parent(' + JSON.stringify(G0.key) + '); out.p3 = V58_VIEWS.flagships.parent(""); return out; })()');
    check('the parents: a house its group, a group the root, the root the Wine Atlas root', parents.p1.view === 'flaggroup' && parents.p1.arg === G0.key && parents.p2.view === 'flagships' && parents.p3.view === 'worldmap', JSON.stringify(parents));
    const coldBad = [];
    const cold = [['#/v/flagships', 'flagships', '', ['flagships', 'worldmap', 'home']], ['#/v/flaggroup/' + G0.key, 'flaggroup', G0.key, ['flaggroup', 'flagships', 'worldmap', 'home']], ['#/v/flagship/' + R0.id, 'flagship', R0.id, ['flagship', 'flaggroup', 'flagships', 'worldmap', 'home']], ['#/flashcards/flagcards:' + G0.key, 'deck', '', ['deck', 'flaggroup', 'flagships', 'worldmap', 'home']], ['#/flashcards/flagsdue', 'deck', '', ['deck', 'flagships', 'worldmap', 'home']]];
    for (const [hash, view, arg, climb] of cold) {
      const Z = await bootDevice({ hash });
      const got = Z.J('({ view: S.view, arg: v32Arg(S.view), lit: v25NavWord() })');
      const html = view === 'deck' ? String(Z.G('v32DeckHtml()') || '') : String(Z.G('V58_VIEWS[' + JSON.stringify(view) + '].draw(V58_ARGS[' + JSON.stringify(view) + '] || "")') || '');
      const chain = Z.J('(function () { var out = [S.view]; for (var i = 0; i < 6 && S.view !== "home"; i++) { v32Back(); out.push(S.view); } return out; })()');
      if (got.view !== view || (arg && got.arg !== arg) || got.lit !== 'worldmap' || pageProblem(html) || JSON.stringify(chain) !== JSON.stringify(climb)) coldBad.push(hash + ' ' + JSON.stringify(got) + ' ' + chain.join('>') + ' ' + pageProblem(html));
    }
    check('each address answers cold (the root, a group, a house, a group\'s deck, the due deck), lit Wine Atlas, drawn clean, Back climbing to Home', coldBad.length === 0, few(coldBad, 3));
  } catch (e) { check('section 10 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('11. the shell and the chain rule');
  try {
    const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
    const at = (s) => index.indexOf(s);
    const i57 = at('src="js/codex57.js'), iData = at('src="js/data-flagships.js?v='), i58 = at('src="js/codex58.js?v='), iBoot = at('src="js/boot.js');
    check('index.html loads js/data-flagships.js then js/codex58.js, each once with ?v=, after codex57.js and before boot.js', i57 > 0 && iData > i57 && i58 > iData && iBoot > i58 && index.split('js/codex58.js').length === 2 && index.split('js/data-flagships.js').length === 2);
    const v = Number((sw.match(/const CACHE = '(?:oot-)?codex-v(\d+)';/) || [])[1]);
    const s57 = sw.indexOf("'./js/codex57.js'"), sData = sw.indexOf("'./js/data-flagships.js'"), s58 = sw.indexOf("'./js/codex58.js'");
    check('sw.js is codex-v118 or later (' + v + ') and lists ./js/data-flagships.js and ./js/codex58.js once each, after ./js/codex57.js', v >= 118 && s57 > 0 && sData > s57 && s58 > sData && sw.split("'./js/codex58.js'").length === 2 && sw.split("'./js/data-flagships.js'").length === 2, 'v' + v);
    const gates = fs.readdirSync(GATES).filter((f) => /^(check-|list-harness)[\w-]*\.c?js$/.test(f));
    const short = [];
    gates.forEach((f) => {
      const t = fs.readFileSync(path.join(GATES, f), 'utf8');
      const re = /'codex57\.js'\s*([,\]])/g;
      let m;
      while ((m = re.exec(t))) {
        const after = t.slice(m.index + 12, m.index + 260);
        const straight = /^\s*,\s*'data-flagships\.js'\s*,\s*'codex58\.js'/.test(after);
        const follows = m[1] === ']' && /^\s*\]\s*:\s*\[\]\)?\s*\.concat\([^;]{0,120}?\['data-flagships\.js',\s*'codex58\.js'\]/.test(after);
        const opens = m[1] === ']' && /^\s*\]\s*\.concat\([^;]{0,120}?\['data-flagships\.js',\s*'codex58\.js'\]/.test(after);
        if (!straight && !follows && !opens) short.push(f + ': ' + t.slice(Math.max(0, m.index - 40), m.index + 60).replace(/\s+/g, ' '));
      }
    });
    check('the chain rule: every list in a gate here that names codex57.js names data-flagships.js and codex58.js straight after it, or in the list that follows it (' + gates.length + ' gates read)', !short.length && gates.length > 40, few(short, 3));
  } catch (e) { check('section 11 ran to its end', false, e && e.stack); }

  /* ================================================================ */
  section('12. the layer\'s file');
  try {
    const read = SRC.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
    const srcBad = voiceProblems(SRC).concat(voiceProblems(read));
    check('codex58.js (its escapes read as the characters they are): no dash of any kind, never the retired word, no level numeral, nothing at or above U+2190', srcBad.length === 0, srcBad.join(', '));
    const people = S.people().names.filter((n) => (' ' + fold(SRC) + ' ').indexOf(' ' + fold(n) + ' ') >= 0);
    check('codex58.js names nobody, no house, ships no key and no model name, and holds no fl- literal (the prefix is FLAGSHIP_META\'s)', !people.length && !/Brennan|sk-ant|api[_-]?key|claude-|\bopus\b|\bsonnet\b|\bhaiku\b|\bfable\b|chatgpt|openai/i.test(SRC) && !/["'`]fl-|\^fl-|\bfl-[0-9a-z]{8}\b/.test(SRC), people.join(', '));
    const code = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/'(?:[^'\\\n]|\\.)*'/g, "''");
    check('codex58.js declares with var and function only (no let, const, class or arrow)', !/(^|[^\w.'"])(let|const|class)\s/.test(code) && code.indexOf('=>') < 0);
    const wrappers = SRC.split('\n').filter((l) => /^\s*var _v58\w+ = \w+;$/.test(l));
    const unguarded = wrappers.filter((line) => { const m = /var (_v58\w+) = (\w+);$/.exec(line); const i = SRC.indexOf(line); const before = SRC.slice(Math.max(0, i - 200), i); return !new RegExp('if \\(typeof ' + m[2] + ' === \'function\'\\) \\{\\s*$').test(before); });
    const outer = D.J('(function () { var out = []; [["v32Arg", "_v58Arg"], ["v32Apply", "_v58Apply"], ["v25MainName", "_v58MainName"], ["v55HubHtml", "_v58HubHtml"], ["v55RegionHtml", "_v58RegionHtml"], ["prodProfileView", "_v58ProfileView"], ["v32DeckDef", "_v58DeckDef"], ["v32Learnt", "_v58Learnt"], ["v32Grade", "_v58Grade"], ["v32StartRun", "_v58StartRun"], ["v32CardFace", "_v58CardFace"], ["v32CardHtml", "_v58CardHtml"], ["startDrill", "_v58StartDrill"], ["keyOwned", "_v58KeyOwned"], ["srsRecord", "_v58SrsRecord"], ["qidAudit", "_v58QidAudit"], ["findByKey", "_v58FindByKey"], ["graderDisputes", "_v58GraderDisputes"], ["badReports", "_v58BadReports"], ["v25NavWord", "_v58StudyNavWord"], ["v32ParentRoute", "_v58StudyParentRoute"]].forEach(function (p) { var f = this[p[0]]; if (typeof f !== "function" || typeof this[p[1]] !== "function" || f === this[p[1]] || String(f).indexOf("_v58") < 0) out.push(p[0]); }, this); return out; }).call(this)');
    check('codex58.js edits no earlier layer: every wrapper (' + wrappers.length + ') is typeof guarded, the guard on the line above it, and the outermost of its function on the chain', wrappers.length >= 20 && unguarded.length === 0 && outer.length === 0, unguarded.concat(outer).join(' | '));
    const cssAt = SRC.indexOf('css.textContent = ['), cssEnd = SRC.indexOf("].join('\\n')", cssAt);
    const rules = [...SRC.slice(cssAt, cssEnd).matchAll(/^\s*'((?:[^'\\]|\\.)*)',?$/gm)].map((m) => m[1]);
    const selBad = [];
    rules.forEach((r) => {
      const body = /^@media[^{]*\{(.*)\}$/.exec(r);
      const rule = body ? body[1] : r;
      const sel = rule.slice(0, rule.indexOf('{'));
      sel.split(',').forEach((x) => { if (!/^\.wrap\s/.test(x.trim())) selBad.push(x.trim()); });
    });
    check('every selector of the v58-style element (' + rules.length + ' rules) starts .wrap, every colour a house token (no colour written out)', rules.length > 50 && selBad.length === 0 && !rules.some((r) => /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(r)), selBad.slice(0, 5).join(' | '));
    /* CLAUDE.md's contrast rule, read on the style: a text colour under a card (.v58-card, .v58-fcard) is one of the
       parchment's tokens, every other one of the dark page's; and codex39's sources, coloured claret for the parchment
       of a region page, are given the dark page's colour where this layer draws them on the page's own ground (claret
       there reads at about 2.4 to 1 by night) */
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
      if (((/\.v58-f?card\b/.test(sel)) ? PARCH_T : DARK_T).indexOf(m[1]) < 0) groundBad.push(sel + ' ' + m[1]);
    });
    const c39 = fs.readFileSync(path.join(JS, 'codex39.js'), 'utf8');
    const srcTok = (/'\.wrap \.v39-sources a\{(?:[^'}]*;)?color:var\((--[\w-]+)\)/.exec(c39) || [])[1] || '';
    const ourSrc = (/[{;]color:var\((--[\w-]+)\)/.exec(rules.find((r) => /^\.wrap \.v58-sources a\{/.test(r)) || '') || [])[1] || '';
    if (PARCH_T.indexOf(srcTok) >= 0 && DARK_T.indexOf(ourSrc) < 0) groundBad.push('.v58-sources a: codex39 colours its sources ' + srcTok + ' for parchment, and this layer gives them no dark page colour on its own ground');
    check('every colour on its own ground (the contrast rule, ' + coloured + ' coloured rules): under a card the parchment\'s tokens, elsewhere the dark page\'s, and the sources (codex39\'s ' + (srcTok || 'none') + ') given ' + (ourSrc || 'nothing'), coloured > 15 && groundBad.length === 0, groundBad.join(' | '));
    let lits = SRC.replace(/\/\*[\s\S]*?\*\//g, '');
    const cut = (s, a0, b0, off) => { const a = s.indexOf(a0), b = a >= 0 ? s.indexOf(b0, a) : -1; return a < 0 || b < 0 ? s : s.slice(0, a) + s.slice(b + off); };
    lits = cut(lits, 'var V58_WORDS = {', '\n};', 3);
    lits = cut(lits, 'css.textContent = [', "].join('\\n')", 0);
    const earlier = fs.readdirSync(JS).filter((f) => /^codex\d+\.js$/.test(f) && f !== 'codex58.js').map((f) => fs.readFileSync(path.join(JS, f), 'utf8')).join('\n');
    const strayWords = [];
    [...lits.matchAll(/'((?:[^'\\\n]|\\.)*)'/g)].map((m) => m[1]).forEach((l) => {
      const text = l.replace(/<[^>]*>/g, ' ').replace(/<[^>]*$/, ' ').replace(/^[^<]*>/, ' ').trim();
      if (!text || Object.prototype.hasOwnProperty.call(WORDS, text)) return;
      const prose = /[A-Z][a-z]{2,}/.test(text) || /[a-z]{2,}\s+[a-z]{2,}\s+[a-z]{2,}/.test(text);
      if (prose && earlier.indexOf(text) < 0) strayWords.push(text);
    });
    const keyCalls = [...SRC.matchAll(/v58W\('([A-Za-z_]+)'\s*[,)]/g)].map((m) => m[1]).filter((k, i, a) => a.indexOf(k) === i);
    const noKey = keyCalls.filter((k) => !Object.prototype.hasOwnProperty.call(WORDS, k));
    const unread = Object.keys(WORDS).filter((k) => keyCalls.indexOf(k) < 0 && SRC.split("'" + k + "'").length < 2);
    check('every word the layer shows is V58_WORDS\'s: no shown string literal outside it (a literal that is an earlier layer\'s own words is a match, not a word shown), every key it reads there (' + keyCalls.length + ' named), and every word of it read', strayWords.length === 0 && noKey.length === 0 && unread.length === 0, strayWords.concat(noKey, unread.map((k) => 'unread ' + k)).slice(0, 6).join(' | '));
    const wordBad = Object.keys(WORDS).map((k) => [k, voiceProblems(WORDS[k])]).filter((x) => x[1].length);
    const SUPER = /\b(best|most|finest|greatest|largest|smallest|highest|lowest|oldest|newest|easiest|hardest|fastest|ultimate|iconic|legendary|world class|famous|renowned|top)\b/i;
    const AMER_W = /\b(color\w*|center\w*|toward|favor\w*|flavor\w*|\w+iz(e|es|ed|ing)|gray|program|practice|catalog|percent)\b/i;
    const wordStyle = Object.keys(WORDS).filter((k) => SUPER.test(WORDS[k]) || AMER_W.test(WORDS[k]) || /\bLevel\s+\d/.test(WORDS[k]) || /\$|£|€|%/.test(WORDS[k]));
    check('every word of V58_WORDS (' + Object.keys(WORDS).length + ') in the strictest voice: no dash, never the retired word, no level numeral, no superlative, British spelling, no price, no per cent sign', Object.keys(WORDS).length > 100 && wordBad.length === 0 && wordStyle.length === 0, JSON.stringify(wordBad.concat(wordStyle)));
    const selfBad = voiceProblems(fs.readFileSync(__filename, 'utf8').replace(/(^|[^\w])Practise(?!\w)/g, '$1')).filter((p) => !/retired|numeral/.test(p));
    check('check-flagships.js itself carries no dash and nothing at or above U+2190', selfBad.length === 0, selfBad.join(', '));
  } catch (e) { check('section 12 ran to its end', false, e && e.stack); }
}

/* ---- the gate proves it can fail ----
   Each mutation breaks one rule in a scratch copy of the shipped tree (index.html, sw.js, js/, every file copied, never
   linked) or, for the chain rule, of the gates; this gate, run on it, must fail, and fail by the check that names the
   rule. */
function firstId(re) {
  const t = fs.readFileSync(path.join(JS, 'data-flagships.js'), 'utf8');
  const m = re.exec(t);
  return m ? m[1] : 'none';
}
/* a copy of a tree with every link followed: a scratch tree may link its files to a checkout, and a mutation written
   through a link would land in that checkout (fs.cpSync keeps links even when told to follow them) */
function copyTree(from, to) {
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach((name) => {
    const a = path.join(from, name), b = path.join(to, name);
    const st = fs.statSync(a);
    if (st.isDirectory()) copyTree(a, b);
    else if (st.isFile()) fs.writeFileSync(b, fs.readFileSync(a));
  });
}
function mutations() {
  const card = firstId(/"cards":\[\{"id":"(fl-[0-9a-z]{8})"/);
  const table = firstId(/"table":"([^"]{20,60})/);
  const house = firstId(/"producer":"([^"]+)"/);
  const living = S.people().names.find((n) => S.nameWords(house).every((w) => fold(n).split(' ').indexOf(w) < 0)) || S.people().names[0];
  const MUT = [
    ['the data file edited by hand', 'js/data-flagships.js', '"wave":1', '"wave":2', 'the data is the build'],
    ['a card id moved in the data', 'js/data-flagships.js', '{"id":"' + card + '"', '{"id":"fl-00000000"', 'ids frozen against keys.v1.json'],
    ['a living name in a table line', 'js/data-flagships.js', '"table":"' + table, '"table":"' + living + ' says ' + table, 'nobody living of people.json'],
    ['At the table set after the chips', 'js/codex58.js', "  var secs = v58Sections(r);\n", "  var secs = v58Sections(r);\n  html = html.replace(/<section class=\"v58-table\"[\\s\\S]*?<\\/section>/, '');\n", 'At the table first'],
    ['the story left out of a page', 'js/codex58.js', "    ['v58-s-story', v58W('storyChip'), v58P('v58-story', r.story), 'v58-storysec', v58W('storyH')],\n", '', 'the sections in their order'],
    ['a group card opening no house', 'js/codex58.js', 'class="v58-card-open" data-go="flagship" data-arg="\' + v58Esc(r.id) + \'"', 'class="v58-card-open" data-go="flagship" data-arg="\' + v58Esc(r.id + \'x\') + \'"', 'every group'],
    ['the Wine Atlas root without its door', 'js/codex58.js', '    try { return v58HubShape(html); } catch (e) { return html; }', '    return html;', 'the Wine Atlas root'],
    ['Five producers left off the region page', 'js/codex58.js', '    try { return v58RegionShape(html, a); } catch (e) { return html; }', '    return html;', 'Five producers on every region page'],
    ['the library page without its door', 'js/codex58.js', '    try { v58ProfileDoor(v, rec); } catch (e) { }', '', 'Its flagship on every library producer page'],
    ['a list row opening no card', 'js/codex58.js', 'data-v58="wine" data-id="\' + v58Esc(x.id) + \'"', 'data-v58="wine" data-id="\' + v58Esc(x.id + \'0\') + \'"', 'every row of On'],
    ['a grade scheduled backwards', 'js/codex58.js', "v58Sched('c', c.id, !!got);", "v58Sched('c', c.id, !got);", 'a card graded right is due tomorrow'],
    ['the grades kept in the Grapes tab\'s slot', 'js/codex58.js', "var V58_SLOT = 'oot-codex-flagrs-v1';", "var V58_SLOT = 'oot-codex-grapesrs-v1';", 'the slot is oot-codex-flagrs-v1'],
    ['the root without its due count', 'js/codex58.js', "t.due ? v58W('cardsRowDue', vars) : v58W('cardsRowLine', vars)", "v58W('cardsRowLine', vars)", 'the due count on the root'],
    ['a group\'s quiz dealing every question', 'js/codex58.js', '  if (key) return v58Shuffle(v58QsOfGroup(key));', '  if (key) return v58Shuffle(v58QBook().list);', 'a group\'s quiz'],
    ['a flagship answer kept in codex3\'s rotation', 'js/codex58.js', "      try { if (v58Own(v58QBook().by, q.id)) v58Sched('q', q.id, !!ok); } catch (e) { }\n      return;\n", "      try { if (v58Own(v58QBook().by, q.id)) v58Sched('q', q.id, !!ok); } catch (e) { }\n", 'never in codex3\'s rotation'],
    ['a flagship key left an orphan in the ledger', 'js/codex58.js', '          if (left.length) orph[name] = left; else delete orph[name];\n', '', 'never an orphan in the ledger'],
    ['a flagship key the ledger cannot find', 'js/codex58.js', '    if (v58IsQKey(k)) return v58QById(v58BareKey(k));\n', '', 'found by its key in its group'],
    ['a group climbing to Home', 'js/codex58.js', "  name: function (arg) { var g = v58Group(arg); return g ? g.title : v58W('tab'); },\n  parent: function () { return { view: 'flagships' }; }", "  name: function (arg) { var g = v58Group(arg); return g ? g.title : v58W('tab'); },\n  parent: function () { return { view: 'home' }; }", 'the parents: a house its group'],
    ['the cold address left unread', 'js/codex58.js', "    v32Apply(r, typeof v32CurState === 'function' ? v32CurState() : null);\n    V32.pend = 'replace';\n", '', 'each address answers cold'],
    ['the two tags swapped in index.html', 'index.html', '<script src="js/data-flagships.js?v=1"></script>\n<script src="js/codex58.js?v=1"></script>', '<script src="js/codex58.js?v=1"></script>\n<script src="js/data-flagships.js?v=1"></script>', 'index.html loads js/data-flagships.js then js/codex58.js'],
    ['the worker left at codex-v117', 'sw.js', "const CACHE = 'codex-v118';", "const CACHE = 'codex-v117';", 'sw.js is codex-v118 or later'],
    ['a let in the layer', 'js/codex58.js', 'var V58_SLOT = ', 'let V58_SLOT = ', 'declares with var and function only'],
    ['an unguarded wrapper', 'js/codex58.js', "if (typeof prodProfileView === 'function') {\n  var _v58ProfileView", "if (true) {\n  var _v58ProfileView", 'every wrapper'],
    ['a selector outside .wrap', 'js/codex58.js', "'.wrap .v58-sec{", "'.v58-sec{", 'every selector of the v58-style element'],
    ['a shown word outside V58_WORDS', 'js/codex58.js', "v58Esc(v58W('fiveH'))", "'Five houses to know'", 'every word the layer shows is V58_WORDS'],
    ['a superlative in V58_WORDS', 'js/codex58.js', "tab: 'Producers and flagships',", "tab: 'Producers and their finest flagships',", 'in the strictest voice'],
    ['a gate list naming codex57.js without the new files', 'gates', "'codex57.js', 'data-flagships.js', 'codex58.js'", "'codex57.js'", 'the chain rule'],
    ['the sources left claret on the page\'s own ground', 'js/codex58.js', "'.wrap .v58-sources a{color:var(--gold-hi)}',", "'.wrap .v58-sources a{text-underline-offset:3px}',", 'every colour on its own ground'],
    ['a parchment colour on the page\'s own ground', 'js/codex58.js', "'.wrap .v58-oname{display:block;font-weight:700;color:var(--gold-hi);", "'.wrap .v58-oname{display:block;font-weight:700;color:var(--claret);", 'every colour on its own ground']
  ].concat(PARTIAL ? [] : [
    ['an answer dealt again by hand', 'js/data-flagships.js', '"a":1,"exp":"', '"a":2,"exp":"', 'the counts pinned exact'],
    ['grapes read past their first statement', 'js/codex58.js', "  var first = String(text == null ? '' : text).split(/;|\\.(?:\\s|$)/)[0];", "  var first = String(text == null ? '' : text);", 'In the Codex\'s grapes'],
    ['a denied grape given a door', 'js/codex58.js', "      if (v58Own(V58_DENY, words[i])) return;\n", '', 'In the Codex\'s grapes'],
    ['a crossing\'s parents given doors', 'js/codex58.js', "    if (words.some(function (w) { return v58Own(V58_PARENTS, w); })) return;\n", '', 'In the Codex\'s grapes'],
    ['a grape read short of a longer name', 'js/codex58.js', "      if (hit && words[i + len] === 'of') hit = '';\n", '', 'In the Codex\'s grapes'],
    ['the initials before a house\'s name kept', 'js/codex58.js', ".replace(/^(?:[a-z] )+/, '')", '', 'no wine of the house left off'],
    ['a house\'s longer name taken for the record\'s', 'js/codex58.js', "  return a === b || b.indexOf(a + ' ') === 0;", "  return a === b || b.indexOf(a + ' ') === 0 || a.indexOf(b + ' ') === 0;", 'the house\'s name read whole']
  ]);
  const repoRoot = path.join(JS, '..');
  let held = 0;
  const problems = [];
  const only = process.env.FLAGSHIPS_MUTATION || '';
  const RUN = MUT.filter((m) => !only || only.split('|').some((w) => m[0].indexOf(w) >= 0));
  for (const [name, file, from, to, by] of RUN) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'flagships-mut-'));
    copyTree(JS, path.join(dir, 'js'));
    fs.writeFileSync(path.join(dir, 'index.html'), fs.readFileSync(path.join(repoRoot, 'index.html')));
    fs.writeFileSync(path.join(dir, 'sw.js'), fs.readFileSync(path.join(repoRoot, 'sw.js')));
    const env = Object.assign({}, process.env, { FLAGSHIPS_KEYS: KEYS_FILE });
    let target;
    if (file === 'gates') {
      fs.mkdirSync(path.join(dir, 'gates'));
      fs.readdirSync(GATES).filter((f) => /^(check-|list-harness)[\w-]*\.c?js$/.test(f)).forEach((f) => fs.writeFileSync(path.join(dir, 'gates', f), fs.readFileSync(path.join(GATES, f))));
      target = path.join(dir, 'gates', 'check-cms.js');
      env.FLAGSHIPS_GATES = path.join(dir, 'gates');
    } else target = path.join(dir, file);
    if (fs.lstatSync(target).isSymbolicLink() || fs.realpathSync(target).indexOf(fs.realpathSync(dir) + path.sep) !== 0) { problems.push('the mutation "' + name + '" would write outside its scratch copy (' + target + '): refused'); fs.rmSync(dir, { recursive: true, force: true }); continue; }
    const src = fs.readFileSync(target, 'utf8');
    if (src.indexOf(from) < 0) { problems.push('the mutation "' + name + '" found nothing to change in ' + file); fs.rmSync(dir, { recursive: true, force: true }); continue; }
    fs.writeFileSync(target, src.replace(from, to));
    const r = cp.spawnSync(process.execPath, [__filename, path.join(dir, 'js')].concat(PARTIAL ? ['--partial'] : []), { env, encoding: 'utf8', maxBuffer: 1 << 26 });
    fs.rmSync(dir, { recursive: true, force: true });
    const fails = String(r.stdout || '').split('\n').filter((l) => /^\s+FAIL\s/.test(l));
    const hit = fails.find((l) => l.indexOf(by) >= 0);
    if (r.status === 0) problems.push('the mutation "' + name + '" left this gate green');
    else if (!hit) problems.push('the mutation "' + name + '" was caught, but not by "' + by + '": ' + (fails[0] || String(r.stderr || '').split('\n')[0] || '').trim().slice(0, 200));
    else { held++; console.log('  mutation held: ' + name + ' :: ' + hit.trim().slice(6, 150)); }
  }
  console.log('  ' + held + ' of ' + RUN.length + ' mutations caught, each by its own check' + (RUN.length < MUT.length ? ' (' + RUN.length + ' of the ' + MUT.length + ' run, by FLAGSHIPS_MUTATION)' : ''));
  problems.forEach((p) => console.log('  FAIL  ' + p));
  return problems.length;
}

main().then(() => {
  console.log('');
  if (failed) { console.log('check-flagships: ' + failed + ' of ' + (passed + failed) + ' checks FAILED'); process.exit(1); }
  if (MUTATIONS) {
    console.log('');
    console.log('--- the mutations ---');
    const bad = mutations();
    if (bad) { console.log('check-flagships: all ' + passed + ' checks pass; ' + bad + ' mutation(s) FAILED'); process.exit(1); }
    console.log('check-flagships: all ' + passed + ' checks pass, and every mutation is caught by name');
    process.exit(0);
  }
  console.log('check-flagships: all ' + passed + ' checks pass');
  process.exit(0);
}).catch((e) => { console.error(e && e.stack || e); process.exit(1); });
