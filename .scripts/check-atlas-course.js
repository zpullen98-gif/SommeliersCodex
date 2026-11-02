/**
 * THE WINE ATLAS MADE A COURSE, HELD TO ITS DESIGN (codex56, 2 November 2026).
 *
 * The owner asked for the Wine Atlas to be reviewed, expanded and made easier to learn from. codex56 makes it a
 * course: the Court's subjects in their order as a guided path, study at the top of the root and of every region page,
 * region cards and questions on a schedule with readiness, a map quiz, district cards and compare two regions drawn
 * from the data already there, the duplicated screens folded, and the fourteen places the Court names that the atlas
 * lacked placed under their countries until their field maps are drawn. This loads the SHIPPED chain index.html loads
 * (through codex56), with the shared house engine and the pack, in check-card's loader (check-brennans's VM: a history
 * that is a real stack, a location that follows it), its fetch answering js/regions/<sheet>.json from the tree so
 * codex39's own loader reads the regions as the app does. It asserts:
 *
 *   1. the load: codex56 runs, its words and its builders defined, straight after codex55 and before boot
 *   2. the course order: the Court's subjects in order, each map's regions then its countries, once each, equal to
 *      the order computed here from data-cms.js alone; then every other region and country once, so all of the
 *      atlas has a place; Previous and Next across the sheets on the article and the country page; a step moved on
 *      in place; a country page drawn whole read; the progress and its first unread step
 *   3. region study scheduled: codex3's rule (SM-2 lite) step by step; a region card graded and a region question
 *      answered gain their due dates beside codex39's grade and codex2's count; no technique's or bank question
 *      scheduled; on seeded grades the due counts, Today's deck, Today's door and the due drill; readiness: every one
 *      of the Court's subjects counts the questions of every region and country its map names, one more right
 *      lifting it by one, and the readiness page saying so
 *   4. the root: no reading fetched on a visit; Start here for a new learner, Continue for one on her way, The course
 *      is read once every step is; the five study doors with the due line; every country once, in the order of the
 *      maps, with its readiness line; codex55's country chips and Field maps chip gone, its search, sheets and full
 *      list below, in that order; every region's district count from the index, equal to its reading's; the first
 *      search reads every reading; the whole course as its own page and address
 *   5. the region page: on Burgundy and Rioja the study row, its jumps landing, the order of the page, the lazy map
 *      and The districts eight with Show all; on every region with a reading, In one minute drawn from the record's
 *      own fields (the climate in a line, the main grapes, the ladder, one exam line, one trap) and its step
 *   6. the drills: the map quiz on Burgundy answered both ways and kept for the chooser; on every field map the quiz
 *      deals, each place's point the dot its artwork draws and inside the crop that hides the key; district cards on
 *      every region equal to the reading's places with a note at the Certified depth, their deck graded and
 *      scheduled; the district chooser's counts the index's; compare drawn from each record; drill a country
 *   7. the folds: the field map, the field atlas and the regions index answering as the region page, the country page
 *      and the root, cold and warm; answer links to the region page; the map holder's field notes and offline copy;
 *      the sheet's study doors; a technique opened from the atlas lit Wine Atlas and climbing back to it
 *   8. the fourteen off the map: exactly the roster's MORE list in the index (mapless 1, no index, no field map); each
 *      on the root under its country with its district count and field map to come, in the Court's part of the course
 *      under a subject whose map names it with Previous and Next, on its page with its country's sheet, the line that
 *      its field map is to come, a Map and no Map quiz, every place of its reading in The districts and In one minute
 *      from its record, and on its country page
 *   9. the field atlas shown cleanly: its American spellings and en dashes put right where codex45 hands a map out,
 *      the data left as written
 *  10. voice and the file: V56_WORDS and every page drawn here through check-producers-house's voiceProblems, the
 *      strictest (the tab word Practise excepted; a mark at or above U+2190 in a reading's or a map's own field is
 *      the data's), no superlative and no American spelling among the words; codex56.js free of every dash, naming
 *      nobody, shipping no key and no model name, declaring with var and function only, every wrapper typeof
 *      guarded; this gate carries no dash
 *  11. the shell and the chain rule: index.html loads codex56.js once with ?v=, after codex55.js and before boot.js;
 *      sw.js is codex-v115 or later and lists it after codex55.js; every list in a gate here that names codex55.js
 *      names codex56.js straight after it
 *
 *   node .scripts/check-atlas-course.js [jsDir]
 *
 * jsDir defaults to this repo's js/; the site's check-wings may pass the wing's codex/js. Needs the shared engine
 * (OOT_SHARED, else ../worldtable/static/shared) and the pack (OOT_HOUSE_PACK, else the pack beside the engine).
 * A tree with no codex56.js is SKIPPED. Exits non-zero if any check fails. The last line is the verdict.
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
  if (!fs.existsSync(f)) { console.error('check-atlas-course: no ' + path.basename(f) + ' at ' + path.dirname(f) + ' (set OOT_SHARED or OOT_HOUSE_PACK)'); process.exit(1); }
}
if (!fs.existsSync(path.join(JS, 'codex56.js'))) {
  console.log('check-atlas-course: no codex56.js in ' + JS + ', SKIPPED');
  process.exit(0);
}
const CH = require(path.join(__dirname, 'cms', 'chain.cjs'));
const ROSTER = require(path.join(__dirname, 'regions', 'roster.cjs'));
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
/* what a page shows: its text and the words its controls and pictures carry */
function shown(html) {
  const said = [...String(html || '').matchAll(/\b(?:aria-label|placeholder|title|alt)="([^"]*)"/g)].map((m) => m[1]);
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

const FILES = CH.chainFiles(JS);
const packText = fs.readFileSync(PACK_FILE, 'utf8');
/* opts.hash: the address the device opens on; opts.seed: localStorage before the chain loads */
async function bootDevice(opts) {
  const o = opts || {};
  const D = makeSandbox();
  if (o.seed) Object.keys(o.seed).forEach((k) => { D.store[k] = o.seed[k]; });
  if (o.hash) D.sandbox.history.replaceState(null, '', '/codex/' + o.hash);
  vm.runInContext(fs.readFileSync(ENGINE, 'utf8'), D.ctx, { filename: 'oot-house.js' });
  vm.runInContext(fs.readFileSync(UI_FILE, 'utf8'), D.ctx, { filename: 'oot-house-ui.js' });
  const lib = D.G('OOT.houseLib');
  D.sandbox.OOT.house = lib.createHouseApi(lib.mapStorage(new Map()), { win: D.sandbox, now: () => NOW, rand: seeded(21), from: 'codex' });
  /* the pack for the house; a region's reading from the tree, as the app fetches it */
  D.fetched = [];
  D.sandbox.fetch = (url) => {
    const u = String(url || '');
    const m = /^js\/regions\/([a-z0-9-]+)\.json/.exec(u);
    if (m) {
      D.fetched.push(m[1]);
      const f = path.join(JS, 'regions', m[1] + '.json');
      if (!fs.existsSync(f)) return Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error('none')) });
      const body = fs.readFileSync(f, 'utf8');
      return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(body), json: () => Promise.resolve(JSON.parse(body)) });
    }
    return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(packText), json: () => Promise.resolve(JSON.parse(packText)) });
  };
  for (const f of FILES) {
    try { vm.runInContext(fs.readFileSync(path.join(JS, f), 'utf8'), D.ctx, { filename: f }); }
    catch (e) { console.error('check-atlas-course: js/' + f + ' failed to load: ' + e.message); process.exit(1); }
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
    for (let i = 0; i < 120 && !D.G(JSON.stringify(parts) + '.every(function (p) { return v39PartReady(p); })'); i++) await tick(20);
  };
  D.allParts = () => D.J('(function () { var p = {}; v39Regions().forEach(function (a) { p[v39PartName(a)] = 1; }); Object.keys(v39Countries()).forEach(function (k) { var c = v39Country(k); if (c) p[v39PartName(c)] = 1; }); return Object.keys(p); })()');
  return D;
}

/* the regions as the tree holds them */
const REC = {};
for (const f of fs.readdirSync(path.join(JS, 'regions'))) {
  if (!/\.json$/.test(f) || f === 'techniques.json') continue;
  Object.assign(REC, JSON.parse(fs.readFileSync(path.join(JS, 'regions', f), 'utf8')).records || {});
}
const fold = (s) => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
function treeNames(list, out) { (list || []).forEach((p) => { if (p && typeof p.name === 'string' && p.name.trim()) { out.push(p.name.trim()); treeNames(p.places, out); } }); return out; }
const attr = (html, re) => [...String(html).matchAll(re)].map((m) => unesc(m[1]));
const CMS_DATA = (() => { const c = vm.createContext({}); vm.runInContext(fs.readFileSync(path.join(JS, 'data-cms.js'), 'utf8'), c); return c.CMS; })();
const INDEX = (() => { const c = vm.createContext({}); vm.runInContext(fs.readFileSync(path.join(JS, 'data-regions.js'), 'utf8'), c); return JSON.parse(JSON.stringify(c.REGIONS)); })();
const str = (s) => (typeof s === 'string' ? s.trim() : '');
const and = (l) => (l.length < 2 ? (l[0] || '') : l.slice(0, -1).join(', ') + ' and ' + l[l.length - 1]);
const firstS = (t) => { const x = /^(.+?[.!?])(\s|$)/.exec(String(t).split(/\n\s*\n/)[0]); return x ? x[1] : String(t).split(/\n\s*\n/)[0]; };
const lineS = (t) => { const p = String(t).trim().split(/\n\s*\n/)[0] || ''; const one = firstS(p); if (one.length >= 60 || one.length >= p.length) return one; const two = firstS(p.slice(one.length).trim()); return two ? one + ' ' + two : one; };
/* In one minute, computed here from the record's own fields */
function minuteWant(rec) {
  const rows = [];
  const t = rec.terroir || {};
  if (str(t.climate)) rows.push(['The climate', lineS(str(t.climate))]);
  const gs = (rec.grapes || []).filter((g) => g && str(g.name));
  const lead = gs.filter((g) => g.role === 'lead');
  const grapes = (lead.length ? lead : gs).slice(0, 4).map((g) => str(g.name));
  if (grapes.length) rows.push(['The main grapes', and(grapes)]);
  const tiers = ((rec.law && rec.law.tiers) || []).filter((x) => Array.isArray(x) && str(x[0])).map((x) => str(x[0])).slice(0, 5);
  if (tiers.length) rows.push(['The ladder', tiers.join(' · ')]);
  const exam = (rec.exam || []).filter((x) => str(x))[0];
  if (exam) rows.push(['One exam line', str(exam)]);
  const trap = (rec.traps || []).filter((x) => str(x))[0];
  if (trap) rows.push(['One trap', str(trap)]);
  return rows;
}
function minuteGot(html) {
  const at = html.indexOf('<section class="card v56 v56-minute"');
  const minute = at >= 0 ? html.slice(at, html.indexOf('</section>', at)) : '';
  const dts = attr(minute, /<dt>([^<]*)<\/dt>/g), dds = attr(minute, /<dd>([^<]*)<\/dd>/g);
  return { minute, rows: dts.map((d, i) => [d, dds[i]]) };
}
/* a region's places with a note, at the Certified depth, once a folded name, in the reading's order */
function districtWant(rec) {
  const out = [], seen = {};
  const walk = (l) => (l || []).forEach((p) => {
    if (!p || !str(p.name)) return;
    const k = fold(p.name);
    if (k && str(p.note) && !seen[k] && p.depth !== 'advanced' && p.depth !== 'master') { seen[k] = 1; out.push([str(p.name), str(p.note)]); }
    walk(p.places);
  });
  walk(rec.places);
  return out;
}
const svgDots = {};
function dotsOf(file) {
  if (!svgDots[file]) {
    const svg = fs.readFileSync(path.join(ROOT, file), 'utf8');
    svgDots[file] = [...svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="3\.2"/g)].map((d) => [Number(d[1]), Number(d[2])]);
  }
  return svgDots[file];
}

async function main() {
  const A = await bootDevice();
  console.log('check-atlas-course: ' + FILES.length + ' scripts from ' + path.join(ROOT, 'index.html') + ', codex56 at ' + (FILES.indexOf('codex56.js') + 1) + ' after ' + FILES[FILES.indexOf('codex56.js') - 1]);
  const drawn = [];

  /* ================================================================ */
  section('1. the load');
  check('the chain index.html loads holds codex56.js straight after codex55.js, boot.js straight after it', FILES.indexOf('codex56.js') === FILES.indexOf('codex55.js') + 1 && FILES.indexOf('boot.js') === FILES.indexOf('codex56.js') + 1, FILES.slice(-4).join(' '));
  check('codex56 ran: V56_WORDS, v56W, the course, the schedule, the views and the drills are defined',
    A.G('typeof V56_WORDS === "object" && typeof v56W === "function" && typeof v56Course === "function" && typeof v56Step === "function" && typeof v56Due === "function" && typeof V56_VIEWS === "object" && typeof v56QuizView === "function" && typeof v56DistrictCards === "function" && typeof v56CmpHtml === "function"'));
  check('the style element is written by the layer, id v56-style', fs.readFileSync(path.join(JS, 'codex56.js'), 'utf8').indexOf("css.id = 'v56-style'") > 0);
  check('its views (the course, the map quiz, district cards, compare, drill a country) are registered, owned and lit Wine Atlas, each with an address',
    A.G('["v56course", "v56mapquiz", "v56districts", "v56compare", "v56drill"].every(function (k) { return V56_VIEWS[k] && V32_OWNER[k] === "worldmap" && V25_AREA[k] === "worldmap" && typeof V25_GO[k] === "function"; })'));

  /* ================================================================ */
  section('2. the course order');
  const course = A.J('v56Course().map(function (x) { return x.kind + ":" + x.key; })');
  const regionSlugs = A.J('v39Regions().map(function (a) { return a.slug; })');
  const countryKeys = A.J('Object.keys(v39Countries()).filter(function (k) { return v39Country(k); })');
  /* the Court's order, computed here from data-cms.js alone */
  const want = [], wantSubject = {};
  const has = (k) => want.indexOf(k) >= 0;
  CMS_DATA.subjects.forEach((s) => {
    const map = s.map || {};
    (map.regions || []).forEach((r) => { if (regionSlugs.indexOf(r) >= 0 && !has('region:' + r)) { want.push('region:' + r); wantSubject['region:' + r] = s.id; } });
    (map.countries || []).forEach((c) => { if (countryKeys.indexOf(c) >= 0 && !has('country:' + c)) { want.push('country:' + c); wantSubject['country:' + c] = s.id; } });
  });
  const courtN = want.length;
  const subjOf = A.J('v56Course().map(function (x) { return x.subject; })');
  check('the course opens on the Court\'s order: the ' + CMS_DATA.subjects.length + ' subjects in order, each map\'s regions then its countries, each once (' + courtN + ' steps)',
    courtN > 100 && JSON.stringify(course.slice(0, courtN)) === JSON.stringify(want) && want.every((k, i) => subjOf[i] === wantSubject[k]), JSON.stringify({ got: course.slice(0, 8), want: want.slice(0, 8) }));
  check('it begins with Viticulture\'s map: Champagne, Burgundy, Bordeaux', course.slice(0, 3).join(' ') === 'region:champagne region:burgundy region:bordeaux', course.slice(0, 3).join(' '));
  const all = regionSlugs.map((s) => 'region:' + s).concat(countryKeys.map((k) => 'country:' + k));
  check('then the rest of the atlas, in the order of the maps: every region (' + regionSlugs.length + ') and every country (' + countryKeys.length + ') once, ' + course.length + ' steps', course.length === all.length && all.every((k) => course.indexOf(k) >= 0) && new Set(course).size === course.length && subjOf.slice(courtN).every((s) => s === ''), JSON.stringify(all.filter((k) => course.indexOf(k) < 0)));
  const near = A.J('(function () { var o = {}; ["rioja", "piedmont", "champagne"].forEach(function (s) { o[s] = v56Near("region", s); }); return o; })()');
  const lastOf = course[course.length - 1].split(':');
  check('Previous and Next cross the sheets: Rioja (Spain) steps on to Piedmont (Italy), Piedmont back to Rioja; Champagne has no Previous, the last step no Next',
    near.rioja.next && near.rioja.next.key === 'piedmont' && near.piedmont.prev.key === 'rioja' && !near.champagne.prev && !A.J('v56Near(' + JSON.stringify(lastOf[0]) + ', ' + JSON.stringify(lastOf[1]) + ').next'), JSON.stringify(near.rioja));
  await A.load(['spain']);
  const art = A.page('S.view = "region"; S._v39region = "rioja"; v39RegionView();');
  drawn.push(['rioja', art]);
  const acts = art.slice(art.lastIndexOf('<div class="v28-btnrow v39-acts">'));
  check('the article\'s own Previous and Next are the course\'s (codex39\'s sheet bound pair gone)', acts.indexOf('data-v39="prev"') < 0 && acts.indexOf('data-v39="next"') < 0
    && acts.indexOf('data-v56="course" data-kind="' + near.rioja.next.kind + '" data-key="' + near.rioja.next.key + '" id="v56-act-next"') > 0
    && acts.indexOf('data-v56="course" data-kind="' + near.rioja.prev.kind + '" data-key="' + near.rioja.prev.key + '" id="v56-act-prev"') > 0, acts.slice(0, 600));
  const step = A.J('(function () { v32Go({ view: "region", arg: "rioja" }, "push"); var n = history.length; V56_ACTS.course({ getAttribute: function (k) { return k === "data-kind" ? "region" : (k === "data-key" ? "piedmont" : null); } }); return { view: S.view, slug: S._v39region, hash: location.hash, n: history.length - n }; })()');
  check('a step to the next region moves the one screen on (a replace), to #/v/region/piedmont', step.view === 'region' && step.slug === 'piedmont' && step.hash === '#/v/region/piedmont' && step.n === 0, JSON.stringify(step));
  const toCountry = A.J('(function () { var n = history.length; V56_ACTS.course({ getAttribute: function (k) { return k === "data-kind" ? "country" : (k === "data-key" ? "italy" : null); } }); return { view: S.view, key: S._v39country, n: history.length - n }; })()');
  check('a step from a region to a country page is pushed', toCountry.view === 'country' && toCountry.key === 'italy' && toCountry.n === 1, JSON.stringify(toCountry));
  await A.load(['france']);
  const fr = A.page('S.view = "country"; S._v39country = "france"; v39CountryView();');
  drawn.push(['france', fr]);
  const frNear = A.J('v56Near("country", "france")');
  check('the country page carries the course\'s Previous and Next (France: ' + (frNear.prev && frNear.prev.name) + ', ' + (frNear.next && frNear.next.name) + ')', fr.indexOf('id="v56-act-next"') > 0 && fr.indexOf('data-key="' + frNear.next.key + '"') > 0 && fr.indexOf('id="v56-act-prev"') > 0, fr.slice(-500));
  check('a country page drawn whole is a step read, kept in the layer\'s slot', A.J('v56Rec().r.france') === 1 && A.G('v56IsRead({ kind: "country", key: "france" })'));
  const prog = A.J('v56Progress()');
  check('the progress reads the course: ' + prog.read + ' of ' + prog.n + ' read (Rioja, Piedmont and France, each drawn whole), the first unread Champagne', prog.read === 3 && prog.n === course.length && prog.next && prog.next.key === 'champagne' && prog.at === 0, JSON.stringify(prog));

  /* ================================================================ */
  section('3. region study scheduled');
  const B = await bootDevice();
  const steps = B.J('(function () { var a = v56Step({}, true), b = v56Step(a, true), c = v56Step(b, true), d = v56Step(c, false), e = v56Step({ ef: 1.35, iv: 0, n: 0 }, false), f = v56Step({ ef: 2.78, iv: 10, n: 4 }, true); return [a, b, c, d, e, f]; })()');
  const day = (n) => B.G('v56AddDays(' + n + ')');
  check('codex3\'s rule, SM-2 lite: right one day, then three, then the interval times the ease (8); wrong, due today and the ease down a fifth',
    steps[0].iv === 1 && steps[0].due === day(1) && steps[1].iv === 3 && steps[1].due === day(3) && steps[2].iv === 8 && steps[2].due === day(8) && steps[2].ef === 2.65 && steps[3].iv === 0 && steps[3].n === 0 && steps[3].due === B.G('v56Today()') && steps[3].ef === 2.45, JSON.stringify(steps.slice(0, 4)));
  check('the ease held between 1.3 and 2.8', steps[4].ef === 1.3 && steps[5].ef === 2.8 && steps[5].iv === 28, JSON.stringify(steps.slice(4)));
  const graded = B.J('(function () { v32StartRun("region:burgundy", { keepOrder: true }); var r = S._v32run; var ids = [r.cards[r.deck[0]].id, r.cards[r.deck[1]].id]; r.flip = true; v32Grade(true); r.flip = true; v32Grade(false); var o = v56Rec(); return { ids: ids, a: o.c[ids[0]], b: o.c[ids[1]], g: v39CardRec() }; })()');
  check('a region card graded keeps codex39\'s grade and gains its due date: right, tomorrow; again, today (' + graded.ids.join(', ') + ')',
    graded.g[graded.ids[0]] === 'got' && graded.g[graded.ids[1]] === 'again' && graded.a.due === day(1) && graded.a.n === 1 && graded.b.due === B.G('v56Today()') && graded.b.n === 0, JSON.stringify(graded));
  const qa = B.J('(function () { var qs = v39Questions(["rioja"]); statRecord(qs[0], true); statRecord(qs[1], false); var o = v56Rec(); return { ids: [qs[0].id, qs[1].id], a: o.q[qs[0].id], b: o.q[qs[1].id], srs: [!!ST.srs[qKey(qs[0])], !!ST.srs[qKey(qs[1])]], stat: ST.q[qKey(qs[0])] }; })()');
  check('a region question answered gains its due date by the same rule (right tomorrow, wrong today), still outside codex3\'s rotation and still counted by codex2',
    qa.a && qa.a.due === day(1) && qa.b && qa.b.due === B.G('v56Today()') && !qa.srs[0] && !qa.srs[1] && qa.stat && qa.stat.c === 1, JSON.stringify(qa));
  check('a technique\'s question and a bank question are never scheduled here', B.G('(function () { var t = v46List()[0]; var q = t && t.questions && t.questions[0]; var bank = QUESTIONS[0]; if (q) statRecord(q, true); statRecord(bank, true); var o = v56Rec(); return !!q && !o.q[q.id] && !o.q[bank.id]; })()'));
  const atlasQ = B.J('(function () { var ids = v56AtlasQs(); var n = 0; v39Regions().forEach(function (a) { n += (a.questions || []).length; }); return { ids: Object.keys(ids).length, region: Object.keys(ids).every(function (k) { return /^r-/.test(k); }) }; })()');
  check('the atlas\'s questions by id: ' + atlasQ.ids + ', every one a region\'s or a country\'s', atlasQ.ids > 1000 && atlasQ.region, JSON.stringify(atlasQ));
  /* seeded grades: three cards and two questions due (yesterday and today), two cards and one question ahead */
  const seededDue = B.J('(function () { var o = v56Rec(); o.c = {}; o.q = {}; var y = v56AddDays(-1), t = v56Today(), f = v56AddDays(4); '
    + 'o.c["champagne/0"] = { ef: 2.5, iv: 1, n: 1, due: y }; o.c["champagne/1"] = { ef: 2.5, iv: 0, n: 0, due: t }; o.c["france/0"] = { ef: 2.3, iv: 3, n: 2, due: y }; o.c["champagne/2"] = { ef: 2.5, iv: 4, n: 2, due: f }; o.c["mosel/0"] = { ef: 2.5, iv: 8, n: 3, due: f }; o.c["nowhere/0"] = { ef: 2.5, iv: 0, n: 0, due: y }; '
    + 'var cq = v39Questions(["champagne"]); o.q[cq[0].id] = { ef: 2.5, iv: 1, n: 1, due: y }; o.q[cq[1].id] = { ef: 2.5, iv: 0, n: 0, due: t }; o.q[cq[2].id] = { ef: 2.5, iv: 3, n: 2, due: f }; o.q["r-nowhere"] = { ef: 2.5, iv: 0, n: 0, due: y }; v56Put(o); '
    + 'var d = v56Due(), c = v56Due("champagne"); return { cards: d.cards.map(function (x) { return x.id; }), qs: d.qs.length, total: d.total, champ: [c.cards.length, c.qs.length] }; })()');
  check('the due counts on seeded grades: 3 cards (Champagne\'s two and France\'s one) and 2 questions, 5 in all; Champagne alone 2 and 2; an id the atlas no longer holds is left out',
    seededDue.cards.slice().sort().join(',') === 'champagne/0,champagne/1,france/0' && seededDue.qs === 2 && seededDue.total === 5 && seededDue.champ.join(',') === '2,2', JSON.stringify(seededDue));
  const deck = B.J('(function () { var d = v32DeckDef("regionsdue"); S.view = "deck"; S._v32deck = "regionsdue"; return { name: d.name, ids: d.cards.map(function (c) { return c.id; }), kind: d.kind, lit: v25NavWord(), parent: v32ParentRoute() }; })()');
  check('Today\'s region cards is a deck of the cards due, lit Wine Atlas, climbing to the root', deck.name === 'Today’s region cards' && deck.kind === 'region' && deck.ids.length === 3 && deck.lit === 'worldmap' && deck.parent.view === 'worldmap' && !deck.parent.arg, JSON.stringify(deck));
  const today = B.J('(function () { V56_ACTS.today({ getAttribute: function () { return null; } }); return { view: S.view, deck: S._v32run && S._v32run.deckId, n: S._v32run && S._v32run.total, lit: v25NavWord() }; })()');
  check('Today\'s door deals the cards due first (3, on the card screen, lit Wine Atlas)', today.view === 'housedeck' && today.deck === 'regionsdue' && today.n === 3 && today.lit === 'worldmap', JSON.stringify(today));
  const dd = B.J('(function () { V56_ACTS.duedrill({ getAttribute: function () { return null; } }); return { view: S.view, n: S.pool.length, section: S.section, lit: v25NavWord() }; })()');
  check('the questions due are a drill through the core engine (2, the regions\' section, lit Wine Atlas)', dd.view === 'quiz' && dd.n === 2 && dd.section === 'The regions' && dd.lit === 'worldmap', JSON.stringify(dd));
  B.G('S.mode = null; S.pool = []; S.view = "home";');
  /* readiness: every subject counts the questions of every region and country its map names */
  const ready = B.J('(function () { return v53Subjects().map(function (s) { var r = v53Readiness(s.id); return { id: s.id, regions: r.regions, met: r.met, total: r.total }; }); })()');
  const readyBad = [];
  ready.forEach((r) => {
    const s = CMS_DATA.subjects.filter((x) => x.id === r.id)[0];
    const keys = ((s.map || {}).regions || []).concat((s.map || {}).countries || []).filter((k) => regionSlugs.indexOf(k) >= 0 || countryKeys.indexOf(k) >= 0);
    const n = B.G('v39Questions(' + JSON.stringify(keys) + ').length');
    if (!r.regions || r.regions.total !== n) readyBad.push(r.id + ' ' + (r.regions && r.regions.total) + '/' + n);
  });
  check('every subject (' + ready.length + ') counts the questions of the regions and countries its map names', ready.length === CMS_DATA.subjects.length && readyBad.length === 0, readyBad.slice(0, 6).join(' | '));
  const rioja = CMS_DATA.subjects.filter((x) => (x.map.regions || []).indexOf('rioja') >= 0).map((x) => x.id);
  const rd = B.J('(function () { var ids = ' + JSON.stringify(rioja) + '; var before = ids.map(function (id) { return v53Readiness(id); }); var q = v39Questions(["rioja"])[2]; ST.q[qKey(q)] = { c: 1, w: 0, s: 1 }; var after = ids.map(function (id) { return v53Readiness(id); }); return { b: before, a: after, body: v53ReadyBody(v53Subject(ids[0])) }; })()');
  check('one more of Rioja\'s questions right lifts every subject whose map names Rioja by one (' + rioja.join(', ') + ')', rioja.length >= 2 && rd.a.every((x, i) => x.regions.met === rd.b[i].regions.met + 1 && x.met === rd.b[i].met + 1 && x.total === rd.b[i].total), JSON.stringify(rd.a.map((x) => x.regions)));
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
  check('Start here for a new learner: "Begin with Champagne", the course\'s ' + course.length + ' steps, and the whole course one door away',
    /<h2 class="v32-h2" id="v56-start-h" tabindex="-1">Start here<\/h2>/.test(hub0) && hub0.indexOf('The course follows the Court’s subjects in their order: ' + course.length + ' steps, from Champagne to ') > 0
    && hub0.indexOf('data-v56="course" data-kind="region" data-key="champagne" id="v56-continue">Begin with Champagne</button>') > 0 && hub0.indexOf('data-go="v56course" id="v56-path"') > 0, hub0.slice(at0(hub0, 'v56-start'), at0(hub0, 'v56-start') + 500));
  const doorsS = hub0.slice(at0(hub0, 'v56-studydoors'), hub0.indexOf('</section>', at0(hub0, 'v56-studydoors')));
  const doorNames = attr(doorsS, /<span class="v25row-name">([^<]*)<\/span>/g);
  check('the study doors: ' + doorNames.join(', '), JSON.stringify(doorNames) === JSON.stringify(['Today’s region cards', 'Drill a country', 'Map quiz', 'District cards', 'Compare two regions'])
    && /data-v56="today" id="v56-today">[\s\S]*?Nothing due today\. New cards from Champagne\./.test(doorsS) && ['v56drill', 'v56mapquiz', 'v56districts', 'v56compare'].every((g) => doorsS.indexOf('data-go="' + g + '"') > 0), doorsS.slice(0, 600));
  const orderKeys = C.J('v55CountryOrder().map(function (r) { return r.key; })');
  const cSec = hub0.slice(at0(hub0, 'v56-countryrows'), hub0.indexOf('</section>', at0(hub0, 'v56-countryrows')));
  const cRows = attr(cSec, /data-v39="country" data-key="([^"]*)" id="v56-c-/g);
  const lineBad = [];
  orderKeys.forEach((k) => {
    const line = unesc((new RegExp('data-key="' + k + '" id="v56-c-' + k + '"><span class="v25row-name">[^<]*</span><span class="v25row-line">([^<]*)<').exec(cSec) || [])[1] || '');
    const x = C.J('(function () { var row = v55CountryOrder().filter(function (r) { return r.key === ' + JSON.stringify(k) + '; })[0]; var n = (row.sheet ? v39SheetRegions(row.sheet).length : 0) + 1; var cards = row.sheet ? v39SheetCards(row.sheet).length : v39Cards(row.c).length; var t = v39Questions(row.sheet ? v39SheetKeys(row.sheet) : [row.key]).length; return { n: n, c: cards, t: t }; })()');
    const w = '0 of ' + x.n + ' read · ' + (x.c ? '0 of ' + x.c + ' cards known · ' : '') + '0 of ' + x.t + ' questions right';
    if (line !== w) lineBad.push(k + ': ' + line + ' / ' + w);
  });
  check('every country once (' + cRows.length + ' of ' + countryKeys.length + '), in the order of the maps, its readiness line its regions and page, its cards and its questions', JSON.stringify(cRows) === JSON.stringify(orderKeys) && cRows.length === countryKeys.length && lineBad.length === 0, lineBad.slice(0, 4).join(' | ') + ' ' + JSON.stringify(cRows.slice(0, 4)));
  check('codex55\'s country chips and its Field maps chip leave; its sheets and its full list stay below (17 sheet doors, every region)', hub0.indexOf('v55-countrychips') < 0 && hub0.indexOf('data-go="fieldatlas"') < 0 && attr(hub0, /data-v39="openmap" data-sheet="([^"]*)"/g).length === 17 && attr(hub0, /data-v39="region" data-slug="([^"]*)"/g).length === regionSlugs.length);
  check('the order: Start here, the study doors, the chips and the search, the countries, the sheets, every region',
    at0(hub0, 'v56-start') < at0(hub0, 'v56-studydoors') && at0(hub0, 'v56-studydoors') < at0(hub0, 'v55-chips') && at0(hub0, 'v55-chips') < at0(hub0, 'id="v55-find"') && at0(hub0, 'id="v55-find"') < at0(hub0, 'v56-countries') && at0(hub0, 'v56-countries') < at0(hub0, '<section class="v32-sec v55-sheets"') && at0(hub0, '<section class="v32-sec v55-sheets"') < at0(hub0, 'class="v32-sec v55-regions"'));
  const countBad = [];
  regionSlugs.forEach((slug) => {
    const line = unesc((new RegExp('data-v55-count="' + slug + '">([^<]*)<').exec(hub0) || [])[1] || '');
    const n = treeNames(REC[slug] && REC[slug].places, []).length;
    const idx = INDEX.regions.filter((r) => r.slug === slug)[0] || {};
    if (idx.districts !== n || line.indexOf((n === 1 ? '1 district' : n + ' districts')) !== 0) countBad.push(slug + ': ' + line + ' / ' + n + ' / ' + idx.districts);
  });
  check('every region\'s district count on the root, with no reading on the device, is the index\'s, equal to its reading\'s (' + regionSlugs.length + ')', countBad.length === 0, countBad.slice(0, 5).join(' | '));
  C.G('v55Filter({ querySelectorAll: function () { return []; }, querySelector: function () { return null; } }, "chablis")');
  for (let i = 0; i < 120 && !C.G('v55Regions().every(function (a) { return v39RecReady(a); })'); i++) await tick(25);
  check('the first search reads the districts of every region (' + new Set(C.fetched).size + ' files)', C.G('v55Regions().every(function (a) { return v39RecReady(a); })'), C.fetched.join(' '));
  const bSpain = B.J('(function () { var row = v55CountryOrder().filter(function (r) { return r.key === "spain"; })[0]; return v56CountryReady(row); })()');
  const bWant = B.J('(function () { var qs = v39Questions(v39SheetKeys("spain")); return { t: qs.length, q: qs.filter(function (q) { return v56Right(q.id); }).length, c: v39SheetCards("spain").length, n: v39SheetRegions("spain").length + 1 }; })()');
  check('Spain\'s line on a device with grades: ' + B.G('v56ReadyLine(v56CountryReady(v55CountryOrder().filter(function (r) { return r.key === "spain"; })[0]))'), bSpain.q === bWant.q && bSpain.q >= 2 && bSpain.t === bWant.t && bSpain.c === bWant.c && bSpain.n === bWant.n, JSON.stringify([bSpain, bWant]));
  A.G('S.view = "worldmap"; S.wmap = null;');
  const hubA = A.page('worldMapView();');
  drawn.push(['the root, a learner on her way', hubA]);
  check('Continue on a device with three steps read: step 1 of ' + course.length + ', Champagne, the first unread', /id="v56-start-h" tabindex="-1">Continue<\/h2>/.test(hubA) && hubA.indexOf('Step 1 of ' + course.length + ' in the Court’s order. 3 of ' + course.length + ' read so far.') > 0 && hubA.indexOf('id="v56-continue">Continue with Champagne</button>') > 0, hubA.slice(at0(hubA, 'v56-start'), at0(hubA, 'v56-start') + 400));
  const hubB = B.page('S.view = "worldmap"; S.wmap = null; worldMapView();');
  drawn.push(['the root, cards due', hubB]);
  check('the due count on the root with seeded grades: 3 cards and 2 questions due, the questions their own door', /data-v56="today" id="v56-today"><span class="v25row-name">Today’s region cards<\/span><span class="v25row-line">3 cards and 2 questions due<\/span>/.test(hubB) && hubB.indexOf('data-v56="duedrill" id="v56-duedrill"') > 0);
  const Dn = await bootDevice();
  Dn.G('v39Regions().forEach(function (a) { v39MarkRead(a.slug); }); Object.keys(v39Countries()).forEach(function (k) { if (v39Country(k)) v56MarkCountry(k); });');
  const hubD = Dn.page('S.view = "worldmap"; S.wmap = null; worldMapView();');
  drawn.push(['the root, the course read', hubD]);
  check('every step read: The course is read, all ' + course.length + ' steps, and Read Champagne again', /id="v56-start-h" tabindex="-1">The course is read<\/h2>/.test(hubD) && hubD.indexOf('All ' + course.length + ' steps are read.') > 0 && hubD.indexOf('id="v56-continue">Read Champagne again</button>') > 0, hubD.slice(at0(hubD, 'v56-start'), at0(hubD, 'v56-start') + 400));
  const cp = A.page('v56Go("v56course", "");');
  drawn.push(['the whole course', cp]);
  const cpRows = attr(cp, /data-v56="course" data-kind="[a-z]+" data-key="([^"]*)"/g);
  const cpGroups = attr(cp, /<h3 class="secgroup v32-gh" id="v56-cg-\d+">([^<]*)<\/h3>/g);
  const subjectsInCourse = [...new Set(subjOf.filter(Boolean))].map((id) => CMS_DATA.subjects.filter((s) => s.id === id)[0].name);
  check('the whole course: ' + cpRows.length + ' steps in order, under the ' + subjectsInCourse.length + ' subjects that name a step, then The rest of the atlas',
    JSON.stringify(cpRows) === JSON.stringify(course.map((k) => k.split(':')[1])) && JSON.stringify(cpGroups) === JSON.stringify(subjectsInCourse.concat(course.length > courtN ? ['The rest of the atlas'] : [])) && cpGroups[0] === 'Grape Growing: Viticulture'
    && cp.indexOf('Step 1, to read') > 0 && cp.indexOf('Step ' + (A.G('v56At("region", "rioja")') + 1) + ', read') > 0 && cp.indexOf('Step ' + (A.G('v56At("country", "france")') + 1) + ', the country, read') > 0, JSON.stringify(cpGroups.slice(0, 4)));
  check('its address #/v/v56course, lit Wine Atlas, named The course, its cold parent the root', A.G('location.hash') === '#/v/v56course' && A.G('v25NavWord()') === 'worldmap' && A.G('v25MainName()') === 'The course' && A.G('JSON.stringify(v32ParentRoute())') === JSON.stringify({ view: 'worldmap', arg: '' }));

  /* ================================================================ */
  section('5. the region page leads with study');
  await A.load(A.allParts());
  for (const slug of ['burgundy', 'rioja']) {
    const html = A.page('S.view = "region"; S._v39region = ' + JSON.stringify(slug) + '; v39RegionView();');
    drawn.push([slug + ', the page', html]);
    const m = A.J('v45Map(' + JSON.stringify(slug) + ')');
    const near2 = A.J('v56Near("region", ' + JSON.stringify(slug) + ')');
    const row = (/<nav class="v56-srow v56"[^>]*>([\s\S]*?)<\/nav>/.exec(html) || ['', ''])[1];
    const labels = attr(row, />([^<]+)<\/button>/g);
    check(slug + ': the study row reads ' + labels.join(', '), JSON.stringify(labels) === JSON.stringify(['Summary', 'Map', 'Districts', 'Read', 'Flash', 'Drill', 'Map quiz', 'Previous', 'Next']) && html.indexOf('aria-label="Study ' + A.G('v39Find(' + JSON.stringify(slug) + ').name') + '"') > 0, row.slice(0, 300));
    const targets = attr(row, /data-to="([^"]*)"/g);
    check(slug + ': its jumps land on the page (' + targets.join(', ') + '), Flash and Drill are the region\'s, Map quiz its field map, Previous and Next the course\'s',
      targets.length === 4 && targets.every((t) => html.indexOf('id="' + t + '"') > 0) && row.indexOf('data-v39="flash" data-slug="' + slug + '"') > 0 && row.indexOf('data-v39="drill" data-slug="' + slug + '"') > 0
      && row.indexOf('data-go="v56mapquiz" data-arg="' + m.id + '"') > 0 && row.indexOf('data-key="' + near2.prev.key + '" id="v56-s-prev" aria-label="Previous: ' + near2.prev.name + '"') > 0 && row.indexOf('data-key="' + near2.next.key + '" id="v56-s-next" aria-label="Next: ' + near2.next.name + '"') > 0, targets.join(' '));
    const at = (x) => html.indexOf(x);
    check(slug + ': the order: the title, the study row, the lead, In one minute, the map, The districts, the reading', at('class="viewhead"') < at('v56-srow') && at('v56-srow') < at('class="v39-lead"') && at('class="v39-lead"') < at('<section class="card v56 v56-minute"') && at('<section class="card v56 v56-minute"') < at('class="v55-map"') && at('class="v55-map"') < at('class="v55-districts"') && at('class="v55-districts"') < at('id="v56-read"'));
    const fig = html.slice(at('<div class="v55-mapfig"'), html.indexOf('</figure>', at('<div class="v55-mapfig"')));
    const file = A.G('v45File(v45Map(' + JSON.stringify(slug) + '))');
    check(slug + ': the inline map waits for the view: a blank of its shape, the artwork kept in data-v56-src (' + file + '), codex45\'s viewer intact', fig.indexOf('data-v56-src="' + file + '"') > 0 && fig.indexOf(' data-v56-lazy') > 0 && fig.indexOf('data-v45-image') < 0 && fig.indexOf('src="data:image/svg+xml,') > 0 && fig.indexOf('data-v45="zoom" data-v45-arg="' + slug + '"') > 0, fig.slice(0, 400));
    const dist = html.slice(at('<section class="v55-districts"'), html.indexOf('</section>', at('<section class="v55-districts"')) + 10);
    const J = A.J('(function () { var J = v55Join(v39Find(' + JSON.stringify(slug) + '), v45Map(' + JSON.stringify(slug) + ')); return { nodes: J.count, also: J.also.length }; })()');
    const lis = [...dist.matchAll(/<li class="(v55-d[^"]*)"( hidden)?/g)].map((x) => /v56-more/.test(x[1]));
    const shownN = lis.filter((h) => !h).length, hiddenN = lis.filter((h) => h).length;
    const btn = /data-v56="alld" aria-expanded="false" data-n="(\d+)" id="v56-alld">([^<]*)</.exec(dist);
    check(slug + ': The districts show the first eight of ' + (J.nodes + J.also) + ' (' + J.nodes + ' from the reading at every depth, ' + J.also + ' more on the map), the rest behind ' + (btn ? '"' + btn[2] + '"' : 'Show all'),
      !!btn && Number(btn[1]) === J.nodes + J.also && lis.length === J.nodes + J.also && shownN === 8 && hiddenN === J.nodes + J.also - 8 && lis.indexOf(true) === 8 && lis.slice(8).every((h) => h), JSON.stringify({ shownN, hiddenN, J, btn: btn && btn[0] }));
    check(slug + ': no name of the reading lost from The districts (' + treeNames(REC[slug].places, []).length + ')', treeNames(REC[slug].places, []).every((n) => dist.indexOf('data-v55-place="' + n.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"') > 0 || attr(dist, /data-v55-place="([^"]*)"/g).indexOf(n) >= 0));
  }
  /* In one minute on every region with a reading */
  const minuteBad = [];
  let minutes = 0;
  const courseN = A.G('v56Course().length');
  for (const slug of regionSlugs) {
    const html = A.page('S.view = "region"; S._v39region = ' + JSON.stringify(slug) + '; v39RegionView();');
    const rec = Object.assign({}, REC[slug] || {}, { grapes: A.J('v39Find(' + JSON.stringify(slug) + ').grapes || []') });
    const got = minuteGot(html);
    const w = minuteWant(rec);
    minutes++;
    if (JSON.stringify(got.rows) !== JSON.stringify(w)) minuteBad.push(slug + ': ' + JSON.stringify(got.rows).slice(0, 160) + ' / ' + JSON.stringify(w).slice(0, 160));
    else if (got.minute.indexOf('Step ' + (A.G('v56At("region", ' + JSON.stringify(slug) + ')') + 1) + ' of ' + courseN + ' in the course') < 0) minuteBad.push(slug + ': no step');
    else if (!/<h2 class="v56-minute-h" id="v56-minute-h" tabindex="-1">In one minute<\/h2>/.test(got.minute) || got.minute.indexOf('arrive with the reading') >= 0) minuteBad.push(slug + ': head or wait line');
    if (slug === 'champagne' || slug === 'napa-sonoma' || slug === 'mosel') drawn.push([slug + ', the page', html]);
  }
  check('In one minute on every region (' + minutes + '), each row from the record\'s own fields (the climate in a line, the main grapes, the ladder\'s rungs, the first exam line, the first trap) and its step in the course', minutes === regionSlugs.length && minuteBad.length === 0, minuteBad.slice(0, 4).join(' | '));
  const wait = await bootDevice();
  const waitPage = wait.page('S.view = "region"; S._v39region = "burgundy"; v39RegionView();');
  const wg = minuteGot(waitPage);
  check('In one minute before the reading arrives: the main grapes from the index, and a line that the rest arrives with the reading', wg.rows.length === 1 && wg.rows[0][0] === 'The main grapes' && wg.minute.indexOf('The climate, the ladder, an exam line and a trap arrive with the reading.') > 0, JSON.stringify(wg.rows));
  const canadaP = A.page('S.view = "country"; S._v39country = "canada"; v39CountryView();');
  drawn.push(['canada', canadaP]);
  check('canada: its techniques sit under its map and reading (codex46 adds none above the map)', canadaP.indexOf('v46-links') > canadaP.indexOf('class="v55-map"') && canadaP.indexOf('class="v55-map"') > 0 && (canadaP.match(/v46-links/g) || []).length === 1, String(canadaP.indexOf('v46-links')));

  /* ================================================================ */
  section('6. new drills from the data');
  const Q0 = A.J('(function () { V25_GO.v56mapquiz("burgundy"); return { view: S.view, hash: location.hash, n: V56_Q.items.length, modes: V56_Q.items.map(function (x) { return x.mode; }), lit: v25NavWord(), parent: v32ParentRoute(), name: v25MainName() }; })()');
  check('the map quiz has an address (#/v/v56mapquiz/burgundy), lights Wine Atlas, climbs to Burgundy\'s page: 8 questions, find and name in turn',
    Q0.view === 'v56mapquiz' && Q0.hash === '#/v/v56mapquiz/burgundy' && Q0.n === 8 && Q0.modes.join(',') === 'find,name,find,name,find,name,find,name' && Q0.lit === 'worldmap' && JSON.stringify(Q0.parent) === JSON.stringify({ view: 'region', arg: 'burgundy' }) && Q0.name === 'Burgundy: map quiz', JSON.stringify(Q0));
  const qhtml = A.page('render();');
  drawn.push(['the map quiz', qhtml]);
  const q1 = A.J('(function () { var it = V56_Q.items[0]; return { name: it.p.name, i: it.p.i, n: it.p.n, x: it.p.x, y: it.p.y }; })()');
  const bm = A.J('v45Map("burgundy")');
  const dotsB = dotsOf(bm.file);
  check('a find question: "Find ' + q1.name + ' on the map.", the field map drawn without its key, a number for every place (' + (qhtml.match(/data-v56="qpick"/g) || []).length + ')',
    qhtml.indexOf('Find ' + q1.name + ' on the map.') > 0 && qhtml.indexOf('src="' + A.G('v45File(v45Map("burgundy"))') + '"') > 0 && qhtml.indexOf('data-v56="qtap"') > 0 && (qhtml.match(/data-v56="qpick"/g) || []).length === A.G('v56QPlaces(v45Map("burgundy")).length'), qhtml.slice(qhtml.indexOf('v56-qprompt'), qhtml.indexOf('v56-qprompt') + 300));
  check('the key is the pin: ' + q1.name + '\'s point is the dot the artwork draws for number ' + q1.n, Math.hypot(dotsB[q1.i][0] - q1.x, dotsB[q1.i][1] - q1.y) < 0.5 && q1.n === q1.i + 1, JSON.stringify([dotsB[q1.i], q1]));
  /* a tap at the dot, through the figure's own box (a 650 by 449 figure) */
  const tap = A.J('(function () { var p = V56_Q.items[0].p; var node = { getBoundingClientRect: function () { return { left: 10, top: 100, width: 650, height: 449.47 }; } }; V56_ACTS.qtap(node, { clientX: 10 + (p.x - 130) / 940 * 650 + 3, clientY: 100 + (p.y - 270) / 650 * 449.47 - 2 }); return { pick: V56_Q.pick && V56_Q.pick.i, right: V56_Q.right }; })()');
  const fb1 = A.page('render();');
  check('a tap at the dot answers it: "' + ((/<p class="v56-qfeed"[^>]*>([^<]*)</.exec(fb1) || [])[1] || '') + '"', tap.pick === q1.i && tap.right === 1 && fb1.indexOf('Right: number ' + q1.n + ' is ' + q1.name + '.') > 0 && fb1.indexOf('data-v56="qnext"') > 0, JSON.stringify(tap));
  A.G('V56_ACTS.qnext({ getAttribute: function () { return null; } });');
  const q2 = A.J('(function () { var it = V56_Q.items[1]; return { name: it.p.name, i: it.p.i, n: it.p.n, opts: it.opts.map(function (o) { return o.name; }), wrong: it.opts.filter(function (o) { return o.i !== it.p.i; })[0].i }; })()');
  const nh = A.page('render();');
  drawn.push(['the map quiz, a name question', nh]);
  const optsShown = attr(nh.slice(nh.indexOf('v56-qopts')), /data-v56="qpick" data-i="\d+">([^<]*)</g);
  const ring = /class="v56-qring" style="left:([\d.]+)%;top:([\d.]+)%"/.exec(nh);
  const ringAt = ring ? [130 + Number(ring[1]) / 100 * 940, 270 + Number(ring[2]) / 100 * 650] : [0, 0];
  check('a name question: "Which place is marked?", the mark on ' + q2.name + '\'s dot, four names: ' + optsShown.join(', '), nh.indexOf('Which place is marked?') > 0 && !!ring && Math.hypot(ringAt[0] - dotsB[q2.i][0], ringAt[1] - dotsB[q2.i][1]) < 0.5 && optsShown.length === 4 && optsShown.indexOf(q2.name) >= 0 && new Set(optsShown).size === 4, JSON.stringify([q2, ringAt, dotsB[q2.i]]));
  A.G('V56_ACTS.qpick({ getAttribute: function (k) { return k === "data-i" ? "' + q2.wrong + '" : null; } });');
  const fb2 = A.page('render();');
  check('a wrong name is told: "Not quite: number ' + q2.n + ' is ' + q2.name + '."', fb2.indexOf('Not quite: number ' + q2.n + ' is ' + q2.name + '.') > 0 && A.G('V56_Q.right') === 1);
  const end = A.J('(function () { V56_ACTS.qnext({ getAttribute: function () { return null; } }); while (!V56_Q.done) { var it = V56_Q.items[V56_Q.i]; V56_ACTS.qpick({ getAttribute: function (k) { return k === "data-i" ? String(it.p.i) : null; } }); V56_ACTS.qnext({ getAttribute: function () { return null; } }); } return { right: V56_Q.right, rec: v56Rec().m.burgundy }; })()');
  const done = A.page('render();');
  drawn.push(['the map quiz, the round', done]);
  check('the round ends at ' + end.right + ' of 8, kept for the chooser, with Another round, Another map and Read Burgundy', end.right === 7 && end.rec.l === 7 && end.rec.t === 8 && end.rec.n === 1 && done.indexOf('7 of 8 right') > 0 && done.indexOf('data-v56="qagain"') > 0 && done.indexOf('data-go="v56mapquiz" data-arg=""') > 0 && done.indexOf('data-v39="region" data-slug="burgundy"') > 0, JSON.stringify(end));
  const qp = A.page('v56Go("v56mapquiz", "");');
  drawn.push(['the map quiz chooser', qp]);
  const bn = A.G('v56QPlaces(v45Map("burgundy")).length');
  const quizMaps = A.G('v56QMaps().length');
  check('the chooser: every field map the quiz deals (' + (qp.match(/data-go="v56mapquiz" data-arg="[a-z0-9-]+"/g) || []).length + ' of ' + A.G('v45Maps().length') + '), by country, Burgundy\'s last round shown', (qp.match(/data-go="v56mapquiz" data-arg="[a-z0-9-]+"/g) || []).length === quizMaps && quizMaps > 100 && qp.indexOf(bn + ' places · last round 7 of 8') > 0, qp.slice(0, 400));
  /* every map the quiz deals: each place's point the artwork's dot, inside the crop that hides the key */
  const QP = A.J('v56QMaps().map(function (m) { return { id: m.id, file: m.file, title: m.title, places: v56QPlaces(m).map(function (p) { return [p.i, p.n, p.x, p.y, p.name]; }) }; })');
  const pinBad = [], cropBad = [];
  let pins = 0;
  QP.forEach((m) => {
    const dots = dotsOf(m.file);
    m.places.forEach(([i, n, x, y, name]) => {
      pins++;
      if (!dots[i] || Math.hypot(dots[i][0] - x, dots[i][1] - y) >= 0.5 || n !== i + 1) pinBad.push(m.id + ' ' + name);
      if (x < 130 || x > 1070 || y < 270 || y > 920) cropBad.push(m.id + ' ' + name + ' (' + Math.round(x) + ', ' + Math.round(y) + ')');
    });
    if (m.places.some((p) => fold(p[4]) === fold(m.title))) pinBad.push(m.id + ': its own title asked');
  });
  check('on every map the quiz deals (' + QP.length + ', ' + pins + ' places), each place\'s point is the dot its artwork draws and its number the key\'s', pinBad.length === 0 && pins > 1000, pinBad.slice(0, 5).join(' | '));
  check('and every one stands inside the crop that leaves the key out (130 to 1070 across, 270 to 920 down)', cropBad.length === 0, cropBad.slice(0, 6).join(' | '));
  /* district cards */
  const dk = A.J('(function () { var d = v32DeckDef("districts:burgundy"); return { name: d.name, n: d.cards.length, first: d.cards[0], kind: d.kind }; })()');
  const dWantB = districtWant(REC.burgundy);
  check('district cards: Burgundy\'s ' + dk.n + ' (every place of the reading with a note at the Certified depth), "' + dk.first.front + '" to "' + dk.first.back.slice(0, 60) + '..."',
    dk.name === 'Burgundy: district cards' && dk.kind === 'region' && dk.n === dWantB.length && dk.first.front === dWantB[0][0] && dk.first.back === 'Burgundy: ' + dWantB[0][1] && /^d:burgundy\//.test(dk.first.id), JSON.stringify(dk).slice(0, 300));
  const dcBad = [];
  let dcN = 0;
  regionSlugs.forEach((slug) => {
    const got = A.J('v56DistrictCards(' + JSON.stringify(slug) + ').map(function (c) { return [c.front, c.back, c.id]; })');
    const name = A.G('v39Find(' + JSON.stringify(slug) + ').name');
    const w = districtWant(REC[slug]);
    dcN += got.length;
    if (JSON.stringify(got.map((c) => [c[0], c[1]])) !== JSON.stringify(w.map((x) => [x[0], name + ': ' + x[1]])) || new Set(got.map((c) => c[2])).size !== got.length || !got.every((c) => c[2].indexOf('d:' + slug + '/') === 0)) dcBad.push(slug + ' ' + got.length + '/' + w.length);
  });
  check('every region\'s district cards (' + regionSlugs.length + ' regions, ' + dcN + ' cards) are its reading\'s places with a note at the Certified depth, once a name, each a district\'s own id', dcBad.length === 0 && dcN > 500, dcBad.slice(0, 6).join(' | '));
  const dr = A.J('(function () { V56_ACTS.dcards({ getAttribute: function (k) { return k === "data-slug" ? "burgundy" : null; } }); var a = { view: S.view, deck: S._v32deck, hash: location.hash, lit: v25NavWord(), parent: v32ParentRoute() }; v32StartRun("districts:burgundy", { keepOrder: true }); var r = S._v32run; var c = r.cards[r.deck[0]]; a.front = v32CardFace(c, r); r.flip = true; a.back = v32CardFace(c, r); v32Grade(true); a.got = v39CardRec()[c.id]; a.sched = v56Rec().c[c.id]; a.runLit = v25NavWord(); return a; })()');
  check('their deck screen has an address (#/flashcards/districts:burgundy), lights Wine Atlas and climbs to Burgundy', dr.view === 'deck' && dr.hash === '#/flashcards/districts:burgundy' && dr.lit === 'worldmap' && JSON.stringify(dr.parent) === JSON.stringify({ view: 'region', arg: 'burgundy' }), JSON.stringify(dr).slice(0, 300));
  check('a card\'s front asks for its region and its note; graded, codex39 keeps it and it gains a due date with its two faces', dr.front.indexOf('Its region, and what it is known for') > 0 && dr.back.indexOf('Burgundy: ') > 0 && dr.got === 'got' && dr.sched && dr.sched.n === 1 && dr.sched.f === dWantB[0][0] && dr.sched.k === 'burgundy' && !!dr.sched.b && dr.runLit === 'worldmap', JSON.stringify({ sched: dr.sched }));
  const dp = A.page('v56Go("v56districts", "");');
  drawn.push(['the district cards chooser', dp]);
  const dpBad = regionSlugs.filter((slug) => {
    const n = (INDEX.regions.filter((r) => r.slug === slug)[0] || {}).districts;
    return dp.indexOf('data-v56="dcards" data-slug="' + slug + '" id="v56-d-' + slug + '"><span class="v25row-name">' + A.G('v39Find(' + JSON.stringify(slug) + ').name').replace(/&/g, '&amp;') + '</span><span class="v25row-line">' + (n === 1 ? '1 district' : n + ' districts') + '</span>') < 0;
  });
  check('the chooser: every region (' + (dp.match(/data-v56="dcards"/g) || []).length + ') with its district count', (dp.match(/data-v56="dcards"/g) || []).length === regionSlugs.length && dpBad.length === 0, dpBad.slice(0, 5).join(' '));
  const burgP = A.page('S.view = "region"; S._v39region = "burgundy"; v39RegionView();');
  check('the region page\'s districts carry the district cards door', burgP.indexOf('data-v56="dcards" data-slug="burgundy" id="v56-dcards"') > 0);
  /* compare two regions */
  const cmpDef = A.G('V56_VIEWS.v56compare.accept("")');
  check('compare with no pair names the region last open and the course\'s next region (' + cmpDef + ')', /^burgundy~/.test(cmpDef) && cmpDef === 'burgundy~' + A.G('(function () { var l = v56Course().filter(function (x) { return x.kind === "region"; }); var i = l.map(function (x) { return x.key; }).indexOf("burgundy"); return l[i + 1].key; })()'));
  const cmp = A.page('v56Go("v56compare", "burgundy~rioja");');
  drawn.push(['compare', cmp]);
  const secs = attr(cmp, /<h3 class="secgroup v32-gh" id="v56-cmp-[a-z]+">([^<]*)</g);
  const ca = (k) => { const at = cmp.indexOf('id="v56-cmp-' + k + '"'); return cmp.slice(at, cmp.indexOf('</section>', at)); };
  const cells = (k) => { const s = ca(k); const parts = s.split('<div><b>').slice(1); return parts.map((p) => attr('>' + p, />([^<>]+)</g).filter((x) => x.trim()).slice(1)); };
  check('compare Burgundy and Rioja side by side (#/v/v56compare/burgundy~rioja): ' + secs.join(', '),
    A.G('location.hash') === '#/v/v56compare/burgundy~rioja' && JSON.stringify(secs) === JSON.stringify(['The climate', 'The soils', 'The grapes', 'The wines', 'The ladder', 'What the exam asks']), secs.join(','));
  const cw = (r) => ({
    climate: [lineS(r.terroir.climate)], soils: [lineS(r.terroir.soils)],
    grapes: A.J('v39Find(' + JSON.stringify(r === REC.burgundy ? 'burgundy' : 'rioja') + ').grapes').filter((g) => g && str(g.name)).slice(0, 6).map((g) => str(g.name) + (str(g.role) && g.role !== 'lead' ? ' (' + str(g.role) + ')' : '')),
    wines: (r.wines || []).filter((w) => w && str(w.style)).slice(0, 6).map((w) => str(w.style)),
    ladder: r.law.tiers.filter((x) => Array.isArray(x) && str(x[0])).map((x) => str(x[0])).slice(0, 5),
    exam: (r.exam || []).map(str).filter(Boolean).slice(0, 2)
  });
  const cB = cw(REC.burgundy), cR = cw(REC.rioja);
  const cmpBad = ['climate', 'soils', 'grapes', 'wines', 'ladder', 'exam'].filter((k) => JSON.stringify(cells(k)) !== JSON.stringify([cB[k], cR[k]]));
  check('each column is its own record, field by field (the climate and soils in a line, up to six grapes and wines, the ladder\'s rungs, two exam lines)', cmpBad.length === 0, cmpBad.map((k) => k + ': ' + JSON.stringify(cells(k)).slice(0, 200) + ' / ' + JSON.stringify([cB[k], cR[k]]).slice(0, 200)).join(' | '));
  check('compare lights Wine Atlas and climbs to its first region', A.G('v25NavWord()') === 'worldmap' && A.G('JSON.stringify(v32ParentRoute())') === JSON.stringify({ view: 'region', arg: 'burgundy' }));
  const same = A.page('v56Go("v56compare", "rioja~rioja");');
  check('one region twice asks for two different regions', same.indexOf('Choose two different regions.') > 0);
  /* drill a country */
  const drp = A.page('v56Go("v56drill", "");');
  drawn.push(['drill a country', drp]);
  const drillRows = attr(drp, /data-v56="drillc" data-key="([^"]*)"/g);
  check('drill a country: a row each with its questions (' + drillRows.length + ' countries)', drillRows.length >= 20 && drillRows.indexOf('spain') >= 0 && /questions · \d+ answered right/.test(drp));
  const drl = A.J('(function () { V56_ACTS.drillc({ getAttribute: function (k) { return k === "data-key" ? "spain" : null; } }); return { view: S.view, n: S.pool.length, lit: v25NavWord(), own: S.pool.every(function (q) { return v39SheetKeys("spain").some(function (k) { return v39Questions([k]).indexOf(q) >= 0; }); }) }; })()');
  check('a country\'s drill deals ten of its own questions, lit Wine Atlas', drl.view === 'quiz' && drl.n === 10 && drl.own && drl.lit === 'worldmap', JSON.stringify(drl));
  A.G('S.mode = null; S.pool = []; S.view = "home";');

  /* ================================================================ */
  section('7. duplicates folded');
  const go = (route) => A.J('(function () { v32Go(' + JSON.stringify(route) + ', "push"); return { view: S.view, region: S._v39region, country: S._v39country, wmap: S.wmap || null, hash: location.hash, jump: V56_JUMP.id }; })()');
  const f1 = go({ view: 'fieldmap', arg: 'burgundy' });
  check('a region\'s field map address opens its region page (#/v/fieldmap/burgundy to #/v/region/burgundy)', f1.view === 'region' && f1.region === 'burgundy' && f1.hash === '#/v/region/burgundy', JSON.stringify(f1));
  const f2 = go({ view: 'fieldmap', arg: 'country-croatia' });
  const eeP = A.page('render();');
  check('a country\'s field map opens its country page with that map chosen (Croatia under Eastern Europe)', f2.view === 'country' && f2.country === 'eastern-europe' && eeP.indexOf('class="v55-mapfig" data-v55-map="country-croatia"') > 0 && eeP.indexOf('data-map="country-croatia" aria-pressed="true"') > 0, JSON.stringify(f2));
  const f3 = go({ view: 'fieldatlas', arg: '' });
  check('the field atlas index opens the root', f3.view === 'worldmap' && !f3.wmap && f3.hash === '#/v/worldmap', JSON.stringify(f3));
  const f4 = go({ view: 'regions', arg: '' });
  check('the regions index opens the root at its countries', f4.view === 'worldmap' && !f4.wmap && f4.hash === '#/v/worldmap' && f4.jump === 'v55-countries-h', JSON.stringify(f4));
  A.G('V56_JUMP.id = "";');
  const f5 = go({ view: 'regions', arg: 'france' });
  check('a sheet\'s row of the regions index opens the root at that country\'s row', f5.view === 'worldmap' && f5.jump === 'v56-c-france', JSON.stringify(f5));
  A.G('V56_JUMP.id = "";');
  const f6 = A.J('(function () { v39Open("regions", "", "push"); var a = { view: S.view, hash: location.hash }; v45Go("rioja"); a.v45 = { view: S.view, region: S._v39region, hash: location.hash }; V25_GO.fieldatlas(""); a.fa = { view: S.view, hash: location.hash }; return a; })()');
  check('codex39\'s own door to its index, codex45\'s door to a field map and to the field atlas land on the root, Rioja and the root', f6.view === 'worldmap' && f6.hash === '#/v/worldmap' && f6.v45.view === 'region' && f6.v45.region === 'rioja' && f6.fa.view === 'worldmap', JSON.stringify(f6));
  A.G('V56_JUMP.id = "";');
  const parC = A.J('(function () { S.view = "country"; S._v39country = "france"; var p = v32ParentRoute(); v32Go(p, "replace"); return { p: p, view: S.view, jump: V56_JUMP.id }; })()');
  check('the cold Back from a country climbs through the folded index to the root at its row', parC.view === 'worldmap' && parC.jump === 'v56-c-france', JSON.stringify(parC));
  A.G('V56_JUMP.id = "";');
  for (const [hash, w] of [['#/v/fieldmap/burgundy', { view: 'region', hash: '#/v/region/burgundy' }], ['#/v/fieldmap/country-canada', { view: 'country', hash: '#/v/country/canada' }], ['#/v/fieldatlas', { view: 'worldmap', hash: '#/v/worldmap' }], ['#/v/regions', { view: 'worldmap', hash: '#/v/worldmap' }], ['#/v/v56course', { view: 'v56course', hash: '#/v/v56course' }], ['#/v/v56mapquiz/rioja', { view: 'v56mapquiz', hash: '#/v/v56mapquiz/rioja' }], ['#/v/v56districts', { view: 'v56districts', hash: '#/v/v56districts' }], ['#/v/v56compare/burgundy~rioja', { view: 'v56compare', hash: '#/v/v56compare/burgundy~rioja' }], ['#/v/v56drill', { view: 'v56drill', hash: '#/v/v56drill' }]]) {
    const Z = await bootDevice({ hash });
    const got = Z.J('({ view: S.view, hash: location.hash })');
    check('a cold load of ' + hash + ' lands on ' + w.hash, got.view === w.view && got.hash === w.hash, JSON.stringify(got));
  }
  const link = A.G('v52AtlasHtml([{ view: "fieldmap", arg: "burgundy", label: "Burgundy field map" }, { view: "fieldmap", arg: "country-canada", label: "Canada overview" }], "quiz")');
  check('an answer link to a region\'s field map opens its region page; a country map\'s keeps its address (which opens the country page)', link.indexOf('data-v52-atlas="region/burgundy" href="#/v/region/burgundy">Burgundy</a>') > 0 && link.indexOf('href="#/v/fieldmap/country-canada"') > 0, link);
  const qLink = A.G('(function () { var q = v39Questions(["burgundy"])[0]; return v52AtlasHtml(v52ForQuestion(q), "quiz"); })()');
  check('and a real answer\'s link, through atlas-context.js, reads the same', qLink.indexOf('href="#/v/region/burgundy"') > 0 && qLink.indexOf('fieldmap/burgundy') < 0, qLink.slice(0, 300));
  const ownNotes = A.J('v45Maps().filter(function (m) { return m.type === "region" && v45OwnNotes(m) && v39Find(m.slug || m.id); }).map(function (m) { return m.id; })');
  const np = A.page('S.view = "region"; S._v39region = ' + JSON.stringify(ownNotes[0]) + '; v39RegionView();');
  drawn.push([ownNotes[0] + ', the page', np]);
  check('the region page\'s map holder: no door to the folded field map screen, codex45\'s offline copy of the map in its place', burgP.indexOf('data-v45="map" data-v45-arg="burgundy"') < 0 && (burgP.indexOf('data-v45="keep" data-v45-arg="burgundy"') > 0 || burgP.indexOf('Optional map downloads are unavailable in this browser.') > 0) && burgP.indexOf('v45-storage') + burgP.indexOf('Optional map downloads') > burgP.indexOf('class="v55-map"'));
  check('a map with field notes of its own (' + ownNotes.length + ', ' + ownNotes[0] + ' among them) carries them on its region page', ownNotes.length > 0 && np.indexOf('<details class="v28-q v56-fieldnotes"><summary>The field notes</summary>') > 0 && np.indexOf('class="v45-studies"') > 0, ownNotes.join(' '));
  const sd = A.G('v56SheetDoorsHtml("france")');
  check('the sheet view\'s study doors: Flash France, Drill France, Map quiz, District cards', sd.indexOf('data-v56="sheetflash" data-sheet="france"') > 0 && sd.indexOf('>Flash France<') > 0 && sd.indexOf('data-v56="drillc" data-key="france"') > 0 && sd.indexOf('>Drill France<') > 0 && sd.indexOf('data-view="v56mapquiz"') > 0 && sd.indexOf('data-view="v56districts"') > 0, sd);
  const tf = A.J('(function () { v32Go({ view: "region", arg: "burgundy" }, "push"); var t = v46For("burgundy")[0].slug; v46Go(t); var a = { view: S.view, t: S._v46technique, lit: v25NavWord(), parent: v32ParentRoute(), kept: sessionStorage.getItem("oot-codex-v56-techfrom") }; '
    + 'v32Go({ view: "worldmap", arg: "" }, "push"); v25Go("techniques"); a.root = { view: S.view, lit: v25NavWord(), parent: v32ParentRoute() }; '
    + 'v46Go(t); a.deeper = { lit: v25NavWord(), parent: v32ParentRoute() }; '
    + 'v32Go({ view: "library" }, "push"); v46Go(""); a.lib = { view: S.view, lit: v25NavWord(), parent: v32ParentRoute() }; return a; })()');
  check('a technique opened from Burgundy lights Wine Atlas and climbs back to Burgundy (kept for a reload)', tf.view === 'technique' && tf.lit === 'worldmap' && JSON.stringify(tf.parent) === JSON.stringify({ view: 'region', arg: 'burgundy' }) && /"region"/.test(tf.kept || ''), JSON.stringify(tf));
  check('the Workshop from the root\'s chip lights Wine Atlas and climbs to the root, a technique from there too', tf.root.view === 'techniques' && tf.root.lit === 'worldmap' && JSON.stringify(tf.root.parent) === JSON.stringify({ view: 'worldmap', arg: '' }) && tf.deeper.lit === 'worldmap' && JSON.stringify(tf.deeper.parent) === JSON.stringify({ view: 'worldmap', arg: '' }), JSON.stringify(tf.root));
  check('the Workshop from the Library is the Library\'s, as before (lit More, climbing to the Library)', tf.lib.view === 'techniques' && tf.lib.lit === 'more' && JSON.stringify(tf.lib.parent) === JSON.stringify({ view: 'library' }), JSON.stringify(tf.lib));
  A.G('S.view = "home";');

  /* ================================================================ */
  section('8. the fourteen off the map');
  const MORE = ROSTER.MORE_LIST.map((x) => x.slug);
  const offIdx = INDEX.regions.filter((r) => r.mapless || typeof r.index !== 'number');
  const offLive = A.J('v39Regions().filter(function (a) { return v56OffMap(a); }).map(function (a) { return a.slug; })');
  check('the index carries exactly the roster\'s ' + MORE.length + ' articles off the map, each mapless 1, no index and no field map (' + offLive.join(', ') + ')',
    MORE.length === 14 && JSON.stringify(offIdx.map((r) => r.slug).sort()) === JSON.stringify(MORE.slice().sort()) && JSON.stringify(offLive.slice().sort()) === JSON.stringify(MORE.slice().sort()) && offIdx.every((r) => r.mapless === 1 && r.index === undefined), JSON.stringify(offIdx.map((r) => r.slug)));
  const R0 = await bootDevice();
  const offHub = R0.page('S.view = "worldmap"; S.wmap = null; worldMapView();');
  drawn.push(['the root with the fourteen', offHub]);
  const ROW = (slug) => R0.J('(function () { var a = v39Find(' + JSON.stringify(slug) + '); var c = v39CountryOf(a.sheet); return { name: a.name, sheet: a.sheet, key: v39CountryKey(c), cname: c.name, districts: a.districts }; })()');
  const hubBad = [], courseBad = [];
  MORE.forEach((slug) => {
    const r = ROW(slug);
    const at = offHub.indexOf('data-v55-country="' + r.key + '"');
    const grp = at >= 0 ? offHub.slice(at, offHub.indexOf('</section>', at)) : '';
    const line = unesc((new RegExp('data-v55-count="' + slug + '">([^<]*)<').exec(grp) || [])[1] || '');
    const n = treeNames(REC[slug] && REC[slug].places, []).length;
    if (grp.indexOf('data-v39="region" data-slug="' + slug + '"') < 0 || line !== (n === 1 ? '1 district' : n + ' districts') + ' · field map to come' || r.districts !== n) hubBad.push(slug + ' under ' + r.key + ': ' + line);
    const i = course.indexOf('region:' + slug);
    const s = subjOf[i];
    const map = (CMS_DATA.subjects.filter((x) => x.id === s)[0] || { map: {} }).map;
    const nr = A.J('v56Near("region", ' + JSON.stringify(slug) + ')');
    if (i < 0 || i >= courtN || (map.regions || []).indexOf(slug) < 0 || !nr.prev || !nr.next) courseBad.push(slug + ' at ' + i + ' under ' + s);
  });
  check('each on the root under its country, its line its district count (the index\'s, equal to its reading\'s) and field map to come', hubBad.length === 0, hubBad.join(' | '));
  check('each in the Court\'s part of the course, under a subject whose map names it, with Previous and Next', courseBad.length === 0, courseBad.join(' | '));
  const F = await bootDevice();
  await F.load([...new Set(MORE.map((slug) => F.G('v39PartName(v39Find(' + JSON.stringify(slug) + '))')))]);
  const pageBad = [];
  const sheetsSeen = {};
  for (const slug of MORE) {
    const r = ROW(slug);
    const p = F.page('S.view = "region"; S._v39region = ' + JSON.stringify(slug) + '; v39RegionView();');
    if (slug === 'jura' || slug === 'txakoli' || slug === 'virginia') drawn.push([slug + ', off the map', p]);
    const at8 = (x) => p.indexOf(x);
    const bad = [];
    if (p.indexOf('class="v55-mapfig v55-sheetfig" data-v55-sheet="' + r.sheet + '"') < 0) bad.push('no sheet');
    if (unesc(p).indexOf('<p class="v32-line v56-tocome">The field map of ' + r.name + ' is to come. Until it is drawn, the map of ' + r.cname + ' shows the country it belongs to; its districts are listed below.</p>') < 0) bad.push('no line');
    if (!(at8('class="v55-map"') > at8('v56-minute-h"') && at8('class="v55-map"') < at8('<section class="v55-districts"'))) bad.push('order');
    const row = (/<nav class="v56-srow v56"[^>]*>([\s\S]*?)<\/nav>/.exec(p) || ['', ''])[1];
    const labels = attr(row, />([^<]+)<\/button>/g);
    if (labels[0] !== 'Summary' || labels[1] !== 'Map' || labels.indexOf('Map quiz') >= 0 || row.indexOf('data-go="v56mapquiz"') >= 0 || labels.indexOf('Previous') < 0 || labels.indexOf('Next') < 0 || labels.indexOf('Districts') < 0) bad.push('row ' + labels.join(','));
    const places = attr(p, /data-v55-place="([^"]*)"/g);
    const missing = treeNames(REC[slug].places, []).filter((n) => places.indexOf(n) < 0);
    if (missing.length) bad.push('missing ' + missing.slice(0, 3).join(', '));
    const got = minuteGot(p), w = minuteWant(Object.assign({}, REC[slug], { grapes: F.J('v39Find(' + JSON.stringify(slug) + ').grapes || []') }));
    if (JSON.stringify(got.rows) !== JSON.stringify(w) || w.length < 4) bad.push('minute ' + JSON.stringify(got.rows).slice(0, 120));
    if (bad.length) pageBad.push(slug + ': ' + bad.join(', '));
    sheetsSeen[r.key] = 1;
  }
  check('each page shows its country\'s sheet with the line that its field map is to come, after In one minute and before The districts; its study row a Map and no Map quiz; every place of its reading in The districts; In one minute from its record', pageBad.length === 0, pageBad.join(' | '));
  const cpBad = [];
  Object.keys(sheetsSeen).forEach((key) => {
    const cpage = F.page('S.view = "country"; S._v39country = ' + JSON.stringify(key) + '; v39CountryView();');
    MORE.filter((slug) => ROW(slug).key === key).forEach((slug) => { if (!new RegExp('data-v55-count="' + slug + '">[^<]*field map to come<').test(cpage) || cpage.indexOf('data-v39="region" data-slug="' + slug + '"') < 0) cpBad.push(key + ': ' + slug); });
    if (key === 'france') drawn.push(['france with its four', cpage]);
  });
  check('each country page (' + Object.keys(sheetsSeen).join(', ') + ') lists its own with the line field map to come', cpBad.length === 0, cpBad.join(' | '));
  F.G('S.view = "home";');

  /* ================================================================ */
  section('9. the field atlas shown cleanly');
  const AMER = /\b(neighbor(s|ing|ed|hood)?|center|centers|centered|toward|color(s|ed|ful|ing)?|flavor(s|ed|ful)?|favor(s|ed|ite|able)?|harbor|gray|meters?|program|aging|northeast\w*|northwest\w*|southeast\w*|southwest\w*)\b/i;
  const DASHES = new RegExp('[' + String.fromCharCode(8211) + String.fromCharCode(8212) + ']');
  const shownFields = (m) => [m.title, m.summary, m.scope, m.water].concat(JSON.stringify(m.grapes || ''), JSON.stringify(m.notes || {})).concat((m.places || []).map((p) => [p.note, p.kind, p.lessonNote].filter(Boolean).join(' ')));
  const rawMaps = A.J('FIELD_ATLAS.maps');
  const cleanMaps = A.J('v45Maps()');
  const rawBad = rawMaps.reduce((n, m) => n + shownFields(m).filter((x) => typeof x === 'string' && (AMER.test(x) || DASHES.test(x))).length, 0);
  const cleanBad = [];
  cleanMaps.forEach((m) => shownFields(m).forEach((x) => { if (typeof x === 'string' && (AMER.test(x) || DASHES.test(x))) cleanBad.push(m.id + ': ' + x.slice(0, 80)); }));
  check('the field atlas\'s data holds ' + rawBad + ' shown strings with an American spelling or an en dash, and is left untouched', rawBad > 0 && A.G('FIELD_ATLAS.maps[0] !== v45Maps()[0]'));
  check('every map codex45 hands out reads clean (' + cleanMaps.length + ' maps, ' + cleanBad.length + ' left)', cleanBad.length === 0 && cleanMaps.length === rawMaps.length, cleanBad.slice(0, 4).join(' | '));
  check('names, joins, sources and artwork untouched: every place\'s name and lessonName, every file, hash and source as the data holds them',
    rawMaps.every((m, i) => m.id === cleanMaps[i].id && m.file === cleanMaps[i].file && m.sha256 === cleanMaps[i].sha256 && JSON.stringify(m.sources) === JSON.stringify(cleanMaps[i].sources) && m.places.every((p, j) => p.name === cleanMaps[i].places[j].name && p.lessonName === cleanMaps[i].places[j].lessonName && p.lat === cleanMaps[i].places[j].lat)));
  check('the copies are made once: v45Map hands out the same object each time', A.G('v45Map("burgundy") === v45Map("burgundy")'));

  /* ================================================================ */
  section('10. voice and the file');
  const words = A.J('V56_WORDS');
  const wordBad = Object.keys(words).map((k) => [k, voiceProblems(words[k])]).filter((x) => x[1].length);
  check('every word of V56_WORDS passes the strictest voice rules (' + Object.keys(words).length + ')', wordBad.length === 0, JSON.stringify(wordBad));
  const SUPER = /\b(best|most|finest|greatest|largest|smallest|highest|lowest|oldest|newest|easiest|hardest|fastest|ultimate)\b/i;
  const AMER_W = /\b(color\w*|center\w*|toward|favor\w*|flavor\w*|\w+iz(e|es|ed|ing)|gray|program|practice)\b/i;
  const wordStyle = Object.keys(words).filter((k) => SUPER.test(words[k]) || AMER_W.test(words[k]) || /\bLevel\s+\d/.test(words[k]));
  check('no superlative, no American spelling and no numbered level among them', wordStyle.length === 0, wordStyle.map((k) => k + ': ' + words[k]).join(' | '));
  const pageV = [];
  drawn.forEach(([name, html]) => {
    const said = shown(html);
    voiceProblems(said.replace(/[^\x00-↏]/g, '')).forEach((p) => { if (!/mark/.test(p)) pageV.push(name + ': ' + p); });
  });
  check('no page drawn here shows a dash, the retired word or a level numeral (' + drawn.length + ' pages)', pageV.length === 0, pageV.slice(0, 6).join(' | '));
  const src = fs.readFileSync(path.join(JS, 'codex56.js'), 'utf8');
  const read = src.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
  const prose = (t) => t.replace(/(^|[^\w])Practise(?!\w)/g, '$1');
  const srcBad = voiceProblems(prose(src)).concat(voiceProblems(prose(read)));
  check('codex56.js (its escapes read as the characters they are): no dash of any kind, never the retired word, no level numeral, no mark at or above U+2190', srcBad.length === 0, srcBad.join(', '));
  check('codex56.js names nobody and ships no key and no model name', !/Lizzy|sk-ant|api[_-]?key|claude-|\bopus\b|\bsonnet\b|\bhaiku\b/i.test(src));
  check('codex56.js declares with var and function only (no let, const, class or arrow)', !/(^|[^\w.'"])(let|const|class)\s/.test(src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/'(?:[^'\\]|\\.)*'/g, "''")) && src.indexOf('=>') < 0);
  const wrappers = src.split('\n').filter((l) => /^\s*var _v56\w+ = \w+;$/.test(l));
  check('codex56.js edits no earlier layer: every wrapper (' + wrappers.length + ') is typeof guarded', wrappers.length > 20 && wrappers.every((line) => { const t = /= (\w+);$/.exec(line)[1]; return src.indexOf('typeof ' + t + ' === \'function\'') >= 0; }), wrappers.filter((line) => { const t = /= (\w+);$/.exec(line)[1]; return src.indexOf('typeof ' + t + ' === \'function\'') < 0; }).join(' | '));
  const selfBad = voiceProblems(fs.readFileSync(__filename, 'utf8').replace(/(^|[^\w])Practise(?!\w)/g, '$1')).filter((p) => !/retired|numeral/.test(p));
  check('check-atlas-course.js itself carries no dash and no mark at or above U+2190', selfBad.length === 0, selfBad.join(', '));

  /* ================================================================ */
  section('11. the shell and the chain rule');
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  const i55 = index.indexOf('src="js/codex55.js'), i56 = index.indexOf('src="js/codex56.js?v='), iBoot = index.indexOf('src="js/boot.js');
  check('index.html loads js/codex56.js once, with ?v=, after codex55.js and before boot.js', i56 > i55 && i55 > 0 && i56 < iBoot && index.split('js/codex56.js').length === 2);
  const v = Number((sw.match(/const CACHE = '(?:oot-)?codex-v(\d+)';/) || [])[1]);
  check('sw.js is codex-v115 or later (' + v + ') and lists ./js/codex56.js once, after ./js/codex55.js', v >= 115 && sw.indexOf("'./js/codex56.js'") > sw.indexOf("'./js/codex55.js'") && sw.indexOf("'./js/codex55.js'") > 0 && sw.split("'./js/codex56.js'").length === 2);
  const gates = fs.readdirSync(__dirname).filter((f) => /^(check-|list-harness)[\w-]*\.c?js$/.test(f));
  const short = gates.filter((f) => {
    const t = fs.readFileSync(path.join(__dirname, f), 'utf8');
    const n55 = (t.match(/'codex55\.js'\s*,\s*'boot\.js'/g) || []).length;
    const listed = (t.match(/'codex55\.js'\s*[,\]]/g) || []).length;
    const next = (t.match(/'codex55\.js'\s*,\s*'codex56\.js'/g) || []).length;
    return n55 > 0 || listed > next;
  });
  check('the chain rule: every list in a gate here that names codex55.js names codex56.js straight after it (' + gates.length + ' gates read)', !short.length, short.join(', '));
}

main().then(() => {
  console.log('');
  if (failed) { console.log('check-atlas-course: ' + failed + ' of ' + (passed + failed) + ' checks FAILED'); process.exit(1); }
  console.log('check-atlas-course: all ' + passed + ' checks pass');
  process.exit(0);
}).catch((e) => { console.error(e && e.stack || e); process.exit(1); });
