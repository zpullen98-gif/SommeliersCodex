/**
 * WHAT IS IT MADE OF, AND WHAT DO WE COMPARE IT WITH?
 *
 * codex35 (the component deep dive, 5 October 2026) draws, on a house wine's
 * card, the wine's components grouped Ingredients, Techniques, Stories and
 * its one or two comparisons; deals the component decks on codex32's one card
 * screen; and opens a grape, producer or primer named by #ref= from another
 * room. This loads the SHIPPED chain with codex32 and codex35 on top of the
 * SHIPPED engine and the shipped Brennan's pack, with two components and a
 * comparison put on the C.H. Berres Riesling here, over a Map storage, and
 * asks:
 *
 *   1. the card's What it's made of block sits before the five parts, its
 *      kinds in order, each component a closed disclosure holding its say,
 *      explanation, card and video, with Flash these components
 *   2. Compare with opens the grape through codex28's grape door, a house
 *      wine through its card, a producer and a chapter through their doors,
 *      a Table technique and a Ledger cocktail as links into their rooms on
 *      the suite's path, and writes a classic out with what is the same and
 *      what differs
 *   3. the decks: every component, one per kind, and one wine's components in
 *      the card's order, never shuffled; the card face names its kind; a
 *      grade is recorded under h-{id}-component and counts as learnt
 *   4. the Flashcards root lists a deck per kind under What it's made of
 *   5. #ref=Riesling opens the grape run on Riesling and takes the hash away
 *   6. a wine with no components and a house with none draw nothing new
 *   7. codex35.js: no dash, no arrow, var and function only, no glyph, nobody
 *      named, and index.html and sw.js carry it after codex33 and before boot
 *
 *   node .scripts/check-components.js [jsDir]
 *   OOT_SHARED=<dir holding oot-house.js>   default ../worldtable/static/shared
 *
 * Exits non-zero on any failure.
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
for (const f of [ENGINE, UI_FILE, PACK_FILE]) {
  if (!fs.existsSync(f)) {
    console.error('check-components: no ' + path.basename(f) + ' at ' + SHARED + ' (set OOT_SHARED)');
    process.exit(1);
  }
}
if (!fs.existsSync(path.join(JS, 'codex35.js'))) {
  console.log('check-components: no codex35.js in ' + JS + ', SKIPPED');
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
  'codex30.js', 'codex32.js', 'codex35.js', 'boot.js'];

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

/* check-home's keep-set, word for word, as check-house holds it */
const NUMERAL_RE = /\bLevel\s+(I|II|III|IV)\b/;
function voiceProblems(s) {
  const out = [];
  if (s.indexOf(String.fromCharCode(0x2014)) >= 0) out.push('a long dash (U+2014)');
  if (/\x20-{2}\x20/.test(s)) out.push('a double hyphen');
  if (/practi[cs]e/i.test(s)) out.push('the retired word for study');
  if (NUMERAL_RE.test(s)) out.push('a level numeral: ' + s.match(NUMERAL_RE)[0]);
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if ((c >= 0x2190 && c <= 0x2BFF) || (c >= 0x1F000) || c === 0xFE0F || (c >= 0xE000 && c <= 0xF8FF)) {
      out.push('a glyph U+' + c.toString(16).toUpperCase());
      break;
    }
  }
  return out;
}

/* check-house's sandbox: one stub node, a Map-backed localStorage, a window
   that records its listeners, and a history that records what is pushed. */
function makeSandbox(seed, opts) {
  const o = opts || {};
  const store = Object.create(null);
  Object.keys(seed || {}).forEach((k) => { store[k] = seed[k]; });
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
  const listeners = { storage: [], popstate: [] };
  const hist = { pushed: [], replaced: [], backs: 0 };
  const scrolls = [];
  const sandbox = {
    console,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    },
    navigator: { userAgent: 'node', onLine: true },
    setTimeout, clearTimeout, setInterval, clearInterval,
    matchMedia: () => ({ matches: false, addEventListener() { }, addListener() { } }),
    requestAnimationFrame: (f) => setTimeout(f, 0),
    alert() { }, confirm: () => false, prompt: () => null,
    fetch: () => Promise.reject(new Error('no network in this harness')),
    scrollTo(x, y) { scrolls.push(y); }, scrollBy() { }, getComputedStyle: () => ({ getPropertyValue: () => '' }),
    innerWidth: 390, innerHeight: 844, devicePixelRatio: 1, scrollY: 0,
    addEventListener(type, fn) { if (listeners[type]) listeners[type].push(fn); },
    removeEventListener(type, fn) { if (listeners[type]) { const i = listeners[type].indexOf(fn); if (i >= 0) listeners[type].splice(i, 1); } },
    history: {
      pushState(s) { hist.pushed.push(s); }, replaceState(s, t, u) { hist.replaced.push({ s, u }); }, back() { hist.backs++; },
    },
    speechSynthesis: undefined, Notification: undefined,
    performance: { now: () => 0 },
    URL: globalThis.URL, Blob: globalThis.Blob, TextEncoder: globalThis.TextEncoder,
    Intl: globalThis.Intl, Date: globalThis.Date, Math: globalThis.Math, JSON: globalThis.JSON,
    Promise: globalThis.Promise, Map: globalThis.Map, Set: globalThis.Set,
  };
  if (!o.noLocation) sandbox.location = o.location || { href: 'http://localhost/', search: '', hash: '' };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.document = {
    documentElement: stubEl(), head: stubEl(), body: stubEl(),
    createElement: stubEl, createDocumentFragment: stubEl, createTextNode: () => stubEl(),
    getElementById: stubEl, querySelector: stubEl, querySelectorAll: () => [],
    addEventListener() { }, removeEventListener() { },
    readyState: 'complete', title: '',
    get activeElement() { return null; },
    get head() { return stubEl(); }, get body() { return stubEl(); },
  };
  const ctx = vm.createContext(sandbox);
  const G = (expr) => vm.runInContext(expr, ctx);
  return { sandbox, ctx, G, store, listeners, hist, scrolls };
}

function loadChain(H, list) {
  for (const f of (list || FILES)) {
    const p = path.join(JS, f);
    if (!fs.existsSync(p)) {
      if (OPTIONAL.has(f)) continue;
      console.error('missing ' + f + ' in ' + JS);
      process.exit(1);
    }
    try { vm.runInContext(fs.readFileSync(p, 'utf8'), H.ctx, { filename: f }); }
    catch (e) {
      console.error('FAILED to load ' + f + ': ' + e.message);
      console.error(String(e.stack).split('\n').slice(0, 6).join('\n'));
      process.exit(1);
    }
  }
}

const tick = (ms) => new Promise((r) => setTimeout(r, ms || 10));

/* The shipped pack with two components and two comparisons on the Berres, and a video naming one. */
const shipped = JSON.parse(fs.readFileSync(PACK_FILE, 'utf8'));
const BERRES = shipped.house.wines.find((w) => /Berres/.test(w.name)).id;
const AUSLESE = shipped.house.wines.find((w) => /Auslese/.test(w.name)).id;
/* The shipped edition files its own components and comparisons; the cases stand on their own alone. */
function bareOf(pack) {
  const p = JSON.parse(JSON.stringify(pack));
  delete p.house.components;
  for (const list of ['dishes', 'wines', 'cocktails']) for (const r of p.house[list] || []) delete r.compare;
  for (const v of p.house.videos || []) delete v.componentIds;
  return p;
}
const bare = bareOf(shipped);
function packWith() {
  const p = JSON.parse(JSON.stringify(bare));
  const h = p.house;
  const ts = Date.parse(h.pack.builtAt);
  const mark = (value) => ({ value, by: 'person', ts });
  h.components = (h.components || []).concat([
    { id: 'c-testst01', kind: 'story', name: 'A test story', explain: mark('A first paragraph.\n\nA second paragraph.'), card: mark({ front: 'A test story question?', back: 'A test story answer, kept.' }), itemIds: [BERRES], termIds: [], ts },
    { id: 'c-testgr01', kind: 'ingredient', name: 'Riesling', say: mark('REES-ling.'), explain: mark('A white grape with racy acidity.\n\nOn the Mosel it grows on slate.'), card: mark({ front: 'What is Riesling?', back: 'A white grape with racy acidity, here off-dry from the Mosel slate.' }), itemIds: [BERRES], termIds: [], ts },
    { id: 'c-testnc01', kind: 'technique', name: 'No card yet', explain: mark('Only words.\n\nNo card.'), itemIds: [BERRES], termIds: [], ts }
  ]);
  const berres = h.wines.find((w) => w.id === BERRES);
  berres.compare = mark([
    { app: 'codex', ref: 'Riesling', label: 'The Riesling grape card', same: 'Racy acidity and slate.', different: 'The card covers every style.' },
    { app: 'codex', ref: AUSLESE, label: 'Our Auslese half bottle', same: 'Mosel Riesling.', different: 'Sweet and aged.' }
  ]);
  const auslese = h.wines.find((w) => w.id === AUSLESE);
  auslese.compare = mark([
    { app: 'table', ref: 'technique/hollandaise', label: 'A Library technique', same: 'S.', different: 'D.' },
    { app: 'ledger', ref: 'Sazerac', label: 'The canon Sazerac', same: 'S.', different: 'D.' }
  ]);
  const champ = h.wines.find((w) => /Essential/.test(w.name));
  champ.compare = mark([
    { app: 'codex', ref: 'Château Angélus', label: 'A producer', same: 'S.', different: 'D.' },
    { app: 'codex', ref: 'Germany', label: 'A chapter', same: 'S.', different: 'D.' }
  ]);
  const lafitte = h.wines.find((w) => /Lafitte/.test(w.name));
  lafitte.compare = mark([{ app: 'classic', ref: '', label: 'A grower Champagne', same: 'The same method.', different: 'One family grows and makes it.' }]);
  h.videos[0].componentIds = ['c-testgr01'];
  return JSON.stringify(p);
}

function bootDevice(opts) {
  const o = opts || {};
  const D = makeSandbox(o.seed || {}, o);
  vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), D.ctx, { filename: 'oot-house.js' });
  vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), D.ctx, { filename: 'oot-house-ui.js' });
  const lib = D.G('OOT.houseLib');
  D.sandbox.OOT.house = lib.createHouseApi(lib.mapStorage(new Map()), { win: D.sandbox, now: () => NOW, rand: seeded(21), from: 'codex' });
  const text = o.pack || packWith();
  D.sandbox.fetch = (url) => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(text) });
  loadChain(D, o.files);
  return D;
}
async function settle(D) {
  await D.G('V27_LAST');
  await D.G('V27_BOOT_PACK');
  await tick(30);
  await D.G('V27_WRITING');
  await tick(20);
}

/* Only what codex35 drew: its two sections, cut out of a card. */
function blocks(html) {
  const out = [];
  const re = /<section class="v28-block v35-(?:madeof|compare)"[\s\S]*?<\/section>/g;
  let m;
  while ((m = re.exec(html))) out.push(m[0]);
  return out.join('');
}

async function main() {
  section('what the wine is made of, on its card');
  const D = bootDevice({ location: { href: 'http://localhost/codex/', pathname: '/codex/', search: '', hash: '' } });
  await settle(D);
  const G = D.G;
  check('the house carries the test components', G('v28House().components.length') >= 3);
  const card = G('v28CardHtml(' + JSON.stringify(BERRES) + ')');
  const at = card.indexOf('id="v35-madeof-h"');
  check('the block is drawn, headed What it\u2019s made of', card.indexOf('<h3 class="secgroup" id="v35-madeof-h">What it\u2019s made of</h3>') >= 0);
  check('before the five parts, after the wine block', at > 0 && at < card.indexOf('<h3 class="secgroup">The five parts</h3>') && card.indexOf('The wine') < at, String(at));
  const kinds = (card.match(/data-kind="([a-z]+)"/g) || []).map((s) => s.slice(11, -1));
  check('the kinds in order: Ingredients, Techniques, Stories', JSON.stringify(kinds) === JSON.stringify(['ingredient', 'technique', 'story']), kinds.join(','));
  check('each component a closed disclosure named by its name', /<li data-component="c-testgr01"><details class="v28-q v35-comp"><summary>Riesling<\/summary>/.test(card) && !/v35-comp" open/.test(card));
  check('opening to how to say it, the explanation in paragraphs and the card', card.indexOf('Say it:</span> REES-ling.') >= 0 && card.indexOf('<p>On the Mosel it grows on slate.</p>') >= 0
    && card.indexOf('<dt>On the card</dt><dd>What is Riesling?</dd>') >= 0);
  check('and the video that teaches it, a link out in a new tab', /data-component="c-testgr01">[\s\S]*?class="v28-link v30-title" href="https:[^"]+" target="_blank" rel="noopener"[\s\S]*?<\/details>/.test(card));
  check('a component with nothing but words shows its words and no card', /data-component="c-testnc01">[\s\S]*?<p>No card.<\/p><\/div>/.test(card));
  check('Flash these components, a gold button', card.indexOf('data-v28="v35flash" data-id="' + BERRES + '">Flash these components</button>') >= 0);

  section('compare with');
  check('a grape on the level\'s list opens through codex28\'s grape door', card.indexOf('data-v28="grape" data-g="Riesling">The Riesling grape card</button> <span class="v28-soft">The grape card</span>') >= 0);
  check('a house wine opens its card', card.indexOf('data-v28="open" data-id="' + AUSLESE + '">Our Auslese half bottle</button> <span class="v28-soft">On our list</span>') >= 0);
  check('with what is the same and what differs', card.indexOf('<span class="v28-soft">The same:</span> Racy acidity and slate.') >= 0 && card.indexOf('<span class="v28-soft">What differs:</span> Sweet and aged.') >= 0);
  const aus = G('v28CardHtml(' + JSON.stringify(AUSLESE) + ')');
  check('a Table technique and a Ledger cocktail are links into their rooms on the suite\'s path', aus.indexOf('<a class="v28-link v35-label" href="/table/technique/hollandaise">A Library technique</a> <span class="v28-soft">in the World Table</span>') >= 0
    && aus.indexOf('href="/ledger/#/library/sazerac">The canon Sazerac</a> <span class="v28-soft">in the Ledger</span>') >= 0);
  check('the Auslese has no components and so no block', aus.indexOf('v35-madeof-h') < 0 && aus.indexOf('v35-compare-h') >= 0);
  const champ = G('v28CardHtml(v28House().wines.filter(function (w) { return /Essential/.test(w.name); })[0].id)');
  check('a producer opens through its door', champ.indexOf('data-v28="producer" data-k="p-ch-angelus">A producer</button>') >= 0);
  G('applyLevel("certified", true)');
  const champV = G('v28CardHtml(v28House().wines.filter(function (w) { return /Essential/.test(w.name); })[0].id)');
  check('a chapter opens through its door at the level that holds it', champV.indexOf('data-v28="primer" data-k="Germany">A chapter</button> <span class="v28-soft">The chapter</span>') >= 0);
  G('applyLevel("intro", true)');
  const laf = G('v28CardHtml(v28House().wines.filter(function (w) { return /Lafitte/.test(w.name); })[0].id)');
  check('a classic is written out, no link', laf.indexOf('<span class="v35-label">A grower Champagne</span> <span class="v28-soft">A classic, for comparison</span>') >= 0 && !/v35-compare[\s\S]*<a [^>]*>A grower/.test(laf));
  G('location.pathname = "/"');
  const off = G('v28CardHtml(' + JSON.stringify(AUSLESE) + ')');
  check('off the suite\'s path the other rooms are words', blocks(off).indexOf('href="/table/') < 0 && blocks(off).indexOf('href="/ledger/') < 0 && blocks(off).indexOf('<span class="v35-label">A Library technique</span>') >= 0);
  G('location.pathname = "/codex/"');
  const drawn = blocks(card) + blocks(aus) + blocks(champ) + blocks(laf);
  check('every string the blocks draw passes the voice sweep', drawn.length > 1000 && voiceProblems(drawn).length === 0, voiceProblems(drawn).join(', '));
  check('no allergen box and no checked attribute', !/checked|type="checkbox"/.test(card));

  section('the decks');
  const all = JSON.parse(G('JSON.stringify(v32DeckDef("components"))'));
  check('every component with a kept card, kind component', all.kind === 'component' && all.cards.length === 2 && all.name === 'Every component');
  const tech = JSON.parse(G('JSON.stringify(v32DeckDef("components:ingredient"))'));
  check('a deck per kind', tech.name === 'Ingredients' && tech.cards.length === 1 && tech.cards[0].front === 'What is Riesling?');
  const one = JSON.parse(G('JSON.stringify(v32DeckDef("item-components:' + BERRES + '"))'));
  check('one wine\'s components in the card\'s order', one.cards.map((c) => c.id).join(',') === 'c-testgr01,c-testst01' && /: what it is made of$/.test(one.name), one.cards.map((c) => c.id).join(','));
  check('a kind that is not one, and a wine id that is not one, deal nothing', G('v32DeckDef("components:garnish").kind') === 'house' && G('v32DeckDef("components:garnish").cards.length') === 0);
  G('v28Act("v35flash", { getAttribute: function (k) { return k === "data-id" ? ' + JSON.stringify(BERRES) + ' : null; } })');
  check('Flash these components starts the run at once, in order', G('S.view') === 'housedeck' && G('S._v32run.deckId') === 'item-components:' + BERRES && G('S._v32run.deck.join(",")') === '0,1');
  const face = G('v32CardFace(v32RunCard(), S._v32run)');
  check('the face names the kind and asks the question', face.indexOf('Front \u00b7 Ingredients') >= 0 && face.indexOf('What is Riesling?') >= 0 && face.indexOf('racy acidity, here') < 0);
  G('S._v32run.flip = true');
  check('the back gives the answer', G('v32CardFace(v32RunCard(), S._v32run)').indexOf('A white grape with racy acidity, here off-dry from the Mosel slate.') >= 0);
  G('v32Grade(true)');
  check('Got it records under h-{id}-component', G('Object.keys(ST.q).some(function (k) { return /h-c-testgr01-component$/.test(k); })') === true);
  check('and the card counts as learnt', G('v32DeckDef("components:ingredient").learnt') === 1);
  G('S._v32run = null; S.view = "flashcards"');
  const root = G('v32FlashcardsHtml()');
  check('the Flashcards root lists a deck per kind under What it\u2019s made of, before the words', root.indexOf('id="v35-fc-made">What it\u2019s made of</h3>') >= 0
    && root.indexOf('data-deck="components:ingredient"') >= 0 && root.indexOf('data-deck="components:story"') >= 0 && root.indexOf('data-deck="components:technique"') < 0
    && (root.indexOf('v32-fc-words') < 0 || root.indexOf('v35-fc-made') < root.indexOf('v32-fc-words')));
  check('the deck screen starts in order too', G('(function () { S._v32deck = "item-components:' + BERRES + '"; v32StartRun(S._v32deck, { push: true }); return S._v32run.deck.join(","); })()') === '0,1');

  section('the door from another room');
  const R = bootDevice({ location: { href: 'http://localhost/codex/#ref=Riesling', pathname: '/codex/', search: '', hash: '#ref=Riesling' } });
  check('the hash is read once and taken away', R.hist.replaced.some((x) => x.u === '/codex/'));
  await settle(R);
  R.G('render()');
  check('the first render opens the grape run on Riesling', R.G('S._v32run && S._v32run.deckId') === 'grapes-all' && R.G('v32RunCard().id') === 'Riesling', String(R.G('S._v32run && S._v32run.deckId')));
  const P = bootDevice({ location: { href: 'http://localhost/codex/#ref=Germany', pathname: '/codex/', search: '', hash: '#ref=Germany' } });
  await settle(P);
  P.G('render()');
  /* at the level the device boots on: Intro's chapter the home's map files under Germany, or Village's own */
  check('a primer opens its chapter at the current level', P.G('S.view') === 'primer' && P.G('S.primerKey') !== null && P.G('S.primerKey') !== undefined, P.G('String(S.primerKey)'));

  section('a house with none');
  const N = bootDevice({ pack: JSON.stringify(bare), location: { href: 'http://localhost/codex/', pathname: '/codex/', search: '', hash: '' } });
  await settle(N);
  const plain = N.G('v28CardHtml(' + JSON.stringify(BERRES) + ')');
  check('no component block and no comparison block', plain.indexOf('v35-madeof-h') < 0 && plain.indexOf('v35-compare-h') < 0 && plain.indexOf('id="v28-h"') > 0);
  check('no component deck and no row on the root', N.G('v32DeckDef("components").cards.length') === 0 && N.G('v32FlashcardsHtml()').indexOf('v35-fc-made') < 0);

  section('the shipped edition');
  const E = bootDevice({ pack: JSON.stringify(shipped), location: { href: 'http://localhost/codex/', pathname: '/codex/', search: '', hash: '' } });
  await settle(E);
  const real = E.G('v28CardHtml(' + JSON.stringify(BERRES) + ')');
  const realCards = (shipped.house.components || []).filter((c) => c.card && c.card.value).length;
  check('the shipped Berres card draws its own components and comparison', real.indexOf('v35-madeof-h') > 0 && real.indexOf('v35-compare-h') > 0);
  check('the shipped components deal as one deck, a card each', realCards > 0 && E.G('v32DeckDef("components").cards.length') === realCards, String(E.G('v32DeckDef("components").cards.length')) + ' of ' + realCards);

  section('the file and its wiring');
  const src = fs.readFileSync(path.join(JS, 'codex35.js'), 'utf8');
  const unescaped = src.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
  check('codex35.js: no dash, no glyph, no level numeral (its escapes read as what they are)', voiceProblems(unescaped).length === 0, voiceProblems(unescaped).join(', '));
  check('codex35.js declares with var and function only, no arrow', !/^\s*(let|const|class)\s/m.test(src) && src.indexOf('=>') < 0);
  check('codex35.js names nobody', !/Lizzy/.test(src));
  const index = path.join(ROOT, 'index.html');
  const sw = path.join(ROOT, 'sw.js');
  if (fs.existsSync(index) && fs.existsSync(sw)) {
    check('index.html loads codex35 after codex33 and codex34 and before boot', /codex33\.js\?v=\d+"><\/script>\s*(?:<script src="js\/codex34\.js\?v=\d+"><\/script>\s*)?<script src="js\/codex35\.js\?v=\d+"><\/script>\s*<script src="js\/boot\.js/.test(fs.readFileSync(index, 'utf8')));
    check('sw.js lists codex35.js in ASSETS', fs.readFileSync(sw, 'utf8').indexOf("'./js/codex35.js'") > 0);
  }

  console.log('');
  console.log('check-components: ' + passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
