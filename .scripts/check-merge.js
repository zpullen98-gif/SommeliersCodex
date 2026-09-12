/**
 * IS THE PROGRESS MERGE RE-RUNNABLE, AND DOES IT STILL MERGE?
 *
 * Two questions that have to be asked together, because each one alone is
 * satisfiable by a bug. A merge that changes nothing on a repeat import might
 * be idempotent, or might simply be broken. A merge that combines two records
 * might be correct, or might be double counting. This asks both.
 *
 * WHY IT EXISTS. codex15 was written to make the merge idempotent and its own
 * header said it had succeeded: importing the same file twice was now the same
 * as importing it once. That was true of the stores codex4 merges and FALSE of
 * the ones codex8 adds, which the survey never reached. Measured here, against
 * the tree before codex17, over three imports of one file:
 *
 *     lifetime tasting calls    40/31  ->  160/124
 *     grader overrides            3/1  ->     12/4
 *     question reports              2  ->        8
 *
 * and from the second import onward the app told the student, in these words,
 * that it had already merged the file and nothing had changed. A wrong number
 * is bad. A wrong number underneath a reassurance is worse, and that is the
 * defect this gate exists to keep out.
 *
 * It also covers the two stores that were not merged at all: ST.serv, the
 * service rehearsal, which codex12 named as its cautionary tale and then left
 * unmerged, and ST.path, the first week, which belongs to the monorepo wing.
 *
 * HOW. The real layer chain is loaded into a VM against a DOM thin enough to
 * parse against and never render, so what is measured is the SHIPPED merge and
 * not a description of it.
 *
 * IF YOU ADD A STORE TO ST, add it to the snapshot and to the second-device
 * expectations below. A store this file does not name is a store the next
 * import can drop without either the app or this gate saying anything.
 *
 *   node .scripts/check-merge.js            the live tree
 *   node .scripts/check-merge.js --no17     the same tree with codex17 left
 *                                           out, which is how the drift above
 *                                           was measured. Expected to FAIL.
 *
 * Exits non-zero if anything drifted on a repeat import, or if a genuinely
 * different record failed to merge.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const JS = process.argv.slice(2).find((a) => a.charAt(0) !== '-')
  || path.join(__dirname, '..', 'js');
const WITHOUT_17 = process.argv.includes('--no17');

/* The layer chain, in index.html's order. Data files are loaded because the
   layers read them at parse time. */
const FILES = ['data-questions.js', 'reference.js', 'core.js', 'codex2.js', 'codex3.js',
  'codex4.js', 'codex5.js', 'data-primers.js', 'codex6.js', 'data-intro.js',
  'data-primers-intro.js', 'data-grapes-plus.js', 'data-advanced.js',
  'data-primers-advanced.js', 'data-master.js', 'data-primers-master.js',
  'codex7.js', 'codex8.js', 'codex9.js', 'codex10.js', 'codex11.js', 'codex12.js',
  'codex13.js', 'codex14.js', 'codex15.js', 'data-producers.js', 'wine-parse.js',
  'wine-rows.js', 'codex16.js'].concat(WITHOUT_17 ? [] : ['codex17.js'])
  /* codex18 and codex19 are part of the chain and codex19 owns a merge clause
     of its own, so the harness has to run them or it proves nothing about the
     newest store. codex18 injects a stylesheet at load, which is why the
     document stub below grew createElement and a head. */
  .concat(['data-tasting.js', 'codex18.js', 'codex19.js', 'codex20.js',
  /* Every layer after codex20 too. None of codex21, 22 or 23 owns a merge
     clause, but this list is also the only place the whole chain is loaded in
     order outside a browser, and that is what catches a new layer calling a
     helper the Codex does not have. codex20 shipped with a call to First
     Light's FL_ACTS and would have thrown on load; nothing here would have
     said so while the list stopped short of it. */
    'data-floor.js', 'data-pairing.js', 'codex21.js', 'codex22.js',
    'data-maps.js', 'codex23.js']);

/* A DOM thin enough for the layers to parse against and never render. */
const store = Object.create(null);
/* ONE shared node that answers every question with itself. A tree of fresh
   stubs is not enough: core.js reaches through parentNode and querySelector in
   the same expression at parse time, and any null on that chain throws. This
   harness never renders, so a node that is its own parent and its own child is
   exactly as much DOM as it needs. */
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
  location: { href: 'http://localhost/', search: '', hash: '' },
  navigator: { userAgent: 'node', onLine: true, serviceWorker: undefined },
  setTimeout, clearTimeout, setInterval, clearInterval,
  matchMedia: () => ({ matches: false, addEventListener() { }, addListener() { } }),
  requestAnimationFrame: (f) => setTimeout(f, 0),
  alert() { }, confirm: () => false, prompt: () => null,
  fetch: () => Promise.reject(new Error('no network in this harness')),
  /* render() runs while the chain is still being parsed, so everything it
     touches on the way past has to exist. */
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
  /* Stubs rather than null: core.js assigns innerHTML on a looked-up node at
     parse time, and this harness only needs the merge chain to exist. */
  getElementById: stubEl, querySelector: stubEl, querySelectorAll: () => [],
  addEventListener() { }, removeEventListener() { },
  readyState: 'complete', title: '',
  createElement: () => stubEl(), createTextNode: () => stubEl(),
  get head() { return stubEl(); }, get body() { return stubEl(); },
};

let loaded = 0;
for (const f of FILES) {
  const p = path.join(JS, f);
  if (!fs.existsSync(p)) { console.error('missing ' + f); continue; }
  try { vm.runInNewContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: f }); loaded++; }
  catch (e) {
    console.error('FAILED to load ' + f + ': ' + e.message);
    console.error(String(e.stack).split(String.fromCharCode(10)).slice(0, 6).join(String.fromCharCode(10)));
    process.exit(1);
  }
}

const W = vm.runInNewContext(
  '({ST, mergeStats, stSave, exportPayload, stReset})', sandbox);

/* ---- a device with some history on it ---------------------------------- */
W.ST.q['q-alpha'] = { c: 10, w: 2, s: 3 };
W.ST.q['q-beta'] = { c: 4, w: 5, s: 0 };
W.ST.sess = 6;
W.ST.tast = { n: 40, c: 31 };
W.ST.grader['q-alpha'] = { r: 3, w: 1, t: 'a note' };
W.ST.bad['q-beta'] = { n: 2, q: 'a stem' };
W.ST.serv = { svc: { step1: true }, ts: '2026-09-01' };
W.ST.path = { words: 1757000000000 };

const snap = () => JSON.parse(JSON.stringify({
  q_alpha: W.ST.q['q-alpha'], sess: W.ST.sess, tast: W.ST.tast,
  grader_alpha: W.ST.grader['q-alpha'], bad_beta: W.ST.bad['q-beta'],
  serv: W.ST.serv, path: W.ST.path,
  exams: W.ST.exams && W.ST.exams.certified && W.ST.exams.certified['secexam:Bordeaux'],
  tgrid: W.ST.tgrid && W.ST.tgrid['Nebbiolo'],
}));

const before = snap();
/* the file this device would hand to another: its own record */
/* exportPayload returns a JSON STRING, which is what gets written to the file.
   Parse it once, the way the import does. */
const payload = JSON.parse(W.exportPayload());

console.log((WITHOUT_17 ? 'WITHOUT codex17' : 'WITH codex17') + ', ' + loaded + ' layers loaded');
console.log('start        ', JSON.stringify(before));

for (let i = 1; i <= 3; i++) {
  const msg = W.mergeStats(JSON.parse(JSON.stringify(payload)));
  console.log('import #' + i + '     ', JSON.stringify(snap()));
  if (msg) console.log('   the app said: ' + msg);
}

const after = snap();
const moved = Object.keys(before).filter((k) => JSON.stringify(before[k]) !== JSON.stringify(after[k]));
console.log('');
if (moved.length) {
  console.log('FIELDS THAT DRIFTED: ' + moved.join(', '));
  moved.forEach((k) => console.log('   ' + k + ': ' + JSON.stringify(before[k]) + '  ->  ' + JSON.stringify(after[k])));
  process.exitCode = 1;
} else {
  console.log('nothing drifted: three imports of one file are the same as none');
}

/* ═══════════ a SECOND device, so idempotence is not just inertia ═══════════
   A merge that changes nothing could be a merge that does nothing. This is the
   other half: a different device's record, carrying a genuinely fuller reading
   of one question, a newer service rehearsal, and an induction step the first
   device never finished. All three must land. */
console.log('');
console.log('--- now a DIFFERENT device, to prove the merge still merges ---');
const other = {
  codex: 'sommeliers-codex', v: 4, exported: '2026-09-12T00:00:00.000Z',
  exportId: 'other-device-01',
  stats: {
    q: { 'q-alpha': { c: 30, w: 1, s: 9 } },      /* 31 answers beats 12: should win whole */
    sess: 11,
    tast: { n: 5, c: 5 },                          /* thinner: must NOT overwrite 40/31 */
    grader: { 'q-alpha': { r: 9, w: 9 } },         /* 18 beats 4: should win */
    bad: { 'q-beta': { n: 1 } },                   /* lower: max keeps 2 */
    serv: { svc: { step1: true, step2: true }, ts: '2026-09-08' },  /* newer: should win */
    path: { words: 1757000000000, label: 1756000000000 },           /* one new step */
    /* codex19: best takes the higher, n takes the larger, and neither may
       climb on a second import of the same file. */
    exams: { certified: { 'secexam:Bordeaux': { best: 71, last: 71, n: 2 } } },
    /* codex20: per grape and per component, every number takes the larger. */
    tgrid: { 'Nebbiolo': { n: 4, c: 3, f: { acid: { n: 4, c: 4 }, tan: { n: 4, c: 2 } } } },
  },
};
const msg2 = W.mergeStats(JSON.parse(JSON.stringify(other)));
/* and again, because a count that sums rather than takes the larger is the
   defect codex17 exists to answer, and ST.exams carries one. */
W.mergeStats(JSON.parse(JSON.stringify(other)));
if (msg2) console.log('   the app said: ' + msg2);
const s2 = snap();
const expect = [
  ['q_alpha wins whole from the fuller record', s2.q_alpha.c === 30 && s2.q_alpha.w === 1],
  ['sess takes the higher', s2.sess === 11],
  ['tast keeps the fuller local pair, not the thinner incoming one', s2.tast.n === 40 && s2.tast.c === 31],
  ['grader takes the fuller incoming pair', s2.grader_alpha.r === 9 && s2.grader_alpha.w === 9],
  ['bad keeps the higher count', s2.bad_beta.n === 2],
  ['exams landed from the other device', s2.exams && s2.exams.best === 71 && s2.exams.n === 2],
  ['tgrid landed, per grape and per component', s2.tgrid && s2.tgrid.n === 4 && s2.tgrid.f.tan.c === 2],
  ['serv takes the newer rehearsal', !!(s2.serv && s2.serv.svc && s2.serv.svc.step2) && s2.serv.ts === '2026-09-08'],
  ['path gains the step the other device finished', !!(s2.path && s2.path.label)],
  ['path keeps the earlier stamp where both know a step', s2.path && s2.path.words === 1757000000000],
];
let bad2 = 0;
expect.forEach(([what, ok]) => { console.log('   ' + (ok ? 'ok  ' : 'FAIL') + '  ' + what); if (!ok) bad2++; });
console.log('   state: ' + JSON.stringify(s2));
if (bad2) process.exitCode = 1;
