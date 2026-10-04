/**
 * IS OUR LIST A STUDY TOOL WHEN A HOUSE IS CURRENT, AND TODAY'S LIST WHEN IT IS NOT?
 *
 * codex28 draws Our Wine List as a study view over the current house: compact
 * rows, a card per wine with links into the Codex's own reference, the
 * #wine=<id> deep link and a flash card deck of the house's wines. This loads
 * the SHIPPED chain with codex28 on top of the SHIPPED engine and the shipped
 * Brennan's pack, over a Map storage, and asks:
 *
 *   1. with a current house the study view is the default; with the switch
 *      on it is codex27's list; with no house it is codex12's
 *   2. the header sentence counts the list from the house; the rows are the
 *      house's wines in its order; the short line drops a name the line
 *      repeats and keeps a line that does not; the price is as printed
 *   3. the Berres Riesling card links the Riesling grape profile, the Mosel
 *      Terroir entry and the Germany chapter; the house Champagne's card
 *      carries the wine block, its first picks in the Table on the suite's
 *      path and its grapes, region and chapter; a producer links only when
 *      the Producers hold it; the floors the design measured hold
 *   4. the deep link opens the right bottle after the first sync; #list
 *      opens the list; a malformed hash writes nothing and opens nothing
 *   5. the deck deals only house wines with kept lines, by scope; Got it and
 *      Again record under h-<id>-card, which no level counts; Flip, Got it
 *      and Again push no history; opening a card pushes one entry and the
 *      back gesture closes it and puts the scroll back
 *   6. Drill the list and the section drill are codex27's house rounds and
 *      never call startCellarDrill or startCellarRecite
 *   7. every string codex28 draws passes voiceProblems, with each field it
 *      quotes from the Codex's reference data held out (that text is the
 *      Codex's own content, held by its own sweep)
 *   8. no OOT at all: the chain loads with no location, with a location that
 *      has no pathname, and the study view never shows
 *
 *   node .scripts/check-study.js [jsDir]
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
const PACK_FILE = path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
for (const f of [ENGINE, UI_FILE, PACK_FILE]) {
  if (!fs.existsSync(f)) {
    console.error('check-study: no ' + path.basename(f) + ' at ' + SHARED + ' (set OOT_SHARED)');
    process.exit(1);
  }
}
if (!fs.existsSync(path.join(JS, 'codex28.js'))) {
  console.log('check-study: no codex28.js in ' + JS + ', SKIPPED');
  process.exit(0);
}

const OPTIONAL = new Set(['codex13.js', 'data-firstpath.js', 'codex29.js', 'codex30.js']);
const FILES = ['data-questions.js', 'reference.js', 'core.js', 'codex2.js', 'codex3.js',
  'codex4.js', 'codex5.js', 'data-primers.js', 'codex6.js', 'data-intro.js',
  'data-primers-intro.js', 'data-grapes-plus.js', 'data-tasting.js', 'data-floor.js',
  'data-pairing.js', 'data-maps.js', 'data-advanced.js', 'data-primers-advanced.js',
  'data-master.js', 'data-primers-master.js', 'codex7.js', 'codex8.js', 'codex9.js',
  'codex10.js', 'codex11.js', 'codex12.js', 'data-firstpath.js', 'codex13.js', 'codex14.js',
  'codex15.js', 'data-producers.js', 'menu-desk.js', 'wine-rows.js', 'codex16.js',
  'codex17.js', 'codex18.js', 'codex19.js', 'codex20.js', 'codex21.js', 'codex22.js',
  'codex23.js', 'codex24.js', 'codex25.js', 'codex26.js', 'codex27.js', 'codex28.js', 'codex29.js', 'codex30.js', 'boot.js'];

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
const packText = fs.readFileSync(PACK_FILE, 'utf8');
const packJson = JSON.parse(packText);
const house = packJson.house;

/* A device as the wing's shell boots it: the engine and its screens, then the
   chain, with fetch answering the one same-origin pack. */
function bootDevice(opts) {
  const o = opts || {};
  const D = makeSandbox(o.seed || {}, o);
  vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), D.ctx, { filename: 'oot-house.js' });
  vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), D.ctx, { filename: 'oot-house-ui.js' });
  const lib = D.G('OOT.houseLib');
  D.sandbox.OOT.house = lib.createHouseApi(lib.mapStorage(new Map()), { win: D.sandbox, now: () => NOW, rand: seeded(21), from: 'codex' });
  D.sandbox.fetch = (url) => Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(packText) });
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
const wineId = (re) => (house.wines.find((w) => re.test(w.name)) || {}).id;

async function main() {
  const BERRES = wineId(/Berres/);
  const CHAMP = wineId(/Essential/);
  const LEFLAIVE = wineId(/Leflaive/);
  const AUSLESE = wineId(/Auslese/);
  const LAFITTE = wineId(/Lafitte/);

  /* ================================================================ */
  section('the study view is the default with a house');
  const D = bootDevice({ location: { href: 'http://localhost/codex/', pathname: '/codex/', search: '', hash: '' } });
  await settle(D);
  const G = D.G;
  check('Brennan\'s is current and on the list', G('v28Wines(v28House()).length') === house.wines.length && G('ST.cellar.length') === house.wines.length);
  check('v28StudyOn() with a current house holding wines', G('v28StudyOn()') === true);
  G('var __study = 0, __deco = 0; var __sv = v28StudyView; v28StudyView = function () { __study++; return __sv.apply(this, arguments); };'
    + 'var __dc = v27DecorateCellar; v27DecorateCellar = function () { __deco++; return __dc.apply(this, arguments); };');
  G('cellarView()');
  check('cellarView() draws the study view, not codex27\'s list', G('__study') === 1 && G('__deco') === 0);
  G('S._v28edit = true; cellarView();');
  check('with Edit the list on, cellarView() is codex27\'s list again', G('__study') === 1 && G('__deco') === 1);
  G('S._v28edit = false; S.view = "cellar"; render();');
  check('a render of the list goes through the study view', G('__study') === 2);
  check('the Mine row for the deck shows, and resolves through V25_GO', G('V25_MINE.some(function (r) { return r.key === "ourlistcards" && r.show(); })') === true
    && G('typeof V25_GO.ourlistcards') === 'function');

  /* ================================================================ */
  section('the header, the rows, the short line, the price');
  /* the pack's own read date, written the way the study view writes it, so a new edition needs no edit here */
  const READ_ON = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return d + ' ' + ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1] + ' ' + y; };
  const menuBottle = (w) => w.list !== 'bottle' && !w.glass && !!w.bottle;
  const glass = house.wines.filter((w) => w.list !== 'bottle' && !menuBottle(w));
  const menuBottles = house.wines.filter(menuBottle).length;
  const priced = glass.filter((w) => (w.prices || []).some((p) => p && p.printed)).length;
  const poured = glass.filter((w) => !(w.prices || []).some((p) => p && p.printed)
    && (house.tastings || []).some((t) => (t.courses || []).some((c) => c.pourId === w.id))).length;
  const study = G('v28StudyHtml()');
  const want = 'By the glass, as the house menus print it: ' + glass.length + ' wines, ' + priced + ' with a glass price and ' + poured + ' poured on the tastings.'
    + (menuBottles ? ' Bottles the menus print: ' + menuBottles + ', half bottles, large formats and the Bubbles rosés among them.' : '');
  check('the header sentence counts the list from the house (' + glass.length + ', ' + priced + ', ' + poured + ', ' + menuBottles + ' bottles)', study.indexOf(G('v28Esc(' + JSON.stringify(want) + ')')) >= 0 && glass.length === priced + poured && priced >= 14 && poured === 6, want);
  check('one row per house wine, each a button that opens its card', (study.match(/class="v28-row" data-v28="open"/g) || []).length === house.wines.length);
  const order = house.wines.map((w) => w.id);
  const drawnOrder = (study.match(/class="v28-row" data-v28="open" data-id="([^"]+)"/g) || []).map((m) => m.replace(/.*data-id="/, '').replace('"', ''));
  check('in the house\'s order', JSON.stringify(drawnOrder) === JSON.stringify(order));
  check('the search box is labelled and the chips carry aria-pressed', /<label class="sr-only" for="v28-q">Find a wine<\/label>/.test(study) && study.indexOf('data-v28="sec" data-s="" aria-pressed="true">All ' + house.wines.length + '<') >= 0);
  check('the house and the menus\' date in the sub line', study.indexOf('menus read ' + READ_ON(house.menusReadOn)) >= 0);
  check('the edit switch is a quiet text button', /class="v28-switch" data-v28="editall">Edit the list</.test(study));
  check('no allergen box, no tick, no checked attribute', !/checked|type="checkbox"/.test(study));
  check('the Berres short line drops the name it repeats', G('v28ShortLine(v28Find(v28House().wines, ' + JSON.stringify(BERRES) + '))') === 'Light, racy and off-dry, our glass for anything spicy.',
    G('v28ShortLine(v28Find(v28House().wines, ' + JSON.stringify(BERRES) + '))'));
  const champS10 = house.wines.find((w) => w.id === CHAMP).lines.value.s10;
  check('the house Champagne keeps its whole ten second line', G('v28ShortLine(v28Find(v28House().wines, ' + JSON.stringify(CHAMP) + '))') === champS10);
  const price = (id) => G('v28PriceLine(v28Find(v28House().wines, ' + JSON.stringify(id) + '), v28House())');
  check('the Berres price reads "$14 glass", never "by the glass"', price(BERRES) === '$14 glass');
  check('the Auslese reads "$80 half-bottle"', price(AUSLESE) === '$80 half-bottle');
  check('a wine poured only on the tastings says so from the tastings', /^Poured on the .+, 4 oz$/.test(price(LAFITTE)), price(LAFITTE));
  G('localStorage.setItem("oot-study-meal-v1", "Dinner")');
  const dinner = G('v28StudyHtml()');
  check('the shift filter reads its per-device choice and says it in words', /data-m="Dinner" aria-pressed="true">Dinner</.test(dinner) && /data-m="" aria-pressed="false">All day</.test(dinner));
  G('localStorage.removeItem("oot-study-meal-v1")');
  G('S._v28.q = "riesling"');
  const found = G('v28StudyHtml()');
  /* the menus' two Rieslings, and the floor's Riesling bottles with them: the count is read off the rows, never pinned */
  const rieslings = (found.match(/class="v28-row"/g) || []).length;
  check('the search keeps the wines carrying the grape, and the live region says so', rieslings >= 2 && new RegExp(rieslings + ' found for riesling').test(found) && /Berres/.test(found) && /Erdener/.test(found), rieslings + ' rows');
  G('S._v28.q = "sazerac"');
  const away = G('v28StudyHtml()');
  check('a search that is another room\'s finds it under Elsewhere in the house', /Nothing matches sazerac\./.test(away) && /Elsewhere in the house/.test(away) && /Classic Sazerac.*in the Ledger/.test(away));
  G('S._v28.q = ""');

  /* ================================================================ */
  section('the cards and their links');
  G('V28_QUOTE = function (s) { return v28Esc(s); }');
  /* the design measured the links at Village; Regionale is asked after */
  G('applyLevel("certified", true)');
  check('the level is Village for the link floors', G('activeLevel') === 'certified');
  const berres = G('v28CardHtml(' + JSON.stringify(BERRES) + ')');
  check('the Berres card opens on its name as the focus target', /<h2 class="v28-title" id="v28-h" tabindex="-1">C\.H\. Berres/.test(berres));
  check('the Berres card links the Riesling grape profile', /data-v28="grape" data-g="Riesling">Open Riesling in the grape cards</.test(berres) && /<p class="v28-refname">Riesling<\/p>/.test(berres));
  check('and draws the Mosel entry of the Terroir Atlas with its door', /<p class="v28-refname">Mosel<\/p>/.test(berres) && /Blue &amp; red slate/.test(berres) && /data-v28="terroir"/.test(berres));
  check('and the Germany chapter at the current level', /data-v28="primer" data-k="Germany">Read Germany, a chapter at /.test(berres));
  check('its price once, with the date it was printed', (berres.match(/\$14 glass/g) || []).length >= 1 && berres.indexOf('Prices as printed on ' + READ_ON(house.menusReadOn) + '. Confirm before quoting.') >= 0);
  check('Say it over the kept value, verbatim', /Say it<\/p><p class="v28-sayit">C\.H\. Berres: BEH-ress\.<\/p>/.test(berres));
  check('the fixed eyebrow for the service note', berres.indexOf('Your words. Allergens: confirm at lineup.') >= 0);
  check('a part the profile already holds is left out, by containment after folding', G('(function () { var w = JSON.parse(JSON.stringify(v28Find(v28House().wines, ' + JSON.stringify(BERRES) + ')));'
    + ' w.parts.value.sauce = w.profile.value.split(". ")[0]; w.parts.value.sides = w.goesWith.value.toUpperCase();'
    + ' var shown = v28PartsShown(w).map(function (p) { return p[1]; }); return shown.indexOf(w.parts.value.sauce) < 0 && shown.indexOf(w.parts.value.sides) < 0 && shown.length === 3; })()') === true);
  /* the notes ride on the pack's edition: an edition without them draws no empty block */
  const bk = (house.wines.find((w) => w.id === BERRES).kept || []).map((n) => n.q);
  const hasAbout = bk.indexOf('Tell me about it.') >= 0;
  const hasSell = bk.indexOf('How do I sell it?') >= 0;
  check('About it ' + (hasAbout ? 'drawn from the kept note' : 'absent, as the edition holds none'), hasAbout === /<h3 class="secgroup">About it<\/h3>/.test(berres));
  check('On the floor: the coaching in the fixed order, selling open' + (hasSell ? '' : ' (none in this edition)'), !hasSell || (/<details class="v28-q" open><summary>How do I sell it\?<\/summary>/.test(berres)
    && (bk.indexOf('What do guests ask?') < 0 || berres.indexOf('How do I sell it?') < berres.indexOf('What do guests ask?'))
    && (bk.indexOf('What should I watch for?') < 0 || berres.indexOf('What do guests ask?') < berres.indexOf('What should I watch for?'))));
  check('no checked attribute, no allergen box', !/checked|type="checkbox"/.test(berres));
  const champ = G('v28CardHtml(' + JSON.stringify(CHAMP) + ')');
  check('the Champagne card: The wine with the bottle not in the guide', /The wine/.test(champ) && champ.indexOf('Not in the guide: the bottle list is on the restaurant&#39;s own page') >= 0
    || champ.indexOf('Not in the guide: the bottle list is on the restaurant\'s own page') >= 0);
  const firstPicks = house.wines.find((w) => w.id === CHAMP).firstPickIds.value;
  check('its first picks link the Table on the suite\'s path (' + firstPicks.length + ')', firstPicks.length >= 3 && firstPicks.every((id) => champ.indexOf('href="/table/menu#' + id + '"') >= 0));
  check('its grapes, its region and its chapter', /data-g="Pinot Noir"/.test(champ) && /data-g="Chardonnay"/.test(champ) && /<p class="v28-refname">Champagne<\/p>/.test(champ) && /data-k="Champagne">Read Champagne/.test(champ));
  check('the Leflaive card links its producer record', /data-v28="producer" data-k="p-/.test(G('v28CardHtml(' + JSON.stringify(LEFLAIVE) + ')')));
  const stats = G('(function () { var o = { primer: 0, grape: 0, prod: [] }; v28Wines(v28House()).forEach(function (w) {'
    + ' if (v28Primer(w)) o.primer++; if (v28GrapeProfiles(w).length) o.grape++; var p = v28Producer(w); if (p) o.prod.push(p.p); }); return JSON.stringify(o); })()');
  const st = JSON.parse(stats);
  check('at least 17 wines link a chapter (' + st.primer + ')', st.primer >= 17);
  check('at least 15 wines link a grape (' + st.grape + ')', st.grape >= 15);
  check('the producers the Producers hold, the three glass ones among them (' + st.prod.join(', ') + ')', st.prod.length >= 3
    && st.prod.some((p) => /Leflaive/.test(p)) && st.prod.some((p) => /Jadot/.test(p)) && st.prod.some((p) => /Inglenook/.test(p)));
  G('applyLevel("intro", true)');
  const introStats = JSON.parse(G('(function () { var n = 0; v28Wines(v28House()).forEach(function (w) { if (v28Primer(w)) n++; }); return JSON.stringify({ n: n, berres: v28Primer(v28Find(v28House().wines, ' + JSON.stringify(BERRES) + ')) }); })()'));
  check('at Regionale the chapters are found through the home\'s own map (' + introStats.n + ' wines), the Berres on Germany', introStats.n >= 15 && !!introStats.berres && introStats.berres.name === 'Germany'
    && /data-v28="primer" data-k="\d+">Read Germany, a chapter at R/.test(G('v28CardHtml(' + JSON.stringify(BERRES) + ')')));
  G('applyLevel("certified", true)');
  const standalone = bootDevice({});
  await settle(standalone);
  check('on a standalone page no link to another room is drawn', standalone.G('v28CardHtml(' + JSON.stringify(CHAMP) + ')').indexOf('href="/table/') < 0
    && standalone.G('v28StudyHtml()').indexOf('href="/') < 0);

  /* ================================================================ */
  section('the deep link');
  const deep = bootDevice({ location: { href: 'http://localhost/codex/#wine=' + BERRES, pathname: '/codex/', search: '', hash: '#wine=' + BERRES } });
  check('the hash is read once at load and cleared', deep.hist.replaced.some((r) => r.u === '/codex/'));
  await settle(deep);
  check('#wine=<id> opens that bottle after the first sync', deep.G('S.view') === 'cellar' && deep.G('S._v28 && S._v28.open') === BERRES && deep.G('V28_WANT') === null,
    deep.G('S.view') + ' ' + deep.G('JSON.stringify(S._v28)'));
  const list = bootDevice({ location: { href: 'http://localhost/codex/#list', pathname: '/codex/', search: '', hash: '#list' } });
  await settle(list);
  check('#list opens the list', list.G('S.view') === 'cellar' && !list.G('S._v28 && S._v28.open'));
  const bad = bootDevice({ location: { href: 'http://localhost/codex/#wine=w-NOPE', pathname: '/codex/', search: '', hash: '#wine=w-NOPE' } });
  check('a malformed #wine= writes nothing', bad.hist.replaced.length === 0 && bad.G('V28_WANT') === null);
  await settle(bad);
  check('and opens nothing', bad.G('S.view') !== 'cellar');
  const gone = bootDevice({ location: { href: 'http://localhost/codex/#wine=w-zzzzzzzz', pathname: '/codex/', search: '', hash: '#wine=w-zzzzzzzz' } });
  await settle(gone);
  await gone.G('v27Sync()'); await tick(20);
  check('a wine the house does not hold is dropped after the sync, and nothing opens', gone.G('V28_WANT') === null && gone.G('S.view') !== 'cellar');

  /* ================================================================ */
  section('the deck');
  G('S.view = "cellar"; S._v28 = null; render();');
  const houseIds = house.wines.map((w) => w.id);
  const withCard = house.wines.filter((w) => w.list !== 'bottle' && w.lines && w.lines.by === 'person' && w.lines.value && w.lines.value.s10).map((w) => w.id);
  const pushedBefore = D.hist.pushed.length;
  check('startHouseDeck is a function declaration on the global', G('typeof startHouseDeck') === 'function' && G('typeof startHouseSectionDrill') === 'function'
    && /\nfunction startHouseDeck\(/.test(fs.readFileSync(path.join(JS, 'codex28.js'), 'utf8')) && /\nfunction startHouseSectionDrill\(/.test(fs.readFileSync(path.join(JS, 'codex28.js'), 'utf8')));
  check('Flash cards opens the deck', G('startHouseDeck({})') === true && G('S.view') === 'housedeck');
  const dealt = G('JSON.stringify(S._v28deck.ids)');
  const ids = JSON.parse(dealt);
  check('the deck deals only house wines, each once, each with a kept line (' + ids.length + ')', ids.length === withCard.length && ids.every((id) => houseIds.indexOf(id) >= 0 && withCard.indexOf(id) >= 0)
    && new Set(ids).size === ids.length);
  check('opening the deck pushed one history entry', D.hist.pushed.length === pushedBefore + 1 && D.hist.pushed[D.hist.pushed.length - 1].v28 === 'deck');
  const frontHtml = G('v28DeckHtml()');
  check('the front is one Flip button, and Got it and Again are not drawn before the flip', /<button type="button" class="card v28-front" data-v28="flip"/.test(frontHtml) && !/data-v28="got"|data-v28="again"/.test(frontHtml)
    && frontHtml.indexOf('Say the ten second line aloud, then flip.') >= 0);
  const first = G('S._v28deck.ids[0]');
  G('v28Act("flip", null)');
  const backHtml = G('v28DeckHtml()');
  check('after the flip the back and the two grades, Again on the left', /data-v28="again">Again<\/button><button type="button" class="btn gold" data-v28="got">Got it</.test(backHtml) && /In ten seconds/.test(backHtml));
  G('v28Act("got", null)');
  const keys = G('JSON.stringify(Object.keys(ST.q).filter(function (k) { return k.indexOf("h-' + first + '-card") >= 0; }))');
  const theKey = JSON.parse(keys)[0];
  check('Got it records under h-<id>-card through the quiz engine', !!theKey && G('ST.q[' + JSON.stringify(theKey) + '].c') === 1, keys);
  check('which no level counts', ['intro', 'certified', 'advanced', 'master'].every((lv) => G('keyOwned(' + JSON.stringify(theKey) + ', ' + JSON.stringify(lv) + ')') === false));
  const second = G('S._v28deck.ids[1]');
  G('v28Act("flip", null); v28Act("again", null);');
  check('Again records a miss and the weak deck holds it', G('v28Latest(' + JSON.stringify(second) + ')') === 'again' && G('JSON.stringify(v28Progress(v28DeckIds({})).againIds)') === JSON.stringify([second]));
  check('Flip, Got it and Again pushed no history', D.hist.pushed.length === pushedBefore + 1);
  check('the progress line counts what was studied', /2 of \d+ studied · 1 got it last time · 1 again/.test(G('v28StudyHtml()')));
  G('v28DeckClose()');
  check('Close the deck returns to the list and steps history back', G('S.view') === 'cellar' && G('S._v28deck') === null && D.hist.backs >= 1);
  const sec = house.wines.find((w) => w.id === BERRES).section;
  G('startHouseDeck({ section: ' + JSON.stringify(sec) + ' })');
  const secIds = JSON.parse(G('JSON.stringify(S._v28deck.ids)'));
  check('a section\'s deck deals that section alone', secIds.length >= 1 && secIds.every((id) => house.wines.find((w) => w.id === id).section === sec));
  G('v28DeckClose(); startHouseDeck({ itemIds: [' + JSON.stringify(BERRES) + '] })');
  check('one wine\'s deck deals that wine', G('JSON.stringify(S._v28deck.ids)') === JSON.stringify([BERRES]));
  G('startHouseDeck({ weak: true })');
  check('My weak ones deals the Again ones', G('JSON.stringify(S._v28deck.ids)') === JSON.stringify([second]));
  /* draw every face for the voice check below */
  const deckFaces = [];
  G('startHouseDeck({})');
  for (let i = 0; i < ids.length; i++) {
    deckFaces.push(G('v28DeckHtml()')); G('v28Act("flip", null)'); deckFaces.push(G('v28DeckHtml()')); G('v28Act(' + (i % 2 ? '"again"' : '"got"') + ', null)');
  }
  deckFaces.push(G('v28DeckHtml()'));
  check('the end screen offers the Again cards, a shuffle and the way back', /Deck complete/.test(deckFaces[deckFaces.length - 1]) && /Again: the \d+ you marked/.test(deckFaces[deckFaces.length - 1]) && /Shuffle again/.test(deckFaces[deckFaces.length - 1]));
  G('v28DeckClose()');

  /* ================================================================ */
  section('a card and the back gesture');
  D.sandbox.scrollY = 1234;
  const p0 = D.hist.pushed.length;
  G('v28Open(' + JSON.stringify(BERRES) + ', false)');
  check('opening the Berres card pushes one entry', D.hist.pushed.length === p0 + 1 && D.hist.pushed[p0].v28 === BERRES && G('S._v28.open') === BERRES && G('S._v28.y') === 1234);
  G('v28Act("open", { getAttribute: function (k) { return k === "data-id" ? ' + JSON.stringify(CHAMP) + ' : k === "data-step" ? "1" : ""; } })');
  check('Next within the card replaces the entry, never pushes', D.hist.pushed.length === p0 + 1 && G('S._v28.open') === CHAMP);
  D.scrolls.length = 0;
  D.listeners.popstate.forEach((fn) => fn({ state: null }));
  check('a popstate to a state without v28 closes the card and puts the scroll back', G('S._v28.open') === null && D.scrolls.indexOf(1234) >= 0, JSON.stringify(D.scrolls));

  /* ================================================================ */
  section('the verifier\'s cases: history, the card\'s price, links, the art');
  const nodeOf = (attrs) => '{ getAttribute: function (k) { var a = ' + JSON.stringify(attrs) + '; return a[k] || ""; }, setAttribute: function () { } }';
  /* a card opened by the deep link pushed nothing; Next must not stamp the
     entry below it with a card, or the back gesture later pops to that stamp
     and leaves whatever card is open in place */
  G('S.view = "cellar"; S._v28 = { q: "", sec: "", open: ' + JSON.stringify(BERRES) + ', y: 0, pushed: false, focus: "" }; render();');
  const pushA = D.hist.pushed.length, replA = D.hist.replaced.length;
  G('v28Act("open", ' + nodeOf({ 'data-id': CHAMP, 'data-step': '1' }) + ')');
  const stamped = D.hist.pushed.length === pushA && D.hist.replaced.length > replA && !!(D.hist.replaced[D.hist.replaced.length - 1].s || {}).v28;
  check('Next on a card that pushed no entry does not stamp the entry below with a card', !stamped, JSON.stringify(D.hist.replaced.slice(replA)));
  G('v28CloseCard(); v28Open(' + JSON.stringify(LEFLAIVE) + ', false)');
  D.listeners.popstate.forEach((fn) => fn({ state: { v28: CHAMP } }));
  check('a popstate to an entry naming another card never leaves the open card in place', G('S._v28.open') !== LEFLAIVE, String(G('S._v28.open')));
  /* following a door from a card (the grape cards, the atlas, a chapter) adds
     no entry, so the back gesture pops the card's own entry while the reader
     is on the door's page and nothing happens; the next back leaves the Codex */
  G('S.view = "cellar"; S._v28 = null; v28Open(' + JSON.stringify(BERRES) + ', false); v28Act("grape", ' + nodeOf({ 'data-g': 'Riesling' }) + ')');
  const onDoor = G('S.view');
  D.listeners.popstate.forEach((fn) => fn({ state: null }));
  check('the back gesture from a door the card opened (' + onDoor + ') comes back to the list or the card, never a dead press', G('S.view') === 'cellar', G('S.view'));
  G('S.view = "cellar"; S._v28 = null; render();');
  /* a wine poured only on the tastings has no price: its pour sentence is not
     a price tag, and the card does not say prices as printed */
  const laf = G('v28CardHtml(' + JSON.stringify(LAFITTE) + ')');
  check('a tasting pour is not drawn as a price tag on the card', !/<span class="lvltag">Poured on/.test(laf));
  check('and the card carries no "Prices as printed" line when nothing is priced', laf.indexOf('Prices as printed') < 0);
  /* the same dish linked over and over is a wall of links: the first pick
     line and its block may each name a dish, nothing more */
  const bcard = G('v28CardHtml(' + JSON.stringify(BERRES) + ')');
  const hrefs = {};
  (bcard.match(/href="\/table\/menu#d-[a-z0-9]{8}"/g) || []).forEach((h) => { hrefs[h] = (hrefs[h] || 0) + 1; });
  const most = Object.keys(hrefs).reduce((m, k) => Math.max(m, hrefs[k]), 0);
  check('no dish is linked more than twice on one card (the Berres links one ' + most + ' times)', most <= 2, JSON.stringify(hrefs));
  /* the Terroir door lands on the wine's region, not the top of a 180 row atlas */
  check('the Terroir door names the region it opens on', /data-v28="terroir"[^>]*data-k="Mosel"/.test(bcard));
  const css = fs.readFileSync(path.join(JS, '..', 'css', 'house-list.css'), 'utf8');
  const linkRule = (css.match(/\.v28-link\s*\{[^}]*\}/) || [''])[0];
  const linkMin = Number((linkRule.match(/min-height:\s*(\d+)px/) || [0, 0])[1]);
  check('a link on the card is a control at least 44px tall (min-height ' + linkMin + 'px)', linkMin >= 44);
  const sumRule = (css.match(/\.v28-q\s*>\s*summary\s*\{[^}]*\}/) || [''])[0];
  check('a disclosure keeps a visible open or closed state (display:flex on summary drops its marker, and no word replaces it)',
    !/display:\s*flex/.test(sumRule) || /\.v28-q[^{]*summary::?(before|after)\s*\{[^}]*content:/.test(css));
  const navRule = (css.match(/\.v28-cardnav\s*\{[^}]*\}/) || [''])[0];
  check('the card\'s Back to the list clears the suite badge at the top left (the card is scrolled to 8px under a 44px disc at 10px)', /padding-left:\s*calc\(64px/.test(navRule));
  const deckRule = (css.match(/\.v28-deckbar\s*\{[^}]*\}/) || [''])[0];
  check('the deck\'s bar clears the badge too, and the flipped card scrolls to that bar', /padding-left:\s*calc\(64px/.test(deckRule)
    && /querySelector\('\.v28-deck \.v28-deckbar'\)/.test(fs.readFileSync(path.join(JS, 'codex28.js'), 'utf8')));
  /* the door pushes its own entry, so the real stack pops to the card's */
  G('S.view = "cellar"; S._v28 = null; v28Open(' + JSON.stringify(BERRES) + ', false);');
  const pDoor = D.hist.pushed.length;
  G('v28Act("primer", ' + nodeOf({ 'data-k': 'Germany' }) + ')');
  check('a door followed from a card pushes one entry of its own', D.hist.pushed.length === pDoor + 1 && D.hist.pushed[pDoor].v28 === 'door' && G('S.view') === 'primer');
  D.listeners.popstate.forEach((fn) => fn({ state: { v28: BERRES } }));
  check('and the back gesture from it returns to that card', G('S.view') === 'cellar' && G('S._v28.open') === BERRES && G('S._v28.door') === null);
  G('v28CloseCard(); S._v28 = null; render();');
  /* no card at all links one dish more than twice */
  let worst = { n: 0, id: '' };
  house.wines.forEach((w) => {
    const c = G('v28CardHtml(' + JSON.stringify(w.id) + ')');
    const n = {};
    (c.match(/href="\/table\/menu#d-[a-z0-9]{8}"/g) || []).forEach((h) => { n[h] = (n[h] || 0) + 1; });
    Object.keys(n).forEach((k) => { if (n[k] > worst.n) worst = { n: n[k], id: w.name }; });
  });
  check('no card on the list links one dish more than twice (worst ' + worst.n + ', ' + worst.id + ')', worst.n <= 2);
  /* the house door stands only once the shared read view takes { study: true } */
  check('the house door is not drawn while the shared readView takes three parameters', G('OOT.houseUI.readView.length') < 4
    ? G('v28StudyHtml()').indexOf('v28-housedoor') < 0 : true);
  G('var __rv = OOT.houseUI.readView, __rvOpts = null; OOT.houseUI.readView = function (root, h, hooks, opts) { __rvOpts = opts; };');
  const withDoor = G('v28StudyHtml()');
  const drewDoor = G('v28HouseRead({ getAttribute: function () { return null; }, setAttribute: function () { } })');
  check('with a study-aware readView the door stands below the sections and opens it with { study: true }', withDoor.indexOf('<details class="v28-q v28-housedoor"><summary>The house: must-knows, words and the table</summary>') >= 0
    && withDoor.indexOf('v28-housedoor') > withDoor.indexOf('id="v28-rows"') && drewDoor === true && G('JSON.stringify(__rvOpts)') === '{"study":true}');
  G('OOT.houseUI.readView = __rv;');

  /* ================================================================ */
  section('the drills are codex27\'s house rounds');
  G('var __locked = 0; startCellarDrill = function () { __locked++; throw new Error("locked"); }; startCellarRecite = function () { __locked++; throw new Error("locked"); };');
  G('S.view = "cellar"; v28DrillList();');
  check('Drill the list deals the house round through the quiz engine', G('S.view') === 'quiz' && G('S.pool.length') > 0 && G('S.pool.every(function (q) { return q.id.indexOf("h-") === 0; })'));
  check('and never calls startCellarDrill or startCellarRecite', G('__locked') === 0);
  G('S.view = "cellar"; startHouseSectionDrill(' + JSON.stringify(house.wines.find((w) => w.id === CHAMP).section) + ')');
  check('the section drill keeps to its section, and calls neither', G('__locked') === 0 && G('S.view') === 'quiz' && G('S.pool.length') > 0);
  G('S._again()');
  check('its Again rebuilds the section drill, not the locked one', G('__locked') === 0 && G('S.view') === 'quiz');

  /* ================================================================ */
  section('voice');
  G('V28_QUOTE = function () { return "QUOTED"; }; S._v28 = null; S.view = "cellar";');
  const drawn = [G('v28StudyHtml()')];
  G('S._v28.q = "sazerac"'); drawn.push(G('v28StudyHtml()')); G('S._v28.q = "zzzz"'); drawn.push(G('v28StudyHtml()')); G('S._v28.q = ""');
  houseIds.forEach((id) => drawn.push(G('v28CardHtml(' + JSON.stringify(id) + ')')));
  const strings = drawn.concat(deckFaces).join('\n') + '\n' + G('JSON.stringify(V28_WORDS)') + G('V25_MINE.filter(function (r) { return r.key === "ourlistcards"; }).map(function (r) { return r.name + " " + r.line(); }).join("")');
  const probs = voiceProblems(strings);
  check('every string codex28 draws (' + drawn.length + ' pages, ' + deckFaces.length + ' faces) passes voiceProblems', !probs.length, probs.join(', '));
  const src = fs.readFileSync(path.join(JS, 'codex28.js'), 'utf8');
  const srcProblems = voiceProblems(src);
  check('codex28.js itself: no long dash, no double hyphen, no retired word, no glyph, no level numeral', !srcProblems.length, srcProblems.join(', '));
  check('codex28.js has no en dash and no codepoint at or above U+2190', ![...src].some((ch) => ch.codePointAt(0) === 0x2013 || ch.codePointAt(0) >= 0x2190));
  check('codex28.js declares with var and function only', !/^\s*(let|const|class)\s/m.test(src) && src.indexOf('=>') < 0);
  check('codex28.js names nobody', !/Lizzy/.test(src));

  /* ================================================================ */
  section('no OOT at all');
  for (const [label, opts] of [['no location', { noLocation: true }], ['a location with no pathname', {}]]) {
    const N = makeSandbox({ codexStats: JSON.stringify({ cellar: [{ id: 'w-aaaaaaaa', ts: 1, producer: 'Krug', name: 'Grande Cuvee', vintage: 'NV', region: '', grapes: '', style: '', glass: '', bottle: '', note: '' }] }) }, opts);
    loadChain(N);
    check('the chain loads with no OOT and ' + label, N.G('typeof OOT') === 'undefined' && N.G('typeof v28StudyOn') === 'function');
    check('the study view does not show, cellarView is today\'s', N.G('v28StudyOn()') === false
      && N.G('(function () { var n = 0, o = v28StudyView; v28StudyView = function () { n++; return o(); }; cellarView(); v28StudyView = o; return n; })()') === 0);
    check('the deck deals nothing and the Mine row hides', N.G('startHouseDeck({})') === false && N.G('S.view') !== 'housedeck'
      && N.G('V25_MINE.filter(function (r) { return r.key === "ourlistcards"; })[0].show()') === false);
    check('no deep link is read and nothing is written', N.G('V28_WANT') === null && N.hist.replaced.length === 0);
  }

  /* ================================================================ */
  section('the card\'s single Back, with the consolidation (codex31) on top');
  if (fs.existsSync(path.join(JS, 'codex31.js'))) {
    const withNav = FILES.slice(0, FILES.indexOf('boot.js')).concat(['codex31.js', 'boot.js']);
    const N = bootDevice({ files: withNav, location: { href: 'http://localhost/codex/', pathname: '/codex/', search: '', hash: '' } });
    await settle(N);
    const nb = N.G('v28CardHtml(' + JSON.stringify(BERRES) + ')');
    check('the card draws no way back of its own: the Back control is the one', nb.length > 0 && nb.indexOf('data-v28="back"') < 0 && nb.indexOf('Back to the list') < 0);
    check('closing the card, the deck or the full list is the Back control\'s press',
      N.G('String(v28CloseCard)').indexOf('v31Back') >= 0 && N.G('String(v28DeckClose)').indexOf('v31Back') >= 0 && N.G('String(v29Close)').indexOf('v31Back') >= 0);
    check('codex28\'s popstate listener is replaced by codex31\'s one router', N.listeners.popstate.indexOf(N.G('v28OnPop')) < 0);
  } else check('no codex31 in this tree, so the card keeps its own way back', true);

  console.log('');
  if (failed) {
    console.log('check-study: ' + failed + ' of ' + (passed + failed) + ' checks FAILED');
    process.exit(1);
  }
  console.log('check-study: all ' + passed + ' checks pass');
  process.exit(0);
}

process.on('beforeExit', () => {
  console.error('check-study: the run ended before its summary (a case never settled)');
  process.exit(1);
});

main().catch((e) => {
  console.error('check-study: ' + (e && e.stack ? e.stack : e));
  process.exit(1);
});
