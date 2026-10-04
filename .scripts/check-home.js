/**
 * THE FOUR-LEVEL HOME, HELD TO ITS CONTRACT.
 *
 * codex25 is the Codex's half of a contract the World Table and the
 * Bartender's Ledger keep too: the same markup, the same words and the same
 * figure rule in all three, so the three homes read as one family. A contract
 * nobody measures drifts one app at a time, so this measures it, against the
 * SHIPPED layer chain loaded into a VM, the way check-merge.js does.
 *
 * What it asserts:
 *   1. every global a door, a train or a row routes through exists
 *   2. the met arithmetic: Untouched, N% met clamped to 1..99, Met; the card
 *      as the MEAN of its counted subsections (not a pooled sum); the lowest
 *      level not yet met
 *   3. the home: exactly section.levels then nav.quiet; four button.level,
 *      each lv-name and lv-stat and no numeral, seen or hidden (the owner's
 *      rule of 27 Sep 2026: a level is named, never numbered, so the name is
 *      the card's label); exactly one "on", with aria-pressed
 *      and the words "Your level"; four doors with their names; the Today
 *      line naming the level it deals from
 *   4. the level page: an h1 that is the name alone, then the blurb, then
 *      twelve subsections, each with an h2, "N at this level", its word and
 *      its training doors; every data-go resolvable; the level test last,
 *      named for the level ("The Village test")
 *   5. the chosen-level flag: never written by a load, written by a card tap,
 *      and a device with answers grandfathered on the level it had
 *   6. the level test, sat end to end in the VM: every answer wrong, and the
 *      report says what was missed with the right answers and no score
 *   7. voice: no long dash, no double hyphen, none of the retired study word,
 *      no pictorial codepoint and no level numeral ("Level" and a roman
 *      numeral), in the layer's source or anything it draws
 *
 *   node .scripts/check-home.js            the standalone tree
 *   node .scripts/check-home.js <jsDir>    another tree, such as the Outside
 *                                          Of Time wing's codex/js; a
 *                                          data-firstpath.js there is loaded
 *
 * Exits non-zero if any check fails. The last line is the verdict.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const JS = process.argv.slice(2).find((a) => a.charAt(0) !== '-')
  || path.join(__dirname, '..', 'js');

/* The chain in index.html's order. The two optional files are the ones the
   two trees differ on: codex13 is the standalone's, data-firstpath the
   wing's. Everything else is required. */
const OPTIONAL = new Set(['codex13.js', 'data-firstpath.js', 'codex28.js']);
const FILES = ['data-questions.js', 'reference.js', 'core.js', 'codex2.js', 'codex3.js',
  'codex4.js', 'codex5.js', 'data-primers.js', 'codex6.js', 'data-intro.js',
  'data-primers-intro.js', 'data-grapes-plus.js', 'data-tasting.js', 'data-floor.js',
  'data-pairing.js', 'data-maps.js', 'data-advanced.js', 'data-primers-advanced.js',
  'data-master.js', 'data-primers-master.js', 'codex7.js', 'codex8.js', 'codex9.js',
  'codex10.js', 'codex11.js', 'codex12.js', 'data-firstpath.js', 'codex13.js', 'codex14.js',
  'codex15.js', 'data-producers.js', 'menu-desk.js', 'wine-rows.js', 'codex16.js',
  'codex17.js', 'codex18.js', 'codex19.js', 'codex20.js', 'codex21.js', 'codex22.js',
  'codex23.js', 'codex24.js', 'codex25.js', 'codex26.js', 'codex27.js', 'codex28.js', 'boot.js'];

/* The plan's words, verbatim, as the source of truth the layer is held to. */
const NAMES = ['Régionale', 'Village', 'Premier Cru', 'Grand Cru'];
/* A level shown or read aloud by number: named, never numbered. */
const NUMERAL_RE = /\bLevel\s+(I|II|III|IV)\b/;
const KEYS = ['intro', 'certified', 'advanced', 'master'];
const BLURBS = [
  'The whole district in one glass: the foundations, the world map and the classics, all of it multiple choice, and speed and certainty win it.',
  'Narrowing to a village means naming what you are given: multiple choice, matching and short answer, so you produce the answer rather than pick it.',
  'A named parcel is claimed, not guessed: short answer deep in appellation law, producers and vintages, produced cold, because recognition is no longer enough.',
  'Grand cru needs no qualifier and neither may you: every answer from memory with nothing to lean on, in your own words, graded on your honour.'
];
const TEST_LINE_VILLAGE = 'Forty theory questions, a four glass grid and six floor situations. No clock. It ends on what you missed, with the right answers.';
const DOOR_NAMES = ['Today', 'Library', 'Record', 'Mine · Our Wine List'];
const DOOR_IDS = ['door-today', 'door-library', 'door-record', 'door-mine'];
const NAV_WORDS = ['Home', 'Levels', 'Library', 'Mine'];
const STAT_RE = /^(Untouched|Met|[1-9]% met|[1-9][0-9]% met)$/;

/* ---------------- the harness ---------------- */

function loadChain(seed) {
  const store = Object.create(null);
  Object.keys(seed || {}).forEach((k) => { store[k] = seed[k]; });
  /* ONE shared node that answers every question with itself, as in
     check-merge.js: core.js reaches through parentNode and querySelector in
     the same expression at parse time, and this harness never renders. */
  let NODE;
  const stubEl = () => NODE;
  NODE = {
    style: {}, dataset: {}, value: '', checked: false, disabled: false, hidden: false,
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
  const sandbox = {
    console,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    },
    location: { href: 'http://localhost/', search: '', hash: '', pathname: '/' },
    navigator: { userAgent: 'node', onLine: true },
    setTimeout, clearTimeout, setInterval, clearInterval,
    matchMedia: () => ({ matches: false, addEventListener() { }, addListener() { } }),
    requestAnimationFrame: (f) => setTimeout(f, 0),
    alert() { }, confirm: () => false, prompt: () => null,
    fetch: () => Promise.reject(new Error('no network in this harness')),
    scrollTo() { }, scrollBy() { }, getComputedStyle: () => ({ getPropertyValue: () => '' }),
    innerWidth: 1024, innerHeight: 768, devicePixelRatio: 1,
    addEventListener() { }, removeEventListener() { },
    history: { pushState() { }, replaceState() { }, back() { } },
    speechSynthesis: undefined, Notification: undefined,
    performance: { now: () => 0 },
    URL: globalThis.URL, Blob: globalThis.Blob, TextEncoder: globalThis.TextEncoder,
    Intl: globalThis.Intl, Date: globalThis.Date, Math: globalThis.Math, JSON: globalThis.JSON,
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
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
  const loaded = [];
  for (const f of FILES) {
    const p = path.join(JS, f);
    if (!fs.existsSync(p)) {
      if (OPTIONAL.has(f)) continue;
      console.error('missing ' + f + ' in ' + JS);
      process.exit(1);
    }
    try { vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f }); loaded.push(f); }
    catch (e) {
      console.error('FAILED to load ' + f + ': ' + e.message);
      console.error(String(e.stack).split('\n').slice(0, 6).join('\n'));
      process.exit(1);
    }
  }
  const G = (expr) => vm.runInContext(expr, ctx);
  return { ctx, G, store, loaded };
}

/* ---------------- a strict little HTML reader ----------------
   Enough to hold markup this layer writes to a contract: every element
   closed, nothing mis-nested. A tree this cannot read is itself a failure. */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'source', 'track', 'wbr']);
function decode(s) {
  return String(s).replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|#39|apos|nbsp);/gi, (m, e) => {
    const k = e.toLowerCase();
    if (k === 'amp') return '&'; if (k === 'lt') return '<'; if (k === 'gt') return '>';
    if (k === 'quot') return '"'; if (k === '#39' || k === 'apos') return "'";
    if (k === 'nbsp') return ' ';
    if (k.charAt(1) === 'x') return String.fromCodePoint(parseInt(k.slice(2), 16));
    return String.fromCodePoint(parseInt(k.slice(1), 10));
  });
}
function parseHTML(html) {
  const root = { tag: '#root', attrs: {}, children: [], parent: null };
  let cur = root;
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>|([^<]+)|(<)/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].slice(0, 4) === '<!--') continue;
    if (m[5] !== undefined) { cur.children.push({ text: decode(m[5]) }); continue; }
    if (m[6] !== undefined) { cur.children.push({ text: '<' }); continue; }
    const tag = m[2].toLowerCase();
    if (m[1] === '/') {
      if (cur.tag !== tag) throw new Error('</' + tag + '> closes <' + cur.tag + '>');
      cur = cur.parent; continue;
    }
    const attrs = {};
    const ar = /([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    let a;
    while ((a = ar.exec(m[3]))) {
      const v = a[2] !== undefined ? a[2] : a[3] !== undefined ? a[3] : a[4] !== undefined ? a[4] : '';
      attrs[a[1].toLowerCase()] = decode(v);
    }
    const node = { tag, attrs, children: [], parent: cur };
    cur.children.push(node);
    if (!VOID.has(tag) && m[4] !== '/') cur = node;
  }
  if (cur !== root) throw new Error('<' + cur.tag + '> is never closed');
  return root;
}
const kids = (n) => n.children.filter((c) => c.tag);
const classes = (n) => (n.attrs && n.attrs.class ? n.attrs.class.split(/\s+/) : []);
const hasClass = (n, c) => classes(n).indexOf(c) >= 0;
function all(n, pred, out) {
  out = out || [];
  (n.children || []).forEach((c) => { if (c.tag) { if (pred(c)) out.push(c); all(c, pred, out); } });
  return out;
}
const byClass = (n, c) => all(n, (x) => hasClass(x, c));
const byTag = (n, t) => all(n, (x) => x.tag === t);
function text(n) {
  if (n.text !== undefined) return n.text;
  return (n.children || []).map(text).join('');
}
const squash = (s) => String(s).replace(/\s+/g, ' ').trim();

/* ---------------- the checks ---------------- */

let passed = 0, failed = 0;
function check(what, ok, detail) {
  if (ok) { passed++; console.log('   ok    ' + what); }
  else { failed++; console.log('   FAIL  ' + what + (detail ? '  (' + detail + ')' : '')); }
}
function section(name) { console.log(''); console.log('--- ' + name + ' ---'); }
function tryParse(what, html) {
  try { return parseHTML(html); }
  catch (e) { check(what + ' parses as well-formed markup', false, e.message); return null; }
}

/* The keep-set of the "typography, not pictures" rule, as far as this layer
   uses it: accents, the middle dot, typographic quotes, the ellipsis and the
   en dash. Anything from the arrows block up, and every emoji, is refused. */
function voiceProblems(s) {
  const out = [];
  if (s.indexOf('\u2014') >= 0) out.push('a long dash (U+2014)');
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

const H = loadChain();
const G = H.G;
console.log('check-home: ' + H.loaded.length + ' files loaded from ' + JS);
const rendered = [];   /* every string the layer draws, for the voice sweep */

/* 1. ------------------------------------------------------------------ */
section('every routed global exists');
const ROUTED = ['startDrill', 'startSectionExam', 'startDomainExam', 'startWeakness', 'startEndless',
  'startLightning', 'startSudden', 'startReview', 'gridStart', 'startTastingFlight', 'startFlash',
  'floorStart', 'pairStart', 'startFinals', 'startDaily', 'startFlagged', 'startCellarDrill',
  'startCellarRecite', 'v24OpenMaitre', 'v24OpenDesk', 'home', 'render', 'topbar', 'applyLevel',
  'examDomains', 'serviceReadiness', 'lvlFlags', 'graderDisputes', 'badReports', 'prodCorpus',
  'codexFind', 'codexFindHtml', 'prodById', 'prodGroups', 'v23Sheets', 'mapRegions', 'dueList',
  'keyOwned', 'missKey', 'homeView', 'finalsReportView', 'finalsAfterTheory', 'gridMark',
  'gridCurrent', 'gridCallsFor', 'tasteProfile', 'tasteWorldOk', 'floorPick', 'floorHave',
  'gridTally', 'gridView', 'floorView', 'decorateQuiz', 'examHallView', 'examStatLine',
  'compendiumView', 'encyView', 'prodView', 'primerList', 'primerView', 'vidView', 'refView',
  'dashView', 'hallView', 'syncView', 'maitreView', 'planView', 'disputesView', 'examDate',
  'cellarView', 'deskView', 'serviceView', 'tastingView', 'tasteGridView', 'shuffle', 'stopTimer', 'resetQ',
  'stSave', 'v18Landmarks', 'v18Focus', 'v18Signature', 'v24Inbox', 'v24Share', 'v24ReadIn',
  'v24WhenRead', 'v25HomeHtml', 'v25LevelHtml', 'v25Met', 'v25MetWord', 'v25Figure',
  'v25LevelStat', 'v25FirstUnmet', 'v25ChooseLevel', 'v25Nav', 'v25Leave', 'v25Go',
  'v25TestReportHtml', 'v25NavHtml', 'v25LibraryHtml', 'v25RecordHtml', 'v25MineHtml',
  'v25TodayHtml', 'v25Domains'];
const missingFns = ROUTED.filter((n) => G('typeof ' + n) !== 'function');
check(ROUTED.length + ' routed functions are defined', !missingFns.length, missingFns.join(', '));
const REG = ['V25_GO', 'V25_TRAIN', 'V25_LIBRARY', 'V25_RECORD', 'V25_MINE', 'V25_PATH_GO', 'V25_LEVELS'];
const missingReg = REG.filter((n) => G('typeof ' + n) !== 'object');
check('the registries ' + REG.join(', ') + ' exist', !missingReg.length, missingReg.join(', '));
const goNotFn = G('Object.keys(V25_GO).filter(function(k){return typeof V25_GO[k]!=="function";})');
check('every V25_GO entry is a function', !goNotFn.length, goNotFn.join(', '));
const regKeys = G('[].concat(Object.keys(V25_TRAIN), V25_LIBRARY.map(function(r){return r.key;}), '
  + 'V25_RECORD.map(function(r){return r.key;}), V25_MINE.map(function(r){return r.key;}))');
const unrouted = regKeys.filter((k) => G('typeof V25_GO[' + JSON.stringify(k) + ']') !== 'function');
check('every registry key resolves through V25_GO (' + regKeys.length + ')', !unrouted.length, unrouted.join(', '));
check('V25_LEVELS keys are LEVEL_ORDER', JSON.stringify(G('V25_LEVELS.map(function(l){return l.key;})')) === JSON.stringify(G('LEVEL_ORDER')));
if (G('typeof FIRST_PATH') !== 'undefined') {
  const noPath = G('FIRST_PATH.filter(function(s){return typeof V25_PATH_GO[s.id]!=="function";}).map(function(s){return s.id;})');
  check('every first-week step has a V25_PATH_GO door (the wing)', !noPath.length, noPath.join(', '));
}
check('homeView is codex25\'s, so the whole decorateHome chain meets a home it does not recognise',
  G('String(homeView)').indexOf('v25HomeHtml') >= 0);

/* 5 (first half). ------------------------------------------------------ */
section('the chosen level, on a fresh device');
check('a load never writes codexLevelChosen', !('codexLevelChosen' in H.store), JSON.stringify(H.store.codexLevelChosen));
check('a fresh device opens on the lowest level not yet met (Régionale)', G('activeLevel') === 'intro', G('activeLevel'));

/* 2. ------------------------------------------------------------------ */
section('the met rule');
const W = (m, t) => G('v25MetWord(' + m + ',' + t + ')');
check('0 of 10 reads Untouched', W(0, 10) === 'Untouched', W(0, 10));
check('10 of 10 reads Met', W(10, 10) === 'Met', W(10, 10));
check('1 of 1000 clamps up to 1% met, never 0%', W(1, 1000) === '1% met', W(1, 1000));
check('999 of 1000 clamps down to 99% met, never 100%', W(999, 1000) === '99% met', W(999, 1000));
check('1 of 2 reads 50% met', W(1, 2) === '50% met', W(1, 2));

function freshRecord() {
  G('stReset(); ST.tgrid = {}; ST.floor = {}; ST.pairs = {}; ST.serv = {}; S.svc = null; MISS = [];');
}
freshRecord();
const words = () => KEYS.map((k) => G('v25LevelStat(' + JSON.stringify(k) + ').word'));
check('a fresh record reads Untouched on all four cards', words().every((w) => w === 'Untouched'), words().join(' | '));
check('a fresh record\'s first unmet level is Régionale', G('v25FirstUnmet()') === 'intro', G('v25FirstUnmet()'));

G('ST.q["intro|" + missKey(INTRO_QUESTIONS[0])] = { c: 1, w: 0, s: 1 };');
const one = G('v25Met("intro")');
check('one Régionale answer met: v25Met counts it over the whole bank', one.met === 1 && one.total === G('INTRO_QUESTIONS.length'), JSON.stringify(one));
check('one Régionale answer met: the card reads 1% met (the clamp)', G('v25LevelStat("intro").word') === '1% met', G('v25LevelStat("intro").word'));
check('one Régionale answer met: the other three still read Untouched', words().slice(1).every((w) => w === 'Untouched'), words().join(' | '));

/* The mean rule: the Floor alone met at Régionale. Pooled, four situations
   in a level of nearly two thousand items would round to nothing; as the
   mean of the counted subsections it is one in however many are counted. */
freshRecord();
G('FLOOR.filter(function(x){return x.lvl==="intro";}).forEach(function(x){ ST.floor[x.id] = { n: 1, c: 1 }; });');
const counted = G('(function(){ var n = v25Domains("intro").length;'
  + ' if (v25Grapes("intro").length) n++;'
  + ' if (FLOOR.filter(function(x){return x.lvl==="intro";}).length) n++;'
  + ' if (PAIRS.filter(function(x){return x.lvl==="intro";}).length) n++;'
  + ' if (serviceReadiness().total) n++; return n; })()');
const expectMean = Math.max(1, Math.min(99, Math.round(100 / counted))) + '% met';
check('the card is the MEAN of ' + counted + ' counted subsections: the Floor alone met reads ' + expectMean,
  G('v25LevelStat("intro").word') === expectMean, G('v25LevelStat("intro").word'));
check('"The whole paper" is shown but never counted', G('v25Subs("intro").filter(function(s){return s.kind==="paper";})[0].counted') === false);

/* Everything at Régionale met: the card reads Met and the next level up is
   the first unmet. */
freshRecord();
G('INTRO_QUESTIONS.forEach(function(q){ ST.q["intro|" + missKey(q)] = { c: 1, w: 0, s: 1 }; });'
  + 'v25Grapes("intro").forEach(function(g){ ST.tgrid[g.g] = { n: 1, c: 1, f: {} }; });'
  + 'FLOOR.filter(function(x){return x.lvl==="intro";}).forEach(function(x){ ST.floor[x.id] = { n: 1, c: 1 }; });'
  + 'PAIRS.filter(function(x){return x.lvl==="intro";}).forEach(function(x){ ST.pairs[x.id] = { n: 1, c: 1 }; });'
  + '(function(){ var svc = {}; SERVICE.forEach(function(r, i){ svc[i] = r.steps.map(function(){ return true; }); });'
  + ' ST.serv = { svc: svc, ts: "2026-09-26" }; })();');
check('every counted item at Régionale met: the card reads Met', G('v25LevelStat("intro").word') === 'Met', G('v25LevelStat("intro").word'));
check('every counted item at Régionale met: the first unmet level is Village', G('v25FirstUnmet()') === 'certified', G('v25FirstUnmet()'));
check('the service ritual counts at Village too (the same subsection at every level)', G('v25Subs("certified").filter(function(s){return s.kind==="service";})[0].word') === 'Met');

/* 3. ------------------------------------------------------------------ */
section('the home, at each level');
KEYS.forEach((key, i) => {
  G('applyLevel(' + JSON.stringify(key) + ', true); S.view = "home";');
  const html = G('v25HomeHtml()');
  rendered.push(html);
  const root = tryParse('the home at ' + NAMES[i], html);
  if (!root) return;
  const top = kids(root);
  check('[' + NAMES[i] + '] #view holds exactly section.levels then nav.quiet',
    top.length === 2 && top[0].tag === 'section' && hasClass(top[0], 'levels') && top[1].tag === 'nav' && hasClass(top[1], 'quiet'),
    top.map((n) => n.tag + '.' + classes(n).join('.')).join(', '));
  if (top.length !== 2) return;
  check('[' + NAMES[i] + '] the levels are labelled Levels and the doors Doors',
    top[0].attrs['aria-label'] === 'Levels' && top[1].attrs['aria-label'] === 'Doors');
  check('[' + NAMES[i] + '] no heading on the home', !all(root, (n) => /^h[1-6]$/.test(n.tag)).length);
  const cards = kids(top[0]);
  const shape = cards.length === 4 && cards.every((c, j) => c.tag === 'button' && hasClass(c, 'level')
    && c.attrs['data-level'] === String(j + 1) && c.attrs.id === 'lv-' + (j + 1) && c.attrs.type === 'button');
  check('[' + NAMES[i] + '] four button.level, data-level 1 to 4, ids lv-1 to lv-4', shape);
  if (cards.length !== 4) return;
  const statsOk = cards.every((c, j) => {
    const name = byClass(c, 'lv-name')[0], stat = byClass(c, 'lv-stat')[0];
    /* named, never numbered: no numeral on sight and none hidden for a screen
       reader either, so the visible name is the card's label */
    const parts = kids(c).map((k) => classes(k).join('.')).join(' ');
    return name && stat && /^lv-name lv-stat( lv-here)?$/.test(parts)
      && !byClass(c, 'sr-only').length && !byClass(c, 'lv-num').length && text(name) === NAMES[j]
      && STAT_RE.test(text(stat)) && text(stat) === G('v25LevelStat(' + JSON.stringify(KEYS[j]) + ').word');
  });
  check('[' + NAMES[i] + '] each card is lv-name and lv-stat alone, no numeral seen or hidden, the stat the shared figure', statsOk,
    cards.map((c) => squash(text(c))).join(' | '));
  const on = cards.filter((c) => hasClass(c, 'on'));
  check('[' + NAMES[i] + '] exactly one card is on, and it is ' + NAMES[i],
    on.length === 1 && on[0].attrs['data-level'] === String(i + 1));
  check('[' + NAMES[i] + '] aria-pressed is true on it and false on the others',
    cards.every((c) => c.attrs['aria-pressed'] === (hasClass(c, 'on') ? 'true' : 'false')));
  const here = byClass(top[0], 'lv-here');
  check('[' + NAMES[i] + '] the words "Your level" are on that card and no other',
    here.length === 1 && text(here[0]) === 'Your level' && on.length === 1 && byClass(on[0], 'lv-here').length === 1);
  const doors = kids(top[1]);
  check('[' + NAMES[i] + '] four doors, ids ' + DOOR_IDS.join(', '),
    doors.length === 4 && doors.every((d, j) => hasClass(d, 'door') && d.attrs.id === DOOR_IDS[j]));
  check('[' + NAMES[i] + '] the door names are ' + DOOR_NAMES.join(', '),
    doors.length === 4 && doors.every((d, j) => byClass(d, 'door-name')[0] && text(byClass(d, 'door-name')[0]) === DOOR_NAMES[j]),
    doors.map((d) => byClass(d, 'door-name')[0] ? text(byClass(d, 'door-name')[0]) : '?').join(', '));
  check('[' + NAMES[i] + '] every door has a line', doors.every((d) => byClass(d, 'door-line')[0] && text(byClass(d, 'door-line')[0]).length));
  const todayLine = doors[0] && byClass(doors[0], 'door-line')[0] ? text(byClass(doors[0], 'door-line')[0]) : '';
  check('[' + NAMES[i] + '] the Today line says "Today deals from ' + NAMES[i] + '"',
    todayLine === 'Today deals from ' + NAMES[i] || todayLine.indexOf('Today deals from ' + NAMES[i] + ' · ') === 0, todayLine);
  const gos = all(root, (n) => n.attrs && n.attrs['data-go'] !== undefined).map((n) => n.attrs['data-go']);
  const bad = gos.filter((g) => G('typeof V25_GO[' + JSON.stringify(g) + ']') !== 'function');
  check('[' + NAMES[i] + '] every data-go on the home is in V25_GO', !bad.length, bad.join(', '));
});

/* 4. ------------------------------------------------------------------ */
section('the level page, at each level');
KEYS.forEach((key, i) => {
  G('applyLevel(' + JSON.stringify(key) + ', true); S.view = "level";');
  const html = G('v25LevelHtml()');
  rendered.push(html);
  const root = tryParse('the level page at ' + NAMES[i], html);
  if (!root) return;
  const top = kids(root);
  const h1 = top[0];
  check('[' + NAMES[i] + '] it opens on an h1 that is the name alone, no numeral',
    h1 && h1.tag === 'h1' && !byClass(h1, 'lv-num').length && !kids(h1).length
    && squash(text(h1)) === NAMES[i], h1 ? squash(text(h1)) : 'none');
  const mainName = G('v25MainName()');
  rendered.push(mainName);
  check('[' + NAMES[i] + '] the page\'s main landmark is named ' + NAMES[i] + ', no numeral', mainName === NAMES[i], mainName);
  check('[' + NAMES[i] + '] then the blurb, verbatim from the plan',
    top[1] && top[1].tag === 'p' && text(top[1]) === BLURBS[i], top[1] ? text(top[1]) : 'none');
  const ol = top[2];
  check('[' + NAMES[i] + '] then ol.subsections', ol && ol.tag === 'ol' && hasClass(ol, 'subsections'));
  if (!ol) return;
  const subs = kids(ol);
  const expectN = G('v25Domains(' + JSON.stringify(key) + ').length') + 5;
  check('[' + NAMES[i] + '] ' + expectN + ' li.subsection' + (key === 'certified' ? ' (twelve at Village)' : ''),
    subs.length === expectN && subs.every((s) => s.tag === 'li' && hasClass(s, 'subsection'))
    && (key !== 'certified' || subs.length === 12), String(subs.length));
  const names = subs.map((s) => { const h = kids(s)[0]; return h && h.tag === 'h2' ? text(h) : '?'; });
  check('[' + NAMES[i] + '] each subsection opens on an h2, the last five The whole paper, Tasting, The Floor, Pairing, Service',
    names.every((n) => n !== '?' && n.length) && names.slice(-5).join('|') === 'The whole paper|Tasting|The Floor|Pairing|Service',
    names.join(' | '));
  check('[' + NAMES[i] + '] the first ' + (expectN - 5) + ' are the domains of examDomains()',
    JSON.stringify(names.slice(0, expectN - 5)) === JSON.stringify(G('examDomains().map(function(d){return d[0];})')));
  check('[' + NAMES[i] + '] each says "N at this level"', subs.every((s) => /[\d,]+ at this level/.test(text(s))));
  check('[' + NAMES[i] + '] each carries its word and figure, and the uncounted whole paper words in place of one',
    subs.every((s) => {
      const st = byClass(s, 'sub-stat')[0];
      if (!st) return false;
      if (hasClass(s, 'sub-paper')) return text(st) === 'Counted in the domains above';
      return STAT_RE.test(text(st)) || text(st) === 'Nothing to meet here yet';
    }),
    subs.map((s) => byClass(s, 'sub-stat')[0] ? text(byClass(s, 'sub-stat')[0]) : '?').join(' | '));
  check('[' + NAMES[i] + '] each has at least one training door', subs.every((s) => byClass(s, 'train').length >= 1));
  check('[' + NAMES[i] + '] headings are h1 then h2 only', !all(root, (n) => /^h[3-6]$/.test(n.tag)).length
    && byTag(root, 'h1').length === 1);
  const gos = all(root, (n) => n.attrs && n.attrs['data-go'] !== undefined);
  const bad = gos.map((n) => n.attrs['data-go']).filter((g) => G('typeof V25_GO[' + JSON.stringify(g) + ']') !== 'function');
  check('[' + NAMES[i] + '] every data-go (' + gos.length + ') is in V25_GO', !bad.length, bad.join(', '));
  const cats = G('Object.keys(cats())');
  const catArgs = gos.filter((n) => ['drill', 'secexam', 'chapter'].indexOf(n.attrs['data-go']) >= 0);
  check('[' + NAMES[i] + '] every section door names a real section of this level',
    catArgs.length && catArgs.every((n) => cats.indexOf(n.attrs['data-arg']) >= 0));
  const doms = G('examDomains().map(function(d){return d[0];})');
  check('[' + NAMES[i] + '] every domain exam names a real domain',
    gos.filter((n) => n.attrs['data-go'] === 'domexam').every((n) => doms.indexOf(n.attrs['data-arg']) >= 0));
  const chapters = gos.filter((n) => n.attrs['data-go'] === 'chapter');
  check('[' + NAMES[i] + '] every Chapter door opens a chapter that exists (' + chapters.length + ')',
    chapters.every((n) => G('v25HasChapter(' + JSON.stringify(n.attrs['data-arg']) + ', ' + JSON.stringify(key) + ')')));
  const tests = byClass(root, 'leveltest');
  const last = tests[tests.length - 1];
  check('[' + NAMES[i] + '] the last thing is button.leveltest "The ' + NAMES[i] + ' test"',
    last && last.tag === 'button' && text(last) === 'The ' + NAMES[i] + ' test' && last.attrs['data-go'] === 'leveltest'
    && top[top.length - 1] && byClass(top[top.length - 1], 'leveltest').length === 1, last ? text(last) : 'none');
  if (key === 'certified') {
    const line = byClass(root, 'lt-line')[0];
    check('[Village] the level test line is the plan\'s, verbatim', line && text(line) === TEST_LINE_VILLAGE, line ? text(line) : 'none');
  }
  check('[' + NAMES[i] + '] the level test line carries no digit', byClass(root, 'lt-line')[0] && !/\d/.test(text(byClass(root, 'lt-line')[0])));
});

/* the other pages, and the nav */
section('the other pages, and the nav');
G('applyLevel("certified", true);');
[['Library', 'v25LibraryHtml()'], ['Record', 'v25RecordHtml()'], ['Mine', 'v25MineHtml()'], ['Today', 'v25TodayHtml()']].forEach(([name, fn]) => {
  const html = G(fn);
  rendered.push(html);
  const root = tryParse('the ' + name + ' page', html);
  if (!root) return;
  const gos = all(root, (n) => n.attrs && n.attrs['data-go'] !== undefined).map((n) => n.attrs['data-go']);
  const bad = gos.filter((g) => G('typeof V25_GO[' + JSON.stringify(g) + ']') !== 'function');
  check('the ' + name + ' page: every data-go (' + gos.length + ') is in V25_GO', gos.length && !bad.length, bad.join(', '));
  if (name === 'Library') {
    check('the Library carries the search box, #cf-in and #cf-out',
      all(root, (n) => n.attrs.id === 'cf-in').length === 1 && all(root, (n) => n.attrs.id === 'cf-out').length === 1);
    check('the Library counts the chapters at Village, by name', /\d chapters? at Village/.test(squash(text(root))), squash(text(root)));
  }
  if (name === 'Record') {
    check('the Record measures readiness at Village, by name', squash(text(root)).indexOf('readiness at Village') >= 0);
  }
  if (name === 'Today') {
    check('the Today page names the level it deals from', squash(text(root)).indexOf('Today deals from Village.') >= 0);
  }
});
[['home', 'Home'], ['level', 'Levels'], ['library', 'Library'], ['mine', 'Mine'], ['record', 'Mine'], ['quiz', 'Levels']].forEach(([view, word]) => {
  const html = G('S._v25area = null; S.view = ' + JSON.stringify(view) + '; v25NavHtml()');
  rendered.push(html);
  const root = tryParse('the nav on ' + view, html);
  if (!root) return;
  const nav = kids(root)[0];
  const btns = nav ? kids(nav) : [];
  check('on ' + view + ': nav.appnav reads Home, Levels, Library, Mine, with aria-current on ' + word,
    nav && nav.tag === 'nav' && hasClass(nav, 'appnav') && btns.map(text).join('|') === NAV_WORDS.join('|')
    && btns.filter((b) => b.attrs['aria-current'] === 'page').map(text).join('|') === word,
    btns.map((b) => text(b) + (b.attrs['aria-current'] ? '*' : '')).join(' '));
});
rendered.push(G('V25_NONAFFIL'));
rendered.push(G('Object.keys(V25_TRAIN).map(function(k){return V25_TRAIN[k].label;}).join(" | ")'));
check('the colophon carries the non-affiliation line', /Not affiliated with, endorsed by, or connected to the Court of Master Sommeliers\./.test(G('V25_NONAFFIL')));

/* 5 (second half). ----------------------------------------------------- */
section('the chosen level, when a card is tapped');
G('S.view = "home"; applyLevel("intro", true);');
G('v25ChooseLevel("advanced")');
check('a card tap writes codexLevelChosen', H.store.codexLevelChosen === '1', JSON.stringify(H.store.codexLevelChosen));
check('a card tap switches the level and opens its page', G('activeLevel') === 'advanced' && G('S.view') === 'level');
const grand = loadChain({ codexStats: JSON.stringify({ q: { 'c-00000000': { c: 1, w: 0, s: 1 } } }), codexLevel: 'advanced' });
check('a device with answers and no flag is grandfathered on the level it had, and nothing is written',
  grand.G('activeLevel') === 'advanced' && !('codexLevelChosen' in grand.store),
  grand.G('activeLevel') + ' / ' + grand.store.codexLevelChosen);
const unused = loadChain({ codexLevel: 'advanced' });
check('a device with no answers and no flag opens on the lowest level not yet met',
  unused.G('activeLevel') === 'intro' && !('codexLevelChosen' in unused.store), unused.G('activeLevel'));
const chose = loadChain({ codexLevel: 'master', codexLevelChosen: '1' });
check('a device that chose keeps its choice', chose.G('activeLevel') === 'master', chose.G('activeLevel'));

/* 6. ------------------------------------------------------------------ */
section('the level test, sat end to end at Village, every answer wrong');
freshRecord();
G('applyLevel("certified", true); S.view = "level";');
G('startFinals()');
check('the Finals is renamed The Village test', G('MODE_LABEL.finals') === 'The Village test' && G('MODE_NOUNS.finals') === 'The Village test');
check('the theory paper is under way untimed', G('S.mode') === 'finals' && G('S.view') === 'quiz' && G('S.timer') === null);
const asked = G('S.pool.length');
let guard = 0;
while (G('S.view') === 'quiz' && guard++ < 200) {
  G('(function(){ var q = S.pool[S.idx];'
    + ' if (q.mt || q.sel) gradeCustom(q, false, "(none)");'
    + ' else if (q.sa) submitSA();'
    + ' else pickMC((q.a + 1) % q.opts.length);'
    + ' next(); })()');
}
check('after ' + asked + ' wrong answers the sitting moves to the glasses', G('S.view') === 'grid', G('S.view'));
check('every theory miss was captured, with the answer given', G('S._v25lt.theory.length') === asked, String(G('S._v25lt.theory.length')));
const glasses = G('S.tg ? S.tg.deck.length : 0');
guard = 0;
while (G('S.view') === 'grid' && guard++ < 200) {
  const last = G('(function(){ var tg = S.tg, qs = gridQuestions(), q = qs[tg.step];'
    + ' if (q.kind === "call") gridPick("call", q.k, String((tasteProfile(gridCurrent().g)[q.k] + 1) % TASTE_STEPS.length));'
    + ' else if (q.kind === "world") gridPick("world", "", tasteProfile(gridCurrent().g).world === "old" ? "new" : "old");'
    + ' else if (q.kind === "clim") gridPick("clim", "", tasteProfile(gridCurrent().g).clim === "cool" ? "warm" : "cool");'
    + ' else gridPick("grape", "", tg.opts.filter(function(n){ return n !== gridCurrent().g; })[0]);'
    + ' return tg.revealed && (tg.idx + 1) >= tg.deck.length; })()');
  if (G('S.tg.revealed')) {
    if (last) {
      check('inside the test the grid\'s percentage tally is dropped', G('gridTally(S.tg)') === '');
      G('gridAgain()');
    } else G('gridNext()');
  }
}
check('after ' + glasses + ' glasses the sitting moves to the floor', G('S.view') === 'floor', G('S.view'));
check('every glass was captured as named wrongly', G('S._v25lt.grid.filter(function(g){return !g.named;}).length') === glasses);
const situations = G('S.fl ? S.fl.deck.length : 0');
guard = 0;
while (G('S.view') === 'floor' && guard++ < 50) {
  G('(function(){ var f = S.fl, it = f.deck[f.idx]; floorPick((it.best + 1) % it.opts.length); floorNext(); })()');
}
check('after ' + situations + ' situations the sitting ends on the report', G('S.view') === 'finalsreport', G('S.view'));
check('every situation was captured as missed', G('S._v25lt.floor.length') === situations);
const report = G('v25TestReportHtml()');
check('the report says "What you missed, with the right answers. No score."',
  report.indexOf('What you missed, with the right answers. No score.') >= 0);
check('the groups read Theory · ' + asked + ' missed, Tasting · ' + glasses + ' glasses named wrongly, The floor · ' + situations + ' missed',
  report.indexOf('Theory · ' + asked + ' missed') >= 0 && report.indexOf('Tasting · ' + glasses + ' glasses named wrongly') >= 0
  && report.indexOf('The floor · ' + situations + ' missed') >= 0);
check('every theory miss shows the answer given and the right one',
  (report.match(/class="mu">Your answer: /g) || []).length === asked && (report.match(/class="ma">The answer: /g) || []).length === asked);
const twice = G('(function(){ var by = {}; S._v25lt.theory.forEach(function(m){ by[m.q.cat] = (by[m.q.cat] || 0) + 1; });'
  + ' return Object.keys(by).filter(function(c){ return by[c] >= 2; }); })()');
check('a Drill door for every section missed twice (' + twice.length + '), and none for a section missed once',
  twice.every((c) => report.indexOf('data-arg="' + c.replace(/&/g, '&amp;') + '"') >= 0)
  && (report.match(/data-go="drill"/g) || []).length === twice.length);
check('the report is headed The Village test and offers Back to Village and Home',
  report.indexOf('<h2>The Village test</h2>') >= 0 && report.indexOf('>Back to Village</button>') >= 0 && report.indexOf('data-go="home"') >= 0);
check('the sitting is still recorded, for the Record', !!G('ST.exams.certified && ST.exams.certified["finals:The Finals"]'));
G('S._v25lt = null; S._fin = null;');
check('outside a test the grid keeps its tally', G('gridTally({ struct: { n: 4, c: 2 }, concl: { n: 4, c: 2 }, missed: [] })').indexOf('%') >= 0);

/* The report's own words, on a fixture whose data carries no figure, so any
   percentage or score in it would be the layer's. */
G('S._v25lt = { lv: "certified", gridSat: true, floorSat: true,'
  + ' theory: [ { q: { cat: "Burgundy", q: "Stem one", ans: "Answer one", exp: "Because", sa: 1, accept: [] }, user: "<b>typed</b>" },'
  + '           { q: { cat: "Burgundy", q: "Stem two", opts: ["A", "B"], a: 0, exp: "Because" }, user: "B" } ],'
  + ' grid: [ { grape: "Nebbiolo", named: false, said: "Sangiovese", wrong: [ { label: "Acid", mine: "Low", right: "High" } ], tell: "Tar and roses" } ],'
  + ' floor: [ { s: "A corked bottle", mine: "Pour it", right: "Replace it", why: "Taint" } ] };');
const fixture = G('v25TestReportHtml()');
rendered.push(fixture);
const fixRoot = tryParse('the report on a fixture', fixture);
check('the report carries no percentage and no "n of m" score', !/%/.test(fixture) && !/\d+\s*(of|\/)\s*\d+/.test(fixture));
check('typed answers are escaped in the report', fixture.indexOf('&lt;b&gt;typed&lt;/b&gt;') >= 0 && fixture.indexOf('<b>typed</b>') < 0);
check('a section missed twice earns its Drill door on the fixture', fixture.indexOf('Drill Burgundy') >= 0);
G('S._v25lt = { lv: "certified", gridSat: true, floorSat: true, theory: [], grid: [], floor: [] };');
const clean = G('v25TestReportHtml()');
rendered.push(clean);
check('nothing missed anywhere reads "Nothing missed." in each group', (clean.match(/Nothing missed\./g) || []).length === 3);
if (fixRoot) check('the report\'s groups are h3 under its h2', byTag(fixRoot, 'h2').length === 1 && byTag(fixRoot, 'h3').length === 3);
G('S._v25lt = null;');

/* 7. ------------------------------------------------------------------ */
section('voice');
const src = fs.readFileSync(path.join(JS, 'codex25.js'), 'utf8');
const srcProblems = voiceProblems(src);
check('codex25.js itself: no long dash, no double hyphen, no retired word, no glyph, no level numeral',!srcProblems.length, srcProblems.join(', '));
/* the gate holds itself to the rule it enforces */
const selfProblems = voiceProblems(fs.readFileSync(__filename, 'utf8'));
check('check-home.js itself: the same', !selfProblems.length, selfProblems.join(', '));
check('codex25.js declares with var and function only', !/^\s*(let|const|class)\s/m.test(src) && src.indexOf('=>') < 0);
const drawn = rendered.join('\n');
const drawnProblems = voiceProblems(drawn);
check('every string the layer draws (' + rendered.length + ' pages and parts): the same', !drawnProblems.length, drawnProblems.join(', '));

console.log('');
if (failed) {
  console.log('check-home: ' + failed + ' of ' + (passed + failed) + ' checks FAILED');
  process.exit(1);
}
console.log('check-home: all ' + passed + ' checks pass');
process.exit(0);
