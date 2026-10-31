/**
 * BRENNAN'S, THE HOUSE TAB, HELD TO ITS DESIGN (codex41, 17 October 2026).
 *
 * The owner asked the Codex for the World Table's treatment: a tab of the
 * house's own, the wine list grouped by how each wine is sold, starting by
 * the glass, and the three timed lines at the top of every card. codex41
 * wraps codex32's bar, router, level page and Flashcards root and codex28's
 * list and card. This loads the SHIPPED chain through codex41, with the
 * shared house engine and the Brennan's pack, in check-nav's VM (a history
 * that is a real stack, a location that follows it, a Map for
 * sessionStorage) and asserts:
 *
 *   1. the bar: Home, the house's name, Practise, Library and the quiet
 *      More, each a navword with More last and quiet; the lit word on every
 *      view it owns; the due pill on Practise; the house's word read again
 *      at every draw and escaped; the landmarks Practise and the house name
 *   2. ownership: every owner one of the five keys, the house's screens
 *      under the house's word and every study screen under Practise; every
 *      parent walks to home; the house's page climbs to Home, its screens to
 *      the page, Quizzes to the Practise root, The Cellar Compass to the
 *      level page as codex40 set it
 *   3. the addresses: #/v/brennans, #/practise and #/practise/all,
 *      #/flashcards and #/flashcards/all, the bare #/v/cellar and the old
 *      #list round-trip to their screens, each printed in its new form; a
 *      section, a card, a deck and #/quizzes keep theirs; a cold load of
 *      each new address replaces at depth 0 and grows no history
 *   4. the house's page: its h2 the house's name, the date the menus were
 *      read, the list's sentence, the jump row (buttons, no href, each to a
 *      heading that exists and takes the focus, 44 px by the layer's own
 *      rule, a jump moving the scroll and the focus and never the history)
 *      and the doors: The Cellar Compass, the producers, the videos and the
 *      house's quiet links
 *   5. the grouping: By the glass, On the tastings, Bubbles at Brennan's and
 *      Birthday Bubbles, Dessert by the half bottle and By the bottle, in
 *      that order, each head counted, every count equal to one derived here
 *      from the pack's own fields, every wine drawn once under its group,
 *      the style sections inside as h3, and the order Previous and Next
 *      walk the same as the page's
 *   6. the card: a glass wine, a pour, a Bubbles bottle, the half bottle and
 *      a floor bottle each open on section.v41-lines, the ten box, then
 *      #v28-s20 and #v28-s45 with no hidden, no line buttons, the lines the
 *      pack's own, before the guest line and the first picks
 *   7. Practise: Due today, Quick quiz, the house's decks (Your cellar
 *      selection first), the drills on our list, Who makes our wines, the
 *      level with its rounds, What it's made of, Words, Reference cards, the
 *      regions and the service references when loaded, Hands on, and the
 *      level test last; the quick quiz and the rounds pushed and Back home
 *   8. the level page: one lead door to the house's page under My
 *      restaurant, codex40's two Compass doors, no quiet row, no study rows
 *   9. Back: card, section, the house's page, Home when walked warm; a
 *      cold card or section climbs to the page then Home; The Cellar
 *      Compass pushed from the page pops back to it, then Home; a cold
 *      Compass climbs to the level page; a cold Quizzes to Practise, Home
 *  10. the wiring: index.html loads codex41.js once, after codex40.js and
 *      before the learning layers and boot.js, with ?v=; sw.js lists it after codex40.js and
 *      its CACHE is past codex-v100; the chain rule: every list in a gate
 *      here that names codex40.js names codex41.js too
 *  11. voice: codex41 and everything it draws carry no long or en dash, no
 *      dash entity, no spaced double hyphen, no mark at or above U+2190, no
 *      level numeral and no retired study word (the tab word Practise, that
 *      exact token, is let through; in the source the tab's key and address,
 *      the word in lower case, are markup and are taken out first); the
 *      layer declares with var and function only, no arrow; it names
 *      nobody and ships no key; this gate carries no dash either
 *
 *   node .scripts/check-brennans.js [jsDir]
 *
 * jsDir defaults to this repo's js/; the site's check-wings passes the
 * wing's codex/js. Needs the shared engine (OOT_SHARED, else
 * ../worldtable/static/shared). A tree with no codex41.js is SKIPPED.
 * Exits non-zero if any check fails. The last line is the verdict.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ARGS = process.argv.slice(2);
const JS = ARGS.find((a) => a.charAt(0) !== '-') || path.join(__dirname, '..', 'js');
const SHARED = process.env.OOT_SHARED
  || path.join(__dirname, '..', '..', 'worldtable', 'static', 'shared');
const ENGINE = path.join(SHARED, 'oot-house.js');
const UI_FILE = path.join(SHARED, 'oot-house-ui.js');
const PACK_FILE = path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
for (const f of [ENGINE, UI_FILE, PACK_FILE]) {
  if (!fs.existsSync(f)) {
    console.error('check-brennans: no ' + path.basename(f) + ' at ' + SHARED + ' (set OOT_SHARED)');
    process.exit(1);
  }
}
if (!fs.existsSync(path.join(JS, 'codex41.js'))) {
  console.log('check-brennans: no codex41.js in ' + JS + ', SKIPPED');
  process.exit(0);
}

const OPTIONAL = new Set(['codex13.js', 'data-firstpath.js', 'data-service-ref.js']);
const FILES = ['data-questions.js', 'reference.js', 'core.js', 'codex2.js', 'codex3.js',
  'codex4.js', 'codex5.js', 'data-primers.js', 'codex6.js', 'data-intro.js',
  'data-primers-intro.js', 'data-grapes-plus.js', 'data-tasting.js', 'data-floor.js',
  'data-pairing.js', 'data-maps.js', 'data-advanced.js', 'data-primers-advanced.js',
  'data-master.js', 'data-primers-master.js', 'codex7.js', 'codex8.js', 'codex9.js',
  'codex10.js', 'codex11.js', 'codex12.js', 'data-firstpath.js', 'codex13.js', 'codex14.js',
  'codex15.js', 'data-producers.js', 'menu-desk.js', 'wine-rows.js', 'codex16.js',
  'codex17.js', 'codex18.js', 'codex19.js', 'codex20.js', 'codex21.js', 'codex22.js',
  'codex23.js', 'codex24.js', 'codex25.js', 'codex26.js', 'codex27.js', 'codex28.js', 'codex29.js',
  'codex30.js', 'data-atlas-v2.js', 'atlas-cache.js', 'codex31.js', 'codex32.js', 'data-teaching-images.js', 'teaching-cache.js',
  'codex33.js', 'codex34.js', 'codex35.js', 'data-visual-studies.js', 'codex36.js', 'data-culinary-studies.js', 'codex37.js',
  'codex38.js', 'data-regions.js', 'data-service-ref.js', 'codex39.js', 'data-cellar-compass.js', 'codex40.js', 'codex41.js', 'boot.js'];

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

/* The voice rules, the eight gates' narrowed retired word among them. */
const NUMERAL_RE = /\bLevel\s+(I|II|III|IV)\b/;
function dashProblems(s) {
  const out = [];
  if (s.indexOf(String.fromCharCode(0x2014)) >= 0) out.push('a long dash (U+2014)');
  if (s.indexOf(String.fromCharCode(0x2013)) >= 0) out.push('an en dash (U+2013)');
  if (/&(mdash|ndash|#8212|#8211|#x2014|#x2013);/i.test(s)) out.push('a dash entity');
  if (/\x20-{2}\x20/.test(s)) out.push('a double hyphen');
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c >= 0x2190) { out.push('a mark U+' + c.toString(16).toUpperCase()); break; }
  }
  return out;
}
function voiceProblems(s) {
  const out = dashProblems(s);
  if (NUMERAL_RE.test(s)) out.push('a level numeral: ' + s.match(NUMERAL_RE)[0]);
  if (/practi[cs]e/i.test(s.replace(/(^|[^\w])Practise(?!\w)/g, '$1'))) out.push('the retired word for study'); /* the tab word Practise, that exact token, is the one use let through */
  return out;
}
const unescape = (s) => s.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
/* the Practise tab's key and address, the tab word in lower case: markup a reader never meets */
const TAB_KEY = 'Practise'.toLowerCase();
function keyless(s) {
  return s.split("'" + TAB_KEY + "'").join("''").split('data-nav="' + TAB_KEY + '"').join('data-nav=""')
    .split(' id="nav-' + TAB_KEY + '"').join('').split('#/' + TAB_KEY).join('#/').split('#\\/' + TAB_KEY).join('#\\/')
    .split('#\\/(' + TAB_KEY).join('#\\/(');
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
    URL: globalThis.URL, URLSearchParams: globalThis.URLSearchParams, Blob: globalThis.Blob, TextEncoder: globalThis.TextEncoder,
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

/* The groups as this gate derives them from the pack's own fields, apart
   from the layer: a floor bottle by its list; a menu bottle by a bottle
   price and no glass price; a glass by a printed price; a pour by a course
   on a tasting; the Bubbles by their section or a meal. */
const str = (s) => (typeof s === 'string' ? s.trim() : '');
const KINDS = ['glass', 'pour', 'bubbles', 'half', 'floor'];
const HEADS = { glass: 'By the glass', pour: 'On the tastings', bubbles: 'Bubbles at Brennan’s and Birthday Bubbles', half: 'Dessert by the half bottle', floor: 'By the bottle' };
function packKind(w) {
  if (w.list === 'bottle') return 'floor';
  const menuBottle = !str(w.glass) && !!str(w.bottle);
  const printed = (Array.isArray(w.prices) ? w.prices : []).some((p) => p && str(p.printed));
  if (printed && !menuBottle) return 'glass';
  const poured = (house.tastings || []).some((t) => (t.courses || []).some((c) => c && c.pourId === w.id));
  if (!printed && poured) return 'pour';
  if (menuBottle) {
    const meals = Array.isArray(w.meals) ? w.meals : [];
    const bub = /bubbles/i.test(str(w.section)) || meals.some((m) => /bubbles/i.test(typeof m === 'string' ? m : (m && m.name) || ''));
    return bub ? 'bubbles' : 'half';
  }
  return 'glass';
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const ids = (html) => [...html.matchAll(/data-v28="open" data-id="(w-[a-z0-9]{8})"/g)].map((m) => m[1]);
/* the list's rows alone: codex28's rows box, up to what follows it (the house's other kinds, the videos the page leaves out) */
function rowsBox(html) {
  const at = html.indexOf('<div id="v28-rows" class="v28-rows">');
  if (at < 0) return '';
  const ends = ['<p class="v28-soft v28-also">', '<details class="v28-q v28-housedoor">', 'v30-videos'].map((m) => html.indexOf(m, at)).filter((i) => i > at);
  return html.slice(at, ends.length ? Math.min.apply(null, ends) : html.length);
}
const order = (html, marks) => marks.map((m) => html.indexOf(m));
const rising = (xs) => xs.every((x, i) => x >= 0 && (i === 0 || x > xs[i - 1]));

async function main() {
  const drawn = [];
  const D = bootDevice({});
  await settle(D);
  const G = D.G;
  G('applyLevel("certified", true)');
  const name = G('v28House().name');
  const d = () => G('history.state && history.state.ootd');

  /* ================================================================ */
  section('1. the bar: five words, the lit word, the pill');
  check('V25_NAV reads Home, ' + name + ', Practise, Library, More', G('V25_NAV.map(function(w){return w[1];}).join("|")') === 'Home|' + name + '|Practise|Library|More',
    G('V25_NAV.map(function(w){return w[1];}).join("|")'));
  check('its keys are home, brennans, practise, library, more', G('V25_NAV.map(function(w){return w[0];}).join("|")') === ['home', 'brennans', TAB_KEY, 'library', 'more'].join('|'));
  check('the house\'s word is the house\'s name, the shipped pack\'s at first paint', name === 'Brennan’s' && G('v41TabWord()') === name);
  const bar = G('S.view = "home"; v25NavHtml()');
  drawn.push(keyless(bar));
  check('the bar draws four navwords and the quiet More last, an id for each', (bar.match(/class="navword"/g) || []).length === 4
    && /class="navword v32more" id="nav-more" data-nav="more"[^>]*>More<\/button><\/nav>$/.test(bar)
    && ['home', 'brennans', TAB_KEY, 'library'].every((k) => bar.indexOf('id="nav-' + k + '" data-nav="' + k + '"') >= 0));
  const pill = G('v32Pill()');
  check('the due pill rides on Practise and nowhere else (' + (pill ? 'due' : 'nothing due') + ')', !pill
    || (new RegExp('data-nav="' + TAB_KEY + '"[^>]*>Practise' + pill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '</button>').test(bar) && bar.split('class="v32pill"').length === 2));
  const LIT = [['home', 'home'], ['level', 'home'], ['brennans', 'brennans'], ['cellar', 'brennans'], ['fulllist', 'brennans'], ['houseproducers', 'brennans'],
    ['housevideos', 'brennans'], ['cellarcompass', 'brennans'], ['menudesk', 'brennans'], ['flashcards', TAB_KEY], ['deck', TAB_KEY], ['housedeck', TAB_KEY],
    ['quizzes', TAB_KEY], ['quiz', TAB_KEY], ['results', TAB_KEY], ['library', 'library'], ['more', 'more']];
  const wrong = LIT.filter(([v, k]) => {
    const html = G('S.view = ' + JSON.stringify(v) + '; v25NavHtml()');
    const lit = (html.match(/data-nav="([a-z]+)" aria-current="page"/g) || []);
    return lit.length !== 1 || lit[0].indexOf('"' + k + '"') < 0;
  }).map(([v]) => v);
  check('the lit word on ' + LIT.length + ' views is the owner\'s, one at a time', !wrong.length, wrong.join(', '));
  G('var __h41 = v28House; v28House = function () { var h = __h41(); var o = {}; Object.keys(h).forEach(function (k) { o[k] = h[k]; }); o.name = "Tom & Jo’s <Cellar>"; return o; };');
  const odd = G('S.view = "home"; v25NavHtml()');
  const after = G('V25_NAV[1][1]');
  G('v28House = __h41;');
  check('another house names itself, read at the draw, escaped in the bar and kept raw in V25_NAV', odd.indexOf('>Tom &amp; Jo’s &lt;Cellar&gt;</button>') >= 0 && after === 'Tom & Jo’s <Cellar>', after);
  G('S.view = "home"; v25NavHtml()');
  check('and the next draw names Brennan’s again', G('V25_NAV[1][1]') === name);
  const pName = G('S.view = "flashcards"; v25MainName()');
  const bName = G('S.view = "brennans"; v25MainName()');
  drawn.push(pName, bName);
  check('the landmarks: the Practise root reads Practise, the house\'s page the house\'s name', pName === 'Practise' && bName === name, pName + ' / ' + bName);

  /* ================================================================ */
  section('2. who owns what, and the parents');
  const owners = G('Object.keys(V32_OWNER)');
  const keys = ['home', 'brennans', TAB_KEY, 'library', 'more'];
  const badOwner = owners.filter((v) => keys.indexOf(G('V32_OWNER[' + JSON.stringify(v) + ']')) < 0);
  check('every owner is one of the five keys (' + owners.length + ' views)', !badOwner.length, badOwner.join(', '));
  const HOUSE = ['cellar', 'house', 'housereview', 'menudesk', 'winepaste', 'houseproducers', 'housevideos', 'fulllist', 'cellarcompass', 'brennans'];
  const STUDY = ['flashcards', 'deck', 'flash', 'housedeck', 'quizzes', 'quiz', 'results', 'drillpick', 'sim', 'grid', 'floor', 'floortally', 'pairs', 'pairtally',
    'finalsreport', 'tasting', 'service', 'cellarrecite', 'houserecite', 'housesay', 'houseguest'];
  const offHouse = HOUSE.filter((v) => G('V32_OWNER[' + JSON.stringify(v) + ']') !== 'brennans' || G('V25_UNDER[' + JSON.stringify(v) + ']') !== 'brennans');
  check('the house\'s ' + HOUSE.length + ' screens are under the house\'s word, in V32_OWNER and V25_UNDER', !offHouse.length, offHouse.join(', '));
  const offStudy = STUDY.filter((v) => G('V32_OWNER[' + JSON.stringify(v) + ']') !== TAB_KEY || G('V25_UNDER[' + JSON.stringify(v) + ']') !== TAB_KEY);
  check('the ' + STUDY.length + ' study screens are under Practise, in V32_OWNER and V25_UNDER', !offStudy.length, offStudy.join(', '));
  const parents = G('Object.keys(V32_PARENT)');
  const self = parents.filter((v) => G('V32_PARENT[' + JSON.stringify(v) + ']') === v);
  check('no view is its own parent', !self.length, self.join(', '));
  const stuck = parents.filter((v) => {
    let cur = v, n = 0;
    while (cur && n < 10) { cur = G('V32_PARENT[' + JSON.stringify(cur) + ']'); n++; }
    return cur !== null;
  });
  check('every parent walks up to home within ten steps (' + parents.length + ' views)', !stuck.length, stuck.join(', '));
  const PARENT = { brennans: 'home', cellar: 'brennans', fulllist: 'brennans', houseproducers: 'brennans', housevideos: 'brennans', house: 'brennans',
    housereview: 'brennans', menudesk: 'brennans', winepaste: 'brennans', quizzes: 'flashcards', cellarcompass: 'level' };
  const offParent = Object.keys(PARENT).filter((v) => G('V32_PARENT[' + JSON.stringify(v) + ']') !== PARENT[v]);
  check('the house\'s page climbs to Home, its screens to the page, Quizzes to Practise, The Cellar Compass to the level page', !offParent.length,
    offParent.map((v) => v + ':' + G('V32_PARENT[' + JSON.stringify(v) + ']')).join(', '));
  check('the house\'s page is a view with a door: V25_VIEWS.brennans, V25_GO.brennans, V25_AREA.brennans', G('typeof V25_VIEWS.brennans') === 'function'
    && G('typeof V25_GO.brennans') === 'function' && G('V25_AREA.brennans') === 'brennans');

  /* ================================================================ */
  section('3. the addresses');
  const firstGlass = house.wines.find((w) => packKind(w) === 'glass');
  const glassSec = str(firstGlass.section);
  const RT = [
    ['#/v/brennans', 'brennans', '#/v/brennans'],
    ['#/' + TAB_KEY, 'flashcards', '#/' + TAB_KEY],
    ['#/' + TAB_KEY + '/all', 'flashcards', '#/' + TAB_KEY + '/all'],
    ['#/flashcards', 'flashcards', '#/' + TAB_KEY],
    ['#/flashcards/all', 'flashcards', '#/' + TAB_KEY + '/all'],
    ['#/v/cellar', 'brennans', '#/v/brennans'],
    ['#/v/cellar/' + firstGlass.id, 'cellar', '#/v/cellar/' + firstGlass.id],
    ['#/v/cellar/section/' + G('v32Slug(' + JSON.stringify(glassSec) + ')'), 'cellar', '#/v/cellar/section/' + G('v32Slug(' + JSON.stringify(glassSec) + ')')],
    ['#/flashcards/list', 'deck', '#/flashcards/list'],
    ['#/quizzes', 'quizzes', '#/quizzes']
  ];
  RT.forEach(([hash, view, out]) => {
    G('S.view = "home"; v32All().flashcards = false; v28State().open = null; v28State().sec = "";');
    G('v32Apply(v32Parse(' + JSON.stringify(hash) + '), null)');
    const got = G('v32Route().hash');
    check(hash + ' lands on ' + view + ' and prints ' + out, G('S.view') === view && got === out, G('S.view') + ' ' + got);
  });
  G('v32All().flashcards = false;');
  check('the house\'s page keys its scroll and focus as brennans', G('S.view = "brennans"; v32Route().key') === 'brennans');
  for (const [hash, view, out] of [['#/v/brennans', 'brennans', '#/v/brennans'], ['#/' + TAB_KEY, 'flashcards', '#/' + TAB_KEY], ['#/' + TAB_KEY + '/all', 'flashcards', '#/' + TAB_KEY + '/all'],
    ['#/v/cellar', 'brennans', '#/v/brennans'], ['#list', 'brennans', '#/v/brennans'], ['#/flashcards', 'flashcards', '#/' + TAB_KEY]]) {
    const C = bootDevice({ start: '/codex/' + hash });
    await settle(C);
    const n0 = C.H.entries.length;
    C.G('render()');
    check('a cold ' + hash + ' opens ' + view + ' at depth 0 as ' + out + ', replacing', C.G('S.view') === view && C.G('V32.d') === 0 && C.loc.hash === out && C.H.entries.length === n0,
      C.G('S.view') + ' ' + C.loc.hash + ' ' + C.H.entries.length + '/' + n0);
  }

  /* ================================================================ */
  section('4. the house\'s page');
  G('var __pages = []; var __b41 = v32Build; v32Build = function (h) { __pages.push(h); return __b41.apply(this, arguments); };');
  G('S.view = "brennans"; v41View()');
  const page = G('__pages[__pages.length - 1]');
  G('v32Build = __b41;');
  const study = G('S.view = "brennans"; v28State().open = null; v28State().sec = ""; v28State().q = ""; v28StudyHtml()');
  const list = rowsBox(study);
  drawn.push(page, study);
  check('div.v25page.v32-root.v41-brennans, its h2 the house\'s name', page.indexOf('<div class="v25page v32-root v41-brennans"><div class="viewhead"><h2 tabindex="-1" class="v32-h">' + esc(name).replace(/&#39;/g, '\'') + '</h2>') === 0);
  check('the date the menus were read under it', page.indexOf('<div class="sub">menus read ' + G('v28Date(v28House().menusReadOn)') + '</div>') > 0);
  check('the list\'s sentence, as codex28 and codex29 say it', page.indexOf(G('v41Esc(v28ListSentence(v28House(), v28MealRows(v28Rows(), v28Meal(v28MealNames(v28House(), v28Rows())))))')) > 0);
  const nav = (page.match(/<nav class="v32chips v41-jumps" aria-label="On this page">[\s\S]*?<\/nav>/) || [''])[0];
  const jumps = [...nav.matchAll(/<button type="button" class="v28-chip" data-v41="jump" data-to="([a-z0-9-]+)">([^<]*)<\/button>/g)].map((m) => [m[1], m[2]]);
  const WANT = [['v41-list-h', 'The list'], ['v41-g-glass', 'By the glass'], ['v41-g-pour', 'On the tastings'], ['v41-g-bubbles', 'Bubbles'], ['v41-g-floor', 'By the bottle'],
    ['v41-compass-h', 'The Cellar Compass'], ['v41-producers-h', 'Producers'], ['v41-videos-h', 'Videos'], ['v41-house-h', 'The house']];
  check('the jump row: nav.v32chips.v41-jumps, nine buttons in the plan\'s order, no href', JSON.stringify(jumps) === JSON.stringify(WANT) && nav.indexOf('href') < 0
    && (nav.match(/<button /g) || []).length === jumps.length, jumps.map((j) => j[1]).join(', '));
  /* codex28's own heading, retitled by the page as the list's jump target */
  G('var __h2 = { id: "", className: "", textContent: "", attrs: {}, setAttribute: function (k, v) { this.attrs[k] = v; } };'
    + 'var __head = { classList: { remove: function () { } }, querySelector: function (s) { return s === "h2" ? __h2 : null; } };'
    + 'var __box = { querySelector: function (s) { return s === ".v28-head" ? __head : null; } }; v41TrimList(__box);');
  const listHead = study.indexOf('class="viewhead v28-head"><div class="v28-headrow"><h2>') >= 0 && G('__h2.id') === 'v41-list-h' && G('__h2.attrs.tabindex') === '-1' && G('__h2.textContent') === 'The list';
  const targets = jumps.filter(([to]) => to === 'v41-list-h' ? !listHead : !new RegExp('id="' + to + '" tabindex="-1"').test(page + list));
  check('every jump lands on a heading that exists and takes the focus (tabindex -1), the list\'s own retitled', !targets.length, targets.map((t) => t[0]).join(', '));
  const L41 = fs.readFileSync(path.join(JS, 'codex41.js'), 'utf8');
  check('the jump chips are 44 px tall by the layer\'s own rule', /\.v41-jumps \.v28-chip\{min-height:44px[;}]/.test(L41));
  const n1 = D.H.entries.length, h1 = D.loc.hash;
  G('var __focus = "", __y = -1, __gid = document.getElementById, __qs = document.querySelector, __st = scrollTo;'
    + 'var __el = { getBoundingClientRect: function () { return { top: 900 }; }, focus: function (o) { __focus = o && o.preventScroll ? "kept" : "moved"; } };'
    + 'document.getElementById = function (id) { return id === "v41-g-floor" ? __el : null; }; document.querySelector = function () { return null; };'
    + 'scrollTo = function (x, y) { __y = y; }; v41Jump("v41-g-floor"); v41Jump("v41-nowhere");'
    + 'document.getElementById = __gid; document.querySelector = __qs; scrollTo = __st;');
  check('a jump scrolls to its heading and focuses it without a second scroll; no address, no history', G('__y') === 892 && G('__focus') === 'kept' && D.H.entries.length === n1 && D.loc.hash === h1,
    G('__y') + ' ' + G('__focus') + ' ' + D.loc.hash);
  const doorAt = order(page, ['id="v41-compass-h"', 'data-go="cellarcompass"', 'id="v41-producers-h"', 'data-go="houseproducers"', 'id="v41-videos-h"', 'data-v32="housevideos"',
    'id="v41-house-h"', '<div class="v32quietrow">', 'data-v32="fullwine"', 'data-go="menudesk"', 'data-go="house"', 'data-go="housereview"']);
  check('then the doors: The Cellar Compass, the producers, the videos, the house\'s quiet links', rising(doorAt), doorAt.join(' '));
  const goKeys = [...page.matchAll(/data-go="([a-z]+)"/g)].map((m) => m[1]).filter((k) => G('typeof V25_GO[' + JSON.stringify(k) + ']') !== 'function');
  check('every door on the page resolves', !goKeys.length, goKeys.join(', '));

  /* ================================================================ */
  section('5. the list, by how the wine is sold');
  const want = {};
  KINDS.forEach((k) => { want[k] = []; });
  house.wines.forEach((w) => want[packKind(w)].push(w.id));
  const heads = [...list.matchAll(/<h2 class="v32-h2 v41-group" id="v41-g-([a-z]+)" tabindex="-1">([^<]*)<\/h2>/g)].map((m) => ({ kind: m[1], text: m[2], at: m.index }));
  const headText = heads.map((x) => x.text).join(' | ');
  const wantText = KINDS.filter((k) => want[k].length).map((k) => esc(HEADS[k]).replace(/&#39;/g, '\'') + ' · ' + want[k].length).join(' | ');
  check('the group heads in order, each counted from the pack (' + KINDS.map((k) => want[k].length).join(', ') + ')', headText === wantText, headText);
  check('By the glass is first', heads.length > 0 && heads[0].kind === 'glass' && list.indexOf('data-v28="open"') > heads[0].at);
  const drawnIds = ids(list);
  const once = drawnIds.length === house.wines.length && new Set(drawnIds).size === drawnIds.length && house.wines.every((w) => drawnIds.indexOf(w.id) >= 0);
  check('every wine drawn once (' + drawnIds.length + ' rows for ' + house.wines.length + ' wines)', once);
  const rowsAt = [...list.matchAll(/data-v28="open" data-id="(w-[a-z0-9]{8})"/g)].map((m) => ({ id: m[1], at: m.index }));
  const misplaced = rowsAt.filter((r) => {
    let under = null;
    heads.forEach((x) => { if (x.at < r.at) under = x.kind; });
    return want[under] ? want[under].indexOf(r.id) < 0 : true;
  }).map((r) => r.id);
  check('every row sits under its own group', !misplaced.length, misplaced.slice(0, 8).join(', '));
  const glassEnd = heads.length > 1 ? heads[1].at : list.length;
  const subs = (list.slice(heads[0] ? heads[0].at : 0, glassEnd).match(/<h3 class="secgroup">[^<]*<\/h3>/g) || []).length;
  const secs = new Set(want.glass.map((id) => str(house.wines.find((w) => w.id === id).section))).size;
  check('the guide\'s style sections are h3 sub-heads inside By the glass (' + subs + ' for ' + secs + ' sections)', subs === secs);
  const walk = G('JSON.stringify(v28MealRows(v28Rows(), v28Meal(v28MealNames(v28House(), v28Rows()))).map(function (r) { return r.id; }))');
  check('Previous and Next walk the order the page draws', walk === JSON.stringify(drawnIds));
  const renamed = house.wines.filter((w) => G('v28Find(v28House().wines, ' + JSON.stringify(w.id) + ').section') !== w.section).map((w) => w.id);
  check('no section is renamed: every chip, deck and the section quiz hold', !renamed.length, renamed.join(', '));

  /* ================================================================ */
  section('6. the card: the three lines at the top');
  KINDS.forEach((k) => {
    const w = house.wines.find((x) => packKind(x) === k && x.lines && x.lines.value && x.lines.value.s45);
    if (!w) { check('a ' + k + ' wine with its lines in the pack', false); return; }
    const card = G('v28CardHtml(' + JSON.stringify(w.id) + ')');
    drawn.push(card);
    const l = w.lines.value;
    const sec = (card.match(/<section class="v41-lines" aria-labelledby="v41-lines-h">[\s\S]*?<\/section>/) || [''])[0];
    const at = order(card, ['<h2 class="v28-title"', '<section class="v41-lines"', '<p class="v28-timed v41-twenty" id="v28-s20">', '<p class="v28-timed v41-fortyfive" id="v28-s45">']);
    const guest = card.indexOf('>' + G('v28W("guestLine")') + '</p>');
    const pick = card.indexOf('<p class="v28-pick">');
    const lines = sec.indexOf('<div class="card v28-tenbox v41-ten">') > 0 && sec.indexOf('<p class="v28-ten">' + G('v28Esc(' + JSON.stringify(l.s10) + ')') + '</p>') > 0
      && sec.indexOf(G('v28Esc(' + JSON.stringify(l.s20) + ')')) > 0 && sec.indexOf(G('v28Esc(' + JSON.stringify(l.s45) + ')')) > 0
      && sec.indexOf('>In twenty seconds<') > 0 && sec.indexOf('>In forty-five seconds<') > 0;
    check('[' + k + '] ' + w.name.slice(0, 44) + ': section.v41-lines after the title, the ten box, then #v28-s20 and #v28-s45, the pack\'s own lines',
      rising(at) && lines, at.join(' '));
    check('[' + k + '] nothing hidden, no line buttons, one of each line', !/id="v28-s(20|45)"[^>]*hidden/.test(card) && card.indexOf('data-v28="line"') < 0 && card.indexOf('v28-toggles') < 0
      && card.split('id="v28-s20"').length === 2 && card.split('id="v28-s45"').length === 2 && card.split('v28-tenbox').length === 2);
    check('[' + k + '] the lines before the guest line and the first picks', (guest < 0 || guest > at[3]) && (pick < 0 || pick > at[3]) && (guest < 0 || pick < 0 || guest < pick),
      'guest ' + guest + ', picks ' + pick);
  });

  /* ================================================================ */
  section('7. Practise');
  const fc = G('S.view = "flashcards"; v32FlashcardsHtml()');
  drawn.push(fc);
  const marks = ['<h2 tabindex="-1" class="v32-h">Practise</h2>', 'class="v32scope"', 'aria-labelledby="v32-due-h"', 'aria-labelledby="v41-quick-h"', 'aria-labelledby="v32-fc-rest"',
    'aria-labelledby="v41-fc-drills"', 'aria-labelledby="v38-fc-prod"', 'aria-labelledby="v32-fc-lv"', 'aria-labelledby="v35-fc-made"', 'aria-labelledby="v32-fc-words"',
    'aria-labelledby="v32-fc-ref"'].concat(fc.indexOf('v39-fc-regions') >= 0 ? ['aria-labelledby="v39-fc-regions"'] : [])
    .concat(fc.indexOf('v39-fc-service') >= 0 ? ['aria-labelledby="v39-fc-service"'] : []).concat(['aria-labelledby="v41-fc-hands"', '<section class="v32-group v32-testgroup">']);
  const at7 = order(fc, marks);
  check('the root in order: Due today, Quick quiz, the house, the drills, the producers, the level, What it\'s made of, Words, Reference cards, '
    + 'the regions and service, Hands on, the test (' + marks.length + ')', rising(at7), marks.filter((m, i) => at7[i] < 0).join(', '));
  check('the level test is the last row', /<section class="v32-group v32-testgroup"><ul class="v25rows v32rows"><li><button class="v25row v32test"[^>]*data-k="leveltest">[\s\S]*?<\/li><\/ul><\/section><\/div>$/.test(fc));
  const rest = fc.slice(fc.indexOf('aria-labelledby="v32-fc-rest"'));
  check('Your cellar selection leads the house\'s decks, and is drawn once', /^aria-labelledby="v32-fc-rest"><h3[^>]*>[^<]*<\/h3><ul class="v25rows v32rows"><li><button[^>]*data-deck="cellar-compass"/.test(rest)
    && fc.split('data-deck="cellar-compass"').length === 2);
  check('the drills on our list: drill the list, the recitals, the pairings, say it, the guest and the cellar drill', ['data-v32="drilllist"', 'data-go="cellarrecite"'].every((m) => rest.indexOf(m) > 0)
    && rest.indexOf('aria-labelledby="v41-fc-drills"') > 0);
  check('the level with a door to its rounds', /aria-labelledby="v32-fc-lv">[\s\S]*?data-go="quizzes"><span class="v25row-name">The Village rounds<\/span>/.test(fc));
  const T = bootDevice({});
  await settle(T);
  const g = T.G;
  const td = () => g('history.state && history.state.ootd');
  g('render(); applyLevel("certified", true); v25Nav(' + JSON.stringify(TAB_KEY) + ')');
  check('the Practise tab pushes the Flashcards root at #/' + TAB_KEY, g('S.view') === 'flashcards' && td() === 1 && T.loc.hash === '#/' + TAB_KEY, g('S.view') + ' ' + T.loc.hash);
  g('v32Act("quick", null)');
  check('Quick quiz pushes its round at #/quizzes/quick', g('S.view') === 'quiz' && td() === 2 && T.loc.hash === '#/quizzes/quick', g('S.view') + ' ' + T.loc.hash);
  g('v32Back()');
  check('and Back returns to Practise', g('S.view') === 'flashcards' && td() === 1);
  g('V25_GO.quizzes()');
  check('the rounds push Quizzes at #/quizzes, Back returns to Practise', g('S.view') === 'quizzes' && td() === 2 && T.loc.hash === '#/quizzes');
  g('v32Back()');
  check('and Back again: Practise, then Home', g('S.view') === 'flashcards' && (g('v32Back()'), g('S.view')) === 'home');

  /* ================================================================ */
  section('8. the level page');
  const lv = G('v32LevelHtml(activeLevel)');
  drawn.push(lv);
  const restH = lv.slice(lv.indexOf('id="v32-rest-h"'), lv.indexOf('id="v32-search-h"'));
  check('My restaurant holds one lead door to the house\'s page, named for the house', (lv.match(/data-go="brennans"/g) || []).length === 1
    && restH.indexOf('data-go="brennans"><span class="v25row-name">' + esc(name).replace(/&#39;/g, '\'') + '</span>') > 0);
  check('codex40\'s two Compass doors stay (Today\'s study and My restaurant)', (lv.match(/data-go="cellarcompass"/g) || []).length === 2);
  check('the three study rows and the quiet row moved to the house\'s page', lv.indexOf('id="v32-studylist"') < 0 && lv.indexOf('v32quietrow') < 0 && lv.indexOf('data-v32="fullwine"') < 0);
  check('the section chips stay', /data-v32="sec" data-s="/.test(restH));

  /* ================================================================ */
  section('9. Back');
  const W = bootDevice({});
  await settle(W);
  const w = W.G;
  const wd = () => w('history.state && history.state.ootd');
  w('render(); v25Nav("brennans")');
  check('the house\'s word pushes its page at depth 1, lit', w('S.view') === 'brennans' && wd() === 1 && W.loc.hash === '#/v/brennans' && /data-nav="brennans" aria-current="page"/.test(w('v25NavHtml()')));
  const nb = W.H.entries.length;
  w('v25Nav("brennans")');
  check('a tap on the lit word on its page pushes nothing', w('S.view') === 'brennans' && W.H.entries.length === nb);
  const secNode = '({ getAttribute: function (k) { return k === "data-s" ? ' + JSON.stringify(glassSec) + ' : null; } })';
  w('v28Act("sec", ' + secNode + ')');
  check('a section chip on the page pushes the section as its own screen', w('S.view') === 'cellar' && w('S._v28.sec') === glassSec && wd() === 2 && /^#\/v\/cellar\/section\//.test(W.loc.hash), W.loc.hash);
  w('v28Open(' + JSON.stringify(firstGlass.id) + ', false)');
  check('a card pushes one deeper at #/v/cellar/{id}', w('S.view') === 'cellar' && wd() === 3 && W.loc.hash === '#/v/cellar/' + firstGlass.id);
  w('v32Back()');
  check('Back: the section', w('S.view') === 'cellar' && w('S._v28.sec') === glassSec && !w('S._v28.open') && wd() === 2);
  w('v32Back()');
  check('Back: the house\'s page', w('S.view') === 'brennans' && wd() === 1 && W.loc.hash === '#/v/brennans');
  w('V25_GO.cellarcompass()');
  check('The Cellar Compass from the page pushes at depth 2', w('S.view') === 'cellarcompass' && wd() === 2, w('S.view') + ' ' + wd());
  w('v32Back()');
  check('Back: the house\'s page again', w('S.view') === 'brennans' && wd() === 1);
  w('v32OpenWine(' + JSON.stringify(firstGlass.id) + ')');
  w('v25Nav("brennans")');
  check('from a card, the house\'s word pushes the page', w('S.view') === 'brennans' && wd() === 3 && W.loc.hash === '#/v/brennans', w('S.view') + ' ' + wd());
  w('history.go(-2); v32Back()');
  check('Back: Home, depth 0', w('S.view') === 'home' && wd() === 0, w('S.view') + ' ' + wd());
  const COLD = [
    ['#/v/cellar/' + firstGlass.id, ['brennans', 'home']],
    ['#/v/cellar/section/' + G('v32Slug(' + JSON.stringify(glassSec) + ')'), ['brennans', 'home']],
    ['#/v/houseproducers', ['brennans', 'home']],
    ['#/v/fulllist', ['brennans', 'home']],
    ['#/v/brennans', ['home']],
    ['#/v/cellarcompass', ['level', 'home']],
    ['#/quizzes', ['flashcards', 'home']]
  ];
  for (const [hash, chain] of COLD) {
    const C = bootDevice({ start: '/codex/' + hash });
    await settle(C);
    C.G('render()');
    const n0 = C.H.entries.length;
    const seen = [];
    chain.forEach(() => { C.G('v32Back()'); seen.push(C.G('S.view')); });
    check('a cold ' + hash + ' climbs ' + chain.join(', ') + ', replacing', JSON.stringify(seen) === JSON.stringify(chain) && C.H.entries.length === n0, seen.join(', '));
  }
  /* Practise, Quizzes, the level page and the Library drawn before the house
     arrived (a first visit, or a reload that drew before the house was read)
     are drawn again once when it lands, and only then. */
  const R = bootDevice({});
  await settle(R);
  const again = (view, hadHouse) => R.G('(function () { S.view = ' + JSON.stringify(view) + '; V41_DRAWN = { view: S.view, house: ' + hadHouse + ' };'
    + ' var n = 0, r = render; render = function () { n++; return r.apply(this, arguments); };'
    + ' try { v27Redraw(); } finally { render = r; } return n; })()');
  const redrawn = ['flashcards', 'quizzes', 'level', 'library'].map((v) => [v, again(v, false), again(v, true)]);
  check('Practise, Quizzes, the level page and the Library drawn without the house are drawn again when it lands, and not when it was there',
    redrawn.every((x) => x[1] === 1 && x[2] === 0), JSON.stringify(redrawn));

  /* ================================================================ */
  section('10. the wiring and the chain rule');
  const index = path.join(JS, '..', 'index.html');
  const sw = path.join(JS, '..', 'sw.js');
  if (fs.existsSync(index) && fs.existsSync(sw)) {
    const sources = [...fs.readFileSync(index, 'utf8').matchAll(/<script\b[^>]*\bsrc=["'](js\/[^"']+)["'][^>]*>\s*<\/script>/g)].map((m) => m[1]);
    const scripts = sources.map((s) => s.slice(3).split(/[?#]/)[0]);
    const i40 = scripts.indexOf('codex40.js');
    const tail = ['codex41.js', 'codex42.js', 'codex43.js', 'codex44.js', 'data-field-atlas.js', 'codex45.js', 'codex46.js', 'codex47.js', 'house-learning-flow.js', 'codex48.js', 'codex49.js', 'codex50.js', 'codex51.js', 'atlas-context.js', 'codex52.js', 'data-cms.js', 'data-grid.js', 'codex53.js', 'boot.js'];
    check('index.html loads codex41.js after codex40.js, then the learning layers and boot.js, each once with ?v=', i40 >= 0
      && JSON.stringify(scripts.slice(i40 + 1, i40 + 1 + tail.length)) === JSON.stringify(tail)
      && tail.every(file => scripts.filter(s => s === file).length === 1 && /^js\/[^?]+\?v=\d+$/.test(sources[scripts.indexOf(file)])),
      scripts.slice(Math.max(0, i40 - 1), i40 + 1 + tail.length).join(' '));
    const s = fs.readFileSync(sw, 'utf8');
    const n = Number((s.match(/const CACHE = '(?:oot-)?codex-v(\d+)';/) || [])[1]);
    check('sw.js lists ./js/codex41.js after ./js/codex40.js, and its CACHE is past codex-v100 (' + n + ')', s.indexOf("'./js/codex41.js'") > s.indexOf("'./js/codex40.js'") && s.indexOf("'./js/codex40.js'") > 0 && n > 100);
  } else check('index.html and sw.js beside ' + JS, false);
  const gates = fs.readdirSync(__dirname).filter((f) => /^(check-|list-harness)[\w-]*\.c?js$/.test(f));
  const short = gates.filter((f) => {
    const t = fs.readFileSync(path.join(__dirname, f), 'utf8');
    const n40 = (t.match(/'codex40\.js'\s*[,\]]/g) || []).length;
    return n40 > (t.match(/'codex41\.js'\s*[,\]]/g) || []).length;
  });
  check('every list in a gate here that names codex40.js names codex41.js (' + gates.length + ' gates read)', !short.length, short.join(', '));

  /* ================================================================ */
  section('11. voice');
  const src = unescape(L41);
  const sp = dashProblems(src);
  check('codex41.js (its escapes read as the characters they are): no dash, no mark at or above U+2190', !sp.length, sp.join(', '));
  check('codex41.js names no level by numeral, and its words carry no retired study word once the tab\'s key and address are taken out', !voiceProblems(keyless(src)).length, voiceProblems(keyless(src)).join(', '));
  check('codex41.js declares with var and function only, no arrow', !/^\s*(let|const|class)\s/m.test(L41) && L41.indexOf('=>') < 0);
  check('codex41.js names nobody and ships no key', !/Lizzy|sk-ant|api[_-]?key/i.test(L41));
  drawn.push(G('JSON.stringify(V41_WORDS)'));
  const dp = voiceProblems(unescape(drawn.join('\n')));
  check('everything it draws (' + drawn.length + ' pages and parts: the bar, the landmarks, the page, the list, five cards, Practise, the level page, its words): the same', !dp.length, dp.join(', '));
  const selfP = dashProblems(fs.readFileSync(__filename, 'utf8'));
  check('check-brennans.js itself: no dash, no mark at or above U+2190', !selfP.length, selfP.join(', '));
}

main().then(() => {
  console.log('');
  if (failed) { console.log('check-brennans: ' + failed + ' of ' + (passed + failed) + ' checks FAILED'); process.exit(1); }
  console.log('check-brennans: all ' + passed + ' checks pass');
  process.exit(0);
}).catch((e) => { console.error(e && e.stack || e); process.exit(1); });
