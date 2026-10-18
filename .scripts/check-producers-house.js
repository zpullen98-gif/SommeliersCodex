/**
 * WHO MAKES IT: THE HOUSE'S WINE PRODUCERS IN THE CODEX
 *
 * codex38 (the producers deep dive, section 3, October 2026) draws, on a
 * house wine's card, the producers behind it above codex35's What it's made
 * of; gives the house's producers a view of its own, grouped by region and
 * reached through codex32's router; offers Read the full profile on codex29's
 * full list rows; deals the producer decks on codex32's one card screen; and
 * adds four producer questions to codex27's house drills. This loads the
 * SHIPPED chain with codex38 on top of the SHIPPED engine and the shipped
 * Brennan's pack, in a VM whose history is a real stack (codex32's router
 * runs on it), and puts a fixture on the house: every wine producer the
 * pack may carry is taken off, the kitchen's and the bar's producers stay,
 * and three wine producers are put on, one the Codex's own producers hold
 * (Domaine Leflaive), one they hold since the cellar's library entries and
 * then take off to stand for one they do not (Domaine Fichet, beside a
 * Jean-Philippe Fichet record added here), and one under two names (Maison Louis Jadot,
 * the list's Louis Jadot). A second fixture adds two more and the pairings
 * the pour question reads. It asks:
 *
 *   1. the block: on the card, above What it's made of, each producer a
 *      closed disclosure with where, founded, say it, facts, the story in
 *      paragraphs, notes and Ask the sommelier only when there is one; the
 *      link into the Codex's producers only for a whole name or the same
 *      name under another estate word (never Fichet for Jean-Philippe
 *      Fichet, never Comtes Lafon for Les Heritiers du Comte Lafon); Flash
 *      these producers and All producers under it; the doors on Our Wine
 *      List and the level page
 *   2. the view: titled with the house's name, grouped by region, a
 *      producer opening its profile with its wines as chips; every move
 *      through the router, a producer a push, a region a replace, Back
 *      walking down exactly as the screens were walked up, a cold address
 *      climbing by replaces
 *   3. the full list: Read the full profile on a row whose producer has a
 *      house profile, and none on its neighbours; pressing it keeps the
 *      list's place and Back comes back to it
 *   4. the decks: every producer, per region, one wine's in its card's
 *      order; graded under h-{component id}-producer; on the Flashcards root
 *      under the house; the same cards made here for an older engine
 *   5. the quiz: which producer makes a wine, where a producer is, which of
 *      our wines a producer makes, which producer's wine pours with a dish;
 *      every wrong answer another wine producer of the list; recorded like
 *      every house drill question
 *   6. a house with no wine producer, and a device with no OOT, draw nothing
 *   7. codex38.js: no dash, no glyph, var and function only, nobody named;
 *      index.html, sw.js and every gate that names codex35 carry it
 *   8. the shipped house as it ships: every wine producer linked to its
 *      record but the three the Codex files as wines (et read as and, a
 *      record's aside, its aka); the full list's rows of the estates the
 *      list prints under other names (Droin, Duckhorn, Caymus, Matrot and
 *      the rest) offering their profile, by name or by the list's own key,
 *      and no row another house's; every glass on the list offering its
 *      producer's profile (an aside, a family word, a label filed as the
 *      producer); the quiz dealing one of two wines a reader cannot tell
 *      apart; a producer told once on a card (never
 *      again in Stories); a door and Back reopening the card's disclosures;
 *      the producers view drawn again when the house lands; a learnt count
 *      of the cards answered
 *
 *   node .scripts/check-producers-house.js [jsDir]
 *   OOT_SHARED=<dir holding oot-house.js>   default ../worldtable/static/shared
 *
 * Exits non-zero on any failure. The last line is the verdict.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const JS = process.argv.slice(2).find((a) => a.charAt(0) !== '-')
  || path.join(__dirname, '..', 'js');
const ROOT = path.join(JS, '..');
const SHARED = process.env.OOT_SHARED
  || path.join(__dirname, '..', '..', 'worldtable', 'static', 'shared');
const ENGINE = path.join(SHARED, 'oot-house.js');
const UI_FILE = path.join(SHARED, 'oot-house-ui.js');
const PACK_FILE = path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
const LIST_FILE = path.join(SHARED, 'packs', 'brennans-new-orleans.winelist.v1.json');
for (const f of [ENGINE, UI_FILE, PACK_FILE, LIST_FILE]) {
  if (!fs.existsSync(f)) {
    console.error('check-producers-house: no ' + path.basename(f) + ' at ' + SHARED + ' (set OOT_SHARED)');
    process.exit(1);
  }
}
if (!fs.existsSync(path.join(JS, 'codex38.js'))) {
  console.log('check-producers-house: no codex38.js in ' + JS + ', SKIPPED');
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
  'codex30.js', 'codex32.js', 'codex35.js', 'codex38.js', 'data-regions.js', 'codex39.js', 'data-cellar-compass.js', 'codex40.js', 'codex41.js', 'boot.js'];

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
  if (/practi[cs]e/i.test(s.replace(/(^|[^\w])Practise(?!\w)/g, '$1'))) out.push('the retired word for study'); /* the tab word Practise, that exact token, is the one use let through */
  if (NUMERAL_RE.test(s)) out.push('a level numeral: ' + s.match(NUMERAL_RE)[0]);
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c >= 0x2190) { out.push('a mark U+' + c.toString(16).toUpperCase()); break; }
  }
  return out;
}

/* check-nav's sandbox: a real history (a stack of { state, url }, a location
   that follows it, popstate fired on back) and a Map for sessionStorage. */
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
  return { sandbox, ctx, G, store, sess, listeners, H, loc };
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

/* ---------------- the fixture ---------------- */

const shipped = JSON.parse(fs.readFileSync(PACK_FILE, 'utf8'));
const listText = fs.readFileSync(LIST_FILE, 'utf8');
const wineBy = (re, list) => {
  const w = shipped.house.wines.find((x) => re.test(x.name) && (list === undefined || (list === 'bottle' ? x.list === 'bottle' : x.list !== 'bottle')));
  if (!w) { console.error('check-producers-house: the shipped pack has no wine matching ' + re); process.exit(1); }
  return w.id;
};
const LEFLAIVE = wineBy(/^Domaine Leflaive Mâcon-Verzé 2022/);
const FICHET = wineBy(/^Fichet .Château London/);
const JADOT_BEAUNE = wineBy(/^Louis Jadot Beaune 1er Cru/);
const JADOT_MEURSAULT = wineBy(/^Louis Jadot Meursault/);
const HERITIERS = wineBy(/Héritiers du Comte Lafon/);
const BERRES = wineBy(/Berres/);
const PIPER = wineBy(/^Brennan.s Essential by Piper-Heidsieck/);

/* The shipped pack with every wine producer taken off (the kitchen's and the bar's kept), and these put on. */
function packWith(extra) {
  const p = JSON.parse(JSON.stringify(shipped));
  const h = p.house;
  const ts = Date.parse(h.pack.builtAt);
  const mark = (value) => ({ value, by: 'person', ts });
  const wines = new Set(h.wines.map((w) => w.id));
  for (const c of h.components || []) {
    if (c.producer && (c.itemIds || []).some((id) => wines.has(id))) delete c.producer;
  }
  /* the second name: the list's own Jadot half bottle, spelt the house's way */
  h.wines.find((w) => w.id === JADOT_MEURSAULT).producer = 'Maison Louis Jadot';
  const comp = (id, name, producer, itemIds) => ({ id, kind: 'story', name, producer: mark(producer), itemIds, termIds: [], ts });
  const add = [
    comp('c-tstlefl1', 'Domaine Leflaive', {
      type: 'maker', who: 'Domaine Leflaive', where: 'Puligny-Montrachet, Côte de Beaune, Burgundy', founded: '',
      history: 'A first paragraph of the story.\n\nA second paragraph of the story.',
      facts: ['Domaine Leflaive is not Olivier Leflaive, a separate negociant house.'], notes: ['A note for the floor.'],
      sayIt: 'doh-MEN luh-FLEV', askKitchen: ['A question for the sommelier at lineup.']
    }, [LEFLAIVE]),
    comp('c-tstfich1', 'Domaine Fichet', {
      type: 'maker', who: 'Domaine Fichet', where: 'Mâconnais, Burgundy', founded: '', history: '', facts: [], notes: [], sayIt: '', askKitchen: []
    }, [FICHET]),
    comp('c-tstjado1', 'Louis Jadot', {
      type: 'maker', who: 'Maison Louis Jadot (Louis Jadot)', where: 'Beaune, Côte de Beaune, Burgundy', founded: '1859',
      history: 'A Beaune house, and the story of it in one sentence. A second sentence.', facts: [], notes: [], sayIt: '', askKitchen: []
    }, [JADOT_BEAUNE, JADOT_MEURSAULT])
  ];
  if (extra) {
    add.push(comp('c-tstpipr1', 'Piper-Heidsieck', {
      type: 'maker', who: 'Piper-Heidsieck', where: 'Reims, Champagne', founded: '', history: '', facts: ['A fact about the house.'], notes: [], sayIt: '', askKitchen: []
    }, [PIPER]));
    add.push(comp('c-tstberr1', 'C.H. Berres', {
      type: 'maker', who: 'C.H. Berres', where: 'Mosel, Germany', founded: '', history: '', facts: ['A fact about the estate.'], notes: [], sayIt: '', askKitchen: []
    }, [BERRES]));
  }
  h.components = (h.components || []).concat(add);
  return JSON.stringify(p);
}
/* The shipped pack with every wine producer taken off and none put on. */
function packBare() {
  const p = JSON.parse(JSON.stringify(shipped));
  const wines = new Set(p.house.wines.map((w) => w.id));
  for (const c of p.house.components || []) {
    if (c.producer && (c.itemIds || []).some((id) => wines.has(id))) delete c.producer;
  }
  return JSON.stringify(p);
}

function bootDevice(opts) {
  const o = opts || {};
  const D = makeSandbox(o.seed || {}, o.start);
  if (o.house !== false) {
    vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), D.ctx, { filename: 'oot-house.js' });
    vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), D.ctx, { filename: 'oot-house-ui.js' });
    const lib = D.G('OOT.houseLib');
    D.sandbox.OOT.house = lib.createHouseApi(lib.mapStorage(new Map()), { win: D.sandbox, now: () => NOW, rand: seeded(21), from: 'codex' });
    const text = o.pack || packWith(o.extra);
    D.sandbox.fetch = (url) => {
      const body = /\.winelist\./.test(String(url)) ? listText : text;
      return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(body), json: () => Promise.resolve(JSON.parse(body)) });
    };
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
const node = (attrs) => '({ getAttribute: function (k) { var a = ' + JSON.stringify(attrs) + '; return Object.prototype.hasOwnProperty.call(a, k) ? a[k] : null; }, setAttribute: function () { } })';
/* Only what codex38 drew on a card: its one section. */
function block(html) {
  const m = /<section class="v28-block v38-who"[\s\S]*?<\/section>/.exec(html);
  return m ? m[0] : '';
}

async function main() {
  /* ================================================================ */
  section('1. who makes it, on the card');
  const D = bootDevice({});
  await settle(D);
  const G = D.G;
  G('render()');
  check('the house carries three wine producers, the kitchen\'s and the bar\'s left out', G('v38Rows(v28House()).length') === 3
    && G('v28House().components.filter(function (c) { return c.producer; }).length') > 3, String(G('v38Rows(v28House()).length')));
  const card = G('v28CardHtml(' + JSON.stringify(LEFLAIVE) + ')');
  const who = block(card);
  check('the block is drawn, headed Who makes it', who.indexOf('<h3 class="secgroup" id="v38-who-h">Who makes it</h3>') >= 0);
  const atWho = card.indexOf('id="v38-who-h"'), atMade = card.indexOf('id="v35-madeof-h"');
  check('above codex35\'s What it’s made of, after the wine block', atWho > 0 && atMade > atWho && card.indexOf('The wine') < atWho, atWho + ' ' + atMade);
  const made = (/<section class="v28-block v35-madeof"[\s\S]*?<\/section>/.exec(card) || [''])[0];
  const told = shipped.house.components.filter((c) => c.itemIds.indexOf(LEFLAIVE) >= 0 && c.explain && c.explain.by === 'person').map((c) => c.id);
  check('a component that holds nothing kept but its producer is drawn once, here, never as an empty story', made.length > 0 && made.indexOf('data-component="c-tstlefl1"') < 0);
  /* a story under the name of a producer Who makes it draws is that producer told again (the shipped
     Domaine Leflaive stories, their producer marks taken off here, beside the fixture's Domaine Leflaive) */
  const sameName = shipped.house.components.filter((c) => told.indexOf(c.id) >= 0 && c.kind === 'story' && c.name === 'Domaine Leflaive').map((c) => c.id);
  check('every component that explains itself is still in What it\u2019s made of, but a story under the name of a producer Who makes it draws',
    told.length > sameName.length && told.filter((id) => sameName.indexOf(id) < 0).every((id) => made.indexOf('data-component="' + id + '"') >= 0), told.join(','));
  check('and a story under that producer\u2019s own name is told once, in Who makes it, never again in Stories', sameName.length >= 1 && sameName.every((id) => made.indexOf('data-component="' + id + '"') < 0), sameName.join(','));
  check('the producer a closed disclosure named by its who', /<li data-producer="c-tstlefl1"><details class="v28-q v35-comp v38-prod"><summary>Domaine Leflaive<\/summary>/.test(who) && !/v38-prod" open/.test(who));
  check('where, and no founded line for an empty founded', who.indexOf('<dt>Where</dt><dd>Puligny-Montrachet, Côte de Beaune, Burgundy</dd>') >= 0 && who.indexOf('<dt>Founded</dt>') < 0);
  check('say it, the facts, the story in paragraphs, the notes', who.indexOf('Say it:</span> doh-MEN luh-FLEV') >= 0
    && who.indexOf('<h4 class="v28-eyebrow">Facts</h4><ul class="v28-list"><li>Domaine Leflaive is not Olivier Leflaive') >= 0
    && who.indexOf('<h4 class="v28-eyebrow">The story</h4><p>A first paragraph of the story.</p><p>A second paragraph of the story.</p>') >= 0
    && who.indexOf('<h4 class="v28-eyebrow">Notes for the floor</h4>') >= 0);
  check('Ask the sommelier when the profile leaves a question', who.indexOf('<h4 class="v28-eyebrow">Ask the sommelier</h4><ul class="v28-list"><li>A question for the sommelier at lineup.</li>') >= 0);
  check('In the Codex’s producers opens Domaine Leflaive through codex28\'s producer door', who.indexOf('data-v28="producer" id="v38-lib-c-tstlefl1" data-k="p-dom-leflaive">In the Codex’s producers</button>') >= 0);
  check('Flash these producers and All producers under the block', who.indexOf('data-v28="v38flash" data-id="' + LEFLAIVE + '">Flash these producers</button>') >= 0
    && who.indexOf('data-v28="v38all">All producers</button>') >= 0);
  const fich = block(G('v28CardHtml(' + JSON.stringify(FICHET) + ')'));
  /* The cellar's library entries put Domaine Fichet and Jean-Philippe Fichet in the corpus: the first links
     its own record and never the other's. Taken off again, it stands for a producer the Codex does not hold. */
  check('a producer the Codex holds links its own record: Domaine Fichet, never Jean-Philippe Fichet', fich.indexOf('<summary>Domaine Fichet</summary>') >= 0
    && fich.indexOf('data-k="p-dom-fichet"') >= 0 && fich.indexOf('p-jean-philippe-fichet') < 0);
  G('WINE_PRODUCERS.splice(WINE_PRODUCERS.map(function (r) { return r.id; }).indexOf("p-dom-fichet"), 1)');
  const fichOut = block(G('v28CardHtml(' + JSON.stringify(FICHET) + ')'));
  check('a producer the Codex does not hold: its block, no link', fichOut.indexOf('<summary>Domaine Fichet</summary>') >= 0 && fichOut.indexOf('data-v28="producer"') < 0);
  check('and no Ask the sommelier, no facts, no story when they are empty', fich.indexOf('Ask the sommelier') < 0 && fich.indexOf('Facts') < 0 && fich.indexOf('The story') < 0);
  G('WINE_PRODUCERS.push({ id: "p-tst-jp-fichet", p: "Jean-Philippe Fichet", country: "France, Burgundy and Beaujolais", r: "Meursault", wines: [] })');
  const fich2 = block(G('v28CardHtml(' + JSON.stringify(FICHET) + ')'));
  check('a Jean-Philippe Fichet record in the corpus is never Domaine Fichet\'s', fich2.indexOf('<summary>Domaine Fichet</summary>') >= 0 && fich2.indexOf('p-tst-jp-fichet') < 0 && fich2.indexOf('data-v28="producer"') < 0);
  check('Les Heritiers du Comte Lafon is its own record, never Domaine des Comtes Lafon; Comtes Lafon is', G('(function () { var r = v38Library(["Les Héritiers du Comte Lafon"]); return r ? r.id : null; })()') === 'p-heritiers-comte-lafon'
    && G('v38Library(["Comtes Lafon"]).id') === 'p-dom-comtes-lafon' && G('v38Library(["Domaine des Comtes Lafon"]).id') === 'p-dom-comtes-lafon');
  check('Leflaive & Associés is not Domaine Leflaive; Olivier Leflaive is his own', G('v38Library(["Leflaive & Associés"])') === null && G('v38Library(["Olivier Leflaive"]).id') === 'p-olivier-leflaive');
  const jb = block(G('v28CardHtml(' + JSON.stringify(JADOT_BEAUNE) + ')'));
  const jm = block(G('v28CardHtml(' + JSON.stringify(JADOT_MEURSAULT) + ')'));
  check('one producer under two names: both its wines draw it, the founding year with it', jb.indexOf('<summary>Maison Louis Jadot (Louis Jadot)</summary>') >= 0 && jm.indexOf('<summary>Maison Louis Jadot (Louis Jadot)</summary>') >= 0
    && jb.indexOf('<dt>Founded</dt><dd>1859</dd>') >= 0);
  check('and it reaches the Codex\'s Maison Louis Jadot', jb.indexOf('data-k="p-maison-louis-jadot"') >= 0);
  check('a wine no kept producer reaches draws no block (Les Heritiers, Berres)', block(G('v28CardHtml(' + JSON.stringify(HERITIERS) + ')')) === '' && block(G('v28CardHtml(' + JSON.stringify(BERRES) + ')')) === '');
  G('v28State().open = null; v28State().q = ""; v28State().sec = ""');
  const study = G('v28StudyHtml()');
  check('Our Wine List offers Our producers among its buttons', /<div class="v28-actions">[\s\S]*?data-v28="v38all">Our producers<\/button><\/div>/.test(study));
  G('applyLevel("certified", true)');
  const level = G('v32LevelHtml(activeLevel)');
  /* since codex41 the level page's quiet row lives on the Brennan's page, the producers' door with it */
  const doors = G('typeof v41DoorsHtml === "function" ? v41DoorsHtml(v28House()) : ""');
  check('the Brennan\'s page offers Who makes our wines, a door that resolves; the level page leads there', doors.indexOf('data-go="houseproducers"><span class="v25row-name">Who makes our wines</span>') >= 0
    && level.indexOf('data-go="brennans"') >= 0 && G('typeof V25_GO.houseproducers') === 'function' && G('typeof V25_GO.brennans') === 'function');
  check('the drawn block passes the voice sweep', (who + fich + jb).length > 800 && voiceProblems(who + fich + jb).length === 0, voiceProblems(who + fich + jb).join(', '));
  check('no allergen box and no checked attribute', !/checked|type="checkbox"/.test(who));

  /* ================================================================ */
  section('2. the house\'s producers, through the router');
  G('v32OpenWine(' + JSON.stringify(LEFLAIVE) + ')');
  check('the card is open at #/v/cellar/{id}', G('S.view') === 'cellar' && D.loc.hash === '#/v/cellar/' + LEFLAIVE, D.loc.hash);
  const d = () => G('history.state && history.state.ootd');
  const d0 = d(), e0 = D.H.idx;
  G('v28Act("v38all", ' + node({ 'data-v28': 'v38all' }) + ')');
  check('All producers pushes the view at #/v/houseproducers, one deeper', G('S.view') === 'houseproducers' && D.loc.hash === '#/v/houseproducers' && d() === d0 + 1 && D.H.idx === e0 + 1, D.loc.hash + ' ' + d());
  check('the bar lights the house\'s word, the landmark says The producers', G('v25NavWord()') === 'brennans' && G('v25MainName()') === 'The producers');
  const list = G('v38ViewHtml()');
  const name = G('v28House().name');
  check('titled with the house\'s name, Who makes our wines under it', list.indexOf('<h2 tabindex="-1" class="v32-h">' + G('v28Esc(v28House().name)') + '</h2><div class="sub">Who makes our wines</div>') >= 0, name);
  check('the count says three producers behind four wines', list.indexOf('3 producers behind 4 wines on our list.') >= 0);
  check('grouped by region: one chip and one heading for Burgundy, an All chip', list.indexOf('data-v38="group" data-g="" aria-pressed="true">All 3</button>') >= 0 && list.indexOf('data-g="burgundy" aria-pressed="false">Burgundy 3</button>') >= 0
    && list.indexOf('id="v38-h-burgundy">Burgundy</h3>') >= 0 && list.indexOf('data-g="champagne"') < 0);
  const order = (list.match(/data-v38="open" data-k="(c-[a-z0-9]+)"/g) || []).map((s) => s.slice(-11, -1));
  check('each producer a row, sorted by its name without the estate word', order.join(',') === 'c-tstfich1,c-tstlefl1,c-tstjado1', order.join(','));
  check('a row says where and how many of our wines', list.indexOf('<span class="v25row-line">Beaune, Côte de Beaune, Burgundy · 2 wines on our list</span>') >= 0);
  check('Flash these producers deals every producer\'s deck', list.indexOf('data-v38="flash" data-deck="producers">Flash these producers</button>') >= 0);
  const e1 = D.H.idx;
  G('v38Act("open", ' + node({ 'data-v38': 'open', 'data-k': 'c-tstlefl1' }) + ')');
  check('a producer opens its profile as a push at #/v/houseproducers/{id}', G('S._v38.open') === 'c-tstlefl1' && D.loc.hash === '#/v/houseproducers/c-tstlefl1' && D.H.idx === e1 + 1 && d() === d0 + 2, D.loc.hash);
  const prof = G('v38ViewHtml()');
  check('the profile: the who as its title, the house and the region under it', prof.indexOf('<h2 tabindex="-1" class="v32-h">Domaine Leflaive</h2>') >= 0 && prof.indexOf(' · Burgundy</div>') >= 0);
  check('the whole profile, the Codex\'s own entry through this view\'s door', prof.indexOf('<p>A second paragraph of the story.</p>') >= 0 && prof.indexOf('Ask the sommelier') >= 0
    && prof.indexOf('data-v38="lib" id="v38-lib" data-k="p-dom-leflaive">In the Codex’s producers</button>') >= 0);
  check('its wines as chips that open their cards', prof.indexOf('class="v28-chip" id="v38-w-' + LEFLAIVE + '" data-v38="wine" data-id="' + LEFLAIVE + '">') >= 0);
  G('v38Act("wine", ' + node({ 'data-v38': 'wine', 'data-id': LEFLAIVE }) + ')');
  check('a chip pushes the wine\'s card', G('S.view') === 'cellar' && G('S._v28.open') === LEFLAIVE && D.loc.hash === '#/v/cellar/' + LEFLAIVE && d() === d0 + 3, D.loc.hash);
  G('v32Back()');
  check('Back: the profile again', G('S.view') === 'houseproducers' && G('S._v38.open') === 'c-tstlefl1' && d() === d0 + 2, G('S.view') + ' ' + D.loc.hash);
  G('v38Act("lib", ' + node({ 'data-v38': 'lib', 'data-k': 'p-dom-leflaive' }) + ')');
  check('the Codex\'s own entry opens through the existing producer door, a push', G('S.view') === 'producers' && G('S._prod.id') === 'p-dom-leflaive' && D.loc.hash === '#/v/producers/p-dom-leflaive' && d() === d0 + 3, D.loc.hash);
  G('v32Back()');
  check('Back: the profile', G('S.view') === 'houseproducers' && G('S._v38.open') === 'c-tstlefl1', G('S.view'));
  G('v32Back()');
  check('Back: the list of producers', G('S.view') === 'houseproducers' && G('S._v38.open') === null && D.loc.hash === '#/v/houseproducers' && d() === d0 + 1, D.loc.hash);
  G('v32Back()');
  check('Back: the wine\'s card the view was opened from', G('S.view') === 'cellar' && G('S._v28.open') === LEFLAIVE && d() === d0, G('S.view') + ' ' + D.loc.hash);
  const cold = bootDevice({ start: '/codex/#/v/houseproducers/c-tstjado1' });
  await settle(cold);
  cold.G('render()');
  const cl = cold.H.entries.length;
  check('a cold address opens the profile at depth 0', cold.G('S.view') === 'houseproducers' && cold.G('S._v38.open') === 'c-tstjado1' && cold.G('V32.d') === 0 && cold.loc.hash === '#/v/houseproducers/c-tstjado1', cold.G('S.view') + ' ' + cold.loc.hash);
  cold.G('v32Back()');
  check('Back replaces up to the list of producers', cold.G('S.view') === 'houseproducers' && cold.G('S._v38.open') === null && cold.loc.hash === '#/v/houseproducers');
  cold.G('v32Back()');
  check('then up to the Brennan\'s page, the list on it', cold.G('S.view') === 'brennans' && cold.loc.hash === '#/v/brennans');
  check('the history did not grow across the presses', cold.H.entries.length === cl);

  /* ================================================================ */
  section('3. the full list');
  G('v29Open("cellar")');
  await G('V29_LIST.promise');
  await tick(10);
  check('the full list is read', G('V29_LIST.status') === 'ready' && G('V29_LIST.rows.length') > 500, G('V29_LIST.status'));
  const rowOf = (pk) => G('JSON.stringify(V29_LIST.rows.filter(function (r) { return r.pk === ' + JSON.stringify(pk) + '; }).map(function (r) { return r.n; }))');
  const detail = (pk) => G('(function () { var r = V29_LIST.rows.filter(function (x) { return x.pk === ' + JSON.stringify(pk) + '; })[0]; return r ? v29DetailHtml(r) : ""; })()');
  const lefRow = detail('domaine-leflaive');
  check('a Domaine Leflaive row offers Read the full profile', lefRow.indexOf('data-v29="v38prof" data-k="c-tstlefl1">Read the full profile</button>') >= 0);
  check('after the producer\'s own lines, before the place', lefRow.indexOf('v38prof') < lefRow.indexOf('This part of the list') || lefRow.indexOf('This part of the list') < 0);
  check('every Louis Jadot row reaches the one producer under its other name', JSON.parse(rowOf('louis-jadot')).length > 1
    && G('V29_LIST.rows.filter(function (r) { return r.pk === "louis-jadot"; }).every(function (r) { return v29DetailHtml(r).indexOf(\'data-k="c-tstjado1"\') >= 0; })') === true);
  check('no Jean-Philippe Fichet row offers Domaine Fichet', JSON.parse(rowOf('jean-philippe-fichet')).length > 0
    && G('V29_LIST.rows.filter(function (r) { return r.pk === "jean-philippe-fichet"; }).every(function (r) { return v29DetailHtml(r).indexOf("v38prof") < 0; })') === true);
  check('no Lafon row and no Leflaive & Associés row offers a profile', ['heritiers-comte-lafon', 'comtes-lafon', 'leflaive-associes'].every((pk) => detail(pk).indexOf('v38prof') < 0));
  const fl = D.H.idx;
  G('V29_LIST.rows.filter(function (r) { return r.pk === "domaine-leflaive"; }).slice(0, 1).forEach(function (r) { v29State().open = r.n; })');
  G('v29Act("v38prof", ' + node({ 'data-v29': 'v38prof', 'data-k': 'c-tstlefl1' }) + ', null)');
  check('pressing it pushes the profile', G('S.view') === 'houseproducers' && G('S._v38.open') === 'c-tstlefl1' && D.H.idx === fl + 1, G('S.view'));
  G('v32Back()');
  check('Back comes back to the full list, its open row and its place kept', G('S.view') === 'fulllist' && G('v29State().open') !== null && D.loc.hash === '#/v/fulllist', G('S.view'));
  check('the button passes the voice sweep', voiceProblems(lefRow.slice(lefRow.indexOf('v38-listrow'))).length === 0);

  /* ================================================================ */
  section('4. the decks');
  const all = JSON.parse(G('JSON.stringify(v32DeckDef("producers"))'));
  check('every producer\'s cards, kind producer, the engine\'s three where each has something to say', all.kind === 'producer' && all.name === 'Every producer' && all.cards.length === 8,
    all.cards.length + ': ' + all.cards.map((c) => c.front).join(' | '));
  check('who and where first, since when when founded is written', all.cards.some((c) => c.front === 'Domaine Leflaive: where from?') && all.cards.some((c) => c.front === 'Maison Louis Jadot: where, and since when?' && /Founded 1859\.$/.test(c.back)));
  check('which of our wines, never which drinks', all.cards.filter((c) => c.n === 2).length === 3 && all.cards.every((c) => !/which drinks/.test(c.front))
    && all.cards.some((c) => c.front === 'Maison Louis Jadot: which of our wines?' && c.back.indexOf(' and ') > 0));
  const bur = JSON.parse(G('JSON.stringify(v32DeckDef("producers:burgundy"))'));
  check('a deck per region', bur.name === 'Producers: Burgundy' && bur.cards.length === 8 && G('v32DeckDef("producers:champagne").cards.length') === 0);
  check('a region that is not one deals nothing', G('v32DeckDef("producers:atlantis").kind') === 'house' && G('v32DeckDef("producers:atlantis").cards.length') === 0);
  const one = JSON.parse(G('JSON.stringify(v32DeckDef("item-producers:' + JADOT_MEURSAULT + '"))'));
  check('one wine\'s producers in the card\'s order', one.cards.map((c) => c.n).join(',') === '0,1,2' && /: who makes it$/.test(one.name), one.cards.map((c) => c.n).join(','));
  G('v28Act("v38flash", ' + node({ 'data-v28': 'v38flash', 'data-id': JADOT_MEURSAULT }) + ')');
  check('Flash these producers starts the run at once, in order', G('S.view') === 'housedeck' && G('S._v32run.deckId') === 'item-producers:' + JADOT_MEURSAULT && G('S._v32run.deck.join(",")') === '0,1,2');
  const face = G('v32CardFace(v32RunCard(), S._v32run)');
  check('the face names a producer card and asks', face.indexOf('Front · Producer') >= 0 && face.indexOf('Maison Louis Jadot: where, and since when?') >= 0 && face.indexOf('1859') < 0);
  G('S._v32run.flip = true');
  check('the back answers', G('v32CardFace(v32RunCard(), S._v32run)').indexOf('Beaune, Côte de Beaune, Burgundy. Founded 1859.') >= 0);
  G('v32Grade(true)');
  check('Got it records under the card\'s own key, h-{component id}-producer-{n}', G('Object.keys(ST.q).some(function (k) { return /(^|\\|)h-c-tstjado1-producer-0$/.test(k); })') === true
    && G('Object.keys(ST.q).some(function (k) { return /(^|\\|)h-c-tstjado1-producer(-[12])?$/.test(k); })') === false);
  check('and one answer counts one card learnt, never the producer\'s three', G('v32DeckDef("item-producers:' + JADOT_MEURSAULT + '").learnt') === 1 && G('v32DeckDef("producers").learnt') === 1,
    G('v32DeckDef("producers").learnt') + ' learnt');
  G('S._v32run.flip = true; v32Grade(true)');
  check('a second Got it, on the next card: two learnt', G('v32DeckDef("item-producers:' + JADOT_MEURSAULT + '").learnt') === 2 && G('v32DeckDef("producers").learnt') === 2
    && G('Object.keys(ST.q).some(function (k) { return /(^|\\|)h-c-tstjado1-producer-1$/.test(k); })') === true, G('v32DeckDef("producers").learnt') + ' learnt');
  check('a producer grade is no level\'s', G('Object.keys(ST.q).filter(function (k) { return /h-c-tstjado1-producer-\\d$/.test(k); }).every(function (k) { return !keyOwned(k, activeLevel); })') === true);
  G('S._v32run = null; S.view = "flashcards"');
  const root = G('v32FlashcardsHtml()');
  const atRest = root.indexOf('id="v32-fc-rest"'), atProd = root.indexOf('id="v38-fc-prod"'), atLv = root.indexOf('id="v32-fc-lv"');
  check('the Flashcards root lists them under the house: Who makes our wines', atProd > atRest && atRest > 0 && atLv > atProd && root.indexOf('id="v38-fc-prod">Who makes our wines</h3>') >= 0
    && root.indexOf('data-deck="producers"') >= 0 && root.indexOf('data-deck="producers:burgundy"') >= 0 && root.indexOf('data-deck="producers:champagne"') < 0, atRest + ' ' + atProd + ' ' + atLv);
  check('before What it’s made of when it is there', root.indexOf('id="v35-fc-made"') < 0 || root.indexOf('id="v35-fc-made"') > atProd);
  const engine = all.cards.map((c) => c.front + '|' + c.back).join('\n');
  G('OOT.houseLib.drills.FLASHCARD_KINDS = OOT.houseLib.drills.FLASHCARD_KINDS.filter(function (k) { return k !== "producer"; }); V38_CARDS = { h: null, cards: [] }');
  const local = G('v32DeckDef("producers").cards.map(function (c) { return c.front + "|" + c.back; }).join("\\n")');
  check('an older engine: the same cards, made here', local === engine, local);
  G('OOT.houseLib.drills.FLASHCARD_KINDS.push("producer"); V38_CARDS = { h: null, cards: [] }');
  const faces = G('(function () { var out = ""; v32DeckDef("producers").cards.forEach(function (c) { out += v32CardFace(c, { flip: false }) + v32CardFace(c, { flip: true }); }); return out; })()');
  check('every face passes the voice sweep', voiceProblems(faces + root.slice(atProd, atLv)).length === 0, voiceProblems(faces).join(', '));

  /* ================================================================ */
  section('5. the quiz, in the house drills');
  check('codex27\'s house drill kinds gain the four producer questions', ['producerOf', 'producerWhere', 'producerDish', 'producerPour'].every((k) => G('V27_CELLAR_KINDS.some(function (x) { return x.key === ' + JSON.stringify(k) + '; })')));
  /* the engine's draws from a fixed source, so the round is the same every run: a deal codex27 cannot
     finish (Jadot makes two of the four wines, so has two wrong answers to offer) ends its kind's round */
  const small = JSON.parse(G('JSON.stringify(v27CellarHouseQs(function () { return 0; }).filter(function (q) { return /-producer[A-Z][a-z]+$/.test(q.id); }))'));
  check('three producers deal which of our wines a producer makes (the four wines its options)', small.some((q) => /-producerDish$/.test(q.id)), small.map((q) => q.id).join(', '));
  /* the quick quiz deals from Math.random, twelve tries a round over four kinds, and a round over three
     producers (Jadot's deal falling short) can miss them all; a fixed source and up to five rounds, so the
     check is the same every run and asks whether the dealer finds them, not whether one round was lucky */
  const quick = JSON.parse(G('(function () { var mr = Math.random, s = 7; Math.random = function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x80000000; }; try { var out = []; for (var i = 0; i < 5 && !out.length; i++) out = v32DealHouse(V38_KINDS, "Our List", 2); return JSON.stringify(out); } finally { Math.random = mr; } })()'));
  check('the quick quiz\'s dealer finds them too, every one with four options', quick.length > 0 && quick.every((q) => /-producerDish$/.test(q.id) && q.opts.length === 4), quick.map((q) => q.id).join(', '));
  check('and nothing that needs four producers to answer', !small.some((q) => /-producer(Of|Where|Pour)$/.test(q.id)));
  const dish = small.find((q) => /^h-c-tstjado1-producerDish$/.test(q.id)) || small[0];
  const stems = JSON.parse(G('JSON.stringify(v38ProducerView(v28House()).wines.map(function (w) { return v28Esc(w.name); }))'));
  check('which of our wines: the options are our wines named without their makers', dish && dish.opts.length === 4 && dish.opts.every((o) => stems.indexOf(o) >= 0)
    && dish.opts.every((o) => !/Leflaive|Fichet|Jadot/.test(o)), dish ? dish.opts.join(' | ') : 'none');
  const X = bootDevice({ extra: true });
  await settle(X);
  X.G('render()');
  const qs = JSON.parse(X.G('JSON.stringify(v27CellarHouseQs().filter(function (q) { return /-producer[A-Z][a-z]+$/.test(q.id); }))'));
  const kinds = ['Of', 'Where', 'Dish', 'Pour'];
  check('five producers deal all four kinds', kinds.every((k) => qs.some((q) => new RegExp('-producer' + k + '$').test(q.id))), qs.map((q) => q.id).join(', '));
  const shorts = ['Domaine Leflaive', 'Domaine Fichet', 'Maison Louis Jadot', 'Piper-Heidsieck', 'C.H. Berres'];
  const of = qs.filter((q) => /-producerOf$/.test(q.id));
  check('which producer makes a wine: the label, the wine named without its maker', of.length > 0 && of.every((q) => q.q.indexOf('Which producer makes this wine on our list?<br>') === 0)
    && of.every((q) => q.q.split('<br>')[1].toLowerCase().indexOf(q.opts[q.a].toLowerCase()) < 0), of.map((q) => q.q).join(' | '));
  check('every option another wine producer of the list, no kitchen\'s, no bar\'s', of.every((q) => q.opts.every((o) => shorts.indexOf(o) >= 0)), of.map((q) => q.opts.join('/')).join(' | '));
  const where = qs.filter((q) => /-producerWhere$/.test(q.id));
  const wheres = ['Puligny-Montrachet, Côte de Beaune, Burgundy', 'Mâconnais, Burgundy', 'Beaune, Côte de Beaune, Burgundy', 'Reims, Champagne', 'Mosel, Germany'].map((s) => G('v28Esc(' + JSON.stringify(s) + ')'));
  check('where a producer is: every option a wine producer\'s where', where.length > 0 && where.every((q) => q.q.indexOf('Where is this producer?<br>') === 0 && q.opts.every((o) => wheres.indexOf(o) >= 0)), where.map((q) => q.opts.join('/')).join(' | '));
  const pour = qs.filter((q) => /^h-d-[a-z0-9]{8}-producerPour$/.test(q.id));
  const pourOk = pour.every((q) => {
    const dishId = q.id.slice(2, 12);
    const p = shipped.house.dishes.find((x) => x.id === dishId).pairing.value;
    const right = { [LEFLAIVE]: 'Domaine Leflaive', [FICHET]: 'Domaine Fichet', [PIPER]: 'Piper-Heidsieck', [BERRES]: 'C.H. Berres' }[p.wineId];
    return q.q.indexOf('Which producer’s wine is the first pick with this dish?<br>') === 0 && q.opts[q.a] === right && q.opts.every((o) => shorts.indexOf(o) >= 0);
  });
  check('which producer\'s wine pours with a dish: the dish\'s kept pairing, a dish id on the record', pour.length >= 4 && pourOk, pour.map((q) => q.id + ' ' + q.opts[q.a]).join(' | '));
  const rec = of[0];
  X.G('statRecord(' + JSON.stringify(rec) + ', false)');
  check('recorded like every house drill question: under its h- id, in no level', X.G('Object.keys(ST.q).filter(function (k) { return k.indexOf(' + JSON.stringify(rec.id) + ') >= 0; }).length') === 1
    && X.G('Object.keys(ST.q).filter(function (k) { return k.indexOf(' + JSON.stringify(rec.id) + ') >= 0; }).every(function (k) { return !keyOwned(k, activeLevel); })') === true);
  check('a missed producerOf question offers the wine\'s card to study', X.G('JSON.stringify(v32MissLink(' + JSON.stringify(rec) + '))') === JSON.stringify({ kind: 'card', id: rec.id.slice(2, 12) }));
  check('every label and option passes the voice sweep', voiceProblems(qs.map((q) => q.q + q.opts.join(' ')).join(' ')).length === 0);
  const xlist = X.G('v38State().g = ""; v38ViewHtml()');
  check('five producers: three regions, in the groups\' order', /data-g="champagne"[\s\S]*data-g="burgundy"[\s\S]*data-g="germany-austria"/.test(xlist) && xlist.indexOf('Germany and Austria 1') >= 0);
  X.G('S.view = "houseproducers"; S._v38 = { open: null, g: "" }; V32.pend = "push"; render()');
  const xr = X.H.replaces, xe = X.H.entries.length;
  X.G('v38Act("group", ' + node({ 'data-v38': 'group', 'data-g': 'champagne' }) + ')');
  check('a region chosen replaces in place, its address kept', X.loc.hash === '#/v/houseproducers/g/champagne' && X.H.entries.length === xe && X.H.replaces > xr, X.loc.hash);
  check('the view shows that region and its deck', X.G('v38ViewHtml()').indexOf('id="v38-h-burgundy"') < 0 && X.G('v38ViewHtml()').indexOf('data-deck="producers:champagne">Flash these producers') >= 0);
  X.G('v38Act("open", ' + node({ 'data-v38': 'open', 'data-k': 'c-tstpipr1' }) + ')');
  X.G('v32Back()');
  check('Back from a profile returns to the region it was chosen from', X.G('S._v38.g') === 'champagne' && X.loc.hash === '#/v/houseproducers/g/champagne', X.loc.hash);
  check('an engine without the producer kinds deals none of them, and throws nothing', X.G('(function () { var k = OOT.houseLib.drills.PRODUCER_KINDS; delete OOT.houseLib.drills.PRODUCER_KINDS; V38_QV = { h: null }; var n = v27CellarHouseQs().filter(function (q) { return /-producer[A-Z][a-z]+$/.test(q.id); }).length; OOT.houseLib.drills.PRODUCER_KINDS = k; V38_QV = { h: null }; return n; })()') === 0);
  check('the region of a wine, read from its region', X.G('[v38GroupOf("Reims, Champagne, France"), v38GroupOf("Morgon, Beaujolais, France"), v38GroupOf("Pauillac, Médoc, Bordeaux, France"), v38GroupOf("Côte-Rôtie, Northern Rhône, France"), v38GroupOf("Bandol, Provence, France"), v38GroupOf("Kamptal, Austria"), v38GroupOf("Barolo, Langhe, Piedmont, Italy"), v38GroupOf("Douro, Portugal"), v38GroupOf("Napa Valley, California"), v38GroupOf("Kent, England"), v38GroupOf("")].join(",")')
    === 'champagne,burgundy,bordeaux,rhone,france,germany-austria,italy,spain-portugal,united-states,world,world');

  /* ================================================================ */
  section('6. a house with none, and no house at all');
  const N = bootDevice({ pack: packBare() });
  await settle(N);
  N.G('render()');
  check('no wine producer on the house: no block on any card', N.G('v38Rows(v28House()).length') === 0 && block(N.G('v28CardHtml(' + JSON.stringify(LEFLAIVE) + ')')) === '');
  check('no button on Our Wine List, no door on the level page, no group on the root', N.G('v28StudyHtml()').indexOf('v38all') < 0
    && N.G('applyLevel("certified", true); v32LevelHtml(activeLevel)').indexOf('houseproducers') < 0 && N.G('v32FlashcardsHtml()').indexOf('v38-fc-prod') < 0);
  check('no deck and no question', N.G('v32DeckDef("producers").cards.length') === 0 && N.G('v27CellarHouseQs().filter(function (q) { return /-producer[A-Z][a-z]+$/.test(q.id); }).length') === 0);
  check('the view says so plainly', N.G('S._v38 = { open: null, g: "" }; v38ViewHtml()').indexOf('No producer profiles for our wines yet.') >= 0);
  const Z = bootDevice({ house: false });
  await tick(20);
  check('no OOT: no house, and the view says there is no restaurant', Z.G('v38House()') === null && Z.G('v38ViewHtml()').indexOf('No restaurant on this device yet.') >= 0
    && Z.G('v32FlashcardsHtml()').indexOf('v38-fc-prod') < 0 && Z.G('v32DeckDef("producers").cards.length') === 0);

  /* ================================================================ */
  section('8. the shipped house, as a server opens it');
  const S8 = bootDevice({ pack: JSON.stringify(shipped) });
  await settle(S8);
  S8.G('render()');
  const rows8 = JSON.parse(S8.G('JSON.stringify(v38Rows(v28House()).map(function (r) { return { id: r.id, short: r.short, lib: r.lib ? r.lib.id : null }; }))'));
  const unlinked = rows8.filter((r) => !r.lib).map((r) => r.short).sort();
  check('every wine producer of the house reaches its record in the Codex\'s producers but the three the Codex files as wines',
    rows8.length >= 150 && JSON.stringify(unlinked) === JSON.stringify(['Dom Pérignon', 'Masseto', 'Opus One']), rows8.length + ': ' + unlinked.join(', '));
  const libOf = (short) => (rows8.find((r) => r.short === short) || {}).lib;
  check('et is read as and: Bouchard Père & Fils is Bouchard Père et Fils, Jean-Paul and Benoît Droin is Jean-Paul et Benoît Droin',
    libOf('Bouchard Père & Fils') === 'p-maison-bouchard' && libOf('Jean-Paul and Benoît Droin') === 'p-dom-droin');
  check('a record\'s name with an aside is read up to it: Do Ferreiro (Gerardo Méndez) is Do Ferreiro', libOf('Do Ferreiro') === 'p-do-ferreiro');
  check('a record\'s aka: the names its own text gives the estate (Matrot, Raveneau, Dauvissat, Damien Martin, Graham\'s, Gainey)',
    libOf('Thierry et Pascale Matrot') === 'p-dom-matrot' && libOf('Domaine François Raveneau') === 'p-dom-raveneau' && libOf('Domaine René et Vincent Dauvissat') === 'p-dom-vincent-dauvissat'
    && libOf('Damien Martin') === 'p-dom-robert-damien-martin' && libOf('Graham\'s') === 'p-grahams' && libOf('Gainey') === 'p-gainey-vineyard');
  check('the rules that keep two estates apart still hold over the whole corpus', S8.G('v38Library(["Leflaive & Associés"])') === null
    && S8.G('v38Library(["Les Héritiers du Comte Lafon"]).id') === 'p-heritiers-comte-lafon' && S8.G('v38Library(["Bouchard Aîné & Fils"])') === null);
  S8.G('v29Open("cellar")');
  await S8.G('V29_LIST.promise');
  await tick(10);
  const prof8 = (name, vintage) => S8.G('(function () { var r = V29_LIST.rows.filter(function (x) { return x.name.indexOf(' + JSON.stringify(name) + ') === 0 && x.vintage === ' + JSON.stringify(vintage) + '; })[0]; var p = r ? v38ListRowProducer(r) : null; return r ? (p ? p.short : "none") : "no row"; })()');
  check('a row the list prints under a shorter name finds its house profile: Caymus 50th Anniversary 2022, Duckhorn Three Palms 2015',
    prof8('Caymus "50th Anniversary"', '2022') === 'Caymus Vineyards' && prof8('Duckhorn "Three Palms"', '2015') === 'Duckhorn Vineyards of St. Helena',
    prof8('Caymus "50th Anniversary"', '2022') + ' / ' + prof8('Duckhorn "Three Palms"', '2015'));
  const reach = (pk) => S8.G('(function () { var rs = V29_LIST.rows.filter(function (x) { return x.pk === ' + JSON.stringify(pk) + '; }); var hit = {}; rs.forEach(function (r) { var p = v38ListRowProducer(r); hit[p ? p.short : "none"] = (hit[p ? p.short : "none"] || 0) + 1; }); return JSON.stringify(hit); })()');
  const counts8 = {};
  ['droin', 'duckhorn', 'joseph-phelps', 'caymus', 'veuve-fourny', 'grgich-hills', 'banfi', 'schramsberg', 'silver-oak', 'lopez-de-heredia', 'gainey', 'matrot', 'domaine-matrot', 'bouchard-pere-et-fils'].forEach((pk) => { counts8[pk] = JSON.parse(reach(pk)); });
  const none8 = Object.keys(counts8).filter((pk) => !Object.keys(counts8[pk]).length || counts8[pk].none);
  check('every row of those estates offers its profile: Droin, Duckhorn, Phelps, Caymus, Veuve Fourny, Grgich Hills, Banfi, Schramsberg, Silver Oak, López de Heredia, Gainey, Matrot, Bouchard',
    !none8.length && Object.keys(counts8).every((pk) => Object.keys(counts8[pk]).length === 1), JSON.stringify(counts8));
  check('the list\'s own key: a Domaine Matrot row the list prints as Thierry & Pascale Matrot is the Matrot profile', counts8['domaine-matrot'] && counts8['domaine-matrot']['Thierry et Pascale Matrot'] >= 3);
  check('no other house\'s profile on a row by its key alone: a Taittinger row is Taittinger\'s, a Pierre Sparr row Pierre Sparr\'s, never the house Champagne\'s',
    Object.keys(JSON.parse(reach('taittinger'))).join() === 'Champagne Taittinger of Reims' && Object.keys(JSON.parse(reach('pierre-sparr'))).join() === 'Pierre Sparr', reach('taittinger') + ' ' + reach('pierre-sparr'));
  check('a key whose cards reach two producers answers neither', S8.G('(function () { var save = V38_PK; V38_PK = { rows: v38Rows(v28House()), list: V29_LIST.rows, map: { "x-two": [1, 2] } }; var r = v38ByListKey(v28House(), "x-two"); V38_PK = save; return r; })()') === null);
  /* The by-the-glass rows (the walk-through of 10 October 2026, its second round): a producer the
     house prints with an aside, one it prints under a family word, and a label the list files as a
     producer each offer the profile, so every glass whose producer the house profiles shows it. */
  const glass8 = JSON.parse(S8.G('JSON.stringify(V29_LIST.rows.filter(function (x) { return /^By the Glass/.test(x.section); }).map(function (x) { var p = v38ListRowProducer(x); return [x.name, x.vintage, p ? p.short : ""]; }))'));
  const glassOf = (re) => (glass8.find((g) => re.test(g[0])) || [])[2];
  check('every one of the fourteen glasses offers its producer\'s profile', glass8.length === 14 && glass8.every((g) => g[2]), glass8.filter((g) => !g[2]).map((g) => g[0]).join(' | '));
  check('a name the house prints with an aside is read up to it: the list\'s Pazo das Bruxas is the house\'s Pazo das Bruxas (Familia Torres)', glassOf(/Pazo das Bruxas/) === 'Familia Torres', String(glassOf(/Pazo das Bruxas/)));
  check('a family word stands in for the estate word: the list\'s Domaine Durand is the house\'s Famille Durand', glassOf(/Domaine Durand/) === 'Famille Durand'
    && S8.G('v38Bare("Famille Durand") === v38Bare("Domaine Durand") && v38Bare("Familia Torres") === "torres"') === true, String(glassOf(/Domaine Durand/)));
  check('a label the list files as its producer opens a house wine\'s label: Moulin d\'Issan is Château d\'Issan\'s, whatever the vintage', glassOf(/Moulin d'Issan/) === 'Château d\'Issan'
    && S8.G('v38ByLabel(v28House(), "Moulin d\'Issan").short') === 'Château d\'Issan', String(glassOf(/Moulin d'Issan/)));
  check('a label is read whole words from its start, two words at least, and two producers answer neither', S8.G('v38ByLabel(v28House(), "Moulin")') === null
    && S8.G('v38ByLabel(v28House(), "Issan Bordeaux")') === null && S8.G('v38ByLabel(v28House(), "")') === null);
  /* The quiz: two wines of one producer whose labels differ only in an apostrophe are one answer (the
     house's glass and bottle of its own Champagne; the walk-through met both as options) */
  const twinPack = JSON.parse(JSON.stringify(shipped));
  twinPack.house.wines.forEach((w) => { if (/^Brennan.s Essential by Piper-Heidsieck/.test(w.name)) w.wine = 'Brennan\'s Essential Extra Brut'; else if (/^Piper-Heidsieck .Brennan.s Essential/.test(w.name)) w.wine = 'Brennan\u2019s Essential Extra Brut'; });
  const TW = bootDevice({ pack: JSON.stringify(twinPack) });
  await settle(TW);
  const twins = JSON.parse(TW.G('JSON.stringify(v38ProducerBase(v28House()).wines.map(function (x) { return x.w.name; }))'));
  const twinFold = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const essential = twins.filter((n) => /^brennan s essential extra brut/.test(twinFold(n)));
  check('the quiz deals one Brennan\'s Essential Extra Brut, never the glass and the bottle as two options', essential.length === 1
    && new Set(twins.map(twinFold)).size === twins.length, essential.join(' | ') + ' of ' + twins.length);
  check('and the shipped house deals no two wines a reader cannot tell apart', S8.G('(function () { var seen = {}, dup = 0; v38ProducerBase(v28House()).wines.forEach(function (x) { var k = v38Whole(x.w.name); if (seen[k]) dup++; seen[k] = 1; }); return dup; })()') === 0);
  /* What it's made of on a shipped card: the producer is told once */
  const LEF21 = wineBy(/^Domaine Leflaive Mâcon-Verzé 2021$/);
  const card8 = S8.G('v28CardHtml(' + JSON.stringify(LEF21) + ')');
  const made8 = (/<section class="v28-block v35-madeof"[\s\S]*?<\/section>/.exec(card8) || [''])[0];
  const lefComps = shipped.house.components.filter((c) => c.itemIds.indexOf(LEF21) >= 0 && /^Domaine Leflaive$/.test(c.name)).map((c) => ({ id: c.id, prod: !!c.producer }));
  check('Domaine Leflaive is drawn once on its card: in Who makes it, neither its own component nor the older story in Stories',
    lefComps.length === 2 && lefComps.every((c) => made8.indexOf('data-component="' + c.id + '"') < 0) && block(card8).indexOf('<summary>Domaine Leflaive') >= 0, JSON.stringify(lefComps));
  const doubled = JSON.parse(S8.G('JSON.stringify(v28House().wines.filter(function (w) { var who = v38RowsFor(v28House(), w.id).map(function (r) { return r.id; }); var names = {}; return v35Groups(v28House(), w.id).some(function (g) { return g.components.some(function (c) { if (who.indexOf(c.id) >= 0) return true; var f = v38Whole(c.name); if (names[f]) return true; names[f] = 1; return false; }); }); }).map(function (w) { return w.name; }))'));
  check('no wine card draws a producer in Stories that Who makes it draws, nor one name twice', doubled.length === 0, doubled.slice(0, 4).join(' | '));
  check('a component the producer block tells keeps its card in the Flashcards\' component decks', S8.G('v32DeckDef("components").cards.some(function (c) { return c.id === ' + JSON.stringify(lefComps.find((c) => c.prod) ? lefComps.find((c) => c.prod).id : '') + '; })') === true);
  /* a door followed from the card and Back: the disclosures that were open open again before the scroll returns */
  S8.G('v32OpenWine(' + JSON.stringify(LEF21) + ')');
  S8.G('var __box = { querySelectorAll: function () { return __dets; } }; var __dets = [{ open: false }, { open: true }, { open: false }, { open: true }]; var __get = document.getElementById; document.getElementById = function (id) { return id === "view" ? __box : __get(id); };');
  S8.G('v28Act("producer", ' + node({ 'data-v28': 'producer', 'data-k': 'p-dom-leflaive' }) + ')');
  check('In the Codex\'s producers on the card pushes the Codex\'s Domaine Leflaive', S8.G('S.view') === 'producers' && S8.G('S._prod.id') === 'p-dom-leflaive', S8.G('S.view'));
  S8.G('__dets = [{ open: false }, { open: false }, { open: false }, { open: false }]');
  S8.G('v32Back()');
  check('Back draws the card with the disclosures open as they were, so the page is as tall and the scroll lands where it was',
    S8.G('S.view') === 'cellar' && S8.G('S._v28.open') === LEF21 && S8.G('__dets.map(function (d) { return d.open ? 1 : 0; }).join("")') === '0101', S8.G('S.view') + ' ' + S8.G('__dets.map(function (d) { return d.open ? 1 : 0; }).join("")'));
  S8.G('document.getElementById = __get');
  check('each card door has its own id, so Back focuses the very door pressed', block(card8).indexOf('id="v38-lib-') >= 0);
  /* the house arriving on a producer's address: the view is drawn again */
  S8.G('S.view = "houseproducers"; S._v38 = { open: null, g: "" }; var __n = 0; var __render = render; render = function () { __n++; return __render.apply(this, arguments); }; v27Redraw(); render = __render;');
  check('the house landing draws the producers view again (codex27\'s redraw knew only its own screens)', S8.G('__n') === 1);
  S8.G('S.view = "flashcards"; __n = 0; render = function () { __n++; return __render.apply(this, arguments); }; v27Redraw(); render = __render;');
  check('and leaves the screens it never drew as they were', S8.G('__n') === 0);
  check('the shipped house\'s producer decks count a card learnt for each card answered', (function () {
    S8.G('var __c = v32DeckDef("producers").cards.slice(0, 2); __c.forEach(function (c) { v27RecordHouse(v38CardKey(c), "Our List", c.front, true); })');
    return S8.G('v32DeckDef("producers").learnt') === 2;
  })(), S8.G('v32DeckDef("producers").cards.length') + ' cards, ' + S8.G('v32DeckDef("producers").learnt') + ' learnt');

  /* ================================================================ */
  section('7. the file and its wiring');
  const src = fs.readFileSync(path.join(JS, 'codex38.js'), 'utf8');
  const unescaped = src.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
  check('codex38.js: no dash, no glyph, no level numeral (its escapes read as what they are)', voiceProblems(unescaped).length === 0, voiceProblems(unescaped).join(', '));
  check('codex38.js declares with var and function only, no arrow', !/^\s*(let|const|class)\s/m.test(src) && src.indexOf('=>') < 0);
  check('codex38.js names nobody and ships no key', !/Lizzy|sk-ant|api[_-]?key/i.test(src));
  const me = fs.readFileSync(__filename, 'utf8');
  check('this gate carries no dash either', voiceProblems(me.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)))).filter((p) => !/retired|numeral/.test(p)).length === 0);
  const index = path.join(ROOT, 'index.html');
  const sw = path.join(ROOT, 'sw.js');
  if (fs.existsSync(index) && fs.existsSync(sw)) {
    check('index.html loads codex38 after codex35 (and any later layers) and before boot, with ?v=', (() => {
      const scripts = [...fs.readFileSync(index, 'utf8').matchAll(/<script src="js\/([^"?]+)\?v=\d+"><\/script>/g)].map((m) => m[1]);
      const at = scripts.indexOf('codex38.js');
      return at > scripts.indexOf('codex35.js') && scripts.indexOf('codex35.js') >= 0 && scripts.indexOf('boot.js') > at && scripts.filter((n) => n === 'codex38.js').length === 1;
    })());
    const swSrc = fs.readFileSync(sw, 'utf8');
    check('sw.js lists codex38.js in ASSETS after codex35.js', swSrc.indexOf("'./js/codex38.js'") > swSrc.indexOf("'./js/codex35.js'") && swSrc.indexOf("'./js/codex35.js'") > 0);
    const n = Number((swSrc.match(/const CACHE = '(?:oot-)?codex-v(\d+)';/) || [])[1]);
    check('sw.js moved its CACHE past the edition before codex38 (codex-v90)', n > 90, String(n));
  }
  ['check-home.js', 'check-merge.js', 'check-components.js', 'check-nav.js', 'check-atlas-ui.js', 'check-videos.js', 'check-winelist.js'].forEach((f) => {
    const p = path.join(__dirname, f);
    if (!fs.existsSync(p)) return;
    const s = fs.readFileSync(p, 'utf8');
    /* a list names a file followed by a comma or the list's close; a path.join of one file is no list */
    const lists = (s.match(/'codex35\.js'\s*[,\]]/g) || []).length;
    check(f + ' names codex38.js in every list that names codex35.js (' + lists + ')', lists > 0 && (s.match(/'codex38\.js'\s*[,\]]/g) || []).length >= lists);
  });

  console.log('');
  console.log('check-producers-house: ' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
