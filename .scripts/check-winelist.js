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
 *
 *   node .scripts/check-winelist.js [jsDir]
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
  'codex23.js', 'codex24.js', 'codex25.js', 'codex26.js', 'codex27.js', 'codex28.js', 'codex29.js', 'codex30.js', 'boot.js'];

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
  if (/practi[cs]e/i.test(s)) out.push('the retired word for study');
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

function loadChain(H, withOOT) {
  if (withOOT) {
    vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), H.ctx, { filename: 'oot-house.js' });
    vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), H.ctx, { filename: 'oot-house-ui.js' });
    const lib = H.G('OOT.houseLib');
    H.sandbox.OOT.house = lib.createHouseApi(lib.mapStorage(new Map()), { win: H.sandbox, now: () => NOW, rand: seeded(21), from: 'codex' });
  }
  for (const f of FILES) {
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

/* listMode: 'ok' answers the fixture, 'offline' rejects, '404' answers not found */
function bootDevice(listMode, opts) {
  const D = makeSandbox(opts);
  D.mode = listMode;
  D.sandbox.fetch = (url) => {
    D.fetched.push(String(url));
    if (/winelist/.test(String(url))) {
      if (D.mode === 'offline') return Promise.reject(new TypeError('Failed to fetch'));
      if (D.mode === '404') return Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error('no')) });
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(JSON.parse(LIST_TEXT)), text: () => Promise.resolve(LIST_TEXT) });
    }
    return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(PACK_TEXT), json: () => Promise.resolve(JSON.parse(PACK_TEXT)) });
  };
  loadChain(D, !(opts && opts.noOOT));
  return D;
}
async function settle(D) {
  await D.G('typeof V27_LAST !== "undefined" ? V27_LAST : null');
  await D.G('typeof V27_BOOT_PACK !== "undefined" ? V27_BOOT_PACK : null');
  await tick(30);
  await D.G('typeof V27_WRITING !== "undefined" ? V27_WRITING : null');
  await tick(20);
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
  const expected = ['codex28.js', 'codex29.js', 'codex30.js', 'data-atlas-v2.js', 'atlas-cache.js', 'codex31.js', 'codex32.js', 'data-teaching-images.js', 'teaching-cache.js', 'codex33.js', 'codex34.js', 'boot.js'];
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

  console.log('');
  if (failed) { console.log('check-winelist: ' + failed + ' of ' + (passed + failed) + ' checks FAILED'); process.exit(1); }
  console.log('check-winelist: all ' + passed + ' checks pass');
}

main().catch((e) => { console.error(e && e.stack || e); process.exit(1); });
