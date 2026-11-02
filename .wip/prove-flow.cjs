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
  const G = D.G;
  const L = G('v53Lv().name');
  const names = (html) => rows(html).map((r) => r.name);
  const routes = (html) => rows(html).map((r) => r.route);
  const sectionOf = (html, id) => { const at = html.indexOf('id="' + id + '"'); if (at < 0) return ''; const end = html.indexOf('</section>', at); return html.slice(at, end < 0 ? html.length : end); };
  const goRow = (list, key) => list.filter((r) => new RegExp('(^| )go=' + key + '( |$)').test(r.route));
  const gdeck = (r) => /deck=grapes(:[rw]|-all)?( |$)/.test(r.route);

  /* ---- 1. the question bank ---- */
  console.log('');
  console.log('--- the question bank (#/v/bank) and #/quizzes ---');
  const B = rows(H.bank), Q = rows(H.quizzes);
  console.log('  bank: ' + heads(H.bank).join(' | '));
  check('the bank is named The ' + L + ' question bank', heads(H.bank)[0] === 'The ' + L + ' question bank', heads(H.bank)[0]);
  const bh = heads(H.bank);
  const order = ['The whole paper', 'The regions', 'Service references', 'Hands on'].map((h) => bh.indexOf(h));
  check('the bank gains The whole paper, The regions, Service references and Hands on, in that order, after the domains', order.every((i, k) => i > 1 && (k === 0 || i > order[k - 1])), order.join(','));
  check('the bank\'s lifted rows are the chain\'s own Quizzes rows (codex32 and codex39)', goRow(B, 'weak').length === 1 && goRow(B, 'regiondrill').length >= 2 && goRow(B, 'servicedrill').length === 1 && goRow(B, 'service').length === 1 && goRow(B, 'grid').length === 1);
  check('the level test once, in the bank\'s lead', B.filter((r) => /k=leveltest/.test(r.route)).length === 1);
  check('no Blind flight, no codex39 45 minute tasting, no second endless row in the bank', !goRow(B, 'flight').length && !goRow(B, 'villagetasting').length && !goRow(B, 'endless').length);
  check('codex39\'s 45 minute run still answers its address', G('typeof V25_GO.villagetasting === "function"'));
  check('#/quizzes draws the bank: the same title and the same rows', heads(H.quizzes)[0] === 'The ' + L + ' question bank' && JSON.stringify(routes(H.quizzes)) === JSON.stringify(routes(H.bank)), heads(H.quizzes)[0]);
  check('#/quizzes carries its own scope chip (scope-all acts on the quizzes root)', /data-v32="scope-all"|data-v32="scope-one"/.test(H.quizzes) && H.quizzes.indexOf('v54-quizbank') > 0);
  check('the main name of #/quizzes is the bank\'s', G('(function () { var w = S.view; S.view = "quizzes"; var n = v25MainName(); S.view = w; return n; })()') === 'The ' + L + ' question bank');

  /* ---- the Practise root ---- */
  console.log('');
  console.log('--- the Practise root (#/practise) ---');
  const P = rows(H.practise);
  console.log('  ' + heads(H.practise).join(' | '));
  check('the rounds row points at the bank', P.some((r) => /rounds$/.test(r.name) && /go=bank/.test(r.route)) && !goRow(P, 'quizzes').length);
  check('no grape deck on the Practise root (Grapes owns them)', !P.some(gdeck), P.filter(gdeck).map((r) => r.name).join(','));
  check('no Blind flight and no level test on the Practise root', !goRow(P, 'flight').length && !P.some((r) => /k=leveltest/.test(r.route)));
  check('no empty group left (Reference cards leaves whole)', heads(H.practise).indexOf('Reference cards') < 0 && !/<section class="v32-group[^"]*"[^>]*><h3[^>]*>[^<]*<\/h3><\/section>/.test(H.practise));
  check('Due today\'s button reads Start today’s questions', P.some((r) => r.name === 'Start today’s questions'));

  /* ---- 2. one Village tasting: Grapes ---- */
  console.log('');
  console.log('--- the Grapes root (#/v/grapes) ---');
  const T = names(sectionOf(H.grapes, 'v53-g-tasting'));
  console.log('  Tasting: ' + T.join(' | '));
  check('Grapes\' Tasting reads The Court’s grid drill, The Village tasting, Warm up: call the structure, The deductive grid', JSON.stringify(T) === JSON.stringify(['The Court’s grid drill', 'The Village tasting', 'Warm up: call the structure', 'The deductive grid']), T.join(' | '));
  check('the Village tasting is the 30 minute one on the Court\'s grid', rows(sectionOf(H.grapes, 'v53-g-tasting')).some((r) => /go=courttasting/.test(r.route) && /30 minutes/.test(r.line)));
  check('Warm up keeps the Blind Grid\'s line', rows(sectionOf(H.grapes, 'v53-g-tasting')).some((r) => r.name === 'Warm up: call the structure' && /go=grid/.test(r.route) && r.line === 'The structure called from its sensations, then the grape'));
  const C = rows(sectionOf(H.grapes, 'v53-g-cards'));
  check('Grapes\' Cards holds the four grape decks', C.filter(gdeck).length === 4, C.map((r) => r.route).join(','));
  check('Blind flight cut from Grapes, Hands on and the Rehearsal room; its view kept', !goRow(rows(H.grapes), 'flight').length && !goRow(B, 'flight').length && !goRow(rows(H.rehearsal), 'flight').length && G('typeof V25_GO.flight === "function"'));
  const tg = Object.keys(H).filter((k) => H[k].indexOf('data-go="tastegrid"') >= 0);
  check('the method shows as How to taste: the method in the reading rooms only', JSON.stringify(tg) === JSON.stringify(['library']) && rows(H.library).filter((r) => r.name === 'How to taste: the method').length === 1 && H.library.indexOf('Study the grid') < 0, tg.join(','));

  /* ---- 3. the level page ---- */
  console.log('');
  console.log('--- the level page (#/level) ---');
  const LV = rows(H.level);
  console.log('  ' + heads(H.level).slice(0, 2).join(' | ') + ' | ' + LV.slice(0, 6).map((r) => r.name).join(', '));
  check('the level page has no search box', H.level.indexOf('id="v32-q"') < 0 && H.level.indexOf('v32-search-h') < 0);
  check('the level page loses the World Map row', !goRow(LV, 'worldmap').length);
  check('the level page keeps the Workshop row', goRow(LV, 'techniques').length === 1);

  /* ---- 4. the Library ---- */
  console.log('');
  console.log('--- the Library (#/library) ---');
  const LB = rows(H.library);
  console.log('  ' + heads(H.library).filter((h) => /^(Practise|The reading rooms|The atlas)$/.test(h)).join(' | '));
  check('the Library loses the Terroir row', !goRow(LB, 'terroir').length);
  check('the Library\'s line reads For ' + L + ': Practise and the question bank first, then the reading rooms and the atlas.', text(H.library).indexOf('For ' + L + ': Practise and the question bank first, then the reading rooms and the atlas.') >= 0);
  check('the line for every level is as true', G('v32W("libLineAll")') === 'For every level: Practise and the question bank first, then the reading rooms and the atlas.');
  check('the Library\'s search box stays, its placeholder A chapter, a grape, a place, a producer or a subject', /id="cf-in"/.test(H.library) && H.library.indexOf('placeholder="A chapter, a grape, a place, a producer or a subject"') > 0);
  check('the Library\'s Practise section follows the root (no grape decks, the rounds to the bank)', !LB.some(gdeck) && LB.some((r) => /rounds$/.test(r.name) && /go=bank/.test(r.route)));
  const another = G('(function () { var seen = null; var was = v32Go; v32Go = function (r) { seen = r; }; try { v32Act("another", null); } finally { v32Go = was; } return JSON.stringify(seen); })()');
  check('Another deck returns to the Library', another === '{"view":"library"}', another);

  /* ---- 5. Brennan's rooms ---- */
  console.log('');
  console.log('--- Service rehearsal and Wine studies ---');
  const R = rows(H.rehearsal);
  console.log('  rehearsal: ' + heads(H.rehearsal).filter((h) => !/^(Wine list|Wine studies|Service rehearsal|House reference)$/.test(h)).join(' | '));
  check('the house due is one row, Wine cards to revisit, dealt by codex53\'s house step', R.filter((r) => r.name === 'Wine cards to revisit').length === 1 && R.some((r) => r.name === 'Wine cards to revisit' && /v53=housedue/.test(r.route) && /wines? from our list/.test(r.line)) && !/Start the wines due/.test(H.rehearsal));
  check('no second Wine cards to revisit deck (list-weak) in the focused round', !R.some((r) => /deck=list-weak/.test(r.route)));
  check('the schedule note is gone', H.rehearsal.indexOf('Due today follows') < 0);
  check('the producers\' deck group is named Producer cards', heads(H.rehearsal).indexOf('Producer cards Every producer, and a deck per region') >= 0 && heads(H.rehearsal).every((h) => !/^Who makes our wines/.test(h)));
  const own0 = G('v54OwnCount()');
  check('with no bottles of her own: no Recite your cellar, no Quiz your cellar (the house\'s ' + n + ' never count)', own0 === 0 && !goRow(R, 'cellarrecite').length && !goRow(R, 'cellardrill').length, own0);
  G('ST.cellar = (ST.cellar || []).concat([{ id: "prove-own", name: "Prove sentinel", producer: "Own wine", region: "Test place", grapes: "Chardonnay" }]);');
  const own1 = G('v54OwnCount()');
  const R1html = draw('rehearsal');
  const ownSec = (() => { const at = R1html.indexOf('data-v48-keep="v54-own"'); return at < 0 ? '' : R1html.slice(at, R1html.indexOf('</details>', at)); })();
  check('with one bottle of her own: Your own bottles holds Recite your cellar and Quiz your cellar', own1 === 1 && /Your own bottles/.test(ownSec) && goRow(rows(ownSec), 'cellarrecite').length === 1 && goRow(rows(ownSec), 'cellardrill').length === 1, own1 + ' ' + text(ownSec).slice(0, 160));
  G('ST.cellar = ST.cellar.filter(function (w) { return w.id !== "prove-own"; });');
  const W = rows(H.studies);
  console.log('  studies: ' + heads(H.studies).filter((h) => !/^(Wine list|Wine studies|Service rehearsal|House reference)$/.test(h)).join(' | '));
  check('Wine studies without the World Map, the grape study cards and the service reference', !W.some((r) => /route=worldmap|route=serviceref/.test(r.route) || gdeck(r)) && H.studies.indexOf('wider-study') < 0);
  check('the Culinary Companion stays in Wine studies, owned by the house', W.some((r) => /v48-route=culinary/.test(r.route)) && G('V32_OWNER.culinary') === 'brennans');

  /* ---- 6. the parents ---- */
  console.log('');
  console.log('--- the parents ---');
  const parent = (setup) => G('(function () { var keep = { v: S.view, deck: S._v32deck, run: S._v32run, from: S._v54from, sec: S.section }; try { ' + setup + '; return JSON.stringify(v32ParentRoute()); } catch (e) { return "throws " + e.message; } finally { S.view = keep.v; S._v32deck = keep.deck; S._v32run = keep.run; S._v54from = keep.from; S.section = keep.sec; } })()');
  const startFrom = (fromSetup, runView) => parent(fromSetup + '; V54_FROM.prev = null; v54NoteFrom(); S.view = ' + JSON.stringify(runView) + '; v54NoteFrom()');
  const T6 = [
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
    ['deck regions (unchanged)', 'S.view = "deck"; S._v32deck = "regions"', null],
    ['culinary', 'S.view = "culinary"', '{"view":"housestudies"}'],
    ['cellarcompass (unchanged)', 'S.view = "cellarcompass"', '{"view":"level"}'],
    ['deck cellar-compass (unchanged)', 'S.view = "deck"; S._v32deck = "cellar-compass"', '{"view":"cellarcompass"}'],
    ['bank', 'S.view = "bank"', '{"view":"library"}'],
    ['courttasting', 'S.view = "courttasting"', '{"view":"grapes"}']
  ];
  T6.forEach(([label, setup, want, fn]) => {
    const got = fn ? fn() : parent(setup);
    console.log('  ' + label.padEnd(52) + ' -> ' + got);
    if (want) check('parent of ' + label, got === want, got);
  });
  check('the lit word of a grape deck is Grapes wherever it opened', G('(function () { var k = { v: S.view, d: S._v32deck, f: S._v53from }; S.view = "deck"; S._v32deck = "grapes:w"; S._v53from = null; var w = v25NavWord(); S.view = k.v; S._v32deck = k.d; S._v53from = k.f; return w; })()') === 'grapes');
  check('a run started by a real draw keeps its starting screen (render wrapped)', (() => { try { return G('(function () { S.view = "bank"; render(); var cat = Object.keys(cats())[0]; V25_GO.drill(cat); var r = S.view + " " + JSON.stringify(v32ParentRoute()); S.view = "home"; render(); return r; })()') === 'quiz {"view":"bank"}'; } catch (e) { return false; } })());

  /* ---- 7. the search ---- */
  console.log('');
  console.log('--- the search index ---');
  const ix = JSON.parse(G('JSON.stringify(Object.keys(v44Index()).map(function (k) { var g = v44Index()[k]; return [k, g.length, g.length ? (g[0].kind + ":" + g[0].arg) : ""]; }))'));
  ix.forEach(([k, len, first]) => console.log('  ' + k.padEnd(10) + ' ' + String(len).padStart(5) + '  first ' + first));
  const ixm = Object.fromEntries(ix.map(([k, len]) => [k, len]));
  check('the index gains the 44 subjects', ixm.subjects === 44, ixm.subjects);
  check('the grapes group is the 59 grape pages, each opening its page', ixm.grapes === 59 && G('v44Index().grapes.every(function (e) { return e.kind === "route" && e.arg === "grape" && !!v53GrapeFind(e.extra); })'));
  const hitsB = JSON.parse(G('JSON.stringify(v44Results("bordeaux").map(function (g) { return [g.key, g.title, g.rows.length]; }))'));
  console.log('  "bordeaux": ' + hitsB.map((g) => g[1] + ' ' + g[2]).join(' | '));
  check('a search for bordeaux finds the Court’s subject', hitsB.some((g) => g[0] === 'subjects' && g[1] === 'The Court’s subjects'));
  const pin = JSON.parse(G('JSON.stringify((v44Results("pinot noir").filter(function (g) { return g.key === "grapes"; })[0] || { rows: [] }).rows.slice(0, 2).map(function (r) { return [r.title, r.kind, r.arg, r.extra]; }))'));
  check('a grape hit opens the grape\'s page (route grape/{slug})', pin.length && pin[0][1] === 'route' && pin[0][2] === 'grape' && pin[0][3] === 'pinot-noir', JSON.stringify(pin));
  check('the grapes group is titled Grapes', G('(v44Results("riesling").filter(function (g) { return g.key === "grapes"; })[0] || {}).title') === 'Grapes');
  check('the search names The World Map and How to taste: the method', G('v44Index().learn.some(function (e) { return e.arg === "worldmap" && e.title === "The World Map"; }) && v44Index().learn.some(function (e) { return e.arg === "tastegrid" && e.title === "How to taste: the method"; })'));
  check('the index\'s walk holds groups of rows and nothing else', G('Object.keys(v44Index()).every(function (k) { return Array.isArray(v44Index()[k]); })'));

  /* ---- 8. the stale words ---- */
  console.log('');
  console.log('--- the stale words ---');
  check('Start today’s questions', G('v32W("startToday")') === 'Start today’s questions');
  check('the World Map named in our rows (codex39\'s row word, codex42\'s path step)', G('V39_WORDS.atlasRow') === 'The World Map' && G('V42_PATHS.every(function (p) { return (p.steps || []).every(function (s) { return String(s[2]).indexOf("Wine Atlas") < 0; }); })'));
  check('Keep one on Our Wine List reworded', G('V27_SAY_NONE').indexOf('Our Wine List') < 0 && /wine list/.test(G('V27_SAY_NONE')), G('V27_SAY_NONE'));
  const synth = JSON.parse(G('JSON.stringify(v53GrapeJoin().list.filter(function (r) { return !r.g; }).map(function (r) { return r.slug; }))'));
  const faces = JSON.parse(G('JSON.stringify(v53GrapeJoin().list.filter(function (r) { return !r.g; }).map(function (r) { var d = v32DeckDef("grape:" + r.slug); var c = d.cards[0]; return c ? v32CardFace(c, { flip: true, dir: "n2p" }) : ""; }))'));
  check('the ' + synth.length + ' synthetic "No comparison is written" lines are dropped from the grape cards', synth.length === 12 && faces.every((f) => f && f.indexOf('No comparison is written') < 0 && f.indexOf('undefined') < 0), synth.length);
  check('Our List keeps its stored key (V27_CELLAR_SECTION)', G('V27_CELLAR_SECTION') === 'Our List');
  console.log('');
  console.log('prove-flow: ' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error('prove-flow: ' + (e && e.stack || e)); process.exit(1); });
