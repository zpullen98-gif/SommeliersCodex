/**
 * THE CONSOLIDATION'S NAV, HELD TO ITS DESIGN (codex32).
 *
 * WorldTable docs/consolidation-design.md, sections 2, 5 and 7.4: four tab
 * words and a quiet More, every old view landing somewhere sensible, one
 * history model (codex28's and codex29's entries folded in), and one Back
 * whose chain walks down exactly as the screens were walked up.
 *
 * Loads the SHIPPED chain, with the shared house engine and the Brennan's
 * pack, in a VM whose history is a real stack (pushState, replaceState,
 * back, a popstate fired on every back), whose location follows it, and
 * whose sessionStorage is a Map. What it asserts:
 *
 *   1. V25_NAV is the five, More last; every view codex32 knows has an
 *      owner and a parent, never itself; home has none
 *   2. every route in 5.4 round-trips: the screen to its address, the
 *      address applied back to the same screen
 *   3. the push model: test 1's walk makes four pushes with ootd 1 to 4, a
 *      flip and a grade replace, and four Backs walk down to Home; a cold
 *      deep link gives depth 0 and replaces up to Home without growing the
 *      history
 *   4. one action, one entry: an Our List card opened through the
 *      reassigned v28Push makes exactly one entry carrying ootd and
 *      #/v/cellar/{id}, the render after it replaces, and a pop closes it;
 *      the full list the same
 *   5. a pop to results with the results in memory draws them, Study the
 *      misses pushed above them included; a pop to a run memory no longer
 *      holds falls to its parent
 *   6. old addresses land: #wine=<id> (the card), #list, a bare /codex/,
 *      #/v/mine (More), #/v/today (the level page)
 *   7. the home is section.levels only; one Back on every view but home;
 *      no Back to Mine and no data-v28="back" left on Our List's card
 *   8. Due today on a fresh record with a house deals unseen wines and says
 *      so; with nothing due and nothing new it goes to the quick quiz
 *   9. the Library's first row is The full wine list when a house is here;
 *      no two Quizzes rows begin with the same three words
 *  10. a hash link is adopted one deeper, never doubled; a reload keeps the
 *      depth through the mirror; the scope chip refilters each root in
 *      place; the search query survives Back; an opener with no id is
 *      remembered by its attributes
 *  11. voice: codex32 draws no "Level" and a roman numeral, no mark at or
 *      above U+2190, no dash; it declares with var and function only
 *  12. mutation: with --mutations, five broken copies of codex32.js (the
 *      URL-less pushState restored in v28Push, a replace put back in the
 *      push path, a parent that is the view itself, a sixth tab word, Back
 *      drawn twice) must each turn this check red
 *
 *   node .scripts/check-nav.js [jsDir] [--mutations]
 *
 * Needs the shared engine (OOT_SHARED, else ../worldtable/static/shared).
 * Exits non-zero if any check fails. The last line is the verdict.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const ARGS = process.argv.slice(2);
const JS = ARGS.find((a) => a.charAt(0) !== '-') || path.join(__dirname, '..', 'js');
const MUTATIONS = ARGS.indexOf('--mutations') >= 0;
const SHARED = process.env.OOT_SHARED
  || path.join(__dirname, '..', '..', 'worldtable', 'static', 'shared');
const ENGINE = path.join(SHARED, 'oot-house.js');
const UI_FILE = path.join(SHARED, 'oot-house-ui.js');
const PACK_FILE = path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
for (const f of [ENGINE, UI_FILE, PACK_FILE]) {
  if (!fs.existsSync(f)) {
    console.error('check-nav: no ' + path.basename(f) + ' at ' + SHARED + ' (set OOT_SHARED)');
    process.exit(1);
  }
}
if (!fs.existsSync(path.join(JS, 'codex32.js'))) {
  console.log('check-nav: no codex32.js in ' + JS + ', SKIPPED');
  process.exit(0);
}

const OPTIONAL = new Set(['codex13.js', 'data-firstpath.js']);
const FILES = ['data-questions.js', 'reference.js', 'core.js', 'codex2.js', 'codex3.js',
  'codex4.js', 'codex5.js', 'data-primers.js', 'codex6.js', 'data-intro.js',
  'data-primers-intro.js', 'data-grapes-plus.js', 'data-tasting.js', 'data-floor.js',
  'data-pairing.js', 'data-maps.js', 'data-advanced.js', 'data-primers-advanced.js',
  'data-master.js', 'data-primers-master.js', 'codex7.js', 'codex8.js', 'codex9.js',
  'codex10.js', 'codex11.js', 'codex12.js', 'data-firstpath.js', 'codex13.js', 'codex14.js',
  'codex15.js', 'data-producers.js', 'menu-desk.js', 'wine-rows.js', 'codex16.js',
  'codex17.js', 'codex18.js', 'codex19.js', 'codex20.js', 'codex21.js', 'codex22.js',
  'codex23.js', 'codex24.js', 'codex25.js', 'codex26.js', 'codex27.js', 'codex28.js', 'codex29.js',
  'codex30.js', 'codex32.js', 'codex34.js', 'boot.js'];

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

const NUMERAL_RE = /\bLevel\s+(I|II|III|IV)\b/;
function voiceProblems(s) {
  const out = [];
  if (s.indexOf(String.fromCharCode(0x2014)) >= 0) out.push('a long dash (U+2014)');
  if (s.indexOf(String.fromCharCode(0x2013)) >= 0) out.push('an en dash (U+2013)');
  if (/&(mdash|ndash|#8212|#8211|#x2014|#x2013);/i.test(s)) out.push('a dash entity');
  if (/\x20-{2}\x20/.test(s)) out.push('a double hyphen');
  if (NUMERAL_RE.test(s)) out.push('a level numeral: ' + s.match(NUMERAL_RE)[0]);
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c >= 0x2190) { out.push('a mark U+' + c.toString(16).toUpperCase()); break; }
  }
  return out;
}

/* A sandbox with a real history: a stack of { state, url }, a location
   that follows it, popstate fired on back, and a Map for sessionStorage. */
function makeSandbox(seed, start) {
  const store = Object.create(null);
  Object.keys(seed || {}).forEach((k) => { store[k] = seed[k]; });
  const sess = Object.create(null);
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
  const listeners = { popstate: [], storage: [], pageshow: [] };
  const origin = 'http://localhost';
  const loc = { origin, pathname: '/codex/', search: '', hash: '', href: '' };
  const setUrl = (u) => {
    const m = /^([^?#]*)(\?[^#]*)?(#.*)?$/.exec(u || '');
    if (m[1]) loc.pathname = m[1];
    loc.search = m[2] || '';
    loc.hash = m[3] || '';
    loc.href = origin + loc.pathname + loc.search + loc.hash;
  };
  setUrl(start || '/codex/');
  const H = { entries: [{ state: null, url: loc.pathname + loc.search + loc.hash }], idx: 0, pushes: 0, replaces: 0 };
  const history = {
    get state() { return H.entries[H.idx].state; },
    get length() { return H.entries.length; },
    scrollRestoration: 'auto',
    pushState(s, t, u) {
      H.entries = H.entries.slice(0, H.idx + 1);
      H.entries.push({ state: s == null ? null : JSON.parse(JSON.stringify(s)), url: u == null ? H.entries[H.idx].url : u });
      H.idx++; H.pushes++;
      if (u != null) setUrl(u);
    },
    replaceState(s, t, u) {
      H.entries[H.idx] = { state: s == null ? null : JSON.parse(JSON.stringify(s)), url: u == null ? H.entries[H.idx].url : u };
      H.replaces++;
      if (u != null) setUrl(u);
    },
    back() { go(-1); },
    forward() { go(1); },
    go(n) { go(n); },
  };
  function go(n) {
    const to = H.idx + n;
    if (to < 0 || to >= H.entries.length) return;
    H.idx = to;
    setUrl(H.entries[to].url);
    const ev = { state: H.entries[to].state };
    listeners.popstate.slice().forEach((fn) => fn(ev));
  }
  /* a hash link the browser follows for itself: a new entry with no state */
  function followHash(h) {
    H.entries = H.entries.slice(0, H.idx + 1);
    H.entries.push({ state: null, url: loc.pathname + loc.search + h });
    H.idx++;
    setUrl(loc.pathname + loc.search + h);
    listeners.popstate.slice().forEach((fn) => fn({ state: null }));
  }
  const sandbox = {
    console,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    },
    sessionStorage: {
      getItem: (k) => (k in sess ? sess[k] : null),
      setItem: (k, v) => { sess[k] = String(v); },
      removeItem: (k) => { delete sess[k]; },
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
    speechSynthesis: undefined, Notification: undefined,
    performance: { now: () => 0 },
    URL: globalThis.URL, Blob: globalThis.Blob, TextEncoder: globalThis.TextEncoder,
    Intl: globalThis.Intl, Date: globalThis.Date, Math: globalThis.Math, JSON: globalThis.JSON,
    Promise: globalThis.Promise, Map: globalThis.Map, Set: globalThis.Set,
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.document = {
    documentElement: stubEl(), head: stubEl(), body: stubEl(),
    createElement: stubEl, createDocumentFragment: stubEl, createTextNode: () => stubEl(),
    getElementById: stubEl, querySelector: stubEl, querySelectorAll: () => [],
    addEventListener() { }, removeEventListener() { },
    readyState: 'complete', title: '', referrer: '',
    get activeElement() { return null; },
    get head() { return stubEl(); }, get body() { return stubEl(); },
  };
  const ctx = vm.createContext(sandbox);
  const G = (expr) => vm.runInContext(expr, ctx);
  return { sandbox, ctx, G, store, sess, listeners, H, loc, followHash };
}

function loadChain(D) {
  for (const f of FILES) {
    const p = path.join(JS, f);
    if (!fs.existsSync(p)) {
      if (OPTIONAL.has(f)) continue;
      console.error('missing ' + f + ' in ' + JS);
      process.exit(1);
    }
    try { vm.runInContext(fs.readFileSync(p, 'utf8'), D.ctx, { filename: f }); }
    catch (e) {
      console.error('FAILED to load ' + f + ': ' + e.message);
      console.error(String(e.stack).split('\n').slice(0, 6).join('\n'));
      process.exit(1);
    }
  }
}

const tick = (ms) => new Promise((r) => setTimeout(r, ms || 10));
const packText = fs.readFileSync(PACK_FILE, 'utf8');
const house = JSON.parse(packText).house;

function bootDevice(opts) {
  const o = opts || {};
  const D = makeSandbox(o.seed || {}, o.start);
  if (o.sess) Object.keys(o.sess).forEach((k) => { D.sess[k] = o.sess[k]; });
  if (o.state !== undefined) D.H.entries[0].state = o.state;
  if (o.house !== false) {
    vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), D.ctx, { filename: 'oot-house.js' });
    vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), D.ctx, { filename: 'oot-house-ui.js' });
    const lib = D.G('OOT.houseLib');
    D.sandbox.OOT.house = lib.createHouseApi(lib.mapStorage(new Map()), { win: D.sandbox, now: () => NOW, rand: seeded(21), from: 'codex' });
    D.sandbox.fetch = () => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(packText), json: () => Promise.resolve(JSON.parse(packText)) });
  }
  loadChain(D);
  return D;
}
async function settle(D) {
  try { await D.G('typeof V27_LAST !== "undefined" ? V27_LAST : null'); } catch (e) { }
  try { await D.G('typeof V27_BOOT_PACK !== "undefined" ? V27_BOOT_PACK : null'); } catch (e) { }
  await tick(30);
  try { await D.G('typeof V27_WRITING !== "undefined" ? V27_WRITING : null'); } catch (e) { }
  await tick(20);
}
const wineId = (re) => (house.wines.find((w) => re.test(w.name)) || {}).id;

async function main() {
  /* ================================================================ */
  section('1. the five words, the owners and the parents');
  const D = bootDevice({});
  await settle(D);
  const G = D.G;
  check('V25_NAV is Home, Flashcards, Quizzes, Library, More', G('V25_NAV.map(function(w){return w[1];}).join("|")') === 'Home|Flashcards|Quizzes|Library|More',
    G('V25_NAV.map(function(w){return w[1];}).join("|")'));
  const navHtml = G('S.view = "home"; v25NavHtml()');
  check('the bar draws four tabs and More last, More quiet (class v32more), lit word aria-current',
    (navHtml.match(/class="navword"/g) || []).length === 4 && /class="navword v32more"[^>]*>More<\/button><\/nav>$/.test(navHtml)
    && /data-nav="home" aria-current="page"/.test(navHtml));
  const owners = G('Object.keys(V32_OWNER)');
  const parents = G('Object.keys(V32_PARENT)');
  check('every view with an owner has a parent entry, and the other way round (' + owners.length + ')',
    owners.length === parents.length && owners.every((v) => parents.indexOf(v) >= 0));
  const bad = parents.filter((v) => G('V32_PARENT[' + JSON.stringify(v) + ']') === v);
  check('no view is its own parent', !bad.length, bad.join(', '));
  check('home has no parent, every other view has one', G('V32_PARENT.home') === null
    && parents.filter((v) => v !== 'home').every((v) => typeof G('V32_PARENT[' + JSON.stringify(v) + ']') === 'string'));
  check('every parent is itself a known view', parents.every((v) => { const p = G('V32_PARENT[' + JSON.stringify(v) + ']'); return p === null || parents.indexOf(p) >= 0; }));
  const words = ['home', 'flashcards', 'quizzes', 'library', 'more'];
  check('every owner is one of the five words', owners.every((v) => words.indexOf(G('V32_OWNER[' + JSON.stringify(v) + ']')) >= 0));
  const walkUp = parents.filter((v) => {
    let cur = v, n = 0;
    while (cur && n < 10) { cur = G('V32_PARENT[' + JSON.stringify(cur) + ']'); n++; }
    return cur !== null;
  });
  check('every view walks up to home within ten steps', !walkUp.length, walkUp.join(', '));

  /* ================================================================ */
  section('2. every route round-trips');
  const LEAF = wineId(/Leflaive/);
  const routes = [
    ['home', 'S.view = "home"'], ['level', 'S.view = "level"'],
    ['flashcards', 'S._v32all = null; S.view = "flashcards"'], ['flashcards, all', 'v32All().flashcards = true; S.view = "flashcards"'],
    ['deck list', 'S._v32deck = "list"; S.view = "deck"'], ['deck grapes:r', 'S._v32deck = "grapes:r"; S.view = "deck"'],
    ['quizzes', 'v32All().quizzes = false; S.view = "quizzes"'], ['quizzes, all', 'v32All().quizzes = true; S.view = "quizzes"'],
    ['library', 'v32All().library = false; S.view = "library"'], ['more', 'S.view = "more"'],
    ['our list', 'v28State().open = null; v28State().sec = ""; S.view = "cellar"'],
    ['our list card', 'v28State().open = ' + JSON.stringify(LEAF) + '; S.view = "cellar"'],
    ['our list section', 'v28State().open = null; v28State().sec = v32Sections()[1].section; S.view = "cellar"'],
    ['primer', 'S.primerKey = "Burgundy"; S.view = "primer"'], ['primers', 'S.view = "primers"'],
    ['producers country', 'S._prod = { c: 2, id: null }; S.view = "producers"'],
    ['compendium section', 'S.cmp = { sec: "class", idx: null, reg: null }; S.view = "compendium"'],
    ['videos topic', 'S.vidFocus = "Burgundy"; S.view = "videos"'], ['dash', 'S.view = "dash"'],
    ['fulllist', 'S.view = "fulllist"'], ['housevideos', 'S.view = "housevideos"'], ['menudesk', 'S.view = "menudesk"']
  ];
  G('applyLevel("certified", true)');
  routes.forEach(([name, set]) => {
    G(set);
    const h1 = G('v32Route().hash');
    const view1 = G('S.view');
    G('S.view = "home"; S.primerKey = null; S._prod = { c: null, id: null }; S.cmp = null; S.vidFocus = null;');
    G('v32Apply(v32Parse(' + JSON.stringify(h1) + '), null)');
    const h2 = G('v32Route().hash');
    check('[' + name + '] ' + h1 + ' round-trips', h1 === h2 && G('S.view') === view1, h2 + ' / ' + G('S.view'));
  });
  check('a section address can never be read as a wine', G('JSON.stringify(v32Parse("#/v/cellar/section/" + ' + JSON.stringify(LEAF) + '))').indexOf('"arg"') < 0
    && G('v32Parse("#/v/cellar/" + ' + JSON.stringify(LEAF) + ').arg') === LEAF);

  /* ================================================================ */
  section('3. the push model: test 1, then the four Backs');
  const T = bootDevice({});
  await settle(T);
  const g = T.G;
  g('render()');
  const len0 = T.H.entries.length;
  const d = () => g('history.state && history.state.ootd');
  g('v25ChooseLevel("certified")');
  check('a level card pushes the level page at depth 1', g('S.view') === 'level' && d() === 1 && T.loc.hash === '#/level', g('S.view') + ' ' + d());
  g('v25Nav("flashcards")');
  check('the Flashcards tab pushes at depth 2', g('S.view') === 'flashcards' && d() === 2 && T.loc.hash === '#/flashcards');
  g('v32OpenDeck("list")');
  check('a deck row pushes the deck screen at depth 3', g('S.view') === 'deck' && d() === 3 && T.loc.hash === '#/flashcards/list');
  g('v32StartRun(S._v32deck, { push: true })');
  check('Start pushes the card screen at depth 4', g('S.view') === 'housedeck' && d() === 4 && T.loc.hash === '#/flashcards/list/card');
  const lenRun = T.H.entries.length;
  g('v32Act("flip", null); v32Act("got", null); v32Act("flip", null); v32Act("again", null);');
  check('Flip, Got it and Again replace, the history does not grow', T.H.entries.length === lenRun && d() === 4 && g('S._v32run.done') === 1);
  check('four screens, four pushes, the entries one deeper each', T.H.entries.length === len0 + 4);
  g('v25Nav("flashcards"); v25Nav("flashcards");');
  const lenTab = T.H.entries.length;
  g('v25Nav("flashcards")');
  check('a tap on the lit tab while on its root pushes nothing', g('S.view') === 'flashcards' && T.H.entries.length === lenTab);
  g('history.back()');
  check('Back (the gesture) from Flashcards returns to the card screen with its run in memory', g('S.view') === 'housedeck' && d() === 4, g('S.view'));
  g('v32Back()');
  check('Back from the card: the deck screen', g('S.view') === 'deck' && d() === 3, g('S.view'));
  g('v32Back()');
  check('Back: Flashcards', g('S.view') === 'flashcards' && d() === 2, g('S.view'));
  g('v32Back()');
  check('Back: the level page', g('S.view') === 'level' && d() === 1, g('S.view'));
  g('v32Back()');
  check('Back: Home, depth 0', g('S.view') === 'home' && d() === 0, g('S.view'));

  const C = bootDevice({ start: '/codex/#/v/primer/3' });
  await settle(C);
  C.G('render()');
  const cl = C.H.entries.length;
  check('a cold #/v/primer/3 opens the chapter at depth 0', C.G('S.view') === 'primer' && C.G('V32.d') === 0, C.G('S.view'));
  C.G('v32Back()');
  check('Back replaces up to Study Chapters', C.G('S.view') === 'primers' && C.loc.hash === '#/v/primers');
  C.G('v32Back()');
  check('Back replaces up to Library', C.G('S.view') === 'library');
  C.G('v32Back()');
  check('Back replaces up to Home', C.G('S.view') === 'home' && C.loc.hash === '#/');
  check('the history did not grow across the three presses', C.H.entries.length === cl);

  /* ================================================================ */
  section('4. one action, one entry: codex28 and codex29 folded in');
  g('v25ChooseLevel("certified")');
  g('v32Act("studylist", null)');
  check('Study our list pushes Our List', g('S.view') === 'cellar' && T.loc.hash === '#/v/cellar');
  const before = T.H.entries.length;
  const dBefore = d();
  g('v28Open(' + JSON.stringify(LEAF) + ', false)');
  check('opening a card through the reassigned v28Push makes exactly one entry', T.H.entries.length === before + 1);
  check('and that entry carries ootd one deeper and #/v/cellar/{id}', d() === dBefore + 1 && T.loc.hash === '#/v/cellar/' + LEAF);
  const rep = T.H.replaces;
  g('render()');
  check('the render after it replaces', T.H.entries.length === before + 1 && T.H.replaces === rep + 1);
  check('codex28\'s and codex29\'s own popstate listeners are gone, codex32\'s is the one',
    T.listeners.popstate.length === 1 && T.listeners.popstate[0] === g('v32OnPop'));
  g('history.back()');
  check('a pop closes the card back to Our List', g('S.view') === 'cellar' && g('S._v28.open') === null);
  if (g('typeof v29Open') === 'function' && g('V29_MINE_ROW.show()')) {
    /* after a pop the forward entries are cut by a push, so count the position, not the length */
    const b2 = T.H.idx;
    g('v29Open("level")');
    check('the full list opens as one entry', T.H.idx === b2 + 1 && T.H.entries.length === b2 + 2 && T.loc.hash === '#/v/fulllist', (T.H.idx - b2) + ' ' + T.loc.hash + ' ' + g('S.view'));
    g('v32Back()');
    check('and Back leaves it', g('S.view') === 'cellar');
  }
  g('v28Act("weak", null)');
  check('codex28\'s own deck buttons open the one deck screen', g('S.view') === 'deck' && g('S._v32deck') === 'list-weak');

  /* ================================================================ */
  section('5. a run reached by Back renders from memory');
  g('v25Nav("quizzes"); v32StartQuick();');
  check('the quick quiz pushes question one at #/quizzes/quick', g('S.view') === 'quiz' && T.loc.hash === '#/quizzes/quick' && g('S.pool.length') === 10);
  const qLen = T.H.entries.length;
  let guard = 0;
  while (g('S.view') === 'quiz' && guard++ < 20) {
    g('(function(){ var q = S.pool[S.idx]; if (q.sa) submitSA(); else pickMC(S.idx % 3 === 0 ? (q.a + 1) % q.opts.length : q.a); next(); })()');
  }
  check('ten questions add one entry, the results replace it', g('S.view') === 'results' && T.H.entries.length === qLen && T.loc.hash === '#/v/results');
  const missed = g('S.results.filter(function(r){return !r.ok;}).length');
  const cardMiss = g('(function(){ var m = S.results.filter(function(r){return !r.ok && v32MissLink(r.q) && v32MissLink(r.q).kind === "card";}); return m.length ? v32MissLink(m[0].q).id : null; })()');
  check('the round has misses (' + missed + ')', missed > 0);
  if (cardMiss) {
    g('v32OpenWine(' + JSON.stringify(cardMiss) + ')');
    check('Study this card pushes the wine\'s card', g('S.view') === 'cellar' && T.loc.hash === '#/v/cellar/' + cardMiss);
    g('v32Back()');
    check('Back returns to the results, the same misses in memory', g('S.view') === 'results' && g('S.results.filter(function(r){return !r.ok;}).length') === missed);
    /* Study the misses pushes a NEW run; the results below it are still in memory */
    g('V32_MISSES = [' + JSON.stringify(cardMiss) + ']; v32StartRun("misses", { push: true })');
    check('Study the misses pushes the misses deck', g('S.view') === 'housedeck' && /^#\/flashcards\/misses\/[^/]+\/card$/.test(T.loc.hash), T.loc.hash);
    g('history.back()');
    check('a pop from the misses deck draws the results from memory, not their parent',
      g('S.view') === 'results' && T.loc.hash === '#/v/results' && g('S.results.filter(function(r){return !r.ok;}).length') === missed, g('S.view') + ' ' + T.loc.hash);
    g('history.forward()');
    check('and forward again finds the misses run still in memory', g('S.view') === 'housedeck' && g('S._v32run.deckId') === 'misses', g('S.view'));
    g('history.back()');
  } else check('a house miss to follow (the round dealt none this time)', true);
  g('v32Back()');
  check('Back from the results: Quizzes, not question ten', g('S.view') === 'quizzes', g('S.view'));
  g('S.pool = []; S.results = []; history.forward();');
  check('a pop to a run memory no longer holds falls to its parent', g('S.view') === 'quizzes', g('S.view'));

  /* ================================================================ */
  section('6. old addresses land');
  const BERRES = wineId(/Berres/);
  const W = bootDevice({ start: '/codex/#wine=' + BERRES });
  await settle(W);
  W.G('render()');
  check('#wine=<id> opens that card, at depth 0', W.G('S.view') === 'cellar' && W.G('S._v28.open') === BERRES && W.G('V32.d') === 0 && W.loc.hash === '#/v/cellar/' + BERRES);
  W.G('v32Back()');
  check('and its first Back goes to Our List', W.G('S.view') === 'cellar' && W.G('S._v28.open') === null);
  W.G('v32Back()');
  check('and the next to the level page', W.G('S.view') === 'level');
  const L = bootDevice({ start: '/codex/#list' });
  await settle(L);
  L.G('render()');
  check('#list opens Our List', L.G('S.view') === 'cellar' && L.loc.hash === '#/v/cellar');
  const bare = bootDevice({ start: '/codex/' });
  await settle(bare);
  bare.G('render()');
  check('a bare /codex/ opens Home', bare.G('S.view') === 'home' && bare.loc.hash === '#/');
  const mine = bootDevice({ start: '/codex/#/v/mine' });
  await settle(mine);
  mine.G('render()');
  check('#/v/mine lands on More', mine.G('S.view') === 'more' && mine.loc.hash === '#/more');
  mine.G('v32Back()');
  check('and its Back goes Home', mine.G('S.view') === 'home');
  const today = bootDevice({ start: '/codex/#/v/today' });
  await settle(today);
  today.G('render()');
  check('#/v/today lands on the level page', today.G('S.view') === 'level' && today.loc.hash === '#/level');

  /* ================================================================ */
  section('7. the home, one Back per screen, no old way back');
  const homeHtml = G('v25HomeHtml()');
  check('the home is section.levels only', /^<section class="levels" aria-label="Levels">[\s\S]*<\/section>$/.test(homeHtml) && homeHtml.indexOf('<nav') < 0);
  G('var __bk = 0; var __bkr = v32BackRow; v32BackRow = function () { __bk++; };');
  const twice = [];
  parents.forEach((v) => {
    G('__bk = 0; S.view = ' + JSON.stringify(v) + '; v32Decorate();');
    const n = G('__bk');
    if (n !== (v === 'home' ? 0 : 1)) twice.push(v + ':' + n);
  });
  G('v32BackRow = __bkr;');
  check('exactly one Back on every view but home, none on home (' + parents.length + ' views)', !twice.length, twice.join(', '));
  const card = G('v28CardHtml(' + JSON.stringify(LEAF) + ')');
  check('Our List\'s card draws no data-v28="back"', card.length > 0 && card.indexOf('data-v28="back"') < 0);
  check('every older way back is one the screen strips: Back to Mine, Back to the list, Back to Our List, Back to Village',
    ['Back to Mine', 'Back to the list', 'Back to Our List', 'Back to Village', 'Back'].every((t) => G('V32_OLD_BACK.test(' + JSON.stringify(t) + ')')));

  /* ================================================================ */
  section('8. Due today: never empty on the first morning, one count');
  const F = bootDevice({});
  await settle(F);
  const t = F.G('v32DueToday()');
  check('a fresh record with Brennan\'s: unseen wines to start (' + t.a + '), house first, ten at most', t.a > 0 && t.a <= 10 && t.k >= t.a && t.d === 0);
  check('the row\'s line says how many are new', /new cards to start/.test(F.G('v32DueLine()')), F.G('v32DueLine()'));
  check('the pill, the row and the root say the one count',
    F.G('v32Pill()').indexOf('>' + t.total + '<') >= 0 && F.G('v32FlashcardsHtml()').indexOf(F.G('v32Esc(v32DueLine())')) >= 0
    && F.G('v32LevelHtml()').indexOf(F.G('v32Esc(v32DueLine())')) >= 0);
  F.G('v32StartDue()');
  check('Due today starts the card screen at once, house cards first, in the list\'s order',
    F.G('S.view') === 'housedeck' && F.G('S._v32run.deckId') === 'due' && F.G('S._v32run.cards[S._v32run.deck[0]].id') === t.houseIds[0]);
  F.G('v32Act("flip", null); v32Act("got", null)');
  check('after a grade the count moves with it: the graded wine leaves Due today', F.G('v32DueToday().houseIds').indexOf(t.houseIds[0]) < 0
    && F.G('v32Pill()').indexOf('>' + F.G('v32DueToday().total') + '<') >= 0);
  F.G('v32DueToday = (function (o) { return function () { var r = o(); r.houseIds = []; r.a = 0; r.b = 0; r.d = 0; r.k = 0; r.total = 0; return r; }; })(v32DueToday);');
  check('nothing due and nothing new: the line says so', /^Nothing due today and nothing new at/.test(F.G('v32DueLine()')));
  F.G('v32StartDue()');
  check('and the row goes to the quick quiz, never an empty round', F.G('S.view') === 'quiz' && F.G('S.section') === 'Quick quiz' && F.G('S.pool.length') > 0);

  /* ================================================================ */
  section('9. the Library and Quizzes');
  const lib = G('v32LibraryHtml()');
  const firstRow = (lib.match(/<span class="v25row-name">([^<]*)<\/span>/) || [])[1];
  check('The full wine list is the Library\'s first row when a house is here', firstRow === 'The full wine list', firstRow);
  G('v32All().quizzes = true;');
  const qz = G('v32QuizzesHtml()');
  G('v32All().quizzes = false;');
  const names = (qz.match(/<span class="v25row-name">([^<]*)<\/span>/g) || []).map((m) => m.replace(/<[^>]+>/g, ''));
  const seen = {};
  const clash = [];
  names.forEach((n) => {
    const k = n.split(/\s+/).slice(0, 3).join(' ').toLowerCase();
    if (n.split(/\s+/).length >= 3 && seen[k] && seen[k] !== n) clash.push(seen[k] + ' / ' + n);
    seen[k] = n;
  });
  check('no two Quizzes rows begin with the same three words (' + names.length + ' rows, all levels)', !clash.length, clash.join('; '));
  check('the test is the last row', names[names.length - 1] === 'The Village test', names[names.length - 1]);
  check('Pairing reads Classic pairings, the classic drill reads The cellar drill', names.indexOf('Classic pairings') >= 0 && names.indexOf('The cellar drill') >= 0
    && names.indexOf('Pairing') < 0);

  /* ================================================================ */
  section('10. a hash link adopted, a reload keeps its depth');
  g('v25Nav("library")');
  const dl = d();
  const ll = T.H.entries.length;
  T.followHash('#/more');
  check('a followed hash link makes one entry, adopted one deeper', T.H.entries.length === ll + 1 && d() === dl + 1 && g('S.view') === 'more', d() + ' ' + g('S.view'));
  g('v32Back()');
  check('one Back returns to the screen the link was on', g('S.view') === 'library');
  const mirror = T.sess['oot-nav-codex-v1'];
  const R = bootDevice({ start: T.loc.pathname + T.loc.hash, sess: { 'oot-nav-codex-v1': mirror } });
  await settle(R);
  check('a reload of the same address keeps its depth from the mirror (' + mirror + ')', R.G('V32.d') === JSON.parse(mirror).d && R.G('V32.d') > 0);

  /* ================================================================ */
  section('10b. the scope chip refilters in place; a search and its opener survive Back');
  const lvNode = (lv) => '({ getAttribute: function (k) { return k === "data-lv" ? ' + JSON.stringify(lv) + ' : ""; } })';
  ['flashcards', 'quizzes', 'library'].forEach((root) => {
    g('applyLevel("certified", true); v25Nav(' + JSON.stringify(root) + ')');
    const h0 = T.loc.hash, n0 = T.H.entries.length, i0 = T.H.idx;
    g('S._v32scopeOpen = true; v32Act("scope-pick", ' + lvNode('master') + ')');
    check('scope-pick on ' + root + ' keeps the screen and its address, replaces, and moves the level',
      g('S.view') === root && T.loc.hash === h0 && T.H.entries.length === n0 && T.H.idx === i0 && g('activeLevel') === 'master' && g('S._v32scopeOpen') === false,
      g('S.view') + ' ' + T.loc.hash + ' ' + g('activeLevel'));
  });
  g('applyLevel("certified", true); S._v32deck = "grapes"; S.view = "deck"; V32.pend = "push"; render();');
  g('S._v32scopeOpen = true; v32Act("scope-pick", ' + lvNode('advanced') + ')');
  check('scope-pick on a deck keeps the deck', g('S.view') === 'deck' && g('S._v32deck') === 'grapes' && g('activeLevel') === 'advanced');
  g('applyLevel("certified", true); v32Go({ view: "level" }, "push");');
  const MORGON = wineId(/Morgon/) || LEAF;
  const MQ = (house.wines.find((w) => w.id === MORGON) || {}).name || 'Leflaive';
  const word = MQ.split(/\s+/).find((x) => x.length > 4) || MQ;
  g('var __inp = { value: "", addEventListener: function () { } }, __out = { innerHTML: "" };'
    + 'var __box = { querySelector: function (s) { return s === "#v32-q" ? __inp : __out; } };');
  g('v32Query("v32-q", ' + JSON.stringify(word) + '); v32WireSearch(__box, "v32-q");');
  check('the level page\'s search redraws its query and results on every render (' + word + ')',
    g('__inp.value') === word && g('__out.innerHTML').indexOf('data-v32="wine"') >= 0, g('__out.innerHTML').slice(0, 80));
  g('v32Act("wine", { getAttribute: function (k) { return k === "data-id" ? ' + JSON.stringify(MORGON) + ' : ""; } })');
  check('a search result opens its card', g('S.view') === 'cellar' && g('S._v28.open') === MORGON);
  g('history.back()');
  check('Back returns to the level page with the query still held', g('S.view') === 'level' && g('v32Query("v32-q")') === word);
  const rowKey = g('v32FocusKey({ nodeType: 1, id: "", tagName: "BUTTON", getAttribute: function (k) { return k === "data-v28" ? "open" : k === "data-id" ? ' + JSON.stringify(LEAF) + ' : null; } })');
  check('an opener with no id (codex28\'s row) is remembered by the attributes that name it',
    rowKey === 'sel:button[data-v28="open"][data-id="' + LEAF + '"]', rowKey);

  /* ================================================================ */
  section('11. voice');
  const src = fs.readFileSync(path.join(JS, 'codex32.js'), 'utf8');
  const decoded = src.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
  const sp = voiceProblems(decoded);
  check('codex32.js (its escapes read as the characters they are): no dash, no mark at or above U+2190, no level numeral', !sp.length, sp.join(', '));
  check('codex32.js declares with var and function only, no arrow', !/^\s*(let|const|class)\s/m.test(src) && src.indexOf('=>') < 0);
  check('codex32.js names nobody', !/Lizzy/.test(src));
  const drawn = [G('v32LevelHtml()'), G('v32FlashcardsHtml()'), G('v32QuizzesHtml()'), G('v32LibraryHtml()'), G('v32MoreHtml()'),
    G('S._v32deck = "grapes"; v32DeckHtml()'), G('v25NavHtml()'), G('JSON.stringify(V32_WORDS)')].join('\n');
  const dp = voiceProblems(drawn.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16))));
  check('everything codex32 draws: the same', !dp.length, dp.join(', '));
  const selfP = voiceProblems(fs.readFileSync(__filename, 'utf8'));
  check('check-nav.js itself: the same', !selfP.length, selfP.join(', '));
  const index = path.join(JS, '..', 'index.html');
  const sw = path.join(JS, '..', 'sw.js');
  if (fs.existsSync(index) && fs.existsSync(sw)) {
    check('index.html loads codex32 after codex30 and atlas, then teaching layers before boot', /codex30\.js\?v=\d+"><\/script>\s*(<script src="js\/(?:data-atlas-v2|atlas-cache|codex31)\.js\?v=\d+"><\/script>\s*)*<script src="js\/codex32\.js\?v=\d+"><\/script>\s*<script src="js\/data-teaching-images\.js\?v=\d+"><\/script>\s*<script src="js\/teaching-cache\.js\?v=\d+"><\/script>\s*<script src="js\/codex33\.js\?v=\d+"><\/script>\s*(?:<script src="js\/codex34\.js\?v=\d+"><\/script>\s*)?<script src="js\/boot\.js/.test(fs.readFileSync(index, 'utf8')));
    check('sw.js lists codex32.js in ASSETS', fs.readFileSync(sw, 'utf8').indexOf("'./js/codex32.js'") > 0);
  }
}

/* The five mutations: each broken copy must fail this check. */
function mutations() {
  section('12. mutations');
  const src = fs.readFileSync(path.join(JS, 'codex32.js'), 'utf8');
  const M = [
    ['the URL-less pushState restored in v28Push',
      "v28Push = function (state) { V32.pend = 'push'; V32.v28state = state || null; return true; };",
      "v28Push = function (state) { try { history.pushState(state, ''); } catch (e) { } return true; };"],
    ['a replace put back in the push path', "v32Hist('push', state, url);", "v32Hist('replace', state, url);"],
    ['a parent that is the view itself', "flashcards: 'home', deck: 'flashcards', housedeck: 'deck'", "flashcards: 'home', deck: 'deck', housedeck: 'deck'"],
    ['a sixth tab word', "['library', 'Library'], ['more', 'More']];", "['library', 'Library'], ['record', 'Record'], ['more', 'More']];"],
    ['Back drawn twice', "  v32StripOldBacks(main);\n  v32BackRow(main);", "  v32StripOldBacks(main);\n  v32BackRow(main);\n  v32BackRow(main);"]
  ];
  M.forEach(([name, from, to]) => {
    if (src.indexOf(from) < 0) { check('mutation "' + name + '" applies', false, 'the text it replaces is gone'); return; }
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'check-nav-'));
    fs.readdirSync(JS).forEach((f) => { if (/\.js$/.test(f)) fs.copyFileSync(path.join(JS, f), path.join(dir, f)); });
    fs.writeFileSync(path.join(dir, 'codex32.js'), src.replace(from, to));
    const r = spawnSync(process.execPath, [__filename, dir], { env: process.env, encoding: 'utf8' });
    fs.rmSync(dir, { recursive: true, force: true });
    check('mutation "' + name + '" turns check-nav red', r.status !== 0, (r.stdout || '').split('\n').filter((l) => /FAIL/.test(l)).slice(0, 2).join(' | '));
  });
}

main().then(() => {
  if (MUTATIONS) mutations();
  console.log('');
  if (failed) { console.log('check-nav: ' + failed + ' of ' + (passed + failed) + ' checks FAILED'); process.exit(1); }
  console.log('check-nav: all ' + passed + ' checks pass');
  process.exit(0);
}).catch((e) => { console.error(e && e.stack || e); process.exit(1); });
