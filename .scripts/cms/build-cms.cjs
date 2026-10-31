#!/usr/bin/env node
/* build-cms: builds js/data-cms.js and js/data-grid.js from the fragments under .scripts/cms (BRIEF-CMS.md).

   Usage: node .scripts/cms/build-cms.cjs [--check] [--partial] [--fragments <dir>] [--out <jsDir>] [jsDir]

   The fragments (BRIEF-CMS.md fixes every shape): subjects/<id>.json, one per subject of the Court's curriculum
   guide, read in the guide's order (SUBJECTS below is the one statement of the 44 ids, names, groups, pages and the
   four Certified-only subjects); syllabus.json, tasting.json and grid.json, the three other documents; map/<id>.json,
   the subject's doors into the Codex (optional per subject: an absent map is an empty one and a note); questions/<id>.json,
   the CMS bank (optional per subject); grid/<slug>.json, what the grid reads for one Certified grape.

   The build refuses (printing every problem, writing nothing) a fragment that breaks a rule of the brief: a subject
   with fewer than three rows, a row with no topic or blank in both cells (save the Cocktails rows, which the guide
   prints as names only, both cells ""), a dash of any kind in ANY string (U+2014,
   U+2013, an entity, a spaced double hyphen: two or more hyphens standing alone between spaces or at either end of the
   string) and a glyph at or above U+2190, American spelling (check-fragment.cjs's
   forms, every one in a string and in any case, a capitalised proper name inside a sentence spared) on every string
   that is OUR OWN (the Court's quoted words are spared: the rows, the outcomes, the court
   line, grid.json and syllabus.json whole, the tasting list's notes, and a question's accept list; spared too, since
   29 October, a fragment's edits list and the checker's fixes, provenance that never ships and quotes the Court's
   words, though the dash and glyph rules hold there as everywhere), a non-blank
   intro cell or outcome on a Certified-only subject, red on a row of any subject but Spirits and Liqueurs, an order,
   group, name or certifiedOnly not the brief's, a duplicate id, an unknown name in a map (cats against INTRO_GROUPS
   and DRILL_GROUPS, chapters against INTRO_PRIMERS ids and PRIMERS cats, regions and countries against REGIONS,
   grapes against GRAPES, GRAPES_PLUS and INTRO_GRAPES, techniques against roster.cjs, serviceRef against
   SERVICE_REF), a question that breaks BRIEF.md's rules (four distinct options of one kind and a key 0 to 3 that is
   not in the stem; a short answer with ans and a lower case accept list, neither the answer nor any accepted form in
   the stem, the key, the answer and each form sought with and without a leading article; an explanation of at least eight words; no
   NOT, EXCEPT, all or none of the above; a stem unique in the bank), a grid read whose keys are not the grid lines of
   its colour or whose options are not the printed ones or whose sell runs past two sentences, and a tasting list
   that is not eight whites and twelve reds. The full set of 44 subjects, the syllabus, the tasting list and the grid
   are required unless --partial, which builds what exists and lists what is missing.

   The ids. Every question's id is 'e-' plus eight base36 digits of FNV-1a 64 (build-regions.cjs's mint) over
   JSON.stringify(['cms:' + subject, stem]); the build mints it and writes it back into the fragment once (two space
   indent, a final newline, the id first in the question). An id already present must recompute from the stem, else
   the build refuses: a reworded stem is a new question. Never 'c-', the Village bank's prefix.

   The deal. The engine (core.js) never shuffles options and writers key the answer first, so a bank shipped in the
   written order puts the answer at A far more often than at D (31 October: 86, 68, 55 and 37 of 246). The build deals
   the shipped copies as build-regions.cjs's bakeOptionOrder does, per subject: the answer positions round robin over
   the subject's multiple choice questions (carried from one subject to the next, dealOptions below), that deal
   shuffled from 'deal:cms:' + subject and the distractors ordered from the stem, so the spread differs by at most one
   within a subject and across the bank, and a second build is the same bytes.
   The fragments keep the authored order and key; ids are minted from the subject and the stem, never the options,
   so the deal moves no id. check-cms.js holds every answer position between 17 and 33 per cent of the bank.

   The output. js/data-cms.js declares CMS (groups, subjects in the guide's order with their quoted rows, map and
   questions, syllabus, tasting, grid, version) and js/data-grid.js declares GRID_READS, GRID_SAY and GRID_ALIASES,
   each with a provenance header; keys are sorted and the JSON is indented by one space, so a second build is the
   same bytes. The edits and the checker's record (checked) of a subject, the syllabus, the tasting list and the grid,
   a subject's fixture field and a map's notes are provenance and do not ship. A build from
   fixtures or with --partial is a SEED and its header says so, naming fixtures or the fragments as what built it; the
   real build from .scripts/cms replaces it.
   --check builds in memory and compares with the files on disk, writing nothing (exit 1 when either differs, is
   missing, is stale, or a fragment still lacks an id the build would write). --fragments and --out point the build
   elsewhere; jsDir is where the Codex's own data files are read for the names a map may use (default js/). Exits 1
   with every problem named by file and rule. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const CF = require(path.join(__dirname, '..', 'regions', 'check-fragment.cjs'));
const BR = require(path.join(__dirname, '..', 'regions', 'build-regions.cjs'));
const ROSTER = require(path.join(__dirname, '..', 'regions', 'roster.cjs'));
const ROOT = path.join(__dirname, '..', '..');

/* The 44 subjects of the guide, in its order: [order, id, name, group, pages, certifiedOnly] (BRIEF-CMS.md's table). */
function range(a, b) { const out = []; for (let i = a; i <= b; i++) out.push(i); return out; }
const SUBJECTS = [
  [1, 'viticulture', 'Grape Growing: Viticulture', 'foundations', range(3, 6), false],
  [2, 'vinification', 'Winemaking: Vinification', 'foundations', range(7, 8), false],
  [3, 'bordeaux', 'France: Bordeaux', 'france', range(9, 11), false],
  [4, 'burgundy', 'France: Burgundy', 'france', range(12, 14), false],
  [5, 'loire', 'France: Loire Valley', 'france', range(15, 16), false],
  [6, 'rhone', 'France: The Rhône Valley', 'france', range(17, 18), false],
  [7, 'champagne', 'France: Champagne', 'france', range(19, 20), false],
  [8, 'alsace', 'France: Alsace', 'france', range(21, 22), false],
  [9, 'south-france', 'France: South France', 'france', range(23, 25), true],
  [10, 'piedmont', 'Italy: Piedmont', 'italy', range(26, 27), false],
  [11, 'lombardy-emilia-romagna', 'Italy: Lombardy and Emilia-Romagna', 'italy', range(28, 29), false],
  [12, 'trentino-friuli-veneto', 'Italy: Trentino-Alto Adige, Friuli and Veneto', 'italy', range(30, 31), false],
  [13, 'tuscany', 'Italy: Tuscany', 'italy', range(32, 33), false],
  [14, 'central-southern-italy', 'Italy: Central and Southern Italy', 'italy', range(34, 35), false],
  [15, 'sicily-sardinia', 'Italy: Sicily and Sardinia', 'italy', [36], false],
  [16, 'galicia', 'Spain: Galicia', 'spain-portugal', [37], false],
  [17, 'rioja', 'Spain: La Rioja', 'spain-portugal', range(38, 39), false],
  [18, 'castilla-y-leon', 'Spain: Castilla y León', 'spain-portugal', range(40, 41), false],
  [19, 'catalonia', 'Spain: Catalonia', 'spain-portugal', range(42, 43), false],
  [20, 'spain-other-dos', 'Spain: Other DOs', 'spain-portugal', range(44, 45), true],
  [21, 'portugal', 'Portugal', 'spain-portugal', [46], false],
  [22, 'germany', 'Germany', 'central-europe', range(47, 51), false],
  [23, 'austria', 'Austria', 'central-europe', range(52, 53), false],
  [24, 'hungary', 'Hungary', 'central-europe', [54], false],
  [25, 'greece', 'Greece', 'central-europe', [55], true],
  [26, 'california-north-coast', 'North America: California, North Coast', 'north-america', range(56, 57), false],
  [27, 'california-central-coast', 'North America: California, Central Coast', 'north-america', range(58, 59), false],
  [28, 'new-york', 'North America: New York State', 'north-america', [60], false],
  [29, 'pacific-northwest', 'North America: Pacific Northwest', 'north-america', range(61, 62), false],
  [30, 'canada', 'North America: Canada', 'north-america', range(63, 64), false],
  [31, 'mexico', 'North America: Mexico', 'north-america', range(65, 66), false],
  [32, 'chile', 'South America: Chile', 'southern-hemisphere', range(67, 68), false],
  [33, 'argentina', 'South America: Argentina', 'southern-hemisphere', range(69, 70), false],
  [34, 'south-africa', 'South Africa', 'southern-hemisphere', range(71, 72), false],
  [35, 'new-zealand', 'New Zealand', 'southern-hemisphere', range(73, 74), false],
  [36, 'australia', 'Australia', 'southern-hemisphere', range(75, 76), false],
  [37, 'world-sparkling-wines', 'World Sparkling Wines', 'styles', range(77, 78), false],
  [38, 'sweet-wines', 'Sweet Wines', 'styles', range(79, 80), false],
  [39, 'fortified-wines', 'Fortified Wines', 'styles', range(81, 82), false],
  [40, 'beer', 'Beer', 'beyond-wine', range(83, 85), false],
  [41, 'sake', 'Sake', 'beyond-wine', range(86, 87), false],
  [42, 'spirits-liqueurs', 'Spirits and Liqueurs', 'beyond-wine', range(88, 91), false],
  [43, 'cocktails', 'Cocktails', 'beyond-wine', [92], true],
  [44, 'business-of-the-sommelier', 'Business of the Sommelier', 'business', [93], false]
].map((r) => ({ order: r[0], id: r[1], name: r[2], group: r[3], pages: r[4], certifiedOnly: r[5] }));
const SUBJECT_BY_ID = {};
SUBJECTS.forEach((s) => { SUBJECT_BY_ID[s.id] = s; });
/* The groups as the app prints them, in the guide's order. */
const GROUPS = [
  ['foundations', 'Viticulture and vinification'],
  ['france', 'France'],
  ['italy', 'Italy'],
  ['spain-portugal', 'Spain and Portugal'],
  ['central-europe', 'Germany, Austria, Hungary and Greece'],
  ['north-america', 'North America'],
  ['southern-hemisphere', 'South America, South Africa, New Zealand and Australia'],
  ['styles', 'Sparkling, sweet and fortified'],
  ['beyond-wine', 'Beer, sake, spirits and cocktails'],
  ['business', 'The business of the sommelier']
].map((g) => ({ key: g[0], name: g[1] }));
const RED_SUBJECT = 'spirits-liqueurs';
/* The one subject whose rows are names only: the guide prints the 33 cocktails' names and nothing else, so each row is
   the name with both cells "" (BRIEF-CMS.md, Cocktails); everywhere else a row blank in both cells is refused. */
const NAMES_ONLY_SUBJECT = 'cocktails';
/* The grid's lines, by colour: our own stable keys (BRIEF-CMS.md), in the printed order. */
const GRID_KEYS = {
  white: {
    fruit: ['apple-pear', 'citrus', 'stone-fruit', 'tropical'],
    nonFruit: ['flowers', 'fresh-herbs', 'green', 'variety-spice', 'noble-rot', 'oxidation', 'lees', 'malolactic', 'petrol', 'earth', 'mineral', 'new-oak'],
    structure: ['bitterness', 'sweetness', 'acidity', 'alcohol']
  },
  red: {
    fruit: ['red', 'black', 'blue'],
    nonFruit: ['flowers', 'fresh-herbs', 'dried-herbs', 'green', 'mint', 'pepper', 'coffee', 'meat', 'balsamic', 'carbonic', 'earth', 'mineral', 'new-oak'],
    structure: ['tannin', 'acidity', 'alcohol']
  }
};
const COLOURS = ['white', 'red'];
const TASTING_COUNTS = { whites: 8, reds: 12 };
const EMPTY_MAP = { cats: { intro: [], certified: [] }, chapters: { intro: [], certified: [] }, regions: [], countries: [], grapes: [], techniques: [], serviceRef: [] };
const SUBJECT_FIELDS = ['id', 'name', 'court', 'group', 'order', 'pages', 'certifiedOnly', 'outcome', 'rows', 'edits', 'checked', 'fixture'];
const ROW_FIELDS = ['topic', 'intro', 'certified', 'red'];
const MAP_FIELDS = ['id', 'cats', 'chapters', 'regions', 'countries', 'grapes', 'techniques', 'serviceRef', 'notes'];
const QUESTION_FIELDS = ['id', 'q', 'opts', 'a', 'sa', 'ans', 'accept', 'exp', 'grapes', 'row'];
const READ_FIELDS = ['region', 'country', 'climate', 'colour', 'fruit', 'condition', 'nonFruit', 'structure', 'age', 'sell', 'why'];
const GRID_FILE_FIELDS = ['slug', 'name', 'colour', 'say', 'reads', 'aliases'];
const SYLLABUS_SHAPE = {
  source: 's', purpose: 's', description: 's', prerequisites: 'ss', who: 's', skills: 'ss',
  roles: { restaurant: 's', other: 's' }, punctuality: 's', schedule: [{ at: 's', what: 's' }],
  sections: [{ key: 's', name: 's' }], passing: 'ss', feedback: 's', retake: 's', recusal: 's',
  rules: { devices: 's', food: 's', cheating: 's' }, dress: 'ss', policies: { cancellation: 's', transfer: 's' },
  integrity: 'ss', rights: 'ss'
};
const SYLLABUS_SECTIONS = ['tasting', 'theory', 'service'];
const MIN_ROWS = 3;
const MIN_EXP_WORDS = 8;
const MAX_SELL_SENTENCES = 2;

/* The mint. */
function mintId(subject, stem) { return 'e-' + BR.b36(BR.fnv1a64(JSON.stringify(['cms:' + subject, stem])), 8); }
const ID_RE = /^e-[0-9a-z]{8}$/;

/* The quoting rule: the paths that hold the Court's words, where only the dash and glyph rules apply. The root of
   a path is the fragment's kind (subject, map, questions, syllabus, tasting, grid, read), so the same test serves the
   build and the gate. A fragment's edits list and the checker's fixes (checked.fixes) are provenance that never ships
   and quotes the Court's words, so they are spared the spelling rule too (the amendment of 29 October). A question's row
   names one of the subject's topics, the Court's words again (questionProblems holds it to one), so it is spared with them. */
function quotedPath(where) {
  return /^syllabus([.[]|$)/.test(where) || /^grid([.[]|$)/.test(where)
    || /\.rows\[\d+\]\.(topic|intro|certified)$/.test(where) || /\.outcome\.(intro|certified)$/.test(where) || /\.court$/.test(where)
    || (/^tasting/.test(where) && /\.notes\[\d+\]$/.test(where)) || /\.accept\[\d+\]$/.test(where)
    || /\.edits\[\d+\]$/.test(where) || /\.checked\.fixes\[\d+\]$/.test(where)
    || /\.questions\[\d+\]\.row$/.test(where);
}
const DASH = String.fromCharCode(0x2014), EN_DASH = String.fromCharCode(0x2013);
/* the two other dashes below U+2190, so of any kind (30 October, the verifier): the figure dash and the horizontal bar */
const OTHER_DASHES = [[0x2012, 'a figure dash (U+2012)'], [0x2015, 'a horizontal bar (U+2015)']];
/* The rules every string is held to, quoted or not: no dash of any kind, nothing at or above U+2190. */
function dashProblems(s, where) {
  const out = [];
  if (typeof s !== 'string') return out;
  if (s.indexOf(DASH) >= 0) out.push(where + ': a long dash (U+2014)');
  if (s.indexOf(EN_DASH) >= 0) out.push(where + ': an en dash (U+2013)');
  OTHER_DASHES.forEach((d) => { if (s.indexOf(String.fromCharCode(d[0])) >= 0) out.push(where + ': ' + d[1]); });
  if (/&(mdash|ndash|#8212|#8211|#x2014|#x2013);/i.test(s)) out.push(where + ': a dash entity');
  if (/(^|\s)-{2,}(\s|$)/.test(s)) out.push(where + ': a spaced double hyphen' + (/(^|\s)-{3,}(\s|$)/.test(s) ? ' (a run of three or more)' : ''));
  for (const ch of s) { const c = ch.codePointAt(0); if (c >= 0x2190) { out.push(where + ': a glyph at or above U+2190 (' + ch + ', U+' + c.toString(16).toUpperCase() + ')'); break; } }
  return out;
}
/* The American forms, every one and in any case (30 October, the verifier). check-fragment's voiceProblems reports only
   the first match of its lower case pattern and then spares colour, so "the colour and flavor" passed, and so did a
   sentence of our own that opens "Flavor" or "Color". Each word is held to check-fragment's own list (the one statement
   of the forms) by testing it alone in lower case. A capitalised word inside a sentence, or one that runs straight on
   into another capitalised word, is a proper name and keeps its spelling (Victor Harbor, the Label Integrity Program),
   as check-fragment's case sensitive rule spares it; one that opens a sentence and is followed by anything else is
   prose and is refused. */
function americanProblems(s, where) {
  const out = [];
  const seen = {};
  const re = /[A-Za-z]+/g;
  let m;
  while ((m = re.exec(s))) {
    const w = m[0];
    if (seen[w] || !CF.voiceProblems(w.toLowerCase(), '').some((p) => /American spelling/.test(p))) continue;
    if (/^[A-Z][a-z]+$/.test(w)) {
      const before = s.slice(0, m.index).replace(/[\s"'(\[\u2018\u201C]+$/, '');
      const opens = !before || /[.!?:;]$/.test(before);
      const runsOn = /^ +[A-Z]/.test(s.slice(m.index + w.length));
      if (!opens || runsOn) continue;
    }
    seen[w] = true;
    out.push(where + ': American spelling "' + w + '"');
  }
  return out;
}
/* Every string of a value: the dash rules everywhere, the voice and prose rules (check-fragment's, the American forms
   through americanProblems) on our own. */
function voiceWalk(v, root) {
  const out = [];
  CF.walkStrings(v, root, (s, where) => {
    dashProblems(s, where).forEach((p) => out.push(p));
    if (quotedPath(where)) return;
    CF.voiceProblems(s, where).filter((p) => !/a dash|double hyphen|U\+2190|American spelling/.test(p)).forEach((p) => out.push(p));
    americanProblems(s, where).forEach((p) => out.push(p));
    CF.proseProblems(s, where).forEach((p) => out.push(p));
  });
  return out;
}
function words(s) { return CF.words(s); }
/* A sentence ends at a stop, a stop followed by closing quotes or a bracket included ("steely." It is dry: two). */
function sentences(s) { return String(s || '').split(/[.!?]+["'\u2019\u201D)\]]*(?:\s+|$)/).filter((x) => x.trim()).length; }
function isStringList(v) { return Array.isArray(v) && v.every((x) => typeof x === 'string'); }
function unknownFields(rec, allowed, w, out, what) {
  Object.keys(rec).forEach((k) => { if (allowed.indexOf(k) < 0) out.push(w + '.' + k + ': no field of ' + what + ' (' + allowed.join(', ') + ')'); });
}
function readJson(file, problems) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { problems.push(path.basename(file) + ': ' + e.message); return undefined; }
}
function rel(p) { const r = path.relative(ROOT, p); return (!r.startsWith('..') && !path.isAbsolute(r) ? r : p).split(path.sep).join('/'); }

/* The names a map may use, read from the Codex's own data files in a sandbox (the loader of check-fragment.cjs,
   widened: the exact names as the app prints them, not folded). DRILL_GROUPS is cut out of core.js by its text,
   since core.js draws the app. With banks: true the four banks are read too (the gate's id sweep). */
function loadNames(jsDir, opts) {
  const o = opts || {};
  const ctx = { window: {}, document: {}, navigator: {}, localStorage: { getItem() { return null; }, setItem() {} }, console: { log() {}, warn() {}, error() {} } };
  ctx.self = ctx; vm.createContext(ctx);
  const files = ['reference.js', 'data-grapes-plus.js', 'data-intro.js', 'data-primers.js', 'data-primers-intro.js', 'data-regions.js', 'data-service-ref.js'];
  if (o.banks) files.push('data-questions.js', 'data-advanced.js', 'data-master.js');
  files.forEach((f) => {
    const p = path.join(jsDir, f);
    if (!fs.existsSync(p)) throw new Error('missing ' + p);
    vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f });
  });
  const core = path.join(jsDir, 'core.js');
  if (!fs.existsSync(core)) throw new Error('missing ' + core);
  const m = fs.readFileSync(core, 'utf8').match(/var DRILL_GROUPS=\[[\s\S]*?\n\];/);
  if (!m) throw new Error(core + ': no DRILL_GROUPS');
  vm.runInContext(m[0], ctx, { filename: 'core.js (DRILL_GROUPS)' });
  const flat = (groups) => [].concat.apply([], (groups || []).map((g) => g[1]));
  const R = ctx.REGIONS || {};
  const akaOf = {};
  (R.techniques || []).forEach((t) => { if (t && t.slug) akaOf[t.slug] = Array.isArray(t.aka) ? t.aka.slice() : []; });
  const grapes = [];
  const addGrape = (n) => { if (typeof n === 'string' && n && grapes.indexOf(n) < 0) grapes.push(n); };
  (ctx.GRAPES || []).forEach((g) => addGrape(g.g));
  (ctx.GRAPES_PLUS || []).forEach((g) => addGrape(g.g));
  (ctx.INTRO_GRAPES || []).forEach((g) => addGrape(g.n));
  const names = {
    introCats: flat(ctx.INTRO_GROUPS),
    certifiedCats: flat(ctx.DRILL_GROUPS),
    introChapters: (ctx.INTRO_PRIMERS || []).map((p) => ({ id: p.id, t: p.t })),
    certifiedChapters: (ctx.PRIMERS || []).map((p) => p.cat),
    regions: (R.regions || []).map((r) => ({ slug: r.slug, name: r.name })),
    countries: Object.keys(R.countries || {}).sort().map((k) => ({ key: k, name: R.countries[k].name })),
    grapes,
    techniques: ROSTER.TECHNIQUES.map((t) => ({ slug: t[0], name: t[1], aka: akaOf[t[0]] || [] })),
    serviceRef: ((ctx.SERVICE_REF || {}).tables || []).map((t) => ({ key: t.key, title: t.title }))
  };
  if (o.banks) names.banks = { QUESTIONS: ctx.QUESTIONS || [], INTRO_QUESTIONS: ctx.INTRO_QUESTIONS || [], ADV_QUESTIONS: ctx.ADV_QUESTIONS || [], MASTER_QUESTIONS: ctx.MASTER_QUESTIONS || [], REGIONS: R };
  return names;
}
/* The name sets a map is checked against, from loadNames' lists. */
function nameSets(names) {
  return {
    'cats.intro': names.introCats, 'cats.certified': names.certifiedCats,
    'chapters.intro': names.introChapters.map((c) => c.id), 'chapters.certified': names.certifiedChapters,
    regions: names.regions.map((r) => r.slug), countries: names.countries.map((c) => c.key),
    grapes: names.grapes, techniques: names.techniques.map((t) => t.slug), serviceRef: names.serviceRef.map((t) => t.key)
  };
}
function mapProblems(map, w, sets) {
  const out = [];
  unknownFields(map, MAP_FIELDS, w, out, 'a map');
  const listOk = (list, where, set, what) => {
    if (!isStringList(list)) { out.push(where + ': a list of ' + what); return; }
    list.forEach((n, i) => { if (set.indexOf(n) < 0) out.push(where + '[' + i + ']: "' + n + '" is no ' + what); });
    if (new Set(list).size !== list.length) out.push(where + ': a name twice');
  };
  ['cats', 'chapters'].forEach((k) => {
    if (!map[k] || typeof map[k] !== 'object' || Array.isArray(map[k])) { out.push(w + '.' + k + ': { intro: [...], certified: [...] }'); return; }
    unknownFields(map[k], ['intro', 'certified'], w + '.' + k, out, k);
    listOk(map[k].intro, w + '.' + k + '.intro', sets[k + '.intro'], k === 'cats' ? 'INTRO_GROUPS category' : 'INTRO_PRIMERS chapter id');
    listOk(map[k].certified, w + '.' + k + '.certified', sets[k + '.certified'], k === 'cats' ? 'DRILL_GROUPS category' : 'PRIMERS chapter cat');
  });
  listOk(map.regions, w + '.regions', sets.regions, 'REGIONS region slug');
  listOk(map.countries, w + '.countries', sets.countries, 'REGIONS country key');
  listOk(map.grapes, w + '.grapes', sets.grapes, 'grape name of GRAPES, GRAPES_PLUS or INTRO_GRAPES');
  listOk(map.techniques, w + '.techniques', sets.techniques, 'technique slug of roster.cjs');
  listOk(map.serviceRef, w + '.serviceRef', sets.serviceRef, 'SERVICE_REF table key');
  if (map.notes !== undefined && typeof map.notes !== 'string') out.push(w + '.notes: a string');
  return out;
}
/* The checker's record, on a subject and on each of the three documents: null or an object (provenance, never shipped). */
function checkedProblems(v, w) { return v !== undefined && v !== null && (typeof v !== 'object' || Array.isArray(v)) ? [w + '.checked: null or the checker\'s record'] : []; }
/* A document ships without its edits list and the checker's record: provenance, as a subject's are. */
const DOC_PROVENANCE = ['edits', 'checked'];
function shipDoc(doc) { const o = {}; Object.keys(doc).forEach((k) => { if (DOC_PROVENANCE.indexOf(k) < 0) o[k] = doc[k]; }); return o; }
function shipMap(map) {
  return { cats: { intro: map.cats.intro.slice(), certified: map.cats.certified.slice() }, chapters: { intro: map.chapters.intro.slice(), certified: map.chapters.certified.slice() }, regions: map.regions.slice(), countries: map.countries.slice(), grapes: map.grapes.slice(), techniques: map.techniques.slice(), serviceRef: map.serviceRef.slice() };
}
function subjectProblems(frag, w) {
  const out = [];
  if (!frag || typeof frag !== 'object' || Array.isArray(frag)) return [w + ': an object'];
  unknownFields(frag, SUBJECT_FIELDS, w, out, 'a subject');
  const want = SUBJECT_BY_ID[frag.id];
  if (!want) { out.push(w + '.id: ' + JSON.stringify(frag.id) + ' is no subject of the brief'); return out; }
  if (frag.name !== want.name) out.push(w + '.name: the brief says ' + JSON.stringify(want.name) + ', found ' + JSON.stringify(frag.name));
  if (frag.group !== want.group) out.push(w + '.group: the brief says ' + want.group + ', found ' + JSON.stringify(frag.group));
  if (frag.order !== want.order) out.push(w + '.order: the brief says ' + want.order + ', found ' + JSON.stringify(frag.order));
  if (frag.certifiedOnly !== want.certifiedOnly) out.push(w + '.certifiedOnly: the brief says ' + want.certifiedOnly + ', found ' + JSON.stringify(frag.certifiedOnly));
  if (!Array.isArray(frag.pages) || !frag.pages.every((p) => Number.isInteger(p)) || frag.pages.join() !== want.pages.join()) out.push(w + '.pages: the brief says ' + JSON.stringify(want.pages) + ', found ' + JSON.stringify(frag.pages));
  if (typeof frag.court !== 'string' || !frag.court.trim()) out.push(w + '.court: the Subject Name line as printed');
  if (!frag.outcome || typeof frag.outcome !== 'object' || typeof frag.outcome.intro !== 'string' || typeof frag.outcome.certified !== 'string') out.push(w + '.outcome: { intro, certified } strings');
  else {
    unknownFields(frag.outcome, ['intro', 'certified'], w + '.outcome', out, 'an outcome');
    if (want.certifiedOnly && frag.outcome.intro !== '') out.push(w + '.outcome.intro: "" on a Certified-only subject');
    if (!frag.outcome.certified.trim()) out.push(w + '.outcome.certified: the Certified learning outcome as printed');
  }
  if (!Array.isArray(frag.rows)) out.push(w + '.rows: a list of rows');
  else {
    if (frag.rows.length < MIN_ROWS) out.push(w + '.rows: at least ' + MIN_ROWS + ' rows (' + frag.rows.length + ')');
    frag.rows.forEach((r, i) => {
      const rw = w + '.rows[' + i + ']';
      if (!r || typeof r !== 'object' || Array.isArray(r)) { out.push(rw + ': an object'); return; }
      unknownFields(r, ROW_FIELDS, rw, out, 'a row');
      if (typeof r.topic !== 'string' || !r.topic.trim()) out.push(rw + '.topic: a row with no topic');
      if (typeof r.intro !== 'string' || typeof r.certified !== 'string') out.push(rw + ': intro and certified strings ("" for a blank cell)');
      else {
        if (!r.intro.trim() && !r.certified.trim() && frag.id !== NAMES_ONLY_SUBJECT) out.push(rw + ': a row blank in both cells');
        if (want.certifiedOnly && r.intro !== '') out.push(rw + '.intro: a non-blank intro cell on a Certified-only subject');
      }
      if (r.red !== undefined) {
        if (r.red !== 1) out.push(rw + '.red: 1 or absent');
        else if (frag.id !== RED_SUBJECT) out.push(rw + '.red: red is printed only in Spirits and Liqueurs');
      }
    });
  }
  if (frag.edits !== undefined && !isStringList(frag.edits)) out.push(w + '.edits: a list of strings');
  checkedProblems(frag.checked, w).forEach((p) => out.push(p));
  if (frag.fixture !== undefined && frag.fixture !== true) out.push(w + '.fixture: true or absent');
  return out;
}
function questionProblems(q, w, ctx) {
  const out = [];
  if (!q || typeof q !== 'object' || Array.isArray(q)) return [w + ': an object'];
  unknownFields(q, QUESTION_FIELDS, w, out, 'a question');
  if (typeof q.q !== 'string' || words(q.q) < 5) out.push(w + '.q: a stem of at least five words');
  const stem = ' ' + CF.fold(q.q) + ' ';
  /* the key given away without its article: "The Atlantic Ocean" is in a stem that says "Atlantic Ocean" (30 October, the verifier) */
  const inStem = (x) => { const f = CF.fold(x); const bare = f.replace(/^(the|a|an) /, ''); return !!f && (stem.indexOf(' ' + f + ' ') >= 0 || (!!bare && stem.indexOf(' ' + bare + ' ') >= 0)); };
  if (/\b(NOT|EXCEPT)\b/.test(q.q || '') || /all of the above|none of the above/i.test((Array.isArray(q.opts) ? q.opts : []).join(' '))) out.push(w + ': no NOT, EXCEPT, all or none of the above');
  if (typeof q.exp !== 'string' || words(q.exp) < MIN_EXP_WORDS) out.push(w + '.exp: an explanation of at least ' + MIN_EXP_WORDS + ' words');
  if (q.id !== undefined && !ID_RE.test(q.id)) out.push(w + '.id: only the build mints ids (e- and eight base36)');
  if (q.sa === 1) {
    if (q.opts !== undefined || q.a !== undefined) out.push(w + ': a short answer carries no opts or a');
    if (typeof q.ans !== 'string' || !q.ans.trim()) out.push(w + '.ans: the model answer');
    else if (inStem(q.ans)) out.push(w + ': the answer is in the stem');
    if (!isStringList(q.accept) || !q.accept.length || q.accept.some((a) => !a.trim())) out.push(w + '.accept: a non-empty list of strings');
    else q.accept.forEach((a, i) => {
      if (a !== a.toLowerCase()) out.push(w + '.accept[' + i + ']: lower case');
      /* matchSA takes any accepted form, so a form the stem carries is the answer given away (29 October, the verifier) */
      if (inStem(a)) out.push(w + '.accept[' + i + ']: the accepted form "' + a + '" is in the stem (the grader would take the stem\'s own words)');
    });
  } else {
    if (q.sa !== undefined) out.push(w + '.sa: 1 or absent');
    if (q.ans !== undefined || q.accept !== undefined) out.push(w + ': a multiple choice carries no ans or accept');
    if (!isStringList(q.opts) || q.opts.length !== 4 || q.opts.some((o) => !o.trim())) out.push(w + '.opts: exactly four strings');
    else {
      if (new Set(q.opts.map(CF.fold)).size !== 4) out.push(w + '.opts: four distinct options');
      if (!Number.isInteger(q.a) || q.a < 0 || q.a > 3) out.push(w + '.a: an index 0 to 3');
      else {
        if (inStem(q.opts[q.a])) out.push(w + ': the key is in the stem');
        const lens = q.opts.map((o) => o.length); const mx = Math.max.apply(null, lens);
        if (q.opts[q.a].length === mx && lens.filter((l) => l === mx).length === 1 && mx > 1.6 * (lens.reduce((a, b) => a + b, 0) - mx) / 3) out.push(w + ': the answer is the longest option by far');
      }
    }
  }
  if (q.grapes !== undefined) {
    if (!isStringList(q.grapes)) out.push(w + '.grapes: a list of grape names');
    else q.grapes.forEach((g, i) => { if (ctx.grapes.indexOf(g) < 0) out.push(w + '.grapes[' + i + ']: "' + g + '" is no grape name of GRAPES, GRAPES_PLUS or INTRO_GRAPES'); });
  }
  if (q.row !== undefined && (typeof q.row !== 'string' || ctx.topics.indexOf(q.row) < 0)) out.push(w + '.row: names no row of the subject (' + JSON.stringify(q.row) + ')');
  return out;
}
/* The deal (the header's paragraph): build-regions.cjs's bakeOptionOrder over each subject, the answer positions dealt
   round robin over the subject's multiple choice questions, the deal shuffled from 'deal:cms:' + subject and the
   distractors ordered from the stem, with one change: the round robin is carried from one subject to the next in the
   guide's order, so the remainder of a subject of five or six never falls on A again and again. The spread then differs
   by at most one within every subject and across the whole bank. It works on the shipped copies (shipQuestion copies
   the options), never on a fragment. */
function dealOptions(subjects) {
  let next = 0;
  subjects.forEach((rec) => {
    const mc = (rec.questions || []).filter((q) => q && q.sa !== 1 && Array.isArray(q.opts) && q.opts.length === 4 && Number.isInteger(q.a) && q.a >= 0 && q.a < 4);
    const targets = BR.detShuffle(mc.map((_, i) => (next + i) % 4), 'deal:cms:' + rec.id);
    next = (next + mc.length) % 4;
    mc.forEach((q, i) => {
      const correct = q.opts[q.a];
      const rest = BR.detShuffle(q.opts.filter((_, k) => k !== q.a), 'distractors:' + q.q);
      rest.splice(targets[i], 0, correct);
      q.opts = rest;
      q.a = targets[i];
    });
  });
}
function shipQuestion(q) {
  const out = { id: q.id, q: q.q, exp: q.exp };
  if (q.sa === 1) { out.sa = 1; out.ans = q.ans; out.accept = q.accept.slice(); }
  else { out.opts = q.opts.slice(); out.a = q.a; }
  if (q.grapes !== undefined) out.grapes = q.grapes.slice();
  if (q.row !== undefined) out.row = q.row;
  return out;
}
function shapeProblems(v, shape, w, out) {
  if (shape === 's') { if (typeof v !== 'string') out.push(w + ': a string'); return; }
  if (shape === 'ss') { if (!isStringList(v)) out.push(w + ': a list of strings'); return; }
  if (Array.isArray(shape)) {
    if (!Array.isArray(v)) { out.push(w + ': a list'); return; }
    v.forEach((x, i) => shapeProblems(x, shape[0], w + '[' + i + ']', out));
    return;
  }
  if (!v || typeof v !== 'object' || Array.isArray(v)) { out.push(w + ': an object with ' + Object.keys(shape).join(', ')); return; }
  Object.keys(shape).forEach((k) => { if (v[k] === undefined) out.push(w + '.' + k + ': missing'); else shapeProblems(v[k], shape[k], w + '.' + k, out); });
  unknownFields(v, Object.keys(shape).concat(w === 'syllabus' ? DOC_PROVENANCE : []), w, out, 'this record');
}
function syllabusProblems(s) {
  const out = [];
  shapeProblems(s, SYLLABUS_SHAPE, 'syllabus', out);
  if (s && Array.isArray(s.sections) && s.sections.map((x) => x && x.key).join() !== SYLLABUS_SECTIONS.join()) out.push('syllabus.sections: the keys ' + SYLLABUS_SECTIONS.join(', ') + ' in that order');
  if (s && s.edits !== undefined && !isStringList(s.edits)) out.push('syllabus.edits: a list of strings');
  if (s && typeof s === 'object') checkedProblems(s.checked, 'syllabus').forEach((p) => out.push(p));
  return out;
}
function tastingProblems(t) {
  const out = [];
  if (!t || typeof t !== 'object' || Array.isArray(t)) return ['tasting: an object'];
  unknownFields(t, ['source', 'title', 'whites', 'reds'].concat(DOC_PROVENANCE), 'tasting', out, 'the tasting list');
  if (typeof t.source !== 'string' || typeof t.title !== 'string') out.push('tasting: source and title strings');
  ['whites', 'reds'].forEach((k) => {
    const list = t[k];
    if (!Array.isArray(list)) { out.push('tasting.' + k + ': a list'); return; }
    if (list.length !== TASTING_COUNTS[k]) out.push('tasting.' + k + ': the Court prints ' + TASTING_COUNTS[k] + ' ' + k + ' (' + list.length + ')');
    list.forEach((g, i) => {
      const w = 'tasting.' + k + '[' + i + ']';
      if (!g || typeof g !== 'object') { out.push(w + ': an object'); return; }
      unknownFields(g, ['name', 'regions'], w, out, 'a grape');
      if (typeof g.name !== 'string' || !g.name.trim()) out.push(w + '.name: the grape as printed');
      if (!Array.isArray(g.regions) || !g.regions.length) { out.push(w + '.regions: a non-empty list'); return; }
      g.regions.forEach((r, j) => {
        const rw = w + '.regions[' + j + ']';
        if (!r || typeof r !== 'object') { out.push(rw + ': an object'); return; }
        unknownFields(r, ['country', 'places', 'notes'], rw, out, 'a region');
        if (typeof r.country !== 'string' || !r.country.trim()) out.push(rw + '.country: as printed');
        if (!isStringList(r.places) || !r.places.length) out.push(rw + '.places: the slash separated places, one each');
        if (!isStringList(r.notes)) out.push(rw + '.notes: the starred notes, one each ([] for none)');
      });
    });
  });
  if (t.edits !== undefined && !isStringList(t.edits)) out.push('tasting.edits: a list of strings');
  checkedProblems(t.checked, 'tasting').forEach((p) => out.push(p));
  return out;
}
function gridProblems(g) {
  const out = [];
  if (!g || typeof g !== 'object' || Array.isArray(g)) return ['grid: an object'];
  unknownFields(g, ['source', 'instructions', 'white', 'red'].concat(DOC_PROVENANCE), 'grid', out, 'the grid');
  if (typeof g.source !== 'string' || typeof g.instructions !== 'string') out.push('grid: source and instructions strings');
  COLOURS.forEach((c) => {
    const s = g[c]; const w = 'grid.' + c; const keys = GRID_KEYS[c];
    if (!s || typeof s !== 'object') { out.push(w + ': the ' + c + ' sheet'); return; }
    unknownFields(s, ['colour', 'fruit', 'condition', 'nonFruit', 'nonFruitNote', 'structure', 'conclusion', 'sell'], w, out, 'a sheet');
    if (!s.colour || typeof s.colour.label !== 'string' || !isStringList(s.colour.options) || s.colour.options.length !== 3) out.push(w + '.colour: { label, options: three }');
    const lines = (list, where, want, fields) => {
      if (!Array.isArray(list)) { out.push(where + ': a list of lines'); return; }
      if (list.map((l) => l && l.key).join() !== want.join()) out.push(where + ': the keys ' + want.join(', ') + ' in the printed order (found ' + list.map((l) => l && l.key).join(', ') + ')');
      list.forEach((l, i) => {
        if (!l || typeof l !== 'object') { out.push(where + '[' + i + ']: an object'); return; }
        unknownFields(l, fields, where + '[' + i + ']', out, 'a line');
        if (typeof l.label !== 'string' || !l.label.trim()) out.push(where + '[' + i + '].label: as printed');
      });
    };
    lines(s.fruit, w + '.fruit', keys.fruit, ['key', 'label', 'note']);
    lines(s.nonFruit, w + '.nonFruit', keys.nonFruit, ['key', 'label']);
    lines(s.structure, w + '.structure', keys.structure, ['key', 'label', 'options']);
    if (Array.isArray(s.structure)) s.structure.forEach((l, i) => { if (!l || !isStringList(l.options) || l.options.length < 2) out.push(w + '.structure[' + i + '].options: the printed options'); });
    if (!s.condition || !isStringList(s.condition.options) || typeof s.condition.nose !== 'string' || typeof s.condition.palate !== 'string') out.push(w + '.condition: { options, nose, palate }');
    if (typeof s.nonFruitNote !== 'string') out.push(w + '.nonFruitNote: a string');
    const k = s.conclusion;
    if (!k || typeof k !== 'object') out.push(w + '.conclusion: { grape, climate, country, age }');
    else {
      unknownFields(k, ['grape', 'climate', 'country', 'age'], w + '.conclusion', out, 'the conclusion');
      if (!k.grape || typeof k.grape.label !== 'string' || typeof k.grape.note !== 'string' || k.grape.choices !== 6 || typeof k.grape.explain !== 'string') out.push(w + '.conclusion.grape: { label, note, choices: 6, explain }');
      if (!k.climate || typeof k.climate.label !== 'string' || !isStringList(k.climate.options) || k.climate.options.length !== 3 || typeof k.climate.explain !== 'string') out.push(w + '.conclusion.climate: { label, options: three, explain }');
      if (!k.country || typeof k.country.label !== 'string') out.push(w + '.conclusion.country: { label }');
      if (!k.age || typeof k.age.label !== 'string' || !isStringList(k.age.options) || k.age.options.length !== 3) out.push(w + '.conclusion.age: { label, options: three }');
    }
    if (typeof s.sell !== 'string') out.push(w + '.sell: as printed');
  });
  if (g.edits !== undefined && !isStringList(g.edits)) out.push('grid.edits: a list of strings');
  checkedProblems(g.checked, 'grid').forEach((p) => out.push(p));
  return out;
}
/* One grid read file against the brief's keys and, when the grid is in the build, its printed options. */
function readsProblems(frag, w, grid, tastingNames) {
  const out = [];
  if (!frag || typeof frag !== 'object' || Array.isArray(frag)) return [w + ': an object'];
  unknownFields(frag, GRID_FILE_FIELDS, w, out, 'a grid read file');
  if (typeof frag.slug !== 'string' || !/^[a-z0-9-]+$/.test(frag.slug)) out.push(w + '.slug: lower case letters, digits and hyphens');
  if (typeof frag.name !== 'string' || !frag.name.trim()) out.push(w + '.name: the grape');
  else if (tastingNames && !tastingNames.has(CF.fold(frag.name))) out.push(w + '.name: "' + frag.name + '" is no grape of the tasting list');
  if (COLOURS.indexOf(frag.colour) < 0) { out.push(w + '.colour: white or red'); return out; }
  if (typeof frag.say !== 'string' || !frag.say.trim()) out.push(w + '.say: the respelling');
  if (frag.aliases !== undefined && (!isStringList(frag.aliases) || frag.aliases.some((a) => a !== CF.fold(a) || !a))) out.push(w + '.aliases: folded strings (lower case, no marks)');
  const keys = GRID_KEYS[frag.colour];
  const sheet = grid && grid[frag.colour];
  const optionsOf = (line) => { const l = sheet && Array.isArray(sheet.structure) ? sheet.structure.find((x) => x && x.key === line) : null; return l && isStringList(l.options) ? l.options : null; };
  const inList = (v, list, where, what) => {
    const vals = Array.isArray(v) ? v : [v];
    if (!vals.length || vals.some((x) => typeof x !== 'string')) { out.push(where + ': ' + what); return; }
    if (list) vals.forEach((x) => { if (list.indexOf(x) < 0) out.push(where + ': "' + x + '" is not a printed option (' + list.join(', ') + ')'); });
  };
  if (!Array.isArray(frag.reads) || !frag.reads.length) { out.push(w + '.reads: a non-empty list'); return out; }
  frag.reads.forEach((r, i) => {
    const rw = w + '.reads[' + i + ']';
    if (!r || typeof r !== 'object') { out.push(rw + ': an object'); return; }
    unknownFields(r, READ_FIELDS, rw, out, 'a read');
    if (typeof r.region !== 'string' || !r.region.trim()) out.push(rw + '.region: the examinable region group as the tasting list prints it');
    if (typeof r.country !== 'string' || !r.country.trim()) out.push(rw + '.country: a string');
    inList(r.climate, sheet && sheet.conclusion && sheet.conclusion.climate ? sheet.conclusion.climate.options : null, rw + '.climate', 'one of the printed climates');
    inList(r.colour, sheet && sheet.colour ? sheet.colour.options : null, rw + '.colour', 'the printed colours that fit');
    if (!r.fruit || typeof r.fruit !== 'object' || Array.isArray(r.fruit)) out.push(rw + '.fruit: an object keyed by the grid\'s fruit lines');
    else {
      Object.keys(r.fruit).forEach((k) => {
        if (keys.fruit.indexOf(k) < 0) out.push(rw + '.fruit.' + k + ': no fruit line of the ' + frag.colour + ' grid (' + keys.fruit.join(', ') + ')');
        else if (!isStringList(r.fruit[k]) || r.fruit[k].some((d) => d !== d.toLowerCase() || !d.trim())) out.push(rw + '.fruit.' + k + ': lower case descriptors ([] for No)');
      });
      keys.fruit.forEach((k) => { if (r.fruit[k] === undefined) out.push(rw + '.fruit.' + k + ': every line answered ([] for No)'); });
    }
    if (!r.condition || typeof r.condition !== 'object') out.push(rw + '.condition: { nose, palate }');
    else {
      unknownFields(r.condition, ['nose', 'palate'], rw + '.condition', out, 'a condition');
      inList(r.condition.nose, sheet && sheet.condition ? sheet.condition.options : null, rw + '.condition.nose', 'one or two printed descriptors');
      inList(r.condition.palate, sheet && sheet.condition ? sheet.condition.options : null, rw + '.condition.palate', 'one or two printed descriptors');
      [r.condition.nose, r.condition.palate].forEach((v, j) => { if (Array.isArray(v) && (v.length < 1 || v.length > 2)) out.push(rw + '.condition.' + (j ? 'palate' : 'nose') + ': one or two descriptors'); });
    }
    if (!isStringList(r.nonFruit)) out.push(rw + '.nonFruit: the lines to mark Yes');
    else r.nonFruit.forEach((k, j) => { if (keys.nonFruit.indexOf(k) < 0) out.push(rw + '.nonFruit[' + j + ']: ' + k + ' is no non-fruit line of the ' + frag.colour + ' grid (' + keys.nonFruit.join(', ') + ')'); });
    if (!r.structure || typeof r.structure !== 'object' || Array.isArray(r.structure)) out.push(rw + '.structure: an object keyed by the grid\'s structure lines');
    else {
      Object.keys(r.structure).forEach((k) => {
        if (keys.structure.indexOf(k) < 0) out.push(rw + '.structure.' + k + ': no structure line of the ' + frag.colour + ' grid (' + keys.structure.join(', ') + ')');
        else inList(r.structure[k], optionsOf(k), rw + '.structure.' + k, 'a printed option or a list of them');
      });
      keys.structure.forEach((k) => { if (r.structure[k] === undefined) out.push(rw + '.structure.' + k + ': every line answered'); });
    }
    inList(r.age, sheet && sheet.conclusion && sheet.conclusion.age ? sheet.conclusion.age.options : null, rw + '.age', 'the printed age ranges that fit');
    if (typeof r.sell !== 'string' || !r.sell.trim()) out.push(rw + '.sell: two sentences a server could say');
    else if (sentences(r.sell) > MAX_SELL_SENTENCES) out.push(rw + '.sell: at most ' + MAX_SELL_SENTENCES + ' sentences (' + sentences(r.sell) + ')');
    if (!r.why || typeof r.why !== 'object' || typeof r.why.grape !== 'string' || typeof r.why.climate !== 'string') out.push(rw + '.why: { grape, climate } lines');
    else unknownFields(r.why, ['grape', 'climate'], rw + '.why', out, 'why');
  });
  return out;
}

const HEADER_CMS = (from) => '/* The CMS edition: built by .scripts/cms/build-cms.cjs from ' + from + ', never edited by hand.\n'
  + '   CMS.subjects holds the subjects of the Court of Master Sommeliers, Americas Introductory and Certified theory curriculum\n'
  + '   guide in the guide\'s order, each with its quoted learning outcomes and rows, its doors into the Codex (map) and its\n'
  + '   questions (ids e- and eight base36 digits, minted from the subject and the stem); CMS.groups the subject groups as the\n'
  + '   app prints them; CMS.syllabus the Certified exam syllabus, CMS.tasting the tasting exam\'s grapes and regions and CMS.grid\n'
  + '   the deductive tasting grid, each quoted from the Court\'s document. The Court\'s words keep their spelling; every string of\n'
  + '   our own is British, dash free and names nobody living.';
const HEADER_GRID = (from) => '/* The grid reads: built by .scripts/cms/build-cms.cjs from ' + from + ', never edited by hand.\n'
  + '   GRID_READS holds, per Certified grape slug, what the deductive tasting grid reads for each examinable region (the keys\n'
  + '   are the grid\'s lines, the options the Court\'s printed ones); GRID_SAY the respelling of each grape; GRID_ALIASES the\n'
  + '   folded names that resolve to a slug. Every string is our own: British, dash free, nobody named.';
/* The seed line names what built it: fixtures (a subject marked fixture) or the fragments themselves with --partial,
   never "fixtures" for a partial build of the real fragments (30 October, the verifier). */
function seedLine(stats) { return '\n   A SEED built from ' + (stats.fixtures ? 'fixtures' : 'the fragments') + (stats.partial ? ' with --partial' : '') + ': ' + stats.subjects + ' of ' + SUBJECTS.length + ' subjects, ' + stats.reads + ' grid read file(s); ' + (stats.fixtures ? 'the real build from .scripts/cms replaces it.' : 'the full build replaces it.'); }
function headerFor(kind, from, seed, stats) { return (kind === 'grid' ? HEADER_GRID(from) : HEADER_CMS(from)) + (seed ? seedLine(stats) : '') + ' */\n'; }
/* The fragments folder a built file names in its first line (the gate hands it back to --check). */
function fragmentsOf(text) { const m = String(text).split('\n')[0].match(/ from (\S+), never edited by hand\.$/); return m ? m[1] : null; }
function json(v) { return JSON.stringify(BR.sortKeys(v), null, 1).split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029'); }

function parseArgs(argv) {
  const o = { check: false, partial: false, fragments: null, out: null, jsDir: null, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--check') o.check = true;
    else if (a === '--partial') o.partial = true;
    else if (a === '--fragments') o.fragments = argv[++i];
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--help' || a === '-h') o.help = true;
    else if (a.charAt(0) === '-') throw new Error('unknown option ' + a);
    else o.jsDir = a;
  }
  return o;
}

/* Reads the fragments and builds the two files in memory. Returns { problems, notes, missing, cms, grid, writeBack, stats }. */
function build(opts) {
  const dir = opts.fragments;
  const problems = [];
  const notes = [];
  const missing = [];
  const names = loadNames(opts.jsDir);
  const sets = nameSets(names);
  const sub = (f) => path.join(dir, f);
  const exists = (f) => fs.existsSync(sub(f));
  if (!fs.existsSync(dir)) problems.push('no fragments folder at ' + dir);

  /* the three documents */
  const docs = {};
  ['syllabus', 'tasting', 'grid'].forEach((k) => {
    if (!exists(k + '.json')) { missing.push(k + '.json'); docs[k] = null; return; }
    const v = readJson(sub(k + '.json'), problems);
    if (v === undefined) { docs[k] = null; return; }
    const ps = k === 'syllabus' ? syllabusProblems(v) : k === 'tasting' ? tastingProblems(v) : gridProblems(v);
    voiceWalk(v, k).forEach((p) => ps.push(p));
    ps.forEach((p) => problems.push(k + '.json: ' + p));
    docs[k] = ps.length ? null : shipDoc(v);
  });
  const tastingNames = docs.tasting ? new Set([].concat(docs.tasting.whites, docs.tasting.reds).map((g) => CF.fold(g.name))) : null;

  /* the subjects, in the guide's order */
  const subjectsDir = sub('subjects');
  const files = fs.existsSync(subjectsDir) ? fs.readdirSync(subjectsDir).filter((f) => /\.json$/.test(f)).sort() : [];
  if (!fs.existsSync(subjectsDir)) missing.push('subjects/');
  const byId = {};
  const fileOf = {};
  files.forEach((f) => {
    const frag = readJson(path.join(subjectsDir, f), problems);
    if (frag === undefined) return;
    const w = 'subjects/' + f;
    const ps = subjectProblems(frag, 'subject');
    if (frag && typeof frag === 'object' && frag.id !== undefined && f !== frag.id + '.json') ps.push('subject.id: the file is ' + f + ', the id ' + JSON.stringify(frag.id));
    if (frag && typeof frag === 'object' && byId[frag.id]) ps.push('subject.id: ' + frag.id + ' is written twice, here and in ' + fileOf[frag.id]);
    voiceWalk(frag, 'subject').forEach((p) => ps.push(p));
    ps.forEach((p) => problems.push(w + ': ' + p));
    if (ps.length || !frag || !frag.id) return;
    byId[frag.id] = frag; fileOf[frag.id] = f;
  });
  SUBJECTS.forEach((s) => { if (!byId[s.id]) missing.push('subjects/' + s.id + '.json (' + s.name + ')'); });
  if (missing.length && !opts.partial) problems.push('the build is incomplete: ' + missing.length + ' missing (listed above); pass --partial to build what exists');

  /* the maps and the questions, per subject present */
  const subjects = [];
  const writeBack = [];
  const stems = {};
  const ids = {};
  let nRows = 0, nQuestions = 0, minted = 0, kept = 0, mapsPresent = 0;
  SUBJECTS.filter((s) => byId[s.id]).forEach((s) => {
    const frag = byId[s.id];
    nRows += frag.rows.length;
    const rec = { id: frag.id, name: frag.name, court: frag.court, group: frag.group, order: frag.order, pages: frag.pages.slice(), certifiedOnly: frag.certifiedOnly, outcome: { intro: frag.outcome.intro, certified: frag.outcome.certified }, rows: frag.rows.map((r) => { const o = { topic: r.topic, intro: r.intro, certified: r.certified }; if (r.red === 1) o.red = 1; return o; }) };
    /* the map */
    const mf = 'map/' + s.id + '.json';
    if (!exists(mf)) { notes.push(mf + ' absent: an empty map'); rec.map = shipMap(EMPTY_MAP); }
    else {
      const map = readJson(sub(mf), problems);
      if (map !== undefined) {
        const ps = (!map || typeof map !== 'object' || Array.isArray(map)) ? ['map: an object'] : mapProblems(map, 'map', sets);
        if (map && typeof map === 'object' && map.id !== s.id) ps.push('map.id: ' + JSON.stringify(map.id) + ', not ' + s.id);
        voiceWalk(map, 'map').forEach((p) => ps.push(p));
        ps.forEach((p) => problems.push(mf + ': ' + p));
        if (!ps.length) { rec.map = shipMap(map); mapsPresent++; }
      }
    }
    /* the questions */
    const qf = 'questions/' + s.id + '.json';
    rec.questions = [];
    if (exists(qf)) {
      const bank = readJson(sub(qf), problems);
      if (bank !== undefined) {
        const ps = [];
        if (!bank || typeof bank !== 'object' || Array.isArray(bank)) ps.push('questions: { subject, questions }');
        else {
          unknownFields(bank, ['subject', 'questions'], 'questions', ps, 'a bank');
          if (bank.subject !== s.id) ps.push('questions.subject: ' + JSON.stringify(bank.subject) + ', not ' + s.id);
          if (!Array.isArray(bank.questions)) ps.push('questions.questions: a list');
          else {
            const qctx = { grapes: names.grapes, topics: frag.rows.map((r) => r.topic) };
            let changed = false;
            bank.questions.forEach((q, i) => {
              const w = 'questions[' + i + ']';
              questionProblems(q, w, qctx).forEach((p) => ps.push(p));
              if (!q || typeof q !== 'object' || typeof q.q !== 'string') return;
              const key = CF.fold(q.q);
              if (stems[key]) ps.push(w + ': the stem is already in the bank (' + stems[key] + ')');
              else stems[key] = qf + ' ' + w;
              const want = mintId(s.id, q.q);
              if (q.id === undefined) { q.id = want; minted++; changed = true; }
              else if (q.id !== want) { ps.push(w + '.id: ' + q.id + ' does not recompute from the stem (the mint gives ' + want + '): a reworded stem is a new question, drop the id'); return; }
              else kept++;
              if (ids[q.id]) ps.push(w + '.id: duplicate id ' + q.id + ' (also ' + ids[q.id] + ')');
              ids[q.id] = qf + ' ' + w;
            });
            voiceWalk(bank, 'questions').forEach((p) => ps.push(p));
            if (!ps.length) {
              rec.questions = bank.questions.map(shipQuestion);
              nQuestions += rec.questions.length;
              if (changed) writeBack.push({ file: sub(qf), rel: qf, frag: { subject: bank.subject, questions: bank.questions.map((q) => { const o = { id: q.id }; Object.keys(q).forEach((k) => { if (k !== 'id') o[k] = q[k]; }); return o; }) } });
            }
          }
        }
        ps.forEach((p) => problems.push(qf + ': ' + p));
      }
    }
    subjects.push(rec);
  });
  /* a map or a bank for a subject that is not in the build */
  ['map', 'questions'].forEach((k) => {
    const d = sub(k);
    if (!fs.existsSync(d)) return;
    fs.readdirSync(d).filter((f) => /\.json$/.test(f)).forEach((f) => {
      const id = f.replace(/\.json$/, '');
      if (!SUBJECT_BY_ID[id]) problems.push(k + '/' + f + ': ' + id + ' is no subject of the brief');
      else if (!byId[id]) notes.push(k + '/' + f + ': its subject is not in the build (subjects/' + f + ' ' + (missing.indexOf('subjects/' + f + ' (' + SUBJECT_BY_ID[id].name + ')') >= 0 ? 'missing' : 'refused') + ')');
    });
  });

  /* the grid reads */
  const reads = {};
  const say = {};
  const aliases = {};
  const gdir = sub('grid');
  const gfiles = fs.existsSync(gdir) ? fs.readdirSync(gdir).filter((f) => /\.json$/.test(f)).sort() : [];
  const readOf = {}; /* one read file per grape: the folded name to the file that holds it */
  if (!docs.grid) notes.push('grid.json ' + (exists('grid.json') ? 'refused' : 'absent') + ': the grid reads are held to the brief\'s keys only, not the printed options');
  gfiles.forEach((f) => {
    const frag = readJson(path.join(gdir, f), problems);
    if (frag === undefined) return;
    const w = 'grid/' + f;
    const ps = readsProblems(frag, 'read', docs.grid, tastingNames);
    if (frag && typeof frag === 'object' && frag.slug !== undefined && f !== frag.slug + '.json') ps.push('read.slug: the file is ' + f + ', the slug ' + JSON.stringify(frag.slug));
    if (frag && typeof frag === 'object' && typeof frag.name === 'string' && frag.name.trim()) {
      const k = CF.fold(frag.name);
      if (readOf[k]) ps.push('read.name: "' + frag.name + '" is read already in grid/' + readOf[k] + ' (one read file per grape)');
      else readOf[k] = f;
    }
    voiceWalk(frag, 'read').forEach((p) => ps.push(p));
    ps.forEach((p) => problems.push(w + ': ' + p));
    if (ps.length) return;
    reads[frag.slug] = { slug: frag.slug, name: frag.name, colour: frag.colour, reads: frag.reads };
    say[frag.slug] = frag.say;
    (frag.aliases || []).forEach((a) => {
      if (aliases[a] && aliases[a] !== frag.slug) problems.push(w + ': the alias "' + a + '" is already ' + aliases[a] + '\'s');
      aliases[a] = frag.slug;
    });
  });
  if (docs.tasting) {
    const have = new Set(Object.keys(reads).map((k) => CF.fold(reads[k].name)));
    const lacking = [].concat(docs.tasting.whites, docs.tasting.reds).map((g) => g.name).filter((n) => !have.has(CF.fold(n)));
    if (lacking.length) notes.push('no grid read file yet for ' + lacking.length + ' tasting grape(s): ' + lacking.join(', '));
  }

  /* the deal, on the shipped copies only: the fragments keep their authored order and key */
  dealOptions(subjects);
  const fixtures = subjects.some((s) => byId[s.id].fixture === true);
  const seed = opts.partial || fixtures;
  const stats = { subjects: subjects.length, rows: nRows, questions: nQuestions, minted, kept, maps: mapsPresent, reads: gfiles.length, partial: opts.partial, seed, fixtures };
  const from = rel(dir);
  const cms = headerFor('cms', from, seed, stats) + 'var CMS = ' + json({ groups: GROUPS, subjects, syllabus: docs.syllabus, tasting: docs.tasting, grid: docs.grid, version: 1 }) + ';\n';
  const grid = headerFor('grid', from, seed, stats) + 'var GRID_READS = ' + json(reads) + ';\nvar GRID_SAY = ' + json(say) + ';\nvar GRID_ALIASES = ' + json(aliases) + ';\n';
  stats.bytes = Buffer.byteLength(cms, 'utf8');
  stats.gridBytes = Buffer.byteLength(grid, 'utf8');
  return { problems, notes, missing, cms, grid, writeBack, stats };
}

module.exports = { build, loadNames, nameSets, mintId, ID_RE, SUBJECTS, SUBJECT_BY_ID, GROUPS, GRID_KEYS, COLOURS, EMPTY_MAP, RED_SUBJECT, NAMES_ONLY_SUBJECT, DOC_PROVENANCE, TASTING_COUNTS, SYLLABUS_SECTIONS, quotedPath, dashProblems, voiceWalk, americanProblems, sentences, headerFor, fragmentsOf, questionProblems, dealOptions, mapProblems, readsProblems, tastingProblems, gridProblems, syllabusProblems, MIN_ROWS, MIN_EXP_WORDS, MAX_SELL_SENTENCES, rel, ROOT };

if (require.main === module) {
  let opts;
  try { opts = parseArgs(process.argv.slice(2)); } catch (e) { console.error('build-cms: ' + e.message); process.exit(2); }
  if (opts.help) {
    console.log('usage: node .scripts/cms/build-cms.cjs [--check] [--partial] [--fragments <dir>] [--out <jsDir>] [jsDir]');
    console.log('  --check      build in memory and compare with js/data-cms.js and js/data-grid.js on disk, writing nothing');
    console.log('  --partial    build the subjects that exist and print what is missing (a seed)');
    console.log('  --fragments  the folder of fragments (default .scripts/cms): subjects/, map/, questions/, grid/, syllabus.json, tasting.json, grid.json');
    console.log('  --out        the folder the two files are written to (default jsDir)');
    console.log('  jsDir        the Codex\'s js/ folder, read for the names a map may use (default this repo\'s js/)');
    process.exit(0);
  }
  opts.jsDir = path.resolve(opts.jsDir || path.join(ROOT, 'js'));
  opts.fragments = path.resolve(opts.fragments || __dirname);
  opts.out = path.resolve(opts.out || opts.jsDir);
  let r;
  try { r = build(opts); } catch (e) { console.error('build-cms: ' + e.message); process.exit(1); }
  r.notes.forEach((n) => console.log('note: ' + n));
  if (r.missing.length) {
    console.log((opts.partial ? 'missing (partial build): ' : 'missing: ') + r.missing.length);
    r.missing.forEach((m) => console.log('  ' + m));
  }
  if (r.problems.length) {
    r.problems.forEach((p) => console.log('build-cms: ' + p));
    console.log('\nbuild-cms: ' + r.problems.length + ' problem(s), nothing written');
    process.exit(1);
  }
  const s = r.stats;
  const summary = s.subjects + ' of ' + SUBJECTS.length + ' subjects, ' + s.rows + ' rows, ' + s.maps + ' maps, ' + s.questions + ' questions (' + s.minted + ' minted, ' + s.kept + ' kept), ' + s.reads + ' grid read file(s), data-cms.js ' + s.bytes + ' bytes, data-grid.js ' + s.gridBytes + ' bytes' + (s.seed ? ', a SEED' : '');
  const cmsFile = path.join(opts.out, 'data-cms.js');
  const gridFile = path.join(opts.out, 'data-grid.js');
  if (opts.check) {
    const diffs = [];
    [[cmsFile, r.cms], [gridFile, r.grid]].forEach((pair) => {
      if (!fs.existsSync(pair[0])) { diffs.push(pair[0] + ' is missing'); return; }
      const have = fs.readFileSync(pair[0], 'utf8');
      if (have === pair[1]) return;
      const built = fragmentsOf(have);
      if (built !== null && built !== fragmentsOf(pair[1])) diffs.push(pair[0] + ' is stale: built from ' + built + ', not ' + rel(opts.fragments));
      else diffs.push(pair[0] + ' differs');
    });
    r.writeBack.forEach((wb) => diffs.push(wb.rel + ' still lacks the id(s) the build writes back'));
    if (diffs.length) { diffs.forEach((d) => console.log('build-cms --check: ' + d)); console.log('build-cms --check: the files are not the build of the fragments; run the build'); process.exit(1); }
    console.log('build-cms --check: ' + cmsFile + ' and ' + gridFile + ' are the build of the fragments (' + summary + ')');
    process.exit(0);
  }
  if (!fs.existsSync(opts.out)) fs.mkdirSync(opts.out, { recursive: true });
  fs.writeFileSync(cmsFile, r.cms);
  fs.writeFileSync(gridFile, r.grid);
  r.writeBack.forEach((wb) => { fs.writeFileSync(wb.file, JSON.stringify(wb.frag, null, 2) + '\n'); console.log('build-cms: wrote the minted id(s) back into ' + wb.rel); });
  console.log('build-cms: wrote ' + cmsFile + ' and ' + gridFile + ' (' + summary + ')');
  process.exit(0);
}
