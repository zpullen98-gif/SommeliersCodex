/**
 * THE FLOOR'S BOTTLES AND THE FULL LIST (codex29), against fixtures.
 *
 * Loads the SHIPPED chain with codex29 on top of the SHIPPED engine, over a
 * Map storage, with the shipped Brennan's pack widened here by three floor
 * bottles (list 'bottle', a bin, a size, kept lines and coaching notes) and
 * the Hussarde tiered over them, and a list file made here (format
 * oot-winelist v1: 130 entries over three sections, producers, places, one
 * whole card). It asks:
 *
 *   1. a floor bottle gets a flash card and a card with "Bin N", its size,
 *      the dishes it is offered with and the whole coaching block; the glass
 *      list's deck stays glasses; the floor scopes deal the floor's bottles;
 *      the header counts the glasses, the menus' bottles and the floor's
 *      bottles apart; the floor chip opens a row of floor section chips
 *   2. the full list is fetched only when its view opens, never at load; it
 *      pages 40 at a time; the search finds by name, producer, grape,
 *      region and bin; the section, price and size chips narrow it; a row
 *      opens to its producer's line and tell and its section's line, and a
 *      floor bottle's row offers Open the full card
 *   3. no checked attribute and no allergen box anywhere it draws; every
 *      string it draws passes the voice rule
 *   4. offline before the first visit (the fetch fails) it says plainly that
 *      the list cannot be opened, and offers Try again; a house that ships
 *      no list says so; with no OOT the door never shows
 *   5. the service worker keeps the list in codexlist-v1, network first, and
 *      the file names it in ASSETS, index.html and the gates' FILES lists
 *   6. the past wine list (codex60), over the same fixtures with three wines
 *      filed as past (a glass wine, a tasting pour and a floor bottle, each
 *      with its note on why it left) and a list file carrying two past
 *      groups: the past rule is the engine's own, with the same rule written
 *      out where the engine lacks it; past wines leave every deck, drill,
 *      weak list, progress line, header sentence and chip count; the door at
 *      the foot of Our List, its three groups and each read only card with
 *      the note first; the whole list's door at the top of Our List, its
 *      count read from the file; the full list's Past chip, its groups under
 *      the date each was last printed, its rows under the list's sections in
 *      the list's order, each row's id carrying its date, opening in place
 *      and to its card, the search and the chips on its rows; a list file
 *      with no past key and a pack with no past section drawing exactly as
 *      the chain without codex60 draws them; the layer's file and its place
 *      in the shell and in every gate's chain
 *
 *   node .scripts/check-winelist.js [jsDir]                every check above
 *   node .scripts/check-winelist.js [jsDir] --mutations    then seeds faults in a scratch copy, one at a time, each to
 *                                                          be caught by the check that names it
 *                                                          (WINELIST_MUTATION=word|word runs only those whose names
 *                                                          hold a word)
 *   OOT_SHARED=<dir holding oot-house.js>   default ../worldtable/static/shared
 *   WINELIST_GATES=<dir>                    another folder of gates for the chain rule (the mutations' scratch copy)
 *
 * Exits non-zero on any failure.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const os = require('os');
const cp = require('child_process');

const ARGS = process.argv.slice(2);
const MUTATIONS = ARGS.indexOf('--mutations') >= 0;
const JS = ARGS.find((a) => a.charAt(0) !== '-')
  || path.join(__dirname, '..', 'js');
const GATES = process.env.WINELIST_GATES || __dirname;
const ROOT = path.join(JS, '..');
const SHARED = process.env.OOT_SHARED
  || path.join(__dirname, '..', '..', 'worldtable', 'static', 'shared');
const ENGINE = path.join(SHARED, 'oot-house.js');
const UI_FILE = path.join(SHARED, 'oot-house-ui.js');
const PACK_FILE = path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
for (const f of [ENGINE, UI_FILE, PACK_FILE]) {
  if (!fs.existsSync(f)) {
    console.error('check-winelist: no ' + path.basename(f) + ' at ' + SHARED + ' (set OOT_SHARED)');
    process.exit(1);
  }
}
if (!fs.existsSync(path.join(JS, 'codex29.js'))) {
  console.log('check-winelist: no codex29.js in ' + JS + ', SKIPPED');
  process.exit(0);
}

const OPTIONAL = new Set(['codex13.js', 'data-firstpath.js', 'codex30.js']);
const FILES = ['data-questions.js', 'reference.js', 'core.js', 'codex2.js', 'codex3.js',
  'codex4.js', 'codex5.js', 'data-primers.js', 'codex6.js', 'data-intro.js',
  'data-primers-intro.js', 'data-grapes-plus.js', 'data-tasting.js', 'data-floor.js',
  'data-pairing.js', 'data-maps.js', 'data-advanced.js', 'data-primers-advanced.js',
  'data-master.js', 'data-primers-master.js', 'codex7.js', 'codex8.js', 'codex9.js',
  'codex10.js', 'codex11.js', 'codex12.js', 'data-firstpath.js', 'codex13.js', 'codex14.js',
  'codex15.js', 'data-producers.js', 'menu-desk.js', 'wine-rows.js', 'codex16.js',
  'codex17.js', 'codex18.js', 'codex19.js', 'codex20.js', 'codex21.js', 'codex22.js',
  'codex23.js', 'codex24.js', 'codex25.js', 'codex26.js', 'codex27.js', 'codex28.js', 'codex29.js', 'codex30.js', 'codex60.js', 'boot.js'];

const NOW = Date.parse('2026-10-04T14:02:00.000Z');
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

/* check-study's voice rule, word for word */
const NUMERAL_RE = /\bLevel\s+(I|II|III|IV)\b/;
function voiceProblems(s) {
  const out = [];
  if (s.indexOf(String.fromCharCode(0x2014)) >= 0) out.push('a long dash (U+2014)');
  if (s.indexOf(String.fromCharCode(0x2013)) >= 0) out.push('an en dash');
  if (/\x20-{2}\x20/.test(s)) out.push('a double hyphen');
  if (/practi[cs]e/i.test(s.replace(/(^|[^\w])Practise(?!\w)/g, '$1'))) out.push('the retired word for study'); /* the tab word Practise, that exact token, is the one use let through */
  if (NUMERAL_RE.test(s)) out.push('a level numeral');
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if ((c >= 0x2190 && c <= 0x2BFF) || (c >= 0x1F000) || c === 0xFE0F || (c >= 0xE000 && c <= 0xF8FF)) { out.push('a glyph U+' + c.toString(16).toUpperCase()); break; }
  }
  return out;
}

/* ---------- the fixtures ---------- */

const PACK = JSON.parse(fs.readFileSync(PACK_FILE, 'utf8'));
const HUSSARDE = (PACK.house.dishes.find((d) => /Hussarde/.test(d.name)) || PACK.house.dishes[0]).id;

/** The pack with three floor bottles, each with a bin, a size, kept lines and its coaching notes, and the Hussarde tiered over two of them. */
function bottledPack() {
  const p = JSON.parse(JSON.stringify(PACK));
  const h = p.house;
  /* The edition's own floor bottles and tiers come off first, so the counts below are this fixture's
     whatever the pack ships; every reference to a bottle taken off goes with it. */
  const own = new Set(h.wines.filter((w) => w.list === 'bottle').map((w) => w.id));
  h.wines = h.wines.filter((w) => !own.has(w.id));
  h.dishes.forEach((d) => { if (d.pairing && d.pairing.value) delete d.pairing.value.bottles; });
  h.lexicon.forEach((x) => { if (Array.isArray(x.itemIds)) x.itemIds = x.itemIds.filter((id) => !own.has(id)); });
  h.askAtLineup = h.askAtLineup.filter((a) => { a.itemIds = (a.itemIds || []).filter((id) => !own.has(id)); return a.itemIds.length > 0; });
  const base = h.wines.find((w) => w.lines && w.kept && w.kept.length) || h.wines[0];
  const stamp = base.ts;
  const mk = (id, producer, wine, vintage, price, bin, size, sec) => Object.assign(JSON.parse(JSON.stringify(base)), {
    id, producer, wine, vintage, name: producer + ' ' + wine + ' ' + vintage, section: sec, meals: ['Dinner'], price, prices: [{ meal: 'Bottle', printed: price }],
    glass: '', bottle: price, list: 'bottle', bin, size, region: 'Côte de Beaune, Burgundy, France', grapes: ['Pinot Noir'],
    lines: { value: { s10: producer + ' ' + wine + ': a red Burgundy bottle for the floor, bright and silky.', s20: '', s45: '' }, by: 'person', ts: stamp },
    firstPickIds: undefined
  });
  h.wines.push(
    mk('w-cxfloor1', 'Domaine Testa', 'Volnay', '2019', '$165', '41001', '750ml', 'Red Burgundy'),
    mk('w-cxfloor2', 'Domaine Testa', 'Pommard', '2015', '$310', '41002', '1.5L', 'Red Burgundy'),
    mk('w-cxfloor3', 'Maison Testa', 'Brut', 'NV', '$70', '41003', '750ml', 'Champagne bottles')
  );
  /* a bottle on the list with no lines: not a floor bottle, so no card */
  h.wines.push(Object.assign(JSON.parse(JSON.stringify(base)), { id: 'w-cxbare01', name: 'Bare Bottle NV', section: 'Red Burgundy', list: 'bottle', bin: '41004', size: '750ml', bottle: '$90', glass: '', lines: undefined, parts: undefined, kept: [] }));
  const d = h.dishes.find((x) => x.id === HUSSARDE);
  d.pairing.value.bottles = {
    classic: { wineId: 'w-cxfloor1', why: 'Silky red for the marchand de vin.', sayIt: 'Our sweet spot: a Volnay, silky and bright.' },
    splurge: { wineId: 'w-cxfloor2', why: 'A magnum for a celebrating table.', sayIt: 'For a celebration, a magnum of Pommard.' }
  };
  return JSON.stringify(p);
}

/** A list of 130 entries over three sections, every producer and place described, entry 7 a whole card. */
function fixtureList() {
  const sections = ['Champagne', 'France ~ Burgundy ~ Red', 'Half-bottles'];
  const entries = [];
  const producers = {};
  for (let i = 1; i <= 130; i++) {
    const sec = i <= 50 ? sections[0] : i <= 110 ? sections[1] : sections[2];
    const place = sec === sections[1] ? (i % 2 ? sec + ' ~ Volnay' : sec + ' ~ Meursault') : sec;
    const pk = 'p-' + (i % 13);
    producers[pk] = { name: 'Maison Number ' + (i % 13), region: sec === sections[0] ? 'Champagne' : 'Burgundy', country: 'France',
      line: 'A family house making the wines of its village since long ago.', tell: 'Say it is a family house. The wines are fresh and precise, and they suit the table.' };
    const price = i === 7 ? 165 : i < 40 ? 60 + i : i < 90 ? 120 + i : 260 + i;
    const size = sec === sections[2] ? '375ml' : i % 10 === 0 ? '1.5L' : '750ml';
    const row = [i, place, String(40000 + i), (sec === sections[0] ? 'Cuvee ' : 'Clos ') + 'Number ' + i + (i === 42 ? ' Pinot Noir' : ''), i % 3 ? '2019' : 'NV', price, size, pk, i === 3 ? 'cg' : i === 5 ? 'o' : ''];
    if (i === 9) row.push('PINOT NOIR');
    entries.push(row);
  }
  entries[6][2] = '41001'; entries[6][4] = '2019'; entries[6][6] = '750ml';
  /* entries 12 and 13 share a bin across vintages (a clash); 22 and 23 share one at one vintage and price (one bottle cross listed) */
  entries[12][2] = entries[11][2];
  entries[22][2] = entries[21][2]; entries[22][5] = entries[21][5];
  const places = {};
  sections.forEach((s) => { places[s] = { title: s.split(' ~ ').slice(-2).join(' '), line: 'What this part of the list holds, and how to steer a guest through it.' }; });
  places[sections[1] + ' ~ Volnay'] = { title: 'Volnay', line: 'Volnay is the silkiest village of the Côte de Beaune: lead with it for a guest who likes lighter reds.' };
  places[sections[1] + ' ~ Meursault'] = { title: 'Meursault', line: 'Meursault reds are rare; most of the village is white.' };
  return JSON.stringify({ format: 'oot-winelist', version: 1, house: 'brennans-new-orleans', readOn: '2026-10-03', source: 'fixture', sections, entries, producers, places, cards: { 7: 'w-cxfloor1' } });
}

/* ---------- the sandbox: check-study's ---------- */

function makeSandbox(opts) {
  const o = opts || {};
  const store = Object.create(null);
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
  const fetched = [];
  const sandbox = {
    console,
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
    navigator: { userAgent: 'node', onLine: true },
    setTimeout, clearTimeout, setInterval, clearInterval,
    matchMedia: () => ({ matches: false, addEventListener() { }, addListener() { } }),
    requestAnimationFrame: (f) => setTimeout(f, 0),
    alert() { }, confirm: () => false, prompt: () => null,
    scrollTo() { }, scrollBy() { }, getComputedStyle: () => ({ getPropertyValue: () => '' }),
    innerWidth: 390, innerHeight: 844, devicePixelRatio: 1, scrollY: 0,
    addEventListener(type, fn) { if (listeners[type]) listeners[type].push(fn); },
    removeEventListener() { },
    history: { pushState(s) { hist.pushed.push(s); }, replaceState(s, t, u) { hist.replaced.push({ s, u }); }, back() { hist.backs++; } },
    speechSynthesis: undefined, Notification: undefined, performance: { now: () => 0 },
    URL: globalThis.URL, Blob: globalThis.Blob, TextEncoder: globalThis.TextEncoder,
    Intl: globalThis.Intl, Date: globalThis.Date, Math: globalThis.Math, JSON: globalThis.JSON,
    Promise: globalThis.Promise, Map: globalThis.Map, Set: globalThis.Set,
  };
  sandbox.location = o.location || { href: 'http://localhost/codex/', pathname: '/codex/', search: '', hash: '' };
  sandbox.window = sandbox; sandbox.self = sandbox; sandbox.globalThis = sandbox;
  sandbox.document = {
    documentElement: stubEl(), head: stubEl(), body: stubEl(),
    createElement: stubEl, createDocumentFragment: stubEl, createTextNode: () => stubEl(),
    getElementById: stubEl, querySelector: stubEl, querySelectorAll: () => [],
    addEventListener() { }, removeEventListener() { }, readyState: 'complete', title: '',
    get activeElement() { return null; },
  };
  const ctx = vm.createContext(sandbox);
  const G = (expr) => vm.runInContext(expr, ctx);
  return { sandbox, ctx, G, listeners, hist, fetched };
}

function loadChain(H, withOOT, skip) {
  if (withOOT) {
    vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), H.ctx, { filename: 'oot-house.js' });
    vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), H.ctx, { filename: 'oot-house-ui.js' });
    const lib = H.G('OOT.houseLib');
    H.sandbox.OOT.house = lib.createHouseApi(lib.mapStorage(new Map()), { win: H.sandbox, now: () => NOW, rand: seeded(21), from: 'codex' });
  }
  for (const f of FILES) {
    if (skip && skip.indexOf(f) >= 0) continue;
    const p = path.join(JS, f);
    if (!fs.existsSync(p)) { if (OPTIONAL.has(f)) continue; console.error('missing ' + f + ' in ' + JS); process.exit(1); }
    try { vm.runInContext(fs.readFileSync(p, 'utf8'), H.ctx, { filename: f }); }
    catch (e) { console.error('FAILED to load ' + f + ': ' + e.message); process.exit(1); }
  }
}

/* a checked attribute inside a tag, or a checkbox: the pack's own prose may say "checked" */
const CHECKED = /<[^>]*\schecked[\s>=]|type="checkbox"/;
const tick = (ms) => new Promise((r) => setTimeout(r, ms || 10));
const PACK_TEXT = bottledPack();
const LIST_TEXT = fixtureList();

/* ---------- codex60's fixtures ---------- */

/* Three wines of the bottled pack filed as past, each with its note on why it left: a glass wine, a tasting pour (its
   own question, as the pours carry it) and the floor bottle Maison Testa Brut. PAST_SERVED is the same house with the
   three taken off, the house a chain without codex60 must draw as codex60 draws the house with them. */
const WHY_LIST = 'It was last printed on the list of 1 September 2026 and is not printed on the list of 28 November 2026. This card stays here to be read.';
const WHY_POUR = 'The dinner tasting no longer pours it. This card stays here to be read.';
function pastFixtures() {
  const p = JSON.parse(PACK_TEXT);
  const h = p.house;
  /* the edition's own past wines come off first, so the fixture's three are the only past wines whatever the pack ships */
  const own = new Set(h.wines.filter((w) => /^\s*Past /.test(w.section || '')).map((w) => w.id));
  h.wines = h.wines.filter((w) => !own.has(w.id));
  const glass = h.wines.filter((w) => w.list !== 'bottle' && w.lines && w.lines.value && w.lines.value.s10 && Array.isArray(w.kept) && w.kept.length);
  const one = glass[0], two = glass.find((w) => w.section !== one.section);
  const stamp = (one.kept[0] && one.kept[0].ts) || one.ts;
  one.section = 'Past wines by the glass';
  one.kept = one.kept.concat([{ q: 'Why did it leave the list?', a: WHY_LIST, ts: stamp + 1 }]);
  two.section = 'Past tasting pours';
  two.kept = two.kept.concat([{ q: 'Why did it leave the pairing?', a: WHY_POUR, ts: stamp + 1 }]);
  const t = h.wines.find((w) => w.id === 'w-cxfloor3');
  t.section = 'Past bottles';
  t.kept = (t.kept || []).concat([{ q: 'Why did it leave the list?', a: WHY_LIST, ts: stamp + 1 }]);
  /* the pack's own order: the past sections last, as the builder sorts them */
  const past = [one, two, t];
  h.wines = h.wines.filter((w) => past.indexOf(w) < 0).concat(past);
  const served = JSON.parse(JSON.stringify(p));
  served.house.wines = served.house.wines.filter((w) => !/^Past /.test(w.section));
  return { pack: JSON.stringify(p), served: JSON.stringify(served), ids: { glass: one.id, pour: two.id, bottle: t.id }, names: { glass: one.name, pour: two.name } };
}
const PAST = pastFixtures();

/* The fixture list with two past groups, newest first: the September group's rows written out of the list's order (a
   half bottle, a Champagne, a Volnay, a glass), n 3 in both groups, two rows printed at one bin (a past row is never
   rung, so it never says so), and two cards, one a wine the house holds. */
function pastList() {
  const l = JSON.parse(LIST_TEXT);
  l.past = [
    { lastPrinted: '2026-09-01', source: 'fixture, 1 September',
      entries: [
        [8, 'Half-bottles', '47008', 'Demi Number 8', '2018', 45, '375ml', 'p-8', ''],
        [3, 'Champagne', '41003', 'Maison Testa Brut', 'NV', 70, '750ml', 'p-3', ''],
        [5, 'France ~ Burgundy ~ Red ~ Volnay', '47005', 'Clos Ancien Volnay', '2012', 320, '1.5L', 'p-5', 'o'],
        [6, 'Champagne', '', 'Coupe Ancienne Brut', 'NV', 18, '750ml', 'p-6', 'g'],
        [9, 'France ~ Burgundy ~ Red ~ Meursault', '47008', 'Clos Fantome Meursault Rouge', '2016', 140, '750ml', 'p-9', '']
      ],
      cards: { 3: 'w-cxfloor3', 9: 'w-nowhere1' } },
    { lastPrinted: '2026-08-01', source: 'fixture, 1 August',
      entries: [[3, 'Champagne', '40903', 'Cuvee Oubliee Brut', 'NV', 66, '750ml', 'p-4', '']],
      cards: {} }
  ];
  return JSON.stringify(l);
}
const PAST_LIST_TEXT = pastList();

/* listMode: 'ok' answers the fixture, 'offline' rejects, '404' answers not found */
function bootDevice(listMode, opts) {
  const D = makeSandbox(opts);
  D.mode = listMode;
  D.sandbox.fetch = (url) => {
    D.fetched.push(String(url));
    if (/winelist/.test(String(url))) {
      if (D.mode === 'offline') return Promise.reject(new TypeError('Failed to fetch'));
      if (D.mode === '404') return Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error('no')) });
      const list = (opts && opts.list) || LIST_TEXT;
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(JSON.parse(list)), text: () => Promise.resolve(list) });
    }
    const pack = (opts && opts.pack) || PACK_TEXT;
    return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(pack), json: () => Promise.resolve(JSON.parse(pack)) });
  };
  loadChain(D, !(opts && opts.noOOT), opts && opts.no60 ? ['codex60.js'] : null);
  return D;
}
async function settle(D) {
  await D.G('typeof V27_LAST !== "undefined" ? V27_LAST : null');
  await D.G('typeof V27_BOOT_PACK !== "undefined" ? V27_BOOT_PACK : null');
  await tick(30);
  await D.G('typeof V27_WRITING !== "undefined" ? V27_WRITING : null');
  await tick(20);
}


/* ================================================================ */
/* codex60: the past wine list. Each check's words are the name its mutations look for. */
async function main60() {
  if (!fs.existsSync(path.join(JS, 'codex60.js'))) { section('the past wine list (codex60)'); check('codex60.js is in the tree', false); return; }
  const P = PAST.ids;
  const drawn = [];
  section('the past rule (codex60)');
  const A = bootDevice('ok', { pack: PAST.pack, list: PAST_LIST_TEXT });
  await settle(A);
  const B = bootDevice('ok', { pack: PAST.served, list: LIST_TEXT, no60: true });
  await settle(B);
  const GA = A.G, GB = B.G;
  const loadFetched = A.fetched.filter((u) => /winelist/.test(u)).length;
  const JA = (e) => JSON.parse(GA('JSON.stringify(' + e + ')'));
  const JB = (e) => JSON.parse(GB('JSON.stringify(' + e + ')'));
  check('the past house is current, its three past wines held whole', GA('v28House().wines.filter(function (w) { return /^Past /.test(w.section); }).length') === 3);
  const hadIsPast = GA('typeof OOT.houseLib.isPast === "function"');
  GA('var __v60ip = OOT.houseLib.isPast; OOT.houseLib.isPast = function (x) { return !!x && x.id === "w-cxfloor1"; }');
  check('the past rule is the engine\'s own: OOT.houseLib.isPast answers where the engine carries it',
    GA('v60IsPast({ id: "w-cxfloor1", section: "Red Burgundy" })') === true && GA('v60IsPast({ id: "w-x", section: "Past bottles" })') === false);
  GA('delete OOT.houseLib.isPast');
  check('and the same rule written out where it does not: a section that, trimmed, begins Past',
    GA('v60IsPast({ section: " Past bottles" })') === true && GA('v60IsPast({ section: "Past tasting pours" })') === true
    && GA('v60IsPast({ section: "Pasta and wine" })') === false && GA('v60IsPast({ section: "Bottles past" })') === false && GA('v60IsPast(null)') === false);
  GA(hadIsPast ? 'OOT.houseLib.isPast = __v60ip' : 'delete OOT.houseLib.isPast');

  section('past wines leave every deck, drill and count (codex60)');
  const scopes = ['{ keepMeal: false }', '{}', '{ section: "#bottles", keepMeal: false }', '{ section: "#bottles|Red Burgundy", keepMeal: false }'];
  const deckA = scopes.map((sc) => JA('v28DeckIds(' + sc + ')')), deckB = scopes.map((sc) => JB('v28DeckIds(' + sc + ')'));
  const pastIds = [P.glass, P.pour, P.bottle];
  check('past wines leave every deck: each scope deals what the house with its past wines taken off deals',
    deckA.every((d, i) => JSON.stringify(d) === JSON.stringify(deckB[i])) && deckA.every((d) => d.every((id) => pastIds.indexOf(id) < 0)) && deckA[0].length > 0 && deckA[2].length === 2,
    JSON.stringify(deckA.map((d) => d.length)) + ' against ' + JSON.stringify(deckB.map((d) => d.length)));
  check('a past section deals nothing, and a past wine named alone deals nothing',
    JA('v28DeckIds({ section: "Past wines by the glass" })').length === 0 && JA('v28DeckIds({ section: "#bottles|Past bottles", keepMeal: false })').length === 0
    && JA('v28DeckIds({ itemIds: ' + JSON.stringify(pastIds) + ' })').length === 0);
  check('the drill of a past section deals no question', JA('v28DrillQs("Past wines by the glass").length') === 0 && JA('v28DrillQs("Past tasting pours").length') === 0);
  GA('ST.q = ST.q || {}; ST.q["h-' + P.glass + '-fixture"] = { c: 0, w: 2, s: 0 }; ST.q["h-' + deckA[0][0] + '-fixture"] = { c: 0, w: 1, s: 0 };');
  const progA = JA('v28Progress(v28DeckIds({ keepMeal: false }))');
  check('the weak list and the progress line count served wines only', progA.again === 1 && progA.againIds.length === 1 && progA.againIds[0] === deckA[0][0] && progA.total === deckA[0].length, JSON.stringify(progA));
  GA('delete ST.q["h-' + P.glass + '-fixture"]; delete ST.q["h-' + deckA[0][0] + '-fixture"];');
  GA('S.view = "cellar"; S._v28 = null;'); GB('S.view = "cellar"; S._v28 = null;');
  const studyA = GA('v28StudyHtml()'), studyB = GB('v28StudyHtml()');
  drawn.push(studyA);
  const lede = (h) => (h.match(/<p class="v28-lede">[^<]*<\/p>/) || [''])[0];
  const chips = (h) => (h.match(/<div class="v28-chips" role="group" aria-label="Sections of the list">[\s\S]*?<\/div>/) || [''])[0];
  check('the header sentence counts glasses, menu bottles and the floor\'s bottles served only', lede(studyA) !== '' && lede(studyA) === lede(studyB), lede(studyA) + ' against ' + lede(studyB));
  check('the chips count served wines only, and no past section has a chip', chips(studyA) !== '' && chips(studyA) === chips(studyB) && chips(studyA).indexOf('Past ') < 0, chips(studyA) + ' AGAINST ' + chips(studyB));
  check('the floor chip counts served bottles only', /data-s="#bottles" aria-pressed="false">The floor(&#39;|')s bottles \(3\)</.test(studyA));

  section('the past wine list on Our List (codex60)');
  const closed = (studyA.match(/<details class="v28-q v60-past" id="v60-past">[\s\S]*?<\/details>/) || [''])[0];
  check('the door, closed, draws no row: the list\'s own rows are Our List\'s only rows until it is opened', closed !== '' && closed.indexOf('v28-row') < 0 && /<div class="v60-pastbody"><\/div>/.test(closed));
  GA('V60_STATE.pastOpen = true');
  const studyOpen = GA('v28StudyHtml()');
  drawn.push(studyOpen);
  const door = (studyOpen.match(/<details class="v28-q v60-past" id="v60-past" open>[\s\S]*?<\/details>/) || [''])[0];
  GA('V60_STATE.pastOpen = false');
  const heads = (door.match(/<h3 class="secgroup">[^<]*<\/h3>/g) || []).map((x) => x.replace(/<[^>]+>/g, ''));
  GA('S._v28.sec = "#bottles"'); const floorA = GA('v28StudyHtml()'); GA('S._v28.sec = ""; S._v28.q = "volnay"'); const searchA = GA('v28StudyHtml()'); GA('S._v28.q = ""');
  check('one door at the foot of Our List, Past wine list, after the carded wines, drawn on the whole list and not while a chip or a search narrows it',
    door !== '' && studyOpen.indexOf(door) > studyOpen.indexOf('id="v28-rows"') && /<summary>Past wine list \(3\)<\/summary>/.test(door) && floorA.indexOf('v60-past') < 0 && searchA.indexOf('v60-past') < 0);
  check('its groups the past sections in the house\'s order, each row opening its card',
    JSON.stringify(heads) === JSON.stringify(['Past wines by the glass · 1', 'Past tasting pours · 1', 'Past bottles · 1'])
    && pastIds.every((id) => door.indexOf('data-v28="open" data-id="' + id + '"') > 0) && (door.match(/data-v28="open"/g) || []).length === 3, JSON.stringify(heads));
  GA('var __q60 = V28_QUOTE; V28_QUOTE = function () { return ""; }');
  const cardG = GA('v28CardHtml(' + JSON.stringify(P.glass) + ')'), cardB = GA('v28CardHtml(' + JSON.stringify(P.bottle) + ')'), cardP = GA('v28CardHtml(' + JSON.stringify(P.pour) + ')');
  GA('V28_QUOTE = __q60');
  drawn.push(cardG, cardB, cardP);
  const afterName = (html) => { const i = html.indexOf('</h2>'); let rest = i >= 0 ? html.slice(i + 5) : ''; if (rest.indexOf('<p class="v29-binline">') === 0) rest = rest.slice(rest.indexOf('</p>') + 4); return rest; };
  check('a past card draws whole, the note on why it left first under its name',
    cardG !== '' && cardB !== '' && cardP !== ''
    && /^<p class="v60-pasttag">No longer on the list: kept to be read, never dealt\.<\/p><section class="v28-block v60-why"><h3 class="secgroup">Why did it leave the list\?<\/h3>/.test(afterName(cardG))
    && afterName(cardG).indexOf(WHY_LIST) > 0 && afterName(cardG).indexOf(WHY_LIST) < 700
    && /<section class="v28-block v60-why"><h3 class="secgroup">Why did it leave the list\?<\/h3>/.test(afterName(cardB).slice(0, 400))
    && /<section class="v28-block v60-why"><h3 class="secgroup">Why did it leave the pairing\?<\/h3>/.test(afterName(cardP).slice(0, 400)),
    afterName(cardG).slice(0, 200));
  check('and the note is drawn once', cardG.split(WHY_LIST).length === 2 && cardB.split(WHY_LIST).length === 2 && cardP.split(WHY_POUR).length === 2);
  check('a past card is read only: no Flash cards, no Say the pour, no drill, no edit', [cardG, cardB, cardP].every((c) => !/data-v28="(cardsone|say|drillsec|drill|edit)"/.test(c)));
  const opens = (c) => (c.match(/data-v28="open" data-id="w-[a-z0-9]+" data-step="1"/g) || []).map((x) => x.replace(/.*data-id="/, '').replace(/" data-step="1"$/, ''));
  check('a past card\'s neighbours are its own section\'s', [cardG, cardB, cardP].every((c) => opens(c).every((id) => pastIds.indexOf(id) >= 0)) && /1 of 1 in Past wines by the glass/.test(cardG), JSON.stringify([opens(cardG), opens(cardB)]));
  GB('var __q60 = V28_QUOTE; V28_QUOTE = function () { return ""; }'); GA('var __q60 = V28_QUOTE; V28_QUOTE = function () { return ""; }');
  check('a served card draws as the chain without codex60 draws it', GA('v28CardHtml("w-cxfloor1")') === GB('v28CardHtml("w-cxfloor1")') && GA('v28CardHtml(' + JSON.stringify(deckA[0][1]) + ')') === GB('v28CardHtml(' + JSON.stringify(deckA[0][1]) + ')'));
  GA('V28_QUOTE = __q60'); GB('V28_QUOTE = __q60');
  GA('v28Open(' + JSON.stringify(P.bottle) + ')');
  check('a past row opened keeps the door open for the way back', GA('S._v28.open') === P.bottle && /<details class="v28-q v60-past" id="v60-past" open>/.test((GA('S._v28.open = null'), GA('v28StudyHtml()'))));
  GA('V60_STATE.pastOpen = false');

  section('the whole list, one tap from the room (codex60)');
  check('nothing was fetched for the full list at load', loadFetched === 0);
  const wholeAt = studyA.indexOf('<div class="v60-whole">');
  check('the whole list door at the top of Our List, plain before the list is read',
    wholeAt > 0 && wholeAt < studyA.indexOf('<div class="v28-progrow"') && /<div class="v60-whole"><button type="button" class="btn v60-wholebtn" data-v28="fulllist"><span class="v60-wholename" data-v60-whole="1">The whole list<\/span>/.test(studyA));
  GA('v28StudyView()'); GA('v28StudyView()');
  await GA('V29_LIST.promise'); await tick(10);
  check('drawing Our List reads the list once, in the background', A.fetched.filter((u) => /winelist/.test(u)).length === 1 && GA('V29_LIST.status') === 'ready');
  check('and the door says the size read from the file', /data-v60-whole="1">The whole list \(130 bottles\)</.test(GA('v28StudyHtml()')));
  GA('v28Act("fulllist", null)');
  check('the door opens the full list', GA('S.view') === 'fulllist');

  section('the past of the full list (codex60)');
  const viewA = GA('v29ViewHtml()');
  drawn.push(viewA);
  check('the Past chip is drawn when the file carries past groups, counting their rows, after the list\'s sections',
    /data-v29="sec" data-v="Half-bottles" aria-pressed="false">Half-bottles 20<\/button><button type="button" class="v28-chip v60-pastchip" data-v29="past" aria-pressed="false">Past \(6\)<\/button><\/div>/.test(viewA));
  const pressA = (act, attrs) => GA('v29Act(' + JSON.stringify(act) + ', { getAttribute: function (k) { var a = ' + JSON.stringify(attrs || {}) + '; return a[k] || ""; }, setAttribute: function () { } }, document)');
  pressA('past');
  const pres = GA('v29ResultsHtml(v29State())');
  drawn.push(pres);
  const printed = (pres.match(/<h3 class="secgroup v60-printed">[^<]*<\/h3>/g) || []).map((x) => x.replace(/<[^>]+>/g, ''));
  check('pressed, each group under the date it was last printed, newest first', GA('v29State().past') === true && JSON.stringify(printed) === JSON.stringify(['Last printed 1 September 2026', 'Last printed 1 August 2026']), JSON.stringify(printed));
  const g1 = pres.slice(0, pres.indexOf('Last printed 1 August'));
  const secs = (g1.match(/<h4 class="v60-sechead">[^<]*<\/h4>/g) || []).map((x) => x.replace(/<[^>]+>/g, ''));
  check('its rows under the list\'s sections in the list\'s order', JSON.stringify(secs) === JSON.stringify(['Champagne · 2', 'Burgundy Red · 2', 'Half-bottles · 1']), JSON.stringify(secs));
  check('each row with its name, vintage, size, bin and last price',
    /<span class="v29-bin">Bin 47005<\/span> Clos Ancien Volnay 2012<\/span><span class="lvltag v28-price">last \$320<\/span><\/span><span class="v28-short">1\.5L, magnum · Volnay<\/span>/.test(pres)
    && /<span class="v29-bin">Bin 41003<\/span> Maison Testa Brut NV<\/span><span class="lvltag v28-price">last \$70<\/span><\/span><span class="v28-short">750ml · Champagne<\/span>/.test(pres)
    && /Coupe Ancienne Brut NV<\/span><span class="lvltag v28-price">last \$18 a glass<\/span>/.test(pres));
  check('a past row\'s element id carries its group\'s date', /data-v29="prow" data-g="2026-09-01" data-n="3" aria-expanded="false" aria-controls="v60-d2026-09-01-3"/.test(pres)
    && /aria-controls="v60-d2026-08-01-3"/.test(pres) && /<div class="v29-detail" id="v60-d2026-09-01-3" hidden>/.test(pres) && !/id="v29-d/.test(pres));
  check('the count says how many past rows match', GA('v29Filtered(v29State()).length') === 6);
  pressA('prow', { 'data-g': '2026-09-01', 'data-n': '5' });
  const openRes = GA('v29ResultsHtml(v29State())');
  const det5 = (openRes.match(/<div class="v29-detail" id="v60-d2026-09-01-5">[\s\S]*?(?=<button type="button" class="v28-row|$)/) || [''])[0];
  drawn.push(det5);
  check('a past row opens in place to the producer\'s line and tell and the section\'s line',
    GA('v29State().open') === '2026-09-01-5' && /The producer/.test(det5) && /Maison Number 5/.test(det5) && /A family house making the wines/.test(det5) && /Say it is a family house/.test(det5)
    && /This part of the list/.test(det5) && /Volnay is the silkiest village/.test(det5) && /organic/.test(det5));
  const det3 = GA('v29DetailHtml(V60_PAST.rows.filter(function (r) { return r.key === "2026-09-01-3"; })[0])');
  const det9 = GA('v29DetailHtml(V60_PAST.rows.filter(function (r) { return r.key === "2026-09-01-9"; })[0])');
  check('and to Open the full card where the group\'s cards names a wine the house holds', /data-v29="card" data-id="w-cxfloor3">Open the full card</.test(det3) && !/data-v29="card"/.test(det9));
  check('a past row never says a bin is shared', !/v29-binshared/.test(det3) && !/v29-binshared/.test(det9));
  GA('v29State().q = "testa"');
  check('the search works on past rows while the chip is pressed', GA('v29Filtered(v29State()).map(function (r) { return r.key; }).join(",")') === '2026-09-01-3');
  GA('v29State().q = ""');
  pressA('band', { 'data-v': 'high' });
  check('the price chips work on past rows', GA('v29Filtered(v29State()).map(function (r) { return r.key; }).join(",")') === '2026-09-01-5');
  pressA('band', { 'data-v': '' }); pressA('size', { 'data-v': 'half' });
  check('the size chips work on past rows', GA('v29Filtered(v29State()).map(function (r) { return r.key; }).join(",")') === '2026-09-01-8');
  pressA('size', { 'data-v': 'large' });
  const large = GA('v29Filtered(v29State()).map(function (r) { return r.key; }).join(",")');
  pressA('size', { 'data-v': '' });
  check('and magnum and up', large === '2026-09-01-5');
  pressA('past');
  check('unpressed, the live list is back', GA('v29State().past') === false && GA('v29Filtered(v29State()).length') === 130 && (GA('v29ResultsHtml(v29State())').match(/data-v29="row"/g) || []).length === 40);
  pressA('past');
  GA('v29Act("card", { getAttribute: function (k) { return k === "data-id" ? "w-cxfloor3" : ""; } }, document)');
  check('Open the full card from a past row opens the past card', GA('S.view') === 'cellar' && GA('S._v28.open') === 'w-cxfloor3' && /v60-why/.test(GA('v28CardHtml("w-cxfloor3")')));

  section('a list with no past and a house with no past draw as before (codex60)');
  const C = bootDevice('ok', { pack: PAST.served });
  await settle(C);
  const N = bootDevice('ok', { pack: PAST.served, no60: true });
  await settle(N);
  C.G('v29Open("cellar")'); N.G('v29Open("cellar")');
  await C.G('V29_LIST.promise'); await N.G('V29_LIST.promise'); await tick(10);
  const same = (e) => C.G(e) === N.G(e);
  const pressBoth = (act, v) => [C, N].forEach((X) => X.G('v29Act(' + JSON.stringify(act) + ', { getAttribute: function (k) { return k === "data-v" ? ' + JSON.stringify(v) + ' : k === "data-n" ? ' + JSON.stringify(String(v)) + ' : ""; }, setAttribute: function () { } }, document)'));
  const plainView = same('v29ViewHtml()');
  pressBoth('band', 'high');
  const plainBand = same('v29ResultsHtml(v29State())');
  pressBoth('band', ''); pressBoth('row', 7);
  check('a list file with no past key draws exactly as before: no Past chip, the same view, chips, rows and details',
    plainView && plainBand && same('v29ResultsHtml(v29State())') && same('v29DetailHtml(V29_LIST.rows[6])') && C.G('v29ViewHtml()').indexOf('data-v29="past"') < 0);
  C.G('S.view = "cellar"; S._v28 = null;'); N.G('S.view = "cellar"; S._v28 = null;');
  const noDoor = (h) => h.replace(/<div class="v60-whole">[\s\S]*?<\/button><\/div>/, '');
  const sc = C.G('v28StudyHtml()'), sn = N.G('v28StudyHtml()');
  check('a pack with no past section draws exactly as before, save the whole list door', sc !== sn && noDoor(sc) === sn && sc.indexOf('v60-past') < 0
    && scopes.every((x) => same('JSON.stringify(v28DeckIds(' + x + '))')) && same('v28ListSentence(v28House(), [])') && same('v28CardHtml("w-cxfloor2")'));

  const probs = [];
  drawn.forEach((html) => {
    const text = html.replace(/<[^>]+>/g, ' ');
    voiceProblems(text).forEach((pr) => probs.push(pr));
  });
  check('every string codex60 draws passes the voice rule', !probs.length, probs.join(', '));
  check('no checked attribute, no allergen box where codex60 draws', !drawn.some((h) => CHECKED.test(h)));
}

async function main() {
  const drawn = [];

  /* ================================================================ */
  section('the floor\'s bottles');
  const D = bootDevice('ok');
  await settle(D);
  const G = D.G;
  check('the bottled house is current, its three floor bottles and one bare bottle on the list', G('v28Wines(v28House()).filter(v28IsBottle).length') === 4);
  check('nothing was fetched for the full list at load', !D.fetched.some((u) => /winelist/.test(u)), JSON.stringify(D.fetched));
  check('a floor bottle has a flash card whose back names its bin and size', /^Bin 41002 · \$310 · 1\.5L$/.test(G('v28CardOf(v28Find(v28House().wines, "w-cxfloor2"), v28House()).back.price')),
    G('JSON.stringify(v28CardOf(v28Find(v28House().wines, "w-cxfloor2"), v28House()))'));
  check('and the dishes it is offered with on that back', /Eggs Hussarde \(celebration\)/.test(G('JSON.stringify(v28CardOf(v28Find(v28House().wines, "w-cxfloor2"), v28House()).back.pairs)')));
  check('a bottle with no lines has no card', G('v28CardOf(v28Find(v28House().wines, "w-cxbare01"), v28House())') === null);
  const glassDeck = JSON.parse(G('JSON.stringify(v28DeckIds({}))'));
  check('the glass list\'s deck deals no bottle', glassDeck.length > 0 && glassDeck.every((id) => !/^w-cx/.test(id)));
  check('the floor scope deals the three floor bottles', G('JSON.stringify(v28DeckIds({ section: "#bottles", keepMeal: false }).sort())') === JSON.stringify(['w-cxfloor1', 'w-cxfloor2', 'w-cxfloor3']));
  check('a floor section deals its own', G('JSON.stringify(v28DeckIds({ section: "#bottles|Red Burgundy", keepMeal: false }).sort())') === JSON.stringify(['w-cxfloor1', 'w-cxfloor2']));
  check('one bottle\'s deck deals that bottle', G('JSON.stringify(v28DeckIds({ itemIds: ["w-cxfloor3"] }))') === JSON.stringify(['w-cxfloor3']));
  G('startHouseDeck({ section: "#bottles|Red Burgundy", keepMeal: false })');
  check('a floor section\'s deck says its section in words', G('S._v28deck && S._v28deck.label') === 'Red Burgundy');
  G('v28DeckClose()');
  G('S.view = "cellar"; S._v28 = null;');
  const study = G('v28StudyHtml()');
  drawn.push(study);
  check('the header counts the floor\'s bottles on their own', /The floor&#39;s bottles: 4 from the full bottle list, each with a card\.|The floor's bottles: 4 from the full bottle list, each with a card\./.test(study), (study.match(/<p class="v28-lede">[^<]*/) || [''])[0]);
  check('and points at The full list', /The whole bottle list is in The full list\./.test(study) && /data-v28="fulllist">The full list</.test(study));
  check('the floor chip counts the floor\'s bottles', /data-s="#bottles" aria-pressed="false">The floor(&#39;|')s bottles \(4\)</.test(study));
  G('S._v28.sec = "#bottles"');
  const floorStudy = G('v28StudyHtml()');
  drawn.push(floorStudy);
  check('pressed, it shows the bottles and a row of floor section chips', (floorStudy.match(/class="v28-row" data-v28="open"/g) || []).length === 4
    && /class="v28-chips v29-floorchips"/.test(floorStudy) && /data-s="#bottles\|Red Burgundy" aria-pressed="false">Red Burgundy 3</.test(floorStudy) && /data-s="#bottles\|Champagne bottles" aria-pressed="false">Champagne bottles 1</.test(floorStudy));
  check('a floor bottle\'s row carries its bin', /<span class="v29-bin">Bin 41001<\/span> Domaine Testa Volnay 2019/.test(floorStudy));
  check('a floor section head offers its own flash cards', /data-v28="cards" data-s="#bottles\|Red Burgundy"/.test(floorStudy));
  G('S._v28.sec = "#bottles|Red Burgundy"');
  const secStudy = G('v28StudyHtml()');
  check('a floor section chip narrows to that section, the floor chip still pressed', (secStudy.match(/class="v28-row" data-v28="open"/g) || []).length === 3
    && /data-s="#bottles" aria-pressed="true">The floor/.test(secStudy) && /data-s="#bottles\|Red Burgundy" aria-pressed="true"/.test(secStudy));
  G('S._v28.sec = ""; S._v28.q = "41003"');
  check('the list\'s search finds a bottle by its bin', (G('v28StudyHtml()').match(/class="v28-row" data-v28="open"/g) || []).length === 1);
  G('S._v28.q = ""');
  /* the Codex's own reference text the card quotes (a grape's structure line) is held by its own sweep, as check-study holds it out */
  G('var __q = V28_QUOTE; V28_QUOTE = function () { return ""; }');
  const card = G('v28CardHtml("w-cxfloor1")');
  G('V28_QUOTE = __q');
  drawn.push(card);
  check('the card shows Bin N and the size under the name', /<\/h2><p class="v29-binline"><span class="lvltag v29-bintag">Bin 41001<\/span><span class="v29-size">750ml<\/span><\/p>/.test(card));
  check('and Bin and Size among the wine\'s facts', /<dt>Bin<\/dt><dd>41001<\/dd><dt>Size<\/dt><dd>750ml<\/dd>/.test(card));
  check('and the dishes it is offered with, by tier, with the line to say', /By the bottle with/.test(card) && /Sweet spot:<\/span> (<a class="v28-link" href="\/table\/menu#d-[a-z0-9]{8}">)?Eggs Hussarde/.test(card) && /Our sweet spot: a Volnay, silky and bright\./.test(card));
  check('and the whole coaching block, not the line to confirm', /How do I sell it\?/.test(card) && card.indexOf('Confirm with the sommelier that it is on the list tonight.') < 0);
  check('and Flash cards for this', /data-v28="cardsone" data-id="w-cxfloor1">Flash cards for this</.test(card));
  check('no checked attribute, no allergen box', !CHECKED.test(card + study + floorStudy));

  /* ================================================================ */
  section('the full list');
  check('the Mine row shows for a house that ships a list, and resolves through V25_GO', G('V25_MINE.some(function (r) { return r.key === "fulllist" && r.show(); })') === true && G('typeof V25_GO.fulllist') === 'function');
  check('the list file sits beside the pack', G('v29ListUrl(v28House())') === '../shared/packs/brennans-new-orleans.winelist.v1.json');
  const pushed0 = D.hist.pushed.length;
  G('v28Act("fulllist", null)');
  check('Our List\'s door opens the view and pushes one entry', G('S.view') === 'fulllist' && D.hist.pushed.length === pushed0 + 1 && D.hist.pushed[pushed0].v29 === 'list');
  check('opening it fetches the list, once', D.fetched.filter((u) => /winelist/.test(u)).length === 1);
  check('while it reads, it says so', /Opening the full list/.test(G('v29ViewHtml()')) || G('V29_LIST.status') === 'ready');
  await G('V29_LIST.promise'); await tick(10);
  check('read and indexed once: 130 rows, three sections', G('V29_LIST.status') === 'ready' && G('V29_LIST.rows.length') === 130 && G('V29_LIST.sections.length') === 3);
  const view = G('v29ViewHtml()');
  drawn.push(view);
  check('the first page holds 40 rows and Show 40 more', (view.match(/data-v29="row"/g) || []).length === 40 && /data-v29="more">Show 40 more</.test(view));
  check('the count says how many match and how many are shown', /130 bottles match\. Showing 40 of 130\./.test(view));
  check('the search box is labelled', /<label class="sr-only" for="v29-q">Search by name, producer, grape, region or bin<\/label>/.test(view));
  check('chips for the sections, the price bands and the sizes, each with aria-pressed', /data-v29="sec" data-v="" aria-pressed="true">Every section 130</.test(view)
    && /data-v29="band" data-v="low" aria-pressed="false">Under \$100</.test(view) && /data-v29="band" data-v="mid" aria-pressed="false">\$100 to \$250</.test(view)
    && /data-v29="band" data-v="high" aria-pressed="false">Over \$250</.test(view) && /data-v29="size" data-v="half" aria-pressed="false">Half-bottles</.test(view)
    && /data-v29="size" data-v="large" aria-pressed="false">Magnum and up</.test(view));
  check('a row shows its bin, name, vintage and price', /<span class="v29-bin">Bin 40002<\/span> Cuvee Number 2 2019<\/span><span class="lvltag v28-price">\$62<\/span>/.test(view));
  check('a by the glass price says so', /\$63 a glass/.test(view));
  const press = (act, v) => G('v29Act(' + JSON.stringify(act) + ', { getAttribute: function (k) { return k === "data-v" ? ' + JSON.stringify(v) + ' : k === "data-n" ? ' + JSON.stringify(String(v)) + ' : ""; }, setAttribute: function () { } }, document)');
  const rowsNow = () => (G('v29ResultsHtml(v29State())').match(/data-v29="row"/g) || []).length;
  press('more', '');
  check('Show 40 more shows 80', rowsNow() === 80 && G('v29State().shown') === 80);
  press('more', ''); press('more', '');
  check('and the last page ends without the button', rowsNow() === 130 && !/data-v29="more"/.test(G('v29ResultsHtml(v29State())')));
  press('sec', 'France ~ Burgundy ~ Red');
  check('a section chip narrows to it and pages afresh', G('v29Filtered(v29State()).length') === 60 && rowsNow() === 40);
  press('band', 'high');
  check('the price band narrows within it (over $250)', G('v29Filtered(v29State()).length') === 21 && G('v29Filtered(v29State()).every(function (r) { return r.price > 250; })') === true, String(G('v29Filtered(v29State()).length')));
  press('band', 'low'); press('sec', '');
  check('under $100 never counts a by the glass price', G('v29Filtered(v29State()).every(function (r) { return !r.glass && r.price < 100; })') === true && G('v29Filtered(v29State()).length') === 37);
  press('band', ''); press('size', 'half');
  check('half bottles are the 375ml ones', G('v29Filtered(v29State()).length') === 20);
  press('size', 'large');
  check('magnum and up are 1.5L and larger', G('v29Filtered(v29State()).length') === 11);
  press('size', '');
  const search = (q) => { G('v29State().q = ' + JSON.stringify(q)); return G('v29Filtered(v29State()).map(function (r) { return r.n; }).join(",")'); };
  check('the search finds by bin', search('40017') === '17');
  check('by name', search('number 42') === '42');
  const p12 = G('V29_LIST.rows.filter(function (r) { return r.pk === "p-12"; }).map(function (r) { return String(r.n); }).join(",")').split(',');
  check('by producer', p12.length === 10 && p12.every((n) => search('maison number 12').split(',').indexOf(n) >= 0));
  check('by grape, printed or in the name', search('pinot noir') === '9,42');
  check('by region and place', search('volnay').split(',').length === 30);
  search('volnay 2019 clos');
  check('every word must match', G('v29Filtered(v29State()).length') > 0 && G('v29Filtered(v29State()).every(function (r) { return r.hay.indexOf(" volnay ") >= 0 && r.hay.indexOf(" 2019 ") >= 0 && r.hay.indexOf(" clos ") >= 0; })') === true);
  search('');
  press('row', 7);
  check('a row opens in place', G('v29State().open') === 7);
  const detail = G('v29DetailHtml(V29_LIST.rows[6])');
  drawn.push(detail);
  check('to its producer\'s line and tell', /The producer/.test(detail) && /Maison Number 7/.test(detail) && /A family house making the wines/.test(detail) && /Say it is a family house/.test(detail));
  const volnay = G('v29DetailHtml(V29_LIST.rows[50])');
  drawn.push(volnay);
  check('and its section\'s line, its own place first, then the section\'s', /This part of the list/.test(detail) && /What this part of the list holds/.test(detail)
    && /Volnay is the silkiest village/.test(volnay) && /What this part of the list holds/.test(volnay));
  check('and Open the full card for a floor bottle', /data-v29="card" data-id="w-cxfloor1">Open the full card</.test(detail));
  const plainDetail = G('v29DetailHtml(V29_LIST.rows[1])');
  check('a bottle with no card offers none', !/Open the full card/.test(plainDetail));
  check('the grape it names links the grape cards where the Codex holds the profile', /data-v29="grape" data-g="Pinot Noir">Open Pinot Noir in the grape cards</.test(G('v29DetailHtml(V29_LIST.rows[8])')));
  const clash = G('v29DetailHtml(V29_LIST.rows[11])');
  drawn.push(clash);
  check('a bin the list prints for another bottle says so, naming it, and says to ring by name and vintage', /The list prints Bin 40012 for another bottle too: Cuvee Number 13 2019, \$73\. Ring it by name and vintage, never by the bin alone\./.test(clash));
  check('a bin printed twice for one vintage at one price is one bottle and says nothing', !/v29-binshared/.test(G('v29DetailHtml(V29_LIST.rows[21])')) && !/v29-binshared/.test(G('v29DetailHtml(V29_LIST.rows[22])')));
  check('a bin of its own says nothing', !/v29-binshared/.test(plainDetail));
  check('a Coravin and organic bottle says so', /by Coravin/.test(G('v29DetailHtml(V29_LIST.rows[2])')) && /organic/.test(G('v29DetailHtml(V29_LIST.rows[4])')));
  G('v29Act("card", { getAttribute: function (k) { return k === "data-id" ? "w-cxfloor1" : ""; } }, document)');
  check('Open the full card opens the floor bottle\'s card in Our List', G('S.view') === 'cellar' && G('S._v28.open') === 'w-cxfloor1');
  D.listeners.popstate.forEach((fn) => fn({ state: { v29: 'list' } }));
  check('and back comes to the full list with its place kept', G('S.view') === 'fulllist' && G('v29State().open') === 7);
  D.listeners.popstate.forEach((fn) => fn({ state: null }));
  check('back once more leaves for Our List', G('S.view') === 'cellar');
  check('no checked attribute, no allergen box in the view', !CHECKED.test(view + detail));
  const probs = [];
  drawn.concat([G('v29ViewHtml()')]).forEach((html) => {
    const text = html.replace(/<[^>]+>/g, ' ');
    voiceProblems(text).forEach((p) => probs.push(p + ' near ' + JSON.stringify(text.slice(Math.max(0, text.search(/[\u2013\u2014]/) - 40), text.search(/[\u2013\u2014]/) + 20))));
  });
  check('every string drawn passes the voice rule', !probs.length, probs.join(', '));

  /* ================================================================ */
  section('offline, a house with no list, no OOT');
  const off = bootDevice('offline');
  await settle(off);
  off.G('v29Open("mine")');
  await off.G('V29_LIST.promise'); await tick(10);
  const offHtml = off.G('v29ViewHtml()');
  check('offline before the first visit it says plainly it cannot open', off.G('V29_LIST.status') === 'failed' && /cannot be opened right now\. It needs the network the first time; after one visit it stays on this device\./.test(offHtml));
  check('and offers Try again, and the way back to Mine', /data-v29="retry">Try again</.test(offHtml) && /data-v29="back">Back to Mine</.test(offHtml));
  off.mode = 'ok';
  off.G('v29Act("retry", null, document)');
  await off.G('V29_LIST.promise'); await tick(10);
  check('Try again reads it once the network is back', off.G('V29_LIST.status') === 'ready');
  const none = bootDevice('404');
  await settle(none);
  none.G('v29Open("cellar")');
  await none.G('V29_LIST.promise'); await tick(10);
  check('a house that ships no list says so', /This house has no full list yet\./.test(none.G('v29ViewHtml()')));
  const bare = bootDevice('ok', { noOOT: true });
  await tick(20);
  check('with no OOT: no house, no door on Mine, no list fetched', bare.G('v29ListUrl(v28House())') === '' && bare.G('V25_MINE.some(function (r) { return r.key === "fulllist" && r.show(); })') === false && !bare.fetched.some((u) => /winelist/.test(u)),
    bare.G('v29ListUrl(v28House())') + ' ' + JSON.stringify(bare.fetched));

  await main60();

  /* ================================================================ */
  section('the worker, the shell and the gates');
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const shell = (sw.match(/const CACHE = '((?:oot-)?codex-v\d+)';/) || [])[1];
  let listSurvives = false;
  if (shell && /const LIST = 'codexlist-v1';/.test(sw)) {
    const prefix = shell.startsWith('oot-') ? 'oot-codex-' : 'codex-';
    const otherPrefix = prefix === 'codex-' ? 'oot-codex-' : 'codex-';
    const oldShell = prefix + 'v0', removed = [], handlers = {};
    const location = new URL('https://example.test/' + (prefix === 'codex-' ? 'SommeliersCodex/' : 'codex/') + 'sw.js');
    const kept = [shell, oldShell, otherPrefix + 'v0', 'codexlist-v1', 'codexmaps-v2-fixture'];
    const worker = vm.createContext({ URL, location,
      self: { location, addEventListener(type, fn) { handlers[type] = fn; }, clients: { claim() { return Promise.resolve(); } } },
      caches: { keys() { return Promise.resolve(kept.slice()); }, delete(name) { removed.push(name); return Promise.resolve(true); } }
    });
    /* the worker imports the teaching images' cache layer; run it in the same scope, as a worker would */
    worker.importScripts = (...files) => files.forEach((file) => vm.runInContext(fs.readFileSync(path.join(ROOT, file.split('?')[0]), 'utf8'), worker));
    vm.runInContext(sw, worker, { filename: 'sw.js' });
    let activation;
    if (handlers.activate) handlers.activate({ waitUntil(promise) { activation = promise; } });
    await activation;
    listSurvives = removed.length === 1 && removed[0] === oldShell;
  }
  check('sw.js activation reaps only its own old shell, preserving codexlist-v1, maps and the other installation', listSurvives);
  check('network first: the fetch is tried before the kept copy', /LIST_RE\.test\((?:url|new URL\(e\.request\.url\))\.pathname\)[\s\S]*fetch\(e\.request\)\.then[\s\S]*catch\(\(\) => c\.match/.test(sw));
  const fetchAt = sw.indexOf("addEventListener('fetch'");
  check('the list rule is the first rule of the fetch handler, so a three-way merge into the site\'s copy keeps it above that copy\'s network first rule for every pack',
    fetchAt > 0 && sw.indexOf('LIST_RE.test', fetchAt) > fetchAt && sw.indexOf('LIST_RE.test', fetchAt) < sw.indexOf("if (e.request.method !== 'GET') return;", fetchAt));
  check('the pattern takes the list file and no pack', (() => { const m = sw.match(/const LIST_RE = (\/.*\/);/); if (!m) return false; const re = vm.runInNewContext(m[1]); return re.test('/shared/packs/brennans-new-orleans.winelist.v1.json') && !re.test('/shared/packs/brennans-new-orleans.v1.oothouse.json'); })());
  check('codex29.js and its stylesheet are in ASSETS', sw.indexOf("'./js/codex29.js'") > 0 && sw.indexOf("'./css/house-fulllist.css'") > 0);
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const scripts = [...index.matchAll(/<script src="js\/([^"?]+)\?v=\d+"><\/script>/g)].map((m) => m[1]);
  const expected = ['codex28.js', 'codex29.js', 'codex30.js', 'data-atlas-v2.js', 'atlas-cache.js', 'codex31.js', 'codex32.js', 'data-teaching-images.js', 'teaching-cache.js', 'codex33.js', 'codex34.js', 'codex35.js', 'data-visual-studies.js', 'codex36.js', 'data-culinary-studies.js', 'codex37.js', 'codex38.js', 'data-regions.js', 'data-service-ref.js', 'codex39.js', 'data-cellar-compass.js', 'codex40.js', 'codex41.js', 'codex42.js', 'codex43.js', 'codex44.js', 'data-field-atlas.js', 'codex45.js', 'codex46.js', 'codex47.js', 'house-learning-flow.js', 'codex48.js', 'codex49.js', 'codex50.js', 'codex51.js', 'atlas-context.js', 'codex52.js', 'data-cms.js', 'data-grid.js', 'codex53.js', 'codex54.js', 'codex55.js', 'codex56.js', 'data-grapes-table.js', 'codex57.js', 'data-flagships.js', 'codex58.js', 'data-champagne.js', 'codex59.js', 'codex60.js', 'boot.js'];
  const at = scripts.indexOf('codex28.js');
  check('index.html preserves list layers, atlas data/cache/UI, then boot in exact order, and its stylesheet', at >= 0 &&
    JSON.stringify(scripts.slice(at, at + expected.length)) === JSON.stringify(expected) &&
    expected.every((file) => scripts.filter((name) => name === file).length === 1) && /css\/house-fulllist\.css\?v=\d+/.test(index));
  ['check-home.js', 'check-merge.js'].forEach((f) => {
    check(f + ' loads codex29.js in its chain', fs.readFileSync(path.join(__dirname, f), 'utf8').indexOf("'codex29.js'") > 0);
  });
  const src = fs.readFileSync(path.join(JS, 'codex29.js'), 'utf8');
  check('codex29.js: no long dash, no en dash, no double hyphen, nothing at or above U+2190', ![...src].some((ch) => ch.codePointAt(0) === 0x2013 || ch.codePointAt(0) === 0x2014 || ch.codePointAt(0) >= 0x2190) && !/\x20-{2}\x20/.test(src));
  check('codex29.js declares with var and function only, no arrow', !/^\s*(let|const|class)\s/m.test(src) && src.indexOf('=>') < 0);
  check('codex29.js names nobody', !/Lizzy/.test(src));
  const cache60 = Number((sw.match(/const CACHE = '(?:oot-)?codex-v(\d+)';/) || [])[1] || 0);
  check('sw.js is codex-v124 or later and lists ./js/codex60.js once, after ./js/codex59.js', cache60 >= 124 && sw.split("'./js/codex60.js'").length === 2 && sw.indexOf("'./js/codex60.js'") > sw.indexOf("'./js/codex59.js'"), 'codex-v' + cache60);
  check('index.html loads js/codex60.js once with ?v=, after codex59.js and before boot.js', index.split('js/codex60.js?v=').length === 2 && scripts.indexOf('codex60.js') === scripts.indexOf('codex59.js') + 1 && scripts.indexOf('boot.js') === scripts.indexOf('codex60.js') + 1);
  /* the chain rule: no list of the chain in any gate here goes from codex59.js to boot.js, or ends at codex59.js,
     without codex60.js between */
  const chainBad = [];
  fs.readdirSync(GATES).filter((f) => /^check-[\w-]+\.c?js$/.test(f)).forEach((f) => {
    const t = fs.readFileSync(path.join(GATES, f), 'utf8');
    if (/'codex59\.js'\s*\]?\s*(?::\s*\[\s*\]\s*)?,\s*\[?\s*'boot\.js'/.test(t) || /'codex59\.js'\]\.(filter|every)\(/.test(t)) chainBad.push(f);
  });
  check('the chain rule: every gate that lists codex59.js lists codex60.js after it', chainBad.length === 0, chainBad.join(', '));
  const src60 = fs.readFileSync(path.join(JS, 'codex60.js'), 'utf8');
  const code60 = src60.replace(/\/\*[\s\S]*?\*\//g, '').replace(/'(?:[^'\\\n]|\\.)*'/g, "''");
  check('codex60.js: no long dash, no en dash, no double hyphen, nothing at or above U+2190, written or escaped', ![...src60].some((ch) => ch.codePointAt(0) === 0x2013 || ch.codePointAt(0) === 0x2014 || ch.codePointAt(0) >= 0x2190) && !/\x20-{2}\x20/.test(src60)
    && !/\\u20(13|14)|\\u2[1-9a-fA-F][0-9a-fA-F]{2}|&[mn]dash;|&#82(11|12);|&#x201[34];/i.test(src60));
  check('codex60.js declares with var and function only, no arrow', !/(^|[^\w.'"])(let|const|class)\s/.test(code60) && code60.indexOf('=>') < 0);
  const wrap60 = src60.split('\n').filter((l) => /^\s*var _v60\w+ = \w+;$/.test(l));
  const unguarded60 = wrap60.filter((line) => { const m = /var (_v60\w+) = (\w+);$/.exec(line); const i = src60.indexOf(line); const before = src60.slice(Math.max(0, i - 200), i); return !new RegExp('if \\(typeof ' + m[2] + ' === \'function\'\\) \\{\\s*$').test(before); });
  check('codex60.js edits no earlier layer: every wrapper (' + wrap60.length + ') is typeof guarded, the guard on the line above it', wrap60.length >= 15 && unguarded60.length === 0, unguarded60.join(' | '));
  const wm = src60.match(/var V60_WORDS = (\{[\s\S]*?\n\});/);
  let w60 = {};
  try { w60 = wm ? vm.runInNewContext('(' + wm[1] + ')') : {}; } catch (e) { w60 = {}; }
  const wprobs = [];
  Object.keys(w60).forEach((k) => voiceProblems(String(w60[k])).forEach((pr) => wprobs.push(k + ': ' + pr)));
  /* every literal the layer writes between tags is a mark, a space or a class: its words come from V60_WORDS */
  const loose = [...src60.matchAll(/'[^'\n]*>([A-Za-z][a-z]+ [a-z][^'<]*)</g)].map((m) => m[1]);
  check('every word codex60 shows is V60_WORDS\'s, in the voice of the house', Object.keys(w60).length >= 10 && !wprobs.length && !loose.length, wprobs.concat(loose).join(', '));
  const cssAt = src60.indexOf('css.textContent = ['), cssEnd = src60.indexOf("].join('\\n')", cssAt);
  const rules60 = [...src60.slice(cssAt, cssEnd).matchAll(/^\s*'((?:[^'\\]|\\.)*)',?$/gm)].map((m) => m[1]);
  const selBad60 = [];
  rules60.forEach((r) => { const b = /^@media[^{]*\{(.*)\}$/.exec(r); const rule = b ? b[1] : r; rule.slice(0, rule.indexOf('{')).split(',').forEach((x) => { if (!/^\.wrap\s/.test(x.trim())) selBad60.push(x.trim()); }); });
  check('every selector of the v60-style element is under .wrap', rules60.length >= 8 && selBad60.length === 0, selBad60.join(' | '));
  check('codex60.js names nobody', !/Lizzy/.test(src60));

  console.log('');
  if (failed) { console.log('check-winelist: ' + failed + ' of ' + (passed + failed) + ' checks FAILED'); process.exit(1); }
  if (MUTATIONS) {
    console.log('');
    console.log('--- the mutations (codex60) ---');
    const bad = mutations();
    if (bad) { console.log('check-winelist: all ' + passed + ' checks pass; ' + bad + ' mutation(s) FAILED'); process.exit(1); }
    console.log('check-winelist: all ' + passed + ' checks pass, and every mutation is caught by name');
    process.exit(0);
  }
  console.log('check-winelist: all ' + passed + ' checks pass');
}

/* ---- the gate proves it can fail (codex60) ----
   Each mutation breaks one rule of codex60 in a scratch copy of the shipped tree (index.html, sw.js, js/, every file
   copied, never linked) or, for the chain rule, of the gates; this gate, run on it, must fail, and fail by the check
   that names the rule. */
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
  const C60 = 'js/codex60.js';
  const MUT = [
    ['the engine\'s isPast never asked', C60, "  if (lib && typeof lib.isPast === 'function') { try { return !!lib.isPast(item); } catch (e) { } }\n", '', 'the past rule is the engine\'s own'],
    ['the rule written out dropped', C60, "  return !!item && typeof item.section === 'string' && item.section.trim().indexOf(V60_PREFIX) === 0;", '  return false;', 'and the same rule written out'],
    ['codex28\'s wines left whole', C60, '    if (V60_WHOLE > 0) return all;\n', '    return all;\n', 'past wines leave every deck'],
    ['the cellar\'s copy of a past wine left on Our List', C60, '    var out = rows.filter(function (r) { return !(r && r.own && past[r.id]); });', '    var out = rows;', 'the chips count served wines only'],
    ['the past door left off Our List', C60, "    var past = (!v60Str(st.q) && !st.sec) ? v60PastDoorHtml() : '';", "    var past = '';", 'one door at the foot of Our List'],
    ['the past door drawn while a chip narrows the list', C60, "    var past = (!v60Str(st.q) && !st.sec) ? v60PastDoorHtml() : '';", '    var past = v60PastDoorHtml();', 'one door at the foot of Our List'],
    ['the door\'s rows drawn while it is closed', C60, "'<div class=\"v60-pastbody\">' + (V60_STATE.pastOpen ? v60PastBodyHtml(groups) : '') + '</div></details>'", "'<div class=\"v60-pastbody\">' + v60PastBodyHtml(groups) + '</div></details>'", 'the door, closed, draws no row'],
    ['an empty past door drawn for a house with no past', C60, "  if (!n) return '';\n", '', 'a pack with no past section draws exactly as before'],
    ['the note on why it left drawn last', C60, '    return html.slice(0, at) + block + html.slice(at);', '    return html + block;', 'the note on why it left first'],
    ['the note drawn twice', C60, '    if (Array.isArray(out.more)) out.more = out.more.filter(function (n) { return n !== why; });\n', '', 'the note is drawn once'],
    ['a past card keeping its study buttons', C60, '    html = v60ReadOnly(html, item);\n', '', 'a past card is read only'],
    ['a past card\'s neighbours from every section', C60, "      if (st) { st.q = ''; st.sec = (typeof v28IsBottle === 'function' && v28IsBottle(item) ? '#bottles|' : '') + v60Str(item.section); }", "      if (st) { st.q = ''; st.sec = ''; }", 'a past card\'s neighbours are its own section\'s'],
    ['a past card drawn from the served list', C60, '      html = v60Whole(function () { return _v60CardHtml.apply(self, args); });', '      html = _v60CardHtml.apply(self, args);', 'a past card draws whole'],
    ['the door forgetting it was open', C60, '    if (v60PastItem(id)) V60_STATE.pastOpen = true;\n', '', 'a past row opened keeps the door open'],
    ['the whole list door left off', C60, '    var door = v60WholeDoorHtml();', "    var door = '';", 'the whole list door at the top of Our List'],
    ['the whole list door never counting', C60, "  return n ? v60W('wholeDoor', { n: v60Big(n) }) : v60W('wholeDoorPlain');", "  return v60W('wholeDoorPlain');", 'and the door says the size read from the file'],
    ['the whole list read at load', C60, 'var V60_STATE = { pastOpen: false };', 'var V60_STATE = { pastOpen: false };\nvar __v60Render = render;\nrender = function () { var o = __v60Render.apply(this, arguments); v60ReadWhole(); return o; };', 'nothing was fetched for the full list at load'],
    ['the whole list never read from Our List', C60, '    v60ReadWhole();\n    return box;', '    return box;', 'drawing Our List reads the list once'],
    ['the Past chip drawn for a file with no past', C60, "    var ix = v60PastIndex();\n    if (!ix || typeof html !== 'string') return html;", "    var ix = v60PastIndex() || { rows: [] };\n    if (typeof html !== 'string') return html;", 'a list file with no past key draws exactly as before'],
    ['the Past chip never drawn', C60, "    var ix = v60PastIndex();\n    if (!ix || typeof html !== 'string') return html;", '    return html;\n    var ix = null;', 'the Past chip is drawn when the file carries past groups'],
    ['the Past chip pressing nothing', C60, '      st.past = !st.past;', '      st.past = false;', 'pressed, each group under the date it was last printed'],
    ['the past groups oldest first', C60, '    groups.push({ date: date', '    groups.unshift({ date: date', 'pressed, each group under the date it was last printed'],
    ['past rows in the order the file gives', C60, '    var keys = order.slice();', '    var keys = [];', 'its rows under the list\'s sections in the list\'s order'],
    ['a past row\'s last price left off', C60, "(price ? '<span class=\"lvltag v28-price\">' + v60Esc(v60W('lastPrice', { price: price })) + '</span>' : '')", "''", 'each row with its name, vintage, size, bin and last price'],
    ['a past row\'s id without its date', C60, "function v60PastId(r) { return 'v60-d' + String(r.group).replace(/[^0-9A-Za-z]+/g, '-') + '-' + r.n; }", "function v60PastId(r) { return 'v29-d' + r.n; }", 'a past row\'s element id carries its group\'s date'],
    ['a past row opening nothing', C60, '      st.open = st.open === key ? null : key;', '      st.open = null;', 'a past row opens in place'],
    ['the group\'s cards never read', C60, "cards: g.cards && typeof g.cards === 'object' ? g.cards : {}", 'cards: {}', 'and to Open the full card where the group\'s cards names'],
    ['a past row saying its bin is shared', C60, '      delete r.shared;\n', '', 'a past row never says a bin is shared'],
    ['the search ignoring past rows', C60, '      for (var i = 0; i < tokens.length; i++) if (r.hay.indexOf(tokens[i]) < 0) return false;\n', '', 'the search works on past rows'],
    ['the price chips ignoring past rows', C60, '      if (st.band && r.band !== st.band) return false;\n', '', 'the price chips work on past rows'],
    ['the size chips ignoring past rows', C60, '      if (st.size && r.sizeKind !== st.size) return false;\n', '', 'the size chips work on past rows'],
    ['a let in the layer', C60, "var V60_PREFIX = 'Past ';", "let V60_PREFIX = 'Past ';", 'codex60.js declares with var and function only'],
    ['an unguarded wrapper', C60, "if (typeof v28NotesFor === 'function') {", 'if (true) {', 'codex60.js edits no earlier layer'],
    ['a dash in the words', C60, "  pastCard: 'No longer on the list: kept to be read, never dealt.',", "  pastCard: 'No longer on the list \\u2014 kept to be read, never dealt.',", 'codex60.js: no long dash'],
    ['a word written outside V60_WORDS', C60, "'<p class=\"v60-pasttag\">' + v60Esc(v60W('pastCard')) + '</p>'", "'<p class=\"v60-pasttag\">No longer on the list, kept to be read.</p>'", 'every word codex60 shows is V60_WORDS'],
    ['a selector outside .wrap', C60, "    '.wrap .v60-whole{margin:14px 0 10px}',", "    '.v60-whole{margin:14px 0 10px}',", 'every selector of the v60-style element'],
    ['the tag left out of index.html', 'index.html', '<script src="js/codex60.js?v=1"></script>\n', '', 'index.html loads js/codex60.js once'],
    ['the worker left at codex-v123', 'sw.js', "const CACHE = 'codex-v124';", "const CACHE = 'codex-v123';", 'sw.js is codex-v124 or later'],
    ['the worker not listing codex60.js', 'sw.js', "  './js/codex60.js',\n", '', 'sw.js is codex-v124 or later'],
    ['a gate list going from codex59.js to boot.js', 'gates', "'codex59.js', 'codex60.js', 'boot.js'];", "'codex59.js', '" + "boot.js'];", 'the chain rule']
  ];
  const repoRoot = path.join(JS, '..');
  let held = 0;
  const problems = [];
  const only = process.env.WINELIST_MUTATION || '';
  const RUN = MUT.filter((m) => !only || only.split('|').some((w) => m[0].indexOf(w) >= 0));
  for (const [name, file, from, to, by] of RUN) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'winelist-mut-'));
    copyTree(JS, path.join(dir, 'js'));
    fs.writeFileSync(path.join(dir, 'index.html'), fs.readFileSync(path.join(repoRoot, 'index.html')));
    fs.writeFileSync(path.join(dir, 'sw.js'), fs.readFileSync(path.join(repoRoot, 'sw.js')));
    fs.readdirSync(repoRoot).filter((f) => /\.js$/.test(f) && f !== 'sw.js').forEach((f) => fs.writeFileSync(path.join(dir, f), fs.readFileSync(path.join(repoRoot, f))));
    const env = Object.assign({}, process.env);
    let target;
    if (file === 'gates') {
      fs.mkdirSync(path.join(dir, 'gates'));
      fs.readdirSync(GATES).filter((f) => /^(check-|list-harness)[\w-]*\.c?js$/.test(f)).forEach((f) => fs.writeFileSync(path.join(dir, 'gates', f), fs.readFileSync(path.join(GATES, f))));
      target = path.join(dir, 'gates', 'check-cms.js');
      env.WINELIST_GATES = path.join(dir, 'gates');
    } else target = path.join(dir, file);
    if (fs.lstatSync(target).isSymbolicLink() || fs.realpathSync(target).indexOf(fs.realpathSync(dir) + path.sep) !== 0) { problems.push('the mutation "' + name + '" would write outside its scratch copy: refused'); fs.rmSync(dir, { recursive: true, force: true }); continue; }
    const src = fs.readFileSync(target, 'utf8');
    if (src.indexOf(from) < 0) { problems.push('the mutation "' + name + '" found nothing to change in ' + file); fs.rmSync(dir, { recursive: true, force: true }); continue; }
    fs.writeFileSync(target, src.replace(from, to));
    const r = cp.spawnSync(process.execPath, [__filename, path.join(dir, 'js')], { env, encoding: 'utf8', maxBuffer: 1 << 26 });
    fs.rmSync(dir, { recursive: true, force: true });
    const fails = String(r.stdout || '').split('\n').filter((l) => /^\s+FAIL\s/.test(l));
    const hit = fails.find((l) => l.indexOf(by) >= 0);
    if (r.status === 0) problems.push('the mutation "' + name + '" left this gate green');
    else if (!hit) problems.push('the mutation "' + name + '" was caught, but not by "' + by + '": ' + (fails[0] || String(r.stderr || '').split('\n')[0] || '').trim().slice(0, 200));
    else { held++; console.log('  mutation held: ' + name + ' :: ' + hit.trim().slice(6, 150)); }
  }
  console.log('  ' + held + ' of ' + RUN.length + ' mutations caught, each by its own check' + (RUN.length < MUT.length ? ' (' + RUN.length + ' of the ' + MUT.length + ' run, by WINELIST_MUTATION)' : ''));
  problems.forEach((pr) => console.log('  FAIL  ' + pr));
  return problems.length;
}

main().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
