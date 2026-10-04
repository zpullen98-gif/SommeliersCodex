/**
 * DOES OUR WINE LIST KEEP STEP WITH THE HOUSE, BY THE HOUSE'S OWN RULES?
 *
 * codex27 makes ST.cellar a projection of the House: the shared engine's
 * codexWine adapter decides what a row becomes, and codex27 writes what it
 * reports back through cellarSanitize. This loads the SHIPPED chain with
 * codex27 on top of the SHIPPED engine, over a Map storage, and asks the
 * questions from the Codex's side:
 *
 *   1. cellarSanitize carries `house` when it is set and drops a stray key
 *   2. the sync: a house wine with no row becomes a row (grapes one string,
 *      glass a price); a kept say on the row beats hers; a row goes only
 *      under a tombstone newer than its touch, never without one; a name
 *      twin is re-keyed to the house's id with its ST.q keys left alone;
 *      a bottle with no house is adopted
 *   3. the doors: a saved bottle reaches the house (put), a batch reaches
 *      it (cellarAddMany), a removal writes a tombstone, a pack imports
 *      and asks before it overwrites, a switch replaces the projection and
 *      a switch back brings the list home; another tab's write wakes the
 *      sync through the storage event
 *   4. the Mine row resolves through V25_GO, opens the house view, and every
 *      string the view draws is clean (no long dash, no double hyphen, no
 *      retired study word, no level numeral, no glyph)
 *   5. no OOT at all: the chain loads, the row's show() is false, the sync
 *      is a no-op, and codex27 reads no `location` (the merge harness has
 *      none with a pathname)
 *   6. read and keep, over the engine's fixture house imported as a pack:
 *      a Keep on the profile lands on the engine as by 'person'; an edit
 *      over the cap shows the over-cap word and saves; Discard removes the
 *      mark; the service note goes through setItemField and never onto
 *      ST.cellar; the picker offers only house dishes; the list rows and
 *      the form draw every mark with Keep, Edit, Discard and Keep all; the
 *      two shared screens (Hers, to look over under its step chips, and
 *      the read view under the house view's doors) draw over the fixture
 *      with codex27's hooks and a press on them reaches the engine; every
 *      drawn string is clean; and with no OOT the row hides, the form
 *      block is empty and every door is a no-op
 *   7. the house drills, over the engine's drill fixture: the cellar drill's
 *      house kinds (first pick, serve, goes with, the section) and Pair the
 *      menu (first pick, without alcohol) are every one dealt by the
 *      engine's dealQuestion, every option a house item, four distinct, and
 *      no stem carrying its answer; answers land in ST.q under h- keys that
 *      keyOwned keeps out of every level, with the pace, the history and
 *      the perfect round put back; Our list by heart is a flip deck that
 *      records nothing; Say the pour opens nothing; a house over her unkept
 *      lines alone deals nothing and each row's line says so; and with no
 *      OOT the rows hide and the drills deal nothing
 *
 *   node .scripts/check-house.js [jsDir]
 *   OOT_SHARED=<dir holding oot-house.js>   default ../worldtable/static/shared
 *
 * Exits non-zero on any failure.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const JS = process.argv.slice(2).find((a) => a.charAt(0) !== '-')
  || path.join(__dirname, '..', 'js');
const SHARED = process.env.OOT_SHARED
  || path.join(__dirname, '..', '..', 'worldtable', 'static', 'shared');
const ENGINE = path.join(SHARED, 'oot-house.js');
const UI_FILE = path.join(SHARED, 'oot-house-ui.js');
/* The engine's own fixture house, copied here so the gate runs on a machine that holds this repo alone. */
const FIXTURE = path.join(__dirname, 'fixtures', 'house-min.json');
/* The engine's drill fixture, copied the same way: enough dishes, wines and drinks for every kind to deal. */
const DRILL_FIXTURE = path.join(__dirname, 'fixtures', 'house-drill.json');
/* The shipped Brennan's pack, beside the engine, as the wing's boot fetches it. */
const PACK_FILE = path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
for (const f of [ENGINE, UI_FILE, PACK_FILE]) {
  if (!fs.existsSync(f)) {
    console.error('check-house: no ' + path.basename(f) + ' at ' + SHARED + ' (set OOT_SHARED)');
    process.exit(1);
  }
}

const OPTIONAL = new Set(['codex13.js', 'data-firstpath.js', 'codex28.js', 'codex29.js', 'codex30.js']);
const FILES = ['data-questions.js', 'reference.js', 'core.js', 'codex2.js', 'codex3.js',
  'codex4.js', 'codex5.js', 'data-primers.js', 'codex6.js', 'data-intro.js',
  'data-primers-intro.js', 'data-grapes-plus.js', 'data-tasting.js', 'data-floor.js',
  'data-pairing.js', 'data-maps.js', 'data-advanced.js', 'data-primers-advanced.js',
  'data-master.js', 'data-primers-master.js', 'codex7.js', 'codex8.js', 'codex9.js',
  'codex10.js', 'codex11.js', 'codex12.js', 'data-firstpath.js', 'codex13.js', 'codex14.js',
  'codex15.js', 'data-producers.js', 'menu-desk.js', 'wine-rows.js', 'codex16.js',
  'codex17.js', 'codex18.js', 'codex19.js', 'codex20.js', 'codex21.js', 'codex22.js',
  'codex23.js', 'codex24.js', 'codex25.js', 'codex26.js', 'codex27.js', 'codex28.js', 'codex29.js', 'codex30.js', 'boot.js'];

/* A fixed clock and fixed dice, so stamps and ids are the same every run. */
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

/* check-home's keep-set, word for word: the rule every drawn string meets. */
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

/* ---------------- the harness ----------------
   check-home's sandbox, with two differences: the window records its
   storage listeners so another tab's write can be played, and `withEngine`
   decides whether oot-house.js is loaded before the chain. */
function makeSandbox(seed, opts) {
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
    /* null, as an empty element answers: the shared screens clear a root with
       `while (root.firstChild)`, and a node that is its own first child never ends */
    get firstChild() { return null; }, get firstElementChild() { return NODE; },
    get lastChild() { return null; }, get nextSibling() { return null; },
    get innerHTML() { return ''; }, set innerHTML(v) { },
    get textContent() { return ''; }, set textContent(v) { },
    get innerText() { return ''; }, set innerText(v) { },
  };
  const listeners = { storage: [] };
  const sandbox = {
    console,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    },
    /* no pathname on purpose: the merge harness has none, and codex27 must never ask */
    location: opts && opts.location ? opts.location : { href: 'http://localhost/', search: '', hash: '' },
    navigator: { userAgent: 'node', onLine: true },
    setTimeout, clearTimeout, setInterval, clearInterval,
    matchMedia: () => ({ matches: false, addEventListener() { }, addListener() { } }),
    requestAnimationFrame: (f) => setTimeout(f, 0),
    alert() { }, confirm: () => false, prompt: () => null,
    fetch: () => Promise.reject(new Error('no network in this harness')),
    scrollTo() { }, scrollBy() { }, getComputedStyle: () => ({ getPropertyValue: () => '' }),
    innerWidth: 1024, innerHeight: 768, devicePixelRatio: 1,
    addEventListener(type, fn) { if (listeners[type]) listeners[type].push(fn); },
    removeEventListener() { },
    history: { pushState() { }, replaceState() { }, back() { } },
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
    readyState: 'complete', title: '',
    get activeElement() { return null; },
    get head() { return stubEl(); }, get body() { return stubEl(); },
  };
  const ctx = vm.createContext(sandbox);
  const G = (expr) => vm.runInContext(expr, ctx);
  return { sandbox, ctx, G, store, listeners };
}

function loadChain(H) {
  const loaded = [];
  for (const f of FILES) {
    const p = path.join(JS, f);
    if (!fs.existsSync(p)) {
      if (OPTIONAL.has(f)) continue;
      console.error('missing ' + f + ' in ' + JS);
      process.exit(1);
    }
    try { vm.runInContext(fs.readFileSync(p, 'utf8'), H.ctx, { filename: f }); loaded.push(f); }
    catch (e) {
      console.error('FAILED to load ' + f + ': ' + e.message);
      console.error(String(e.stack).split('\n').slice(0, 6).join('\n'));
      process.exit(1);
    }
  }
  return loaded;
}

const tick = (ms) => new Promise((r) => setTimeout(r, ms || 10));

/* ---------------- a document with real nodes, for the two shared screens ----------------
   oot-house-ui.js draws plain DOM and reads it back on a press, so the NODE
   stub above (one node standing for every node) cannot show what it drew.
   This is the least of a document the file needs: elements with children,
   attributes, listeners that bubble, textContent, and the one-part
   selectors the file writes (a tag, classes, attribute tests, no
   combinators). The same shape tools/check-house-ui.mjs holds the file to. */
function parseSelector(sel) {
  return sel.split(',').map((raw) => {
    const s = raw.trim();
    const m = /^([a-zA-Z0-9]*)((?:\.[\w-]+)*)((?:\[[^\]]+\])*)$/.exec(s);
    if (!m) throw new Error('stub: a selector it does not read: ' + s);
    const classes = m[2] ? m[2].split('.').filter(Boolean) : [];
    const attrs = [];
    const re = /\[([^\]=]+)(?:=("?)([^\]"]*)\2)?\]/g;
    let a;
    while ((a = re.exec(m[3]))) attrs.push({ name: a[1], value: a[3] === undefined ? null : a[3] });
    return { tag: m[1].toUpperCase(), classes, attrs };
  });
}
function matchOne(n, p) {
  if (p.tag && n.tagName !== p.tag) return false;
  const cls = (n.getAttribute('class') || '').split(/\s+/);
  for (const c of p.classes) if (!cls.includes(c)) return false;
  for (const a of p.attrs) {
    const v = n.getAttribute(a.name);
    if (v === null) return false;
    if (a.value !== null && v !== a.value) return false;
  }
  return true;
}
class StubNode {
  constructor(kind, tag, text) {
    this.kind = kind; this.tagName = tag.toUpperCase(); this.text = text;
    this.childNodes = []; this.parentNode = null; this.attrs = {}; this.listeners = {}; this.value = '';
  }
  get firstChild() { return this.childNodes.length ? this.childNodes[0] : null; }
  appendChild(n) { if (n.parentNode) n.parentNode.removeChild(n); n.parentNode = this; this.childNodes.push(n); return n; }
  removeChild(n) { const i = this.childNodes.indexOf(n); if (i < 0) throw new Error('stub: removeChild of a stranger'); this.childNodes.splice(i, 1); n.parentNode = null; return n; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attrs, k) ? this.attrs[k] : null; }
  get textContent() { return this.kind === 'text' ? this.text : this.childNodes.map((c) => c.textContent).join(''); }
  addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); }
  dispatch(type) {
    const ev = { type, target: this, preventDefault() { } };
    for (let n = this; n; n = n.parentNode) for (const fn of (n.listeners[type] || []).slice()) fn.call(n, ev);
  }
  click() { this.dispatch('click'); }
  focus() { }
  matches(sel) { return parseSelector(sel).some((p) => matchOne(this, p)); }
  closest(sel) { for (let n = this; n; n = n.parentNode) if (n.kind === 'element' && n.matches(sel)) return n; return null; }
  querySelectorAll(sel) {
    const out = [];
    const walk = (n) => { for (const c of n.childNodes) { if (c.kind === 'element' && c.matches(sel)) out.push(c); walk(c); } };
    walk(this);
    return out;
  }
  querySelector(sel) { const all = this.querySelectorAll(sel); return all.length ? all[0] : null; }
}
/* The shared screens in a context of their own, over the document above. */
function loadUI() {
  const doc = {
    head: new StubNode('element', 'head', ''), body: new StubNode('element', 'body', ''),
    createElement: (tag) => new StubNode('element', tag, ''),
    createTextNode: (s) => new StubNode('text', '#text', String(s)),
  };
  const sandbox = { document: doc, console };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), sandbox, { filename: 'oot-house-ui.js' });
  const root = () => { const r = doc.createElement('div'); doc.body.appendChild(r); return r; };
  return { ui: sandbox.OOT.houseUI, doc, root };
}


/* The wine rows the house holds before the chain loads, each through the
   api's own door so they are items in the engine's shape. */
const ROW = (id, producer, name, vintage, extra) => Object.assign({
  id, ts: NOW, producer, name, vintage, region: 'Champagne, France',
  grapes: 'Chardonnay, Pinot Noir, Meunier', style: 'Brut', glass: '$28', bottle: '$140', note: '', house: ''
}, extra || {});

async function main() {
  /* ================================================================ */
  section('the engine over a Map, and the device before the chain');
  const H = makeSandbox(null, {});
  vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), H.ctx, { filename: 'oot-house.js' });
  check('oot-house.js installs OOT.house and OOT.houseLib', H.G('typeof OOT.house === "object" && typeof OOT.houseLib === "object"'));
  /* the shared screens beside it, as the wing's shell loads them; they draw nothing until asked */
  vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), H.ctx, { filename: 'oot-house-ui.js' });
  check('oot-house-ui.js installs OOT.houseUI beside it', H.G('typeof OOT.houseUI === "object" && typeof OOT.houseUI.review === "function"'));
  const lib = H.G('OOT.houseLib');
  const backing = new Map();
  const api = lib.createHouseApi(lib.mapStorage(backing), { win: H.sandbox, now: () => NOW, rand: seeded(7), from: 'codex' });
  H.sandbox.OOT.house = api;
  const made = await api.mintHouse('The test house', 'hand');
  check('a house minted over the Map and current', !!made && api.currentId() === made.id);
  const houseId = made.id;
  /* B: her say on the item; C: a wine with no row; D: a name twin under another id; E: removed */
  for (const row of [
    ROW('w-bbbbbbbb', 'Billecart-Salmon', 'Brut Reserve', 'NV', { house: houseId, maitre: { say: { value: 'hers', by: 'maitre', ts: NOW } } }),
    ROW('w-cccccccc', 'Pol Roger', 'Brut Reserve', 'NV', { house: houseId }),
    ROW('w-dddddddd', 'Krug', 'Grande Cuvee', 'NV', { house: houseId }),
    ROW('w-eeeeeeee', 'Ruinart', 'Blanc de Blancs', 'NV', { house: houseId }),
  ]) {
    const res = await api.put('wine', row);
    check('the house takes ' + row.producer + ' through put', res.ok && !!res.row);
  }
  check('a tombstone for Ruinart', await api.removeItem('wine', 'w-eeeeeeee'));
  check('the house holds four wines less the removed one', api.current().wines.length === 3 && 'w-eeeeeeee' in api.current().removed);

  /* the list on this device, before the sync */
  const cellar = [
    { id: 'w-aaaaaaaa', ts: NOW - 5000, producer: 'Bollinger', name: 'Special Cuvee', vintage: 'NV', region: '', grapes: '', style: '', glass: '', bottle: '', note: 'no house yet' },
    { id: 'w-bbbbbbbb', ts: NOW - 100, producer: 'Billecart-Salmon', name: 'Brut Reserve', vintage: 'NV', region: 'Champagne, France', grapes: 'Chardonnay, Pinot Noir, Meunier', style: 'Brut', glass: '$28', bottle: '$140', note: '', house: houseId,
      maitre: { say: { value: 'ours', by: 'person', ts: NOW - 100 } } },
    { id: 'w-dddd0000', ts: NOW - 5000, producer: 'Krug', name: 'Grande Cuvee', vintage: 'NV', region: '', grapes: '', style: '', glass: '', bottle: '', note: 'the twin' },
    { id: 'w-eeeeeeee', ts: NOW - 1000, producer: 'Ruinart', name: 'Blanc de Blancs', vintage: 'NV', region: '', grapes: '', style: '', glass: '', bottle: '', note: '', house: houseId },
    { id: 'w-ffffffff', ts: NOW - 1000, producer: 'Taittinger', name: 'Comtes', vintage: '2012', region: '', grapes: '', style: '', glass: '', bottle: '', note: 'no item, no tombstone', house: houseId },
  ];
  H.store.codexStats = JSON.stringify({ q: { 'w-dddd0000-gr': { c: 2, w: 1, s: 1 } }, cellar });

  /* ================================================================ */
  section('the chain, with the sync at load');
  const loaded = loadChain(H);
  console.log('  ' + loaded.length + ' files loaded from ' + JS);
  check('codex27 ran the sync at load', H.G('V27_LAST !== null'));
  await H.G('V27_LAST');
  const G = H.G;
  const row = (id) => G('(ST.cellar || []).filter(function (b) { return b.id === ' + JSON.stringify(id) + '; })[0] || null');
  const item = (id) => api.current().wines.find((w) => w.id === id) || null;

  const a = row('w-aaaaaaaa');
  check('a bottle with no house is adopted into the current house', !!a && a.house === houseId && a.note === 'no house yet');
  check('and is now a wine of the house', !!item('w-aaaaaaaa'));
  const c = row('w-cccccccc');
  check('a house wine with no row becomes a row', !!c && c.house === houseId && c.producer === 'Pol Roger');
  check('with grapes one comma-joined string and the glass a price', !!c && c.grapes === 'Chardonnay, Pinot Noir, Meunier' && c.glass === '$28');
  check('and the row carries the nine fields and nothing stray', !!c && ['producer', 'name', 'vintage', 'region', 'grapes', 'style', 'glass', 'bottle', 'note'].every((k) => typeof c[k] === 'string')
    && Object.keys(c).every((k) => ['id', 'ts', 'producer', 'name', 'vintage', 'region', 'grapes', 'style', 'glass', 'bottle', 'note', 'maitre', 'house'].indexOf(k) >= 0), c && Object.keys(c).join(','));
  const b = row('w-bbbbbbbb');
  check('a kept say on the row beats hers', !!b && b.maitre && b.maitre.say && b.maitre.say.value === 'ours' && b.maitre.say.by === 'person');
  const bi = item('w-bbbbbbbb');
  check('and the house now holds the kept one', !!bi && bi.say && bi.say.value === 'ours' && bi.say.by === 'person');
  check('a row under a tombstone newer than its touch is removed', row('w-eeeeeeee') === null);
  const f = row('w-ffffffff');
  check('a row with no item and no tombstone stays', !!f && f.note === 'no item, no tombstone');
  check('and becomes a wine of the house', !!item('w-ffffffff'));
  check('a name twin is re-keyed to the house wine\'s id', row('w-dddd0000') === null && !!row('w-dddddddd') && row('w-dddddddd').note === 'the twin');
  /* The plan's rule (house-sync.ts, rule 2): a renamed change carries the
     former id beside the new one SO THE WING CAN RUN ITS OWN RENAME DOOR.
     The Codex's door is ST.q: codex12 keys every drill answer on the
     bottle's id ('w-xxxxxxxx-gr', '-rg', '-pg', '-pr'), so a record left
     under the former id is stranded, never read by the drill again and an
     orphan to qidAudit, while the re-keyed bottle starts from nothing. The
     keys must follow the id. */
  check('with its ST.q keys moved to the new id, none stranded under the old', G('ST.q["w-dddddddd-gr"] && ST.q["w-dddddddd-gr"].c') === 2 && G('typeof ST.q["w-dddd0000-gr"]') === 'undefined',
    'new ' + JSON.stringify(G('ST.q["w-dddddddd-gr"]')) + ' old ' + JSON.stringify(G('ST.q["w-dddd0000-gr"]')));
  check('the list holds five bottles', G('ST.cellar.length') === 5, 'held ' + G('ST.cellar.length'));
  check('every bottle carries the house', G('ST.cellar.every(function (b) { return b.house === ' + JSON.stringify(houseId) + '; })'));
  check('the list was saved', JSON.parse(H.store.codexStats).cellar.length === 5);
  const before = JSON.stringify(G('ST.cellar'));
  await G('v27Sync()');
  check('a second sync changes nothing', JSON.stringify(G('ST.cellar')) === before);

  /* ================================================================ */
  section('cellarSanitize');
  const san = G('cellarSanitize({ id: "w-sanit001", ts: 5, producer: "Krug", house: "h-abcdefgh", bogus: "no", allergens: ["x"] })');
  check('carries house when set', san.house === 'h-abcdefgh');
  check('drops a stray key', !('bogus' in san) && !('allergens' in san), Object.keys(san).join(','));
  const san2 = G('cellarSanitize({ id: "w-sanit002", ts: 5, producer: "Krug" })');
  check('writes no house when none is set', !('house' in san2));
  check('still carries maitre (codex24 under it)', G('cellarSanitize({ id: "w-s3", ts: 1, maitre: { say: { value: "x", by: "person", ts: 1 } } }).maitre.say.by') === 'person');
  check('the raised field cap holds a line of four thousand', G('cellarSanitize({ id: "w-s4", ts: 1, note: new Array(4001).join("a") }).note.length') === 4000);

  /* ================================================================ */
  section('the doors: put, a batch, a removal');
  G('cellarAddMany([{ producer: "Louis Roederer", name: "Cristal", vintage: "2014", region: "Champagne, France", grapes: "Chardonnay, Pinot Noir", style: "Brut", glass: "", bottle: "$450", note: "" }])');
  await tick(30);
  const cristal = G('ST.cellar.filter(function (b) { return b.name === "Cristal"; })[0]');
  check('a batch-added bottle reaches the house through put', !!cristal && !!item(cristal.id));
  check('and the row was stamped with the house', !!cristal && cristal.house === houseId);
  const ci = item(cristal.id);
  check('with its grapes a list on the house side', !!ci && Array.isArray(ci.grapes) && ci.grapes.length === 2 && ci.wine === 'Cristal');
  G('ST.cellar = ST.cellar.filter(function (b) { return b.id !== "w-cccccccc"; }); stSave();');
  await G('v27Remove("w-cccccccc")');
  check('a removal writes a tombstone and drops the item', !item('w-cccccccc') && api.current().removed['w-cccccccc'] >= NOW);
  await G('v27Sync()');
  check('and the next sync does not bring the bottle back', row('w-cccccccc') === null);

  /* ================================================================ */
  section('another tab\'s write wakes the sync');
  const api2 = lib.createHouseApi(lib.mapStorage(backing), { now: () => NOW + 10, rand: seeded(9), from: 'ledger' });
  await api2.ready();
  const put2 = await api2.put('wine', ROW('w-gggggggg', 'Jacquesson', 'Cuvee 745', 'NV', { house: houseId, ts: NOW + 10 }));
  check('the other tab put a wine into the same house', put2.ok);
  check('the window holds storage listeners (the engine\'s and codex27\'s)', H.listeners.storage.length >= 2, String(H.listeners.storage.length));
  H.listeners.storage.forEach((fn) => fn({ key: 'oot-houses-v1' }));
  await tick(40);
  await G('V27_LAST');
  check('the storage event re-ran the sync and the new wine is on the list', !!row('w-gggggggg') && row('w-gggggggg').producer === 'Jacquesson');

  /* ================================================================ */
  section('the sync waits for a drill and for the form');
  /* A storage event can land at any moment, and the sync writes ST.cellar
     when it does. S.pool holds the drill's questions by the bottle's id and
     the answers are recorded under it; a bottle removed or re-keyed under a
     running drill records to a key no bottle holds and the result screen
     reads a list that is not the one asked about. The form is the same
     hazard: S._cellarEdit names a bottle by id, and a save after the sync
     took that row pushes it back under an id with a tombstone newer than
     it, so the next sync removes the person's edit. The sync must wait
     (S.mode === 'drill' with the list as the section, or S._cellarForm set)
     and run once the run or the form is over. */
  const api3 = lib.createHouseApi(lib.mapStorage(backing), { now: () => NOW + 30, rand: seeded(11), from: 'ledger' });
  await api3.ready();
  await api3.put('wine', ROW('w-iiiiiiii', 'Deutz', 'Amour de Deutz', '2012', { house: houseId, ts: NOW + 30 }));
  check('the other tab removed a wine the drill is asking about', await api3.removeItem('wine', 'w-gggggggg'));
  G('S.mode = "drill"; S.section = "Our List"; S.view = "quiz"; S.pool = [{ id: "w-gggggggg-gr", cat: "Our List" }]; S.idx = 0;');
  const inDrill = JSON.stringify(G('ST.cellar.map(function (b) { return b.id; })'));
  H.listeners.storage.forEach((fn) => fn({ key: 'oot-houses-v1' }));
  await tick(40);
  await G('V27_LAST');
  check('a storage event under a running drill leaves the list as the drill found it', JSON.stringify(G('ST.cellar.map(function (b) { return b.id; })')) === inDrill && !!row('w-gggggggg'),
    inDrill + ' then ' + JSON.stringify(G('ST.cellar.map(function (b) { return b.id; })')));
  G('S.mode = ""; S.section = ""; S.view = "cellar"; S._cellarForm = { producer: "Jacquesson" }; S._cellarEdit = "w-gggggggg";');
  await G('v27Sync()');
  check('a sync asked while the form holds a bottle leaves that bottle on the list', !!row('w-gggggggg'));
  G('S._cellarForm = null; S._cellarEdit = null;');
  await G('v27Sync()');
  check('once the form is closed the sync lands: the removed wine gone, the new one on the list', row('w-gggggggg') === null && !!row('w-iiiiiiii'));

  /* ================================================================ */
  section('the Mine row and the house view');
  check('V25_MINE carries the house row first', G('V25_MINE[0].key') === 'house' && G('V25_MINE[0].name') === 'The house');
  check('the row resolves through V25_GO, V25_AREA and V25_HUB', G('typeof V25_GO.house') === 'function' && G('V25_AREA.house') === 'mine' && G('V25_HUB.house') === 'mine');
  check('the row shows with the engine here', G('V25_MINE[0].show()') === true);
  const line = G('V25_MINE[0].line()');
  check('the line names the house and the next step', line === 'The test house · next: the house card', line);
  const mine = G('v25MineHtml()');
  check('Mine draws the row as data-go="house"', mine.indexOf('data-go="house"') >= 0 && mine.indexOf('The house') >= 0);
  G('S.view = "mine"; v25Go("house")');
  check('v25Go opens the house view', G('S.view') === 'house');
  check('the view is registered with codex25\'s render', G('V25_VIEWS.house === v27HouseView'));
  const drawn = [mine, G('v27DrillChips()')];
  const houseHtml = G('v27HouseHtml()');
  drawn.push(houseHtml);
  check('the house view says which house and the next step', houseHtml.indexOf('The house: The test house · next: the house card') >= 0);
  check('with the five doors', ['Switch', 'New house', 'Import a pack', 'Export', 'Rename'].every((w) => houseHtml.indexOf('>' + w + '<') >= 0)
    || (['New house', 'Import a pack', 'Export', 'Rename'].every((w) => houseHtml.indexOf('>' + w + '<') >= 0) && G('OOT.house.list().length') < 2));
  for (const p of ['switch', 'new', 'import', 'rename']) {
    G('v27State().panel = ' + JSON.stringify(p));
    drawn.push(G('v27HouseHtml()'));
  }
  G('v27State().panel = ""');

  /* a pack from another device: import, the question on a twin, open, switch back */
  const other = lib.createHouseApi(lib.mapStorage(new Map()), { now: () => NOW + 20, rand: seeded(3), from: 'codex' });
  const second = await other.mintHouse('The second house', 'pack');
  await other.put('wine', ROW('w-hhhhhhhh', 'Salon', 'Le Mesnil', '2012', { house: second.id, ts: NOW + 20 }));
  const packText = other.buildPack('codex').text;
  H.sandbox.PACK = packText;
  await G('v27TakePack(PACK)');
  const st = G('S._v27');
  check('a pack imports and ends on "{name} added. Open it now?"', !!st.added && st.added.name === 'The second house' && st.live === 'The second house added. Open it now?', JSON.stringify(st));
  drawn.push(G('v27HouseHtml()'));
  check('the device now lists two houses', api.list().length === 2);
  const firstCount = G('ST.cellar.length');
  await G('v27Switch(S._v27.added.id)');
  check('Open switches to it and the list becomes that house\'s wines', api.currentId() === second.id && G('ST.cellar.length') === 1 && row('w-hhhhhhhh').house === second.id, G('JSON.stringify(ST.cellar.map(function (b) { return b.id; }))'));
  check('every bottle still goes through cellarSanitize (nine strings)', G('ST.cellar.every(function (b) { return typeof b.note === "string" && typeof b.grapes === "string"; })'));
  check('the lines follow the switch', G('V25_MINE[0].line()').indexOf('The second house') === 0);
  drawn.push(G('v27HouseHtml()'));
  await G('v27Switch(' + JSON.stringify(houseId) + ')');
  check('a switch back brings the first house\'s list home', api.currentId() === houseId && G('ST.cellar.length') === firstCount, G('ST.cellar.length') + ' vs ' + firstCount);
  check('with the ST.q keys untouched by either switch', G('ST.q["w-dddddddd-gr"] && ST.q["w-dddddddd-gr"].c') === 2);
  await G('v27TakePack(PACK)');
  const st2 = G('S._v27');
  check('the same pack again stops on the choice', !!st2.pending && st2.pending.intoName === 'The second house' && /already on this device/.test(st2.live), JSON.stringify(st2.live));
  G('v27State().panel = "import"');
  drawn.push(G('v27HouseHtml()'));
  await G('v27FinishImport(S._v27.pending.text, S._v27.pending.read, { mode: "merge", into: S._v27.pending.id })');
  check('Merge into ends on a count and no new house', api.list().length === 2 && !!G('S._v27').added && /merged|kept|added|updated/i.test(G('S._v27').live), G('S._v27').live);
  drawn.push(G('v27HouseHtml()'));
  check('Export builds the pack of the current house', G('(function () { var p = OOT.house.buildPack("codex"); return p && p.pack.house.id; })()') === houseId);

  /* ================================================================ */
  section('read and keep: her marks on a bottle, the review, the read view');
  /* The engine's fixture house (the Lantern Room: two dishes, one wine with
     every mark, two cocktails, the lists), imported as a pack through
     codex27's own door, with a handful of marks flipped back to hers so
     there is something to keep, edit and discard. */
  const fx = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
  const fxWine = fx.wines[0];
  for (const f of ['say', 'guest', 'why', 'profile', 'goesWith', 'lines']) fxWine[f].by = 'maitre';
  fx.dishes[0].lines.by = 'maitre';
  const FX_TS = fxWine.profile.ts;
  H.sandbox.FX = JSON.stringify(lib.buildPack(fx, 'codex', NOW + 40));
  await G('v27TakePack(FX)');
  check('the fixture house imports as a pack', !!G('S._v27').added && G('S._v27').added.name === fx.name, G('S._v27').live);
  await G('v27Switch(S._v27.added.id)');
  check('and is the current house, its wine on the list', api.currentId() === fx.id && !!row(fxWine.id) && row(fxWine.id).producer === fxWine.producer);
  const wine = () => api.current().wines.find((w) => w.id === fxWine.id) || null;
  check('the list row carries her say under maitre, hers', row(fxWine.id).maitre && row(fxWine.id).maitre.say && row(fxWine.id).maitre.say.by === 'maitre');

  /* the Mine row */
  check('V25_MINE carries Hers, to look over second', G('V25_MINE[1].key') === 'housereview' && G('V25_MINE[1].name') === 'Hers, to look over' && G('V25_MINE[1].show()') === true);
  check('the row resolves through V25_GO, V25_AREA, V25_HUB and V25_VIEWS', G('typeof V25_GO.housereview') === 'function' && G('V25_AREA.housereview') === 'mine' && G('V25_HUB.housereview') === 'mine' && G('V25_VIEWS.housereview === v27ReviewView'));
  const revLine = G('V25_MINE[1].line()');
  check('the row counts the lines of hers that wait', /^\d+ lines of hers to look over$/.test(revLine), revLine);
  drawn.push(G('v25MineHtml()'));

  /* the list rows before any press */
  const rowsHtml = G('v27RowLinesHtml(ST.cellar.filter(function (b) { return b.id === ' + JSON.stringify(fxWine.id) + '; })[0], OOT.house.current().wines[0], false)');
  drawn.push(rowsHtml);
  check('a list row draws her lines with the eyebrow, Keep, Edit and Discard per mark and Keep all per bottle',
    rowsHtml.indexOf('Hers, not yet kept') >= 0 && rowsHtml.indexOf('data-h27="keep" data-kind="wine" data-id="' + fxWine.id + '" data-field="profile"') >= 0
    && rowsHtml.indexOf('data-h27="edit"') >= 0 && rowsHtml.indexOf('data-h27="discard"') >= 0 && rowsHtml.indexOf('Keep all on this bottle') >= 0);
  check('a kept mark is drawn under the word Kept with no Keep chip', rowsHtml.indexOf('>Kept<') >= 0 && rowsHtml.indexOf('data-h27="keep" data-kind="wine" data-id="' + fxWine.id + '" data-field="serve"') < 0);
  check('the first picks are drawn by dish name', rowsHtml.indexOf(fx.dishes[0].name) >= 0);
  check('the timed lines are drawn with their counts', /Ten seconds \(\d+ of 25 words\)/.test(rowsHtml));
  const frozenHtml = G('v27RowLinesHtml(ST.cellar[0], OOT.house.current().wines[0], true)');
  check('while the form or a run is open the lines show and the chips wait', frozenHtml.indexOf('Hers, not yet kept') >= 0 && frozenHtml.indexOf('data-h27=') < 0);
  G('S._v27edit = { id: ' + JSON.stringify(fxWine.id) + ', field: "lines" }');
  const editHtml = G('v27RowLinesHtml(ST.cellar.filter(function (b) { return b.id === ' + JSON.stringify(fxWine.id) + '; })[0], OOT.house.current().wines[0], false)');
  drawn.push(editHtml);
  check('Edit on the timed lines opens three boxes with a count each and Save and Cancel', editHtml.indexOf('data-h27-editor="lines"') >= 0 && (editHtml.match(/data-h27-count=/g) || []).length === 3 && editHtml.indexOf('data-h27="save"') >= 0 && editHtml.indexOf('data-h27="cancel"') >= 0);
  G('S._v27edit = null');

  /* Keep, Edit, Discard through the doors */
  check('Keep on the profile lands on the engine as by person with a fresh stamp', (await G('v27Keep("wine", ' + JSON.stringify(fxWine.id) + ', "profile")')) === true
    && wine().profile.by === 'person' && wine().profile.value === fxWine.profile.value && wine().profile.ts > FX_TS);
  check('Keep on a kept mark is a no-op', (await G('v27Keep("wine", ' + JSON.stringify(fxWine.id) + ', "profile")')) === false);
  await G('v27Keep("wine", ' + JSON.stringify(fxWine.id) + ', "say")');
  check('Keep on a floor line lands on the engine and on the row under maitre', wine().say.by === 'person' && row(fxWine.id).maitre.say.by === 'person' && row(fxWine.id).maitre.say.value === fxWine.say.value);
  const over = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty one two three four five six';
  check('a line over its cap shows the over-cap word in the count', G('v27CountText("s10", ' + JSON.stringify(over) + ')') === '26 of 25 words. Over its cap');
  check('and a line under it does not', G('v27CountText("s10", "Dry and bright.")') === '3 of 25 words');
  H.sandbox.OVER = { s10: over, s20: fxWine.lines.value.s20, s45: fxWine.lines.value.s45 };
  check('an edit over the cap saves as the person\'s', (await G('v27Edit("wine", ' + JSON.stringify(fxWine.id) + ', "lines", OVER)')) === true
    && wine().lines.by === 'person' && wine().lines.value.s10 === over);
  const probs = G('v27Problems("wine", ' + JSON.stringify(fxWine.id) + ')');
  check('problems() names the line over its cap as { field, said }', JSON.stringify(probs) === JSON.stringify([{ field: 'lines', said: 'Ten seconds: 26 of 25 words' }]), JSON.stringify(probs));
  check('Discard removes the mark from the engine', (await G('v27Discard("wine", ' + JSON.stringify(fxWine.id) + ', "serve")')) === true && !('serve' in wine()));
  await G('v27Discard("wine", ' + JSON.stringify(fxWine.id) + ', "why")');
  check('Discard on a floor line takes it off the row too', !('why' in wine()) && !row(fxWine.id).maitre.why);
  check('Keep all keeps every line of hers on the bottle', (await G('v27KeepAll("wine", ' + JSON.stringify(fxWine.id) + ')')) === 2
    && wine().guest.by === 'person' && wine().goesWith.by === 'person' && row(fxWine.id).maitre.guest.by === 'person');

  /* the form over the fixture wine */
  G('OOT.house.current().wines[0].goesWith.by = "maitre"');   /* one of hers again, for the chip */
  const formHtml = G('v27FormHouseHtml(' + JSON.stringify(fxWine.id) + ')');
  drawn.push(formHtml);
  check('the form carries profile, goes with and serve as mark fields with a state word each', ['profile', 'goesWith', 'serve'].every((f) => formHtml.indexOf('id="cl-h-' + f + '"') >= 0 && formHtml.indexOf('data-h27-state="' + f + '"') >= 0));
  check('a mark of hers in the form gets Keep and Discard, a kept one Discard alone, an empty one neither',
    formHtml.indexOf('data-h27="keep" data-kind="wine" data-id="' + fxWine.id + '" data-field="goesWith"') >= 0
    && formHtml.indexOf('data-h27="keep" data-kind="wine" data-id="' + fxWine.id + '" data-field="profile"') < 0
    && formHtml.indexOf('data-h27="discard" data-kind="wine" data-id="' + fxWine.id + '" data-field="profile"') >= 0
    && formHtml.indexOf('data-field="serve"') < 0);
  const picks = (formHtml.match(/data-cl-pick="([^"]+)"/g) || []).map((m) => m.slice(14, -1));
  check('the first-picks picker offers the house\'s dishes by name and nothing else', picks.length === fx.dishes.length && picks.every((id) => id.indexOf('d-') === 0)
    && fx.dishes.every((d) => picks.indexOf(d.id) >= 0 && formHtml.indexOf(d.name) >= 0) && picks.indexOf(fxWine.id) < 0 && picks.indexOf(fx.cocktails[0].id) < 0, picks.join(','));
  check('with the fixture\'s pick checked', new RegExp('data-cl-pick="' + fx.dishes[0].id + '" checked').test(formHtml));
  const parts = lib.WINE_PARTS;
  check('the five parts carry the WINE_PARTS labels', ['main', 'technique', 'sauce', 'sides', 'taste'].every((k) => formHtml.indexOf('>' + parts[k] + '</label>') >= 0 && formHtml.indexOf('id="cl-h-part-' + k + '"') >= 0));
  check('the three timed lines carry a live count against LINE_CAPS', ['s10', 's20', 's45'].every((k) => formHtml.indexOf('id="cl-h-line-' + k + '"') >= 0 && formHtml.indexOf('data-h27-count="' + k + '"') >= 0)
    && formHtml.indexOf('26 of 25 words. Over its cap') >= 0);
  check('the service note is a textarea under the fixed eyebrow', formHtml.indexOf('Your words. Allergens: confirm at lineup.') >= 0 && formHtml.indexOf('<textarea class="sainput" id="cl-h-note"') >= 0);
  check('the form writes no allergen field and reads none', !/allergen/i.test(formHtml.replace('Allergens: confirm at lineup.', '')));
  const newHtml = G('v27FormHouseHtml("")');
  drawn.push(newHtml);
  check('a new bottle gets the boxes and no chips', newHtml.indexOf('id="cl-h-note"') >= 0 && newHtml.indexOf('data-h27=') < 0 && newHtml.indexOf('Nothing yet') >= 0);

  /* the save: the typed values onto the house, the note through setItemField */
  H.sandbox.TYPED = {
    profile: 'A new profile, typed.', goesWith: '', serve: 'Cold, in a big glass.',
    firstPickIds: [fx.dishes[1].id, fxWine.id, 'd-nothere0'],
    parts: { main: 'Bacchus from the slope', technique: '', sauce: '', sides: '', taste: '' },
    lines: { s10: 'Ten words here.', s20: '', s45: '' },
    serviceNote: 'Ask the chef before the oysters go out.'
  };
  const cellarBefore = JSON.stringify(G('ST.cellar'));
  check('the save runs', (await G('v27SaveHouseFields(' + JSON.stringify(fxWine.id) + ', TYPED)')) === true);
  check('a typed value is the person\'s', wine().profile.by === 'person' && wine().profile.value === 'A new profile, typed.' && wine().serve.by === 'person' && wine().serve.value === 'Cold, in a big glass.');
  check('an emptied one goes', !('goesWith' in wine()));
  check('the picks saved are house dishes only', JSON.stringify(wine().firstPickIds.value) === JSON.stringify([fx.dishes[1].id]) && wine().firstPickIds.by === 'person');
  check('the parts and the lines land as the person\'s', wine().parts.by === 'person' && wine().parts.value.main === 'Bacchus from the slope' && wine().lines.by === 'person' && wine().lines.value.s10 === 'Ten words here.');
  check('the note goes through setItemField onto the house wine', wine().serviceNote === 'Ask the chef before the oysters go out.');
  check('and never onto ST.cellar', JSON.stringify(G('ST.cellar')).indexOf('before the oysters') < 0 && !('serviceNote' in row(fxWine.id)));
  check('cellarSanitize drops a serviceNote that arrives in a file', !('serviceNote' in G('cellarSanitize({ id: "w-s5", ts: 1, serviceNote: "x" })')));
  check('a save with nothing changed changes nothing', (await G('v27SaveHouseFields(' + JSON.stringify(fxWine.id) + ', TYPED)')) === true && wine().serviceNote === 'Ask the chef before the oysters go out.');
  const partial = JSON.stringify(wine());
  await G('v27SaveHouseFields(' + JSON.stringify(fxWine.id) + ', { serviceNote: "Ask the chef before the oysters go out." })');
  check('a key the save was not handed is not touched', JSON.stringify(wine()) === partial);
  check('the note with nothing in it clears the field', (await G('v27SaveHouseFields(' + JSON.stringify(fxWine.id) + ', { serviceNote: "" })')) === true && wine().serviceNote === '');
  await G('v27SaveHouseFields(' + JSON.stringify(fxWine.id) + ', { serviceNote: "Confirm the shellfish at lineup." })');
  check('the list rows were not rewritten by any of it', JSON.stringify(G('ST.cellar')) === cellarBefore);
  check('setItemField refuses a shared field or a mark', (await api.setItemField('wine', fxWine.id, { name: 'x' })) === false && (await api.setItemField('wine', fxWine.id, { profile: 'x' })) === false);

  /* the two screens */
  const reviewHtml = G('v27ReviewHtml()');
  drawn.push(reviewHtml);
  check('Hers, to look over draws five step chips and the review root', ['formula', 'pairings', 'wines', 'lexicon', 'scenarios'].every((s) => reviewHtml.indexOf('data-h27-step="' + s + '"') >= 0)
    && ['The formula', 'The pairings', 'The wines', 'The words', 'The table'].every((w) => reviewHtml.indexOf('>' + w + '<') >= 0) && reviewHtml.indexOf('id="h27-review"') >= 0);
  check('the current step is pressed, by a word on the attribute', reviewHtml.indexOf('data-h27-step="formula" aria-pressed="true"') >= 0);
  G('v27ReviewState().step = "wines"');
  drawn.push(G('v27ReviewHtml()'));
  const houseHtml2 = G('v27HouseHtml()');
  drawn.push(houseHtml2);
  check('the house view draws the read view\'s root under its doors', houseHtml2.indexOf('id="h27-read"') >= 0 && houseHtml2.indexOf('id="h27-read"') > houseHtml2.indexOf('Import a pack'));

  /* The shared screens themselves, drawn over the fixture with codex27's
     hooks, in a document stub that holds real nodes, so what they draw can
     be read and a chip can be pressed. */
  const UI = loadUI();
  check('oot-house-ui.js installs OOT.houseUI', typeof UI.ui.readView === 'function' && typeof UI.ui.review === 'function');
  const hooks = G('v27Hooks()');
  check('the hooks are the three the screens take', typeof hooks.setMark === 'function' && typeof hooks.discard === 'function' && typeof hooks.problems === 'function');
  const readRoot = UI.root();
  UI.ui.readView(readRoot, api.current(), hooks);
  const readText = readRoot.textContent;
  drawn.push(readText);
  check('the read view draws the house over the fixture', readText.indexOf(fx.name) >= 0 && readText.indexOf('Ask at lineup') >= 0 && readText.indexOf(fx.dishes[0].name) >= 0);
  /* hers again: the origin for a Keep, the lines, over their cap once more, for the problem */
  await G('v27Edit("wine", ' + JSON.stringify(fxWine.id) + ', "lines", OVER)');
  G('OOT.house.current().wines[0].origin.by = "maitre"; OOT.house.current().wines[0].lines.by = "maitre";');
  const revRoot = UI.root();
  UI.ui.review(revRoot, api.current(), 'wines', hooks);
  const revText = revRoot.textContent;
  drawn.push(revText);
  check('the review draws the wine step with the lines of hers', revText.indexOf('Hers, not yet kept') >= 0 && revText.indexOf(fxWine.origin.value) >= 0);
  check('and the hook\'s problem on the timed lines, beside the screen\'s own count', revText.indexOf('Ten seconds: 26 of 25 words') >= 0 && revText.indexOf('Over its cap') >= 0);
  const keepChip = revRoot.querySelectorAll('[data-h="keep"]').filter((b) => b.getAttribute('data-id') === fxWine.id && b.getAttribute('data-field') === 'origin')[0];
  check('the wine\'s unkept mark has a Keep chip', !!keepChip && keepChip.textContent === 'Keep');
  keepChip.click();
  await tick(30);
  check('Keep on the shared screen lands on the engine as by person, and on the row', wine().origin.by === 'person' && wine().origin.value === fxWine.origin.value && row(fxWine.id).maitre.origin.by === 'person');
  drawn.push(revRoot.textContent);
  G('OOT.house.current().wines[0].pairs.by = "maitre"');
  UI.ui.review(revRoot, api.current(), 'wines', hooks);
  const discardChip = revRoot.querySelectorAll('[data-h="discard"]').filter((b) => b.getAttribute('data-id') === fxWine.id && b.getAttribute('data-field') === 'pairs')[0];
  check('a floor line of hers has a Discard chip', !!discardChip);
  discardChip.click();
  await tick(30);
  check('Discard on the shared screen removes the mark from the engine and the row', !('pairs' in wine()) && !(row(fxWine.id).maitre && row(fxWine.id).maitre.pairs));
  drawn.push(revRoot.textContent);
  for (const step of ['formula', 'pairings', 'lexicon', 'scenarios']) {
    const r = UI.root();
    UI.ui.review(r, api.current(), step, hooks);
    drawn.push(r.textContent);
  }
  check('every drawn chip is a button with words on it', UI.doc.body.querySelectorAll('button').every((b) => b.textContent.trim().length > 0 && b.getAttribute('type') === 'button'));

  /* the render: the house's changes redraw the screens that show it, never an open form */
  G('S.view = "cellar"; S._cellarForm = { producer: "x" }; S._cellarEdit = ' + JSON.stringify(fxWine.id) + ';');
  G('RENDERS = 0; var _rr = render; render = function () { RENDERS++; return _rr.apply(this, arguments); };');
  await G('v27Keep("wine", ' + JSON.stringify(fxWine.id) + ', "pairs")');
  await tick(30);
  check('a write under an open form does not redraw it', G('RENDERS') === 0);
  G('S._cellarForm = null; S._cellarEdit = null;');
  await G('v27Edit("wine", ' + JSON.stringify(fxWine.id) + ', "pairs", "The chicken, first.")');
  await tick(30);
  check('a write with the list on screen redraws it once', G('RENDERS') === 1, String(G('RENDERS')));

  /* ---- the verifier's cases: writes that race, a render that wipes ----
     Every engine write runs over the house in memory and that copy moves
     only when its save resolves, so two writes started in one tick are
     each computed over the same base and the second save overwrites the
     first. codex27 fires its writes with no queue and its hooks hand the
     shared screens nothing to await, so Keep all on a shared screen, two
     Keeps pressed quickly, or a Keep pressed while a wake is in flight
     lose a write. A row editor open on the list is not a form to
     v27Redraw, so a sync from another tab redraws over the typed text. */
  G('render = _rr;');
  const RACE = ['guest', 'profile', 'say', 'pairs'];
  for (const f of RACE) { if (!wine()[f]) await api.setMark('wine', fxWine.id, f, { value: 'hers, for the race', by: 'maitre', ts: NOW }); wine()[f].by = 'maitre'; }
  G('(function () { var hk = v27Hooks(); ' + JSON.stringify(RACE) + '.forEach(function (f) { var m = OOT.house.current().wines[0][f]; hk.setMark("wine", ' + JSON.stringify(fxWine.id) + ', f, { value: m.value, by: "person", ts: Date.now() }); }); })()');
  await tick(50);
  check('four Keeps pressed in one tick through the hooks (Keep all on a shared screen) all land as by person',
    RACE.every((f) => wine()[f] && wine()[f].by === 'person'), RACE.map((f) => f + '=' + (wine()[f] ? wine()[f].by : 'none')).join(' '));
  wine().guest.by = 'maitre';
  G('var RR = ST.cellar.filter(function (b) { return b.id === ' + JSON.stringify(fxWine.id) + '; })[0]; RR.region = "Kent, above the harbour"; RR.ts = Date.now() + 9000; S._cellarForm = null; S._wimp = null; S.view = "home";');
  const inFlight = G('v27Sync()');
  const keptMeanwhile = G('v27Keep("wine", ' + JSON.stringify(fxWine.id) + ', "guest")');
  await keptMeanwhile; await inFlight; await tick(50);
  check('a Keep pressed while a wake is in flight loses neither the Keep nor what the wake carried',
    wine().guest.by === 'person' && wine().region === 'Kent, above the harbour', 'guest=' + wine().guest.by + ' region=' + wine().region);
  G('RENDERS = 0; render = function () { RENDERS++; }; S.view = "cellar"; S._cellarForm = null; S._wimp = null; S._v27edit = { id: ' + JSON.stringify(fxWine.id) + ', field: "profile" }; v27Redraw();');
  check('a sync that lands from another tab does not redraw over an open row editor', G('RENDERS') === 0, String(G('RENDERS')) + ' render(s)');
  G('S._v27edit = null;');
  G('render = _rr;');
  await G('v27Switch(' + JSON.stringify(houseId) + ')');

  /* ================================================================ */
  section('the house drills: dealt by the engine, kept marks only, never counted');
  /* The engine's drill fixture (the Lantern Room again, five wines, seven
     dishes, five drinks), given its own id so it imports as a second house,
     with every wine's section made distinct and a kept serve line on four
     more wines, so all four of the cellar drill's house kinds can deal. */
  const dx = JSON.parse(fs.readFileSync(DRILL_FIXTURE, 'utf8'));
  dx.id = 'h-drillrm1'; dx.name = 'The Drill Room';
  const SECTIONS = ['By the glass', 'Whites of the coast', 'Reds of the hearth', 'Pink and pale', 'Bubbles'];
  const SERVES = [null, 'Cellar cool, decanted an hour ahead.', 'Ice bucket, poured small.', 'Flute, straight from the fridge.', 'Room temperature, a big bowl.'];
  dx.wines.forEach((w, i) => {
    w.section = SECTIONS[i];
    if (SERVES[i]) w.serve = { value: SERVES[i], by: 'person', ts: NOW };
  });
  const drillPack = JSON.stringify(lib.buildPack(dx, 'codex', NOW + 50));
  H.sandbox.DRILLPACK = drillPack;
  await G('v27TakePack(DRILLPACK)');
  check('the drill fixture imports as a pack', !!G('S._v27').added && G('S._v27').added.name === 'The Drill Room', G('S._v27').live);
  await G('v27Switch(S._v27.added.id)');
  check('and is the current house, its five wines on the list', api.currentId() === 'h-drillrm1' && G('ST.cellar.length') === 5, String(G('ST.cellar.length')));

  const unesc = (s) => String(s).replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const fold = (s) => String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ');
  const cur = () => api.current();
  const wineNames = () => cur().wines.map((w) => w.name);
  const drinkNames = () => cur().cocktails.map((c) => c.name);
  const sectionNames = () => cur().wines.map((w) => w.section).filter(Boolean);
  /* the stem a question shows: what follows the label */
  const stemOf = (q) => unesc(String(q.q).split('<br>').slice(1).join('<br>'));
  const kindOf = (q) => String(q.id).replace(/^h-[a-z]+-[a-z0-9]+-/, '');
  const fieldFor = (kind) => (kind === 'zeroProofFor' ? drinkNames() : kind === 'section' ? sectionNames() : wineNames());
  function holdsTheRules(qs, label) {
    const bad = [];
    for (const q of qs) {
      const kind = kindOf(q);
      const opts = q.opts.map(unesc);
      const field = fieldFor(kind);
      if (opts.length !== 4 || new Set(opts.map(fold)).size !== 4) bad.push(q.id + ': not four distinct options');
      else if (!(q.a >= 0 && q.a < 4)) bad.push(q.id + ': the answer out of range');
      else if (!opts.every((o) => field.indexOf(o) >= 0)) bad.push(q.id + ': an option that is not an item of this house: ' + opts.filter((o) => field.indexOf(o) < 0).join(', '));
      else if (fold(stemOf(q)).indexOf(fold(opts[q.a])) >= 0) bad.push(q.id + ': the stem carries its answer');
    }
    check(label + ': every option is a house item, four distinct, and no stem carries its answer (' + qs.length + ' questions)', qs.length > 0 && !bad.length, bad.slice(0, 4).join(' / '));
  }

  /* the engine's dealer, watched: every question this file hands the quiz was dealt by it */
  G('var DEALT = []; var _realDeal = OOT.houseLib.dealQuestion; OOT.houseLib.dealQuestion = function (h, k, r) { var q = _realDeal(h, k, r); if (q) DEALT.push(q); return q; };');
  const cellarQs = G('v27CellarHouseQs()');
  const dealtCellar = G('DEALT.splice(0)');
  check('the cellar drill\'s house questions deal all four kinds: first pick, serve, goes with, the section',
    ['firstPickFor', 'serve', 'wineGoesWith', 'section'].every((k) => cellarQs.some((q) => kindOf(q) === k)), [...new Set(cellarQs.map(kindOf))].join(','));
  check('each is recorded under h-<itemId>-<kind> and filed under Our List', cellarQs.every((q) => /^h-[a-z]-[a-z0-9]+-(firstPickFor|serve|wineGoesWith|section)$/.test(q.id) && q.cat === 'Our List'),
    cellarQs.map((q) => q.id).join(','));
  check('every one of them was dealt by OOT.houseLib.dealQuestion, never a second dealer',
    cellarQs.every((q) => dealtCellar.some((d) => fold(d.stem) === fold(stemOf(q)) && JSON.stringify(d.options) === JSON.stringify(q.opts.map(unesc)) && d.options[q.a] === d.answer)));
  check('no item is asked twice for one kind', new Set(cellarQs.map((q) => q.id)).size === cellarQs.length);
  holdsTheRules(cellarQs, 'the cellar drill');
  const serveQs = cellarQs.filter((q) => kindOf(q) === 'serve');
  check('the serve line is the stem and the answer is the wine it is kept on', serveQs.length === 5
    && serveQs.every((q) => { const w = cur().wines.find((x) => x.serve && x.serve.value === stemOf(q)); return !!w && unesc(q.opts[q.a]) === w.name; }));
  const sectionQs = cellarQs.filter((q) => kindOf(q) === 'section');
  check('the section is asked of each wine by name and answered with its own section', sectionQs.length === 5
    && sectionQs.every((q) => { const w = cur().wines.find((x) => x.name === stemOf(q)); return !!w && unesc(q.opts[q.a]) === w.section; }));
  check('the house record is untouched by the views the dealer is asked over', cur().wines.every((w) => !Array.isArray(w.goesWith) && (!w.goesWith || w.goesWith.value !== (w.serve && w.serve.value))) && Array.isArray(cur().wines[0].grapes));

  /* the wrapped startCellarDrill */
  G('ST.cellarDrillN = "all"; S.mode = ""; S.section = ""; S.view = "cellar";');
  G('startCellarDrill()');
  const pool = G('S.pool');
  check('Drill the list starts a run holding the list\'s questions and the house\'s', G('S.view') === 'quiz' && G('S.section') === 'Our List'
    && pool.some((q) => /^h-/.test(q.id)) && pool.some((q) => /^w-/.test(q.id)), pool.map((q) => q.id).slice(0, 6).join(','));
  G('ST.cellarDrillN = 15; startCellarDrill()');
  check('and the drill length still cuts it', G('S.pool.length') === 15);
  G('S.mode = ""; S.section = ""; S.view = "mine";');

  /* Pair the menu */
  const pairQs = G('v27PairQuestions()');
  const dealtPair = G('DEALT.splice(0)');
  holdsTheRules(pairQs, 'Pair the menu');
  check('Pair the menu deals the first pick among the house wines and rounds without alcohol among the house drinks',
    pairQs.some((q) => kindOf(q) === 'firstPickFor') && pairQs.some((q) => kindOf(q) === 'zeroProofFor')
    && pairQs.filter((q) => kindOf(q) === 'firstPickFor').every((q) => q.opts.map(unesc).every((o) => wineNames().indexOf(o) >= 0)));
  check('the first pick it asks is the kept pairing\'s', pairQs.filter((q) => kindOf(q) === 'firstPickFor').every((q) => {
    const dishId = String(q.id).slice(2).replace(/-firstPickFor$/, '');
    const d = cur().dishes.find((x) => x.id === dishId);
    const w = d && d.pairing && d.pairing.by === 'person' ? cur().wines.find((x) => x.id === d.pairing.value.wineId) : null;
    return !!w && unesc(q.opts[q.a]) === w.name;
  }));
  check('a dish whose pairing nobody kept is never asked', !pairQs.some((q) => q.id.indexOf('d-unkept01') >= 0 || q.id.indexOf('d-beetrt01') >= 0));
  check('and every one was dealt by the engine', pairQs.every((q) => dealtPair.some((d) => fold(d.stem) === fold(stemOf(q)) && JSON.stringify(d.options) === JSON.stringify(q.opts.map(unesc)))));
  G('OOT.houseLib.dealQuestion = _realDeal;');
  check('startHousePairDrill is a top-level function and starts a round through the quiz engine',
    G('typeof startHousePairDrill') === 'function' && G('startHousePairDrill()') === true && G('S.view') === 'quiz' && G('S.mode') === 'drill' && G('S.section') === 'Pair the menu'
    && G('S.pool.every(function (q) { return /^h-/.test(q.id); })'));
  check('Redrill on the results screen deals Pair the menu again', (() => { G('S.pool = []; startDrill("Pair the menu")'); return G('S.section') === 'Pair the menu' && G('S.pool.length') > 0; })());

  /* never counted */
  const q0 = G('S.pool[0]');
  const paceBefore = JSON.stringify(G('ST.paceDays || {}'));
  const histBefore = G('(ST.hist || []).length');
  G('ST.best = ST.best || {}; delete ST.best.perfect;');
  G('statRecord(S.pool[0], true)');
  /* the key the engine's plumbing writes: the h- id under the active level's
     prefix (this device has only answers that belong to no level, so it
     landed where a fresh device lands) */
  const q0key = G('qKey(S.pool[0])');
  check('an answer is recorded in ST.q under its h- key', /(^|\|)h-/.test(q0key) && G('ST.q[' + JSON.stringify(q0key) + '] && ST.q[' + JSON.stringify(q0key) + '].c') === 1, q0key);
  check('keyOwned keeps the h- key out of every level, prefixed or not', ['certified', 'intro', 'advanced', 'master'].every((lv) =>
    G('keyOwned(' + JSON.stringify(q0.id) + ', ' + JSON.stringify(lv) + ')') === false && G('keyOwned(' + JSON.stringify(lv + '|' + q0.id) + ', ' + JSON.stringify(lv) + ')') === false));
  check('while a bank key still belongs to its level', G('keyOwned(missKey(QUESTIONS[0]), "certified")') === true);
  check('the level\'s pace did not move for a house answer', JSON.stringify(G('ST.paceDays || {}')) === paceBefore, paceBefore + ' then ' + JSON.stringify(G('ST.paceDays')));
  const tally = G('JSON.stringify(v25CatTally(activeLevel))');
  G('ST.q[' + JSON.stringify(q0key) + '].c = 50');
  check('the level\'s met figures read the same with the house answer in ST.q', G('JSON.stringify(v25CatTally(activeLevel))') === tally);
  G('S.results = S.pool.slice(0, 20).map(function (q) { return { q: q, ok: true, user: "" }; }); S.correct = S.results.length;');
  G('finish()');
  check('a finished house round leaves the session history and the perfect round as they were', G('(ST.hist || []).length') === histBefore && G('"perfect" in ST.best') === false,
    'hist ' + G('(ST.hist || []).length') + ' perfect ' + G('ST.best.perfect'));
  G('S.mode = ""; S.section = ""; S.view = "mine"; S.results = []; S.pool = [];');

  /* Our list by heart */
  const deck = G('v27ReciteDeck(OOT.house.current())');
  check('Our list by heart deals a deck of calls over the kept pairings and the regions', deck.length > 0 && deck.some((c) => /^With the /.test(c.call)) && deck.some((c) => /^The .+ pour$/.test(c.call)), JSON.stringify(deck.slice(0, 3)));
  check('no call carries the bottle it asks for', deck.every((c) => { const w = cur().wines.find((x) => x.id === c.wineId); return !!w && fold(c.call).indexOf(fold(w.name)) < 0; }));
  const qBefore = JSON.stringify(G('ST.q'));
  check('startHouseRecite is a top-level function and opens the flip deck', G('typeof startHouseRecite') === 'function' && G('startHouseRecite()') === true && G('S.view') === 'houserecite');
  drawn.push(G('v27ReciteHtml()'));
  G('S._v27hr.revealed = true');
  const back = G('v27ReciteHtml()');
  drawn.push(back);
  check('turning the card shows the bottle, and the deck grades nothing and records nothing', /Next call|Finish the walk/.test(back) && JSON.stringify(G('ST.q')) === qBefore);
  G('S._v27hr.idx = S._v27hr.deck.length');
  drawn.push(G('v27ReciteHtml()'));
  check('the deck is registered with codex25\'s render and its controls are buttons with words', G('V25_VIEWS.houserecite === v27ReciteView') && /type="button" id="hr-again">Walk it again</.test(G('v27ReciteHtml()')));
  G('S._v27hr = null; S.view = "mine";');

  /* the rows */
  const rowKeys = G('V25_MINE.map(function (r) { return r.key; })');
  const at = rowKeys.indexOf('cellarrecite');
  check('Mine gains Our list by heart, Pair the menu, Say the pour and Guest at the table after Recite our list', rowKeys.slice(at + 1, at + 5).join(',') === 'houserecite,housepair,housesay,houseguest', rowKeys.join(','));
  check('each resolves through V25_GO, V25_AREA and V25_HUB', ['houserecite', 'housepair', 'housesay', 'houseguest'].every((k) => G('typeof V25_GO.' + k) === 'function' && G('V25_AREA.' + k) === 'mine' && G('V25_HUB.' + k) === 'mine'));
  const pairLine = G('V25_MINE.filter(function (r) { return r.key === "housepair"; })[0].line()');
  check('the Pair the menu line counts what it asks', /dishes to the first pick/.test(pairLine) && /to a drink without alcohol/.test(pairLine), pairLine);
  const sayRow = G('V25_MINE.filter(function (r) { return r.key === "housesay"; })[0].line()');
  const keptLineWines = G('OOT.houseLib.drills.sayable(OOT.house.current(), "wine").length');
  check('Say the pour counts the wines with a kept timed line, offline and with no key', !/Ma.tre d/.test(sayRow) && sayRow.indexOf(keptLineWines + ' wine') === 0, sayRow);
  G('S.view = "mine"; v25Go("housesay")');
  check('and opens its own screen, no drill started', G('S.view') === 'housesay' && G('S.mode') !== 'drill');
  drawn.push(G('v27SayHtml()'));
  G('S.view = "mine"; v25Go("houseguest")');
  check('Guest at the table opens its own screen too', G('S.view') === 'houseguest' && G('S.mode') !== 'drill');
  drawn.push(G('v27GuestHtml()'));
  G('S.view = "mine"; S._v27say = null; S._v27guest = null;');
  drawn.push(G('v25MineHtml()'));

  /* hers alone */
  const hx = JSON.parse(fs.readFileSync(DRILL_FIXTURE, 'utf8'));
  hx.id = 'h-hersonly'; hx.name = 'Her Room';
  hx.wines.forEach((w, i) => { w.section = SECTIONS[i]; if (SERVES[i]) w.serve = { value: SERVES[i], by: 'person', ts: NOW }; });
  const unkeep = (v) => { if (Array.isArray(v)) v.forEach(unkeep); else if (v && typeof v === 'object') { if (v.by === 'person') v.by = 'maitre'; Object.keys(v).forEach((k) => unkeep(v[k])); } };
  unkeep(hx);
  H.sandbox.HERSPACK = JSON.stringify(lib.buildPack(hx, 'codex', NOW + 60));
  await G('v27TakePack(HERSPACK)');
  await G('v27Switch(S._v27.added.id)');
  check('a house over her unkept lines alone is current', api.currentId() === 'h-hersonly' && !G('v27HasKept(OOT.house.current())'));
  check('a drill over hers alone deals nothing: no cellar question, no pairing, no call',
    G('v27CellarHouseQs().length') === 0 && G('v27PairQuestions().length') === 0 && G('v27ReciteDeck(OOT.house.current()).length') === 0);
  G('S.view = "mine"; S.mode = "";');
  check('Pair the menu and Our list by heart open nothing over hers', G('startHousePairDrill()') === false && G('startHouseRecite()') === false && G('S.view') === 'mine');
  const hersLines = G('V25_MINE.filter(function (r) { return r.key === "housepair" || r.key === "houserecite"; }).map(function (r) { return r.line(); })');
  check('and each row\'s line says so', hersLines.length === 2 && hersLines.every((l) => l === 'Nothing kept yet: her lines deal nothing until you keep them.'), hersLines.join(' / '));
  G('ST.cellarDrillN = "all"; startCellarDrill()');
  check('Drill the list over hers asks the list\'s own questions and no house question', G('S.pool.some(function (q) { return /^h-/.test(q.id); })') === false);
  G('S.mode = ""; S.section = ""; S.view = "mine"; ST.cellarDrillN = 15;');
  drawn.push(G('v25MineHtml()'));

  /* ---- the verifier's cases: each one names a hole the review found ---- */
  section('the house drills: the verifier\'s cases');
  /* Twins: two wines carry the same kept serve line, and two wines with a
     kept mark share a region. A serve question must not offer the twin as a
     wrong option (it is as right as the answer), and a call of the deck must
     name one bottle. */
  const tx = JSON.parse(fs.readFileSync(DRILL_FIXTURE, 'utf8'));
  tx.id = 'h-twinsrm1'; tx.name = 'The Twin Room';
  tx.wines.forEach((w, i) => { w.section = SECTIONS[i]; if (SERVES[i]) w.serve = { value: SERVES[i], by: 'person', ts: NOW }; });
  tx.wines[0].serve = { value: SERVES[2], by: 'person', ts: NOW };
  tx.wines[1].region = tx.wines[0].region;
  H.sandbox.TWINPACK = JSON.stringify(lib.buildPack(tx, 'codex', NOW + 70));
  await G('v27TakePack(TWINPACK)');
  await G('v27Switch(S._v27.added.id)');
  const twinBad = [];
  for (let n = 0; n < 40; n++) {
    for (const q of G('v27CellarHouseQs()').filter((x) => kindOf(x) === 'serve')) {
      const stem = fold(stemOf(q));
      q.opts.map(unesc).forEach((o, i) => {
        if (i === q.a) return;
        const w = cur().wines.find((x) => x.name === o);
        if (w && w.serve && w.serve.by === 'person' && fold(w.serve.value) === stem) twinBad.push(q.id + ' offers ' + o + ' as wrong');
      });
    }
  }
  check('a serve question never marks wrong a house wine that carries the same kept serve line', !twinBad.length, twinBad.slice(0, 2).join(' / '));
  const twinDeck = G('v27ReciteDeck(OOT.house.current())');
  const callTo = {};
  twinDeck.forEach((c) => { (callTo[c.call] = callTo[c.call] || new Set()).add(c.wineId); });
  const twoBottles = Object.keys(callTo).filter((k) => callTo[k].size > 1);
  check('a call of Our list by heart names one bottle, never two', !twoBottles.length, twoBottles.join(' / '));

  /* A finished session that mixes the bank with one house question (Review
     Misses holds both) still keeps the bank's session in the history, and a
     house answer puts nothing into the daily review's rotation, as codex17
     keeps producer calls out of ST.srs. */
  const hq = G('v27CellarHouseQs()')[0];
  H.sandbox.HQ = hq;
  const srsBefore = G('Object.keys(ST.srs).filter(function (k) { return /(^|\\|)h-/.test(k); }).length');
  G('statRecord(HQ, true)');
  check('a house answer adds nothing to ST.srs, the daily review\'s rotation', G('Object.keys(ST.srs).filter(function (k) { return /(^|\\|)h-/.test(k); }).length') === srsBefore);
  const histMixed = G('(ST.hist || []).length');
  G('S.mode = "review"; S.results = QUESTIONS.slice(0, 20).map(function (q) { return { q: q, ok: true, user: "" }; }).concat([{ q: HQ, ok: true, user: "" }]); S.correct = S.results.length;');
  G('finish()');
  check('a mixed session keeps the bank\'s answers in the session history', G('(ST.hist || []).length') === histMixed + 1, 'hist ' + histMixed + ' then ' + G('(ST.hist || []).length'));
  G('S.mode = ""; S.section = ""; S.view = "mine"; S.results = []; S.pool = [];');

  /* An engine with no drills section (an older oot-house.js) over a house
     that holds kept marks: the Pair the menu line must not claim nothing is kept. */
  G('var _rk = OOT.houseLib.readyKinds; OOT.houseLib.readyKinds = undefined;');
  const oldEngineLine = G('v27PairLine()');
  G('OOT.houseLib.readyKinds = _rk;');
  check('with kept marks and an engine that cannot deal, the line does not say nothing is kept', G('v27HasKept(OOT.house.current())') && oldEngineLine !== 'Nothing kept yet: her lines deal nothing until you keep them.', oldEngineLine);
  await G('v27Switch(' + JSON.stringify(houseId) + ')');

  /* ================================================================ */
  section('the shipped pack at boot: Brennan\'s loads itself');
  {
  /* A device is the engine over a Map plus the localStorage the chain
     reads. bootDevice loads the engine and the chain over them as the
     wing's shell does, with fetch answering the one same-origin pack and
     recording what it was asked; a second boot is a new sandbox over the
     same two stores. */
  const packText = fs.readFileSync(PACK_FILE, 'utf8');
  const packJson = JSON.parse(packText);
  const PACK_PATH = '../shared/packs/brennans-new-orleans.v1.oothouse.json';
  function bootDevice(backing, seed, text, opts) {
    const o = opts || {};
    const D = makeSandbox(seed, {});
    vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), D.ctx, { filename: 'oot-house.js' });
    vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), D.ctx, { filename: 'oot-house-ui.js' });
    const dlib = D.G('OOT.houseLib');
    const dapi = dlib.createHouseApi(dlib.mapStorage(backing), { win: D.sandbox, now: () => o.now || NOW, rand: seeded(o.seed || 21), from: 'codex' });
    D.sandbox.OOT.house = dapi;
    const asked = [];
    if (o.offline) D.sandbox.navigator.onLine = false;
    D.sandbox.fetch = (url, fo) => {
      /* codex23 asks after the maps on its own; only the pack is this file's question */
      if (/\.oothouse\.json$/.test(String(url))) asked.push({ url, opts: fo });
      if (o.fail) return Promise.reject(new Error('no network'));
      /* the verifier's: a slow network, answered only when the case releases it */
      if (o.hold && /\.oothouse\.json$/.test(String(url))) return new Promise((r) => { o.release = () => r({ ok: true, status: 200, text: () => Promise.resolve(text) }); });
      return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(text) });
    };
    loadChain(D);
    return { D, api: dapi, asked };
  }
  async function settle(dev) {
    await dev.D.G('V27_LAST');
    await dev.D.G('V27_BOOT_PACK');
    await tick(30);
    await dev.D.G('V27_WRITING');
    await tick(10);
  }
  const snap = (backing) => JSON.stringify([...backing.entries()].sort());
  const cellarOf = (store) => JSON.stringify((JSON.parse(store.codexStats || '{}').cellar) || []);

  const B1 = new Map();
  const dev1 = bootDevice(B1, {}, packText);
  await settle(dev1);
  const boot1 = await dev1.D.G('V27_BOOT_PACK');
  check('the boot asks for the one same-origin pack, once, with cache no-cache', dev1.asked.length === 1 && dev1.asked[0].url === PACK_PATH && dev1.asked[0].opts && dev1.asked[0].opts.cache === 'no-cache',
    JSON.stringify(dev1.asked));
  check('V27_DEFAULT_PACK is the one constant naming it', dev1.D.G('V27_DEFAULT_PACK') === PACK_PATH);
  check('on an empty device ensurePack adds Brennan\'s and makes it current', !!boot1 && boot1.action === 'added' && boot1.current === true, JSON.stringify(boot1));
  const bh = dev1.api.current();
  check('the current house is the pack\'s edition', !!bh && bh.pack && bh.pack.id === 'brennans-new-orleans' && bh.id === packJson.house.id);
  check('its wines are on Our Wine List through the switch, every bottle stamped with the house', dev1.D.G('ST.cellar.length') === packJson.house.wines.length
    && dev1.D.G('ST.cellar.every(function (b) { return b.house === ' + JSON.stringify(bh.id) + '; })'), String(dev1.D.G('ST.cellar.length')));
  const loadedLine = dev1.D.G('V25_MINE.filter(function (r) { return r.key === "house"; })[0].line()');
  const wantLine = packJson.house.name + ' is loaded: ' + packJson.house.dishes.length + ' dishes, ' + packJson.house.cocktails.length + ' drinks, ' + packJson.house.wines.length + ' wines';
  check('one quiet line rides on the house line', loadedLine.indexOf(wantLine) >= 0, loadedLine);
  check('and the line is clean', !voiceProblems(loadedLine).length);
  dev1.D.G('S.view = "mine"; render(); render();');
  check('it is drawn once, then gone', dev1.D.G('V27_AUTO_NOTE') === '' && dev1.D.G('V25_MINE.filter(function (r) { return r.key === "house"; })[0].line()').indexOf('loaded') < 0);

  const before2 = snap(B1);
  const cellar2 = cellarOf(dev1.D.store);
  const dev2 = bootDevice(B1, Object.assign({}, dev1.D.store), packText);
  await settle(dev2);
  const boot2 = await dev2.D.G('V27_BOOT_PACK');
  check('a second boot finds the edition current', !!boot2 && boot2.action === 'current', JSON.stringify(boot2));
  check('and writes nothing: the house store is byte for byte the same', snap(B1) === before2);
  check('and the list is the same', cellarOf(dev2.D.store) === cellar2 && dev2.D.G('ST.cellar.length') === packJson.house.wines.length);
  check('and says nothing', dev2.D.G('V27_AUTO_NOTE') === '');

  const devOff = bootDevice(new Map(), {}, packText, { offline: true });
  await settle(devOff);
  check('offline the pack is not asked for and the boot stands', devOff.asked.length === 0 && (await devOff.D.G('V27_BOOT_PACK')) === null && devOff.api.current() === null && devOff.D.G('typeof render') === 'function');
  const devFail = bootDevice(new Map(), {}, packText, { fail: true });
  await settle(devFail);
  check('a failed fetch is quiet: no house, no line, no throw', devFail.asked.length === 1 && (await devFail.D.G('V27_BOOT_PACK')) === null && devFail.api.current() === null && devFail.D.G('V27_AUTO_NOTE') === '');

  /* ================================================================ */
  section('a newer edition refreshes, and a bottle the person edited stands');
  /* The edition before this one, made from the shipped pack: every stamp the
     edition carries moved a day back, one wine's style as it was printed
     then, and one lexicon term the newer edition adds. */
  const NEW_AT = Date.parse(packJson.house.pack.builtAt);
  /* a day back, and never later than the device's clock: the person's edits below come after it */
  const OLD_AT = Math.min(NEW_AT, NOW) - 86400000;
  const oldPack = JSON.parse(packText);
  const restamp = (v) => {
    if (Array.isArray(v)) return v.forEach(restamp);
    if (v && typeof v === 'object') Object.keys(v).forEach((k) => { if (v[k] === NEW_AT) v[k] = OLD_AT; else restamp(v[k]); });
  };
  restamp(oldPack.house);
  oldPack.house.pack.builtAt = new Date(OLD_AT).toISOString();
  const shippedW1 = packJson.house.wines[0];
  const w1 = oldPack.house.wines[0].id;
  const w2 = oldPack.house.wines[1].id;
  oldPack.house.wines[0].style = 'As printed the day before';
  const addedTerm = oldPack.house.lexicon.pop();
  const B3 = new Map();
  const dev3 = bootDevice(B3, {}, JSON.stringify(oldPack));
  await settle(dev3);
  check('the older edition is on the device and current', dev3.api.current() && dev3.api.current().pack.builtAt === oldPack.house.pack.builtAt && dev3.D.G('ST.cellar.length') === oldPack.house.wines.length);
  /* the person edits the second bottle: its style on the list, its profile on the house */
  dev3.D.G('(function () { var b = v27BottleById(' + JSON.stringify(w2) + '); b.style = "My own words on the style"; b.ts = ' + (NOW + 5) + '; stSave(); })()');
  await dev3.D.G('v27Put(v27BottleById(' + JSON.stringify(w2) + '))');
  await dev3.D.G('v27Edit("wine", ' + JSON.stringify(w2) + ', "profile", "My own profile of this bottle")');
  const w2item = dev3.api.current().wines.find((w) => w.id === w2);
  check('the edit is on the house', w2item.style === 'My own words on the style' && w2item.profile.value === 'My own profile of this bottle' && w2item.profile.by === 'person');
  /* the verifier's: the person takes a third bottle off the list (the
     list's Remove, then the house's tombstone) and rewrites a fourth's say
     line, both before the newer edition lands */
  const w3 = oldPack.house.wines[2].id;
  const w4 = oldPack.house.wines[3].id;
  dev3.D.G('(function () { var i = v27IndexOf(' + JSON.stringify(w3) + '); ST.cellar.splice(i, 1); stSave(); })()');
  await dev3.D.G('v27Remove(' + JSON.stringify(w3) + ')');
  await dev3.D.G('v27Edit("wine", ' + JSON.stringify(w4) + ', "say", "My own way of saying it")');
  const dev4 = bootDevice(B3, Object.assign({}, dev3.D.store), packText, { now: NOW + 100 });
  await settle(dev4);
  const boot4 = await dev4.D.G('V27_BOOT_PACK');
  check('the newer edition refreshes the copy on the device', !!boot4 && boot4.action === 'refreshed' && boot4.counts && boot4.counts.added >= 1, JSON.stringify(boot4));
  const h4 = dev4.api.current();
  check('the term the edition adds is on the house', h4.lexicon.some((x) => x.id === addedTerm.id));
  check('the wine nobody touched takes the edition\'s value, on the house and on the list',
    h4.wines.find((w) => w.id === w1).style === shippedW1.style && dev4.D.G('v27BottleById(' + JSON.stringify(w1) + ').style') === shippedW1.style,
    h4.wines.find((w) => w.id === w1).style);
  const w2after = h4.wines.find((w) => w.id === w2);
  check('the bottle the person edited keeps their style, on the house and on the list',
    w2after.style === 'My own words on the style' && dev4.D.G('v27BottleById(' + JSON.stringify(w2) + ').style') === 'My own words on the style');
  check('and keeps their profile, kept as theirs', w2after.profile && w2after.profile.value === 'My own profile of this bottle' && w2after.profile.by === 'person');
  const refLine = dev4.D.G('V25_MINE.filter(function (r) { return r.key === "house"; })[0].line()');
  check('one quiet line says what the edition brought', refLine.indexOf(packJson.house.name + ' updated: ' + boot4.counts.added + ' new') >= 0, refLine);
  check('the pointer did not move', dev4.api.currentId() === packJson.house.id);

  /* ================================================================ */
  section('the verifier: the shipped pack never moves the list under the person');
  check('a bottle the person removed stays off the list and off the house after the refresh',
    dev4.D.G('v27IndexOf(' + JSON.stringify(w3) + ')') < 0 && !h4.wines.some((w) => w.id === w3));
  const w4after = h4.wines.find((w) => w.id === w4);
  check('a say line the person rewrote stands after the refresh, kept as theirs',
    !!w4after && w4after.say && w4after.say.value === 'My own way of saying it' && w4after.say.by === 'person');
  /* A slow network: the pack lands while the cellar form is open on a
     bottle. v27Busy exists so no sync moves the list under a form or an Our
     List drill; the auto-load's switch must keep that rule too, and leave
     the list as it stood until the form is closed. */
  const holdOpts = { hold: true };
  const devBusy = bootDevice(new Map(), {}, packText, holdOpts);
  await tick(30);
  devBusy.D.G('S.view = "cellar"; S._cellarForm = { id: "" };');
  const busyBefore = devBusy.D.G('JSON.stringify(ST.cellar || [])');
  if (holdOpts.release) holdOpts.release();
  await devBusy.D.G('V27_BOOT_PACK');
  await tick(30);
  check('a pack that lands while the cellar form is open leaves the list as it stood until the form closes',
    devBusy.D.G('JSON.stringify(ST.cellar || [])') === busyBefore, String(devBusy.D.G('(ST.cellar || []).length')) + ' rows under an open form');
  check('the held pack writes nothing to the device while the form is open', devBusy.api.list().length === 0 && !devBusy.api.currentId());
  devBusy.D.G('S._cellarForm = null; S.view = "home"; render();');
  await settle(devBusy);
  check('and once the form closes, the next render loads it and the list follows',
    devBusy.api.currentId() === packJson.house.id && devBusy.D.G('(ST.cellar || []).length') === packJson.house.wines.length,
    String(devBusy.D.G('(ST.cellar || []).length')));

  /* The quiet line is drawn once: a render of a screen that does not show
     the house line must not spend it, or the person never sees it. */
  const devHome = bootDevice(new Map(), {}, packText);
  devHome.D.G('S.view = "home";');
  await settle(devHome);
  const homeHtml = devHome.D.G('S.view = "home"; v25HomeHtml()');
  devHome.D.G('S.view = "home"; render(); render();');
  const homeNote = devHome.D.G('V27_AUTO_NOTE');
  const homeLine = devHome.D.G('V25_MINE.filter(function (r) { return r.key === "house"; })[0].line()');
  check('the pack\'s quiet line is shown on the home screen or still waits for the house line after home renders',
    homeHtml.indexOf('is loaded') >= 0 || (homeNote !== '' && homeLine.indexOf('is loaded') >= 0), 'note now: ' + JSON.stringify(homeNote));

  /* A device that holds the person's own bottles and no house: the
     shipped pack is the restaurant's list, and the person's own cellar must
     not be filed into it (it would ride out in every Brennan's pack this
     device exports, and deal in the house's drills as a house wine). */
  const OWN = { id: 'w-own00001', ts: 5, producer: 'Krug', name: 'Grande Cuvee', vintage: 'NV', region: 'Champagne', grapes: '', style: '', glass: '', bottle: '', note: '' };
  const devOwn = bootDevice(new Map(), { codexStats: JSON.stringify({ cellar: [OWN] }) }, packText);
  await settle(devOwn);
  const ownHouse = devOwn.api.current();
  check('the person\'s own bottle with no house is not adopted into the shipped Brennan\'s house',
    !!ownHouse && !ownHouse.wines.some((w) => w.producer === 'Krug' && /Grande Cuvee/.test(w.name)),
    ownHouse ? ownHouse.wines.length + ' wines on Brennan\'s, the pack ships ' + packJson.house.wines.length : 'no house');
  const ownStub = devOwn.api.list().find((x) => x.name === 'My own bottles');
  const ownKept = ownStub ? await devOwn.api.switchTo(ownStub.id) : null;
  check('the person\'s bottle is kept in a house of their own, and Brennan\'s is still the house open',
    !!ownKept && ownKept.wines.some((w) => w.producer === 'Krug') && !!ownHouse && ownHouse.id === packJson.house.id && ownHouse.wines.length === packJson.house.wines.length);
  const ownLine = devOwn.D.G('V27_AUTO_NOTE');
  check('and the quiet line says where they are', /Your own bottles are kept as My own bottles, under The house/.test(ownLine), ownLine);

  /* ================================================================ */
  section('Say the pour: offline, graded by the engine, recorded only on Record it');
  const SD = dev2.D;
  const sapi = dev2.api;
  SD.G('var GRADED = []; var _realSaid = OOT.houseLib.drills.gradeSaid; OOT.houseLib.drills.gradeSaid = function (h, id, len, said) { var g = _realSaid(h, id, len, said); GRADED.push({ id: id, len: len, said: said, verdict: g && g.verdict }); return g; };');
  const sayItems = SD.G('v27SayItems()');
  check('every wine of the edition has a kept timed line to say back', sayItems.length === packJson.house.wines.length && sayItems.every((x) => x.kind === 'wine' && x.lengths.join(',') === 's10,s20,s45'), String(sayItems.length));
  const sayLine = SD.G('V25_MINE.filter(function (r) { return r.key === "housesay"; })[0].line()');
  check('the row counts them', sayLine.indexOf(sayItems.length + ' wines with kept lines') === 0, sayLine);
  SD.G('S.view = "mine"; v25Go("housesay")');
  check('the row opens Say the pour', SD.G('S.view') === 'housesay');
  const sayFirst = SD.G('v27SayHtml()');
  const sectionsShown = [...new Set(sayItems.map((x) => x.section))];
  check('the list is drawn by the house\'s sections, with Next for a random one', sectionsShown.every((sct) => sayFirst.indexOf('<optgroup label="' + sct.replace(/&/g, '&amp;') + '"') >= 0) && /id="hs-next">Next wine</.test(sayFirst));
  check('the three lengths are chips in words, the chosen one saying so', /10 seconds/.test(sayFirst) && /20 seconds, chosen/.test(sayFirst) && /45 seconds/.test(sayFirst));
  check('a live count against the cap, and Check', /id="hs-count"[^>]*>0 of 50 words/.test(sayFirst) && /id="hs-check">Check</.test(sayFirst));
  check('no Record it before a Check', sayFirst.indexOf('id="hs-record"') < 0);
  check('no Speak where the browser has no speech recognition', sayFirst.indexOf('Speak') < 0);
  check('the screen leaves allergens to the kitchen', /Allergens are the kitchen/.test(sayFirst));
  SD.sandbox.webkitSpeechRecognition = function () { };
  const saySpeak = SD.G('v27SayHtml()');
  check('Speak shows where it exists, saying where the voice goes', /id="hs-speak"[^>]*>Speak</.test(saySpeak) && saySpeak.indexOf('Your voice goes to your browser\'s speech service, not to Anthropic.') >= 0);
  delete SD.sandbox.webkitSpeechRecognition;
  const sayId = SD.G('S._v27say.id');
  const sayWine = sapi.current().wines.find((w) => w.id === sayId);
  if (sayWine.serviceNote) check('a wine\'s service note sits under the fixed eyebrow', sayFirst.indexOf('Your words. Allergens: confirm at lineup.') >= 0);
  const qBeforeSay = JSON.stringify(SD.G('ST.q'));
  const keptLine = sayWine.lines.value.s20;
  const good = SD.G('v27SayCheck(' + JSON.stringify(keptLine) + ')');
  const graded = SD.G('GRADED.splice(0)');
  check('Check grades the typed line through houseLib.drills.gradeSaid', graded.length === 1 && graded[0].id === sayId && graded[0].len === 's20' && graded[0].said === keptLine);
  check('the kept line said back is Met', !!good && good.verdict === 'met', good && good.verdict);
  check('and Check writes nothing', JSON.stringify(SD.G('ST.q')) === qBeforeSay);
  const sayRes = SD.G('v27SayHtml()');
  check('the verdict is a word, each part Hit or Missed with its label, the kept line beside what was said',
    /Verdict: Met/.test(sayRes) && good.parts.every((p) => sayRes.indexOf(p.label) >= 0) && /Hit/.test(sayRes)
    && /Your kept line/.test(sayRes) && /What you said/.test(sayRes) && /id="hs-record">Record it</.test(sayRes) && /id="hs-again">Try again</.test(sayRes));
  check('and the notes are drawn', good.notes.every((n) => sayRes.indexOf(n.replace(/&/g, '&amp;').replace(/'/g, '\'')) >= 0 || sayRes.indexOf(n.replace(/&/g, '&amp;')) >= 0));
  const sayKey = SD.G('v27SayRecord()');
  check('Record it writes ST.q through the quiz engine under h-<wineId>-say-<length>', /(^|\|)h-w-[a-z0-9]+-say-s20$/.test(sayKey) && sayKey.indexOf(sayId) >= 0 && SD.G('ST.q[' + JSON.stringify(sayKey) + '].c') === 1, sayKey);
  check('once: a second Record it writes nothing', SD.G('v27SayRecord()') === null && SD.G('ST.q[' + JSON.stringify(sayKey) + '].c') === 1);
  check('the screen then says Recorded in words', /Recorded/.test(SD.G('v27SayHtml()')) && SD.G('v27SayHtml()').indexOf('id="hs-record"') < 0);
  check('keyOwned keeps the say key out of every level', ['certified', 'intro', 'advanced', 'master'].every((lv) => SD.G('keyOwned(' + JSON.stringify(sayKey) + ', ' + JSON.stringify(lv) + ')') === false));
  check('and nothing of it reaches the daily review', SD.G('Object.keys(ST.srs || {}).some(function (k) { return /(^|\\|)h-/.test(k); })') === false);
  SD.G('v27SayAgain(); v27SayLength("s10")');
  const weak = SD.G('v27SayCheck("It is a nice wine.")');
  check('a weak pour is graded too, its verdict a word', !!weak && weak.verdict !== 'met' && /Verdict: (Close|Missed)/.test(SD.G('v27SayHtml()')) && /Missed/.test(SD.G('v27SayHtml()')));
  const qBeforeWeak = JSON.stringify(SD.G('ST.q'));
  SD.G('v27SayAgain()');
  check('Try again clears the grade and records nothing', SD.G('S._v27say.grade') === null && JSON.stringify(SD.G('ST.q')) === qBeforeWeak);
  const before10 = SD.G('Object.keys(ST.q).length');
  SD.G('v27SayCheck("It is a nice wine.")');
  const weakKey = SD.G('v27SayRecord()');
  check('a weak pour recorded is a wrong answer under its own length', /-say-s10$/.test(weakKey) && SD.G('ST.q[' + JSON.stringify(weakKey) + '].w') === 1 && SD.G('Object.keys(ST.q).length') === before10 + 1);
  const nextId = SD.G('v27SayPick("")');
  check('Next deals another wine, and the grade starts afresh', !!nextId && nextId !== sayId && SD.G('S._v27say.grade') === null);
  drawn.push(sayFirst, sayRes);
  SD.G('OOT.houseLib.drills.gradeSaid = _realSaid;');

  /* ================================================================ */
  section('Guest at the table: the wine first, graded by the engine, recorded only on Record it');
  SD.G('var PLAYED = []; var _realScen = OOT.houseLib.drills.gradeScenario; OOT.houseLib.drills.gradeScenario = function (h, id, said) { var g = _realScen(h, id, said); PLAYED.push({ id: id, said: said, verdict: g && g.verdict }); return g; };');
  const gh = sapi.current();
  const ghWines = new Set(gh.wines.map((w) => w.id));
  const keptScen = gh.scenarios.filter((x) => x.you && x.you.by === 'person');
  const keptMix = gh.mixUps.filter((m) => m.ask && m.ask.by === 'person' && m.difference && m.difference.by === 'person');
  const gdeck = SD.G('v27GuestDeck(OOT.house.current())');
  check('the deck holds every kept scenario and every kept mix-up', gdeck.length === keptScen.length + keptMix.length, gdeck.length + ' of ' + (keptScen.length + keptMix.length));
  const rank = (x) => (x.wine ? 0 : 2) + (x.mix ? 1 : 0);
  check('the scenarios that name a wine come first, then the rest, the mix-ups after each', gdeck.every((x, i) => i === 0 || rank(gdeck[i - 1]) <= rank(x))
    && gdeck.filter((x) => !x.mix && x.wine).length === keptScen.filter((x) => x.itemIds.some((id) => ghWines.has(id))).length
    && gdeck.filter((x) => !x.mix && x.wine).length > 0 && gdeck[0].wine === true);
  SD.G('S.view = "mine"; v25Go("houseguest")');
  check('the row opens Guest at the table', SD.G('S.view') === 'houseguest');
  const dealt = SD.G('S._v27guest.deck');
  check('the dealt round keeps that order', dealt.length === gdeck.length && dealt.every((x, i) => i === 0 || rank(dealt[i - 1]) <= rank(x)));
  const card = SD.G('v27GuestCard()');
  const sc = gh.scenarios.find((x) => x.id === card.id);
  const guestFirst = SD.G('v27GuestHtml()');
  check('the guest\'s words are shown, with a box, a count and Check, and no Record it yet',
    guestFirst.indexOf('The guest says') >= 0 && guestFirst.indexOf(sc.guest.replace(/&/g, '&amp;').replace(/"/g, '&quot;')) >= 0 && /id="hg-check">Check</.test(guestFirst) && guestFirst.indexOf('id="hg-record"') < 0);
  check('and leaves allergens to the kitchen', /Allergens are the kitchen/.test(guestFirst));
  const qBeforeGuest = JSON.stringify(SD.G('ST.q'));
  const gg = SD.G('v27GuestCheck(' + JSON.stringify(sc.you.value) + ')');
  const played = SD.G('PLAYED.splice(0)');
  check('Check grades the answer through houseLib.drills.gradeScenario', played.length === 1 && played[0].id === sc.id && played[0].said === sc.you.value);
  check('the kept answer said back is Met, and Check writes nothing', !!gg && gg.verdict === 'met' && JSON.stringify(SD.G('ST.q')) === qBeforeGuest);
  const guestRes = SD.G('v27GuestHtml()');
  check('the result shows the verdict in a word, the kept answer and the principle',
    /Verdict: Met/.test(guestRes) && /Your kept answer/.test(guestRes) && /The principle/.test(guestRes) && /id="hg-record">Record it</.test(guestRes));
  const guestKey = SD.G('v27GuestRecord()');
  check('Record it writes ST.q under h-<scenarioId>-guest', /(^|\|)h-s-[a-z0-9]+-guest$/.test(guestKey) && guestKey.indexOf(sc.id) >= 0 && SD.G('ST.q[' + JSON.stringify(guestKey) + '].c') === 1, guestKey);
  check('once only', SD.G('v27GuestRecord()') === null && SD.G('ST.q[' + JSON.stringify(guestKey) + '].c') === 1);
  check('keyOwned keeps the guest key out of every level', ['certified', 'intro', 'advanced', 'master'].every((lv) => SD.G('keyOwned(' + JSON.stringify(guestKey) + ', ' + JSON.stringify(lv) + ')') === false));
  if (keptMix.length) {
    const mx = keptMix[0];
    const mcard = SD.G('v27GuestPick(' + JSON.stringify(mx.id) + ')');
    check('a mix-up is dealt as a which is which ask', !!mcard && mcard.mix === true && /^Which is which: /.test(mcard.title) && mcard.guest === mx.ask.value);
    const mg = SD.G('v27GuestCheck(' + JSON.stringify(mx.difference.value) + ')');
    const mplayed = SD.G('PLAYED.splice(0)');
    check('and graded by gradeScenario against the kept difference', mplayed.length === 1 && mplayed[0].id === mx.id && !!mg && mg.verdict === 'met' && mg.keptYou === mx.difference.value);
    const mkey = SD.G('v27GuestRecord()');
    check('recorded under h-<mixUpId>-guest', /(^|\|)h-m-[a-z0-9]+-guest$/.test(mkey));
    drawn.push(SD.G('v27GuestHtml()'));
  }
  const moved = SD.G('v27GuestMove(1)');
  check('Next guest moves on and starts afresh', !!moved && SD.G('S._v27guest.grade') === null);
  drawn.push(guestFirst, guestRes);
  SD.G('OOT.houseLib.drills.gradeScenario = _realScen;');
  check('the house record is untouched by every grade', snap(B1) === before2);
  }

  /* ================================================================ */
  section('voice');
  const src = fs.readFileSync(path.join(JS, 'codex27.js'), 'utf8');
  const srcProblems = voiceProblems(src);
  check('codex27.js itself: no long dash, no double hyphen, no retired word, no glyph, no level numeral', !srcProblems.length, srcProblems.join(', '));
  check('codex27.js declares with var and function only', !/^\s*(let|const|class)\s/m.test(src) && src.indexOf('=>') < 0);
  check('codex27.js never reads location', !/\blocation\b/.test(src));
  check('codex27.js names no level by number', !/\bLevel\s+(I|II|III|IV)\b/.test(src));
  const selfProblems = voiceProblems(fs.readFileSync(__filename, 'utf8'));
  check('check-house.js itself: the same', !selfProblems.length, selfProblems.join(', '));
  const fixtureProblems = voiceProblems(fs.readFileSync(FIXTURE, 'utf8'));
  check('the fixture house itself: the same', !fixtureProblems.length, fixtureProblems.join(', '));
  const drillFixtureProblems = voiceProblems(fs.readFileSync(DRILL_FIXTURE, 'utf8'));
  check('the drill fixture itself: the same', !drillFixtureProblems.length, drillFixtureProblems.join(', '));
  check('a house drill answer keyed on a wine follows the wine\'s new id', G('v27RekeyOne("intro|h-w-aaaaaaaa-serve", "w-aaaaaaaa", "w-bbbbbbbb")') === 'intro|h-w-bbbbbbbb-serve'
    && G('v27RekeyOne("h-d-chicken1-firstPickFor", "w-aaaaaaaa", "w-bbbbbbbb")') === null);
  const drawnProblems = voiceProblems(drawn.join('\n'));
  check('every string the house view draws (' + drawn.length + ' pages): the same', !drawnProblems.length, drawnProblems.join(', '));
  const rowStrings = G('V25_MINE.map(function (r) { return r.name + " " + r.line(); }).join("\\n")');
  check('every Mine row name and line: the same', !voiceProblems(rowStrings).length);

  /* ================================================================ */
  section('no OOT at all');
  const N = makeSandbox({ codexStats: JSON.stringify({ cellar: [{ id: 'w-aaaaaaaa', ts: 1, producer: 'Krug', name: 'Grande Cuvee', vintage: 'NV', region: '', grapes: '', style: '', glass: '', bottle: '', note: '', house: 'h-elsewhere' }] }) }, {});
  loadChain(N);
  check('the chain loads with no OOT', N.G('typeof OOT') === 'undefined');
  check('the house row does not show', N.G('V25_MINE[0].key') === 'house' && N.G('V25_MINE[0].show()') === false);
  check('Mine draws no house row', N.G('v25MineHtml()').indexOf('data-go="house"') < 0);
  check('the sync is a no-op', N.G('V27_LAST') === null && (await N.G('v27Sync()')) === null);
  check('the house carried by a bottle survives the load', N.G('ST.cellar[0].house') === 'h-elsewhere');
  const noLine = N.G('V25_MINE[0].line()');
  check('the no-house line is clean', !voiceProblems(noLine).length && noLine === 'No house yet. Import a pack, or start one.', noLine);
  N.G('S.view = "house"');
  const bare = N.G('v27HouseHtml()');
  check('the house view says the engine is not in this build', /not in this build/.test(bare) && !voiceProblems(bare).length);
  check('Hers, to look over does not show', N.G('V25_MINE[1].key') === 'housereview' && N.G('V25_MINE[1].show()') === false);
  check('the form block is empty', N.G('v27FormHouseHtml("w-aaaaaaaa")') === '');
  check('the list rows draw no lines', N.G('v27RowLinesHtml(ST.cellar[0], null, false)') === '');
  const bareReview = N.G('v27ReviewHtml()');
  check('the review says the engine is not in this build', /not in this build/.test(bareReview) && !voiceProblems(bareReview).length);
  check('every door is a no-op', (await N.G('v27Keep("wine", "w-aaaaaaaa", "say")')) === false && (await N.G('v27Discard("wine", "w-aaaaaaaa", "say")')) === false
    && (await N.G('v27SaveHouseFields("w-aaaaaaaa", { serviceNote: "x" })')) === false && JSON.stringify(N.G('v27Problems("wine", "w-aaaaaaaa")')) === '[]'
    && typeof N.G('v27Hooks()').setMark === 'function');
  check('the four drill rows do not show', ['houserecite', 'housepair', 'housesay', 'houseguest'].every((k) => N.G('V25_MINE.filter(function (r) { return r.key === "' + k + '"; })[0].show()') === false));
  check('the house drills deal nothing and open nothing', N.G('typeof startHousePairDrill') === 'function' && N.G('startHousePairDrill()') === false
    && N.G('startHouseRecite()') === false && N.G('v27CellarHouseQs().length') === 0 && N.G('S.view') !== 'quiz');
  check('Say the pour and Guest at the table grade nothing and record nothing with no OOT', N.G('v27SayCheck("anything")') === null && N.G('v27SayRecord()') === null
    && N.G('v27GuestCheck("anything")') === null && N.G('v27GuestRecord()') === null && N.G('Object.keys(ST.q).some(function (k) { return /(^|\\|)h-/.test(k); })') === false);
  check('and their screens say there is no house, cleanly', /No house yet/.test(N.G('v27SayHtml()')) && /No house yet/.test(N.G('v27GuestHtml()'))
    && !voiceProblems(N.G('v27SayHtml()') + N.G('v27GuestHtml()')).length);
  check('the shipped pack is not asked for with no OOT', N.G('V27_BOOT_PACK') === null);
  check('keyOwned still keeps an h- key out with no OOT', N.G('keyOwned("h-d-chicken1-firstPickFor", "certified")') === false);
  check('Drill the list is codex12\'s own with no OOT', (() => { N.G('startCellarDrill()'); return N.G('S.view') !== 'quiz'; })());
  /* the verifier's case: a device whose only answers are house answers has
     never studied a level, so it lands on the level a fresh device lands on */
  {
    const F0 = makeSandbox({}, {});
    loadChain(F0);
    const F1 = makeSandbox({ codexStats: JSON.stringify({ q: { 'h-d-chicken1-firstPickFor': { c: 3, w: 0, s: 3 } } }) }, {});
    loadChain(F1);
    check('house answers alone do not move the level a fresh device lands on', F1.G('activeLevel') === F0.G('activeLevel'), F0.G('activeLevel') + ' then ' + F1.G('activeLevel'));
  }
  check('the merge still keeps house with no OOT', (() => {
    N.G('mergeStats({ codex: "sommeliers-codex", v: 4, stats: { cellar: [{ id: "w-aaaaaaaa", ts: 2, producer: "Krug", name: "Grande Cuvee", vintage: "NV" }] } })');
    return N.G('ST.cellar[0].ts') === 2 && N.G('ST.cellar[0].house') === 'h-elsewhere';
  })());

  console.log('');
  if (failed) {
    console.log('check-house: ' + failed + ' of ' + (passed + failed) + ' checks FAILED');
    process.exit(1);
  }
  console.log('check-house: all ' + passed + ' checks pass');
  process.exit(0);
}

/* the verifier's: a promise that never settles drains the loop and Node
   exits 0 with no summary, so a hung case would read as a pass */
process.on('beforeExit', () => {
  console.error('check-house: the run ended before its summary (a case never settled)');
  process.exit(1);
});

main().catch((e) => {
  console.error('check-house: ' + (e && e.stack ? e.stack : e));
  process.exit(1);
});
