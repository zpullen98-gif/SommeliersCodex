/* The flow (codex54), proven in a node sandbox.

   The card proof's loader (.wip/prove-card.cjs): a sandbox with a real
   history stack, the shared house engine and its UI, then every classic
   script index.html loads from js/ (through codex54.js), the pack served to
   the engine's boot fetch. It draws the question bank, #/quizzes, the
   Practise root, the Grapes root, the Library, the level page, the
   Rehearsal room and Wine studies as their string builders draw them, holds
   each to the flow's spec, prints the parents of the views named and the
   search index's groups. The DOM passes (the level page's illustrated door,
   the Library's regions door and placeholder, the section screens' words)
   are proven in Chromium by .wip/prove-flow-dom.mjs.

     node .wip/prove-flow.cjs [--pack <file>] [--eval <expr>] [--show <name>]

   --show prints one builder's HTML: bank, quizzes, practise, grapes,
   library, level, rehearsal, studies. Work in progress, kept on
   codex54-wip; never shipped. */
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
const EVAL = opt('--eval');
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
/* before the shell names it, the layer is loaded where index.html will: after codex53.js, before boot.js */
const SHELL = FILES.indexOf('codex54.js') >= 0;
if (!SHELL && FILES.indexOf('boot.js') > 0) FILES.splice(FILES.indexOf('boot.js'), 0, 'codex54.js');
for (const f of FILES) {
  try { vm.runInContext(fs.readFileSync(path.join(JS, f), 'utf8'), D.ctx, { filename: f }); }
  catch (e) { console.error('prove-flow: js/' + f + ' failed to load: ' + e.message); process.exit(1); }
}
const tick = (ms) => new Promise((r) => setTimeout(r, ms || 10));

const SHOW = opt('--show');
const text = (html) => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/\s+/g, ' ').trim();
const DASH = new RegExp(['\\u2014', '\\u2013', '&' + 'mdash;', '&' + 'ndash;', '&#' + '8212;', '&#' + '8211;', '&#x' + '2014;', '&#x' + '2013;', ' ' + '-'.repeat(2) + ' '].join('|'), 'i');
/* the rows of an HTML string: [name, line, the attributes that route it] */
function rows(html) {
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
}
const heads = (html) => [...String(html || '').matchAll(/<(h2|h3|summary)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => text(m[2]));
const has = (list, f) => list.some(f);
const BUILD = {
  bank: 'v53BankHtml()',
  quizzes: 'v32QuizzesHtml()',
  practise: 'v32FlashcardsHtml()',
  grapes: 'v53GrapesRootHtml()',
  library: 'v32LibraryHtml()',
  level: 'v32LevelHtml(activeLevel)',
  rehearsal: 'v48HubHtml("houserehearsal", v41House())',
  studies: 'v48HubHtml("housestudies", v41House())'
};

(async () => {
  try { await D.G('typeof V27_LAST !== "undefined" ? V27_LAST : null'); } catch (e) { }
  try { await D.G('typeof V27_BOOT_PACK !== "undefined" ? V27_BOOT_PACK : null'); } catch (e) { }
  await tick(30);
  try { await D.G('typeof V27_WRITING !== "undefined" ? V27_WRITING : null'); } catch (e) { }
  await tick(30);
  const n = D.G('(v28House() && v28House().wines || []).length');
  console.log('prove-flow: ' + FILES.length + ' scripts, codex54 at ' + (FILES.indexOf('codex54.js') + 1) + ', the house holds ' + n + ' wines, level ' + D.G('activeLevel'));
  if (EVAL) { console.log(D.G(EVAL)); return; }
  const draw = (k) => { const prev = D.G('S.view'); D.G('S.view = ' + JSON.stringify(k === 'level' ? 'level' : k === 'practise' ? 'flashcards' : k === 'rehearsal' ? 'houserehearsal' : k === 'studies' ? 'housestudies' : k)); const html = String(D.G(BUILD[k]) || ''); D.G('S.view = ' + JSON.stringify(prev)); return html; };
  if (SHOW) { console.log(draw(SHOW)); return; }
  const H = {};
  Object.keys(BUILD).forEach((k) => { H[k] = draw(k); });
  Object.keys(H).forEach((k) => {
    check(k + ': drawn whole, no undefined, NaN or [object Object], tags balanced', H[k].length > 200 && !CH.cleanProblem(H[k]), CH.cleanProblem(H[k]));
    check(k + ': carries no dash', !DASH.test(text(H[k])), (DASH.exec(text(H[k])) || [''])[0]);
  });
  require(path.join(__dirname, 'flow-checks.cjs'))({ D, H, rows, heads, text, has, check, draw, house });
  console.log('');
  console.log('prove-flow: ' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error('prove-flow: ' + (e && e.stack || e)); process.exit(1); });
