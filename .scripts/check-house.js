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
if (!fs.existsSync(ENGINE)) {
  console.error('check-house: no oot-house.js at ' + SHARED + ' (set OOT_SHARED)');
  process.exit(1);
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
  'codex23.js', 'codex24.js', 'codex25.js', 'codex26.js', 'codex27.js', 'boot.js'];

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
    get firstChild() { return NODE; }, get firstElementChild() { return NODE; },
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
  section('voice');
  const src = fs.readFileSync(path.join(JS, 'codex27.js'), 'utf8');
  const srcProblems = voiceProblems(src);
  check('codex27.js itself: no long dash, no double hyphen, no retired word, no glyph, no level numeral', !srcProblems.length, srcProblems.join(', '));
  check('codex27.js declares with var and function only', !/^\s*(let|const|class)\s/m.test(src) && src.indexOf('=>') < 0);
  check('codex27.js never reads location', !/\blocation\b/.test(src));
  check('codex27.js names no level by number', !/\bLevel\s+(I|II|III|IV)\b/.test(src));
  const selfProblems = voiceProblems(fs.readFileSync(__filename, 'utf8'));
  check('check-house.js itself: the same', !selfProblems.length, selfProblems.join(', '));
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

main().catch((e) => {
  console.error('check-house: ' + (e && e.stack ? e.stack : e));
  process.exit(1);
});
