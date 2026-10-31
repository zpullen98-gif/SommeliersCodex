#!/usr/bin/env node
/**
 * THE CMS EDITION: THE DATA GATE FOR codex53's TWO BUILT FILES
 *
 * codex53 (the CMS edition, October 2026) reads js/data-cms.js (CMS: the
 * subjects of the Court's curriculum guide with their quoted rows, maps and
 * questions, the syllabus, the tasting list and the grid) and js/data-grid.js
 * (GRID_READS, GRID_SAY, GRID_ALIASES), both built by .scripts/cms/build-cms.cjs
 * from the fragments under .scripts/cms (BRIEF-CMS.md is the contract). This
 * gate holds the two files to the brief and proves what only the built files
 * can prove:
 *
 *   1. the build: both files present, their headers naming the fragments
 *      folder that built them (a folder under this repo's .scripts/cms, never
 *      an absolute path or a scratch copy), and build-cms.cjs --check (spawned
 *      with that folder) finding them byte for byte the build of the
 *      fragments; a SEED built from fixtures passes only with --partial
 *   2. the subjects: 44 in the guide's order (unless --partial, when the ones
 *      present are in order), each a slug id of the brief with the brief's
 *      name, group, pages and order, the groups as the app prints them,
 *      certifiedOnly exactly the four (South France, Spain's other DOs,
 *      Greece, Cocktails), a blank Introductory outcome and cells on those, red
 *      only in Spirits and Liqueurs, at least three rows each with a topic and
 *      a cell (the Cocktails rows are names only, both cells blank, as the
 *      guide prints them), and no provenance shipped: a subject's edits,
 *      checked and fixture, a map's notes, and the edits and the checker's
 *      record (checked) of the syllabus, the tasting list and the grid
 *   3. the maps: every name resolves (cats in INTRO_GROUPS and DRILL_GROUPS,
 *      chapters in INTRO_PRIMERS ids and PRIMERS cats, regions and countries in
 *      REGIONS, grapes in GRAPES, GRAPES_PLUS and INTRO_GRAPES, techniques in
 *      roster.cjs, serviceRef in SERVICE_REF)
 *   4. the questions: every id an e- id that recomputes from the subject and
 *      the stem, unique within CMS and against the four banks (QUESTIONS,
 *      INTRO_QUESTIONS, ADV_QUESTIONS, MASTER_QUESTIONS) and REGIONS, shaped
 *      as the brief asks (four distinct options and a key not in the stem, or
 *      a model answer with an accept list, neither the answer nor an accepted
 *      form in the stem; an explanation of eight words), no stem written twice
 *      anywhere in CMS, and at least three per subject (unless --partial)
 *   5. the voice: no dash of any kind and nothing at or above U+2190 in any
 *      string; on every string of our own, British spelling (every American
 *      form in any case, a capitalised proper name inside a sentence spared),
 *      per cent and towards, never the retired word, never a numbered level;
 *      the Court's
 *      quoted words (the rows, the outcomes, the court line, the syllabus and
 *      the grid whole, the tasting notes, an accept list) spared the spelling;
 *      a fragment's edits list is spared it too in the build (the amendment
 *      of 29 October: provenance that never ships and quotes the Court's
 *      words, held to the dash and glyph rules only), and since it never
 *      ships this gate sees none
 *   6. the tasting list: eight whites and twelve reds as printed, twenty
 *      distinct names, every region with its places
 *   7. the grid: the two sheets in the brief's shape with the brief's keys;
 *      every GRID_READS entry keyed by its slug, its lines the grid's lines of
 *      its colour and its options the printed ones, its sell within two
 *      sentences; GRID_SAY for exactly the read grapes; GRID_ALIASES folded
 *      keys to read slugs
 *   8. the codex53 sandbox: the whole chain index.html loads, through
 *      codex53, in a node vm with inert registries and a stub DOM
 *      (.scripts/cms/chain.cjs): v53Subjects() is CMS.subjects in order; the
 *      six CMS views are registered and every one, every subject page among
 *      them, draws clean at all four levels (no undefined, its tags
 *      balanced, one table row per Court row, no dash, never the retired word
 *      in our own words, no numbered level); v53Questions(id) is the active
 *      level's mapped categories and the subject's CMS questions at Village
 *      and at Régionale, the CMS questions alone with scope cms, each an e-
 *      copy carrying its section; v53Readiness(id) on a seeded ST.q counts
 *      bare Village keys, intro| Régionale keys and the CMS keys in both
 *      forms, never a miss or a wrong form; an e- answer is kept in ST.q,
 *      never scheduled, never level progress, never an orphan, and found by
 *      the ledger; the deck cms:{id} is one card per Certified cell; the
 *      drill deals its pool and lights CMS; v53GridGrade marks a perfect
 *      sheet right on every line, the grape named, and a blank one wrong on
 *      every line, for every grid read
 *   9. the shell and the chain rule: index.html loads data-cms.js,
 *      data-grid.js and codex53.js straight after codex52.js and before
 *      boot.js, each once with ?v=; sw.js lists the three after
 *      ./js/codex52.js and its CACHE is past codex-v111; every list in a gate
 *      here that names codex52.js names the three after it; codex53.js
 *      declares with var and function only, carries no dash and no glyph at
 *      or above U+2190, names no level by numeral, never the retired study word,
 *      and names nobody
 *
 * Usage:
 *   node .scripts/check-cms.js [jsDir] [--partial]
 *
 * jsDir defaults to this repo's js/ and may be the site's wing copy
 * (codex/js); the fragments are always read from this repo, beside the gate.
 * A tree with no codex53.js (a wing not yet synced) is SKIPPED, as
 * check-brennans skips a tree with no codex41.
 * --partial accepts a seed or an incomplete build (fewer than 44 subjects,
 * fewer than three questions on a subject) and says so.
 *
 * Exits non-zero on any failure. The last line is the verdict.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const B = require(path.join(__dirname, 'cms', 'build-cms.cjs'));
const CF = require(path.join(__dirname, 'regions', 'check-fragment.cjs'));

const ARGS = process.argv.slice(2);
if (ARGS.indexOf('--help') >= 0 || ARGS.indexOf('-h') >= 0) {
  console.log('usage: node .scripts/check-cms.js [jsDir] [--partial]');
  process.exit(0);
}
let PARTIAL = false;
const positional = [];
for (let i = 0; i < ARGS.length; i++) {
  if (ARGS[i] === '--partial') PARTIAL = true;
  else if (ARGS[i].charAt(0) === '-') { console.error('check-cms: unknown option ' + ARGS[i]); process.exit(2); }
  else positional.push(ARGS[i]);
}
const JS = path.resolve(positional[0] || path.join(__dirname, '..', 'js'));
const CODEX_ROOT = path.join(__dirname, '..');
const CMS_FILE = path.join(JS, 'data-cms.js');
const GRID_FILE = path.join(JS, 'data-grid.js');
const LAYER = path.join(JS, 'codex53.js');
const CERTIFIED_ONLY = ['south-france', 'spain-other-dos', 'greece', 'cocktails'];
const MIN_QUESTIONS = 3;
if (!fs.existsSync(LAYER)) {
  console.log('check-cms: no codex53.js in ' + JS + ', SKIPPED');
  process.exit(0);
}

let passed = 0, failed = 0;
function check(what, ok, detail) {
  if (ok) { passed++; console.log('  ok    ' + what); }
  else { failed++; console.log('  FAIL  ' + what + (detail ? '  :: ' + detail : '')); }
}
function note(what) { console.log('  note  ' + what); }
function section(name) { console.log(''); console.log('--- ' + name + ' ---'); }
function few(list, n) { return list.slice(0, n || 8).join('; ') + (list.length > (n || 8) ? '; and ' + (list.length - (n || 8)) + ' more' : ''); }
function loadData(file) {
  const ctx = { window: {}, self: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: path.basename(file) });
  return ctx;
}
function unescape(src) { return src.replace(/\\u([0-9a-fA-F]{4})/g, (m, h) => String.fromCharCode(parseInt(h, 16))); }

/* ================================================================ */
section('1. the build');
let CMS = null, GRID_READS = null, GRID_SAY = null, GRID_ALIASES = null;
let fragmentsDir = null;
let seed = false;
check('js/data-cms.js is present', fs.existsSync(CMS_FILE), CMS_FILE);
check('js/data-grid.js is present', fs.existsSync(GRID_FILE), GRID_FILE);
if (fs.existsSync(CMS_FILE) && fs.existsSync(GRID_FILE)) {
  const cmsText = fs.readFileSync(CMS_FILE, 'utf8');
  const gridText = fs.readFileSync(GRID_FILE, 'utf8');
  const fromCms = B.fragmentsOf(cmsText);
  const fromGrid = B.fragmentsOf(gridText);
  check('both headers say what built them and from where, never a hand', !!fromCms && !!fromGrid && /^\/\* The CMS edition: built by \.scripts\/cms\/build-cms\.cjs from /.test(cmsText) && /^\/\* The grid reads: built by \.scripts\/cms\/build-cms\.cjs from /.test(gridText), 'cms: ' + fromCms + ', grid: ' + fromGrid);
  check('the two files name one fragments folder', fromCms && fromCms === fromGrid, fromCms + ' and ' + fromGrid);
  seed = /\n   A SEED built /.test(cmsText);
  if (seed) {
    if (PARTIAL) note('the files are a SEED (' + (cmsText.match(/A SEED built [^\n]*/) || [''])[0].replace(/ \*\/$/, '') + ')');
    else check('the files are the real build, not a seed', false, 'the header says they are a seed; pass --partial to accept one');
  }
  fragmentsDir = fromCms ? path.resolve(CODEX_ROOT, fromCms) : null;
  /* beside this gate means inside it: a header naming a folder outside .scripts/cms (an absolute path, a scratch copy)
     would let --check prove the files against fragments the repo does not hold (30 October, the verifier) */
  const inside = !!fromCms && !path.isAbsolute(fromCms) && !path.relative(path.join(CODEX_ROOT, '.scripts', 'cms'), fragmentsDir).startsWith('..');
  check('the fragments folder the header names is under .scripts/cms beside this gate and exists (' + fromCms + ')', inside && fs.existsSync(fragmentsDir), fragmentsDir);
  if (inside && fs.existsSync(fragmentsDir)) {
    const args = [path.join(__dirname, 'cms', 'build-cms.cjs'), '--check', '--fragments', fragmentsDir, '--out', JS].concat(PARTIAL ? ['--partial'] : []).concat([JS]);
    const r = spawnSync(process.execPath, args, { encoding: 'utf8' });
    const lines = ((r.stdout || '') + (r.stderr || '')).trim().split('\n').filter((l) => /^build-cms/.test(l));
    check('build-cms.cjs --check finds both files the build of the fragments' + (PARTIAL ? ' (--partial)' : ''), r.status === 0, few(lines, 6));
  }
  try {
    const c = loadData(CMS_FILE);
    CMS = c.CMS;
    const g = loadData(GRID_FILE);
    GRID_READS = g.GRID_READS; GRID_SAY = g.GRID_SAY; GRID_ALIASES = g.GRID_ALIASES;
  } catch (e) { check('both files parse as classic scripts', false, e.message); }
  check('data-cms.js declares CMS with groups, subjects, syllabus, tasting, grid and version', !!CMS && Array.isArray(CMS.groups) && Array.isArray(CMS.subjects) && 'syllabus' in CMS && 'tasting' in CMS && 'grid' in CMS && CMS.version === 1);
  check('data-grid.js declares GRID_READS, GRID_SAY and GRID_ALIASES, objects', !!GRID_READS && typeof GRID_READS === 'object' && !!GRID_SAY && typeof GRID_SAY === 'object' && !!GRID_ALIASES && typeof GRID_ALIASES === 'object');
}
if (!CMS) CMS = { groups: [], subjects: [], syllabus: null, tasting: null, grid: null };
GRID_READS = GRID_READS || {}; GRID_SAY = GRID_SAY || {}; GRID_ALIASES = GRID_ALIASES || {};
const SUBJECTS = Array.isArray(CMS.subjects) ? CMS.subjects.filter((s) => s && typeof s === 'object') : [];

/* ================================================================ */
section('2. the subjects');
check('CMS.groups are the ten groups as the app prints them, in the guide\'s order', JSON.stringify(CMS.groups) === JSON.stringify(B.GROUPS), JSON.stringify(CMS.groups).slice(0, 200));
const want = B.SUBJECTS;
if (PARTIAL) {
  check('subjects present: ' + SUBJECTS.length + ' of ' + want.length + ' (--partial: fewer accepted, none is not)', SUBJECTS.length > 0 && SUBJECTS.length <= want.length);
  if (SUBJECTS.length < want.length) note((want.length - SUBJECTS.length) + ' subject(s) not in the build yet: ' + few(want.filter((w) => !SUBJECTS.some((s) => s.id === w.id)).map((w) => w.id), 10));
} else check('44 subjects', SUBJECTS.length === want.length, String(SUBJECTS.length));
const orderProblems = [];
let lastOrder = 0;
SUBJECTS.forEach((s, i) => {
  const w = B.SUBJECT_BY_ID[s.id];
  if (!w) { orderProblems.push('subjects[' + i + '].id ' + JSON.stringify(s.id) + ' is no subject of the brief'); return; }
  if (s.order !== w.order) orderProblems.push(s.id + ': order ' + s.order + ', the brief says ' + w.order);
  if (!(s.order > lastOrder)) orderProblems.push(s.id + ': out of the guide\'s order');
  lastOrder = s.order;
  if (s.name !== w.name) orderProblems.push(s.id + ': name ' + JSON.stringify(s.name));
  if (s.group !== w.group) orderProblems.push(s.id + ': group ' + JSON.stringify(s.group));
  if (JSON.stringify(s.pages) !== JSON.stringify(w.pages)) orderProblems.push(s.id + ': pages ' + JSON.stringify(s.pages));
  if (s.certifiedOnly !== w.certifiedOnly) orderProblems.push(s.id + ': certifiedOnly ' + s.certifiedOnly);
});
check('every subject is the brief\'s, with its name, group, pages and order, in the guide\'s order', orderProblems.length === 0, few(orderProblems));
check('every id is a slug and no id is written twice', SUBJECTS.every((s) => /^[a-z0-9-]+$/.test(s.id)) && new Set(SUBJECTS.map((s) => s.id)).size === SUBJECTS.length);
const groupKeys = B.GROUPS.map((g) => g.key);
check('every group is one of the ten', SUBJECTS.every((s) => groupKeys.indexOf(s.group) >= 0));
const coPresent = SUBJECTS.filter((s) => s.certifiedOnly).map((s) => s.id);
check('certifiedOnly is exactly the four the guide marks' + (PARTIAL ? ' (of those present)' : ''), coPresent.every((id) => CERTIFIED_ONLY.indexOf(id) >= 0) && CERTIFIED_ONLY.every((id) => !SUBJECTS.some((s) => s.id === id) || coPresent.indexOf(id) >= 0) && (PARTIAL || coPresent.length === 4), coPresent.join(', ') || 'none');
check('a Certified-only subject carries a blank Introductory outcome and blank Introductory cells', SUBJECTS.filter((s) => s.certifiedOnly).every((s) => s.outcome && s.outcome.intro === '' && (s.rows || []).every((r) => r.intro === '')));
const redRows = [];
SUBJECTS.forEach((s) => (s.rows || []).forEach((r, i) => { if (r.red !== undefined && (r.red !== 1 || s.id !== B.RED_SUBJECT)) redRows.push(s.id + ' row ' + i); }));
check('red is printed only in Spirits and Liqueurs, as 1', redRows.length === 0, few(redRows));
const rowProblems = [];
let nRows = 0;
SUBJECTS.forEach((s) => {
  if (!Array.isArray(s.rows) || s.rows.length < B.MIN_ROWS) rowProblems.push(s.id + ': ' + (Array.isArray(s.rows) ? s.rows.length : 'no') + ' rows');
  else s.rows.forEach((r, i) => {
    nRows++;
    if (typeof r.topic !== 'string' || !r.topic.trim()) rowProblems.push(s.id + ' row ' + i + ': no topic');
    if (typeof r.intro !== 'string' || typeof r.certified !== 'string') rowProblems.push(s.id + ' row ' + i + ': cells not strings');
    else if (!r.intro.trim() && !r.certified.trim() && s.id !== B.NAMES_ONLY_SUBJECT) rowProblems.push(s.id + ' row ' + i + ': blank in both cells');
  });
  if (typeof s.court !== 'string' || !s.court.trim()) rowProblems.push(s.id + ': no court line');
  if (!s.outcome || typeof s.outcome.intro !== 'string' || typeof s.outcome.certified !== 'string' || !s.outcome.certified.trim()) rowProblems.push(s.id + ': outcome');
});
check('every subject has at least ' + B.MIN_ROWS + ' rows, each with a topic and a cell (the Cocktails rows names only), a court line and its outcomes (' + nRows + ' rows)', rowProblems.length === 0, few(rowProblems));
const shipped = [];
SUBJECTS.forEach((s) => {
  ['edits', 'checked', 'fixture'].forEach((k) => { if (k in s) shipped.push(s.id + '.' + k); });
  if (s.map && 'notes' in s.map) shipped.push(s.id + '.map.notes');
  if (s.map && 'id' in s.map) shipped.push(s.id + '.map.id');
});
['syllabus', 'tasting', 'grid'].forEach((k) => B.DOC_PROVENANCE.forEach((f) => { if (CMS[k] && typeof CMS[k] === 'object' && f in CMS[k]) shipped.push(k + '.' + f); }));
check('no provenance ships (a subject\'s edits, checked and fixture, a map\'s notes, a document\'s edits and checked)', shipped.length === 0, few(shipped));

/* ================================================================ */
section('3. the maps');
let names = null, sets = null;
try { names = B.loadNames(JS, { banks: true }); sets = B.nameSets(names); } catch (e) { check('the Codex\'s data files load for the names a map may use', false, e.message); }
if (names) {
  const mapProblems = [];
  let mapNames = 0, mapsFilled = 0;
  SUBJECTS.forEach((s) => {
    if (!s.map || typeof s.map !== 'object') { mapProblems.push(s.id + ': no map'); return; }
    B.mapProblems(s.map, s.id + '.map', sets).forEach((p) => mapProblems.push(p));
    const n = ['regions', 'countries', 'grapes', 'techniques', 'serviceRef'].reduce((a, k) => a + (Array.isArray(s.map[k]) ? s.map[k].length : 0), 0) + ['cats', 'chapters'].reduce((a, k) => a + (s.map[k] ? (s.map[k].intro || []).length + (s.map[k].certified || []).length : 0), 0);
    mapNames += n; if (n) mapsFilled++;
  });
  check('every map name resolves: cats, chapters, regions, countries, grapes, techniques, serviceRef (' + mapNames + ' names on ' + mapsFilled + ' of ' + SUBJECTS.length + ' subjects)', mapProblems.length === 0, few(mapProblems));
  if (mapsFilled < SUBJECTS.length) note((SUBJECTS.length - mapsFilled) + ' subject(s) with an empty map: ' + few(SUBJECTS.filter((s) => !s.map || !['regions', 'countries', 'grapes', 'techniques', 'serviceRef'].some((k) => (s.map[k] || []).length) && !['cats', 'chapters'].some((k) => s.map[k] && ((s.map[k].intro || []).length || (s.map[k].certified || []).length))).map((s) => s.id), 10));
}

/* ================================================================ */
section('4. the questions');
let nQuestions = 0;
if (names) {
  const banks = names.banks;
  const other = {};
  const addIds = (list, label) => (list || []).forEach((q) => { if (q && q.id) other[q.id] = label; });
  addIds(banks.QUESTIONS, 'QUESTIONS'); addIds(banks.INTRO_QUESTIONS, 'INTRO_QUESTIONS'); addIds(banks.ADV_QUESTIONS, 'ADV_QUESTIONS'); addIds(banks.MASTER_QUESTIONS, 'MASTER_QUESTIONS');
  const R = banks.REGIONS || {};
  (R.regions || []).forEach((r) => addIds(r && r.questions, 'REGIONS.regions'));
  Object.keys(R.countries || {}).forEach((k) => addIds(R.countries[k] && R.countries[k].questions, 'REGIONS.countries'));
  (R.techniques || []).forEach((t) => addIds(t && t.questions, 'REGIONS.techniques'));
  const idProblems = [], shapeProblems = [], fewQuestions = [];
  const seen = {};
  const stems = {}; /* one bank: a stem written twice under two subjects is refused, as the build refuses it */
  SUBJECTS.forEach((s) => {
    const qs = Array.isArray(s.questions) ? s.questions : [];
    if (qs.length < MIN_QUESTIONS) fewQuestions.push(s.id + ' (' + qs.length + ')');
    const ctx = { grapes: names.grapes, topics: (s.rows || []).map((r) => r.topic) };
    qs.forEach((q, i) => {
      nQuestions++;
      const w = s.id + '.questions[' + i + ']';
      if (!q || typeof q !== 'object') { shapeProblems.push(w + ': an object'); return; }
      if (!B.ID_RE.test(q.id)) idProblems.push(w + ': id ' + JSON.stringify(q.id) + ' is no e- id');
      else {
        const mint = B.mintId(s.id, q.q);
        if (q.id !== mint) idProblems.push(w + ': ' + q.id + ' does not recompute from the stem (' + mint + ')');
        if (seen[q.id]) idProblems.push(w + ': ' + q.id + ' also at ' + seen[q.id]);
        seen[q.id] = w;
        if (other[q.id]) idProblems.push(w + ': ' + q.id + ' is also an id of ' + other[q.id]);
      }
      const key = CF.fold(q.q);
      if (stems[key]) shapeProblems.push(w + ': the stem is also ' + stems[key]); else stems[key] = w;
      B.questionProblems(q, w, ctx).forEach((p) => shapeProblems.push(p));
    });
  });
  check('every question id is an e- id that recomputes from the subject and the stem, once in CMS and in no other bank (' + nQuestions + ' questions against ' + Object.keys(other).length + ' other ids)', idProblems.length === 0, few(idProblems));
  check('every question is shaped as the brief asks (four distinct options and a key not in the stem, or ans and accept with no accepted form in the stem; an explanation of ' + B.MIN_EXP_WORDS + ' words; grapes and row known; no stem twice in CMS)', shapeProblems.length === 0, few(shapeProblems));
  if (PARTIAL) { if (fewQuestions.length) note(fewQuestions.length + ' subject(s) under ' + MIN_QUESTIONS + ' questions (--partial): ' + few(fewQuestions, 10)); }
  else check('every subject carries at least ' + MIN_QUESTIONS + ' questions', fewQuestions.length === 0, few(fewQuestions, 10));
  /* the answer position (31 October): the engine never shuffles options and writers key the answer first, so the build
     deals the shipped copies (build-cms.cjs, the deal); no position may hold under 17 or over 33 per cent of the bank's
     multiple choice questions. A seed too small to measure (under 40 under --partial) is a note. */
  const pos = [0, 0, 0, 0];
  SUBJECTS.forEach((s) => (Array.isArray(s.questions) ? s.questions : []).forEach((q) => {
    if (q && q.sa !== 1 && Array.isArray(q.opts) && q.opts.length === 4 && Number.isInteger(q.a) && q.a >= 0 && q.a < 4) pos[q.a]++;
  }));
  const mcTotal = pos[0] + pos[1] + pos[2] + pos[3];
  const spread = ['A', 'B', 'C', 'D'].map((l, i) => l + ' ' + pos[i] + ' (' + (mcTotal ? Math.round(1000 * pos[i] / mcTotal) / 10 : 0) + ' per cent)').join(', ');
  if (PARTIAL && mcTotal < 40) note('the answer positions of ' + mcTotal + ' multiple choice questions (--partial, too few to hold): ' + spread);
  else check('every answer position holds between 17 and 33 per cent of the ' + mcTotal + ' multiple choice questions: ' + spread, mcTotal > 0 && pos.every((n) => n / mcTotal >= 0.17 && n / mcTotal <= 0.33), spread);
}

/* ================================================================ */
section('5. the voice');
const voice = [];
SUBJECTS.forEach((s) => B.voiceWalk(s, 'subject').forEach((p) => voice.push(s.id + ': ' + p)));
B.voiceWalk(CMS.groups, 'groups').forEach((p) => voice.push(p));
if (CMS.syllabus) B.voiceWalk(CMS.syllabus, 'syllabus').forEach((p) => voice.push(p));
if (CMS.tasting) B.voiceWalk(CMS.tasting, 'tasting').forEach((p) => voice.push(p));
if (CMS.grid) B.voiceWalk(CMS.grid, 'grid').forEach((p) => voice.push(p));
Object.keys(GRID_READS).forEach((k) => B.voiceWalk(GRID_READS[k], 'read').forEach((p) => voice.push(k + ': ' + p)));
B.voiceWalk(GRID_SAY, 'say').forEach((p) => voice.push(p));
B.voiceWalk(GRID_ALIASES, 'aliases').forEach((p) => voice.push(p));
check('every string: no dash of any kind, nothing at or above U+2190; every string of our own British, per cent and towards, never the retired word, never a numbered level (the Court\'s quoted words spared the spelling)', voice.length === 0, few(voice));
const raw = [];
[CMS_FILE, GRID_FILE].forEach((f) => { if (fs.existsSync(f)) B.dashProblems(unescape(fs.readFileSync(f, 'utf8')), path.basename(f)).forEach((p) => raw.push(p)); });
check('the two files, read raw, carry no dash and no glyph at or above U+2190', raw.length === 0, few(raw));

/* ================================================================ */
section('6. the tasting list');
const T = CMS.tasting;
if (!T) check('CMS.tasting is present' + (PARTIAL ? ' (--partial: absent is noted)' : ''), PARTIAL, 'tasting.json is not in the build');
else {
  const tp = B.tastingProblems(T);
  check('the list is ' + B.TASTING_COUNTS.whites + ' whites and ' + B.TASTING_COUNTS.reds + ' reds, each with its regions and places as printed', tp.length === 0, few(tp));
  const tNames = [].concat(T.whites || [], T.reds || []).map((g) => g && g.name);
  check('twenty distinct grape names', tNames.length === 20 && new Set(tNames.map(CF.fold)).size === 20, tNames.join(', '));
  check('tasting.source and title are the Court\'s', typeof T.source === 'string' && /^CMS-A /.test(T.source) && typeof T.title === 'string' && /TASTING EXAM/.test(T.title), T.source + ' / ' + T.title);
}
if (!PARTIAL && T === null) note('without the tasting list the grid reads are held to the brief\'s keys only');

/* ================================================================ */
section('7. the grid');
const G = CMS.grid;
if (!G) check('CMS.grid is present' + (PARTIAL ? ' (--partial: absent is noted)' : ''), PARTIAL, 'grid.json is not in the build');
else {
  const gp = B.gridProblems(G);
  check('the two sheets are in the brief\'s shape with the brief\'s keys, in the printed order', gp.length === 0, few(gp));
}
const readProblems = [];
const tastingNames = T ? new Set([].concat(T.whites || [], T.reds || []).map((g) => CF.fold(g && g.name))) : null;
const slugs = Object.keys(GRID_READS);
slugs.forEach((k) => {
  const r = GRID_READS[k];
  if (!r || typeof r !== 'object') { readProblems.push(k + ': an object'); return; }
  if (r.slug !== k) readProblems.push(k + ': keyed by ' + k + ', slug ' + JSON.stringify(r.slug));
  const frag = { slug: r.slug, name: r.name, colour: r.colour, say: GRID_SAY[k], reads: r.reads };
  B.readsProblems(frag, k, G, tastingNames).forEach((p) => readProblems.push(p));
});
check('every GRID_READS entry is keyed by its slug, its lines the grid\'s lines of its colour, its options the printed ones, its sell within ' + B.MAX_SELL_SENTENCES + ' sentences (' + slugs.length + ' grape(s), ' + slugs.reduce((n, k) => n + ((GRID_READS[k] && GRID_READS[k].reads) || []).length, 0) + ' reads)', readProblems.length === 0, few(readProblems));
check('GRID_SAY names exactly the read grapes', JSON.stringify(Object.keys(GRID_SAY).sort()) === JSON.stringify(slugs.slice().sort()) && slugs.every((k) => typeof GRID_SAY[k] === 'string' && GRID_SAY[k].trim()), Object.keys(GRID_SAY).join(', '));
const aliasProblems = [];
Object.keys(GRID_ALIASES).forEach((a) => {
  if (a !== CF.fold(a) || !a) aliasProblems.push(JSON.stringify(a) + ' is not folded');
  if (slugs.indexOf(GRID_ALIASES[a]) < 0) aliasProblems.push(a + ' points at ' + JSON.stringify(GRID_ALIASES[a]) + ', no read slug');
});
check('every GRID_ALIASES key is folded and points at a read slug (' + Object.keys(GRID_ALIASES).length + ')', aliasProblems.length === 0, few(aliasProblems));
if (T && tastingNames) {
  const have = new Set(slugs.map((k) => CF.fold(GRID_READS[k].name)));
  const lacking = [].concat(T.whites || [], T.reds || []).map((g) => g.name).filter((n) => !have.has(CF.fold(n)));
  if (lacking.length) note(lacking.length + ' tasting grape(s) with no grid read yet (check-grapes.js holds the full cover): ' + few(lacking, 20));
}

/* ================================================================ */
section('8. the codex53 sandbox');
const CH = require(path.join(__dirname, 'cms', 'chain.cjs'));
const DASHES = new RegExp('[' + String.fromCharCode(0x2012) + '-' + String.fromCharCode(0x2015) + ']');
const STAR = new RegExp(String.fromCharCode(0x2605), 'g');
let H = null;
try { H = CH.loadChain(JS, { seed: { codexLevel: 'certified' } }); } catch (e) { check('the chain index.html loads runs in the sandbox through codex53', false, e.message); }
if (H) {
  const { G, J, tryG } = H;
  const lastErr = () => H.last();
  check('the chain index.html loads runs in the sandbox, data-cms.js, data-grid.js and codex53.js in it (' + H.files.length + ' scripts)', ['data-cms.js', 'data-grid.js', 'codex53.js'].every((f) => H.files.indexOf(f) >= 0));
  tryG('applyLevel("certified", true)');
  const ids = J('v53Subjects().map(function (s) { return s.id; })') || [];
  check('v53Subjects() is CMS.subjects as built, in order (' + ids.length + ')', JSON.stringify(ids) === JSON.stringify(SUBJECTS.map((s) => s.id)), ids.join(', '));
  const views = ['cms', 'cmsday', 'cmstasting', 'cmsgrid', 'cmssubject', 'cmsready'];
  check('the six CMS views are registered with codex53\'s renderers, and V25_GO opens them', J(JSON.stringify(views) + '.every(function (k) { return typeof V25_VIEWS[k] === "function" && String(V25_VIEWS[k]).indexOf("v53") >= 0 && typeof V25_GO[k] === "function"; })') === true
    && J('typeof V25_GO.cmsdrill === "function"') === true);
  const rowsOf = SUBJECTS.map((s) => (s.rows || []).length);
  const certCells = SUBJECTS.map((s) => (s.rows || []).filter((r) => r && String(r.certified || '').trim() && String(r.topic || '').trim()).length);
  const LEVELS4 = ['intro', 'certified', 'advanced', 'master'];
  LEVELS4.forEach((lv) => {
    tryG('applyLevel(' + JSON.stringify(lv) + ', true)');
    const name = tryG('v32Lv().name') || lv;
    const probs = [];
    ['v53CmsRootHtml', 'v53CmsDayHtml', 'v53CmsTastingHtml', 'v53CmsGridHtml', 'v53CmsReadyHtml'].forEach((fn) => {
      const h = tryG(fn + '()');
      const p = CH.cleanProblem(h) || CH.drawnVoiceProblem(h);
      if (p) probs.push(fn + ': ' + p + ' ' + lastErr());
    });
    const root = tryG('v53CmsRootHtml()') || '';
    const rows = (root.match(/data-go="cmssubject" data-arg="([^"]+)"/g) || []).map((m) => m.replace(/.*data-arg="|"$/g, ''));
    if (JSON.stringify(rows) !== JSON.stringify(ids)) probs.push('the root lists ' + rows.length + ' subjects, not the ' + ids.length + ' in order');
    if (!['cmsday', 'cmstasting', 'cmsgrid', 'cmsready'].every((k) => root.indexOf('data-go="' + k + '"') >= 0)) probs.push('the root lacks a door to the exam day, the tasting list, the grid or Readiness');
    ids.forEach((id, i) => {
      const h = tryG('S._v53subject = ' + JSON.stringify(id) + '; v53CmsSubjectHtml()');
      const p = CH.cleanProblem(h);
      if (p) { probs.push(id + ': ' + p + ' ' + lastErr()); return; }
      /* the Court's quoted words (the rows table, the two outcomes) keep their own wording; the rest is ours */
      const ours = h.replace(/<table[\s\S]*?<\/table>/g, '').replace(/<p class="v39-lead v53-outcome">[\s\S]*?<\/p>/g, '');
      const v = CH.drawnVoiceProblem(ours) || (DASHES.test(h) ? 'a dash' : '');
      if (v) probs.push(id + ': ' + v);
      const trs = (h.match(/<tr><th scope="row">/g) || []).length;
      const cols = (h.match(/<th scope="col">/g) || []).length;
      if (trs !== rowsOf[i] || cols !== (SUBJECTS[i].certifiedOnly ? 2 : 3)) probs.push(id + ': ' + trs + ' table rows of ' + rowsOf[i] + ', ' + cols + ' columns');
    });
    check('at ' + name + ' the root, the exam day, the tasting list, the grid, Readiness and every subject page (' + ids.length + ') draw clean in the house voice, one table row per Court row', probs.length === 0, few(probs, 4));
  });
  tryG('applyLevel("certified", true)');

  /* the drill's pool: the active level's mapped categories and the subject's CMS questions */
  const poolProbs = [];
  ['certified', 'intro'].forEach((lv) => {
    tryG('applyLevel(' + JSON.stringify(lv) + ', true)');
    const bank = lv === 'intro' ? 'INTRO_QUESTIONS' : 'QUESTIONS';
    ids.forEach((id) => {
      const want = J('(function () { var s = v53Subject(' + JSON.stringify(id) + '); var cats = ((s.map || {}).cats || {})[' + JSON.stringify(lv === 'intro' ? 'intro' : 'certified') + '] || []; return ' + bank + '.filter(function (q) { return cats.indexOf(q.cat) >= 0; }).length; })()');
      const cms = J('v53CmsQuestions(' + JSON.stringify(id) + ').length');
      const pool = J('v53Questions(' + JSON.stringify(id) + ').length');
      const alone = J('v53Questions(' + JSON.stringify(id) + ', "cms").length');
      const own = SUBJECTS.find((s) => s.id === id);
      const built = Array.isArray(own.questions) ? own.questions.length : 0;
      if (pool !== want + cms || alone !== cms || cms !== built) poolProbs.push(lv + ' ' + id + ': pool ' + pool + ', want ' + want + ' + ' + cms + ', alone ' + alone + ', built ' + built);
    });
  });
  tryG('applyLevel("certified", true)');
  check('v53Questions(id) is the active level\'s mapped categories plus the subject\'s CMS questions at Village and at Régionale, and the CMS questions alone with scope cms, for every subject', poolProbs.length === 0, few(poolProbs, 4));
  check('a dealt CMS question is an e- copy carrying its section and, if short answer, an accept list; the data object is untouched', J('v53CmsAll().every(function (q) { return /^e-[a-z0-9]{8}$/.test(q.id) && typeof q.cat === "string" && q.cat && (!q.sa || Array.isArray(q.accept)); }) && v53Subjects().every(function (s) { return (s.questions || []).every(function (q) { return !q.cat; }); })') === true);

  /* readiness on seeded keys, both key forms */
  const SID = J('(function () { var best = null, n = -1; v53Subjects().forEach(function (s) { var m = v53LevelQuestions(s.id, "certified").length + v53LevelQuestions(s.id, "intro").length; var c = (s.questions || []).length; var score = (c >= 2 ? 1e6 : 0) + m; if (score > n) { n = score; best = s.id; } }); return best; })()');
  if (SID) {
    tryG('ST.q = {}');
    const r0 = J('v53Readiness(' + JSON.stringify(SID) + ')');
    const tot = J('(function () { return { i: v53LevelQuestions(' + JSON.stringify(SID) + ', "intro").length, v: v53LevelQuestions(' + JSON.stringify(SID) + ', "certified").length, c: v53CmsRaw(v53Subject(' + JSON.stringify(SID) + ')).length }; })()');
    check('readiness of ' + SID + ' starts at nothing met, its totals Régionale ' + (tot && tot.i) + ' + Village ' + (tot && tot.v) + ' + CMS ' + (tot && tot.c), !!r0 && !!tot && r0.met === 0 && r0.intro.total === tot.i && r0.village.total === tot.v && r0.cms.total === tot.c && r0.total === tot.i + tot.v + tot.c, JSON.stringify(r0));
    tryG('(function () { var id = ' + JSON.stringify(SID) + '; var v = v53LevelQuestions(id, "certified"), i = v53LevelQuestions(id, "intro"), c = v53CmsRaw(v53Subject(id));'
      + ' if (v[0]) ST.q[v[0].id] = { c: 1, w: 0, s: 1 }; if (v[1]) ST.q[v[1].id] = { c: 2, w: 1, s: 0 }; if (v[2]) ST.q[v[2].id] = { c: 0, w: 3, s: 0 }; if (v[3]) ST.q["intro|" + v[3].id] = { c: 1, w: 0, s: 1 };'
      + ' if (i[0]) ST.q["intro|" + i[0].id] = { c: 1, w: 0, s: 1 }; if (i[1]) ST.q[i[1].id] = { c: 1, w: 0, s: 1 };'
      + ' if (c[0]) ST.q[c[0].id] = { c: 1, w: 0, s: 1 }; if (c[1]) ST.q["intro|" + c[1].id] = { c: 1, w: 0, s: 1 }; if (c[2]) ST.q["advanced|" + c[2].id] = { c: 0, w: 1, s: 0 }; })()');
    const r1 = J('v53Readiness(' + JSON.stringify(SID) + ')');
    const wv = Math.min(2, tot.v), wi = Math.min(1, tot.i), wc = Math.min(2, tot.c);
    check('readiness counts bare Village keys, intro| Régionale keys and the CMS keys bare and prefixed, never a miss or a wrong form (' + [wv, wi, wc].join(', ') + ')', !!r1 && r1.village.met === wv && r1.intro.met === wi && r1.cms.met === wc && r1.met === wv + wi + wc, JSON.stringify(r1));
    check('readiness reads in the level cards\' words', !!r1 && (r1.total === 0 || r1.word === tryG('v25MetWord(' + r1.met + ', ' + r1.total + ')')), r1 && r1.word);
    tryG('ST.q = {}');
  } else check('a subject to seed readiness on', false, 'no subject');

  /* the e- keys in the engine */
  const qid = J('(function () { var all = v53CmsAll(); return all.length ? all[0].id : null; })()');
  if (qid) {
    const before = J('v25Met("certified")');
    tryG('var _v53q = v53CmsById(' + JSON.stringify(qid) + '); statRecord(_v53q, true);');
    check('statRecord keeps an e- answer in ST.q under its bare key at Village', J('(ST.q[' + JSON.stringify(qid) + '] || {}).c') === 1, lastErr());
    check('srsRecord never schedules it', J('ST.srs[' + JSON.stringify(qid) + '] == null') === true);
    check('keyOwned calls it no level\'s progress, bare or prefixed', J('keyOwned(' + JSON.stringify(qid) + ', "certified") === false && keyOwned("intro|' + qid + '", "intro") === false') === true);
    check('the level card\'s figure is unchanged by it', JSON.stringify(J('v25Met("certified")')) === JSON.stringify(before), JSON.stringify(before));
    check('qidAudit never calls it an orphan', !JSON.stringify(J('qidAudit().orphanedKeys') || {}).includes(qid));
    check('findByKey finds it, bare and prefixed, for codex8\'s ledger', J('findByKey(' + JSON.stringify(qid) + ').id === ' + JSON.stringify(qid) + ' && findByKey("intro|' + qid + '").id === ' + JSON.stringify(qid)) === true);
    tryG('delete ST.q[' + JSON.stringify(qid) + ']');
  } else note('no CMS question in the build yet: the e- key proofs wait for one');

  /* the deck of the Court's rows */
  const deckProbs = [];
  ids.forEach((id, i) => {
    const d = J('(function () { var d = v32DeckDef("cms:' + id + '"); return { n: d.cards.length, kind: d.kind, faces: d.cards.every(function (c) { return c.front && c.back && /^cms:[a-z0-9-]+\\/\\d+$/.test(c.id); }) }; })()');
    if (!d || d.n !== certCells[i] || (d.n && (d.kind !== 'region' || !d.faces))) deckProbs.push(id + ': ' + JSON.stringify(d) + ', ' + certCells[i] + ' Certified cells');
  });
  check('every subject\'s deck cms:{id} is one card per Certified cell, kind region, its ids the row\'s place', deckProbs.length === 0, few(deckProbs, 4));
  check('an unknown subject\'s deck is empty and the other decks pass through', J('v32DeckDef("cms:no-such-subject").cards.length === 0 && v32DeckDef("grapes").cards.length > 0') === true);

  /* the drill */
  if (SID) {
    const n = J('v53Questions(' + JSON.stringify(SID) + ').length');
    const started = tryG('render = function () {}; v53StartDrill(' + JSON.stringify(SID) + ')');
    check('v53StartDrill deals the subject\'s pool through the core engine and lights CMS', n > 0 ? (started === true && J('S.mode === "drill" && S.view === "quiz" && S.pool.length === ' + n + ' && S._v53drill === ' + JSON.stringify(SID) + ' && /^CMS: /.test(S.section)') === true && tryG('v25NavWord()') === 'cms') : started === false, String(started) + ' ' + lastErr());
    check('an unknown subject deals nothing', tryG('v53StartDrill("no-such-subject")') === false);
    tryG('S.mode = null; S.pool = []; S.view = "home"; S._v53drill = null;');
  }

  /* the grid: a perfect sheet right, a blank sheet wrong, line by line, for every read */
  const GR = J('(function () { var out = []; Object.keys(v53GridReads()).forEach(function (s) { var e = v53GridReads()[s]; v53ReadsOf(s).forEach(function (rd, i) {'
    + ' var col = e.colour === "red" ? "red" : "white"; var p = v53GridGrade(rd, v53GridPerfect(rd, col, s), col, s); var b = v53GridGrade(rd, {}, col, s);'
    + ' out.push({ s: s, i: i, pr: p.right, pt: p.total, pg: p.grapeOk, pall: p.lines.every(function (l) { return l.ok; }), br: b.right, bt: b.total, bnone: b.lines.every(function (l) { return !l.ok; }) }); }); }); return out; })()') || [];
  check('v53GridGrade marks a perfect sheet right on every line with the grape named, and a blank sheet wrong on every line, for every read (' + GR.length + ')', GR.length > 0 && GR.every((g) => g.pall && g.pr === g.pt && g.pg && g.bnone && g.br === 0 && g.bt === g.pt), few(GR.filter((g) => !(g.pall && g.pr === g.pt && g.pg && g.bnone && g.br === 0)).map((g) => JSON.stringify(g)), 2));
}

/* ================================================================ */
section('9. the shell and the chain rule');
const INDEX = path.join(JS, '..', 'index.html');
const SW = path.join(JS, '..', 'sw.js');
if (fs.existsSync(INDEX) && fs.existsSync(SW)) {
  const sources = [...fs.readFileSync(INDEX, 'utf8').matchAll(/<script\b[^>]*\bsrc=["'](js\/[^"']+)["'][^>]*>\s*<\/script>/g)].map((m) => m[1]);
  const scripts = sources.map((s) => s.slice(3).split(/[?#]/)[0]);
  const at = scripts.indexOf('codex52.js');
  const tail = ['data-cms.js', 'data-grid.js', 'codex53.js', 'boot.js'];
  check('index.html loads data-cms.js, data-grid.js and codex53.js straight after codex52.js and before boot.js, each once with ?v=', at >= 0 && JSON.stringify(scripts.slice(at + 1, at + 1 + tail.length)) === JSON.stringify(tail)
    && tail.slice(0, 3).every((f) => scripts.filter((s) => s === f).length === 1 && /^js\/[^?]+\?v=\d+$/.test(sources[scripts.indexOf(f)])), scripts.slice(Math.max(0, at - 1), at + 5).join(' '));
  const sw = fs.readFileSync(SW, 'utf8');
  const n = Number((sw.match(/const CACHE = '(?:oot-)?codex-v(\d+)';/) || [])[1]);
  const i52 = sw.indexOf("'./js/codex52.js'");
  const order = ["'./js/data-cms.js'", "'./js/data-grid.js'", "'./js/codex53.js'"].map((f) => sw.indexOf(f));
  check('sw.js lists ./js/data-cms.js, ./js/data-grid.js and ./js/codex53.js after ./js/codex52.js, and its CACHE is past codex-v111 (' + n + ')', i52 > 0 && order[0] > i52 && order[1] > order[0] && order[2] > order[1] && n > 111);
} else check('index.html and sw.js beside ' + JS, false);
const gateFiles = fs.readdirSync(__dirname).filter((f) => /^(check-|list-harness)[\w-]*\.c?js$/.test(f));
const shortLists = [];
gateFiles.forEach((f) => {
  const t = fs.readFileSync(path.join(__dirname, f), 'utf8');
  (t.match(/\[[^\[\]]*'codex52\.js'[^\[\]]*\]/g) || []).forEach((list) => {
    if (!/'codex52\.js',\s*'data-cms\.js',\s*'data-grid\.js',\s*'codex53\.js'/.test(list)) shortLists.push(f);
  });
});
check('every list in a gate here that names codex52.js names data-cms.js, data-grid.js and codex53.js straight after it (' + gateFiles.length + ' gates read)', shortLists.length === 0, shortLists.join(', '));
const L53 = fs.readFileSync(LAYER, 'utf8');
check('codex53.js declares with var and function only, no arrow, no let, const or class', !/^\s*(let|const|class)\s/m.test(L53) && L53.indexOf('=>') < 0);
const l53dash = B.dashProblems(L53, 'codex53.js').concat(B.dashProblems(unescape(L53).replace(STAR, ''), 'codex53.js, its escapes read'));
check('codex53.js carries no dash and no glyph at or above U+2190 (its escapes read as the characters they are; the star it strips aside)', l53dash.length === 0, few(l53dash));
check('codex53.js names no level by numeral and carries the retired study word only as the tab word, its keys and the code\'s own names', !/\bLevel\s+(I|II|III|IV|[1-4])\b/.test(L53) && !/\bpractice\b/i.test(L53)
  && !/practi[cs]e/i.test(L53.replace(/\w*Practise\w*/g, '').replace(/(["'#\/-])practise\b/g, '$1').replace(/\bpractise(?=\s*[=);+])/g, '')));
check('codex53.js names nobody and ships no key', !/Lizzy|sk-ant|api[_-]?key/i.test(L53));

/* ================================================================ */
section('the gate itself');
const me = fs.readFileSync(__filename, 'utf8');
check('this gate carries no dash either', B.dashProblems(unescape(me), 'check-cms.js').length === 0);

/* ================================================================ */
console.log('');
console.log('--- summary ---');
const rows = [
  ['subjects', SUBJECTS.length + ' of ' + want.length + (seed ? ' (a seed)' : '')],
  ['rows', String(nRows)],
  ['questions', String(nQuestions)],
  ['reads', slugs.length + ' grape(s)'],
  ['tasting', T ? [].concat(T.whites || []).length + ' whites, ' + [].concat(T.reds || []).length + ' reds' : 'absent'],
  ['grid', G ? 'two sheets' : 'absent'],
  ['fragments', fragmentsDir ? B.rel(fragmentsDir) : 'unknown']
];
rows.forEach((r) => console.log('  ' + r[0].padEnd(10) + ' ' + r[1]));
console.log('');
console.log('check-cms: ' + passed + ' passed, ' + failed + ' failed' + (PARTIAL ? ' (--partial)' : ''));
process.exit(failed ? 1 : 0);
