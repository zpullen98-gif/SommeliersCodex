/**
 * THE GRAPES TAB AT THE TABLE, HELD TO ITS DESIGN (codex57, 9 November 2026).
 *
 * The owner asked for the Grapes tab to open each grape on what to say at the table, to describe the glass in named
 * fruit rather than the bare word citrus, and to set the Old World and the New World of one grape side by side.
 * codex57 is two pieces: js/data-grapes-table.js (GRAPE_TABLE, built by .scripts/grapes/build-grapes.cjs from one
 * fragment a grape) and the layer js/codex57.js. This gate loads the SHIPPED chain index.html loads three times: in
 * chain.cjs's sandbox (the pages and the root as codex53 draws them), in check-card's loader with the shared house
 * engine and the pack (the house's wines, study, the views, the addresses), and the base in a second chain.cjs
 * sandbox, so what the old pages held can be compared. The base is the same jsDir's chain with data-grapes-table.js
 * and codex57.js left out (the same data, the layers up to codex56; since the records edition of 11 November 2026,
 * which corrected the data under the old pages, in place of codex56 master, 7d14d1c, read from git), so the
 * comparison proves that codex57 changes only what it says it changes. It asserts:
 *
 *   1. the load: data-grapes-table.js then codex57.js straight after codex56.js and before boot.js; the layer ran
 *   2. the data: the roster whole and in the plan's order; every shipped record through schema.cjs; the data equal
 *      to the build of the fragments; every id gt- and eight digits, once, and held by keys.v1.json (frozen or not)
 *   3. every cap, read here again from schema.cjs's CAPS; the sale's two sentences; no bare family word in any shown
 *      string (a whole note, or alone in the prose of the glass)
 *   4. the two worlds: every side by side grape with both sides, its why, blur and call, and its worlds question;
 *      every grape at home with home and abroad; the modes the plan's
 *   5. the names: every alias resolving to its own grape; the names the plan holds unresolved still unresolved;
 *      every name that resolved at the base resolving to the same slug; a name newly resolving naming its grape
 *   6. compare: every neighbour a grape of the roster and never the grape itself, its door on the page real
 *   7. the pages: all 75 at all four levels drawn clean (cleanProblem and the voice), At the table before the chips,
 *      the six v53-gs sections and Previous, Next and All kept, the new sections present in their places, the glass
 *      leading the fruit, Where it is grown gone where the two worlds are written; the two family grapes headed as
 *      families; no stock row under the glass left with only a family word the table names (Albarino, Vermentino and
 *      Godello named); The regions that name it read whole, every bracket closed (the eleven the base cut)
 *   8. the 59 old pages against the base (the chain without codex57): every old section as the base drew it, but
 *      for what the layer says it
 *      changes (the glass, the bare aroma line, the one word flag, Cards at the table, the drill's count, the
 *      profile of a thin grape, a stock row's family word named and the regions that name it read whole, each by
 *      this gate's own reading of the rule); each grape's drill the base's, without its notIn phrases, with the questions its
 *      new names bring and the table's three
 *   9. the root: the 75 once each, a lead on every row (the table's glass lead); At the table, its doors and its
 *      filter; the filter hiding rows by colour
 *  10. On Brennan's list, on the fixture house: every grape the house pours has the section, its rows real wines of
 *      the house split by world as the region's last part says, producer and wine alone; a row opens the wine's card
 *      and Back returns to the grape; Meunier reached from Pinot Meunier on the list
 *  11. study: the decks grapecards, grapecards:{slug} and grapesdue; the card face; on seeded grades a card graded
 *      right due later and one graded wrong due sooner, in the layer's slot, the grape cards' slot untouched, a stock
 *      grape card still marked in its own
 *  12. the drill: the table's three in every grape's drill; the notIn phrases kept out; a gt- key never level
 *      progress, never in codex3's rotation, found by its key
 *  13. the three views: grapeworlds and its call drill played through, every glass keyed to the world its own half
 *      of the blind call names and none from a half naming both; grapecompare; grapepresent marked, and Another
 *      grape walking every grape once before any returns; each lit Grapes, drawn clean, climbing back, and
 *      answering its address cold
 *  14. the shell and the chain rule: the two tags in order, codex-v116 or later listing both; every list in a gate
 *      here that names codex56.js names data-grapes-table.js and codex57.js straight after it
 *  15. the layer's file: no dash, nobody named, no key, var and function only, every wrapper typeof guarded, every
 *      selector under .wrap, every shown word from V57_WORDS (and V57_WORDS in the strictest voice); this gate dash free
 *
 *   node .scripts/check-grapes-table.js [jsDir]               every check above
 *   node .scripts/check-grapes-table.js [jsDir] --mutations   then seeds 31 faults in a scratch copy, one at a time,
 *                                                              and expects each caught by the check that names it
 *
 * A section that throws fails as "section N ran to its end" and the next one runs, so a seeded fault is always named.
 *
 * jsDir defaults to this repo's js/; the site's check-wings may pass the wing's codex/js. Needs the shared engine
 * (OOT_SHARED, else ../worldtable/static/shared) and the pack (OOT_HOUSE_PACK, else the pack beside the engine).
 * The roster, the fragments, the schema, the keys and the gates the chain rule reads are this checkout's
 * (.scripts/grapes/; GRAPES_TABLE_GATES names another folder of gates). The base is built from jsDir itself, never
 * from git: index.html's chain less data-grapes-table.js and codex57.js. To compare with a git base instead, name
 * it: GRAPES_BASE=<ref> reads index.html and js/ at that ref with git from this checkout (7d14d1c is the codex56
 * master the plan measured), and GRAPES_BASE_DIR names an extracted copy. A tree with no codex57.js is SKIPPED.
 * Exits non-zero if any check fails. The last line is the verdict.
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
const JS = path.resolve(ARGS.find((a) => a.charAt(0) !== '-') || path.join(__dirname, '..', 'js'));
const ROOT = path.join(JS, '..');
if (!fs.existsSync(path.join(JS, 'codex57.js'))) {
  console.log('check-grapes-table: no codex57.js in ' + JS + ', SKIPPED');
  process.exit(0);
}
const SHARED = process.env.OOT_SHARED || path.join(__dirname, '..', '..', 'worldtable', 'static', 'shared');
const ENGINE = path.join(SHARED, 'oot-house.js');
const UI_FILE = path.join(SHARED, 'oot-house-ui.js');
const PACK_FILE = process.env.OOT_HOUSE_PACK || path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
for (const f of [ENGINE, UI_FILE, PACK_FILE]) {
  if (!fs.existsSync(f)) { console.error('check-grapes-table: no ' + path.basename(f) + ' at ' + path.dirname(f) + ' (set OOT_SHARED or OOT_HOUSE_PACK)'); process.exit(1); }
}
const CH = require(path.join(__dirname, 'cms', 'chain.cjs'));
const S = require(path.join(__dirname, 'grapes', 'schema.cjs'));
const BG = require(path.join(__dirname, 'grapes', 'build-grapes.cjs'));
const GATES = path.resolve(process.env.GRAPES_TABLE_GATES || __dirname);
/* the base: the chain without the layer (the default), or a git ref or an extracted copy when one is named */
const BASE = process.env.GRAPES_BASE || '';
const BASE_SKIP = ['data-grapes-table.js', 'codex57.js'];
const BASE_NAME = process.env.GRAPES_BASE_DIR ? 'the base at ' + process.env.GRAPES_BASE_DIR : (BASE ? 'the base ' + BASE : 'the base (this chain without codex57)');
const PLAN = S.loadPlan();
const ROSTER = PLAN.grapes.map((g) => g.slug);
const ROW = {}; PLAN.grapes.forEach((g) => { ROW[g.slug] = g; });
const LEVELS = ['intro', 'certified', 'advanced', 'master'];
const NOW = Date.parse('2026-11-09T14:02:00.000Z');

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

/* check-producers-house.js's voiceProblems, the strictest, as check-atlas-course carries it */
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
/* a drawn page in the house voice: clean markup, no dash, never the retired word, no numbered level */
function pageProblem(html) {
  const c = CH.cleanProblem(html) || CH.drawnVoiceProblem(html);
  if (c) return c;
  const v = voiceProblems(shown(html).replace(/[^\x00-↏]/g, ''));
  return v.length ? v.join(', ') : '';
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
    catch (e) { console.error('check-grapes-table: js/' + f + ' failed to load: ' + e.message); process.exit(1); }
  }
  try { await D.G('typeof V27_LAST !== "undefined" ? V27_LAST : null'); } catch (e) { }
  try { await D.G('typeof V27_BOOT_PACK !== "undefined" ? V27_BOOT_PACK : null'); } catch (e) { }
  await tick(30);
  try { await D.G('typeof V27_WRITING !== "undefined" ? V27_WRITING : null'); } catch (e) { }
  await tick(30);
  D.J = (expr) => JSON.parse(D.G('JSON.stringify(' + expr + ')'));
  D.T = (expr) => { try { return D.G(expr); } catch (e) { return null; } };
  return D;
}

/* the base: by default the jsDir's own chain without the layer (no dir, self); GRAPES_BASE_DIR an extracted copy;
   GRAPES_BASE a ref read with git, index.html and js/ as they stood */
function baseTree() {
  if (process.env.GRAPES_BASE_DIR && fs.existsSync(path.join(process.env.GRAPES_BASE_DIR, 'js'))) return { dir: process.env.GRAPES_BASE_DIR, made: false };
  if (!BASE) return { dir: '', self: true };
  const repo = path.join(__dirname, '..');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grapes-base-'));
  const tar = cp.spawnSync('git', ['-C', repo, 'archive', BASE, 'index.html', 'js'], { maxBuffer: 1 << 28 });
  if (tar.status !== 0) { fs.rmSync(dir, { recursive: true, force: true }); return { dir: '', why: String(tar.stderr || '').trim() }; }
  const x = cp.spawnSync('tar', ['-x', '-C', dir], { input: tar.stdout, maxBuffer: 1 << 28 });
  if (x.status !== 0) { fs.rmSync(dir, { recursive: true, force: true }); return { dir: '', why: String(x.stderr || '').trim() }; }
  return { dir, made: true };
}

/* every string of a record with its path, as schema.cjs walks a fragment */
function walk(v, where, fn) {
  if (typeof v === 'string') fn(v, where);
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, where + '[' + i + ']', fn));
  else if (v && typeof v === 'object') Object.keys(v).forEach((k) => walk(v[k], where ? where + '.' + k : k, fn));
}
/* a shipped record as a fragment: the roster's facts and the minted ids taken off */
function asFragment(rec) {
  const r = JSON.parse(JSON.stringify(rec));
  delete r.status; delete r.mode; delete r.court;
  r.cards = (r.cards || []).map((c) => ({ front: c.front, back: c.back }));
  r.questions = (r.questions || []).map((q) => { const o = { q: q.q, opts: q.opts, a: q.a, exp: q.exp }; if (q.tag) o.tag = q.tag; return o; });
  return r;
}
/* the caps of schema.cjs's CAPS, read here on the shipped record */
function capProblems(r) {
  const C = S.CAPS, out = [];
  const w = (s) => (typeof s === 'string' && s.trim() ? S.words(s) : -1);
  const within = (where, s, p) => { const n = w(s); const lo = Array.isArray(p) ? p[0] : 1, hi = Array.isArray(p) ? p[1] : p; if (n < lo || n > hi) out.push(where + ' ' + n + ' words (' + lo + ' to ' + hi + ')'); };
  const count = (where, l, p) => { const n = Array.isArray(l) ? l.length : -1; if (n < p[0] || n > p[1]) out.push(where + ' ' + n + ' (' + p[0] + ' to ' + p[1] + ')'); };
  within('say', r.say, C.say);
  S.LINE_FIELDS.forEach((k) => within('lines.' + k, r.lines && r.lines[k], C.lines[k]));
  S.LINE_FIELDS.forEach((k) => { const n = S.sentences((r.lines || {})[k] || ''); const p = C.lineSentences[k]; if (n < p[0] || n > p[1]) out.push('lines.' + k + ' ' + n + ' sentences'); });
  const g = r.glass || {};
  within('glass.lead', g.lead, C.glass.lead);
  count('glass.notes', g.notes, C.glass.groups);
  (g.notes || []).forEach((x, i) => { count('glass.notes[' + i + ']', x.notes, C.glass.notes); (x.notes || []).forEach((n, j) => within('glass.notes[' + i + '][' + j + ']', n, C.glass.noteWords)); if (S.GLASS_FAMILIES.indexOf(x.family) < 0) out.push('glass.notes[' + i + '].family ' + x.family); });
  count('glass.ladder', g.ladder, C.glass.ladder);
  (g.ladder || []).forEach((x, i) => { within('glass.ladder[' + i + '].where', x.where, C.glass.where); count('glass.ladder[' + i + '].notes', x.notes, C.glass.notes); if (S.CLIMATES.indexOf(x.climate) < 0) out.push('glass.ladder[' + i + '].climate ' + x.climate); });
  within('glass.structure', g.structure, C.glass.structure);
  const W = r.worlds || {};
  if (W.contrast) {
    ['old', 'new'].forEach((k) => { const sd = W.contrast[k] || {}; within('worlds.contrast.' + k + '.where', sd.where, C.contrast.where); within('worlds.contrast.' + k + '.glass', sd.glass, C.contrast.glass); within('worlds.contrast.' + k + '.cellar', sd.cellar, C.contrast.cellar); });
    ['why', 'blur', 'call'].forEach((k) => within('worlds.contrast.' + k, W.contrast[k], C.contrast[k]));
  }
  if (W.home) { within('worlds.home.home', W.home.home, C.home.home); within('worlds.home.abroad', W.home.abroad, C.home.abroad); }
  S.SERVICE_FIELDS.forEach((k) => within('service.' + k, (r.service || {})[k], C.service));
  count('food.with', (r.food || {}).with, C.food.with);
  ((r.food || {}).with || []).forEach((x, i) => { within('food.with[' + i + '].dish', x.dish, C.food.dish); within('food.with[' + i + '].why', x.why, C.food.why); });
  count('labels', r.labels, C.labels.n);
  (r.labels || []).forEach((x, i) => { within('labels[' + i + '].term', x.term, C.labels.term); within('labels[' + i + '].means', x.means, C.labels.means); });
  count('guest', r.guest, C.guest.n);
  (r.guest || []).forEach((x, i) => { within('guest[' + i + '].q', x.q, C.guest.q); within('guest[' + i + '].a', x.a, C.guest.a); });
  count('compare', r.compare, C.compare.n);
  (r.compare || []).forEach((x, i) => within('compare[' + i + '].tell', x.tell, C.compare.tell));
  if (r.profile) S.PROFILE_FIELDS.filter((k) => k !== 'c').forEach((k) => within('profile.' + k, r.profile[k], C.profile));
  if (r.targets) count('targets', r.targets, C.targets);
  count('cards', r.cards, [C.cards.n, C.cards.n]);
  (r.cards || []).forEach((x, i) => { within('cards[' + i + '].front', x.front, C.cards.front); within('cards[' + i + '].back', x.back, C.cards.back); });
  count('questions', r.questions, [C.questions.n, C.questions.n]);
  (r.questions || []).forEach((x, i) => { within('questions[' + i + '].q', x.q, C.questions.stem); within('questions[' + i + '].exp', x.exp, C.questions.exp); if (!Array.isArray(x.opts) || x.opts.length !== 4) out.push('questions[' + i + '] options ' + (x.opts || []).length); (x.opts || []).forEach((o, j) => within('questions[' + i + '].opts[' + j + ']', o, C.questions.option)); if (!Number.isInteger(x.a) || x.a < 0 || x.a > 3) out.push('questions[' + i + '].a'); });
  count('sources', r.sources, C.sources.n);
  if (S.readingWords(asFragment(r)) > C.entry) out.push('entry ' + S.readingWords(asFragment(r)) + ' reading words');
  return out;
}
/* a family word standing alone: as a whole note, or between commas in the prose of the glass */
function genericProblems(r) {
  const out = [];
  const g = r.glass || {};
  (g.notes || []).forEach((x, i) => (x.notes || []).forEach((n) => { const h = S.genericNote(n); if (h) out.push('glass.notes[' + i + '] "' + n + '"'); }));
  (g.ladder || []).forEach((x, i) => (x.notes || []).forEach((n) => { const h = S.genericNote(n); if (h) out.push('glass.ladder[' + i + '] "' + n + '"'); }));
  walk(asFragment(r), '', (s, where) => { if (S.tastePath(where)) S.genericInProse(s).forEach((h) => out.push(where + ' "' + h + '"')); });
  return out;
}

const SEC = '<details class="v28-q v39-sec" id="';
function sections(h) {
  const o = {};
  let at = 0;
  for (;;) {
    const a = h.indexOf(SEC, at);
    if (a < 0) break;
    const id = h.slice(a + SEC.length, h.indexOf('"', a + SEC.length));
    const b = h.indexOf('</details>', a) + 10;
    o[id] = { html: h.slice(a, b), at: a };
    at = b;
  }
  return o;
}
const NAV = '<nav class="v39-steps v53-steps" aria-label="Sections">';
const SIX = ['v53-gs-profile', 'v53-gs-fruit', 'v53-gs-tell', 'v53-gs-regions', 'v53-gs-cards', 'v53-gs-watch'];
/* the gate's own reading of two things the layer redraws on an old page, written here apart from the layer:
   a stock card row item that is only the word for a family of fruit or flowers, named from the table's notes of
   that family (the names the row holds left out); and the starred places of a Regionale region line, cut at the
   commas outside a bracket, a star inside a bracket keeping the starred places of that bracket */
const ROW_FAMILY = { citrus: 'citrus', 'citrus fruit': 'citrus', 'citrus fruits': 'citrus', 'orchard fruit': 'orchard fruit', 'stone fruit': 'stone fruit', 'stone fruits': 'stone fruit',
  'tropical fruit': 'tropical fruit', 'tropical fruits': 'tropical fruit', 'red fruit': 'red fruit', 'red fruits': 'red fruit', 'black fruit': 'black fruit', 'black fruits': 'black fruit',
  'dark fruit': 'black fruit', floral: 'floral', flowers: 'floral', 'white flowers': 'floral', blossom: 'floral' };
function nameRowGate(text, rec) {
  const fam = {};
  ((rec && rec.glass && rec.glass.notes) || []).forEach((n) => { const k = String(n.family || '').trim().toLowerCase(); if (k && !(k in fam)) fam[k] = n.notes.map((x) => String(x).trim()).filter(Boolean); });
  const parts = String(text).split(', ');
  const held = parts.map((x) => x.trim().toLowerCase());
  return parts.map((x, i) => {
    const f = ROW_FAMILY[x.trim().toLowerCase()];
    const named = f && fam[f] ? fam[f].filter((n) => held.indexOf(n.toLowerCase()) < 0) : [];
    if (!named.length) return x;
    const out = esc(named.join(', '));
    return i === 0 && /^[A-Z]/.test(x.trim()) ? out.charAt(0).toUpperCase() + out.slice(1) : out;
  }).join(', ');
}
function starPlacesGate(line) {
  const STAR = String.fromCharCode(0x2605);
  const parts = [];
  let depth = 0, cur = '';
  for (const ch of String(line || '')) {
    if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    cur += ch;
  }
  parts.push(cur);
  return parts.filter((x) => x.includes(STAR)).map((x) => x.replace(/\(([^()]*)\)/g, (m, inner) => (inner.includes(STAR) ? '(' + inner.split(',').filter((y) => y.includes(STAR)).join(',') + ')' : m)).split(STAR).join('').replace(/ {2,}/g, ' ').replace(/\s+\)/g, ')').replace(/\s+,/g, ',').trim()).filter(Boolean);
}
const balanced = (x) => { let d = 0; for (const ch of x) { if (ch === '(') d++; if (ch === ')') d--; if (d < 0) return false; } return d === 0; };

async function main() {
  const TEXT = fs.readFileSync(path.join(JS, 'data-grapes-table.js'), 'utf8');
  /* what more than one section reads; a section that throws fails by name and the next one runs */
  let contrast = [], BT = { dir: '' }, M = null;
  const key = (G, n) => { try { return G('v53GrapeKey(' + JSON.stringify(n) + ')') || ''; } catch (e) { return 'THREW'; } };
  const D = await bootDevice();
  const N = CH.loadChain(JS, { seed: { codexLevel: 'certified' } });
  N.tryG('applyLevel("certified", true)');
  console.log('check-grapes-table: ' + FILES.length + ' scripts from ' + path.join(ROOT, 'index.html') + ', codex57 at ' + (FILES.indexOf('codex57.js') + 1));

  /* ================================================================ */
  section('1. the load');
  const i56 = FILES.indexOf('codex56.js');
  check('the chain index.html loads holds data-grapes-table.js then codex57.js straight after codex56.js, then boot.js', i56 > 0 && JSON.stringify(FILES.slice(i56, i56 + 4)) === JSON.stringify(['codex56.js', 'data-grapes-table.js', 'codex57.js', 'boot.js']), FILES.slice(i56, i56 + 4).join(' '));
  check('codex57 ran: V57_WORDS, v57W, the three views registered and the join decorated once', D.G('typeof V57_WORDS === "object" && typeof v57W === "function" && ["grapeworlds", "grapecompare", "grapepresent"].every(function (k) { return !!V57_VIEWS[k] && typeof V25_VIEWS[k] === "function"; }) && v53GrapeJoin().v57 === 1') === true);
  const SRC = fs.readFileSync(path.join(JS, 'codex57.js'), 'utf8');
  check('the style element is written by the layer, id v57-style', SRC.indexOf("css.id = 'v57-style'") > 0);

  /* ================================================================ */
  section('2. the data');
  const TABLE = D.J('GRAPE_TABLE');
  const META = D.J('GRAPE_TABLE_META');
  const ALIASES = D.J('GRAPE_TABLE_ALIASES');
  const slugs = Object.keys(TABLE);
  check('the roster whole and in the plan\'s order: GRAPE_TABLE holds the ' + ROSTER.length + ' of plan.json, GRAPE_TABLE_META ' + META.built + ' of ' + META.roster + ', not partial, prefix gt-', slugs.join() === ROSTER.join() && META.roster === ROSTER.length && META.built === ROSTER.length && META.partial === false && META.prefix === 'gt-', slugs.length + ' ' + JSON.stringify(META));
  const rowBad = slugs.filter((s) => { const r = TABLE[s], p = ROW[s]; return !p || r.slug !== s || r.name !== p.name || r.colour !== p.colour || r.kind !== p.kind || r.status !== p.status || r.mode !== p.mode || JSON.stringify(r.aliases) !== JSON.stringify(p.aliases) || !!r.court !== !!p.court; });
  check('every record carries its roster row: name, colour, kind, status, mode, aliases and court as plan.json writes them', rowBad.length === 0, rowBad.join(' '));
  const facts = S.facts(JS);
  const schemaBad = [];
  slugs.forEach((s) => S.validate(asFragment(TABLE[s]), PLAN, { facts }).forEach((p) => schemaBad.push(s + ': ' + p)));
  check('every shipped record through schema.cjs (' + slugs.length + ' records, the ids and the roster\'s facts taken off)', schemaBad.length === 0, few(schemaBad, 4));
  let built = null;
  try { built = BG.build({ jsDir: JS, out: path.join(JS, 'data-grapes-table.js'), fragments: path.join(S.DIR, 'fragments'), partial: false }); } catch (e) { built = { problems: [e.message], text: '' }; }
  check('the data is the build: js/data-grapes-table.js equals the whole build of the 75 fragments, byte for byte', built.problems.length === 0 && built.text === TEXT, built.problems.length ? few(built.problems, 3) : 'the file differs from the build (' + TEXT.length + ' against ' + built.text.length + ' bytes)');
  const keysFile = path.join(S.DIR, 'keys.v1.json');
  const KEYS = BG.readKeys(keysFile);
  const idsBad = [];
  const seen = {};
  slugs.forEach((s) => {
    const r = TABLE[s];
    const k = KEYS.keys[s] || { cards: [], questions: [] };
    ['cards', 'questions'].forEach((kind) => {
      const got = (r[kind] || []).map((x) => x.id);
      got.forEach((id) => { if (!S.ID_RE.test(id)) idsBad.push(s + ' ' + id + ' not gt- and eight digits'); if (seen[id]) idsBad.push(id + ' twice'); seen[id] = 1; });
      if (KEYS.frozen ? !k[kind].every((id) => got.indexOf(id) >= 0) : JSON.stringify(got) !== JSON.stringify(k[kind])) idsBad.push(s + ' ' + kind + ': ' + got.join(',') + ' against ' + k[kind].join(','));
    });
  });
  check('ids frozen against keys.v1.json (' + (KEYS.frozen ? 'frozen: every kept id still minted' : 'not yet frozen: the file holds exactly the ids the data ships') + '), each gt- and eight digits, once among ' + Object.keys(seen).length, idsBad.length === 0 && Object.keys(seen).length === 450, few(idsBad, 4));
  const pre = BG.prefixProblems(JS, path.join(JS, 'data-grapes-table.js'));
  check('gt- is the table\'s alone: no other file under js/ mints or names it', pre.length === 0, few(pre, 3));

  /* ================================================================ */
  section('3. the caps, the sale and the bare family word');
  try {
    const capBad = [];
    slugs.forEach((s) => capProblems(TABLE[s]).forEach((p) => capBad.push(s + ' ' + p)));
    check('every cap of schema.cjs, read again on the shipped records (say, the four lines, the glass, the worlds, service, food, labels, guests, compare, profile, targets, three cards, three questions, sources, the reading words)', capBad.length === 0, few(capBad, 5));
    const saleBad = slugs.filter((s) => { const x = TABLE[s].lines.sale; return S.sentences(x) !== 2 || S.words(x) < 15 || S.words(x) > 45 || !/[.!?]$/.test(x); });
    check('the sale of every grape is exactly two sentences, 15 to 45 words', saleBad.length === 0, saleBad.join(' '));
    const genBad = [];
    slugs.forEach((s) => genericProblems(TABLE[s]).forEach((p) => genBad.push(s + ' ' + p)));
    check('no bare family word in any shown string: never a whole note (citrus, red fruit, stone fruit, floral, spice, mineral, oak), never alone in the prose of the glass', genBad.length === 0, few(genBad, 5));

  } catch (e) { check('section 3 ran to its end', false, e && e.stack); }
  /* ================================================================ */
  section('4. the two worlds');
  try {
    contrast = slugs.filter((s) => ROW[s].mode === 'contrast');
    const worldsBad = [];
    slugs.forEach((s) => {
      const r = TABLE[s], W = r.worlds || {};
      const tagged = (r.questions || []).filter((q) => q.tag === 'worlds').length;
      if (ROW[s].mode === 'contrast') {
        const C = W.contrast || {};
        const sideOk = (x) => !!x && ['where', 'glass', 'cellar'].every((k) => typeof x[k] === 'string' && x[k].trim());
        if (!sideOk(C.old) || !sideOk(C.new)) worldsBad.push(s + ': a side missing');
        if (!['why', 'blur', 'call'].every((k) => typeof C[k] === 'string' && C[k].trim())) worldsBad.push(s + ': why, blur or call missing');
        if (W.home) worldsBad.push(s + ': home as well');
        if (tagged !== 1) worldsBad.push(s + ': ' + tagged + ' worlds questions');
      } else {
        if (!W.home || !String(W.home.home || '').trim() || !String(W.home.abroad || '').trim()) worldsBad.push(s + ': home or abroad missing');
        if (W.contrast) worldsBad.push(s + ': a side by side as well');
        if (tagged) worldsBad.push(s + ': a worlds question at home');
      }
    });
    check('every side by side grape (' + contrast.length + ') with both sides (where, the glass, the cellar), why, blur and the blind call, and its one worlds question; every grape at home (' + (slugs.length - contrast.length) + ') with home and abroad and neither', worldsBad.length === 0 && contrast.length === 24, few(worldsBad, 5));
    const both = D.J('(TASTE || []).filter(function (t) { return t.world === "both"; }).map(function (t) { var r = v53GrapeFind(v53GrapeKey(t.g)); return r ? r.slug : t.g; })');
    check('every grape the Codex flags both (' + both.length + ') takes the side by side', both.length > 0 && both.every((s) => ROW[s] && ROW[s].mode === 'contrast'), both.filter((s) => !ROW[s] || ROW[s].mode !== 'contrast').join(' '));

  } catch (e) { check('section 4 ran to its end', false, e && e.stack); }
  /* ================================================================ */
  section('5. the names');
  try {
    const aliasBad = [];
    slugs.forEach((s) => {
      S.nameParts(TABLE[s].name).concat(TABLE[s].aliases).forEach((n) => { const k = key(D.G, n); if (k !== s) aliasBad.push(n + ' to ' + (k || 'nothing') + ', not ' + s); });
    });
    Object.keys(ALIASES).forEach((k) => { const s = ALIASES[k]; if (!TABLE[s] || TABLE[s].aliases.map(fold).indexOf(k) < 0) aliasBad.push('GRAPE_TABLE_ALIASES ' + k + ' to ' + s + ', not its record\'s'); });
    check('every name and alias of the table (' + slugs.reduce((n, s) => n + TABLE[s].aliases.length, 0) + ' aliases) resolves to its own grape and to no other; GRAPE_TABLE_ALIASES maps each to its own', aliasBad.length === 0 && Object.keys(ALIASES).length === 22, few(aliasBad, 5));
    const stay = PLAN.unresolved.filter((n) => key(D.G, n) !== '');
    check('the names that must stay unresolved still resolve to nothing (' + PLAN.unresolved.join(', ') + ')', stay.length === 0 && PLAN.unresolved.length >= 10, stay.map((n) => n + ' to ' + key(D.G, n)).join(' | '));
    BT = baseTree();
    M = null;
    if (BT.self) {
      try {
        M = CH.loadChain(JS, { seed: { codexLevel: 'certified' }, skip: BASE_SKIP }); M.tryG('applyLevel("certified", true)');
        const lost = FILES.filter((f) => M.files.indexOf(f) < 0);
        check(BASE_NAME + ' loads in a sandbox of its own, ' + M.files.length + ' scripts: the chain index.html loads less ' + BASE_SKIP.join(' and ') + ', and no layer of codex57 in it', lost.join(' ') === BASE_SKIP.join(' ') && M.G('typeof V57_WORDS === "undefined" && typeof GRAPE_TABLE === "undefined"'), lost.join(' '));
      } catch (e) { check(BASE_NAME + ' loads in a sandbox of its own', false, e.message); M = null; }
    } else if (!BT.dir) note('the base ' + BASE + ' could not be read from git (' + (BT.why || 'no checkout') + '): the comparisons with it are skipped');
    else {
      try { M = CH.loadChain(path.join(BT.dir, 'js'), { seed: { codexLevel: 'certified' } }); M.tryG('applyLevel("certified", true)'); }
      catch (e) { check(BASE_NAME + ' loads in a sandbox of its own', false, e.message); M = null; }
    }
    if (M) {
      const names = new Set();
      (M.J('Object.keys(v53GrapeJoin().byKey)') || []).forEach((n) => names.add(n));
      (M.J('v53GrapeJoin().list.map(function (r) { return r.name; })') || []).forEach((n) => names.add(n));
      (M.J('Object.keys((REGIONS.join && REGIONS.join.grapes) || {})') || []).forEach((n) => names.add(n));
      (M.J('[].concat(typeof INTRO_GRAPES !== "undefined" ? INTRO_GRAPES : [], typeof TASTE !== "undefined" ? TASTE : [], typeof GRAPES !== "undefined" ? GRAPES : [], typeof GRAPES_PLUS !== "undefined" ? GRAPES_PLUS : []).map(function (g) { return g && (g.g || g.name); }).filter(Boolean)') || []).forEach((n) => names.add(n));
      (M.J('Object.keys(typeof GRID_ALIASES !== "undefined" ? GRID_ALIASES : {})') || []).forEach((n) => names.add(n));
      (D.J('[].concat.apply([], v28Wines(v53House()).map(function (w) { return v28Grapes(w); }))') || []).forEach((n) => names.add(n));
      for (const f of fs.readdirSync(path.join(JS, 'regions'))) {
        if (!/\.json$/.test(f)) continue;
        const recs = JSON.parse(fs.readFileSync(path.join(JS, 'regions', f), 'utf8')).records || {};
        Object.keys(recs).forEach((k) => (recs[k].grapes || []).forEach((g) => { if (g && typeof g.name === 'string') names.add(g.name); }));
      }
      const moved = [], fresh = [], freshBad = [];
      names.forEach((n) => {
        const was = key(M.G, n), now = key(D.G, n);
        if (was && was !== now) moved.push(n + ': ' + was + ' then ' + (now || 'nothing'));
        if (!was && now) {
          fresh.push(n + ' to ' + now);
          const terms = S.nameParts(TABLE[now] ? TABLE[now].name : now).concat(TABLE[now] ? TABLE[now].aliases : []).map(fold);
          if (!terms.some((t) => (' ' + fold(n) + ' ').indexOf(' ' + t + ' ') >= 0)) freshBad.push(n + ' to ' + now);
        }
      });
      check('every name that resolved at the base (' + [...names].filter((n) => key(M.G, n)).length + ' of ' + names.size + ' names: the join\'s keys, the regions\' join, the readings, the grape books, the grid\'s aliases, the house\'s grapes) resolves to the same slug', moved.length === 0, few(moved, 5));
      check('a name that resolves now and did not (' + fresh.length + ') names its grape or one of its aliases', freshBad.length === 0 && fresh.length > 0, few(freshBad, 5));
    }

  } catch (e) { check('section 5 ran to its end', false, e && e.stack); }
  /* ================================================================ */
  section('6. compare');
  try {
    const cmpBad = [];
    slugs.forEach((s) => (TABLE[s].compare || []).forEach((c) => {
      if (c.slug === s) cmpBad.push(s + ' compares with itself');
      else if (!ROW[c.slug]) cmpBad.push(s + ': ' + c.slug + ' is no grape of the roster');
      else if (D.G('(v53GrapeFind(' + JSON.stringify(c.slug) + ') || {}).slug') !== c.slug) cmpBad.push(s + ': ' + c.slug + ' finds no page');
    }));
    check('every Compare with slug (' + slugs.reduce((n, s) => n + TABLE[s].compare.length, 0) + ') a grape of the roster with a page, never the grape itself', cmpBad.length === 0, few(cmpBad, 5));

  } catch (e) { check('section 6 ran to its end', false, e && e.stack); }
  /* ================================================================ */
  section('7. the pages');
  try {
    const pageAt = {};
    for (const lv of LEVELS) {
      N.tryG('applyLevel(' + JSON.stringify(lv) + ', true)');
      const pages = N.J('v53GrapeOrder().all.map(function (r) { var h = ""; try { h = v53GrapeHtml(r); } catch (e) { h = "THREW " + e.message; } return { slug: r.slug, h: h }; })') || [];
      const bad = [], order = [], kept = [], fresh = [];
      pages.forEach((p) => {
        const prob = pageProblem(p.h);
        if (prob) bad.push(p.slug + ': ' + prob);
        const t = TABLE[p.slug];
        const sec = sections(p.h);
        const blockAt = p.h.indexOf('<section class="v57 v57-table" aria-labelledby="v57-table-h">');
        const navAt = p.h.indexOf(NAV);
        if (!(blockAt > 0 && navAt > blockAt && p.h.indexOf('v53-say') < 0 && p.h.indexOf(esc(t.lines.s45)) > blockAt && p.h.indexOf(esc(t.lines.s45)) < navAt)) order.push(p.slug);
        if (!SIX.every((id) => sec[id]) || p.h.indexOf('id="v53-g-all"') < 0) kept.push(p.slug);
        const wantNew = ['v57-gs-worlds', 'v57-gs-service', 'v57-gs-guest', 'v57-gs-label', 'v57-gs-compare', 'v57-gs-sources'];
        const tailAnchor = sec['v53-gs-grid'] ? 'v53-gs-grid' : 'v53-gs-cards';
        const navEnd = p.h.indexOf('</nav>', navAt);
        const chips = p.h.slice(navAt, navEnd);
        const fruit = sec['v53-gs-fruit'] ? sec['v53-gs-fruit'].html : '';
        const worlds = sec['v57-gs-worlds'] ? sec['v57-gs-worlds'].html : '';
        const why = [];
        if (!wantNew.every((id) => sec[id] && chips.indexOf('data-sec="' + id + '"') > 0)) why.push('a section or its chip');
        else {
          const pos = (id) => (sec[id] ? sec[id].at : -1);
          if (!(pos('v53-gs-regions') > pos('v57-gs-worlds'))) why.push('worlds not before the regions');
          if (!['v57-gs-service', 'v57-gs-guest', 'v57-gs-label', 'v57-gs-compare'].every((id) => pos('v53-gs-regions') >= 0 && pos(id) > pos('v53-gs-regions') && pos(id) < pos(tailAnchor))) why.push('service to compare out of place');
          if (!(pos('v53-gs-watch') >= 0 && pos('v57-gs-sources') > pos('v53-gs-watch'))) why.push('sources not at the foot');
        }
        if (fruit.indexOf('" open><summary>') < 0 || fruit.indexOf('<div class="v39-body"><div class="v57-glass"><p class="v57-glead">' + esc(t.glass.lead) + '</p>') < 0 || /<dt>(?:In brief|Aromas)<\/dt>/.test(fruit)) why.push('the glass not leading the fruit');
        const notes = [...fruit.matchAll(/<dl class="v57-notes">([\s\S]*?)<\/dl>/g)].map((m) => m[1]).join('');
        [...notes.matchAll(/<dd>([^<]*)<\/dd>/g)].forEach((m) => unesc(m[1]).split(', ').forEach((n) => { if (S.genericNote(n)) why.push('a bare note on the page: ' + n); }));
        if (t.mode === 'contrast') {
          if (worlds.indexOf('<div class="v57-side v57-old">') < 0 || worlds.indexOf('<div class="v57-side v57-new">') < 0 || (worlds.match(/<dt>(?:Where|In the glass|In the cellar)<\/dt>/g) || []).length !== 6 || !/<dt>Why they differ<\/dt>[\s\S]*<dt>Where the line blurs<\/dt>[\s\S]*<dt>The blind call<\/dt>/.test(worlds)) why.push('the two sides');
        } else if (!/<h4 class="v57-side-h">At home<\/h4>[\s\S]*<h4 class="v57-side-h">Abroad<\/h4>/.test(worlds)) why.push('at home and abroad');
        if (sec['v53-gs-profile'] && sec['v53-gs-profile'].html.indexOf('<dt>Where it is grown</dt>') >= 0) why.push('Where it is grown kept beside the two worlds');
        if (why.length) fresh.push(p.slug + ': ' + why.join(', '));
        if (lv === 'certified') pageAt[p.slug] = p.h;
      });
      const name = N.tryG('v32Lv().name') || lv;
      check('all ' + pages.length + ' pages draw clean at ' + name + ' (cleanProblem, the house voice, no dash, never the retired word, no numbered level)', pages.length === 75 && bad.length === 0, few(bad, 4));
      check('At the table first at ' + name + ': the block where the lone Say it line stood, before the chips, the forty-five second line in it', order.length === 0, order.join(' '));
      check('the six v53-gs sections, Previous, Next and All kept at ' + name, kept.length === 0, kept.join(' '));
      check('the new sections in their places at ' + name + ': the two worlds (or at home and abroad) before the regions, service, guests, the label and compare before the Court\'s grid, sources at the foot, each with its chip; the glass leading the fruit; Where it is grown gone', fresh.length === 0, few(fresh, 4));
    }
    N.tryG('applyLevel("certified", true)');
    /* the head of a family grape, the stock rows under the glass, the regions that name it */
    const headBad = ROSTER.filter((s) => { const m = /<div class="sub">([^<,]*)/.exec(pageAt[s] || ''); const want = (TABLE[s].kind === 'family' ? 'A family of ' + TABLE[s].colour + ' grapes' : 'A ' + TABLE[s].colour + ' grape'); return !m || unesc(m[1]).trim() !== want; });
    const families = ROSTER.filter((s) => TABLE[s].kind === 'family');
    check('a family of vines is headed so (' + families.join(', ') + ': A family of white grapes, A family of red grapes); every other grape A white grape or A red grape', families.length === 2 && headBad.length === 0, headBad.join(' '));
    const rowBad = [], rowNamed = [];
    ROSTER.forEach((s) => {
      const fruit = (sections(pageAt[s] || '')['v53-gs-fruit'] || {}).html || '';
      const rec = N.J('(function (r) { return r && r.g ? { fruit: String(r.g.fruit || ""), other: String(r.g.other || "") } : null; })(v53GrapeFind(' + JSON.stringify(s) + '))');
      [...fruit.matchAll(/<dt>(Fruit|Non fruit)<\/dt><dd>([^<]*)<\/dd>/g)].forEach((m) => {
        const text = unesc(m[2]);
        text.split(', ').forEach((x) => { const f = ROW_FAMILY[x.trim().toLowerCase()]; if (f && (TABLE[s].glass.notes || []).some((n) => n.family === f)) rowBad.push(s + ' ' + m[1] + ': ' + x); });
        const raw = rec ? (m[1] === 'Fruit' ? rec.fruit : rec.other).trim() : text;
        if (text !== raw && rowNamed.indexOf(s) < 0) rowNamed.push(s);
      });
    });
    check('under the glass, no stock row item is only the word for a family the table names (Citrus, white flowers): ' + rowNamed.length + ' rows named from the table (' + rowNamed.join(', ') + '), every other row as the stock card has it', rowBad.length === 0 && rowNamed.join(' ') === 'albarino vermentino godello', few(rowBad, 5) + ' named: ' + rowNamed.join(' '));
    const regBad = [], regWhole = [];
    ROSTER.forEach((s) => {
      const m = /<dt>The regions that name it<\/dt><dd>([^<]*)<\/dd>/.exec((sections(pageAt[s] || '')['v53-gs-regions'] || {}).html || '');
      if (!m) return;
      const shown = unesc(m[1]);
      const reg = N.G('String((v53GrapeFind(' + JSON.stringify(s) + ').intro || {}).reg || "")');
      const cut = reg.split(',').filter((x) => x.indexOf(String.fromCharCode(0x2605)) >= 0).map((x) => x.split(String.fromCharCode(0x2605)).join('').replace(/ {2,}/g, ' ').replace(/\s+\)/g, ')').trim()).join('; ');
      if (shown.split('; ').some((x) => !balanced(x)) || shown !== starPlacesGate(reg).join('; ')) regBad.push(s + ': ' + shown);
      if (shown !== cut) regWhole.push(s);
    });
    check('The regions that name it reads each starred place whole, every bracket closed: the ' + regWhole.length + ' the base cut inside a bracket (' + regWhole.join(', ') + ') drawn whole, the rest as the base drew them', regBad.length === 0 && regWhole.length === 11, few(regBad, 5));
    check('the grape view stays codex53\'s (the layer registers no grape view of its own)', N.G('String(V25_VIEWS.grape).indexOf("v53") >= 0') === true);

  } catch (e) { check('section 7 ran to its end', false, e && e.stack); }
  /* ================================================================ */
  section('8. the 59 old pages against the base');
  try {
    if (M) {
      const diffs = [];
      const drillBad = [];
      let compared = 0;
      for (const lv of LEVELS) {
        M.tryG('applyLevel(' + JSON.stringify(lv) + ', true)');
        N.tryG('applyLevel(' + JSON.stringify(lv) + ', true)');
        const old = M.J('v53GrapeJoin().list.map(function (r) { return r.slug; })') || [];
        for (const s of old) {
          const m = M.G('v53GrapeHtml(v53GrapeFind(' + JSON.stringify(s) + '))');
          const n = N.G('v53GrapeHtml(v53GrapeFind(' + JSON.stringify(s) + '))');
          const ms = sections(m), ns = sections(n);
          const t = TABLE[s];
          const thin = t && t.status === 'thin';
          compared++;
          for (const id of Object.keys(ms)) {
            let a = ms[id].html.replace(/" open>/, '">'), b = ns[id] ? ns[id].html.replace(/" open>/, '">') : '';
            if (!b) { diffs.push(lv + ' ' + s + ' ' + id + ': gone'); continue; }
            /* what the layer says it changes */
            if (ns['v57-gs-worlds'] && id === 'v53-gs-profile') a = a.replace(/<dt>Where it is grown<\/dt><dd>[^<]*<\/dd>/, '');
            if (id === 'v53-gs-fruit') { a = a.replace(/<dt>(?:In brief|Aromas)<\/dt><dd>[^<]*<\/dd>/, '').replace('<dl class="v39-pairs"></dl>', ''); b = b.replace(/<div class="v57-glass">[\s\S]*?<\/div>/, '').replace('<h4>As the grape card reads it</h4>', ''); a = a.replace(/(<dt>(?:Fruit|Non fruit)<\/dt><dd>)([^<]*)(<\/dd>)/g, (x, p, text, q) => p + nameRowGate(text, t) + q); }
            if (id === 'v53-gs-regions') { const reg = M.G('String((v53GrapeFind(' + JSON.stringify(s) + ').intro || {}).reg || "")'); const want = starPlacesGate(reg); if (want.length) a = a.replace(/(<dt>The regions that name it<\/dt><dd>)[^<]*(<\/dd>)/, (x, p, q) => p + esc(want.join('; ')) + q); }
            if (id === 'v53-gs-cards') {
              b = b.replace(/<h4 id="v57-gcards-h">[\s\S]*?<ul class="v39-lines v39-list v53-doors v57-carddoors">[\s\S]*?<\/ul>/, '').replace(/ The \d+ written for the table are among them\./, '');
              a = a.replace(/Drill this grape, \d+ questions?/, 'DRILL'); b = b.replace(/Drill this grape, \d+ questions?/, 'DRILL');
              if (a.indexOf('data-v53="gdrill"') < 0) b = b.replace(/<li><button type="button" class="btn small ghost" data-v53="gdrill"[\s\S]*?<\/li>/, '');
            }
            if (thin) {
              /* a thin grape gains the table's profile: what the base drew is still on its page, word for word */
              const atoms = (h) => [...h.matchAll(/<(dd|li|p|h4|summary)\b[^>]*>([^<]+)</g)].map((x) => x[2].trim()).filter(Boolean);
              const have = new Set(atoms(b));
              const dropped = id === 'v53-gs-fruit' ? [] : [];
              atoms(a).filter((x) => !have.has(x) && dropped.indexOf(x) < 0 && !/^Drill this grape/.test(x) && x !== 'DRILL').forEach((x) => diffs.push(lv + ' ' + s + ' ' + id + ': lost "' + x.slice(0, 60) + '"'));
            } else if (a !== b) {
              let i = 0; while (a[i] === b[i]) i++;
              diffs.push(lv + ' ' + s + ' ' + id + ': ' + a.slice(Math.max(0, i - 40), i + 60) + ' || ' + b.slice(Math.max(0, i - 40), i + 60));
            }
          }
          const hm = m.slice(0, m.indexOf(SEC)).replace(/<p class="v39-lead v53-say">[\s\S]*?<\/p>/, '').replace('v53-grape" data-grape', 'v53-grape v57-page" data-grape');
          const hn = n.slice(0, n.indexOf(SEC)).replace(/<section class="v57 v57-table"[\s\S]*?<\/section>/, '').replace(/<button type="button" class="v28-chip" data-v39="chip" data-sec="v57-gs-[a-z]+">[^<]*<\/button>/g, '');
          if (hm !== hn) diffs.push(lv + ' ' + s + ' the head');
          const steps = (h) => h.slice(h.lastIndexOf('</details>') + 10).replace(/<button type="button" class="btn ghost" data-v53="gstep"[^>]*>[^<]*<\/button>/g, '');
          if (steps(m) !== steps(n)) diffs.push(lv + ' ' + s + ' the foot');
          /* the drill: the base's pool, without what the notIn phrases shut out, with the questions a new name brings and the table's three */
          const pm = M.J('v53GrapeQuestions(' + JSON.stringify(s) + ', ' + JSON.stringify(lv) + ').map(function (q) { var a = Array.isArray(q.opts) && typeof q.a === "number" ? q.opts[q.a] : (q.ans || ""); return { k: q.id || q.q, hay: [q.q, a, q.exp].join(" ") }; })') || [];
          const pn = N.J('v53GrapeQuestions(' + JSON.stringify(s) + ', ' + JSON.stringify(lv) + ').map(function (q) { var a = Array.isArray(q.opts) && typeof q.a === "number" ? q.opts[q.a] : (q.ans || ""); return { k: q.id || q.q, hay: [q.q, a, q.exp].join(" ") }; })') || [];
          const tq = (t ? t.questions : []).map((q) => q.id);
          const nk = pn.map((x) => x.k), mk = pm.map((x) => x.k);
          const notIn = (t ? t.notIn : []).map(fold);
          const terms = t ? S.nameParts(t.name).concat(t.aliases).map(fold) : [];
          pm.forEach((x) => { if (nk.indexOf(x.k) < 0 && !notIn.some((p) => (' ' + fold(x.hay) + ' ').indexOf(' ' + p + ' ') >= 0)) drillBad.push(lv + ' ' + s + ' lost ' + x.k); });
          pn.forEach((x) => { if (mk.indexOf(x.k) >= 0 || tq.indexOf(x.k) >= 0) return; if (!terms.some((p) => fold(x.hay).indexOf(p) >= 0)) drillBad.push(lv + ' ' + s + ' gained ' + x.k); });
          if (!tq.every((id) => nk.indexOf(id) >= 0)) drillBad.push(lv + ' ' + s + ' without the table\'s three');
        }
      }
      check('the 59 old pages at the four levels (' + compared + ' drawn) hold every section as the base drew it, but for what the layer changes (the glass, the bare aroma line, the one word flag, Cards at the table, the drill\'s count, a stock row\'s family word named, the regions that name it read whole; a thin grape\'s words all kept beside its new profile), the head and the foot but for At the table, the chips and the steps', compared === 236 && diffs.length === 0, few(diffs, 5));
      check('each old grape\'s drill is the base\'s, less only what its notIn phrases shut out, plus the questions its new names bring and the table\'s three', drillBad.length === 0, few(drillBad, 5));
      const newAtBase = ROSTER.filter((s) => ROW[s].status === 'new' && M.G('!!v53GrapeFind(' + JSON.stringify(s) + ')'));
      check('the sixteen new grapes had no page at the base', newAtBase.length === 0, newAtBase.join(' '));
      M.tryG('applyLevel("certified", true)');
      N.tryG('applyLevel("certified", true)');
    }

  } catch (e) { check('section 8 ran to its end', false, e && e.stack); }
  /* ================================================================ */
  section('9. the root');
  try {
    for (const lv of LEVELS) {
      N.tryG('applyLevel(' + JSON.stringify(lv) + ', true)');
      const root = N.G('v53GrapesRootHtml()');
      const rows = [...root.matchAll(/<li><button class="v25row" type="button" data-go="grape" data-arg="([^"]+)">([\s\S]*?)<\/button><\/li>/g)].map((m) => ({ slug: m[1], line: unesc(((/<span class="v25row-line">([^<]*)<\/span>/.exec(m[2]) || [])[1]) || '') }));
      /* the Court's twenty keep codex53's line of their examinable places; every other row is the table's glass lead */
      const twenty = N.J('v53TastingList().map(function (t) { return v53GrapeKey(t.name); })') || [];
      const noLead = rows.filter((r) => !TABLE[r.slug] || !r.line.trim() || (twenty.indexOf(r.slug) < 0 && r.line !== TABLE[r.slug].glass.lead)).map((r) => r.slug);
      const leads = rows.filter((r) => twenty.indexOf(r.slug) < 0 && TABLE[r.slug] && r.line === TABLE[r.slug].glass.lead).length;
      const name = N.tryG('v32Lv().name') || lv;
      check('the root at ' + name + ' lists the 75 once each with a line on every row: the Court\'s twenty their examinable places as codex53 draws them, the other ' + leads + ' the table\'s glass lead; clean', rows.length === 75 && new Set(rows.map((r) => r.slug)).size === 75 && ROSTER.every((s) => rows.some((r) => r.slug === s)) && twenty.length === 20 && leads === 55 && noLead.length === 0 && !pageProblem(root), rows.length + ' rows; no lead: ' + noLead.slice(0, 6).join(' ') + ' ' + pageProblem(root));
    }
    N.tryG('applyLevel("certified", true)');
    const root = N.G('v53GrapesRootHtml()');
    const secAt = root.indexOf('<section class="v32-sec v57 v57-gtable" aria-labelledby="v57-g-table">');
    const tSec = secAt >= 0 ? root.slice(secAt, root.indexOf('</section>', secAt)) : '';
    check('At the table on the root: its doors (the cards, Old World and New World, Compare two grapes, Present it) and its filter (all, white, red), ahead of Tasting', ['id="v57-door-cards"', 'data-go="grapeworlds"', 'data-go="grapecompare"', 'data-go="grapepresent"'].every((x) => tSec.indexOf(x) > 0)
      && ['all', 'white', 'red'].every((f) => tSec.indexOf('data-v57="filter" data-f="' + f + '"') > 0) && secAt < root.indexOf('aria-labelledby="v53-g-tasting"') && tSec.indexOf('data-go="grape" data-arg=') < 0, tSec.slice(0, 300));
    const whites = ROSTER.filter((s) => ROW[s].colour === 'white').length;
    const filt = N.J('(function () { V57_FILTER.f = "white"; var h = v53GrapesRootHtml(); V57_FILTER.f = "all"; return { hid: (h.match(/<li hidden><button class="v25row" type="button" data-go="grape"/g) || []).length, shown: (h.match(/<li><button class="v25row" type="button" data-go="grape"/g) || []).length, line: /id="v57-filterline" tabindex="-1">/.test(h) }; })()');
    check('the filter set to white hides the ' + (75 - whites) + ' reds and shows the ' + whites + ' whites, the line saying so', filt.hid === 75 - whites && filt.shown === whites && filt.line, JSON.stringify(filt));

  } catch (e) { check('section 9 ran to its end', false, e && e.stack); }
  /* ================================================================ */
  section('10. On Brennan\'s list, on the fixture house');
  try {
    const poured = D.J('v57HouseSlugs()');
    const WINES = D.J('v28Wines(v53House()).map(function (w) { return { id: w.id, producer: v57Field(w, "producer"), wine: v57Field(w, "wine"), region: v57Field(w, "region"), grapes: v28Grapes(w), price: w.price, vintage: w.vintage }; })');
    const byId = {}; WINES.forEach((w) => { byId[w.id] = w; });
    check('the house is loaded: ' + WINES.length + ' wines, ' + Object.keys(poured).length + ' grapes of the table poured', WINES.length > 200 && Object.keys(poured).length >= 20);
    const OLD = ['France', 'Italy', 'Spain', 'Portugal', 'Germany', 'Austria', 'Greece', 'Hungary'].map(fold);
    const NEW = ['California', 'Oregon', 'Washington', 'New York', 'Argentina', 'Chile', 'Australia', 'New Zealand', 'South Africa'].map(fold);
    const listBad = [];
    let rowsSeen = 0;
    Object.keys(poured).forEach((s) => {
      if (!TABLE[s]) return;
      const h = D.G('v53GrapeHtml(v53GrapeFind(' + JSON.stringify(s) + '))');
      const sec = sections(h)['v57-gs-list'];
      if (!sec) { listBad.push(s + ': no list'); return; }
      const want = WINES.filter((w) => w.grapes.some((g) => D.G('v53GrapeKey(' + JSON.stringify(g) + ')') === s));
      const groups = {};
      [...sec.html.matchAll(/<h4 id="v57-list-(old|new|other)" tabindex="-1">[^<]*<\/h4><ul class="v57-wines">([\s\S]*?)<\/ul>/g)].forEach((m) => { groups[m[1]] = [...m[2].matchAll(/data-v57="wine" data-id="([^"]+)"[^>]*><span class="v57-wine-p">([^<]*)<\/span>(?:<span class="v57-wine-w">([^<]*)<\/span>)?/g)].map((x) => ({ id: unesc(x[1]), p: unesc(x[2]), w: unesc(x[3] || '') })); });
      const all = [].concat(groups.old || [], groups.new || [], groups.other || []);
      rowsSeen += all.length;
      const pairs = new Set(want.map((w) => fold(w.producer) + '|' + fold(w.wine)));
      if (all.length !== pairs.size) listBad.push(s + ': ' + all.length + ' rows for ' + pairs.size + ' wines');
      Object.keys(groups).forEach((g) => groups[g].forEach((r) => {
        const w = byId[r.id];
        if (!w) { listBad.push(s + ': ' + r.id + ' is no wine of the house'); return; }
        const last = fold(String(w.region || '').split(',').pop());
        const world = OLD.indexOf(last) >= 0 ? 'old' : (NEW.indexOf(last) >= 0 ? 'new' : '');
        if (world && world !== g) listBad.push(s + ': ' + r.id + ' (' + w.region + ') under ' + g);
        if (r.p !== (w.producer || w.wine) || (w.producer && r.w !== w.wine)) listBad.push(s + ': ' + r.id + ' drawn as ' + r.p + ' / ' + r.w);
        if (!w.grapes.some((x) => D.G('v53GrapeKey(' + JSON.stringify(x) + ')') === s)) listBad.push(s + ': ' + r.id + ' is not made with it');
      }));
      const txt = shown(sec.html);
      want.forEach((w) => { if ((w.price && txt.indexOf(String(w.price)) >= 0 && String(w.price).length > 2) || /\$|£|€/.test(txt)) listBad.push(s + ': a price on the list'); });
    });
    check('every grape the house pours carries On our list, its rows the house\'s own wines of it (' + rowsSeen + ' rows), once each, split by world as the region\'s last part says, the producer over the wine and no price', listBad.length === 0 && rowsSeen > 200, few(listBad, 5));
    const meu = D.J('(function () { var h = v53GrapeHtml(v53GrapeFind("meunier")); var m = /data-v57="wine" data-id="([^"]+)"/.exec(h); return { key: v53GrapeKey("Pinot Meunier"), n: v57HouseWines("meunier").n, id: m ? m[1] : "" }; })()');
    check('Meunier, new, reached from Pinot Meunier on the list: ' + meu.n + ' of the house\'s wines on its page', meu.key === 'meunier' && meu.n >= 20 && !!meu.id, JSON.stringify(meu));
    const chId = D.G('(function () { var h = v53GrapeHtml(v53GrapeFind("chardonnay")); var m = /data-v57="wine" data-id="([^"]+)"/.exec(h); return m ? m[1] : ""; })()');
    const opened = D.J('(function () { v32Go({ view: "grapes", arg: "" }, "push"); v32Go({ view: "grape", arg: "chardonnay" }, "push"); var n = history.length; var ok = V57_ACTS.wine({ getAttribute: function (k) { return k === "data-id" ? ' + JSON.stringify(chId) + ' : null; } }); var a = { ok: ok, view: S.view, open: v28State().open, pushed: history.length - n }; v32Back(); a.back = { view: S.view, arg: v32Arg("grape") }; return a; })()');
    check('a row on Chardonnay\'s list opens that wine\'s card on the list (pushed) and Back returns to the grape', opened.ok === true && opened.view === 'cellar' && opened.open === chId && opened.pushed === 1 && opened.back.view === 'grape' && opened.back.arg === 'chardonnay', JSON.stringify(opened));
    const filtList = D.J('(function () { V57_FILTER.f = "list"; var h = v53GrapesRootHtml(); V57_FILTER.f = "all"; return { shown: (h.match(/<li><button class="v25row" type="button" data-go="grape"/g) || []).length, chip: h.indexOf(\'data-v57="filter" data-f="list"\') > 0 }; })()');
    check('the root\'s filter On our list shows the ' + Object.keys(poured).filter((s) => TABLE[s]).length + ' grapes the house pours', filtList.chip && filtList.shown === Object.keys(poured).filter((s) => TABLE[s]).length, JSON.stringify(filtList));
    const doors = D.G('(function () { var h = v53GrapeHtml(v53GrapeFind("chardonnay")); var w = h.slice(h.indexOf(\'id="v57-gs-worlds"\'), h.indexOf("</details>", h.indexOf(\'id="v57-gs-worlds"\'))); return (w.match(/data-v57="list" data-world="(old|new)"/g) || []).length; })()');
    check('each side the house pours carries its door to On our list (Chardonnay: both)', doors === 2, doors);

  } catch (e) { check('section 10 ran to its end', false, e && e.stack); }
  /* ================================================================ */
  section('11. study');
  try {
    const T = await bootDevice();
    const decks = T.J('(function () { var a = v32DeckDef("grapecards"), b = v32DeckDef("grapecards:chardonnay"), c = v32DeckDef("grapesdue"); return { a: a.cards.length, ak: a.kind, b: b.cards.map(function (x) { return x.id; }), bk: b.cards.every(function (x) { return x.kind === "gtable" && x.slug === "chardonnay" && x.label === "Chardonnay"; }), c: c.cards.length, name: b.name }; })()');
    check('the decks: grapecards the 225 table cards, grapecards:chardonnay its three (its ids the table\'s), grapesdue empty on a new device', decks.a === 225 && decks.ak === 'gtable' && JSON.stringify(decks.b) === JSON.stringify(TABLE.chardonnay.cards.map((c) => c.id)) && decks.bk && decks.c === 0, JSON.stringify(decks));
    const face = T.J('(function () { v32StartRun("grapecards:chardonnay", { keepOrder: true }); var r = S._v32run; var c = r.cards[r.deck[0]]; var f = v32CardFace(c, r); r.flip = true; var b = v32CardFace(c, r); return { id: c.id, front: c.front, back: c.back, f: f, b: b, view: S.view, lit: v25NavWord(), parent: v32ParentRoute() }; })()');
    check('the card face: the front alone, then the answer under it with the door to the grape; lit Grapes, the run climbing to the grape', face.f.indexOf(esc(face.front)) > 0 && face.f.indexOf(esc(face.back)) < 0 && face.b.indexOf(esc(face.back)) > 0 && face.b.indexOf('data-go="grape" data-arg="chardonnay"') > 0 && !CH.cleanProblem(face.f + face.b + '<p>' + 'x'.repeat(100) + '</p>') && face.lit === 'grapes' && face.parent.view === 'grape' && face.parent.arg === 'chardonnay', JSON.stringify({ lit: face.lit, parent: face.parent }));
    const slotKey = T.G('v57Key()');
    const stockKey = T.G('v32GrapeKey()');
    const stockBefore = T.store[stockKey];
    const graded = T.J('(function () { var r = S._v32run; var ids = [r.cards[r.deck[0]].id, r.cards[r.deck[1]].id]; v32Grade(true); r.flip = true; v32Grade(false); var o = v57Rec(); return { ids: ids, a: o.c[ids[0]], b: o.c[ids[1]], today: v57Today(), one: v57AddDays(1), three: v57AddDays(3), learnt: v32DeckDef("grapecards:chardonnay").learnt, due: v32DeckDef("grapesdue").cards.map(function (c) { return c.id; }) }; })()');
    const again = T.J('(function () { v32StartRun("grapecards:chardonnay", { keepOrder: true, first: ' + JSON.stringify(graded.ids[0]) + ' }); var r = S._v32run; r.flip = true; v32Grade(true); return v57Rec().c[' + JSON.stringify(graded.ids[0]) + ']; })()');
    check('on seeded grades, in the layer\'s slot: a card graded right is due tomorrow, then in three days; a card graded wrong is due today, sooner', graded.a && graded.a.due === graded.one && graded.a.n === 1 && graded.b && graded.b.due === graded.today && graded.b.n === 0 && again.due === graded.three && again.n === 2 && again.due > graded.b.due, JSON.stringify({ a: graded.a, b: graded.b, again }));
    check('Today\'s table cards deal the one sent back; one card learnt of Chardonnay\'s three', JSON.stringify(graded.due) === JSON.stringify([graded.ids[1]]) && graded.learnt === 1, JSON.stringify(graded));
    check('the slot is oot-codex-grapesrs-v1 under the profile key rule, and the grape cards\' slot is untouched by a table card\'s grade', /oot-codex-grapesrs-v1/.test(slotKey) && slotKey in T.store && T.store[stockKey] === stockBefore && stockKey !== slotKey, slotKey + ' ' + stockKey);
    const stock = T.J('(function () { var before = localStorage.getItem(v57Key()); v32StartRun("grape:chardonnay", {}); var r = S._v32run; r.flip = true; v32Grade(true); return { mark: v32GrapeRec().Chardonnay, same: localStorage.getItem(v57Key()) === before }; })()');
    check('a stock grape card is still marked in its own slot, and the layer\'s slot does not move', stock.mark === 'got' && stock.same, JSON.stringify(stock));
    const dlit = T.J('(function () { S.view = "deck"; S._v32deck = "grapecards"; var a = { lit: v25NavWord(), parent: v32ParentRoute() }; S._v32deck = "grapecards:glera"; a.g = v32ParentRoute(); S.view = "home"; return a; })()');
    check('the decks light Grapes: the whole deck climbs to the root, a grape\'s three to the grape', dlit.lit === 'grapes' && dlit.parent.view === 'grapes' && dlit.g.view === 'grape' && dlit.g.arg === 'glera', JSON.stringify(dlit));

  } catch (e) { check('section 11 ran to its end', false, e && e.stack); }
  /* ================================================================ */
  section('12. the drill');
  try {
    const drill = [];
    slugs.forEach((s) => {
      const pool = N.J('v53GrapeQuestions(' + JSON.stringify(s) + ', "certified").map(function (q) { var a = Array.isArray(q.opts) && typeof q.a === "number" ? q.opts[q.a] : (q.ans || ""); return { id: q.id || "", hay: [q.q, a, q.exp].join(" "), tagged: (q.grapes || []).some(function (n) { return v53GrapeKey(n) === ' + JSON.stringify(s) + '; }) }; })') || [];
      const ids = pool.map((q) => q.id);
      TABLE[s].questions.forEach((q) => { if (ids.indexOf(q.id) < 0) drill.push(s + ' lacks ' + q.id); });
      const notIn = TABLE[s].notIn.map(fold);
      pool.forEach((q) => { if (S.ID_RE.test(q.id) || q.tagged) return; const h = ' ' + fold(q.hay) + ' '; notIn.forEach((p) => { if (h.indexOf(' ' + p + ' ') >= 0) drill.push(s + ': ' + (q.id || q.hay.slice(0, 30)) + ' holds "' + p + '"'); }); });
    });
    check('every grape\'s drill holds the table\'s three, and no bank question its notIn phrases shut out (' + slugs.filter((s) => TABLE[s].notIn.length).length + ' grapes carry them)', drill.length === 0, few(drill, 5));
    /* the grapes with notIn phrases: what the name gathers (the inner drill) less what the phrases shut out, and nothing else */
    const shut = [];
    let dropped = 0;
    const mpKept = [];
    slugs.filter((s) => TABLE[s].notIn.length).forEach((s) => LEVELS.forEach((lv) => {
      N.tryG('applyLevel(' + JSON.stringify(lv) + ', true)');
      const inner = N.J('_v57GrapeQuestions(' + JSON.stringify(s) + ', ' + JSON.stringify(lv) + ').map(function (q) { var a = Array.isArray(q.opts) && typeof q.a === "number" ? q.opts[q.a] : (q.ans || ""); return { id: q.id || q.q, hay: [q.q, a, q.exp].join(" ") }; })') || [];
      const kept = (N.J('v53GrapeQuestions(' + JSON.stringify(s) + ', ' + JSON.stringify(lv) + ').map(function (q) { return q.id || q.q; })') || []);
      const notIn = TABLE[s].notIn.map(fold);
      inner.forEach((q) => {
        const holds = notIn.some((p) => (' ' + fold(q.hay) + ' ').indexOf(' ' + p + ' ') >= 0);
        const isKept = kept.indexOf(q.id) >= 0;
        if (!isKept) { dropped++; if (!holds) shut.push(lv + ' ' + s + ' dropped ' + q.id + ' with no phrase'); }
        if (s === 'montepulciano' && isKept && /vino nobile/i.test(q.hay)) mpKept.push(q.hay);
      });
    }));
    N.tryG('applyLevel("certified", true)');
    check('the notIn phrases shut out exactly the questions that hold them (' + dropped + ' at the four levels); Montepulciano keeps no Vino Nobile question but one that parts the town\'s Sangiovese from the grape of Abruzzo', shut.length === 0 && dropped >= 5 && mpKept.every((h) => /abruzzo/i.test(h)), few(shut.concat(mpKept.filter((h) => !/abruzzo/i.test(h))), 4));
    const qid = TABLE.glera.questions[0].id;
    const eng = N.J('(function () { var k = "certified|" + ' + JSON.stringify(qid) + '; var q = findByKey(k); return { owned: keyOwned(k), found: !!q && q.id === ' + JSON.stringify(qid) + ', cat: q && q.cat }; })()');
    check('a gt- key is never level progress, and is found by its key, its section the grape\'s drill', eng.owned === false && eng.found && eng.cat === 'Grape: Glera', JSON.stringify(eng));

  } catch (e) { check('section 12 ran to its end', false, e && e.stack); }
  /* ================================================================ */
  section('13. the three views');
  try {
    const V = await bootDevice();
    const go = (view, arg) => V.J('(function () { v32Go({ view: "grapes", arg: "" }, "push"); v32Go({ view: ' + JSON.stringify(view) + ', arg: ' + JSON.stringify(arg || '') + ' }, "push"); return { view: S.view, arg: v32Arg(' + JSON.stringify(view) + '), hash: location.hash, lit: v25NavWord(), name: v25MainName(), parent: v32ParentRoute() }; })()');
    const draw = (view) => V.G('V57_VIEWS[' + JSON.stringify(view) + '].draw(V57_ARGS[' + JSON.stringify(view) + '] || "")');
    const w1 = go('grapeworlds', '');
    const wh = draw('grapeworlds');
    check('grapeworlds: the side by side grapes as an index (' + contrast.length + ' rows, whites then reds), lit Grapes, climbing to the root, clean', w1.view === 'grapeworlds' && w1.hash === '#/v/grapeworlds' && w1.lit === 'grapes' && w1.parent.view === 'grapes' && (wh.match(/data-v57="worlds" data-slug="/g) || []).length === contrast.length && !pageProblem(wh), JSON.stringify(w1) + ' ' + pageProblem(wh));
    const call = V.J('(function () { V57_ACTS.callstart(); var a = { view: S.view, arg: v32Arg("grapeworlds"), n: V57_CALL.deck.length, glasses: [] }; for (var i = 0; i < V57_CALL.deck.length; i++) { var g = V57_CALL.deck[i]; a.glasses.push(g.slug); V57_ACTS.callpick({ getAttribute: function () { return i % 2 ? (g.side === "old" ? "new" : "old") : g.side; } }); V57_ACTS.callnext(); } a.right = V57_CALL.right; a.w = v57Rec().w; a.parent = v32ParentRoute(); a.score = V57_VIEWS.grapeworlds.draw("call"); return a; })()');
    check('the call drill: ten glasses of ten grapes, each answered, the score kept in the slot (' + (call.w && call.w.last) + ' of ' + (call.w && call.w.of) + '), the drill climbing to the index, the score clean', call.view === 'grapeworlds' && call.arg === 'call' && call.n === 10 && new Set(call.glasses).size === 10 && call.right === 5 && call.w && call.w.n === 1 && call.w.last === 5 && call.w.of === 10 && call.parent.view === 'grapeworlds' && !pageProblem(call.score) && call.score.indexOf('5 of 10 called right.') > 0, JSON.stringify(call).slice(0, 400));
    /* each half of every blind call as this gate reads it: its glass and the worlds its target names, Old World or
       New World said outright or a country or state of either (this gate's own short list, not the layer's map) */
    const OLDN = ['old world', 'france', 'italy', 'spain', 'portugal', 'germany', 'austria', 'greece', 'hungary', 'switzerland', 'england', 'lebanon'];
    const NEWN = ['new world', 'california', 'oregon', 'washington', 'new york', 'australia', 'new zealand', 'south africa', 'chile', 'argentina', 'uruguay', 'canada', 'united states'];
    const halves = [];
    Object.keys(TABLE).filter((s) => TABLE[s] && TABLE[s].worlds && TABLE[s].worlds.contrast).forEach((s) => {
      String(TABLE[s].worlds.contrast.call || '').replace(/\.\s*$/, '').split(/\s*;\s*|\.\s+(?=[A-Z])/).forEach((half) => {
        const m = /^(.+)\s+(?:leans?|points?|suggests?|says?|means?|signals?|indicates?|favours?)\s+(?:to\s+|towards\s+)?(.+)$/i.exec(half);
        if (!m) return;
        const f = ' ' + fold(m[2]) + ' ';
        const o = OLDN.some((k) => f.indexOf(' ' + k + ' ') >= 0), w = NEWN.some((k) => f.indexOf(' ' + k + ' ') >= 0);
        halves.push({ slug: s, glass: fold(m[1]), names: o && w ? 'both' : (o ? 'old' : (w ? 'new' : '')), half: half.trim() });
      });
    });
    const full = V.J('v57CallPool()') || [];
    const keyBad = [];
    full.forEach((g) => {
      const h = halves.find((x) => x.slug === g.slug && x.glass === fold(g.text));
      if (!h) keyBad.push(g.slug + ' "' + g.text + '" from no half of its call');
      else if (h.names === 'both') keyBad.push(g.slug + ' "' + g.text + '" keyed ' + g.side + ', though its half names both worlds: ' + h.half);
      else if (h.names && h.names !== g.side) keyBad.push(g.slug + ' "' + g.text + '" keyed ' + g.side + ', though its half names the other: ' + h.half);
    });
    check('every glass of the call drill keyed to the world its own half of the blind call names, and none dealt from a half that names both worlds (Spain or the New World), whose answer would be marked wrong either way (' + full.length + ' glasses)', keyBad.length === 0 && full.length > 0, few(keyBad, 4));
    const twoWay = [...new Set(halves.filter((x) => x.names === 'both').map((x) => x.slug))];
    twoWay.forEach((s) => note('the blind call of ' + s + ' leans a half to both worlds (' + halves.filter((x) => x.slug === s && x.names === 'both').map((x) => x.half).join(' | ') + '): that half gives no glass until the call leans it one way'));
    const pool = full.map((g) => g.slug + ':' + g.side);
    const has = (s, w) => pool.indexOf(s + ':' + w) >= 0;
    const poolBad = contrast.filter((s) => (twoWay.indexOf(s) < 0 ? !(has(s, 'old') && has(s, 'new')) : has(s, 'old') !== has(s, 'new')));
    check('every side by side grape gives the call drill a glass of each world, read from its blind call (one whose call leans a half both ways gives both from its other halves, or none)', poolBad.length === 0, poolBad.join(' '));
    const c1 = go('grapecompare', 'chardonnay~sauvignon-blanc');
    const ch = draw('grapecompare');
    check('grapecompare: Chardonnay and Sauvignon Blanc side by side (the glass, the notes, the structure, the tell, service, two cells each), lit Grapes, climbing to the root, clean', c1.view === 'grapecompare' && c1.arg === 'chardonnay~sauvignon-blanc' && c1.hash === '#/v/grapecompare/chardonnay~sauvignon-blanc' && c1.lit === 'grapes' && c1.parent.view === 'grapes'
      && ['glass', 'notes', 'structure', 'tell', 'service'].every((k) => ch.indexOf('id="v57-cmp-' + k + '"') > 0) && (ch.match(/<div class="v57-cmprow">/g) || []).length === 5 && ch.indexOf(esc(TABLE.chardonnay.glass.lead)) > 0 && ch.indexOf(esc(TABLE['sauvignon-blanc'].glass.lead)) > 0 && !pageProblem(ch), JSON.stringify(c1) + ' ' + pageProblem(ch));
    const c2 = go('grapecompare', 'chardonnay~chardonnay');
    check('grapecompare given one grape twice asks for two different grapes', V.G('V57_VIEWS.grapecompare.draw(V57_ARGS.grapecompare)').indexOf('Choose two different grapes.') > 0, JSON.stringify(c2));
    const p1 = go('grapepresent', 'meunier');
    const ph = draw('grapepresent');
    const shownLine = V.J('(function () { V57_ACTS.reveal(); var a = V57_VIEWS.grapepresent.draw("meunier"); V57_ACTS.mark({ getAttribute: function (k) { return k === "data-ok" ? "1" : null; } }); return { a: a, b: V57_VIEWS.grapepresent.draw("meunier"), p: v57Rec().p.meunier, one: v57AddDays(1) }; })()');
    check('grapepresent: Meunier named and the line hidden, then shown, then marked said and due tomorrow; lit Grapes, climbing to the root, clean', p1.view === 'grapepresent' && p1.arg === 'meunier' && p1.lit === 'grapes' && p1.parent.view === 'grapes' && ph.indexOf('>Meunier<') > 0 && ph.indexOf(esc(TABLE.meunier.lines.s45)) < 0
      && shownLine.a.indexOf(esc(TABLE.meunier.lines.s45)) > 0 && shownLine.p && shownLine.p.due === shownLine.one && shownLine.b.indexOf('Marked said. It comes back tomorrow.') > 0 && !pageProblem(ph) && !pageProblem(shownLine.a) && !pageProblem(shownLine.b), JSON.stringify(p1));
    /* Another grape, pressed again and again without a mark: every grape with a line once, then round again */
    const skip = V.J('(function () { V57_PASSED = {}; V57_PRESENT = { slug: "", shown: false, mark: "" }; v32Go({ view: "grapes", arg: "" }, "push"); v32Go({ view: "grapepresent", arg: "" }, "push"); var n = v57SpokenList().length, seen = [v57PresentSlug()]; for (var i = 1; i < n; i++) { V57_ACTS.pnext(); seen.push(v57PresentSlug()); } V57_ACTS.pnext(); return { n: n, seen: seen, again: v57PresentSlug() }; })()');
    check('Present it: Another grape, pressed without a mark, walks every grape with a line once (' + skip.n + ') before the first comes round again, never two grapes handed back and forth', skip.n >= 70 && skip.seen.length === skip.n && new Set(skip.seen).size === skip.n && skip.again === skip.seen[0], skip.seen.slice(0, 6).join(' > ') + ' ... ' + new Set(skip.seen).size + ' distinct of ' + skip.n);
    const climb = V.J('(function () { var out = []; ["grapeworlds", "grapecompare", "grapepresent"].forEach(function (v) { v32Go({ view: "grapes", arg: "" }, "push"); v32Go({ view: v, arg: "" }, "push"); v32Back(); out.push(S.view); }); return out; })()');
    check('Back from each of the three views climbs to the Grapes root', JSON.stringify(climb) === JSON.stringify(['grapes', 'grapes', 'grapes']), JSON.stringify(climb));
    const coldBad = [];
    for (const [hash, view, arg] of [['#/v/grapeworlds', 'grapeworlds', ''], ['#/v/grapeworlds/call', 'grapeworlds', 'call'], ['#/v/grapecompare/chardonnay~merlot', 'grapecompare', 'chardonnay~merlot'], ['#/v/grapepresent/glera', 'grapepresent', 'glera']]) {
      const Z = await bootDevice({ hash });
      const got = Z.J('({ view: S.view, arg: v32Arg(' + JSON.stringify(view) + '), lit: v25NavWord(), parent: v32ParentRoute() })');
      const html = Z.G('V57_VIEWS[' + JSON.stringify(view) + '].draw(V57_ARGS[' + JSON.stringify(view) + '] || "")');
      if (got.view !== view || got.arg !== arg || got.lit !== 'grapes' || pageProblem(html)) coldBad.push(hash + ' ' + JSON.stringify(got) + ' ' + pageProblem(html));
    }
    check('each view answers its address cold (#/v/grapeworlds, its call drill, #/v/grapecompare/chardonnay~merlot, #/v/grapepresent/glera), lit Grapes, drawn clean', coldBad.length === 0, few(coldBad, 3));

  } catch (e) { check('section 13 ran to its end', false, e && e.stack); }
  /* ================================================================ */
  section('14. the shell and the chain rule');
  try {
    const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
    const at = (s) => index.indexOf(s);
    const iData = at('src="js/data-grapes-table.js?v='), i57 = at('src="js/codex57.js?v='), i56s = at('src="js/codex56.js'), iBoot = at('src="js/boot.js');
    check('index.html loads js/data-grapes-table.js then js/codex57.js, each once with ?v=, after codex56.js and before boot.js', i56s > 0 && iData > i56s && i57 > iData && iBoot > i57 && index.split('js/codex57.js').length === 2 && index.split('js/data-grapes-table.js').length === 2);
    const v = Number((sw.match(/const CACHE = '(?:oot-)?codex-v(\d+)';/) || [])[1]);
    const s56 = sw.indexOf("'./js/codex56.js'"), sData = sw.indexOf("'./js/data-grapes-table.js'"), s57 = sw.indexOf("'./js/codex57.js'");
    check('sw.js is codex-v116 or later (' + v + ') and lists ./js/data-grapes-table.js and ./js/codex57.js once each, after ./js/codex56.js', v >= 116 && s56 > 0 && sData > s56 && s57 > s56 && sw.split("'./js/codex57.js'").length === 2 && sw.split("'./js/data-grapes-table.js'").length === 2, 'v' + v);
    const gates = fs.readdirSync(GATES).filter((f) => /^(check-|list-harness)[\w-]*\.c?js$/.test(f));
    const short = gates.filter((f) => {
      const t = fs.readFileSync(path.join(GATES, f), 'utf8');
      const listed = (t.match(/'codex56\.js'\s*[,\]]/g) || []).length;
      const next = (t.match(/'codex56\.js'\s*,\s*'data-grapes-table\.js'\s*,\s*'codex57\.js'/g) || []).length;
      return listed > next;
    });
    check('the chain rule: every list in a gate here that names codex56.js names data-grapes-table.js and codex57.js straight after it (' + gates.length + ' gates read)', !short.length && gates.length > 40, short.join(', '));

  } catch (e) { check('section 14 ran to its end', false, e && e.stack); }
  /* ================================================================ */
  section('15. the layer\'s file');
  try {
    const read = SRC.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
    const srcBad = voiceProblems(SRC).concat(voiceProblems(read)).filter((p) => !/mark U\+/.test(p));
    check('codex57.js (its escapes read as the characters they are): no dash of any kind, never the retired word, no level numeral', srcBad.length === 0, srcBad.join(', '));
    check('codex57.js names nobody and ships no key and no model name', !/Lizzy|sk-ant|api[_-]?key|claude-|\bopus\b|\bsonnet\b|\bhaiku\b|\bfable\b|chatgpt|openai/i.test(SRC));
    const code = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/'(?:[^'\\\n]|\\.)*'/g, "''");
    check('codex57.js declares with var and function only (no let, const, class or arrow)', !/(^|[^\w.'"])(let|const|class)\s/.test(code) && code.indexOf('=>') < 0);
    const wrappers = SRC.split('\n').filter((l) => /^\s*var _v57\w+ = \w+;$/.test(l));
    const unguarded = wrappers.filter((line) => { const m = /var (_v57\w+) = (\w+);$/.exec(line); const i = SRC.indexOf(line); const before = SRC.slice(Math.max(0, i - 200), i); return !new RegExp('if \\(typeof ' + m[2] + ' === \'function\'\\) \\{\\s*$').test(before); });
    check('codex57.js edits no earlier layer: every wrapper (' + wrappers.length + ') is typeof guarded, the guard on the line above it', wrappers.length >= 20 && unguarded.length === 0, unguarded.join(' | '));
    const cssAt = SRC.indexOf('css.textContent = ['), cssEnd = SRC.indexOf("].join('\\n')", cssAt);
    const rules = [...SRC.slice(cssAt, cssEnd).matchAll(/^\s*'((?:[^'\\]|\\.)*)',?$/gm)].map((m) => m[1]);
    const selBad = [];
    rules.forEach((r) => {
      const body = /^@media[^{]*\{(.*)\}$/.exec(r);
      const rule = body ? body[1] : r;
      const sel = rule.slice(0, rule.indexOf('{'));
      sel.split(',').forEach((x) => { if (!/^\.wrap\s/.test(x.trim())) selBad.push(x.trim()); });
    });
    check('every selector of the v57-style element (' + rules.length + ' rules) starts .wrap', rules.length > 50 && selBad.length === 0, selBad.slice(0, 5).join(' | '));
    const WORDS = D.J('V57_WORDS');
    let lits = SRC.replace(/\/\*[\s\S]*?\*\//g, '');
    const cut = (s, a0, b0, off) => { const a = s.indexOf(a0), b = a >= 0 ? s.indexOf(b0, a) : -1; return a < 0 || b < 0 ? s : s.slice(0, a) + s.slice(b + off); };
    lits = cut(lits, 'var V57_WORDS = {', '\n};', 3);
    lits = cut(lits, 'css.textContent = [', "].join('\\n')", 0);
    lits = cut(lits, 'var V57_WORLD = {};', '})();', 5);
    const earlier = fs.readdirSync(JS).filter((f) => /^codex\d+\.js$/.test(f) && f !== 'codex57.js').map((f) => fs.readFileSync(path.join(JS, f), 'utf8')).join('\n');
    const strayWords = [];
    [...lits.matchAll(/'((?:[^'\\\n]|\\.)*)'/g)].map((m) => m[1]).forEach((l) => {
      const text = l.replace(/<[^>]*>/g, ' ').replace(/<[^>]*$/, ' ').replace(/^[^<]*>/, ' ').trim();
      if (!text || Object.prototype.hasOwnProperty.call(WORDS, text)) return;
      const prose = /[A-Z][a-z]{2,}/.test(text) || /[a-z]{2,}\s+[a-z]{2,}\s+[a-z]{2,}/.test(text);
      if (prose && earlier.indexOf(text) < 0) strayWords.push(text);
    });
    const keyCalls = [...SRC.matchAll(/v57(?:W|H4|Eyebrow)\('([A-Za-z_]+)'\s*[,)]/g)].map((m) => m[1]).filter((k, i, a) => a.indexOf(k) === i);
    const noKey = keyCalls.filter((k) => !Object.prototype.hasOwnProperty.call(WORDS, k));
    const dyn = ['climate_cool', 'climate_moderate', 'climate_warm', 'showing_white', 'showing_red', 'showing_list', 'filter_all', 'filter_white', 'filter_red', 'filter_list', 'kind_white', 'kind_red', 'family_white', 'family_red'].filter((k) => !Object.prototype.hasOwnProperty.call(WORDS, k));
    check('every word the layer shows is V57_WORDS\'s: no shown string literal outside it (a literal that is an earlier layer\'s own words is a match, not a word shown), every key it reads there (' + keyCalls.length + ' named, and the composed ones)', strayWords.length === 0 && noKey.length === 0 && dyn.length === 0, strayWords.concat(noKey, dyn).slice(0, 6).join(' | '));
    const wordBad = Object.keys(WORDS).map((k) => [k, voiceProblems(WORDS[k])]).filter((x) => x[1].length);
    const SUPER = /\b(best|most|finest|greatest|largest|smallest|highest|lowest|oldest|newest|easiest|hardest|fastest|ultimate|iconic|legendary|world class|famous)\b/i;
    const AMER_W = /\b(color\w*|center\w*|toward|favor\w*|flavor\w*|\w+iz(e|es|ed|ing)|gray|program|practice|catalog)\b/i;
    const wordStyle = Object.keys(WORDS).filter((k) => SUPER.test(WORDS[k]) || AMER_W.test(WORDS[k]) || /\bLevel\s+\d/.test(WORDS[k]) || /\$|£|€/.test(WORDS[k]));
    check('every word of V57_WORDS (' + Object.keys(WORDS).length + ') in the strictest voice: no dash, never the retired word, no level numeral, no superlative, British spelling, no price', wordBad.length === 0 && wordStyle.length === 0, JSON.stringify(wordBad.concat(wordStyle)));
    const selfBad = voiceProblems(fs.readFileSync(__filename, 'utf8').replace(/(^|[^\w])Practise(?!\w)/g, '$1')).filter((p) => !/retired|numeral|mark U\+/.test(p));
    check('check-grapes-table.js itself carries no dash', selfBad.length === 0, selfBad.join(', '));

  } catch (e) { check('section 15 ran to its end', false, e && e.stack); }
  if (BT.made) fs.rmSync(BT.dir, { recursive: true, force: true });
}

/* ---- the gate proves it can fail ----
   Each mutation breaks one rule in a scratch copy of the shipped tree (index.html, sw.js, js/) or, for the chain rule,
   of the gates; this gate, run on it, must fail, and fail by the check that names the rule. */
function mutations() {
  const MUT = [
    ['the data file edited by hand', 'js/data-grapes-table.js', '"edition":"2026-11-09"', '"edition":"2026-11-10"', 'the data is the build'],
    ['a sale given a third sentence', 'js/data-grapes-table.js', 'Tell me the dish and I will pour the lean one for oysters or the rich one for lobster.', 'Tell me the dish. I will pour the lean one for oysters or the rich one for lobster.', 'the sale of every grape is exactly two sentences'],
    ['a bare family word as a note', 'js/data-grapes-table.js', '"notes":["lemon zest","lemon curd"]', '"notes":["citrus","lemon curd"]', 'no bare family word in any shown string'],
    ['a side by side grape without its New World', 'js/codex57.js', "side('newWorld', v57Obj(c['new']), 'v57-new', 'new')", "''", 'the new sections in their places'],
    ['an alias the plan holds unresolved', 'js/codex57.js', "Object.keys(al).forEach(function (k) { if (typeof al[k] === 'string') key(v57Fold(k), al[k]); });", "Object.keys(al).forEach(function (k) { if (typeof al[k] === 'string') key(v57Fold(k), al[k]); }); key('auxerrois', 'pinot-blanc');", 'the names that must stay unresolved'],
    ['a key taken from the grape that held it', 'js/codex57.js', 'if (!v57Own(J.byKey, k)) J.byKey[k] = slug;', "J.byKey[k] = slug; if (slug === 'meunier') J.byKey['pinot noir'] = slug;", 'every name that resolved at the base'],
    ['At the table set after the chips', 'js/codex57.js', 'if (m) s = s.slice(0, m.index) + block + s.slice(m.index + m[0].length);', 'if (m) s = s.slice(0, m.index) + s.slice(m.index + m[0].length).replace("</nav>", "</nav>" + block);', 'At the table first'],
    ['a v53-gs section renamed', 'js/codex57.js', 'return v57OpenApply(s, r.slug);', 'return v57OpenApply(s.replace(\' id="v53-gs-watch"\', \' id="v57-gs-watch"\'), r.slug);', 'the six v53-gs sections'],
    ['the root row without its lead', 'js/codex57.js', '      if (lead) return lead;', "      if (lead) return '';", 'with a line on every row'],
    ['a new grape left out of the join', 'js/codex57.js', '    J.list.push(r);', "    if (slug !== 'arneis') J.list.push(r);", 'lists the 75 once each'],
    ['California counted Old World', 'js/codex57.js', "['United States', 'USA', 'California',", "['California'].forEach(function (n) { V57_WORLD[v57Fold(n)] = 'old'; });\n  ['United States', 'USA',", 'split by world'],
    ['a house row opening no card', 'js/codex57.js', 'data-v57="wine" data-id="\' + v57Esc(x.id) + \'"', 'data-v57="wine" data-id="\' + v57Esc(x.id + \'0\') + \'"', 'its rows the house\'s own wines'],
    ['a grade scheduled backwards', 'js/codex57.js', "v57Sched('c', c.id, !!got);", "v57Sched('c', c.id, !got);", 'a card graded right is due tomorrow'],
    ['the notIn phrases ignored', 'js/codex57.js', '  if (!phrases.length) return list;', '  return list;', 'no bank question its notIn phrases shut out'],
    ['Another grape handing two grapes back and forth', 'js/codex57.js', 'var hit = fresh[0] || other[0] || rows[0] || null;', 'var hit = other[0] || rows[0] || null;', 'Another grape, pressed without a mark'],
    ['a call half naming both worlds dealt as the New World', 'js/codex57.js', "  if (named.old && named['new']) return '';\n", "  if (named['new']) return 'new';\n", 'every glass of the call drill keyed'],
    ['the table\'s questions left out of the drill', 'js/codex57.js', 'return v57NotIn(out, r, t).concat(v57Questions(r.slug));', 'return v57NotIn(out, r, t);', 'holds the table\'s three'],
    ['a view climbing to Home', 'js/codex57.js', "  name: function () { return v57W('compareRow'); },\n  parent: function () { return { view: 'grapes' }; }", "  name: function () { return v57W('compareRow'); },\n  parent: function () { return { view: 'home' }; }", 'grapecompare: Chardonnay and Sauvignon Blanc'],
    ['the two tags swapped in index.html', 'index.html', '<script src="js/data-grapes-table.js?v=2"></script>\n<script src="js/codex57.js?v=1"></script>', '<script src="js/codex57.js?v=1"></script>\n<script src="js/data-grapes-table.js?v=2"></script>', 'index.html loads js/data-grapes-table.js then js/codex57.js'],
    ['the worker left at codex-v115', 'sw.js', "const CACHE = 'codex-v117';", "const CACHE = 'codex-v115';", 'sw.js is codex-v116 or later'],
    ['a let in the layer', 'js/codex57.js', 'var V57_SLOT = ', 'let V57_SLOT = ', 'declares with var and function only'],
    ['an unguarded wrapper', 'js/codex57.js', "if (typeof v53GrapeShort === 'function') {\n  var _v57GrapeShort", "if (true) {\n  var _v57GrapeShort", 'every wrapper'],
    ['a selector outside .wrap', 'js/codex57.js', "'.wrap .v57-rule{", "'.v57-rule{", 'every selector of the v57-style element'],
    ['a shown word outside V57_WORDS', 'js/codex57.js', "v57Esc(v57W('sideBySide'))", "'Side by side, the two'", 'every word the layer shows is V57_WORDS'],
    ['a dash in V57_WORDS', 'js/codex57.js', "atTable: 'At the table',", "atTable: 'At the table " + String.fromCharCode(0x2014) + " now',", 'in the strictest voice'],
    ['a card id moved in the data', 'js/data-grapes-table.js', '{"id":"' + firstCardId() + '"', '{"id":"gt-00000000"', 'ids frozen against keys.v1.json'],
    ['a family grape headed as one grape', 'js/codex57.js', "if (v57Str(t.kind) === 'family') {", "if (v57Str(t.kind) === 'families') {", 'a family of vines is headed so'],
    ['the stock rows drawn with their bare family word', 'js/codex57.js', '      rest = v57NameRows(rest, t);\n', '', 'no stock row item is only the word'],
    ['the regions that name it cut inside a bracket again', 'js/codex57.js', '    try { return v57StarPlaces(s); } catch (e) { return _v57StarPlaces.apply(this, arguments); }', '    return _v57StarPlaces.apply(this, arguments);', 'reads each starred place whole'],
    ['a gate list naming codex56.js without the new files', 'gates', "'codex56.js', 'data-grapes-table.js', 'codex57.js'", "'codex56.js'", 'the chain rule'],
    ['codex57 changing an old section it does not own', 'js/codex57.js', 'return v57OpenApply(s, r.slug);', "return v57OpenApply(s.replace('<dt>Wines to know</dt>', '<dt>Wines to try</dt>'), r.slug);", 'the 59 old pages at the four levels']
  ];
  const repoRoot = path.join(JS, '..');
  const BT = baseTree();
  let held = 0;
  const problems = [];
  for (const [name, file, from, to, by] of MUT) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grapes-table-mut-'));
    fs.cpSync(JS, path.join(dir, 'js'), { recursive: true });
    fs.copyFileSync(path.join(repoRoot, 'index.html'), path.join(dir, 'index.html'));
    fs.copyFileSync(path.join(repoRoot, 'sw.js'), path.join(dir, 'sw.js'));
    /* a named base is read once and handed on; the default base each run builds from its own scratch jsDir */
    const env = Object.assign({}, process.env, { GRAPES_BASE_DIR: BT.dir || '' });
    let target;
    if (file === 'gates') {
      fs.mkdirSync(path.join(dir, 'gates'));
      fs.readdirSync(GATES).filter((f) => /^(check-|list-harness)[\w-]*\.c?js$/.test(f)).forEach((f) => fs.copyFileSync(path.join(GATES, f), path.join(dir, 'gates', f)));
      target = path.join(dir, 'gates', 'check-cms.js');
      env.GRAPES_TABLE_GATES = path.join(dir, 'gates');
    } else target = path.join(dir, file);
    const src = fs.readFileSync(target, 'utf8');
    if (src.indexOf(from) < 0) { problems.push('the mutation "' + name + '" found nothing to change in ' + file); fs.rmSync(dir, { recursive: true, force: true }); continue; }
    fs.writeFileSync(target, src.replace(from, to));
    const r = cp.spawnSync(process.execPath, [__filename, path.join(dir, 'js')], { env, encoding: 'utf8', maxBuffer: 1 << 26 });
    fs.rmSync(dir, { recursive: true, force: true });
    const fails = String(r.stdout || '').split('\n').filter((l) => /^\s+FAIL\s/.test(l));
    const hit = fails.find((l) => l.indexOf(by) >= 0);
    if (r.status === 0) problems.push('the mutation "' + name + '" left this gate green');
    else if (!hit) problems.push('the mutation "' + name + '" was caught, but not by "' + by + '": ' + (fails[0] || String(r.stderr || '').split('\n')[0] || '').trim().slice(0, 160));
    else { held++; console.log('  mutation held: ' + name + ' :: ' + hit.trim().slice(6, 150)); }
  }
  if (BT.made) fs.rmSync(BT.dir, { recursive: true, force: true });
  console.log('  ' + held + ' of ' + MUT.length + ' mutations caught, each by its own check');
  problems.forEach((p) => console.log('  FAIL  ' + p));
  return problems.length;
}
function firstCardId() {
  const t = fs.readFileSync(path.join(JS, 'data-grapes-table.js'), 'utf8');
  const m = /"cards":\[\{"id":"(gt-[0-9a-z]{8})"/.exec(t);
  return m ? m[1] : 'none';
}

main().then(() => {
  console.log('');
  if (failed) { console.log('check-grapes-table: ' + failed + ' of ' + (passed + failed) + ' checks FAILED'); process.exit(1); }
  if (MUTATIONS) {
    console.log('');
    console.log('--- the mutations ---');
    const bad = mutations();
    if (bad) { console.log('check-grapes-table: all ' + passed + ' checks pass; ' + bad + ' mutation(s) FAILED'); process.exit(1); }
    console.log('check-grapes-table: all ' + passed + ' checks pass, and every mutation is caught by name');
    process.exit(0);
  }
  console.log('check-grapes-table: all ' + passed + ' checks pass');
  process.exit(0);
}).catch((e) => { console.error(e && e.stack || e); process.exit(1); });
