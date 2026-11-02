/**
 * THE WINE ATLAS MADE A COURSE, PROVED IN A SANDBOX (codex56, 2 November 2026). Work in progress.
 *
 * Loads the SHIPPED chain index.html loads (codex56.js put after codex55.js when the shell does not list it yet),
 * with the shared house engine and the pack, in check-card's loader (check-brennans's VM: a history that is a real
 * stack, a location that follows it), its fetch answering js/regions/<sheet>.json from the repo (or from a fixture
 * folder) so codex39's own loader reads the regions as the app does. It proves the layer section by section:
 *
 *   2. the course order: the Court's subjects in order, each map's regions then its countries, once each, then the
 *      rest of the atlas; Previous and Next across sheets on the article and the country page
 *   3. region study scheduled: codex3's rule on seeded grades, the due counts, Today's deck, the due drill, readiness
 *   4. the root: Start here and Continue, the study doors, every country's readiness line, codex55's sheets and list
 *      below, no reading fetched on a visit, the index's district counts
 *   5. the region page on Burgundy and Rioja: the study row, In one minute, the lazy map, eight districts and Show all
 *   6. the map quiz answered both ways, district cards, compare two regions, the drill chooser
 *   7. the folded addresses: the field map, the field atlas, the regions index, the answer links, the sheet's doors,
 *      a technique from the atlas
 *   8. an article off the map, from a fixture copy of the index carrying one such record
 *   9. the field atlas's spellings and dashes put right at display
 *  10. voice, the file, the shell
 *
 *   OOT_SHARED=... OOT_HOUSE_PACK=... node .wip/prove-course.cjs [jsDir]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ARGS = process.argv.slice(2);
const JS = path.resolve(ARGS.find((a) => a.charAt(0) !== '-') || path.join(__dirname, '..', 'js'));
const ROOT = path.join(JS, '..');
const SHARED = process.env.OOT_SHARED || path.join(__dirname, '..', '..', 'worldtable', 'static', 'shared');
const ENGINE = path.join(SHARED, 'oot-house.js');
const UI_FILE = path.join(SHARED, 'oot-house-ui.js');
const PACK_FILE = process.env.OOT_HOUSE_PACK || path.join(SHARED, 'packs', 'brennans-new-orleans.v1.oothouse.json');
for (const f of [ENGINE, UI_FILE, PACK_FILE]) {
  if (!fs.existsSync(f)) { console.error('prove-course: no ' + path.basename(f) + ' at ' + path.dirname(f)); process.exit(1); }
}
const CH = require(path.join(__dirname, '..', '.scripts', 'cms', 'chain.cjs'));
const NOW = Date.parse('2026-10-03T14:02:00.000Z');

let passed = 0, failed = 0;
function check(what, ok, detail) {
  if (ok) { passed++; console.log('  ok    ' + what); }
  else { failed++; console.log('  FAIL  ' + what + (detail ? '  :: ' + String(detail).slice(0, 700) : '')); }
}
function section(name) { console.log(''); console.log('--- ' + name + ' ---'); }
function seeded(start) {
  let s = start || 12345;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x80000000; };
}
const tick = (ms) => new Promise((r) => setTimeout(r, ms || 10));

/* check-producers-house.js's voiceProblems, the strictest, as check-card carries it */
const NUMERAL_RE = /\bLevel\s+(I|II|III|IV)\b/;
function voiceProblems(s) {
  const out = [];
  if (s.indexOf(String.fromCharCode(0x2014)) >= 0) out.push('a long dash (U+2014)');
  if (s.indexOf(String.fromCharCode(0x2013)) >= 0) out.push('an en dash (U+2013)');
  if (/&(mdash|ndash|#8212|#8211|#x2014|#x2013);/i.test(s)) out.push('a dash entity');
  if (/\x20-{2}\x20/.test(s)) out.push('a double hyphen');
  if (/practi[cs]e/i.test(s.replace(/(^|[^\w])Practise(?!\w)/g, '$1'))) out.push('the retired word for study');
  if (NUMERAL_RE.test(s)) out.push('a level numeral: ' + s.match(NUMERAL_RE)[0]);
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c >= 0x2190) { out.push('a mark U+' + c.toString(16).toUpperCase()); break; }
  }
  return out;
}
const unesc = (s) => String(s || '').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
/* what a page shows: its text and the words its controls carry */
function shown(html) {
  const said = [...String(html || '').matchAll(/\b(?:aria-label|placeholder|title)="([^"]*)"/g)].map((m) => m[1]);
  return unesc(String(html || '').replace(/<[^>]+>/g, ' ') + ' ' + said.join(' ')).replace(/\s+/g, ' ');
}

/* ---------------- check-card's loader: the sandbox, the engine, the chain ---------------- */
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
    /* the one addition to check-card's stub: the node methods the Library's earlier passes call (codex45's after) */
    after() { }, before() { }, prepend() { }, append() { },
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
  return { sandbox, ctx, G, store, H };
}

let FILES = CH.chainFiles(JS);
if (FILES.indexOf('codex56.js') < 0) FILES.splice(FILES.indexOf('codex55.js') + 1, 0, 'codex56.js');
const packText = fs.readFileSync(PACK_FILE, 'utf8');
const fetches = [];
/* opts.fixture: { 'data-regions.js': text, regions: { '<part>': text } } replaces those files as the device reads them */
async function bootDevice(opts) {
  const o = opts || {};
  const fx = o.fixture || {};
  const D = makeSandbox();
  if (o.seed) Object.keys(o.seed).forEach((k) => { D.store[k] = o.seed[k]; });
  vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), D.ctx, { filename: 'oot-house.js' });
  vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), D.ctx, { filename: 'oot-house-ui.js' });
  const lib = D.G('OOT.houseLib');
  D.sandbox.OOT.house = lib.createHouseApi(lib.mapStorage(new Map()), { win: D.sandbox, now: () => NOW, rand: seeded(21), from: 'codex' });
  D.fetched = [];
  D.sandbox.fetch = (url) => {
    const u = String(url || '');
    const m = /^js\/regions\/([a-z0-9-]+)\.json/.exec(u);
    if (m) {
      fetches.push(m[1]);
      D.fetched.push(m[1]);
      let body = fx.regions && fx.regions[m[1]];
      if (body == null) {
        const f = path.join(JS, 'regions', m[1] + '.json');
        if (!fs.existsSync(f)) return Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error('none')) });
        body = fs.readFileSync(f, 'utf8');
      }
      return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(body), json: () => Promise.resolve(JSON.parse(body)) });
    }
    return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(packText), json: () => Promise.resolve(JSON.parse(packText)) });
  };
  for (const f of FILES) {
    const text = (fx[f] != null) ? fx[f] : fs.readFileSync(path.join(JS, f), 'utf8');
    try { vm.runInContext(text, D.ctx, { filename: f }); }
    catch (e) { console.error('prove-course: js/' + f + ' failed to load: ' + e.message); process.exit(1); }
  }
  try { await D.G('typeof V27_LAST !== "undefined" ? V27_LAST : null'); } catch (e) { }
  try { await D.G('typeof V27_BOOT_PACK !== "undefined" ? V27_BOOT_PACK : null'); } catch (e) { }
  await tick(30);
  try { await D.G('typeof V27_WRITING !== "undefined" ? V27_WRITING : null'); } catch (e) { }
  await tick(30);
  /* a page's string, captured where codex39 or codex32 builds it */
  D.page = (prep) => String(D.G('(function () { var got = ""; var was = v39Build, was32 = v32Build; v39Build = function (h, a) { got = String(h || ""); return was(h, a); }; v32Build = function (h, a) { if (!got) got = String(h || ""); return was32(h, a); }; try { ' + prep + ' } finally { v39Build = was; v32Build = was32; } return got; })()') || '');
  D.J = (expr) => JSON.parse(D.G('JSON.stringify(' + expr + ')'));
  /* every part a page needs, read before the page is drawn */
  D.load = async (parts) => {
    D.G('(function () { ' + JSON.stringify(parts) + '.forEach(function (p) { v39LoadPart(p); }); })()');
    for (let i = 0; i < 80 && !D.G(JSON.stringify(parts) + '.every(function (p) { return v39PartReady(p); })'); i++) await tick(20);
  };
  return D;
}

/* the regions as the repo holds them */
const REC = {};
for (const f of fs.readdirSync(path.join(JS, 'regions'))) {
  if (!/\.json$/.test(f) || f === 'techniques.json') continue;
  Object.assign(REC, JSON.parse(fs.readFileSync(path.join(JS, 'regions', f), 'utf8')).records || {});
}
const fold = (s) => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
function treeNames(list, out) { (list || []).forEach((p) => { if (p && typeof p.name === 'string' && p.name.trim()) { out.push(p.name.trim()); treeNames(p.places, out); } }); return out; }
function countOf(arr) { const o = {}; arr.forEach((x) => { o[x] = (o[x] || 0) + 1; }); return o; }
const attr = (html, re) => [...String(html).matchAll(re)].map((m) => unesc(m[1]));
const CMS_DATA = (() => { const c = vm.createContext({}); vm.runInContext(fs.readFileSync(path.join(JS, 'data-cms.js'), 'utf8'), c); return c.CMS; })();

async function main() {
  const A = await bootDevice();
  console.log('prove-course: ' + FILES.length + ' scripts, codex56 at ' + (FILES.indexOf('codex56.js') + 1) + ' after ' + FILES[FILES.indexOf('codex56.js') - 1]);
  const drawn = [];

  /* ================================================================ */
  section('1. the load');
  check('codex56 ran: V56_WORDS, v56W and the course are defined', A.G('typeof V56_WORDS === "object" && typeof v56W === "function" && typeof v56Course === "function"'));
  check('the style element is written by the layer, id v56-style', fs.readFileSync(path.join(JS, 'codex56.js'), 'utf8').indexOf("css.id = 'v56-style'") > 0);

  /* ================================================================ */
  section('2. the course order');
  const course = A.J('v56Course().map(function (x) { return x.kind + ":" + x.key; })');
  /* the Court's order, computed here from the data alone */
  const want = [];
  const has = (k) => want.indexOf(k) >= 0;
  const regionSlugs = A.J('v39Regions().map(function (a) { return a.slug; })');
  const countryKeys = A.J('Object.keys(v39Countries()).filter(function (k) { return v39Country(k); })');
  CMS_DATA.subjects.forEach((s) => {
    (s.map.regions || []).forEach((r) => { if (regionSlugs.indexOf(r) >= 0 && !has('region:' + r)) want.push('region:' + r); });
    (s.map.countries || []).forEach((c) => { if (countryKeys.indexOf(c) >= 0 && !has('country:' + c)) want.push('country:' + c); });
  });
  const courtN = want.length;
  check('the course opens on the Court\'s order: every subject\'s map regions then its map countries, each once (' + courtN + ' steps)', JSON.stringify(course.slice(0, courtN)) === JSON.stringify(want), JSON.stringify({ got: course.slice(0, 8), want: want.slice(0, 8) }));
  check('it begins with Viticulture\'s map: Champagne, Burgundy, Bordeaux', course.slice(0, 3).join(' ') === 'region:champagne region:burgundy region:bordeaux', course.slice(0, 3).join(' '));
  const all = regionSlugs.map((s) => 'region:' + s).concat(countryKeys.map((k) => 'country:' + k));
  check('then the rest of the atlas: every region and every country once (' + course.length + ' of ' + all.length + ')', course.length === all.length && all.every((k) => course.indexOf(k) >= 0) && new Set(course).size === course.length, JSON.stringify(all.filter((k) => course.indexOf(k) < 0)));
  const near = A.J('(function () { var o = {}; ["rioja", "piedmont", "champagne"].forEach(function (s) { o[s] = v56Near("region", s); }); return o; })()');
  check('Previous and Next cross the sheets: Rioja (Spain, Winemaking\'s first) steps back to ' + (near.rioja.prev && near.rioja.prev.name) + ', the last of Viticulture\'s map, and on to Piedmont (Italy); Champagne has no Previous',
    near.rioja.prev && near.rioja.next && near.rioja.next.key === 'piedmont' && near.piedmont.prev.key === 'rioja' && !near.champagne.prev, JSON.stringify(near.rioja));
  const art = await (async () => { await A.load(['spain']); return A.page('S.view = "region"; S._v39region = "rioja"; v39RegionView();'); })();
  drawn.push(['rioja', art]);
  const acts = art.slice(art.lastIndexOf('<div class="v28-btnrow v39-acts">'));
  check('the article\'s own Previous and Next are the course\'s (codex39\'s sheet bound pair gone)', acts.indexOf('data-v39="prev"') < 0 && acts.indexOf('data-v39="next"') < 0
    && acts.indexOf('data-v56="course" data-kind="' + near.rioja.next.kind + '" data-key="' + near.rioja.next.key + '" id="v56-act-next"') > 0
    && acts.indexOf('data-v56="course" data-kind="' + near.rioja.prev.kind + '" data-key="' + near.rioja.prev.key + '" id="v56-act-prev"') > 0, acts.slice(0, 600));
  const step = A.J('(function () { v32Go({ view: "region", arg: "rioja" }, "push"); var n = history.length; V56_ACTS.course({ getAttribute: function (k) { return k === "data-kind" ? "region" : (k === "data-key" ? "piedmont" : null); } }); return { view: S.view, slug: S._v39region, hash: location.hash, n: history.length - n }; })()');
  check('a step to the next region moves the one screen on (a replace), to #/v/region/piedmont', step.view === 'region' && step.slug === 'piedmont' && step.hash === '#/v/region/piedmont' && step.n === 0, JSON.stringify(step));
  await A.load(['france']);
  const fr = A.page('S.view = "country"; S._v39country = "france"; v39CountryView();');
  drawn.push(['france', fr]);
  const frNear = A.J('v56Near("country", "france")');
  check('the country page carries the course\'s Previous and Next (France: ' + (frNear.prev && frNear.prev.name) + ', ' + (frNear.next && frNear.next.name) + ')', fr.indexOf('id="v56-act-next"') > 0 && fr.indexOf('data-key="' + frNear.next.key + '"') > 0 && fr.indexOf('id="v56-act-prev"') > 0, fr.slice(-500));
  check('a country page drawn whole is a step read, kept in the layer\'s slot', A.J('v56Rec().r.france') === 1 && A.G('v56IsRead({ kind: "country", key: "france" })'));
  const prog = A.J('v56Progress()');
  check('the progress reads the course: ' + prog.read + ' of ' + prog.n + ' read (Rioja, Piedmont and France, each drawn whole), the first unread Champagne', prog.read === 3 && prog.next && prog.next.key === 'champagne' && prog.at === 0, JSON.stringify(prog));

  /* ================================================================ */
  section('3. region study scheduled');
  const B = await bootDevice();
  const steps = B.J('(function () { var a = v56Step({}, true), b = v56Step(a, true), c = v56Step(b, true), d = v56Step(c, false); return [a, b, c, d]; })()');
  const day = (n) => B.G('v56AddDays(' + n + ')');
  check('codex3\'s rule, SM-2 lite: right one day, then three, then the interval times the ease (8); wrong, due today and the ease down a fifth',
    steps[0].iv === 1 && steps[0].due === day(1) && steps[1].iv === 3 && steps[2].iv === 8 && steps[2].ef === 2.65 && steps[3].iv === 0 && steps[3].n === 0 && steps[3].due === B.G('v56Today()') && steps[3].ef === 2.45, JSON.stringify(steps));
  /* two region cards graded on codex32's card screen, right then again */
  const graded = B.J('(function () { v32StartRun("region:burgundy", { keepOrder: true }); var r = S._v32run; var ids = [r.cards[r.deck[0]].id, r.cards[r.deck[1]].id]; r.flip = true; v32Grade(true); r.flip = true; v32Grade(false); var o = v56Rec(); return { ids: ids, a: o.c[ids[0]], b: o.c[ids[1]], g: v39CardRec() }; })()');
  check('a region card graded keeps codex39\'s grade and gains its due date: right, tomorrow; again, today (' + graded.ids.join(', ') + ')',
    graded.g[graded.ids[0]] === 'got' && graded.g[graded.ids[1]] === 'again' && graded.a.due === day(1) && graded.a.n === 1 && graded.b.due === B.G('v56Today()') && graded.b.n === 0, JSON.stringify(graded));
  const qa = B.J('(function () { var qs = v39Questions(["rioja"]); statRecord(qs[0], true); statRecord(qs[1], false); var o = v56Rec(); return { ids: [qs[0].id, qs[1].id], a: o.q[qs[0].id], b: o.q[qs[1].id], srs: [!!ST.srs[qKey(qs[0])], !!ST.srs[qKey(qs[1])]], stat: ST.q[qKey(qs[0])] }; })()');
  check('a region question answered gains its due date by the same rule (right tomorrow, wrong today), still outside codex3\'s rotation and still counted by codex2',
    qa.a && qa.a.due === day(1) && qa.b && qa.b.due === B.G('v56Today()') && !qa.srs[0] && !qa.srs[1] && qa.stat && qa.stat.c === 1, JSON.stringify(qa));
  check('a technique\'s question and a bank question are never scheduled here', B.G('(function () { var t = v46List()[0]; var q = t && t.questions && t.questions[0]; var bank = QUESTIONS[0]; if (q) statRecord(q, true); statRecord(bank, true); var o = v56Rec(); return !(q && o.q[q.id]) && !o.q[bank.id]; })()'));
  /* seeded grades: three cards and two questions due (yesterday and today), two cards and one question ahead */
  const seededDue = B.J('(function () { var o = v56Rec(); o.c = {}; o.q = {}; var y = v56AddDays(-1), t = v56Today(), f = v56AddDays(4); '
    + 'o.c["champagne/0"] = { ef: 2.5, iv: 1, n: 1, due: y }; o.c["champagne/1"] = { ef: 2.5, iv: 0, n: 0, due: t }; o.c["france/0"] = { ef: 2.3, iv: 3, n: 2, due: y }; o.c["champagne/2"] = { ef: 2.5, iv: 4, n: 2, due: f }; o.c["mosel/0"] = { ef: 2.5, iv: 8, n: 3, due: f }; '
    + 'var cq = v39Questions(["champagne"]); o.q[cq[0].id] = { ef: 2.5, iv: 1, n: 1, due: y }; o.q[cq[1].id] = { ef: 2.5, iv: 0, n: 0, due: t }; o.q[cq[2].id] = { ef: 2.5, iv: 3, n: 2, due: f }; v56Put(o); '
    + 'var d = v56Due(), c = v56Due("champagne"); return { cards: d.cards.map(function (x) { return x.id; }), qs: d.qs.length, total: d.total, champ: [c.cards.length, c.qs.length] }; })()');
  check('the due counts on seeded grades: 3 cards (Champagne\'s two and France\'s one) and 2 questions, 5 in all; Champagne alone 2 and 2',
    seededDue.cards.slice().sort().join(',') === 'champagne/0,champagne/1,france/0' && seededDue.qs === 2 && seededDue.total === 5 && seededDue.champ.join(',') === '2,2', JSON.stringify(seededDue));
  const deck = B.J('(function () { var d = v32DeckDef("regionsdue"); S.view = "deck"; S._v32deck = "regionsdue"; return { name: d.name, ids: d.cards.map(function (c) { return c.id; }), kind: d.kind, lit: v25NavWord(), parent: v32ParentRoute() }; })()');
  check('Today\'s region cards is a deck of the cards due, lit Wine Atlas, climbing to the root', deck.name === 'Today’s region cards' && deck.kind === 'region' && deck.ids.length === 3 && deck.lit === 'worldmap' && deck.parent.view === 'worldmap' && !deck.parent.arg, JSON.stringify(deck));
  const today = B.J('(function () { V56_ACTS.today({ getAttribute: function () { return null; } }); var a = { view: S.view, deck: S._v32run && S._v32run.deckId, n: S._v32run && S._v32run.total, lit: v25NavWord() }; return a; })()');
  check('Today\'s door deals the cards due first (3, on the card screen, lit Wine Atlas)', today.view === 'housedeck' && today.deck === 'regionsdue' && today.n === 3 && today.lit === 'worldmap', JSON.stringify(today));
  const dd = B.J('(function () { V56_ACTS.duedrill({ getAttribute: function () { return null; } }); return { view: S.view, n: S.pool.length, section: S.section, lit: v25NavWord(), ids: S.pool.map(function (q) { return q.id; }) }; })()');
  check('the questions due are a drill through the core engine (2, the regions\' section, lit Wine Atlas)', dd.view === 'quiz' && dd.n === 2 && dd.section === 'The regions' && dd.lit === 'worldmap', JSON.stringify(dd));
  B.G('S.mode = null; S.pool = []; S.view = "home";');
  /* readiness: a region's answers count for the subjects whose maps name it */
  const rd = B.J('(function () { var before = v53Readiness("rioja"); var q = v39Questions(["rioja"])[2]; ST.q[qKey(q)] = { c: 1, w: 0, s: 1 }; var after = v53Readiness("rioja"); var vit = v53Readiness("vinification"); return { b: before.regions, a: after.regions, met: [before.met, after.met], total: [before.total, after.total], vit: vit.regions, body: v53ReadyBody(v53Subject("rioja")) }; })()');
  const riojaQs = B.G('v39Questions(["rioja", "spain"]).length');
  check('readiness: Rioja\'s subject counts the questions of Rioja and Spain (' + riojaQs + '), one more right lifts it by one', rd.b.total === riojaQs && rd.a.met === rd.b.met + 1 && rd.met[1] === rd.met[0] + 1 && rd.total[0] === rd.total[1], JSON.stringify(rd).slice(0, 400));
  check('and Winemaking, whose map names Rioja too, counts it as well', rd.vit.met >= 1, JSON.stringify(rd.vit));
  check('the subject\'s readiness page names the regions\' questions', rd.body.indexOf('<dt>The regions’ questions</dt>') > 0 && rd.body.indexOf('The questions of the regions and countries on the subject’s map count too') > 0, rd.body.slice(0, 300));

  /* ================================================================ */
  section('4. the root opens on the learner');
  const C = await bootDevice();
  C.G('S.view = "worldmap"; S.wmap = null;');
  const hub0 = C.page('worldMapView();');
  drawn.push(['the root, a new learner', hub0]);
  await tick(200);
  check('a visit fetches no reading (' + C.fetched.length + ' files read)', C.fetched.length === 0 && C.G('v55Regions().every(function (a) { return !v39RecReady(a); })'), C.fetched.join(' '));
  const at0 = (h, x) => h.indexOf(x);
  check('Start here for a new learner: the course begins with Champagne, ' + C.G('v56Course().length') + ' steps', /<h2 class="v32-h2" id="v56-start-h" tabindex="-1">Start here<\/h2>/.test(hub0) && hub0.indexOf('data-v56="course" data-kind="region" data-key="champagne" id="v56-continue">Begin with Champagne</button>') > 0 && hub0.indexOf('data-go="v56course" id="v56-path"') > 0, hub0.slice(at0(hub0, 'v56-start'), at0(hub0, 'v56-start') + 500));
  const doorsS = hub0.slice(at0(hub0, 'v56-studydoors'), hub0.indexOf('</section>', at0(hub0, 'v56-studydoors')));
  const doorNames = attr(doorsS, /<span class="v25row-name">([^<]*)<\/span>/g);
  check('the study doors: ' + doorNames.join(', '), JSON.stringify(doorNames) === JSON.stringify(['Today’s region cards', 'Drill a country', 'Map quiz', 'District cards', 'Compare two regions'])
    && /data-v56="today" id="v56-today">[\s\S]*?Nothing due today\. New cards from Champagne\./.test(doorsS) && ['v56drill', 'v56mapquiz', 'v56districts', 'v56compare'].every((g) => doorsS.indexOf('data-go="' + g + '"') > 0), doorsS.slice(0, 600));
  const orderKeys = C.J('v55CountryOrder().map(function (r) { return r.key; })');
  const cRows = attr(hub0.slice(at0(hub0, 'v56-countryrows')), /data-v39="country" data-key="([^"]*)" id="v56-c-/g);
  check('every country once (' + cRows.length + '), in the order of the maps, with a readiness line', JSON.stringify(cRows) === JSON.stringify(orderKeys) && /0 of 13 read · 0 of \d+ cards known · 0 of \d+ questions right/.test(hub0), JSON.stringify(cRows.slice(0, 5)));
  check('codex55\'s country chips and its Field maps chip leave; its sheets and its full list stay below (17 sheet doors, every region)', hub0.indexOf('v55-countrychips') < 0 && hub0.indexOf('data-go="fieldatlas"') < 0 && attr(hub0, /data-v39="openmap" data-sheet="([^"]*)"/g).length === 17 && attr(hub0, /data-v39="region" data-slug="([^"]*)"/g).length === C.G('v39Regions().length'));
  check('the order: Start here, the study doors, the chips and the search, the countries, the sheets, every region',
    at0(hub0, 'v56-start') < at0(hub0, 'v56-studydoors') && at0(hub0, 'v56-studydoors') < at0(hub0, 'v55-chips') && at0(hub0, 'v55-chips') < at0(hub0, 'id="v55-find"') && at0(hub0, 'id="v55-find"') < at0(hub0, 'v56-countries') && at0(hub0, 'v56-countries') < at0(hub0, '<section class="v32-sec v55-sheets"') && at0(hub0, '<section class="v32-sec v55-sheets"') < at0(hub0, 'class="v32-sec v55-regions"'));
  C.G('v39Find("burgundy").districts = 84;');
  check('a district count from the index\'s field districts while the reading is away: ' + C.G('v55RegionLine(v39Find("burgundy"))'), C.G('v55RegionLine(v39Find("burgundy"))').indexOf('84 districts') === 0 && C.G('v55RegionLine(v39Find("rioja"))').indexOf('district') < 0);
  C.G('v55Filter({ querySelectorAll: function () { return []; }, querySelector: function () { return null; } }, "chablis")');
  for (let i = 0; i < 80 && !C.G('v55Regions().every(function (a) { return v39RecReady(a); })'); i++) await tick(25);
  check('the first search reads the districts of every region (' + new Set(C.fetched).size + ' files)', C.G('v55Regions().every(function (a) { return v39RecReady(a); })'), C.fetched.join(' '));
  /* the readiness on a device with grades (B) and the Continue on one with reads (A) */
  const bSpain = B.J('(function () { var row = v55CountryOrder().filter(function (r) { return r.key === "spain"; })[0]; return v56CountryReady(row); })()');
  const bWant = B.J('(function () { var qs = v39Questions(v39SheetKeys("spain")); return { t: qs.length, q: qs.filter(function (q) { return v56Right(q.id); }).length, c: v39SheetCards("spain").length, n: v39SheetRegions("spain").length + 1 }; })()');
  check('Spain\'s line on a device with grades: ' + B.G('v56ReadyLine(v56CountryReady(v55CountryOrder().filter(function (r) { return r.key === "spain"; })[0]))'), bSpain.q === bWant.q && bSpain.q >= 2 && bSpain.t === bWant.t && bSpain.c === bWant.c && bSpain.n === bWant.n, JSON.stringify([bSpain, bWant]));
  A.G('S.view = "worldmap"; S.wmap = null;');
  const hubA = A.page('worldMapView();');
  drawn.push(['the root, a learner on her way', hubA]);
  check('Continue on a device with three steps read: step 1 of ' + A.G('v56Course().length') + ', Champagne, the first unread', /id="v56-start-h" tabindex="-1">Continue<\/h2>/.test(hubA) && hubA.indexOf('Step 1 of ' + A.G('v56Course().length') + ' in the Court’s order. 3 of ') > 0 && hubA.indexOf('id="v56-continue">Continue with Champagne</button>') > 0, hubA.slice(at0(hubA, 'v56-start'), at0(hubA, 'v56-start') + 400));
  const hubB = B.page('S.view = "worldmap"; S.wmap = null; worldMapView();');
  check('the due count on the root with seeded grades: 3 cards and 2 questions due, the questions their own door', /data-v56="today" id="v56-today"><span class="v25row-name">Today’s region cards<\/span><span class="v25row-line">3 cards and 2 questions due<\/span>/.test(hubB) && hubB.indexOf('data-v56="duedrill" id="v56-duedrill"') > 0);
  const cp = A.page('v56Go("v56course", "");');
  drawn.push(['the whole course', cp]);
  const cpRows = attr(cp, /data-v56="course" data-kind="([a-z]+)" data-key="/g).length;
  check('the whole course: ' + cpRows + ' steps under the Court\'s subjects, first Grape Growing: Viticulture, then the rest of the atlas', cpRows === A.G('v56Course().length') && cp.indexOf('>Grape Growing: Viticulture</h3>') > 0 && cp.indexOf('>The rest of the atlas</h3>') > 0 && cp.indexOf('Step 1, to read') > 0 && cp.indexOf('Step ' + (A.G('v56At("region", "rioja")') + 1) + ', read') > 0);
  check('its address #/v/v56course, lit Wine Atlas, its cold parent the root', A.G('location.hash') === '#/v/v56course' && A.G('v25NavWord()') === 'worldmap' && A.G('JSON.stringify(v32ParentRoute())') === JSON.stringify({ view: 'worldmap', arg: '' }));
}

main().then(() => {
  console.log('');
  if (failed) { console.log('prove-course: ' + failed + ' of ' + (passed + failed) + ' checks FAILED'); process.exit(1); }
  console.log('prove-course: all ' + passed + ' checks passed');
  process.exit(0);
}).catch((e) => { console.error(e && e.stack || e); process.exit(1); });
